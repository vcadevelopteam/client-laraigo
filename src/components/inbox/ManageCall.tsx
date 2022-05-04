import React, { useEffect, useState, useRef } from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, Fab, IconButton, makeStyles, Typography } from "@material-ui/core";
import { useTranslation } from 'react-i18next';
import { useSelector } from 'hooks';
import PersonIcon from '@material-ui/icons/Person';
import { useDispatch } from 'react-redux';
import { answerCall, hangupCall, rejectCall, makeCall, holdCall, setModalCall, muteCall,unmuteCall } from 'store/voximplant/actions';
import TextField from '@material-ui/core/TextField';
import PhoneIcon from '@material-ui/icons/Phone';
import CallEndIcon from '@material-ui/icons/CallEnd';
import clsx from 'clsx';
import MicIcon from '@material-ui/icons/Mic';
import PauseIcon from '@material-ui/icons/Pause';
import HeadsetMicIcon from '@material-ui/icons/HeadsetMic';
import MicOffIcon from '@material-ui/icons/MicOff';
import { convertLocalDate, secondsToTime, getSecondsUntelNow } from 'common/helpers';
import { langKeys } from 'lang/keys';

const useStyles = makeStyles(theme => ({
    grey: {
        backgroundColor: '#bdbdbd'
    },
    red: {
        backgroundColor: 'rgb(180, 26, 26)'
    },
}));

const ManageCall: React.FC<{}> = ({ }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const phoneinbox = useSelector(state => state.inbox.person.data?.phone);
    const [numberVox, setNumberVox] = useState("");
    const [hold, sethold] = useState(true);
    const [mute, setmute] = useState(false);
    const ringtone = React.useRef<HTMLAudioElement>(null);
    const call = useSelector(state => state.voximplant.call);
    const showcall = useSelector(state => state.voximplant.showcall);
    const statusCall = useSelector(state => state.voximplant.statusCall);
    const [date, setdate] = useState(new Date());
    const [time, settime] = useState(0);
    

    React.useEffect(() => {
        if (call.type === "INBOUND" && statusCall === "CONNECTING") {
            setdate(new Date())
            settime(0)
            dispatch(setModalCall(true))
            sethold(true)
            setmute(false)
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
    React.useEffect(() => {
        if(statusCall === "CONNECTED"){
            setdate(new Date())
            settime(0)
        }
    }, [statusCall])
    React.useEffect(() => {
        let timer = setTimeout(() => {
            settime(getSecondsUntelNow(convertLocalDate(String(date))));
            if(time>=30 && (call.type === "INBOUND" && statusCall === "CONNECTING")){
                dispatch(rejectCall(call.call))
                settime(0)
            }
        }, 1000)
        
        return () => {
            timer && clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [time]);
    React.useEffect(() => {
        if(phoneinbox){
            setNumberVox(phoneinbox)
        }
    }, [phoneinbox])

    return (
        <>
            <Dialog
                open={showcall}
                fullWidth
                maxWidth={"xs"}
                style={{ zIndex: 99999999 }}>
                <DialogTitle>
                    <div style={{ marginLeft: "auto", marginRight: "auto", width: "100px", height: "100px", borderRadius: "50%", backgroundColor: "#bdbdbd" }}>
                        <PersonIcon style={{color: "white", width: "100px", height: "100px"}}/>    
                    </div>
                    {statusCall === "CONNECTED" && <div style={{ fontSize: "15px",marginLeft: "auto", marginRight: "auto", width: "100px",textAlign:"center"}}>{(secondsToTime(time || 0))}</div>}
                </DialogTitle>
                <DialogContent>
                    {(call.type === "OUTBOUND" && statusCall === "CONNECTING")&&(
                        <div style={{ width: "100%", textAlign: "center"}}>
                            {t(langKeys.outboundcall)}
                        </div>
                    )} 
                    {(call.type === "INBOUND" && statusCall === "CONNECTING")&&(
                        <div style={{ width: "100%", textAlign: "center"}}>
                            {t(langKeys.inboundcall)}
                        </div>
                    )} 
                    { statusCall === "DISCONNECTED"?
                        (<div>
                            <TextField
                                label={t(langKeys.phone)}
                                value={numberVox}
                                fullWidth
                                type="number"
                                onChange={(e) => setNumberVox(e.target.value)}
                                disabled={statusCall !== "DISCONNECTED"}
                            />
                        </div>):(
                        <div style={{ marginLeft: "auto", marginRight: "auto", textAlign: "center", fontSize: "20px" }}>
                            {numberVox}
                        </div>
                        )
                    }
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center', marginBottom: 12 }}>
                    
                    {(call.type === "OUTBOUND" && statusCall === "CONNECTING") && (
                        <>
                            <IconButton //rejectcall
                                style={{ marginLeft: "auto",marginRight: "auto",width: "50px", height: "50px", borderRadius: "50%", backgroundColor: 'rgb(180, 26, 26)' }}
                                onClick={() => {
                                    dispatch(holdCall({call: call.call, flag: true})); 
                                    sethold(true)
                                    setmute(false)
                                    dispatch(hangupCall(call.call))
                                }}
                            >
                                <CallEndIcon style={{color: "white", width: "35px", height: "35px"}}/> 
                            </IconButton>
                        </>
                    )}
                    {(call.type === "INBOUND" && statusCall === "CONNECTING") && (
                        <>
                            <IconButton //answercall
                                style={{ marginLeft: "10px",marginRight: "auto",width: "50px", height: "50px", borderRadius: "50%", backgroundColor: '#00a884' }}
                                onClick={() => dispatch(answerCall(call.call))}
                            >
                                <PhoneIcon style={{color: "white", width: "35px", height: "35px"}}/> 
                            </IconButton>
                            <IconButton //rejectcall
                                style={{ marginLeft: "auto",marginRight: "10px",width: "50px", height: "50px", borderRadius: "50%", backgroundColor: 'rgb(180, 26, 26)' }}
                                onClick={() => dispatch(rejectCall(call.call))}
                            >
                                <CallEndIcon style={{color: "white", width: "35px", height: "35px"}}/> 
                            </IconButton>
                        </>
                    )}
                    {statusCall === "CONNECTED" && (
                        <div style={{display:"grid", width: "100%", gridTemplateColumns: 'auto [col1] 50px auto [col2] 50px auto [col3] 50px auto [col4] 50px auto', }}>
                            {mute?(
                            <IconButton //unmuteself
                                style={{ gridColumnStart: "col1", marginLeft: "auto",marginRight: "10px",width: "50px", height: "50px", borderRadius: "50%", backgroundColor: 'rgb(180, 26, 26)' }}
                                onClick={()=>{dispatch(unmuteCall(call.call));setmute(false)}}>
                                <MicOffIcon style={{color: "white", width: "35px", height: "35px"}}/> 
                            </IconButton>
                            ):(
                            <IconButton //muteself
                                style={{ gridColumnStart: "col1", marginLeft: "auto",marginRight: "10px",width: "50px", height: "50px", borderRadius: "50%", backgroundColor: '#bdbdbd' }}
                                onClick={()=>{dispatch(muteCall(call.call));setmute(true)}}>
                                <MicIcon style={{color: "white", width: "35px", height: "35px"}}/> 
                            </IconButton>
                            )}
                            <IconButton //holdcall
                                style={{ gridColumnStart: "col2", marginLeft: "auto",marginRight: "10px",width: "50px", height: "50px", borderRadius: "50%", backgroundColor: hold?'#bdbdbd':'rgb(180, 26, 26)' }}
                                onClick={() => {
                                    dispatch(holdCall({call: call.call, flag: !hold})); 
                                    sethold(!hold)
                                }}
                            >
                                <PauseIcon style={{color: "white", width: "35px", height: "35px"}}/> 
                            </IconButton>
                            <IconButton //derivar
                                style={{ gridColumnStart: "col3", marginLeft: "auto",marginRight: "10px",width: "50px", height: "50px", borderRadius: "50%", backgroundColor: '#bdbdbd' }}
                                onClick={() => dispatch(hangupCall(call.call))}
                            >
                                <HeadsetMicIcon style={{color: "white", width: "35px", height: "35px"}}/> 
                            </IconButton>
                            <IconButton //hangupcall
                                style={{ gridColumnStart: "col4", marginLeft: "auto",marginRight: "10px",width: "50px", height: "50px", borderRadius: "50%", backgroundColor: 'rgb(180, 26, 26)' }}
                                onClick={() => dispatch(hangupCall(call.call))}
                            >
                                <CallEndIcon style={{color: "white", width: "35px", height: "35px"}}/> 
                            </IconButton>

                        </div>
                    )}
                    {statusCall === "DISCONNECTED" && (
                        <>
                            <IconButton//makecall
                                style={{ marginLeft: "10px",marginRight: "auto",width: "50px", height: "50px", borderRadius: "50%", backgroundColor: '#00a884' }}
                                onClick={() => {
                                    dispatch(makeCall(numberVox))
                                    sethold(true)
                                    setmute(false)
                                }}
                            >
                                <PhoneIcon style={{color: "white", width: "35px", height: "35px"}}/> 
                            </IconButton>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={() => dispatch(setModalCall(false))}
                            >
                                {"Close"}
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
            <audio ref={ringtone} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/7120-download-iphone-6-original-ringtone-42676.mp3" />
        </>
    )
}
export default ManageCall;