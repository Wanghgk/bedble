import React, {useEffect, useRef, useState} from "react";

import { useLocation } from "react-router-dom";

import { useBleManager } from "../../context/BleManagerContext";

import Style from "./CharLED.module.css"

export default function CharLED() {

    const location = useLocation();
    const { deviceId } = location.state || {};  // ✅ 获取 HomeCard 传来的 id

    const { sendCommand } = useBleManager();


    useEffect(() => {
        console.log(deviceId)
    },[deviceId])

    const handleSend = async (i, delay) => {
        const data = new Uint8Array([i, delay]);
        await sendCommand(deviceId, 0xFF10, 0xFF11, data);
    };

    const presetColors = [
        { name: "关闭", background: "#000", image_index: 0, delay: 10},
        { name: "名牌", background: "url(./images/name1.gif)", image_index: 1, delay: 10},
        { name: "横向外扩", background: "url(./images/wave1.gif)", image_index: 2, delay: 2}
    ];

    const applyPreset = (i, delay) => {
        handleSend(i, delay)
    };
    //1816031385

    return (
        <div className={Style["deskled-container"]}>
            <div className={Style["preset-container"]}>
                {presetColors.map((c, i) => (
                    <div className={Style["preset-item"]} key={c.name}
                         onClick={() => applyPreset(c.image_index, c.delay)}
                    >
                        <div
                            key={i}
                            className={Style["preset-image"]}
                            style={{background: c.background, backgroundSize: "cover"}}
                            title={c.name}
                        ></div>
                        <span>{c.name}</span>
                        <span>帧间隔：{c.delay / 10}s</span>
                    </div>
                ))}
            </div>
        </div>
    )

}