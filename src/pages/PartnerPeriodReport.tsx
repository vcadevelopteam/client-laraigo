import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { Fragment, useEffect, useState } from "react";
import { langKeys } from "lang/keys";
import React from "react";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { execute, exportData, getCollection, getMultiCollectionAux, resetAllMain } from "store/main/actions";
import { billingPeriodPartnerEnterprise, billingReportConsulting, billingReportConversationWhatsApp, billingReportHsmHistory, billingpersonreportsel, billinguserreportsel, customerByPartnerSel, formatNumber, formatNumberFourDecimals, formatNumberNoDecimals, getBillingPeriodCalcRefreshAll, getBillingPeriodSummarySel, getBillingPeriodSummarySelCorp, getOrgSelList, getValuesFromDomain } from "common/helpers";
import { reportPdf } from "network/service/culqi";
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, makeStyles, withStyles } from "@material-ui/core";
import { FieldSelect, FieldView } from "components";
import { Refresh, Search } from "@material-ui/icons";
import { DownloadIcon } from "icons";

const useStyles = makeStyles((theme) => ({
    title: {
        color: theme.palette.text.primary,
        fontSize: "22px",
    },
    container: {
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
    },
    containerField: {
        border: "1px solid #e1e1e1",
        borderRadius: theme.spacing(2),
        display: "flex",
        flex: "0 0 300px",
        flexDirection: "column",
        flexWrap: "wrap",
        gap: 16,
        padding: theme.spacing(2),
    },
    titleCard: {
        fontSize: 16,
        fontWeight: "bold",
    },
    button: {
        fontSize: "14px",
        fontWeight: 500,
        padding: 12,
        textTransform: "initial",
    },
    buttoncomments: {
        fontSize: "14px",
        fontWeight: 500,
        padding: 6,
        textTransform: "initial",
    },
    text: {
        fontSize: 15,
        fontWeight: 500,
    },
    imgContainer: {
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 20,
        display: "flex",
        height: 200,
        justifyContent: "center",
        width: 300,
    },
    img: {
        height: "100%",
        paddingTop: 10,
        width: "auto",
    },
    icon: {
        "&:hover": {
            color: theme.palette.primary.main,
            cursor: "pointer",
        },
    },
    containerDetail: {
        background: "#fff",
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
    },
    fieldsfilter: {
        width: 220,
    },
    transparent: {
        color: "transparent",
    },
    commentary: {
        fontStyle: "italic",
    },
    section: {
        fontWeight: "bold",
    },
}));

const StyledTableCell = withStyles((theme) => ({
    body: {
        fontSize: 14,
    },
    head: {
        color: theme.palette.common.white,
        backgroundColor: "#7721ad",
    },
}))(TableCell);

const StyledTableRow = withStyles(() => ({}))(TableRow);

const PartnerPeriodReport: React.FC<{ customSearch: any; multiResult: any; }> = ({
    customSearch,
    multiResult
}) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const el = React.useRef<null | HTMLDivElement>(null);
    const executeResult = useSelector((state) => state.main.execute);
    const mainResult = useSelector((state) => state.main);
    const exportResult = useSelector((state) => state.main.exportData);
    const culqiReportResult = useSelector((state) => state.culqi.requestReportPdf);
    const user = useSelector((state) => state.login.validateToken.user);

    const [dataMain, setdataMain] = useState({
        corpid: 0,
        orgid: 0,
        partnerid: 0,
        month: new Date().getMonth() + 1 ?? 9,
        year: new Date().getFullYear() ?? 2023,
        reporttype: '',
        username: 1,
        datetoshow: `${new Date(new Date().setDate(1)).getFullYear()}-${String(
            new Date(new Date().setDate(1)).getMonth() + 1
        ).padStart(2, "0")}`,
    });

    const [canSearch, setCanSearch] = useState(false);
    const [dataReport, setDataReport] = useState<any>([]);
    const [dataAux, setDataAux] = useState<any>([]);
    const [waitCalculate, setWaitCalculate] = useState(false);
    const [waitExport, setWaitExport] = useState(false);
    const [waitPdf, setWaitPdf] = useState(false);
    const [waitSearch, setWaitSearch] = useState(false);

    function handleDateChange(e: any) {
        if (e !== "") {
            let datetochange = new Date(e + "-02");
            let mes = datetochange?.getMonth() + 1;
            let year = datetochange?.getFullYear();
            let datetoshow = `${year}-${String(mes).padStart(2, "0")}`;
            setdataMain((prev) => ({...prev, datetoshow, month: mes, year: year}))
        }
    }

    function search() {
        dispatch(showBackdrop(true));
        dispatch(getCollection(billingPeriodPartnerEnterprise(dataMain)));
        //dispatch(getCollection(billingPeriodPartnerEnterprise({partnerid: 1, corpid: 556, orgid: 1214, year: 2023, month: 9, reporttype: '', username: 1})));
        setCanSearch(false)
    }

    useEffect(() => {
        search();
    }, []);

    useEffect(() => {
        if (dataMain) {
            if(dataMain.reporttype != '') {
                setCanSearch(true)
            }
            else if(dataMain.reporttype == '') {
                setCanSearch(false)
            }
        }
    }, [dataMain]);

    useEffect(() => {
        if (waitSearch) {
            setWaitSearch(false);
            search();
        }
    }, [dataMain, waitSearch]);

    useEffect(() => {
        if (!mainResult.mainData.loading) {
            debugger
            
            if (mainResult.mainData.data.length) {
                setDataReport(mainResult.mainData.data[0]);
                setDataAux(mainResult.mainData.data);
            } else {
                setDataReport(null);
                setDataAux(null);
            }
            dispatch(showBackdrop(false));
        }
    }, [mainResult.mainData]);

    console.log(dataAux)

    useEffect(() => {
        if (waitCalculate) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_calculate) }));
                dispatch(showBackdrop(false));
                setWaitCalculate(false);
                search();
            } else if (executeResult.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(executeResult.code ?? "error_unexpected_error", {
                            module: t(langKeys.tipification).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitCalculate(false);
            }
        }
    }, [executeResult, waitCalculate]);

    useEffect(() => {
        if (waitExport) {
            if (!exportResult.loading && !exportResult.error) {
                dispatch(showBackdrop(false));
                setWaitExport(false);
                window.open(exportResult.url, "_blank");
            } else if (exportResult.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(exportResult.code ?? "error_unexpected_error", {
                            module: t(langKeys.person).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitExport(false);
            }
        }
    }, [exportResult, waitExport]);

    useEffect(() => {
        if (waitPdf) {
            if (!culqiReportResult.loading && !culqiReportResult.error) {
                dispatch(showBackdrop(false));
                setWaitPdf(false);
                if (culqiReportResult.datacard) {
                    window.open(culqiReportResult.datacard, "_blank");
                }
            } else if (culqiReportResult.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(culqiReportResult.code ?? "error_unexpected_error", {
                            module: t(langKeys.person).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitPdf(false);
            }
        }
    }, [culqiReportResult, waitPdf]);

    console.log(dataMain)

    return (
        <Fragment>
            <div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <TextField
                        className={classes.fieldsfilter}
                        id="date"
                        onChange={(e) => handleDateChange(e.target.value)}
                        size="small"
                        type="month"
                        value={dataMain.datetoshow}
                        variant="outlined"
                    />
                    <FieldSelect
                        className={classes.fieldsfilter}
                        data={(multiResult.data[5].data||[])}
                        label={t(langKeys.client)}
                        onChange={(value) => {
                            value ? setdataMain((prev) => ({ ...prev, corpid: value.corpid, orgid: value.orgid, partnerid: value.partnerid })) :
                            setdataMain((prev) => ({...prev, corpid: 0, orgid: 0}))
                        }}
                        optionDesc="organization"
                        optionValue="orgid"
                        orderbylabel={true}
                        variant="outlined"
                    />
                    <FieldSelect
                        className={classes.fieldsfilter}
                        label={t(langKeys.type)}
                        onChange={(value) => {
                            value?.domainvalue ? setdataMain((prev) => ({ ...prev, reporttype: value?.domainvalue })) :
                            setdataMain((prev) => ({ ...prev, reporttype: '' }))
                        }}
                        optionDesc="domaindesc"
                        optionValue="domainvalue"
                        orderbylabel={true}
                        variant="outlined"
                        data={(multiResult.data[6].data||[])}
                    />
                    <Button
                        color="primary"
                        disabled={mainResult.mainData.loading || !canSearch}
                        onClick={() => search()}
                        startIcon={<Search style={{ color: "white" }} />}
                        style={{ width: 120, backgroundColor: "#55BD84" }}
                        variant="contained"
                    >
                        {t(langKeys.search)}
                    </Button>
                </div>
            </div>
            {!mainResult.mainData.loading && (
                <div style={{ width: "100%" }} ref={el}>
                    {dataReport && (
                        <div className={classes.containerDetail}>
                            <div className="row-zyx">
                                <FieldView
                                    className="col-6"
                                    label={t(langKeys.partner)}
                                    value={dataReport.company}
                                />
                            </div>
                            <div className="row-zyx">
                                <FieldView
                                    className="col-6"
                                    label={t(langKeys.partnertype)}
                                    value={dataReport.typepartner === 'DEVELOPER' || dataReport.typepartner === 'RESELLER' ? 'DEVELOPER / RESELLER' : 'ENTERPRISE'}
                                />
                            </div>
                            <div className="row-zyx">
                                <FieldView 
                                    className="col-6"
                                    label={t(langKeys.billingplan)}
                                    value={dataReport.billingplan}
                                />
                            </div>
                            <div className="row-zyx">
                                <FieldView
                                    className="col-6"
                                    label={t(langKeys.period)}
                                    value={`${dataReport.year} - ${String(dataReport.month).padStart(2, "0")}`}
                                />
                            </div>
                            { dataReport.typepartner === 'ENTERPRISE' && (
                                <TableContainer component={Paper} style={{ overflow: "hidden" }}>
                                    <Table aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="left">
                                                    {t(langKeys.billingreportitem)}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    {t(langKeys.billingreportquantity)}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    {t(langKeys.billingreportrate)}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    {t(langKeys.billingreporttaxableamount)}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    {t(langKeys.billingreporttaxableiva)}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    {t(langKeys.billingreportamount)}
                                                </StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <StyledTableRow>
                                                <StyledTableCell>
                                                    <b>{t(langKeys.basecost)}</b>
                                                </StyledTableCell>
                                                <StyledTableCell></StyledTableCell>
                                                <StyledTableCell></StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.symbol
                                                    }${formatNumber(
                                                        dataAux.reduce((accumulator:number, item:any) => accumulator + parseFloat(item.billingplanfee), 0) / dataReport.tax_costneto
                                                    )}`}</StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.symbol
                                                    }${formatNumber(
                                                        dataAux.reduce((accumulator:number, item:any) => accumulator + parseFloat(item.billingplanfee), 0) -
                                                        dataAux.reduce((accumulator:number, item:any) => accumulator + parseFloat(item.billingplanfee), 0) / dataReport.tax_costneto
                                                    )}`}</StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.symbol
                                                    }${formatNumber(
                                                        dataAux.reduce((accumulator:number, item:any) => accumulator + parseFloat(item.billingplanfee), 0)
                                                    )}`}</StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <StyledTableCell>
                                                    <b>{t(langKeys.othercosts)}</b>
                                                </StyledTableCell>
                                                <StyledTableCell></StyledTableCell>
                                                <StyledTableCell></StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.symbol
                                                    }${formatNumber(
                                                        dataAux.reduce((accumulator:number, item:any) => accumulator + parseFloat(item.othercost), 0) / dataReport.tax_costneto
                                                    )}`}</StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.symbol
                                                    }${formatNumber(
                                                        dataAux.reduce((accumulator:number, item:any) => accumulator + parseFloat(item.othercost), 0) -
                                                        dataAux.reduce((accumulator:number, item:any) => accumulator + parseFloat(item.othercost), 0) / dataReport.tax_costneto
                                                    )}`}</StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.symbol
                                                    }${formatNumber(
                                                        dataAux.reduce((accumulator:number, item:any) => accumulator + parseFloat(item.othercost), 0)
                                                    )}`}</StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <StyledTableCell>
                                                    <div>
                                                        <b>{t(langKeys.contacts)}</b>
                                                    </div>
                                                    {dataAux.map((item:any, index:number) => (
                                                        <div key={index}>{t(langKeys.totalcontacts)} {item.orgdescription}</div>
                                                    ))}
                                                    <div>
                                                        <b>{t(langKeys.totalcontacts)}</b>
                                                    </div>
                                                    <div>{t(langKeys.partnercontacts)}</div>
                                                    { dataReport.typecalculation === 'Por contacto' &&(
                                                        <div>
                                                            <b>{t(langKeys.additionalcontacts)}</b>
                                                        </div>
                                                    )}
                                                    { dataReport.typecalculation === 'Por bolsa' && (
                                                        <div>
                                                            <b>{t(langKeys.additionalcontactsperbag)} ({dataReport.contactsadditionalbag})</b>
                                                        </div>
                                                    )}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    {dataAux.map((item:any, index:number) => (
                                                        <div key={index}>{formatNumberNoDecimals(item.contactuniquequantity)}</div>
                                                    ))}
                                                    <div>
                                                        {formatNumberNoDecimals(dataReport.contactuniquequantity)}
                                                    </div>
                                                    <div>
                                                        {formatNumberNoDecimals(dataReport.contactuniquequantity)}
                                                    </div>
                                                    { dataReport.typecalculation === 'Por contacto' &&(
                                                        <div>
                                                            {formatNumberNoDecimals(dataReport.contactsadditionalbag)}
                                                        </div>
                                                    )}
                                                    { dataReport.typecalculation === 'Por bolsa' && (
                                                        <div>
                                                            {Math.ceil(dataReport.contactsadditionalbag / dataReport.numbercontactsbag)}
                                                        </div>
                                                    )}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    {dataAux.map((item:any, index:number) => (
                                                        <div style={{ color: "transparent" }} key={index}>.</div>
                                                    ))}
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    { dataReport.typecalculation === 'Por contacto' &&(
                                                        <div>{`${dataReport.symbol}${formatNumber(
                                                            dataReport.puadditionalcontacts
                                                        )}`}</div>
                                                    )}
                                                    { dataReport.typecalculation === 'Por bolsa' && (
                                                        <div>{`${dataReport.symbol}${formatNumber(
                                                            dataReport.priceperbag
                                                        )}`}</div>
                                                    )}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    {dataAux.map((item:any, index:number) => (
                                                        <div style={{ color: "transparent" }} key={index}>.</div>
                                                    ))}
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    { dataReport.typecalculation === 'Por contacto' &&(
                                                        <div>{`${dataReport.symbol}${formatNumber(
                                                            dataReport.contactuniquequantity * dataReport.puadditionalcontacts
                                                        )}`}</div>
                                                    )}
                                                    { dataReport.typecalculation === 'Por bolsa' && (
                                                        <div>{`${dataReport.symbol}${formatNumber(
                                                            Math.ceil(dataReport.contactsadditionalbag / dataReport.numbercontactsbag) * dataReport.priceperbag
                                                        )}`}</div>
                                                    )}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    {dataAux.map((item:any, index:number) => (
                                                        <div style={{ color: "transparent" }} key={index}>.</div>
                                                    ))}
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    { dataReport.typecalculation === 'Por contacto' &&(
                                                        <div>{`${dataReport.symbol}${formatNumber(
                                                            dataReport.contactuniquequantity * dataReport.puadditionalcontacts * dataReport.tax
                                                        )}`}</div>
                                                    )}
                                                    { dataReport.typecalculation === 'Por bolsa' && (
                                                        <div>{`${dataReport.symbol}${formatNumber(
                                                            (Math.ceil(dataReport.contactsadditionalbag / dataReport.numbercontactsbag) * dataReport.priceperbag) * dataReport.tax
                                                        )}`}</div>
                                                    )}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    {dataAux.map((item:any, index:number) => (
                                                        <div style={{ color: "transparent" }} key={index}>.</div>
                                                    ))}
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    { dataReport.typecalculation === 'Por contacto' &&(
                                                        <div>{`${dataReport.symbol}${formatNumber(
                                                            dataReport.contactuniquequantity * dataReport.puadditionalcontacts * dataReport.tax_costneto
                                                        )}`}</div>
                                                    )}
                                                    { dataReport.typecalculation === 'Por bolsa' && (
                                                        <div>{`${dataReport.symbol}${formatNumber(
                                                            (Math.ceil(dataReport.contactsadditionalbag / dataReport.numbercontactsbag) * dataReport.priceperbag) * dataReport.tax_costneto
                                                        )}`}</div>
                                                    )}
                                                </StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <StyledTableCell>
                                                    <b>{t(langKeys.periodamount)}</b>
                                                </StyledTableCell>
                                                <StyledTableCell></StyledTableCell>
                                                <StyledTableCell></StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.symbol
                                                    }${
                                                        dataReport.typecalculation === 'Por contacto' ?
                                                        formatNumber(
                                                            (dataAux.reduce((accumulator:number, item:any) => accumulator + parseFloat(item.billingplanfee), 0) / dataReport.tax_costneto) +
                                                            (dataAux.reduce((accumulator:number, item:any) => accumulator + parseFloat(item.othercost), 0) / dataReport.tax_costneto) +
                                                            (dataReport.contactuniquequantity * dataReport.puadditionalcontacts)
                                                        ) : 
                                                        formatNumber(
                                                            (dataAux.reduce((accumulator:number, item:any) => accumulator + parseFloat(item.billingplanfee), 0) / dataReport.tax_costneto) +
                                                            (dataAux.reduce((accumulator:number, item:any) => accumulator + parseFloat(item.othercost), 0) / dataReport.tax_costneto) +
                                                            (Math.ceil(dataReport.contactsadditionalbag / dataReport.numbercontactsbag) * dataReport.priceperbag)
                                                        )
                                                    }`}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.symbol
                                                    }${
                                                        dataReport.typecalculation === 'Por contacto' ?
                                                        formatNumber(
                                                            (dataAux.reduce((accumulator:number, item:any) => accumulator + parseFloat(item.billingplanfee), 0) -
                                                            dataAux.reduce((accumulator:number, item:any) => accumulator + parseFloat(item.billingplanfee), 0) / dataReport.tax_costneto) +
                                                            (dataAux.reduce((accumulator:number, item:any) => accumulator + parseFloat(item.othercost), 0) -
                                                            dataAux.reduce((accumulator:number, item:any) => accumulator + parseFloat(item.othercost), 0) / dataReport.tax_costneto) +
                                                            (dataReport.contactuniquequantity * dataReport.puadditionalcontacts * dataReport.tax)
                                                        ) : 
                                                        formatNumber(
                                                            (dataAux.reduce((accumulator:number, item:any) => accumulator + parseFloat(item.billingplanfee), 0) -
                                                            dataAux.reduce((accumulator:number, item:any) => accumulator + parseFloat(item.billingplanfee), 0) / dataReport.tax_costneto) +
                                                            (dataAux.reduce((accumulator:number, item:any) => accumulator + parseFloat(item.othercost), 0) -
                                                            dataAux.reduce((accumulator:number, item:any) => accumulator + parseFloat(item.othercost), 0) / dataReport.tax_costneto) +
                                                            (dataReport.numbercontactsbag * dataReport.priceperbag * dataReport.tax)
                                                        )
                                                    }`}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.symbol
                                                    }${
                                                        dataReport.typecalculation === 'Por contacto' ?
                                                        formatNumber(
                                                            dataAux.reduce((accumulator:number, item:any) => accumulator + parseFloat(item.billingplanfee), 0) +
                                                            dataAux.reduce((accumulator:number, item:any) => accumulator + parseFloat(item.othercost), 0) +
                                                            (dataReport.contactuniquequantity * dataReport.puadditionalcontacts * dataReport.tax_costneto)
                                                        ) : 
                                                        formatNumber(
                                                            dataAux.reduce((accumulator:number, item:any) => accumulator + parseFloat(item.billingplanfee), 0) +
                                                            dataAux.reduce((accumulator:number, item:any) => accumulator + parseFloat(item.othercost), 0) +
                                                            (dataReport.numbercontactsbag * dataReport.priceperbag * dataReport.tax_costneto)
                                                        )
                                                    }`}
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                            { dataReport.typepartner === 'RESELLER' || dataReport.typepartner === 'DEVELOPER' && (
                                <TableContainer component={Paper} style={{ overflow: "hidden" }}>
                                    <Table aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="left">
                                                    {t(langKeys.billingreportitem)}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {t(langKeys.type).toUpperCase()}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    {t(langKeys.applicablediscountamount).toUpperCase()}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    {t(langKeys.percentage).toUpperCase()}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    {t(langKeys.amountwithmembershipdiscount).toUpperCase()}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    {t(langKeys.amountnotapplicabletodiscount).toUpperCase()}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    {t(langKeys.totalamount).toUpperCase()}
                                                </StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {dataAux.map((item:any, index:number) => (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell>
                                                        <div>{item.orgdescription}</div>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="right">
                                                        <div>
                                                            <b>{item.typepartner}</b>
                                                        </div>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="right">
                                                        <div>{`${item.symbol}${formatNumber(
                                                            item.billingplanfee
                                                        )}`}</div>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="right">
                                                        <div>{`${formatNumber(
                                                            100 - item.comissionpercentage
                                                        )}%`}</div>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="right">
                                                        <div>{`${item.symbol}${formatNumber(
                                                            item.billingplanfee * ((100 - item.comissionpercentage) / 100)
                                                        )}`}</div>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="right">
                                                        <div>{`${item.symbol}${formatNumber(
                                                            item.othercost
                                                        )}`}</div>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="right">
                                                        <div>{`${item.symbol}${formatNumber(
                                                            (item.billingplanfee * ((100 - item.comissionpercentage) / 100)) + parseFloat(item.othercost)
                                                        )}`}</div>
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                            <StyledTableRow>
                                                <StyledTableCell>
                                                    <b>{t(langKeys.periodamount)}</b>
                                                </StyledTableCell>
                                                <StyledTableCell></StyledTableCell>
                                                <StyledTableCell></StyledTableCell>
                                                <StyledTableCell></StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.symbol
                                                    }${formatNumber(
                                                        dataAux.reduce((accumulator:number, item:any) => accumulator + (parseFloat(item.billingplanfee) * ((100 - item.comissionpercentage) / 100)), 0)
                                                    )}`}</StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.symbol
                                                    }${formatNumber(
                                                        dataAux.reduce((accumulator:number, item:any) => accumulator + parseFloat(item.othercost), 0)
                                                    )}`}</StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.symbol
                                                    }${formatNumber(
                                                        dataAux.reduce((accumulator:number, item:any) => accumulator + ((parseFloat(item.billingplanfee) * ((100 - item.comissionpercentage) / 100)) + parseFloat(item.othercost)), 0)
                                                    )}`}</StyledTableCell>
                                            </StyledTableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </div>
                    )}
                    {!dataReport && (
                        <div className={classes.containerDetail}>
                            <div className="row-zyx">
                                <FieldView className="col-6" label={""} value={t(langKeys.billingperiodnotfound)} />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Fragment>
    );
};

export default PartnerPeriodReport;