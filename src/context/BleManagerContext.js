import React, { createContext, useState, useContext } from "react";

const BleManagerContext = createContext();
export const useBleManager = () => useContext(BleManagerContext);

export const BleManagerProvider = ({ children }) => {
    const [devices, setDevices] = useState(new Map());
    const [names, setNames] = useState(new Map());

    const writeQueues = new Map();

    // 🧩 改进的写入队列：仅保留最新任务
    function getWriteQueue(key) {
        if (!writeQueues.has(key)) {
            let busy = false;
            let pending = null;

            writeQueues.set(key, {
                enqueue: async (task) => {
                    if (busy) {
                        // 丢弃旧任务，仅保留最新
                        pending = task;
                        return;
                    }
                    busy = true;
                    while (task) {
                        const current = task;
                        pending = null;
                        try {
                            await current();
                        } catch (err) {
                            console.error("❌ 写入任务失败:", err);
                        }
                        task = pending;
                    }
                    busy = false;
                },
            });
        }
        return writeQueues.get(key);
    }

    // 🔹 连接设备
    async function connectDevice(name, optional_services) {
        try {
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ name }],
                optionalServices: optional_services,
            });

            const server = await device.gatt.connect();
            device.addEventListener("gattserverdisconnected", onDisconnected);

            // const id = device.id;
            const info = { name, device, server, characteristics: new Map() };
            setDevices((prev) => new Map(prev).set(name, info));
            // setNames((prev) => new Map(prev).set(name, id))

            console.log(`✅ Connected: ${device.name || "Unnamed"} (${name})`);
            return name;
        } catch (e) {
            console.error("连接失败:", e);
            return null;
        }
    }

    // 🔹 断开连接
    async function disconnectDevice(id) {
        const info = devices.get(id);
        if (info && info.device.gatt.connected) {
            info.device.gatt.disconnect();
            console.log(`🔌 Disconnected ${info.device.name}`);
            setDevices((prev) => {
                const map = new Map(prev);
                map.delete(id);
                return map;
            });
        }
    }

    // 🔹 断线回调
    function onDisconnected(event) {
        const device = event.target;
        console.log(`⚠️ Device disconnected: ${device.name}`);
        setDevices((prev) => {
            const map = new Map(prev);
            map.delete(device.id);
            return map;
        });
    }

    // 🔹 获取或缓存特征对象
    async function getCharacteristic(info, serviceUuid, charUuid) {
        const key = `${serviceUuid}_${charUuid}`;
        if (info.characteristics.has(key)) {
            return info.characteristics.get(key);
        }
        const service = await info.server.getPrimaryService(serviceUuid);
        const characteristic = await service.getCharacteristic(charUuid);
        info.characteristics.set(key, characteristic);
        return characteristic;
    }

    // 🔹 通用发送函数
    async function sendCommand(id, serviceUuid, charUuid, data) {
        const info = devices.get(id);
        if (!info) throw new Error("设备未连接");
        // const { server } = info;

        const characteristic = await getCharacteristic(info, serviceUuid, charUuid);

        let payload;
        if (typeof data === "string") {
            payload = new TextEncoder().encode(data);
        } else if (data instanceof Uint8Array || data instanceof ArrayBuffer) {
            payload = data;
        } else {
            throw new Error("sendCommand: data 必须是字符串或Uint8Array/ArrayBuffer");
        }

        // await characteristic.writeValue(payload);
        // console.log(`📤 Sent data to ${id}:`, payload);
        // 🧩 根据id+特征UUID构建队列key，确保每个特征独立顺序执行
        const queueKey = `${id}_${serviceUuid}_${charUuid}`;
        const writeQueue = getWriteQueue(queueKey);

        await writeQueue.enqueue(async () => {
            await characteristic.writeValue(payload);
            console.log(`📤 Sent data to ${id}:`, payload);
        });
    }

    // 🔹 专用函数：发送LED颜色
    async function sendDeskLED(id, serviceUuid, charUuid, r, g, b) {

        const data = new Uint8Array([r, g, b]);
        await sendCommand(id, serviceUuid, charUuid, data);
        console.log(`💡 Sent RGB to ${id}: [${r}, ${g}, ${b}]`);
    }

    return (
        <BleManagerContext.Provider
            value={{
                devices,
                connectDevice,
                disconnectDevice,
                sendCommand,
                sendDeskLED, // 👈 暴露出去
            }}
        >
            {children}
        </BleManagerContext.Provider>
    );
};
