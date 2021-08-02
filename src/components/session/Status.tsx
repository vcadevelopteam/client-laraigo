import { FC, useState } from "react";
import { Paper } from "@material-ui/core";
import IOSSwitch from "components/fields/IOSSwitch";

const Status: FC = () => {
    const [status, setStatus] = useState(true);

    return (
        <Paper elevation={0}>
            <label>{status ? 'Connected' : 'Disconnected'}</label>
            <IOSSwitch checked={status} onChange={() => setStatus(!status)} name="checkedB" />
        </Paper>
    );
};

export default Status;
