import { FC, useState } from "react";
import { Paper } from "@material-ui/core";
import IOSSwitch from "components/fields/IOSSwitch";

const Status: FC = () => {
    const [status, setStatus] = useState(true);

    return (
        <Paper elevation={0} style={{ backgroundColor: '#F9F9FA', padding: '10px 12px', display: 'flex' }}>
            <label>{status ? 'Connected' : 'Disconnected'}</label>
            <div style={{ width: 6 }} />
            <IOSSwitch checked={status} onChange={() => setStatus(!status)} name="checkedB" />
        </Paper>
    );
};

export default Status;
