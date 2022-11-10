/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { Button, makeStyles } from "@material-ui/core";
import { useParams } from 'react-router';
import { FieldEditMulti } from "components";
import { execute, getCollection, resetAllMain } from 'store/main/actions';
import { calendarBookingCancel, calendarBookingSelOne } from 'common/helpers';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import NotFound from './NotFound';

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
    const { corpid, orgid, calendareventid, calendarbookingid }: any = useParams();
    const classes = useStyles();
    const { t } = useTranslation();
    const [waitSave, setWaitSave] = useState(false);
    const [successCancel, setSuccessCancel] = useState(false);
    const [waitFind, setWaitFind] = useState(false);
    const [exists, setexists] = useState(true);
    const mainResult = useSelector(state => state.main);
    const saveRes = useSelector(state => state.main.execute);
    const [cancelcomment, setCancelcomment] = useState("");
    const [data, setData] = useState({
        hourend: "",
        hourstart: "",
        name: "",
        personcontact: "",
        personname: "",
        monthdate: "",
    });

    const fetchData = () => dispatch(getCollection(calendarBookingSelOne({
        corpid, orgid, calendareventid, id: calendarbookingid
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
            if(!mainResult.mainData.error && !mainResult.mainData.loading){
                if(mainResult.mainData.data.length>0){
                    setData({
                        hourend: mainResult?.mainData?.data?.[0]?.hourend||"",
                        hourstart: mainResult?.mainData?.data?.[0]?.hourstart||"",
                        name: mainResult?.mainData?.data?.[0]?.name||"",
                        personcontact: mainResult?.mainData?.data?.[0]?.personcontact||"",
                        personname: mainResult?.mainData?.data?.[0]?.personname||"",
                        monthdate: mainResult?.mainData?.data?.[0]?.monthdate||"",
                    })
                    setWaitFind(false)
                }else{
                    setexists(false)
                }
            }
        }
    }, [mainResult.mainData.data])
    
    useEffect(() => {
        if (waitSave) {
            dispatch(calendarBookingSelOne)
            if (!saveRes.loading && !saveRes.error) {
                setSuccessCancel(true)
                setTimeout(function() {
                    window.close()
                }, 8000);
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (saveRes.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(saveRes.code || "error_unexpected_error") }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [])
    useEffect(() => {
        if (waitSave) {
            if (!saveRes.loading && !saveRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_cancel_event) }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (saveRes.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(saveRes.code || "error_unexpected_error") }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [saveRes, waitSave])

    const onSubmit = async () => {
        debugger
        if(new Date(data?.monthdate) > new Date()){
            const datat = {
                calendareventid: calendareventid,
                id: calendarbookingid,
                cancelcomment: cancelcomment||"",
            }
            dispatch(execute(calendarBookingCancel(datat)));
            setWaitSave(true);
            dispatch(showBackdrop(true));
        }else{
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.cancelenventerror || "error_unexpected_error") }))
        }
    }
    if(exists){
        if(!successCancel){
            return (
                <div className={classes.back}>
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
            <NotFound />
        )
    }
}

export default CancelEvent;