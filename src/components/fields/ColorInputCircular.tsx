import { makeStyles } from "@material-ui/core";
import { ArrowDropDown } from "@material-ui/icons";
import Close from "@material-ui/icons/Close";
import React, { FC, useCallback, useEffect, useState } from "react";
import { ChromePicker, ColorChangeHandler, ColorResult } from "react-color";

interface ColorInputCircularProps {
    hex: string;
    onChange: ColorChangeHandler;
    disabled?: boolean;
}

const useColorInputCircularStyles = makeStyles(theme => ({
    colorInputContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: 30,
        height: 30,
        cursor: 'pointer',
        borderRadius: 2,
        position: 'relative',
    },
    colorInput: {
        position: 'relative',
        flexGrow: 1,
        borderRadius: '0 2px 2px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    colorInputSplash: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        borderRadius: 2,
        '&:hover': {
            backgroundColor: 'black',
            opacity: .15,
        },
    },
    colorInputPreview: {
        flexGrow: 1,
        borderRadius: 15,
        border: "1px solid black"
    },
    popover: {
        position: 'absolute',
        zIndex: 2,
        top: 36,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
    },
}));

const iconStyle = { style: { width: 'unset', height: 'unset' } };

const ColorInputCircular: FC<ColorInputCircularProps> = ({ hex, onChange, disabled = false }) => {
    const classes = useColorInputCircularStyles();
    const [open, setOpen] = useState(false);

    const Icon: FC = () => open ? <Close {...iconStyle} /> : <ArrowDropDown {...iconStyle} />;

    useEffect(() =>{
        if (disabled && open) setOpen(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [disabled]);

    const handleChange = useCallback((v: ColorResult, e: React.ChangeEvent<HTMLInputElement>) => {
        if (!disabled) onChange(v, e);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [disabled]);

    const handleOpen = useCallback(() => {
        if (!disabled) setOpen(!open);
    }, [disabled, open]);

    return (
        <div className={classes.colorInputContainer}>
            <div style={{ backgroundColor: hex }} className={classes.colorInputPreview} onClick={handleOpen}/>
            {open && (
                <div className={classes.popover}>
                    <ChromePicker color={hex} onChange={handleChange} />
                </div>
            )}
        </div>
    );
}

export default ColorInputCircular;
