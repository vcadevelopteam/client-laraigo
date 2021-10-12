/* eslint-disable react-hooks/exhaustive-deps */
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
import VisibilityIcon from '@material-ui/icons/Visibility';

import { Box, IconButton } from '@material-ui/core';
import { Dictionary, MultiData } from '@types';
import { FieldEdit, FieldEditArray, FieldSelect, FieldView, TemplateBreadcrumbs, TemplateSwitchArray, TitleDetail } from 'components';

import { getDistinctPropertySel, getPropertySel, getValuesFromDomain, insProperty } from 'common/helpers';
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
        position: 'absolute'
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
                    data={mainResult.mainData.data}
                    download={true}
                    columns={columns}
                    filterGeneral={false}
                    loading={mainResult.mainData.loading}
                    register={false}
                />
            </div>
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
    const [domainTable, setDomainTable] = useState<{ loading: boolean; data: Dictionary[] }>({ loading: false, data: [] });
    const [waitSave, setWaitSave] = useState(false);

    const detailResult = useSelector(state => state.main.mainAux);
    const executeRes = useSelector(state => state.main.execute);
    const responseFromSelect = useSelector(state => state.main.multiDataAux);
    const user = useSelector(state => state.login.validateToken.user);

    const classes = useStyles();

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const { control, register, handleSubmit, trigger, setValue, formState: { errors } } = useForm<any>({
        defaultValues: {
            table: []
        }
    });

    const { fields, append: fieldsAppend, update: fieldsUpdate } = useFieldArray({
        control,
        name: 'table',
    });

    const fetchDetailData = (corpid: number, propertyname: string, description: string, category: string, level: string) => dispatch(getCollectionAux(getPropertySel(corpid, propertyname, description, category, level, 0)))

    const onSubmit = handleSubmit((data) => {
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
        fetchDetailData(row?.corpid, row?.propertyname, row?.description, row?.category, row?.level);
        return () => {
            dispatch(resetMainAux());
        };
    }, []);

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
                    }
                }
            }
        }
    }, [detailResult]);

    useEffect(() => {
        const indexDomainTable = responseFromSelect.data.findIndex((x: MultiData) => x.key === ('UFN_DOMAIN_LST_VALORES'));

        if (indexDomainTable > -1) {
            setDomainTable({ loading: false, data: responseFromSelect.data[indexDomainTable] && responseFromSelect.data[indexDomainTable].success ? responseFromSelect.data[indexDomainTable].data : [] });
        }
    }, [responseFromSelect]);

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
}

interface RowSelected {
    edit: boolean,
    row: Dictionary | null
}

const DetailNivelProperty: React.FC<ModalProps> = ({ data: { row, edit }, index, multiData, fields, onChangeSelectValue, register, errors, setValue, domainTable }) => {
    const [fieldValue, setFieldValue] = useState(null);
    const [comboStep, setComboStep] = useState('NONE');
    const [comboValue, setComboValue] = useState<any>(null);

    const classes = useStyles();

    const { t } = useTranslation();

    const dispatch = useDispatch();

    var valueInput = null;

    if (row) {
        switch (row?.inputtype) {
            case 'BOOL':
                if (edit) {
                    valueInput =
                        <TemplateSwitchArray
                            className={classes.mb2}
                            error={errors?.table?.[index]?.propertyvalue?.message}
                            /*fregister={{
                                ...register(`table.${index}.propertyvalue`, {
                                    validate: {
                                        validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                    }
                                })
                            }}*/
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
                            inputProps={{ step: 0.1 }}
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

            case 'TEXT':
            case 'TIME':
            case '':
            case null:
                if (edit) {
                    valueInput =
                        <FieldEdit
                            className={classes.mb2}
                            error={errors?.table?.[index]?.propertyvalue?.message}
                            /*fregister={{
                                ...register(`table.${index}.propertyvalue`, {
                                    validate: {
                                        value: (value: any) => (value && value.length) || t(langKeys.field_required)
                                    }
                                })
                            }}*/
                            label={t(langKeys.value)}
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
                    <div className='row-zyx'>
                        <div className='col-6'>
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
                        <div className='col-6'>
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