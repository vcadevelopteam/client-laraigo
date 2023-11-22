/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Dictionary, ICrmGridPerson, ICrmLead } from "@types";
import { SaveActivityModal, TabPanelLogNote } from "./LeadForm";
import { getAdvisers, resetSaveLeadActivity, resetSaveLeadLogNote, saveLeadActivity, saveLeadLogNote } from "store/lead/actions";
import { adviserSel, insLeadConfig, insOrderConfig, leadActivityIns, leadHistoryIns, leadLogNotesIns } from "common/helpers";
import { Box, Button, makeStyles, Modal, Typography } from "@material-ui/core";
import { DialogZyx, FieldEdit, FieldEditArray, FieldEditMulti, FieldSelect, TitleDetail } from "components";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { useSelector } from "hooks";
import { useFieldArray, useForm } from "react-hook-form";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { getDataForOutbound, sendHSM } from "store/inbox/actions";
import { execute, resetExecute } from "store/main/actions";
import { json } from "stream/consumers";

interface IModalProps {
    name: string;
    open: boolean;
    payload: Dictionary | null;
}

interface IFCModalProps {
    gridModalProps: IModalProps;
    setGridModal: (data: any) => void;
    setAutoRefresh?: (value: boolean) => void;
}

const useSelectPersonModalStyles = makeStyles(theme => ({
    root: {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: "80%",
        maxHeight: "80%",
        width: '80%',
        backgroundColor: 'white',
        padding: "16px",
        overflowY: 'auto',
    },
}));

export const NewActivityModal: FC<IFCModalProps> = ({ gridModalProps, setGridModal, setAutoRefresh }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const saveActivity = useSelector(state => state.lead.saveLeadActivity);

    useEffect(() => {
        if (gridModalProps.name === 'ACTIVITY' && gridModalProps.open === true) {
            dispatch(getAdvisers(adviserSel()));
        }
    }, [dispatch, gridModalProps])

    useEffect(() => {
        if (saveActivity.loading) return;
        if (saveActivity.error) {
            const errormessage = t(saveActivity.code || "error_unexpected_error", { module: t(langKeys.lead).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: errormessage,
                severity: "error",
                show: true,
            }));
        } else if (saveActivity.success) {
            dispatch(showSnackbar({
                message: t(langKeys.successful_transaction),
                severity: "success",
                show: true,
            }));
            setGridModal({ name: '', open: false, payload: null });
            setAutoRefresh && setAutoRefresh(true);
            dispatch(resetSaveLeadActivity());
        }
    }, [saveActivity])

    const submitActivitiesModal = (data: any) => {
        dispatch(saveLeadActivity(leadActivityIns(data)));
    }

    return (
        <SaveActivityModal
            onClose={() => setGridModal({ name: '', open: false, payload: null })}
            open={gridModalProps.name === 'ACTIVITY' && gridModalProps.open}
            activity={null}
            leadid={gridModalProps.payload?.leadid}
            onSubmit={submitActivitiesModal}
        />
    )
}

const useStyles = makeStyles(() => ({
    title: {
        fontSize: 30,
        fontWeight: 'bold'
    }
}));

export const TrafficLightConfigurationModal: React.FC<{
    openModal: boolean;
    setOpenModal: (data: boolean) => void;
    fetchData: () => void;
    configuration: Dictionary
}> = ({ openModal, setOpenModal, fetchData, configuration }) => {
    const { t } = useTranslation();
    const main = useSelector((state) => state.main.mainData);
    const user = useSelector((state) => state.login.validateToken.user);
    const dispatch = useDispatch();
    const executeRes = useSelector(state => state.main.execute);
    const [waitSave, setWaitSave] = useState(false);
    const classes = useStyles();
    const [configjson, setConfigjson] = useState({
        monbegin: configuration?.monbegin,
        monend: configuration?.monend,
        tuebegin: configuration?.tuebegin,
        tueend: configuration?.tueend,
        wedbegin: configuration?.wedbegin,
        wedend: configuration?.wedend,
        thubegin: configuration?.thubegin,
        thuend: configuration?.thuend,
        fribegin: configuration?.fribegin,
        friend: configuration?.friend,
        satbegin: configuration?.satbegin,
        satend: configuration?.satend,
        sunbegin: configuration?.sunbegin,
        sunend: configuration?.sunend,
        maxgreen: configuration?.maxgreen,
        maxyellow: configuration?.maxyellow,
    })

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }))
                dispatch(showBackdrop(false));
                fetchData()
                setOpenModal(false);
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    const onMainSubmit = (() => {
        const existingConfig = main.data.find(item => item.corpid === user?.corpid && item.orgid === user?.orgid);
        const callback = () => {
            dispatch(showBackdrop(true));
            if(existingConfig) {
                dispatch(execute(insOrderConfig({
                    id: existingConfig.orderconfigid,
                    orderconfig: JSON.stringify(configjson),
                    type: '',
                    status: 'ACTIVO',
                    operation: 'UPDATE',
                })));
            } else {
                dispatch(execute(insOrderConfig({
                    id: 0,
                    orderconfig: JSON.stringify(configjson),
                    type: '',
                    status: 'ACTIVO',
                    operation: 'INSERT',
                })));
            }
            setWaitSave(true);
        }
        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    function handleCloseConfiguration () {
        setConfigjson({
            monbegin: configuration.monbegin,
            monend: configuration.monend,
            tuebegin: configuration.tuebegin,
            tueend: configuration.tueend,
            wedbegin: configuration.wedbegin,
            wedend: configuration.wedend,
            thubegin: configuration.thubegin,
            thuend: configuration.thuend,
            fribegin: configuration.fribegin,
            friend: configuration.friend,
            satbegin: configuration.satbegin,
            satend: configuration.satend,
            sunbegin: configuration.sunbegin,
            sunend: configuration.sunend,
            maxgreen: configuration.maxgreen,
            maxyellow: configuration.maxyellow,
        })
        setOpenModal(false);
    }

    function handleSaveConfiguration () {
        onMainSubmit()
    }

    return (
        <DialogZyx
            open={openModal}
            title={<span className={classes.title}>{t(langKeys.trafficlightconfig)}</span>}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.save)}
            handleClickButton1={handleCloseConfiguration}
            handleClickButton2={handleSaveConfiguration}
            maxWidth="sm"
        >
            <div className="row-zyx">
                <Typography/>{t(langKeys.opportunityhours)}
            </div>
            <div style={{height:20}}></div>
            <div className="row-zyx">
                <span className="col-1">{t(langKeys.day)}</span>
                <span className="col-2">{t(langKeys.monday)}</span>
                <span className="col-2">{t(langKeys.tuesday)}</span>
                <span className="col-2">{t(langKeys.wednesday)}</span>
                <span className="col-2">{t(langKeys.thursday)}</span>
                <span className="col-2">{t(langKeys.friday)}</span>
                <div className="col-1"></div>
                <span className="col-1" style={{alignSelf: 'center'}}>{t(langKeys.start)}</span>
                <FieldEdit
                    type="time"
                    className="col-2"
                    valueDefault={configuration?.monbegin}
                    onChange={(value) => setConfigjson({...configjson, monbegin: value})}
                />
                <FieldEdit
                    type="time"
                    className="col-2"
                    valueDefault={configuration?.tuebegin}
                    onChange={(value) => setConfigjson({...configjson, tuebegin: value})}
                />
                <FieldEdit
                    type="time"
                    className="col-2"
                    valueDefault={configuration?.wedbegin}
                    onChange={(value) => setConfigjson({...configjson, wedbegin: value})}
                />
                <FieldEdit
                    type="time"
                    className="col-2"
                    valueDefault={configuration?.thubegin}
                    onChange={(value) => setConfigjson({...configjson, thubegin: value})}
                />
                <FieldEdit
                    type="time"
                    className="col-2"
                    valueDefault={configuration?.fribegin}
                    onChange={(value) => setConfigjson({...configjson, fribegin: value})}
                />
                <div className="col-1"></div>
                <span className="col-1" style={{alignSelf: 'center'}}>{t(langKeys.end)}</span>
                <FieldEdit
                    type="time"
                    className="col-2"
                    valueDefault={configuration?.monend}
                    onChange={(value) => setConfigjson({...configjson, monend: value})}
                />
                <FieldEdit
                    type="time"
                    className="col-2"
                    valueDefault={configuration?.tueend}
                    onChange={(value) => setConfigjson({...configjson, tueend: value})}
                />
                <FieldEdit
                    type="time"
                    className="col-2"
                    valueDefault={configuration?.wedend}
                    onChange={(value) => setConfigjson({...configjson, wedend: value})}
                />
                <FieldEdit
                    type="time"
                    className="col-2"
                    valueDefault={configuration?.thuend}
                    onChange={(value) => setConfigjson({...configjson, thuend: value})}
                />
                <FieldEdit
                    type="time"
                    className="col-2"
                    valueDefault={configuration?.friend}
                    onChange={(value) => setConfigjson({...configjson, friend: value})}
                />
                <div className="col-1"></div>
                <span className="col-1">{t(langKeys.day)}</span>
                <span className="col-2">{t(langKeys.saturday)}</span>
                <span className="col-2">{t(langKeys.sunday)}</span>
                <div className="col-7"></div>
                <span className="col-1" style={{alignSelf: 'center'}}>{t(langKeys.start)}</span>
                <FieldEdit
                    type="time"
                    className="col-2"
                    valueDefault={configuration?.satbegin}
                    onChange={(value) => setConfigjson({...configjson, satbegin: value})}
                />
                <FieldEdit
                    type="time"
                    className="col-2"
                    valueDefault={configuration?.sunbegin}
                    onChange={(value) => setConfigjson({...configjson, sunbegin: value})}
                />
                <div className="col-7"></div>
                <span className="col-1" style={{alignSelf: 'center'}}>{t(langKeys.end)}</span>
                <FieldEdit
                    type="time"
                    className="col-2"
                    valueDefault={configuration?.satend}
                    onChange={(value) => setConfigjson({...configjson, satend: value})}
                />
                <FieldEdit
                    type="time"
                    className="col-2"
                    valueDefault={configuration?.sunend}
                    onChange={(value) => setConfigjson({...configjson, sunend: value})}
                />
                <div className="col-7"></div>
            </div>
            <div style={{height:10}}></div>
            <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.maxtimegreen)}
                    variant="outlined"
                    type="number"
                    className="col-12"
                    valueDefault={configuration?.maxgreen}
                    onChange={(value) => {
                        if(value < 0) {
                            setConfigjson({...configjson, maxgreen: value * -1})
                        } else {
                            setConfigjson({...configjson, maxgreen: value})
                        }
                    }}
                />
                <FieldEdit
                    label={t(langKeys.maxtimeamber)}
                    variant="outlined"
                    type="number"
                    className="col-12"
                    valueDefault={configuration?.maxyellow}
                    onChange={(value) => {
                        if(value < 0) {
                            setConfigjson({...configjson, maxyellow: value * -1})
                        } else {
                            setConfigjson({...configjson, maxyellow: value})
                        }
                    }}
                />
            </div>
        </DialogZyx>
    )
}

export const TrafficIndividualConfigurationModal: React.FC<{
    openModal: boolean;
    setOpenModal: (data: boolean) => void;
    lead: ICrmLead;
}> = ({ openModal, setOpenModal, lead }) => {
    const { t } = useTranslation();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const [maxGreen, setMaxGreen] = useState(lead.maxgreen)
    const [maxYellow, setMaxYellow] = useState(lead.maxyellow)

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }))
                dispatch(showBackdrop(false));
                setOpenModal(false);
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    const onMainSubmit = (() => {
        dispatch(showBackdrop(true));
        dispatch(execute(insLeadConfig({
            id: lead.leadid,
            maxgreen: maxGreen,
            maxyellow: maxYellow
        })));
        setWaitSave(true);
    });

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.trafficindividualconfig)}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.save)}
            handleClickButton1={() => setOpenModal(false)}
            handleClickButton2={onMainSubmit}
            maxWidth="sm"
        >
            <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.maxtimegreen)}
                    variant="outlined"
                    valueDefault={maxGreen}
                    onChange={(value) => setMaxGreen(value)}
                    type="number"
                    className="col-12"
                />
                <FieldEdit
                    label={t(langKeys.maxtimeamber)}
                    variant="outlined"
                    valueDefault={maxYellow}
                    onChange={(value) => setMaxYellow(value)}
                    type="number"
                    className="col-12"
                />
            </div>
        </DialogZyx>
    )
}

export const NewNoteModal: FC<IFCModalProps> = ({ gridModalProps, setGridModal, setAutoRefresh }) => {
    const dispatch = useDispatch();
    const modalClasses = useSelectPersonModalStyles();
    const { t } = useTranslation();
    const saveNote = useSelector(state => state.lead.saveLeadNote);

    useEffect(() => {
        if (gridModalProps.name === 'NOTE' && gridModalProps.open === true) {

        }
    }, [dispatch, gridModalProps])

    useEffect(() => {
        if (saveNote.loading) return;
        if (saveNote.error) {
            const errormessage = t(saveNote.code || "error_unexpected_error", { module: t(langKeys.lead).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: errormessage,
                severity: "error",
                show: true,
            }));
        } else if (saveNote.success) {
            dispatch(showSnackbar({
                message: t(langKeys.successful_transaction),
                severity: "success",
                show: true,
            }));
            setGridModal({ name: '', open: false, payload: null });
            setAutoRefresh && setAutoRefresh(true);
            dispatch(resetSaveLeadLogNote());
        }
    }, [saveNote]);

    const submitNotesModal = (data: any) => {
        dispatch(saveLeadLogNote(leadLogNotesIns(data)));
    }

    return (
        <Modal
            open={gridModalProps.name === 'NOTE' && gridModalProps.open}
            onClose={() => setGridModal({ name: '', open: false, payload: null })}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={modalClasses.root} style={{ height: '480px' }}>
                <TitleDetail title={t(langKeys.logNote_plural)} />
                <div style={{ height: '1em' }} />
                <TabPanelLogNote
                    readOnly={false}
                    loading={false}
                    notes={[]}
                    leadId={gridModalProps.payload?.leadid}
                    onSubmit={submitNotesModal}
                    AdditionalButtons={
                        () => (
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ marginLeft: '5px' }}
                                onClick={() => setGridModal({ name: '', open: false, payload: null })}
                            >
                                {t(langKeys.cancel)}
                            </Button>
                        )
                    }
                />
            </Box>
        </Modal>
    )
}

const variables = [
    'contact_name',
    'email',
    'phone',
    'activitydate',
    'activitydescription',
    'notedate',
    'notedescription',
    'asesorname',
    'custom'
].map(x => ({ key: x }));

export const DialogSendTemplate: React.FC<IFCModalProps> = ({ gridModalProps, setGridModal }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [waitClose, setWaitClose] = useState(false);
    const sendingRes = useSelector(state => state.inbox.triggerSendHSM);
    const [templatesList, setTemplatesList] = useState<Dictionary[]>([]);
    const [channelList, setChannelList] = useState<Dictionary[]>([]);
    const [bodyMessage, setBodyMessage] = useState('');
    const persons: ICrmGridPerson[] = gridModalProps.payload?.persons || [];
    const [personsWithData, setPersonsWithData] = useState<ICrmGridPerson[]>([])
    const messagetype: string = gridModalProps.payload?.messagetype || "";
    const outboundData = useSelector(state => state.inbox.outboundData);
    const [variablesTemp, setVariablesTemp] = useState([]);
    const [waitSend, setWaitSend] = useState(false);

    const { control, register, handleSubmit, setValue, getValues, trigger, reset, formState: { errors } } = useForm<any>({
        defaultValues: {
            hsmtemplateid: 0,
            hsmtemplatename: '',
            observation: '',
            communicationchannelid: 0,
            communicationchanneltype: '',
            variables: []
        }
    });

    const { fields } = useFieldArray({
        control,
        name: 'variables',
    });

    useEffect(() => {
        dispatch(getDataForOutbound());
    }, [])

    useEffect(() => {
        if (waitSend) {
            if (!sendingRes.loading && !sendingRes.error) {
                dispatch(execute({
                    header: null,
                    detail: [
                        ...personsWithData.map((x: Dictionary) => leadHistoryIns({
                            leadid: x.leadid,
                            description: variablesTemp.reduce((a: string, v: any, i: number) => (
                                a.replace(`{{${v.name}}}`, v.variable !== 'custom' ? x[v.variable] : v.text)
                            ), bodyMessage),
                            type: `SEND${messagetype.toUpperCase()}`,
                            operation: 'INSERT'
                        }))
                    ]
                }, true));
                setWaitSend(false);
                setWaitClose(true);
            } else if (sendingRes.error) {
                setWaitSend(false);
                setWaitClose(true);
            }
        }
    }, [sendingRes, waitSend])

    useEffect(() => {
        if (waitClose) {
            if (!sendingRes.loading && !sendingRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_send_message) }))
                setGridModal({ name: '', open: false, payload: null });
                dispatch(showBackdrop(false));
                dispatch(resetExecute());
                setWaitClose(false);
            } else if (sendingRes.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(sendingRes.code || "error_unexpected_error") }))
                dispatch(showBackdrop(false));
                dispatch(resetExecute());
                setWaitClose(false);
            }
        }
    }, [sendingRes, waitClose])

    useEffect(() => {
        if (!outboundData.error && !outboundData.loading) {
            setChannelList(outboundData?.value?.channels?.filter((x: Dictionary) => x.type.includes(messagetype === "HSM" ? "WHA" : messagetype)) || []);
            setTemplatesList(outboundData?.value?.templates?.filter((x: Dictionary) => messagetype !== "MAIL" ? (x.type === messagetype) : (x.type === messagetype || x.type === "HTML")) || []);
        }
    }, [outboundData, messagetype])

    useEffect(() => {
        if (gridModalProps.open) {
            setBodyMessage('')
            reset({
                hsmtemplateid: 0,
                variables: [],
                communicationchannelid: 0,
                communicationchanneltype: ''
            })
            register('hsmtemplateid', { validate: (value) => ((value && value > 0) || t(langKeys.field_required)) });

            if (messagetype === "HSM") {
                register('communicationchannelid', { validate: (value) => ((value && value > 0) || t(langKeys.field_required)) });
            } else {
                register('communicationchannelid');
            }

            if (messagetype === "MAIL") {
                setPersonsWithData(persons.filter(x => x.email && x.email.length > 0))
            } else {
                setPersonsWithData(persons.filter(x => x.phone && x.phone.length > 0))
            }
        }
    }, [gridModalProps.open])

    const onSelectTemplate = (value: Dictionary) => {
        if (value) {
            setBodyMessage(value.body);
            setValue('hsmtemplateid', value ? value.id : 0);
            setValue('hsmtemplatename', value ? value.name : '');
            const variablesList = value.body.match(/({{)(.*?)(}})/g) || [];
            const varaiblesCleaned = variablesList.map((x: string) => x.substring(x.indexOf("{{") + 2, x.indexOf("}}")))
            setValue('variables', varaiblesCleaned.map((x: string) => ({ name: x, text: '', type: 'text' })));
        } else {
            setValue('hsmtemplatename', '');
            setValue('variables', []);
            setBodyMessage('');
            setValue('hsmtemplateid', 0);
        }
    }

    const onSubmit = handleSubmit((data) => {
        const messagedata = {
            hsmtemplateid: data.hsmtemplateid,
            hsmtemplatename: data.hsmtemplatename,
            communicationchannelid: data.communicationchannelid,
            communicationchanneltype: data.communicationchanneltype,
            platformtype: data.communicationchanneltype,
            type: messagetype,
            shippingreason: "LEAD",
            listmembers: personsWithData.map((person: Dictionary) => ({
                personid: person.personid,
                phone: person.phone || "",
                firstname: person.contact_name || "",
                email: person.email || "",
                parameters: data.variables.map((v: any) => ({
                    type: "text",
                    text: v.variable !== 'custom' ? (person as Dictionary)[v.variable] : v.text,
                    name: v.name
                }))
            }))
        }
        setVariablesTemp(data.variables);
        dispatch(sendHSM(messagedata));
        dispatch(showBackdrop(true));
        setWaitSend(true)
    });

    return (
        <DialogZyx
            open={gridModalProps.name === 'MESSAGE' && gridModalProps.open}
            title={t(langKeys.send_hsm.replace("hsm", (messagetype || '').toLowerCase()))}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.continue)}
            handleClickButton1={() => setGridModal({ name: '', open: false, payload: null })}
            handleClickButton2={onSubmit}
            button2Type="submit"
        >
            <div style={{ marginBottom: 8 }}>
                {persons.length} {t(langKeys.persons_selected)}, {personsWithData.length} {t(langKeys.with)} {messagetype === "MAIL" ? t(langKeys.email).toLocaleLowerCase() : t(langKeys.phone).toLocaleLowerCase()}
            </div>
            {messagetype === 'HSM' && (
                <div className="row-zyx">
                    <FieldSelect
                        label={t(langKeys.channel)}
                        className="col-12"
                        valueDefault={getValues('communicationchannelid')}
                        onChange={value => {
                            setValue('communicationchannelid', value.communicationchannelid);
                            setValue('communicationchanneltype', value.type);
                        }}
                        error={errors?.communicationchannelid?.message}
                        loading={outboundData.loading}
                        data={channelList}
                        optionDesc="communicationchanneldesc"
                        optionValue="communicationchannelid"
                    />
                </div>
            )}
            <div className="row-zyx">
                <FieldSelect
                    label={t(langKeys.template)}
                    className="col-12"
                    valueDefault={getValues('hsmtemplateid')}
                    onChange={onSelectTemplate}
                    error={errors?.hsmtemplateid?.message}
                    loading={outboundData.loading}
                    data={templatesList}
                    optionDesc="name"
                    optionValue="id"
                />
            </div>
            {messagetype === 'MAIL' &&
                <div style={{ overflowX: 'scroll' }}>
                    <React.Fragment>
                        <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{t(langKeys.message)}</Box>
                        <div dangerouslySetInnerHTML={{ __html: bodyMessage }} />
                    </React.Fragment>
                </div>
            }
            {messagetype !== 'MAIL' &&
                <FieldEditMulti
                    label={t(langKeys.message)}
                    valueDefault={bodyMessage}
                    disabled={true}
                    rows={1}
                />
            }
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                {fields.map((item: Dictionary, i) => (
                    <React.Fragment key={"param_" + item.id}>
                        <FieldSelect
                            key={"var_" + item.id}
                            fregister={{
                                ...register(`variables.${i}.variable`, {
                                    validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                })
                            }}
                            label={item.name}
                            valueDefault={getValues(`variables.${i}.variable`)}
                            onChange={(value) => {
                                setValue(`variables.${i}.variable`, value.key)
                                trigger(`variables.${i}.variable`)
                            }}
                            error={errors?.variables?.[i]?.variable?.message}
                            data={variables}
                            uset={true}
                            prefixTranslation="lead_"
                            optionDesc="key"
                            optionValue="key"
                        />
                        {getValues(`variables.${i}.variable`) === 'custom' &&
                            <FieldEditArray
                                key={"custom_" + item.id}
                                fregister={{
                                    ...register(`variables.${i}.text`, {
                                        validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                    })
                                }}
                                valueDefault={item.value}
                                error={errors?.variables?.[i]?.text?.message}
                                onChange={(value) => setValue(`variables.${i}.text`, "" + value)}
                            />}
                    </React.Fragment>
                ))}
            </div>
        </DialogZyx>)
}