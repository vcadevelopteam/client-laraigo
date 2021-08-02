import { FC, useState } from "react";
import { Container, Paper } from "@material-ui/core";
import { Notifications, NotificationImportant } from "@material-ui/icons";

const NotificationMenu: FC = () => {
    return (
        <div>
            <Notifications />
        </div>
    );
};

export default NotificationMenu;
