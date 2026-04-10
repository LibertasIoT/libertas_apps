--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local DefaultTimeoutMilli = 10 * 60 * 1000
local function TurnOffValve(state)
    if state[3] then
        state[3] = false
        local timer = state[4]
        if timer ~= nil then
            Libertas_TimerCancel(timer)
            state[4] = nil
        end
        Libertas_VirtualDeviceAttributesChanged(state[2], {{6, {0, 16385}}})
    end
end
local function TurnOnValve(state, onTime)
    for ____, curValve in ipairs(state[1]) do
        if curValve[2] ~= state[2] then
            TurnOffValve(curValve)
        end
    end
    state[3] = true
    local curTimer = state[4]
    local expire = os.msticks() + onTime
    if curTimer == nil then
        state[4] = Libertas_TimerNew(
            onTime,
            function(timer, tag)
                local state = tag
                TurnOffValve(state)
            end,
            state
        )
    else
        Libertas_TimerUpdate(curTimer, onTime)
    end
    state[5] = expire
    Libertas_VirtualDeviceAttributesChanged(state[2], {{6, {0, 16385}}})
end
local function VirtualIrrigationController(valves)
    local allValues = {}
    for ____, valve in ipairs(valves) do
        local curState = {allValues, valve, false}
        allValues[#allValues + 1] = curState
        Libertas_SetOnVirtualDevice(
            valve,
            function(device, ref, action, data, tag)
                local state = tag
                if action == 2 or action == 3 then
                    local rpt = {}
                    for ____, clusterReq in ipairs(data) do
                        local rptAttributes = {}
                        local rptStatus = {}
                        local cluster, attributes = unpack(clusterReq, 1, 2)
                        for ____, attr in ipairs(attributes) do
                            if attr == 0 then
                                rptAttributes[attr] = state[3]
                            elseif attr == 16385 then
                                local curTimer = state[4]
                                if curTimer == nil then
                                    rptAttributes[attr] = 0
                                else
                                    local expire = state[5]
                                    local milliLeft = expire - os.msticks()
                                    rptAttributes[attr] = milliLeft <= 0 and 0 or math.floor(milliLeft / 100 + 0.5)
                                end
                            else
                                rptStatus[attr] = 134
                            end
                        end
                        rpt[#rpt + 1] = {cluster, rptAttributes, rptStatus}
                    end
                    Libertas_VirtualDeviceAttributesRsp(device, ref, rpt)
                elseif action == 8 then
                    local cluster, id, cmdBody = unpack(data, 1, 3)
                    local curTimer = curState[3]
                    if id == 1 then
                        TurnOnValve(state, DefaultTimeoutMilli)
                    elseif id == 0 then
                        TurnOffValve(state)
                    elseif id == 66 then
                        local onTime = cmdBody[1]
                        TurnOnValve(state, onTime * 100)
                    end
                else
                    Libertas_VirtualDeviceStatusRsp(device, ref, 128)
                end
            end,
            curState
        )
        Libertas_VirtualDeviceAttributesChanged(valve, {{6, {0, 16385}}})
    end
    Libertas_WaitReactive()
end
____exports.VirtualIrrigationController = VirtualIrrigationController
return ____exports
