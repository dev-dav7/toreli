import React from 'react';
import {Link} from "react-router-dom";
import {observer} from "mobx-react-lite";

function NotFoundPage() {
    return (
        <div className="notFoundPage">
            По укзаном адресу страницы не существует.
            <Link to={"/"}>На главную</Link>
        </div>
    );
}

export default observer(NotFoundPage);
