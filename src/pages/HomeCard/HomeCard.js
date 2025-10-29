import React from "react";
import Style from "./HomeCard.module.css";
import {Link} from "react-router-dom";

export default function HomeCard({ title, image, url="/", id}) {
    return (
        <Link to={url} state={{ deviceId: id }} style={{textDecoration: 'none'}}>
            <div className={Style["home-card"]}>
                {/* 左侧标题区域 */}
                <div className={Style["card-title"]}>
                    <span>{title}</span>
                </div>

                {/* 右侧图片区域 */}
                <div className={Style["card-img"]}>
                    <img alt={title} src={image}/>
                </div>
            </div>
        </Link>

    );
}
