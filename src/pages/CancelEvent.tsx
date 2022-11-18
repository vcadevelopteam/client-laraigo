/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { Button, makeStyles, Snackbar, Typography } from "@material-ui/core";
import { useParams } from 'react-router';
import { FieldEditMulti } from "components";
import { execute, getCollEventBooking, resetAllMain } from 'store/main/actions';
import { calendarBookingCancel, calendarBookingSelOne } from 'common/helpers';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Alert from '@material-ui/lab/Alert';

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
    const saveRes = useSelector(state => state.main.execute);
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
            if (!saveRes.loading && !saveRes.error) {
                setSuccessCancel(true)
                setTimeout(function() {
                    window.close()
                }, 8000);
                setWaitSave(false);
            } else if (saveRes.error) {
                setshowSnackbar({ open: true, severity: "error", msg: t(saveRes.code || "error_unexpected_error") })
                setWaitSave(false);
            }
        }
    }, [])
    useEffect(() => {
        if (waitSave) {
            if (!saveRes.loading && !saveRes.error) {
                setshowSnackbar({ open: true, severity: "success", msg: t(langKeys.successful_cancel_event) })
                setWaitSave(false);
            } else if (saveRes.error) {
                setshowSnackbar({ open: true, severity: "error", msg: t(saveRes.code || "error_unexpected_error") })
                setWaitSave(false);
            }
        }
    }, [saveRes, waitSave])

    const onSubmit = async () => {
        if(new Date(data?.monthdate) > new Date()){
            const datat = {
                calendareventid: calendareventid,
                id: data?.calendarbookingid,
                cancelcomment: cancelcomment||"",
            }
            dispatch(execute(calendarBookingCancel(datat)));
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
                    <div className={classes.container}>
                        <DialogContent>
                            <div className={classes.cancelEventFields}>
                                {t(langKeys.successful_cancel_event)}
                            </div>
                        </DialogContent>
                    </div>
                </div >
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