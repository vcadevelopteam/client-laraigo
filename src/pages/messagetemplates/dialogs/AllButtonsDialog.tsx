import { IconButton, makeStyles } from "@material-ui/core";
import { DialogZyx } from "components";
import React from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { Dictionary } from "@types";
import ReplyIcon from '@material-ui/icons/Reply';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import PhoneIcon from '@material-ui/icons/Phone';

const useStyles = makeStyles(() => ({
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        flexGrow: 1,
        textAlign: "center",
        fontSize: 17,
        fontWeight: "bold",
    },
    dialog: {
        display: "flex",
        flexDirection: "column",
    },
    cardButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        color: '#009C8F',
        borderTop: '1px solid #DDDDDD',
        gap: 6,
    },
    cardButton2: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 10px 0px 10px',
        color: '#009C8F',
        borderTop: '1px solid #DDDDDD',
        gap: 6,
    },
    icon: {
        color: '#009C8F'
    },
    btntext: {
        flexGrow: 1,
        textAlign: "center",
    }
}));

const AllButtonsDialog: React.FC<{
    openModal: boolean;
    setOpenModal: (dat: boolean) => void;
    buttons: Dictionary[];
}> = ({ openModal, setOpenModal, buttons }) => {
    const classes = useStyles();

    const handleClose = () => {
        setOpenModal(false);
    }

    return (
        <DialogZyx open={openModal} title={''} maxWidth="xs">
            <div className={classes.dialog}>
                <div className={classes.header}>
                    <IconButton onClick={handleClose}>
                        <ClearIcon/>
                    </IconButton>
                    <span className={classes.title}>All Options</span>
                </div>
                <div>
                    {buttons.map((btn: Dictionary, index: number) => {
                        let icon;
                        switch (btn.type) {
                            case 'text':
                                icon = <ReplyIcon className={classes.icon} />;
                                break;
                            case 'URL':
                                icon = <OpenInNewIcon className={classes.icon} />;
                                break;
                            case 'PHONE':
                                icon = <PhoneIcon className={classes.icon} />;
                                break;
                            default:
                                icon = null;
                        }
                        return (
                            <div key={index}>
                                <div className={index === buttons.length - 1 ? classes.cardButton2 : classes.cardButton}>
                                    {icon}
                                    <span className={classes.btntext}>{btn.text}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </DialogZyx>
    );
};

export default AllButtonsDialog;