/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { Title } from 'components';
import { getPaginatedPerson, getPersonExport, exportExcel, templateMaker, uploadExcel, array_trimmer, convertLocalDate, getColumnsSel, personcommunicationchannelUpdateLockedArrayIns, personImportValidation, importPerson } from 'common/helpers';
import { Dictionary, IPerson, IPersonImport, IFetchData } from "@types";
import { Button } from '@material-ui/core';
import { WhatsappIcon } from 'icons';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useHistory, useLocation } from 'react-router';
import paths from 'common/constants/paths';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import ListAltIcon from '@material-ui/icons/ListAlt';
import { getPersonListPaginated, resetGetPersonListPaginated, getDomainsByTypename } from 'store/person/actions';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import { execute, resetAllMain, exportData } from 'store/main/actions';
import { FieldMultiSelect } from 'components';
import TablePaginated, { buildQueryFilters, useQueryParams } from 'components/fields/table-paginated';
import MailIcon from '@material-ui/icons/Mail';
import SmsIcon from '@material-ui/icons/Sms';
import { getLeadPhases, resetGetLeadPhases } from 'store/lead/actions';
import { CellProps } from 'react-table';
import { DialogSendTemplate } from './modals/DialogSendTemplate';
import { TemplateIcons } from './components/TemplateIcons';

const format = (datex: Date) => new Date(datex.setHours(10)).toISOString().substring(0, 10)

const selectionKey = 'personid';

const CountTicket: FC<{ label: string, count: string, color: string }> = ({ label, count, color }) => (
    <div style={{ position: 'relative' }}>
        <div style={{ color: color, padding: '3px 4px', whiteSpace: 'nowrap', fontSize: '12px' }}>{label}: <span style={{ fontWeight: 'bold' }}>{count}</span></div>
        <div style={{ backgroundColor: color, width: '100%', height: '24px', opacity: '0.1', position: 'absolute', top: 0, left: 0 }}></div>
    </div>
)

export const Person: FC = () => {
    const history = useHistory();
    const { t } = useTranslation();
    const location = useLocation();
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
    const [importData, setImportData] = useState<Dictionary>([]);
    const [openDialogTemplate, setOpenDialogTemplate] = useState(false)
    const [waitValidation, setWaitValidation] = useState(false);
    const [disableLockUnlockButtons, setDisableLockUnlockButtons] = useState({
        lock: true,
        unlock: true,
    });
    const [selectedRows, setSelectedRows] = useState<Dictionary>({});
    const [peopleSelected, setPeopleSelected] = useState<IPerson[]>([]);
    const [typeTemplate, setTypeTemplate] = useState<"HSM" | "SMS" | "MAIL">('MAIL');
    const [cleanSelected, setCleanSelected] = useState(false)

    const query = useMemo(() => new URLSearchParams(location.search), [location]);
    const params = useQueryParams(query, { ignore: ['channelTypes'] });

    const [filterChannelsType, setFilterChannelType] = useState(query.get('channelTypes') || '');

    const goToPersonDetail = (person: IPerson) => {
        history.push({
            pathname: paths.PERSON_DETAIL.resolve(person.personid),
            state: person,
        });
    }
    const columns = useMemo(() => ([
        {
            accessor: 'leadid',
            isComponent: true,
            minWidth: 60,
            width: '1%',
            Cell: (props: CellProps<Dictionary>) => {
                const person = props.cell.row.original as IPerson;
                return (
                    <TemplateIcons
                        sendHSM={person && person.phonewhatsapp ? (e) => {
                            e.stopPropagation();
                            setPeopleSelected([person]);
                            setOpenDialogTemplate(true);
                            setTypeTemplate("HSM");
                        } : undefined}
                        sendSMS={(e) => {
                            e.stopPropagation();
                            setPeopleSelected([person]);
                            setOpenDialogTemplate(true);
                            setTypeTemplate("SMS");
                        }}
                        sendMAIL={(e) => {
                            e.stopPropagation();
                            setPeopleSelected([person]);
                            setOpenDialogTemplate(true);
                            setTypeTemplate("MAIL");
                        }}
                    />
                    
                )
            }
        },
        {
            Header: t(langKeys.name),
            accessor: 'firstname',
        },
        {
            Header: t(langKeys.lastname),
            accessor: 'lastname',
        },
        {
            Header: t(langKeys.phone),
            accessor: 'phone',
        },
        {
            Header: t(langKeys.email),
            accessor: 'email',
        },
        {
            Header: t(langKeys.documenttype),
            accessor: 'documenttype',
        },
        {
            Header: t(langKeys.documentnumber),
            accessor: 'documentnumber',
        },
        {
            Header: t(langKeys.lead),
            accessor: 'phasejson',
            type: "select",
            listSelectFilter: [
                { key: t(langKeys.new), value: "0,New" },
                { key: t(langKeys.qualified), value: "1,Qualified" },
                { key: t(langKeys.proposition), value: "2,Proposition" },
                { key: t(langKeys.won), value: "3,Won" },
                { key: t(langKeys.lost), value: "4,Lost" },
            ],
            Cell: (props: any) => {
                const { row } = props.cell;                
                if (!row || !row.original) {
                    return null;
                }            
                const { phasejson } = row.original;            
                if (!phasejson) {
                    return null;
                }            
                return (
                    <div style={{ display: 'flex', gap: 4, flexDirection: 'column' }}>
                        {Object.entries(phasejson).sort(([aKey], [bKey]) => {
                            const aIndex = Number(aKey.split(',')[0]);
                            const bIndex = Number(bKey.split(',')[0]);
                            return aIndex - bIndex;
                        }).map(([key, value]) => (
                            <CountTicket
                                label={key.split(',')[1]}
                                key={key}
                                count={value + ""}
                                color="#55BD84"
                            />
                        ))}
                    </div>
                );
            }            
        },
        {
            Header: t(langKeys.persongroup),
            accessor: 'groups',
        },
        {
            Header: t(langKeys.personType),
            accessor: 'persontype',
        },
        {
            Header: t(langKeys.type),
            accessor: 'type',
        },
        {
            Header: t(langKeys.status),
            accessor: 'status',
            prefixTranslation: 'status_',
            Cell: (props: CellProps<Dictionary>) => {
                const { cell } = props;                
                if (!cell || !cell.row) {
                    return null;
                }            
                const { original } = cell.row;            
                if (!original) {
                    return null;
                }            
                const { status, locked } = original;
                if (locked) return (t(`status_BLOCKED`.toLowerCase()) || "").toUpperCase();
                return (t(`status_${status}`.toLowerCase()) || "").toUpperCase();
            }
            
        },
        {
            Header: t(langKeys.updatedby),
            accessor: 'changeby',
        },
        {
            Header: t(langKeys.updatedate),
            accessor: 'changedate',
        },
        {
            Header: `Id persona`,
            accessor: 'personid',
        },
    ]), [t, setPeopleSelected]);

    useEffect(() => {
        dispatch(getDomainsByTypename());
        dispatch(getLeadPhases(getColumnsSel(0, true)));

        return () => {
            dispatch(resetGetPersonListPaginated());
            dispatch(resetGetLeadPhases());
            dispatch(resetAllMain());
        };
    }, [])

    useEffect(() => {
        if (!personList.loading && !personList.error) {
            setPageCount(Math.ceil(personList.count / fetchDataAux.pageSize));
            settotalrow(personList.count);
        }
    }, [personList]);

    useEffect(() => {
        if(personList.loading) {
            setDisableLockUnlockButtons({
                lock: true,
                unlock: true
            })
        }else{
            if(Object.keys(selectedRows).length === 0){
                setDisableLockUnlockButtons({
                    lock: true,
                    unlock: true
                })
            }else{
                setDisableLockUnlockButtons({
                    lock: !peopleSelected.some(person => !person.locked),
                    unlock: false
                })
            }
        }
    }, [personList, peopleSelected]);

    const fetchData = ({ pageSize, pageIndex, filters, sorts, daterange }: IFetchData) => {
        setfetchDataAux({ pageSize, pageIndex, filters, sorts, daterange })
        dispatch(getPersonListPaginated(getPaginatedPerson({
            startdate: daterange?.startDate || format(new Date(new Date().setDate(1))),
            enddate: daterange?.endDate || format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)),
            skip: pageSize * pageIndex,
            take: pageSize,
            sorts,
            filters: filters,
            userids: '',
            channeltypes: filterChannelsType
        })));
    }

    const triggerExportData = ({ filters, sorts, daterange }: IFetchData) => {
        const columnsExport = columns.filter(x => !x.isComponent).map(x => ({
            key: x.accessor,
            alias: x.Header,
        }));
        dispatch(exportData(getPersonExport(
            {
                startdate: daterange.startDate!,
                enddate: daterange.endDate!,
                sorts,
                filters: filters,
                userids: '',
                personcommunicationchannels: filterChannelsType,
            }), "", "excel", false, columnsExport));
        dispatch(showBackdrop(true));
        setWaitExport(true);
    };

    useEffect(() => {
        if (waitExport) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(showBackdrop(false));
                setWaitExport(false);
                resExportData.url?.split(",").forEach(x => window.open(x, '_blank'))
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code || "error_unexpected_error", { module: t(langKeys.person).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
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
            domains.value?.personTypes.reduce((a, d) => ({ ...a, [d.domainvalue]: t(`type_personlevel_${d.domainvalue?.toLowerCase()}`) }), {}),
            domains.value?.personGenTypes.reduce((a, d) => ({ ...a, [d.domainvalue]: t(`type_persontype_${d.domaindesc?.toLowerCase()}`) }), {}),
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
            {},
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
            'displayname',
            'address',
            'healthprofessional',
            'referralchannel',
        ];
        exportExcel(t(langKeys.template), templateMaker(data, header));
    }

    const handleUpload = async (files: any) => {
        const file = files?.item(0);
        files = null
        if (file) {
            let excel: any = await uploadExcel(file, undefined);
            let data: IPersonImport[] = array_trimmer(excel);
            data = data.filter((f: IPersonImport) =>
                (f.documenttype === undefined || Object.keys(domains.value?.docTypes.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domainvalue }), {})).includes('' + f.documenttype))
                && (f.persontype === undefined || Object.keys(domains.value?.personTypes.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domaindesc }), {})).includes('' + f.persontype))
                && (f.type === undefined || Object.keys(domains.value?.personGenTypes.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domainvalue }), {})).includes('' + f.type))
                && (f.gender === undefined || Object.keys(domains.value?.genders.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domainvalue }), {})).includes('' + f.gender))
                && (f.educationlevel === undefined || Object.keys(domains.value?.educationLevels.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domainvalue }), {})).includes('' + f.educationlevel))
                && (f.civilstatus === undefined || Object.keys(domains.value?.civilStatuses.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domainvalue }), {})).includes('' + f.civilstatus))
                && (f.occupation === undefined || Object.keys(domains.value?.occupations.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domainvalue }), {})).includes('' + f.occupation))
                && (f.groups === undefined || Object.keys(domains.value?.groups.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domaindesc }), {})).includes('' + f.groups))
                && (f.email === undefined || (/\S+@\S+\.\S+/.test(f.email)))
                && (f.phone === undefined || (`${f.phone}`.startsWith("+51") ? `${f.phone}`.length === 12 : true))
                && (f.alternativephone === undefined || (f.alternativephone.startsWith("+51") ? f.alternativephone.length === 12 : true))
                && (f.documenttype === undefined || (f.documenttype === "DNI" && f.documentnumber?.length === 8) || (f.documenttype === "RUC" && f.documentnumber?.length === 11) || (f.documenttype === "CE" && f.documentnumber?.length <= 12))
            );
            if (data.length > 0) {
                let datavalidation = data.reduce((acc: any, x: any) => [...acc, { phone: x.phone, alternativephone: x.alternativephone, email: x.email, alternativeemail: x.alternativeemail }], [])
                let table: Dictionary = data.reduce((a: any, d: IPersonImport, i: number) => ({
                    ...a,
                    [`${d.firstname}_${d.lastname}_${i}`]: {
                        personid: 0,
                        firstname: d.firstname || null,
                        lastname: d.lastname || null,
                        documenttype: d.documenttype || "",
                        documentnumber: d.documentnumber || "",
                        persontype: d.persontype || null,
                        type: d.type || '',
                        phone: String(d.phone || ""),
                        alternativephone: String(d?.alternativephone || ""),
                        email: d.email || null,
                        alternativeemail: d.alternativeemail || null,
                        birthday: d.birthday || null,
                        gender: d.gender || null,
                        educationlevel: d.educationlevel || null,
                        civilstatus: d.civilstatus || null,
                        occupation: d.occupation || null,
                        address: d.address || "",
                        healthprofessional: d.healthprofessional || "",
                        referralchannel: d.referralchannel || "",
                        groups: d.groups || null,
                        status: 'ACTIVO',
                        personstatus: 'ACTIVO',
                        referringpersonid: 0,
                        geographicalarea: null,
                        age: null,
                        sex: null,
                        operation: 'INSERT',
                    }
                }), {});
                setImportData(table)

                const callback = () => {
                    dispatch(execute(personImportValidation({
                        table: JSON.stringify(datavalidation)
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
            else {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.no_records_valid) }));
            }
        }
    }

    useEffect(() => {
        if (waitValidation) {
            if (!executeResult.loading && !executeResult.error) {
                let phonesexisting: any[] = []
                let emailsexisting: any[] = []
                const callback = () => {
                    setWaitImport(true)
                    dispatch(showBackdrop(true));
                    dispatch(execute(importPerson(Object.values(importData))))
                }
                if (executeResult?.data[0]?.phone) phonesexisting = phonesexisting.concat(executeResult.data[0].phone.split(','))
                if (executeResult?.data[0]?.alternativephone) phonesexisting = phonesexisting.concat(executeResult.data[0].alternativephone.split(','))
                if (executeResult?.data[0]?.email) emailsexisting = emailsexisting.concat(executeResult.data[0].email.split(','))
                if (executeResult?.data[0]?.alternativeemail) emailsexisting = emailsexisting.concat(executeResult.data[0].alternativeemail.split(','))
                if (phonesexisting.length === 0 && emailsexisting.length === 0) {
                    callback()
                } else {
                    let warningmessage = ""
                    if (phonesexisting.length !== 0) {
                        warningmessage += ` ${t(langKeys.phone)}: ${phonesexisting.join(', ')}`
                    }
                    if (emailsexisting.length !== 0) {
                        warningmessage += ` ${t(langKeys.email)}: ${emailsexisting.join(', ')}`
                    }
                    dispatch(showBackdrop(false));
                    dispatch(manageConfirmation({
                        visible: true,
                        question: `${t(langKeys.personrepeatedwarning1)}${warningmessage}`,
                        callback: callback
                    }))
                }
                setWaitValidation(false);
            } else if (executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: "error" }))
                dispatch(showBackdrop(false));
                setWaitValidation(false);
            }
        }
    }, [executeResult, waitValidation]);

    const handleLock = (type: "LOCK" | "UNLOCK") => {
        const callback = () => {
            const data = peopleSelected.map(p => ({
                personid: p.personid,
                locked: type === "LOCK",
            }));
            dispatch(execute(personcommunicationchannelUpdateLockedArrayIns(data)));
            dispatch(showBackdrop(true));
            setWaitImport(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: type === "UNLOCK" ? t(langKeys.confirmation_person_unlock) : t(langKeys.confirmation_person_lock),
            callback
        }));
    }

    useEffect(() => {
        if (waitImport) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }))
                fetchData(fetchDataAux);
                dispatch(showBackdrop(false));
                setWaitImport(false);
                setCleanSelected(true)
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.quickreplies).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitImport(false);
            }
        }
    }, [executeResult, waitImport])

    useEffect(() => {
        if (!(Object.keys(selectedRows).length === 0 && peopleSelected.length === 0)) {
            setPeopleSelected(p => Object.keys(selectedRows).map(x => personList.data.find(y => y.personid === parseInt(x)) || p.find(y => y.personid === parseInt(x)) || {} as IPerson))
        }
    }, [selectedRows])

    return (
        <div style={{
            height: '100%', width: 'inherit',
            display: 'flex',
            flexDirection: 'column',
            flex: 1
        }}>

            <div style={{ display: 'flex', gap: 8, flexDirection: 'row', marginBottom: 12, marginTop: 4 }}>
                <div style={{ flexGrow: 1 }} >
                    <Title><Trans i18nKey={langKeys.person} count={2} /></Title>
                </div>
                <Button
                    variant="contained"
                    type="button"
                    color="primary"
                    disabled={disableLockUnlockButtons.lock}
                    startIcon={<LockIcon color="secondary" />}
                    onClick={() => handleLock("LOCK")}
                >
                    <Trans i18nKey={langKeys.lock} />
                </Button>
                <Button
                    variant="contained"
                    type="button"
                    color="primary"
                    disabled={disableLockUnlockButtons.unlock}
                    startIcon={<LockOpenIcon color="secondary" />}
                    onClick={() => handleLock("UNLOCK")}
                >
                    <Trans i18nKey={langKeys.unlock} />
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={personList.loading || Object.keys(selectedRows).length === 0}
                    startIcon={<WhatsappIcon width={24} style={{ fill: '#FFF' }} />}
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
                initialSelectedRows={selectedRows}
                onClickRow={goToPersonDetail}
                cleanSelection={cleanSelected}
                setCleanSelection={setCleanSelected}
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
                onFilterChange={f => {
                    const filterParams = buildQueryFilters(f);
                    if (filterChannelsType !== '') filterParams.append('channelTypes', filterChannelsType);
                    history.push({ search: filterParams.toString() });
                }}
                initialEndDate={params.endDate}
                initialStartDate={params.startDate}
                initialFilters={params.filters}
                initialPageIndex={params.page}
                FiltersElement={useMemo(() => (
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
                        valueDefault={filterChannelsType}
                    />
                ), [filterChannelsType, domains, t])}
                autotrigger={!(params.startDate === 0 && params.endDate === 0 && params.page === 0)}
            />
            <DialogSendTemplate
                openModal={openDialogTemplate}
                setOpenModal={setOpenDialogTemplate}
                persons={peopleSelected}
                type={typeTemplate}
                onSubmitTrigger={() => {
                    setCleanSelected(true)
                }}
            />
        </div>
    );
}

export default Person;