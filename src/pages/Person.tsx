/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { FieldEditMulti, FieldSelect, Title } from 'components';
import { getChannelListByPersonBody, getTicketListByPersonBody, getPaginatedPerson, getOpportunitiesByPersonBody, editPersonBody, getReferrerByPersonBody, insPersonUpdateLocked, getPersonExport, exportExcel, templateMaker, uploadExcel, insPersonBody, insPersonCommunicationChannel, array_trimmer, convertLocalDate } from 'common/helpers';
import { Dictionary, IDomain, IObjectState, IPerson, IPersonChannel, IPersonCommunicationChannel, IPersonConversation, IPersonDomains, IPersonImport, IPersonReferrer, IFetchData } from "@types";
import { Avatar, Box, Divider, Grid, Button, makeStyles, AppBar, Tabs, Tab, Collapse, IconButton, BoxProps, Breadcrumbs, Link, CircularProgress, TextField, MenuItem } from '@material-ui/core';
import clsx from 'clsx';
import { BuildingIcon, DocNumberIcon, DocTypeIcon, EMailInboxIcon, GenderIcon, TelephoneIcon, HSMIcon } from 'icons';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useHistory, useLocation } from 'react-router';
import paths from 'common/constants/paths';
import { ArrowDropDown } from '@material-ui/icons';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import ListAltIcon from '@material-ui/icons/ListAlt';
import { getChannelListByPerson, getPersonListPaginated, resetGetPersonListPaginated, resetGetChannelListByPerson, getTicketListByPerson, resetGetTicketListByPerson, getLeadsByPerson, resetGetLeadsByPerson, getDomainsByTypename, resetGetDomainsByTypename, resetEditPerson, editPerson, getReferrerListByPerson, resetGetReferrerListByPerson } from 'store/person/actions';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import { useForm, UseFormGetValues, UseFormSetValue, useFieldArray } from 'react-hook-form';
import { execute, resetAllMain, exportData } from 'store/main/actions';
import { DialogInteractions, FieldMultiSelect, FieldEditArray, DialogZyx } from 'components';
import Rating from '@material-ui/lab/Rating';
import TablePaginated from 'components/fields/table-paginated';
import StarIcon from '@material-ui/icons/Star';
import TableZyx from '../components/fields/table-simple';
import Tooltip from '@material-ui/core/Tooltip';
import MailIcon from '@material-ui/icons/Mail';
import SmsIcon from '@material-ui/icons/Sms';
import { sendHSM } from 'store/inbox/actions';

const urgencyLevels = [null, 'LOW', 'MEDIUM', 'HIGH']

interface SelectFieldProps {
    defaultValue?: string;
    onChange: (value: string, desc: string) => void;
    data: IDomain[];
    loading: boolean;
}

const DomainSelectField: FC<SelectFieldProps> = ({ defaultValue, onChange, data, loading }) => {
    return (
        <TextField
            select
            defaultValue={defaultValue}
            fullWidth
            variant="standard"
            disabled={loading}
        >
            {data.map((option) => (
                <MenuItem
                    key={option.domainid}
                    value={option.domainvalue}
                    onClick={() => onChange(option.domainvalue, option.domaindesc)}
                >
                    {option.domaindesc}
                </MenuItem>
            ))}
        </TextField>
    );
}

const usePhotoClasses = makeStyles(theme => ({
    accountPhoto: {
        height: 40,
        width: 40,
    },
}));

interface PhotoProps {
    src?: string;
    radius?: number;
}

const Photo: FC<PhotoProps> = ({ src, radius }) => {
    const classes = usePhotoClasses();
    const width = radius && radius * 2;
    const height = radius && radius * 2;

    if (!src || src === "") {
        return <AccountCircle className={classes.accountPhoto} style={{ width, height }} />;
    }
    return <Avatar alt={src} src={src} className={classes.accountPhoto} style={{ width, height }} />;
}

const format = (datex: Date) => new Date(datex.setHours(10)).toISOString().substring(0, 10)

const selectionKey = 'personid';

const variables = ['firstname', 'lastname', 'displayname', 'email', 'phone', 'documenttype', 'documentnumber', 'dateactivity', 'leadactivity', 'datenote', 'note', 'custom']

const DialogSendTemplate: React.FC<{ setOpenModal: (param: any) => void, openModal: boolean, persons: IPerson[], type: string }> = ({ setOpenModal, openModal, persons, type }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [waitClose, setWaitClose] = useState(false);
    const sendingRes = useSelector(state => state.inbox.triggerSendHSM);
    const [templatesList, setTemplatesList] = useState<Dictionary[]>([]);
    const [channelList, setChannelList] = useState<Dictionary[]>([]);
    const [bodyMessage, setBodyMessage] = useState('');
    const [personWithData, setPersonWithData] = useState<IPerson[]>([])
    const domains = useSelector(state => state.person.editableDomains);

    const { control, register, handleSubmit, setValue, getValues, trigger, reset, formState: { errors } } = useForm<any>({
        defaultValues: {
            hsmtemplateid: 0,
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
        if (waitClose) {
            if (!sendingRes.loading && !sendingRes.error) {
                console.log(type)
                const message = type === "HSM" ? t(langKeys.successful_send_hsm) : (type === "SMS" ? t(langKeys.successful_send_sms) : t(langKeys.successful_send_mail));
                console.log(message)
                dispatch(showSnackbar({ show: true, success: true, message }))
                setOpenModal(false);
                dispatch(showBackdrop(false));
                setWaitClose(false);
            } else if (sendingRes.error) {

                dispatch(showSnackbar({ show: true, success: false, message: t(sendingRes.code || "error_unexpected_error") }))
                dispatch(showBackdrop(false));
                setWaitClose(false);
            }
        }
    }, [sendingRes, waitClose])

    useEffect(() => {
        if (!domains.error && !domains.loading) {
            setTemplatesList(domains?.value?.templates?.filter(x => x.type === type) || []);
            setChannelList(domains?.value?.channels?.filter(x => x.type.includes(type === "HSM" ? "WHA" : type)) || []);
        }
    }, [domains, type])

    useEffect(() => {
        if (openModal) {
            setBodyMessage('')
            reset({
                hsmtemplateid: 0,
                variables: [],
                communicationchannelid: 0,
                communicationchanneltype: ''
            })
            register('hsmtemplateid', { validate: (value) => ((value && value > 0) || t(langKeys.field_required)) });

            if (type === "HSM") {
                register('communicationchannelid', { validate: (value) => ((value && value > 0) || t(langKeys.field_required)) });
            } else {
                register('communicationchannelid');
            }

            if (type === "MAIL") {
                setPersonWithData(persons.filter(x => x.email && x.email.length > 0))
            } else {
                setPersonWithData(persons.filter(x => x.phone && x.phone.length > 0))
            }
        }
    }, [openModal])

    const onSelectTemplate = (value: Dictionary) => {
        if (value) {
            setBodyMessage(value.body);
            setValue('hsmtemplateid', value ? value.id : 0);
            const variablesList = value.body.match(/({{)(.*?)(}})/g) || [];
            const varaiblesCleaned = variablesList.map((x: string) => x.substring(x.indexOf("{{") + 2, x.indexOf("}}")))
            setValue('variables', varaiblesCleaned.map((x: string) => ({ name: x, text: '', type: 'text' })));
        } else {
            setValue('variables', []);
            setBodyMessage('');
            setValue('hsmtemplateid', 0);
        }
    }

    const onSubmit = handleSubmit((data) => {
        const messagedata = {
            hsmtemplateid: data.hsmtemplateid,
            communicationchannelid: data.communicationchannelid,
            communicationchanneltype: data.communicationchanneltype,
            platformtype: data.communicationchanneltype,
            type,
            listmembers: personWithData.map(person => ({
                phone: person.phone || "",
                firstname: person.firstname || "",
                email: person.email || "",
                lastname: person.lastname,
                parameters: data.variables.map((v: any) => ({
                    type: "text",
                    text: v.variable !== 'custom' ? (person as Dictionary)[v.variable] : v.text,
                    name: v.name
                }))
            }))
        }
        dispatch(sendHSM(messagedata))
        dispatch(showBackdrop(true));
        setWaitClose(true)
    });

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.send_hsm).replace("HSM", type)}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.continue)}
            handleClickButton1={() => setOpenModal(false)}
            handleClickButton2={onSubmit}
            button2Type="submit"
        >
            <div style={{ marginBottom: 8 }}>
                {persons.length} {t(langKeys.persons_selected)}, {personWithData.length} {t(langKeys.with)} {type === "MAIL" ? t(langKeys.email).toLocaleLowerCase() : t(langKeys.phone).toLocaleLowerCase()}
            </div>
            {type === "HSM" && (
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
                    data={templatesList}
                    optionDesc="name"
                    optionValue="id"
                />
            </div>
            {type === 'MAIL' &&
                <React.Fragment>
                    <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{t(langKeys.message)}</Box>
                    <div dangerouslySetInnerHTML={{ __html: bodyMessage }} />
                </React.Fragment>
            }
            {type !== 'MAIL' &&
                <FieldEditMulti
                    label={t(langKeys.message)}
                    valueDefault={bodyMessage}
                    disabled={true}
                    rows={1}
                />
            }
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                {fields.map((item: Dictionary, i) => (
                    <>
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
                            error={errors?.variables?.[i]?.text?.message}
                            data={variables.map(v => ({ key: v }))}
                            uset={true}
                            prefixTranslation=""
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
                            />
                        }
                    </>
                ))}
            </div>
        </DialogZyx>)
}

export const Person: FC = () => {
    const history = useHistory();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({ pageSize: 20, pageIndex: 0, filters: {}, sorts: {}, daterange: null })
    const personList = useSelector(state => state.person.personList);
    const domains = useSelector(state => state.person.editableDomains);
    const [pageCount, setPageCount] = useState(0);
    const [totalrow, settotalrow] = useState(0);
    const resExportData = useSelector(state => state.main.exportData);
    const executeResult = useSelector(state => state.main.execute);
    const [waitExport, setWaitExport] = useState(false);
    const [waitImport, setWaitImport] = useState(false);
    const [filterAgents, setFilterAgents] = useState('');
    const [filterChannelsType, setFilterChannelType] = useState('')
    const [openDialogTemplate, setOpenDialogTemplate] = useState(false)
    const [selectedRows, setSelectedRows] = useState<Dictionary>({});
    const [personsSelected, setPersonsSelected] = useState<IPerson[]>([]);
    const [typeTemplate, setTypeTemplate] = useState('');

    const goToPersonDetail = (person: IPerson) => {
        history.push({
            pathname: paths.PERSON_DETAIL.resolve(person.personid),
            state: person,
        });
    }

    const columns = [
        {
            Header: t(langKeys.lead),
            accessor: 'havelead',
            type: "boolean",
            Cell: (props: any) => {
                const { havelead } = props.cell.row.original;
                if (havelead)
                    return <StarIcon fontSize="small" style={{ color: '#ffb400' }} />

                return <StarIcon color="action" fontSize="small" />
            }
        },
        {
            Header: t(langKeys.action_plural),
            accessor: 'leadid',
            Cell: (props: any) => {
                const person = props.cell.row.original as IPerson;
                return (
                    <>
                        <Tooltip title={t(langKeys.send_hsm) + ""}>
                            <IconButton
                                size="small"
                                onClick={(e: any) => {
                                    e.stopPropagation();
                                    setPersonsSelected([person]);
                                    setOpenDialogTemplate(true);
                                    setTypeTemplate("HSM");
                                }}
                            >
                                <HSMIcon width={24} style={{ fill: 'rgba(0, 0, 0, 0.54)' }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={t(langKeys.send_mail) + ""}>
                            <IconButton
                                size="small"
                                onClick={(e: any) => {
                                    e.stopPropagation();
                                    setPersonsSelected([person]);
                                    setOpenDialogTemplate(true);
                                    setTypeTemplate("MAIL");
                                }}
                            >
                                <MailIcon color="action" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={t(langKeys.send_sms) + ""}>
                            <IconButton
                                size="small"
                                onClick={(e: any) => {
                                    e.stopPropagation();
                                    setPersonsSelected([person]);
                                    setOpenDialogTemplate(true);
                                    setTypeTemplate("SMS");
                                }}
                            >
                                <SmsIcon color="action" />
                            </IconButton>
                        </Tooltip>
                    </>
                )
            }
        },
        {
            Header: t(langKeys.firstContactDate),
            accessor: 'firstcontact',
            type: 'date',
            sortType: 'datetime',
            Cell: (props: any) => {
                const row = props.cell.row.original;
                return row.firstcontact ? convertLocalDate(row.firstcontact).toLocaleString() : ""
            }
        },
        {
            Header: t(langKeys.firstContactDate),
            accessor: 'lastcontact',
            type: 'date',
            sortType: 'datetime',
            Cell: (props: any) => {
                const row = props.cell.row.original;
                return row.lastcontact ? convertLocalDate(row.lastcontact).toLocaleString() : ""
            }
        },
        {
            Header: t(langKeys.customer),
            accessor: 'name',
            Cell: (props: any) => {
                const { name, email, phone, priority, userlead } = props.cell.row.original;
                return (
                    <div >
                        <div>{t(langKeys.name)}: {name}</div>
                        <div>{t(langKeys.email)}: {email}</div>
                        <div>{t(langKeys.phone)}: {phone}</div>
                        {priority &&
                            <>
                                <Rating
                                    name="simple-controlled"
                                    max={3}
                                    defaultValue={urgencyLevels.findIndex(x => x === priority)}
                                    readOnly={true}
                                />
                                <div>{t(langKeys.assignedTo)}: {userlead}</div>
                            </>
                        }
                    </div>
                )
            }
        },
        {
            Header: t(langKeys.type),
            accessor: 'type',
            prefixTranslation: 'type_persontype_',
            Cell: (props: any) => {
                const { type } = props.cell.row.original;
                return type ? (t(`type_persontype_${type}`.toLowerCase()) || "").toUpperCase() : "";
            }
        },
        {
            Header: t(langKeys.status),
            accessor: 'status',
            prefixTranslation: 'status_',
            Cell: (props: any) => {
                const { status } = props.cell.row.original;
                return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
            }
        },
        {
            Header: t(langKeys.comments),
            accessor: 'datenote',
            Cell: (props: any) => {
                const { datenote, note, dateactivity, leadactivity } = props.cell.row.original;
                return (
                    <div>
                        {datenote && <div>{t(langKeys.lastnote)} ({convertLocalDate(datenote).toLocaleString()}) {note}</div>}
                        {dateactivity && <div>{t(langKeys.nextprogramedactivity)} ({convertLocalDate(dateactivity).toLocaleString()}) {leadactivity}</div>}
                    </div>
                )
            }
        },
    ]

    useEffect(() => {
        dispatch(getDomainsByTypename());
        fetchData(fetchDataAux);

        return () => {
            dispatch(resetGetPersonListPaginated());
            dispatch(resetAllMain());
        };
    }, [])

    useEffect(() => {
        if (!personList.loading && !personList.error) {
            setPageCount(Math.ceil(personList.count / fetchDataAux.pageSize));
            settotalrow(personList.count);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [personList]);

    const fetchData = ({ pageSize, pageIndex, filters, sorts, daterange }: IFetchData) => {
        setfetchDataAux({ pageSize, pageIndex, filters, sorts, daterange })
        dispatch(getPersonListPaginated(getPaginatedPerson({
            startdate: daterange?.startDate || format(new Date(new Date().setDate(1))),
            enddate: daterange?.endDate || format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)),
            skip: pageSize * pageIndex,
            take: pageSize,
            sorts,
            filters: filters,
            userids: filterAgents,
            channeltypes: filterChannelsType
        })));
    }

    const triggerExportData = ({ filters, sorts, daterange }: IFetchData) => {
        dispatch(exportData(getPersonExport(
            {
                startdate: daterange.startDate!,
                enddate: daterange.endDate!,
                sorts,
                filters: filters
            })));
        dispatch(showBackdrop(true));
        setWaitExport(true);
    };

    useEffect(() => {
        if (waitExport) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(showBackdrop(false));
                setWaitExport(false);
                window.open(resExportData.url, '_blank');
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code || "error_unexpected_error", { module: t(langKeys.person).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitExport(false);
            }
        }
    }, [resExportData, waitExport]);

    const handleTemplate = () => {
        const data = [
            {},
            {},
            domains.value?.docTypes.reduce((a, d) => ({ ...a, [d.domainvalue]: t(`type_documenttype_${d.domainvalue?.toLowerCase()}`) }), {}),
            {},
            domains.value?.personGenTypes.reduce((a, d) => ({ ...a, [d.domainvalue]: t(`type_persontype_${d.domaindesc?.toLowerCase()}`) }), {}),
            domains.value?.personTypes.reduce((a, d) => ({ ...a, [d.domainvalue]: t(`type_personlevel_${d.domainvalue?.toLowerCase()}`) }), {}),
            {},
            {},
            {},
            {},
            {},
            domains.value?.genders.reduce((a, d) => ({ ...a, [d.domainvalue]: t(`type_gender_${d.domainvalue?.toLowerCase()}`) }), {}),
            domains.value?.educationLevels.reduce((a, d) => ({ ...a, [d.domainvalue]: t(`type_educationlevel_${d.domainvalue?.toLowerCase()}`) }), {}),
            domains.value?.civilStatuses.reduce((a, d) => ({ ...a, [d.domainvalue]: t(`type_civilstatus_${d.domainvalue?.toLowerCase()}`) }), {}),
            domains.value?.occupations.reduce((a, d) => ({ ...a, [d.domainvalue]: t(`type_ocupation_${d.domainvalue?.toLowerCase()}`) }), {}),
            domains.value?.groups.reduce((a, d) => ({ ...a, [d.domainvalue]: d.domaindesc }), {}),
            domains.value?.channelTypes.reduce((a, d) => ({ ...a, [d.domainvalue]: d.domaindesc }), {}),
            {},
            {},
            {}
        ];
        const header = [
            'firstname',
            'lastname',
            'documenttype',
            'documentnumber',
            'persontype',
            'type',
            'phone',
            'alternativephone',
            'email',
            'alternativeemail',
            'birthday',
            'gender',
            'educationlevel',
            'civilstatus',
            'occupation',
            'groups',
            'channeltype',
            'personcommunicationchannel',
            'personcommunicationchannelowner',
            'displayname'
        ];
        exportExcel(t(langKeys.template), templateMaker(data, header));
    }

    const handleUpload = async (files: any) => {
        const file = files?.item(0);
        if (file) {
            let excel: any = await uploadExcel(file, undefined);
            let data: IPersonImport[] = array_trimmer(excel);
            data = data.filter((f: IPersonImport) =>
                (f.documenttype === undefined || Object.keys(domains.value?.docTypes.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domainvalue }), {})).includes('' + f.documenttype))
                && (f.persontype === undefined || Object.keys(domains.value?.personGenTypes.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domaindesc }), {})).includes('' + f.persontype))
                && (f.type === undefined || Object.keys(domains.value?.personTypes.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domainvalue }), {})).includes('' + f.type))
                && (f.gender === undefined || Object.keys(domains.value?.genders.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domainvalue }), {})).includes('' + f.gender))
                && (f.educationlevel === undefined || Object.keys(domains.value?.educationLevels.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domainvalue }), {})).includes('' + f.educationlevel))
                && (f.civilstatus === undefined || Object.keys(domains.value?.civilStatuses.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domainvalue }), {})).includes('' + f.civilstatus))
                && (f.occupation === undefined || Object.keys(domains.value?.occupations.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domainvalue }), {})).includes('' + f.occupation))
                && (f.groups === undefined || Object.keys(domains.value?.groups.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domaindesc }), {})).includes('' + f.groups))
                && (f.channeltype === undefined || Object.keys(domains.value?.channelTypes.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domaindesc }), {})).includes('' + f.channeltype))
            );
            if (data.length > 0) {
                dispatch(showBackdrop(true));
                let table: Dictionary = data.reduce((a: any, d: IPersonImport) => ({
                    ...a,
                    [`${d.documenttype}_${d.documentnumber}`]: {
                        id: 0,
                        firstname: d.firstname || null,
                        lastname: d.lastname || null,
                        documenttype: d.documenttype,
                        documentnumber: d.documentnumber,
                        persontype: d.persontype || null,
                        type: d.type || '',
                        phone: d.phone || null,
                        alternativephone: d.alternativephone || null,
                        email: d.email || null,
                        alternativeemail: d.alternativeemail || null,
                        birthday: d.birthday || null,
                        gender: d.gender || null,
                        educationlevel: d.educationlevel || null,
                        civilstatus: d.civilstatus || null,
                        occupation: d.occupation || null,
                        groups: d.groups || null,
                        status: 'ACTIVO',
                        personstatus: 'ACTIVO',
                        referringpersonid: 0,
                        geographicalarea: null,
                        age: null,
                        sex: null,
                        operation: 'INSERT',
                        pcc: data
                            .filter((c: IPersonImport) => `${c.documenttype}_${c.documentnumber}` === `${d.documenttype}_${d.documentnumber}`
                                && !['', null, undefined].includes(c.channeltype)
                                && !['', null, undefined].includes(c.personcommunicationchannel)
                            )
                            .map((c: IPersonImport) => ({
                                type: c.channeltype,
                                personcommunicationchannel: c.personcommunicationchannel || null,
                                personcommunicationchannelowner: c.personcommunicationchannelowner || null,
                                displayname: c.displayname || null,
                                status: 'ACTIVO',
                                operation: 'INSERT'
                            }))
                    }
                }), {});
                Object.values(table).forEach((p: IPersonImport) => {
                    dispatch(execute({
                        header: insPersonBody({ ...p }),
                        detail: [
                            ...p.pcc.map((x: IPersonCommunicationChannel) => insPersonCommunicationChannel({ ...x })),
                        ]
                    }, true));
                });
                setWaitImport(true)
            }
            else {
                dispatch(showSnackbar({ show: true, success: false, message: t(langKeys.no_records_valid) }));
            }
        }
    }

    useEffect(() => {
        if (waitImport) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_register) }))
                fetchData(fetchDataAux);
                dispatch(showBackdrop(false));
                setWaitImport(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.quickreplies).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitImport(false);
            }
        }
    }, [executeResult, waitImport])

    useEffect(() => {
        if (!(Object.keys(selectedRows).length === 0 && personsSelected.length === 0)) {
            setPersonsSelected(p => Object.keys(selectedRows).map(x => personList.data.find(y => y.personid === parseInt(x)) || p.find(y => y.personid === parseInt(x)) || {} as IPerson))
        }
    }, [selectedRows])

    console.log(domains.value?.channels)

    return (
        <div style={{ height: '100%', width: 'inherit' }}>
            <Title><Trans i18nKey={langKeys.person} count={2} /></Title>
            <Grid container direction="row" justifyContent="space-between" style={{ marginBottom: 12, marginTop: 4, gap: 8 }}>
                <Grid item>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <FieldMultiSelect
                            onChange={(value) => setFilterChannelType(value.map((o: any) => o.type).join())}
                            size="small"
                            label={t(langKeys.channel)}
                            style={{ maxWidth: 300, minWidth: 200 }}
                            variant="outlined"
                            loading={domains.loading}
                            data={domains.value?.channels || []}
                            optionValue="type"
                            optionDesc="communicationchanneldesc"
                        />
                        <FieldMultiSelect
                            onChange={(value) => setFilterAgents(value.map((o: any) => o.userid).join())}
                            size="small"
                            label={t(langKeys.user)}
                            style={{ maxWidth: 300, minWidth: 200 }}
                            variant="outlined"
                            loading={domains.loading}
                            data={domains.value?.agents || []}
                            optionValue="userid"
                            optionDesc="fullname"
                        />
                    </div>
                </Grid>
                <Grid item>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={personList.loading || Object.keys(selectedRows).length === 0}
                            startIcon={<HSMIcon width={24} style={{ fill: '#FFF' }} />}
                            onClick={() => {
                                setOpenDialogTemplate(true);
                                setTypeTemplate("HSM");
                            }}
                        >
                            <Trans i18nKey={langKeys.send_hsm} />
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={personList.loading || Object.keys(selectedRows).length === 0}
                            startIcon={<MailIcon width={24} style={{ fill: '#FFF' }} />}
                            onClick={() => {
                                setOpenDialogTemplate(true);
                                setTypeTemplate("MAIL");
                            }}
                        >
                            <Trans i18nKey={langKeys.send_mail} />
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={personList.loading || Object.keys(selectedRows).length === 0}
                            startIcon={<SmsIcon width={24} style={{ fill: '#FFF' }} />}
                            onClick={() => {
                                setOpenDialogTemplate(true);
                                setTypeTemplate("SMS");
                            }}
                        >
                            <Trans i18nKey={langKeys.send_sms} />
                        </Button>
                    </div>
                </Grid>
            </Grid>
            <TablePaginated
                columns={columns}
                data={personList.data}
                pageCount={pageCount}
                totalrow={totalrow}
                loading={personList.loading}
                filterrange={true}
                download={true}
                exportPersonalized={triggerExportData}
                fetchData={fetchData}
                useSelection={true}
                selectionKey={selectionKey}
                setSelectedRows={setSelectedRows}
                onClickRow={goToPersonDetail}
                register={true}
                ButtonsElement={() => (
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={personList.loading}
                        startIcon={<ListAltIcon color="secondary" />}
                        onClick={handleTemplate}
                        style={{ backgroundColor: "#55BD84" }}
                    >
                        <Trans i18nKey={langKeys.template} />
                    </Button>
                )}
                importCSV={handleUpload}
                handleRegister={() => history.push({
                    pathname: paths.PERSON_DETAIL.resolve(0),
                    state: {},
                })}
            />
            <DialogSendTemplate
                openModal={openDialogTemplate}
                setOpenModal={setOpenDialogTemplate}
                persons={personsSelected}
                type={typeTemplate}
            />
        </div>
    );
}

interface TabPanelProps {
    value: string;
    index: string;
}

const TabPanel: FC<TabPanelProps> = ({ children, value, index }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`wrapped-tabpanel-${value}`}
            aria-labelledby={`wrapped-tab-${value}`}
            style={{ display: value === index ? 'block' : 'none', overflowY: 'auto' }}
        >
            <Box p={3}>
                {children}
            </Box>
        </div>
    );
}

const usePropertyStyles = makeStyles(theme => ({
    propertyRoot: {
        display: 'flex',
        flexDirection: 'row',
        stroke: '#8F92A1',
        alignItems: 'center',
        overflowWrap: 'anywhere',
    },
    propTitle: {
        fontWeight: 400,
        fontSize: 14,
        color: '#8F92A1',
    },
    propSubtitle: {
        color: theme.palette.text.primary,
        fontWeight: 400,
        fontSize: 15,
        margin: 0,
        width: '100%',
    },
    leadingContainer: {
        height: 24,
        width: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        stroke: '#8F92A1',
        fill: '#8F92A1',
    },
    contentContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexGrow: 1,
    },
    propSubtitleTicket: {
        fontWeight: 400,
        fontSize: 15,
        margin: 0,
        width: '100%',
        color: '#7721ad',
        textDecoration: 'underline',
        cursor: 'pointer'
    },
}));

interface PropertyProps extends Omit<BoxProps, 'title'> {
    icon?: React.ReactNode;
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    isLink?: Boolean;
}

const Property: FC<PropertyProps> = ({ icon, title, subtitle, isLink = false, ...boxProps }) => {
    const classes = usePropertyStyles();

    return (
        <Box className={classes.propertyRoot} {...boxProps}>
            {icon && <div className={classes.leadingContainer}>{icon}</div>}
            {icon && <div style={{ width: 8, minWidth: 8 }} />}
            <div className={classes.contentContainer}>
                <label className={classes.propTitle}>{title}</label>
                <div style={{ height: 4 }} />
                <div className={isLink ? classes.propSubtitleTicket : classes.propSubtitle}>{subtitle || "-"}</div>
            </div>
        </Box>
    );
}

const usePersonDetailStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: "100%",
        width: 'inherit',
        // overflowY: 'hidden',
    },
    rootContent: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        flexGrow: 1,
        overflowY: 'hidden',
    },
    tabs: {
        backgroundColor: '#EBEAED',
        color: '#989898',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 'inherit',
    },
    tab: {
        color: theme.palette.text.primary,
        backgroundColor: '#EBEAED',
        flexGrow: 1,
        maxWidth: 'unset',
    },
    activetab: {
        backgroundColor: 'white',
    },
    label: {
        fontSize: 14,
        fontWeight: 500,
    },
    profile: {
        color: theme.palette.text.primary,
        maxWidth: 343,
        width: 343,
        minWidth: 180,
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
    },
}));


export const PersonDetail: FC = () => {
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

    const user = useSelector(state => state.login.validateToken.user);
    const person = location.state as IPerson | null;

    const { setValue, getValues, trigger, register, formState: { errors } } = useForm<any>({
        defaultValues: { ...person } || {},
    });


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
                person.sex = '';
                person.gender = '';
                person.civilstatus = '';
                person.occupation = '';
                person.educationlevel = '';
                person.referringpersonid = 0;

                register('firstname', { validate: (value) => (value && value.length) ? true : t(langKeys.field_required) + "" });
                register('lastname', { validate: (value) => (value && value.length) ? true : t(langKeys.field_required) + "" });
                register('personcommunicationchannel', { validate: (value) => (value && value.length) ? true : t(langKeys.field_required) + "" });
                register('personcommunicationchannelowner', { validate: (value) => (value && value.length) ? true : t(langKeys.field_required) + "" });
                register('channeltype', { validate: (value) => (value && value.length) ? true : t(langKeys.field_required) + "" });
            }
            dispatch(getDomainsByTypename());
        }

        return () => {
            dispatch(resetGetDomainsByTypename());
            dispatch(resetEditPerson());
        };
    }, [history, person, dispatch]);

    useEffect(() => {
        if (domains.loading) return;
        if (domains.error === true) {
            dispatch(showSnackbar({
                message: domains.message!,
                show: true,
                success: false,
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
                success: false,
            }));
        } else if (edit.success) {
            dispatch(showBackdrop(false));
            dispatch(showSnackbar({
                message: t(langKeys.successful_edit),
                show: true,
                success: true,
            }));
            if (!person?.personid) {
                history.push(paths.PERSON);
            }
        }
    }, [edit, dispatch]);


    const handleEditPerson = async () => {
        const allOk = await trigger(); //para q valide el formulario
        if (allOk) {
            const values = getValues();
            const callback = () => {
                const payload = editPersonBody(values);

                dispatch(editPerson(payload.parameters.personid ? payload : {
                    header: editPersonBody({ ...person, ...values }),
                    detail: [
                        insPersonCommunicationChannel({
                            personcommunicationchannel: values.personcommunicationchannel,
                            personcommunicationchannelowner: values.personcommunicationchannelowner,
                            displayname: `${values.firstname} ${values.lastname}`,
                            type: values.channeltype,
                            operation: 'INSERT',
                            status: 'ACTIVO'
                        })
                    ]
                }, !payload.parameters.personid));

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
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_transaction) }))
                dispatch(showBackdrop(false));
                setWaitLock(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.person).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitLock(false);
            }
        }
    }, [executeResult, waitLock]);

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
                        history.push(paths.PERSON);
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
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={getValues('locked') ? <LockOpenIcon color="secondary" /> : <LockIcon color="secondary" />}
                            onClick={handleLock}
                        >
                            {getValues('locked') ? t(langKeys.unlock) : t(langKeys.lock)}
                        </Button>
                    }
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        startIcon={<ClearIcon color="secondary" />}
                        style={{ backgroundColor: "#FB5F5F" }}
                        onClick={(e) => {
                            e.preventDefault();
                            history.push(paths.PERSON);
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
                                    label={<Trans i18nKey={langKeys.audit} />}
                                    value="2"
                                />
                            }
                            {!!person.personid &&
                                <Tab
                                    className={clsx(classes.tab, classes.label, tabIndex === "3" && classes.activetab)}
                                    label={<Trans i18nKey={langKeys.conversation} count={2} />}
                                    value="3"
                                />
                            }
                            {!!person.personid &&
                                <Tab
                                    className={clsx(classes.tab, classes.label, tabIndex === "4" && classes.activetab)}
                                    label={<Trans i18nKey={langKeys.opportunity} count={2} />}
                                    value="4"
                                />
                            }
                            {/* <Tab
                                className={clsx(classes.tab, classes.label, tabIndex === "4" && classes.activetab)}
                                label={<Trans i18nKey={langKeys.claim} count={2} />}
                                value="4"
                            /> */}
                        </Tabs>
                    </AppBar>
                    <TabPanel value="0" index={tabIndex}>
                        <GeneralInformationTab
                            getValues={getValues}
                            setValue={setValue}
                            person={person}
                            domains={domains}
                            errors={errors}
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
                        <AuditTab person={person} />
                    </TabPanel>
                    <TabPanel value="3" index={tabIndex}>
                        <ConversationsTab person={person} />
                    </TabPanel>
                    <TabPanel value="4" index={tabIndex}>
                        <OpportunitiesTab person={person} />
                    </TabPanel>
                    {/* <TabPanel value="4" index={tabIndex}>qqq</TabPanel> */}
                </div>
                <Divider style={{ backgroundColor: '#EBEAED' }} orientation="vertical" flexItem />
                {!!person.personid &&
                    <div className={classes.profile}>
                        <label className={classes.label}>Overview</label>
                        <div style={{ height: 16 }} />
                        <Photo src={person.imageurldef} radius={50} />
                        <h2>{person.name}</h2>
                        <Property
                            icon={<TelephoneIcon fill="inherit" stroke="inherit" width={20} height={20} />}
                            title={<Trans i18nKey={langKeys.phone} />}
                            subtitle={(
                                <TextField
                                    fullWidth
                                    placeholder={t(langKeys.phone)}
                                    defaultValue={person.phone}
                                    onChange={e => setValue('phone', e.target.value)}
                                />
                            )}
                            mt={1}
                            mb={1}
                        />
                        <Property
                            icon={<EMailInboxIcon />}
                            title={<Trans i18nKey={langKeys.email} />}
                            subtitle={(
                                <TextField
                                    fullWidth
                                    placeholder={t(langKeys.email)}
                                    defaultValue={person.email}
                                    onChange={e => setValue('email', e.target.value)}
                                />
                            )}
                            mt={1}
                            mb={1} />
                        <Property
                            icon={<DocTypeIcon fill="inherit" stroke="inherit" width={20} height={20} />}
                            title={<Trans i18nKey={langKeys.document} />}
                            subtitle={(
                                <DomainSelectField
                                    defaultValue={person.documenttype}
                                    onChange={(value) => {
                                        setValue('documenttype', value);
                                    }}
                                    loading={domains.loading}
                                    data={domains.value?.docTypes || []}
                                />
                            )}
                            mt={1}
                            mb={1}
                        />
                        <Property
                            icon={<DocNumberIcon fill="inherit" stroke="inherit" width={20} height={20} />}
                            title={<Trans i18nKey={langKeys.docNumber} />}
                            subtitle={(
                                <TextField
                                    fullWidth
                                    placeholder={t(langKeys.docNumber)}
                                    defaultValue={person.documentnumber}
                                    onChange={e => setValue('documentnumber', e.target.value)}
                                />
                            )}
                            mt={1}
                            mb={1}
                        />
                        <Property
                            icon={<GenderIcon />}
                            title={<Trans i18nKey={langKeys.gender} />}
                            subtitle={(
                                <DomainSelectField
                                    defaultValue={person.gender}
                                    onChange={(value, desc) => {
                                        setValue('gender', value);
                                        setValue('genderdesc', desc)
                                    }}
                                    loading={domains.loading}
                                    data={domains.value?.genders || []}
                                />
                            )}
                            mt={1}
                            mb={1}
                        />
                        <Property
                            icon={<BuildingIcon />}
                            title={<Trans i18nKey={langKeys.organization} />}
                            subtitle={person.orgdesc}
                            mt={1}
                            mb={1}
                        />
                    </div>
                }
            </div>
        </div>
    );
}

const useReferrerItemStyles = makeStyles(theme => ({
    root: {
        border: '#EBEAED solid 1px',
        borderRadius: 5,
        padding: theme.spacing(2),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
    },
    itemLabel: {
        color: '#8F92A1',
        fontSize: 14,
        fontWeight: 400,
        margin: 0,
    },
    itemText: {
        color: theme.palette.text.primary,
        fontSize: 15,
        fontWeight: 400,
        margin: '6px 0',
    },
}));

interface ReferrerItemProps {
    referrer: IPersonReferrer;
}

const ReferrerItem: FC<ReferrerItemProps> = ({ referrer }) => {
    const classes = useReferrerItemStyles();

    return (
        <div className={classes.root}>
            <Grid container direction="row">
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Property
                        title={<Trans i18nKey={langKeys.name} />}
                        subtitle={referrer.name}
                        m={1}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Property
                        title={<Trans i18nKey={langKeys.docType} />}
                        subtitle={referrer.documenttype}
                        m={1}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Property
                        title={<Trans i18nKey={langKeys.docNumber} />}
                        subtitle={referrer.documentnumber}
                        m={1}
                    />
                </Grid>
            </Grid>
        </div>
    );
}

interface GeneralInformationTabProps {
    person: IPerson;
    getValues: UseFormGetValues<IPerson>;
    setValue: any;
    domains: IObjectState<IPersonDomains>;
    errors: any;
}

const GeneralInformationTab: FC<GeneralInformationTabProps> = ({ person, getValues, setValue, domains, errors }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const referrerList = useSelector(state => state.person.personReferrerList);

    useEffect(() => {
        if (person.referringpersonid) {
            dispatch(getReferrerListByPerson(getReferrerByPersonBody(person.referringpersonid)));
            return () => {
                dispatch(resetGetReferrerListByPerson());
            };
        }
    }, [dispatch, person]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Grid container direction="row">
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.corporation} />}
                                subtitle={person.corpdesc}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.organization} />}
                                subtitle={person.orgdesc}
                                m={1}
                            />
                        </Grid>

                        <Grid item sm={6} xl={6} xs={6} md={6} lg={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.firstname} />}
                                subtitle={(
                                    <TextField
                                        fullWidth
                                        placeholder={t(langKeys.firstname)}
                                        defaultValue={person.firstname}
                                        onChange={e => setValue('firstname', e.target.value)}
                                        error={errors?.firstname?.message ? true : false}
                                        helperText={errors?.firstname?.message || null}
                                    />
                                )}

                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.lastname} />}
                                subtitle={(
                                    <TextField
                                        fullWidth
                                        placeholder={t(langKeys.lastname)}
                                        defaultValue={person.lastname}
                                        onChange={e => setValue('lastname', e.target.value)}
                                        error={errors?.lastname?.message ? true : false}
                                        helperText={errors?.lastname?.message || null}
                                    />
                                )}
                                m={1}
                            />
                        </Grid>

                        {!person.personid &&
                            <>
                                <Grid item sm={6} xl={6} xs={6} md={6} lg={6}>
                                    <Property
                                        title={<Trans i18nKey={langKeys.personIdentifier} />}
                                        subtitle={(
                                            <TextField
                                                fullWidth
                                                placeholder={t(langKeys.personIdentifier)}
                                                onChange={e => setValue('personcommunicationchannel', e.target.value)}
                                                error={errors?.personcommunicationchannel?.message ? true : false}
                                                helperText={errors?.personcommunicationchannel?.message || null}
                                            />
                                        )}
                                        m={1}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <Property
                                        title={<Trans i18nKey={langKeys.internalIdentifier} />}
                                        subtitle={(
                                            <TextField
                                                fullWidth
                                                placeholder={t(langKeys.internalIdentifier)}
                                                onChange={e => setValue('personcommunicationchannelowner', e.target.value)}
                                                error={!!errors?.personcommunicationchannelowner?.message}
                                                helperText={errors?.personcommunicationchannelowner?.message || null}
                                            />
                                        )}
                                        m={1}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <Property
                                        title={<Trans i18nKey={langKeys.communicationchannel} />}
                                        subtitle={(
                                            <FieldSelect
                                                onChange={(value) => {
                                                    setValue('channeltype', value?.domainvalue);
                                                }}
                                                loading={domains.loading}
                                                data={domains.value?.channelTypes || []}
                                                optionValue="domainvalue"
                                                optionDesc="domaindesc"
                                                error={errors?.channeltype?.message}
                                            />
                                        )}
                                        m={1}
                                    />
                                </Grid>
                            </>
                        }

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Property
                                title={<Trans i18nKey={langKeys.fullname} />}
                                subtitle={person.name}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.document} />}
                                subtitle={(
                                    <FieldSelect
                                        uset={true}
                                        valueDefault={person.documenttype}
                                        onChange={(value) => {
                                            setValue('documenttype', value?.domainvalue);
                                        }}
                                        loading={domains.loading}
                                        data={domains.value?.docTypes || []}
                                        prefixTranslation="type_documenttype_"
                                        optionValue="domainvalue"
                                        optionDesc="domainvalue"
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.docNumber} />}
                                subtitle={(
                                    <TextField
                                        fullWidth
                                        placeholder={t(langKeys.docNumber)}
                                        defaultValue={person.documentnumber}
                                        onChange={e => setValue('documentnumber', e.target.value)}
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.personType} />}
                                subtitle={(
                                    <FieldSelect
                                        uset={true}
                                        valueDefault={person.persontype}
                                        onChange={(value) => {
                                            setValue('persontype', value?.domainvalue);
                                        }}
                                        loading={domains.loading}
                                        data={domains.value?.personGenTypes || []}
                                        prefixTranslation="type_persontype_"
                                        optionValue="domainvalue"
                                        optionDesc="domaindesc"
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.type} />}
                                subtitle={(
                                    <FieldSelect
                                        uset={true}
                                        valueDefault={person.type}
                                        onChange={(value) => {
                                            setValue('type', value?.domainvalue);
                                        }}
                                        loading={domains.loading}
                                        data={domains.value?.personTypes || []}
                                        prefixTranslation="type_personlevel_"
                                        optionValue="domainvalue"
                                        optionDesc="domainvalue"
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.phone} />}
                                subtitle={(
                                    <TextField
                                        fullWidth
                                        placeholder={t(langKeys.phone)}
                                        defaultValue={person.phone}
                                        onChange={e => setValue('phone', e.target.value)}
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.alternativePhone} />}
                                subtitle={(
                                    <TextField
                                        fullWidth
                                        placeholder={t(langKeys.alternativePhone)}
                                        defaultValue={person.alternativephone}
                                        onChange={e => setValue('alternativephone', e.target.value)}
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.email} />}
                                subtitle={(
                                    <TextField
                                        fullWidth
                                        placeholder={t(langKeys.email)}
                                        defaultValue={person.email}
                                        onChange={e => setValue('email', e.target.value)}
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.alternativeEmail} />}
                                subtitle={(
                                    <TextField
                                        fullWidth
                                        placeholder={t(langKeys.alternativeEmail)}
                                        defaultValue={person.alternativeemail}
                                        onChange={e => setValue('alternativeemail', e.target.value)}
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.birthday} />}
                                subtitle={(
                                    <TextField
                                        type="date"
                                        fullWidth
                                        placeholder={t(langKeys.birthday)}
                                        defaultValue={person.birthday}
                                        onChange={e => setValue('birthday', e.target.value)}
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.gender} />}
                                subtitle={(
                                    <FieldSelect
                                        uset={true}
                                        valueDefault={person.gender}
                                        onChange={(value) => {
                                            setValue('gender', value?.domainvalue);
                                            setValue('genderdesc', value?.domaindesc)
                                        }}
                                        loading={domains.loading}
                                        data={domains.value?.genders || []}
                                        prefixTranslation="type_gender_"
                                        optionValue="domainvalue"
                                        optionDesc="domainvalue"
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.educationLevel} />}
                                subtitle={(
                                    <FieldSelect
                                        uset={true}
                                        valueDefault={person.educationlevel}
                                        onChange={(value) => {
                                            setValue('educationlevel', value?.domainvalue);
                                            setValue('educationleveldesc', value?.domaindesc)
                                        }}
                                        loading={domains.loading}
                                        data={domains.value?.educationLevels || []}
                                        prefixTranslation="type_educationlevel_"
                                        optionValue="domainvalue"
                                        optionDesc="domainvalue"
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.civilStatus} />}
                                subtitle={(
                                    <FieldSelect
                                        uset={true}
                                        valueDefault={person.civilstatus}
                                        onChange={(value) => {
                                            setValue('civilstatus', value?.domainvalue);
                                            setValue('civilstatusdesc', value?.domaindesc)
                                        }}
                                        loading={domains.loading}
                                        data={domains.value?.civilStatuses || []}
                                        prefixTranslation="type_civilstatus_"
                                        optionValue="domainvalue"
                                        optionDesc="domainvalue"
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.occupation} />}
                                subtitle={(
                                    <FieldSelect
                                        uset={true}
                                        valueDefault={person.occupation}
                                        onChange={(value) => {
                                            setValue('occupation', value?.domainvalue);
                                            setValue('occupationdesc', value?.domaindesc)
                                        }}
                                        loading={domains.loading}
                                        data={domains.value?.occupations || []}
                                        prefixTranslation="type_ocupation_"
                                        optionValue="domainvalue"
                                        optionDesc="domainvalue"
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.group} count={2} />}
                                subtitle={(
                                    <FieldSelect
                                        valueDefault={person.groups || ""}
                                        onChange={(value) => {
                                            setValue('groups', value?.domainvalue);
                                        }}
                                        loading={domains.loading}
                                        data={domains.value?.groups || []}
                                        optionValue="domainvalue"
                                        optionDesc="domaindesc"
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <div style={{ height: 12 }} />
            <label>{t(langKeys.referredBy)}</label>
            {referrerList.data.map((e, i) => <ReferrerItem referrer={e} key={`referrer_item_${i}`} />)}
        </div>
    );
}

const useChannelItemStyles = makeStyles(theme => ({
    root: {
        border: '#EBEAED solid 1px',
        borderRadius: 5,
        padding: theme.spacing(2),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
    },
    itemLabel: {
        color: '#8F92A1',
        fontSize: 14,
        fontWeight: 400,
        margin: 0,
    },
    itemText: {
        color: theme.palette.text.primary,
        fontSize: 15,
        fontWeight: 400,
        margin: '6px 0',
    },
}));

interface ChannelItemProps {
    channel: IPersonChannel;
}

const ChannelItem: FC<ChannelItemProps> = ({ channel }) => {
    const classes = useChannelItemStyles();

    return (
        <div className={classes.root}>
            <Grid container direction="row">
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Property
                        title={<Trans i18nKey={langKeys.communicationchannel} />}
                        subtitle={channel.typedesc}
                        m={1}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Property
                        title={<Trans i18nKey={langKeys.displayname} />}
                        subtitle={channel.displayname}
                        m={1}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Property
                        title={<Trans i18nKey={langKeys.personIdentifier} />}
                        subtitle={channel.personcommunicationchannel}
                        m={1}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Property
                        title={<Trans i18nKey={langKeys.internalIdentifier} />}
                        subtitle={channel.personcommunicationchannelowner}
                        m={1}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Property
                        title={<Trans i18nKey={langKeys.firstConnection} />}
                        subtitle={channel.firstcontact}
                        m={1}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Property
                        title={<Trans i18nKey={langKeys.lastConnection} />}
                        subtitle={channel.lastcontact}
                        m={1}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Property
                        title={<Trans i18nKey={langKeys.conversation} count={2} />}
                        subtitle={channel.conversations || '0'}
                        m={1}
                    />
                </Grid>
            </Grid>
        </div>
    );
}

interface ChannelTabProps {
    person: IPerson;
    getValues: UseFormGetValues<IPerson>;
    setValue: UseFormSetValue<IPerson>;
    domains: IObjectState<IPersonDomains>;
}

const CommunicationChannelsTab: FC<ChannelTabProps> = ({ person }) => {
    const dispatch = useDispatch();
    const channelList = useSelector(state => state.person.personChannelList);

    useEffect(() => {
        if (person.personid && person.personid !== 0) {
            dispatch(getChannelListByPerson(getChannelListByPersonBody(person.personid)));
            return () => {
                dispatch(resetGetChannelListByPerson());
            };
        }
    }, [dispatch, person]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: 12 }} />
            {channelList.data.map((e, i) => <ChannelItem channel={e} key={`channel_item_${i}`} />)}
        </div>
    );
}

interface AuditTabProps {
    person: IPerson;
}

const AuditTab: FC<AuditTabProps> = ({ person }) => {
    return (
        <Grid container direction="row">
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Grid container direction="column">
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            title={<Trans i18nKey={langKeys.firstContactDate} />}
                            subtitle={new Date(person.firstcontact).toLocaleString()}
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            title={<Trans i18nKey={langKeys.lastContactDate} />}
                            subtitle={new Date(person.lastcontact).toLocaleString()}
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            title={<Trans i18nKey={langKeys.lastCommunicationChannel} />}
                            subtitle={`${person.communicationchannelname || ''} - ${person.lastcommunicationchannelid || ''}`}
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            title={<Trans i18nKey={langKeys.createdBy} />}
                            subtitle={person.createby}
                            m={1}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Grid container direction="column">
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            title={<Trans i18nKey={langKeys.creationDate} />}
                            subtitle={new Date(person.createdate).toLocaleString()}
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            title={<Trans i18nKey={langKeys.modifiedBy} />}
                            subtitle={person.changeby}
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            title={<Trans i18nKey={langKeys.modificationDate} />}
                            subtitle={new Date(person.changedate).toLocaleString()}
                            m={1}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

interface ConversationsTabProps {
    person: IPerson;
}

const useConversationsTabStyles = makeStyles(theme => ({
    root: {
        height: '100%',
    },
}));

const ConversationsTab: FC<ConversationsTabProps> = ({ person }) => {
    const classes = useConversationsTabStyles();
    const dispatch = useDispatch();
    const firstCall = useRef(true);
    const [page, setPage] = useState(0);
    const [list, setList] = useState<IPersonConversation[]>([]);
    const conversations = useSelector(state => state.person.personTicketList);

    const fetchTickets = useCallback(() => {
        if (person.personid && person.personid !== 0) {
            const params = {
                filters: {},
                sorts: {},
                take: 20,
                skip: 20 * page,
                offset: 0,
            };
            dispatch(getTicketListByPerson(getTicketListByPersonBody(person.personid, params)))
        }
    }, [page, person, dispatch]);

    useEffect(() => {
        return () => {
            dispatch(resetGetTicketListByPerson());
        };
    }, [dispatch]);

    useEffect(() => {
        const myDiv = document.getElementById("wrapped-tabpanel-2");
        if (myDiv) {
            myDiv.onscroll = () => {
                if (!firstCall.current && list.length >= conversations.count) return;
                if (conversations.loading) return;
                if (myDiv.offsetHeight + myDiv.scrollTop + 1 >= myDiv.scrollHeight) {
                    setPage(prevPage => prevPage + 1);
                }
            };
        }
    }, [list, conversations, setPage]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    useEffect(() => {
        if (firstCall.current) firstCall.current = false;
        if (conversations.loading) return;
        if (conversations.error === true) {
            dispatch(showSnackbar({
                message: conversations.message || 'Error',
                show: true,
                success: false,
            }));
        } else {
            setList(prevList => [...prevList, ...conversations.data]);
        }
    }, [conversations, setList, dispatch]);

    return (
        <div className={classes.root}>
            {list.map((e, i) => {
                if (list.length < conversations.count && i === list.length - 1) {
                    return [
                        <ConversationItem conversation={e} key={`conversation_item_${i}`} person={person} />,
                        <div
                            style={{ width: 'inherit', display: 'flex', justifyContent: 'center' }}
                            key={`conversation_item_${i}_loader`}
                        >
                            <CircularProgress />
                        </div>
                    ];
                }
                return <ConversationItem conversation={e} key={`conversation_item_${i}`} person={person} />;
            })}
        </div>
    );
}

const useConversationsItemStyles = makeStyles(theme => ({
    root: {
        border: '#EBEAED solid 1px',
        borderRadius: 5,
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    collapseContainer: {
        marginTop: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        fontSize: 14,
        fontWeight: 400,
    },
    infoLabel: {
        fontWeight: 500,
        fontSize: 14,
    },
    totalTime: {
        fontWeight: 700,
        fontSize: 16,
    },
    icon: {
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

interface ConversationItemProps {
    conversation: IPersonConversation;
    person: Dictionary;
}


const ConversationItem: FC<ConversationItemProps> = ({ conversation, person }) => {
    const classes = useConversationsItemStyles();
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const mainResult = useSelector(state => state.main);
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);
    const openDialogInteractions = useCallback((row: any) => {
        setOpenModal(true);
        setRowSelected({ ...row, displayname: person.name, ticketnum: row.ticketnum })
    }, [mainResult]);

    return (
        <div className={classes.root}>
            <DialogInteractions
                openModal={openModal}
                setOpenModal={setOpenModal}
                ticket={rowSelected}
            />
            <Grid container direction="row">
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Property title="Ticket #" subtitle={conversation.ticketnum} isLink={true} onClick={() => openDialogInteractions(conversation)} />
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Property
                        title={<Trans i18nKey={langKeys.advisor} />}
                        subtitle={conversation.asesorfinal}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                    <Property
                        title={<Trans i18nKey={langKeys.channel} />}
                        subtitle={conversation.personcommunicationchannel}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Property
                        title={<Trans i18nKey={langKeys.startDate} />}
                        subtitle={new Date(conversation.fechainicio).toLocaleString()}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Property
                        title={<Trans i18nKey={langKeys.endDate} />}
                        subtitle={conversation.fechafin && new Date(conversation.fechafin).toLocaleString()}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                    <div className={classes.icon}>
                        <IconButton size="medium" onClick={() => setOpen(!open)}>
                            <ArrowDropDown />
                        </IconButton>
                    </div>
                </Grid>
            </Grid>
            <Collapse in={open}>
                <div className={classes.collapseContainer}>
                    <Divider orientation="horizontal" />
                    <h3><Trans i18nKey={langKeys.ticketInformation} /></h3>
                    <Grid container direction="column">
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                                    <label className={classes.infoLabel}>
                                        <Trans i18nKey={langKeys.firstTicketassignTime} />
                                    </label>
                                </Grid>
                                <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
                                    {conversation.fechainicio && new Date(conversation.fechainicio).toLocaleString()}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                                    <label className={classes.infoLabel}>
                                        <Trans i18nKey={langKeys.firstReply} />
                                    </label>
                                </Grid>
                                <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
                                    {conversation.firstreplytime}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                                    <label className={classes.infoLabel}>
                                        <Trans i18nKey={langKeys.pauseTime} />
                                    </label>
                                </Grid>
                                <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
                                    {conversation.totalpauseduration}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                                    <label className={classes.infoLabel}>
                                        <Trans i18nKey={langKeys.avgResponseTimeOfAdvisor} />
                                    </label>
                                </Grid>
                                <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
                                    {conversation.tiempopromediorespuestaasesor}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                                    <label className={classes.infoLabel}>
                                        <Trans i18nKey={langKeys.avgResponseTimeOfClient} />
                                    </label>
                                </Grid>
                                <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
                                    {conversation.tiempopromediorespuestapersona}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                                    <label className={classes.totalTime}>
                                        <Trans i18nKey={langKeys.totalTime} />
                                    </label>
                                </Grid>
                                <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
                                    <label className={classes.totalTime}>{conversation.totalduration}</label>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Divider orientation="horizontal" />
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                                    <label className={classes.infoLabel}>
                                        <Trans i18nKey={langKeys.closetype} />
                                    </label>
                                </Grid>
                                <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
                                    {conversation.closetype}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                                    <label className={classes.infoLabel}>
                                        <Trans i18nKey={langKeys.status} />
                                    </label>
                                </Grid>
                                <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
                                    {conversation.status}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </Collapse>
        </div>
    );
}

interface OpportunitiesTabProps {
    person: IPerson;
}

const OpportunitiesTab: FC<OpportunitiesTabProps> = ({ person }) => {
    const dispatch = useDispatch();
    const leads = useSelector(state => state.person.personLeadList);
    const { t } = useTranslation();
    const history = useHistory();

    const goToLead = (lead: Dictionary) => {
        history.push({ pathname: paths.CRM_EDIT_LEAD.resolve(lead.leadid), });
    }

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.opportunity),
                accessor: 'description',
            },
            {
                Header: t(langKeys.lastUpdate),
                accessor: 'changedate',
                type: 'date',
                sortType: 'datetime',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return row.changedate ? convertLocalDate(row.changedate).toLocaleString() : ""
                }
            },
            {
                Header: t(langKeys.phase),
                accessor: 'phase',
            },
            {
                Header: t(langKeys.priority),
                accessor: 'priority',
                type: "select",
                listSelectFilter: [{ key: t(langKeys.priority_low), value: "LOW" }, { key: t(langKeys.priority_medium), value: "MEDIUM" }, { key: t(langKeys.priority_high), value: "HIGH" }],
                Cell: (props: any) => {
                    const { priority } = props.cell.row.original;
                    return (
                        <Rating
                            name="simple-controlled"
                            max={3}
                            defaultValue={urgencyLevels.findIndex(x => x === priority)}
                            readOnly={true}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.status),
                accessor: 'status'
            },
            {
                Header: t(langKeys.tags),
                accessor: 'tags',
                Cell: (props: any) => {
                    const { tags } = props.cell.row.original;
                    if (!tags)
                        return null;
                    return tags.split(",").map((t: string, i: number) => (
                        <span key={`lead${i}`} style={{
                            backgroundColor: '#7721AD',
                            color: '#fff',
                            borderRadius: '20px',
                            padding: '2px 5px',
                            margin: '2px'
                        }}>{t}</span>
                    ))
                }
            },
            {
                Header: t(langKeys.comments),
                accessor: 'datenote',
                NoFilter: true,
                NoSort: true,
                Cell: (props: any) => {
                    const { datenote, leadnote, dateactivity, leadactivity } = props.cell.row.original;
                    return (
                        <div>
                            {datenote &&
                                <div>{t(langKeys.lastnote)} ({convertLocalDate(datenote).toLocaleString()}) {leadnote}</div>
                            }
                            {dateactivity &&
                                <div>{t(langKeys.nextprogramedactivity)} ({convertLocalDate(dateactivity).toLocaleString()}) {leadactivity}</div>
                            }
                        </div>
                    )
                }
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    useEffect(() => {
        dispatch(getLeadsByPerson(getOpportunitiesByPersonBody(person.personid)));
        return () => {
            dispatch(resetGetLeadsByPerson());
        };
    }, [dispatch, person]);

    return (
        <TableZyx
            columns={columns}
            filterGeneral={false}
            data={leads.data}
            download={false}
            loading={leads.loading}
            onClickRow={goToLead}
            register={false}
        />
    );
}