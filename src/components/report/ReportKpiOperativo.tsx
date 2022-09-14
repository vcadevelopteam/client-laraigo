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
import { getReportKpiOperativoSel, formatNumber, formatNumberNoDecimals, timetoseconds, secondsToDayTime, getValuesFromDomainLight } from 'common/helpers';
import { Search as SearchIcon } from '@material-ui/icons';
import { FieldSelect } from "components/fields/templates";
import { Dictionary } from "@types";

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
                type: 'number',
                NoFilter: true,
                Footer: (props: any) => {
                    return <>TOTAL</>
                },
            },
            {
                Header: t(langKeys.report_kpioperativo_month),
                accessor: 'month',
                type: 'number',
                NoFilter: true,
            },
            {
                Header: t(langKeys.report_kpioperativo_day),
                accessor: 'day',
                type: 'number',
                NoFilter: true,
            },
            {
                Header: t(langKeys.report_kpioperativo_groups),
                accessor: 'groups',
                NoFilter: true,
            },
            {
                Header: t(langKeys.report_kpioperativo_origin),
                accessor: 'origin',
                NoFilter: true,
            },
            {
                Header: t(langKeys.report_kpioperativo_tme),
                accessor: 'tme',
                NoFilter: true,
                Footer: (props: any) => {
                    const total = React.useMemo(
                        () =>
                            props.rows.reduce((sum: any, row: any) => timetoseconds(row.values["tme"]) + sum, 0),
                        [props.rows]
                    )
                    return <>{total ? secondsToDayTime(total / props.rows.length) : ''}</>
                },
            },
            {
                Header: t(langKeys.report_kpioperativo_tickets),
                accessor: 'tickets',
                type: 'number',
                NoFilter: true,
                Footer: (props: any) => {
                    const total = React.useMemo(
                        () =>
                            props.rows.reduce((sum: any, row: any) => row.values["tickets"] + sum, 0),
                        [props.rows]
                    )
                    return <>{total ? formatNumberNoDecimals(total) : ''}</>
                },
            },
            {
                Header: t(langKeys.report_kpioperativo_eq_time_sum),
                accessor: 'eqtime',
                type: 'number',
                NoFilter: true,
                Footer: (props: any) => {
                    const total = React.useMemo(
                        () =>
                            props.rows.reduce((sum: any, row: any) => row.values["eqtime"] + sum, 0),
                        [props.rows]
                    )
                    return <>{total ? formatNumber(total) : ''}</>
                },
            },
            {
                Header: t(langKeys.report_kpioperativo_onlinetime_tickets),
                accessor: 'onlinetime_tickets',
                type: 'number',
                NoFilter: true,
                Footer: (props: any) => {
                    const total = React.useMemo(
                        () =>
                            props.rows.reduce((sum: any, row: any) => row.values["onlinetime_tickets"] + sum, 0),
                        [props.rows]
                    )
                    return <>{total ? formatNumber(total / props.rows.length) : ''}</>
                },
            },
            {
                Header: t(langKeys.report_kpioperativo_tickets_eqtime),
                accessor: 'tickets_eqtime',
                type: 'number',
                NoFilter: true,
                Footer: (props: any) => {
                    const total = React.useMemo(
                        () =>
                            props.rows.reduce((sum: any, row: any) => row.values["tickets_eqtime"] + sum, 0),
                        [props.rows]
                    )
                    return <>{total ? formatNumber(total / props.rows.length) : ''}</>
                },
            },
            {
                Header: t(langKeys.report_kpioperativo_onlinetime_prod),
                accessor: 'onlinetime_prod',
                type: 'number',
                NoFilter: true,
                Footer: (props: any) => {
                    const total = React.useMemo(
                        () =>
                            props.rows.reduce((sum: any, row: any) => row.values["onlinetime_prod"] + sum, 0),
                        [props.rows]
                    )
                    return <>{total ? formatNumber(total / props.rows.length) : ''}</>
                },
            },
            {
                Header: t(langKeys.report_kpioperativo_busytime),
                accessor: 'busytime',
                type: 'number',
                NoFilter: true,
                Footer: (props: any) => {
                    const total = React.useMemo(
                        () =>
                            props.rows.reduce((sum: any, row: any) => row.values["busytime"] + sum, 0),
                        [props.rows]
                    )
                    return <>{total ? formatNumberNoDecimals(total / props.rows.length) : ''}</>
                },
            },
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
            getValuesFromDomainLight("GRUPOS"),
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