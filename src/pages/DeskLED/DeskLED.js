import React, {useEffect, useRef, useState} from "react";

import { useLocation } from "react-router-dom";

import { useBleManager } from "../../context/BleManagerContext";

import Style from "./DeskLED.module.css"

export default function DeskLED() {

    const location = useLocation();
    const { deviceId } = location.state || {};  // ✅ 获取 HomeCard 传来的 id

    const { sendDeskLED } = useBleManager();

    const [rgb, setRgb] = useState({ r: 0, g: 0, b: 0 });
    const r_slider = useRef(null);
    const g_slider = useRef(null);
    const b_slider = useRef(null);

    useEffect(() => {
        console.log(deviceId)
    },[deviceId])

    const handleSend = (r, g, b) => {
        sendDeskLED(deviceId, 0xFF10, 0xFF11, r, g, b);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(r_slider.current.value, g_slider.current.value, b_slider.current.value);
        handleSend(r_slider.current.value, g_slider.current.value, b_slider.current.value)
        setRgb({ ...rgb, [name]: parseInt(value) });
    };

    const presetColors = [
        // ⑴. C社6人 (Crypton Future Media)
        { name: "初音ミク (苍绿色)", rgb: [57, 197, 187], hex: "#39C5BB" },
        { name: "镜音リン (橘黄)", rgb: [255, 165, 0], hex: "#FFA500" },
        { name: "镜音レン (明黄)", rgb: [255, 226, 17], hex: "#FFE211" },
        { name: "巡音ルカ (粉)", rgb: [250, 175, 190], hex: "#FAAFBE" },
        { name: "MEIKO (酒红)", rgb: [216, 0, 0], hex: "#D80000" },
        { name: "KAITO (蓝)", rgb: [0, 0, 255], hex: "#0000FF" },

        // ⑵. Vsinger6人
        { name: "洛天依 (天蓝)", rgb: [102, 204, 255], hex: "#66CCFF" },
        { name: "言和 (薄荷绿)", rgb: [0, 255, 204], hex: "#00FFCC" },
        { name: "乐正绫 (红)", rgb: [238, 0, 0], hex: "#EE0000" },
        { name: "乐正龙牙 (深绿)", rgb: [0, 102, 102], hex: "#006666" },
        { name: "墨清弦 (黄)", rgb: [255, 255, 0], hex: "#FFFF00" },
        { name: "徵羽摩柯 (深蓝)", rgb: [0, 128, 255], hex: "#0080FF" },

        // ⑶. 五维介质5人
        { name: "星尘 (蓝紫)", rgb: [153, 153, 255], hex: "#9999FF" },
        { name: "星尘 (黄)", rgb: [255, 255, 0], hex: "#FFFF00" }, // 注：星尘有两个颜色
        { name: "赤羽 (红)", rgb: [255, 64, 4], hex: "#FF4004" },
        { name: "海伊 (浅蓝)", rgb: [51, 153, 255], hex: "#3399FF" },
        { name: "诗岸 (淡黄)", rgb: [246, 190, 113], hex: "#F6BE71" },
        // 苍穹应援色不明，已跳过

        // ⑷. 其它
        { name: "心华 (粉)", rgb: [238, 130, 238], hex: "#EE82EE" },
        { name: "SeeU (鲜橙色)", rgb: [255, 128, 0], hex: "#FF8000" },
        { name: "GUMI (亮绿)", rgb: [204, 255, 0], hex: "#CCFF00" },
        { name: "神威乐步 (茄紫)", rgb: [152, 128, 215], hex: "#9880D7" },
        { name: "LUMi (浅蓝)", rgb: [131, 197, 214], hex: "#83C5D6" },
        { name: "Lily (亮黄)", rgb: [249, 238, 112], hex: "#F9EE70" },
        { name: "IA (淡粉)", rgb: [255, 171, 188], hex: "#FFABBC" },
        { name: "Yumeo (淡绿)", rgb: [152, 251, 152], hex: "#98FB98" },
        { name: "Oliver (亮黄)", rgb: [255, 255, 204], hex: "#FFFFCC" }
    ];

    const applyPreset = (r, g, b) => {
        setRgb({ r, g, b });
        handleSend(r, g, b)
    };

    return (
        <div className={Style["deskled-container"]}>

            <div className={Style["slider-group"]}>
                <div className={[`${Style["slider-wrapper"]}`, `${Style["red"]}`].join(' ')}>
                    <input
                        type="range"
                        min="0"
                        max="255"
                        name="r"
                        value={rgb.r}
                        ref={r_slider}
                        onChange={handleChange}
                        orient="vertical"
                    />
                    <span>R</span>
                </div>
                <div className={[`${Style["slider-wrapper"]}`, `${Style["green"]}`].join(' ')}>
                    <input
                        type="range"
                        min="0"
                        max="255"
                        name="g"
                        value={rgb.g}
                        ref={g_slider}
                        onChange={handleChange}
                        orient="vertical"
                    />
                    <span>G</span>
                </div>
                <div className={[`${Style["slider-wrapper"]}`, `${Style["blue"]}`].join(' ')}>
                    <input
                        type="range"
                        min="0"
                        max="255"
                        name="b"
                        value={rgb.b}
                        ref={b_slider}
                        onChange={handleChange}
                        orient="vertical"
                    />
                    <span>B</span>
                </div>
            </div>

            <div
                className={Style["color-preview"]}
                style={{backgroundColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}}
            ></div>

            <div className={Style["preset-container"]}>
                {presetColors.map((c, i) => (
                    <div
                        key={i}
                        className={Style["preset-color"]}
                        style={{backgroundColor: `rgb(${c.rgb[0]}, ${c.rgb[1]}, ${c.rgb[2]})`}}
                        onClick={() => applyPreset(...c.rgb)}
                        title={c.name}
                    ></div>
                ))}
            </div>
        </div>
    )

}