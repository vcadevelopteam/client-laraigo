/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from 'hooks';
import { showBackdrop } from "store/popus/actions";
import { makeStyles } from '@material-ui/core/styles';
import { getMultiCollection, resetMultiMain } from "store/main/actions";
import { langKeys } from "lang/keys";
import TableZyx from "components/fields/table-simple";
import { Button, } from "@material-ui/core";
import { getInvoiceReportSummary, formatCurrencyNoDecimals } from 'common/helpers';
import { Search as SearchIcon } from '@material-ui/icons';
import { FieldSelect } from "components/fields/templates";

const useStyles = makeStyles((theme) => ({
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

const dataYears = Array.from(Array(21).keys()).map(x => ({value: `${new Date().getFullYear() + x - 10}`}))

const currencyList = [
    { key: "USD", value:"USD" },
    { key: "PEN", value:"PEN" }
];

const Invoice: FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const multiData = useSelector(state => state.main.multiData);
    const [gridData, setGridData] = useState<any[]>([]);
    const classes = useStyles()
    const [year, setYear] = useState(`${new Date().getFullYear()}`);
    const [currency, setCurrency] = useState("USD");

    const search = () => {
        dispatch(showBackdrop(true))
        dispatch(getMultiCollection([
            getInvoiceReportSummary(
                {
                    year: year,
                    currency: currency
                }
            )
        ]))
    }

    useEffect(() => {
        return () => {
            dispatch(resetMultiMain());
        }
    }, [])

    useEffect(() => {
        if (!multiData.loading){
            dispatch(showBackdrop(false));
            const initialmonth = [...Array.from(Array(12).keys())].reduce((acc, item) => ({...acc, [`month${item + 1}`]: 0, [`color${item + 1}`]: 'black'}), {})
            setGridData(
                Object.values(
                    (multiData.data[0]?.data || []).reduce((acc, item) => ({
                    ...acc,
                    ["corp_" + item.corpid]: acc["corp_" + item.corpid] ? {
                        ...acc["corp_" + item.corpid],
                        [`color${item.month}`]: item.color,
                        [`month${item.month}`]: item.totalamount,
                        total: acc["corp_" + item.corpid].total + item.totalamount,
                        
                    } : {
                        ...initialmonth,
                        corpid: item.corpid,
                        corpdesc: item.corpdesc,
                        currency: item.currency,
                        [`color${item.month}`]: item.color,
                        [`month${item.month}`]: item.totalamount,
                        total: item.totalamount,
                    }
                }),{}))
            )
        }
    }, [multiData])

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.client),
                accessor: 'corpdesc',
                NoFilter: true,
                Footer: (props: any) => {
                    return <>TOTAL</>
                },
            },
            {
                Header: t(langKeys.currency),
                accessor: 'currency',
                NoFilter: true,
                Footer: (props: any) => {
                    return <>{currency}</>
                },
            },
            ...([...Array.from(Array(12).keys())].map((c, i) => ({
                Header: `${year}-${(''+(i+1)).padStart(2,'0')}`,
                accessor: `month${i+1}`,
                type: 'number',
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    const column = props.cell.column.id;
                    return <span style={{color: row[`color${i+1}`]}}>{formatCurrencyNoDecimals(row[column])}</span>
                },
                Footer: (props: any) => {
                    const total = React.useMemo(
                      () =>
                        props.rows.reduce((sum: any, row: any) => row.values[`month${i+1}`] + sum, 0),
                      [props.rows]
                    )
                    return <>{formatCurrencyNoDecimals(total)}</>
                },
            }))),
            {
                Header: `Total ${year}`,
                accessor: 'total',
                type: 'number',
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    const column = props.cell.column.id;
                    return <>{formatCurrencyNoDecimals(row[column])}</>
                },
                Footer: (props: any) => {
                    const total = React.useMemo(
                      () =>
                        props.rows.reduce((sum: any, row: any) => row.values["total"] + sum, 0),
                      [props.rows]
                    )
                    return <>{formatCurrencyNoDecimals(total)}</>
                },
            },
        ],
        []
    );

    return (
        <React.Fragment>
            <div style={{ height: 10 }}></div>
            <TableZyx
                columns={columns}
                data={gridData}
                ButtonsElement={() => (
                    <div className={classes.containerHeader} style={{display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'space-between'}}>
                        <div style={{display: 'flex', gap: 8}}>
                            <FieldSelect
                                label={t(langKeys.year)}
                                style={{width: 140}}
                                variant="outlined"
                                valueDefault={year}
                                onChange={(value) => setYear(value?.value)}
                                data={dataYears}
                                optionDesc="value"
                                optionValue="value"
                            />
                            <FieldSelect
                                label={t(langKeys.currency)}
                                style={{width: 140}}
                                variant="outlined"
                                valueDefault={currency}
                                onChange={(value) => setCurrency(value?.key)}
                                data={currencyList}
                                optionValue="key"
                                optionDesc="value"
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
                )}
                download={true}
                filterGeneral={false}
                loading={multiData.loading}
                register={false}
                useFooter={true}
            />
        </React.Fragment>
    )
}

export default Invoice;