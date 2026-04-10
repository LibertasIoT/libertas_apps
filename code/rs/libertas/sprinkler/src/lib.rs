#![forbid(unsafe_code)]

extern crate alloc;
use alloc::vec::Vec;
use alloc::rc::Rc;
use core::cell::RefCell;
use libertas::*;
use libertas_notification::*;
//use libertas_matter::*;
use libertas_macros::*;

#[derive(Clone, LibertasAvroDecode, LibertasAvroEncode)]
pub struct TimeSlot {
    pub start_time: LibertasDateTime,
    pub duration: LibertasTimeOnly,
}

#[derive(Clone, LibertasAvroDecode, LibertasAvroEncode)]
pub struct SprinklerZoneInfo {
    pub next_schedule: TimeSlot,
    pub hold_off_periods: Vec<TimeSlot>,
}

#[derive(Clone, LibertasAvroDecode, LibertasAvroEncode)]
pub struct UpdateHoldOffRequest {
    pub hold_off_periods: Vec<TimeSlot>,
}

#[derive(Clone, LibertasAvroDecode, LibertasAvroEncode)]
pub enum ZoneDataProtocol {
    GetZoneInfo,
    ZoneInfo(SprinklerZoneInfo),
    UpdateHoldOff(UpdateHoldOffRequest),
}

#[repr(u8)]
#[derive(Clone, LibertasAvroDecode)]
pub enum SoilType { Loam, Clay, ClayLoam, 
    SiltyClay, SandyLoam, LoamySand, Sand }


#[repr(u8)]
#[derive(Clone, LibertasAvroDecode)]
pub enum PlantType {Lawn, FruitTrees, Flowers,
    Vegetables, Citrus, TreesBushes, Xeriscape }


#[repr(u8)]
#[derive(Clone, LibertasAvroDecode)]
pub enum SprinklerHead {SurfaceDrip, Bubblers,
    PopupSpray, RotorsLowRate, RotorsHighRate }

#[derive(Clone, LibertasExport, LibertasAvroDecode)]
pub struct SprinklerZone {
    pub zone_valve: LibertasDevice,
    pub field_capacity: u8,
    pub soil_type: SoilType,
    pub plant_type: PlantType,
    pub head: SprinklerHead,
    #[agent_tool_schema(ZoneDataProtocol)]
    #[agent_tool_server]
    pub zone_info: LibertasAgentTool,
}

struct ZoneData {
    zone: SprinklerZone,
    next_schedule: TimeSlot,
    hold_off_periods: Vec<TimeSlot>,
    notification_list: Vec<LibertasUser>
}

fn send_data(zone_data: &ZoneData, trans_id: Option<LibertasTransId>, peer: u32) {
    let info = ZoneDataProtocol::ZoneInfo(SprinklerZoneInfo {
        next_schedule: zone_data.next_schedule.clone(),
        hold_off_periods: zone_data.hold_off_periods.clone(),
    });
    if let Some(trans_id) = trans_id {
        libertas_agent_tool_response(zone_data.zone.zone_info, &info, trans_id, peer);
    } else {
        libertas_agent_tool_report(zone_data.zone.zone_info, &info, Some(peer));
    }
}

pub fn libertas_sprinkler (
    notification_list: Vec<LibertasUser>,
    zones: Vec<SprinklerZone>) {
    let mut cur_start_time: u64 = libertas_get_utc_time().unwrap() / 1000000;     // us to seconds
    cur_start_time /= 60;           // round down to the nearest minute so that it's easier to read out
    cur_start_time *= 60;
    cur_start_time += 24 * 3600;    // start from next day
    let cur_duration = 1000;   // seconds
    for zone in zones {
        let tag = Rc::new(
            RefCell::new(
                ZoneData{
                    zone: zone.clone(),
                    next_schedule: TimeSlot {
                        start_time: cur_start_time,     // us to seconds
                        duration: cur_duration,
                    },
                    hold_off_periods: Vec::new(),
                    notification_list: notification_list.clone(),
                }
            ));
        cur_start_time = cur_start_time + cur_duration as u64;
        libertas_register_agent_tool_listener(zone.zone_info, |device, opcode, protocol: Option<ZoneDataProtocol>, context, trans_id, peer| {
            let mut data = context.downcast_mut::<Rc<RefCell<ZoneData>>>().unwrap().borrow_mut();
            if let Some(protocol) = protocol {
                if let Some(trans_id) = trans_id {
                    match protocol {
                        ZoneDataProtocol::GetZoneInfo => {
                            if opcode == OP_AGENT_TOOL_REQ {
                                send_data(&*data, Some(trans_id), peer);
                            } else if opcode == OP_AGENT_TOOL_SUB_REQ {
                                let rsp = ZoneDataProtocol::GetZoneInfo;
                                libertas_agent_tool_response(device, &rsp, trans_id, peer);
                                send_data(&*data, None, peer);
                            }
                        },
                        ZoneDataProtocol::UpdateHoldOff(req) => {
                            data.hold_off_periods = req.hold_off_periods;
                            // sort hold off periods by start time
                            data.hold_off_periods.sort_by_key(|h| h.start_time);
                            // If there is an overlay between the next schedule and any hold off period, we shift 
                            // the next schedule to after the hold off period.
                            // 2. Logic to shift the next schedule if it overlaps with any hold-off period
                            // We loop because shifting past one hold-off might put us into the middle of the next one
                            let mut changed = true;
                            while changed {
                                changed = false;
                                let schedule_start = data.next_schedule.start_time;
                                let schedule_end = schedule_start + data.next_schedule.duration as u64;

                                for hold_off in &data.hold_off_periods {
                                    let hold_off_start = hold_off.start_time;
                                    let hold_off_end = hold_off_start + hold_off.duration as u64;

                                    // Check for overlap: (StartA < EndB) and (EndA > StartB)
                                    if schedule_start < hold_off_end && schedule_end > hold_off_start {
                                        // Shift schedule to immediately after this hold-off period
                                        data.next_schedule.start_time = hold_off_end;
                                        changed = true;
                                        // Once we shift, we must re-check against all periods 
                                        // (especially subsequent ones)
                                        break; 
                                    }
                                }
                            }

                            let arguments: [NotificationArgument; 1] = [
                                NotificationArgument::Object(data.zone.zone_valve),
                            ];
                            libertas_send_notification(
                                &data.notification_list, 
                                NotificationImportance::AlertLow,
                                Some(data.zone.zone_valve), 
                                "HoldOffUpdated", 
                                &arguments);
                            let d = &*data;
                            send_data(d, Some(trans_id), peer);
                            send_data(d, None, LIBERTAS_BROADCAST_DEST);
                        },
                        _ => {},
                    }
                }
            }
        }, Box::new(Rc::clone(&tag)));
    }
}

