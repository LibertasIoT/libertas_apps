declare type ValveState = [allValves: ValveState[], valve: LibertasDevice, onOff: boolean, timer?: LibertasTimer, expire?:number]
const DefaultTimeoutMilli = 10 * 60 * 1000

function TurnOffValve(state: ValveState) {
    if (state[2]) {
        state[2] = false;
        const timer = state[3]
        if (timer != undefined) {
            Libertas_TimerCancel(timer)
            state[3] = undefined
        }
        Libertas_VirtualDeviceAttributesChanged(state[1], [
            [Matter.Clusters.OnOff, [Matter.Attributes.OnOff.OnOff, Matter.Attributes.OnOff.OnTime]]
        ])
    }
}

function TurnOnValve(state: ValveState, onTime: number) {
    for (const curValve of state[0]) {
        if (curValve[1] != state[1]) {
            TurnOffValve(curValve)
        }
    }
    state[2] = true
    const curTimer = state[3]
    const expire = os.msticks() + onTime
    if (curTimer == undefined) {
        state[3] = Libertas_TimerNew(onTime, (timer, tag)=>{
            const state = tag as ValveState
            TurnOffValve(state)
        }, state)
    } else {
        Libertas_TimerUpdate(curTimer, onTime)
    }
    state[4] = expire
    Libertas_VirtualDeviceAttributesChanged(state[1], [
        [Matter.Clusters.OnOff, [Matter.Attributes.OnOff.OnOff, Matter.Attributes.OnOff.OnTime]]
    ])
}

function VirtualIrrigationController(valves: LibertasVirtualDevice[]) {
    const allValues: ValveState[] = []
    for (const valve of valves) {
        const curState : ValveState = [allValues, valve, false]
        allValues.push(curState)
        Libertas_SetOnVirtualDevice(valve, (device, ref, action, data, tag)=>{
            const state = tag as ValveState
            if (action == LibertasDeviceAction.ReadRequest || action == LibertasDeviceAction.SubscribeRequest) {
                const rpt: LibertasClusterReport[] = []
                for (const clusterReq of data as LibertasClusterReadReq[]) {
                    const rptAttributes: LibertasAttributes = {}
                    const rptStatus: LibertasIdStatus = {}
                    const [cluster, attributes] = clusterReq;
                    for (const attr of attributes) {
                        if (attr == Matter.Attributes.OnOff.OnOff) {
                            rptAttributes[attr] = state[2]
                        } else if (attr == Matter.Attributes.OnOff.OnTime) {
                            const curTimer = state[3]
                            if (curTimer == undefined) {
                                rptAttributes[attr] = 0
                            } else {
                                const expire = state[4]!
                                const milliLeft = expire - os.msticks()
                                rptAttributes[attr] = (milliLeft <= 0) ? 0 : Math.round(milliLeft / 100)
                            }
                        } else {
                            rptStatus[attr] = Matter.Status.UnsupportedAttribute
                        }
                    }
                    rpt.push([cluster, rptAttributes, rptStatus])
                }
                Libertas_VirtualDeviceAttributesRsp(device, ref, rpt)
            } else if (action == LibertasDeviceAction.InvokeCommandRequest) {
                const [cluster, id, cmdBody] = data as LibertasCommand
                const curTimer = curState[2]
                if (id == Matter.Commands.OnOff.On) {
                    TurnOnValve(state, DefaultTimeoutMilli)
                } else if (id == Matter.Commands.OnOff.Off) {
                    TurnOffValve(state)
                } else if (id == Matter.Commands.OnOff.OnWithTimedOff) {
                    const onTime = cmdBody![Matter.Fields.OnOff.OnWithTimedOff.OnTime] as number
                    TurnOnValve(state, onTime * 100)
                }
            } else {
                Libertas_VirtualDeviceStatusRsp(device, ref, Matter.Status.InvalidAction)
            }
        }, curState);
        Libertas_VirtualDeviceAttributesChanged(valve, [
            [Matter.Clusters.OnOff, [Matter.Attributes.OnOff.OnOff, Matter.Attributes.OnOff.OnTime]]
        ])
    }
    Libertas_WaitReactive();
}

export {VirtualIrrigationController}