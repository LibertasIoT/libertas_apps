--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local TIMEOUT_ACK = 2000
local TIMEOUT_HEARTBEAT = 20000
local TIMEOUT_RECONN_WAIT = 10000
local TIMEOUT_CONNECTION = 2
local ENUM_SI = {
    "UNKNOWN",
    "PHONO",
    "CD",
    "TUNER",
    "DVD",
    "BD",
    "TV",
    "SAT/CBL",
    "MPLAY",
    "GAME",
    "HDRADIO",
    "NET",
    "PANDORA",
    "SIRIUSXM",
    "IRADIO",
    "SERVER",
    "FAVORITES",
    "AUX1",
    "AUX2",
    "AUX3",
    "AUX4",
    "AUX5",
    "AUX6",
    "AUX7",
    "BT",
    "USB/IPOD",
    "USB",
    "IPD",
    "IRP",
    "FVP"
}
local ENUM_ON_AUTO_OFF = {"ON", "AUTO", "OFF"}
local ENUM_MS = {
    "UNKNOWN",
    "MOVIE",
    "MUSIC",
    "GAME",
    "DIRECT",
    "PURE DIRECT",
    "STEREO",
    "AUTO",
    "DOLBY PRO LOGIC",
    "DOLBY PL2 C",
    "DOLBY PL2 M",
    "DOLBY PL2 G",
    "DOLBY PL2X C",
    "DOLBY PL2X M",
    "DOLBY PL2X G",
    "DOLBY PL2Z H",
    "DOLBY SURROUND",
    "DOLBY ATMOS",
    "DOLBY DIGITAL",
    "DOLBY D EX",
    "DOLBY D+PL2X C",
    "DOLBY D+PL2X M",
    "DOLBY D+PL2Z H",
    "DOLBY D+DS",
    "DOLBY D+NEO:X C",
    "DOLBY D+NEO:X M",
    "DOLBY D+NEO:X G",
    "DOLBY D+NEURAL:X",
    "DTS SURROUND",
    "DTS ES DSCRT6.1",
    "DTS ES MTRX6.1",
    "DTS+PL2X C",
    "DTS+PL2X M",
    "DTS+PL2Z H",
    "DTS+DS",
    "DTS96/24",
    "DTS96 ES MTRX",
    "DTS+NEO:6",
    "DTS+NEO:X C",
    "DTS+NEO:X M",
    "DTS+NEO:X G",
    "DTS+NEURAL:X",
    "DTS ES MTRX+NEURAL:X",
    "DTS ES DSCRT+NEURAL:X",
    "MULTI CH IN",
    "M CH IN+DOLBY EX",
    "M CH IN+PL2X C",
    "M CH IN+PL2X M",
    "M CH IN+PL2Z H",
    "M CH IN+DS",
    "MULTI CH IN 7.1",
    "M CH IN+NEO:X C",
    "M CH IN+NEO:X M",
    "M CH IN+NEO:X G",
    "M CH IN+NEURAL:X",
    "DOLBY D+",
    "DOLBY D+ +EX",
    "DOLBY D+ +PL2X C",
    "DOLBY D+ +PL2X M",
    "DOLBY D+ +PL2Z H",
    "DOLBY D+ +DS",
    "DOLBY D+ +NEO:X C",
    "DOLBY D+ +NEO:X M",
    "DOLBY D+ +NEO:X G",
    "DOLBY D+ +NEURAL:X",
    "DOLBY HD",
    "DOLBY HD+EX",
    "DOLBY HD+PL2X C",
    "DOLBY HD+PL2X M",
    "DOLBY HD+PL2Z H",
    "DOLBY HD+DS",
    "DOLBY HD+NEO:X C",
    "DOLBY HD+NEO:X M",
    "DOLBY HD+NEO:X G",
    "DOLBY HD+NEURAL:X",
    "DTS HD",
    "DTS HD MSTR",
    "DTS HD+PL2X C",
    "DTS HD+PL2X M",
    "DTS HD+PL2Z H",
    "DTS HD+DS",
    "DTS HD+NEO:6",
    "DTS HD+NEO:X C",
    "DTS HD+NEO:X M",
    "DTS HD+NEO:X G",
    "DTS HD+NEURAL:X",
    "DTS:X",
    "DTS:X MSTR",
    "DTS EXPRESS",
    "DTS ES 8CH DSCRT",
    "MPEG2 AAC",
    "AAC+DOLBY EX",
    "AAC+PL2X C",
    "AAC+PL2X M",
    "AAC+PL2Z H",
    "AAC+DS",
    "AAC+NEO:X C",
    "AAC+NEO:X M",
    "AAC+NEO:X G",
    "AAC+NEURAL:X",
    "PL DSX",
    "PL2 C DSX",
    "PL2 M DSX",
    "PL2 G DSX",
    "PL2X C DSX",
    "PL2X M DSX",
    "PL2X G DSX",
    "AUDYSSEY DSX",
    "DTS NEO:6 C",
    "DTS NEO:6 M",
    "DTS NEO:X C",
    "DTS NEO:X M",
    "DTS NEO:X G",
    "NEURAL:X",
    "NEO:6 C DSX",
    "NEO:6 M DSX",
    "AURO3D",
    "AURO2DSURR",
    "MCH STEREO",
    "WIDE SCREEN",
    "SUPER STADIUM",
    "ROCK ARENA",
    "JAZZ CLUB",
    "CLASSIC CONCERT",
    "MONO MOVIE",
    "MATRIX",
    "VIDEO GAME",
    "VIRTUAL",
    "STEREO",
    "ALL ZONE STEREO",
    "7.1IN"
}
local function getEnumIndex(value, e, start, def)
    start = start or 0
    do
        local i = start
        while i < #e do
            if e[i + 1] == value then
                return i
            end
            i = i + 1
        end
    end
    return def
end
local function getBoolean(value)
    if value == "ON" then
        return true
    elseif value == "OFF" then
        return false
    end
end
--- Denon driver main entry function
local function DenonAVR(avr, mainZone, extraZones)
    local clearDeviceStates, onNetError, enqueuePendingMessage, rescheduleHeartbeat, trySendPendingMessage, unsupportedCmds, suspectedUnsupportedCmd, socket, pendingMessages, pendingAck, ready, validSession, deviceAttributes, deviceStateAttributeId, reconnectTimer, commandAckTimer, heartBeatTimer
    function clearDeviceStates()
        for device, attributes in pairs(deviceAttributes) do
            local stateAttrId = deviceStateAttributeId[device]
            attributes[stateAttrId] = nil
        end
    end
    function onNetError()
        local reconnectTimeout = TIMEOUT_RECONN_WAIT
        if validSession and pendingAck then
            local failureCount = suspectedUnsupportedCmd:get(pendingAck.c)
            if failureCount == nil then
                failureCount = 0
            end
            if failureCount >= 3 then
                suspectedUnsupportedCmd:delete(pendingAck.c)
                unsupportedCmds:add(pendingAck.c)
            else
                suspectedUnsupportedCmd:set(pendingAck.c, failureCount + 1)
            end
            reconnectTimeout = 100
        end
        validSession = false
        ready = false
        clearDeviceStates()
        Libertas_TimerCancel(commandAckTimer)
        Libertas_TimerCancel(heartBeatTimer)
        Libertas_NetClose(socket)
        Libertas_TimerUpdate(reconnectTimer, reconnectTimeout)
    end
    function enqueuePendingMessage(device, command, prefixLen, ack, ref)
        if ready then
            if not unsupportedCmds:has(command) then
                local msg = {
                    d = device,
                    c = command,
                    n = prefixLen,
                    a = ack,
                    r = ref,
                    t = os.msticks()
                }
                pendingMessages:pushright(msg)
                trySendPendingMessage()
            end
        end
    end
    function rescheduleHeartbeat()
        if ready then
            if not pendingAck then
                Libertas_TimerUpdate(heartBeatTimer, TIMEOUT_HEARTBEAT)
            else
                Libertas_TimerCancel(heartBeatTimer)
            end
        end
    end
    function trySendPendingMessage()
        if ready and pendingAck == nil then
            pendingAck = pendingMessages:popleft()
            if pendingAck then
                Libertas_NetWrite(socket, pendingAck.c)
                Libertas_TimerUpdate(commandAckTimer, TIMEOUT_ACK)
            end
            rescheduleHeartbeat()
        end
    end
    unsupportedCmds = __TS__New(Set)
    suspectedUnsupportedCmd = __TS__New(Map)
    socket = Libertas_NetNewTcp()
    local curIncoming = lbuffer()
    pendingMessages = list.new()
    ready = false
    validSession = false
    local deviceClusters = {}
    deviceAttributes = {}
    deviceStateAttributeId = {}
    local function getDeviceState(device)
        local attributes = deviceAttributes[device]
        local stateAttrId = deviceStateAttributeId[device]
        return attributes[stateAttrId]
    end
    local function setDeviceState(device, state)
        local attributes = deviceAttributes[device]
        local stateAttrId = deviceStateAttributeId[device]
        attributes[stateAttrId] = state
    end
    reconnectTimer = Libertas_TimerNew(
        0,
        function()
            Libertas_NetConnectDevice(socket, avr, 23)
        end
    )
    commandAckTimer = Libertas_TimerNew(
        0,
        function()
            onNetError()
        end
    )
    heartBeatTimer = Libertas_TimerNew(
        0,
        function()
            enqueuePendingMessage(mainZone.onOff, "ZM?\r", 2, 0)
        end
    )
    local function onVirtualDeviceUpdate(device, cmd, value)
        local oldValue = getDeviceState(device)
        local modified = oldValue == nil or oldValue ~= value
        local shouldReport = false
        local isAck = pendingAck ~= nil and pendingAck.n == #cmd and __TS__StringStartsWith(pendingAck.c, cmd)
        if isAck then
            suspectedUnsupportedCmd:delete(pendingAck.c)
            if pendingAck.r ~= nil then
                Libertas_VirtualDeviceCommandRsp(device, pendingAck.r, 0)
            end
            local ackAction = pendingAck.a
            if ackAction == 1 then
                shouldReport = modified
            elseif ackAction == 2 then
                shouldReport = true
            end
            validSession = true
            pendingAck = nil
            Libertas_TimerCancel(commandAckTimer)
            trySendPendingMessage()
        else
            shouldReport = modified
        end
        setDeviceState(device, value)
        if shouldReport then
            Libertas_VirtualDeviceAttributesChanged(device, {{deviceClusters[device], {deviceStateAttributeId[device]}}})
        end
    end
    local function onMV(cmd, params)
        local v = __TS__ParseInt(params)
        if not __TS__NumberIsNaN(__TS__Number(v)) then
            if #params == 2 then
                v = v * 10
            end
            v = v / 5
            onVirtualDeviceUpdate(mainZone.volume, cmd, v)
        end
    end
    local function onMU(cmd, params)
        local v = getBoolean(params)
        if v ~= nil then
            onVirtualDeviceUpdate(mainZone.mute, cmd, v)
        end
    end
    local function onSI(cmd, params)
        local v = getEnumIndex(params, ENUM_SI, 1, 0)
        if v ~= nil then
            onVirtualDeviceUpdate(mainZone.input, cmd, v)
        end
    end
    local function onMS(cmd, params)
        local v = getEnumIndex(params, ENUM_MS, 1, 0)
        if v ~= nil then
            onVirtualDeviceUpdate(mainZone.mode, cmd, v)
        end
    end
    local function onZM(cmd, params)
        local v = getBoolean(params)
        if v ~= nil then
            onVirtualDeviceUpdate(mainZone.onOff, cmd, v)
        end
    end
    local function onECO(cmd, params)
        local v = getEnumIndex(params, ENUM_ON_AUTO_OFF)
        if v ~= nil then
            onVirtualDeviceUpdate(mainZone.eco, cmd, v)
        end
    end
    ---
    -- @zone : 0 = Z2, 1 - Z3
    local function onExtraZone(zone, cmd, params)
        if #extraZones < zone + 1 then
            return
        end
        local d
        local v = __TS__ParseInt(params)
        if not __TS__NumberIsNaN(__TS__Number(v)) then
            if #params == 2 then
                v = v * 10
            end
            v = v / 5
            d = extraZones[zone + 1].volume
        elseif params == "ON" then
            d = extraZones[zone + 1].onOff
            v = true
        elseif params == "OFF" then
            d = extraZones[zone + 1].onOff
            v = false
        elseif params == "MUON" then
            d = extraZones[zone + 1].mute
            cmd = cmd .. "MU"
            v = true
        elseif params == "MUOFF" then
            d = extraZones[zone + 1].mute
            cmd = cmd .. "MU"
            v = false
        else
            v = getEnumIndex(params, ENUM_SI, 1)
            if v ~= nil then
                d = extraZones[zone + 1].input
            else
                v = getEnumIndex(params, ENUM_MS, 1)
                if v ~= nil then
                    d = extraZones[zone + 1].mode
                end
            end
        end
        if d ~= nil and v ~= nil then
            onVirtualDeviceUpdate(d, cmd, v)
        end
    end
    local HANDLERS = {}
    HANDLERS.ZM = onZM
    if mainZone.eco ~= nil then
        HANDLERS.ECO = onECO
    end
    if mainZone.input ~= nil then
        HANDLERS.SI = onSI
    end
    if mainZone.mute ~= nil then
        HANDLERS.MU = onMU
    end
    if mainZone.volume ~= nil then
        HANDLERS.MV = onMV
    end
    if mainZone.mode ~= nil then
        HANDLERS.MS = onMS
    end
    local function onIncoming(c)
        if c == 13 then
            local cmd
            local params
            if curIncoming:len() > 3 then
                if curIncoming:tostring(1, 3) == "ECO" then
                    cmd = "ECO"
                    params = curIncoming:tostring(4)
                else
                    cmd = curIncoming:tostring(1, 2)
                    params = curIncoming:tostring(3)
                end
                if cmd == "Z2" then
                    onExtraZone(0, cmd, params)
                elseif cmd == "Z3" then
                    onExtraZone(1, cmd, params)
                else
                    local f = HANDLERS[cmd]
                    if f then
                        f(cmd, params)
                    end
                end
            end
            curIncoming:setlen(0)
            rescheduleHeartbeat()
        else
            local p = curIncoming:len()
            curIncoming:setlen(p + 1)
            curIncoming[__TS__index_adj(p)] = c
        end
    end
    local function genCmdVolume(cmd, v)
        if v >= 0 and v <= 98 then
            local whole = math.floor(v)
            local fraction = v - whole
            if fraction ~= 0 then
                return string.format("%s%02d5\r", cmd, whole)
            else
                return string.format("%s%02d\r", cmd, whole)
            end
        end
    end
    local function onControlVolume(device, ref, action, data, cmd)
        local cluster, cmdId, cmdBody = unpack(data)
        local outCmd
        if cmd ~= nil then
            if cmdId == 2 or cmdId == 6 then
                local stepMode = cmdBody[0]
                local stepBy = cmdBody[1]
                local curValue = getDeviceState(device)
                if curValue == nil then
                    if stepMode == 0 then
                        outCmd = string.format("%sUP\r", cmd)
                    elseif stepMode == 1 then
                        outCmd = string.format("%sDOWN\r", cmd)
                    end
                else
                    local newValue = curValue
                    if stepMode == 0 then
                        newValue = newValue + stepBy
                    elseif stepMode == 1 then
                        newValue = newValue - stepBy
                    end
                    if newValue >= 0 and newValue < 98 * 2 and newValue ~= curValue then
                        outCmd = genCmdVolume(cmd, newValue / 2)
                    end
                end
            elseif cmdId == 0 or cmdId == 4 then
                local level = cmdBody[0]
                outCmd = genCmdVolume(cmd, level / 2)
            end
            return outCmd
        end
    end
    local function onControlOnOff(device, ref, action, data, cmd)
        local cluster, cmdId, cmdBody = unpack(data)
        local outCmd
        if cmdId == 1 then
            outCmd = string.format("%sON\r", cmd)
        elseif cmdId == 0 then
            outCmd = string.format("%sOFF\r", cmd)
        elseif cmdId == 2 then
            local curValue = getDeviceState(device)
            if curValue == nil then
                curValue = false
            end
            local newValue = not curValue
            outCmd = string.format("%s%s\r", cmd, newValue and "ON" or "OFF")
        end
        return outCmd
    end
    local function onControlEnum(device, ref, action, data, cmd, modeEnums)
        local cluster, cmdId, cmdBody = unpack(data)
        if cmdId == 0 then
            local mode = cmdBody[0]
            if mode ~= nil then
                return string.format("%s%s\r", cmd, modeEnums[mode + 1])
            end
        end
    end
    local function initCtrlMap(d, cmd, f, depends, modeEnums)
        if d ~= nil then
            Libertas_SetOnVirtualDevice(
                d,
                function(_, ref, action, data)
                    if action == 8 then
                        if d ~= depends then
                            local dependentPower = getDeviceState(depends)
                            if dependentPower == nil or not dependentPower then
                                local value = getDeviceState(d)
                                if value ~= nil then
                                    Libertas_VirtualDeviceAttributesChanged(d, {{deviceClusters[d], {deviceStateAttributeId[d]}}})
                                end
                                return
                            end
                        end
                        local ctrlCmd = f(
                            d,
                            ref,
                            action,
                            data,
                            cmd,
                            modeEnums
                        )
                        if ctrlCmd then
                            enqueuePendingMessage(
                                d,
                                ctrlCmd,
                                #cmd,
                                2,
                                ref
                            )
                        end
                    elseif action == 2 or action == 3 then
                        local requests = data
                        local cluster, attributes = unpack(requests[1])
                        local attributeStore = deviceAttributes[d]
                        local attributesRsp = {}
                        local statusRsp = {}
                        for ____, attrId in ipairs(attributes) do
                            local v = attributeStore[attrId]
                            if v == nil then
                                statusRsp[attrId] = 148
                            else
                                attributesRsp[attrId] = v
                            end
                        end
                        Libertas_VirtualDeviceAttributesRsp(d, ref, {{cluster, attributesRsp, statusRsp}})
                    else
                        Libertas_VirtualDeviceStatusRsp(d, ref, 128)
                    end
                end
            )
        end
    end
    local function initSubZone(zone, cmd)
        initCtrlMap(
            zone.input,
            cmd,
            onControlEnum,
            zone.onOff,
            ENUM_SI
        )
        initCtrlMap(
            zone.mode,
            cmd,
            onControlEnum,
            zone.onOff,
            ENUM_MS
        )
        initCtrlMap(zone.mute, cmd .. "MU", onControlOnOff, zone.onOff)
        initCtrlMap(zone.onOff, cmd, onControlOnOff, zone.onOff)
        initCtrlMap(zone.volume, cmd, onControlVolume, zone.onOff)
    end
    initCtrlMap(
        mainZone.eco,
        "ECO",
        onControlEnum,
        mainZone.onOff,
        ENUM_ON_AUTO_OFF
    )
    initCtrlMap(
        mainZone.input,
        "SI",
        onControlEnum,
        mainZone.onOff,
        ENUM_SI
    )
    initCtrlMap(mainZone.mute, "MU", onControlOnOff, mainZone.onOff)
    initCtrlMap(mainZone.onOff, "ZM", onControlOnOff, mainZone.onOff)
    initCtrlMap(mainZone.volume, "MV", onControlVolume, mainZone.onOff)
    initCtrlMap(
        mainZone.mode,
        "MS",
        onControlEnum,
        mainZone.onOff,
        ENUM_MS
    )
    if #extraZones > 0 then
        initSubZone(extraZones[1], "Z2")
        if #extraZones > 1 then
            initSubZone(extraZones[2], "Z3")
        end
    end
    local function initOnOffAttributes(device)
        if device ~= nil then
            deviceAttributes[device] = {}
            deviceClusters[device] = 6
            deviceStateAttributeId[device] = 0
        end
    end
    local function initVolumeAttributes(device)
        if device ~= nil then
            deviceAttributes[device] = {[2] = 0, [3] = 196}
            Libertas_VirtualDeviceAttributesChanged(device, {{8, {2, 3}}})
            deviceClusters[device] = 8
            deviceStateAttributeId[device] = 0
        end
    end
    local function initMultiStateAttributes(desc, device, states, minState)
        if device ~= nil then
            local min = minState or 0
            local modes = {}
            do
                local i = min
                while i < #states do
                    local cur = {[0] = states[i + 1], [1] = i}
                    modes[#modes + 1] = cur
                    i = i + 1
                end
            end
            deviceAttributes[device] = {[0] = desc, [2] = modes}
            deviceClusters[device] = 80
            deviceStateAttributeId[device] = 3
            Libertas_VirtualDeviceAttributesChanged(device, {{80, {0, 2}}})
        end
    end
    initOnOffAttributes(mainZone.onOff)
    initOnOffAttributes(mainZone.mute)
    initVolumeAttributes(mainZone.volume)
    initMultiStateAttributes("Main zone input", mainZone.input, ENUM_SI, 1)
    initMultiStateAttributes("Main zone eco", mainZone.eco, ENUM_ON_AUTO_OFF)
    initMultiStateAttributes("Main zone mode", mainZone.mode, ENUM_MS, 1)
    if #extraZones > 0 then
        initOnOffAttributes(extraZones[1].onOff)
        initOnOffAttributes(extraZones[1].mute)
        initVolumeAttributes(extraZones[1].volume)
        initMultiStateAttributes("Zone 1 input", extraZones[1].input, ENUM_SI, 1)
        initMultiStateAttributes("Zone 1 mode", extraZones[1].mode, ENUM_MS, 1)
        if #extraZones > 1 then
            initOnOffAttributes(extraZones[2].onOff)
            initOnOffAttributes(extraZones[2].mute)
            initVolumeAttributes(extraZones[2].volume)
            initMultiStateAttributes("Zone 2 input", extraZones[2].input, ENUM_SI, 1)
            initMultiStateAttributes("Zone 2 mode", extraZones[2].mode, ENUM_MS, 1)
        end
    end
    Libertas_SetOnNet(
        socket,
        7,
        function()
            curIncoming:setlen(0)
            pendingMessages = list.new()
            pendingAck = nil
            ready = true
            validSession = false
            enqueuePendingMessage(mainZone.onOff, "ZM?\r", 2, 2)
            if mainZone.volume ~= nil then
                enqueuePendingMessage(mainZone.volume, "MV?\r", 2, 2)
            end
            if mainZone.mute ~= nil then
                enqueuePendingMessage(mainZone.mute, "MU?\r", 2, 2)
            end
            if mainZone.input ~= nil then
                enqueuePendingMessage(mainZone.input, "SI?\r", 2, 2)
            end
            if mainZone.eco ~= nil then
                enqueuePendingMessage(mainZone.eco, "ECO?\r", 3, 2)
            end
            if mainZone.mode ~= nil then
                enqueuePendingMessage(mainZone.mode, "MS?\r", 2, 2)
            end
            if #extraZones > 0 then
                enqueuePendingMessage(extraZones[1].onOff, "Z2?\r", 2, 2)
                if #extraZones > 1 then
                    enqueuePendingMessage(extraZones[2].onOff, "Z3?\r", 2, 2)
                end
            end
        end
    )
    Libertas_SetOnNet(
        socket,
        1,
        function()
            trySendPendingMessage()
        end
    )
    Libertas_SetOnNet(
        socket,
        2,
        function()
            onNetError()
        end
    )
    Libertas_SetOnNet(
        socket,
        0,
        function(fd, event, tag, data)
            local bytes = data
            do
                local i = 0
                while i < #bytes do
                    onIncoming(__TS__StringCharCodeAt(bytes, i))
                    i = i + 1
                end
            end
        end
    )
    Libertas_NetSetConnectTimeout(socket, TIMEOUT_CONNECTION)
    Libertas_NetConnectDevice(socket, avr, 23)
    Libertas_WaitReactive()
end
____exports.ENUM_SI = ENUM_SI
____exports.ENUM_ON_AUTO_OFF = ENUM_ON_AUTO_OFF
____exports.ENUM_MS = ENUM_MS
____exports.DenonAVR = DenonAVR
return ____exports
