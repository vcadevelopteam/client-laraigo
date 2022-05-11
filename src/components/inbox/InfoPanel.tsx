/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Tabs from '@material-ui/core/Tabs';
import Avatar from '@material-ui/core/Avatar';
import { EMailInboxIcon, PhoneIcon, DocIcon, FileIcon1 as FileIcon, PdfIcon, PptIcon, TxtIcon, XlsIcon, ZipIcon } from 'icons';
import { getTicketsPerson, showInfoPanel, updatePerson } from 'store/inbox/actions';
import { GetIcon, FieldEdit, FieldSelect, DialogInteractions, AntTab, FieldEditMulti } from 'components'
import { langKeys } from 'lang/keys';
import { useTranslation } from 'react-i18next';
import { convertLocalDate, getConversationClassification2, getValuesFromDomain, insertClassificationConversation, insPersonBody } from 'common/helpers';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { Dictionary } from '@types';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import { useForm } from 'react-hook-form';
import { getMultiCollectionAux, resetMultiMainAux, execute, getCollectionAux2 } from 'store/main/actions';
import Fab from '@material-ui/core/Fab';
import { CircularProgress } from '@material-ui/core';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import clsx from 'clsx';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
    containerInfo: {
        flex: '0 0 300px',
        width: 300,
        display: 'flex',
        flexDirection: 'column',

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
        // fontWeight: 400,
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
    }
}));

const InfoClient: React.FC = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const showInfoPanelTrigger = () => dispatch(showInfoPanel())

    const person = useSelector(state => state.inbox.person.data);
    return (
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
                </div>
                <div className={classes.containerName}>
                    <EMailInboxIcon className={classes.propIcon} />
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.email)}</div>
                        <div>{person?.email}</div>
                    </div>
                </div>
                <div className={classes.containerName}>
                    <PhoneIcon className={classes.propIcon} />
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.phone)}</div>
                        <div>{person?.phone}</div>
                    </div>
                </div>

            </div>
        </div>
    )
}

const InfoTab: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const person = useSelector(state => state.inbox.person.data);
    const [view, setView] = useState('view');

    const multiData = useSelector(state => state.main.multiDataAux);
    const { setValue, getValues, trigger, register, formState: { errors } } = useForm<any>({
        defaultValues: { ...person, birthday: person?.birthday || '' }
    });

    useEffect(() => {
        register('firstname', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('lastname');
        register('email');
        register('observation');
        register('phone');
        register('documenttype');
        register('documentnumber');
        register('alternativeemail');
        register('alternativephone');
        register('birthday');
        register('gender');
        register('occupation');
        register('civilstatus');
        register('educationlevel');

        dispatch(getMultiCollectionAux([
            getValuesFromDomain("TIPODOCUMENTO"),
            getValuesFromDomain("GENERO"),
            getValuesFromDomain("OCUPACION"),
            getValuesFromDomain("ESTADOCIVIL"),
            getValuesFromDomain("NIVELEDUCATIVO"),
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
                        />
                        <FieldEdit
                            label={t(langKeys.lastname)}
                            onChange={(value) => setValue('lastname', value)}
                            valueDefault={getValues('lastname')}
                            error={errors?.lastname?.message}
                        />
                        <FieldSelect
                            onChange={(value) => setValue('documenttype', value?.domainvalue)}
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
                        />
                        <FieldEdit
                            label={t(langKeys.email)}
                            onChange={(value) => setValue('email', value)}
                            valueDefault={getValues('email')}
                            error={errors?.email?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.phone)}
                            onChange={(value) => setValue('phone', value)}
                            valueDefault={getValues('phone')}
                            error={errors?.phone?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.alternativeEmail)}
                            onChange={(value) => setValue('alternativeemail', value)}
                            valueDefault={getValues('alternativeemail')}
                            error={errors?.alternativeemail?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.alternativePhone)}
                            onChange={(value) => setValue('alternativephone', value)}
                            valueDefault={getValues('alternativephone')}
                            error={errors?.alternativephone?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.birthday)}
                            onChange={(value) => setValue('birthday', value)}
                            valueDefault={getValues('birthday')}
                            type="date"
                            error={errors?.birthday?.message}
                        />
                        <FieldSelect
                            onChange={(value) => setValue('gender', value?.domainvalue)}
                            label={t(langKeys.gender)}
                            loading={multiData.loading}
                            data={multiData.data[1]?.data || []}
                            optionValue="domainvalue"
                            optionDesc="domainvalue"
                            valueDefault={getValues('gender')}
                            uset={true}
                            prefixTranslation="type_gender_"
                            error={errors?.gender?.message}
                        />
                        <FieldSelect
                            onChange={(value) => setValue('occupation', value?.domainvalue)}
                            label={t(langKeys.occupation)}
                            loading={multiData.loading}
                            data={multiData.data[2]?.data || []}
                            optionValue="domainvalue"
                            optionDesc="domainvalue"
                            valueDefault={getValues('occupation')}
                            uset={true}
                            prefixTranslation="type_ocupation_"
                            error={errors?.occupation?.message}
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
                        style={{ position: 'absolute', bottom: 8, right: 8 }}
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
                {person?.firstname && <div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.firstname)}</div>
                        <div>{person?.firstname}</div>
                    </div>
                </div>}
                {person?.lastname && <div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.lastname)}</div>
                        <div>{person?.lastname}</div>
                    </div>
                </div>}
                {person?.email && <div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.email)}</div>
                        <div>{person?.email}</div>
                    </div>
                </div>}
                {person?.phone && <div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.phone)}</div>
                        <div>{person?.phone}</div>
                    </div>
                </div>}
                {person?.firstcontact && <div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.firstContactDate)}</div>
                        <div>{new Date(person?.firstcontact).toLocaleString()}</div>
                    </div>
                </div>}
                {person?.lastcontact && <div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.lastContactDate)}</div>
                        <div>{new Date(person?.lastcontact).toLocaleString()}</div>
                    </div>
                </div>}
                {person?.documenttype && <div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.documenttype)}</div>
                        <div>{person?.documenttype && t("type_documenttype_" + person?.documenttype.toLocaleLowerCase())}</div>
                    </div>
                </div>}
                {person?.documentnumber && <div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.documentnumber)}</div>
                        <div>{person?.documentnumber}</div>
                    </div>
                </div>}

                {person?.alternativephone && <div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.alternativePhone)}</div>
                        <div>{person?.alternativephone}</div>
                    </div>
                </div>}
                {person?.alternativeemail && <div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.alternativeEmail)}</div>
                        <div>{person?.alternativeemail}</div>
                    </div>
                </div>}
                {person?.address && <div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.address)}</div>
                        <div>{person?.address}</div>
                    </div>
                </div>}
                {person?.addressreference && <div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.addressReference)}</div>
                        <div>{person?.addressreference}</div>
                    </div>
                </div>}
                {person?.birthday && <div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.birthday)}</div>
                        <div>{person?.birthday}</div>
                    </div>
                </div>}
                {person?.genderdesc && <div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.gender)}</div>
                        <div>{person?.gender && t("type_gender_" + person?.gender.toLocaleLowerCase())}</div>
                    </div>
                </div>}
                {person?.occupationdesc && <div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.occupation)}</div>
                        <div>{person?.occupation && t("type_ocupation_" + person?.occupation.toLocaleLowerCase())}</div>
                    </div>
                </div>}
                {person?.civilstatusdesc && <div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.civilStatus)}</div>
                        <div>{person?.civilstatus && t("type_civilstatus_" + person?.civilstatus.toLocaleLowerCase())}</div>
                    </div>
                </div>}
                {person?.educationleveldesc && <div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.educationLevel)}</div>
                        <div>{person?.educationlevel && t("type_educationlevel_" + person?.educationlevel.toLocaleLowerCase())}</div>
                    </div>
                </div>}

                {person?.lastcommunicationchannel && <div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.lastCommunicationChannel)}</div>
                        <div>{person?.lastcommunicationchannel}</div>
                    </div>
                </div>}
                {person?.totaltickets && <div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.totalconversations)}</div>
                        <div>{person?.totaltickets}</div>
                    </div>
                </div>}
                {person?.observation && <div className={classes.containerName}>
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.observation)}</div>
                        <div>{person?.observation}</div>
                    </div>
                </div>}
            </div>
            <Fab
                onClick={() => setView('edit')}
                size="small"
                style={{ position: 'absolute', bottom: 8, right: 8 }}
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
                if (!variabletmp?.Value) {
                    return null;
                }
                return (
                    <div key={index} className={classes.containerName}>
                        <div style={{ fontWeight: fontbold ? 'bold' : 'normal' }}>
                            <div className={classes.label}>{description}</div>
                            <div style={{ color: fontcolor }}>{variabletmp?.Value || '-'}</div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

const Classifications: React.FC = () => {
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const person = useSelector(state => state.inbox.person.data);
    const [view, setView] = useState('view');
    const [classifications, setClassifications] = useState<any[]>([]);
    const [waitSave, setWaitSave] = useState(false);

    const mainAux2 = useSelector(state => state.main.mainAux2);
    const { setValue, getValues, trigger, register, formState: { errors } } = useForm<any>({
        defaultValues: { ...person, birthday: person?.birthday || '' }
    });
    const fetchData = () => dispatch(getCollectionAux2(getConversationClassification2(ticketSelected?.conversationid!!)))

    useEffect(() => {
        dispatch(getCollectionAux2(getConversationClassification2(ticketSelected?.conversationid!!)))
    }, [])

    useEffect(() => {
        setClassifications(mainAux2?.data?.reverse()||[])
    }, [mainAux2])

    useEffect(() => {
        if (waitSave) {
            dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_delete) }))
            fetchData();
            dispatch(showBackdrop(false));
            setWaitSave(false);
        }
    }, [waitSave])

    const handleDelete = (row: Dictionary) => {
        console.log(row)
        console.log(ticketSelected)

        const callback = () => {
            dispatch(execute(insertClassificationConversation(ticketSelected?.conversationid||0,row.classificationid, row.jobplan, 'DELETE')));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }
    
    return (
        <>
            <div style={{ overflowY: 'auto' }} className="scroll-style-go">
                <div className={classes.containerInfoClient} style={{ paddingTop: 0, backgroundColor: 'transparent' }}>
                    {classifications.map((x,i)=>{
                        return (
                            <div className={classes.containerPreviewTicket} style={{flexDirection:"initial", alignItems:"center"}} key={x.classificationid}>
                                <div style={{ flex: 1 }}>
                                    <div className={classes.label}>{t(langKeys.classification) + " " + (i+1)}</div>
                                    <div>{x.path}</div>
                                </div>
                                <DeleteIcon style={{color:"#B6B4BA"}} onClick={()=>{handleDelete(x)}}/>
                            </div>
                        )
                    })}
                </div>
            </div>

        </>
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
        // setTimeout(() => {
        if (order === 1)
            el1.current?.scrollIntoView();
        else
            el?.current?.scrollIntoView();
        // }, 1000);
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
        <div style={{ display: 'flex', flex: 1, justifyContent: 'start' }} className={clsx("scroll-style-go", {
            [classes.orderDefault]: order === -1,
            [classes.orderReverse]: order === 1,
        })}>
            <div ref={el}></div>
            {previewTicketList.data?.map((ticket, index) => (
                <div key={index}>
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

const Attachments: React.FC = () => {
    const classes = useStyles();
    const [listFiles, setListFiles] = useState<Dictionary[]>([]);
    const interactionList = useSelector(state => state.inbox.interactionList);
    const { t } = useTranslation();


    useEffect(() => {
        setListFiles(interactionList.data.reduce<Dictionary[]>((acc, item) => [
            ...acc,
            ...(item.interactions?.filter((x) => ["file", "video"].includes(x.interactiontype)) || []).map(x => ({
                url: x.interactiontext,
                // filename: x.interactiontext.split("/").pop(),
                filename: x.interactiontext.split("/").pop(),
                extension: ((x.interactiontext.split("/").pop() || '') || "").split(".").pop(),
                date: convertLocalDate(x.createdate).toLocaleString(),
            }))
        ], []));
    }, [interactionList])

    if (listFiles.length === 0) {
        return (
            <div className={classes.label} style={{ padding: 8, flex: 1 }}>
                {t(langKeys.without_files)}
            </div>
        )
    }

    return (
        <div className={`scroll-style-go`} style={{ overflowY: 'auto', flex: 1, backgroundColor: 'transparent' }}>
            {listFiles.map(({ filename, date, url, extension }, index) => (
                <a
                    key={index}
                    className={classes.containerAttachment}
                    href={url}
                    download
                    style={{ textDecoration: 'none', color: 'inherit' }}
                    rel="noreferrer" target="_blank"
                // onClick={() => window.open(url, "_blank")}
                >
                    {extension === "pdf" ? (
                        <PdfIcon width="30" height="30" />
                    ) : (extension === "doc" || extension === "docx") ? (
                        <DocIcon width="30" height="30" />
                    ) : (extension === "xls" || extension === "xlsx" || extension === "csv") ? (
                        <XlsIcon width="30" height="30" />
                    ) : (extension === "ppt" || extension === "pptx") ? (
                        <PptIcon width="30" height="30" />
                    ) : (extension === "zip" || extension === "rar") ? (
                        <ZipIcon width="30" height="30" />
                    ) : (extension === "text" || extension === "txt") ? (
                        <TxtIcon width="30" height="30" />
                    ) : <FileIcon width="30" height="30" />
                    }
                    <div>
                        <div>{filename}</div>
                        <div className={classes.label}>{date}</div>
                    </div>
                </a>
            ))}
        </div>
    )
}


const InfoPanel: React.FC = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const [pageSelected, setPageSelected] = useState(0);
    const [order, setOrder] = useState(-1)
    const { t } = useTranslation();
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
                <AntTab label="Tickets" icon={<ImportExportIcon onClick={() => setOrder(order * -1)} />} />
                <AntTab icon={<AttachFileIcon />} />
                <AntTab label="Variables" />
                <AntTab label={t(langKeys.classification_plural)} />
            </Tabs>
            {pageSelected === 0 && <InfoTab />}
            {pageSelected === 1 && <PreviewTickets order={order} />}
            {pageSelected === 2 && <Attachments />}
            {pageSelected === 3 && <Variables />}
            {pageSelected === 4 && <Classifications />}
        </div>
    );
}

export default InfoPanel;