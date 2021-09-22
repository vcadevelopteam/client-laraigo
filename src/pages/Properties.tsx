/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, Fragment, useEffect, useState } from 'react';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SaveIcon from '@material-ui/icons/Save';
import TableZyx from '../components/fields/table-simple';
import Typography from '@material-ui/core/Typography';
import VisibilityIcon from '@material-ui/icons/Visibility';

import { Box, IconButton, TextField } from '@material-ui/core';
import { Dictionary, MultiData } from '@types';
import { FieldEdit, FieldSelect, FieldView, TemplateBreadcrumbs, TemplateSwitch, TitleDetail } from 'components';

import { getChannelsByOrg, getDistinctPropertySel, getOrgsByCorp, getPropertySel, getValuesFromDomain, insProperty } from 'common/helpers';
import { getCollection, getCollectionAux, getMultiCollection, getMultiCollectionAux, resetMain, resetMainAux, execute } from 'store/main/actions';
import { langKeys } from 'lang/keys';
import { makeStyles } from '@material-ui/core/styles';
import { showBackdrop, showSnackbar, manageConfirmation } from 'store/popus/actions';
import { useDispatch } from 'react-redux';
import { useFieldArray, useForm } from 'react-hook-form';
import { useSelector } from 'hooks';
import { useTranslation } from 'react-i18next';

const arrayBread = [
    { id: 'view-1', name: 'Properties' },
    { id: 'view-2', name: 'Property detail' }
];

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        background: '#fff',
        marginTop: theme.spacing(2),
        padding: theme.spacing(2)
    },
    containerDetail2: {
        position: 'absolute',
        width: '100%'
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
    }
}));

const Properties: FC = () => {
    const [categoryFilter, setCategoryFilter] = useState('');
    const [levelFilter, setLevelFilter] = useState('');
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [viewSelected, setViewSelected] = useState('view-1');
    const [waitSave, setWaitSave] = useState(false);

    const executeResult = useSelector(state => state.main.execute);
    const mainResult = useSelector(state => state.main);

    const classes = useStyles();
    
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const columns = React.useMemo(
        () => [
            {
                accessor: 'userid',
                isComponent: true,
                NoFilter: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <IconButton
                            aria-controls='long-menu'
                            aria-haspopup='true'
                            aria-label='more'
                            onClick={() => handleEdit(row)}
                            size='small'>
                            <VisibilityIcon style={{ color: '#B6B4BA' }} />
                        </IconButton>
                    )
                }
            },
            {
                Header: t(langKeys.name),
                accessor: 'propertyname'
            },
            {
                Header: t(langKeys.description),
                accessor: 'description'
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

    useEffect(() => {
        fetchData();
    }, [categoryFilter, levelFilter]);

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([getValuesFromDomain('ESTADOGENERICO')]));
        return () => {
            dispatch(resetMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || 'error_unexpected_error', { module: t(langKeys.property).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    if (viewSelected === 'view-1') {
        if (mainResult.mainData.error) {
            return <h1>ERROR</h1>;
        }
        return (
            <Fragment>
                <Box className={classes.containerHeader} justifyContent='space-between' alignItems='center' mb={1}>
                    <span className={classes.title}>{t(langKeys.property_plural, { count: 2 })}</span>
                </Box>
                <div className={classes.containerDetail2}>
                    <div className='row-zyx'>
                        <FieldSelect
                            label={t(langKeys.level)}
                            className='col-4'
                            valueDefault={levelFilter}
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
                            className='col-4'
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
                    data={mainResult.mainData.data}
                    download={true}
                    columns={columns}
                    filterGeneral={false}
                    loading={mainResult.mainData.loading}
                    register={false}
                />
            </Fragment>
        )
    }
    else if (viewSelected === 'view-2') {
        return (
            <DetailProperty
                data={rowSelected}
                fetchData={fetchData}
                multiData={mainResult.multiData.data}
                setViewSelected={setViewSelected}
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
}

const DetailProperty: React.FC<DetailPropertyProps> = ({ data: { row, edit }, fetchData, multiData, setViewSelected }) => {
    const [propertyDetailTable, setPropertyDetailTable] = useState<any[]>([]);
    const [waitSave, setWaitSave] = useState(false);

    const detailResult = useSelector(state => state.main.mainAux);
    const executeRes = useSelector(state => state.main.execute);
    const user = useSelector(state => state.login.validateToken.user);

    const classes = useStyles();

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const { control, register, handleSubmit, setValue, getValues, trigger, formState: { errors } } = useForm<any>({
        defaultValues: {
            table: []
        }
    });

    const { fields, append: fieldsAppend, remove: fieldsRemove, update: fieldsUpdate, insert: fieldsInsert } = useFieldArray({
        control,
        name: 'table',
    });

    const fetchDetailData = (corpid: number, propertyname: string, description: string, category: string, level: string) => dispatch(getCollectionAux(getPropertySel(corpid, propertyname, description, category, level, 0)))

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(insProperty(data)));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    useEffect(() => {
        fetchDetailData(row?.corpid, row?.propertyname, row?.description, row?.category, row?.level);
        return () => {
            dispatch(resetMainAux());
        };
    }, []);

    useEffect(() => {
        if (!detailResult.loading && !detailResult.error) {
            setPropertyDetailTable(detailResult.data);
            fieldsAppend(detailResult.data);
        }
    }, [detailResult]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData();
                dispatch(showBackdrop(false));
                setViewSelected('view-1')
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || 'error_unexpected_error', { module: t(langKeys.property).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeRes, waitSave])

    return (
        <div style={{ width: '100%' }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBread}
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
                        {edit &&
                            <Button
                                className={classes.button}
                                variant='contained'
                                color='primary'
                                type='submit'
                                startIcon={<SaveIcon color='secondary' />}
                                style={{ backgroundColor: '#55BD84' }}>
                                {t(langKeys.save)}
                            </Button>
                        }
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className='row-zyx'>
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.corporation)}
                                className='col-6'
                                valueDefault={row ? (row.corpdesc || '') : user?.corpdesc}
                                disabled={true}
                            />
                            : <FieldView
                                label={t(langKeys.corporation)}
                                value={row ? (row.corpdesc || '') : ''}
                                className='col-6'
                            />
                        }
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.name)}
                                className='col-6'
                                valueDefault={row ? (row.propertyname || '') : ''}
                                disabled={true}
                            />
                            : <FieldView
                                label={t(langKeys.name)}
                                value={row ? (row.propertyname || '') : ''}
                                className='col-6'
                            />
                        }
                    </div>
                    <div className='row-zyx'>
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.description)}
                                className='col-6'
                                valueDefault={row ? (row.description || '') : ''}
                                disabled={true}
                            />
                            : <FieldView
                                label={t(langKeys.description)}
                                value={row ? (row.description || '') : ''}
                                className='col-6'
                            />
                        }
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.category)}
                                className='col-6'
                                valueDefault={row ? (row.category || '') : ''}
                                disabled={true}
                            />
                            : <FieldView
                                label={t(langKeys.category)}
                                value={row ? (row.category || '') : ''}
                                className='col-6'
                            />
                        }
                    </div>
                    <div className='row-zyx'>
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.level)}
                                className='col-6'
                                valueDefault={row ? (row.level || '') : ''}
                                disabled={true}
                            />
                            : <FieldView
                                label={t(langKeys.level)}
                                value={row ? (row.level || '') : ''}
                                className='col-6'
                            />
                        }
                    </div>
                </div>

                <div>
                    {fields.map((item, index) => (
                        <DetailNivelProperty
                            data={{ row: item, edit }}    
                            index={index}
                            key={`detail${index}`}
                            multiData={multiData}
                            preData={fields}
                            updateRecords={setPropertyDetailTable}
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
    openModal?: boolean;
    preData: (Dictionary | null)[];
    setAllIndex?: (index: any) => void;
    setOpenModal?: (open: boolean) => void;
    triggerSave?: boolean;
    updateRecords?: (record: any) => void;
}

interface RowSelected {
    edit: boolean,
    row: Dictionary | null
}

const DetailNivelProperty: React.FC<ModalProps> = ({ data: { row, edit }, index, multiData, preData, setAllIndex, triggerSave, updateRecords }) => {
    const [channelTable, setChannelTable] = useState<{ loading: boolean; data: Dictionary[] }>({ loading: false, data: [] });
    const [domainTable, setDomainTable] = useState<{ loading: boolean; data: Dictionary[] }>({ loading: false, data: [] });
    const [groupTable, setGroupTable] = useState<{ loading: boolean; data: Dictionary[] }>({ loading: false, data: [] });
    const [orgTable, setOrgTable] = useState<{ loading: boolean; data: Dictionary[] }>({ loading: false, data: [] });

    const responseFromSelect = useSelector(state => state.main.multiDataAux);

    const classes = useStyles();

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const { formState: { errors }, getValues, handleSubmit, register, reset, setValue, trigger } = useForm();

    var valueInput = null;

    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];

    if (row) {
        switch (row?.inputtype) {
            case 'BOOL':
                if (edit) {
                    valueInput =
                        <TemplateSwitch
                        label={t(langKeys.value)}
                        className={classes.mb2}
                        valueDefault={row ? (row.propertyvalue === '1' ? row.propertyvalue : false) : false}
                    />
                }
                else {
                    valueInput =
                        <FieldView
                        label={t(langKeys.value)}
                        value={row ? (row.propertyvalue === '1' ? t(langKeys.affirmative) : t(langKeys.negative)) : t(langKeys.negative)}
                        className={classes.mb2}
                    />
                }
                break;

            case 'DOMAIN':
                if (edit) {
                    valueInput =
                        <FieldSelect
                        label={t(langKeys.value)}
                        valueDefault={row?.propertyvalue || ''}
                        error={errors?.propertyvalue?.message}
                        data={domainTable.data}
                        optionDesc='domaindesc'
                        optionValue='domainvalue'
                        className={classes.mb2}
                    />
                }
                else {
                    valueInput =
                        <FieldView
                        label={t(langKeys.value)}
                        value={row ? row.propertyvalue : ''}
                        className={classes.mb2}
                    />
                }
                break;

            case 'NUMBER':
                if (edit) {
                    valueInput =
                        <FieldEdit
                        label={t(langKeys.value)} 
                        type='number'
                        inputProps={{step: 0.1}}
                        valueDefault={row ? (row.propertyvalue || '') : ''}
                        error={errors?.propertyvalue?.message}
                        className={classes.mb2}
                    />
                }
                else {
                    valueInput =
                        <FieldView
                        label={t(langKeys.value)}
                        value={row?.propertyvalue || ''}
                        className={classes.mb2}
                    />
                }
                break;

            case 'TEXT':
            case 'TIME':
            case '':
            case null:
                if (edit) {
                    valueInput =
                        <FieldEdit
                        label={t(langKeys.value)}
                        valueDefault={row ? (row.propertyvalue || '') : ''}
                        error={errors?.propertyvalue?.message}
                        className={classes.mb2}
                    />
                }
                else {
                    valueInput =
                        <FieldView
                        label={t(langKeys.value)}
                        value={row?.propertyvalue || ''}
                        className={classes.mb2}
                    />
                }
                break;
        }
    }

    const onChangeOrganization = (value: Dictionary) => {
        setValue('orgdesc', value ? value.orgdesc : '');
        setValue('orgid', value ? value.orgid : 0);

        if (value) {
            setDomainTable({ loading: true, data: [] });
            setChannelTable({ loading: true, data: [] });
            setGroupTable({ loading: true, data: [] });
            
            dispatch(getMultiCollectionAux([
                getValuesFromDomain(row?.domainname, index + 1, value.orgid),
                getChannelsByOrg(value.orgid, index + 1),
                getValuesFromDomain('GRUPOS', ('GRUPO' + (index + 1)), value.orgid)
            ]))
        } else {
            setDomainTable({ loading: false, data: [] });
            setChannelTable({ loading: false, data: [] });
            setGroupTable({ loading: false, data: [] });
        }
    }

    const onSubmit = handleSubmit((data) => {
        if (!row)
            updateRecords && updateRecords((p: Dictionary[]) => [...p, { ...data, operation: 'INSERT' }])
        else
            updateRecords && updateRecords((p: Dictionary[]) => p.map(x => x.orgid === row ? { ...x, ...data, operation: (x.operation || 'UPDATE') } : x))
    });

    useEffect(() => {
        const indexChannelTable = responseFromSelect.data.findIndex((x: MultiData) => x.key === ('UFN_COMMUNICATIONCHANNELBYORG_LST' + (index + 1)));

        const indexDomainTable = responseFromSelect.data.findIndex((x: MultiData) => x.key === ('UFN_DOMAIN_LST_VALORES' + (index + 1)));

        const indexGroupTable = responseFromSelect.data.findIndex((x: MultiData) => x.key === ('UFN_DOMAIN_LST_VALORES' + ('GRUPO' + (index + 1))));

        const indexOrgTable = responseFromSelect.data.findIndex((x: MultiData) => x.key === ('UFN_CORP_ORG_SEL' + (index + 1)));

        if (indexChannelTable > -1) {
            setChannelTable({ loading: false, data: responseFromSelect.data[indexChannelTable] && responseFromSelect.data[indexChannelTable].success ? responseFromSelect.data[indexChannelTable].data : [] });
        }

        if (indexDomainTable > -1) {
            setDomainTable({ loading: false, data: responseFromSelect.data[indexDomainTable] && responseFromSelect.data[indexDomainTable].success ? responseFromSelect.data[indexDomainTable].data : [] });
        }

       if (indexGroupTable > -1) {
            setGroupTable({ loading: false, data: responseFromSelect.data[indexGroupTable] && responseFromSelect.data[indexGroupTable].success ? responseFromSelect.data[indexGroupTable].data : [] });
        }

        if (indexOrgTable > -1) {
            setOrgTable({ loading: false, data: responseFromSelect.data[indexOrgTable] && responseFromSelect.data[indexOrgTable].success ? responseFromSelect.data[indexOrgTable].data : [] });
        }
    }, [responseFromSelect]);

    useEffect(() => {
        if (row) {
            if (row?.inputtype === 'DOMAIN') {
                setDomainTable({ loading: true, data: [] });
                dispatch(getMultiCollectionAux([
                    getValuesFromDomain(row?.domainname, index + 1, row?.orgid)
                ]))
            }

            if (row?.level !== 'CORPORATION') {
                setOrgTable({ loading: true, data: [] });
                dispatch(getMultiCollectionAux([
                    getOrgsByCorp(0, index + 1)
                ]))
            }

            if (row?.level === 'CHANNEL') {
                setChannelTable({ loading: true, data: [] });
                dispatch(getMultiCollectionAux([
                    getChannelsByOrg(row?.orgid, index + 1)
                ]))
            }

            if (row?.level === 'GROUP') {
                setGroupTable({ loading: true, data: [] });
                dispatch(getMultiCollectionAux([
                    getValuesFromDomain('GRUPOS', ('GRUPO' + (index + 1)), row?.orgid)
                ]))
            }
        }
    }, []);

    return (
        <Accordion expanded={!row ? true : undefined} style={{ marginBottom: '8px' }}>
            <AccordionSummary
                aria-controls='panel1a-content'
                expandIcon={<ExpandMoreIcon />}
                id='panel1a-header'
            >
                <Typography>{'#' + (index + 1) + ' ' + row?.propertyname}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <div style={{ width: '100%' }}>
                    <div className='row-zyx'>
                        <div className='col-6'>
                            {edit ?
                                <FieldEdit
                                    label={t(langKeys.corporation)}
                                    valueDefault={row ? (row.corpdesc || '') : ''}
                                    disabled={true}
                                    className={classes.mb2}
                                />
                                : <FieldView
                                    label={t(langKeys.corporation)}
                                    value={row ? (row.corpdesc || '') : ''}
                                    className={classes.mb2}
                                />
                            }
                            {valueInput}
                        </div>
                        <div className='col-6'>
                            {row?.level !== 'CORPORATION' ? (edit ?
                                <FieldSelect
                                    label={t(langKeys.organization)}
                                    valueDefault={row?.orgid || ''}
                                    onChange={onChangeOrganization}
                                    error={errors?.orgid?.message}
                                    data={orgTable.data}
                                    optionDesc="orgdesc"
                                    optionValue="orgid"
                                    className={classes.mb2}
                                />
                                : <FieldView
                                    label={t(langKeys.organization)}
                                    value={row?.orgdesc || ''}
                                    className={classes.mb2}
                                />) : null
                            }
                            {row?.level === 'CHANNEL' ? (edit ?
                                <FieldSelect
                                    label={t(langKeys.channel)}
                                    valueDefault={row?.communicationchannelid || ''}
                                    error={errors?.communicationchannelid?.message}
                                    data={channelTable.data}
                                    optionDesc='description'
                                    optionValue='communicationchannelid'
                                    className={classes.mb2}
                                />
                                : <FieldView
                                    label={t(langKeys.channel)}
                                    value={row?.communicationchannelid || ''}
                                    className={classes.mb2}
                                />) : null
                            }
                            {row?.level === 'GROUP' ? (edit ?
                                <FieldSelect
                                    label={t(langKeys.group)}
                                    valueDefault={row?.group || ''}
                                    error={errors?.group?.message}
                                    data={groupTable.data}
                                    optionDesc='domaindesc'
                                    optionValue='domainvalue'
                                    className={classes.mb2}
                                />
                                : <FieldView
                                    label={t(langKeys.group)}
                                    value={row?.group || ''}
                                    className={classes.mb2}
                                />) : null
                            }
                            {edit ?
                                <FieldSelect
                                    label={t(langKeys.status)}
                                    className={classes.mb2}
                                    valueDefault={row?.status || 'ACTIVO'}
                                    error={errors?.status?.message}
                                    data={dataStatus}
                                    optionDesc='domaindesc'
                                    optionValue='domainvalue'
                                /> :
                                <FieldView
                                    label={t(langKeys.status)}
                                    value={row ? row.status : ''}
                                    className={classes.mb2}
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