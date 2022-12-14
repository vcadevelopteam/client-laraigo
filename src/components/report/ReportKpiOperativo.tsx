/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from 'hooks';
import { makeStyles } from '@material-ui/core/styles';
import { getCollectionAux2, getMultiCollection, resetMultiMain } from "store/main/actions";
import { langKeys } from "lang/keys";
import TableZyx from "components/fields/table-simple";
import { Button, TextField, } from "@material-ui/core";
import { getReportKpiOperativoSel, timetoseconds, secondsToHourTime, getUserGroupsSel } from 'common/helpers';
import { Search as SearchIcon } from '@material-ui/icons';
import { FieldSelect } from "components/fields/templates";

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    containerFilter: {
        width: '100%',
        padding: "10px",
        marginBottom: "10px",
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        backgroundColor: "white"
    },
    filterComponent: {
        minWidth: '220px',
        maxWidth: '260px'
    },
    containerHeader: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        }
    },
    containerDetails: {
        paddingBottom: theme.spacing(2)
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    BackGrRed: {
        backgroundColor: "#fb5f5f",
    },
    BackGrGreen: {
        backgroundColor: "#55bd84",
    },
    iconHelpText: {
        width: 15,
        height: 15,
        cursor: 'pointer',
    },
    containerHeaderItem: {
        backgroundColor: '#FFF',
        padding: 8,
        display: 'block',
        flexWrap: 'wrap',
        gap: 8,
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        }
    },
    itemDate: {
        minHeight: 40,
        height: 40,
        border: '1px solid #bfbfc0',
        borderRadius: 4,
        color: 'rgb(143, 146, 161)'
    },
}));

const origin = 'kpioperativo';
const ReportKpiOperativo: FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const mainAux2 = useSelector(state => state.main.mainAux2);
    const multiData = useSelector(state => state.main.multiData);
    const classes = useStyles()
    const [datemonth, setDatemonth] = useState(new Date().toISOString().slice(0,7));
    const [group, setGroup] = useState("");

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.report_kpioperativo_year),
                accessor: 'year',
                helpText: t(`report_${origin}_year_help`),
                type: 'number',
                NoFilter: true,
                Footer: (props: any) => {
                    return <>TOTAL</>
                },
            },
            {
                Header: t(langKeys.report_kpioperativo_month),
                accessor: 'month',
                helpText: t(`report_${origin}_month_help`),
                type: 'number',
                NoFilter: true,
            },
            {
                Header: t(langKeys.report_kpioperativo_day),
                accessor: 'day',
                helpText: t(`report_${origin}_day_help`),
                type: 'number',
                NoFilter: true,
            },
            {
                Header: t(langKeys.report_kpioperativo_groups),
                accessor: 'groups',
                helpText: t(`report_${origin}_groups_help`),
                NoFilter: true,
            },
            {
                Header: t(langKeys.report_kpioperativo_origin),
                accessor: 'origin',
                helpText: t(`report_${origin}_origin_help`),
                NoFilter: true,
            },
            {
                Header: t(langKeys.report_kpioperativo_tme_avg),
                accessor: 'tme_avg',
                helpText: t(`report_${origin}_tme_avg_help`),
                NoFilter: true,
                Footer: (props: any) => {
                    const total = React.useMemo(
                        () =>
                            props.rows.reduce((sum: any, row: any) => timetoseconds(row.values["tme_avg"]) + sum, 0),
                        [props.rows]
                    )
                    return <>{props.rows.filter((r: any) => r.values["tme_avg"]).length !== 0 ? secondsToHourTime(total / props.rows.filter((r: any) => r.values["tme_avg"]).length) : ''}</>
                },
            },
            {
                Header: t(langKeys.report_kpioperativo_tickets),
                accessor: 'tickets',
                helpText: t(`report_${origin}_tickets_help`),
                type: 'number',
                NoFilter: true,
                Footer: (props: any) => {
                    const total = React.useMemo(
                        () =>
                            props.rows.reduce((sum: any, row: any) => +row.values["tickets"] + sum, 0),
                        [props.rows]
                    )
                    return <>{props.rows.filter((r: any) => r.values["tickets"]).length !== 0 ? (total / props.rows.filter((r: any) => r.values["tickets"]).length).toFixed(0) : ''}</>
                },
            },
            {
                Header: t(langKeys.report_kpioperativo_eqtmoasesor),
                accessor: 'eqtmoasesor',
                helpText: t(`report_${origin}_eqtmoasesor_help`),
                type: 'number',
                NoFilter: true,
                Footer: (props: any) => {
                    const total = React.useMemo(
                        () =>
                            props.rows.reduce((sum: any, row: any) => +row.values["eqtmoasesor"] + sum, 0),
                        [props.rows]
                    )
                    return <>{props.rows.filter((r: any) => r.values["eqtmoasesor"]).length !== 0 ? (total / props.rows.filter((r: any) => r.values["eqtmoasesor"]).length).toFixed(0) : ''}</>
                },
            },
            {
                Header: t(langKeys.report_kpioperativo_userpause_hour_avg),
                accessor: 'userpause_hour_avg',
                helpText: t(`report_${origin}_userpause_hour_avg_help`),
                type: 'number',
                NoFilter: true,
                Footer: (props: any) => {
                    const total = React.useMemo(
                        () =>
                            props.rows.reduce((sum: any, row: any) => timetoseconds(row.values["userpause_hour_avg"]) + sum, 0),
                        [props.rows]
                    )
                    return <>{props.rows.filter((r: any) => r.values["userpause_hour_avg"]).length !== 0 ? secondsToHourTime(total / props.rows.filter((r: any) => r.values["userpause_hour_avg"]).length) : ''}</>
                },
            },
            {
                Header: t(langKeys.report_kpioperativo_tmoasesor_tickets),
                accessor: 'tmoasesor_tickets',
                helpText: t(`report_${origin}_tmoasesor_tickets_help`),
                type: 'number',
                NoFilter: true,
                Footer: (props: any) => {
                    const total = React.useMemo(
                        () =>
                            props.rows.reduce((sum: any, row: any) => timetoseconds(row.values["tmoasesor_tickets"]) + sum, 0),    
                        [props.rows]
                    )
                    return <>{props.rows.filter((r: any) => r.values["tmoasesor_tickets"]).length !== 0 ? secondsToHourTime(total / props.rows.filter((r: any) => r.values["tmoasesor_tickets"]).length) : ''}</>
                },
            },
            {
                Header: t(langKeys.report_kpioperativo_tickets_eqtmoasesor),
                accessor: 'tickets_eqtmoasesor',
                helpText: t(`report_${origin}_tickets_eqtmoasesor_help`),
                type: 'number',
                NoFilter: true,
                Footer: (props: any) => {
                    const total = React.useMemo(
                        () =>
                            props.rows.reduce((sum: any, row: any) => +row.values["tickets_eqtmoasesor"] + sum, 0),
                        [props.rows]
                    )
                    return <>{props.rows.filter((r: any) => r.values["tickets_eqtmoasesor"]).length !== 0 ? (total / props.rows.filter((r: any) => r.values["tickets_eqtmoasesor"]).length).toFixed(0) : ''}</>
                },
            },
            {
                Header: t(langKeys.report_kpioperativo_abandoned_tickets),
                accessor: 'abandoned_tickets',
                helpText: t(`report_${origin}_abandoned_tickets_help`),
                type: 'number',
                NoFilter: true,
                Footer: (props: any) => {
                    const total = React.useMemo(
                        () =>
                            props.rows.reduce((sum: any, row: any) => +row.values["abandoned_tickets"] + sum, 0),
                        [props.rows]
                    )
                    return <>{props.rows.filter((r: any) => r.values["abandoned_tickets"]).length !== 0 ? (total / props.rows.filter((r: any) => r.values["abandoned_tickets"]).length).toFixed(0) : ''}</>
                },
            },
            {
                Header: t(langKeys.report_kpioperativo_holdingwaitingtime_avg),
                accessor: 'holdingwaitingtime_avg',
                helpText: t(`report_${origin}_holdingwaitingtime_avg_help`),
                type: 'number',
                NoFilter: true,
                Footer: (props: any) => {
                    const total = React.useMemo(
                        () =>
                            props.rows.reduce((sum: any, row: any) => timetoseconds(row.values["holdingwaitingtime_avg"]) + sum, 0),    
                        [props.rows]
                    )
                    return <>{props.rows.filter((r: any) => r.values["holdingwaitingtime_avg"]).length !== 0 ? secondsToHourTime(total / props.rows.filter((r: any) => r.values["holdingwaitingtime_avg"]).length) : ''}</>
                },
            },
            {
                Header: t(langKeys.report_kpioperativo_firstassignedtime_avg),
                accessor: 'firstassignedtime_avg',
                helpText: t(`report_${origin}_firstassignedtime_avg_help`),
                type: 'number',
                NoFilter: true,
                Footer: (props: any) => {
                    const total = React.useMemo(
                        () =>
                            props.rows.reduce((sum: any, row: any) => timetoseconds(row.values["firstassignedtime_avg"]) + sum, 0),    
                        [props.rows]
                    )
                    return <>{props.rows.filter((r: any) => r.values["firstassignedtime_avg"]).length !== 0 ? secondsToHourTime(total / props.rows.filter((r: any) => r.values["firstassignedtime_avg"]).length) : ''}</>
                },
            },
            {
                Header: t(langKeys.report_kpioperativo_firstreplytime_avg),
                accessor: 'firstreplytime_avg',
                helpText: t(`report_${origin}_firstreplytime_avg_help`),
                type: 'number',
                NoFilter: true,
                Footer: (props: any) => {
                    const total = React.useMemo(
                        () =>
                            props.rows.reduce((sum: any, row: any) => timetoseconds(row.values["firstreplytime_avg"]) + sum, 0),    
                        [props.rows]
                    )
                    return <>{props.rows.filter((r: any) => r.values["firstreplytime_avg"]).length !== 0 ? secondsToHourTime(total / props.rows.filter((r: any) => r.values["firstreplytime_avg"]).length) : ''}</>
                },
            },
            {
                Header: t(langKeys.report_kpioperativo_balancetimes_avg),
                accessor: 'balancetimes_avg',
                helpText: t(`report_${origin}_balancetimes_avg_help`),
                type: 'number',
                NoFilter: true,
                Footer: (props: any) => {
                    const total = React.useMemo(
                        () =>
                            props.rows.reduce((sum: any, row: any) => +row.values["balancetimes_avg"] + sum, 0),
                        [props.rows]
                    )
                    return <>{props.rows.filter((r: any) => r.values["balancetimes_avg"]).length !== 0 ? (total / props.rows.filter((r: any) => r.values["balancetimes_avg"]).length).toFixed(0) : ''}</>
                },
            },
            {
                Header: t(langKeys.report_kpioperativo_useraveragereplytime_avg),
                accessor: 'useraveragereplytime_avg',
                helpText: t(`report_${origin}_useraveragereplytime_avg_help`),
                type: 'number',
                NoFilter: true,
                Footer: (props: any) => {
                    const total = React.useMemo(
                        () =>
                            props.rows.reduce((sum: any, row: any) => timetoseconds(row.values["useraveragereplytime_avg"]) + sum, 0),    
                        [props.rows]
                    )
                    return <>{props.rows.filter((r: any) => r.values["useraveragereplytime_avg"]).length !== 0 ? secondsToHourTime(total / props.rows.filter((r: any) => r.values["useraveragereplytime_avg"]).length) : ''}</>
                },
            },
            // {
            //     Header: t(langKeys.report_kpioperativo_tmoasesor_hour_sum),
            //     accessor: 'tmoasesor_hour_sum',
            //     helpText: t(`report_${origin}_tmoasesor_hour_sum_help`),
            //     type: 'number',
            //     NoFilter: true,
            //     Footer: (props: any) => {
            //         const total = React.useMemo(
            //             () =>
            //                 props.rows.reduce((sum: any, row: any) => +row.values["tmoasesor_hour_sum"] + sum, 0),
            //             [props.rows]
            //         )
            //         return <>{props.rows.filter((r: any) => r.values["tmoasesor_hour_sum"]).length !== 0 ? (total / props.rows.filter((r: any) => r.values["tmoasesor_hour_sum"]).length).toFixed(2) : ''}</>
            //     },
            // },
            // {
            //     Header: t(langKeys.report_kpioperativo_tda_hour_avg),
            //     accessor: 'tda_hour_avg',
            //     helpText: t(`report_${origin}_tda_hour_avg_help`),
            //     type: 'number',
            //     NoFilter: true,
            //     Footer: (props: any) => {
            //         const total = React.useMemo(
            //             () =>
            //                 props.rows.reduce((sum: any, row: any) => +row.values["tda_hour_avg"] + sum, 0),
            //             [props.rows]
            //         )
            //         return <>{props.rows.length !== 0 ? (total / props.rows.filter((r: any) => r.values["tda_hour_avg"]).length).toFixed(2) : ''}</>
            //     },
            // },
            // {
            //     Header: t(langKeys.report_kpioperativo_tdats_hour_avg),
            //     accessor: 'tdats_hour_avg',
            //     helpText: t(`report_${origin}_tdats_hour_avg_help`),
            //     type: 'number',
            //     NoFilter: true,
            //     Footer: (props: any) => {
            //         const total = React.useMemo(
            //             () =>
            //                 props.rows.reduce((sum: any, row: any) => +row.values["tdats_hour_avg"] + sum, 0),
            //             [props.rows]
            //         )
            //         return <>{props.rows.length !== 0 ? (total / props.rows.filter((r: any) => r.values["tdats_hour_avg"]).length).toFixed(2) : ''}</>
            //     },
            // },
        ],
        []
    );

    function handleDateChange(value: any) {
        if (value !== "") {
            setDatemonth(value);
        }
    }

    const search = () => {
        dispatch(getCollectionAux2(
            getReportKpiOperativoSel(
                {
                    date: `${datemonth}-01`,
                    usergroup: group
                }
            )
        ))
    }

    useEffect(() => {
        dispatch(getMultiCollection([
            getUserGroupsSel(),
        ]))
        return () => {
            dispatch(resetMultiMain());
        }
    }, [])

    return (
        <React.Fragment>
            <div style={{ height: 10 }}></div>
            <div className={classes.containerHeader} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                    <TextField
                        id="date"
                        type="month"
                        variant="outlined"
                        onChange={(e) => handleDateChange(e.target.value)}
                        value={datemonth}
                        size="small"
                    />
                    <FieldSelect
                        label={t(langKeys.group)}
                        className={classes.filterComponent}
                        variant="outlined"
                        valueDefault={group}
                        onChange={(value) => setGroup(value?.domainvalue)}
                        data={multiData.data?.[0]?.data || []}
                        loading={multiData.loading}
                        optionValue="domainvalue"
                        optionDesc="domaindesc"
                    />
                    <div>
                        <Button
                            disabled={multiData.loading}
                            variant="contained"
                            color="primary"
                            startIcon={<SearchIcon style={{ color: 'white' }} />}
                            style={{ width: 120, backgroundColor: "#55BD84" }}
                            onClick={() => search()}
                        >{t(langKeys.search)}
                        </Button>
                    </div>
                </div>
            </div>

            <TableZyx
                columns={columns}
                data={mainAux2?.data || []}
                download={true}
                filterGeneral={false}
                loading={mainAux2.loading}
                register={false}
                useFooter={true}
            />
        </React.Fragment>
    )
}

export default ReportKpiOperativo;