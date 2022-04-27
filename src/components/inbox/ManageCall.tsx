import React, { useEffect, useState, useRef } from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, Fab, IconButton, makeStyles, Typography } from "@material-ui/core";
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { answerCall, hangupCall, rejectCall } from 'store/voximplant/actions';
import TextField from '@material-ui/core/TextField';

const ManageCall: React.FC<{}> = ({ }) => {
    const [openDialog, setOpenDialog] = useState(false)
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [numberVox, setNumberVox] = useState("");
    const ringtone = React.useRef<HTMLAudioElement>(null);
    const call = useSelector(state => state.voximplant.call);
    const statusCall = useSelector(state => state.voximplant.statusCall);

    React.useEffect(() => {
        if (call.type === "INBOUND" && statusCall === "CONNECTING") {
            setOpenDialog(true);
            ringtone.current?.pause();
            if (ringtone.current) {
                ringtone.current.currentTime = 0;
            }
            setNumberVox(call.number.split("@")[0].split(":")?.[1] || "")
            ringtone.current?.play();
        } else if (call.type === "INBOUND" && statusCall !== "CONNECTING") {
            setNumberVox(call.number.split("@")[0].split(":")?.[1] || "")
            ringtone.current?.pause();
        }
    }, [call, statusCall])

    return (
        <>
            <Dialog
                open={openDialog}
                fullWidth
                maxWidth={"xs"}
                style={{ zIndex: 99999999 }}>
                <DialogTitle>{"Test"}</DialogTitle>
                <DialogContent>
                    <div>
                        <TextField
                            label="Call from"
                            value={numberVox}
                            fullWidth
                            disabled={statusCall !== "DISCONNECTED"}
                        />
                    </div>
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center', marginBottom: 12 }}>
                    {statusCall === "CONNECTING" && (
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={() => dispatch(answerCall(call.call))}
                        >
                            {"Answer"}
                        </Button>
                    )}
                    {statusCall === "CONNECTING" && (
                        <Button
                            color="primary"
                            variant="contained"
                            style={{ backgroundColor: 'rgb(180, 26, 26)' }}
                            onClick={() => dispatch(rejectCall(call.call))}
                        >
                            {"Reject"}
                        </Button>
                    )}
                    {statusCall === "CONNECTED" && (
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={() => dispatch(hangupCall(call.call))}
                        >
                            {"Hangup"}
                        </Button>
                    )}
                    {statusCall === "DISCONNECTED" && (
                        <Button
                            color="primary"
                            variant="contained"
                            style={{ backgroundColor: 'rgb(180, 26, 26)' }}
                            onClick={() => setOpenDialog(false)}
                        >
                            {"Call"}
                        </Button>
                    )}
                    {statusCall === "DISCONNECTED" && (
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={() => setOpenDialog(false)}
                        >
                            {"Close"}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
            <audio ref={ringtone} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/7120-download-iphone-6-original-ringtone-42676.mp3" />
        </>
    )
}
export default ManageCall;