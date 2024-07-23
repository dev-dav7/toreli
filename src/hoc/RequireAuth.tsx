import {useLocation, Navigate, Outlet} from 'react-router-dom';
import React, {useContext} from "react";
import {AuthContext} from "../main";

function RequireAuth() {
    const location = useLocation()
    const {userStore} = useContext(AuthContext)

    return !userStore.unsafeAuth()
        ? <Navigate to="/auth" state={{from: location}}/>
        : <Outlet/>
}

export {RequireAuth};