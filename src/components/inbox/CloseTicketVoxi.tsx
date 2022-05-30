import React, { FC, useState, MouseEventHandler, useEffect } from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { createStyles, Theme } from '@material-ui/core/styles';
import { Avatar, Button, DialogActions, DialogTitle, Fab, InputBase, makeStyles, MenuItem, Paper, Tooltip, Typography } from "@material-ui/core";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DialpadIcon from '@material-ui/icons/Dialpad';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'hooks';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { useDispatch } from 'react-redux';
import { makeCall, setModalCall, getHistory, geAdvisors, rejectCall } from 'store/voximplant/actions';
import TextField from '@material-ui/core/TextField';
import PhoneForwardedIcon from '@material-ui/icons/PhoneForwarded';
import PhoneIcon from '@material-ui/icons/Phone';
import { FieldSelect, AntTab, SearchField, FieldEditMulti } from 'components';
import { IconButton, Tabs } from '@material-ui/core';
import { conversationOutboundIns, convertLocalDate, getSecondsUntelNow, getAdvisorListVoxi, insertClassificationConversation, changeStatus, conversationCloseUpd } from 'common/helpers';
import { langKeys } from 'lang/keys';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';
import PhoneCallbackIcon from '@material-ui/icons/PhoneCallback';
import BackspaceIcon from '@material-ui/icons/Backspace';
import clsx from 'clsx';
import { execute } from 'store/main/actions';
import { Dictionary, ICloseTicketsParams, ITicket } from '@types';
import { ListItemSkeleton } from 'components';
import { SearchIcon } from 'icons';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import PersonIcon from '@material-ui/icons/Person';
import { getTipificationLevel2, getTipificationLevel3, resetGetTipificationLevel2, resetGetTipificationLevel3 } from 'store/inbox/actions';
import { useForm, useFieldArray } from 'react-hook-form';

const useStyles = makeStyles(theme => ({
    grey: {
        backgroundColor: '#bdbdbd'
    },
    red: {
        backgroundColor: 'rgb(180, 26, 26)'
    },
    tabs: {
        paddingTop: 10,
        paddingBottom: 10,
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
    numpadbuttons: {
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        backgroundColor: '#e7e3e3'
    },
    gridlinebuttons: {
        display: "grid",
        width: "100%",
        gridTemplateColumns: 'auto [col1] 50px 50px [col2] 50px 50px [col3] 50px auto',
        paddingBottom: 25
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    rootpaper: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        height: 35,
        border: '1px solid #EBEAED',
        //backgroundColor: (props: any) => props.colorPlaceHolder || '#F9F9FA',
    },
    inputPlaceholder: {
        '&::placeholder': {
            fontSize: "1rem",
            fontWeight: 500,
            color: '#84818A',
        },
    },
}));


const CloseTicketVoxi: React.FC = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState(false);
    const showModalVoxi = useSelector(state => state.inbox.showModalClose);
    const callVoxiTmp = useSelector(state => state.voximplant.call);
    const multiData = useSelector(state => state.main.multiData);
    const tipificationLevel2 = useSelector(state => state.inbox.tipificationsLevel2);
    const tipificationLevel3 = useSelector(state => state.inbox.tipificationsLevel3);
    const [waitTipify, setWaitTipify] = useState(false);
    const [modalview, setmodalview] = useState("view-1");
    const tipifyRes = useSelector(state => state.main.execute);
    const [waitClose, setWaitClose] = useState(false);
    const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm();

    React.useEffect(() => {
        if (showModalVoxi > 0) {
            setOpenModal(true)
        }
    }, [showModalVoxi])

    useEffect(() => {
        if (waitTipify) {
            if (!tipifyRes.loading && !tipifyRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_tipify_ticket) }))
                dispatch(showBackdrop(false));
                setWaitTipify(false);
            } else if (tipifyRes.error) {
                const message = t(tipifyRes.code || "error_unexpected_error", { module: t(langKeys.tipification).toLocaleLowerCase() })

                dispatch(showSnackbar({ show: true, success: false, message }))
                dispatch(showBackdrop(false));
                setWaitTipify(false);
            }
        }
    }, [tipifyRes, waitTipify])

    useEffect(() => {
        if (waitClose) {
            if (!tipifyRes.loading && !tipifyRes.error) {
                console.log("test1")
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_close_ticket) }))
                setOpenModal(false);
                dispatch(showBackdrop(false));
                setWaitClose(false);
            } else if (tipifyRes.error) {
                dispatch(showSnackbar({ show: true, success: false, message: t(tipifyRes.code || "error_unexpected_error") }))
                dispatch(showBackdrop(false));
                setWaitClose(false);
            }
        }
    }, [tipifyRes, waitClose])

    useEffect(() => {
        if (openModal) {
            dispatch(resetGetTipificationLevel2())
            dispatch(resetGetTipificationLevel3())
            reset({
                classificationid1: 0,
                path1: '',
                classificationid2: 0,
                path2: '',
                classificationid3: 0,
                path3: '',
            })
            if(modalview==="view-1"){
                register('path1');
                register('classificationid1', { validate: (value:any) => (((value && value > 0) || t(langKeys.field_required)) )});
                register('path2');
                register('classificationid2');
                register('classificationid3');

            }else{
                register('motive', { validate: (value) => ((value && value.length) || t(langKeys.field_required)) });
                register('observation');
            }

        }
    }, [openModal,modalview])

    const onChangeTipificationLevel1 = (value: Dictionary) => {
        setValue('classificationid1', value ? value.classificationid : '');
        setValue('path1', value ? value.path : '');
        setValue('classificationid2', 0);
        setValue('path2', '');
        setValue('classificationid3', 0);
        setValue('path3', '');

        if (value)
            dispatch(getTipificationLevel2(value.classificationid))
        else
            dispatch(resetGetTipificationLevel2())
    }
    
    const onChangeTipificationLevel2 = (value: Dictionary) => {
        setValue('classificationid2', value ? value.classificationid : '');
        setValue('path2', value ? value.path : '');
        setValue('classificationid3', 0);
        setValue('path3', '');
        if (value)
            dispatch(getTipificationLevel3(value.classificationid))
        else
            dispatch(resetGetTipificationLevel3())
    }

    const onChangeTipificationLevel3 = (value: Dictionary) => {
        setValue('classificationid2', value ? value.classificationid : '')
        setValue('path2', value ? value.path : '')
    }

    const onSubmitClassification = handleSubmit((data) => {
        dispatch(showBackdrop(true));
        //dispatch(execute(insertClassificationConversation(ticketSelected?.conversationid!!, data.classificationid3 || data.classificationid2 || data.classificationid1, '', 'INSERT')))
        setWaitTipify(true)
    });

    const onSubmit = handleSubmit((data) => {
        console.log("data",callVoxiTmp)
        const dd: Dictionary = {
            conversationid: callVoxiTmp?.data?.conversationid!!,
            motive: data.motive,
            obs: data.observation,
            ticketnum: callVoxiTmp?.data?.ticketnum!!,
            personcommunicationchannel: callVoxiTmp?.data?.personcommunicationchannel!!,
            communicationchannelid: callVoxiTmp?.data?.communicationchannelid!!,
            personid: callVoxiTmp?.data?.personid,
        }

        dispatch(showBackdrop(true));
        dispatch(execute(conversationCloseUpd(dd)));
        setWaitClose(true)
        
    });

    return (
        <>
            <Dialog
                open={openModal}
                fullWidth
                maxWidth={"xs"}>
                <DialogTitle>
                    <div style={{ overflow: 'hidden', wordBreak: 'break-word', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: 120 }}>
                        {modalview === "view-1"?t(langKeys.tipify_ticket):t(langKeys.close_ticket)}
                    </div>
                </DialogTitle>
                <DialogContent style={{ padding: 0 }}>
                    {modalview === "view-1" &&
                        <div className="row-zyx" style={{paddingLeft: 24,paddingRight: 8}}>
                            <FieldSelect
                                label={`${t(langKeys.tipification)} ${t(langKeys.level)} 1`}
                                className="col-12"
                                valueDefault={getValues('classificationid1')}
                                onChange={onChangeTipificationLevel1}
                                error={errors?.classificationid1?.message}
                                data={multiData?.data[2] && multiData?.data[2].data}
                                optionDesc="path"
                                optionValue="classificationid"
                            />
                            <FieldSelect
                                label={`${t(langKeys.tipification)} ${t(langKeys.level)} 2`}
                                className="col-12"
                                valueDefault={getValues('classificationid2')}
                                onChange={onChangeTipificationLevel2}
                                loading={tipificationLevel2.loading}
                                error={errors?.classificationid2?.message}
                                data={tipificationLevel2.data}
                                optionDesc="path"
                                optionValue="classificationid"
                            />
                            <FieldSelect
                                label={`${t(langKeys.tipification)} ${t(langKeys.level)} 3`}
                                className="col-12"
                                valueDefault={getValues('classificationid3')}
                                onChange={onChangeTipificationLevel3}
                                loading={tipificationLevel3.loading}
                                error={errors?.classificationid3?.message}
                                data={tipificationLevel3.data}
                                optionDesc="path"
                                optionValue="classificationid"
                            />
                        </div>
                    }
                    {modalview === "view-2" &&
                        <div className="row-zyx" style={{paddingLeft: 24,paddingRight: 8}}>
                            <FieldSelect
                                label={t(langKeys.ticket_reason)}
                                className="col-12"
                                valueDefault={getValues('motive')}
                                onChange={(value) => setValue('motive', value ? value.domainvalue : '')}
                                error={errors?.motive?.message}
                                data={(multiData?.data?.[0]?.data || [] )}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            />
                            <FieldEditMulti
                                label={t(langKeys.observation)}
                                valueDefault={getValues('obs')}
                                className="col-12"
                                onChange={(value) => setValue('obs', value)}
                                maxLength={1024}
                            />
                        </div>
                    }
                </DialogContent>
                <DialogActions>
                    
                {modalview === "view-1" &&
                    <>
                        <Button
                            onClick={onSubmitClassification}
                        >
                            {t(langKeys.add)}
                        </Button>
                        <Button
                            onClick={() => setmodalview("view-2")}
                        >
                            {t(langKeys.next)}
                        </Button>
                    </>
                }
                {modalview === "view-2" &&
                    <>
                        <Button
                            onClick={onSubmit}
                        >
                            {t(langKeys.close)}
                        </Button>
                    </>
                }
                </DialogActions>
            </Dialog>
        </>
    )
}
export default CloseTicketVoxi;