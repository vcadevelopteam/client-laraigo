import React, { FC, useEffect, useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from 'hooks';
import { showBackdrop } from "store/popus/actions";
import { makeStyles } from '@material-ui/core/styles';
import { getCollectionAux2, getMultiCollection, getMultiCollectionAux2, resetMultiMain, cleanMemoryTable, setMemoryTable, execute } from "store/main/actions";
import { langKeys } from "lang/keys";
import TableZyx from "components/fields/table-simple";
import { Button, } from "@material-ui/core";
import { getInvoiceReportSummary, formatCurrencyNoDecimals, getInvoiceReportDetail, getCurrencyList, formatCurrency, selInvoiceComment, insInvoiceComment, convertLocalDate, getValuesFromDomainCorp } from 'common/helpers';
import { Search as SearchIcon } from '@material-ui/icons';
import { FieldSelect } from "components/fields/templates";
import { Dictionary } from "@types";
import ClearIcon from '@material-ui/icons/Clear';
import { showSnackbar, manageConfirmation } from 'store/popus/actions';
import { dataYears } from 'common/helpers';
import { FieldEditMulti, DialogZyx } from 'components';

interface RowSelected {
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

interface DetailReportInvoiceProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
}

const DetailReportInvoice: React.FC<DetailReportInvoiceProps> = ({ data: { row, columnid }, setViewSelected }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const multiDataAux2 = useSelector(state => state.main.multiDataAux2);
    const [gridData, setGridData] = useState<any[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [openModalData, setOpenModalData] = useState<Dictionary | null>(null);
    const [searchState, setSearchState] = useState(false);

    function search() {
        setSearchState(true)
        dispatch(showBackdrop(true))
        dispatch(getMultiCollectionAux2([
            getInvoiceReportDetail({
                corpid: row?.corpid || 0,
                year: row?.year || 0,
                month: columnid?.includes('month_') ? Number(columnid.replace('month_', '')) : 0,
                currency: row?.currency || ""
            })
        ]))
    }
    useEffect(() => {
        if (searchState && !multiDataAux2.loading) {
            setGridData((multiDataAux2.data[0]?.data || []).map(x => ({
                ...x,
                invoicestatus: (t(`${x.invoicestatus}`) || ""),
                paymentstatus: (t(`${x.paymentstatus}`) || ""),
                paymentdate: x.paymentdate ? new Date(x.paymentdate).toLocaleString() : '',
            })) || []);
            setSearchState(false)
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
                    return <span style={{ color: row["color"] }}>{row.corpdesc}</span>
                },
            },
            {
                Header: t(langKeys.year),
                accessor: 'year',
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    const column = props.cell.column.id;
                    return <span style={{ color: row["color"] }}>{row[column]}</span>
                },
            },
            {
                Header: t(langKeys.month),
                accessor: 'month',
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    const column = props.cell.column.id;
                    return <span style={{ color: row["color"] }}>{row[column]}</span>
                },
            },
            {
                Header: `${t(langKeys.corporation)}`,
                accessor: 'corpdesc',
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    const column = props.cell.column.id;
                    return <span style={{ color: row["color"] }}>{row[column]}</span>
                },
            },
            {
                Header: `${t(langKeys.organization)}`,
                accessor: 'orgdesc',
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    const column = props.cell.column.id;
                    return <span style={{ color: row["color"] }}>{row[column]}</span>
                },
            },
            {
                Header: t(langKeys.receipt),
                accessor: 'seriecorrelative',
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    const urlpdf = props.cell.row.original.urlpdf;
                    const docnumber = (props.cell.row.original.serie && props.cell.row.original.correlative) ? (props.cell.row.original.serie + '-' + props.cell.row.original.correlative.toString().padStart(8, '0')) : null;
                    return <>
                        {urlpdf ?
                            <a
                                onClick={(e) => { e.stopPropagation(); }}
                                style={{ color: row["color"] }}
                                href={urlpdf}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {docnumber}
                            </a>
                            :
                            <span style={{ color: row["color"] }}>
                                {docnumber}
                            </span>
                        }
                    </>
                },
            },
            {
                Header: t(langKeys.currency),
                accessor: 'currency',
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    const column = props.cell.column.id;
                    return <span style={{ color: row["color"] }}>{row[column]}</span>
                },
            },
            {
                Header: t(langKeys.reportinvoice_location),
                accessor: 'location',
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    const column = props.cell.column.id;
                    return <span style={{ color: row["color"] }}>{row[column]}</span>
                },
            },
            {
                Header: t(langKeys.taxbase),
                accessor: 'subtotal',
                NoFilter: true,
                type: 'number',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    const column = props.cell.column.id;
                    return <span style={{ color: row["color"] }}>{formatCurrency(row[column])}</span>
                },
            },
            {
                Header: "IGV",
                accessor: 'taxes',
                NoFilter: true,
                type: 'number',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    const column = props.cell.column.id;
                    return <span style={{ color: row["color"] }}>{formatCurrency(row[column])}</span>
                },
            },
            {
                Header: t(langKeys.totalamount),
                accessor: 'totalamount',
                NoFilter: true,
                type: 'number',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    const column = props.cell.column.id;
                    return <span style={{ color: row["color"] }}>{formatCurrency(row[column])}</span>
                },
            },
            {
                Header: t(langKeys.statusofinvoice),
                accessor: 'invoicestatus',
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    const column = props.cell.column.id;
                    return <span style={{ color: row["color"] }}>{row[column]}</span>
                },
            },
            {
                Header: t(langKeys.paymentstatus),
                accessor: 'paymentstatus',
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    const column = props.cell.column.id;
                    return <span style={{ color: row["color"] }}>{row[column]}</span>
                },
            },
            {
                Header: t(langKeys.dateofissue),
                accessor: 'invoicedate',
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    const column = props.cell.column.id;
                    return <span style={{ color: row["color"] }}>{row[column]}</span>
                },
            },
            {
                Header: t(langKeys.dueDate),
                accessor: 'expirationdate',
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    const column = props.cell.column.id;
                    return <span style={{ color: row["color"] }}>{row[column]}</span>
                },
            },
            {
                Header: t(langKeys.paymentdate),
                accessor: 'paymentdate',
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    const column = props.cell.column.id;
                    return <span style={{ color: row["color"] }}>{row[column]}</span>
                },
            },
            {
                Header: t(langKeys.comments),
                accessor: 'commentcontent',
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    const { commentcontent } = props.cell.row.original;
                    if (commentcontent) {
                        return (<span style={{ color: row["color"] }}><Fragment>
                            <div style={{ display: 'inline-block' }}>
                                {(commentcontent || '').substring(0, 50)}... <a href="#" onClick={(e) => { e.stopPropagation(); openInvoiceComment(row); }} style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }} rel="noreferrer">{t(langKeys.seeMore)}</a>
                            </div>
                        </Fragment></span>)
                    }
                    else {
                        return (<span style={{ color: row["color"] }}><Fragment>
                            <div style={{ display: 'inline-block' }}>
                                <a href="#" onClick={(e) => { e.stopPropagation(); openInvoiceComment(row); }} style={{ display: "block", cursor: 'pointer', textDecoration: 'underline', color: 'blue' }} rel="noreferrer">{t(langKeys.seeMore)}</a>
                            </div>
                        </Fragment></span>)
                    }
                }
            },
        ],
        [t]
    );

    const openInvoiceComment = (row: Dictionary) => {
        setViewSelected("view-2");
        setOpenModalData(row);
        setOpenModal(true);
    }

    const onModalSuccess = () => {
        setOpenModal(false);
        search();
        setViewSelected("view-2");
    }

    return (
        <div style={{ width: '100%' }}>
            <InvoiceCommentModal
                data={openModalData}
                openModal={openModal}
                setOpenModal={setOpenModal}
                onTrigger={onModalSuccess}
            />
            <div className={classes.containerDetail}>
                <TableZyx
                    titlemodule={`${row?.corpdesc} (${row?.year}${columnid?.includes('month_') ? `-${columnid.replace('month_', '')}` : ''})`}
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
                    loading={searchState && multiDataAux2.loading}
                    register={false}
                    filterGeneral={false}
                />
            </div>
        </div>
    );
}

const InvoiceCommentModal: FC<{ data: any, openModal: boolean, setOpenModal: (param: any) => void, onTrigger: () => void }> = ({ data, openModal, setOpenModal, onTrigger }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const multiDataAux2 = useSelector(state => state.main.multiDataAux2);
    const executeResult = useSelector(state => state.main.execute);

    const [dataInvoiceComment, setDataInvoiceComment] = useState<Dictionary[]>([]);
    const [waitSave, setWaitSave] = useState(false);
    const [waitLoad, setWaitLoad] = useState(false);
    const [contentValidation, setContentValidation] = useState('');
    const [reloadExit, setReloadExit] = useState(false);

    const [fields, setFields] = useState({
        "corpid": data?.corpid,
        "orgid": data?.orgid,
        "invoiceid": data?.invoiceid,
        "invoicecommentid": 0,
        "description": '',
        "status": 'ACTIVO',
        "type": '',
        "commentcontent": '',
        "commenttype": 'text',
        "commentcaption": '',
    })

    const fetchData = () => {
        dispatch(getMultiCollectionAux2([selInvoiceComment({
            corpid: data?.corpid,
            orgid: data?.orgid,
            invoiceid: data?.invoiceid,
            invoicecommentid: 0,
        })]));
        setWaitLoad(true);
        dispatch(showBackdrop(true));
    }

    useEffect(() => {
        if (openModal && data) {
            setDataInvoiceComment([]);
            setContentValidation('');
            setReloadExit(false);

            const partialFields = fields;
            partialFields.corpid = data?.corpid;
            partialFields.orgid = data?.orgid;
            partialFields.invoiceid = data?.invoiceid;
            partialFields.invoicecommentid = 0;
            partialFields.description = '';
            partialFields.status = 'ACTIVO';
            partialFields.type = '';
            partialFields.commentcontent = '';
            partialFields.commenttype = 'text';
            partialFields.commentcaption = '';
            setFields(partialFields);

            fetchData();
        }
    }, [data, openModal]);

    useEffect(() => {
        if (waitLoad) {
            if (!multiDataAux2.loading && !multiDataAux2.error) {
                setDataInvoiceComment(multiDataAux2.data[0]?.data || []);
                dispatch(showBackdrop(false));
                setWaitLoad(false);
            } else if (multiDataAux2.error) {
                setWaitLoad(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [multiDataAux2, waitLoad])

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }));
                dispatch(showBackdrop(false));
                setWaitSave(false);

                setDataInvoiceComment([]);

                const partialFields = fields;
                partialFields.commentcontent = '';
                setFields(partialFields);

                fetchData();

                setReloadExit(true);
            } else if (executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(executeResult.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() }) }));
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    const handleCommentRegister = () => {
        if (fields) {
            if (fields.commentcontent) {
                setContentValidation('');

                const callback = () => {
                    dispatch(execute(insInvoiceComment(fields)));
                    dispatch(showBackdrop(true));
                    setWaitSave(true);
                }

                dispatch(manageConfirmation({
                    visible: true,
                    question: t(langKeys.confirmation_save),
                    callback
                }))
            }
            else {
                setContentValidation(t(langKeys.required_fields_missing));
            }
        }
    }

    const handleCommentDelete = (data: any) => {
        if (fields && data) {
            const callback = () => {
                const fieldTemporal = fields;

                fieldTemporal.corpid = data?.corpid;
                fieldTemporal.orgid = data?.orgid;
                fieldTemporal.invoiceid = data?.invoiceid;
                fieldTemporal.invoicecommentid = data?.invoicecommentid;
                fieldTemporal.description = data?.description;
                fieldTemporal.status = 'ELIMINADO';
                fieldTemporal.type = data?.type;
                fieldTemporal.commentcontent = data?.commentcontent;
                fieldTemporal.commenttype = data?.commenttype;
                fieldTemporal.commentcaption = data?.commentcaption;

                dispatch(execute(insInvoiceComment(fieldTemporal)));
                dispatch(showBackdrop(true));
                setWaitSave(true);
            }

            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_delete),
                callback
            }))
        }
    }

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.invoicecomments)}
            buttonText1={t(langKeys.close)}
            handleClickButton1={() => { setOpenModal(false); if (reloadExit) { onTrigger(); } }}
        >
            <div style={{ overflowY: 'auto' }}>
                {dataInvoiceComment.map((item) => (
                    <div key={''} style={{ borderStyle: "solid", borderWidth: "1px", borderColor: "#762AA9", borderRadius: "4px", padding: "10px", margin: "10px" }}>
                        <div style={{ display: 'flex' }}>
                            <b style={{ width: '100%' }}>{item.createby} {t(langKeys.invoiceat)} {convertLocalDate(item.createdate || '').toLocaleString()}</b>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                type='button'
                                style={{ backgroundColor: "#FB5F5F" }}
                                onClick={() => handleCommentDelete(item)}
                            >{t(langKeys.delete)}
                            </Button>
                        </div>
                        <FieldEditMulti
                            className="col-12"
                            label={''}
                            valueDefault={item.commentcontent}
                            disabled={true}
                        />
                    </div>
                ))}
                <div style={{ padding: "10px", margin: "10px" }}>
                    <div style={{ display: 'flex' }}>
                        <b style={{ width: '100%' }}>{t(langKeys.new)} {t(langKeys.invoicecomment)}</b>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type='button'
                            style={{ backgroundColor: "#55BD84" }}
                            onClick={() => handleCommentRegister()}
                        >{t(langKeys.save)}
                        </Button>
                    </div>
                    <FieldEditMulti
                        className="col-12"
                        label={''}
                        valueDefault={fields.commentcontent}
                        error={contentValidation}
                        onChange={(value) => {
                            const partialf = fields;
                            partialf.commentcontent = value;
                            setFields(partialf);
                        }}
                    />
                </div>
            </div>
        </DialogZyx>
    )
}

const IDREPORTINVOICE = "IDREPORTINVOICE";
const ReportInvoice: FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const mainAux2 = useSelector(state => state.main.mainAux2);
    const multiData = useSelector(state => state.main.multiData);
    const memoryTable = useSelector(state => state.main.memoryTable);
    const classes = useStyles()
    const [year, setYear] = useState(`${new Date().getFullYear()}`);
    const [currency, setCurrency] = useState("");
    const [location, setLocation] = useState("");
    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, columnid: null, edit: false });
    const [currencyList, setCurrencyList] = useState<any[]>([]);
    const [locationList, setLocationList] = useState<any[]>([]);
    const [gridDataCurrencyList, setGridDataCurrencyList] = useState<string[]>([]);
    const [gridData, setGridData] = useState<any>({});

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.client),
                accessor: 'corpdesc',
                NoFilter: true,
                Footer: () => {
                    return <>TOTAL</>
                },
            },
            {
                Header: t(langKeys.currency),
                accessor: 'currency',
                NoFilter: true,
            },
            {
                Header: t(langKeys.reportinvoice_location),
                accessor: 'location',
                NoFilter: true,
            },
            ...([...Array.from(Array(12).keys())].map((c, i) => ({
                Header: t((langKeys as any)[`month_${(String(i + 1)).padStart(2, '0')}`]),
                accessor: `month_${i + 1}`,
                type: 'number',
                sortType: 'number',
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    const column = props.cell.column.id;
                    const color = row[`color_${i + 1}`] || "gray"
                    return <span style={{ color: color }}>{formatCurrencyNoDecimals(row[column])}</span>
                },
                Footer: (props: any) => {
                    const total = React.useMemo(
                        () =>
                            props.rows.reduce((sum: any, row: any) => row.values[`month_${i + 1}`] + sum, 0),
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
        if (year) {
            dispatch(showBackdrop(true))
            dispatch(getCollectionAux2(
                getInvoiceReportSummary(
                    {
                        year: year,
                        currency: currency,
                        location: location,
                    }
                )
            ))
        }
        else {
            dispatch(showSnackbar({
                message: t(langKeys.xfield_ismissing, { field: t(langKeys.year) }),
                show: true,
                severity: "error"
            }));
        }
    }

    useEffect(() => {
        dispatch(showBackdrop(true));
        dispatch(getMultiCollection([
            getCurrencyList(),
            getValuesFromDomainCorp("BILLINGLOCATION", "_LOCATION", 1, 0),
        ]))
        dispatch(setMemoryTable({
            id: IDREPORTINVOICE
        }))
        return () => {
            dispatch(cleanMemoryTable());
            dispatch(resetMultiMain());
        }
    }, [])

    useEffect(() => {
        if (!mainAux2.loading) {
            setGridDataCurrencyList(Array.from(new Set((mainAux2?.data || []).map(item => item.currency))));
            const initialmonth = [...Array.from(Array(12).keys())].reduce((acc, item) => ({ ...acc, [`month_${item + 1}`]: 0, [`color_${item + 1}`]: 'black' }), {})
            setGridData(
                Object.values((mainAux2?.data || []).reduce((acc, item) => ({
                    ...acc,
                    [`corp_${item.corpid}_${item.currency}`]: acc[`corp_${item.corpid}_${item.currency}`] ? {
                        ...acc[`corp_${item.corpid}_${item.currency}`],
                        [`color_${item.month}`]: item.color,
                        [`month_${item.month}`]: item.totalamount,
                        total: acc[`corp_${item.corpid}_${item.currency}`].total + item.totalamount,

                    } : {
                        ...initialmonth,
                        corpid: item.corpid,
                        corpdesc: item.corpdesc,
                        currency: item.currency,
                        location: item.location,
                        [`color_${item.month}`]: item.color,
                        year: item.year,
                        [`month_${item.month}`]: item.totalamount,
                        total: item.totalamount,
                    }
                }), {})).reduce((acc, item) => ({
                    ...acc,
                    [item.currency]: [...(acc[item.currency] || []), item]
                }), {})
            )
            dispatch(showBackdrop(false));
        }
    }, [mainAux2])

    useEffect(() => {
        if (!multiData.loading) {
            setCurrencyList((multiData.data[0]?.data || []));
            setLocationList((multiData.data[1]?.data || []));
            dispatch(showBackdrop(false))
        }
    }, [multiData])

    const handleView = (row: Dictionary, columnid: string) => {
        setViewSelected("view-2");
        setRowSelected({ row, columnid, edit: false });
    }

    if (viewSelected === "view-1") {
        return (
            <React.Fragment>
                <div style={{ height: 10 }}></div>
                <div className={classes.containerHeader} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <FieldSelect
                            label={t(langKeys.year)}
                            style={{ width: 140 }}
                            variant="outlined"
                            valueDefault={year}
                            onChange={(value) => setYear(value?.value)}
                            data={dataYears}
                            optionDesc="value"
                            optionValue="value"
                        />
                        <FieldSelect
                            label={t(langKeys.reportinvoice_location)}
                            style={{ width: 200 }}
                            variant="outlined"
                            valueDefault={location}
                            onChange={(value) => setLocation(value?.domainvalue)}
                            data={locationList}
                            optionValue="domainvalue"
                            optionDesc="domaindesc"
                            orderbylabel={true}
                            prefixTranslation="billingfield_"
                            uset={true}
                        />
                        <FieldSelect
                            label={t(langKeys.currency)}
                            style={{ width: 140 }}
                            variant="outlined"
                            valueDefault={currency}
                            onChange={(value) => setCurrency(value?.code)}
                            data={currencyList}
                            optionValue="code"
                            optionDesc="code"
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
                {gridDataCurrencyList.map(crcy => {
                    return (
                        <TableZyx
                            key={crcy}
                            onClickRow={handleView}
                            columns={columns}
                            data={gridData[crcy]}
                            download={true}
                            filterGeneral={false}
                            loading={multiData.loading}
                            register={false}
                            useFooter={true}
                            pageSizeDefault={IDREPORTINVOICE === memoryTable.id ? memoryTable.pageSize === -1 ? 20 : memoryTable.pageSize : 20}
                            initialPageIndex={IDREPORTINVOICE === memoryTable.id ? memoryTable.page === -1 ? 0 : memoryTable.page : 0}
                            initialStateFilter={IDREPORTINVOICE === memoryTable.id ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value })) : undefined}
                        />
                    )
                })}
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