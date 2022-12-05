/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import { Fab, makeStyles } from "@material-ui/core";
import { useTranslation } from 'react-i18next';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { setTransferAction, transferCall } from 'store/voximplant/actions';
import TextField from '@material-ui/core/TextField';
import PhoneIcon from '@material-ui/icons/Phone';
import { langKeys } from 'lang/keys';
import BackspaceIcon from '@material-ui/icons/Backspace';
import { Card, Portal } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        position: 'fixed',
        zIndex: 9999,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: theme.palette.background.paper,
    },
    gridlinebuttons: {
        display: "grid",
        width: "100%",
        gridTemplateColumns: 'auto [col1] 50px 50px [col2] 50px 50px [col3] 50px auto',
        paddingBottom: 25
    },
}));

interface DialProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    triggerHold: () => void;
}

const Dial: React.FC<DialProps> = ({ open, setOpen, triggerHold }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const [numberVox, setNumberVox] = useState("");

    return (
        <div>
        {open && (
            <Portal>
                <Card className={classes.root} style={{ padding: '10px 20px' }}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <label
                            style={{
                                color: "#B6B4BA",
                                fontSize: "1rem",
                            }}
                        >
                            {t(langKeys.tocall)}
                        </label>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <TextField
                            value={numberVox}
                            style={{ width: "300px", marginBottom: 25, fontSize: '30px' }}
                            onInput={(e: any) => {
                                let val = e.target.value.replace(/[^0-9*#]/g, "")
                                e.target.value = String(val)
                            }}
                            onChange={(e) => setNumberVox(e.target.value)}
                            // inputProps={{
                            //     style: {
                            //         fontSize: "30px",
                            //         textAlign: "center"
                            //     }
                            // }}
                        />
                    </div>
                    <div className={classes.gridlinebuttons}>
                        <Fab
                            style={{ gridColumnStart: "col1", fontSize: 20, color: "#707070" }}
                            onClick={() => setNumberVox(numberVox + "1")}
                        >
                            1
                        </Fab>
                        <Fab
                            style={{ gridColumnStart: "col2", fontSize: 20, color: "#707070" }}
                            onClick={() => setNumberVox(numberVox + "2")}
                        >
                            2
                        </Fab>
                        <Fab
                            style={{ gridColumnStart: "col3", fontSize: 20, color: "#707070" }}
                            onClick={() => setNumberVox(numberVox + "3")}
                        >
                            3
                        </Fab>
                    </div>
                    <div className={classes.gridlinebuttons}>
                        <Fab
                            style={{ gridColumnStart: "col1", fontSize: 20, color: "#707070" }}
                            onClick={() => setNumberVox(numberVox + "4")}
                        >
                            4
                        </Fab>
                        <Fab
                            style={{ gridColumnStart: "col2", fontSize: 20, color: "#707070" }}
                            onClick={() => setNumberVox(numberVox + "5")}
                        >
                            5
                        </Fab>
                        <Fab
                            style={{ gridColumnStart: "col3", fontSize: 20, color: "#707070" }}
                            onClick={() => setNumberVox(numberVox + "6")}
                        >
                            6
                        </Fab>
                    </div>
                    <div className={classes.gridlinebuttons}>
                        <Fab
                            style={{ gridColumnStart: "col1", fontSize: 20, color: "#707070" }}
                            onClick={() => setNumberVox(numberVox + "7")}
                        >
                            7
                        </Fab>
                        <Fab
                            style={{ gridColumnStart: "col2", fontSize: 20, color: "#707070" }}
                            onClick={() => setNumberVox(numberVox + "8")}
                        >
                            8
                        </Fab>
                        <Fab
                            style={{ gridColumnStart: "col3", fontSize: 20, color: "#707070" }}
                            onClick={() => setNumberVox(numberVox + "9")}
                        >
                            9
                        </Fab>
                    </div>
                    <div className={classes.gridlinebuttons}>
                        <Fab
                            style={{ gridColumnStart: "col1", fontSize: 20, color: "#707070" }}
                            onClick={() => setNumberVox(numberVox + "*")}
                        >
                            *
                        </Fab>
                        <Fab
                            style={{ gridColumnStart: "col2", fontSize: 20, color: "#707070" }}
                            onClick={() => setNumberVox(numberVox + "0")}
                        >
                            0
                        </Fab>
                        <Fab
                            style={{ gridColumnStart: "col3", fontSize: 20, color: "#707070" }}
                            onClick={() => setNumberVox(numberVox + "#")}
                        >
                            #
                        </Fab>
                    </div>
                    <div className={classes.gridlinebuttons}>
                        <Fab
                            style={{ gridColumnStart: "col2", fontSize: 20, backgroundColor: "#55bd84" }}
                            color="primary"
                            onClick={() => {
                                dispatch(transferCall({
                                    url: `${ticketSelected?.commentexternalid}?mode=transfer&number=${numberVox}&name=${numberVox}`,
                                    number: ticketSelected?.personcommunicationchannel,
                                    conversationid: ticketSelected?.conversationid!!,
                                    transfernumber: numberVox,
                                    transfername: numberVox
                                }))
                                dispatch(triggerHold)
                                dispatch(setTransferAction(false))
                                setOpen(false)
                            }}
                        >
                            <PhoneIcon style={{ color: "white", width: "35px", height: "35px" }} />
                        </Fab>
                        <Fab
                            style={{ gridColumnStart: "col3", fontSize: 20, color: "#707070" }}
                            onClick={() => setNumberVox(numberVox.slice(0, -1))}
                        >
                            <BackspaceIcon style={{ color: "#707070", width: "35px", height: "35px", paddingRight: 5 }} />
                        </Fab>
                    </div>
                </Card>
            </Portal>
            )}
        </div>
    )
}
export default Dial;
