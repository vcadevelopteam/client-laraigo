/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { Button, DialogActions, DialogTitle } from "@material-ui/core";
import { useTranslation } from 'react-i18next';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { FieldSelect, FieldEditMulti, FieldEdit } from 'components';
import { insertClassificationConversation, conversationCloseUpd } from 'common/helpers';
import { langKeys } from 'lang/keys';
import { execute } from 'store/main/actions';
import { Dictionary } from '@types';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { getTipificationLevel2, getTipificationLevel3, resetGetTipificationLevel2, resetGetTipificationLevel3, resetShowModal, checkPaymentPlan } from 'store/inbox/actions';
import { useForm } from 'react-hook-form';

const CloseTicketVoxi: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState(false);
    const showModalVoxi = useSelector(state => state.inbox.showModalClose);
    const ticketToClose = useSelector(state => state.inbox.ticketToClose);
    const multiData = useSelector(state => state.main.multiDataAux2);
    const tipificationLevel2 = useSelector(state => state.inbox.tipificationsLevel2);
    const tipificationLevel3 = useSelector(state => state.inbox.tipificationsLevel3);
    const [waitTipify, setWaitTipify] = useState(false);
    const [modalview, setmodalview] = useState("view-1");
    const tipifyRes = useSelector(state => state.main.execute);
    const [waitClose, setWaitClose] = useState(false);
    const [motive, setmotive] = useState("");
    const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm();

    React.useEffect(() => {
        if (showModalVoxi > 0) {
            if (ticketToClose?.conversationid) {
                setOpenModal(true)
                setmotive("");
            }
        }
    }, [showModalVoxi])

    useEffect(() => {
        if (waitTipify) {
            if (!tipifyRes.loading) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_tipify_ticket) }))
                dispatch(showBackdrop(false));
                setWaitTipify(false);
            }
        }
    }, [tipifyRes, waitTipify])

    useEffect(() => {
        if (waitClose) {
            if (!tipifyRes.loading) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_close_ticket) }))
                setOpenModal(false);
                dispatch(resetShowModal())
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
            register('path2');
            register('classificationid2');
            register('classificationid3');
            register('path1');
            register('reschedulingdate');
            register('observation');
            if (multiData?.data[2]?.data[0].propertyvalue === "1" && modalview === "view-1") {
                register('classificationid1', { validate: (value: any) => (((value && value > 0) || t(langKeys.field_required))) });

            } else {
                register('classificationid1');
            }
            if (modalview === "view-2") {
                register('motive', { validate: (value) => ((value && value.length) || t(langKeys.field_required)) });
            } else {
                register('motive');
            }

        }
    }, [openModal, modalview])

    useEffect(() => {
        setmodalview('view-1')
    }, [openModal])

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
        if (data.classificationid1) {

            dispatch(showBackdrop(true));
            dispatch(execute(insertClassificationConversation(ticketToClose?.conversationid!!, data.classificationid3 || data.classificationid2 || data.classificationid1, '', 'INSERT')))
            setWaitTipify(true)
        }
        setmodalview("view-2")
    });

    const onSubmit = handleSubmit((data) => {

        if (motive === "LLAMADAREPROGRAMDA") {
            debugger
            if (data.reschedulingdate) {
                if (new Date(data.reschedulingdate).getTime() > new Date().getTime()) {
                    const dd: Dictionary = {
                        conversationid: ticketToClose?.conversationid!!,
                        motive: data.motive,
                        obs: data.observation || "",
                        ticketnum: ticketToClose?.ticketnum!!,
                        personcommunicationchannel: ticketToClose?.personcommunicationchannel!!,
                        communicationchannelid: ticketToClose?.communicationchannelid!!,
                        personid: ticketToClose?.personid,
                    }
                    dispatch(checkPaymentPlan({
                        parameters: {
                            firstname: ticketToClose?.displayname,
                            lastname: "",
                            phone: ticketToClose?.personcommunicationchannel.split(':')[1].split("@")[0],
                            communicationchannelid: ticketToClose?.communicationchannelid,
                            datetime: new Date(data.reschedulingdate).getTime()
                        }
                    }))

                    dispatch(showBackdrop(true));
                    dispatch(execute(conversationCloseUpd(dd)));
                    setWaitClose(true)
                } else {
                    dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.error_rescheduling_date) }))
                }
            } else {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.invalid_rescheduling_date) }))
            }
        } else {
            const dd: Dictionary = {
                conversationid: ticketToClose?.conversationid!!,
                motive: data.motive,
                obs: data.observation || "",
                ticketnum: ticketToClose?.ticketnum!!,
                personcommunicationchannel: ticketToClose?.personcommunicationchannel!!,
                communicationchannelid: ticketToClose?.communicationchannelid!!,
                personid: ticketToClose?.personid,
            }

            dispatch(showBackdrop(true));
            dispatch(execute(conversationCloseUpd(dd)));
            setWaitClose(true)
        }

    });

    return (
        <>
            <Dialog
                open={openModal}
                fullWidth
                maxWidth={"xs"}>
                <DialogTitle>
                    <div style={{ overflow: 'hidden', wordBreak: 'break-word', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: 120 }}>
                        {ticketToClose?.displayname} - {modalview === "view-1" ? t(langKeys.tipify_ticket) : t(langKeys.close_ticket)}
                    </div>
                </DialogTitle>
                <DialogContent style={{ padding: 0 }}>
                    {modalview === "view-1" &&
                        <div className="row-zyx" style={{ paddingLeft: 24, paddingRight: 8 }}>
                            <FieldSelect
                                label={`${t(langKeys.tipification)} ${t(langKeys.level)} 1`}
                                className="col-12"
                                valueDefault={getValues('classificationid1')}
                                onChange={onChangeTipificationLevel1}
                                error={errors?.classificationid1?.message}
                                data={multiData?.data[1] && multiData?.data[1].data}
                                optionDesc="description"
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
                                optionDesc="description"
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
                                optionDesc="description"
                                optionValue="classificationid"
                            />
                        </div>
                    }
                    {modalview === "view-2" &&
                        <div className="row-zyx" style={{ paddingLeft: 24, paddingRight: 8 }}>
                            <FieldSelect
                                label={t(langKeys.ticket_reason)}
                                className="col-12"
                                valueDefault={getValues('motive')}
                                onChange={(value) => { setValue('motive', value ? value.domainvalue : ''); setmotive(value ? value.domainvalue : '') }}
                                error={errors?.motive?.message}
                                data={[...(multiData?.data?.[0]?.data || []), { domaindesc: "Llamada reprogramada", domainvalue: "LLAMADAREPROGRAMDA" }]}
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
                            {motive === "LLAMADAREPROGRAMDA" && <>
                                <FieldEdit
                                    label={t(langKeys.reschedulingdate)}
                                    valueDefault={getValues('reschedulingdate')}
                                    className="flex-1"
                                    type="datetime-local"
                                    onChange={(value) => setValue('reschedulingdate', value)}
                                />
                            </>}
                        </div>
                    }
                </DialogContent>
                <DialogActions>

                    {modalview === "view-1" &&
                        <>
                            <Button
                                onClick={onSubmitClassification}
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