// Copyright Qingjun Wei 2019-2025
// Released under GNU General Public License, version 2
// https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html
const TIMEOUT_ACK = 2000;           // 2s
const TIMEOUT_HEARTBEAT = 20000;    // 20s Ensure the TCP session to denon is alive
const TIMEOUT_RECONN_WAIT = 10000;  // 10s Wait period to retry connection
const TIMEOUT_CONNECTION = 2;       // TCP connection time to denon port 23

// These strings are part of Denon TCP based protocol. Do not modify!
// Input selection strings
const ENUM_SI = [
	'UNKNOWN',
	'PHONO',
	'CD',
	'TUNER',
	'DVD',
	'BD',
	'TV',
	'SAT/CBL',
	'MPLAY',
	'GAME',
	'HDRADIO',
	'NET',
	'PANDORA',
	'SIRIUSXM',
	'IRADIO',
	'SERVER',
	'FAVORITES',
	'AUX1',
	'AUX2',
	'AUX3',
	'AUX4',
	'AUX5',
	'AUX6',
	'AUX7',
	'BT',
	'USB/IPOD',
	'USB',
	'IPD',
	'IRP',
	'FVP'
];

// These strings are part of Denon TCP based protocol. Do not modify!
// mode Eco
const ENUM_ON_AUTO_OFF = [
	'ON',
	'AUTO',
	'OFF'
];

// These strings are part of Denon TCP based protocol. Do not modify!
// Mode strings
const ENUM_MS = [
	'UNKNOWN',
	'MOVIE',
	'MUSIC',
	'GAME',
	'DIRECT',
	'PURE DIRECT',
	'STEREO',
	'AUTO',
	'DOLBY PRO LOGIC',
	'DOLBY PL2 C',
	'DOLBY PL2 M',
	'DOLBY PL2 G',
	'DOLBY PL2X C',
	'DOLBY PL2X M',
	'DOLBY PL2X G',
	'DOLBY PL2Z H',
	'DOLBY SURROUND',
	'DOLBY ATMOS',
	'DOLBY DIGITAL',
	'DOLBY D EX',
	'DOLBY D+PL2X C',
	'DOLBY D+PL2X M',
	'DOLBY D+PL2Z H',
	'DOLBY D+DS',
	'DOLBY D+NEO:X C',
	'DOLBY D+NEO:X M',
	'DOLBY D+NEO:X G',
	'DOLBY D+NEURAL:X',
	'DTS SURROUND',
	'DTS ES DSCRT6.1',
	'DTS ES MTRX6.1',
	'DTS+PL2X C',
	'DTS+PL2X M',
	'DTS+PL2Z H',
	'DTS+DS',
	'DTS96/24',
	'DTS96 ES MTRX',
	'DTS+NEO:6',
	'DTS+NEO:X C',
	'DTS+NEO:X M',
	'DTS+NEO:X G',
	'DTS+NEURAL:X',
	'DTS ES MTRX+NEURAL:X',
	'DTS ES DSCRT+NEURAL:X',
	'MULTI CH IN',
	'M CH IN+DOLBY EX',
	'M CH IN+PL2X C',
	'M CH IN+PL2X M',
	'M CH IN+PL2Z H',
	'M CH IN+DS',
	'MULTI CH IN 7.1',
	'M CH IN+NEO:X C',
	'M CH IN+NEO:X M',
	'M CH IN+NEO:X G',
	'M CH IN+NEURAL:X',
	'DOLBY D+',
	'DOLBY D+ +EX',
	'DOLBY D+ +PL2X C',
	'DOLBY D+ +PL2X M',
	'DOLBY D+ +PL2Z H',
	'DOLBY D+ +DS',
	'DOLBY D+ +NEO:X C',
	'DOLBY D+ +NEO:X M',
	'DOLBY D+ +NEO:X G',
	'DOLBY D+ +NEURAL:X',
	'DOLBY HD',
	'DOLBY HD+EX',
	'DOLBY HD+PL2X C',
	'DOLBY HD+PL2X M',
	'DOLBY HD+PL2Z H',
	'DOLBY HD+DS',
	'DOLBY HD+NEO:X C',
	'DOLBY HD+NEO:X M',
	'DOLBY HD+NEO:X G',
	'DOLBY HD+NEURAL:X',
	'DTS HD',
	'DTS HD MSTR',
	'DTS HD+PL2X C',
	'DTS HD+PL2X M',
	'DTS HD+PL2Z H',
	'DTS HD+DS',
	'DTS HD+NEO:6',
	'DTS HD+NEO:X C',
	'DTS HD+NEO:X M',
	'DTS HD+NEO:X G',
	'DTS HD+NEURAL:X',
	'DTS:X',
	'DTS:X MSTR',
	'DTS EXPRESS',
	'DTS ES 8CH DSCRT',
	'MPEG2 AAC',
	'AAC+DOLBY EX',
	'AAC+PL2X C',
	'AAC+PL2X M',
	'AAC+PL2Z H',
	'AAC+DS',
	'AAC+NEO:X C',
	'AAC+NEO:X M',
	'AAC+NEO:X G',
	'AAC+NEURAL:X',
	'PL DSX',
	'PL2 C DSX',
	'PL2 M DSX',
	'PL2 G DSX',
	'PL2X C DSX',
	'PL2X M DSX',
	'PL2X G DSX',
	'AUDYSSEY DSX',
	'DTS NEO:6 C',
	'DTS NEO:6 M',
	'DTS NEO:X C',
	'DTS NEO:X M',
	'DTS NEO:X G',
	'NEURAL:X',
	'NEO:6 C DSX',
	'NEO:6 M DSX',
	'AURO3D',
	'AURO2DSURR',
	'MCH STEREO',
	'WIDE SCREEN',
	'SUPER STADIUM',
	'ROCK ARENA',
	'JAZZ CLUB',
	'CLASSIC CONCERT',
	'MONO MOVIE',
	'MATRIX',
	'VIDEO GAME',
	'VIRTUAL',
	'STEREO',
	'ALL ZONE STEREO',
	'7.1IN'
];

declare class AVRZone {
    onOff: LibertasVirtualDevice;
    input?: LibertasVirtualDevice;
    volume?: LibertasVirtualDevice;
    mute?: LibertasVirtualDevice;
    mode?: LibertasVirtualDevice;
}

declare class AVRMainZone extends AVRZone {
    eco?: LibertasVirtualDevice;
}

const enum ReportAction {
    NA,     // No report
    UPDATE, // Send report on a new state
    FORCE,  // Always send a report
}

// A pending message to denon AVR
interface PendingMessage {
    d: LibertasVirtualDevice;   // Associated virtual device
    c: string;                  // Denon Command string
    n: number;                  // Denon Command Prefix length
    a: ReportAction;            // Is Matter report generated?
    r?: number;                 // Matter command ref
    t: number;                  // millisecond ticks
}

function getEnumIndex(value: string, e: string[], start?: number, def?: number): number|undefined {
    start = start || 0;
    for (let i=start; i<e.length; i++) {
        if (e[i] === value) {
            return i;
        }
    }
    return def;
}

function getBoolean(value: string): boolean | undefined {
    if (value === "ON") {
        return true;
    } else if (value === "OFF") {
        return false;
    }
}

/** Denon driver main entry function */
function DenonAVR(
    avr: LibertasLanDevice, 
    mainZone: AVRMainZone, 
    extraZones: AVRZone[] /** Max 2 extra zones */): void {
    const unsupportedCmds = new Set<string>();  // Not all models of Denon receiver supports all commands. We detect unsupported command on the fly
    const suspectedUnsupportedCmd = new Map<string, number>();

    const socket = Libertas_NetNewTcp();
    // A zone cannot be controlled if it is powered off.
    const curIncoming = new lbuffer();  // TODO: Replace with emulated Node Buffer
    let pendingMessages = new LibertasList<PendingMessage>();
    let pendingAck: PendingMessage | undefined;
    let ready = false;
    let validSession = false;   // Session is valid when the first ACK(ZM?) is received

    // It turns out that each device has only one cluster!
    const deviceClusters: {[device: LibertasVirtualDevice]: number} = {}
    const deviceAttributes: {[device: LibertasVirtualDevice]: LibertasAttributes} = {}
    // Also only ONE state attribute per device, which simplifies things a lot!
    const deviceStateAttributeId: {[device: LibertasVirtualDevice]: number} = {}

    function clearDeviceStates() {
        for (let [device, attributes] of Libertas_MakeIterable(deviceAttributes)) {
            const stateAttrId = deviceStateAttributeId[device]!
            attributes[stateAttrId] = undefined
        }
    }

    function getDeviceState(device: LibertasVirtualDevice) {
        const attributes = deviceAttributes[device]!
        const stateAttrId = deviceStateAttributeId[device]!
        return attributes[stateAttrId]
    }

    function setDeviceState(device: LibertasVirtualDevice, state: boolean | number) {
        const attributes = deviceAttributes[device]!
        const stateAttrId = deviceStateAttributeId[device]!
        attributes[stateAttrId] = state
    }

    // Three timers. Initial timeout == 0 meaning standby mode
    const reconnectTimer = Libertas_TimerNew(0, 
        ()=>{
            Libertas_NetConnectDevice(socket, avr, 23);            
        });
    const commandAckTimer = Libertas_TimerNew(0, ()=>{
            onNetError();
        });
    const heartBeatTimer = Libertas_TimerNew(0, 
            ()=>{   // Use power on/off query as heartbeat
                enqueuePendingMessage(mainZone.onOff, "ZM?\r", 2, ReportAction.NA);
            }
        );

    function onNetError() {
        let reconnectTimeout = TIMEOUT_RECONN_WAIT;
        if (validSession && pendingAck) {
            // Detect unsupported command for this AVR model.
            let failureCount = suspectedUnsupportedCmd.get(pendingAck.c);
            if (failureCount === undefined) {
                failureCount = 0;
            }
            if (failureCount >= 3) {
                suspectedUnsupportedCmd.delete(pendingAck.c);
                unsupportedCmds.add(pendingAck.c);
            } else {
                suspectedUnsupportedCmd.set(pendingAck.c, failureCount + 1);
            }
            reconnectTimeout = 100;     // reduce to 100ms
        }
        validSession = false
        ready = false;
        clearDeviceStates();
        Libertas_TimerCancel(commandAckTimer);
        Libertas_TimerCancel(heartBeatTimer);
        Libertas_NetClose(socket);     // Will be reused later by calling connect
        Libertas_TimerUpdate(reconnectTimer, reconnectTimeout);
    }

    function enqueuePendingMessage(
		device: LibertasVirtualDevice,
		command: string,
		prefixLen: number,
		ack: ReportAction,
        ref?: number) {
        if (ready) {
            if (!unsupportedCmds.has(command)) {
                const msg: PendingMessage = {
                    d: device,
                    c: command,
                    n: prefixLen,
                    a: ack,
                    r: ref,
                    t: os.msticks()
                }
                pendingMessages.pushright(msg);
                trySendPendingMessage();
            }
        }
    }

    function rescheduleHeartbeat() {
        if (ready) {
            if (!pendingAck) {
                Libertas_TimerUpdate(heartBeatTimer, TIMEOUT_HEARTBEAT);
            } else {
                Libertas_TimerCancel(heartBeatTimer);
            }
        }
    }

    // Send next pending message in the queue
    function trySendPendingMessage() {
        if (ready && pendingAck === undefined) {
            pendingAck = pendingMessages.popleft();
            if (pendingAck) {
                Libertas_NetWrite(socket, pendingAck.c);
                Libertas_TimerUpdate(commandAckTimer, TIMEOUT_ACK);
            }
            rescheduleHeartbeat();
        }
    }

    function onVirtualDeviceUpdate(device: LibertasVirtualDevice, cmd: string, value: number|boolean) {
        const oldValue = getDeviceState(device);
        const modified = (oldValue === undefined || oldValue !== value);
        let shouldReport = false;
        let isAck = (pendingAck !== undefined && pendingAck.n === cmd.length &&
            pendingAck.c.startsWith(cmd));  // Denon AVR acknowledges command with an echo string
        // Libertas_Log(LibertasLogLevel.DEBUG, "AVR received cmd=" + cmd + " value=" + value + " ack=" + isAck)            
        if (isAck) {
            suspectedUnsupportedCmd.delete(pendingAck!.c);  // It is a valid command
            // Send acknowledgement
            // All device types happen to be controlled with commands
            if (pendingAck!.r !== undefined) {
                Libertas_VirtualDeviceCommandRsp(
                    device, pendingAck!.r, Matter.Status.Success
                )
            }
            const ackAction = pendingAck!.a
            if (ackAction === ReportAction.UPDATE) {
                shouldReport = modified;
            } else if (ackAction === ReportAction.FORCE) {
                shouldReport = true
            }
            validSession = true;
            pendingAck = undefined;
            Libertas_TimerCancel(commandAckTimer);
            trySendPendingMessage();
        } else {    // For unsolicited commands, only notify on change
            shouldReport = modified;
        }
        setDeviceState(device, value);
        if (shouldReport) {
            Libertas_VirtualDeviceAttributesChanged(device, 
            [
                [deviceClusters[device], [deviceStateAttributeId[device]]]
            ]);            
        }
    }

    function onMV(cmd: string, params: string) {
        let v: number = parseInt(params);
        if (!isNaN(v)) {
            if (params.length == 2) {
                v = v * 10;
            }
            v = v / 5;      // 00.0 - 98.0 TOTAL = 98 * 2
            onVirtualDeviceUpdate(mainZone.volume!, cmd, v);
        }
    }

    function onMU(cmd: string, params: string) {
        const v = getBoolean(params);
        if (v !== undefined) {
            onVirtualDeviceUpdate(mainZone.mute!, cmd, v);
        }
    }

    function onSI(cmd: string, params: string) {
        const v = getEnumIndex(params, ENUM_SI, 1, 0);
        if (v !== undefined) {
            onVirtualDeviceUpdate(mainZone.input!, cmd, v);
        }
    }

    function onMS(cmd: string, params: string) {
        const v = getEnumIndex(params, ENUM_MS, 1, 0);
        if (v !== undefined) {
            onVirtualDeviceUpdate(mainZone.mode!, cmd, v);
        }
    }

    function onZM(cmd: string, params: string) {
        const v = getBoolean(params);
        if (v !== undefined) {
            onVirtualDeviceUpdate(mainZone.onOff!, cmd, v);
        }
    }

    function onECO(cmd: string, params: string) {
        const v = getEnumIndex(params, ENUM_ON_AUTO_OFF);
        if (v !== undefined) {
            onVirtualDeviceUpdate(mainZone.eco!, cmd, v);
        }
    }

    /**
     * @zone: 0 = Z2, 1 - Z3
     */
    function onExtraZone(zone: 0|1, cmd: string, params: string) {
        if (extraZones.length < zone + 1) {
            return;
        }
        let d: LibertasVirtualDevice | undefined;
        let v: number|boolean|undefined = parseInt(params);
        if (!isNaN(v)) {
            if (params.length == 2) {
                v = v * 10;
            }
            v = v / 5;      // 00.0 - 98.0 TOTAL = 98 * 2
            d = extraZones[zone].volume;
        } else if (params == "ON") {
            d = extraZones[zone].onOff;
            v = true;
        } else if (params == "OFF") {
            d = extraZones[zone].onOff;
            v = false;
        } else if (params == "MUON") {
            d = extraZones[zone].mute;
            cmd += "MU";
            v = true;
        } else if (params == "MUOFF") {
            d = extraZones[zone].mute;
            cmd += "MU";
            v = false;
        } else {
            v = getEnumIndex(params, ENUM_SI, 1);
            if (v !== undefined) {
                d = extraZones[zone].input;
            } else {
                v = getEnumIndex(params, ENUM_MS, 1);
                if (v !== undefined) {
                    d = extraZones[zone].mode;
                }                
            }
        }
        if (d !== undefined && v != undefined) {
            onVirtualDeviceUpdate(d, cmd, v);
        }
    }    

    type CommandHandler = (cmd: string, params: string)=>void;
    const HANDLERS = new LuaTable<string, CommandHandler|undefined>();
    HANDLERS.set("ZM", onZM);   // Onoff is mandatory
    if (mainZone.eco !== undefined) {
        HANDLERS.set("ECO", onECO);
    }
    if (mainZone.input !== undefined) {
        HANDLERS.set("SI", onSI);
    }
    if (mainZone.mute !== undefined) {
        HANDLERS.set("MU", onMU);
    }
    if (mainZone.volume !== undefined) {
        HANDLERS.set("MV", onMV);
    }
    if (mainZone.mode !== undefined) {
        HANDLERS.set("MS", onMS);
    }    
    function onIncoming(c: number) {
        if (c == 0x0d) {    // '\r'
            let cmd, params: string;
            if (curIncoming.length > 3) {
                if (curIncoming.tostring(0, 3) === "ECO") {
                    cmd = "ECO";
                    params = curIncoming.tostring(3);
                } else {
                    cmd = curIncoming.tostring(0, 2);
                    params = curIncoming.tostring(2);
                }
                if (cmd == "Z2") {
                    onExtraZone(0, cmd, params);
                } else if (cmd == "Z3") {
                    onExtraZone(1, cmd, params);
                } else {
                    const f = HANDLERS.get(cmd);
                    if (f) {
                        f(cmd, params);
                    }
                }
            }
            curIncoming.setlen(0);
            rescheduleHeartbeat();
        } else {
            const p = curIncoming.length;
            curIncoming.setlen(p + 1);
            curIncoming[p] = c;
        }
    }

    function genCmdVolume(cmd: string, v: number): string|undefined {
        if (v >= 0 && v <= 98) {
            const whole = Math.floor(v);
			const fraction = v - whole;
			if (fraction != 0) {
                return util.format("%s%02d5\r", cmd, whole)
            } else {
                return util.format("%s%02d\r", cmd, whole)
            }
        }
    }

    function onControlVolume(
            device: LibertasVirtualDevice, 
            ref: number, 
            action: LibertasDeviceAction, 
            data: LibertasVirtualDeviceReq, 
            cmd: string): string|undefined {
        const [cluster, cmdId, cmdBody] = data as LibertasCommand;
        let outCmd: string|undefined;
        if (cmd !== undefined) {
            if (cmdId === Matter.Commands.LevelControl.Step ||
                cmdId === Matter.Commands.LevelControl.StepWithOnOff) {
                const stepMode = cmdBody![Matter.Fields.LevelControl.Step.StepMode] as number;
                const stepBy = cmdBody![Matter.Fields.LevelControl.Step.StepSize] as number;
                const curValue = getDeviceState(device);
                if (curValue === undefined) {
                    if (stepMode === Matter.Constants.LevelControl.StepModeEnum.Up) {
                        outCmd = util.format("%sUP\r", cmd)
                    } else if (stepMode === Matter.Constants.LevelControl.StepModeEnum.Down) {
                        outCmd = util.format("%sDOWN\r", cmd)
                    }
                } else {
                    let newValue = curValue as number;
                    if (stepMode == Matter.Constants.LevelControl.StepModeEnum.Up) {
                        newValue += stepBy;
                    } else if (stepMode == Matter.Constants.LevelControl.StepModeEnum.Down) {
                        newValue -= stepBy;
                    }
                    if (newValue >= 0 && newValue < 98 * 2 && newValue !== curValue) {
                        outCmd = genCmdVolume(cmd, newValue / 2)
                    }
                }
            } else if (cmdId === Matter.Commands.LevelControl.MoveToLevel ||
                cmdId === Matter.Commands.LevelControl.MoveToLevelWithOnOff) {
                const level = cmdBody![Matter.Fields.LevelControl.MoveToLevel.Level] as number;	// Ignore transition time
                outCmd = genCmdVolume(cmd, level / 2);
            }
            return outCmd;
        }
    }

    function onControlOnOff(
            device: LibertasVirtualDevice, 
            ref: number, 
            action: LibertasDeviceAction, 
            data: LibertasVirtualDeviceReq, 
            cmd: string): string|undefined {
        const [cluster, cmdId, cmdBody] = data as LibertasCommand;
        //Libertas_Log(LibertasLogLevel.DEBUG, "onControlOnOff")
        let outCmd: string|undefined;
        if (cmdId === Matter.Commands.OnOff.On) {
            outCmd = util.format("%sON\r", cmd);
        } else if (cmdId === Matter.Commands.OnOff.Off) {
            outCmd = util.format("%sOFF\r", cmd);
        } else if (cmdId === Matter.Commands.OnOff.Toggle) {
            let curValue = getDeviceState(device);
            if (curValue === undefined) {
                curValue = false;
            }
            const newValue = !(curValue as boolean);
            outCmd = util.format("%s%s\r", cmd, (newValue) ? "ON" : "OFF");
        }
        return outCmd;
    }

    function onControlEnum(
            device: LibertasVirtualDevice, 
            ref: number, 
            action: LibertasDeviceAction, 
            data: LibertasVirtualDeviceReq, 
            cmd: string,
            modeEnums?: string[]): string|undefined {
        const [cluster, cmdId, cmdBody] = data as LibertasCommand;
        if (cmdId === Matter.Commands.ModeSelect.ChangeToMode) {
            const mode = cmdBody![Matter.Fields.ModeSelect.ChangeToMode.NewMode];
            if (mode !== undefined) {
                return util.format("%s%s\r", cmd, modeEnums![mode as number]);
            }
        }
    }

    type AVRControlCmdGen = (
        device: LibertasVirtualDevice, 
        ref: number, 
        action: LibertasDeviceAction, 
        data: LibertasVirtualDeviceReq, 
        cmd: string, 
        modeEnums?: string[])=>string|undefined;
    function initCtrlMap(d: LibertasVirtualDevice|undefined, 
            cmd: string, 
            f: AVRControlCmdGen, 
            depends: LibertasVirtualDevice,
            modeEnums?: string[]) {
        if (d !== undefined) {
            Libertas_SetOnVirtualDevice(d, (_, ref, action, data)=>{
                // Libertas_Log(LibertasLogLevel.DEBUG, "Virtual device callback")
                // Received user control events
                if (action === LibertasDeviceAction.InvokeCommandRequest) {
                    // Libertas_Log(LibertasLogLevel.DEBUG, "Command")
                    if (d !== depends) {    // Not controlling zone power
                        const dependentPower = getDeviceState(depends);
                        if (dependentPower === undefined || !(dependentPower as boolean)) {
                            // Libertas_Log(LibertasLogLevel.DEBUG, "Powered off")
                            // Zone is powered off, do not control it! Send report instead.
                            const value = getDeviceState(d);
                            if (value !== undefined) {
                                Libertas_VirtualDeviceAttributesChanged(d, 
                                [
                                    [deviceClusters[d], [deviceStateAttributeId[d]]]
                                ]);                                  
                            }
                            return;
                        }
                    }
                    const ctrlCmd = f(d, ref, action, data, cmd, modeEnums);
                    // Libertas_Log(LibertasLogLevel.DEBUG, "AVR CMD=" + ctrlCmd)
                    if (ctrlCmd) {
                        enqueuePendingMessage(
                            d,
                            ctrlCmd,
                            cmd.length,
                            ReportAction.FORCE,
                            ref);
                    }
                } else if (action === LibertasDeviceAction.ReadRequest ||
                    action === LibertasDeviceAction.SubscribeRequest) {
                    const requests = data as LibertasClusterReadReq[]
                    // It happens that each device only allows one cluster. 
                    // Thus guaranteed requests.length == 1
                    // type LibertasClusterReadReq = [cluster: number, attributes: number[], events?: number[] ];
                    const [cluster, attributes] = requests[0];
                    // Guaranteed (cluster === deviceClusters[d])
                    const attributeStore = deviceAttributes[d]!
                    // type LibertasClusterReport = [cluster: number, attributes: LibertasAttributes, attributeStatus: LibertasIdStatus, events?: LibertasEvent[], eventStatus?: LibertasIdStatus];
                    const attributesRsp: LibertasAttributes = {}
                    const statusRsp: LibertasIdStatus = {}
                    for (const attrId of attributes) {  // attrId guaranteed to be valid
                        const v = attributeStore[attrId]
                        if (v === undefined) {
                            statusRsp[attrId] = Matter.Status.Timeout
                        } else {
                            attributesRsp[attrId] = v;
                        }
                    }
                    Libertas_VirtualDeviceAttributesRsp(d, ref, [[cluster, attributesRsp, statusRsp]])
                } else {    // WriteAttribute is not supported! Please use commands!
                    Libertas_VirtualDeviceStatusRsp(d, ref, Matter.Status.InvalidAction)
                }
            });
        }
    }

    function initSubZone(zone: AVRZone, cmd: string) {
        initCtrlMap(zone.input, cmd, onControlEnum, zone.onOff, ENUM_SI);
        initCtrlMap(zone.mode, cmd, onControlEnum, zone.onOff, ENUM_MS);
        initCtrlMap(zone.mute, cmd + "MU", onControlOnOff, zone.onOff);
        initCtrlMap(zone.onOff, cmd, onControlOnOff, zone.onOff);
        initCtrlMap(zone.volume, cmd, onControlVolume, zone.onOff);
    }
    initCtrlMap(mainZone.eco, "ECO", onControlEnum, mainZone.onOff, ENUM_ON_AUTO_OFF);
    initCtrlMap(mainZone.input, "SI", onControlEnum, mainZone.onOff, ENUM_SI);
    initCtrlMap(mainZone.mute, "MU", onControlOnOff, mainZone.onOff);
    initCtrlMap(mainZone.onOff, "ZM", onControlOnOff, mainZone.onOff);
    initCtrlMap(mainZone.volume, "MV", onControlVolume, mainZone.onOff);
    initCtrlMap(mainZone.mode, "MS", onControlEnum, mainZone.onOff, ENUM_MS);
    if (extraZones.length > 0) {
        initSubZone(extraZones[0], "Z2");
        if (extraZones.length > 1) {
            initSubZone(extraZones[1], "Z3");
        }
    }

    function initOnOffAttributes(device: LibertasVirtualDevice | undefined) {
        if (device !== undefined) {
            deviceAttributes[device] = {}   // Initially empty and no change to report!
            deviceClusters[device] = Matter.Clusters.OnOff
            deviceStateAttributeId[device] = Matter.Attributes.OnOff.OnOff
        }
    }

    function initVolumeAttributes(device: LibertasVirtualDevice | undefined) {
        if (device !== undefined) {
            deviceAttributes[device] = {
                [Matter.Attributes.LevelControl.MinLevel]: 0,
                [Matter.Attributes.LevelControl.MaxLevel]: 196,   // Max volume 98*2
            }
            Libertas_VirtualDeviceAttributesChanged(device, [
                [
                    Matter.Clusters.LevelControl, 
                    [Matter.Attributes.LevelControl.MinLevel, Matter.Attributes.LevelControl.MaxLevel]
                ]
            ])
            deviceClusters[device] = Matter.Clusters.LevelControl
            deviceStateAttributeId[device] = Matter.Attributes.LevelControl.CurrentLevel
        }
    }

    function initMultiStateAttributes(desc: string, device: LibertasVirtualDevice | undefined, 
            states: string[],
            minState?: number) {
        if (device !== undefined) {
            const min = minState || 0
            const modes: LibertasStruct[] = []
            for (let i = min; i < states.length; i++) {
                const cur: LibertasStruct = {
                    [Matter.Fields.ModeSelect.ModeOptionStruct.Label]: states[i],
                    [Matter.Fields.ModeSelect.ModeOptionStruct.Mode]: i
                }
                modes.push(cur)
            }
            deviceAttributes[device] = {
                [Matter.Attributes.ModeSelect.Description]: desc,
                [Matter.Attributes.ModeSelect.SupportedModes]: modes,
            }
            deviceClusters[device] = Matter.Clusters.ModeSelect
            deviceStateAttributeId[device] = Matter.Attributes.ModeSelect.CurrentMode
            Libertas_VirtualDeviceAttributesChanged(device, [
                [
                    Matter.Clusters.ModeSelect, 
                    [Matter.Attributes.ModeSelect.Description, Matter.Attributes.ModeSelect.SupportedModes]
                ]
            ])
        }
    }

    initOnOffAttributes(mainZone.onOff)
    initOnOffAttributes(mainZone.mute)
    initVolumeAttributes(mainZone.volume);
    initMultiStateAttributes("Main zone input", mainZone.input, ENUM_SI, 1);
    initMultiStateAttributes("Main zone eco", mainZone.eco, ENUM_ON_AUTO_OFF);
    initMultiStateAttributes("Main zone mode", mainZone.mode, ENUM_MS, 1);
    if (extraZones.length > 0) {
        initOnOffAttributes(extraZones[0].onOff)
        initOnOffAttributes(extraZones[0].mute)
        initVolumeAttributes(extraZones[0].volume);
        initMultiStateAttributes("Zone 1 input", extraZones[0].input, ENUM_SI, 1);
        initMultiStateAttributes("Zone 1 mode", extraZones[0].mode, ENUM_MS, 1);
        if (extraZones.length > 1) {
            initOnOffAttributes(extraZones[1].onOff)
            initOnOffAttributes(extraZones[1].mute)
            initVolumeAttributes(extraZones[1].volume);
            initMultiStateAttributes("Zone 2 input", extraZones[1].input, ENUM_SI, 1);
            initMultiStateAttributes("Zone 2 mode", extraZones[1].mode, ENUM_MS, 1);
        }
    }

    Libertas_SetOnNet(socket, LibertasNetEvent.Ready, ()=>{
        curIncoming.setlen(0);  // Reset buffer to empty!
        pendingMessages = new LibertasList<PendingMessage>();
        pendingAck = undefined;

        ready = true;
        validSession = false;

        enqueuePendingMessage(
            mainZone.onOff,
            "ZM?\r", 
            2, 
            ReportAction.FORCE);
        if (mainZone.volume !== undefined) {
            enqueuePendingMessage(
                mainZone.volume,
                "MV?\r", 
                2, 
                ReportAction.FORCE);
        }
        if (mainZone.mute !== undefined) {
            enqueuePendingMessage(
                mainZone.mute,
                "MU?\r",
                2, 
                ReportAction.FORCE);
        }
        if (mainZone.input !== undefined) {
            enqueuePendingMessage(
                mainZone.input,
                "SI?\r",             
                2, 
                ReportAction.FORCE);
        }
        if (mainZone.eco !== undefined) {
            enqueuePendingMessage(
                mainZone.eco,
                "ECO?\r",             
                3, 
                ReportAction.FORCE);
        }
        if (mainZone.mode !== undefined) {
            enqueuePendingMessage(
                mainZone.mode,
                "MS?\r",             
                2, 
                ReportAction.FORCE);
        }
        if (extraZones.length > 0) {
            enqueuePendingMessage(
                extraZones[0].onOff,
                "Z2?\r",
                2, 
                ReportAction.FORCE);
            if (extraZones.length > 1) {
                enqueuePendingMessage(
                    extraZones[1].onOff,
                    "Z3?\r",
                    2, 
                    ReportAction.FORCE);
            }
        }
    });
    Libertas_SetOnNet(socket, LibertasNetEvent.Drain, ()=>{
        trySendPendingMessage();
    });
    Libertas_SetOnNet(socket, LibertasNetEvent.Error, ()=>{
        onNetError();
    });
    Libertas_SetOnNet(socket, LibertasNetEvent.Data, (fd, event, tag, data)=>{
        const bytes = data as string
        for (let i=0; i<bytes.length; i++) {
            onIncoming(bytes.charCodeAt(i));
        }
    });
    Libertas_NetSetConnectTimeout(socket, TIMEOUT_CONNECTION);
    // Kick start the TCP connection
    Libertas_NetConnectDevice(socket, avr, 23);
    Libertas_WaitReactive();
}

export {ENUM_SI, ENUM_ON_AUTO_OFF, ENUM_MS, DenonAVR}