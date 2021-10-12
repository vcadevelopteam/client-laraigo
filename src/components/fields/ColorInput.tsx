import { makeStyles } from "@material-ui/core";
import { ArrowDropDown } from "@material-ui/icons";
import Close from "@material-ui/icons/Close";
import { FC, useState } from "react";
import { ChromePicker, ColorChangeHandler } from "react-color";

const useColorInputStyles = makeStyles(theme => ({
    colorInputContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: 60,
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
        borderRadius: 2,
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

const ColorInput: FC<{ hex: string, onChange: ColorChangeHandler }> = ({ hex, onChange }) => {
    const classes = useColorInputStyles();
    const [open, setOpen] = useState(false);

    const iconStyle = { style: { width: 'unset', height: 'unset' } };
    const Icon: FC = () => open ? <Close {...iconStyle} /> : <ArrowDropDown {...iconStyle} />;

    return (
        <div className={classes.colorInputContainer}>
            <div style={{ backgroundColor: hex }} className={classes.colorInputPreview} />
            <div className={classes.colorInput} onClick={() => setOpen(!open)}>
                <Icon />
                <div className={classes.colorInputSplash} />
            </div>
            {open && (
                <div className={classes.popover}>
                    <ChromePicker color={hex} onChange={onChange} />
                </div>
            )}
        </div>
    );
}

export default ColorInput;
