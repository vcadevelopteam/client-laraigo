/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, AntTab, FieldEditMulti } from 'components';
import { calcKPIManager, convertLocalDate, duplicateKPIManager, getDateToday, getFirstDayMonth, getLastDayMonth, getValuesFromDomain, insKPIManager, selKPIManager, selKPIManagerHistory } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, getMultiCollection, execute, resetAllMain, getCollectionAux } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from '@material-ui/core';
import { Range } from 'react-date-range';
import { DateRangePicker } from 'components';
import { CalendarIcon, SearchIcon } from 'icons';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
interface MultiData {
    data: Dictionary[];
    success: boolean;
}
interface DetailKPIManagerProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: (id?: number) => void;
}

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    mb2: {
        marginBottom: theme.spacing(4),
    },
}));

const DetailKPIManager: React.FC<DetailKPIManagerProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData }) => {
    const user = useSelector(state => state.login.validateToken.user);
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const mainAuxRes = useSelector(state => state.main.mainAux);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [pageSelected, setPageSelected] = useState(0);

    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            id: row?.id || 0,
            kpiname: row?.kpiname || '',
            description: row?.description || '',
            status: row?.status || 'ACTIVO',
            type: row?.type || '',
            sqlselect: row?.sqlselect || '',
            sqlwhere: row?.sqlwhere || '',
            target: row?.target || 0,
            cautionat: row?.cautionat || 0,
            alertat: row?.alertat || 0,

            previousvalue: row?.previousvalue,
            currentvalue: row?.currentvalue,
            updatedate: row?.updatedate,

            createdate: row?.createdate,
            createby: row?.createby,
            changedate: row?.changedate,
            changeby: row?.changeby,

            operation: row ? "EDIT" : "INSERT",
        }
    });

    const [detaildata, setDetaildata] = useState({
        previousvalue: row?.previousvalue,
        currentvalue: row?.currentvalue,
        updatedate: row?.updatedate,
    })

    React.useEffect(() => {
        register('kpiname', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('sqlselect', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('sqlwhere', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.kpimanager_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    const onSubmit = handleSubmit((data) => {
        console.log(data)
        const callback = () => {
            dispatch(execute(insKPIManager(data)));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    const columnsHistory = React.useMemo(
        () => [
            {
                Header: t(langKeys.value),
                accessor: 'currentvalue',
                NoFilter: true,
            },
            {
                Header: t(langKeys.date),
                accessor: 'createdate',
                NoFilter: true,
            },
        ],
        []
    );

    const format = (date: Date) => date.toISOString().split('T')[0];
    const [openDateRangeModal, setOpenDateRangeModal] = useState(false);
    const [filterRangeDate, ] = useState("month");
    const [dateRange, setdateRange] = useState<Range>({
        startDate: filterRangeDate === "month" ? getFirstDayMonth() : getDateToday(),
        endDate: filterRangeDate === "month" ? getLastDayMonth() : getDateToday(),
        key: 'selection'
    });

    const [kpiHistoryData, setKpiHistoryData] = useState<any[]>([]);

    const fetchDataHistory = () => {
        dispatch(getCollectionAux(selKPIManagerHistory({
            kpiid: row?.id,
            startdate: dateRange.startDate!,
            enddate: dateRange.endDate!,
        })))
    };

    useEffect(() => {
        if (!mainAuxRes.loading && mainAuxRes.data) {
            setKpiHistoryData(mainAuxRes.data.map((d: any) => ({
                ...d,
                createdate: convertLocalDate(d?.createdate).toLocaleString(undefined, {year: "numeric", month: "2-digit", day: "2-digit", hour: "numeric", minute: "numeric", second: "numeric"}),
                changedate: convertLocalDate(d?.createdate).toLocaleString(undefined, {year: "numeric", month: "2-digit", day: "2-digit", hour: "numeric", minute: "numeric", second: "numeric"}),
            })));
        }
    }, [mainAuxRes]);

    const [waitCalc, setWaitCalc] = useState(false);
    const calcKPI = () => {
        setWaitCalc(true);
        dispatch(showBackdrop(true));
        dispatch(execute(calcKPIManager(row?.id)));
    };

    useEffect(() => {
        if (waitCalc) {
            if (!executeRes.loading && !executeRes.error && executeRes.data) {
                setDetaildata({
                    previousvalue: executeRes.data[0].p_previousvalue,
                    currentvalue: executeRes.data[0].p_currentvalue,
                    updatedate: executeRes.data[0].p_updatedate
                })
                fetchData && fetchData();
                setWaitCalc(false);
                dispatch(showBackdrop(false));
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.kpimanager_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                setWaitCalc(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitCalc])

    const arrayBread = [
        { id: "view-1", name: t(langKeys.kpimanager)},
        { id: "view-2", name: t(langKeys.kpimanager_detail) }
    ];
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
                            title={row ? `${row.kpiname}` : t(langKeys.newkpi)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("view-1")}
                        >{t(langKeys.back)}</Button>
                        {edit &&
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                type="submit"
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                            >{t(langKeys.save)}
                            </Button>
                        }
                    </div>
                </div>
                <Tabs
                    value={pageSelected}
                    indicatorColor="primary"
                    variant="fullWidth"
                    style={{ borderBottom: '1px solid #EBEAED', backgroundColor: '#FFF', marginTop: 8 }}
                    textColor="primary"
                    onChange={(_, value) => setPageSelected(value)}
                >
                    <AntTab label={t(langKeys.detail)} />
                    <AntTab label={t(langKeys.audit)} />
                    <AntTab label={t(langKeys.history)} />
                </Tabs>
                {pageSelected === 0 && <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.kpiname)}
                                className="col-4"
                                onChange={(value) => setValue('kpiname', value)}
                                valueDefault={getValues("kpiname")}
                                error={errors?.kpiname?.message}
                            />
                            :
                            <FieldView
                                label={t(langKeys.kpiname)}
                                value={row ? (row.kpiname || "") : ""}
                                className="col-4"
                            />
                        }
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.description)}
                                className="col-4"
                                onChange={(value) => setValue('description', value)}
                                valueDefault={getValues("description")}
                                error={errors?.description?.message}
                            />
                            :
                            <FieldView
                                label={t(langKeys.description)}
                                value={row ? (row.description || "") : ""}
                                className="col-4"
                            />
                        }
                        {edit ?
                            <FieldSelect
                                label={t(langKeys.status)}
                                className="col-4"
                                valueDefault={getValues('status')}
                                onChange={(value) => setValue('status', value ? value.domainvalue : '')}
                                error={errors?.status?.message}
                                data={dataStatus}
                                uset={true}
                                prefixTranslation="status_"
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            />
                            : <FieldView
                                label={t(langKeys.status)}
                                value={row ? (row.status || "") : ""}
                                className="col-6"
                            />
                        }
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            (
                                ['SUPERADMIN'].includes(user?.roledesc || "") ?
                                <FieldEditMulti
                                    label="Select"
                                    className="col-6"
                                    valueDefault={getValues('sqlselect')}
                                    onChange={(value) => setValue('sqlselect', value)}
                                    error={errors?.sqlselect?.message}
                                    disabled={!['SUPERADMIN'].includes(user?.roledesc || "")}
                                />
                                :
                                <FieldEditMulti
                                label="Select"
                                    className="col-6"
                                    valueDefault={row ? (row.sqlselect || "") : user?.corpdesc}
                                    disabled={true}
                                />
                            )
                            :
                            <FieldView
                            label="Select"
                            value={row ? (row.sqlselect || "") : ""}
                                className="col-6"
                            />
                        }
                        {edit ?
                            (
                                ['SUPERADMIN'].includes(user?.roledesc || "") ?
                                <FieldEditMulti
                                    label="Where"
                                    className="col-6"
                                    valueDefault={getValues('sqlwhere')}
                                    onChange={(value) => setValue('sqlwhere', value)}
                                    error={errors?.sqlselect?.message}
                                    disabled={!['SUPERADMIN'].includes(user?.roledesc || "")}
                                />
                                :
                                <FieldEditMulti
                                label="Where"
                                    className="col-6"
                                    valueDefault={row ? (row.sqlwhere || "") : user?.corpdesc}
                                    disabled={true}
                                />
                            )
                            :
                            <FieldView
                            label="Where"
                            value={row ? (row.sqlwhere || "") : ""}
                                className="col-6"
                            />
                        }
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.target)}
                                className="col-4"
                                valueDefault={getValues('target')}
                                onChange={(value) => setValue('target', value)}
                                error={errors?.target?.message}
                            />
                            :
                            <FieldView
                                label={t(langKeys.target)}
                                value={row ? (row.target || "") : ""}
                                className="col-4"
                            />
                        }
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.caution_at)}
                                className="col-4"
                                valueDefault={getValues('cautionat')}
                                onChange={(value) => setValue('cautionat', value)}
                                error={errors?.cautionat?.message}
                            />
                            :
                            <FieldView
                                label={t(langKeys.caution_at)}
                                value={row ? (row.cautionat || "") : ""}
                                className="col-4"
                            />
                        }
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.alert_at)}
                                className="col-4"
                                valueDefault={getValues('alertat')}
                                onChange={(value) => setValue('alertat', value)}
                                error={errors?.alertat?.message}
                            />
                            :
                            <FieldView
                                label={t(langKeys.alert_at)}
                                value={row ? (row.alertat || "") : ""}
                                className="col-4"
                            />
                        }
                    </div>
                    <Box style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Typography variant="h6" component="h6">
                            {t(langKeys.graphic_detail)}
                        </Typography>
                        <Button
                            style={{ border: '1px solid #bfbfc0', borderRadius: 4, color: 'rgb(143, 146, 161)' }}
                            onClick={() => calcKPI()}
                        >
                            {t(langKeys.refresh)}
                        </Button>
                    </Box>
                    <Box>
                        {t(langKeys.last_update)}: {convertLocalDate(detaildata?.updatedate).toLocaleString(undefined, {year: "numeric", month: "2-digit", day: "2-digit", hour: "numeric", minute: "numeric", second: "numeric"})}
                    </Box>
                    <div className="row-zyx">
                        <TableContainer>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><Trans i18nKey={langKeys.status} /></TableCell>
                                        <TableCell><Trans i18nKey={langKeys.current} /></TableCell>
                                        <TableCell><Trans i18nKey={langKeys.last_reading} /></TableCell>
                                        <TableCell><Trans i18nKey={langKeys.target} /></TableCell>
                                        <TableCell><Trans i18nKey={langKeys.variance} /></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{row?.status}</TableCell>
                                        <TableCell>{detaildata?.currentvalue}</TableCell>
                                        <TableCell>{detaildata?.previousvalue}</TableCell>
                                        <TableCell>{row?.target}</TableCell>
                                        <TableCell>{detaildata?.currentvalue - row?.target}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
                }
                {pageSelected === 1 &&
                    <div className={classes.containerDetail}>
                        <div className="row-zyx">
                            <FieldView
                                label={t(langKeys.createdBy)}
                                value={row?.createby}
                                className="col-6"
                            />
                             <FieldView
                                label={t(langKeys.creationDate)}
                                value={row?.createdate && convertLocalDate(row?.createdate).toLocaleString(undefined, {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "numeric",
                                    minute: "numeric",
                                    second: "numeric"
                                })}
                                className="col-6"
                            />
                        </div>
                        <div className="row-zyx">
                        <FieldView
                                label={t(langKeys.modifiedBy)}
                                value={row?.changeby}
                                className="col-6"
                            />
                             <FieldView
                                label={t(langKeys.modificationDate)}
                                value={row?.changedate && convertLocalDate(row?.changedate).toLocaleString(undefined, {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "numeric",
                                    minute: "numeric",
                                    second: "numeric"
                                })}
                                className="col-6"
                            />
                        </div>
                    </div>
                }
                {pageSelected === 2 &&
                    <div className={classes.containerDetail}>
                        <TableZyx
                            ButtonsElement={() => (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    <DateRangePicker
                                        open={openDateRangeModal}
                                        setOpen={setOpenDateRangeModal}
                                        range={dateRange}
                                        onSelect={setdateRange}
                                    >
                                        <Button
                                            disabled={mainAuxRes.loading}
                                            style={{ border: '1px solid #bfbfc0', borderRadius: 4, color: 'rgb(143, 146, 161)' }}
                                            startIcon={<CalendarIcon />}
                                            onClick={() => setOpenDateRangeModal(!openDateRangeModal)}
                                        >
                                            {format(dateRange.startDate!) + " - " + format(dateRange.endDate!)}
                                        </Button>
                                    </DateRangePicker>
                                    <Button
                                        disabled={mainAuxRes.loading}
                                        variant="contained"
                                        color="primary"
                                        startIcon={<SearchIcon style={{ color: 'white' }} />}
                                        style={{ backgroundColor: '#55BD84', width: 120 }}
                                        onClick={() => fetchDataHistory()}
                                    >
                                        <Trans i18nKey={langKeys.search} />
                                    </Button>
                                </div>
                            )}
                            columns={columnsHistory}
                            data={kpiHistoryData}
                            download={true}
                            filterrange={true}
                            pageSizeDefault={50}
                        />
                    </div>
                }
            </form>
        </div>
    );
}

const KPIManager: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);

    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);
    const [waitDuplicate, setWaitDuplicate] = useState(false);

    const columns = React.useMemo(
        () => [
            {
                accessor: 'id',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                            viewFunction={() => handleView(row)}
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                            extraOption={t(langKeys.duplicate)}
                            extraFunction={() => handleDuplicate(row)}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.kpiname),
                accessor: 'kpiname',
                NoFilter: true,
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                NoFilter: true,
            },
            {
                Header: t(langKeys.current_value),
                accessor: 'currentvalue',
                type: 'number',
                NoFilter: true,
            },
            {
                Header: t(langKeys.target),
                accessor: 'target',
                type: 'number',
                NoFilter: true,
            },
            {
                Header: t(langKeys.last_update),
                accessor: 'updatedate',
                NoFilter: true,
                Cell: (props: any) => {
                    const column = props.cell.column;
                    const row = props.cell.row.original;
                    return (
                        row[column.id] && convertLocalDate(row[column.id]).toLocaleString(undefined, {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "numeric",
                            minute: "numeric",
                            second: "numeric"
                        })
                    )
                }
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                NoFilter: true,
                prefixTranslation: 'status_',
                Cell: (props: any) => {
                    const { status } = props.cell.row.original;
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
                }
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(selKPIManager(0)));

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([
            getValuesFromDomain("ESTADOGENERICO"),
        ]));
        return () => {
            dispatch(resetAllMain());
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
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.kpimanager_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    }

    const handleView = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: false });
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(insKPIManager({ ...row, operation: 'DELETE', status: 'ELIMINADO' })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    const handleDuplicate = (row: Dictionary) => {
        dispatch(execute(duplicateKPIManager(row?.id)));
        dispatch(showBackdrop(true));
        setWaitDuplicate(true);
    }

    useEffect(() => {
        if (waitDuplicate) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_duplicate) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitDuplicate(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.kpimanager_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitDuplicate(false);
            }
        }
    }, [executeResult, waitDuplicate])

    if (viewSelected === "view-1") {
        return (
            <TableZyx
                columns={columns}
                titlemodule={t(langKeys.kpimanager_plural, { count: 2 })}
                data={mainResult.mainData.data}
                download={true}
                loading={mainResult.mainData.loading}
                register={true}
                handleRegister={handleRegister}
            />
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailKPIManager
                data={rowSelected}
                setViewSelected={setViewSelected}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
            />
        )
    } else
        return null;
}

export default KPIManager;