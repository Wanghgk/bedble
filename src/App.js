import React, {useEffect, useState, useRef} from "react";
import {NavLink,useRoutes } from "react-router-dom";

import { BleManagerProvider, useBleManager } from "./context/BleManagerContext";

import routes from "./routes"

import './App.css';

function App() {

    const element = useRoutes(routes);

    return (
        <BleManagerProvider>
            <div className={"app"}>
                <div className="app-header">

                </div>
                <div className="app-body">
                    {element}
                </div>
                <div className="app-footer"></div>
            </div>
        </BleManagerProvider>
    );
}

export default App;
