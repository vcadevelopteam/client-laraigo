import { makeStyles } from "@material-ui/core";
import { ArrowDropDown } from "@material-ui/icons";
import Close from "@material-ui/icons/Close";
import React, { FC, useCallback, useEffect, useState } from "react";
import { ChromePicker, ColorChangeHandler, ColorResult } from "react-color";

interface ScheduleInputProps {
    // hex: string;
    // onChange: ColorChangeHandler;
    // disabled?: boolean;
}

const useScheduleStyles = makeStyles(theme => ({
    colorInputContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: 60,
        height: 30,
        cursor: 'pointer',
        borderRadius: 2,
        position: 'relative',
    }
}));


const Schedule: FC<ScheduleInputProps> = ({  }) => {
    const classes = useScheduleStyles();
    const [open, setOpen] = useState(false);


    return (
        <div>Schedule   11111111</div>
    )
}

export default Schedule;
