import { FC, useEffect, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { getChannelListByPersonBody, editPersonBody, insPersonUpdateLocked, personInsValidation, getPersonOne } from 'common/helpers';
import { Dictionary, IPerson } from "@types";
import { Divider, Button, makeStyles, AppBar, Tabs, Tab, Breadcrumbs, Link, Tooltip, } from '@material-ui/core';
import clsx from 'clsx';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useHistory, useLocation, useRouteMatch } from 'react-router';
import paths from 'common/constants/paths';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { getChannelListByPerson, getDomainsByTypename, resetGetDomainsByTypename, resetEditPerson, editPerson } from 'store/person/actions';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import { useForm } from 'react-hook-form';
import { execute } from 'store/main/actions';
import DialogLinkPerson from 'components/inbox/PersonLinked';
import { WhatsappIcon } from 'icons';
import LinkIcon from '@material-ui/icons/Link';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import MailIcon from '@material-ui/icons/Mail';
import SmsIcon from '@material-ui/icons/Sms';
import { GeneralInformationTab, TabPanel, CommunicationChannelsTab, ConversationsTab, OpportunitiesTab, DialogSendTemplateDetail, CustomVariableTab, SideOverview, AuditTab } from './index';
import { usePersonDetailStyles } from '../styles';

const PersonDetail2: FC<{ person: any; setrefresh: (a: boolean) => void }> = ({ person, setrefresh }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { t } = useTranslation();
    const location = useLocation<IPerson>();
    const classes = usePersonDetailStyles();
    const [tabIndex, setTabIndex] = useState('0');
    const domains = useSelector(state => state.person.editableDomains);
    const edit = useSelector(state => state.person.editPerson);
    const executeResult = useSelector(state => state.main.execute);
    const [waitLock, setWaitLock] = useState(false);
    const [waitValidation, setWaitValidation] = useState(false);
    const [showLinkPerson, setShowLinkPerson] = useState(false)
    const [payloadTemp, setpayloadTemp] = useState<any>(null)
    const [valuestosend, setvaluestosend] = useState<any>(null)
    const [openDialogTemplate, setOpenDialogTemplate] = useState(false)
    const [tableDataVariables, setTableDataVariables] = useState<Dictionary[]>([]);
    const [typeTemplate, setTypeTemplate] = useState<"HSM" | "SMS" | "MAIL">('MAIL');
    const [extraTriggers, setExtraTriggers] = useState({
        phone: person?.phone || '',
        email: person?.email || '',
    })

    const user = useSelector(state => state.login.validateToken.user);

    useEffect(() => {
        if (domains.value?.customVariables && person) {
            setTableDataVariables(domains.value.customVariables.map(x => ({ ...x, value: person?.variablecontext?.[x?.variablename] || "" })))
        }
    }, [person, domains]);

    const { setValue, getValues, trigger, register, control, formState: { errors }, watch } = useForm<any>({
        defaultValues: {
            ...person,
            corpdesc: user?.corpdesc || '',
            orgdesc: user?.orgdesc || '',
            personid: person?.personid || 0,
            groups: person?.groups || '',
            status: person?.status || 'ACTIVO',
            type: person?.type || '',
            persontype: person?.persontype || '',
            personstatus: person?.personstatus || '',
            phone: person?.phone || '',
            email: person?.email || '',
            birthday: person?.birthday || null,
            alternativephone: person?.alternativephone || '',
            alternativeemail: person?.alternativeemail || '',
            documenttype: person?.documenttype || '',
            documentnumber: person?.documentnumber || '',
            firstname: person?.firstname || '',
            lastname: person?.lastname || '',
            nickname: person?.name || '',
            sex: person?.sex || '',
            gender: person?.gender || '',
            civilstatus: person?.civilstatus || '',
            occupation: person?.occupation || '',
            educationlevel: person?.educationlevel || '',
            address: person?.address || '',
            district: person?.district || '',
            healthprofessional: person?.healthprofessional || '',
            referralchannel: person?.referralchannel || '',
            addressreference: person?.addressreference || '',
            region: person?.region || '',
            province: person?.province || '',
            country: person?.country || '',
            contact: person?.contact || '',
            clientnumber: person?.clientnumber || '',
            ubigeocode: person?.ubigeocode || '',
            floor_number: person?.floor_number || '',
            addressnumber: person?.addressnumber || '',
            postalcode: person?.postalcode || '',
            referringpersonid: person?.referringpersonid || 0,
            salary: person?.salary || 0,
            latitude: person?.latitude || 0,
            longitude: person?.longitude || 0,
            address_book: typeof person?.address_book === 'string' ? JSON.parse(person.address_book) : (person?.address_book || []),
            age: person?.birthday ? Math.floor((Number(new Date()) - new Date(person.birthday).getTime()) / 3.15576e+10) : person?.age || 0,
        },
    });
    const generalWatch = watch()
    const watchEmail = watch("email");
    const watchPhone = watch("phone");
    const watchadressbook = watch("address_book");

    useEffect(() => {
        if (!person) {
            history.push(paths.PERSON);
        } else {
            if (!person.personid) {
                person.corpdesc = user?.corpdesc || '';
                person.orgdesc = user?.orgdesc || '';
                person.personid = 0;
                person.groups = '';
                person.status = 'ACTIVO';
                person.type = '';
                person.persontype = '';
                person.personstatus = '';
                person.phone = '';
                person.email = '';
                person.birthday = null;
                person.alternativephone = '';
                person.alternativeemail = '';
                person.documenttype = '';
                person.documentnumber = '';
                person.firstname = '';
                person.lastname = '';
                person.nickname = '';
                person.sex = '';
                person.gender = '';
                person.civilstatus = '';
                person.occupation = '';
                person.educationlevel = '';
                person.address = '';
                person.district = '';
                person.healthprofessional = '';
                person.referralchannel = '';
                person.referringpersonid = 0;
                person.age = 0;
                person.salary = 0;
            }
            dispatch(getDomainsByTypename());
        }
        return () => {
            dispatch(resetGetDomainsByTypename());
            dispatch(resetEditPerson());
        };
    }, [history, person, dispatch]);

    useEffect(() => {
        register('firstname', { validate: (value) => (value && value.length) ? true : t(langKeys.field_required) + "" });
        register('lastname', { validate: (value) => (value && value.length) ? true : t(langKeys.field_required) + "" });
        register('nickname');
        register('documentnumber', {
            validate: {
                validationDNI: (value) => getValues("documenttype") === "DNI" ? (value.length === 8 || t(langKeys.validationDNI) + "") : true,
                validationRUC: (value) => getValues("documenttype") === "RUC" ? (value.length === 11 || t(langKeys.validationRUC) + "") : true,
                validationCE: (value) => getValues("documenttype") === "CE" ? (value.length <= 12 || t(langKeys.validationCE) + "") : true,
            }
        });
        register('email', {
            validate: {
                checkphone: (value) => (!!watchPhone ? true : !!value ? true : t(langKeys.validationemailexists)),
                isemail: (value) => ((!value || (/\S+@\S+\.\S+/.test(value))) || t(langKeys.emailverification) + ""),
            }
        });
        register('alternativeemail', {
            validate: {
                isemail: (value) => ((!value || (/\S+@\S+\.\S+/.test(value))) || t(langKeys.emailverification) + "")
            }
        });
        register('phone', {
            validate: {
                checkemail: (value) => (!!watchEmail ? true : !!value ? true : t(langKeys.validationphoneexists)),
                isperuphone: (value) => (value?.startsWith("+51") ? (value.length === 12 || t(langKeys.validationphone) + "") : true)
            }
        });
        register('allternativephone', {
            validate: {
                isperuphone: (value) => (value?.startsWith("+51") ? (value.length === 12 || t(langKeys.validationphone) + "") : true)
            }
        });
    }, [history, person, dispatch, watchEmail, watchPhone]);

    useEffect(() => {
        if (domains.loading) return;
        if (domains.error === true) {
            dispatch(showSnackbar({
                message: domains.message!,
                show: true,
                severity: "error"
            }));
        }
    }, [domains, dispatch]);

    useEffect(() => {
        if (edit.loading) return;

        if (edit.error === true) {
            dispatch(showBackdrop(false));
            dispatch(showSnackbar({
                message: edit.message!,
                show: true,
                severity: "error"
            }));
        } else if (edit.success) {
            dispatch(showBackdrop(false));
            dispatch(showSnackbar({
                message: t(langKeys.successful_edit),
                show: true,
                severity: "success"
            }));
            if (!person?.personid) {
                history.push(paths.PERSON);
            }
        }
    }, [edit, dispatch]);

    const editperson = () => {
        dispatch(showBackdrop(true));
        dispatch(editPerson(payloadTemp.parameters.personid ? payloadTemp : {
            header: editPersonBody({
                ...person, ...valuestosend,
                address_book: JSON.stringify(valuestosend.address_book),
                variablecontext: tableDataVariables.filter(x => x.value).reduce((acc, x) => ({ ...acc, [x.variablename]: x.value }), {})
            }),
            detail: []
        }, !payloadTemp.parameters.personid));

        setpayloadTemp(null)
        setvaluestosend(null)
    }

    const handleEditPerson = async () => {
        const allOk = await trigger();
        if (allOk) {
            const values = getValues();
            console.log(values)
            const callback = () => {
                const payload = editPersonBody({
                    ...values,
                    address_book: JSON.stringify(values.address_book),
                    variablecontext: tableDataVariables.filter(x => x.value).reduce((acc, x) => ({ ...acc, [x.variablename]: x.value }), {})
                });
                setpayloadTemp(payload)
                setvaluestosend(values)
                dispatch(execute(personInsValidation({
                    id: payload.parameters?.id || 0,
                    phone: payload.parameters?.phone || "",
                    email: payload.parameters?.email || "",
                    alternativephone: payload.parameters?.alternativephone || "",
                    alternativeemail: payload.parameters?.alternativeemail || "",
                    operation: payload.parameters.operation
                })))
                setWaitValidation(true)
                dispatch(showBackdrop(true));
            }

            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback
            }))
        }
    }

    const handleLock = () => {
        if (person) {
            const callback = () => {
                setValue('locked', !getValues('locked'));
                trigger('locked');
                dispatch(execute(insPersonUpdateLocked({ ...person, locked: !person.locked })));
                dispatch(showBackdrop(true));
                setWaitLock(true);
            }

            dispatch(manageConfirmation({
                visible: true,
                question: getValues('locked') ? t(langKeys.confirmation_person_unlock) : t(langKeys.confirmation_person_lock),
                callback
            }))
        }
    }

    useEffect(() => {
        if (waitLock) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_transaction) }))
                dispatch(showBackdrop(false));
                setWaitLock(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.person).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitLock(false);
            }
        }
    }, [executeResult, waitLock]);

    useEffect(() => {
        if (waitValidation) {
            if (!executeResult.loading && !executeResult.error) {
                let errormessage: any[] = []
                if (executeResult?.data[0].phone_exists) errormessage = errormessage.concat(t(langKeys.phone) + " " + payloadTemp.parameters.phone)
                if (executeResult?.data[0].email_exists) errormessage = errormessage.concat(t(langKeys.mail) + " " + payloadTemp.parameters.email)
                if (executeResult?.data[0].alternativephone_exists) errormessage = errormessage.concat(t(langKeys.phone) + " " + payloadTemp.parameters.alternativephone)
                if (executeResult?.data[0].alternativeemail_exists) errormessage = errormessage.concat(t(langKeys.mail) + " " + payloadTemp.parameters.alternativeemail)
                if (errormessage.length === 0) {
                    editperson()
                } else {
                    dispatch(showBackdrop(false));
                    dispatch(manageConfirmation({
                        visible: true,
                        question: `${t(langKeys.personrepeatedwarning1)} ${errormessage.join(" - ")} ${t(langKeys.personrepeatedwarning2)}`,
                        callback: editperson
                    }))
                }
                setWaitValidation(false);
                setrefresh(true)
            } else if (executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: "error" }))
                dispatch(showBackdrop(false));
                setWaitValidation(false);
            }
        }
    }, [executeResult, waitValidation]);

    if (!person) {
        return <div />;
    }

    return (
        <div className={classes.root}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link
                    underline="hover"
                    color="inherit"
                    href="/"
                    onClick={(e) => {
                        e.preventDefault();
                        history.goBack();
                    }}
                >
                    <Trans i18nKey={langKeys.person} count={2} />
                </Link>
                <Link
                    underline="hover"
                    color="textPrimary"
                    href={location.pathname}
                    onClick={(e) => {
                        e.preventDefault();
                    }}
                >
                    <Trans i18nKey={langKeys.personDetail} />
                </Link>
            </Breadcrumbs>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <h1>{person.name}</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {!!person.personid &&
                        <>
                            {!!extraTriggers.phone &&
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<WhatsappIcon width={24} style={{ fill: '#FFF' }} />}
                                    onClick={() => {
                                        setOpenDialogTemplate(true);
                                        setTypeTemplate("HSM");
                                    }}
                                >
                                    <Trans i18nKey={langKeys.send_hsm} />
                                </Button>
                            }
                            {(!!extraTriggers.email && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(extraTriggers.email)) &&
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<MailIcon width={24} style={{ fill: '#FFF' }} />}
                                    onClick={() => {
                                        setOpenDialogTemplate(true);
                                        setTypeTemplate("MAIL");
                                    }}
                                >
                                    <Trans i18nKey={langKeys.send_mail} />
                                </Button>
                            }
                            {!!extraTriggers.phone &&
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<SmsIcon width={24} style={{ fill: '#FFF' }} />}
                                    onClick={() => {
                                        setOpenDialogTemplate(true);
                                        setTypeTemplate("SMS");
                                    }}
                                >
                                    <Trans i18nKey={langKeys.send_sms} />
                                </Button>
                            }
                            <Button
                                variant="contained"
                                type="button"
                                color="primary"
                                startIcon={<LinkIcon color="secondary" />}
                                onClick={() => setShowLinkPerson(true)}
                            >
                                {t(langKeys.link)}
                            </Button>
                            <Button
                                variant="contained"
                                type="button"
                                color="primary"
                                startIcon={getValues('locked') ? <LockOpenIcon color="secondary" /> : <LockIcon color="secondary" />}
                                onClick={handleLock}
                            >
                                {getValues('locked') ? t(langKeys.unlock) : t(langKeys.lock)}
                            </Button>
                        </>
                    }
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        startIcon={<ClearIcon color="secondary" />}
                        style={{ backgroundColor: "#FB5F5F" }}
                        onClick={(e) => {
                            e.preventDefault();
                            history.goBack();
                        }}
                    >
                        {t(langKeys.back)}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleEditPerson}
                        startIcon={<SaveIcon color="secondary" />}
                        style={{ backgroundColor: "#55BD84" }}
                    >
                        <Trans i18nKey={langKeys.save} />
                    </Button>
                </div>
            </div>
            <div style={{ height: 7 }} />
            <div className={classes.rootContent}>
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflowY: 'hidden' }}>
                    <AppBar position="static" elevation={0}>
                        <Tabs
                            value={tabIndex}
                            onChange={(_, i: string) => setTabIndex(i)}
                            className={classes.tabs}
                            TabIndicatorProps={{ style: { display: 'none' } }}
                        >
                            <Tab
                                className={clsx(classes.tab, classes.label, tabIndex === "0" && classes.activetab)}
                                label={<div><Trans i18nKey={langKeys.generalinformation} /></div>}
                                value="0"
                            />
                            {!!person.personid &&
                                <Tab
                                    className={clsx(classes.tab, classes.label, tabIndex === "1" && classes.activetab)}
                                    label={<div><Trans i18nKey={langKeys.communicationchannel} /></div>}
                                    value="1"
                                />
                            }
                            {!!person.personid &&
                                <Tab
                                    className={clsx(classes.tab, classes.label, tabIndex === "2" && classes.activetab)}
                                    label={<Trans i18nKey={langKeys.conversation} count={2} />}
                                    value="2"
                                />
                            }
                            {!!person.personid &&
                                <Tab
                                    className={clsx(classes.tab, classes.label, tabIndex === "3" && classes.activetab)}
                                    label={<Trans i18nKey={langKeys.opportunity} count={2} />}
                                    value="3"
                                />
                            }
                            {!!person.personid &&
                                <Tab
                                    className={clsx(classes.tab, classes.label, tabIndex === "4" && classes.activetab)}
                                    label={<Trans i18nKey={langKeys.audit} />}
                                    value="4"
                                />
                            }
                            {!!person.personid &&
                                <Tab
                                    className={clsx(classes.tab, classes.label, tabIndex === "5" && classes.activetab)}
                                    label={
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                            <Trans i18nKey={langKeys.customvariables} />
                                            <Tooltip title={<div style={{ fontSize: 12 }}>{t(langKeys.customvariableslist_helper_lead)}</div>} arrow placement="top" >
                                                <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                                            </Tooltip>
                                        </div>}
                                    value="5"
                                />
                            }
                        </Tabs>
                    </AppBar>
                    <TabPanel value="0" index={tabIndex}>
                        <GeneralInformationTab
                            getValues={getValues}
                            setValue={setValue}
                            person={person}
                            trigger={trigger}
                            domains={domains}
                            errors={errors}
                            control={control}
                            extraTriggers={extraTriggers}
                            setExtraTriggers={setExtraTriggers}
                            watch={generalWatch}
                            addressbook={watchadressbook}
                        />
                    </TabPanel>
                    <TabPanel value="1" index={tabIndex}>
                        <CommunicationChannelsTab
                            getValues={getValues}
                            setValue={setValue}
                            person={person}
                            domains={domains}
                        />
                    </TabPanel>
                    <TabPanel value="2" index={tabIndex}>
                        <ConversationsTab person={person} />
                    </TabPanel>
                    <TabPanel value="3" index={tabIndex}>
                        <OpportunitiesTab person={person} />
                    </TabPanel>
                    <TabPanel value="4" index={tabIndex}>
                        <AuditTab person={person} />
                    </TabPanel>
                    <TabPanel value="5" index={tabIndex}>
                        <CustomVariableTab tableData={tableDataVariables} setTableData={setTableDataVariables} />
                    </TabPanel>
                </div>
                <Divider style={{ backgroundColor: '#EBEAED' }} orientation="vertical" flexItem />
                {!!person.personid &&
                    <SideOverview person={generalWatch} classes={classes} setValue={setValue} />
                }
            </div>
            <DialogLinkPerson
                openModal={showLinkPerson}
                setOpenModal={setShowLinkPerson}
                person={person}
                callback={(newPerson) => {
                    setValue("firstname", newPerson.firstname)
                    trigger("firstname")
                    setValue("lastname", newPerson.lastname)
                    trigger("lastname")
                    setValue("nickname", newPerson.nickname)
                    trigger("nickname")
                    setValue("documenttype", newPerson.documenttype)
                    trigger("documenttype")
                    setValue("documentnumber", newPerson.documentnumber)
                    trigger("documentnumber")
                    setValue("phone", newPerson.phone)
                    trigger("phone")
                    setValue("alternativephone", newPerson.alternativephone)
                    trigger("alternativephone")
                    setValue("email", newPerson.email)
                    trigger("email")
                    setValue("alternativeemail", newPerson.alternativeemail)
                    trigger("alternativeemail")
                    setValue("birthday", newPerson.birthday)
                    trigger("birthday")
                    setValue("gender", newPerson.gender)
                    trigger("gender")
                    setValue("educationlevel", newPerson.educationlevel)
                    trigger("educationlevel")
                    setValue("civilstatus", newPerson.civilstatus)
                    trigger("civilstatus")
                    setValue("occupation", newPerson.occupation)
                    trigger("occupation")
                    dispatch(getChannelListByPerson(getChannelListByPersonBody(person.personid)));
                }}
            />
            <DialogSendTemplateDetail
                openModal={openDialogTemplate}
                setOpenModal={setOpenDialogTemplate}
                persons={[getValues()]}
                type={typeTemplate}
            />
        </div>
    );
}

const PersonDetail: FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation<IPerson>();
    const executeResult = useSelector(state => state.main.execute);
    const [person, setperson] = useState<any>(location.state as IPerson | null);
    const [refresh, setrefresh] = useState<boolean>(false);

    const [waitLoading, setWaitLoading] = useState(false);
    const match = useRouteMatch<{ id: string, columnid?: string, columnuuid?: string }>();

    useEffect(() => {
        if (!person || refresh) {
            dispatch(showBackdrop(true));
            setWaitLoading(true)
            dispatch(execute(getPersonOne({ personid: match.params.id })));
            setrefresh(false)
        }
    }, [person, refresh]);

    useEffect(() => {
        if (waitLoading && !executeResult.loading) {
            if (!executeResult.error && executeResult.data.length) {
                setperson(executeResult.data[0]);
                dispatch(showBackdrop(false));
                setWaitLoading(false);
            } else if (executeResult.error || executeResult.data.length) {
                dispatch(showBackdrop(false));
                setWaitLoading(false);
                history.push(paths.PERSON);
            }
        }
    }, [executeResult, waitLoading]);

    return (
        <>
            <PersonDetail2 person={person} setrefresh={setrefresh} />
        </>
    );
}

export default PersonDetail;