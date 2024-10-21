/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Tabs from '@material-ui/core/Tabs';
import Avatar from '@material-ui/core/Avatar';
import { EMailInboxIcon, PhoneIcon, DocIcon, FileIcon1 as FileIcon, PdfIcon, PptIcon, TxtIcon, XlsIcon, ZipIcon, OrderMiniatureIcon, ServiceDeskIcon } from 'icons';
import { getTicketsPerson, showInfoPanel, updateClassificationPerson, updatePerson } from 'store/inbox/actions';
import { GetIcon, FieldEdit, FieldSelect, AntTab, FieldEditMulti } from 'components'
import { langKeys } from 'lang/keys';
import { useTranslation } from 'react-i18next';
import { conversationAttachmentHistorySel, conversationClassificationHistorySel, conversationOportunityHistorySel, conversationOrderHistorySel, conversationSDHistorySel, convertLocalDate, getAssignmentRulesByGroup, getPropertySelByName, getValuesFromDomain, insertClassificationConversation, insPersonBody, validateIsUrl } from 'common/helpers';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { Dictionary } from '@types';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import { useForm } from 'react-hook-form';
import { getMultiCollectionAux, resetMultiMainAux, execute, getCollectionAux2 } from 'store/main/actions';
import Fab from '@material-ui/core/Fab';
import { Button, CircularProgress } from '@material-ui/core';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import clsx from 'clsx';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import DeleteIcon from '@material-ui/icons/Delete';
import DialogInteractions from './DialogInteractions';
import DialogLinkPerson from './PersonLinked';
import LinkIcon from '@material-ui/icons/Link';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { getOrders } from 'store/orders/actions';
import DetailOrdersModal from 'pages/orders/components/DetailOrdersModal';
import { Rating } from '@material-ui/lab';
import LeadFormModal from 'pages/crm/LeadFormModal';
import ServiceDeskLeadFormModal from 'pages/servicedesk/ServiceDeskLeadFormModal';
import { transformPersonToItemsFormat } from 'pages/person/components/SideOverview';
import { Property } from 'pages/person/components';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

const useStyles = makeStyles((theme) => ({
    containerInfo: {
        flex: '0 0 300px',
        width: 300,
        display: 'flex',
        flexDirection: 'column',
        overflowY: "auto",

        overflowWrap: 'anywhere',
        borderLeft: '1px solid rgba(132, 129, 138, 0.101961);',
        position: 'relative'
    },
    collapseInfo: {
        position: 'absolute',
        top: 'calc(50% - 20px)',
    },
    infoClose: {
        left: -20,
    },
    containerName: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(2)
    },
    containerNameHead: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: theme.spacing(.5)
    },
    containerInfoClient: {
        padding: theme.spacing(1),
        display: 'flex',
        backgroundColor: '#fff',
        flexDirection: 'column',
        gap: theme.spacing(1)
    },
    containerPreviewTicket: {
        padding: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(.5),
        overflowY: 'auto',
        cursor: 'pointer',
        flex: 1,
        borderBottom: '1px solid #EBEAED'
    },
    label: {
        overflowWrap: 'anywhere',
        fontSize: 12,
        color: '#B6B4BA',
    },
    titlePreviewTicket: {
        fontWeight: 500,
        fontSize: 16,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(.5),
    },
    value: {
        fontSize: 14,
        fontWeight: 400,
        color: '#2E2C34',
    },
    btn: {
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        padding: '3px 6px',
        fontSize: 12,
        color: 'white',
        backgroundColor: '#55BD84',
    },
    propIcon: {
        stroke: '#8F92A1'
    },
    orderReverse: {
        flexDirection: 'column-reverse'
    },
    orderDefault: {
        flexDirection: 'column'
    },
    containerAttachment: {
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        borderBottom: '1px solid #e1e1e1',
        padding: theme.spacing(1),
        paddingLeft: 16,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#ececec'
        }
    },
    displayMenu: {
        padding: theme.spacing(1),
        flexDirection: 'column',
        gap: theme.spacing(.5),
        overflowY: 'auto',
        cursor: 'pointer',
        flex: 1,
        borderBottom: '1px solid #EBEAED',
        textAlign: "center",
        display: "block",
        alignContent: "center",
        color: "grey",
        paddingBottom: 0
    }
}));

const InfoClient: React.FC = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const showInfoPanelTrigger = () => dispatch(showInfoPanel())
    const [showLinkPerson, setShowLinkPerson] = useState(false)
    const [displayAll, setdisplayAll] = useState(false)
    const person = useSelector(state => state.inbox.person.data);
    const user = useSelector(state => state.login.validateToken.user);
    const itemsInfo = transformPersonToItemsFormat(user?.uiconfig?.person || [])
    const getVisibleItems = () => {
        let sizeSum = 0;
        return itemsInfo.filter((item: any) => {
            if (sizeSum + item.size <= 4 || displayAll) {
                sizeSum += item.size;
                return true;
            }
            return false;
        });
    };
    const visibleItems = getVisibleItems();

    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <IconButton
                    onClick={showInfoPanelTrigger}
                    size="small"
                >
                    <CloseIcon />
                </IconButton>
                <div className={classes.containerInfoClient} style={{ paddingTop: 0 }}>
                    <div className={classes.containerNameHead}>
                        <Avatar alt="" style={{ width: 120, height: 120 }} src={person?.imageurldef} />
                        <div style={{ flex: 1, textAlign: 'center' }}>
                            <div style={{ fontSize: 18, fontWeight: 500 }}>{person?.firstname} {person?.lastname}</div>
                        </div>
                        <Button
                            variant="contained"
                            component="span"
                            startIcon={<LinkIcon color="secondary" />}
                            color="primary"
                            onClick={() => {
                                setShowLinkPerson(true)
                            }}
                        >{t(langKeys.link)}
                        </Button>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {visibleItems.map((x: any, index: number) => {
                            return (
                                <div
                                    key={`dataindex-${index}`}
                                    style={{
                                        width: x.size === 2 ? "100%" : "calc(50% - 8px)",
                                        flexBasis: x.size === 2 ? "100%" : "calc(50% - 8px)",
                                        flexGrow: 1,
                                    }}
                                >
                                    <Property
                                        icon={x.icon}
                                        title={t(x.field)}
                                        subtitle={(person?.[x.field] || "")}
                                        mt={1}
                                        mb={1}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    {itemsInfo.length > visibleItems.length && (
                        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                            <IconButton onClick={() => setdisplayAll(!displayAll)} >
                                <ExpandMoreIcon />
                            </IconButton>
                        </div>
                    )}
                    {displayAll && (
                        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                            <IconButton onClick={() => setdisplayAll(!displayAll)} >
                                <ExpandLessIcon />
                            </IconButton>
                        </div>
                    )}
                </div>
            </div>
            <DialogLinkPerson
                openModal={showLinkPerson}
                setOpenModal={setShowLinkPerson}
                person={person}
            />
        </>
    )
}

const InfoTab: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const person = useSelector(state => state.inbox.person.data);
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const [view, setView] = useState('view');
    const user = useSelector(state => state.login.validateToken.user);

    const multiData = useSelector(state => state.main.multiDataAux);
    const { setValue, getValues, trigger, register, formState: { errors } } = useForm<any>({
        defaultValues: { ...person, birthday: person?.birthday || '', district: person?.district || '' }
    });

    useEffect(() => {
        register('firstname', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('lastname');
        register('name');
        register('documentnumber', {
            validate: {
                validationDNI: (value) => getValues("documenttype") === "DNI" ? (value.length === 8 || t(langKeys.validationDNI) + "") : true,
                validationRUC: (value) => getValues("documenttype") === "RUC" ? (value.length === 11 || t(langKeys.validationRUC) + "") : true,
                validationCE: (value) => getValues("documenttype") === "CE" ? (value.length <= 12 || t(langKeys.validationCE) + "") : true,
            }
        });
        register('lastname');
        register('name');
        register('documenttype', {
            validate: {
                validationDNI: (value) => !getValues("documentnumber") || (!!value || (t(langKeys.required) + "")),
            }
        });
        register('persontype');
        register('observation');
        // register('email', {
        //     validate: {
        //         isemail: (value) => ((!value || (/\S+@\S+\.\S+/.test(value))) || t(langKeys.emailverification) + "")
        //     }
        // });
        register('alternativeemail', {
            validate: {
                isemail: (value) => ((!value || (/\S+@\S+\.\S+/.test(value))) || t(langKeys.emailverification) + "")
            }
        });
        register('alternativephone', {
            validate: {
                isperuphone: (value) => {
                    const isNumeric = /^\d+$/.test(value); // Valida si el valor solo contiene números
                    const isCorrectLength = value?.startsWith("51") ? value.length === 11 : true;
                    return ((isNumeric && isCorrectLength) || value === "") || t(langKeys.validationphone) + "";
                }
            }
        });
        register('birthday');
        register('sex');
        register('occupation');
        register('civilstatus');
        register('educationlevel');
        register('address');
        register('healthprofessional');
        register('referralchannel');
        register('district');
        register('usergroup');
        register('addressreference');
        dispatch(getMultiCollectionAux([
            getValuesFromDomain("TIPODOCUMENTO"),
            getValuesFromDomain("GENERO"),
            getValuesFromDomain("OCUPACION"),
            getValuesFromDomain("ESTADOCIVIL"),
            getValuesFromDomain("NIVELEDUCATIVO"),
            getPropertySelByName("OCUPACION"),
            getValuesFromDomain("TIPOPERSONA"),
            getAssignmentRulesByGroup(ticketSelected?.usergroup || "", user?.groups || ""),
            getValuesFromDomain("GRUPOPERSONA"),
        ]));
        return () => {
            dispatch(resetMultiMainAux());
        }
    }, [])

    const onSubmit = async () => {
        const allOk = await trigger(); //para q valide el formulario
        if (allOk) {
            const data = getValues();
            dispatch(execute(insPersonBody({
                ...person,
                ...data,
                id: person?.personid,
                operation: 'UPDATE',
                birthday: data.birthday || null
            })));
            dispatch(updatePerson({ ...person, ...data, name: `${data.firstname} ${data.lastname}` }));
            setView('view');
        }
    };

    if (view === 'edit') {
        return (
            <>
                <div style={{ position: 'relative' }}>
                    <Fab
                        onClick={onSubmit}
                        size="small"
                        style={{ position: 'absolute', top: 8, right: 8, zIndex: 99999 }}
                    >
                        <SaveIcon color="primary" />
                    </Fab>
                </div>
                <div style={{ overflowY: 'auto' }} className="scroll-style-go">
                    <div className={classes.containerInfoClient} style={{ paddingTop: 0, backgroundColor: 'transparent' }}>
                        <FieldEdit
                            label={t(langKeys.firstname)}
                            onChange={(value) => setValue('firstname', value)}
                            valueDefault={getValues('firstname')}
                            error={errors?.firstname?.message}
                            maxLength={50}
                        />
                        <FieldEdit
                            label={t(langKeys.lastname)}
                            onChange={(value) => setValue('lastname', value)}
                            valueDefault={getValues('lastname')}
                            error={errors?.lastname?.message}
                            maxLength={50}
                        />
                        <FieldEdit
                            label={"Nickname"}
                            onChange={(value) => setValue('name', value)}
                            valueDefault={getValues('name')}
                            error={errors?.name?.message}
                            maxLength={50}
                        />
                        <FieldSelect
                            onChange={(value) => setValue('documenttype', value?.domainvalue || "")}
                            label={t(langKeys.documenttype)}
                            loading={multiData.loading}
                            data={multiData.data[0]?.data || []}
                            optionValue="domainvalue"
                            optionDesc="domainvalue"
                            valueDefault={getValues('documenttype')}
                            error={errors?.documenttype?.message}
                            uset={true}
                            prefixTranslation="type_documenttype_"
                        />
                        <FieldEdit
                            label={t(langKeys.documentnumber)}
                            onChange={(value) => setValue('documentnumber', value)}
                            valueDefault={getValues('documentnumber')}
                            type="number"
                            error={errors?.documentnumber?.message}
                            maxLength={50}
                        />
                        <FieldSelect
                            onChange={(value) => setValue('persontype', value?.domainvalue || "")}
                            label={t(langKeys.personType)}
                            loading={multiData.loading}
                            data={multiData.data[6]?.data || []}
                            valueDefault={getValues('persontype')}
                            error={errors?.persontype?.message}
                            uset={true}
                            prefixTranslation="type_persontype_"
                            optionValue="domainvalue"
                            optionDesc="domainvalue"
                        />
                        <FieldEdit
                            label={t(langKeys.alternativePhone)}
                            onChange={(value) => setValue('alternativephone', value)}
                            valueDefault={getValues('alternativephone')}
                            error={errors?.alternativephone?.message}
                            maxLength={20}
                        />
                        <FieldEdit
                            label={t(langKeys.alternativeEmail)}
                            onChange={(value) => setValue('alternativeemail', value)}
                            valueDefault={getValues('alternativeemail')}
                            error={errors?.alternativeemail?.message}
                            maxLength={50}
                        />
                        <FieldEdit
                            label={t(langKeys.birthday)}
                            onChange={(value) => setValue('birthday', value)}
                            valueDefault={getValues('birthday')}
                            inputProps={{
                                max: new Date().toISOString().split('T')[0]
                            }}
                            type="date"
                            error={errors?.birthday?.message}
                        />
                        <FieldSelect
                            onChange={(value) => setValue('sex', value?.val)}
                            label={t(langKeys.sex)}
                            loading={multiData.loading}
                            data={[{ val: "Hombre", }, { val: "Mujer" }]}
                            optionValue="val"
                            optionDesc="val"
                            valueDefault={getValues('sex')}
                            error={errors?.sex?.message}
                        />
                        <FieldSelect
                            onChange={(value) => setValue('educationlevel', value?.domainvalue)}
                            label={t(langKeys.educationLevel)}
                            loading={multiData.loading}
                            data={multiData.data[4]?.data || []}
                            optionValue="domainvalue"
                            optionDesc="domainvalue"
                            valueDefault={getValues('educationlevel')}
                            uset={true}
                            prefixTranslation="type_educationlevel_"
                            error={errors?.educationlevel?.message}
                        />
                        <FieldSelect
                            onChange={(value) => setValue('civilstatus', value?.domainvalue)}
                            label={t(langKeys.civilStatus)}
                            loading={multiData.loading}
                            data={multiData.data[3]?.data || []}
                            optionValue="domainvalue"
                            optionDesc="domainvalue"
                            valueDefault={getValues('civilstatus')}
                            uset={true}
                            prefixTranslation="type_civilstatus_"
                            error={errors?.civilstatus?.message}
                        />
                        {multiData?.data?.[5]?.data?.[0].propertyvalue === "LIBRE" ?
                            <FieldEdit
                                label={t(langKeys.occupation)}
                                onChange={(value) => { setValue('occupation', value); setValue('occupationdesc', value) }}
                                valueDefault={getValues('occupation')}
                                error={errors?.occupation?.message}
                            /> : <FieldSelect
                                onChange={(value) => { setValue('occupation', value?.domainvalue); setValue('occupationdesc', value?.domainvalue); }}
                                label={t(langKeys.occupation)}
                                loading={multiData.loading}
                                data={multiData.data[2]?.data || []}
                                optionValue="domainvalue"
                                optionDesc="domainvalue"
                                valueDefault={getValues('occupation')}
                                uset={true}
                                prefixTranslation="type_ocupation_"
                                error={errors?.occupation?.message}
                            />}
                        <FieldSelect
                            valueDefault={getValues("usergroup")}
                            onChange={(value) => {
                                setValue('usergroup', value?.domainvalue || "");
                            }}
                            label={t(langKeys.group)}
                            loading={multiData.loading}
                            data={multiData.data[8]?.data || []}
                            optionValue="domainvalue"
                            optionDesc="domaindesc"
                        />
                        {/* grupos */}
                        <FieldEdit
                            label={t(langKeys.address)}
                            onChange={(value) => setValue('address', value)}
                            valueDefault={getValues('address')}
                            error={errors?.address?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.district)}
                            onChange={(value) => setValue('district', value)}
                            valueDefault={getValues('district')}
                            error={errors?.district?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.addressReference)}
                            onChange={(value) => setValue('addressreference', value)}
                            valueDefault={getValues('addressreference')}
                            error={errors?.addressreference?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.referralchannel)}
                            onChange={(value) => setValue('referralchannel', value)}
                            valueDefault={getValues('referralchannel')}
                            error={errors?.referralchannel?.message}
                        />
                        <FieldEditMulti
                            label={t(langKeys.observation)}
                            onChange={(value) => setValue('observation', value)}
                            valueDefault={getValues('observation')}
                            error={errors?.observation?.message}
                        />
                    </div>
                    <Fab
                        onClick={() => setView('view')}
                        size="small"
                        style={{ position: 'fixed', bottom: 8, right: 8 }}
                    >
                        <CloseIcon color="action" />
                    </Fab>
                </div>

            </>
        )
    }
    return (
        <div style={{ overflowY: 'auto' }} className="scroll-style-go">
            <div className={classes.containerInfoClient} style={{ paddingTop: 0, backgroundColor: 'transparent' }}>
                {<div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.firstname)}</div>
                        <div>{person?.firstname || "-"}</div>
                    </div>
                </div>}
                {<div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.lastname)}</div>
                        <div>{person?.lastname || "-"}</div>
                    </div>
                </div>}
                {<div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>Nickname</div>
                        <div>{person?.name || "-"}</div>
                    </div>
                </div>}
                {<div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.documenttype)}</div>
                        <div>{(person?.documenttype && t("type_documenttype_" + person?.documenttype.toLocaleLowerCase())) || "-"}</div>
                    </div>
                </div>}
                {<div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.documentnumber)}</div>
                        <div>{person?.documentnumber || "-"}</div>
                    </div>
                </div>}
                {<div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.personType)}</div>
                        <div>{person?.persontype || "-"}</div>
                    </div>
                </div>}
                {<div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.alternativePhone)}</div>
                        <div>{person?.alternativephone || "-"}</div>
                    </div>
                </div>}
                {<div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.alternativeEmail)}</div>
                        <div>{person?.alternativeemail || "-"}</div>
                    </div>
                </div>}
                {<div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.birthday)}</div>
                        <div>{person?.birthday || "-"}</div>
                    </div>
                </div>}
                {<div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.sex)}</div>
                        <div>{(person?.sex && t("type_gender_" + person?.sex.toLocaleLowerCase())) || "-"}</div>
                    </div>
                </div>}
                {<div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.educationLevel)}</div>
                        <div>{(person?.educationlevel && t("type_educationlevel_" + person?.educationlevel.toLocaleLowerCase())) || "-"}</div>
                    </div>
                </div>}
                {<div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.civilStatus)}</div>
                        <div>{(person?.civilstatus && t("type_civilstatus_" + person?.civilstatus.toLocaleLowerCase())) || "-"}</div>
                    </div>
                </div>}
                {<div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.occupation)}</div>
                        <div>{(person?.occupation && t("type_ocupation_" + person?.occupation)) || "-"}</div>
                    </div>
                </div>}
                {<div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.group)}</div>
                        <div>{person?.usergroup || "-"}</div>
                    </div>
                </div>}
                {<div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.address)}</div>
                        <div>{person?.address || "-"}</div>
                    </div>
                </div>}
                {<div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.district)}</div>
                        <div>{person?.district || "-"}</div>
                    </div>
                </div>}
                {<div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.addressReference)}</div>
                        <div>{person?.addressreference || "-"}</div>
                    </div>
                </div>}
                {<div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.firstContactDate)}</div>
                        <div>{person?.firstcontact ? new Date(person?.firstcontact).toLocaleString() : "-"}</div>
                    </div>
                </div>}
                {<div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.lastContactDate)}</div>
                        <div>{person?.lastcontact ? new Date(person?.lastcontact).toLocaleString() : "-"}</div>
                    </div>
                </div>}
                {<div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.lastCommunicationChannel)}</div>
                        <div>{person?.lastcommunicationchannel || "-"}</div>
                    </div>
                </div>}
                {<div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.totalconversations)}</div>
                        <div>{person?.totaltickets || "-"}</div>
                    </div>
                </div>}
                {<div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.observation)}</div>
                        <div style={{ whiteSpace: "pre-wrap" }}>{person?.observation || "-"}</div>
                    </div>
                </div>}
            </div>
            <Fab
                onClick={() => setView('edit')}
                size="small"
                style={{ position: 'fixed', bottom: 8, right: 8 }}
            >
                <EditIcon color="action" />
            </Fab>
        </div>
    )
}

const Variables: React.FC = () => {
    const variablecontext = useSelector(state => state.inbox.person.data?.variablecontext);
    const configurationVariables = useSelector(state => state.inbox.configurationVariables.data);
    const classes = useStyles();

    return (
        <div className={`scroll-style-go ${classes.containerInfoClient}`} style={{ overflowY: 'auto', flex: 1, backgroundColor: 'transparent' }}>

            {variablecontext && !(variablecontext instanceof Array) && configurationVariables.map(({ fontbold, fontcolor, variable, description }, index) => {
                const variabletmp = variablecontext[variable];
                if (!variabletmp) {
                    return null;
                }
                return (
                    <div key={variable} className={classes.containerName}>
                        <div style={{ fontWeight: fontbold ? 'bold' : 'normal' }}>
                            <div className={classes.label}>{description}</div>
                            <div style={{ color: fontcolor }} dangerouslySetInnerHTML={{ __html: validateIsUrl(variabletmp) || '-' }}>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

const ClassificationsList: React.FC<{ classifications: any, handleDelete: (x: any) => void, ticket: any }> = ({ classifications, handleDelete, ticket }) => {
    const classes = useStyles();
    return (
        <div style={{ overflowY: 'auto' }} className="scroll-style-go">
            <div className={classes.containerInfoClient} style={{ paddingTop: 0, backgroundColor: 'transparent', paddingLeft: 5 }}>
                {classifications.map((x: any) => {
                    return (
                        <div className={classes.containerPreviewTicket} style={{ flexDirection: "initial", alignItems: "center", display: "block", paddingLeft: 0 }} key={x.classificationid}>
                            <div className={classes.label} style={{ textAlign: "right" }}>{x.advisor_name}</div>
                            <div style={{ display: "flex" }}>
                                <SubdirectoryArrowRightIcon style={{ color: "grey" }} />
                                <div style={{ flex: 1 }}>
                                    <div>{x?.path?.replace("/", " / ")}</div>
                                </div>
                                <DeleteIcon style={{ color: "#B6B4BA" }} onClick={() => { handleDelete(x) }} />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const Classifications: React.FC = () => {
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [classifications, setClassifications] = useState<any[]>([]);
    const [waitSave, setWaitSave] = useState(false);
    const tipifyRes = useSelector(state => state.main.execute);
    const [showAll, setShowAll] = useState(false);
    const previewTicketList = useSelector(state => state.inbox.previewTicketList);
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);
    const [openModal, setOpenModal] = useState(false);

    const handleClickOpen = (row: any) => {
        setOpenModal(true);
        setRowSelected(row)
    };


    const mainAux2 = useSelector(state => state.main.mainAux2);
    const fetchData = () => {
        dispatch(getTicketsPerson(ticketSelected?.personid!, ticketSelected?.conversationid!))
        dispatch(getCollectionAux2(conversationClassificationHistorySel(ticketSelected?.personid!!)))
    }

    useEffect(() => {
        dispatch(getTicketsPerson(ticketSelected?.personid!, ticketSelected?.conversationid!))
        dispatch(getCollectionAux2(conversationClassificationHistorySel(ticketSelected?.personid!!)))
    }, [])

    useEffect(() => {
        if (!tipifyRes.loading && !tipifyRes.error) {
            fetchData()
        }
    }, [tipifyRes])

    useEffect(() => {
        if (!mainAux2.loading && !mainAux2.error) {
            dispatch(updateClassificationPerson(mainAux2.data.length > 0))
            setClassifications(mainAux2.data.reverse())
        }
    }, [mainAux2])

    useEffect(() => {
        if (waitSave) {
            dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
            dispatch(showBackdrop(false));
            setWaitSave(false);
        }
    }, [waitSave])

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(insertClassificationConversation(row?.conversationid || 0, row.classificationid, row.jobplan, 'DELETE')));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    if (mainAux2.loading || previewTicketList.loading) {
        return (
            <div style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', flex: 1 }} className={clsx("scroll-style-go", {
            [classes.orderDefault]: true,
        })}>
            <div>
                <TicketCard
                    ticket={ticketSelected || {}}
                    handleClickOpen={handleClickOpen}
                />
                {classifications.some(x => x.conversationid === ticketSelected?.conversationid) ?
                    <ClassificationsList ticket={ticketSelected} classifications={classifications.filter(x => x.conversationid === ticketSelected?.conversationid)} handleDelete={handleDelete} /> :
                    <div className={classes.label} style={{ padding: 8, flex: 1 }}>
                        {t(langKeys.without_result)}
                    </div>
                }
            </div>
            <div onClick={() => setShowAll(!showAll)}>
                {showAll ?
                    <div className={classes.displayMenu} >
                        <div>{t(langKeys.hidehistoricalclassifications)}</div>
                        <KeyboardArrowUpIcon />
                    </div> :
                    <div className={classes.displayMenu} >
                        <div>{t(langKeys.seehistoricalclassifications)}</div>
                        <KeyboardArrowDownIcon />
                    </div>
                }
            </div>
            {showAll && previewTicketList.data?.map((ticket, index) => {
                if (classifications.some(x => x.conversationid === ticket?.conversationid)) {
                    return <>
                        <div key={ticket.conversationid}>
                            <TicketCard
                                ticket={ticket || {}}
                                handleClickOpen={handleClickOpen}
                            />
                            <ClassificationsList ticket={ticket} classifications={classifications.filter(x => x.conversationid === ticket?.conversationid)} handleDelete={handleDelete} />
                        </div>
                    </>
                } else {
                    return <div></div>
                }
            })}
            <DialogInteractions
                openModal={openModal}
                setOpenModal={setOpenModal}
                ticket={rowSelected}
            />
        </div>
    )
}

const OrdersList: React.FC<{ orders: any, handleClickOpen: (x: any) => void }> = ({ orders, handleClickOpen }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    return (
        <div className={`scroll-style-go`} style={{ overflowY: 'auto', flex: 1, backgroundColor: 'transparent' }}>
            {orders.map((x: any) => (
                <div
                    key={x.order_id}
                    style={{ paddingLeft: 5 }}
                    onClick={() => handleClickOpen(x)}
                    className={classes.containerAttachment}
                >
                    <SubdirectoryArrowRightIcon style={{ color: "grey" }} />
                    <div style={{ width: "100%" }}>
                        <div className={classes.titlePreviewTicket}>
                            <OrderMiniatureIcon height={20} color={"grey"} />
                            <div>{x.order_number}</div>
                        </div>
                        <div style={{ display: "flex" }}>
                            <div style={{ width: "100%", fontSize: 11 }}>
                                <div>{`${t(langKeys.quantity)}: ${x.quantity} und.`}</div>
                                <div>{`${t(langKeys.currency)}: ${x.currency}`}</div>
                            </div>
                            <div style={{ width: "100%", fontSize: 11 }}>
                                <div>{`${t(langKeys.paymentmethod)}: ${x.payment_method}`}</div>
                                <div>{`${t(langKeys.totalcharge)}: ${x.amount}`}</div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

const Orders: React.FC = () => {
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [orders, setOrders] = useState<any[]>([]);
    const tipifyRes = useSelector(state => state.main.execute);
    const [showAll, setShowAll] = useState(false);
    const previewTicketList = useSelector(state => state.inbox.previewTicketList);
    const orderList = useSelector(state => state.orders.orders);
    const el = React.useRef<null | HTMLDivElement>(null);
    const el1 = React.useRef<null | HTMLDivElement>(null);
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [rowSelectedDetail, setRowSelectedDetail] = useState<Dictionary | null>(null);
    const [openModalDetail, setOpenModalDetail] = useState(false);

    const handleClickOpen = (row: any) => {
        setOpenModal(true);
        setRowSelected(row)
    };

    const handleClickOpenDetail = (row: any) => {
        setRowSelectedDetail(orderList.data.find(x => row.order_id === x.orderid) || {})
        setOpenModalDetail(true);
    };


    const mainAux2 = useSelector(state => state.main.mainAux2);
    const fetchData = () => {
        dispatch(getTicketsPerson(ticketSelected?.personid!, ticketSelected?.conversationid!))
        dispatch(getCollectionAux2(conversationOrderHistorySel(ticketSelected?.personid!!)))
    }

    useEffect(() => {
        dispatch(getOrders())
        dispatch(getTicketsPerson(ticketSelected?.personid!, ticketSelected?.conversationid!))
        dispatch(getCollectionAux2(conversationOrderHistorySel(ticketSelected?.personid!!)))
    }, [])

    useEffect(() => {
        if (!tipifyRes.loading && !tipifyRes.error) {
            fetchData()
        }
    }, [tipifyRes])

    useEffect(() => {
        if (!mainAux2.loading && !mainAux2.error) {
            dispatch(updateClassificationPerson(mainAux2.data.length > 0))
            setOrders(mainAux2.data.reverse())
        }
    }, [mainAux2])

    if (mainAux2.loading || previewTicketList.loading) {
        return (
            <div style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', flex: 1 }} className={clsx("scroll-style-go", {
            [classes.orderDefault]: true,
        })}>
            <div ref={el}></div>
            <div>
                <TicketCard
                    ticket={ticketSelected || {}}
                    handleClickOpen={handleClickOpen}
                />
                {orders.some(x => x.conversationid === ticketSelected?.conversationid) ?
                    <OrdersList orders={orders.filter(x => x.conversationid === ticketSelected?.conversationid)} handleClickOpen={handleClickOpenDetail} /> :
                    <div className={classes.label} style={{ padding: 8, flex: 1 }}>
                        {t(langKeys.without_result)}
                    </div>
                }
            </div>
            <div onClick={() => setShowAll(!showAll)}>
                {showAll ?
                    <div className={classes.displayMenu} >
                        <div>{t(langKeys.hidehistoricalorders)}</div>
                        <KeyboardArrowUpIcon />
                    </div> :
                    <div className={classes.displayMenu} >
                        <div>{t(langKeys.seehistoricalorders)}</div>
                        <KeyboardArrowDownIcon />
                    </div>
                }
            </div>
            {showAll && previewTicketList.data?.map((ticket, index) => {
                if (orders.some(x => x.conversationid === ticket?.conversationid)) {
                    return <>
                        <div key={ticket.conversationid}>
                            <TicketCard
                                ticket={ticket || {}}
                                handleClickOpen={handleClickOpen}
                            />
                            <OrdersList orders={orders.filter(x => x.conversationid === ticket?.conversationid)} handleClickOpen={handleClickOpenDetail} />
                        </div>
                    </>
                } else {
                    return <div></div>
                }
            })}
            <div ref={el1}></div>
            <DialogInteractions
                openModal={openModal}
                setOpenModal={setOpenModal}
                ticket={rowSelected}
            />
            <DetailOrdersModal
                openModal={openModalDetail}
                setOpenModal={setOpenModalDetail}
                row={rowSelectedDetail || {}}
            />
        </div>
    )
}

const PreviewTickets: React.FC<{ order: number }> = ({ order }) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const previewTicketList = useSelector(state => state.inbox.previewTicketList);
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const el = React.useRef<null | HTMLDivElement>(null);
    const el1 = React.useRef<null | HTMLDivElement>(null);
    const { t } = useTranslation();

    useEffect(() => {
        dispatch(getTicketsPerson(ticketSelected?.personid!, ticketSelected?.conversationid!))
    }, [])

    const handleClickOpen = (row: any) => {
        setOpenModal(true);
        setRowSelected(row)
    };

    useEffect(() => {
        if (order === 1)
            el1.current?.scrollIntoView();
        else
            el?.current?.scrollIntoView();
    }, [order])

    if (previewTicketList.loading) {
        return (
            <div style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </div>
        )
    }

    if (previewTicketList.data.length === 0) {
        return (
            <div className={classes.label} style={{ padding: 8, flex: 1 }}>
                {t(langKeys.without_result)}
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', flex: 1 }} className={clsx("scroll-style-go", {
            [classes.orderDefault]: order === -1,
            [classes.orderReverse]: order === 1,
        })}>
            <div ref={el}></div>
            {previewTicketList.data?.map((ticket, index) => (
                <div key={ticket.conversationid}>
                    <div className={classes.containerPreviewTicket} onClick={() => handleClickOpen(ticket)}>
                        <div className={classes.titlePreviewTicket}>
                            <GetIcon color={ticket.coloricon} channelType={ticket.communicationchanneltype} />
                            <div>{ticket.ticketnum}</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ flex: 1 }}>
                                <div className={classes.label}>{t(langKeys.creationDate)}</div>
                                <div>{convertLocalDate(ticket.firstconversationdate).toLocaleString()}</div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div className={classes.label}>{t(langKeys.close_date)}</div>
                                <div>{convertLocalDate(ticket.finishdate).toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <div ref={el1}></div>
            <DialogInteractions
                openModal={openModal}
                setOpenModal={setOpenModal}
                ticket={rowSelected}
            />
        </div>
    )
}

const AttachmentList: React.FC<{ listFiles: Dictionary[] }> = ({ listFiles }) => {
    const classes = useStyles();
    return (
        <div className={`scroll-style-go`} style={{ overflowY: 'auto', backgroundColor: 'transparent' }}>
            {listFiles.map(({ filename, date, url, extension, user }) => (
                <a
                    key={`${date}-${filename}`}
                    className={classes.containerAttachment}
                    href={url}
                    download
                    style={{ textDecoration: 'none', color: 'inherit', paddingLeft: 5 }}
                    rel="noreferrer" target="_blank"
                >
                    <SubdirectoryArrowRightIcon style={{ color: "grey" }} />
                    {extension === "pdf" && <PdfIcon width="30" height="30" />}
                    {(extension === "doc" || extension === "docx") && <DocIcon width="30" height="30" />}
                    {(extension === "xls" || extension === "xlsx" || extension === "csv") && <XlsIcon width="30" height="30" />}
                    {(extension === "ppt" || extension === "pptx") && <PptIcon width="30" height="30" />}
                    {(extension === "zip" || extension === "rar") && <ZipIcon width="30" height="30" />}
                    {(extension === "text" || extension === "txt") && <TxtIcon width="30" height="30" />}
                    {!["pdf", "doc", "docx", "xls", "xlsx", "csv", "ppt", "pptx", "zip", "rar", "text", "txt",].includes(extension) && <FileIcon width="30" height="30" />}
                    <div style={{ width: "100%" }}>
                        <div className={classes.label} style={{ textAlign: "right" }}>{user}</div>
                        <div>{filename}</div>
                        <div className={classes.label}>{date}</div>
                    </div>
                </a>
            ))}
        </div>
    )
}


const TicketCard: React.FC<{ ticket: Dictionary, handleClickOpen: (x: any) => void }> = ({ ticket, handleClickOpen }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    return <div className={classes.containerPreviewTicket} onClick={() => handleClickOpen(ticket)}>
        <div className={classes.titlePreviewTicket}>
            <GetIcon color={ticket?.coloricon} channelType={ticket?.communicationchanneltype || ""} />
            <div>{ticket?.ticketnum}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
                <div className={classes.label}>{t(langKeys.creationDate)}</div>
                <div>{convertLocalDate(ticket?.firstconversationdate).toLocaleString()}</div>
            </div>
            <div style={{ flex: 1 }}>
                <div className={classes.label}>{t(langKeys.close_date)}</div>
                <div>{ticket?.finishdate ? convertLocalDate(ticket?.finishdate).toLocaleString() : "-"}</div>
            </div>
        </div>
    </div>
}

const Attachments: React.FC = () => {
    const classes = useStyles();
    const [listFiles, setListFiles] = useState<Dictionary[]>([]);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const mainAux2 = useSelector(state => state.main.mainAux2);
    const [showAll, setShowAll] = useState(false);
    const previewTicketList = useSelector(state => state.inbox.previewTicketList);
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);
    const [openModal, setOpenModal] = useState(false);

    const handleClickOpen = (row: any) => {
        setOpenModal(true);
        setRowSelected(row)
    };

    useEffect(() => {
        dispatch(getTicketsPerson(ticketSelected?.personid!, ticketSelected?.conversationid!))
        dispatch(getCollectionAux2(conversationAttachmentHistorySel(ticketSelected?.personid!!)))
    }, [])

    useEffect(() => {
        if (!mainAux2.loading && !mainAux2.error) {
            setListFiles(mainAux2?.data.map(x => ({
                ...x,
                url: x?.lastmessage,
                filename: x?.lastmessage?.split("/")?.pop(),
                extension: ((x?.lastmessage?.split("/")?.pop() || '') || "").split(".").pop(),
                date: convertLocalDate(x.createdate).toLocaleString(),
                user: x.user || ticketSelected?.displayname,
                finishdate: x.finishdate || null
            })))
        }
    }, [mainAux2])

    if (mainAux2.loading || previewTicketList.loading) {
        return (
            <div style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', flex: 1 }} className={clsx("scroll-style-go", {
            [classes.orderDefault]: true,
        })}>
            <div>
                <TicketCard
                    ticket={ticketSelected || {}}
                    handleClickOpen={handleClickOpen}
                />
                {listFiles.some(x => x.conversationid === ticketSelected?.conversationid) ?
                    <AttachmentList key={`attchmentlist-${ticketSelected?.conversationid}`} listFiles={listFiles.filter(x => x.conversationid === ticketSelected?.conversationid)} /> :
                    <div className={classes.label} style={{ padding: 8, flex: 1 }}>
                        {t(langKeys.without_files)}
                    </div>
                }
            </div>
            <div onClick={() => setShowAll(!showAll)}>
                {showAll ?
                    <div className={classes.displayMenu} >
                        <div>{t(langKeys.hidehistoricalattachments)}</div>
                        <KeyboardArrowUpIcon />
                    </div> :
                    <div className={classes.displayMenu} >
                        <div>{t(langKeys.seehistoricalattachments)}</div>
                        <KeyboardArrowDownIcon />
                    </div>
                }
            </div>
            {showAll && previewTicketList.data?.map((ticket, index) => {
                if (listFiles.some(x => x.conversationid === ticket?.conversationid)) {
                    return <>
                        <div key={`attachmentcards-${ticket.conversationid}`}>
                            <TicketCard
                                ticket={ticket || {}}
                                handleClickOpen={handleClickOpen}
                            />
                            <AttachmentList listFiles={listFiles.filter(x => x.conversationid === ticket?.conversationid)} />
                        </div>
                    </>
                } else {
                    return <div></div>
                }
            })}
            <DialogInteractions
                openModal={openModal}
                setOpenModal={setOpenModal}
                ticket={rowSelected}
            />
        </div>
    )
}

const LeadsList: React.FC<{ leads: any, handleClickOpen: (x: any) => void }> = ({ leads, handleClickOpen }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    return (
        <div className={`scroll-style-go`} style={{ overflowY: 'auto', flex: 1, backgroundColor: 'transparent' }}>
            {leads.map((x: any) => (
                <div
                    key={`leads-${x.oportunityid}`}
                    style={{ paddingLeft: 5, paddingTop: 0 }}
                    onClick={() => handleClickOpen(x)}
                    className={classes.containerAttachment}
                >
                    <SubdirectoryArrowRightIcon style={{ color: "grey" }} />
                    <div style={{ width: "100%" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1rem", alignItems: "center" }}>
                            <div>{x.columndesc}</div>
                            <div>
                                <Rating
                                    size="small"
                                    name="lead-rating"
                                    max={3}
                                    defaultValue={x.priority === 'LOW' ? 1 : x.priority === 'MEDIUM' ? 2 : x.priority === 'HIGH' ? 3 : 1}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div style={{ display: "flex", fontSize: "1.2rem" }}>
                            {x.description}
                        </div>
                        <div style={{ display: "flex", fontSize: "0.8rem", color: "grey" }}>
                            {t(langKeys.expectedRevenue) + ": " + (Number(x?.expected_revenue || 0)).toFixed(2)}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

const Leads: React.FC = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const mainAux2 = useSelector(state => state.main.mainAux2);
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [rowSelectedDetail, setRowSelectedDetail] = useState<Dictionary | null>(null);
    const [openModalDetail, setOpenModalDetail] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const previewTicketList = useSelector(state => state.inbox.previewTicketList);
    const [leads, setLeads] = useState<any[]>([]);

    const handleClickOpen = (row: any) => {
        setOpenModal(true);
        setRowSelected(row)
    };

    const handleClickOpenDetail = (row: any) => {
        setRowSelectedDetail(row)
        setOpenModalDetail(true);
    };


    useEffect(() => {
        dispatch(getTicketsPerson(ticketSelected?.personid!, ticketSelected?.conversationid!))
        dispatch(getCollectionAux2(conversationOportunityHistorySel(ticketSelected?.personid!!)))
    }, [])


    useEffect(() => {
        if (!mainAux2.loading && !mainAux2.error) {
            setLeads(mainAux2?.data)
        }
    }, [mainAux2])

    if (mainAux2.loading) {
        return (
            <div style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', flex: 1 }} className={clsx("scroll-style-go", {
            [classes.orderDefault]: true,
        })}>
            <div>
                <TicketCard
                    ticket={ticketSelected || {}}
                    handleClickOpen={handleClickOpen}
                />
                {leads.some(x => x.conversationid === ticketSelected?.conversationid) ?
                    <LeadsList leads={leads.filter(x => x.conversationid === ticketSelected?.conversationid)} handleClickOpen={handleClickOpenDetail} /> :
                    <div className={classes.label} style={{ padding: 8, flex: 1 }}>
                        {t(langKeys.without_result)}
                    </div>
                }
            </div>
            <div onClick={() => setShowAll(!showAll)}>
                {showAll ?
                    <div className={classes.displayMenu} >
                        <div>{t(langKeys.hidehistoricaloportunities)}</div>
                        <KeyboardArrowUpIcon />
                    </div> :
                    <div className={classes.displayMenu} >
                        <div>{t(langKeys.seehistoricaloportunities)}</div>
                        <KeyboardArrowDownIcon />
                    </div>
                }
            </div>
            {showAll && previewTicketList.data?.map((ticket, index) => {
                if (leads.some(x => x.conversationid === ticket?.conversationid)) {
                    return <>
                        <div key={ticket.conversationid}>
                            <TicketCard
                                ticket={ticket || {}}
                                handleClickOpen={handleClickOpen}
                            />
                            <LeadsList leads={leads.filter(x => x.conversationid === ticket?.conversationid)} handleClickOpen={handleClickOpenDetail} />
                        </div>
                    </>
                } else {
                    return <div></div>
                }
            })}
            <DialogInteractions
                openModal={openModal}
                setOpenModal={setOpenModal}
                ticket={rowSelected}
            />
            {openModalDetail && <LeadFormModal
                openModal={openModalDetail}
                setOpenModal={setOpenModalDetail}
                leadId={rowSelectedDetail?.oportunityid || 0}
                phase={rowSelectedDetail?.columndesc || ""}
            />}
        </div>
    )
}

const SDList: React.FC<{ service: any, handleClickOpen: (x: any) => void }> = ({ service, handleClickOpen }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    return (
        <div className={`scroll-style-go`} style={{ overflowY: 'auto', flex: 1, backgroundColor: 'transparent' }}>
            {service.map((x: any) => (
                <div
                    key={`service-${x.id}`}
                    style={{ paddingLeft: 5 }}
                    onClick={() => handleClickOpen(x)}
                    className={classes.containerAttachment}
                >
                    <SubdirectoryArrowRightIcon style={{ color: "grey" }} />
                    <div style={{ width: "100%" }}>
                        <div className={classes.titlePreviewTicket}>
                            <ServiceDeskIcon height={20} style={{ fill: "grey" }} />
                            <div>{x.sd_request}</div>
                        </div>
                        <div style={{ display: "flex" }}>
                            <div style={{ width: "100%", fontSize: 11 }}>
                                <div>{`${t(langKeys.phase)}: ${x.descolumn}`}</div>
                                <div>{`${t(langKeys.priority)}: ${x.priority}`}</div>
                            </div>
                            <div style={{ width: "100%", fontSize: 11 }}>
                                <div>{`${t(langKeys.group)}: ${x.grupo}`}</div>
                                <div>{`${t(langKeys.user)}: ${x.usuario}`}</div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
const ServiceDesk: React.FC = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const mainAux2 = useSelector(state => state.main.mainAux2);
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [rowSelectedDetail, setRowSelectedDetail] = useState<Dictionary | null>(null);
    const [openModalDetail, setOpenModalDetail] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const previewTicketList = useSelector(state => state.inbox.previewTicketList);
    const [service, setService] = useState<any[]>([]);

    const handleClickOpen = (row: any) => {
        setOpenModal(true);
        setRowSelected(row)
    };

    const handleClickOpenDetail = (row: any) => {
        setRowSelectedDetail(row)
        setOpenModalDetail(true);
    };


    useEffect(() => {
        dispatch(getTicketsPerson(ticketSelected?.personid!, ticketSelected?.conversationid!))
        dispatch(getCollectionAux2(conversationSDHistorySel(ticketSelected?.personid!!)))
    }, [])


    useEffect(() => {
        if (!mainAux2.loading && !mainAux2.error) {
            setService(mainAux2?.data)
        }
    }, [mainAux2])

    if (mainAux2.loading) {
        return (
            <div style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', flex: 1 }} className={clsx("scroll-style-go", {
            [classes.orderDefault]: true,
        })}>
            <div>
                <TicketCard
                    ticket={ticketSelected || {}}
                    handleClickOpen={handleClickOpen}
                />
                {service.some(x => x.conversationid === ticketSelected?.conversationid) ?
                    <SDList service={service.filter(x => x.conversationid === ticketSelected?.conversationid)} handleClickOpen={handleClickOpenDetail} /> :
                    <div className={classes.label} style={{ padding: 8, flex: 1 }}>
                        {t(langKeys.without_result)}
                    </div>
                }
            </div>
            <div onClick={() => setShowAll(!showAll)}>
                {showAll ?
                    <div className={classes.displayMenu} >
                        <div>{t(langKeys.hidehistoricalsd)}</div>
                        <KeyboardArrowUpIcon />
                    </div> :
                    <div className={classes.displayMenu} >
                        <div>{t(langKeys.seehistoricalsd)}</div>
                        <KeyboardArrowDownIcon />
                    </div>
                }
            </div>
            {showAll && previewTicketList.data?.map((ticket, index) => {
                if (service.some(x => x.conversationid === ticket?.conversationid)) {
                    return <>
                        <div key={ticket.conversationid}>
                            <TicketCard
                                ticket={ticket || {}}
                                handleClickOpen={handleClickOpen}
                            />
                            <SDList service={service.filter(x => x.conversationid === ticket?.conversationid)} handleClickOpen={handleClickOpenDetail} />
                        </div>
                    </>
                } else {
                    return <div></div>
                }
            })}
            <DialogInteractions
                openModal={openModal}
                setOpenModal={setOpenModal}
                ticket={rowSelected}
            />
            {openModalDetail && <ServiceDeskLeadFormModal
                openModal={openModalDetail}
                setOpenModal={setOpenModalDetail}
                leadId={rowSelectedDetail?.oportunityid || 0}
            />}
        </div>
    )
}

const InfoPanel: React.FC = () => {
    const classes = useStyles();
    const [pageSelected, setPageSelected] = useState(0);
    const [order, setOrder] = useState(-1)
    const { t } = useTranslation();
    const loading = useSelector(state => state.inbox.person.loading);

    if (loading) {
        return (
            <div className={classes.containerInfo}>
                <div style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress />
                </div>
            </div>
        )
    }
    return (
        <div className={classes.containerInfo}>

            <InfoClient />
            <Tabs
                value={pageSelected}
                indicatorColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                style={{ borderBottom: '1px solid #EBEAED', backgroundColor: '#FFF', marginTop: 8 }}
                textColor="primary"
                onChange={(_, value) => setPageSelected(value)}
            >
                <AntTab label={t(langKeys.information)} />
                <AntTab label="Variables" />
                <AntTab label={t(langKeys.history)} icon={<ImportExportIcon onClick={() => setOrder(order * -1)} />} />
                <AntTab label={t(langKeys.messagetemplate_attachment)} />
                <AntTab label={t(langKeys.classification_plural)} />
                <AntTab label={t(langKeys.orders)} />
                <AntTab label={t(langKeys.lead_plural)} />
                <AntTab label={t(langKeys.s_request)} />
            </Tabs>
            <div style={{ minHeight: 100 }}>
                {pageSelected === 0 && <InfoTab />}
                {pageSelected === 1 && <Variables />}
                {pageSelected === 2 && <PreviewTickets order={order} />}
                {pageSelected === 3 && <Attachments />}
                {pageSelected === 4 && <Classifications />}
                {pageSelected === 5 && <Orders />}
                {pageSelected === 6 && <Leads />}
                {pageSelected === 7 && <ServiceDesk />}
            </div>
        </div>
    );
}

export default InfoPanel;