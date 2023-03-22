/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { Button, makeStyles, Snackbar, Typography } from "@material-ui/core";
import { useParams } from 'react-router';
import { FieldEditMulti } from "components";
import { getCancelEventBooking, getCollEventBooking, resetAllMain } from 'store/main/actions';
import { calendarBookingCancel2, calendarBookingSelOne } from 'common/helpers';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Alert from '@material-ui/lab/Alert';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';

const useStyles = makeStyles(theme => ({
    back: {
        backgroundColor: '#fbfcfd',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        // minWidth: 800,
        maxHeight: 800,
        backgroundColor: 'white',
        display: 'flex',
        width: "80%",
        borderRadius: 8,
        boxShadow: '0 1px 8px 0 rgb(0 0 0 / 8%)',
        flexWrap: 'wrap',
        maxWidth:"1000px",
        minWidth:"400px",
        [theme.breakpoints.down('xs')]: {
            maxWidth: '100vw',
            maxHeight: '100vh',
        },
    },
    colInput: {
        width: '100%',
    },
    cancelEventFields: {
        textAlign: 'center',
        fontSize: '1.1rem',
        padding: '5px',
    },
    containerSuccess: {
        minHeight: 600,
        backgroundColor: 'white',
        display: 'flex',
        borderRadius: 8,
        boxShadow: '0 1px 8px 0 rgb(0 0 0 / 8%)',
        width: '80vw',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(3),
        [theme.breakpoints.down('xs')]: {
            width: '100vw',
        },
        flexDirection: 'column',
    }
}));


export const CancelEvent: FC = () => {
    const dispatch = useDispatch();
    const { corpid, orgid, calendareventid, calendarbookinguuid }: any = useParams();
    const classes = useStyles();
    const { t } = useTranslation();
    const [waitSave, setWaitSave] = useState(false);
    const [successCancel, setSuccessCancel] = useState(false);
    const [waitFind, setWaitFind] = useState(false);
    const [exists, setexists] = useState(true);
    const mainResult = useSelector(state =>  state.main.mainEventBooking);
    const [cancelcomment, setCancelcomment] = useState("");
    const [showSnackbar, setshowSnackbar] = React.useState({
        open: false,
        severity: "success",
        msg: ""
    });
    const [data, setData] = useState({
        hourend: "",
        hourstart: "",
        name: "",
        personcontact: "",
        personname: "",
        monthdate: "",
        calendarbookingid: "",
    });
    const handleClose = () => {
        setshowSnackbar({ ...showSnackbar, open: false });
    };
    

    const fetchData = () => dispatch(getCollEventBooking(calendarBookingSelOne({
        corpid, orgid, calendareventid, id: calendarbookinguuid
    })));

    useEffect(() => {
        setWaitFind(true);
        fetchData();
        return () => {
            dispatch(resetAllMain());
        };
    }, []);
    
    useEffect(() => {
        if(waitFind){
            if(!mainResult.loading){
                if(!mainResult.error){
                    if(mainResult.data.length>0){
                        setData({
                            hourend: mainResult?.data?.[0]?.hourend||"",
                            hourstart: mainResult?.data?.[0]?.hourstart||"",
                            name: mainResult?.data?.[0]?.name||"",
                            personcontact: mainResult?.data?.[0]?.personcontact||"",
                            personname: mainResult?.data?.[0]?.personname||"",
                            monthdate: mainResult?.data?.[0]?.monthdate||"",
                            calendarbookingid: mainResult?.data?.[0]?.calendarbookingid||"",
                        })
                        setWaitFind(false)
                    }else{
                        setexists(false)
                    }
                }else{
                    setexists(false)
                }
            }
        }
    }, [mainResult])
    
    useEffect(() => {
        if (waitSave) {
            dispatch(calendarBookingSelOne)
            if (!mainResult.loading && !mainResult.error) {
                setTimeout(function() {
                    window.close()
                }, 8000);
                setWaitSave(false);
            } else if (mainResult.error) {
                setshowSnackbar({ open: true, severity: "error", msg: t(mainResult.code || "error_unexpected_error") })
                setWaitSave(false);
            }
        }
    }, [])
    useEffect(() => {
        if (waitSave) {
            if (!mainResult.loading && !mainResult.error) {
                setSuccessCancel(true)
                setshowSnackbar({ open: true, severity: "success", msg: t(langKeys.successful_cancel_event) })
                setWaitSave(false);
            } else if (mainResult.error) {
                setshowSnackbar({ open: true, severity: "error", msg: t(mainResult.code || "error_unexpected_error") })
                setWaitSave(false);
            }
        }
    }, [mainResult, waitSave])
    
    const onSubmit = async () => {
        if(new Date(data?.monthdate + " " + data?.hourstart).getTime() >= new Date().getTime()){
            let extradata= mainResult.data[0]
            const datat = {
                corpid, orgid,
                calendareventid: calendareventid,
                id: data?.calendarbookingid,
                cancelcomment: cancelcomment||"",
                phone: data?.personcontact||"",
                name: data?.personname,
                email: extradata?.personmail||"",
                canceltype: extradata?.canceltype,
                otros: [
                    { name: "eventname", "text": extradata.name },
                    { name: "eventlocation", "text": extradata.location },
                    { name: "eventlink", "text": extradata.eventlink },
                    { name: "eventcode", "text": extradata.code },
                    { name: "monthdate", "text": extradata.monthdate},
                    { name: "hourstart", "text": extradata.hourstart},
                    { name: "hourend", "text": extradata.hourend},
                    { name: "personname", "text": extradata.personname},
                    { name: "personcontact", "text": extradata.personcontact},
                    { name: "personmail", "text": extradata.personmail }
                ]
                // otros: Object.keys(extradata).reduce((acc:any,x:any)=>[...acc,{name:x, text: String(extradata[x])}],[])
            }
            dispatch(getCancelEventBooking(calendarBookingCancel2(datat)));
            setWaitSave(true);
        }else{
            setshowSnackbar({ open: true, severity: "error", msg: t(langKeys.cancelenventerror || "error_unexpected_error") })
        }
    }
    if(exists){
        if(!successCancel){
            return (
                <div className={classes.back}>
                    {showSnackbar.severity === "error" &&
                        <Snackbar
                            anchorOrigin={{ vertical:'top', horizontal:'right' }}
                            open={showSnackbar.open}
                            onClose={handleClose}
                            message={showSnackbar.msg}
                        >
                            <Alert onClose={handleClose} severity="error">
                                {showSnackbar.msg}
                            </Alert>
                        </Snackbar>
                    }
                    {showSnackbar.severity === "success" &&
                        <Snackbar
                            anchorOrigin={{ vertical:'top', horizontal:'right' }}
                            open={showSnackbar.open}
                            onClose={handleClose}
                            message={showSnackbar.msg}
                        >
                            <Alert onClose={handleClose} severity="success">
                                {showSnackbar.msg}
                            </Alert>
                        </Snackbar>
                    }
                    <div className={classes.container}>
                        <DialogTitle>
                            <div style={{textAlign: 'center', fontWeight: 'bold'}}>
                                {t(langKeys.cancelevent)}
                            </div>
                        </DialogTitle>
                        <DialogContent>
                            <div className={classes.cancelEventFields}>
                                {data?.name}
                            </div>
                            <div className={classes.cancelEventFields} style={{fontWeight: 'bold'}}>
                                {data?.personname}
                            </div>
                            <div className={classes.cancelEventFields}>
                                {`${data?.hourstart.substring(0, 5)} - ${data?.hourend.substring(0, 5)}`}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop:'10px' }}>
                                <div style={{ fontSize: '1rem'}}>
                                    {t(langKeys.canceleventtext)}
                                </div>
                                <FieldEditMulti
                                    label={""}
                                    valueDefault={cancelcomment}
                                    className={classes.colInput}
                                    onChange={(value) => setCancelcomment(value)}
                                    maxLength={1024}
                                    variant="outlined"
                                />
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <div style={{ width: "100%", padding: "0px 16px 10px"  }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={onSubmit}
                                    disabled={waitSave}
                                >
                                    {t(langKeys.cancelevent)}
                                </Button>
                            </div>
                        </DialogActions>
                    </div>
                </div >
            )
        }else{
            return (
                
                <div className={classes.back}>
                    <div className={classes.containerSuccess}>
                        <div style={{ fontWeight: 'bold', fontSize: 20 }}>{t(langKeys.CANCELED)}</div>
                        <div style={{ marginTop: 16, textAlign: 'center' }} >{t(langKeys.successful_cancel_event)}</div>
                        <div style={{ width: '70%', height: 1, backgroundColor: '#e1e1e1', marginTop: 24, marginBottom: 24 }}></div>
                        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <span style={{ width: 24, height: 24, borderRadius: 12 }}></span>
                                <div style={{ fontWeight: 'bold', fontSize: 20 }}>{data?.name}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 'bold' }}>
                                <CalendarTodayIcon />
                                {`${data?.hourstart.substring(0, 5)} - ${data?.hourend.substring(0, 5)}`}
                            </div>
                        </div>
                        <div style={{ width: '70%', height: 1, backgroundColor: '#e1e1e1', marginTop: 24, marginBottom: 24 }}></div>
                    </div>
                </div>
            )

        }
    }else{
        return (
            <div className={classes.back}>
                <Typography variant="h5">{t(langKeys.no_event_found)}</Typography>
            </div>
        )
    }
}

export default CancelEvent;