import React, { FC, useEffect, useState } from 'react';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SaveIcon from '@material-ui/icons/Save';
import TableZyx from '../components/fields/table-simple';
import Typography from '@material-ui/core/Typography';
import { cleanMemoryTable, setMemoryTable } from 'store/main/actions';
import { Box, CircularProgress } from '@material-ui/core';
import { Dictionary, MultiData } from '@types';
import { FieldEdit, FieldEditArray, FieldEditMulti, FieldSelect, FieldView, TemplateBreadcrumbs, TemplateSwitchArray, TemplateSwitchYesNo, TitleDetail } from 'components';
import { getDistinctPropertySel, getPropertySel, getValuesFromDomain, insProperty, getCorpSel, getOrgSel, getChannelSel, getChatflowBlockActiveSel } from 'common/helpers';
import { getCollection, getCollectionAux, getMultiCollection, getMultiCollectionAux, resetMain, resetMainAux, execute, getCollectionAux2, resetMainAux2, getMultiCollectionAux2 } from 'store/main/actions';
import { langKeys } from 'lang/keys';
import { makeStyles } from '@material-ui/core/styles';
import { showBackdrop, showSnackbar, manageConfirmation } from 'store/popus/actions';
import { useDispatch } from 'react-redux';
import { useFieldArray, useForm } from 'react-hook-form';
import { useSelector } from 'hooks';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        background: '#fff',
        marginTop: theme.spacing(2),
        padding: theme.spacing(2)
    },
    button: {
        fontSize: '14px',
        fontWeight: 500,
        padding: 12,
        textTransform: 'initial'
    },
    containerHeader: {
        display: 'block',
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        }
    },
    mb2: {
        marginBottom: theme.spacing(4),
    },
    title: {
        color: theme.palette.text.primary,
        fontSize: '22px',
        fontWeight: 'bold',
        height: '48px',
        lineHeight: '48px'
    },
    flexGrow: {
        flex: 1
    },
    switchLabel: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'flex-start'
    },
}));

const IDPROPERTIES = 'IDPROPERTIES';

const Properties: FC = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [categoryFilter, setCategoryFilter] = useState('');
    const [levelFilter, setLevelFilter] = useState('');
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [viewSelected, setViewSelected] = useState('view-1');
    const [waitSave, setWaitSave] = useState(false);
    const [dataProperties, setDataProperties] = useState<Dictionary[]>([])
    const [generalFilter, setGeneralFilter] = useState("");
    const memoryTable = useSelector(state => state.main.memoryTable);
    const executeResult = useSelector(state => state.main.execute);
    const mainResult = useSelector(state => state.main.mainData);
    const multiResult = useSelector(state => state.main.multiData);
    const user = useSelector(state => state.login.validateToken.user);

    const arrayBread = [
        { id: "view-1", name: t(langKeys.property_plural) },
    ];
    function redirectFunc(view: string) {
        setViewSelected(view)
    }

    useEffect(() => {
        if (!mainResult.loading && !mainResult.error) {
            setDataProperties(mainResult.data.map(x => ({
                ...x,
                description: t(x.description)
            })))
        }
    }, [mainResult])

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.name),
                accessor: 'propertyname'
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',               
            },
            {
                Header: t(langKeys.category),
                accessor: 'category'
            },
            {
                Header: t(langKeys.level),
                accessor: 'level'
            },
            {
                Header: t(langKeys.status),
                accessor: 'status'
            },
        ],
        []
    );

    var fetchData = () => dispatch(getCollection(getDistinctPropertySel(categoryFilter, levelFilter)));

    const handleEdit = (row: Dictionary) => {
        setViewSelected('view-2');
        setRowSelected({ row, edit: true });
    }

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    }

    useEffect(() => {

        fetchData();
    }, [categoryFilter, levelFilter]);

    useEffect(() => {
        dispatch(getMultiCollection([
            getValuesFromDomain('ESTADOGENERICO'),
            getCorpSel(0),
            getOrgSel(0),
        ]));
        dispatch(setMemoryTable({
            id: IDPROPERTIES
        }))
        return () => {
            dispatch(cleanMemoryTable());
            dispatch(resetMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || 'error_unexpected_error', { module: t(langKeys.property).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])


    if (viewSelected === 'view-1') {
        if (mainResult.error) {
            return <h1>ERROR</h1>;
        }
        return (
            <div style={{ width: '100%' }}>
                <div style={{ position: 'relative' }}>
                    <Box className={classes.containerHeader} justifyContent='space-between' alignItems='center' mb={1}>
                        <span className={classes.title}>{t(langKeys.property_plural, { count: 2 })}</span>
                    </Box>
                    <div style={{ position: 'absolute', display: 'flex', gap: 16 }}>
                        <FieldSelect
                            label={t(langKeys.level)}
                            style={{ width: 250 }}
                            valueDefault={levelFilter}
                            variant="outlined"
                            onChange={(value) => setLevelFilter((value?.levelvalue || ''))}
                            data={[
                                { leveldesc: t(langKeys.corporation), levelvalue: 'CORPORATION' },
                                { leveldesc: t(langKeys.organization), levelvalue: 'ORGANIZATION' },
                                { leveldesc: t(langKeys.channel), levelvalue: 'CHANNEL' },
                                { leveldesc: t(langKeys.group), levelvalue: 'GROUP' }
                            ]}
                            optionDesc='leveldesc'
                            optionValue='levelvalue'
                        />
                        <FieldSelect
                            label={t(langKeys.category)}
                            style={{ width: 250 }}
                            variant="outlined"
                            valueDefault={categoryFilter}
                            onChange={(value) => setCategoryFilter((value?.categoryvalue || ''))}
                            data={[
                                { categorydesc: t(langKeys.closure), categoryvalue: 'CLOSURE' },
                                { categorydesc: t(langKeys.message), categoryvalue: 'MESSAGE' },
                                { categorydesc: t(langKeys.system), categoryvalue: 'SYSTEM' },
                                { categorydesc: t(langKeys.indicators), categoryvalue: 'INDICATORS' },
                                { categorydesc: t(langKeys.quiz), categoryvalue: 'QUIZ' },
                                { categorydesc: t(langKeys.labels), categoryvalue: 'LABELS' }
                            ]}
                            optionDesc='categorydesc'
                            optionValue='categoryvalue'
                        />
                    </div>
                </div>
                <TableZyx
                    data={dataProperties}
                    download={true}
                    columns={columns}
                    filterGeneral={false}
                    onClickRow={handleEdit}
                    loading={mainResult.loading}
                    register={(user?.roledesc ?? "").split(",").some(v => ['SUPERADMIN'].includes(v))}
                    handleRegister={handleRegister}
                    defaultGlobalFilter={generalFilter}
                    setOutsideGeneralFilter={setGeneralFilter}
                    pageSizeDefault={IDPROPERTIES === memoryTable.id ? memoryTable.pageSize === -1 ? 20 : memoryTable.pageSize : 20}
                    initialPageIndex={IDPROPERTIES === memoryTable.id ? memoryTable.page === -1 ? 0 : memoryTable.page : 0}
                    initialStateFilter={IDPROPERTIES === memoryTable.id ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value })) : undefined}
                />
            </div>
        )
    }
    else if (viewSelected === 'view-2') {
        return (
            <DetailProperty
                data={rowSelected}
                fetchData={fetchData}
                multiData={multiResult.data}
                setViewSelected={redirectFunc}
                arrayBread={arrayBread}
            />
        )
    } else {
        return null;
    }
}

interface DetailPropertyProps {
    data: RowSelected;
    fetchData: () => void;
    multiData: MultiData[];
    setViewSelected: (view: string) => void;
    arrayBread: any;
}

const DetailProperty: React.FC<DetailPropertyProps> = ({ data: { row, edit }, fetchData, multiData, setViewSelected, arrayBread }) => {
    const user = useSelector(state => state.login.validateToken.user);
    const [domainTable, setDomainTable] = useState<{ loading: boolean; data: Dictionary[] }>({ loading: false, data: [] });
    const [extraData, setExtraData] = useState<{ loading:boolean, blockInfo: Dictionary[]}>({ loading: false, blockInfo: [] })
    const [waitSave, setWaitSave] = useState(false);
    const [mainaux2loading, setmainaux2loading] = useState(false);
    const [multi2loading, setmulti2loading] = useState(false);
    const [level, setlevel] = useState(row?.level || "");
    const corpList = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const [orgList, setorgList] = useState<any>([]);
    const [channelList, setchannelList] = useState<any>([]);
    const [groupList, setgroupList] = useState<any>([]);
    const allowEdition = !((user?.roledesc ?? "").split(",").some(v => ['SUPERADMIN', 'ADMINISTRADOR', 'ADMINISTRADOR P', 'SUPERVISOR', 'SUPERADMINISTRADOR SOCIOS'].includes(v)))
    const isView = (!allowEdition && row !== null);

    const detailResult = useSelector(state => state.main.mainAux);
    const detailResult2 = useSelector(state => state.main.mainAux2);
    const executeRes = useSelector(state => state.main.execute);
    const responseFromSelect = useSelector(state => state.main.multiDataAux);
    const responseFromSelect2 = useSelector(state => state.main.multiDataAux2);

    const classes = useStyles();

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const { control, register, handleSubmit, trigger, setValue, getValues, watch, formState: { errors } } = useForm<any>({
        defaultValues: {
            level: row?.level || "",
            corpid: row?.corpid || user?.corpid,
            table: [],
            newcorpid: 0,
            neworgid: 0,
            newcommunicationchannelid: 0,
            id: 0,
            propertyname: '',
            propertyvalue: '',
            description: '',
            status: 'ACTIVO',
            type: 'NINGUNO',
            category: '',
            domainname: '',
            group: '',
            newlevel: '',
            operation: 'INSERT'
        }
    });

    React.useEffect(() => {
        register('newcorpid', { validate: (value) => (isView || (value && value > 0)) || t(langKeys.field_required) });
        register('neworgid', { validate: (value) => (isView || (getValues('newlevel') !== 'ORGANIZATION' || (value && value > 0))) || t(langKeys.field_required) });
        register('newcommunicationchannelid', { validate: (value) => (isView || (getValues('newlevel') !== 'CHANNEL' || (value && value > 0))) || t(langKeys.field_required) });
        register('propertyname', { validate: (value) => (isView || (value && value.length)) || t(langKeys.field_required) });
        register('propertyvalue');
        register('description', { validate: (value) => (isView || (value && value.length)) || t(langKeys.field_required) });
        register('category', { validate: (value) => (isView || (value && value.length)) || t(langKeys.field_required) });
        register('domainname');
        register('group', { validate: (value) => (isView || (getValues('newlevel') !== 'GROUP' || (value && value.length))) || t(langKeys.field_required) });
        register('newlevel', { validate: (value) => (isView || (value && value.length)) || t(langKeys.field_required) });
    }, [edit, register]);

    const { fields, append: fieldsAppend, update: fieldsUpdate } = useFieldArray({
        control,
        name: 'table',
    });

    const fetchDetailData = (corpid: number, propertyname: string, description: string, category: string, level: string) => dispatch(getCollectionAux(getPropertySel(corpid, propertyname, description, category, level, 0)))

    const onSubmit = handleSubmit((data) => {
        if (isView) {
            if (data.table) {
                const callback = () => {
                    dispatch(execute({
                        header: null,
                        detail: data.table.map((x: any) => insProperty({
                            ...x,
                            operation: 'UPDATE',
                            id: x.propertyid,
                            orgid: x.orgid
                        }))
                    }, true));
                    dispatch(showBackdrop(true));
                    setWaitSave(true);
                }

                dispatch(manageConfirmation({
                    visible: true,
                    question: t(langKeys.confirmation_save),
                    callback
                }))
            }
        }
        else {
            const callback = () => {
                dispatch(execute(insProperty({
                    orgid: data.neworgid,
                    communicationchannelid: data.newcommunicationchannelid,
                    id: data.id,
                    propertyname: data.propertyname,
                    propertyvalue: data.propertyvalue,
                    description: data.description,
                    status: data.status,
                    type: data.type,
                    category: data.category,
                    domainname: data.domainname,
                    group: data.group,
                    level: data.newlevel,
                    operation: data.operation,
                    corpid: data.newcorpid,
                })));
                dispatch(showBackdrop(true));
                setWaitSave(true);
            }

            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback
            }))
        }
    });

    const onBlurFieldValue = (index: any, param: string, value: any) => {
        fieldsUpdate(index, { ...fields[index], [param]: value });
    }

    const onChangeSelectValue = (index: any, param: string, value: any) => {
        fieldsUpdate(index, { ...fields[index], [param]: value });
    }

    const onChangeSwitchValue = (index: any, param: string, value: any) => {
        fieldsUpdate(index, { ...fields[index], [param]: (value ? '1' : '0') });
    }

    useEffect(() => {
        setmainaux2loading(true);
        dispatch(getCollectionAux2(getOrgSel(0, row?.corpid || user?.corpid)))
        if (row?.corpid) {
            fetchDetailData(row?.corpid, row?.propertyname, row?.description, row?.category, row?.level);
        }
        return () => {
            dispatch(resetMainAux());
            dispatch(resetMainAux2());
        };
    }, []);
    useEffect(() => {
        if (mainaux2loading) {
            if (!detailResult2.loading) {
                setmainaux2loading(false)
                setorgList(detailResult2.data)
            }
        }
    }, [detailResult2]);
    useEffect(() => {
        if (multi2loading) {
            if (!responseFromSelect2.loading) {
                setchannelList(responseFromSelect2.data[0] && responseFromSelect2.data[0].success ? responseFromSelect2.data[0].data : [])
                setgroupList(responseFromSelect2.data[1] && responseFromSelect2.data[1].success ? responseFromSelect2.data[1].data : [])
                setmulti2loading(false)
            }
        }
    }, [responseFromSelect2]);

    useEffect(() => {
        if (!detailResult.loading && !detailResult.error) {
            fieldsAppend(detailResult.data);

            if (detailResult.data) {
                if (detailResult.data instanceof Array) {
                    if (detailResult.data.length > 0) {
                        if (detailResult.data[0].inputtype === 'DOMAIN') {
                            setDomainTable({ loading: true, data: [] });
                            dispatch(getMultiCollectionAux([
                                getValuesFromDomain(detailResult.data[0].domainname, null, detailResult.data[0].orgid)
                            ]))
                        }
                        if (detailResult.data[0].config && detailResult.data[0].config.type === 'redirect-flow-block') {
                            setExtraData((prevValue) => ({ ...prevValue, loading: true }))
                            dispatch(getMultiCollectionAux([
                                getChatflowBlockActiveSel()
                            ]))
                        }
                    }
                }
            }
        }
    }, [detailResult]);

    useEffect(() => {
        const indexDomainTable = responseFromSelect.data.findIndex((x: MultiData) => x.key === ('UFN_DOMAIN_LST_VALORES'));
        const indexBlockInfo = responseFromSelect.data.findIndex((x: MultiData) => x.key === ('UFN_CHATFLOW_BLOCK_ACTIVE_SEL'));

        if (indexDomainTable > -1) {
            setDomainTable({ loading: false, data: responseFromSelect.data[indexDomainTable] && responseFromSelect.data[indexDomainTable].success ? responseFromSelect.data[indexDomainTable].data : [] });
        }

        if (indexBlockInfo > -1) {
            setExtraData((prevValue) => ({ ...prevValue, loading: false, blockInfo: responseFromSelect.data[indexBlockInfo] && responseFromSelect.data[indexBlockInfo].success ? responseFromSelect.data[indexBlockInfo].data : [] }))
        }

    }, [responseFromSelect]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData();
                dispatch(showBackdrop(false));
                setViewSelected('view-1')
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || 'error_unexpected_error', { module: t(langKeys.property).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeRes, waitSave])

    function corpChange(corpid: any) {
        //setorgList(unfilteredOrgs.filter(x=>x.corpid===corpid)); 
        setmainaux2loading(true);
        dispatch(getCollectionAux2(getOrgSel(0, corpid)))
        setValue("corpid", corpid)
    }
    function changeOrg(value: any) {
        setmulti2loading(true)
        dispatch(getMultiCollectionAux2([
            getChannelSel(0, value?.orgid, value?.corpid),
            getValuesFromDomain('GRUPOS', "tst", value?.orgid, value?.corpid),
        ]))
        setValue('orgid', value?.orgid || 0)
    }

    return (
        <div style={{ width: '100%' }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={[...arrayBread, { id: 'view-2', name: `${t(langKeys.property)} ${t(langKeys.detail)}` }]}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={row ? `${row.propertyname}` : t(langKeys.newproperty)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant='contained'
                            type='button'
                            color='primary'
                            startIcon={<ClearIcon color='secondary' />}
                            style={{ backgroundColor: '#FB5F5F' }}
                            onClick={() => setViewSelected('view-1')}>
                            {t(langKeys.back)}
                        </Button>
                        <Button
                            className={classes.button}
                            variant='contained'
                            color='primary'
                            type='submit'
                            startIcon={<SaveIcon color='secondary' />}
                            style={{ backgroundColor: '#55BD84' }}>
                            {t(langKeys.save)}
                        </Button>
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className='row-zyx'>
                        <FieldSelect
                            label={t(langKeys.corporation)}
                            className="col-6"
                            valueDefault={isView ? getValues("corpid") : getValues("newcorpid")}
                            onChange={(value) => { corpChange(value?.corpid || 0); setValue('newcorpid', value?.corpid || 0) }}
                            error={errors?.newcorpid?.message}
                            data={corpList}
                            disabled={isView}
                            optionDesc="description"
                            optionValue="corpid"
                        />
                        <FieldEdit
                            label={t(langKeys.name)}
                            className='col-6'
                            valueDefault={isView ? (row?.propertyname || '') : getValues("propertyname")}
                            error={errors?.propertyname?.message}
                            onChange={(value) => setValue('propertyname', value)}
                            disabled={isView}
                        />
                    </div>
                    <div className='row-zyx'>
                        <FieldEdit
                            label={t(langKeys.description)}
                            className='col-6'
                            valueDefault={isView ? (row?.description || '') : getValues("description")}
                            error={errors?.description?.message}
                            onChange={(value) => setValue('description', value)}
                            disabled={isView}
                        />
                        <FieldSelect
                            label={t(langKeys.category)}
                            className="col-6"
                            valueDefault={isView ? (row?.category || '') : getValues("category")}
                            onChange={(value) => setValue('category', value?.categoryvalue)}
                            error={errors?.category?.message}
                            data={[
                                { categorydesc: t(langKeys.closure), categoryvalue: 'CLOSURE' },
                                { categorydesc: t(langKeys.message), categoryvalue: 'MESSAGE' },
                                { categorydesc: t(langKeys.system), categoryvalue: 'SYSTEM' },
                                { categorydesc: t(langKeys.indicators), categoryvalue: 'INDICATORS' },
                                { categorydesc: t(langKeys.quiz), categoryvalue: 'QUIZ' },
                                { categorydesc: t(langKeys.labels), categoryvalue: 'LABELS' }
                            ]}
                            disabled={isView}
                            optionDesc="categorydesc"
                            optionValue="categoryvalue"
                        />
                    </div>
                    <div className='row-zyx'>
                        <FieldSelect
                            label={t(langKeys.level)}
                            className="col-6"
                            valueDefault={isView ? getValues('level') : getValues('newlevel')}
                            onChange={(value) => {
                                setlevel(value?.levelvalue || "");
                                setValue('level', value?.levelvalue);
                                setValue('newlevel', value?.levelvalue);
                            }}
                            error={errors?.newlevel?.message}
                            data={[
                                { leveldesc: t(langKeys.corporation), levelvalue: 'CORPORATION' },
                                { leveldesc: t(langKeys.organization), levelvalue: 'ORGANIZATION' },
                                { leveldesc: t(langKeys.channel), levelvalue: 'CHANNEL' },
                                { leveldesc: t(langKeys.group), levelvalue: 'GROUP' }
                            ]}
                            disabled={isView}
                            optionDesc="leveldesc"
                            optionValue="levelvalue"
                        />
                        {
                            !isView ?
                                <FieldEdit
                                    label={t(langKeys.value)}
                                    className='col-6'
                                    valueDefault={getValues("propertyvalue")}
                                    error={errors?.propertyvalue?.message}
                                    onChange={(value) => setValue('propertyvalue', value)}
                                    disabled={allowEdition}
                                /> : null
                        }
                    </div>
                    {
                        !isView ?
                            <div className='row-zyx'>
                                {(level !== "" && level !== "CORPORATION") && <FieldSelect
                                    label={t(langKeys.organization)}
                                    className="col-6"
                                    valueDefault={getValues("neworgid")}
                                    onChange={(value) => { changeOrg(value); setValue("neworgid", value?.orgid || 0) }}
                                    error={errors?.neworgid?.message}
                                    data={orgList}
                                    loading={detailResult2.loading}
                                    disabled={allowEdition}
                                    optionDesc="orgdesc"
                                    optionValue="orgid"
                                />}
                                {level === "CHANNEL" && <FieldSelect
                                    label={t(langKeys.channel)}
                                    className="col-6"
                                    valueDefault={getValues("newcommunicationchannelid")}
                                    onChange={(value) => setValue('newcommunicationchannelid', value?.communicationchannelid)}
                                    error={errors?.newcommunicationchannelid?.message}
                                    data={channelList}
                                    disabled={allowEdition}
                                    optionDesc="communicationchanneldesc"
                                    optionValue="communicationchannelid"
                                />}
                                {level === "GROUP" && <FieldSelect
                                    label={t(langKeys.group_plural)}
                                    className="col-6"
                                    valueDefault={getValues("group")}
                                    onChange={(value) => setValue('group', value?.domainvalue)}
                                    error={errors?.group?.message}
                                    data={groupList}
                                    disabled={allowEdition}
                                    optionDesc="domaindesc"
                                    optionValue="domainvalue"
                                />}
                            </div>
                            : null
                    }
                </div>

                <div style={{ marginTop: 12 }}>
                    {detailResult.loading ? (
                        <div style={{ width: '100%', height: 500, display: 'grid', placeItems: 'center' }} >
                            <CircularProgress />
                        </div>
                    ) : fields.map((item, index) => (
                        <DetailNivelProperty
                            data={{ row: item, edit }}
                            index={index}
                            key={`detail${index}`}
                            multiData={multiData}
                            fields={fields}
                            control={control}
                            register={register}
                            trigger={trigger}
                            errors={errors}
                            setValue={setValue}
                            onBlurFieldValue={onBlurFieldValue}
                            onChangeSelectValue={onChangeSelectValue}
                            onChangeSwitchValue={onChangeSwitchValue}
                            domainTable={domainTable}
                            extraData={extraData}
                            watch={watch}
                        />
                    ))}
                </div>
            </form>
        </div>
    );
}

interface ModalProps {
    data: RowSelected;
    index: number;
    multiData: MultiData[];
    fields: Dictionary[],
    openModal?: boolean;
    setOpenModal?: (open: boolean) => void;
    control: any;
    register: (...param: any) => any;
    trigger: (...param: any) => any;
    errors: any;
    setValue: (...param: any) => any
    onBlurFieldValue: (index: any, param: string, value: any) => void;
    onChangeSelectValue: (index: any, param: string, value: any) => void;
    onChangeSwitchValue: (index: any, param: string, value: any) => void;
    domainTable: any;
    extraData: any;
    watch: any;
}

interface RowSelected {
    edit: boolean,
    row: Dictionary | null
}

const DetailNivelProperty: React.FC<ModalProps> = ({ data: { row, edit }, index, multiData, fields, onChangeSelectValue, register, errors, setValue, domainTable, extraData, watch }) => {
    const [fieldValue, setFieldValue] = useState(null);
    const [comboStep, setComboStep] = useState('NONE');
    const [comboValue, setComboValue] = useState<any>(null);
    const [blockFiltered, setBlockFiltered] = useState<Dictionary[]>([])

    const classes = useStyles();

    const { t } = useTranslation();

    const dispatch = useDispatch();

    var valueInput = null;

    useEffect(() => {
        if (!extraData.loading && extraData.blockInfo.length > 0) {
            handleFilter(row?.config?.flowid)
        }
    }, [extraData]);
    
    if (row?.config) {
        const { config } = watch(`table.${index}.config.enable`)
    }

    const handleFilter = (value: string) => {
        const flow = extraData.blockInfo.find((item: Dictionary) => item.chatblockid === value)
        const blocks = JSON.parse(flow?.blockgroup || '[]')
        const allBlocks = blocks.flatMap(group => group.blocks.map(block => ({ id: block.id, title: block.title })));
        setBlockFiltered(allBlocks)
    }
    

    if (row) {
        switch (row?.inputtype) {
            case 'BOOL':
                if (edit) {
                    valueInput =
                        <TemplateSwitchArray
                            tooltip={{ true: row?.tooltipenable, false: row?.tooltipdisable }}
                            className={classes.mb2}
                            error={errors?.table?.[index]?.propertyvalue?.message}
                            /*fregister={{
                                ...register(`table.${index}.propertyvalue`, {
                                    validate: {
                                        validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                    }
                                })
                            }}*/
                            style={{ marginBottom: 0 }}
                            label={t(langKeys.value)}
                            onChange={(value) => setValue(`table.${index}.propertyvalue`, (value ? '1' : '0'))}
                            defaultValue={row ? (row.propertyvalue === '1' ? row.propertyvalue : false) : false}
                        />
                }
                else {
                    valueInput =
                        <FieldView
                            className={classes.mb2}
                            label={t(langKeys.value)}
                            value={row ? (row.propertyvalue === '1' ? t(langKeys.affirmative) : t(langKeys.negative)) : t(langKeys.negative)}
                        />
                }
                break;

            case 'DOMAIN':
                if (edit) {
                    valueInput =
                        <FieldSelect
                            className={classes.mb2}
                            data={domainTable.data}
                            error={errors?.table?.[index]?.propertyvalue?.message}
                            /*fregister={{
                                ...register(`table.${index}.propertyvalue`, {
                                    validate: {
                                        validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                    }
                                })
                            }}*/
                            label={t(langKeys.value)}
                            loading={domainTable.loading}
                            onChange={(value) => onChangeSelectValue(index, 'propertyvalue', value ? value.domainvalue : '')}
                            optionDesc='domaindesc'
                            optionValue='domainvalue'
                            valueDefault={row?.propertyvalue || ''}
                        />
                }
                else {
                    valueInput =
                        <FieldView
                            className={classes.mb2}
                            label={t(langKeys.value)}
                            value={row ? row.propertyvalue : ''}
                        />
                }
                break;

            case 'NUMBER':
                if (edit) {
                    valueInput =
                        <FieldEditArray
                            className={classes.mb2}
                            error={errors?.table?.[index]?.propertyvalue?.message}
                            /*fregister={{
                                ...register(`table.${index}.propertyvalue`, {
                                    validate: {
                                        value: (value: any) => (value && value.length) || t(langKeys.field_required)
                                    }
                                })
                            }}*/
                            inputProps={{ step: 'any', min: 0 }}
                            label={t(langKeys.value)}
                            onChange={(value) => setValue(`table.${index}.propertyvalue`, value)}
                            type='number'
                            valueDefault={row ? (row.propertyvalue || '') : ''}
                        />
                }
                else {
                    valueInput =
                        <FieldView
                            className={classes.mb2}
                            label={t(langKeys.value)}
                            value={row?.propertyvalue || ''}
                        />
                }
                break;

            case null:
            case '':
            case 'TEXT':
                if (edit) {
                    if (!row.config) {
                        valueInput =
                            <FieldEditMulti
                                error={errors?.table?.[index]?.propertyvalue?.message}
                                /*fregister={{
                                    ...register(`table.${index}.propertyvalue`, {
                                        validate: {
                                            value: (value: any) => (value && value.length) || t(langKeys.field_required)
                                        }
                                    })
                                }}*/
                                rows={1}
                                label={t(langKeys.value)}
                                onChange={(value) => setValue(`table.${index}.propertyvalue`, value)}
                                valueDefault={row ? (row.propertyvalue || '') : ''}
                            />
                    } else if(row.config.type === 'redirect-flow-block') {
                        valueInput = <div>
                            <FieldEditMulti
                                error={errors?.table?.[index]?.propertyvalue?.message}
                                /*fregister={{
                                    ...register(`table.${index}.propertyvalue`, {
                                        validate: {
                                            value: (value: any) => (value && value.length) || t(langKeys.field_required)
                                        }
                                    })
                                }}*/
                                rows={1}
                                label={t(langKeys.value)}
                                onChange={(value) => setValue(`table.${index}.propertyvalue`, value)}
                                valueDefault={row ? (row.propertyvalue || '') : ''}
                                disabled={row?.config?.enable || false}
                            />
                            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem'}}>
                                <div>
                                    <TemplateSwitchYesNo
                                        label={t(langKeys.activate_derivation_direction)}
                                        className={classes.switchLabel}
                                        valueDefault={row?.config?.enable || false}
                                        helperText={t(langKeys.activate_derivation_direction_tooltip)}
                                        onChange={(value) => {
                                            setValue(`table.${index}.config.enable`, value);
                                        }}
                                    />
                                </div>
                                
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                                    <label htmlFor="">{t(langKeys.flow)}</label>
                                    <FieldSelect
                                        className={classes.flexGrow}
                                        data={extraData.blockInfo}
                                        error={errors?.table?.[index]?.config?.flowid?.message}
                                        disabled={!row?.config?.enable || false}
                                        fregister={{
                                            ...register(`table.${index}.config.flowid`, {
                                                validate: {
                                                    validate: (value: any) => {
                                                        if (row?.config?.enable) return (value && value.length) || t(langKeys.field_required)
                                                        return true
                                                    },
                                                }
                                            })
                                        }}
                                        loading={extraData.loading}
                                        onChange={(value) => {
                                            setValue(`table.${index}.config.flowid`, value.chatblockid)
                                            handleFilter(value.chatblockid)
                                        }}
                                        optionDesc='title'
                                        optionValue='chatblockid'
                                        valueDefault={row?.config.flowid || ''}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                                    <label htmlFor="">{t(langKeys.app_block)}</label>
                                    <FieldSelect
                                        className={classes.flexGrow}
                                        data={blockFiltered}
                                        error={errors?.table?.[index]?.config?.blockid?.message}
                                        disabled={!row?.config?.enable || false}
                                        fregister={{
                                            ...register(`table.${index}.config.blockid`, {
                                                validate: {
                                                    validate: (value: any) => {
                                                        if (row?.config?.enable) return (value && value.length) || t(langKeys.field_required)
                                                        return true
                                                    },
                                                }
                                            })
                                        }}
                                        loading={extraData.loading}
                                        onChange={(value) => setValue(`table.${index}.config.blockid`, value.id)}
                                        optionDesc='title'
                                        optionValue='id'
                                        valueDefault={row?.config.blockid || ''}
                                    />
                                </div>
                            </div>
                        </div>
                    }
                }
                else {
                    valueInput =
                        <FieldView
                            className={classes.mb2}
                            label={t(langKeys.value)}
                            value={row?.propertyvalue || ''}
                        />
                }
                break;

            case 'TIME':
                if (edit) {
                    valueInput =
                        <FieldEdit
                            type='time'
                            label={t(langKeys.value)}
                            error={errors?.table?.[index]?.propertyvalue?.message}
                            className={classes.mb2}
                            onChange={(value) => setValue(`table.${index}.propertyvalue`, value)}
                            valueDefault={row ? (row.propertyvalue || '') : ''}
                        />
                }
                else {
                    valueInput =
                        <FieldView
                            className={classes.mb2}
                            label={t(langKeys.value)}
                            value={row?.propertyvalue || ''}
                        />
                }
                break;
        }
    }

    React.useEffect(() => {
        switch (comboStep) {
            case 'ORGDESC':
                setComboStep('CHANNEL');
                onChangeSelectValue(index, 'orgdesc', fieldValue ? fieldValue : '');

                if (comboValue) {
                    if (row?.level === 'GROUP') {
                        dispatch(getMultiCollectionAux([getValuesFromDomain('GRUPOS', ('GRUPO' + (index + 1)), comboValue.orgid)]));
                    }
                }

                setFieldValue(null);
                setComboValue(null);
                break;
        }
    }, [fields]);

    return (
        <Accordion expanded={!row ? true : undefined} style={{ marginBottom: '8px' }}>
            <AccordionSummary
                aria-controls='panel1a-content'
                expandIcon={<ExpandMoreIcon />}
                id='panel1a-header'
            >
                <Typography>{`${row?.level === 'CORPORATION' ? row?.corpdesc : ''}${row?.level === 'ORGANIZATION' ? row?.orgdesc : ''}${row?.level === 'CHANNEL' ? row?.communicationchanneldesc : ''}${row?.level === 'GROUP' ? row?.group : ''}`}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <div style={{ width: '100%' }}>
                    <div className='row-zyx mb-0'>
                        <div className='col-6 mb-0'>
                            {edit ?
                                <FieldEdit
                                    className={classes.mb2}
                                    disabled={true}
                                    label={t(langKeys.corporation)}
                                    valueDefault={row ? (row.corpdesc || '') : ''}
                                />
                                : <FieldView
                                    className={classes.mb2}
                                    label={t(langKeys.corporation)}
                                    value={row ? (row.corpdesc || '') : ''}
                                />
                            }
                            {valueInput}
                        </div>
                        <div className='col-6 mb-0'>
                            {row?.level !== 'CORPORATION' &&
                                <FieldEdit
                                    className={classes.mb2}
                                    disabled={true}
                                    label={t(langKeys.organization)}
                                    valueDefault={row ? (row.orgdesc || '') : ''}
                                />
                            }
                            {row?.level === 'CHANNEL' &&
                                <FieldEdit
                                    className={classes.mb2}
                                    disabled={true}
                                    label={t(langKeys.channel)}
                                    valueDefault={row ? (row.communicationchanneldesc || '') : ''}
                                />
                            }
                            {row?.level === 'GROUP' &&
                                <FieldEdit
                                    className={classes.mb2}
                                    disabled={true}
                                    label={t(langKeys.group)}
                                    valueDefault={row ? (row.group || '') : ''}
                                />
                            }
                        </div>
                    </div>
                </div>
            </AccordionDetails>
        </Accordion>
    )
}

export default Properties;