import {Outlet} from "react-router-dom";
import React from "react";

function Layout() {
    return (
        <div style={{
            position:"absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            overflowY:"hidden"
        }}>
            <Outlet/>
        </div>
    )
}

export {Layout}