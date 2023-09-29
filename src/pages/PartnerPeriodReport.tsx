import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { Fragment, useEffect, useState } from "react";
import { langKeys } from "lang/keys";
import React from "react";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { execute, exportData, getCollection, getMultiCollectionAux, resetAllMain } from "store/main/actions";
import { billingReportConsulting, billingReportConversationWhatsApp, billingReportHsmHistory, billingpersonreportsel, billinguserreportsel, customerByPartnerSel, formatNumber, formatNumberFourDecimals, formatNumberNoDecimals, getBillingPeriodCalcRefreshAll, getBillingPeriodSummarySel, getBillingPeriodSummarySelCorp, getOrgSelList, getValuesFromDomain } from "common/helpers";
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
        corpid: user?.corpid ?? 0,
        month: new Date().getMonth() + 1,
        orgid: user?.orgid ?? 0,
        totalize: 2,
        year: new Date().getFullYear(),
        datetoshow: `${new Date(new Date().setDate(1)).getFullYear()}-${String(
            new Date(new Date().setDate(1)).getMonth() + 1
        ).padStart(2, "0")}`,
    });

    const [canSearch, setCanSearch] = useState(false);
    const [dataReport, setDataReport] = useState<any>([]);
    const [disableOrg, setDisableOrg] = useState(false);
    const [waitCalculate, setWaitCalculate] = useState(false);
    const [waitExport, setWaitExport] = useState(false);
    const [waitPdf, setWaitPdf] = useState(false);
    const [waitSearch, setWaitSearch] = useState(false);

    const datatotalize = [
        { value: 1, description: t(langKeys.organization) },
        { value: 2, description: t(langKeys.type) },
    ];

    function handleDateChange(e: any) {
        if (e !== "") {
            let datetochange = new Date(e + "-02");
            let mes = datetochange?.getMonth() + 1;
            let year = datetochange?.getFullYear();
            let datetoshow = `${year}-${String(mes).padStart(2, "0")}`;
            setdataMain((prev) => ({ ...prev, datetoshow, year, month: mes }));
        }
    }

    function search() {
        dispatch(showBackdrop(true));
        if (dataMain.totalize === 2) {
            dispatch(getCollection(getBillingPeriodSummarySel(dataMain)));
        } else {
            dispatch(getCollection(getBillingPeriodSummarySelCorp(dataMain)));
        }
    }

    useEffect(() => {
        search();
    }, []);

    useEffect(() => {
        setCanSearch(false);

        if (dataMain) {
            if (dataMain.totalize) {
                if (dataMain.totalize === 1) {
                    setDisableOrg(true);

                    if (dataMain.corpid) {
                        setCanSearch(true);
                    }
                }
                if (dataMain.totalize === 2) {
                    setDisableOrg(false);

                    if (dataMain.corpid && dataMain.orgid) {
                        setCanSearch(true);
                    }
                }
            }
        }
    }, [dataMain]);

    useEffect(() => {
        if (customSearch?.corpid !== 0) {
            setdataMain((prev) => ({
                ...prev,
                corpid: customSearch?.corpid,
                datetoshow: `${customSearch?.year}-${String(customSearch?.month).padStart(2, "0")}`,
                month: customSearch?.month,
                orgid: customSearch?.orgid,
                totalize: customSearch?.totalize,
                year: customSearch?.year,
            }));
            setWaitSearch(true);
        }
    }, [customSearch]);

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
            } else {
                setDataReport(null);
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

    const triggerExportDataPerson = () => {
        dispatch(exportData(billingpersonreportsel(dataMain), "BillingPerson", "excel", true));
        dispatch(showBackdrop(true));
        setWaitExport(true);
    };

    const triggerExportDataUser = () => {
        dispatch(exportData(billinguserreportsel(dataMain), "BillingUser", "excel", true));
        dispatch(showBackdrop(true));
        setWaitExport(true);
    };

    const triggerExportDataConsulting = () => {
        dispatch(exportData(billingReportConsulting(dataMain), "BillingConsulting", "excel", true));
        dispatch(showBackdrop(true));
        setWaitExport(true);
    };

    const triggerExportDataConversation = () => {
        dispatch(exportData(billingReportConversationWhatsApp(dataMain), "BillingConversation", "excel", true));
        dispatch(showBackdrop(true));
        setWaitExport(true);
    };

    const triggerExportDataHsmHistory = (datatype: string) => {
        dispatch(
            exportData(
                billingReportHsmHistory({
                    corpid: dataMain.corpid,
                    month: dataMain.month,
                    orgid: dataMain.orgid,
                    type: datatype,
                    year: dataMain.year,
                }),
                "BillingUserHsmHistory",
                "excel",
                true
            )
        );
        dispatch(showBackdrop(true));
        setWaitExport(true);
    };

    const handleCalculate = () => {
        const callback = () => {
            dispatch(
                execute(getBillingPeriodCalcRefreshAll(dataMain.year, dataMain.month, dataMain.corpid, dataMain.orgid))
            );
            dispatch(showBackdrop(true));
            setWaitCalculate(true);
        };

        dispatch(
            manageConfirmation({
                callback,
                question: t(langKeys.confirmation_calculate),
                visible: true,
            })
        );
    };

    const handleReportPdf = () => {
        if (dataReport) {
            let intelligenceDetail: {}[] = [];

            if (dataReport.artificialintelligencedata) {
                dataReport.artificialintelligencedata.forEach((element: any) => {
                    intelligenceDetail.push({
                        intelligenceadditionalfee:
                            element.aiquantity <= element.freeinteractions
                                ? ""
                                : `${dataReport.invoicecurrencysymbol}${formatNumberFourDecimals(
                                    element.additionalfee
                                )}`,
                        intelligenceaicost: `${dataReport.invoicecurrencysymbol}${formatNumber(element.additionalfee)}`,
                        intelligenceaiquantity: `${formatNumberNoDecimals(element.aiquantity)}`,
                        intelligencefreeinteractions: `${formatNumberNoDecimals(element.freeinteractions)}`,
                        intelligenceigv: `${dataReport.invoicecurrencysymbol}${formatNumber(
                            element.additionalfee - element.additionalfee / dataReport.exchangetax
                        )}`,
                        intelligenceplan: element.plan,
                        intelligenceprovider: element.provider,
                        intelligenceservice: element.type,
                        intelligencetaxableamount: `${dataReport.invoicecurrencysymbol}${formatNumber(
                            element.additionalfee / dataReport.exchangetax
                        )}`,
                    });
                });
            }

            let reportBody = {
                dataonparameters: true,
                key: "period-report",
                method: "",
                reportname: "period-report",
                template: t(langKeys.billingreport_template),
                parameters: {
                    reporttitle: `${dataReport.orgdescription || dataReport.corpdescription}`,
                    reportplan: `${dataReport.billingplan}`,
                    reportperiod: `${dataReport.year} - ${String(dataReport.month).padStart(2, "0")}`,
                    basecostnet: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.billingplanfee / dataReport.exchangetax
                    )}`,
                    basecosttax: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.billingplanfee - dataReport.billingplanfee / dataReport.exchangetax
                    )}`,
                    basecost: `${dataReport.invoicecurrencysymbol}${formatNumber(dataReport.billingplanfee)}`,
                    agentcontractedquantity: `${formatNumberNoDecimals(dataReport.agentcontractedquantity)}`,
                    agentadditionalquantity: `${formatNumberNoDecimals(dataReport.agentadditionalquantity)}`,
                    agentfee: `${dataReport.invoicecurrencysymbol}${formatNumberFourDecimals(
                        dataReport.agentadditionalfee
                    )}`,
                    agentcostnet: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.agenttotalfee / dataReport.exchangetax
                    )}`,
                    agentcosttax: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.agenttotalfee - dataReport.agenttotalfee / dataReport.exchangetax
                    )}`,
                    agentcost: `${dataReport.invoicecurrencysymbol}${formatNumber(dataReport.agenttotalfee)}`,
                    channelotherquantity: `${formatNumberNoDecimals(dataReport.channelothercontractedquantity)}`,
                    channelotheradditional: `${formatNumberNoDecimals(
                        Math.max(dataReport.channelotherquantity - dataReport.channelothercontractedquantity, 0)
                    )}`,
                    channelwhatsappquantity: `${formatNumberNoDecimals(dataReport.channelwhatsappcontractedquantity)}`,
                    channelwhatsappadditional: `${formatNumberNoDecimals(
                        Math.max(dataReport.channelwhatsappquantity - dataReport.channelwhatsappcontractedquantity, 0)
                    )}`,
                    channeladditional: `${formatNumberNoDecimals(
                        Math.max(
                            dataReport.channelotherquantity -
                            dataReport.channelothercontractedquantity +
                            (dataReport.channelwhatsappquantity - dataReport.channelwhatsappcontractedquantity),
                            0
                        )
                    )}`,
                    channelotherfee: `${dataReport.invoicecurrencysymbol}${formatNumberFourDecimals(
                        dataReport.channelotheradditionalfee
                    )}`,
                    channelwhatsappfee: `${dataReport.invoicecurrencysymbol}${formatNumberFourDecimals(
                        dataReport.channelwhatsappadditionalfee
                    )}`,
                    channelcostnet: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.channeltotalfee / dataReport.exchangetax
                    )}`,
                    channelcosttax: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.channeltotalfee - dataReport.channeltotalfee / dataReport.exchangetax
                    )}`,
                    channelcost: `${dataReport.invoicecurrencysymbol}${formatNumber(dataReport.channeltotalfee)}`,
                    conversationfreequantity: `${formatNumberNoDecimals(dataReport.channelwhatsappfreequantity)}`,
                    conversationuserservicequantity: `${formatNumberNoDecimals(
                        dataReport.conversationuserservicequantity
                    )}`,
                    conversationbusinessutilityquantity: `${formatNumberNoDecimals(
                        dataReport.conversationbusinessutilityquantity
                    )}`,
                    conversationbusinessauthenticationquantity: `${formatNumberNoDecimals(
                        dataReport.conversationbusinessauthenticationquantity
                    )}`,
                    conversationbusinessmarketingquantity: `${formatNumberNoDecimals(
                        dataReport.conversationbusinessmarketingquantity
                    )}`,
                    conversationuserfeenet: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.conversationuserservicetotalfee / dataReport.exchangetax
                    )}`,
                    conversationbusinessutilityfeenet: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.conversationbusinessutilitytotalfee / dataReport.exchangetax
                    )}`,
                    conversationbusinessauthenticationfeenet: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.conversationbusinessauthenticationtotalfee / dataReport.exchangetax
                    )}`,
                    conversationbusinessmarketingfeenet: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.conversationbusinessmarketingtotalfee / dataReport.exchangetax
                    )}`,
                    conversationuserfeetax: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.conversationuserservicetotalfee -
                        dataReport.conversationuserservicetotalfee / dataReport.exchangetax
                    )}`,
                    conversationbusinessutilityfeetax: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.conversationbusinessutilitytotalfee -
                        dataReport.conversationbusinessutilitytotalfee / dataReport.exchangetax
                    )}`,
                    conversationbusinessauthenticationfeetax: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.conversationbusinessauthenticationtotalfee -
                        dataReport.conversationbusinessauthenticationtotalfee / dataReport.exchangetax
                    )}`,
                    conversationbusinessmarketingfeetax: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.conversationbusinessmarketingtotalfee -
                        dataReport.conversationbusinessmarketingtotalfee / dataReport.exchangetax
                    )}`,
                    conversationuserfee: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.conversationuserservicetotalfee
                    )}`,
                    conversationbusinessutilityfee: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.conversationbusinessutilitytotalfee
                    )}`,
                    conversationbusinessauthenticationfee: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.conversationbusinessauthenticationtotalfee
                    )}`,
                    conversationbusinessmarketingfee: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.conversationbusinessmarketingtotalfee
                    )}`,
                    messagingsmslimit: `${formatNumberNoDecimals(dataReport.messagingsmsquantitylimit)}`,
                    messagingsmsquantity: `${formatNumberNoDecimals(dataReport.messagingsmsquantity)}`,
                    messagingmaillimit: `${formatNumberNoDecimals(dataReport.messagingmailquantitylimit)}`,
                    messagingmailquantity: `${formatNumberNoDecimals(dataReport.messagingmailquantity)}`,
                    messagingsmsadditional: `${dataReport.invoicecurrencysymbol}${formatNumberFourDecimals(
                        dataReport.messagingsmsadditionalfee
                    )}`,
                    messagingmailadditional: `${dataReport.invoicecurrencysymbol}${formatNumberFourDecimals(
                        dataReport.messagingmailadditionalfee
                    )}`,
                    messagingsmsfeenet: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.messagingsmstotalfee / dataReport.exchangetax
                    )}`,
                    messagingmailfeenet: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.messagingmailtotalfee / dataReport.exchangetax
                    )}`,
                    messagingsmsfeetax: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.messagingsmstotalfee - dataReport.messagingsmstotalfee / dataReport.exchangetax
                    )}`,
                    messagingmailfeetax: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.messagingmailtotalfee - dataReport.messagingmailtotalfee / dataReport.exchangetax
                    )}`,
                    messagingsmsfee: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.messagingsmstotalfee
                    )}`,
                    messagingmailfee: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.messagingmailtotalfee
                    )}`,
                    voicephonefeenet: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.voicetelephonefee / dataReport.exchangetax
                    )}`,
                    voicepstnfeenet: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.voicepstnfee / dataReport.exchangetax
                    )}`,
                    voicevoipfeenet: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.voicevoipfee / dataReport.exchangetax
                    )}`,
                    voicerecordingfeenet: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.voicerecordingfee / dataReport.exchangetax
                    )}`,
                    voiceotherfeenet: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.voiceotherfee / dataReport.exchangetax
                    )}`,
                    voicephonefeetax: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.voicetelephonefee - dataReport.voicetelephonefee / dataReport.exchangetax
                    )}`,
                    voicepstnfeetax: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.voicepstnfee - dataReport.voicepstnfee / dataReport.exchangetax
                    )}`,
                    voicevoipfeetax: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.voicevoipfee - dataReport.voicevoipfee / dataReport.exchangetax
                    )}`,
                    voicerecordingfeetax: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.voicerecordingfee - dataReport.voicerecordingfee / dataReport.exchangetax
                    )}`,
                    voiceotherfeetax: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.voiceotherfee - dataReport.voiceotherfee / dataReport.exchangetax
                    )}`,
                    voicephonefee: `${dataReport.invoicecurrencysymbol}${formatNumber(dataReport.voicetelephonefee)}`,
                    voicepstnfee: `${dataReport.invoicecurrencysymbol}${formatNumber(dataReport.voicepstnfee)}`,
                    voicevoipfee: `${dataReport.invoicecurrencysymbol}${formatNumber(dataReport.voicevoipfee)}`,
                    voicerecordingfee: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.voicerecordingfee
                    )}`,
                    voiceotherfee: `${dataReport.invoicecurrencysymbol}${formatNumber(dataReport.voiceotherfee)}`,
                    contactcalculateunique: (dataReport?.contactcalculatemode || "").includes("UNIQUE"),
                    contactuniquelimit: `${formatNumberNoDecimals(dataReport.contactuniquelimit)}`,
                    contactuniquequantity: `${formatNumberNoDecimals(dataReport.contactuniquequantity)}`,
                    contactuniquequantityadditional: `${formatNumberNoDecimals(
                        Math.max(dataReport.contactuniquequantity - dataReport.contactuniquelimit, 0)
                    )}`,
                    contactuniqueadditional: `${dataReport.invoicecurrencysymbol}${formatNumberFourDecimals(
                        dataReport.contactuniqueadditionalfee
                    )}`,
                    contactuniquefeenet: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.contactuniquefee / dataReport.exchangetax
                    )}`,
                    contactuniquefeetax: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.contactuniquefee - dataReport.contactuniquefee / dataReport.exchangetax
                    )}`,
                    contactuniquefee: `${dataReport.invoicecurrencysymbol}${formatNumber(dataReport.contactuniquefee)}`,
                    contactotherquantity: `${formatNumberNoDecimals(dataReport.contactotherquantity)}`,
                    contactwhatsappquantity: `${formatNumberNoDecimals(dataReport.contactwhatsappquantity)}`,
                    contactotheradditional: `${dataReport.invoicecurrencysymbol}${formatNumberFourDecimals(
                        dataReport.contactotheradditionalfee
                    )}`,
                    contactwhatsappadditional: `${dataReport.invoicecurrencysymbol}${formatNumberFourDecimals(
                        dataReport.contactwhatsappadditionalfee
                    )}`,
                    contactotherfeenet: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.contactotherfee / dataReport.exchangetax
                    )}`,
                    contactwhatsappfeenet: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.contactwhatsappfee / dataReport.exchangetax
                    )}`,
                    contactotherfeetax: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.contactotherfee - dataReport.contactotherfee / dataReport.exchangetax
                    )}`,
                    contactwhatsappfeetax: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.contactwhatsappfee - dataReport.contactwhatsappfee / dataReport.exchangetax
                    )}`,
                    contactotherfee: `${dataReport.invoicecurrencysymbol}${formatNumber(dataReport.contactotherfee)}`,
                    contactwhatsappfee: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.contactwhatsappfee
                    )}`,
                    infrastructureenabled: (dataReport?.billinginfrastructurefee || 0) > 0,
                    infrastructurefeenet: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.billinginfrastructurefee / dataReport.exchangetax
                    )}`,
                    infrastructurefeetax: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.billinginfrastructurefee -
                        dataReport.billinginfrastructurefee / dataReport.exchangetax
                    )}`,
                    infrastructurefee: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.billinginfrastructurefee
                    )}`,
                    supportplan: `${t(langKeys.supportplan)}: ${dataReport.billingsupportplan}`,
                    supportfeenet: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.billingsupportfee / dataReport.exchangetax
                    )}`,
                    supportfeetax: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.billingsupportfee - dataReport.billingsupportfee / dataReport.exchangetax
                    )}`,
                    supportfee: `${dataReport.invoicecurrencysymbol}${formatNumber(dataReport.billingsupportfee)}`,
                    consultingquantity: `${formatNumberNoDecimals(dataReport.consultinghourquantity)}`,
                    consultingfeenet: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.consultingtotalfee / dataReport.exchangetax
                    )}`,
                    consultingfeetax: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.consultingtotalfee - dataReport.consultingtotalfee / dataReport.exchangetax
                    )}`,
                    consultingfee: `${dataReport.invoicecurrencysymbol}${formatNumber(dataReport.consultingtotalfee)}`,
                    additionalservice01: `${dataReport.additionalservice01}`,
                    additionalservice01feenet: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.additionalservice01fee / dataReport.exchangetax
                    )}`,
                    additionalservice01feetax: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.additionalservice01fee - dataReport.additionalservice01fee / dataReport.exchangetax
                    )}`,
                    additionalservice01fee: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.additionalservice01fee
                    )}`,
                    additionalservice02: `${dataReport.additionalservice02}`,
                    additionalservice02feenet: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.additionalservice02fee / dataReport.exchangetax
                    )}`,
                    additionalservice02feetax: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.additionalservice02fee - dataReport.additionalservice02fee / dataReport.exchangetax
                    )}`,
                    additionalservice02fee: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.additionalservice02fee
                    )}`,
                    additionalservice03: `${dataReport.additionalservice03}`,
                    additionalservice03feenet: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.additionalservice03fee / dataReport.exchangetax
                    )}`,
                    additionalservice03feetax: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.additionalservice03fee - dataReport.additionalservice03fee / dataReport.exchangetax
                    )}`,
                    additionalservice03fee: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.additionalservice03fee
                    )}`,
                    billingtotalnet: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.billingtotalfeenet
                    )}`,
                    billingtotaltax: `${dataReport.invoicecurrencysymbol}${formatNumber(
                        dataReport.billingtotalfeetax
                    )}`,
                    billingtotal: `${dataReport.invoicecurrencysymbol}${formatNumber(dataReport.billingtotalfee)}`,
                    generalwhatsappquantity: `${formatNumberNoDecimals(dataReport.contactwhatsappquantity)}`,
                    generalotherquantity: `${formatNumberNoDecimals(dataReport.contactotherquantity)}`,
                    generalconversationquantity: `${formatNumberNoDecimals(dataReport.conversationquantity)}`,
                    generalinteractionquantity: `${formatNumberNoDecimals(dataReport.conversationinteractionquantity)}`,
                    generalsupervisorquantity: `${formatNumberNoDecimals(dataReport.agentsupervisoractivequantity)}`,
                    generaladviserquantity: `${formatNumberNoDecimals(dataReport.agentadviseractivequantity)}`,
                    intelligencedetail: intelligenceDetail || [],
                },
            };

            dispatch(reportPdf(reportBody));
            dispatch(showBackdrop(true));
            setWaitPdf(true);
        }
    };

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
                        data={(multiResult.data[5].data||[])}
                        label={t(langKeys.organization)}
                        onChange={(value) => setdataMain((prev) => ({ ...prev, corpid: value?.corpid || 0, orgid: 0 }))}
                        optionDesc="organization"
                        optionValue="orgid"
                        orderbylabel={true}
                        variant="outlined"
                    />
                    <FieldSelect
                        className={classes.fieldsfilter}
                        label={t(langKeys.type)}
                        onChange={(value) => setdataMain((prev) => ({ ...prev, orgid: value?.orgid || 0 }))}
                        optionDesc="domaindesc"
                        optionValue="domainvalue"
                        orderbylabel={true}
                        variant="outlined"
                        data={(multiResult.data[6].data||[])}
                    />
                    <FieldSelect
                        className={classes.fieldsfilter}
                        data={datatotalize}
                        label={t(langKeys.totalize)}
                        onChange={(value) => setdataMain((prev) => ({ ...prev, totalize: value?.value || 0 }))}
                        optionDesc="description"
                        optionValue="value"
                        orderbylabel={true}
                        valueDefault={dataMain.totalize}
                        variant="outlined"
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
                    {!mainResult.mainData.loading && dataReport && (
                        <Fragment>
                            <Button
                                className={classes.button}
                                color="primary"
                                disabled={exportResult.loading}
                                onClick={() => handleCalculate()}
                                startIcon={<Refresh color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                                variant="contained"
                            >
                                {`${t(langKeys.calculate)}`}
                            </Button>
                            <Button
                                className={classes.button}
                                color="primary"
                                disabled={exportResult.loading}
                                onClick={() => handleReportPdf()}
                                startIcon={<DownloadIcon />}
                                variant="contained"
                            >
                                {t(langKeys.download)}
                            </Button>
                        </Fragment>
                    )}
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
                                    value={dataReport.orgdescription || dataReport.corpdescription}
                                />
                            </div>
                            <div className="row-zyx">
                                <FieldView
                                    className="col-6"
                                    label={t(langKeys.partnertype)}
                                    value={dataReport.billingplan}
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
                                            <StyledTableCell align="right">{`${dataReport.invoicecurrencysymbol
                                                }${formatNumber(
                                                    dataReport.billingplanfee / dataReport.exchangetax
                                                )}`}</StyledTableCell>
                                            <StyledTableCell align="right">{`${dataReport.invoicecurrencysymbol
                                                }${formatNumber(
                                                    dataReport.billingplanfee -
                                                    dataReport.billingplanfee / dataReport.exchangetax
                                                )}`}</StyledTableCell>
                                            <StyledTableCell align="right">{`${dataReport.invoicecurrencysymbol
                                                }${formatNumber(dataReport.billingplanfee)}`}</StyledTableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <StyledTableCell>
                                                <div>
                                                    <b>{t(langKeys.agents_plural)}</b>
                                                </div>
                                                <div>{t(langKeys.billingreport_agentcontracted)}</div>
                                                <div>{t(langKeys.additional)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>{formatNumberNoDecimals(dataReport.agentcontractedquantity)}</div>
                                                <div>{formatNumberNoDecimals(dataReport.agentadditionalquantity)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumberFourDecimals(
                                                    dataReport.agentadditionalfee
                                                )}`}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.agenttotalfee / dataReport.exchangetax
                                                )}`}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.agenttotalfee -
                                                    dataReport.agenttotalfee / dataReport.exchangetax
                                                )}`}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.agenttotalfee
                                                )}`}</div>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <StyledTableCell>
                                                <div>
                                                    <b>{t(langKeys.channel_plural)}</b>
                                                </div>
                                                <div>{t(langKeys.billingreport_channelother)}</div>
                                                <div>{t(langKeys.billingreport_channelotheradditional)}</div>
                                                <div>{t(langKeys.billingreport_channelwhatsapp)}</div>
                                                <div>{t(langKeys.billingreport_channelwhatsappadditional)}</div>
                                                <div>{t(langKeys.billingreport_channeltotal)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>
                                                    {formatNumberNoDecimals(dataReport.channelothercontractedquantity)}
                                                </div>
                                                <div>
                                                    {formatNumberNoDecimals(
                                                        Math.max(
                                                            dataReport.channelotherquantity -
                                                            dataReport.channelothercontractedquantity,
                                                            0
                                                        )
                                                    )}
                                                </div>
                                                <div>
                                                    {formatNumberNoDecimals(
                                                        dataReport.channelwhatsappcontractedquantity
                                                    )}
                                                </div>
                                                <div>
                                                    {formatNumberNoDecimals(
                                                        Math.max(
                                                            dataReport.channelwhatsappquantity -
                                                            dataReport.channelwhatsappcontractedquantity,
                                                            0
                                                        )
                                                    )}
                                                </div>
                                                <div>
                                                    {formatNumberNoDecimals(
                                                        Math.max(
                                                            dataReport.channelotherquantity -
                                                            dataReport.channelothercontractedquantity +
                                                            (dataReport.channelwhatsappquantity -
                                                                dataReport.channelwhatsappcontractedquantity),
                                                            0
                                                        )
                                                    )}
                                                </div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumberFourDecimals(
                                                    dataReport.channelotheradditionalfee
                                                )}`}</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumberFourDecimals(
                                                    dataReport.channelwhatsappadditionalfee
                                                )}`}</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.channeltotalfee / dataReport.exchangetax
                                                )}`}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.channeltotalfee -
                                                    dataReport.channeltotalfee / dataReport.exchangetax
                                                )}`}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.channeltotalfee
                                                )}`}</div>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <StyledTableCell>
                                                <div>
                                                    <b>{t(langKeys.billingreportconversations)}</b>
                                                </div>
                                                <div>{t(langKeys.billingreport_conversationfree)}</div>
                                                <div>{t(langKeys.billingreport_conversationusergeneral)}</div>
                                                <div>{t(langKeys.billingreport_conversationbusinessutility)}</div>
                                                <div>
                                                    {t(langKeys.billingreport_conversationbusinessauthentication)}
                                                </div>
                                                <div>{t(langKeys.billingreport_conversationbusinessmarketing)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>
                                                    {formatNumberNoDecimals(dataReport.channelwhatsappfreequantity)}
                                                </div>
                                                <div>
                                                    {formatNumberNoDecimals(dataReport.conversationuserservicequantity)}
                                                </div>
                                                <div>
                                                    {formatNumberNoDecimals(
                                                        dataReport.conversationbusinessutilityquantity
                                                    )}
                                                </div>
                                                <div>
                                                    {formatNumberNoDecimals(
                                                        dataReport.conversationbusinessauthenticationquantity
                                                    )}
                                                </div>
                                                <div>
                                                    {formatNumberNoDecimals(
                                                        dataReport.conversationbusinessmarketingquantity
                                                    )}
                                                </div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.conversationuserservicetotalfee / dataReport.exchangetax
                                                )}`}</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.conversationbusinessutilitytotalfee /
                                                    dataReport.exchangetax
                                                )}`}</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.conversationbusinessauthenticationtotalfee /
                                                    dataReport.exchangetax
                                                )}`}</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.conversationbusinessmarketingtotalfee /
                                                    dataReport.exchangetax
                                                )}`}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.conversationuserservicetotalfee -
                                                    dataReport.conversationuserservicetotalfee /
                                                    dataReport.exchangetax
                                                )}`}</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.conversationbusinessutilitytotalfee -
                                                    dataReport.conversationbusinessutilitytotalfee /
                                                    dataReport.exchangetax
                                                )}`}</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.conversationbusinessauthenticationtotalfee -
                                                    dataReport.conversationbusinessauthenticationtotalfee /
                                                    dataReport.exchangetax
                                                )}`}</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.conversationbusinessmarketingtotalfee -
                                                    dataReport.conversationbusinessmarketingtotalfee /
                                                    dataReport.exchangetax
                                                )}`}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.conversationuserservicetotalfee
                                                )}`}</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.conversationbusinessutilitytotalfee
                                                )}`}</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.conversationbusinessauthenticationtotalfee
                                                )}`}</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.conversationbusinessmarketingtotalfee
                                                )}`}</div>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <StyledTableCell>
                                                <div>
                                                    <b>{t(langKeys.billingreportmessaging)}</b>
                                                </div>
                                                <div>{t(langKeys.minimumsmsquantity)}</div>
                                                <div>{t(langKeys.billingreportsms)}</div>
                                                <div>{t(langKeys.minimummailquantity)}</div>
                                                <div>{t(langKeys.billingreportmail)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>
                                                    {formatNumberNoDecimals(dataReport.messagingsmsquantitylimit)}
                                                </div>
                                                <div>{formatNumberNoDecimals(dataReport.messagingsmsquantity)}</div>
                                                <div>
                                                    {formatNumberNoDecimals(dataReport.messagingmailquantitylimit)}
                                                </div>
                                                <div>{formatNumberNoDecimals(dataReport.messagingmailquantity)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumberFourDecimals(
                                                    dataReport.messagingsmsadditionalfee
                                                )}`}</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumberFourDecimals(
                                                    dataReport.messagingmailadditionalfee
                                                )}`}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.messagingsmstotalfee / dataReport.exchangetax
                                                )}`}</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.messagingmailtotalfee / dataReport.exchangetax
                                                )}`}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.messagingsmstotalfee -
                                                    dataReport.messagingsmstotalfee / dataReport.exchangetax
                                                )}`}</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.messagingmailtotalfee -
                                                    dataReport.messagingmailtotalfee / dataReport.exchangetax
                                                )}`}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.messagingsmstotalfee
                                                )}`}</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.messagingmailtotalfee
                                                )}`}</div>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <StyledTableCell>
                                                <div>
                                                    <b>{t(langKeys.periodreportvoice)}</b>
                                                </div>
                                                <div>{t(langKeys.periodreportphone)}</div>
                                                <div>{t(langKeys.periodreportpstn)}</div>
                                                <div>{t(langKeys.periodreportvoip)}</div>
                                                <div>{t(langKeys.periodreportrecording)}</div>
                                                <div>{t(langKeys.periodreportother)}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div style={{ color: "transparent" }}>.</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.voicetelephonefee / dataReport.exchangetax
                                                )}`}</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.voicepstnfee / dataReport.exchangetax
                                                )}`}</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.voicevoipfee / dataReport.exchangetax
                                                )}`}</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.voicerecordingfee / dataReport.exchangetax
                                                )}`}</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.voiceotherfee / dataReport.exchangetax
                                                )}`}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.voicetelephonefee -
                                                    dataReport.voicetelephonefee / dataReport.exchangetax
                                                )}`}</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.voicepstnfee -
                                                    dataReport.voicepstnfee / dataReport.exchangetax
                                                )}`}</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.voicevoipfee -
                                                    dataReport.voicevoipfee / dataReport.exchangetax
                                                )}`}</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.voicerecordingfee -
                                                    dataReport.voicerecordingfee / dataReport.exchangetax
                                                )}`}</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.voiceotherfee -
                                                    dataReport.voiceotherfee / dataReport.exchangetax
                                                )}`}</div>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{ color: "transparent" }}>.</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.voicetelephonefee
                                                )}`}</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.voicepstnfee
                                                )}`}</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.voicevoipfee
                                                )}`}</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.voicerecordingfee
                                                )}`}</div>
                                                <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                    dataReport.voiceotherfee
                                                )}`}</div>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                        {(dataReport?.contactcalculatemode || "").includes("UNIQUE") && (
                                            <StyledTableRow>
                                                <StyledTableCell>
                                                    <div>
                                                        <b>{t(langKeys.billingreportcontacts)}</b>
                                                    </div>
                                                    <div>{t(langKeys.freecontacts)}</div>
                                                    <div>{t(langKeys.billingreporttotalcontacts)}</div>
                                                    <div>{t(langKeys.billingreportadditionalcontacts)}</div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div>{formatNumberNoDecimals(dataReport.contactuniquelimit)}</div>
                                                    <div>
                                                        {formatNumberNoDecimals(dataReport.contactuniquequantity)}
                                                    </div>
                                                    <div>
                                                        {formatNumberNoDecimals(
                                                            Math.max(
                                                                dataReport.contactuniquequantity -
                                                                dataReport.contactuniquelimit,
                                                                0
                                                            )
                                                        )}
                                                    </div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div>{`${dataReport.invoicecurrencysymbol
                                                        }${formatNumberFourDecimals(
                                                            dataReport.contactuniqueadditionalfee
                                                        )}`}</div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                        dataReport.contactuniquefee / dataReport.exchangetax
                                                    )}`}</div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                        dataReport.contactuniquefee -
                                                        dataReport.contactuniquefee / dataReport.exchangetax
                                                    )}`}</div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                        dataReport.contactuniquefee
                                                    )}`}</div>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        )}
                                        {!(dataReport?.contactcalculatemode || "").includes("UNIQUE") && (
                                            <StyledTableRow>
                                                <StyledTableCell>
                                                    <div>
                                                        <b>{t(langKeys.billingreportcontacts)}</b>
                                                    </div>
                                                    <div>{t(langKeys.billingreport_contactother)}</div>
                                                    <div>{t(langKeys.billingreport_contactwhatsapp)}</div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div>{formatNumberNoDecimals(dataReport.contactotherquantity)}</div>
                                                    <div>
                                                        {formatNumberNoDecimals(dataReport.contactwhatsappquantity)}
                                                    </div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div>{`${dataReport.invoicecurrencysymbol
                                                        }${formatNumberFourDecimals(
                                                            dataReport.contactotheradditionalfee
                                                        )}`}</div>
                                                    <div>{`${dataReport.invoicecurrencysymbol
                                                        }${formatNumberFourDecimals(
                                                            dataReport.contactwhatsappadditionalfee
                                                        )}`}</div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                        dataReport.contactotherfee / dataReport.exchangetax
                                                    )}`}</div>
                                                    <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                        dataReport.contactwhatsappfee / dataReport.exchangetax
                                                    )}`}</div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                        dataReport.contactotherfee -
                                                        dataReport.contactotherfee / dataReport.exchangetax
                                                    )}`}</div>
                                                    <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                        dataReport.contactwhatsappfee -
                                                        dataReport.contactwhatsappfee / dataReport.exchangetax
                                                    )}`}</div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                        dataReport.contactotherfee
                                                    )}`}</div>
                                                    <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                        dataReport.contactwhatsappfee
                                                    )}`}</div>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        )}
                                        {dataReport?.artificialintelligencedata?.map((dataIntelligence: any) => (
                                            <StyledTableRow>
                                                <StyledTableCell>
                                                    <div>
                                                        <b>{`${dataIntelligence.provider} ${dataIntelligence.type}: ${dataIntelligence.plan}`}</b>
                                                    </div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div>{formatNumberNoDecimals(dataIntelligence.aiquantity)}</div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    {dataIntelligence.aiquantity >
                                                        dataIntelligence.freeinteractions && (
                                                            <div>{`${dataReport.invoicecurrencysymbol
                                                                }${formatNumberFourDecimals(
                                                                    dataIntelligence.additionalfee
                                                                )}`}</div>
                                                        )}
                                                    {dataIntelligence.aiquantity <=
                                                        dataIntelligence.freeinteractions && (
                                                            <div style={{ color: "transparent" }}>.</div>
                                                        )}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                        dataIntelligence.aicost / dataReport.exchangetax
                                                    )}`}</div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                        dataIntelligence.aicost -
                                                        dataIntelligence.aicost / dataReport.exchangetax
                                                    )}`}</div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div>{`${dataReport.invoicecurrencysymbol}${formatNumber(
                                                        dataIntelligence.aicost
                                                    )}`}</div>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                        {(dataReport?.billinginfrastructurefee || 0) > 0 && (
                                            <StyledTableRow>
                                                <StyledTableCell>
                                                    <b>{t(langKeys.billingreport_infrastructure)}</b>
                                                </StyledTableCell>
                                                <StyledTableCell></StyledTableCell>
                                                <StyledTableCell></StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.invoicecurrencysymbol
                                                    }${formatNumber(
                                                        dataReport.billinginfrastructurefee / dataReport.exchangetax
                                                    )}`}</StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.invoicecurrencysymbol
                                                    }${formatNumber(
                                                        dataReport.billinginfrastructurefee -
                                                        dataReport.billinginfrastructurefee / dataReport.exchangetax
                                                    )}`}</StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.invoicecurrencysymbol
                                                    }${formatNumber(
                                                        dataReport.billinginfrastructurefee
                                                    )}`}</StyledTableCell>
                                            </StyledTableRow>
                                        )}
                                        <StyledTableRow>
                                            <StyledTableCell>
                                                <b>{`${t(langKeys.supportplan)}: ${dataReport.billingsupportplan}`}</b>
                                            </StyledTableCell>
                                            <StyledTableCell></StyledTableCell>
                                            <StyledTableCell></StyledTableCell>
                                            <StyledTableCell align="right">{`${dataReport.invoicecurrencysymbol
                                                }${formatNumber(
                                                    dataReport.billingsupportfee / dataReport.exchangetax
                                                )}`}</StyledTableCell>
                                            <StyledTableCell align="right">{`${dataReport.invoicecurrencysymbol
                                                }${formatNumber(
                                                    dataReport.billingsupportfee -
                                                    dataReport.billingsupportfee / dataReport.exchangetax
                                                )}`}</StyledTableCell>
                                            <StyledTableCell align="right">{`${dataReport.invoicecurrencysymbol
                                                }${formatNumber(dataReport.billingsupportfee)}`}</StyledTableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <StyledTableCell>
                                                <b>{t(langKeys.billingreport_consulting)}</b>
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                {formatNumberNoDecimals(dataReport.consultinghourquantity)}
                                            </StyledTableCell>
                                            <StyledTableCell></StyledTableCell>
                                            <StyledTableCell align="right">{`${dataReport.invoicecurrencysymbol
                                                }${formatNumber(
                                                    dataReport.consultingtotalfee / dataReport.exchangetax
                                                )}`}</StyledTableCell>
                                            <StyledTableCell align="right">{`${dataReport.invoicecurrencysymbol
                                                }${formatNumber(
                                                    dataReport.consultingtotalfee -
                                                    dataReport.consultingtotalfee / dataReport.exchangetax
                                                )}`}</StyledTableCell>
                                            <StyledTableCell align="right">{`${dataReport.invoicecurrencysymbol
                                                }${formatNumber(dataReport.consultingtotalfee)}`}</StyledTableCell>
                                        </StyledTableRow>
                                        {dataReport.additionalservice01 && (
                                            <StyledTableRow>
                                                <StyledTableCell>{dataReport.additionalservice01}</StyledTableCell>
                                                <StyledTableCell></StyledTableCell>
                                                <StyledTableCell></StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.invoicecurrencysymbol
                                                    }${formatNumber(
                                                        dataReport.additionalservice01fee / dataReport.exchangetax
                                                    )}`}</StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.invoicecurrencysymbol
                                                    }${formatNumber(
                                                        dataReport.additionalservice01fee -
                                                        dataReport.additionalservice01fee / dataReport.exchangetax
                                                    )}`}</StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.invoicecurrencysymbol
                                                    }${formatNumber(dataReport.additionalservice01fee)}`}</StyledTableCell>
                                            </StyledTableRow>
                                        )}
                                        {dataReport.additionalservice02 && (
                                            <StyledTableRow>
                                                <StyledTableCell>{dataReport.additionalservice02}</StyledTableCell>
                                                <StyledTableCell></StyledTableCell>
                                                <StyledTableCell></StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.invoicecurrencysymbol
                                                    }${formatNumber(
                                                        dataReport.additionalservice02fee / dataReport.exchangetax
                                                    )}`}</StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.invoicecurrencysymbol
                                                    }${formatNumber(
                                                        dataReport.additionalservice02fee -
                                                        dataReport.additionalservice02fee / dataReport.exchangetax
                                                    )}`}</StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.invoicecurrencysymbol
                                                    }${formatNumber(dataReport.additionalservice02fee)}`}</StyledTableCell>
                                            </StyledTableRow>
                                        )}
                                        {dataReport.additionalservice03 && (
                                            <StyledTableRow>
                                                <StyledTableCell>{dataReport.additionalservice03}</StyledTableCell>
                                                <StyledTableCell></StyledTableCell>
                                                <StyledTableCell></StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.invoicecurrencysymbol
                                                    }${formatNumber(
                                                        dataReport.additionalservice03fee / dataReport.exchangetax
                                                    )}`}</StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.invoicecurrencysymbol
                                                    }${formatNumber(
                                                        dataReport.additionalservice03fee -
                                                        dataReport.additionalservice03fee / dataReport.exchangetax
                                                    )}`}</StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.invoicecurrencysymbol
                                                    }${formatNumber(dataReport.additionalservice03fee)}`}</StyledTableCell>
                                            </StyledTableRow>
                                        )}
                                        <StyledTableRow>
                                            <StyledTableCell>
                                                <b>{t(langKeys.periodamount)}</b>
                                            </StyledTableCell>
                                            <StyledTableCell></StyledTableCell>
                                            <StyledTableCell></StyledTableCell>
                                            <StyledTableCell align="right">{`${dataReport.invoicecurrencysymbol
                                                }${formatNumber(dataReport.billingtotalfeenet)}`}</StyledTableCell>
                                            <StyledTableCell align="right">{`${dataReport.invoicecurrencysymbol
                                                }${formatNumber(dataReport.billingtotalfeetax)}`}</StyledTableCell>
                                            <StyledTableCell align="right">{`${dataReport.invoicecurrencysymbol
                                                }${formatNumber(dataReport.billingtotalfee)}`}</StyledTableCell>
                                        </StyledTableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
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