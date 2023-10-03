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
        partnerid: 1,
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
    const [disableOrg, setDisableOrg] = useState(false);
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
                                : `${dataReport.symbol}${formatNumberFourDecimals(
                                    element.additionalfee
                                )}`,
                        intelligenceaicost: `${dataReport.symbol}${formatNumber(element.additionalfee)}`,
                        intelligenceaiquantity: `${formatNumberNoDecimals(element.aiquantity)}`,
                        intelligencefreeinteractions: `${formatNumberNoDecimals(element.freeinteractions)}`,
                        intelligenceigv: `${dataReport.symbol}${formatNumber(
                            element.additionalfee - element.additionalfee / dataReport.exchangetax
                        )}`,
                        intelligenceplan: element.plan,
                        intelligenceprovider: element.provider,
                        intelligenceservice: element.type,
                        intelligencetaxableamount: `${dataReport.symbol}${formatNumber(
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
                    basecostnet: `${dataReport.symbol}${formatNumber(
                        dataReport.billingplanfee / dataReport.exchangetax
                    )}`,
                    basecosttax: `${dataReport.symbol}${formatNumber(
                        dataReport.billingplanfee - dataReport.billingplanfee / dataReport.exchangetax
                    )}`,
                    basecost: `${dataReport.symbol}${formatNumber(dataReport.billingplanfee)}`,
                    agentcontractedquantity: `${formatNumberNoDecimals(dataReport.agentcontractedquantity)}`,
                    agentadditionalquantity: `${formatNumberNoDecimals(dataReport.agentadditionalquantity)}`,
                    agentfee: `${dataReport.symbol}${formatNumberFourDecimals(
                        dataReport.agentadditionalfee
                    )}`,
                    agentcostnet: `${dataReport.symbol}${formatNumber(
                        dataReport.agenttotalfee / dataReport.exchangetax
                    )}`,
                    agentcosttax: `${dataReport.symbol}${formatNumber(
                        dataReport.agenttotalfee - dataReport.agenttotalfee / dataReport.exchangetax
                    )}`,
                    agentcost: `${dataReport.symbol}${formatNumber(dataReport.agenttotalfee)}`,
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
                    channelotherfee: `${dataReport.symbol}${formatNumberFourDecimals(
                        dataReport.channelotheradditionalfee
                    )}`,
                    channelwhatsappfee: `${dataReport.symbol}${formatNumberFourDecimals(
                        dataReport.channelwhatsappadditionalfee
                    )}`,
                    channelcostnet: `${dataReport.symbol}${formatNumber(
                        dataReport.channeltotalfee / dataReport.exchangetax
                    )}`,
                    channelcosttax: `${dataReport.symbol}${formatNumber(
                        dataReport.channeltotalfee - dataReport.channeltotalfee / dataReport.exchangetax
                    )}`,
                    channelcost: `${dataReport.symbol}${formatNumber(dataReport.channeltotalfee)}`,
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
                    conversationuserfeenet: `${dataReport.symbol}${formatNumber(
                        dataReport.conversationuserservicetotalfee / dataReport.exchangetax
                    )}`,
                    conversationbusinessutilityfeenet: `${dataReport.symbol}${formatNumber(
                        dataReport.conversationbusinessutilitytotalfee / dataReport.exchangetax
                    )}`,
                    conversationbusinessauthenticationfeenet: `${dataReport.symbol}${formatNumber(
                        dataReport.conversationbusinessauthenticationtotalfee / dataReport.exchangetax
                    )}`,
                    conversationbusinessmarketingfeenet: `${dataReport.symbol}${formatNumber(
                        dataReport.conversationbusinessmarketingtotalfee / dataReport.exchangetax
                    )}`,
                    conversationuserfeetax: `${dataReport.symbol}${formatNumber(
                        dataReport.conversationuserservicetotalfee -
                        dataReport.conversationuserservicetotalfee / dataReport.exchangetax
                    )}`,
                    conversationbusinessutilityfeetax: `${dataReport.symbol}${formatNumber(
                        dataReport.conversationbusinessutilitytotalfee -
                        dataReport.conversationbusinessutilitytotalfee / dataReport.exchangetax
                    )}`,
                    conversationbusinessauthenticationfeetax: `${dataReport.symbol}${formatNumber(
                        dataReport.conversationbusinessauthenticationtotalfee -
                        dataReport.conversationbusinessauthenticationtotalfee / dataReport.exchangetax
                    )}`,
                    conversationbusinessmarketingfeetax: `${dataReport.symbol}${formatNumber(
                        dataReport.conversationbusinessmarketingtotalfee -
                        dataReport.conversationbusinessmarketingtotalfee / dataReport.exchangetax
                    )}`,
                    conversationuserfee: `${dataReport.symbol}${formatNumber(
                        dataReport.conversationuserservicetotalfee
                    )}`,
                    conversationbusinessutilityfee: `${dataReport.symbol}${formatNumber(
                        dataReport.conversationbusinessutilitytotalfee
                    )}`,
                    conversationbusinessauthenticationfee: `${dataReport.symbol}${formatNumber(
                        dataReport.conversationbusinessauthenticationtotalfee
                    )}`,
                    conversationbusinessmarketingfee: `${dataReport.symbol}${formatNumber(
                        dataReport.conversationbusinessmarketingtotalfee
                    )}`,
                    messagingsmslimit: `${formatNumberNoDecimals(dataReport.messagingsmsquantitylimit)}`,
                    messagingsmsquantity: `${formatNumberNoDecimals(dataReport.messagingsmsquantity)}`,
                    messagingmaillimit: `${formatNumberNoDecimals(dataReport.messagingmailquantitylimit)}`,
                    messagingmailquantity: `${formatNumberNoDecimals(dataReport.messagingmailquantity)}`,
                    messagingsmsadditional: `${dataReport.symbol}${formatNumberFourDecimals(
                        dataReport.messagingsmsadditionalfee
                    )}`,
                    messagingmailadditional: `${dataReport.symbol}${formatNumberFourDecimals(
                        dataReport.messagingmailadditionalfee
                    )}`,
                    messagingsmsfeenet: `${dataReport.symbol}${formatNumber(
                        dataReport.messagingsmstotalfee / dataReport.exchangetax
                    )}`,
                    messagingmailfeenet: `${dataReport.symbol}${formatNumber(
                        dataReport.messagingmailtotalfee / dataReport.exchangetax
                    )}`,
                    messagingsmsfeetax: `${dataReport.symbol}${formatNumber(
                        dataReport.messagingsmstotalfee - dataReport.messagingsmstotalfee / dataReport.exchangetax
                    )}`,
                    messagingmailfeetax: `${dataReport.symbol}${formatNumber(
                        dataReport.messagingmailtotalfee - dataReport.messagingmailtotalfee / dataReport.exchangetax
                    )}`,
                    messagingsmsfee: `${dataReport.symbol}${formatNumber(
                        dataReport.messagingsmstotalfee
                    )}`,
                    messagingmailfee: `${dataReport.symbol}${formatNumber(
                        dataReport.messagingmailtotalfee
                    )}`,
                    voicephonefeenet: `${dataReport.symbol}${formatNumber(
                        dataReport.voicetelephonefee / dataReport.exchangetax
                    )}`,
                    voicepstnfeenet: `${dataReport.symbol}${formatNumber(
                        dataReport.voicepstnfee / dataReport.exchangetax
                    )}`,
                    voicevoipfeenet: `${dataReport.symbol}${formatNumber(
                        dataReport.voicevoipfee / dataReport.exchangetax
                    )}`,
                    voicerecordingfeenet: `${dataReport.symbol}${formatNumber(
                        dataReport.voicerecordingfee / dataReport.exchangetax
                    )}`,
                    voiceotherfeenet: `${dataReport.symbol}${formatNumber(
                        dataReport.voiceotherfee / dataReport.exchangetax
                    )}`,
                    voicephonefeetax: `${dataReport.symbol}${formatNumber(
                        dataReport.voicetelephonefee - dataReport.voicetelephonefee / dataReport.exchangetax
                    )}`,
                    voicepstnfeetax: `${dataReport.symbol}${formatNumber(
                        dataReport.voicepstnfee - dataReport.voicepstnfee / dataReport.exchangetax
                    )}`,
                    voicevoipfeetax: `${dataReport.symbol}${formatNumber(
                        dataReport.voicevoipfee - dataReport.voicevoipfee / dataReport.exchangetax
                    )}`,
                    voicerecordingfeetax: `${dataReport.symbol}${formatNumber(
                        dataReport.voicerecordingfee - dataReport.voicerecordingfee / dataReport.exchangetax
                    )}`,
                    voiceotherfeetax: `${dataReport.symbol}${formatNumber(
                        dataReport.voiceotherfee - dataReport.voiceotherfee / dataReport.exchangetax
                    )}`,
                    voicephonefee: `${dataReport.symbol}${formatNumber(dataReport.voicetelephonefee)}`,
                    voicepstnfee: `${dataReport.symbol}${formatNumber(dataReport.voicepstnfee)}`,
                    voicevoipfee: `${dataReport.symbol}${formatNumber(dataReport.voicevoipfee)}`,
                    voicerecordingfee: `${dataReport.symbol}${formatNumber(
                        dataReport.voicerecordingfee
                    )}`,
                    voiceotherfee: `${dataReport.symbol}${formatNumber(dataReport.voiceotherfee)}`,
                    contactcalculateunique: (dataReport?.contactcalculatemode || "").includes("UNIQUE"),
                    contactuniquelimit: `${formatNumberNoDecimals(dataReport.contactuniquelimit)}`,
                    contactuniquequantity: `${formatNumberNoDecimals(dataReport.contactuniquequantity)}`,
                    contactuniquequantityadditional: `${formatNumberNoDecimals(
                        Math.max(dataReport.contactuniquequantity - dataReport.contactuniquelimit, 0)
                    )}`,
                    contactuniqueadditional: `${dataReport.symbol}${formatNumberFourDecimals(
                        dataReport.contactuniqueadditionalfee
                    )}`,
                    contactuniquefeenet: `${dataReport.symbol}${formatNumber(
                        dataReport.contactuniquefee / dataReport.exchangetax
                    )}`,
                    contactuniquefeetax: `${dataReport.symbol}${formatNumber(
                        dataReport.contactuniquefee - dataReport.contactuniquefee / dataReport.exchangetax
                    )}`,
                    contactuniquefee: `${dataReport.symbol}${formatNumber(dataReport.contactuniquefee)}`,
                    contactotherquantity: `${formatNumberNoDecimals(dataReport.contactotherquantity)}`,
                    contactwhatsappquantity: `${formatNumberNoDecimals(dataReport.contactwhatsappquantity)}`,
                    contactotheradditional: `${dataReport.symbol}${formatNumberFourDecimals(
                        dataReport.contactotheradditionalfee
                    )}`,
                    contactwhatsappadditional: `${dataReport.symbol}${formatNumberFourDecimals(
                        dataReport.contactwhatsappadditionalfee
                    )}`,
                    contactotherfeenet: `${dataReport.symbol}${formatNumber(
                        dataReport.contactotherfee / dataReport.exchangetax
                    )}`,
                    contactwhatsappfeenet: `${dataReport.symbol}${formatNumber(
                        dataReport.contactwhatsappfee / dataReport.exchangetax
                    )}`,
                    contactotherfeetax: `${dataReport.symbol}${formatNumber(
                        dataReport.contactotherfee - dataReport.contactotherfee / dataReport.exchangetax
                    )}`,
                    contactwhatsappfeetax: `${dataReport.symbol}${formatNumber(
                        dataReport.contactwhatsappfee - dataReport.contactwhatsappfee / dataReport.exchangetax
                    )}`,
                    contactotherfee: `${dataReport.symbol}${formatNumber(dataReport.contactotherfee)}`,
                    contactwhatsappfee: `${dataReport.symbol}${formatNumber(
                        dataReport.contactwhatsappfee
                    )}`,
                    infrastructureenabled: (dataReport?.billinginfrastructurefee || 0) > 0,
                    infrastructurefeenet: `${dataReport.symbol}${formatNumber(
                        dataReport.billinginfrastructurefee / dataReport.exchangetax
                    )}`,
                    infrastructurefeetax: `${dataReport.symbol}${formatNumber(
                        dataReport.billinginfrastructurefee -
                        dataReport.billinginfrastructurefee / dataReport.exchangetax
                    )}`,
                    infrastructurefee: `${dataReport.symbol}${formatNumber(
                        dataReport.billinginfrastructurefee
                    )}`,
                    supportplan: `${t(langKeys.supportplan)}: ${dataReport.billingsupportplan}`,
                    supportfeenet: `${dataReport.symbol}${formatNumber(
                        dataReport.billingsupportfee / dataReport.exchangetax
                    )}`,
                    supportfeetax: `${dataReport.symbol}${formatNumber(
                        dataReport.billingsupportfee - dataReport.billingsupportfee / dataReport.exchangetax
                    )}`,
                    supportfee: `${dataReport.symbol}${formatNumber(dataReport.billingsupportfee)}`,
                    consultingquantity: `${formatNumberNoDecimals(dataReport.consultinghourquantity)}`,
                    consultingfeenet: `${dataReport.symbol}${formatNumber(
                        dataReport.consultingtotalfee / dataReport.exchangetax
                    )}`,
                    consultingfeetax: `${dataReport.symbol}${formatNumber(
                        dataReport.consultingtotalfee - dataReport.consultingtotalfee / dataReport.exchangetax
                    )}`,
                    consultingfee: `${dataReport.symbol}${formatNumber(dataReport.consultingtotalfee)}`,
                    additionalservice01: `${dataReport.additionalservice01}`,
                    additionalservice01feenet: `${dataReport.symbol}${formatNumber(
                        dataReport.additionalservice01fee / dataReport.exchangetax
                    )}`,
                    additionalservice01feetax: `${dataReport.symbol}${formatNumber(
                        dataReport.additionalservice01fee - dataReport.additionalservice01fee / dataReport.exchangetax
                    )}`,
                    additionalservice01fee: `${dataReport.symbol}${formatNumber(
                        dataReport.additionalservice01fee
                    )}`,
                    additionalservice02: `${dataReport.additionalservice02}`,
                    additionalservice02feenet: `${dataReport.symbol}${formatNumber(
                        dataReport.additionalservice02fee / dataReport.exchangetax
                    )}`,
                    additionalservice02feetax: `${dataReport.symbol}${formatNumber(
                        dataReport.additionalservice02fee - dataReport.additionalservice02fee / dataReport.exchangetax
                    )}`,
                    additionalservice02fee: `${dataReport.symbol}${formatNumber(
                        dataReport.additionalservice02fee
                    )}`,
                    additionalservice03: `${dataReport.additionalservice03}`,
                    additionalservice03feenet: `${dataReport.symbol}${formatNumber(
                        dataReport.additionalservice03fee / dataReport.exchangetax
                    )}`,
                    additionalservice03feetax: `${dataReport.symbol}${formatNumber(
                        dataReport.additionalservice03fee - dataReport.additionalservice03fee / dataReport.exchangetax
                    )}`,
                    additionalservice03fee: `${dataReport.symbol}${formatNumber(
                        dataReport.additionalservice03fee
                    )}`,
                    billingtotalnet: `${dataReport.symbol}${formatNumber(
                        dataReport.billingtotalfeenet
                    )}`,
                    billingtotaltax: `${dataReport.symbol}${formatNumber(
                        dataReport.billingtotalfeetax
                    )}`,
                    billingtotal: `${dataReport.symbol}${formatNumber(dataReport.billingtotalfee)}`,
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
                            value ? setdataMain((prev) => ({ ...prev, corpid: value.corpid, orgid: value.orgid })) :
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
                                    value={dataReport.company}
                                />
                            </div>
                            <div className="row-zyx">
                                <FieldView
                                    className="col-6"
                                    label={t(langKeys.partnertype)}
                                    value={dataReport.typepartner}
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
                                                        dataReport.billingplanfee / dataReport.tax_costneto
                                                    )}`}</StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.symbol
                                                    }${formatNumber(
                                                        dataReport.billingplanfee -
                                                        dataReport.billingplanfee / dataReport.tax_costneto
                                                    )}`}</StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.symbol
                                                    }${formatNumber(dataReport.billingplanfee)}`}</StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <StyledTableCell>
                                                    <b>{t(langKeys.othercosts)}</b>
                                                </StyledTableCell>
                                                <StyledTableCell></StyledTableCell>
                                                <StyledTableCell></StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.symbol
                                                    }${formatNumber(
                                                        dataReport.othercost / dataReport.tax_costneto
                                                    )}`}</StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.symbol
                                                    }${formatNumber(
                                                        dataReport.othercost -
                                                        dataReport.othercost / dataReport.tax_costneto
                                                    )}`}</StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.symbol
                                                    }${formatNumber(dataReport.othercost)}`}</StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <StyledTableCell>
                                                    <div>
                                                        <b>{t(langKeys.contacts)}</b>
                                                    </div>
                                                    <div>{t(langKeys.totalcontacts)} {dataReport.orgdescription}</div>
                                                    <div>
                                                        <b>{t(langKeys.totalcontacts)}</b>
                                                    </div>
                                                    <div>{t(langKeys.partnercontacts)}</div>
                                                    <div>
                                                        <b>{t(langKeys.additionalcontacts)}</b>
                                                    </div>
                                                    <div>
                                                        <b>{t(langKeys.additionalcontactsperbag)}</b>
                                                    </div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div>
                                                        {formatNumberNoDecimals(dataReport.contactuniquequantity)}
                                                    </div>
                                                    <div>
                                                        {formatNumberNoDecimals(dataReport.contactuniquequantity)}
                                                    </div>
                                                    <div>
                                                        {formatNumberNoDecimals(dataReport.contactuniquequantity)}
                                                    </div>
                                                    <div>
                                                        {formatNumberNoDecimals(dataReport.contactsadditionalbag)}
                                                    </div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div>{`${dataReport.symbol}${formatNumber(
                                                        dataReport.puadditionalcontacts
                                                    )}`}</div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div>{`${dataReport.symbol}${formatNumber(
                                                        dataReport.contactuniquequantity * dataReport.puadditionalcontacts
                                                    )}`}</div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div>{`${dataReport.symbol}${formatNumber(
                                                        dataReport.contactuniquequantity * dataReport.puadditionalcontacts * dataReport.tax
                                                    )}`}</div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                    <div>{`${dataReport.symbol}${formatNumber(
                                                        dataReport.contactuniquequantity * dataReport.puadditionalcontacts * dataReport.tax_costneto
                                                    )}`}</div>
                                                    <div style={{ color: "transparent" }}>.</div>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <StyledTableCell>
                                                    <b>{t(langKeys.periodamount)}</b>
                                                </StyledTableCell>
                                                <StyledTableCell></StyledTableCell>
                                                <StyledTableCell></StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.symbol
                                                    }${formatNumber(dataReport.billingtotalfeenet)}`}</StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.symbol
                                                    }${formatNumber(dataReport.billingtotalfeetax)}`}</StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.symbol
                                                    }${formatNumber(
                                                        parseFloat(dataReport.billingplanfee) + parseFloat(dataReport.othercost) +
                                                        (dataReport.contactuniquequantity * dataReport.puadditionalcontacts * dataReport.tax_costneto)
                                                    )}`}</StyledTableCell>
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
                                            <StyledTableRow>
                                                <StyledTableCell>
                                                    <div>{dataReport.orgdescription}</div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div>
                                                        <b>{dataReport.typepartner}</b>
                                                    </div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div>{`${dataReport.symbol}${formatNumber(
                                                        dataReport.billingplanfee
                                                    )}`}</div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div>{`${formatNumber(
                                                        100 - dataReport.comissionpercentage
                                                    )}%`}</div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div>{`${dataReport.symbol}${formatNumber(
                                                        dataReport.billingplanfee * ((100 - dataReport.comissionpercentage) / 100)
                                                    )}`}</div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div>{`${dataReport.symbol}${formatNumber(
                                                        dataReport.othercost
                                                    )}`}</div>
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <div>{`${dataReport.symbol}${formatNumber(
                                                        (dataReport.billingplanfee * ((100 - dataReport.comissionpercentage) / 100)) + parseFloat(dataReport.othercost)
                                                    )}`}</div>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <StyledTableCell>
                                                    <b>{t(langKeys.periodamount)}</b>
                                                </StyledTableCell>
                                                <StyledTableCell></StyledTableCell>
                                                <StyledTableCell></StyledTableCell>
                                                <StyledTableCell></StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.symbol
                                                    }${formatNumber(dataReport.billingplanfee * ((100 - dataReport.comissionpercentage) / 100))}`}</StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.symbol
                                                    }${formatNumber(dataReport.othercost)}`}</StyledTableCell>
                                                <StyledTableCell align="right">{`${dataReport.symbol
                                                    }${formatNumber(
                                                        (dataReport.billingplanfee * ((100 - dataReport.comissionpercentage) / 100)) + parseFloat(dataReport.othercost)
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