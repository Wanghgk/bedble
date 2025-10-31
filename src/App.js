import React, {useEffect, useState, useRef} from "react";
import {Link,useRoutes } from "react-router-dom";

import { BleManagerProvider } from "./context/BleManagerContext";

import routes from "./routes"

import './App.css';

function App() {

    const element = useRoutes(routes);

    return (
        <BleManagerProvider>
            <div className="blur-background"></div>
            <div className={"app"}>
                <div className="app-header">
                </div>
                <div className="app-body">
                    {element}
                </div>
                <div className="app-footer">
                    <Link to={'/'}>
                        <div className="app-footer-link">
                            <span>返回主页</span>
                        </div>
                    </Link>
                </div>
                {/*<div className="app-footer"></div>*/}
            </div>
        </BleManagerProvider>
    );
}

export default App;
