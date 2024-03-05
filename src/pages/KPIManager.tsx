import React, { FC, useEffect, useState } from 'react'; 
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, AntTab, FieldEditMulti } from 'components';
import { calcKPIManager, convertLocalDate, dictToArrayKV, getDateCleaned, getDateToday, getFirstDayMonth, getLastDayMonth, getValuesFromDomain, insKPIManager, selKPIManager, selKPIManagerHistory } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, getMultiCollection, execute, resetAllMain, getCollectionAux, getCollectionAux2, resetMainAux, resetMainAux2 } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';
import { Box, IconButton, ListItemIcon, Menu, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from '@material-ui/core';
import { Range } from 'react-date-range';
import { DateRangePicker } from 'components';
import { CalendarIcon, DuplicateIcon } from 'icons';
import GaugeChart from 'react-gauge-chart'
import { Search as SearchIcon } from '@material-ui/icons';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import UpdateIcon from '@material-ui/icons/Update';
import { CellProps } from 'react-table';

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

const dataPeriod: Dictionary = {
    MINUTE: 'minute',
    HOUR: 'hour',
    DAY: 'day',
    MONTH: 'month'
};

const DetailKPIManager: React.FC<DetailKPIManagerProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData }) => {
    const user = useSelector(state => state.login.validateToken.user);
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const mainAuxRes = useSelector(state => state.main.mainAux);
    const mainAux2Res = useSelector(state => state.main.mainAux2);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [pageSelected, setPageSelected] = useState(0);

    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];

    const { register, reset, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
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

            taskperiod: row?.taskperiod || 'DAY',
            taskinterval: row?.taskinterval || 1,
            taskstartdate: row ? new Date(new Date(row?.taskstartdate).getTime() - new Date().getTimezoneOffset() * 60000).toISOString() : new Date().toISOString(),

            previousvalue: row?.previousvalue,
            currentvalue: row?.currentvalue,
            updatedate: row?.updatedate,

            createdate: row?.createdate,
            createby: row?.createby,
            changedate: row?.changedate,
            changeby: row?.changeby,

            operation: row && row.id ? "EDIT" : "INSERT",
        }
    });

    const [detaildata, setDetaildata] = useState<any>({
        previousvalue: row?.previousvalue,
        currentvalue: row?.currentvalue,
        updatedate: row?.updatedate,
        target: row?.target,
        cautionat: row?.cautionat,
        alertat: row?.alertat
    })

    const [gaugeArcs, setGaugeArcs] = useState([0, 0, 0]);

    useEffect(() => {
        if (detaildata) {
            if (detaildata.target <= detaildata.alertat) {
                setGaugeArcs(
                    [
                        detaildata.cautionat / (Math.max(detaildata?.currentvalue, Math.ceil(detaildata.alertat * 1.2 / 10) * 10)),
                        (detaildata.alertat - detaildata.cautionat) / (Math.max(detaildata?.currentvalue, Math.ceil(detaildata.alertat * 1.2 / 10) * 10)),
                        ((Math.max(detaildata?.currentvalue, Math.ceil(detaildata.alertat * 1.2 / 10) * 10)) - detaildata.alertat) / (Math.max(detaildata?.currentvalue, Math.ceil(detaildata.alertat * 1.2 / 10) * 10))
                    ]
                )
            }
            else {
                setGaugeArcs(
                    [
                        detaildata.alertat / (Math.max(detaildata?.currentvalue, Math.ceil(detaildata.target * 1.2 / 10) * 10)),
                        (detaildata.cautionat - detaildata.alertat) / (Math.max(detaildata?.currentvalue, Math.ceil(detaildata.target * 1.2 / 10) * 10)),
                        ((Math.max(detaildata?.currentvalue, Math.ceil(detaildata.target * 1.2 / 10) * 10)) - detaildata.cautionat) / (Math.max(detaildata?.currentvalue, Math.ceil(detaildata.target * 1.2 / 10) * 10))
                    ]
                )
            }
        }
    }, [detaildata])

    React.useEffect(() => {
        register('kpiname', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('sqlselect', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('sqlwhere', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('taskperiod', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('taskinterval', { validate: (value) => (value && value > 0) || t(langKeys.field_required) });
        register('taskstartdate', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
    }, [edit, register]);

    useEffect(() => {
        if (row?.id) {
            dispatch(showBackdrop(true));
            dispatch(getCollectionAux2(selKPIManager(row.id)))
        }
        return () => {
            dispatch(resetMainAux());
            dispatch(resetMainAux2());
        }
    }, [])

    useEffect(() => {
        if (!mainAux2Res.loading && !mainAux2Res.error && mainAux2Res.data?.length > 0) {
            reset({
                id: mainAux2Res.data[0]?.id || 0,
                kpiname: mainAux2Res.data[0]?.kpiname || '',
                description: mainAux2Res.data[0]?.description || '',
                status: mainAux2Res.data[0]?.status || 'ACTIVO',
                type: mainAux2Res.data[0]?.type || '',
                sqlselect: mainAux2Res.data[0]?.sqlselect || '',
                sqlwhere: mainAux2Res.data[0]?.sqlwhere || '',
                target: mainAux2Res.data[0]?.target || 0,
                cautionat: mainAux2Res.data[0]?.cautionat || 0,
                alertat: mainAux2Res.data[0]?.alertat || 0,

                taskperiod: mainAux2Res.data[0]?.taskperiod || 'DAY',
                taskinterval: mainAux2Res.data[0]?.taskinterval || 1,
                taskstartdate: mainAux2Res.data[0]?.taskstartdate ? new Date(new Date(mainAux2Res.data[0]?.taskstartdate).getTime() - new Date().getTimezoneOffset() * 60000).toISOString() : new Date().toISOString(),

                previousvalue: mainAux2Res.data[0]?.previousvalue,
                currentvalue: mainAux2Res.data[0]?.currentvalue,
                updatedate: mainAux2Res.data[0]?.updatedate,

                createdate: mainAux2Res.data[0]?.createdate,
                createby: mainAux2Res.data[0]?.createby,
                changedate: mainAux2Res.data[0]?.changedate,
                changeby: mainAux2Res.data[0]?.changeby,

                operation: mainAux2Res.data[0]?.id ? "EDIT" : "INSERT",
            });
            setDetaildata({
                previousvalue: mainAux2Res.data[0]?.previousvalue,
                currentvalue: mainAux2Res.data[0]?.currentvalue,
                updatedate: convertLocalDate(mainAux2Res.data[0]?.updatedate).toLocaleString(undefined, {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric"
                }),
                target: mainAux2Res.data[0]?.target || 0,
                cautionat: mainAux2Res.data[0]?.cautionat || 0,
                alertat: mainAux2Res.data[0]?.alertat || 0,
            })
            dispatch(showBackdrop(false));
        }
        else if (executeRes.error) {
            dispatch(showBackdrop(false));
        }
    }, [mainAux2Res])

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.kpimanager_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    const onSubmit = handleSubmit((data) => {
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

    const [openDateRangeModal, setOpenDateRangeModal] = useState(false);
    const [filterRangeDate,] = useState("month");
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
                createdate: convertLocalDate(d?.createdate).toLocaleString(undefined, { year: "numeric", month: "2-digit", day: "2-digit", hour: "numeric", minute: "numeric", second: "numeric" }),
                changedate: convertLocalDate(d?.createdate).toLocaleString(undefined, { year: "numeric", month: "2-digit", day: "2-digit", hour: "numeric", minute: "numeric", second: "numeric" }),
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
                if (executeRes.data[0].p_success) {
                    setDetaildata((prev: any) => ({
                        ...prev,
                        previousvalue: executeRes.data[0].p_previousvalue,
                        currentvalue: executeRes.data[0].p_currentvalue,
                        updatedate: convertLocalDate(executeRes.data[0].p_updatedate).toLocaleString(undefined, {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "numeric",
                            minute: "numeric",
                            second: "numeric"
                        })
                    }))
                    fetchData && fetchData();
                }
                else {
                    const errormessage = t(langKeys.error_kpi_sql, { error: executeRes.data[0].p_error })
                    dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                }
                setWaitCalc(false);
                dispatch(showBackdrop(false));
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.kpimanager_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitCalc(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitCalc])

    const arrayBread = [
        { id: "view-1", name: t(langKeys.kpimanager) },
        { id: "view-2", name: t(langKeys.kpimanager_detail) }
    ];
    return (
        <div style={{ width: '100%' }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBread}
                            handleClick={(view) => {
                                dispatch(getCollection(selKPIManager(0)));
                                setViewSelected(view);
                            }}
                        />
                        <TitleDetail
                            title={row?.id ? `${row.kpiname}` : t(langKeys.newkpi)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => {
                                dispatch(getCollection(selKPIManager(0)));
                                setViewSelected("view-1")
                            }}
                        >{t(langKeys.back)}</Button>
                        {edit &&
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                type="button"
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                                onClick={onSubmit}
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
                                label={t(langKeys.kpi_name)}
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
                                className="col-4"
                            />
                        }
                    </div>
                    {((user?.roledesc ?? "").split(",").some(v => ["SUPERADMIN"].includes(v))) &&
                        <div className="row-zyx">
                            {edit ?
                                (
                                    ((user?.roledesc ?? "").split(",").some(v => ["SUPERADMIN"].includes(v))) ?
                                        <FieldEditMulti
                                            label="Select"
                                            className="col-6"
                                            valueDefault={getValues('sqlselect')}
                                            onChange={(value) => setValue('sqlselect', value)}
                                            error={errors?.sqlselect?.message}
                                            disabled={!((user?.roledesc ?? "").split(",").some(v => ["SUPERADMIN"].includes(v)))}
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
                                    ((user?.roledesc ?? "").split(",").some(v => ["SUPERADMIN"].includes(v))) ?
                                        <FieldEditMulti
                                            label="Where"
                                            className="col-6"
                                            valueDefault={getValues('sqlwhere')}
                                            onChange={(value) => setValue('sqlwhere', value)}
                                            error={errors?.sqlwhere?.message}
                                            disabled={!((user?.roledesc ?? "").split(",").some(v => ["SUPERADMIN"].includes(v)))}
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
                        </div>}
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.target)}
                                className="col-4"
                                valueDefault={getValues('target')}
                                onChange={(value) => setValue('target', value)}
                                error={errors?.target?.message}
                                type="number"
                                inputProps={{ min: 0, step: 1 }}
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
                                type="number"
                                inputProps={{ min: 0, step: 1 }}
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
                                type="number"
                                inputProps={{ min: 0, step: 1 }}
                            />
                            :
                            <FieldView
                                label={t(langKeys.alert_at)}
                                value={row ? (row.alertat || "") : ""}
                                className="col-4"
                            />
                        }
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldSelect
                                uset={true}
                                label={t(langKeys.period)}
                                className="col-4"
                                valueDefault={getValues('taskperiod')}
                                onChange={(data) => setValue('taskperiod', data?.key || '')}
                                error={errors?.taskperiod?.message}
                                data={dictToArrayKV(dataPeriod)}
                                optionDesc="value"
                                optionValue="key"
                            />
                            :
                            <FieldView
                                label={t(langKeys.period)}
                                value={t(dataPeriod[row?.period]) || ""}
                                className="col-12"
                            />
                        }
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.interval)}
                                className="col-4"
                                type="number"
                                valueDefault={getValues('taskinterval')}
                                onChange={(value) => setValue('taskinterval', value)}
                                error={errors?.taskinterval?.message}
                                inputProps={{ min: 0, step: 1 }}
                            />
                            :
                            <FieldView
                                label={t(langKeys.interval)}
                                value={row ? (row.taskinterval || 1) : 1}
                                className="col-4"
                            />
                        }
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.startdate)}
                                className="col-4"
                                type="datetime-local"
                                valueDefault={(getValues('taskstartdate') as string)?.replace(' ', 'T')?.substring(0, 16)}
                                onChange={(value) => setValue('taskstartdate', value)}
                                error={errors?.taskstartdate?.message}
                            />
                            :
                            <FieldView
                                label={t(langKeys.startdate)}
                                value={row ? (row.taskstartdate || "") : ""}
                                className="col-4"
                            />
                        }
                    </div>
                    {(row && row.id) && <div className="row-zyx">
                        <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                            {t(langKeys.last_update)}: {detaildata?.updatedate}
                        </Box>
                        <TableContainer>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><Trans i18nKey={langKeys.status} /></TableCell>
                                        <TableCell><Trans i18nKey={langKeys.current} /></TableCell>
                                        <TableCell><Trans i18nKey={langKeys.last_reading} /></TableCell>
                                        <TableCell><Trans i18nKey={langKeys.target} /></TableCell>
                                        <TableCell><Trans i18nKey={langKeys.variance} /></TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{row?.status}</TableCell>
                                        <TableCell>{detaildata?.currentvalue}</TableCell>
                                        <TableCell>{detaildata?.previousvalue}</TableCell>
                                        <TableCell>{detaildata?.target}</TableCell>
                                        <TableCell>{detaildata?.currentvalue - row?.target}</TableCell>
                                        <TableCell>
                                            <GaugeChart
                                                style={{ width: '150px' }}
                                                id="gauge-chart"
                                                arcsLength={gaugeArcs}
                                                colors={
                                                    detaildata.target < detaildata.alertat
                                                        ? ['#5BE12C', '#F5CD19', '#EA4228']
                                                        : ['#EA4228', '#F5CD19', '#5BE12C']
                                                }
                                                textColor="#000000"
                                                animate={false}
                                                percent={
                                                    detaildata.target < detaildata.alertat
                                                        ? detaildata?.currentvalue / (Math.max(detaildata?.currentvalue, Math.ceil(detaildata.alertat * 1.2 / 10) * 10))
                                                        : detaildata?.currentvalue / (Math.max(detaildata?.currentvalue, Math.ceil(detaildata.target * 1.2 / 10) * 10))
                                                }
                                                formatTextValue={() => ``}
                                            /></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    }
                </div>
                }
                {pageSelected === 1 &&
                    <div className={classes.containerDetail}>
                        <div className="row-zyx">
                            <FieldView
                                label={t(langKeys.createdBy)}
                                value={getValues('createby')}
                                className="col-6"
                            />
                            <FieldView
                                label={t(langKeys.creationDate)}
                                value={row?.createdate && convertLocalDate(getValues('createdate')).toLocaleString(undefined, {
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
                                label={t(langKeys.change_by)}
                                value={getValues('changeby')}
                                className="col-6"
                            />
                            <FieldView
                                label={t(langKeys.change_date)}
                                value={row?.changedate && convertLocalDate(getValues('changedate')).toLocaleString(undefined, {
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
                                            {getDateCleaned(dateRange.startDate!) + " - " + getDateCleaned(dateRange.endDate!)}
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

const IconOptions: React.FC<{
    onDelete?: (e?: any) => void;
    onDuplicate?: (e?: any) => void;
    onCalc?: (e?: any) => void;
}> = ({ onDelete, onDuplicate, onCalc }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const { t } = useTranslation();

    const handleClose = () => setAnchorEl(null);
    return (
        <>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                size="small"
                onClick={(e) => {
                    e.stopPropagation();
                    setAnchorEl(e.currentTarget);
                }}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClick={(e) => e.stopPropagation()}
                onClose={handleClose}
            >
                {onDelete &&
                    <MenuItem onClick={(e) => {
                        e.stopPropagation();
                        setAnchorEl(null);
                        onDelete();
                    }}>
                        <ListItemIcon color="inherit">
                            <DeleteIcon width={18} style={{ fill: '#7721AD' }} />
                        </ListItemIcon>
                        {t(langKeys.delete)}
                    </MenuItem>
                }
                {onDuplicate &&
                    <MenuItem onClick={(e) => {
                        e.stopPropagation();
                        setAnchorEl(null);
                        onDuplicate();
                    }}>
                        <ListItemIcon>
                            <DuplicateIcon width={18} style={{ fill: '#7721AD' }} />
                        </ListItemIcon>
                        {t(langKeys.duplicate)}
                    </MenuItem>
                }
                {onCalc &&
                    <MenuItem onClick={(e) => {
                        e.stopPropagation();
                        setAnchorEl(null);
                        onCalc();
                    }}>
                        <ListItemIcon>
                            <UpdateIcon width={18} style={{ fill: '#7721AD' }} />
                        </ListItemIcon>
                        {t(langKeys.calculate)}
                    </MenuItem>
                }
            </Menu>
        </>
    )
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
    const [waitCalc, setWaitCalc] = useState(false);
    const [dataGrid, setDataGrid] = useState<any[]>([]);

    useEffect(() => {
        setDataGrid(mainResult.mainData.data.map(d => (
            {
                ...d,
                updatedate: convertLocalDate(d.updatedate).toLocaleString(undefined, {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric"
                })
            })))
    }, [mainResult.mainData.data])

    const columns = React.useMemo(
        () => [
            {
                accessor: 'id',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: CellProps<Dictionary>)  => {
                    const row = props.cell.row.original;
                    return (
                        <IconOptions
                            onDelete={() => {
                                handleDelete(row);
                            }}
                            onDuplicate={() => {
                                handleDuplicate(row);
                            }}
                            onCalc={() => {
                                handleCalc(row)
                            }}
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
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                NoFilter: true,
                prefixTranslation: 'status_',
                Cell: (props: CellProps<Dictionary>) => {
                    const { status } = props.cell.row.original || {};
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase();
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
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.kpimanager_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(insKPIManager({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.id })));
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
        setViewSelected("view-2");
        setRowSelected({
            row: {
                kpiname: row.kpiname,
                description: row.description,
                status: row.status,
                type: row.type,
                sqlselect: row.sqlselect,
                sqlwhere: row.sqlwhere,
                target: row.target,
                cautionat: row.cautionat,
                alertat: row.alertat,
                taskperiod: row.taskperiod,
                taskinterval: row.taskinterval,
                taskstartdate: row.taskstartdate,
            }, edit: true
        });
    }

    const handleCalc = (row: Dictionary) => {
        dispatch(execute(calcKPIManager(row?.id)));
        dispatch(showBackdrop(true));
        setWaitCalc(true);
    };

    useEffect(() => {
        if (waitDuplicate) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_duplicate) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitDuplicate(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.kpimanager_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitDuplicate(false);
            }
        }
    }, [executeResult, waitDuplicate])

    useEffect(() => {
        if (waitCalc) {
            if (!executeResult.loading && !executeResult.error && executeResult.data) {
                if (executeResult.data[0].p_success) {
                    fetchData && fetchData();
                }
                else {
                    const errormessage = t(langKeys.error_kpi_sql, { error: executeResult.data[0].p_error })
                    dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                }
                dispatch(showBackdrop(false));
                setWaitCalc(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.kpimanager_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitCalc(false);
            }
        }
    }, [executeResult, waitCalc])

    if (viewSelected === "view-1") {
        return (
            <TableZyx
                onClickRow={handleEdit}
                columns={columns}
                titlemodule={t(langKeys.kpimanager_plural, { count: 2 })}
                data={dataGrid}
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