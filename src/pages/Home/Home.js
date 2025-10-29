import React, {useEffect, useRef, useState} from "react";
import { useLocation } from "react-router-dom";

import {useBleManager } from "../../context/BleManagerContext";
import Style from "./Home.module.css"

import HomeCard from "../HomeCard/HomeCard";

export default function Home() {

    const { devices, connectDevice, disconnectDevice } = useBleManager();
    const [connectedDevices, setConnectedDevices] = useState([]);  // 存储已连接设备
    const [isConnecting, setIsConnecting] = useState(false);

    // const ESP32_LED_ID = useRef(null)

    useEffect(() => {
        const arr = Array.from(devices.values()).map((entry) => (entry.name));
        setConnectedDevices(arr);
        console.log("📡 当前已连接设备:", arr);
    }, [devices]);


    // 点击按钮依次连接多个设备
    const handleConnectMultiple = async () => {
        try {
            setIsConnecting(true);

            // ESP32_LED_ID.current = await connectDevice("ESP32_LED", [0xFF10]);
            await connectDevice("ESP32_LED", [0xFF10]);

            // 你可以在这里定义要连接的服务UUID列表
            // const targetServices = [
            //     { name: "ESP32_LED", serviceUUIDs: [0xFF10] },
            // ];

            // const newConnections = [];

            // 遍历每个目标设备，依次发起连接请求
            // for (const target of targetServices) {
            //     console.log(`🔍 尝试连接设备: ${target.name}`);
            //
            //     const device = await connectDevice(target.name, target.serviceUUIDs);
            //     if (device) {
            //         newConnections.push(device);
            //         console.log(`✅ 已连接: ${device.name || target.name}`);
            //     }
            // }

            // 更新已连接设备列表
            // setConnectedDevices((prev) => [...prev, ...newConnections]);
        } catch (err) {
            console.error("❌ 连接设备失败:", err);
            alert("连接失败，请确保所有设备都在蓝牙范围内。");
        } finally {
            setIsConnecting(false);
        }
    };

    // 断开所有设备
    const handleDisconnectAll = () => {
        connectedDevices.forEach((dev) => disconnectDevice(dev));
        setConnectedDevices([]);
        console.log("🔌 已断开所有设备");
    };


    return (
        <div className={Style["home"]}>
            <div className={Style["cards-list"]}>
                <HomeCard title="Home Card" image={"./images/芙芙.jpg"} url={"deskled"} id={"ESP32_LED"}/>
                <HomeCard title="Home Card" image={"./images/芙芙.jpg"} url={"deskled"} id={"ESP32_LED"}/>
                <HomeCard title="Home Card" image={"./images/芙芙.jpg"} url={"deskled"} id={"ESP32_LED"}/>
                <HomeCard title="Home Card" image={"./images/芙芙.jpg"} url={"deskled"} id={"ESP32_LED"}/>
            </div>
            <div className={Style["connect-box"]}>
                <button
                    className={`${Style["connect-btn"]} ${isConnecting ? Style["btn-disabled"] : ""}`}
                    onClick={connectedDevices.length ? handleDisconnectAll : handleConnectMultiple}
                    disabled={isConnecting}
                >
                    {isConnecting
                        ? "连接中..."
                        : connectedDevices.length
                            ? "断开所有设备"
                            : "连接多个设备"}
                </button>

                {connectedDevices.length > 0 && (
                    <div className={Style["status-list"]}>
                        {connectedDevices.map((dev, idx) => (
                            <p key={idx} className={Style["status-text"]}>
                                ✅ 已连接：{dev || `未知设备 ${idx + 1}`}
                            </p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}