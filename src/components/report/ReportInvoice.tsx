/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from 'hooks';
import { showBackdrop } from "store/popus/actions";
import { makeStyles } from '@material-ui/core/styles';
import { getMultiCollection, getMultiCollectionAux2, resetMultiMain } from "store/main/actions";
import { langKeys } from "lang/keys";
import TableZyx from "components/fields/table-simple";
import { Button, } from "@material-ui/core";
import { getInvoiceReportSummary, formatCurrencyNoDecimals, getInvoiceReportDetail } from 'common/helpers';
import { Search as SearchIcon } from '@material-ui/icons';
import { FieldSelect } from "components/fields/templates";
import { Dictionary } from "@types";
import ClearIcon from '@material-ui/icons/Clear';

interface RowSelected {
    year: string,
    row: Dictionary | null,
    columnid: string | null,
    edit: boolean
}

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

const dataYears = Array.from(Array(21).keys()).map(x => ({value: `${new Date().getFullYear() + x - 10}`}))

const currencyList = [
    { key: "USD", value:"USD" },
    { key: "PEN", value:"PEN" }
];

interface DetailReportInvoiceProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
}

const DetailReportInvoice: React.FC<DetailReportInvoiceProps> = ({ data: { year, row, columnid }, setViewSelected }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const multiDataAux2 = useSelector(state => state.main.multiDataAux2);
    const [gridData, setGridData] = useState<any[]>([]);

    function search(){
        dispatch(showBackdrop(true))
        dispatch(getMultiCollectionAux2([
            getInvoiceReportDetail({
                corpid: row?.corpid || 0,
                year: +year || 0,
                month: columnid?.includes('month_') ? +columnid.replace('month_','') : 0,
                currency: row?.currency || ""
            })
        ]))
    }
    useEffect(() => {
        if (!multiDataAux2.loading){
            setGridData((multiDataAux2.data[0]?.data||[]).map(x => ({
                ...x,
                paymentdate: x.paymentdate ? new Date(x.paymentdate).toLocaleString() : '',
            }))||[]);
            dispatch(showBackdrop(false))
        }
    }, [multiDataAux2])

    useEffect(() => {
        search()
    }, [])

    const columns = React.useMemo(
        () => [
            {
                Header: `${t(langKeys.client)}`,
                accessor: 'client',
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return <>{row.corpdesc}</>
                },
            },
            {
                Header: t(langKeys.year),
                accessor: 'year',
                NoFilter: true
            },
            {
                Header: t(langKeys.month),
                accessor: 'month',
                NoFilter: true
            },
            {
                Header: `${t(langKeys.corporation)}`,
                accessor: 'corpdesc',
                NoFilter: true
            },
            {
                Header: `${t(langKeys.organization)}`,
                accessor: 'orgdesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.receipt),
                accessor: 'urlpdf',
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    const column = props.cell.column.id;
                    return <span style={{color: row["color"]}}>{row[column]}</span>
                },
            },
            {
                Header: t(langKeys.currency),
                accessor: 'currency',
                NoFilter: true
            },
            {
                Header: t(langKeys.taxbase),
                accessor: 'subtotal',
                NoFilter: true
            },
            {
                Header: "IGV",
                accessor: 'taxes',
                NoFilter: true
            },
            {
                Header: t(langKeys.totalamount),
                accessor: 'totalamount',
                NoFilter: true
            },
            {
                Header: t(langKeys.statusofinvoice),
                accessor: 'invoicestatus',
                NoFilter: true
            },
            {
                Header: t(langKeys.paymentstatus),
                accessor: 'paymentstatus',
                NoFilter: true
            },
            {
                Header: t(langKeys.dateofissue),
                accessor: 'invoicedate',
                NoFilter: true
            },
            {
                Header: t(langKeys.dueDate),
                accessor: 'expirationdate',
                NoFilter: true
            },
            {
                Header: t(langKeys.paymentdate),
                accessor: 'paymentdate',
                NoFilter: true
            },
        ],
        [t]
    );

    return (
        <div style={{width: '100%'}}>
            <div className={classes.containerDetail}>
                <TableZyx
                    titlemodule={`${row?.corpdesc} (${year}${columnid?.includes('month_') ? `-${columnid.replace('month_','')}` : ''})`}
                    ButtonsElement={() => (
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("view-1")}
                        >{t(langKeys.back)}</Button>
                    )}
                    columns={columns}
                    data={gridData}
                    download={true}
                    loading={multiDataAux2.loading}
                    register={false}
                    filterGeneral={false}
                // fetchData={fetchData}
                />
            </div>
        </div>
    );
}

const ReportInvoice: FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const multiData = useSelector(state => state.main.multiData);
    const classes = useStyles()
    const [year, setYear] = useState(`${new Date().getFullYear()}`);
    const [currency, setCurrency] = useState("USD");
    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ year: `${new Date().getFullYear()}`, row: null, columnid: null, edit: false });
    const [gridData, setGridData] = useState<any[]>([]);

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
                Header: t((langKeys as any)[`month_${(''+(i+1)).padStart(2,'0')}`]),
                accessor: `month_${i+1}`,
                type: 'number',
                sortType: 'number',
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    const column = props.cell.column.id;
                    return <span style={{color: row[`color_${i+1}`]}}>{formatCurrencyNoDecimals(row[column])}</span>
                },
                Footer: (props: any) => {
                    const total = React.useMemo(
                      () =>
                        props.rows.reduce((sum: any, row: any) => row.values[`month_${i+1}`] + sum, 0),
                      [props.rows]
                    )
                    return <>{formatCurrencyNoDecimals(total)}</>
                },
            }))),
            {
                Header: `Total`,
                accessor: 'total',
                type: 'number',
                sortType: 'number',
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
        if (!multiData.loading) {
            const initialmonth = [...Array.from(Array(12).keys())].reduce((acc, item) => ({...acc, [`month_${item + 1}`]: 0, [`color_${item + 1}`]: 'black'}), {})
            setGridData(
                Object.values(
                    (multiData.data[0]?.data || []).reduce((acc, item) => ({
                    ...acc,
                    ["corp_" + item.corpid]: acc["corp_" + item.corpid] ? {
                        ...acc["corp_" + item.corpid],
                        [`color_${item.month}`]: item.color,
                        [`month_${item.month}`]: item.totalamount,
                        total: acc["corp_" + item.corpid].total + item.totalamount,
                        
                    } : {
                        ...initialmonth,
                        corpid: item.corpid,
                        corpdesc: item.corpdesc,
                        currency: item.currency,
                        [`color_${item.month}`]: item.color,
                        [`month_${item.month}`]: item.totalamount,
                        total: item.totalamount,
                    }
                }),{}))
            )
            dispatch(showBackdrop(false));
        }
    }, [multiData])

    const handleView = (row: Dictionary, columnid: string) => {
        setViewSelected("view-2");
        setRowSelected({ year, row, columnid, edit: false });
    }

    if (viewSelected === "view-1") {
        return (
            <React.Fragment>
                <div style={{ height: 10 }}></div>
                <TableZyx
                    onClickRow={handleView}
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
    else if (viewSelected === "view-2") {
        return (
            <DetailReportInvoice
                data={rowSelected}
                setViewSelected={setViewSelected}
            />
        )
    }
    else
        return null;
}

export default ReportInvoice;