import React, { useEffect, FC, useState, useRef, MouseEventHandler } from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import { Avatar, Button, Fab, makeStyles, MenuItem, Tooltip, Typography } from "@material-ui/core";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DialpadIcon from '@material-ui/icons/Dialpad';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'hooks';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { useDispatch } from 'react-redux';
import { answerCall, hangupCall, rejectCall, makeCall, holdCall, setModalCall, muteCall,unmuteCall } from 'store/voximplant/actions';
import TextField from '@material-ui/core/TextField';
import PhoneIcon from '@material-ui/icons/Phone';
import CallEndIcon from '@material-ui/icons/CallEnd';
import MicIcon from '@material-ui/icons/Mic';
import PauseIcon from '@material-ui/icons/Pause';
import HeadsetMicIcon from '@material-ui/icons/HeadsetMic';
import MicOffIcon from '@material-ui/icons/MicOff';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, AntTab, TemplateSwitch } from 'components';
import { Box, Grid, IconButton, InputAdornment, Tabs } from '@material-ui/core';
import { convertLocalDate, secondsToTime, getSecondsUntelNow } from 'common/helpers';
import { langKeys } from 'lang/keys';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';
import PhoneCallbackIcon from '@material-ui/icons/PhoneCallback';
import BackspaceIcon from '@material-ui/icons/Backspace';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
    grey: {
        backgroundColor: '#bdbdbd'
    },
    red: {
        backgroundColor: 'rgb(180, 26, 26)'
    },
    tabs: {
        paddingTop: 15,
        paddingBottom: 15,
    },
    root: {
        margin: 0,
        padding: theme.spacing(2),
        backgroundColor: "#7721ad",
        color: "white",
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: "white",
    },
    numpadbuttons:{
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        backgroundColor: '#e7e3e3'
    },
    gridlinebuttons:{
        display:"grid", 
        width: "100%", 
        gridTemplateColumns: 'auto [col1] 50px 50px [col2] 50px 50px [col3] 50px auto', 
        paddingBottom: 25
    },
}));

const useNotificaionStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(1),
            backgroundColor: 'inherit',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            textAlign: 'start',
            width: "100%",
        },
        row: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
        },
        title: {
            fontWeight: 'bold',
            whiteSpace: "initial",
            width:"calc(100% - 40px)"
        },
        date: {
            fontSize: 11,
            color: 'grey',
            textAlign: 'right',
        },
        textOneLine: {
            flexGrow: 1,
            lineHeight: 1.1,
            overflow: 'hidden',
        },
        description: {
            whiteSpace: "initial",
            width:"calc(100% - 40px)"
        },
    }),
);

interface NotificaionMenuItemProps {
    title: React.ReactNode;
    description: React.ReactNode;
    // notification: LeadActivityNotification,
    image: string;
    user: string;
    date: React.ReactNode;
    onClick?: MouseEventHandler<HTMLLIElement>;
}

const NotificaionMenuItem: FC<NotificaionMenuItemProps> = ({ title, description, onClick, user }) => {
    const classes = useNotificaionStyles();

    return (
        <MenuItem button className={classes.root} onClick={onClick}>
            <div style={{gap: 8, alignItems: 'center', width: '100%', display:"grid", gridTemplateColumns: '[col1] 30px [col2] auto  5px [col3] 50px', }}>
                <div style={{gridColumnStart:"col1"}}>
                    <Tooltip title={user}>
                        <Avatar style={{ width: 30, height: 30, fontSize: 18 }} >
                            {user?.split(" ").reduce((acc, item) => acc + (acc.length < 2 ? item.substring(0, 1).toUpperCase() : ""), "")}
                        </Avatar>
                    </Tooltip>
                </div>
                <div  style={{gridColumnStart:"col2"}}>
                    <div className={classes.textOneLine}>
                        <div className={classes.title}>{title}</div>
                    </div>
                    <div className={clsx(classes.description, classes.textOneLine)}>
                        <span>{description}</span>
                    </div>
                </div>
                <div  style={{gridColumnStart:"col3"}}>
                    Ayer
                </div>
            </div>
        </MenuItem>
    );
}


const MakeCall: React.FC<{}> = ({ }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const phoneinbox = useSelector(state => state.inbox.person.data?.phone);
    const [numberVox, setNumberVox] = useState("");
    const [hold, sethold] = useState(true);
    const [mute, setmute] = useState(false);
    const [advisertodiver, setadvisertodiver] = useState("");
    const [pageSelected, setPageSelected] = useState(0);
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
    }, [call, dispatch, statusCall])
    
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
                <MuiDialogTitle disableTypography className={classes.root}>
                    <Typography variant="h6">{t(langKeys.phone)}</Typography>
                    <IconButton aria-label="close" className={classes.closeButton} onClick={()=>dispatch(setModalCall(false))}>
                        <HighlightOffIcon style={{width: 30, height: 30}} />
                    </IconButton>
                </MuiDialogTitle>
                <DialogContent style={{padding: 0}}>
                    <Tabs
                        value={pageSelected}
                        indicatorColor="primary"
                        variant="fullWidth"
                        style={{ borderBottom: '1px solid white', backgroundColor: '#7721ad'}}
                        textColor="primary"
                        onChange={(_, value) => setPageSelected(value)}
                    >
                        <AntTab label={<ContactPhoneIcon style={{color: pageSelected===0?"gold":"white"}}/>} />
                        <AntTab label={<DialpadIcon style={{color: pageSelected===1?"gold":"white"}}/>} />
                        <AntTab label={<PhoneCallbackIcon style={{color: pageSelected===2?"gold":"white"}}/>} />
                    </Tabs>
                </DialogContent>
                {pageSelected === 0 && 
                    <div className={classes.tabs}>
                        <div style={{ display:"flex", width: "100%", justifyContent: "center", marginTop: 15 }}>
                            <FieldSelect
                                label={t(langKeys.advisor)}
                                className="col-12"
                                valueDefault={advisertodiver}
                                style={{ marginRight: "auto", marginLeft: "auto", width: "400px" }}
                                onChange={(value) => setadvisertodiver(value?.userid || '')}
                                error={advisertodiver? "": t(langKeys.required)}
                                data={[]}
                                optionDesc="displayname"
                                optionValue="userid"
                            />
                        </div>  
                    </div>
                }
                {pageSelected === 1 &&
                    <div className={classes.tabs}>
                        <div style={{ display:"flex", width: "100%" }}>
                            <TextField
                                label={t(langKeys.phone)}
                                value={numberVox}
                                style={{ marginRight: "auto", marginLeft: "auto", width: "400px", marginBottom: 25 }}
                                type="tel"
                                onChange={(e) => setNumberVox(e.target.value)}
                                disabled={statusCall !== "DISCONNECTED"}
                            />
                        </div>
                        <div className={classes.gridlinebuttons}>
                            <IconButton 
                                className={classes.numpadbuttons}
                                style={{ gridColumnStart: "col1" }}
                                onClick={() => setNumberVox(numberVox + "1")}
                            >
                                1
                            </IconButton>
                            <IconButton 
                                className={classes.numpadbuttons}
                                style={{ gridColumnStart: "col2" }}
                                onClick={() => setNumberVox(numberVox + "2")}
                            >
                                2
                            </IconButton>
                            <IconButton 
                                className={classes.numpadbuttons}
                                style={{ gridColumnStart: "col3" }}
                                onClick={() => setNumberVox(numberVox + "3")}
                            >
                                3
                            </IconButton>
                        </div>
                        <div className={classes.gridlinebuttons}>
                            <IconButton 
                                className={classes.numpadbuttons}
                                style={{ gridColumnStart: "col1" }}
                                onClick={() => setNumberVox(numberVox + "4")}
                            >
                                4
                            </IconButton>
                            <IconButton 
                                className={classes.numpadbuttons}
                                style={{ gridColumnStart: "col2" }}
                                onClick={() => setNumberVox(numberVox + "5")}
                            >
                                5
                            </IconButton>
                            <IconButton 
                                className={classes.numpadbuttons}
                                style={{ gridColumnStart: "col3" }}
                                onClick={() => setNumberVox(numberVox + "6")}
                            >
                                6
                            </IconButton>
                        </div>
                        <div className={classes.gridlinebuttons}>
                            <IconButton 
                                className={classes.numpadbuttons}
                                style={{ gridColumnStart: "col1" }}
                                onClick={() => setNumberVox(numberVox + "7")}
                            >
                                7
                            </IconButton>
                            <IconButton 
                                className={classes.numpadbuttons}
                                style={{ gridColumnStart: "col2" }}
                                onClick={() => setNumberVox(numberVox + "8")}
                            >
                                8
                            </IconButton>
                            <IconButton 
                                className={classes.numpadbuttons}
                                style={{ gridColumnStart: "col3" }}
                                onClick={() => setNumberVox(numberVox + "9")}
                            >
                                9
                            </IconButton>
                        </div>
                        <div className={classes.gridlinebuttons}>
                            <IconButton 
                                className={classes.numpadbuttons}
                                style={{ gridColumnStart: "col1" }}
                                onClick={() => setNumberVox(numberVox + "*")}
                            >
                                *
                            </IconButton>
                            <IconButton 
                                className={classes.numpadbuttons}
                                style={{ gridColumnStart: "col2" }}
                                onClick={() => setNumberVox(numberVox + "0")}
                            >
                                0
                            </IconButton>
                            <IconButton 
                                className={classes.numpadbuttons}
                                style={{ gridColumnStart: "col3" }}
                                onClick={() => setNumberVox(numberVox + "#")}
                            >
                                #
                            </IconButton>
                        </div>
                        <div className={classes.gridlinebuttons}>
                            <IconButton
                                className={classes.numpadbuttons}
                                style={{ gridColumnStart: "col2", backgroundColor: '#55bd84' }}
                                onClick={() => {
                                    dispatch(makeCall(numberVox))
                                    sethold(true)
                                    setmute(false)
                                }}
                            >
                                <PhoneIcon style={{color: "white", width: "35px", height: "35px"}}/> 
                            </IconButton>
                            <IconButton
                                className={classes.numpadbuttons}
                                style={{ gridColumnStart: "col3"}}
                                onClick={() => {
                                    setNumberVox(numberVox.slice(0, -1))
                                }}
                            >
                                <BackspaceIcon style={{color: "#707070", width: "35px", height: "35px", paddingRight: 5}}/> 
                            </IconButton>
                        </div>
                    </div>
                }
                {pageSelected === 2 &&
                    <div style={{width:"100%"}}>
                        <NotificaionMenuItem
                            user={"none"}
                            image={""}
                            title={"none"}
                            description={"none"}
                            date={formatDate("10/04/1995")}
                        />
                    </div>
                }
                {/*<DialogActions style={{ justifyContent: 'center', marginBottom: 12 }}>
                    
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
                </DialogActions>*/}
            </Dialog>
            <audio ref={ringtone} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/7120-download-iphone-6-original-ringtone-42676.mp3" />
        </>
    )
}
export default MakeCall;

const formatDate = (strDate: string) => {
    if (!strDate || strDate === '') return '';

    const date = new Date(strDate);
    const day = date.toLocaleDateString("en-US", { day: '2-digit' });
    const month = date.toLocaleDateString("en-US", { month: '2-digit' });
    const year = date.toLocaleDateString("en-US", { year: 'numeric' });

    return `${day}/${month}/${year}`;
}