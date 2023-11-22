import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { Fragment, useEffect, useState } from "react";
import { langKeys } from "lang/keys";
import React from "react";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { getCollection, getMultiCollectionAux } from "store/main/actions";
import {
    billingPeriodPartnerDeveloperReseller,
    billingPeriodPartnerEnterprise,
    formatNumber,
    formatNumberNoDecimals,
    getValuesFromDomain,
    partnerSel,
} from "common/helpers";
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    makeStyles,
    withStyles,
} from "@material-ui/core";
import { FieldSelect, FieldView } from "components";
import { Search } from "@material-ui/icons";
import { Dictionary } from "@types";

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        background: "#fff",
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
    },
    fieldsfilter: {
        width: 220,
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

const PartnerPeriodReport: React.FC = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const el = React.useRef<null | HTMLDivElement>(null);
    const executeResult = useSelector((state) => state.main.execute);
    const mainResult = useSelector((state) => state.main);
    const exportResult = useSelector((state) => state.main.exportData);
    const culqiReportResult = useSelector((state) => state.culqi.requestReportPdf);
    const multiResultAux = useSelector((state) => state.main.multiDataAux);

    const [dataMain, setdataMain] = useState({
        corpid: 0,
        orgid: 0,
        partnerid: 0,
        month: new Date().getMonth() + 1 ?? 9,
        year: new Date().getFullYear() ?? 2023,
        reporttype: "",
        username: 1,
        datetoshow: `${new Date(new Date().setDate(1)).getFullYear()}-${String(
            new Date(new Date().setDate(1)).getMonth() + 1
        ).padStart(2, "0")}`,
    });

    const [isEnterprise, setIsEnterprise] = useState(false);
    const [canSearch, setCanSearch] = useState(false);
    const [dataReport, setDataReport] = useState<Dictionary>([]);
    const [dataAux, setDataAux] = useState<Dictionary>([]);
    const [waitCalculate, setWaitCalculate] = useState(false);
    const [waitExport, setWaitExport] = useState(false);
    const [waitPdf, setWaitPdf] = useState(false);
    const [waitSearch, setWaitSearch] = useState(false);

    function handleDateChange(e: string) {
        if (e !== "") {
            const datetochange = new Date(e + "-02");
            const mes = datetochange?.getMonth() + 1;
            const year = datetochange?.getFullYear();
            const datetoshow = `${year}-${String(mes).padStart(2, "0")}`;
            setdataMain((prev) => ({ ...prev, datetoshow, month: mes, year: year }));
        }
    }

    function search() {
        if (isEnterprise) {
            dispatch(showBackdrop(true));
            dispatch(getCollection(billingPeriodPartnerEnterprise(dataMain)));
            setCanSearch(false);
        } else {
            dispatch(showBackdrop(true));
            dispatch(getCollection(billingPeriodPartnerDeveloperReseller(dataMain)));
            setCanSearch(false);
        }
    }

    useEffect(() => {
        dispatch(getMultiCollectionAux([partnerSel({ id: 0, all: true }), getValuesFromDomain("TIPOSSOCIOS")]));
    }, []);

    useEffect(() => {
        search();
    }, []);

    useEffect(() => {
        if (dataMain) {
            if (dataMain.reporttype !== "" && dataMain.partnerid !== 0) {
                setCanSearch(true);
            } else if (dataMain.reporttype === "" || dataMain.partnerid === 0) {
                setCanSearch(false);
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
            if (mainResult.mainData.data.length) {
                setDataReport(mainResult.mainData.data[0]);
                setDataAux(mainResult.mainData.data);
            } else {
                setDataReport({});
                setDataAux({});
            }
            dispatch(showBackdrop(false));
        }
    }, [mainResult.mainData]);

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
                        data={multiResultAux?.data?.[0]?.data || []}
                        label={t(langKeys.partner)}
                        onChange={(value) => {
                            if (value) {
                                setIsEnterprise(value.enterprisepartner);
                                setdataMain((prev) => ({ ...prev, partnerid: value.partnerid }));
                                if (!value.enterprisepartner) {
                                    setdataMain((prev) => ({ ...prev, reporttype: "DEVELOPER" }));
                                }
                            } else {
                                setdataMain((prev) => ({ ...prev, partnerid: 0 }));
                            }
                        }}
                        valueDefault={dataMain.partnerid}
                        optionDesc="company"
                        optionValue="partnerid"
                        orderbylabel={true}
                        variant="outlined"
                    />
                    <FieldSelect
                        className={classes.fieldsfilter}
                        label={t(langKeys.type)}
                        onChange={(value) => {
                            if (value?.domainvalue) {
                                setdataMain((prev) => ({ ...prev, reporttype: value.domainvalue }));
                            } else {
                                setdataMain((prev) => ({ ...prev, reporttype: "" }));
                            }
                        }}
                        valueDefault={dataMain.reporttype}
                        optionDesc="domaindesc"
                        optionValue="domainvalue"
                        orderbylabel={true}
                        variant="outlined"
                        disabled={!isEnterprise}
                        data={[
                            { domainvalue: "ENTERPRISE", domaindesc: "ENTERPRISE" },
                            { domainvalue: "DEVELOPER", domaindesc: "DEVELOPER/RESELLER" },
                        ]}
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
                    {Object.keys(dataReport).length > 0 ? (
                        <div className={classes.containerDetail}>
                            <div className="row-zyx">
                                <FieldView className="col-6" label={t(langKeys.partner)} value={dataReport.company} />
                            </div>
                            <div className="row-zyx">
                                <FieldView
                                    className="col-6"
                                    label={t(langKeys.partnertype)}
                                    value={
                                        dataReport.typepartner === "DEVELOPER" || dataReport.typepartner === "RESELLER"
                                            ? "DEVELOPER / RESELLER"
                                            : "ENTERPRISE"
                                    }
                                />
                            </div>
                            <div className="row-zyx">
                                <FieldView
                                    className="col-6"
                                    label={t(langKeys.period)}
                                    value={`${dataReport.year} - ${String(dataReport.month).padStart(2, "0")}`}
                                />
                            </div>
                            {dataReport.typepartner === "ENTERPRISE" && (
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
                                                <StyledTableCell align="right">{`${dataReport.symbol}${formatNumber(
                                                    parseFloat(dataReport.billingplanfee)
                                                )}`}</StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.symbol}${formatNumber(
                                                    parseFloat(dataReport.billingplanfee) * dataReport.tax
                                                )}`}</StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.symbol}${formatNumber(
                                                    parseFloat(dataReport.billingplanfee) * dataReport.tax_costneto
                                                )}`}</StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <StyledTableCell>
                                                    <div>
                                                        <b>{t(langKeys.contacts)}</b>
                                                    </div>
                                                    {dataAux.map((item: Dictionary, index: number) => (
                                                        <div key={index}>
                                                            {t(langKeys.totalcontacts)} {item.orgdescription}
                                                        </div>
                                                    ))}
                                                    <div>
                                                        <b>{t(langKeys.totalcontacts)}</b>
                                                    </div>
                                                    <div>{t(langKeys.partnercontacts)}</div>
                                                    {dataReport.typecalculation === "Por contacto" && (
                                                        <div>
                                                            <b>{t(langKeys.additionalcontacts)}</b>
                                                        </div>
                                                    )}
                                                    {dataReport.typecalculation === "Por bolsa" && (
                                                        <div>
                                                            <b>
                                                                {t(langKeys.additionalcontactsperbag)} (
                                                                {dataReport.numbercontactsbag})
                                                            </b>
                                                        </div>
                                                    )}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    {dataAux.map((item: Dictionary, index: number) => (
                                                        <div key={index}>
                                                            {formatNumberNoDecimals(item.contactuniquequantity)}
                                                        </div>
                                                    ))}
                                                    <div>
                                                        {formatNumberNoDecimals(
                                                            dataAux.reduce(
                                                                (accumulator: number, item: Dictionary) =>
                                                                    accumulator + item.contactuniquequantity,
                                                                0
                                                            )
                                                        )}
                                                    </div>
                                                    <div>{dataReport.contactuniquelimit}</div>
                                                    {dataReport.typecalculation === "Por contacto" && (
                                                        <div>
                                                            {Math.max(
                                                                0,
                                                                dataAux.reduce(
                                                                    (accumulator: number, item: Dictionary) =>
                                                                        accumulator + item.contactuniquequantity,
                                                                    0
                                                                ) - parseFloat(dataReport.contactuniquelimit)
                                                            )}
                                                        </div>
                                                    )}
                                                    {dataReport.typecalculation === "Por bolsa" && (
                                                        <div>
                                                            {Math.ceil(
                                                                Math.max(
                                                                    0,
                                                                    dataAux.reduce(
                                                                        (accumulator: number, item: Dictionary) =>
                                                                            accumulator + item.contactuniquequantity,
                                                                        0
                                                                    ) - parseFloat(dataReport.contactuniquelimit)
                                                                ) / dataReport.numbercontactsbag
                                                            )}
                                                        </div>
                                                    )}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    {dataAux.map((index: number) => (
                                                        <div style={{ color: "transparent" }} key={index}>
                                                            .
                                                        </div>
                                                    ))}
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    {dataReport.typecalculation === "Por contacto" && (
                                                        <div>{`${dataReport.symbol}${formatNumber(
                                                            dataReport.puadditionalcontacts
                                                        )}`}</div>
                                                    )}
                                                    {dataReport.typecalculation === "Por bolsa" && (
                                                        <div>{`${dataReport.symbol}${formatNumber(
                                                            dataReport.priceperbag
                                                        )}`}</div>
                                                    )}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    {dataAux.map((index: number) => (
                                                        <div style={{ color: "transparent" }} key={index}>
                                                            .
                                                        </div>
                                                    ))}
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    {dataReport.typecalculation === "Por contacto" && (
                                                        <div>{`${dataReport.symbol}${formatNumber(
                                                            Math.max(
                                                                0,
                                                                dataAux.reduce(
                                                                    (accumulator: number, item: Dictionary) =>
                                                                        accumulator + item.contactuniquequantity,
                                                                    0
                                                                ) - parseFloat(dataReport.contactuniquelimit)
                                                            ) * dataReport.puadditionalcontacts
                                                        )}`}</div>
                                                    )}
                                                    {dataReport.typecalculation === "Por bolsa" && (
                                                        <div>{`${dataReport.symbol}${formatNumber(
                                                            Math.ceil(
                                                                Math.max(
                                                                    0,
                                                                    dataAux.reduce(
                                                                        (accumulator: number, item: Dictionary) =>
                                                                            accumulator + item.contactuniquequantity,
                                                                        0
                                                                    ) - parseFloat(dataReport.contactuniquelimit)
                                                                ) / dataReport.numbercontactsbag
                                                            ) * dataReport.priceperbag
                                                        )}`}</div>
                                                    )}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    {dataAux.map((index: number) => (
                                                        <div style={{ color: "transparent" }} key={index}>
                                                            .
                                                        </div>
                                                    ))}
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    {dataReport.typecalculation === "Por contacto" && (
                                                        <div>{`${dataReport.symbol}${formatNumber(
                                                            Math.max(
                                                                0,
                                                                dataAux.reduce(
                                                                    (accumulator: number, item: Dictionary) =>
                                                                        accumulator + item.contactuniquequantity,
                                                                    0
                                                                ) - parseFloat(dataReport.contactuniquelimit)
                                                            ) *
                                                                dataReport.puadditionalcontacts *
                                                                dataReport.tax
                                                        )}`}</div>
                                                    )}
                                                    {dataReport.typecalculation === "Por bolsa" && (
                                                        <div>{`${dataReport.symbol}${formatNumber(
                                                            Math.ceil(
                                                                Math.max(
                                                                    0,
                                                                    dataAux.reduce(
                                                                        (accumulator: number, item: Dictionary) =>
                                                                            accumulator + item.contactuniquequantity,
                                                                        0
                                                                    ) - parseFloat(dataReport.contactuniquelimit)
                                                                ) / dataReport.numbercontactsbag
                                                            ) *
                                                                dataReport.priceperbag *
                                                                dataReport.tax
                                                        )}`}</div>
                                                    )}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    {dataAux.map((index: number) => (
                                                        <div style={{ color: "transparent" }} key={index}>
                                                            .
                                                        </div>
                                                    ))}
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    {dataReport.typecalculation === "Por contacto" && (
                                                        <div>{`${dataReport.symbol}${formatNumber(
                                                            Math.max(
                                                                0,
                                                                dataAux.reduce(
                                                                    (accumulator: number, item: Dictionary) =>
                                                                        accumulator + item.contactuniquequantity,
                                                                    0
                                                                ) - parseFloat(dataReport.contactuniquelimit)
                                                            ) *
                                                                dataReport.puadditionalcontacts *
                                                                dataReport.tax_costneto
                                                        )}`}</div>
                                                    )}
                                                    {dataReport.typecalculation === "Por bolsa" && (
                                                        <div>{`${dataReport.symbol}${formatNumber(
                                                            Math.ceil(
                                                                Math.max(
                                                                    0,
                                                                    dataAux.reduce(
                                                                        (accumulator: number, item: Dictionary) =>
                                                                            accumulator + item.contactuniquequantity,
                                                                        0
                                                                    ) - parseFloat(dataReport.contactuniquelimit)
                                                                ) / dataReport.numbercontactsbag
                                                            ) *
                                                                dataReport.priceperbag *
                                                                dataReport.tax_costneto
                                                        )}`}</div>
                                                    )}
                                                </StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <StyledTableCell>
                                                    <b>{t(langKeys.othercosts)}</b>
                                                </StyledTableCell>
                                                <StyledTableCell></StyledTableCell>
                                                <StyledTableCell></StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.symbol}${formatNumber(
                                                    dataAux.reduce(
                                                        (accumulator: number, item: Dictionary) =>
                                                            accumulator + (parseFloat(item.othercost) / item.tax_costneto),
                                                        0
                                                    )
                                                )}`}</StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.symbol}${formatNumber(
                                                    dataAux.reduce(
                                                        (accumulator: number, item: Dictionary) =>
                                                            accumulator + (parseFloat(item.othercost) / item.tax_costneto * item.tax),
                                                        0
                                                    )
                                                )}`}</StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.symbol}${formatNumber(
                                                    dataAux.reduce(
                                                        (accumulator: number, item: Dictionary) =>
                                                            accumulator + parseFloat(item.othercost),
                                                        0
                                                    )
                                                )}`}</StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <StyledTableCell>
                                                    <b>{t(langKeys.periodamount)}</b>
                                                </StyledTableCell>
                                                <StyledTableCell></StyledTableCell>
                                                <StyledTableCell></StyledTableCell>
                                                <StyledTableCell align="right">
                                                    {`${dataReport.symbol}${
                                                        dataReport.typecalculation === "Por contacto"
                                                            ? formatNumber(
                                                                parseFloat(dataReport.billingplanfee) +
                                                                dataAux.reduce(
                                                                    (accumulator: number, item: Dictionary) =>
                                                                        accumulator + (parseFloat(item.othercost) / item.tax_costneto),
                                                                    0
                                                                ) +
                                                                Math.max(
                                                                    0,
                                                                    dataAux.reduce(
                                                                        (accumulator: number, item: Dictionary) =>
                                                                            accumulator +
                                                                            item.contactuniquequantity,
                                                                        0
                                                                    ) - parseFloat(dataReport.contactuniquelimit)
                                                                ) * dataReport.puadditionalcontacts
                                                            )
                                                            : formatNumber(
                                                                parseFloat(dataReport.billingplanfee) +
                                                                dataAux.reduce(
                                                                    (accumulator: number, item: Dictionary) =>
                                                                        accumulator + (parseFloat(item.othercost) / item.tax_costneto),
                                                                    0
                                                                ) +
                                                                Math.ceil(
                                                                    Math.max(
                                                                        0,
                                                                        dataAux.reduce(
                                                                            (accumulator: number, item: Dictionary) =>
                                                                                accumulator +
                                                                                item.contactuniquequantity,
                                                                            0
                                                                        ) -
                                                                            parseFloat(
                                                                                dataReport.contactuniquelimit
                                                                            )
                                                                    ) / dataReport.numbercontactsbag
                                                                ) * dataReport.priceperbag
                                                            )
                                                    }`}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    {`${dataReport.symbol}${
                                                        dataReport.typecalculation === "Por contacto"
                                                            ? formatNumber(
                                                                parseFloat(dataReport.billingplanfee) * dataReport.tax +
                                                                dataAux.reduce(
                                                                    (accumulator: number, item: Dictionary) =>
                                                                        accumulator + (parseFloat(item.othercost) / item.tax_costneto * item.tax),
                                                                    0
                                                                ) +
                                                                Math.max(
                                                                    0,
                                                                    dataAux.reduce(
                                                                        (accumulator: number, item: Dictionary) =>
                                                                            accumulator +
                                                                            item.contactuniquequantity,
                                                                        0
                                                                    ) - parseFloat(dataReport.contactuniquelimit)
                                                                ) * dataReport.puadditionalcontacts * dataReport.tax
                                                            )
                                                            : formatNumber(
                                                                parseFloat(dataReport.billingplanfee) * dataReport.tax +
                                                                dataAux.reduce(
                                                                    (accumulator: number, item: Dictionary) =>
                                                                        accumulator + (parseFloat(item.othercost) / item.tax_costneto * item.tax),
                                                                    0
                                                                ) +
                                                                Math.ceil(
                                                                    Math.max(
                                                                        0,
                                                                        dataAux.reduce(
                                                                            (accumulator: number, item: Dictionary) =>
                                                                                accumulator +
                                                                                item.contactuniquequantity,
                                                                            0
                                                                        ) -
                                                                            parseFloat(
                                                                                dataReport.contactuniquelimit
                                                                            )
                                                                    ) / dataReport.numbercontactsbag
                                                                ) * dataReport.priceperbag * dataReport.tax
                                                            )
                                                    }`}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    {`${dataReport.symbol}${
                                                        dataReport.typecalculation === "Por contacto"
                                                            ? formatNumber(
                                                                parseFloat(dataReport.billingplanfee) * dataReport.tax_costneto +
                                                                dataAux.reduce(
                                                                    (accumulator: number, item: Dictionary) =>
                                                                        accumulator + parseFloat(item.othercost),
                                                                    0
                                                                ) +
                                                                Math.max(
                                                                    0,
                                                                    dataAux.reduce(
                                                                        (accumulator: number, item: Dictionary) =>
                                                                            accumulator +
                                                                            item.contactuniquequantity,
                                                                        0
                                                                    ) - parseFloat(dataReport.contactuniquelimit)
                                                                ) * dataReport.puadditionalcontacts * dataReport.tax_costneto
                                                            )
                                                            : formatNumber(
                                                                parseFloat(dataReport.billingplanfee) * dataReport.tax_costneto +
                                                                dataAux.reduce(
                                                                    (accumulator: number, item: Dictionary) =>
                                                                        accumulator + parseFloat(item.othercost),
                                                                    0
                                                                ) +
                                                                Math.ceil(
                                                                    Math.max(
                                                                        0,
                                                                        dataAux.reduce(
                                                                            (accumulator: number, item: Dictionary) =>
                                                                                accumulator +
                                                                                item.contactuniquequantity,
                                                                            0
                                                                        ) -
                                                                            parseFloat(
                                                                                dataReport.contactuniquelimit
                                                                            )
                                                                    ) / dataReport.numbercontactsbag
                                                                ) * dataReport.priceperbag * dataReport.tax_costneto
                                                            )
                                                    }`}
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                            {(dataReport.typepartner === "RESELLER" || dataReport.typepartner === "DEVELOPER") && (
                                <TableContainer component={Paper} style={{ overflow: "hidden" }}>
                                    <Table aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="left">
                                                    {t(langKeys.client).toUpperCase()}
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
                                            {dataAux.map((item: Dictionary, index: number) => (
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
                                                        <div>{`${formatNumber(100 - item.comissionpercentage)}%`}</div>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="right">
                                                        <div>{`${item.symbol}${formatNumber(
                                                            item.billingplanfee *
                                                                ((100 - item.comissionpercentage) / 100)
                                                        )}`}</div>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="right">
                                                        <div>{`${item.symbol}${formatNumber(item.othercost)}`}</div>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="right">
                                                        <div>{`${item.symbol}${formatNumber(
                                                            item.billingplanfee *
                                                                ((100 - item.comissionpercentage) / 100) +
                                                                parseFloat(item.othercost)
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
                                                <StyledTableCell align="right">{`${dataReport.symbol}${formatNumber(
                                                    dataAux.reduce(
                                                        (accumulator: number, item: Dictionary) =>
                                                            accumulator +
                                                            parseFloat(item.billingplanfee) *
                                                                ((100 - item.comissionpercentage) / 100),
                                                        0
                                                    )
                                                )}`}</StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.symbol}${formatNumber(
                                                    dataAux.reduce(
                                                        (accumulator: number, item: Dictionary) =>
                                                            accumulator + parseFloat(item.othercost),
                                                        0
                                                    )
                                                )}`}</StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.symbol}${formatNumber(
                                                    dataAux.reduce(
                                                        (accumulator: number, item: Dictionary) =>
                                                            accumulator +
                                                            (parseFloat(item.billingplanfee) *
                                                                ((100 - item.comissionpercentage) / 100) +
                                                                parseFloat(item.othercost)),
                                                        0
                                                    )
                                                )}`}</StyledTableCell>
                                            </StyledTableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </div>
                    ) : (
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
