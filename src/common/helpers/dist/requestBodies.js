"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.subReasonNonDeliveryIns = exports.subReasonNonDeliverySel = exports.reasonNonDeliveryIns = exports.reasonNonDeliverySel = exports.listOrderSel = exports.deliveryAppUsersSel = exports.deliveryVehicleIns = exports.deliveryVehicleSel = exports.deliveryConfigurationIns = exports.deliveryConfigurationSel = exports.getWarehouseSel = exports.heatmapConfigIns = exports.getHeatmapConfig = exports.updateAssistantAiDocumentTraining = exports.insMessageAi = exports.messageAiSel = exports.insThread = exports.threadSel = exports.insAssistantAiDoc = exports.assistantAiDocumentSel = exports.insAssistantAi = exports.assistantAiSel = exports.getStatusHistoryInventoryConsumption = exports.generateguiaremisiondetailSel = exports.generateguiaremisionSel = exports.generateLabelSel = exports.inventoryconsumptionsbywarehouseSel = exports.reservationswarehouseSel = exports.inventoryConsumptionComplete = exports.insLeadConfig = exports.selOrderConfig = exports.insOrderConfig = exports.templatesChatflowClone = exports.getTemplatesChatflow = exports.inventoryConsumptionDetailIns = exports.insInventoryConsumption = exports.billingPeriodPartnerDeveloperReseller = exports.getPaginatedInventoryConsumption = exports.updateInventoryBalances = exports.insOrderInventory = exports.getInventoryMovement = exports.billingPeriodPartnerEnterprise = exports.customerByPartnerIns = exports.customerPartnersByUserSel = exports.customerByPartnerSel = exports.partnerIns = exports.partnerSel = exports.insInventoryBooking = exports.getInventoryBooking = exports.getInventoryLote = exports.getInventoryWarehouse = exports.getInventoryRecount = exports.getInventoryCost = exports.getInventoryExport = exports.insInventoryBalance = exports.getInventoryBalance = exports.duplicateProduct = exports.importstatusProduct = exports.importManufacturer = exports.insCompany = exports.getCompanyExport = exports.getPaginatedCompanies = exports.importWarehouse = exports.importProductsAttribute = exports.getProductOrderProp = exports.getProductManufacturer = exports.insProductDealer = exports.insProductManufacturer = exports.getManufacturer = exports.importProductsWarehouse = exports.importProductManufacturer = exports.importProducts = exports.getProductStatusHistory = exports.getWarehouses = exports.getInventoryConsumptionExport = exports.getWarehouseExport = exports.getPaginatedInventory = exports.insInventory = exports.getPaginatedWarehouse = exports.insProductWarehouse = exports.getInventoryConsumptionDetail = exports.getProductsWarehouse = exports.getProducts = exports.getProductsExport = exports.insStatusProductMas = exports.insStatusProduct = exports.insProductAttribute = exports.getAllAttributeProduct = exports.insProductAlternative = exports.getProductProduct = exports.getWarehouseProducts = exports.insWarehouse = exports.insProduct = exports.getPaginatedProducts = exports.rasaModelSel = exports.rasaSynonimIns = exports.rasaSynonimSel = exports.rasaIntentIns = exports.rasaIntentSel = exports.currencySel = exports.timeSheetPeriodSel = exports.timeSheetProfileSel = exports.timeSheetUserSel = exports.timeSheetSel = exports.timeSheetIns = exports.productOrderList = exports.metaBusinessSel = exports.metaBusinessIns = exports.metaCatalogSel = exports.metaCatalogIns = exports.paymentOrderSel = exports.productCatalogUpdArray = exports.productCatalogInsArray = exports.exportintent = exports.billingPeriodArtificialIntelligenceInsArray = exports.billingPeriodArtificialIntelligenceSel = exports.billingArtificialIntelligenceSel = exports.billingArtificialIntelligenceIns = exports.artificialIntelligenceServiceSel = exports.artificialIntelligenceServiceIns = exports.artificialIntelligencePlanSel = exports.artificialIntelligencePlanIns = exports.getChatflowVariableSel = exports.entitydelete = exports.utterancedelete = exports.insertentity = exports.insertutterance = exports.selEntities = exports.selUtterance = exports.selIntent = exports.selInvoiceComment = exports.insInvoiceComment = exports.getReportKpiOperativoSel = exports.locationIns = exports.getMessageTemplateExport = exports.getLocationExport = exports.getPaginatedLocation = exports.selCommunicationChannelWhatsApp = exports.deleteClassificationTree = exports.getPropertiesIncludingName = exports.getHSMHistoryReportExport = exports.getHSMHistoryReport = exports.getUniqueContactsSel = exports.getHSMHistoryList = exports.getVoiceCallReportExport = exports.getTicketvsAdviserExport = exports.getcomplianceSLA = exports.getComplianceSLAExport = exports.getleadgridtrackingExport = exports.getRequestSDExport = exports.getreportleadgridtracking = exports.getreportrequestSD = exports.getasesorvsticketsSel = exports.getDisconnectionDataTimes = exports.unLinkPerson = exports.ufnlinkPersons = exports.getDisconnectionTimes = exports.getUserAsesorByOrgID = exports.getAdvisorListVoxi = exports.conversationCloseUpd = exports.conversationTransferStatus = exports.conversationSupervisionStatus = exports.conversationOutboundValidate = exports.conversationOutboundIns = exports.getCityBillingList = exports.getCurrencyList = exports.getInvoiceReportDetail = exports.getInvoiceReportSummary = exports.conversationCallHold = exports.paymentCardInsert = exports.listPaymentCard = exports.productCatalogIns = exports.postHistoryIns = exports.getPostHistorySel = exports.getProductCatalogSel = exports.getPaginatedReportVoiceCall = exports.getPaginatedProductCatalog = exports.getPersonFromBooking = exports.insBookingCalendar = exports.CalendaryBookingReport = exports.validateCalendaryBooking = exports.getEventByCode = exports.insCalendar = exports.insCommentsBooking = exports.calendarBookingSelOne = exports.calendarBookingCancel2 = exports.calendarBookingCancel = exports.selBookingIntegrationSel = exports.selBookingCalendar = exports.selCalendar = exports.billingReportConsulting = exports.billingReportHsmHistory = exports.billingReportConversationWhatsApp = exports.getCorpSelVariant = exports.getBalanceSelSent = exports.getBillingMessagingCurrent = exports.selBalanceData = exports.checkUserPaymentPlan = exports.getInvoiceDetail = exports.getConversationsWhatsapp = exports.getMeasureUnit = exports.cancelSuscription = exports.changePlan = exports.getKpiSel = exports.getVariablesByOrg = exports.getAdviserFilteredUserRol = exports.invoiceRefresh = exports.billingMessagingIns = exports.getBillingMessagingSel = exports.getColumnsOrigin = exports.getTableOrigin = exports.getBillingPeriodPartnerCalc = exports.getBillingPeriodCalcRefreshAll = exports.changeStatus = exports.personcommunicationchannelUpdateLockedArrayIns = exports.appsettingInvoiceSelCombo = exports.appsettingInvoiceIns = exports.appsettingInvoiceSel = exports.calcKPIManager = exports.selKPIManagerHistory = exports.duplicateKPIManager = exports.insKPIManager = exports.selKPIManager = exports.getAnalyticsIA = exports.getHistoryStatusConversation = exports.getLeadTasgsSel = exports.deleteInvoice = exports.selInvoiceClient = exports.selInvoice = exports.getBusinessDocType = exports.getBillingPeriodCalc = exports.getDashboardTemplateIns = exports.getDashboardTemplateSel = exports.getRecordVoicecallGraphic = exports.getRecordHSMGraphic = exports.getRecordHSMReport = exports.getRecordHSMList = exports.inputValidationins = exports.getInputValidationSel = exports.billinguserreportsel = exports.billingpersonreportsel = exports.getBillingPeriodSummarySelCorp = exports.getBillingPeriodSummarySel = exports.billingPeriodUpd = exports.getBillingPeriodSel = exports.billingConversationIns = exports.getBillingConversationSel = exports.billingConfigurationIns = exports.getBillingConfigurationSel = exports.billingSupportIns = exports.getBillingSupportSel = exports.getPhoneTax = exports.getPaymentPlanSel = exports.getPlanSel = exports.changePasswordOnFirstLoginIns = exports.leadHistoryIns = exports.updateLeadTagsIns = exports.leadHistorySel = exports.heatmappage3detail = exports.heatmappage3 = exports.heatmappage2detail2 = exports.heatmappage2detail1 = exports.heatmappage2 = exports.heatmappage1detail = exports.heatmappage1 = exports.heatmapresumensel = exports.insArchiveLead = exports.insArchiveServiceDesk = exports.getLeadExport = exports.getPaginatedSDLead = exports.getPaginatedLead = exports.leadLogNotesIns = exports.leadLogNotesSel = exports.leadActivitySel = exports.leadActivityIns = exports.paginatedPersonWithoutDateSel = exports.userSDSel = exports.adviserSel = exports.getOneLeadSel = exports.insLead2 = exports.insSDLead = exports.insLead = exports.updateColumnsOrder = exports.updateOrderStatus = exports.updateColumnsLeads = exports.insColumns = exports.insAutomatizationRules = exports.getOrderColumns = exports.getAutomatizationRulesSel = exports.getLeadsSDSel = exports.getLeadsSel = exports.getColumnsSDSel = exports.getColumnsSel = exports.insLeadPerson = exports.editPersonBody = exports.personImportValidation = exports.personInsValidation = exports.insPersonCommunicationChannel = exports.insPersonBody = exports.getPropertyConfigurationsBody = exports.getLeadsByUserPerson = exports.getAttachmentsByPerson = exports.getConversationClassification2 = exports.getPropertySelByNameOrg = exports.getPropertySelByName = exports.getdashboardoperativoEncuesta2Seldata = exports.getdashboardoperativoEncuesta3Seldata = exports.getdashboardoperativoEncuestaSel = exports.getdashboardoperativoEncuesta3Sel = exports.getdashboardoperativoProdxHoraDistSeldata = exports.getdashboardoperativoProdxHoraDistSel = exports.getdashboardoperativoProdxHoraSel = exports.getdashboardoperativoTMEdistseldata = exports.getdashboardoperativoTMOdistseldata = exports.getdashboardoperativoSummarySel = exports.getdashboardgerencialconverstionxhoursel = exports.getdashboardoperativoTMEGENERALSeldata = exports.getdashboardoperativoTMEGENERALSel = exports.getdashboardoperativoTMOGENERALSeldata = exports.getdashboardoperativoTMOGENERALSel = exports.getdashboardPushMENSAJEXDIASelData = exports.getdashboardPushAppDataSel = exports.getdashboardPushAppSel = exports.getdashboardRankingPushDataSel = exports.getdashboardRankingPushSel = exports.getdashboardPushMENSAJEXDIASel = exports.getdashboardPushHSMRANKSelData = exports.getdashboardPushHSMRANKSel = exports.getdashboardPushSUMMARYSelData = exports.getdashboardPushSUMMARYSel = exports.getdashboardPushHSMCATEGORYRANKSelData = exports.getdashboardPushHSMCATEGORYRANKSel = exports.getLabelsSel = exports.getSupervisorsSel = exports.getCountConfigurationsBody = exports.gerencialasesoresconectadosbarseldata = exports.gerencialasesoresconectadosbarsel = exports.gerencialetiquetasseldata = exports.gerencialetiquetassel = exports.gerencialchannelsel = exports.gerencialinteractionseldata = exports.gerencialinteractionsel = exports.gerencialconversationseldata = exports.gerencialconversationsel = exports.gerencialEncuesta2selData = exports.gerencialEncuesta3selData = exports.gerencialencuestasel = exports.gerencialsummaryseldata = exports.gerencialsummarysel = exports.dashboardKPIMonthSummaryGraphSel = exports.dashboardKPISummaryGraphSel = exports.dashboardKPIMonthSummarySel = exports.dashboardKPISummarySel = exports.gerencialEncuestassel = exports.gerencialTMEselData = exports.gerencialTMEsel = exports.gerencialTMOselData = exports.gerencialTMOsel = exports.insInteligentModelConfiguration = exports.getIntelligentModels = exports.getIntelligentModelsConfigurations = exports.reassignMassiveTicket = exports.getBlocksUserFromChatfow = exports.getCampaignStatus = exports.getCampaignStart = exports.getCampaignReportProactiveExport = exports.getCampaignReportExport = exports.getCampaignReportPaginated = exports.getBlacklistExport = exports.getBlacklistPaginated = exports.insarrayBlacklist = exports.insBlacklist = exports.insertReportTemplate = exports.getReportTemplateSel = exports.getTagsChatflow = exports.getOpportunitiesByPersonBody = exports.getAdditionalInfoByPersonBody = exports.getChannelListByPersonBody = exports.insPersonUpdateLocked = exports.getReferrerByPersonBody = exports.getTicketListByPersonBody = exports.insCampaignMember = exports.getCampaignMemberSel = exports.getUserGroupsSel = exports.campaignLeadPersonSel = exports.campaignPersonSel = exports.stopCampaign = exports.delCampaign = exports.insCampaign = exports.getCampaignSel = exports.getCampaignLst = exports.getEditChatWebChannel = exports.getEditChannel = exports.getInsertChatwebChannel = exports.insarrayInventoryCost = exports.insarrayInventoryStandarCost = exports.insarrayInventoryRecount = exports.insarrayInventoryBalance = exports.insarrayVariableConfiguration = exports.insVariableConfiguration = exports.getVariableConfigurationSel = exports.getTicketsByFilter = exports.updateGroupOnHSM = exports.getVariableConfigurationLst = exports.dupChatflowBlock = exports.insChatflowBlock = exports.getChatflowBlockSel = exports.getChatflowBlockLst = exports.getasesoresbyorgid = exports.getChannelSel = exports.getdataIntegrationManager = exports.deldataIntegrationManager = exports.importPerson = exports.insarrayIntegrationManager = exports.insIntegrationManager = exports.getIntegrationManagerSel = exports.insMessageTemplate = exports.getMessageTemplateLst = exports.getPaginatedMessageTemplate = exports.getParentSel = exports.getValuesForTree = exports.getCommChannelLstTypeDesc = exports.getCommChannelLst = exports.getConfigurationVariables = exports.getPersonExport = exports.getPaginatedPersonLink = exports.getPaginatedPersonLead = exports.getPersonOne = exports.getPaginatedPerson = exports.insClassification = exports.insInvoice = exports.getClassificationSel = exports.getTimeZoneSel = exports.insQuickreplies = exports.insOrg = exports.insCorp = exports.getQuickrepliesSel = exports.insDomainvalue = exports.insDomain = exports.getDomainValueSel = exports.documentLibraryInsArray = exports.documentLibraryIns = exports.reportSchedulerIns = exports.getReportSchedulerSel = exports.getDocumentLibraryByUser = exports.getDocumentLibrary = exports.getDomainSel = exports.insConversationClassificationMassive = exports.getComunicationChannelDelegate = exports.getUniqueContactsConversationExport = exports.getUniqueContactsExport = exports.getTicketExport = exports.selUniqueContactsConversation = exports.selUniqueContactsPcc = exports.getPaginatedTicket = exports.insEmoji = exports.getEmojiSel = exports.getEmojiAllSel = exports.getUserProductivityGraphic = exports.getUserProductivitySel = exports.getReportGraphic = exports.getReportExport = exports.getPaginatedForReports = exports.getReportFilterSel = exports.getReportColumnSel = exports.getReportSel = exports.insSLA = exports.getOrgSelList = exports.getOrgSel = exports.getOrderHistory = exports.getOrderLineSel = exports.getOrderSel = exports.getCorpSel = exports.getSLASel = exports.insIntelligentModels = exports.getIntelligentModelsSel = exports.insarrayInappropriateWords = exports.insInappropriateWords = exports.getInappropriateWordsLst = exports.getInappropriateWordsSel = exports.insWhitelist = exports.updSecurityRules = exports.getSecurityRules = exports.getWhitelistSel = exports.insGroupConfig = exports.insProperty = exports.selOrgSimpleList = exports.selStore = exports.insStore = exports.insOrgUser = exports.insUser = exports.getClassificationLevel2 = exports.getClassificationLevel1 = exports.getListUsers = exports.getValuesFromDomainCorp = exports.getValuesFromDomainLight = exports.getReportschedulerreportsSel = exports.getCatalogMasterList = exports.getDomainChannelTypeList = exports.getValuesFromDomain = exports.getChannelsByOrg = exports.getGroupConfigSel = exports.getDistinctPropertySel = exports.getPropertySel = exports.getApplicationsByRole = exports.getSupervisors = exports.getRolesByOrg = exports.getIntentByConversation = exports.getInteractionsByConversation = exports.getTicketsByPerson = exports.getInfoPerson = exports.getTickets = exports.insertClassificationConversation = exports.getListQuickReply = exports.getUsersBySupervisorLst = exports.getTimeWaiting = exports.getUsersBySupervisor = exports.getOrgsByCorp = exports.getUserChannelSel = exports.getConversationSelVoxi = exports.callUpdateToken = exports.getOrgUserSel = exports.getUserSel = void 0;
var _1 = require(".");
exports.getUserSel = function (userid) { return ({
    method: "UFN_USER_SEL",
    key: "UFN_USER_SEL",
    parameters: {
        id: userid,
        all: true
    }
}); };
exports.getOrgUserSel = function (userid, orgid) { return ({
    method: "UFN_ORGUSER_SEL",
    key: "UFN_ORGUSER_SEL",
    parameters: {
        userid: userid,
        orgid: orgid,
        all: true
    }
}); };
exports.callUpdateToken = function () { return ({
    method: "UFN_TEST",
    key: "UFN_TEST",
    parameters: {}
}); };
exports.getConversationSelVoxi = function () { return ({
    method: "UFN_CONVERSATION_SEL_VOXI",
    key: "UFN_CONVERSATION_SEL_VOXI",
    parameters: {
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
}); };
exports.getUserChannelSel = function () { return ({
    method: "UFN_USER_CHANNEL_SEL",
    key: "UFN_USER_CHANNEL_SEL",
    parameters: {}
}); };
exports.getOrgsByCorp = function (orgid, keytmp) { return ({
    method: "UFN_CORP_ORG_SEL",
    key: "UFN_CORP_ORG_SEL" + (keytmp || ""),
    parameters: {
        id: orgid,
        all: true
    }
}); };
exports.getUsersBySupervisor = function () { return ({
    method: "UFN_USERBYSUPERVISOR_SEL",
    key: "UFN_USERBYSUPERVISOR_SEL",
    parameters: {}
}); };
exports.getTimeWaiting = function (useridselected) { return ({
    method: "UFN_TIME_WAITING_SEL",
    key: "UFN_TIME_WAITING_SEL_" + useridselected,
    parameters: { useridselected: useridselected }
}); };
exports.getUsersBySupervisorLst = function () { return ({
    method: "UFN_USERBYSUPERVISOR_LST",
    key: "UFN_USERBYSUPERVISOR_LST",
    parameters: {}
}); };
exports.getListQuickReply = function () { return ({
    method: "UFN_QUICKREPLY_LIST_SEL",
    key: "UFN_QUICKREPLY_LIST_SEL",
    parameters: { classificationid: 0, all: true }
}); };
exports.insertClassificationConversation = function (conversationid, classificationid, jobplan, operation) { return ({
    method: "UFN_CONVERSATIONCLASSIFICATION_INS",
    key: "UFN_CONVERSATIONCLASSIFICATION_INS",
    parameters: { conversationid: conversationid, classificationid: classificationid, jobplan: jobplan, operation: operation }
}); };
exports.getTickets = function (userid) { return ({
    method: "UFN_CONVERSATION_SEL_TICKETSBYUSER",
    key: "UFN_CONVERSATION_SEL_TICKETSBYUSER_" + userid,
    parameters: __assign({}, (userid && { agentid: userid }))
}); };
exports.getInfoPerson = function (personid, conversationid) { return ({
    method: "UFN_CONVERSATION_PERSON_SEL",
    key: "UFN_CONVERSATION_PERSON_SEL",
    parameters: { personid: personid, conversationid: conversationid }
}); };
exports.getTicketsByPerson = function (personid, conversationid) { return ({
    method: "UFN_CONVERSATION_SEL_TICKETSBYPERSON",
    key: "UFN_CONVERSATION_SEL_TICKETSBYPERSON",
    parameters: { personid: personid, conversationid: conversationid }
}); };
exports.getInteractionsByConversation = function (conversationid, lock, conversationold) { return ({
    method: "UFN_CONVERSATION_SEL_INTERACTION",
    key: "UFN_CONVERSATION_SEL_INTERACTION_" + conversationid,
    parameters: { conversationid: conversationid, lock: lock, conversationold: conversationold }
}); };
exports.getIntentByConversation = function (conversationid) { return ({
    method: "UFN_CONVERSATION_SEL_INTENT",
    key: "UFN_CONVERSATION_SEL_INTENT",
    parameters: { conversationid: conversationid }
}); };
exports.getRolesByOrg = function () { return ({
    method: "UFN_ROLE_LST",
    key: "UFN_ROLE_LST",
    parameters: {}
}); };
exports.getSupervisors = function (orgid, userid, keytmp) { return ({
    method: "UFN_USER_SUPERVISOR_LST",
    key: "UFN_USER_SUPERVISOR_LST" + (keytmp || ""),
    parameters: {
        orgid: orgid,
        userid: userid
    }
}); };
exports.getApplicationsByRole = function (roleid, keytmp) { return ({
    method: "UFN_APPS_DATA_SEL",
    key: "UFN_APPS_DATA_SEL" + (keytmp || ""),
    parameters: {
        roleid: roleid
    }
}); };
exports.getPropertySel = function (corpid, propertyname, description, category, level, propertyid) { return ({
    method: "UFN_PROPERTY_SEL",
    key: "UFN_PROPERTY_SEL",
    parameters: {
        corpid: corpid,
        propertyname: propertyname,
        description: description,
        category: category,
        level: level,
        id: propertyid,
        all: propertyid === 0,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
}); };
exports.getDistinctPropertySel = function (category, level) { return ({
    method: "UFN_DISTINCT_PROPERTY_SEL",
    key: "UFN_DISTINCT_PROPERTY_SEL",
    parameters: {
        category: category,
        level: level
    }
}); };
exports.getGroupConfigSel = function (groupconfigid) { return ({
    method: "UFN_GROUPCONFIGURATION_SEL",
    key: "UFN_GROUPCONFIGURATION_SEL",
    parameters: {
        id: groupconfigid,
        all: groupconfigid === 0
    }
}); };
exports.getChannelsByOrg = function (orgid, keytmp) { return ({
    method: "UFN_COMMUNICATIONCHANNELBYORG_LST",
    key: "UFN_COMMUNICATIONCHANNELBYORG_LST" + (keytmp || ""),
    parameters: {
        orgid: orgid || undefined
    }
}); };
exports.getValuesFromDomain = function (domainname, keytmp, orgid, corpid) { return ({
    method: "UFN_DOMAIN_LST_VALORES",
    key: "UFN_DOMAIN_LST_VALORES" + (keytmp || ""),
    parameters: {
        domainname: domainname,
        orgid: orgid || undefined,
        corpid: corpid || undefined
    }
}); };
exports.getDomainChannelTypeList = function () { return ({
    method: "UFN_DOMAIN_CHANNELTYPE_LST",
    key: "UFN_DOMAIN_CHANNELTYPE_LST",
    parameters: {}
}); };
exports.getCatalogMasterList = function () { return ({
    method: "UFN_METACATALOG_SEL",
    key: "UFN_METACATALOG_SEL",
    parameters: {
        metabusinessid: 0,
        id: 0
    }
}); };
exports.getReportschedulerreportsSel = function () { return ({
    method: "UFN_REPORTSCHEDULER_REPORTSEL",
    key: "UFN_REPORTSCHEDULER_REPORTSEL",
    parameters: {}
}); };
// solo devuelve desc y value, no id (USAR ESTE PARA LOS SELECTS SIMPLES DE DOMINIOS)
exports.getValuesFromDomainLight = function (domainname, keytmp, orgid) { return ({
    method: "UFN_DOMAIN_LST_VALUES_ONLY_DATA",
    key: "UFN_DOMAIN_LST_VALUES_ONLY_DATA_" + (domainname),
    parameters: {
        domainname: domainname,
        orgid: orgid || undefined
    }
}); };
exports.getValuesFromDomainCorp = function (domainname, keytmp, corpid, orgid) { return ({
    method: "UFN_DOMAIN_LST_VALORES",
    key: "UFN_DOMAIN_LST_VALORES" + (keytmp || ""),
    parameters: {
        domainname: domainname,
        corpid: corpid || undefined,
        orgid: orgid || undefined
    }
}); };
exports.getListUsers = function () { return ({
    method: "UFN_CONVERSATION_LST_USRDELEGATE2",
    key: "UFN_CONVERSATION_LST_USRDELEGATE2",
    parameters: {}
}); };
exports.getClassificationLevel1 = function (type) { return ({
    method: "UFN_CONVERSATIONCLASSIFICATIONLIST_LEVEL1_SEL",
    key: "UFN_CONVERSATIONCLASSIFICATIONLIST_LEVEL1_SEL",
    parameters: { type: type }
}); };
exports.getClassificationLevel2 = function (type, classificationid) { return ({
    method: "UFN_CONVERSATIONCLASSIFICATIONLIST_LEVEL2_SEL",
    key: "UFN_CONVERSATIONCLASSIFICATIONLIST_LEVEL2_SEL",
    parameters: { type: type, classificationid: classificationid }
}); };
exports.insUser = function (_a) {
    var id = _a.id, usr = _a.usr, doctype = _a.doctype, send_password_by_email = _a.send_password_by_email, docnum = _a.docnum, _b = _a.password, password = _b === void 0 ? "" : _b, firstname = _a.firstname, lastname = _a.lastname, email = _a.email, pwdchangefirstlogin = _a.pwdchangefirstlogin, type = _a.type, status = _a.status, _c = _a.description, description = _c === void 0 ? "" : _c, operation = _a.operation, _d = _a.company, company = _d === void 0 ? "" : _d, twofactorauthentication = _a.twofactorauthentication, registercode = _a.registercode, billinggroupid = _a.billinggroupid, image = _a.image, language = _a.language, _e = _a.key, key = _e === void 0 ? "UFN_USER_INS" : _e;
    return ({
        method: "UFN_USER_INS",
        key: key,
        parameters: { id: id, usr: usr, doctype: doctype, docnum: docnum, password: password, firstname: firstname, lastname: lastname, email: email, pwdchangefirstlogin: pwdchangefirstlogin, type: type, status: status, description: description, operation: operation, company: company, twofactorauthentication: twofactorauthentication, sendMailPassword: send_password_by_email, registercode: registercode, billinggroup: billinggroupid || 0, image: image, language: language }
    });
};
exports.insOrgUser = function (_a) {
    var rolegroups = _a.rolegroups, orgid = _a.orgid, bydefault = _a.bydefault, labels = _a.labels, groups = _a.groups, channels = _a.channels, status = _a.status, type = _a.type, _b = _a.supervisor, supervisor = _b === void 0 ? "" : _b, operation = _a.operation, redirect = _a.redirect, storeid = _a.storeid, warehouseid = _a.warehouseid, showbots = _a.showbots;
    return ({
        method: "UFN_ORGUSER_INS",
        key: "UFN_ORGUSER_INS",
        parameters: { orgid: orgid, rolegroups: rolegroups, usersupervisor: supervisor, bydefault: bydefault, labels: labels, groups: groups, channels: channels, status: status, type: type, defaultsort: 1, operation: operation, redirect: redirect, storeid: storeid, warehouseid: warehouseid, showbots: showbots }
    });
};
exports.insStore = function (_a) {
    var id = _a.id, description = _a.description, phone = _a.phone, address = _a.address, warehouseid = _a.warehouseid, coveragearea = _a.coveragearea, warehouseinstore = _a.warehouseinstore, type = _a.type, status = _a.status, operation = _a.operation;
    return ({
        method: "UFN_STORE_INS",
        key: "UFN_STORE_INS",
        parameters: { id: id, description: description, phone: phone, address: address, warehouseid: warehouseid, coveragearea: coveragearea, warehouseinstore: warehouseinstore, type: type, status: status, operation: operation }
    });
};
exports.selStore = function (id) { return ({
    method: "UFN_STORE_SEL",
    key: "UFN_STORE_SEL",
    parameters: { id: id, all: id === 0 }
}); };
exports.selOrgSimpleList = function () { return ({
    method: "UFN_ORG_LST_SIMPLE",
    key: "UFN_ORG_LST_SIMPLE",
    parameters: {}
}); };
exports.insProperty = function (_a) {
    var orgid = _a.orgid, communicationchannelid = _a.communicationchannelid, id = _a.id, propertyname = _a.propertyname, propertyvalue = _a.propertyvalue, description = _a.description, status = _a.status, type = _a.type, category = _a.category, domainname = _a.domainname, group = _a.group, level = _a.level, operation = _a.operation, corpid = _a.corpid;
    return ({
        method: "UFN_PROPERTY_INS",
        key: "UFN_PROPERTY_INS",
        parameters: { orgid: orgid, communicationchannelid: communicationchannelid, id: id, propertyname: propertyname, propertyvalue: propertyvalue, description: description, status: status, type: type, category: category, domainname: domainname, group: group, level: level, operation: operation, corpid: corpid }
    });
};
exports.insGroupConfig = function (_a) {
    var id = _a.id, operation = _a.operation, domainid = _a.domainid, description = _a.description, type = _a.type, status = _a.status, quantity = _a.quantity, validationtext = _a.validationtext;
    return ({
        method: "UFN_GROUPCONFIGURATION_INS",
        key: "UFN_GROUPCONFIGURATION_INS",
        parameters: { id: id, operation: operation, domainid: domainid, description: description, type: type, status: status, quantity: quantity, validationtext: validationtext }
    });
};
exports.getWhitelistSel = function (whitelistid) { return ({
    method: "UFN_WHITELIST_SEL",
    key: "UFN_WHITELIST_SEL",
    parameters: {
        id: whitelistid,
        all: whitelistid === 0
    }
}); };
exports.getSecurityRules = function () { return ({
    method: "UFN_SECURITYRULES_SEL",
    key: "UFN_SECURITYRULES_SEL",
    parameters: {}
}); };
exports.updSecurityRules = function (_a) {
    var id = _a.id, mincharacterspwd = _a.mincharacterspwd, maxcharacterspwd = _a.maxcharacterspwd, specialcharacterspwd = _a.specialcharacterspwd, numericalcharacterspwd = _a.numericalcharacterspwd, uppercaseletterspwd = _a.uppercaseletterspwd, lowercaseletterspwd = _a.lowercaseletterspwd, allowsconsecutivenumbers = _a.allowsconsecutivenumbers, numequalconsecutivecharacterspwd = _a.numequalconsecutivecharacterspwd, periodvaliditypwd = _a.periodvaliditypwd, maxattemptsbeforeblocked = _a.maxattemptsbeforeblocked, pwddifferentchangelogin = _a.pwddifferentchangelogin;
    return ({
        method: "UFN_SECURITYRULES_UPD",
        key: "UFN_SECURITYRULES_UPD",
        parameters: {
            id: id, mincharacterspwd: mincharacterspwd, maxcharacterspwd: maxcharacterspwd,
            specialcharacterspwd: specialcharacterspwd || "04",
            numericalcharacterspwd: numericalcharacterspwd || "04",
            uppercaseletterspwd: uppercaseletterspwd || "04",
            lowercaseletterspwd: lowercaseletterspwd || "04",
            allowsconsecutivenumbers: allowsconsecutivenumbers, numequalconsecutivecharacterspwd: numequalconsecutivecharacterspwd, periodvaliditypwd: periodvaliditypwd, maxattemptsbeforeblocked: maxattemptsbeforeblocked, pwddifferentchangelogin: pwddifferentchangelogin
        }
    });
};
exports.insWhitelist = function (_a) {
    var id = _a.id, operation = _a.operation, documenttype = _a.documenttype, phone = _a.phone, documentnumber = _a.documentnumber, usergroup = _a.usergroup, type = _a.type, status = _a.status, username = _a.username;
    return ({
        method: "UFN_WHITELIST_INS",
        key: "UFN_WHITELIST_INS",
        parameters: { id: id, operation: operation, documenttype: documenttype, phone: phone.toString() || "", documentnumber: documentnumber.toString(), usergroup: usergroup, type: type, status: status, asesorname: username }
    });
};
exports.getInappropriateWordsSel = function (id) { return ({
    method: "UFN_INAPPROPRIATEWORDS_SEL",
    parameters: {
        id: id,
        all: id === 0
    }
}); };
exports.getInappropriateWordsLst = function () { return ({
    method: "UFN_INAPPROPRIATEWORDS_LST",
    parameters: {}
}); };
exports.insInappropriateWords = function (_a) {
    var id = _a.id, description = _a.description, status = _a.status, type = _a.type, username = _a.username, operation = _a.operation, classification = _a.classification, defaultanswer = _a.defaultanswer;
    return ({
        method: "UFN_INAPPROPRIATEWORDS_INS",
        parameters: { id: id, description: description, status: status, type: type, username: username, operation: operation, classification: classification, defaultanswer: defaultanswer }
    });
};
exports.insarrayInappropriateWords = function (table) { return ({
    method: "UFN_INAPPROPRIATEWORDS_INS_ARRAY",
    parameters: {
        table: JSON.stringify(table)
    }
}); };
exports.getIntelligentModelsSel = function (id) { return ({
    method: "UFN_INTELLIGENTMODELS_SEL",
    parameters: {
        id: id,
        all: id === 0
    }
}); };
exports.insIntelligentModels = function (_a) {
    var id = _a.id, operation = _a.operation, description = _a.description, endpoint = _a.endpoint, modelid = _a.modelid, provider = _a.provider, apikey = _a.apikey, type = _a.type, status = _a.status;
    return ({
        method: "UFN_INTELLIGENTMODELS_INS",
        parameters: { id: id, operation: operation, description: description, endpoint: endpoint, modelid: modelid, provider: provider, apikey: apikey, type: type, status: status }
    });
};
exports.getSLASel = function (id) { return ({
    method: "UFN_SLA_SEL",
    parameters: {
        id: id,
        all: id === 0
    }
}); };
exports.getCorpSel = function (id) { return ({
    method: "UFN_CORP_SEL",
    key: "UFN_CORP_SEL",
    parameters: {
        id: id,
        all: id === 0
    }
}); };
exports.getOrderSel = function (product, category, type) { return ({
    method: "UFN_ORDER_SEL",
    key: "UFN_ORDER_SEL",
    parameters: {
        product: product !== null && product !== void 0 ? product : "",
        category: category !== null && category !== void 0 ? category : "",
        type: type !== null && type !== void 0 ? type : ""
    }
}); };
exports.getOrderLineSel = function (orderid) { return ({
    method: "UFN_ORDERLINE_SEL",
    key: "UFN_ORDERLINE_SEL",
    parameters: { orderid: orderid }
}); };
exports.getOrderHistory = function (orderid) { return ({
    method: "UFN_ORDERHISTORY_SEL",
    key: "UFN_ORDERHISTORY_SEL",
    parameters: {
        orderid: orderid,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
}); };
exports.getOrgSel = function (id, corpid) { return ({
    method: "UFN_ORG_SEL",
    key: "UFN_ORG_SEL",
    parameters: {
        orgid: id,
        all: id === 0,
        corpid: corpid
    }
}); };
exports.getOrgSelList = function (id) { return ({
    method: "UFN_ORG_LIST",
    parameters: {
        corpid: id
    }
}); };
exports.insSLA = function (_a) {
    var id = _a.id, description = _a.description, type = _a.type, company = _a.company, communicationchannelid = _a.communicationchannelid, usergroup = _a.usergroup, status = _a.status, totaltmo = _a.totaltmo, totaltmomin = _a.totaltmomin, totaltmopercentmax = _a.totaltmopercentmax, usertmo = _a.usertmo, usertmomin = _a.usertmomin, usertmopercentmax = _a.usertmopercentmax, usertme = _a.usertme, usertmepercentmax = _a.usertmepercentmax, productivitybyhour = _a.productivitybyhour, operation = _a.operation, criticality = _a.criticality, service_times = _a.service_times;
    return ({
        method: "UFN_SLA_INS",
        parameters: {
            id: id,
            description: description,
            type: type,
            company: company,
            communicationchannelid: communicationchannelid,
            usergroup: usergroup,
            status: status,
            totaltmo: totaltmo,
            totaltmomin: totaltmomin,
            totaltmopercentmax: parseFloat(totaltmopercentmax),
            totaltmopercentmin: 0.01,
            usertmo: usertmo,
            usertmomin: usertmomin,
            usertmopercentmax: parseFloat(usertmopercentmax),
            usertmopercentmin: 0.01,
            tme: "00:00:00",
            tmemin: "00:00:00",
            tmepercentmax: 0,
            tmepercentmin: 0.01,
            usertme: usertme,
            usertmemin: "00:00:00",
            usertmepercentmax: parseFloat(usertmepercentmax),
            usertmepercentmin: 0.01,
            productivitybyhour: parseFloat(productivitybyhour),
            operation: operation,
            criticality: JSON.stringify(criticality),
            service_times: JSON.stringify(service_times)
        }
    });
};
exports.getReportSel = function (reportname) { return ({
    method: "UFN_REPORT_SEL",
    key: "UFN_REPORT_SEL",
    parameters: {
        reportname: reportname,
        all: true
    }
}); };
exports.getReportColumnSel = function (functionname) { return ({
    method: "UFN_REPORT_COLUMN_SEL",
    key: "UFN_REPORT_COLUMN_SEL",
    parameters: {
        "function": functionname,
        all: false
    }
}); };
exports.getReportFilterSel = function (filter, key, domainname) { return ({
    method: filter,
    key: key,
    parameters: {
        domainname: domainname,
        all: false
    }
}); };
exports.getPaginatedForReports = function (methodCollection, methodCount, origin, _a) {
    var skip = _a.skip, take = _a.take, filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate, allParameters = __rest(_a, ["skip", "take", "filters", "sorts", "startdate", "enddate"]);
    return ({
        methodCollection: methodCollection,
        methodCount: methodCount,
        parameters: __assign(__assign({ startdate: startdate,
            enddate: enddate,
            skip: skip,
            take: take,
            filters: filters,
            sorts: sorts, origin: origin }, allParameters), { channel: allParameters['channel'] ? allParameters['channel'] : "", hours: allParameters['hours'] ? allParameters['hours'] : "", asesorid: allParameters['asesorid'] ? allParameters['asesorid'] : 0, offset: (new Date().getTimezoneOffset() / 60) * -1 })
    });
};
exports.getReportExport = function (methodExport, origin, _a) {
    var filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate, allParameters = __rest(_a, ["filters", "sorts", "startdate", "enddate"]);
    return ({
        method: methodExport,
        key: methodExport,
        parameters: __assign(__assign({ origin: origin, filters: filters,
            startdate: startdate,
            enddate: enddate,
            sorts: sorts }, allParameters), { channel: allParameters['channel'] ? allParameters['channel'] : "", hours: allParameters['hours'] ? allParameters['hours'] : "", asesorid: allParameters['asesorid'] ? allParameters['asesorid'] : 0, offset: (new Date().getTimezoneOffset() / 60) * -1 })
    });
};
exports.getReportGraphic = function (method, origin, _a) {
    var filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate, allParameters = __rest(_a, ["filters", "sorts", "startdate", "enddate"]);
    return ({
        method: method,
        key: method,
        parameters: __assign(__assign({ startdate: startdate,
            enddate: enddate,
            filters: filters,
            sorts: sorts, origin: origin }, allParameters), { channel: allParameters['channel'] ? allParameters['channel'] : "", hours: allParameters['hours'] ? allParameters['hours'] : "", asesorid: allParameters['asesorid'] ? allParameters['asesorid'] : 0, offset: (new Date().getTimezoneOffset() / 60) * -1 })
    });
};
exports.getUserProductivitySel = function (_a) {
    var allParameters = __rest(_a, []);
    return ({
        method: "UFN_REPORT_USERPRODUCTIVITY_SEL",
        key: "UFN_REPORT_USERPRODUCTIVITY_SEL",
        parameters: __assign(__assign({}, allParameters), { channel: allParameters['channel'] ? allParameters['channel'] : "", userstatus: allParameters['userstatus'] ? allParameters['userstatus'] : "", usergroup: allParameters['usergroup'] ? allParameters['usergroup'] : "", bot: allParameters['bot'] ? allParameters['bot'] : false, offset: (new Date().getTimezoneOffset() / 60) * -1 })
    });
};
exports.getUserProductivityGraphic = function (_a) {
    var allParameters = __rest(_a, []);
    return ({
        method: "UFN_REPORT_USERPRODUCTIVITY_GRAPHIC",
        key: "UFN_REPORT_USERPRODUCTIVITY_GRAPHIC",
        parameters: __assign(__assign({ filters: {}, sorts: {} }, allParameters), { channel: allParameters['channel'] ? allParameters['channel'] : "", userstatus: allParameters['userstatus'] ? allParameters['userstatus'] : "", usergroup: allParameters['usergroup'] ? allParameters['usergroup'] : "", bot: allParameters['bot'] ? allParameters['bot'] : false, offset: (new Date().getTimezoneOffset() / 60) * -1 })
    });
};
exports.getEmojiAllSel = function () { return ({
    method: "UFN_EMOJI_ALL_SEL",
    key: "UFN_EMOJI_ALL_SEL",
    parameters: {
        all: true
    }
}); };
exports.getEmojiSel = function (emojidec) { return ({
    method: "UFN_EMOJI_SEL",
    key: "UFN_EMOJI_SEL",
    parameters: {
        emojidec: emojidec
    }
}); };
exports.insEmoji = function (_a) {
    var favorite = _a.favorite, restricted = _a.restricted, allParameters = __rest(_a, ["favorite", "restricted"]);
    return ({
        method: "UFN_EMOJI_INS",
        key: "UFN_EMOJI_INS",
        parameters: __assign(__assign({}, allParameters), { favoritechannels: "", restrictedchannels: "", favorite: favorite,
            restricted: restricted })
    });
};
exports.getPaginatedTicket = function (_a) {
    var skip = _a.skip, take = _a.take, filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate, allParameters = __rest(_a, ["skip", "take", "filters", "sorts", "startdate", "enddate"]);
    return ({
        methodCollection: "UFN_CONVERSATIONGRID_SEL",
        methodCount: "UFN_CONVERSATIONGRID_TOTALRECORDS",
        parameters: {
            startdate: startdate,
            enddate: enddate,
            skip: skip,
            take: take,
            filters: filters,
            sorts: sorts,
            origin: "ticket",
            channel: allParameters['channel'] ? allParameters['channel'] : "",
            campaignid: allParameters['campaignid'] ? allParameters['campaignid'] : "",
            usergroup: allParameters['usergroup'] ? allParameters['usergroup'] : "",
            lastuserid: allParameters['lastuserid'] ? allParameters['lastuserid'] : "",
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.selUniqueContactsPcc = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, year = _a.year, month = _a.month, channeltype = _a.channeltype, skip = _a.skip, take = _a.take, filters = _a.filters, sorts = _a.sorts;
    return ({
        methodCollection: "UFN_REPORT_UNIQUECONTACTS_PCC_SEL",
        methodCount: "UFN_REPORT_UNIQUECONTACTS_PCC_TOTALRECORDS",
        parameters: {
            skip: skip,
            take: take,
            filters: filters,
            sorts: sorts,
            year: year,
            month: month,
            channeltype: channeltype || '',
            corpid: corpid,
            orgid: orgid,
            origin: "uniquecontacts",
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.selUniqueContactsConversation = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, year = _a.year, month = _a.month, channeltype = _a.channeltype, skip = _a.skip, take = _a.take, filters = _a.filters, sorts = _a.sorts;
    return ({
        methodCollection: "UFN_REPORT_UNIQUECONTACTS_CONVERSATION_SEL",
        methodCount: "UFN_REPORT_UNIQUECONTACTS_CONVERSATION_TOTALRECORDS",
        parameters: {
            skip: skip,
            take: take,
            filters: filters,
            sorts: sorts,
            corpid: corpid,
            orgid: orgid,
            year: parseInt(year),
            month: parseInt(month),
            channeltype: channeltype || '',
            origin: "uniquecontactsconversation",
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getTicketExport = function (_a) {
    var filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate, allParameters = __rest(_a, ["filters", "sorts", "startdate", "enddate"]);
    return ({
        method: "UFN_CONVERSATIONGRID_EXPORT",
        key: "UFN_CONVERSATIONGRID_EXPORT",
        parameters: {
            origin: "ticket",
            filters: filters,
            startdate: startdate,
            enddate: enddate,
            sorts: sorts,
            lastuserid: allParameters['lastuserid'] ? allParameters['lastuserid'] : "",
            usergroup: allParameters['usergroup'] ? allParameters['usergroup'] : "",
            campaignid: allParameters['campaignid'] ? allParameters['campaignid'] : "",
            channel: allParameters['channel'] ? allParameters['channel'] : "",
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getUniqueContactsExport = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, filters = _a.filters, sorts = _a.sorts, year = _a.year, month = _a.month, channeltype = _a.channeltype;
    return ({
        method: "UFN_REPORT_UNIQUECONTACTS_PCC_EXPORT",
        key: "UFN_REPORT_UNIQUECONTACTS_PCC_EXPORT",
        parameters: {
            origin: "uniquecontacts",
            filters: filters,
            sorts: sorts,
            year: year,
            month: month,
            corpid: corpid,
            orgid: orgid,
            channeltype: channeltype,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getUniqueContactsConversationExport = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, filters = _a.filters, sorts = _a.sorts, year = _a.year, month = _a.month, channeltype = _a.channeltype;
    return ({
        method: "UFN_REPORT_UNIQUECONTACTS_CONVERSATION_EXPORT",
        key: "UFN_REPORT_UNIQUECONTACTS_CONVERSATION_EXPORT",
        parameters: {
            origin: "uniquecontactsconversation",
            filters: filters,
            sorts: sorts,
            year: year,
            month: month,
            corpid: corpid,
            orgid: orgid,
            channeltype: channeltype,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getComunicationChannelDelegate = function (communicationchannelid) { return ({
    method: "UFN_COMMUNICATIONCHANNELID_LST_USRDELEGATE",
    key: "UFN_COMMUNICATIONCHANNELID_LST_USRDELEGATE",
    parameters: {
        communicationchannelid: communicationchannelid
    }
}); };
exports.insConversationClassificationMassive = function (conversationid, classificationid) { return ({
    method: "UFN_CONVERSATIONCLASSIFICATION_INS_MASSIVE",
    key: "UFN_CONVERSATIONCLASSIFICATION_INS_MASSIVE",
    parameters: {
        conversationid: conversationid,
        classificationid: classificationid
    }
}); };
exports.getDomainSel = function (domainname) { return ({
    method: "UFN_DOMAIN_SEL",
    key: "UFN_DOMAIN_SEL",
    parameters: {
        domainname: domainname,
        all: true
    }
}); };
exports.getDocumentLibrary = function () { return ({
    method: "UFN_DOCUMENTLIBRARY_SEL",
    key: "UFN_DOCUMENTLIBRARY_SEL",
    parameters: {
        id: 0,
        all: true
    }
}); };
exports.getDocumentLibraryByUser = function () { return ({
    method: "QUERY_DOCUMENTLIBRARY_BY_USER",
    key: "QUERY_DOCUMENTLIBRARY_BY_USER",
    parameters: {}
}); };
exports.getReportSchedulerSel = function (id) { return ({
    method: "UFN_REPORTSCHEDULER_SEL",
    key: "UFN_REPORTSCHEDULER_SEL",
    parameters: {
        id: id,
        all: true
    }
}); };
exports.reportSchedulerIns = function (_a) {
    var id = _a.id, title = _a.title, status = _a.status, origin = _a.origin, origintype = _a.origintype, reportid = _a.reportid, reportname = _a.reportname, filterjson = _a.filterjson, frecuency = _a.frecuency, schedule = _a.schedule, datarange = _a.datarange, mailto = _a.mailto, mailcc = _a.mailcc, mailsubject = _a.mailsubject, mailbody = _a.mailbody, mailbodyobject = _a.mailbodyobject, operation = _a.operation;
    return ({
        method: "UFN_REPORTSCHEDULER_INS",
        key: "UFN_REPORTSCHEDULER_INS",
        parameters: {
            id: id, title: title, status: status, origin: origin, origintype: origintype, reportid: reportid, reportname: reportname, filterjson: filterjson, frecuency: frecuency, schedule: schedule, datarange: datarange, mailto: mailto, mailcc: mailcc, mailsubject: mailsubject, mailbody: mailbody, operation: operation,
            mailbodyobject: JSON.stringify(mailbodyobject),
            description: "",
            type: ""
        }
    });
};
exports.documentLibraryIns = function (_a) {
    var id = _a.id, title = _a.title, description = _a.description, category = _a.category, groups = _a.groups, link = _a.link, favorite = _a.favorite, status = _a.status, operation = _a.operation;
    return ({
        method: "UFN_DOCUMENTLIBRARY_INS",
        key: "UFN_DOCUMENTLIBRARY_INS",
        parameters: {
            id: id, title: title, description: description, category: category, groups: groups, link: link, favorite: favorite, status: status, operation: operation,
            type: ""
        }
    });
};
exports.documentLibraryInsArray = function (table) { return ({
    method: "UFN_DOCUMENTLIBRARY_INS_ARRAY",
    key: "UFN_DOCUMENTLIBRARY_INS_ARRAY",
    parameters: {
        table: table
    }
}); };
exports.getDomainValueSel = function (domainname) { return ({
    method: "UFN_DOMAIN_VALUES_SEL",
    key: "UFN_DOMAIN_VALUES_SEL",
    parameters: {
        domainname: domainname,
        all: true
    }
}); };
exports.insDomain = function (_a) {
    var domainname = _a.domainname, description = _a.description, type = _a.type, status = _a.status, operation = _a.operation;
    return ({
        method: "UFN_DOMAIN_INS",
        key: "UFN_DOMAIN_INS",
        parameters: { id: 0, domainname: domainname, description: description, type: type, status: status, operation: operation }
    });
};
exports.insDomainvalue = function (_a) {
    var id = _a.id, domainname = _a.domainname, description = _a.description, domainvalue = _a.domainvalue, domaindesc = _a.domaindesc, status = _a.status, type = _a.type, bydefault = _a.bydefault, operation = _a.operation;
    return ({
        method: "UFN_DOMAIN_VALUES_INS",
        key: "UFN_DOMAIN_VALUES_INS",
        parameters: { id: id, domainname: domainname, description: description, domainvalue: domainvalue, domaindesc: domaindesc, system: false, status: status, type: type, bydefault: bydefault, operation: operation }
    });
};
exports.getQuickrepliesSel = function (id) { return ({
    method: "UFN_QUICKREPLY_SEL",
    parameters: {
        id: id,
        all: true
    }
}); };
exports.insCorp = function (_a) {
    var id = _a.id, description = _a.description, type = _a.type, status = _a.status, logo = _a.logo, logotype = _a.logotype, operation = _a.operation, _b = _a.paymentplanid, paymentplanid = _b === void 0 ? 0 : _b, _c = _a.doctype, doctype = _c === void 0 ? "" : _c, _d = _a.docnum, docnum = _d === void 0 ? "" : _d, _e = _a.businessname, businessname = _e === void 0 ? "" : _e, _f = _a.fiscaladdress, fiscaladdress = _f === void 0 ? "" : _f, _g = _a.sunatcountry, sunatcountry = _g === void 0 ? "" : _g, _h = _a.contactemail, contactemail = _h === void 0 ? "" : _h, _j = _a.contact, contact = _j === void 0 ? "" : _j, _k = _a.autosendinvoice, autosendinvoice = _k === void 0 ? false : _k, _l = _a.billbyorg, billbyorg = _l === void 0 ? false : _l, _m = _a.credittype, credittype = _m === void 0 ? "" : _m, _o = _a.paymentmethod, paymentmethod = _o === void 0 ? "" : _o, automaticpayment = _a.automaticpayment, automaticperiod = _a.automaticperiod, automaticinvoice = _a.automaticinvoice, partner = _a.partner, appsettingid = _a.appsettingid, citybillingid = _a.citybillingid;
    return ({
        method: "UFN_CORP_INS",
        key: "UFN_CORP_INS",
        parameters: { companysize: null, id: id, description: description, type: type, status: status, logo: logo, logotype: logotype, operation: operation, paymentplanid: paymentplanid, doctype: doctype, docnum: docnum, businessname: businessname, fiscaladdress: fiscaladdress, sunatcountry: sunatcountry, contactemail: contactemail, contact: contact, autosendinvoice: autosendinvoice, billbyorg: billbyorg, credittype: credittype, paymentmethod: paymentmethod, automaticpayment: automaticpayment, automaticperiod: automaticperiod, automaticinvoice: automaticinvoice, partner: partner, appsettingid: appsettingid, citybillingid: citybillingid }
    });
};
exports.insOrg = function (_a) {
    var corpid = _a.corpid, description = _a.description, status = _a.status, type = _a.type, id = _a.id, operation = _a.operation, currency = _a.currency, _b = _a.email, email = _b === void 0 ? "" : _b, _c = _a.password, password = _c === void 0 ? "" : _c, _d = _a.port, port = _d === void 0 ? 0 : _d, host = _a.host, ssl = _a.ssl, default_credentials = _a.default_credentials, private_mail = _a.private_mail, _e = _a.doctype, doctype = _e === void 0 ? "" : _e, _f = _a.docnum, docnum = _f === void 0 ? "" : _f, _g = _a.businessname, businessname = _g === void 0 ? "" : _g, _h = _a.fiscaladdress, fiscaladdress = _h === void 0 ? "" : _h, _j = _a.sunatcountry, sunatcountry = _j === void 0 ? "" : _j, _k = _a.contactemail, contactemail = _k === void 0 ? "" : _k, _l = _a.contact, contact = _l === void 0 ? "" : _l, _m = _a.autosendinvoice, autosendinvoice = _m === void 0 ? false : _m, _o = _a.iconbot, iconbot = _o === void 0 ? "" : _o, _p = _a.iconadvisor, iconadvisor = _p === void 0 ? "" : _p, _q = _a.iconclient, iconclient = _q === void 0 ? "" : _q, _r = _a.credittype, credittype = _r === void 0 ? "" : _r, timezone = _a.timezone, timezoneoffset = _a.timezoneoffset, automaticpayment = _a.automaticpayment, automaticperiod = _a.automaticperiod, automaticinvoice = _a.automaticinvoice, voximplantautomaticrecharge = _a.voximplantautomaticrecharge, voximplantrechargerange = _a.voximplantrechargerange, voximplantrechargepercentage = _a.voximplantrechargepercentage, voximplantrechargefixed = _a.voximplantrechargefixed, voximplantadditionalperchannel = _a.voximplantadditionalperchannel, appsettingid = _a.appsettingid, citybillingid = _a.citybillingid;
    return ({
        method: "UFN_ORG_INS",
        key: "UFN_ORG_INS",
        parameters: { corpid: corpid, id: id, description: description, status: status, type: type, operation: operation, currency: currency, email: email, password: password, port: parseInt(port), host: host, ssl: ssl, default_credentials: default_credentials, private_mail: private_mail, country: null, doctype: doctype, docnum: docnum, businessname: businessname, fiscaladdress: fiscaladdress, sunatcountry: sunatcountry, contactemail: contactemail, contact: contact, autosendinvoice: autosendinvoice, iconbot: iconbot, iconadvisor: iconadvisor, iconclient: iconclient, credittype: credittype, timezone: timezone, timezoneoffset: timezoneoffset, automaticpayment: automaticpayment, automaticperiod: automaticperiod, automaticinvoice: automaticinvoice, voximplantautomaticrecharge: voximplantautomaticrecharge, voximplantrechargerange: voximplantrechargerange, voximplantrechargepercentage: voximplantrechargepercentage, voximplantrechargefixed: voximplantrechargefixed, voximplantadditionalperchannel: voximplantadditionalperchannel, appsettingid: appsettingid, citybillingid: citybillingid }
    });
};
exports.insQuickreplies = function (_a) {
    var id = _a.id, classificationid = _a.classificationid, description = _a.description, quickreply = _a.quickreply, status = _a.status, type = _a.type, operation = _a.operation, favorite = _a.favorite, body = _a.body, bodyobject = _a.bodyobject, quickreply_type = _a.quickreply_type, quickreply_priority = _a.quickreply_priority, attachment = _a.attachment;
    return ({
        method: "UFN_QUICKREPLY_INS",
        key: "UFN_QUICKREPLY_INS",
        parameters: { id: id, classificationid: classificationid, description: description, quickreply: quickreply, status: status, type: type, operation: operation, favorite: favorite, body: body, bodyobject: JSON.stringify(bodyobject), quickreply_type: quickreply_type, quickreply_priority: quickreply_priority, attachment: attachment }
    });
};
exports.getTimeZoneSel = function () { return ({
    method: "UFN_TIMEZONE_SEL",
    key: "UFN_TIMEZONE_SEL",
    parameters: {}
}); };
exports.getClassificationSel = function (id) { return ({
    method: "UFN_CLASSIFICATION_SEL",
    key: "UFN_CLASSIFICATION_SEL",
    parameters: {
        id: id,
        all: true
    }
}); };
exports.insInvoice = function (_a) {
    var _b = _a.corpid, corpid = _b === void 0 ? 0 : _b, _c = _a.orgid, orgid = _c === void 0 ? 0 : _c, year = _a.year, month = _a.month, description = _a.description, status = _a.status, receiverdoctype = _a.receiverdoctype, receiverdocnum = _a.receiverdocnum, receiverbusinessname = _a.receiverbusinessname, receiverfiscaladdress = _a.receiverfiscaladdress, receivercountry = _a.receivercountry, receivermail = _a.receivermail, invoicetype = _a.invoicetype, serie = _a.serie, correlative = _a.correlative, invoicedate = _a.invoicedate, expirationdate = _a.expirationdate, invoicestatus = _a.invoicestatus, paymentstatus = _a.paymentstatus, paymentdate = _a.paymentdate, paidby = _a.paidby, paymenttype = _a.paymenttype, totalamount = _a.totalamount, exchangerate = _a.exchangerate, currency = _a.currency, urlcdr = _a.urlcdr, urlpdf = _a.urlpdf, urlxml = _a.urlxml, purchaseorder = _a.purchaseorder, comments = _a.comments, credittype = _a.credittype;
    return ({
        method: "UFN_INVOICE_IMPORT",
        key: "UFN_INVOICE_IMPORT",
        parameters: {
            corpid: corpid,
            orgid: orgid,
            year: year,
            month: month,
            description: description,
            status: status,
            receiverdoctype: receiverdoctype,
            receiverdocnum: receiverdocnum,
            receiverbusinessname: receiverbusinessname,
            receiverfiscaladdress: receiverfiscaladdress,
            receivercountry: receivercountry,
            receivermail: receivermail,
            invoicetype: invoicetype,
            serie: serie,
            correlative: correlative,
            invoicedate: invoicedate,
            expirationdate: expirationdate,
            invoicestatus: invoicestatus,
            paymentstatus: paymentstatus,
            paymentdate: paymentdate,
            paidby: paidby,
            paymenttype: paymenttype,
            totalamount: totalamount,
            exchangerate: exchangerate,
            currency: currency,
            urlcdr: urlcdr,
            urlpdf: urlpdf,
            urlxml: urlxml,
            purchaseorder: purchaseorder,
            comments: comments,
            credittype: credittype
        }
    });
};
exports.insClassification = function (_a) {
    var id = _a.id, title = _a.title, description = _a.description, parent = _a.parent, communicationchannel = _a.communicationchannel, status = _a.status, type = _a.type, operation = _a.operation, tags = _a.tags, _b = _a.jobplan, jobplan = _b === void 0 ? null : _b, _c = _a.order, order = _c === void 0 ? "1" : _c, _d = _a.metacatalogid, metacatalogid = _d === void 0 ? 0 : _d;
    return ({
        method: "UFN_CLASSIFICATION_INS",
        key: "UFN_CLASSIFICATION_INS",
        parameters: {
            id: id, title: title, description: description, parent: parent, communicationchannel: communicationchannel, status: status, type: type, operation: operation, tags: tags, jobplan: jobplan,
            usergroup: 0, schedule: "",
            order: order, metacatalogid: metacatalogid
        }
    });
};
//tabla paginada
exports.getPaginatedPerson = function (_a) {
    var skip = _a.skip, take = _a.take, filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate, _b = _a.userids, userids = _b === void 0 ? "" : _b, _c = _a.channeltypes, channeltypes = _c === void 0 ? "" : _c;
    return ({
        methodCollection: "UFN_PERSON_SEL",
        methodCount: "UFN_PERSON_TOTALRECORDS",
        parameters: {
            startdate: startdate,
            enddate: enddate,
            skip: skip,
            take: take,
            filters: filters,
            sorts: sorts,
            origin: "person",
            userids: userids,
            channeltypes: channeltypes,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getPersonOne = function (_a) {
    var personid = _a.personid;
    return ({
        method: "UFN_PERSON_SEL_ONE",
        key: "UFN_PERSON_SEL_ONE",
        parameters: {
            personid: personid
        }
    });
};
exports.getPaginatedPersonLead = function (_a) {
    var skip = _a.skip, take = _a.take, filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate, _b = _a.userids, userids = _b === void 0 ? "" : _b, _c = _a.channeltypes, channeltypes = _c === void 0 ? "" : _c;
    return ({
        methodCollection: "UFN_LEAD_PERSON_SEL",
        methodCount: "UFN_LEAD_PERSON_TOTALRECORDS",
        parameters: {
            startdate: startdate,
            enddate: enddate,
            skip: skip,
            take: take,
            filters: filters,
            sorts: sorts,
            origin: "person",
            userids: userids,
            channeltypes: channeltypes,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
//tabla paginada
exports.getPaginatedPersonLink = function (_a) {
    var skip = _a.skip, take = _a.take, filters = _a.filters, sorts = _a.sorts, originpersonid = _a.originpersonid;
    return ({
        methodCollection: "UFN_PERSON_LINK_SEL",
        methodCount: "UFN_PERSON_LINK_TOTALRECORDS",
        parameters: {
            originpersonid: originpersonid,
            skip: skip,
            take: take,
            filters: filters,
            sorts: sorts,
            origin: "person",
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
//tabla paginada
exports.getPersonExport = function (_a) {
    var filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate, userids = _a.userids, personcommunicationchannels = _a.personcommunicationchannels;
    return ({
        method: "UFN_PERSON_EXPORT",
        key: "UFN_PERSON_EXPORT",
        parameters: {
            origin: "person",
            filters: filters,
            startdate: startdate,
            enddate: enddate,
            sorts: sorts,
            offset: (new Date().getTimezoneOffset() / 60) * -1,
            userids: userids,
            personcommunicationchannels: personcommunicationchannels
        }
    });
};
exports.getConfigurationVariables = function (communicationchannelid) { return ({
    method: "UFN_TABLEVARIABLECONFIGURATIONBYCHANNEL_SEL",
    key: "UFN_TABLEVARIABLECONFIGURATIONBYCHANNEL_SEL",
    parameters: { communicationchannelid: communicationchannelid }
}); };
exports.getCommChannelLst = function () { return ({
    method: "UFN_COMMUNICATIONCHANNEL_LST",
    key: "UFN_COMMUNICATIONCHANNEL_LST",
    parameters: {}
}); };
exports.getCommChannelLstTypeDesc = function () { return ({
    method: "UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC",
    key: "UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC",
    parameters: {}
}); };
exports.getValuesForTree = function (type) {
    if (type === void 0) { type = "QUICKREPLY"; }
    return ({
        method: "UFN_CLASSIFICATION_QUICKREPLYTREE_SEL",
        key: "UFN_CLASSIFICATION_QUICKREPLYTREE_SEL",
        parameters: {
            type: type
        }
    });
};
exports.getParentSel = function () { return ({
    method: "UFN_CLASSIFICATION_LST_PARENT",
    parameters: {
        classificationid: 0
    }
}); };
exports.getPaginatedMessageTemplate = function (_a) {
    var communicationchannelid = _a.communicationchannelid, enddate = _a.enddate, filters = _a.filters, skip = _a.skip, sorts = _a.sorts, startdate = _a.startdate, take = _a.take;
    return ({
        methodCollection: "UFN_MESSAGETEMPLATE_SEL",
        methodCount: "UFN_MESSAGETEMPLATE_TOTALRECORDS",
        parameters: {
            communicationchannelid: communicationchannelid, enddate: enddate, filters: filters,
            offset: (new Date().getTimezoneOffset() / 60) * -1, origin: "messagetemplate",
            skip: skip, sorts: sorts, startdate: startdate, take: take
        }
    });
};
exports.getMessageTemplateLst = function (type) { return ({
    method: "UFN_MESSAGETEMPLATE_LST",
    parameters: {
        type: type
    }
}); };
exports.insMessageTemplate = function (_a) {
    var id = _a.id, description = _a.description, type = _a.type, status = _a.status, name = _a.name, namespace = _a.namespace, category = _a.category, language = _a.language, templatetype = _a.templatetype, headerenabled = _a.headerenabled, headertype = _a.headertype, header = _a.header, body = _a.body, bodyobject = _a.bodyobject, footerenabled = _a.footerenabled, footer = _a.footer, buttonsenabled = _a.buttonsenabled, buttons = _a.buttons, priority = _a.priority, attachment = _a.attachment, fromprovider = _a.fromprovider, externalid = _a.externalid, externalstatus = _a.externalstatus, communicationchannelid = _a.communicationchannelid, communicationchanneltype = _a.communicationchanneltype, exampleparameters = _a.exampleparameters, operation = _a.operation;
    return ({
        method: "UFN_MESSAGETEMPLATE_INS",
        parameters: {
            id: id,
            description: description,
            type: type,
            status: status,
            name: name,
            namespace: namespace,
            category: category,
            language: language,
            templatetype: templatetype,
            headerenabled: headerenabled,
            headertype: headertype,
            header: header,
            body: body,
            bodyobject: JSON.stringify(bodyobject),
            footerenabled: footerenabled,
            footer: footer || "",
            buttonsenabled: buttonsenabled,
            buttons: JSON.stringify(buttons),
            priority: priority,
            attachment: attachment,
            fromprovider: fromprovider,
            externalid: externalid,
            externalstatus: externalstatus,
            communicationchannelid: communicationchannelid,
            communicationchanneltype: communicationchanneltype,
            exampleparameters: exampleparameters,
            operation: operation
        }
    });
};
exports.getIntegrationManagerSel = function (id) { return ({
    method: "UFN_INTEGRATIONMANAGER_SEL",
    parameters: {
        id: id,
        all: id === 0
    }
}); };
exports.insIntegrationManager = function (_a) {
    var id = _a.id, description = _a.description, type = _a.type, status = _a.status, name = _a.name, method = _a.method, url = _a.url, authorization = _a.authorization, headers = _a.headers, bodytype = _a.bodytype, body = _a.body, url_params = _a.url_params, parameters = _a.parameters, variables = _a.variables, level = _a.level, fields = _a.fields, apikey = _a.apikey, operation = _a.operation, results = _a.results, orgid = _a.orgid;
    return ({
        method: "UFN_INTEGRATIONMANAGER_INS",
        parameters: {
            id: id,
            description: description,
            type: type,
            status: status,
            name: name,
            method: method,
            url: url,
            url_params: JSON.stringify(url_params),
            authorization: JSON.stringify(authorization),
            headers: JSON.stringify(headers),
            bodytype: bodytype,
            body: body,
            parameters: JSON.stringify(parameters),
            variables: JSON.stringify(variables),
            level: level,
            fields: JSON.stringify(fields),
            apikey: apikey,
            operation: operation,
            orgid: orgid,
            results: JSON.stringify(results)
        }
    });
};
exports.insarrayIntegrationManager = function (id, table) { return ({
    method: "UFN_INTEGRATIONMANAGER_IMPORT",
    parameters: {
        id: id,
        table: JSON.stringify(table)
    }
}); };
exports.importPerson = function (table) { return ({
    method: "UDTT_PERSON_PCC_IMPORT",
    parameters: {
        table: JSON.stringify(table)
    }
}); };
exports.deldataIntegrationManager = function (id) { return ({
    method: "UFN_INTEGRATIONMANAGER_DELETEDATA",
    parameters: {
        id: id
    }
}); };
exports.getdataIntegrationManager = function (id) { return ({
    method: "UFN_INTEGRATIONMANAGER_EXPORT",
    parameters: {
        id: id
    }
}); };
exports.getChannelSel = function (id, orgid, corpid) { return ({
    method: "UFN_COMMUNICATIONCHANNEL_SEL",
    parameters: {
        communicationchannelid: id,
        personcommunicationchannel: "",
        all: id === 0,
        orgid: orgid,
        corpid: corpid
    }
}); };
exports.getasesoresbyorgid = function (closedby, communicationchannel) { return ({
    method: "UFN_USER_REPORT_HEATMAP_ASESOR_LST",
    parameters: {
        bot: closedby.includes("BOT"),
        communicationchannel: communicationchannel
    }
}); };
exports.getChatflowBlockLst = function () { return ({
    method: "UFN_CHATFLOW_BLOCK_LST",
    parameters: {}
}); };
exports.getChatflowBlockSel = function (id) { return ({
    method: "UFN_CHATFLOW_BLOCK_SEL",
    parameters: {
        chatblockid: id
    }
}); };
exports.insChatflowBlock = function (_a) {
    var communicationchannelid = _a.communicationchannelid, chatblockid = _a.chatblockid, title = _a.title, description = _a.description, defaultgroupid = _a.defaultgroupid, defaultblockid = _a.defaultblockid, firstblockid = _a.firstblockid, aiblockid = _a.aiblockid, blockgroup = _a.blockgroup, variablecustom = _a.variablecustom, color = _a.color, icontype = _a.icontype, tag = _a.tag, status = _a.status, chatblockversionid = _a.chatblockversionid, surveyid = _a.surveyid, queryprocess = _a.queryprocess;
    return ({
        method: "UFN_CHATFLOW_BLOCK_INS",
        parameters: {
            communicationchannelid: communicationchannelid,
            chatblockid: chatblockid,
            title: title,
            description: description,
            defaultgroupid: defaultgroupid,
            defaultblockid: defaultblockid,
            firstblockid: firstblockid,
            aiblockid: aiblockid,
            blockgroup: JSON.stringify(blockgroup),
            variablecustom: JSON.stringify(variablecustom),
            color: color,
            icontype: icontype,
            tag: tag,
            status: status,
            chatblockversionid: chatblockversionid,
            surveyid: surveyid,
            queryprocess: queryprocess
        }
    });
};
exports.dupChatflowBlock = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, chatblockid = _a.chatblockid, defaultgroupid = _a.defaultgroupid, defaultblockid = _a.defaultblockid, firstblockid = _a.firstblockid, blockgroup = _a.blockgroup;
    return ({
        method: "UFN_CHATFLOW_BLOCK_DUP",
        parameters: {
            corpid: corpid,
            orgid: orgid,
            chatblockidold: chatblockid,
            chatblockidnew: _1.uuidv4(),
            defaultgroupid: defaultgroupid,
            defaultblockid: defaultblockid,
            firstblockid: firstblockid,
            blockgroup: JSON.stringify(blockgroup)
        }
    });
};
exports.getVariableConfigurationLst = function () { return ({
    method: "UFN_VARIABLECONFIGURATION_LST",
    parameters: {}
}); };
exports.updateGroupOnHSM = function (conversationid) { return ({
    method: "UFN_CONVERSATION_REASSIGNTICKET_HSM",
    parameters: { conversationid: conversationid }
}); };
exports.getTicketsByFilter = function (lastmessage, start_createticket, end_createticket, channels, conversationstatus, displayname, phone) { return ({
    method: "UFN_CONVERSATION_SEL_TICKETSBYUSER_FILTER",
    parameters: {
        lastmessage: lastmessage,
        start_createticket: start_createticket,
        end_createticket: end_createticket,
        channels: channels,
        conversationstatus: conversationstatus,
        displayname: displayname,
        phone: phone,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
}); };
exports.getVariableConfigurationSel = function (id) { return ({
    method: "UFN_VARIABLECONFIGURATION_SEL",
    parameters: {
        chatblockid: id
    }
}); };
exports.insVariableConfiguration = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, chatblockid = _a.chatblockid, variable = _a.variable, description = _a.description, fontcolor = _a.fontcolor, fontbold = _a.fontbold, priority = _a.priority, visible = _a.visible;
    return ({
        method: "UFN_VARIABLECONFIGURATION_INS",
        parameters: {
            corpid: corpid,
            orgid: orgid,
            chatblockid: chatblockid,
            variable: variable,
            description: description,
            fontcolor: fontcolor,
            fontbold: fontbold,
            priority: priority,
            visible: visible
        }
    });
};
exports.insarrayVariableConfiguration = function (table) { return ({
    method: "UFN_VARIABLECONFIGURATION_INS_ARRAY",
    parameters: {
        table: JSON.stringify(table)
    }
}); };
exports.insarrayInventoryBalance = function (table) { return ({
    method: "UFN_INVENTORYBALANCE_UPD",
    parameters: {
        json: JSON.stringify(table)
    }
}); };
exports.insarrayInventoryRecount = function (table) { return ({
    method: "UFN_INVENTORYRECOUNT_UPD",
    parameters: {
        json: JSON.stringify(table)
    }
}); };
exports.insarrayInventoryStandarCost = function (table) { return ({
    method: "UFN_INVENTORYRECOUNT_UPD",
    parameters: {
        json: JSON.stringify(table)
    }
}); };
exports.insarrayInventoryCost = function (table) { return ({
    method: "UFN_INVENTORYCOST_UPD",
    parameters: {
        json: JSON.stringify(table)
    }
}); };
exports.getInsertChatwebChannel = function (id, name, auto, iconColor, service, typechannel) { return ({
    method: "UFN_COMMUNICATIONCHANNEL_INS",
    parameters: {
        id: id || 0,
        description: name,
        type: "",
        communicationchannelsite: "id del canal",
        communicationchannelowner: "id del canal",
        chatflowenabled: auto,
        integrationid: "",
        color: iconColor,
        icons: "",
        other: "",
        form: "",
        apikey: "",
        coloricon: iconColor,
        voximplantrecording: '',
        voximplantholdtone: "",
        voximplantcallsupervision: false
    },
    type: typechannel || "CHATWEB",
    service: service
}); };
exports.getEditChannel = function (id, payload, name, auto, iconColor, welcometoneurl, holdingtoneurl, voximplantcallsupervision, voximplantrecording) { return ({
    method: "UFN_COMMUNICATIONCHANNEL_INS",
    parameters: __assign(__assign({}, payload), { operation: 'UPDATE', id: id, description: name, chatflowenabled: auto, color: iconColor, coloricon: iconColor, corpid: null, orgid: null, username: null, apikey: "", updintegration: null, motive: "Edited from API", voximplantwelcometone: welcometoneurl !== null && welcometoneurl !== void 0 ? welcometoneurl : "", voximplantholdtone: holdingtoneurl !== null && holdingtoneurl !== void 0 ? holdingtoneurl : "", voximplantcallsupervision: voximplantcallsupervision || false, voximplantrecording: voximplantrecording !== null && voximplantrecording !== void 0 ? voximplantrecording : '' })
}); };
exports.getEditChatWebChannel = function (id, channel, service, name, auto, iconColor, typechannel) { return ({
    method: "UFN_COMMUNICATIONCHANNEL_INS",
    parameters: __assign(__assign({}, channel), { operation: 'UPDATE', id: id, description: name, chatflowenabled: auto, color: iconColor, coloricon: iconColor, corpid: null, orgid: null, username: null, apikey: "", updintegration: null, motive: "Edited from API", voximplantcallsupervision: false, voximplantrecording: '', voximplantholdtone: "" }),
    type: typechannel !== null && typechannel !== void 0 ? typechannel : "CHATWEB",
    service: service
}); };
exports.getCampaignLst = function () { return ({
    method: "UFN_CAMPAIGN_LST",
    key: "UFN_CAMPAIGN_LST",
    parameters: {}
}); };
exports.getCampaignSel = function (id) { return ({
    method: "UFN_CAMPAIGN_SEL",
    parameters: {
        id: id
    }
}); };
exports.insCampaign = function (_a) {
    var id = _a.id, communicationchannelid = _a.communicationchannelid, usergroup = _a.usergroup, type = _a.type, status = _a.status, title = _a.title, description = _a.description, subject = _a.subject, message = _a.message, startdate = _a.startdate, enddate = _a.enddate, repeatable = _a.repeatable, frecuency = _a.frecuency, messagetemplateid = _a.messagetemplateid, messagetemplatename = _a.messagetemplatename, messagetemplatenamespace = _a.messagetemplatenamespace, messagetemplateheader = _a.messagetemplateheader, messagetemplatebuttons = _a.messagetemplatebuttons, messagetemplatefooter = _a.messagetemplatefooter, messagetemplatetype = _a.messagetemplatetype, messagetemplateattachment = _a.messagetemplateattachment, source = _a.source, messagetemplatelanguage = _a.messagetemplatelanguage, messagetemplatepriority = _a.messagetemplatepriority, executiontype = _a.executiontype, batchjson = _a.batchjson, fields = _a.fields, operation = _a.operation, selectedColumns = _a.selectedColumns;
    return ({
        method: "UFN_CAMPAIGN_INS",
        parameters: {
            id: id,
            communicationchannelid: communicationchannelid,
            usergroup: usergroup,
            type: type,
            status: status,
            title: title,
            description: description,
            subject: subject,
            message: message,
            startdate: startdate,
            enddate: enddate,
            repeatable: repeatable,
            frecuency: frecuency,
            messagetemplateid: messagetemplateid,
            messagetemplatename: messagetemplatename,
            messagetemplatenamespace: messagetemplatenamespace,
            messagetemplateheader: JSON.stringify(messagetemplateheader),
            messagetemplatebuttons: JSON.stringify(messagetemplatebuttons),
            messagetemplatefooter: messagetemplatefooter || null,
            messagetemplatetype: messagetemplatetype || null,
            messagetemplateattachment: messagetemplateattachment || null,
            source: source || null,
            messagetemplatelanguage: messagetemplatelanguage || null,
            messagetemplatepriority: messagetemplatepriority || null,
            executiontype: executiontype,
            batchjson: JSON.stringify(batchjson),
            fields: JSON.stringify(selectedColumns || fields),
            operation: operation
        }
    });
};
exports.delCampaign = function (_a) {
    var id = _a.id, status = _a.status, operation = _a.operation;
    return ({
        method: "UFN_CAMPAIGN_DEL",
        parameters: {
            id: id,
            status: status,
            operation: operation
        }
    });
};
exports.stopCampaign = function (_a) {
    var campaignid = _a.campaignid;
    return ({
        method: "UFN_CAMPAIGN_STOP",
        parameters: {
            campaignid: campaignid
        }
    });
};
exports.campaignPersonSel = function (_a) {
    var skip = _a.skip, take = _a.take, filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate;
    return ({
        methodCollection: "UFN_CAMPAIGN_PERSON_SEL",
        methodCount: "UFN_CAMPAIGN_PERSON_TOTALRECORDS",
        parameters: {
            startdate: startdate,
            enddate: enddate,
            skip: skip,
            take: take,
            filters: filters,
            sorts: sorts,
            origin: "campaignperson",
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.campaignLeadPersonSel = function (_a) {
    var skip = _a.skip, take = _a.take, filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate;
    return ({
        methodCollection: "UFN_CAMPAIGN_LEAD_PERSON_SEL",
        methodCount: "UFN_CAMPAIGN_LEAD_PERSON_TOTALRECORDS",
        parameters: {
            startdate: startdate,
            enddate: enddate,
            skip: skip,
            take: take,
            filters: filters,
            sorts: sorts,
            origin: "campaignleadperson",
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getUserGroupsSel = function () { return ({
    method: "UFN_USER_GROUPS_SEL",
    parameters: {}
}); };
exports.getCampaignMemberSel = function (campaignid) { return ({
    method: "UFN_CAMPAIGNMEMBER_SEL",
    parameters: {
        campaignid: campaignid
    }
}); };
exports.insCampaignMember = function (_a) {
    var id = _a.id, campaignid = _a.campaignid, personid = _a.personid, personcommunicationchannel = _a.personcommunicationchannel, personcommunicationchannelowner = _a.personcommunicationchannelowner, type = _a.type, displayname = _a.displayname, status = _a.status, field1 = _a.field1, field2 = _a.field2, field3 = _a.field3, field4 = _a.field4, field5 = _a.field5, field6 = _a.field6, field7 = _a.field7, field8 = _a.field8, field9 = _a.field9, field10 = _a.field10, field11 = _a.field11, field12 = _a.field12, field13 = _a.field13, field14 = _a.field14, field15 = _a.field15, batchindex = _a.batchindex, operation = _a.operation;
    return ({
        method: "UFN_CAMPAIGNMEMBER_INS",
        parameters: {
            id: id,
            campaignid: campaignid,
            personid: personid,
            personcommunicationchannel: personcommunicationchannel,
            personcommunicationchannelowner: personcommunicationchannelowner,
            type: type,
            displayname: displayname,
            status: status,
            field1: field1,
            field2: field2,
            field3: field3,
            field4: field4,
            field5: field5,
            field6: field6,
            field7: field7,
            field8: field8,
            field9: field9,
            field10: field10,
            field11: field11,
            field12: field12,
            field13: field13,
            field14: field14,
            field15: field15,
            batchindex: batchindex,
            operation: operation
        }
    });
};
exports.getTicketListByPersonBody = function (personId, _a) {
    var filters = _a.filters, sorts = _a.sorts, take = _a.take, skip = _a.skip, _b = _a.offset, offset = _b === void 0 ? 0 : _b;
    return ({
        methodCollection: "UFN_CONVERSATION_SEL_PERSON",
        methodCount: "UFN_CONVERSATION_SEL_PERSON_TOTALRECORDS",
        parameters: {
            origin: "person",
            personid: personId,
            filters: filters,
            sorts: sorts,
            take: take,
            skip: skip,
            offset: offset
        }
    });
};
exports.getReferrerByPersonBody = function (personId) { return ({
    method: "UFN_PERSONREFERRER_SEL",
    parameters: {
        personid: personId
    }
}); };
exports.insPersonUpdateLocked = function (_a) {
    var personid = _a.personid, locked = _a.locked;
    return ({
        method: "UFN_PERSONCOMMUNICATIONCHANNEL_UPDATE_LOCKED",
        parameters: {
            personid: personid,
            personcommunicationchannel: "",
            locked: locked
        }
    });
};
exports.getChannelListByPersonBody = function (personId) { return ({
    method: "UFN_PERSONCOMMUNICATIONCHANNEL_SEL",
    parameters: {
        personid: personId,
        personcommunicationchannel: "",
        all: true
    }
}); };
exports.getAdditionalInfoByPersonBody = function (personId) { return ({
    method: "UFN_PERSONADDINFO_SEL",
    parameters: {
        personid: personId
    }
}); };
/**Person Leads */
exports.getOpportunitiesByPersonBody = function (personId) { return ({
    method: "",
    parameters: {
        personid: personId
    }
}); };
exports.getTagsChatflow = function () { return ({
    method: "UFN_CHATFLOW_TAG_SEL",
    parameters: {}
}); };
exports.getReportTemplateSel = function (reporttemplateid) {
    if (reporttemplateid === void 0) { reporttemplateid = 0; }
    return ({
        method: "UFN_REPORTTEMPLATE_SEL",
        key: "UFN_REPORTTEMPLATE_SEL",
        parameters: {
            reporttemplateid: reporttemplateid,
            all: reporttemplateid === 0
        }
    });
};
exports.insertReportTemplate = function (_a) {
    var id = _a.id, description = _a.description, status = _a.status, type = _a.type, columnjson = _a.columnjson, filterjson = _a.filterjson, dataorigin = _a.dataorigin, summaryjson = _a.summaryjson, nameapi = _a.nameapi, operation = _a.operation;
    return ({
        method: "UFN_REPORTTEMPLATE_INS",
        parameters: {
            id: id,
            description: description,
            status: status,
            type: type,
            columnjson: columnjson,
            filterjson: filterjson,
            summaryjson: summaryjson,
            dataorigin: dataorigin,
            communicationchannelid: '',
            nameapi: nameapi,
            operation: operation
        }
    });
};
exports.insBlacklist = function (_a) {
    var id = _a.id, description = _a.description, type = _a.type, status = _a.status, phone = _a.phone, operation = _a.operation;
    return ({
        method: "UFN_BLACKLIST_INS",
        parameters: {
            id: id,
            description: description,
            type: type,
            status: status,
            phone: phone,
            operation: operation
        }
    });
};
exports.insarrayBlacklist = function (table) { return ({
    method: "UFN_BLACKLIST_INS_ARRAY",
    parameters: {
        table: JSON.stringify(table)
    }
}); };
exports.getBlacklistPaginated = function (_a) {
    var filters = _a.filters, sorts = _a.sorts, take = _a.take, skip = _a.skip;
    return ({
        methodCollection: "UFN_BLACKLIST_SEL",
        methodCount: "UFN_BLACKLIST_TOTALRECORDS",
        parameters: {
            origin: "blacklist",
            filters: filters,
            sorts: sorts,
            take: take,
            skip: skip,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getBlacklistExport = function (_a) {
    var filters = _a.filters, sorts = _a.sorts;
    return ({
        method: "UFN_BLACKLIST_EXPORT",
        key: "UFN_BLACKLIST_EXPORT",
        parameters: {
            origin: "blacklist",
            filters: filters,
            sorts: sorts,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getCampaignReportPaginated = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channeltype = _a.channeltype, filters = _a.filters, sorts = _a.sorts, take = _a.take, skip = _a.skip;
    return ({
        methodCollection: "UFN_CAMPAIGNREPORT_SEL",
        methodCount: "UFN_CAMPAIGNREPORT_TOTALRECORDS",
        parameters: {
            origin: "campaignreport",
            startdate: startdate,
            enddate: enddate,
            channeltype: channeltype,
            filters: filters,
            sorts: sorts,
            take: take,
            skip: skip,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getCampaignReportExport = function (table) { return ({
    method: "UFN_CAMPAIGNREPORT_EXPORT",
    key: "UFN_CAMPAIGNREPORT_EXPORT",
    parameters: {
        origin: "campaignreport",
        table: JSON.stringify(table),
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
}); };
exports.getCampaignReportProactiveExport = function (table) { return ({
    method: "UFN_CAMPAIGNREPORT_PROACTIVE_EXPORT",
    key: "UFN_CAMPAIGNREPORT_PROACTIVE_EXPORT",
    parameters: {
        origin: "campaignreport",
        table: JSON.stringify(table),
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
}); };
exports.getCampaignStart = function (id) { return ({
    method: "UFN_CAMPAIGN_START",
    parameters: {
        id: id,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
}); };
exports.getCampaignStatus = function (id) { return ({
    method: "UFN_CAMPAIGN_STATUS",
    parameters: {
        id: id
    }
}); };
exports.getBlocksUserFromChatfow = function (communicationchannelid) { return ({
    method: "UFN_CHATFLOW_ISSELFBLOCK_SEL",
    parameters: { communicationchannelid: communicationchannelid }
}); };
exports.reassignMassiveTicket = function (conversationid, newuserid, comment, newusergroup) { return ({
    method: "UFN_CONVERSATION_REASSIGNTICKET_MASSIVE",
    parameters: {
        conversationid: conversationid,
        newuserid: newusergroup !== "" && newuserid === 0 ? 3 : newuserid,
        comment: comment,
        newusergroup: newusergroup
    }
}); };
exports.getIntelligentModelsConfigurations = function () { return ({
    method: "UFN_INTELLIGENTMODELSCONFIGURATION_LST",
    parameters: {}
}); };
exports.getIntelligentModels = function () { return ({
    method: "UFN_INTELLIGENTMODELS_LST",
    parameters: {}
}); };
exports.insInteligentModelConfiguration = function (_a) {
    var channels = _a.channels, id = _a.id, operation = _a.operation, description = _a.description, type = _a.type, status = _a.status, color = _a.color, icontype = _a.icontype, services = _a.services;
    return ({
        method: 'UFN_INTELLIGENTMODELSCONFIGURATION_INS',
        key: "UFN_INTELLIGENTMODELSCONFIGURATION_INS",
        parameters: {
            communicationchannelid: channels,
            intelligentmodelsconfigurationid: id,
            operation: operation,
            description: description,
            type: type,
            status: status,
            color: color,
            icontype: icontype,
            parameters: services
        }
    });
};
exports.gerencialTMOsel = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, _b = _a.closedby, closedby = _b === void 0 ? "ASESOR,BOT" : _b, _c = _a.min, min = _c === void 0 ? "" : _c, _d = _a.max, max = _d === void 0 ? "" : _d, _e = _a.target, target = _e === void 0 ? 0 : _e, _f = _a.skipdown, skipdown = _f === void 0 ? 0 : _f, _g = _a.skipup, skipup = _g === void 0 ? 0 : _g, _h = _a.bd, bd = _h === void 0 ? true : _h;
    return ({
        method: 'UFN_DASHBOARD_GERENCIAL_TMO_GENERAL_SEL',
        key: "UFN_DASHBOARD_GERENCIAL_TMO_GENERAL_SEL",
        parameters: {
            startdate: startdate, enddate: enddate, channel: channel, group: group, company: company,
            level: 0,
            closedby: closedby,
            min: min === "" ? "00:00:00" : min, max: max === "" ? "99:00:00" : max, target: target / 100, skipdown: skipdown / 100, skipup: skipup / 100,
            bd: bd,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.gerencialTMOselData = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, _b = _a.bd, bd = _b === void 0 ? true : _b;
    return ({
        method: 'UFN_DASHBOARD_GERENCIAL_TMO_GENERAL_DATA_SEL',
        key: "UFN_DASHBOARD_GERENCIAL_TMO_GENERAL_DATA_SEL",
        parameters: {
            startdate: startdate, enddate: enddate, channel: channel, group: group, company: company,
            level: 0, closedby: "ASESOR,BOT", min: 0, max: 0, target: 0, skipdown: 0, skipup: 0,
            bd: bd,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.gerencialTMEsel = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, _b = _a.closedby, closedby = _b === void 0 ? "ASESOR,BOT" : _b, _c = _a.min, min = _c === void 0 ? "" : _c, _d = _a.max, max = _d === void 0 ? "" : _d, _e = _a.target, target = _e === void 0 ? 0 : _e, _f = _a.skipdown, skipdown = _f === void 0 ? 0 : _f, _g = _a.skipup, skipup = _g === void 0 ? 0 : _g, _h = _a.bd, bd = _h === void 0 ? true : _h;
    return ({
        method: 'UFN_DASHBOARD_GERENCIAL_TME_GENERAL_SEL',
        key: "UFN_DASHBOARD_GERENCIAL_TME_GENERAL_SEL",
        parameters: {
            startdate: startdate, enddate: enddate, channel: channel, group: group, company: company,
            level: 0,
            closedby: closedby,
            min: min === "" ? "00:00:00" : min, max: max === "" ? "99:00:00" : max, target: target / 100, skipdown: skipdown / 100, skipup: skipup / 100,
            bd: bd,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.gerencialTMEselData = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, _b = _a.bd, bd = _b === void 0 ? true : _b;
    return ({
        method: 'UFN_DASHBOARD_GERENCIAL_TME_GENERAL_DATA_SEL',
        key: "UFN_DASHBOARD_GERENCIAL_TME_GENERAL_DATA_SEL",
        parameters: {
            startdate: startdate, enddate: enddate, channel: channel, group: group, company: company,
            level: 0, closedby: "ASESOR,BOT", min: 0, max: 0, target: 0, skipdown: 0, skipup: 0,
            bd: bd,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.gerencialEncuestassel = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, question = _a.question, _b = _a.closedby, closedby = _b === void 0 ? "ASESOR,BOT" : _b, _c = _a.target, target = _c === void 0 ? 0 : _c, _d = _a.bd, bd = _d === void 0 ? true : _d;
    return ({
        method: 'UFN_DASHBOARD_GERENCIAL_ENCUESTA3_SEL',
        key: "UFN_DASHBOARD_GERENCIAL_ENCUESTA3_SEL",
        parameters: {
            startdate: startdate,
            enddate: enddate,
            channel: channel,
            group: group,
            company: company,
            level: 0,
            closedby: closedby,
            question: question,
            target: target / 100,
            bd: bd,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.dashboardKPISummarySel = function (_a) {
    var date = _a.date, origin = _a.origin, usergroup = _a.usergroup, supervisorid = _a.supervisorid, userid = _a.userid;
    return ({
        method: 'UFN_DASHBOARD_KPI_SUMMARY_SEL',
        key: "UFN_DASHBOARD_KPI_SUMMARY_SEL",
        parameters: {
            date: date, origin: origin, usergroup: usergroup, supervisorid: supervisorid,
            offset: (new Date().getTimezoneOffset() / 60) * -1,
            userid: userid
        }
    });
};
exports.dashboardKPIMonthSummarySel = function (_a) {
    var origin = _a.origin, usergroup = _a.usergroup, supervisorid = _a.supervisorid, userid = _a.userid;
    return ({
        method: 'UFN_DASHBOARD_KPI_SUMMARY_BY_MONTH',
        key: "UFN_DASHBOARD_KPI_SUMMARY_BY_MONTH",
        parameters: {
            date: new Date(),
            origin: origin, usergroup: usergroup, supervisorid: supervisorid,
            offset: (new Date().getTimezoneOffset() / 60) * -1,
            userid: userid
        }
    });
};
exports.dashboardKPISummaryGraphSel = function (_a) {
    var date = _a.date, origin = _a.origin, usergroup = _a.usergroup, supervisorid = _a.supervisorid, userid = _a.userid;
    return ({
        method: 'UFN_DASHBOARD_KPI_SUMMARY_GRAPH_SEL',
        key: "UFN_DASHBOARD_KPI_SUMMARY_GRAPH_SEL",
        parameters: {
            date: date, origin: origin, usergroup: usergroup, supervisorid: supervisorid,
            offset: (new Date().getTimezoneOffset() / 60) * -1,
            userid: userid
        }
    });
};
exports.dashboardKPIMonthSummaryGraphSel = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, origin = _a.origin, usergroup = _a.usergroup, supervisorid = _a.supervisorid, userid = _a.userid;
    return ({
        method: 'UFN_DASHBOARD_KPI_SUMMARY_GRAPH_BY_MONTH',
        key: "UFN_DASHBOARD_KPI_SUMMARY_GRAPH_BY_MONTH",
        parameters: {
            startdate: startdate, enddate: enddate, origin: origin, usergroup: usergroup, supervisorid: supervisorid,
            offset: (new Date().getTimezoneOffset() / 60) * -1,
            userid: userid
        }
    });
};
exports.gerencialsummarysel = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company;
    return ({
        method: 'UFN_DASHBOARD_GERENCIAL_SUMMARY_SEL',
        key: "UFN_DASHBOARD_GERENCIAL_SUMMARY_SEL",
        parameters: {
            startdate: startdate,
            enddate: enddate,
            channel: channel,
            group: group,
            company: company,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.gerencialsummaryseldata = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company;
    return ({
        method: 'UFN_DASHBOARD_GERENCIAL_SUMMARY_DATA_SEL',
        key: "UFN_DASHBOARD_GERENCIAL_SUMMARY_DATA_SEL",
        parameters: {
            startdate: startdate,
            enddate: enddate,
            channel: channel,
            group: group,
            company: company,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.gerencialencuestasel = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company;
    return ({
        method: 'UFN_DASHBOARD_GERENCIAL_ENCUESTA_SEL',
        key: "UFN_DASHBOARD_GERENCIAL_ENCUESTA_SEL",
        parameters: {
            startdate: startdate,
            enddate: enddate,
            channel: channel,
            group: group,
            company: company,
            closedby: "",
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.gerencialEncuesta3selData = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, question = _a.question;
    return ({
        method: 'UFN_DASHBOARD_GERENCIAL_ENCUESTA3_DATA_SEL',
        key: "UFN_DASHBOARD_GERENCIAL_ENCUESTA3_DATA_SEL",
        parameters: {
            startdate: startdate, enddate: enddate, channel: channel, group: group, company: company, question: question,
            closedby: "ASESOR,BOT", target: 0, offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.gerencialEncuesta2selData = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, question = _a.question;
    return ({
        method: 'UFN_DASHBOARD_GERENCIAL_ENCUESTA2_DATA_SEL',
        key: "UFN_DASHBOARD_GERENCIAL_ENCUESTA2_DATA_SEL",
        parameters: {
            startdate: startdate, enddate: enddate, channel: channel, group: group, company: company, question: question,
            closedby: "ASESOR,BOT", target: 0, offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.gerencialconversationsel = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company;
    return ({
        method: 'UFN_DASHBOARD_GERENCIAL_CONVERSATION_SEL',
        key: "UFN_DASHBOARD_GERENCIAL_CONVERSATION_SEL",
        parameters: {
            startdate: startdate,
            enddate: enddate,
            channel: channel,
            group: group,
            company: company,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.gerencialconversationseldata = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company;
    return ({
        method: 'UFN_DASHBOARD_GERENCIAL_CONVERSATION_DATA_SEL',
        key: "UFN_DASHBOARD_GERENCIAL_CONVERSATION_DATA_SEL",
        parameters: {
            startdate: startdate,
            enddate: enddate,
            channel: channel,
            group: group,
            company: company,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.gerencialinteractionsel = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company;
    return ({
        method: 'UFN_DASHBOARD_GERENCIAL_INTERACTION_SEL',
        key: "UFN_DASHBOARD_GERENCIAL_INTERACTION_SEL",
        parameters: {
            startdate: startdate,
            enddate: enddate,
            channel: channel,
            group: group,
            company: company,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.gerencialinteractionseldata = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company;
    return ({
        method: 'UFN_DASHBOARD_GERENCIAL_INTERACTION_DATA_SEL',
        key: "UFN_DASHBOARD_GERENCIAL_INTERACTION_DATA_SEL",
        parameters: {
            startdate: startdate,
            enddate: enddate,
            channel: channel,
            group: group,
            company: company,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.gerencialchannelsel = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company;
    return ({
        method: 'UFN_DASHBOARD_GERENCIAL_CHANNEL_SEL',
        key: "UFN_DASHBOARD_GERENCIAL_CHANNEL_SEL",
        parameters: {
            startdate: startdate,
            enddate: enddate,
            channel: channel,
            group: group,
            company: company,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.gerencialetiquetassel = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, _b = _a.limit, limit = _b === void 0 ? 5 : _b;
    return ({
        method: 'UFN_DASHBOARD_GERENCIAL_ETIQUETAS_SEL',
        key: "UFN_DASHBOARD_GERENCIAL_ETIQUETAS_SEL",
        parameters: {
            startdate: startdate,
            enddate: enddate,
            channel: channel,
            limit: limit,
            group: group,
            company: company,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.gerencialetiquetasseldata = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company;
    return ({
        method: 'UFN_DASHBOARD_GERENCIAL_ETIQUETAS_DATA_SEL',
        key: "UFN_DASHBOARD_GERENCIAL_ETIQUETAS_DATA_SEL",
        parameters: {
            startdate: startdate,
            enddate: enddate,
            channel: channel,
            limit: 5,
            group: group,
            company: company,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.gerencialasesoresconectadosbarsel = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company;
    return ({
        method: 'UFN_DASHBOARD_GERENCIAL_ASESORESCONECTADOSBAR_SEL',
        key: "UFN_DASHBOARD_GERENCIAL_ASESORESCONECTADOSBAR_SEL",
        parameters: {
            startdate: startdate,
            enddate: enddate,
            channel: channel,
            group: group,
            company: company,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.gerencialasesoresconectadosbarseldata = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company;
    return ({
        method: 'UFN_DASHBOARD_GERENCIAL_ASESORESCONECTADOSBAR_DATA_SEL',
        key: "UFN_DASHBOARD_GERENCIAL_ASESORESCONECTADOSBAR_DATA_SEL",
        parameters: {
            startdate: startdate,
            enddate: enddate,
            channel: channel,
            group: group,
            company: company,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
/// Settings tab (drawer)
exports.getCountConfigurationsBody = function () { return ({
    method: "UFN_COUNT_CONFIGURATION",
    parameters: {}
}); };
exports.getSupervisorsSel = function () { return ({
    method: 'UFN_USER_SUPERVISORBYORGID_LST',
    key: "UFN_USER_SUPERVISORBYORGID_LST",
    parameters: {}
}); };
exports.getLabelsSel = function () { return ({
    method: 'UFN_LABEL_LST',
    key: "UFN_LABEL_LST",
    parameters: {}
}); };
exports.getdashboardPushHSMCATEGORYRANKSel = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, label = _a.label, category = _a.category, supervisor = _a.supervisor;
    return ({
        method: 'UFN_DASHBOARD_PUSH_HSMCATEGORYRANK_SEL',
        key: "UFN_DASHBOARD_PUSH_HSMCATEGORYRANK_SEL",
        parameters: { startdate: startdate, enddate: enddate, channel: channel, group: group, company: company, label: label, category: category, offset: (new Date().getTimezoneOffset() / 60) * -1, userid: supervisor }
    });
};
exports.getdashboardPushHSMCATEGORYRANKSelData = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, label = _a.label, category = _a.category, supervisor = _a.supervisor;
    return ({
        method: 'UFN_DASHBOARD_PUSH_HSMCATEGORYRANK_DATA_SEL',
        key: "UFN_DASHBOARD_PUSH_HSMCATEGORYRANK_DATA_SEL",
        parameters: { startdate: startdate, enddate: enddate, channel: channel, group: group, company: company, label: label, category: category, offset: (new Date().getTimezoneOffset() / 60) * -1, userid: supervisor }
    });
};
exports.getdashboardPushSUMMARYSel = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, label = _a.label, category = _a.category, supervisor = _a.supervisor;
    return ({
        method: 'UFN_DASHBOARD_PUSH_SUMMARY_SEL',
        key: "UFN_DASHBOARD_PUSH_SUMMARY_SEL",
        parameters: { startdate: startdate, enddate: enddate, channel: channel, group: group, company: company, label: label, category: category, offset: (new Date().getTimezoneOffset() / 60) * -1, userid: supervisor }
    });
};
exports.getdashboardPushSUMMARYSelData = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, label = _a.label, category = _a.category, supervisor = _a.supervisor;
    return ({
        method: 'UFN_DASHBOARD_PUSH_SUMMARY_DATA_SEL',
        key: "UFN_DASHBOARD_PUSH_SUMMARY_DATA_SEL",
        parameters: { startdate: startdate, enddate: enddate, channel: channel, group: group, company: company, label: label, category: category, offset: (new Date().getTimezoneOffset() / 60) * -1, userid: supervisor }
    });
};
exports.getdashboardPushHSMRANKSel = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, label = _a.label, category = _a.category, supervisor = _a.supervisor;
    return ({
        method: 'UFN_DASHBOARD_PUSH_HSMRANK_SEL',
        key: "UFN_DASHBOARD_PUSH_HSMRANK_SEL",
        parameters: { startdate: startdate, enddate: enddate, channel: channel, group: group, company: company, label: label, category: category, offset: (new Date().getTimezoneOffset() / 60) * -1, userid: supervisor }
    });
};
exports.getdashboardPushHSMRANKSelData = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, label = _a.label, category = _a.category, supervisor = _a.supervisor;
    return ({
        method: 'UFN_DASHBOARD_PUSH_HSMRANK_DATA_SEL',
        key: "UFN_DASHBOARD_PUSH_HSMRANK_DATA_SEL",
        parameters: { startdate: startdate, enddate: enddate, channel: channel, group: group, company: company, label: label, category: category, offset: (new Date().getTimezoneOffset() / 60) * -1, userid: supervisor }
    });
};
exports.getdashboardPushMENSAJEXDIASel = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, label = _a.label, category = _a.category, supervisor = _a.supervisor;
    return ({
        method: 'UFN_DASHBOARD_PUSH_MENSAJEXDIA_SEL',
        key: "UFN_DASHBOARD_PUSH_MENSAJEXDIA_SEL",
        parameters: { startdate: startdate, enddate: enddate, channel: channel, group: group, company: company, label: label, category: category, offset: (new Date().getTimezoneOffset() / 60) * -1, userid: supervisor }
    });
};
exports.getdashboardRankingPushSel = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company;
    return ({
        method: 'UFN_DASHBOARD_GERENCIAL_TAG_SEL',
        key: "UFN_DASHBOARD_GERENCIAL_TAG_SEL",
        parameters: { startdate: startdate, enddate: enddate, channel: channel, group: group, company: company, offset: (new Date().getTimezoneOffset() / 60) * -1 }
    });
};
exports.getdashboardRankingPushDataSel = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company;
    return ({
        method: 'UFN_DASHBOARD_GERENCIAL_TAG_DATA_SEL',
        key: "UFN_DASHBOARD_GERENCIAL_TAG_DATA_SEL",
        parameters: { startdate: startdate, enddate: enddate, channel: channel, group: group, company: company, offset: (new Date().getTimezoneOffset() / 60) * -1 }
    });
};
exports.getdashboardPushAppSel = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, label = _a.label, category = _a.category, supervisor = _a.supervisor;
    return ({
        method: 'UFN_DASHBOARD_PUSH_APPLICATION_SEL',
        key: "UFN_DASHBOARD_PUSH_APPLICATION_SEL",
        parameters: { startdate: startdate, enddate: enddate, channel: channel, group: group, company: company, label: label, category: category, offset: (new Date().getTimezoneOffset() / 60) * -1, userid: supervisor }
    });
};
exports.getdashboardPushAppDataSel = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, label = _a.label, category = _a.category, supervisor = _a.supervisor;
    return ({
        method: 'UFN_DASHBOARD_PUSH_APPLICATION_DATA_SEL',
        key: "UFN_DASHBOARD_PUSH_APPLICATION_DATA_SEL",
        parameters: { startdate: startdate, enddate: enddate, channel: channel, group: group, company: company, label: label, category: category, offset: (new Date().getTimezoneOffset() / 60) * -1, userid: supervisor }
    });
};
exports.getdashboardPushMENSAJEXDIASelData = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, label = _a.label, category = _a.category, supervisor = _a.supervisor;
    return ({
        method: 'UFN_DASHBOARD_PUSH_MENSAJEXDIA_DATA_SEL',
        key: "UFN_DASHBOARD_PUSH_MENSAJEXDIA_DATA_SEL",
        parameters: { startdate: startdate, enddate: enddate, channel: channel, group: group, company: company, label: label, category: category, offset: (new Date().getTimezoneOffset() / 60) * -1, userid: supervisor }
    });
};
exports.getdashboardoperativoTMOGENERALSel = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, label = _a.label, supervisor = _a.supervisor, _b = _a.closedby, closedby = _b === void 0 ? "ASESOR" : _b, _c = _a.bd, bd = _c === void 0 ? true : _c, _d = _a.min, min = _d === void 0 ? "" : _d, _e = _a.max, max = _e === void 0 ? "" : _e, _f = _a.target, target = _f === void 0 ? 0 : _f, _g = _a.skipdown, skipdown = _g === void 0 ? 0 : _g, _h = _a.skipup, skipup = _h === void 0 ? 0 : _h;
    return ({
        method: 'UFN_DASHBOARD_OPERATIVO_TMO_GENERAL_SEL',
        key: "UFN_DASHBOARD_OPERATIVO_TMO_GENERAL_SEL",
        parameters: {
            startdate: startdate, enddate: enddate, channel: channel, group: group, company: company, label: label,
            level: 0,
            closedby: closedby,
            skipdown: skipdown / 100,
            skipup: skipup / 100,
            bd: bd,
            min: min === "" ? "00:00:00" : min,
            max: max === "" ? "99:00:00" : max,
            target: target / 100,
            offset: (new Date().getTimezoneOffset() / 60) * -1,
            supervisorid: supervisor
        }
    });
};
exports.getdashboardoperativoTMOGENERALSeldata = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, label = _a.label, supervisor = _a.supervisor, _b = _a.bd, bd = _b === void 0 ? true : _b;
    return ({
        method: 'UFN_DASHBOARD_OPERATIVO_TMO_GENERAL_DATA_SEL',
        key: "UFN_DASHBOARD_OPERATIVO_TMO_GENERAL_DATA_SEL",
        parameters: {
            startdate: startdate, enddate: enddate, channel: channel, group: group, company: company, label: label,
            level: 0,
            closedby: "",
            skipdown: 0,
            skipup: 0,
            bd: bd,
            min: "00:00:00",
            max: "00:00:00",
            target: 0,
            offset: (new Date().getTimezoneOffset() / 60) * -1,
            supervisorid: supervisor
        }
    });
};
exports.getdashboardoperativoTMEGENERALSel = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, _b = _a.bd, bd = _b === void 0 ? true : _b, label = _a.label, supervisor = _a.supervisor, _c = _a.closedby, closedby = _c === void 0 ? "ASESOR" : _c, _d = _a.min, min = _d === void 0 ? "" : _d, _e = _a.max, max = _e === void 0 ? "" : _e, _f = _a.target, target = _f === void 0 ? 0 : _f, _g = _a.skipdown, skipdown = _g === void 0 ? 0 : _g, _h = _a.skipup, skipup = _h === void 0 ? 0 : _h;
    return ({
        method: 'UFN_DASHBOARD_OPERATIVO_TME_GENERAL_SEL',
        key: "UFN_DASHBOARD_OPERATIVO_TME_GENERAL_SEL",
        parameters: {
            startdate: startdate, enddate: enddate, channel: channel, group: group, company: company, label: label,
            level: 0,
            closedby: closedby,
            skipdown: skipdown / 100,
            skipup: skipup / 100,
            bd: bd,
            min: min === "" ? "00:00:00" : min,
            max: max === "" ? "99:00:00" : max,
            target: target / 100,
            offset: (new Date().getTimezoneOffset() / 60) * -1,
            supervisorid: supervisor
        }
    });
};
exports.getdashboardoperativoTMEGENERALSeldata = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, label = _a.label, supervisor = _a.supervisor, _b = _a.bd, bd = _b === void 0 ? true : _b;
    return ({
        method: 'UFN_DASHBOARD_OPERATIVO_TME_GENERAL_DATA_SEL',
        key: "UFN_DASHBOARD_OPERATIVO_TME_GENERAL_DATA_SEL",
        parameters: {
            startdate: startdate, enddate: enddate, channel: channel, group: group, company: company, label: label,
            level: 0,
            closedby: "",
            skipdown: 0,
            skipup: 0,
            bd: bd,
            min: "00:00:00",
            max: "00:00:00",
            target: 0,
            offset: (new Date().getTimezoneOffset() / 60) * -1,
            supervisorid: supervisor
        }
    });
};
exports.getdashboardgerencialconverstionxhoursel = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, skipdown = _a.skipdown, skipup = _a.skipup;
    return ({
        method: 'UFN_DASHBOARD_GERENCIAL_CONVERSATIONXHOUR_SEL',
        key: "UFN_DASHBOARD_GERENCIAL_CONVERSATIONXHOUR_SEL",
        parameters: {
            startdate: startdate, enddate: enddate, channel: channel, group: group, company: company,
            skipdown: skipdown / 100,
            skipup: skipup / 100,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getdashboardoperativoSummarySel = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, label = _a.label, supervisor = _a.supervisor;
    return ({
        method: 'UFN_DASHBOARD_OPERATIVO_SUMMARY_SEL',
        key: "UFN_DASHBOARD_OPERATIVO_SUMMARY_SEL",
        parameters: {
            startdate: startdate, enddate: enddate, channel: channel, group: group, company: company, label: label,
            skipdowntmo: 0,
            skipuptmo: 0,
            skipdowntme: 0,
            skipuptme: 0,
            offset: (new Date().getTimezoneOffset() / 60) * -1,
            supervisorid: supervisor
        }
    });
};
exports.getdashboardoperativoTMOdistseldata = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, label = _a.label, supervisor = _a.supervisor;
    return ({
        method: 'UFN_DASHBOARD_OPERATIVO_TMODIST_DATA_SEL',
        key: "UFN_DASHBOARD_OPERATIVO_TMODIST_DATA_SEL",
        parameters: {
            startdate: startdate, enddate: enddate, channel: channel, group: group, company: company, label: label,
            skipdowntmo: 0,
            skipuptmo: 0,
            skipdowntme: 0,
            skipuptme: 0,
            offset: (new Date().getTimezoneOffset() / 60) * -1,
            supervisorid: supervisor
        }
    });
};
exports.getdashboardoperativoTMEdistseldata = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, label = _a.label, supervisor = _a.supervisor;
    return ({
        method: 'UFN_DASHBOARD_OPERATIVO_TMEDIST_DATA_SEL',
        key: "UFN_DASHBOARD_OPERATIVO_TMEDIST_DATA_SEL",
        parameters: {
            startdate: startdate, enddate: enddate, channel: channel, group: group, company: company, label: label,
            skipdowntmo: 0,
            skipuptmo: 0,
            skipdowntme: 0,
            skipuptme: 0,
            offset: (new Date().getTimezoneOffset() / 60) * -1,
            supervisorid: supervisor
        }
    });
};
exports.getdashboardoperativoProdxHoraSel = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, label = _a.label, supervisor = _a.supervisor, level = _a.level;
    return ({
        method: 'UFN_DASHBOARD_OPERATIVO_PRODXHORA_SEL',
        key: "UFN_DASHBOARD_OPERATIVO_PRODXHORA_SEL",
        parameters: {
            startdate: startdate, enddate: enddate, channel: channel, group: group, company: company, label: label,
            level: level,
            offset: (new Date().getTimezoneOffset() / 60) * -1,
            supervisorid: supervisor
        }
    });
};
exports.getdashboardoperativoProdxHoraDistSel = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, label = _a.label, supervisor = _a.supervisor;
    return ({
        method: 'UFN_DASHBOARD_OPERATIVO_PRODXHORADIST_SEL',
        key: "UFN_DASHBOARD_OPERATIVO_PRODXHORADIST_SEL",
        parameters: {
            startdate: startdate, enddate: enddate, channel: channel, group: group, company: company, label: label,
            offset: (new Date().getTimezoneOffset() / 60) * -1,
            supervisorid: supervisor
        }
    });
};
exports.getdashboardoperativoProdxHoraDistSeldata = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, label = _a.label, supervisor = _a.supervisor;
    return ({
        method: 'UFN_DASHBOARD_OPERATIVO_PRODXHORADIST_DATA_SEL',
        key: "UFN_DASHBOARD_OPERATIVO_PRODXHORADIST_DATA_SEL",
        parameters: {
            startdate: startdate, enddate: enddate, channel: channel, group: group, company: company, label: label,
            offset: (new Date().getTimezoneOffset() / 60) * -1,
            supervisorid: supervisor
        }
    });
};
exports.getdashboardoperativoEncuesta3Sel = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, label = _a.label, question = _a.question, closedby = _a.closedby, target = _a.target, supervisor = _a.supervisor;
    return ({
        method: 'UFN_DASHBOARD_OPERATIVO_ENCUESTA3_SEL',
        key: "UFN_DASHBOARD_OPERATIVO_ENCUESTA3_SEL",
        parameters: {
            startdate: startdate, enddate: enddate, channel: channel, group: group, company: company, label: label, question: question, closedby: closedby,
            target: target / 100,
            offset: (new Date().getTimezoneOffset() / 60) * -1,
            supervisorid: supervisor
        }
    });
};
exports.getdashboardoperativoEncuestaSel = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, label = _a.label, supervisor = _a.supervisor;
    return ({
        method: 'UFN_DASHBOARD_OPERATIVO_ENCUESTA_SEL',
        key: "UFN_DASHBOARD_OPERATIVO_ENCUESTA_SEL",
        parameters: {
            startdate: startdate, enddate: enddate, channel: channel, group: group, company: company, label: label,
            closedby: "",
            offset: (new Date().getTimezoneOffset() / 60) * -1,
            supervisorid: supervisor
        }
    });
};
exports.getdashboardoperativoEncuesta3Seldata = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, label = _a.label, supervisor = _a.supervisor, question = _a.question;
    return ({
        method: 'UFN_DASHBOARD_OPERATIVO_ENCUESTA3_DATA_SEL',
        key: "UFN_DASHBOARD_OPERATIVO_ENCUESTA3_DATA_SEL",
        parameters: {
            startdate: startdate, enddate: enddate, channel: channel, group: group, company: company, label: label, question: question,
            closedby: "ASESOR,BOT", target: 0,
            offset: (new Date().getTimezoneOffset() / 60) * -1,
            supervisorid: supervisor
        }
    });
};
exports.getdashboardoperativoEncuesta2Seldata = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, channel = _a.channel, group = _a.group, company = _a.company, label = _a.label, supervisor = _a.supervisor, question = _a.question;
    return ({
        method: 'UFN_DASHBOARD_OPERATIVO_ENCUESTA2_DATA_SEL',
        key: "UFN_DASHBOARD_OPERATIVO_ENCUESTA2_DATA_SEL",
        parameters: {
            startdate: startdate, enddate: enddate, channel: channel, group: group, company: company, label: label, question: question,
            closedby: "ASESOR,BOT", target: 0,
            offset: (new Date().getTimezoneOffset() / 60) * -1,
            supervisorid: supervisor
        }
    });
};
exports.getPropertySelByName = function (propertyname, key) {
    if (key === void 0) { key = ""; }
    return ({
        method: 'UFN_PROPERTY_SELBYNAME',
        key: "UFN_PROPERTY_SELBYNAME" + key,
        parameters: {
            propertyname: propertyname
        }
    });
};
exports.getPropertySelByNameOrg = function (propertyname, orgid, key) { return ({
    method: 'UFN_PROPERTY_SELBYNAME',
    key: "UFN_PROPERTY_SELBYNAME" + key,
    parameters: {
        propertyname: propertyname, orgid: orgid
    }
}); };
exports.getConversationClassification2 = function (conversationid) { return ({
    method: 'UFN_CONVERSATIONCLASSIFICATION_SEL2',
    key: "UFN_CONVERSATIONCLASSIFICATION_SEL2",
    parameters: {
        conversationid: conversationid
    }
}); };
exports.getAttachmentsByPerson = function (personid) { return ({
    method: 'QUERY_SELECT_ATTACHMENT',
    key: "QUERY_SELECT_ATTACHMENT",
    parameters: {
        personid: personid
    }
}); };
exports.getLeadsByUserPerson = function (personid) { return ({
    method: 'QUERY_SELECT_LEADS_BY_USER_PERSON',
    key: "QUERY_SELECT_LEADS_BY_USER_PERSON",
    parameters: {
        personid: personid
    }
}); };
/// Settings tab (drawer)
exports.getPropertyConfigurationsBody = function () { return ([
    {
        method: "UFN_PROPERTY_SELBYNAME",
        parameters: { propertyname: 'MAXIMONUMEROTICKETS' }
    },
    {
        method: "UFN_PROPERTY_SELBYNAME",
        parameters: { propertyname: 'EXPIRACIONSESIONASESOR' }
    },
    {
        method: "UFN_PROPERTY_SELBYNAME",
        parameters: { propertyname: 'EXPIRACIONSESIONADMINISTRADOR' }
    },
    {
        method: "UFN_PROPERTY_SELBYNAME",
        parameters: { propertyname: 'CIERREAUTOMATICO' }
    },
    {
        method: "UFN_PROPERTY_SELBYNAME",
        parameters: { propertyname: 'EXPIRACIONSESIONSUPERVISOR' }
    },
    {
        method: "UFN_PROPERTY_SELBYNAME",
        parameters: { propertyname: 'ACCIONFUERAHORARIO' }
    },
    {
        method: "UFN_PROPERTY_SELBYNAME",
        parameters: { propertyname: 'EXPIRACIONENCUESTA' }
    },
    {
        method: "UFN_PROPERTY_SELBYNAME",
        parameters: { propertyname: 'WAITINGMESSAGE' }
    },
    {
        method: "UFN_PROPERTY_SELBYNAME",
        parameters: { propertyname: 'WAITINGREPETITIVEMESSAGE' }
    },
]); };
exports.insPersonBody = function (person) {
    var _a;
    return ({
        method: 'UFN_PERSON_INS',
        parameters: __assign(__assign({}, person), { corpid: null, orgid: null, phone: (_a = person === null || person === void 0 ? void 0 : person.phone) === null || _a === void 0 ? void 0 : _a.replaceAll('+', ''), district: person.district || "", observation: person.observation || '' })
    });
};
exports.insPersonCommunicationChannel = function (pcc) { return ({
    method: 'UFN_PERSONCOMMUNICATIONCHANNEL_INS',
    parameters: __assign(__assign({}, pcc), { corpid: null, type: pcc.type || "VOXI", orgid: null })
}); };
exports.personInsValidation = function (_a) {
    var id = _a.id, phone = _a.phone, email = _a.email, alternativephone = _a.alternativephone, alternativeemail = _a.alternativeemail, operation = _a.operation;
    return ({
        method: 'UFN_PERSON_INS_VALIDATION',
        parameters: {
            id: id,
            phone: (phone === null || phone === void 0 ? void 0 : phone.replaceAll('+', '')) || "",
            email: email,
            alternativephone: (alternativephone === null || alternativephone === void 0 ? void 0 : alternativephone.replaceAll('+', '')) || "",
            alternativeemail: alternativeemail,
            operation: operation
        }
    });
};
exports.personImportValidation = function (_a) {
    var table = _a.table;
    return ({
        method: 'UFN_PERSON_IMPORT_VALIDATION',
        parameters: {
            table: table
        }
    });
};
exports.editPersonBody = function (person) {
    var _a, _b;
    return ({
        method: 'UFN_PERSON_PCC_INS',
        parameters: __assign(__assign({}, person), { alternativephone: ((_a = person === null || person === void 0 ? void 0 : person.alternativephone) === null || _a === void 0 ? void 0 : _a.replaceAll('+', '')) || "", id: person.personid, operation: person.personid ? 'UPDATE' : 'INSERT', observation: person.observation || '', phone: ((_b = person === null || person === void 0 ? void 0 : person.phone) === null || _b === void 0 ? void 0 : _b.replaceAll('+', '')) || "" })
    });
};
// export const insLead = (lead: ILead, operation: string): IRequestBody => ({
//     method: 'UFN_LEAD_INS',
//     parameters: {
//         ...lead,
//         id: lead.leadid,
//         operation
//     },
// });
exports.insLeadPerson = function (lead, firstname, lastname, email, phone, personid, persontype) { return ({
    method: 'UFN_LEAD_PERSON_INS',
    parameters: __assign(__assign({}, lead), { id: lead.leadid, firstname: firstname,
        lastname: lastname,
        email: email,
        phone: phone,
        personid: personid,
        persontype: persontype })
}); };
exports.getColumnsSel = function (id, lost) {
    if (lost === void 0) { lost = false; }
    return ({
        method: "UFN_COLUMN_SEL",
        key: "UFN_COLUMN_SEL",
        parameters: {
            id: id,
            all: true,
            lost: lost
        }
    });
};
exports.getColumnsSDSel = function (id, lost) {
    if (lost === void 0) { lost = false; }
    return ({
        method: "UFN_COLUMN_SD_SEL",
        key: "UFN_COLUMN_SD_SEL",
        parameters: {
            id: id,
            all: true,
            lost: lost
        }
    });
};
exports.getLeadsSel = function (params) { return ({
    method: "UFN_LEAD_SEL",
    key: "UFN_LEAD_SEL",
    parameters: __assign(__assign({}, params), { all: params.id === 0 })
}); };
exports.getLeadsSDSel = function (params) { return ({
    method: "UFN_LEAD_SD_SEL",
    key: "UFN_LEAD_SD_SEL",
    parameters: __assign(__assign({}, params), { all: params.id === 0 })
}); };
exports.getAutomatizationRulesSel = function (_a) {
    var id = _a.id, communicationchannelid = _a.communicationchannelid;
    return ({
        method: "UFN_LEADAUTOMATIZATIONRULES_SEL",
        key: "UFN_LEADAUTOMATIZATIONRULES_SEL",
        parameters: {
            id: id,
            communicationchannelid: communicationchannelid,
            all: id === 0
        }
    });
};
exports.getOrderColumns = function (_a) {
    var _b = _a.id, id = _b === void 0 ? 0 : _b;
    return ({
        method: "UFN_COLUMN_ORDER_SEL",
        key: "UFN_COLUMN_ORDER_SEL",
        parameters: {
            id: id,
            all: id === 0
        }
    });
};
exports.insAutomatizationRules = function (_a) {
    var id = _a.id, description = _a.description, status = _a.status, type = _a.type, columnid = _a.columnid, communicationchannelorigin = _a.communicationchannelorigin, order = _a.order, orderstatus = _a.orderstatus, communicationchannelid = _a.communicationchannelid, messagetemplateid = _a.messagetemplateid, messagetemplateparameters = _a.messagetemplateparameters, shippingtype = _a.shippingtype, xdays = _a.xdays, schedule = _a.schedule, tags = _a.tags, products = _a.products, operation = _a.operation;
    return ({
        method: 'UFN_LEADAUTOMATIZATIONRULES_INS',
        key: "UFN_LEADAUTOMATIZATIONRULES_INS",
        parameters: {
            id: id,
            description: description,
            status: status,
            type: type,
            columnid: columnid,
            order: order,
            communicationchannelid: communicationchannelid,
            messagetemplateid: messagetemplateid,
            messagetemplateparameters: messagetemplateparameters,
            shippingtype: shippingtype,
            xdays: xdays,
            schedule: schedule,
            orderstatus: orderstatus,
            tags: tags,
            products: products,
            communicationchannelorigin: communicationchannelorigin,
            operation: operation
        }
    });
};
exports.insColumns = function (_a) {
    var id = _a.id, description = _a.description, type = _a.type, status = _a.status, _b = _a.edit, edit = _b === void 0 ? true : _b, index = _a.index, operation = _a.operation, _c = _a.delete_all, delete_all = _c === void 0 ? false : _c;
    return ({
        method: 'UFN_COLUMN_INS',
        key: "UFN_COLUMN_INS",
        parameters: {
            id: id,
            description: description,
            type: type,
            status: status,
            edit: edit,
            index: index,
            operation: operation,
            delete_all: delete_all
        }
    });
};
exports.updateColumnsLeads = function (_a) {
    var cards_startingcolumn = _a.cards_startingcolumn, cards_finalcolumn = _a.cards_finalcolumn, startingcolumn_uuid = _a.startingcolumn_uuid, finalcolumn_uuid = _a.finalcolumn_uuid, _b = _a.leadid, leadid = _b === void 0 ? null : _b;
    return ({
        method: 'UFN_UPDATE_LEADS',
        key: "UFN_UPDATE_LEADS",
        parameters: {
            cards_startingcolumn: cards_startingcolumn,
            cards_finalcolumn: cards_finalcolumn,
            startingcolumn_uuid: startingcolumn_uuid,
            finalcolumn_uuid: finalcolumn_uuid,
            leadid: leadid
        }
    });
};
exports.updateOrderStatus = function (_a) {
    var orderid = _a.orderid, orderstatus = _a.orderstatus;
    return ({
        method: 'UFN_CHANGE_ORDERSTATUS',
        key: "UFN_CHANGE_ORDERSTATUS",
        parameters: {
            orderid: orderid,
            orderstatus: orderstatus
        }
    });
};
exports.updateColumnsOrder = function (_a) {
    var columns_uuid = _a.columns_uuid;
    return ({
        method: 'UFN_UPDATE_COLUMNS',
        key: "UFN_UPDATE_COLUMNS",
        parameters: {
            cards_uuid: columns_uuid
        }
    });
};
exports.insLead = function (_a) {
    var leadid = _a.leadid, description = _a.description, status = _a.status, type = _a.type, expected_revenue = _a.expected_revenue, date_deadline = _a.date_deadline, tags = _a.tags, personcommunicationchannel = _a.personcommunicationchannel, priority = _a.priority, conversationid = _a.conversationid, columnid = _a.columnid, column_uuid = _a.column_uuid, index = _a.index, operation = _a.operation, phone = _a.phone, email = _a.email, phase = _a.phase;
    return ({
        method: 'UFN_LEAD_INS',
        key: "UFN_LEAD_INS",
        parameters: {
            leadid: leadid,
            description: description,
            status: status,
            type: type,
            expected_revenue: expected_revenue,
            date_deadline: date_deadline,
            tags: tags,
            personcommunicationchannel: personcommunicationchannel,
            priority: priority,
            conversationid: conversationid,
            columnid: columnid,
            column_uuid: column_uuid,
            index: index,
            phone: phone,
            email: email,
            phase: phase,
            operation: operation
        }
    });
};
exports.insSDLead = function (lead, operation) {
    if (operation === void 0) { operation = "INSERT"; }
    return ({
        method: 'UFN_LEAD_SD_INS',
        key: "UFN_LEAD_SD_INS",
        parameters: __assign(__assign({}, lead), { id: lead.leadid, username: null, operation: operation })
    });
};
exports.insLead2 = function (lead, operation) {
    if (operation === void 0) { operation = "INSERT"; }
    return ({
        method: 'UFN_LEAD_INS',
        key: "UFN_LEAD_INS",
        parameters: __assign(__assign({}, lead), { id: lead.leadid, username: null, operation: operation })
    });
};
exports.getOneLeadSel = function (id) { return ({
    method: "UFN_LEAD_SEL",
    key: "UFN_LEAD_SEL",
    parameters: {
        id: id,
        fullname: '',
        leadproduct: '',
        campaignid: 0,
        tags: '',
        userid: "",
        supervisorid: 0,
        all: false
    }
}); };
exports.adviserSel = function () { return ({
    method: 'UFN_ADVISERS_SEL',
    key: "UFN_ADVISERS_SEL",
    parameters: {}
}); };
exports.userSDSel = function () { return ({
    method: 'UFN_USER_SD_SEL',
    key: "UFN_USER_SD_SEL",
    parameters: {}
}); };
//tabla paginada
exports.paginatedPersonWithoutDateSel = function (_a) {
    var skip = _a.skip, take = _a.take, filters = _a.filters, sorts = _a.sorts;
    return ({
        methodCollection: "UFN_PERSONWITHOUTDATE_SEL",
        methodCount: "UFN_PERSONWITHOUTDATE_TOTALRECORDS",
        parameters: {
            skip: skip,
            take: take,
            filters: filters,
            sorts: sorts,
            origin: "person",
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.leadActivityIns = function (parameters) { return ({
    key: "UFN_LEADACTIVITY_INS",
    method: "UFN_LEADACTIVITY_INS",
    parameters: parameters
}); };
exports.leadActivitySel = function (leadid) { return ({
    key: "UFN_LEADACTIVITY_SEL",
    method: "UFN_LEADACTIVITY_SEL",
    parameters: {
        leadid: leadid,
        leadactivityid: 0,
        all: true
    }
}); };
exports.leadLogNotesSel = function (leadid) { return ({
    key: "UFN_LEADNOTES_SEL",
    method: "UFN_LEADNOTES_SEL",
    parameters: {
        leadid: leadid,
        leadnotesid: 0,
        all: true
    }
}); };
exports.leadLogNotesIns = function (parameters) { return ({
    key: "UFN_LEADNOTES_INS",
    method: "UFN_LEADNOTES_INS",
    parameters: parameters
}); };
exports.getPaginatedLead = function (_a) {
    var skip = _a.skip, take = _a.take, filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate, allParameters = __rest(_a, ["skip", "take", "filters", "sorts", "startdate", "enddate"]);
    return ({
        methodCollection: "UFN_LEADGRID_SEL",
        methodCount: "UFN_LEADGRID_TOTALRECORDS",
        parameters: __assign({ origin: "lead", startdate: startdate,
            enddate: enddate,
            skip: skip,
            take: take,
            filters: filters,
            sorts: sorts, asesorid: allParameters['asesorid'] ? allParameters['asesorid'] : 0, channel: allParameters['channel'] ? allParameters['channel'] : "", contact: allParameters['contact'] ? allParameters['contact'] : "", offset: (new Date().getTimezoneOffset() / 60) * -1 }, allParameters)
    });
};
exports.getPaginatedSDLead = function (_a) {
    var skip = _a.skip, take = _a.take, filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate, contact = _a.contact, leadproduct = _a.leadproduct, tags = _a.tags, company = _a.company, groups = _a.groups, supervisorid = _a.supervisorid, phase = _a.phase, description = _a.description, allParameters = __rest(_a, ["skip", "take", "filters", "sorts", "startdate", "enddate", "contact", "leadproduct", "tags", "company", "groups", "supervisorid", "phase", "description"]);
    return ({
        methodCollection: "UFN_LEADGRID_SD_SEL",
        methodCount: "UFN_LEADGRID_SD_TOTALRECORDS",
        parameters: __assign({ origin: "servicedesk", startdate: startdate,
            enddate: enddate,
            skip: skip,
            take: take,
            filters: filters,
            sorts: sorts, fullname: contact, leadproduct: leadproduct,
            tags: tags, company: company || "", groups: groups,
            supervisorid: supervisorid,
            phase: phase,
            description: description, offset: (new Date().getTimezoneOffset() / 60) * -1 }, allParameters)
    });
};
exports.getLeadExport = function (_a) {
    var filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate, allParameters = __rest(_a, ["filters", "sorts", "startdate", "enddate"]);
    return ({
        method: "UFN_LEADGRID_EXPORT",
        key: "UFN_LEADGRID_EXPORT",
        parameters: {
            origin: "lead",
            startdate: startdate,
            enddate: enddate,
            filters: filters,
            sorts: sorts,
            asesorid: allParameters['asesorid'] ? allParameters['asesorid'] : 0,
            channel: allParameters['channel'] ? allParameters['channel'] : "",
            contact: allParameters['contact'] ? allParameters['contact'] : "",
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.insArchiveServiceDesk = function (lead) { return ({
    method: 'UFN_LEAD_SD_INS',
    key: "UFN_LEAD_SD_INS",
    parameters: __assign(__assign({}, lead), { id: lead.leadid, username: null, status: "CERRADO", operation: "UPDATE" })
}); };
exports.insArchiveLead = function (lead) { return ({
    method: 'UFN_LEAD_INS',
    key: "UFN_LEAD_INS",
    parameters: __assign(__assign({}, lead), { id: lead.leadid, username: null, status: "CERRADO", operation: "UPDATE" })
}); };
exports.heatmapresumensel = function (_a) {
    var communicationchannel = _a.communicationchannel, startdate = _a.startdate, enddate = _a.enddate, closedby = _a.closedby;
    return ({
        key: "UFN_REPORT_HEATMAP_RESUMEN_SEL",
        method: "UFN_REPORT_HEATMAP_RESUMEN_SEL",
        parameters: {
            communicationchannel: communicationchannel,
            startdate: startdate,
            enddate: enddate,
            closedby: closedby,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.heatmappage1 = function (_a) {
    var communicationchannel = _a.communicationchannel, startdate = _a.startdate, enddate = _a.enddate, closedby = _a.closedby;
    return ({
        key: "UFN_REPORT_HEATMAP_PAGE1_SEL",
        method: "UFN_REPORT_HEATMAP_PAGE1_SEL",
        parameters: {
            communicationchannel: communicationchannel,
            startdate: startdate,
            enddate: enddate,
            closedby: closedby,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.heatmappage1detail = function (_a) {
    var communicationchannel = _a.communicationchannel, startdate = _a.startdate, enddate = _a.enddate, closedby = _a.closedby, horanum = _a.horanum, option = _a.option;
    return ({
        key: "UFN_REPORT_HEATMAP_PAGE1_DATE_DETAIL_SEL",
        method: "UFN_REPORT_HEATMAP_PAGE1_DATE_DETAIL_SEL",
        parameters: {
            communicationchannel: communicationchannel,
            startdate: startdate,
            enddate: enddate,
            closedby: closedby,
            horanum: horanum,
            option: option,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.heatmappage2 = function (_a) {
    var communicationchannel = _a.communicationchannel, startdate = _a.startdate, enddate = _a.enddate, closedby = _a.closedby, company = _a.company, group = _a.group;
    return ({
        key: "UFN_REPORT_HEATMAP_PAGE2_SEL",
        method: "UFN_REPORT_HEATMAP_PAGE2_SEL",
        parameters: {
            communicationchannel: communicationchannel,
            startdate: startdate,
            enddate: enddate,
            closedby: closedby,
            company: company,
            group: group,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.heatmappage2detail1 = function (_a) {
    var communicationchannel = _a.communicationchannel, startdate = _a.startdate, enddate = _a.enddate, closedby = _a.closedby, company = _a.company, group = _a.group, agentid = _a.agentid, option = _a.option;
    return ({
        key: "UFN_REPORT_HEATMAP_PAGE2_1_AGENT_DETAIL_SEL",
        method: "UFN_REPORT_HEATMAP_PAGE2_1_AGENT_DETAIL_SEL",
        parameters: {
            communicationchannel: communicationchannel,
            startdate: startdate,
            enddate: enddate,
            closedby: closedby,
            company: company,
            group: group,
            agentid: agentid,
            option: option,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.heatmappage2detail2 = function (_a) {
    var communicationchannel = _a.communicationchannel, startdate = _a.startdate, enddate = _a.enddate, closedby = _a.closedby, company = _a.company, group = _a.group, agentid = _a.agentid, option = _a.option;
    return ({
        key: "UFN_REPORT_HEATMAP_PAGE2_2_AGENT_DETAIL_SEL",
        method: "UFN_REPORT_HEATMAP_PAGE2_2_AGENT_DETAIL_SEL",
        parameters: {
            communicationchannel: communicationchannel,
            startdate: startdate,
            enddate: enddate,
            closedby: closedby,
            company: company,
            group: group,
            agentid: agentid,
            option: option,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.heatmappage3 = function (_a) {
    var communicationchannel = _a.communicationchannel, startdate = _a.startdate, enddate = _a.enddate;
    return ({
        key: "UFN_REPORT_HEATMAP_ASESORESCONECTADOS_SEL",
        method: "UFN_REPORT_HEATMAP_ASESORESCONECTADOS_SEL",
        parameters: {
            communicationchannel: communicationchannel,
            startdate: startdate,
            enddate: enddate,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.heatmappage3detail = function (_a) {
    var communicationchannel = _a.communicationchannel, startdate = _a.startdate, enddate = _a.enddate, horanum = _a.horanum;
    return ({
        key: "UFN_REPORT_HEATMAP_ASESORESCONECTADOS_DETAIL_SEL",
        method: "UFN_REPORT_HEATMAP_ASESORESCONECTADOS_DETAIL_SEL",
        parameters: {
            communicationchannel: communicationchannel,
            startdate: startdate,
            enddate: enddate,
            horanum: horanum,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.leadHistorySel = function (leadid) { return ({
    key: "UFN_LEADACTIVITYHISTORY_SEL",
    method: "UFN_LEADACTIVITYHISTORY_SEL",
    parameters: {
        leadid: leadid,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
}); };
exports.updateLeadTagsIns = function (tags) { return ({
    key: "UFN_UPDATE_LEAD_TAGS",
    method: "UFN_UPDATE_LEAD_TAGS",
    parameters: tags
}); };
exports.leadHistoryIns = function (_a) {
    var leadid = _a.leadid, historyleadid = _a.historyleadid, description = _a.description, type = _a.type, status = _a.status, operation = _a.operation;
    return ({
        key: "UFN_HISTORYLEAD_INS",
        method: "UFN_HISTORYLEAD_INS",
        parameters: {
            leadid: leadid,
            historyleadid: historyleadid || 0,
            description: description,
            type: type,
            status: status || 'ACTIVO',
            operation: operation
        }
    });
};
exports.changePasswordOnFirstLoginIns = function (userid, password) { return ({
    key: "UFN_USERPASSWORD_UPDATE",
    method: "UFN_USERPASSWORD_UPDATE",
    parameters: { password: password, userid: userid }
}); };
exports.getPlanSel = function () { return ({
    method: "UFN_SUPPORTPLAN_SEL",
    key: "UFN_SUPPORTPLAN_SEL",
    parameters: {}
}); };
exports.getPaymentPlanSel = function () { return ({
    method: "UFN_PAYMENTPLAN_SEL",
    key: "UFN_PAYMENTPLAN_SEL",
    parameters: {
        code: 0,
        all: true
    }
}); };
exports.getPhoneTax = function () { return ({
    method: "UFN_BILLINGPERIOD_SEL_PHONETAX",
    key: "UFN_BILLINGPERIOD_SEL_PHONETAX",
    parameters: {}
}); };
exports.getBillingSupportSel = function (_a) {
    var year = _a.year, month = _a.month, plan = _a.plan;
    return ({
        method: "UFN_BILLINGSUPPORT_SEL",
        key: "UFN_BILLINGSUPPORT_SEL",
        parameters: { year: year, month: month, plan: plan }
    });
};
exports.billingSupportIns = function (_a) {
    var year = _a.year, month = _a.month, plan = _a.plan, basicfee = _a.basicfee, starttime = _a.starttime, finishtime = _a.finishtime, plancurrency = _a.plancurrency, status = _a.status, description = _a.description, id = _a.id, type = _a.type, operation = _a.operation;
    return ({
        method: "UFN_BILLINGSUPPORT_INS",
        key: "UFN_BILLINGSUPPORT_INS",
        parameters: { year: year, month: month, plan: plan, basicfee: basicfee, starttime: starttime, finishtime: finishtime, plancurrency: plancurrency, status: status, type: type, description: description, operation: operation, id: id }
    });
};
exports.getBillingConfigurationSel = function (_a) {
    var year = _a.year, month = _a.month, plan = _a.plan;
    return ({
        method: "UFN_BILLINGCONFIGURATION_SEL",
        key: "UFN_BILLINGCONFIGURATION_SEL",
        parameters: { year: year, month: month, plan: plan }
    });
};
exports.billingConfigurationIns = function (_a) {
    var year = _a.year, month = _a.month, plan = _a.plan, id = _a.id, basicfee = _a.basicfee, userfreequantity = _a.userfreequantity, useradditionalfee = _a.useradditionalfee, channelfreequantity = _a.channelfreequantity, channelwhatsappfee = _a.channelwhatsappfee, channelotherfee = _a.channelotherfee, clientfreequantity = _a.clientfreequantity, clientadditionalfee = _a.clientadditionalfee, allowhsm = _a.allowhsm, hsmfee = _a.hsmfee, description = _a.description, status = _a.status, whatsappconversationfreequantity = _a.whatsappconversationfreequantity, freewhatsappchannel = _a.freewhatsappchannel, usercreateoverride = _a.usercreateoverride, channelcreateoverride = _a.channelcreateoverride, vcacomissionperhsm = _a.vcacomissionperhsm, vcacomissionpervoicechannel = _a.vcacomissionpervoicechannel, plancurrency = _a.plancurrency, vcacomission = _a.vcacomission, basicanualfee = _a.basicanualfee, type = _a.type, operation = _a.operation;
    return ({
        method: "UFN_BILLINGCONFIGURATION_INS",
        key: "UFN_BILLINGCONFIGURATION_INS",
        parameters: { year: year, month: month, plan: plan, id: id, basicfee: basicfee, userfreequantity: userfreequantity, useradditionalfee: useradditionalfee, channelfreequantity: channelfreequantity, channelwhatsappfee: channelwhatsappfee, channelotherfee: channelotherfee, clientfreequantity: clientfreequantity, clientadditionalfee: clientadditionalfee, allowhsm: allowhsm, hsmfee: hsmfee, description: description, status: status, whatsappconversationfreequantity: whatsappconversationfreequantity, freewhatsappchannel: freewhatsappchannel, usercreateoverride: usercreateoverride, channelcreateoverride: channelcreateoverride, vcacomissionperhsm: vcacomissionperhsm, vcacomissionpervoicechannel: vcacomissionpervoicechannel, plancurrency: plancurrency, vcacomission: vcacomission, basicanualfee: basicanualfee, type: type, operation: operation }
    });
};
exports.getBillingConversationSel = function (_a) {
    var year = _a.year, month = _a.month, _b = _a.countrycode, countrycode = _b === void 0 ? "" : _b;
    return ({
        method: "UFN_BILLINGCONVERSATION_SEL",
        key: "UFN_BILLINGCONVERSATION_SEL",
        parameters: { year: year, month: month, countrycode: countrycode ? countrycode : "" }
    });
};
exports.billingConversationIns = function (_a) {
    var id = _a.id, year = _a.year, month = _a.month, countrycode = _a.countrycode, vcacomission = _a.vcacomission, description = _a.description, status = _a.status, type = _a.type, plancurrency = _a.plancurrency, businessutilityfee = _a.businessutilityfee, businessauthenticationfee = _a.businessauthenticationfee, businessmarketingfee = _a.businessmarketingfee, usergeneralfee = _a.usergeneralfee, freequantity = _a.freequantity, username = _a.username, operation = _a.operation;
    return ({
        method: "UFN_BILLINGCONVERSATION_INS",
        key: "UFN_BILLINGCONVERSATION_INS",
        parameters: { id: id, year: year, month: month, countrycode: countrycode, vcacomission: vcacomission, description: description, status: status, type: type, plancurrency: plancurrency, businessutilityfee: businessutilityfee, businessauthenticationfee: businessauthenticationfee, businessmarketingfee: businessmarketingfee, usergeneralfee: usergeneralfee, freequantity: freequantity, username: username, operation: operation }
    });
};
exports.getBillingPeriodSel = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, year = _a.year, month = _a.month, billingplan = _a.billingplan, supportplan = _a.supportplan;
    return ({
        method: "UFN_BILLINGPERIOD_SEL",
        key: "UFN_BILLINGPERIOD_SEL",
        parameters: { corpid: corpid, orgid: orgid, year: year, month: month, billingplan: billingplan, supportplan: supportplan }
    });
};
exports.billingPeriodUpd = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, year = _a.year, month = _a.month, billingplan = _a.billingplan, billingsupportplan = _a.billingsupportplan, billinginvoicecurrency = _a.billinginvoicecurrency, billingplancurrency = _a.billingplancurrency, billingstartdate = _a.billingstartdate, billingmode = _a.billingmode, billingplanfee = _a.billingplanfee, billingsupportfee = _a.billingsupportfee, billinginfrastructurefee = _a.billinginfrastructurefee, billingexchangerate = _a.billingexchangerate, agentcontractedquantity = _a.agentcontractedquantity, agentplancurrency = _a.agentplancurrency, agentadditionalfee = _a.agentadditionalfee, agenttotalfee = _a.agenttotalfee, agentaddlimit = _a.agentaddlimit, agentmode = _a.agentmode, channelothercontractedquantity = _a.channelothercontractedquantity, channelotheradditionalfee = _a.channelotheradditionalfee, channelwhatsappcontractedquantity = _a.channelwhatsappcontractedquantity, channelwhatsappadditionalfee = _a.channelwhatsappadditionalfee, channelotherquantity = _a.channelotherquantity, channelwhatsappquantity = _a.channelwhatsappquantity, channeltotalfee = _a.channeltotalfee, channelwhatsappfreequantity = _a.channelwhatsappfreequantity, channeladdlimit = _a.channeladdlimit, conversationuserplancurrency = _a.conversationuserplancurrency, conversationuserserviceadditionalfee = _a.conversationuserserviceadditionalfee, conversationuserservicevcafee = _a.conversationuserservicevcafee, conversationusermetacurrency = _a.conversationusermetacurrency, conversationuserservicefee = _a.conversationuserservicefee, conversationuserservicetotalfee = _a.conversationuserservicetotalfee, conversationbusinessplancurrency = _a.conversationbusinessplancurrency, conversationbusinessutilityadditionalfee = _a.conversationbusinessutilityadditionalfee, conversationbusinessauthenticationadditionalfee = _a.conversationbusinessauthenticationadditionalfee, conversationbusinessmarketingadditionalfee = _a.conversationbusinessmarketingadditionalfee, conversationbusinessutilityvcafee = _a.conversationbusinessutilityvcafee, conversationbusinessauthenticationvcafee = _a.conversationbusinessauthenticationvcafee, conversationbusinessmarketingvcafee = _a.conversationbusinessmarketingvcafee, conversationbusinessmetacurrency = _a.conversationbusinessmetacurrency, conversationbusinessutilitymetafee = _a.conversationbusinessutilitymetafee, conversationbusinessauthenticationmetafee = _a.conversationbusinessauthenticationmetafee, conversationbusinessmarketingmetafee = _a.conversationbusinessmarketingmetafee, conversationbusinessutilitytotalfee = _a.conversationbusinessutilitytotalfee, conversationbusinessauthenticationtotalfee = _a.conversationbusinessauthenticationtotalfee, conversationbusinessmarketingtotalfee = _a.conversationbusinessmarketingtotalfee, conversationplancurrency = _a.conversationplancurrency, contactcalculatemode = _a.contactcalculatemode, contactcountmode = _a.contactcountmode, contactuniquelimit = _a.contactuniquelimit, contactuniquequantity = _a.contactuniquequantity, contactplancurrency = _a.contactplancurrency, contactuniqueadditionalfee = _a.contactuniqueadditionalfee, contactuniquefee = _a.contactuniquefee, contactwhatsappquantity = _a.contactwhatsappquantity, contactotherquantity = _a.contactotherquantity, contactotheradditionalfee = _a.contactotheradditionalfee, contactwhatsappadditionalfee = _a.contactwhatsappadditionalfee, contactotherfee = _a.contactotherfee, contactwhatsappfee = _a.contactwhatsappfee, contactfee = _a.contactfee, messagingplancurrency = _a.messagingplancurrency, messagingsmsadditionalfee = _a.messagingsmsadditionalfee, messagingsmsvcafee = _a.messagingsmsvcafee, messagingsmsquantity = _a.messagingsmsquantity, messagingsmsquantitylimit = _a.messagingsmsquantitylimit, messagingsmstotalfee = _a.messagingsmstotalfee, messagingmailadditionalfee = _a.messagingmailadditionalfee, messagingmailvcafee = _a.messagingmailvcafee, messagingmailquantity = _a.messagingmailquantity, messagingmailquantitylimit = _a.messagingmailquantitylimit, messagingmailtotalfee = _a.messagingmailtotalfee, voicevcacomission = _a.voicevcacomission, consultingplancurrency = _a.consultingplancurrency, consultinghourtotal = _a.consultinghourtotal, consultinghourquantity = _a.consultinghourquantity, consultingcontractedfee = _a.consultingcontractedfee, consultingextrafee = _a.consultingextrafee, consultingtotalfee = _a.consultingtotalfee, consultingprofile = _a.consultingprofile, consultingadditionalfee = _a.consultingadditionalfee, additionalservice01 = _a.additionalservice01, additionalservice01fee = _a.additionalservice01fee, additionalservice02 = _a.additionalservice02, additionalservice02fee = _a.additionalservice02fee, additionalservice03 = _a.additionalservice03, additionalservice03fee = _a.additionalservice03fee, invoiceid = _a.invoiceid, status = _a.status, force = _a.force;
    return ({
        method: "UFN_BILLINGPERIOD_UPD",
        key: "UFN_BILLINGPERIOD_UPD",
        parameters: { corpid: corpid, orgid: orgid, year: year, month: month, billingplan: billingplan, billingsupportplan: billingsupportplan, billinginvoicecurrency: billinginvoicecurrency, billingplancurrency: billingplancurrency, billingstartdate: billingstartdate, billingmode: billingmode, billingplanfee: billingplanfee, billingsupportfee: billingsupportfee, billinginfrastructurefee: billinginfrastructurefee, billingexchangerate: billingexchangerate, agentcontractedquantity: agentcontractedquantity, agentplancurrency: agentplancurrency, agentadditionalfee: agentadditionalfee, agenttotalfee: agenttotalfee, agentaddlimit: agentaddlimit, agentmode: agentmode, channelothercontractedquantity: channelothercontractedquantity, channelotheradditionalfee: channelotheradditionalfee, channelwhatsappcontractedquantity: channelwhatsappcontractedquantity, channelwhatsappadditionalfee: channelwhatsappadditionalfee, channelotherquantity: channelotherquantity, channelwhatsappquantity: channelwhatsappquantity, channeltotalfee: channeltotalfee, channelwhatsappfreequantity: channelwhatsappfreequantity, channeladdlimit: channeladdlimit, conversationuserplancurrency: conversationuserplancurrency, conversationuserserviceadditionalfee: conversationuserserviceadditionalfee, conversationuserservicevcafee: conversationuserservicevcafee, conversationusermetacurrency: conversationusermetacurrency, conversationuserservicefee: conversationuserservicefee, conversationuserservicetotalfee: conversationuserservicetotalfee, conversationbusinessplancurrency: conversationbusinessplancurrency, conversationbusinessutilityadditionalfee: conversationbusinessutilityadditionalfee, conversationbusinessauthenticationadditionalfee: conversationbusinessauthenticationadditionalfee, conversationbusinessmarketingadditionalfee: conversationbusinessmarketingadditionalfee, conversationbusinessutilityvcafee: conversationbusinessutilityvcafee, conversationbusinessauthenticationvcafee: conversationbusinessauthenticationvcafee, conversationbusinessmarketingvcafee: conversationbusinessmarketingvcafee, conversationbusinessmetacurrency: conversationbusinessmetacurrency, conversationbusinessutilitymetafee: conversationbusinessutilitymetafee, conversationbusinessauthenticationmetafee: conversationbusinessauthenticationmetafee, conversationbusinessmarketingmetafee: conversationbusinessmarketingmetafee, conversationbusinessutilitytotalfee: conversationbusinessutilitytotalfee, conversationbusinessauthenticationtotalfee: conversationbusinessauthenticationtotalfee, conversationbusinessmarketingtotalfee: conversationbusinessmarketingtotalfee, conversationplancurrency: conversationplancurrency, contactcalculatemode: contactcalculatemode, contactcountmode: contactcountmode, contactuniquelimit: contactuniquelimit, contactuniquequantity: contactuniquequantity, contactplancurrency: contactplancurrency, contactuniqueadditionalfee: contactuniqueadditionalfee, contactuniquefee: contactuniquefee, contactwhatsappquantity: contactwhatsappquantity, contactotherquantity: contactotherquantity, contactotheradditionalfee: contactotheradditionalfee, contactwhatsappadditionalfee: contactwhatsappadditionalfee, contactotherfee: contactotherfee, contactwhatsappfee: contactwhatsappfee, contactfee: contactfee, messagingplancurrency: messagingplancurrency, messagingsmsadditionalfee: messagingsmsadditionalfee, messagingsmsvcafee: messagingsmsvcafee, messagingsmsquantity: messagingsmsquantity, messagingsmsquantitylimit: messagingsmsquantitylimit, messagingsmstotalfee: messagingsmstotalfee, messagingmailadditionalfee: messagingmailadditionalfee, messagingmailvcafee: messagingmailvcafee, messagingmailquantity: messagingmailquantity, messagingmailquantitylimit: messagingmailquantitylimit, messagingmailtotalfee: messagingmailtotalfee, voicevcacomission: voicevcacomission, consultingplancurrency: consultingplancurrency, consultinghourtotal: consultinghourtotal, consultinghourquantity: consultinghourquantity, consultingcontractedfee: consultingcontractedfee, consultingextrafee: consultingextrafee, consultingtotalfee: consultingtotalfee, consultingprofile: consultingprofile, consultingadditionalfee: consultingadditionalfee, additionalservice01: additionalservice01, additionalservice01fee: additionalservice01fee, additionalservice02: additionalservice02, additionalservice02fee: additionalservice02fee, additionalservice03: additionalservice03, additionalservice03fee: additionalservice03fee, invoiceid: invoiceid, status: status, force: force }
    });
};
exports.getBillingPeriodSummarySel = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, year = _a.year, month = _a.month;
    return ({
        method: "UFN_BILLINGPERIOD_SUMMARYORG",
        key: "UFN_BILLINGPERIOD_SUMMARYORG",
        parameters: { corpid: corpid, orgid: corpid === 0 ? corpid : orgid, year: year, month: month, force: true }
    });
};
exports.getBillingPeriodSummarySelCorp = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, year = _a.year, month = _a.month;
    return ({
        method: "UFN_BILLINGPERIOD_SUMMARYCORP",
        key: "UFN_BILLINGPERIOD_SUMMARYCORP",
        parameters: { corpid: corpid, orgid: corpid === 0 ? corpid : orgid, year: year, month: month, force: true }
    });
};
exports.billingpersonreportsel = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, year = _a.year, month = _a.month;
    return ({
        method: "UFN_BILLING_REPORT_PERSON",
        key: "UFN_BILLING_REPORT_PERSON",
        parameters: { corpid: corpid, orgid: orgid, year: year, month: month }
    });
};
exports.billinguserreportsel = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, year = _a.year, month = _a.month;
    return ({
        method: "UFN_BILLING_REPORT_USER",
        key: "UFN_BILLING_REPORT_USER",
        parameters: { corpid: corpid, orgid: orgid, year: year, month: month }
    });
};
exports.getInputValidationSel = function (id) { return ({
    method: "UFN_INPUTVALIDATION_SEL",
    key: "UFN_INPUTVALIDATION_SEL",
    parameters: { id: id }
}); };
exports.inputValidationins = function (_a) {
    var id = _a.id, operation = _a.operation, description = _a.description, inputvalue = _a.inputvalue, type = _a.type, status = _a.status;
    return ({
        method: "UFN_INPUTVALIDATION_INS",
        key: "UFN_INPUTVALIDATION_INS",
        parameters: { id: id, operation: operation, description: description, inputvalue: inputvalue, type: type, status: status }
    });
};
exports.getRecordHSMList = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate;
    return ({
        method: "UFN_REPORT_SENTMESSAGES_LST",
        key: "UFN_REPORT_SENTMESSAGES_LST",
        parameters: {
            startdate: startdate, enddate: enddate,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getRecordHSMReport = function (_a) {
    var name = _a.name, from = _a.from, date = _a.date;
    return ({
        method: "UFN_REPORT_SENTMESSAGES_REPORT",
        key: "UFN_REPORT_SENTMESSAGES_REPORT",
        parameters: {
            date: date,
            name: name,
            from: from,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getRecordHSMGraphic = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, column = _a.column, summarization = _a.summarization;
    return ({
        method: "UFN_REPORT_SENTMESSAGES_GRAPHIC",
        key: "UFN_REPORT_SENTMESSAGES_GRAPHIC",
        parameters: {
            filters: {}, sorts: {},
            startdate: startdate, enddate: enddate, column: column, summarization: summarization,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getRecordVoicecallGraphic = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, column = _a.column, summarization = _a.summarization;
    return ({
        method: "UFN_REPORT_VOICECALL_GRAPHIC",
        key: "UFN_REPORT_VOICECALL_GRAPHIC",
        parameters: {
            filters: {}, sorts: {},
            startdate: startdate, enddate: enddate, column: column, summarization: summarization,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getDashboardTemplateSel = function (dashboardtemplateId) {
    if (dashboardtemplateId === void 0) { dashboardtemplateId = 0; }
    return ({
        method: "UFN_DASHBOARDTEMPLATE_SEL",
        key: "UFN_DASHBOARDTEMPLATE_SEL",
        parameters: {
            id: dashboardtemplateId,
            all: dashboardtemplateId === 0 || dashboardtemplateId === '0'
        }
    });
};
exports.getDashboardTemplateIns = function (parameters) { return ({
    method: "UFN_DASHBOARDTEMPLATE_INS",
    key: "UFN_DASHBOARDTEMPLATE_INS",
    parameters: parameters
}); };
exports.getBillingPeriodCalc = function (_a) {
    var corpid = _a.corpid, year = _a.year, month = _a.month;
    return ({
        method: "UFN_BILLINGPERIOD_CALC",
        key: "UFN_BILLINGPERIOD_CALC",
        parameters: {
            corpid: corpid, year: year, month: month,
            force: true
        }
    });
};
exports.getBusinessDocType = function () { return ({
    method: "UFN_BUSINESSDOCTYPE_SEL",
    key: "UFN_BUSINESSDOCTYPE_SEL",
    parameters: {}
}); };
exports.selInvoice = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, year = _a.year, month = _a.month, invoiceid = _a.invoiceid, currency = _a.currency, paymentstatus = _a.paymentstatus;
    return ({
        method: "UFN_INVOICE_SEL",
        key: "UFN_INVOICE_SEL",
        parameters: { corpid: corpid, orgid: orgid, year: year, month: month, invoiceid: invoiceid ? invoiceid : 0, currency: currency, paymentstatus: paymentstatus }
    });
};
exports.selInvoiceClient = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, year = _a.year, month = _a.month, invoiceid = _a.invoiceid, currency = _a.currency, paymentstatus = _a.paymentstatus;
    return ({
        method: "UFN_INVOICE_SELCLIENT",
        key: "UFN_INVOICE_SELCLIENT",
        parameters: { corpid: corpid, orgid: orgid, year: year, month: month, invoiceid: invoiceid ? invoiceid : 0, currency: currency, paymentstatus: paymentstatus }
    });
};
exports.deleteInvoice = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, invoiceid = _a.invoiceid;
    return ({
        method: "UFN_INVOICE_DELETE",
        key: "UFN_INVOICE_DELETE",
        parameters: { corpid: corpid, orgid: orgid, invoiceid: invoiceid }
    });
};
exports.getLeadTasgsSel = function () { return ({
    method: "UFN_LEAD_TAGSDISTINCT_SEL",
    key: "UFN_LEAD_TAGSDISTINCT_SEL",
    parameters: {}
}); };
exports.getHistoryStatusConversation = function (personid, conversationid, communicationchannelid) { return ({
    method: "UFN_CONVERSATIONSTATUS_SEL",
    key: "UFN_CONVERSATIONSTATUS_SEL",
    parameters: {
        personid: personid,
        conversationid: conversationid,
        communicationchannelid: communicationchannelid
    }
}); };
exports.getAnalyticsIA = function (conversationid) { return ({
    method: "UFN_CONVERSATION_SEL_ANALYTICS_V2",
    key: "UFN_CONVERSATION_SEL_ANALYTICS_V2",
    parameters: {
        conversationid: conversationid
    }
}); };
exports.selKPIManager = function (kpiid) {
    if (kpiid === void 0) { kpiid = 0; }
    return ({
        method: "UFN_KPI_SEL",
        key: "UFN_KPI_SEL",
        parameters: {
            kpiid: kpiid
        }
    });
};
exports.insKPIManager = function (_a) {
    var _b = _a.id, id = _b === void 0 ? 0 : _b, kpiname = _a.kpiname, description = _a.description, status = _a.status, type = _a.type, sqlselect = _a.sqlselect, sqlwhere = _a.sqlwhere, target = _a.target, cautionat = _a.cautionat, alertat = _a.alertat, taskperiod = _a.taskperiod, taskinterval = _a.taskinterval, taskstartdate = _a.taskstartdate, operation = _a.operation;
    return ({
        method: "UFN_KPI_INS",
        key: "UFN_KPI_INS",
        parameters: {
            id: id, kpiname: kpiname, description: description, status: status, type: type, sqlselect: sqlselect, sqlwhere: sqlwhere, target: target, cautionat: cautionat, alertat: alertat, taskperiod: taskperiod, taskinterval: taskinterval, taskstartdate: taskstartdate, operation: operation,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.duplicateKPIManager = function (kpiid) {
    if (kpiid === void 0) { kpiid = 0; }
    return ({
        method: "UFN_KPI_DUPLICATE",
        key: "UFN_KPI_DUPLICATE",
        parameters: {
            kpiid: kpiid
        }
    });
};
exports.selKPIManagerHistory = function (_a) {
    var kpiid = _a.kpiid, startdate = _a.startdate, enddate = _a.enddate;
    return ({
        method: "UFN_KPIHISTORY_SEL",
        key: "UFN_KPIHISTORY_SEL",
        parameters: {
            kpiid: kpiid,
            startdate: startdate,
            enddate: enddate,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.calcKPIManager = function (kpiid) {
    if (kpiid === void 0) { kpiid = 0; }
    return ({
        method: "UFN_KPI_CALC",
        key: "UFN_KPI_CALC",
        parameters: {
            kpiid: kpiid,
            task: false
        }
    });
};
exports.appsettingInvoiceSel = function () { return ({
    method: "UFN_APPSETTING_INVOICE_SEL",
    key: "UFN_APPSETTING_INVOICE_SEL",
    parameters: {}
}); };
exports.appsettingInvoiceIns = function (_a) {
    var ruc = _a.ruc, businessname = _a.businessname, tradename = _a.tradename, fiscaladdress = _a.fiscaladdress, ubigeo = _a.ubigeo, country = _a.country, emittertype = _a.emittertype, currency = _a.currency, invoiceserie = _a.invoiceserie, invoicecorrelative = _a.invoicecorrelative, annexcode = _a.annexcode, igv = _a.igv, printingformat = _a.printingformat, xmlversion = _a.xmlversion, ublversion = _a.ublversion, returnpdf = _a.returnpdf, returnxmlsunat = _a.returnxmlsunat, returnxml = _a.returnxml, invoiceprovider = _a.invoiceprovider, sunaturl = _a.sunaturl, token = _a.token, sunatusername = _a.sunatusername, paymentprovider = _a.paymentprovider, publickey = _a.publickey, privatekey = _a.privatekey, ticketserie = _a.ticketserie, ticketcorrelative = _a.ticketcorrelative, invoicecreditserie = _a.invoicecreditserie, invoicecreditcorrelative = _a.invoicecreditcorrelative, ticketcreditserie = _a.ticketcreditserie, ticketcreditcorrelative = _a.ticketcreditcorrelative, detraction = _a.detraction, detractioncode = _a.detractioncode, detractionaccount = _a.detractionaccount, operationcodeperu = _a.operationcodeperu, operationcodeother = _a.operationcodeother, culqiurl = _a.culqiurl, detractionminimum = _a.detractionminimum, culqiurlcardcreate = _a.culqiurlcardcreate, culqiurlclient = _a.culqiurlclient, culqiurltoken = _a.culqiurltoken, culqiurlcharge = _a.culqiurlcharge, culqiurlcardget = _a.culqiurlcardget, culqiurlcarddelete = _a.culqiurlcarddelete, location = _a.location, documenttype = _a.documenttype, status = _a.status, description = _a.description, id = _a.id, type = _a.type, operation = _a.operation;
    return ({
        method: "UFN_APPSETTING_INVOICE_UPDATE",
        key: "UFN_APPSETTING_INVOICE_UPDATE",
        parameters: { ruc: ruc, businessname: businessname, tradename: tradename, fiscaladdress: fiscaladdress, ubigeo: ubigeo, country: country, emittertype: emittertype, currency: currency, invoiceserie: invoiceserie, invoicecorrelative: invoicecorrelative, annexcode: annexcode, igv: igv, printingformat: printingformat, xmlversion: xmlversion, ublversion: ublversion, returnpdf: returnpdf, returnxmlsunat: returnxmlsunat, returnxml: returnxml, invoiceprovider: invoiceprovider, sunaturl: sunaturl, token: token, sunatusername: sunatusername, paymentprovider: paymentprovider, publickey: publickey, privatekey: privatekey, ticketserie: ticketserie, ticketcorrelative: ticketcorrelative, invoicecreditserie: invoicecreditserie, invoicecreditcorrelative: invoicecreditcorrelative, ticketcreditserie: ticketcreditserie, ticketcreditcorrelative: ticketcreditcorrelative, detraction: detraction, detractioncode: detractioncode, detractionaccount: detractionaccount, operationcodeperu: operationcodeperu, operationcodeother: operationcodeother, culqiurl: culqiurl, detractionminimum: detractionminimum, culqiurlcardcreate: culqiurlcardcreate, culqiurlclient: culqiurlclient, culqiurltoken: culqiurltoken, culqiurlcharge: culqiurlcharge, culqiurlcardget: culqiurlcardget, culqiurlcarddelete: culqiurlcarddelete, location: location, documenttype: documenttype, status: status, description: description, id: id, type: type, operation: operation }
    });
};
exports.appsettingInvoiceSelCombo = function () { return ({
    method: "UFN_APPSETTING_INVOICE_SEL_COMBO",
    key: "UFN_APPSETTING_INVOICE_SEL_COMBO",
    parameters: {}
}); };
/**bloquear o desbloquear personas de forma masiva */
exports.personcommunicationchannelUpdateLockedArrayIns = function (table) { return ({
    method: "UFN_PERSONCOMMUNICATIONCHANNEL_UPDATE_LOCKED_ARRAY",
    key: "UFN_PERSONCOMMUNICATIONCHANNEL_UPDATE_LOCKED_ARRAY",
    parameters: { table: JSON.stringify(table) }
}); };
exports.changeStatus = function (_a) {
    var conversationid = _a.conversationid, status = _a.status, obs = _a.obs, motive = _a.motive;
    return ({
        method: "UFN_CONVERSATION_CHANGESTATUS",
        key: "UFN_CONVERSATION_CHANGESTATUS",
        parameters: {
            conversationid: conversationid,
            status: status,
            obs: obs,
            type: motive
        }
    });
};
exports.getBillingPeriodCalcRefreshAll = function (year, month, corpid, orgid) { return ({
    method: "UFN_BILLINGPERIOD_CALC_REFRESHALL",
    key: "UFN_BILLINGPERIOD_CALC_REFRESHALL",
    parameters: {
        year: year,
        month: month,
        corpid: corpid,
        orgid: orgid
    }
}); };
exports.getBillingPeriodPartnerCalc = function (partnerid, year, month) { return ({
    method: "UFN_BILLINGPERIODPARTNER_CALC",
    key: "UFN_BILLINGPERIODPARTNER_CALC",
    parameters: {
        partnerid: partnerid,
        year: year,
        month: month
    }
}); };
exports.getTableOrigin = function () { return ({
    method: "UFN_REPORT_PERSONALIZED_ORIGIN_SEL",
    key: "UFN_REPORT_PERSONALIZED_ORIGIN_SEL",
    parameters: {}
}); };
exports.getColumnsOrigin = function (tablename) { return ({
    method: "UFN_REPORT_PERSONALIZED_COLUMNS_SEL",
    key: "UFN_REPORT_PERSONALIZED_COLUMNS_SEL",
    parameters: { tablename: tablename }
}); };
exports.getBillingMessagingSel = function (_a) {
    var year = _a.year, month = _a.month;
    return ({
        method: "UFN_BILLINGMESSAGING_SEL",
        key: "UFN_BILLINGMESSAGING_SEL",
        parameters: { year: year, month: month }
    });
};
exports.billingMessagingIns = function (_a) {
    var year = _a.year, month = _a.month, id = _a.id, pricepersms = _a.pricepersms, vcacomissionpersms = _a.vcacomissionpersms, pricepermail = _a.pricepermail, vcacomissionpermail = _a.vcacomissionpermail, description = _a.description, status = _a.status, type = _a.type, operation = _a.operation;
    return ({
        method: "UFN_BILLINGMESSAGING_INS",
        key: "UFN_BILLINGMESSAGING_INS",
        parameters: { year: year, month: month, id: id, pricepersms: pricepersms, vcacomissionpersms: vcacomissionpersms, pricepermail: pricepermail, vcacomissionpermail: vcacomissionpermail, description: description, status: status, type: type, operation: operation }
    });
};
exports.invoiceRefresh = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, invoiceid = _a.invoiceid, year = _a.year, month = _a.month;
    return ({
        method: "UFN_INVOICE_REFRESH",
        key: "UFN_INVOICE_REFRESH",
        parameters: { corpid: corpid, orgid: orgid, invoiceid: invoiceid, year: year, month: month }
    });
};
exports.getAdviserFilteredUserRol = function () { return ({
    method: "UFN_ADVISERSBYUSERID_SEL",
    key: "UFN_ADVISERSBYUSERID_SEL",
    parameters: {}
}); };
exports.getVariablesByOrg = function () { return ({
    method: "UFN_REPORT_PERSONALIZED_VARIABLE_SEL",
    key: "UFN_REPORT_PERSONALIZED_VARIABLE_SEL",
    parameters: {}
}); };
exports.getKpiSel = function () { return ({
    method: "UFN_KPI_LST",
    key: "UFN_KPI_LST",
    parameters: {}
}); };
exports.changePlan = function (paymentplancode) { return ({
    method: "UFN_CORP_PAYMENTPLAN_UPD",
    key: "UFN_CORP_PAYMENTPLAN_UPD",
    parameters: {
        paymentplancode: paymentplancode
    }
}); };
exports.cancelSuscription = function () { return ({
    method: "UFN_CORP_PAYMENTPLAN_CANCEL",
    key: "UFN_CORP_PAYMENTPLAN_CANCEL",
    parameters: {
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
}); };
exports.getMeasureUnit = function () { return ({
    method: "UFN_MEASUREUNIT_SEL",
    key: "UFN_MEASUREUNIT_SEL",
    parameters: {}
}); };
exports.getConversationsWhatsapp = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate;
    return ({
        method: "UFN_CONVERSATIONWHATSAPP_REPORT",
        key: "UFN_CONVERSATIONWHATSAPP_REPORT",
        parameters: {
            startdate: startdate, enddate: enddate,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getInvoiceDetail = function (corpid, orgid, invoiceid) { return ({
    method: "UFN_INVOICEDETAIL_SELBYINVOICEID",
    key: "UFN_INVOICEDETAIL_SELBYINVOICEID",
    parameters: { corpid: corpid, orgid: orgid, invoiceid: invoiceid }
}); };
exports.checkUserPaymentPlan = function () { return ({
    key: "UFN_USER_PAYMENTPLAN_CHECK",
    method: "UFN_USER_PAYMENTPLAN_CHECK",
    parameters: {}
}); };
exports.selBalanceData = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, balanceid = _a.balanceid, type = _a.type, operationtype = _a.operationtype, all = _a.all;
    return ({
        method: "UFN_BALANCE_SEL",
        key: "UFN_BALANCE_SEL",
        parameters: { corpid: corpid, orgid: orgid, balanceid: balanceid, type: type, operationtype: operationtype, all: all }
    });
};
exports.getBillingMessagingCurrent = function (year, month, country) { return ({
    method: "UFN_BILLINGMESSAGING_CURRENT",
    key: "UFN_BILLINGMESSAGING_CURRENT",
    parameters: {
        year: year,
        month: month,
        country: country
    }
}); };
exports.getBalanceSelSent = function (corpid, orgid, date, type, module, messagetemplateid) { return ({
    method: "UFN_BALANCE_SEL_SENT",
    key: "UFN_BALANCE_SEL_SENT",
    parameters: {
        corpid: corpid,
        orgid: orgid,
        date: date,
        type: type,
        module: module,
        messagetemplateid: messagetemplateid
    }
}); };
exports.getCorpSelVariant = function (corpid, orgid, username) { return ({
    method: "UFN_CORP_SEL",
    key: "UFN_CORP_SEL",
    parameters: {
        corpid: corpid,
        orgid: orgid,
        username: username,
        id: 0,
        all: true
    }
}); };
exports.billingReportConversationWhatsApp = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, year = _a.year, month = _a.month;
    return ({
        method: "UFN_BILLING_REPORT_CONVERSATIONWHATSAPP",
        key: "UFN_BILLING_REPORT_CONVERSATIONWHATSAPP",
        parameters: { corpid: corpid, orgid: orgid, year: year, month: month }
    });
};
exports.billingReportHsmHistory = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, year = _a.year, month = _a.month, type = _a.type;
    return ({
        method: "UFN_BILLING_REPORT_HSMHISTORY",
        key: "UFN_BILLING_REPORT_HSMHISTORY",
        parameters: { corpid: corpid, orgid: orgid, year: year, month: month, type: type }
    });
};
exports.billingReportConsulting = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, year = _a.year, month = _a.month;
    return ({
        method: "UFN_BILLING_REPORT_CONSULTING",
        key: "UFN_BILLING_REPORT_CONSULTING",
        parameters: { corpid: corpid, orgid: orgid, year: year, month: month }
    });
};
exports.selCalendar = function (id) {
    if (id === void 0) { id = 0; }
    return ({
        method: "UFN_CALENDAREVENT_SEL",
        key: "UFN_CALENDAREVENT_SEL",
        parameters: {
            id: id,
            all: id === 0
        }
    });
};
exports.selBookingCalendar = function (startdate, enddate, calendareventid) { return ({
    method: "UFN_CALENDARBOOKING_REPORT",
    key: "UFN_CALENDARBOOKING_REPORT",
    parameters: {
        startdate: startdate,
        enddate: enddate,
        calendareventid: calendareventid,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
}); };
exports.selBookingIntegrationSel = function (calendareventid) { return ({
    method: "UFN_CALENDAREVENT_INTEGRATION_SEL",
    key: "UFN_CALENDAREVENT_INTEGRATION_SEL",
    parameters: { calendareventid: calendareventid }
}); };
exports.calendarBookingCancel = function (_a) {
    var calendareventid = _a.calendareventid, id = _a.id, phone = _a.phone, name = _a.name, username = _a.username, email = _a.email, canceltype = _a.canceltype, cancelcomment = _a.cancelcomment, corpid = _a.corpid, orgid = _a.orgid, userid = _a.userid, otros = _a.otros;
    return ({
        method: "UFN_CALENDARBOOKING_CANCEL",
        key: "UFN_CALENDARBOOKING_CANCEL",
        phone: phone,
        name: name,
        email: email,
        parameters: {
            canceltype: canceltype,
            calendareventid: calendareventid,
            id: id,
            cancelcomment: cancelcomment,
            corpid: corpid,
            orgid: orgid,
            username: username,
            userid: userid,
            agentid: "",
            otros: otros
        }
    });
};
exports.calendarBookingCancel2 = function (_a) {
    var calendareventid = _a.calendareventid, id = _a.id, phone = _a.phone, name = _a.name, email = _a.email, canceltype = _a.canceltype, cancelcomment = _a.cancelcomment, corpid = _a.corpid, orgid = _a.orgid, otros = _a.otros;
    return ({
        method: "UFN_CALENDARBOOKING_CANCEL",
        key: "UFN_CALENDARBOOKING_CANCEL",
        phone: phone,
        name: name,
        email: email,
        parameters: {
            canceltype: canceltype,
            calendareventid: calendareventid,
            id: id,
            cancelcomment: cancelcomment,
            corpid: corpid,
            orgid: orgid,
            username: "",
            userid: 0,
            agentid: "",
            otros: otros
        }
    });
};
exports.calendarBookingSelOne = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, calendareventid = _a.calendareventid, id = _a.id;
    return ({
        method: "UFN_CALENDARBOOKING_SEL_ONE",
        key: "UFN_CALENDARBOOKING_SEL_ONE",
        parameters: {
            corpid: corpid, orgid: orgid, calendareventid: calendareventid, id: id,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.insCommentsBooking = function (parameters) { return ({
    method: "UFN_CALENDARYBOOKING_COMMENT",
    key: "UFN_CALENDARYBOOKING_COMMENT",
    parameters: parameters
}); };
exports.insCalendar = function (_a) {
    var _b = _a.id, id = _b === void 0 ? 0 : _b, description = _a.description, descriptionobject = _a.descriptionobject, status = _a.status, type = _a.type, code = _a.code, name = _a.name, locationtype = _a.locationtype, location = _a.location, eventlink = _a.eventlink, color = _a.color, notificationtype = _a.notificationtype, messagetemplateid = _a.messagetemplateid, daterange = _a.daterange, daysduration = _a.daysduration, startdate = _a.startdate, enddate = _a.enddate, timeduration = _a.timeduration, timeunit = _a.timeunit, maximumcapacity = _a.maximumcapacity, availability = _a.availability, timebeforeeventduration = _a.timebeforeeventduration, timebeforeeventunit = _a.timebeforeeventunit, timeaftereventduration = _a.timeaftereventduration, timeaftereventunit = _a.timeaftereventunit, increments = _a.increments, operation = _a.operation, reminderperiod = _a.reminderperiod, reminderfrecuency = _a.reminderfrecuency, reminderhsmmessage = _a.reminderhsmmessage, notificationmessageemail = _a.notificationmessageemail, messagetemplateidemail = _a.messagetemplateidemail, communicationchannelid = _a.communicationchannelid, notificationmessage = _a.notificationmessage, reminderenable = _a.reminderenable, remindertype = _a.remindertype, reminderhsmtemplateid = _a.reminderhsmtemplateid, remindermailmessage = _a.remindermailmessage, remindermailtemplateid = _a.remindermailtemplateid, reminderhsmcommunicationchannelid = _a.reminderhsmcommunicationchannelid, rescheduletype = _a.rescheduletype, rescheduletemplateidemail = _a.rescheduletemplateidemail, reschedulenotificationemail = _a.reschedulenotificationemail, rescheduletemplateidhsm = _a.rescheduletemplateidhsm, reschedulenotificationhsm = _a.reschedulenotificationhsm, reschedulecommunicationchannelid = _a.reschedulecommunicationchannelid, canceltype = _a.canceltype, canceltemplateidemail = _a.canceltemplateidemail, cancelnotificationemail = _a.cancelnotificationemail, canceltemplateidhsm = _a.canceltemplateidhsm, cancelnotificationhsm = _a.cancelnotificationhsm, cancelcommunicationchannelid = _a.cancelcommunicationchannelid, sendeventtype = _a.sendeventtype;
    return ({
        method: "UFN_CALENDAREVENT_INS",
        key: "UFN_CALENDAREVENT_INS",
        parameters: {
            id: id, description: description,
            descriptionobject: JSON.stringify(descriptionobject),
            status: status, type: type,
            code: code, name: name, locationtype: locationtype, location: location, eventlink: eventlink, color: color, notificationtype: notificationtype, messagetemplateid: messagetemplateid,
            daterange: daterange, daysduration: daysduration,
            daystype: "CALENDAR",
            startdate: startdate, enddate: enddate,
            timeduration: timeduration, timeunit: timeunit, maximumcapacity: maximumcapacity,
            availability: JSON.stringify(availability),
            timebeforeeventduration: timebeforeeventduration, timebeforeeventunit: timebeforeeventunit, timeaftereventduration: timeaftereventduration, timeaftereventunit: timeaftereventunit,
            increments: increments, reminderperiod: reminderperiod, reminderfrecuency: reminderfrecuency,
            reminderhsmtemplateid: reminderhsmtemplateid || 0,
            reminderhsmcommunicationchannelid: reminderhsmcommunicationchannelid,
            remindermailtemplateid: remindermailtemplateid || 0,
            reminderhsmmessage: reminderhsmmessage,
            operation: operation, notificationmessage: notificationmessage, reminderenable: reminderenable, remindertype: remindertype, remindermailmessage: remindermailmessage,
            communicationchannelid: communicationchannelid || 0,
            notificationmessageemail: notificationmessageemail,
            messagetemplateidemail: messagetemplateidemail,
            rescheduletype: rescheduletype, rescheduletemplateidemail: rescheduletemplateidemail, reschedulenotificationemail: reschedulenotificationemail, rescheduletemplateidhsm: rescheduletemplateidhsm, reschedulenotificationhsm: reschedulenotificationhsm, reschedulecommunicationchannelid: reschedulecommunicationchannelid,
            canceltype: canceltype, canceltemplateidemail: canceltemplateidemail, cancelnotificationemail: cancelnotificationemail, canceltemplateidhsm: canceltemplateidhsm, cancelnotificationhsm: cancelnotificationhsm, cancelcommunicationchannelid: cancelcommunicationchannelid,
            sendeventtype: sendeventtype
        }
    });
};
exports.getEventByCode = function (orgid, code, personid, calendarbookinguuid) {
    if (calendarbookinguuid === void 0) { calendarbookinguuid = ""; }
    return ({
        key: "QUERY_EVENT_BY_COsDE",
        method: calendarbookinguuid ? "QUERY_EVENT_BY_CODE_WITH_BOOKINGUUID" : "QUERY_EVENT_BY_CODE",
        parameters: {
            orgid: orgid, code: code, personid: personid, calendarbookinguuid: calendarbookinguuid
        }
    });
};
exports.validateCalendaryBooking = function (params) { return ({
    key: "UFN_CALENDARYBOOKING_SEL_DATETIME",
    method: "UFN_CALENDARYBOOKING_SEL_DATETIME",
    parameters: __assign(__assign({}, params), { offset: (new Date().getTimezoneOffset() / 60) * -1 })
}); };
exports.CalendaryBookingReport = function (_a) {
    var _b = _a.period, period = _b === void 0 ? "" : _b, startdate = _a.startdate, enddate = _a.enddate, take = _a.take, skip = _a.skip;
    return ({
        key: "UFN_CALENDARYBOOKING_REPORT",
        method: "UFN_CALENDARYBOOKING_REPORT",
        parameters: {
            period: period, startdate: startdate, enddate: enddate, take: take, skip: skip,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.insBookingCalendar = function (params) { return ({
    key: "UFN_CALENDARYBOOKING_INS",
    method: "UFN_CALENDARYBOOKING_INS",
    parameters: params
}); };
exports.getPersonFromBooking = function (params) { return ({
    key: "QUERY_GET_PERSON_FROM_BOOKING",
    method: "QUERY_GET_PERSON_FROM_BOOKING",
    parameters: params
}); };
exports.getPaginatedProductCatalog = function (_a) {
    var metacatalogid = _a.metacatalogid, enddate = _a.enddate, filters = _a.filters, skip = _a.skip, sorts = _a.sorts, startdate = _a.startdate, take = _a.take;
    return ({
        methodCollection: "UFN_PRODUCTCATALOG_SEL",
        methodCount: "UFN_PRODUCTCATALOG_TOTALRECORDS",
        parameters: {
            metacatalogid: metacatalogid, enddate: enddate, filters: filters,
            offset: (new Date().getTimezoneOffset() / 60) * -1, origin: "productcatalog",
            skip: skip, sorts: sorts, startdate: startdate, take: take
        }
    });
};
exports.getPaginatedReportVoiceCall = function (_a) {
    var skip = _a.skip, take = _a.take, filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate;
    return ({
        methodCollection: "UFN_REPORT_VOICECALL_SEL",
        methodCount: "UFN_REPORT_VOICECALL_TOTALRECORDS",
        parameters: {
            startdate: startdate,
            enddate: enddate,
            skip: skip,
            take: take,
            filters: filters,
            sorts: sorts,
            origin: "reportvoicecall",
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getProductCatalogSel = function (id, category) {
    if (id === void 0) { id = 0; }
    if (category === void 0) { category = ''; }
    return ({
        method: "UFN_PRODUCTCATALOG_SEL_NORMAL",
        parameters: { all: true, category: category, id: id }
    });
};
exports.getPostHistorySel = function (_a) {
    var _b = _a.status, status = _b === void 0 ? "" : _b, _c = _a.communicationchannelid, communicationchannelid = _c === void 0 ? 0 : _c, _d = _a.type, type = _d === void 0 ? "" : _d, _e = _a.publishtatus, publishtatus = _e === void 0 ? "" : _e, _f = _a.datestart, datestart = _f === void 0 ? null : _f, _g = _a.dateend, dateend = _g === void 0 ? null : _g;
    return ({
        method: "UFN_POSTHISTORY_SEL",
        parameters: {
            status: status,
            type: type,
            publishtatus: publishtatus,
            datestart: datestart,
            dateend: dateend,
            communicationchannelid: communicationchannelid
        }
    });
};
exports.postHistoryIns = function (_a) {
    var communicationchannelid = _a.communicationchannelid, communicationchanneltype = _a.communicationchanneltype, posthistoryid = _a.posthistoryid, status = _a.status, type = _a.type, publishdate = _a.publishdate, texttitle = _a.texttitle, textbody = _a.textbody, hashtag = _a.hashtag, sentiment = _a.sentiment, activity = _a.activity, mediatype = _a.mediatype, medialink = _a.medialink, operation = _a.operation;
    return ({
        method: "UFN_POSTHISTORY_INS",
        parameters: {
            communicationchannelid: communicationchannelid, communicationchanneltype: communicationchanneltype, posthistoryid: posthistoryid, status: status, type: type, publishdate: publishdate, texttitle: texttitle, textbody: textbody, hashtag: hashtag, sentiment: sentiment, activity: activity, mediatype: mediatype, medialink: medialink, operation: operation
        }
    });
};
exports.productCatalogIns = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, metacatalogid = _a.metacatalogid, id = _a.id, productid = _a.productid, retailerid = _a.retailerid, title = _a.title, description = _a.description, descriptionshort = _a.descriptionshort, availability = _a.availability, category = _a.category, condition = _a.condition, currency = _a.currency, price = _a.price, saleprice = _a.saleprice, link = _a.link, imagelink = _a.imagelink, additionalimagelink = _a.additionalimagelink, brand = _a.brand, color = _a.color, gender = _a.gender, material = _a.material, pattern = _a.pattern, size = _a.size, datestart = _a.datestart, datelaunch = _a.datelaunch, dateexpiration = _a.dateexpiration, labels = _a.labels, customlabel0 = _a.customlabel0, customlabel1 = _a.customlabel1, customlabel2 = _a.customlabel2, customlabel3 = _a.customlabel3, customlabel4 = _a.customlabel4, customnumber0 = _a.customnumber0, customnumber1 = _a.customnumber1, customnumber2 = _a.customnumber2, customnumber3 = _a.customnumber3, customnumber4 = _a.customnumber4, standardfeatures0 = _a.standardfeatures0, reviewstatus = _a.reviewstatus, reviewdescription = _a.reviewdescription, status = _a.status, type = _a.type, username = _a.username, operation = _a.operation;
    return ({
        method: "UFN_PRODUCTCATALOG_INS",
        key: "UFN_PRODUCTCATALOG_INS",
        parameters: {
            corpid: corpid, orgid: orgid, metacatalogid: metacatalogid, id: id, productid: productid, retailerid: retailerid, title: title, description: description, descriptionshort: descriptionshort, availability: availability, category: category, condition: condition, currency: currency, price: price, saleprice: saleprice, link: link, imagelink: imagelink, additionalimagelink: additionalimagelink, brand: brand, color: color, gender: gender, material: material, pattern: pattern, size: size, datestart: datestart, datelaunch: datelaunch, dateexpiration: dateexpiration, labels: labels, customlabel0: customlabel0, customlabel1: customlabel1, customlabel2: customlabel2, customlabel3: customlabel3, customlabel4: customlabel4, customnumber0: customnumber0, customnumber1: customnumber1, customnumber2: customnumber2, customnumber3: customnumber3, customnumber4: customnumber4, standardfeatures0: standardfeatures0, reviewstatus: reviewstatus, reviewdescription: reviewdescription, status: status, type: type, username: username, operation: operation
        }
    });
};
exports.listPaymentCard = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, id = _a.id;
    return ({
        method: "UFN_PAYMENTCARD_LST",
        key: "UFN_PAYMENTCARD_LST",
        parameters: { corpid: corpid, orgid: orgid, id: id }
    });
};
exports.paymentCardInsert = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, paymentcardid = _a.paymentcardid, cardnumber = _a.cardnumber, cardcode = _a.cardcode, firstname = _a.firstname, lastname = _a.lastname, mail = _a.mail, favorite = _a.favorite, clientcode = _a.clientcode, status = _a.status, type = _a.type, username = _a.username, phone = _a.phone;
    return ({
        method: "UFN_PAYMENTCARD_INS",
        key: "UFN_PAYMENTCARD_INS",
        parameters: {
            corpid: corpid,
            orgid: orgid,
            id: paymentcardid || 0,
            cardnumber: cardnumber,
            cardcode: cardcode,
            firstname: firstname,
            lastname: lastname,
            mail: mail,
            favorite: favorite,
            clientcode: clientcode,
            status: status,
            type: type,
            username: username,
            phone: phone,
            operation: paymentcardid ? 'UPDATE' : 'INSERT'
        }
    });
};
exports.conversationCallHold = function (_a) {
    var conversationid = _a.conversationid, holdtime = _a.holdtime;
    return ({
        method: "UFN_CONVERSATION_CALLHOLD",
        parameters: {
            conversationid: conversationid,
            holdtime: holdtime
        }
    });
};
exports.getInvoiceReportSummary = function (_a) {
    var year = _a.year, _b = _a.currency, currency = _b === void 0 ? '' : _b, _c = _a.location, location = _c === void 0 ? '' : _c;
    return ({
        method: "UFN_REPORT_INVOICE_SUMMARY_SEL",
        key: "UFN_REPORT_INVOICE_SUMMARY_SEL",
        parameters: {
            year: year, currency: currency, location: location,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getInvoiceReportDetail = function (_a) {
    var corpid = _a.corpid, year = _a.year, month = _a.month, currency = _a.currency;
    return ({
        method: "UFN_REPORT_INVOICE_DETAIL_SEL",
        key: "UFN_REPORT_INVOICE_DETAIL_SEL",
        parameters: {
            corpid: corpid, year: year, month: month, currency: currency,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getCurrencyList = function () { return ({
    method: "UFN_CURRENCY_SEL",
    key: "UFN_CURRENCY_SEL",
    parameters: {}
}); };
exports.getCityBillingList = function () { return ({
    method: "UFN_CITYBILLING_SEL",
    key: "UFN_CITYBILLING_SEL",
    parameters: {}
}); };
exports.conversationOutboundIns = function (_a) {
    var number = _a.number, communicationchannelid = _a.communicationchannelid, personcommunicationchannelowner = _a.personcommunicationchannelowner, interactiontype = _a.interactiontype, interactiontext = _a.interactiontext;
    return ({
        method: "UFN_CONVERSATION_OUTBOUND_INS",
        key: "UFN_CONVERSATION_OUTBOUND_INS",
        parameters: {
            personid: 0,
            personcommunicationchannel: number + "_VOXI",
            communicationchannelid: communicationchannelid,
            closetype: "",
            status: 'ASIGNADO',
            finishdate: false,
            handoff: false,
            usergroup: "",
            phone: number,
            extradata: "",
            lastreplydate: true,
            personlastreplydate: false,
            origin: "OUTBOUND",
            firstname: number,
            lastname: "",
            communicationchanneltype: "VOXI",
            interactiontype: interactiontype,
            interactiontext: interactiontext,
            personcommunicationchannelowner: personcommunicationchannelowner
        }
    });
};
exports.conversationOutboundValidate = function (_a) {
    var number = _a.number, communicationchannelid = _a.communicationchannelid;
    return ({
        method: "UFN_CONVERSATION_OUTBOUND_VALIDATE",
        key: "UFN_CONVERSATION_OUTBOUND_VALIDATE",
        parameters: {
            personcommunicationchannel: number + "_VOXI",
            communicationchannelid: communicationchannelid
        }
    });
};
exports.conversationSupervisionStatus = function (_a) {
    var conversationid = _a.conversationid, status = _a.status, type = _a.type;
    return ({
        method: "UFN_CONVERSATION_SUPERVISIONSTATUS",
        key: "UFN_CONVERSATION_SUPERVISIONSTATUS",
        parameters: {
            conversationid: conversationid,
            status: status,
            type: type
        }
    });
};
exports.conversationTransferStatus = function (_a) {
    var conversationid = _a.conversationid, status = _a.status, type = _a.type;
    return ({
        method: "UFN_CONVERSATION_TRANSFERSTATUS",
        key: "UFN_CONVERSATION_TRANSFERSTATUS",
        parameters: {
            conversationid: conversationid,
            status: status,
            type: type
        }
    });
};
exports.conversationCloseUpd = function (_a) {
    var communicationchannelid = _a.communicationchannelid, personid = _a.personid, personcommunicationchannel = _a.personcommunicationchannel, conversationid = _a.conversationid, motive = _a.motive, obs = _a.obs;
    return ({
        method: "UFN_CONVERSATION_CLOSE_UPD",
        key: "UFN_CONVERSATION_CLOSE_UPD",
        parameters: {
            communicationchannelid: communicationchannelid,
            personid: personid,
            personcommunicationchannel: personcommunicationchannel,
            conversationid: conversationid,
            motive: motive,
            obs: obs
        }
    });
};
exports.getAdvisorListVoxi = function () { return ({
    method: "UFN_PERSONCOMMUNICATIONCHANNEL_SEL_VOXI",
    key: "UFN_PERSONCOMMUNICATIONCHANNEL_SEL_VOXI",
    parameters: {}
}); };
exports.getUserAsesorByOrgID = function () { return ({
    method: "UFN_USER_ASESORBYORGID_LST",
    key: "UFN_USER_ASESORBYORGID_LST",
    parameters: {}
}); };
exports.getDisconnectionTimes = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, asesorid = _a.asesorid, supervisorid = _a.supervisorid, groups = _a.groups;
    return ({
        method: "UFN_DASHBOARD_DICONNECTIONTIMES_SEL",
        key: "UFN_DASHBOARD_DICONNECTIONTIMES_SEL",
        parameters: {
            startdate: startdate,
            enddate: enddate,
            asesorid: asesorid,
            supervisorid: supervisorid,
            groups: groups,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.ufnlinkPersons = function (_a) {
    var personidfrom = _a.personidfrom, personidto = _a.personidto, imageurl = _a.imageurl, lastname = _a.lastname, name = _a.name, firstname = _a.firstname, documenttype = _a.documenttype, documentnumber = _a.documentnumber, persontype = _a.persontype, birthday = _a.birthday, gender = _a.gender, phone = _a.phone, alternativephone = _a.alternativephone, observation = _a.observation, email = _a.email, alternativeemail = _a.alternativeemail, civilstatus = _a.civilstatus, occupation = _a.occupation, educationlevel = _a.educationlevel, address = _a.address, healthprofessional = _a.healthprofessional, referralchannel = _a.referralchannel;
    return ({
        method: "UFN_CONVERSATION_LINKEDPERSON_EXECUTE",
        key: "UFN_CONVERSATION_LINKEDPERSON_EXECUTE",
        parameters: {
            personidfrom: personidfrom,
            personidto: personidto,
            imageurl: imageurl || "",
            name: name || "",
            firstname: firstname || "",
            observation: observation || "",
            lastname: lastname || "",
            documenttype: documenttype || "",
            documentnumber: documentnumber || "",
            persontype: persontype || "",
            birthday: birthday || "",
            gender: gender || "",
            phone: phone || "",
            alternativephone: alternativephone || "",
            email: email || "",
            alternativeemail: alternativeemail || "",
            civilstatus: civilstatus || "",
            occupation: occupation || "",
            educationlevel: educationlevel || "",
            groups: "",
            address: address || "",
            healthprofessional: healthprofessional || "",
            referralchannel: referralchannel || ""
        }
    });
};
exports.unLinkPerson = function (_a) {
    var personid = _a.personid, personcommunicationchannel = _a.personcommunicationchannel;
    return ({
        method: "UFN_CONVERSATION_UNLINKPERSON_EXECUTE",
        key: "UFN_CONVERSATION_UNLINKPERSON_EXECUTE",
        parameters: {
            personid: personid, personcommunicationchannel: personcommunicationchannel
        }
    });
};
exports.getDisconnectionDataTimes = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate, asesorid = _a.asesorid, supervisorid = _a.supervisorid;
    return ({
        method: "UFN_DASHBOARD_DISCONNECTIONTIMES_DATA_SEL",
        key: "UFN_DASHBOARD_DISCONNECTIONTIMES_DATA_SEL",
        parameters: {
            startdate: startdate,
            enddate: enddate,
            asesorid: asesorid,
            supervisorid: supervisorid,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
//getPaginatedTicket
exports.getasesorvsticketsSel = function (_a) {
    var skip = _a.skip, take = _a.take, filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate;
    return ({
        methodCollection: "UFN_REPORT_ASESOR_VS_TICKET_SEL",
        methodCount: "UFN_REPORT_ASESOR_VS_TICKET_TOTALRECORDS",
        parameters: {
            startdate: startdate,
            enddate: enddate,
            skip: skip,
            take: take,
            filters: filters,
            sorts: sorts,
            origin: "ticketvsadviser",
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getreportrequestSD = function (_a) {
    var skip = _a.skip, take = _a.take, filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate, channeltype = _a.channeltype, company = _a.company;
    return ({
        methodCollection: "UFN_REPORT_REQUESTSD_SEL",
        methodCount: "UFN_REPORT_REQUESTSD_TOTALRECORDS",
        parameters: {
            startdate: startdate,
            enddate: enddate,
            channeltype: channeltype,
            skip: skip,
            take: take,
            filters: filters,
            sorts: sorts,
            company: company,
            origin: "reportrequestsd",
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getreportleadgridtracking = function (_a) {
    var skip = _a.skip, take = _a.take, filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate;
    return ({
        methodCollection: "UFN_LEADGRID_TRACKING_SEL",
        methodCount: "UFN_LEADGRID_TRACKING_TOTALRECORDS",
        parameters: {
            startdate: startdate,
            enddate: enddate,
            skip: skip,
            take: take,
            filters: filters,
            sorts: sorts,
            origin: "leadgridtracking",
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getRequestSDExport = function (_a) {
    var filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate, channeltype = _a.channeltype, company = _a.company;
    return ({
        method: "UFN_REPORT_REQUESTSD_EXPORT",
        key: "UFN_REPORT_REQUESTSD_EXPORT",
        parameters: {
            origin: "reportrequestsd",
            filters: filters,
            startdate: startdate,
            enddate: enddate,
            channeltype: channeltype,
            company: company,
            sorts: sorts,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getleadgridtrackingExport = function (_a) {
    var filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate;
    return ({
        method: "UFN_LEADGRID_TRACKING_EXPORT",
        key: "UFN_LEADGRID_TRACKING_EXPORT",
        parameters: {
            origin: "reportrequestsd",
            filters: filters,
            startdate: startdate,
            enddate: enddate,
            sorts: sorts,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getComplianceSLAExport = function (_a) {
    var filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate, company = _a.company;
    return ({
        method: "UFN_REPORT_COMPLIANCESLA_EXPORT",
        key: "UFN_REPORT_COMPLIANCESLA_EXPORT",
        parameters: {
            origin: "reportcompliancesla",
            filters: filters,
            startdate: startdate,
            enddate: enddate,
            company: company,
            sorts: sorts,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getcomplianceSLA = function (_a) {
    var skip = _a.skip, take = _a.take, filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate, company = _a.company;
    return ({
        methodCollection: "UFN_REPORT_COMPLIANCESLA_SEL",
        methodCount: "UFN_REPORT_COMPLIANCESLA_TOTALRECORDS",
        parameters: {
            startdate: startdate,
            enddate: enddate,
            skip: skip,
            take: take,
            filters: filters,
            sorts: sorts,
            company: company,
            origin: "reportcompliancesla",
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getTicketvsAdviserExport = function (_a) {
    var filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate;
    return ({
        method: "UFN_REPORT_ASESOR_VS_TICKET_EXPORT",
        key: "UFN_REPORT_ASESOR_VS_TICKET_EXPORT",
        parameters: {
            origin: "ticketvsadviser",
            filters: filters,
            startdate: startdate,
            enddate: enddate,
            sorts: sorts,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getVoiceCallReportExport = function (_a) {
    var filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate;
    return ({
        method: "UFN_REPORT_VOICECALL_EXPORT",
        key: "UFN_REPORT_VOICECALL_EXPORT",
        parameters: {
            origin: "voicecall",
            filters: filters,
            startdate: startdate,
            enddate: enddate,
            sorts: sorts,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getHSMHistoryList = function (_a) {
    var startdate = _a.startdate, enddate = _a.enddate;
    return ({
        method: "UFN_HSMHISTORY_LST",
        key: "UFN_HSMHISTORY_LST",
        parameters: {
            startdate: startdate, enddate: enddate,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getUniqueContactsSel = function (_a) {
    var year = _a.year, channeltype = _a.channeltype;
    return ({
        method: "UFN_REPORT_UNIQUECONTACTS_SEL",
        key: "UFN_REPORT_UNIQUECONTACTS_SEL",
        parameters: {
            year: year, channeltype: channeltype,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getHSMHistoryReport = function (_a) {
    var _b = _a.campaign, campaign = _b === void 0 ? "" : _b, date = _a.date;
    return ({
        method: "UFN_HSMHISTORY_REPORT",
        key: "UFN_HSMHISTORY_REPORT",
        parameters: {
            date: date,
            campaignname: campaign,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getHSMHistoryReportExport = function (table) { return ({
    method: "UFN_HSMHISTORY_REPORT_EXPORT",
    key: "UFN_HSMHISTORY_REPORT_EXPORT",
    parameters: {
        origin: "hsmreport",
        table: JSON.stringify(table),
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
}); };
exports.getPropertiesIncludingName = function (propertyname) { return ({
    method: "UFN_PROPERTY_SEL_BY_INCLUDE_NAME",
    key: "UFN_PROPERTY_SEL_BY_INCLUDE_NAME",
    parameters: {
        propertyname: propertyname
    }
}); };
exports.deleteClassificationTree = function (id) { return ({
    method: "UFN_CLASSIFICATION_DEL",
    key: "UFN_CLASSIFICATION_DEL",
    parameters: {
        id: id
    }
}); };
exports.selCommunicationChannelWhatsApp = function () { return ({
    method: "UFN_COMMUNICATIONCHANNEL_SEL_WHATSAPP",
    key: "UFN_COMMUNICATIONCHANNEL_SEL_WHATSAPP",
    parameters: {}
}); };
exports.getPaginatedLocation = function (_a) {
    var skip = _a.skip, take = _a.take, filters = _a.filters, sorts = _a.sorts, _b = _a.locationid, locationid = _b === void 0 ? "" : _b;
    return ({
        methodCollection: "UFN_LOCATION_SEL",
        methodCount: "UFN_LOCATION_TOTALRECORDS",
        parameters: {
            skip: skip,
            take: take,
            filters: filters,
            sorts: sorts,
            locationid: locationid,
            origin: "location",
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getLocationExport = function (_a) {
    var filters = _a.filters, sorts = _a.sorts;
    return ({
        method: "UFN_LOCATION_EXPORT",
        key: "UFN_LOCATION_EXPORT",
        parameters: {
            origin: "location",
            filters: filters,
            sorts: sorts,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getMessageTemplateExport = function (_a) {
    var filters = _a.filters, sorts = _a.sorts, communicationchannelid = _a.communicationchannelid;
    return ({
        method: "UFN_MESSAGETEMPLATE_EXPORT",
        key: "UFN_MESSAGETEMPLATE_EXPORT",
        parameters: {
            origin: "messagetemplate",
            communicationchannelid: communicationchannelid,
            filters: filters,
            sorts: sorts,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.locationIns = function (_a) {
    var id = _a.id, operation = _a.operation, name = _a.name, address = _a.address, district = _a.district, city = _a.city, country = _a.country, schedule = _a.schedule, phone = _a.phone, alternativephone = _a.alternativephone, email = _a.email, alternativeemail = _a.alternativeemail, latitude = _a.latitude, longitude = _a.longitude, googleurl = _a.googleurl, description = _a.description, status = _a.status, type = _a.type, username = _a.username;
    return ({
        method: "UFN_LOCATION_INS",
        key: "UFN_LOCATION_INS",
        parameters: {
            id: id, operation: operation, name: name, address: address, district: district, city: city, country: country, schedule: schedule, phone: phone, alternativephone: alternativephone, email: email, alternativeemail: alternativeemail, latitude: latitude, longitude: longitude, googleurl: googleurl, description: description, status: status, type: type, username: username
        }
    });
};
exports.getReportKpiOperativoSel = function (_a) {
    var date = _a.date, allParameters = __rest(_a, ["date"]);
    return ({
        method: "UFN_REPORT_KPI_OPERATIVO_SEL",
        key: "UFN_REPORT_KPI_OPERATIVO_SEL",
        parameters: __assign(__assign({ origin: "kpioperativo", date: date }, allParameters), { usergroup: allParameters['usergroup'] ? allParameters['usergroup'] : "", offset: (new Date().getTimezoneOffset() / 60) * -1 })
    });
};
exports.insInvoiceComment = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, invoiceid = _a.invoiceid, invoicecommentid = _a.invoicecommentid, description = _a.description, status = _a.status, type = _a.type, username = _a.username, commentcontent = _a.commentcontent, commenttype = _a.commenttype, commentcaption = _a.commentcaption;
    return ({
        method: "UFN_INVOICECOMMENT_INS",
        key: "UFN_INVOICECOMMENT_INS",
        parameters: { corpid: corpid, orgid: orgid, invoiceid: invoiceid, invoicecommentid: invoicecommentid, description: description, status: status, type: type, username: username, commentcontent: commentcontent, commenttype: commenttype, commentcaption: commentcaption }
    });
};
exports.selInvoiceComment = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, invoiceid = _a.invoiceid, invoicecommentid = _a.invoicecommentid;
    return ({
        method: "UFN_INVOICECOMMENT_SEL",
        key: "UFN_INVOICECOMMENT_SEL",
        parameters: { corpid: corpid, orgid: orgid, invoiceid: invoiceid, invoicecommentid: invoicecommentid }
    });
};
exports.selIntent = function () { return ({
    method: "UFN_WITAI_INTENT_SEL",
    key: "UFN_WITAI_INTENT_SEL",
    parameters: {}
}); };
exports.selUtterance = function (intent) { return ({
    method: "UFN_WITAI_UTTERANCE_SEL",
    key: "UFN_WITAI_UTTERANCE_SEL",
    parameters: { intent: intent }
}); };
exports.selEntities = function () { return ({
    method: "UFN_WITAI_ENTITY_SEL",
    key: "UFN_WITAI_ENTITY_SEL",
    parameters: {}
}); };
exports.insertutterance = function (_a) {
    var name = _a.name, description = _a.description, datajson = _a.datajson, utterance_datajson = _a.utterance_datajson, operation = _a.operation;
    return ({
        method: "UFN_WITAI_INTENT_UTTERANCE_INS",
        key: "UFN_WITAI_INTENT_UTTERANCE_INS",
        parameters: { name: name, description: description, datajson: datajson, utterance_datajson: utterance_datajson, operation: operation }
    });
};
exports.insertentity = function (_a) {
    var name = _a.name, datajson = _a.datajson, operation = _a.operation;
    return ({
        method: "UFN_WITAI_ENTITY_INS",
        key: "UFN_WITAI_ENTITY_INS",
        parameters: { name: name, datajson: datajson, operation: operation }
    });
};
exports.utterancedelete = function (_a) {
    var table = _a.table;
    return ({
        method: "UFN_WITUFN_WITAI_INTENT_UTTERANCE_DEL",
        key: "UFN_WITUFN_WITAI_INTENT_UTTERANCE_DEL",
        parameters: { table: table, model: "" }
    });
};
exports.entitydelete = function (_a) {
    var table = _a.table;
    return ({
        method: "UFN_WITAI_ENTITY_DEL",
        key: "UFN_WITAI_ENTITY_DEL",
        parameters: { table: table, model: "" }
    });
};
exports.getChatflowVariableSel = function () { return ({
    method: "UFN_CHATFLOW_VARIABLE_SEL",
    parameters: {}
}); };
exports.artificialIntelligencePlanIns = function (_a) {
    var freeinteractions = _a.freeinteractions, basicfee = _a.basicfee, additionalfee = _a.additionalfee, description = _a.description, operation = _a.operation;
    return ({
        method: "UFN_ARTIFICIALINTELLIGENCEPLAN_INS",
        key: "UFN_ARTIFICIALINTELLIGENCEPLAN_INS",
        parameters: { freeinteractions: freeinteractions, basicfee: basicfee, additionalfee: additionalfee, description: description, operation: operation }
    });
};
exports.artificialIntelligencePlanSel = function (_a) {
    var description = _a.description;
    return ({
        method: "UFN_ARTIFICIALINTELLIGENCEPLAN_SEL",
        key: "UFN_ARTIFICIALINTELLIGENCEPLAN_SEL",
        parameters: { description: description }
    });
};
exports.artificialIntelligenceServiceIns = function (_a) {
    var provider = _a.provider, service = _a.service, type = _a.type, description = _a.description, measureunit = _a.measureunit, charlimit = _a.charlimit, operation = _a.operation;
    return ({
        method: "UFN_ARTIFICIALINTELLIGENCESERVICE_INS",
        key: "UFN_ARTIFICIALINTELLIGENCESERVICE_INS",
        parameters: { provider: provider, service: service, type: type, description: description, measureunit: measureunit, charlimit: charlimit, operation: operation }
    });
};
exports.artificialIntelligenceServiceSel = function (_a) {
    var provider = _a.provider, service = _a.service;
    return ({
        method: "UFN_ARTIFICIALINTELLIGENCESERVICE_SEL",
        key: "UFN_ARTIFICIALINTELLIGENCESERVICE_SEL",
        parameters: { provider: provider, service: service }
    });
};
exports.billingArtificialIntelligenceIns = function (_a) {
    var year = _a.year, month = _a.month, id = _a.id, provider = _a.provider, measureunit = _a.measureunit, charlimit = _a.charlimit, plan = _a.plan, freeinteractions = _a.freeinteractions, basicfee = _a.basicfee, additionalfee = _a.additionalfee, description = _a.description, status = _a.status, type = _a.type, username = _a.username, operation = _a.operation;
    return ({
        method: "UFN_BILLINGARTIFICIALINTELLIGENCE_INS",
        key: "UFN_BILLINGARTIFICIALINTELLIGENCE_INS",
        parameters: { year: year, month: month, id: id, provider: provider, measureunit: measureunit, charlimit: charlimit, plan: plan, freeinteractions: freeinteractions, basicfee: basicfee, additionalfee: additionalfee, description: description, status: status, type: type, username: username, operation: operation }
    });
};
exports.billingArtificialIntelligenceSel = function (_a) {
    var year = _a.year, month = _a.month, provider = _a.provider, type = _a.type, plan = _a.plan;
    return ({
        method: "UFN_BILLINGARTIFICIALINTELLIGENCE_SEL",
        key: "UFN_BILLINGARTIFICIALINTELLIGENCE_SEL",
        parameters: { year: year, month: month, provider: provider, type: type, plan: plan }
    });
};
exports.billingPeriodArtificialIntelligenceSel = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, year = _a.year, month = _a.month, provider = _a.provider, type = _a.type, plan = _a.plan, userid = _a.userid;
    return ({
        method: "UFN_BILLINGPERIODARTIFICIALINTELLIGENCE_SEL",
        key: "UFN_BILLINGPERIODARTIFICIALINTELLIGENCE_SEL",
        parameters: { corpid: corpid, orgid: orgid, year: year, month: month, provider: provider, type: type, plan: plan, userid: userid }
    });
};
exports.billingPeriodArtificialIntelligenceInsArray = function (corpid, orgid, table) { return ({
    method: "UFN_BILLINGPERIODARTIFICIALINTELLIGENCE_INS_ARRAY",
    parameters: {
        corpid: corpid,
        orgid: orgid,
        table: JSON.stringify(table)
    }
}); };
exports.exportintent = function (_a) {
    var name_json = _a.name_json;
    return ({
        method: "UFN_WITAI_INTENT_EXPORT",
        key: "UFN_WITAI_INTENT_EXPORT",
        parameters: { name_json: name_json }
    });
};
exports.productCatalogInsArray = function (metacatalogid, table, username) { return ({
    method: "UFN_PRODUCTCATALOG_INS_ARRAY",
    parameters: { metacatalogid: metacatalogid, table: JSON.stringify(table), username: username }
}); };
exports.productCatalogUpdArray = function (table, username) { return ({
    method: "UFN_PRODUCTCATALOG_UPD_ARRAY",
    parameters: { table: JSON.stringify(table), username: username }
}); };
exports.paymentOrderSel = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, conversationid = _a.conversationid, personid = _a.personid, paymentorderid = _a.paymentorderid, ordercode = _a.ordercode;
    return ({
        method: "UFN_PAYMENTORDER_SEL",
        key: "UFN_PAYMENTORDER_SEL",
        parameters: { corpid: corpid, orgid: orgid, conversationid: conversationid, personid: personid, paymentorderid: paymentorderid, ordercode: ordercode }
    });
};
exports.metaCatalogIns = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, metabusinessid = _a.metabusinessid, id = _a.id, catalogid = _a.catalogid, catalogname = _a.catalogname, catalogdescription = _a.catalogdescription, catalogtype = _a.catalogtype, description = _a.description, status = _a.status, type = _a.type, haslink = _a.haslink, username = _a.username, operation = _a.operation;
    return ({
        method: "UFN_METACATALOG_INS",
        key: "UFN_METACATALOG_INS",
        parameters: { corpid: corpid, orgid: orgid, metabusinessid: metabusinessid, id: id, catalogid: catalogid, catalogname: catalogname, catalogdescription: catalogdescription, catalogtype: catalogtype, description: description, status: status, type: type, haslink: haslink, username: username, operation: operation }
    });
};
exports.metaCatalogSel = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, metabusinessid = _a.metabusinessid, id = _a.id;
    return ({
        method: "UFN_METACATALOG_SEL",
        key: "UFN_METACATALOG_SEL",
        parameters: { corpid: corpid, orgid: orgid, metabusinessid: metabusinessid, id: id }
    });
};
exports.metaBusinessIns = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, id = _a.id, businessid = _a.businessid, businessname = _a.businessname, accesstoken = _a.accesstoken, userid = _a.userid, graphdomain = _a.graphdomain, description = _a.description, status = _a.status, type = _a.type, username = _a.username, operation = _a.operation;
    return ({
        method: "UFN_METABUSINESS_INS",
        key: "UFN_METABUSINESS_INS",
        parameters: { corpid: corpid, orgid: orgid, id: id, businessid: businessid, businessname: businessname, accesstoken: accesstoken, userid: userid, graphdomain: graphdomain, description: description, status: status, type: type, username: username, operation: operation }
    });
};
exports.metaBusinessSel = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, id = _a.id;
    return ({
        method: "UFN_METABUSINESS_SEL",
        key: "UFN_METABUSINESS_SEL",
        parameters: { corpid: corpid, orgid: orgid, id: id }
    });
};
exports.productOrderList = function () { return ({
    method: "UFN_ORDERLINE_PRODUCT_LST",
    key: "UFN_ORDERLINE_PRODUCT_LST",
    parameters: {}
}); };
exports.timeSheetIns = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, id = _a.id, description = _a.description, type = _a.type, status = _a.status, username = _a.username, operation = _a.operation, startdate = _a.startdate, startuserid = _a.startuserid, registerdate = _a.registerdate, registeruserid = _a.registeruserid, registerprofile = _a.registerprofile, registerdetail = _a.registerdetail, timeduration = _a.timeduration;
    return ({
        method: "UFN_TIMESHEET_INS",
        key: "UFN_TIMESHEET_INS",
        parameters: { corpid: corpid, orgid: orgid, id: id, description: description, type: type, status: status, username: username, operation: operation, startdate: startdate, startuserid: startuserid, registerdate: registerdate, registeruserid: registeruserid, registerprofile: registerprofile, registerdetail: registerdetail, timeduration: timeduration }
    });
};
exports.timeSheetSel = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, timesheetid = _a.timesheetid, startdate = _a.startdate, all = _a.all;
    return ({
        method: "UFN_TIMESHEET_SEL",
        key: "UFN_TIMESHEET_SEL",
        parameters: { corpid: corpid, orgid: orgid, timesheetid: timesheetid, startdate: startdate, all: all }
    });
};
exports.timeSheetUserSel = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid;
    return ({
        method: "UFN_TIMESHEET_USER_SEL",
        key: "UFN_TIMESHEET_USER_SEL",
        parameters: { corpid: corpid, orgid: orgid }
    });
};
exports.timeSheetProfileSel = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, startdate = _a.startdate;
    return ({
        method: "UFN_TIMESHEET_PROFILE_SEL",
        key: "UFN_TIMESHEET_PROFILE_SEL",
        parameters: { corpid: corpid, orgid: orgid, startdate: startdate }
    });
};
exports.timeSheetPeriodSel = function (_a) {
    var corpid = _a.corpid, orgid = _a.orgid, year = _a.year, month = _a.month;
    return ({
        method: "UFN_TIMESHEET_PERIOD_SEL",
        key: "UFN_TIMESHEET_PERIOD_SEL",
        parameters: { corpid: corpid, orgid: orgid, year: year, month: month }
    });
};
exports.currencySel = function () { return ({
    method: "UFN_CURRENCY_SEL",
    key: "UFN_CURRENCY_SEL",
    parameters: {}
}); };
exports.rasaIntentSel = function (rasaid) { return ({
    method: "UFN_RASA_INTENT_SEL",
    key: "UFN_RASA_INTENT_SEL",
    parameters: { rasaid: rasaid }
}); };
exports.rasaIntentIns = function (_a) {
    var id = _a.id, rasaid = _a.rasaid, intent_name = _a.intent_name, intent_description = _a.intent_description, intent_examples = _a.intent_examples, entities = _a.entities, entity_examples = _a.entity_examples, entity_values = _a.entity_values, status = _a.status, operation = _a.operation;
    return ({
        method: "UFN_RASA_INTENT_INS",
        key: "UFN_RASA_INTENT_INS",
        parameters: { id: id, rasaid: rasaid, intent_name: intent_name, intent_description: intent_description, intent_examples: JSON.stringify(intent_examples), entities: entities, entity_examples: entity_examples, entity_values: entity_values, status: status, operation: operation }
    });
};
exports.rasaSynonimSel = function (rasaid) { return ({
    method: "UFN_RASA_SYNONYM_SEL",
    key: "UFN_RASA_SYNONYM_SEL",
    parameters: { rasaid: rasaid }
}); };
exports.rasaSynonimIns = function (_a) {
    var id = _a.id, rasaid = _a.rasaid, description = _a.description, examples = _a.examples, values = _a.values, status = _a.status, operation = _a.operation;
    return ({
        method: "UFN_RASA_SYNONYM_INS",
        key: "UFN_RASA_SYNONYM_INS",
        parameters: { id: id, rasaid: rasaid, description: description, examples: examples, values: values, status: status, operation: operation }
    });
};
exports.rasaModelSel = function () { return ({
    method: "UFN_RASA_MODEL_SEL",
    key: "UFN_RASA_MODEL_SEL",
    parameters: {}
}); };
exports.getPaginatedProducts = function (_a) {
    var skip = _a.skip, take = _a.take, filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate;
    return ({
        methodCollection: "UFN_PRODUCT_PAG",
        methodCount: "UFN_PRODUCT_TOTALRECORDS",
        parameters: {
            startdate: startdate,
            enddate: enddate,
            skip: skip,
            take: take,
            filters: filters,
            sorts: sorts,
            origin: "product",
            productid: 0,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.insProduct = function (_a) {
    var productid = _a.productid, description = _a.description, descriptionlarge = _a.descriptionlarge, producttype = _a.producttype, familyid = _a.familyid, unitbuyid = _a.unitbuyid, unitdispatchid = _a.unitdispatchid, imagereference = _a.imagereference, status = _a.status, type = _a.type, attachments = _a.attachments, productcode = _a.productcode, loteid = _a.loteid, subfamilyid = _a.subfamilyid, operation = _a.operation;
    return ({
        method: "UFN_PRODUCT_INS",
        key: "UFN_PRODUCT_INS",
        parameters: { productid: productid, description: description, descriptionlarge: descriptionlarge, producttype: producttype, familyid: familyid, unitbuyid: unitbuyid, unitdispatchid: unitdispatchid, imagereference: imagereference, status: status, type: type, attachments: attachments, productcode: productcode, loteid: loteid, subfamilyid: subfamilyid, operation: operation }
    });
};
exports.insWarehouse = function (_a) {
    var warehouseid = _a.warehouseid, description = _a.description, address = _a.address, phone = _a.phone, latitude = _a.latitude, longitude = _a.longitude, status = _a.status, type = _a.type, operation = _a.operation, name = _a.name, descriptionlarge = _a.descriptionlarge;
    return ({
        method: "UFN_WAREHOUSE_INS",
        key: "UFN_WAREHOUSE_INS",
        parameters: { warehouseid: warehouseid, description: description, address: address, phone: phone, latitude: latitude, longitude: longitude, status: status, type: type, operation: operation, name: name, descriptionlarge: descriptionlarge }
    });
};
exports.getWarehouseProducts = function (warehouseid) { return ({
    method: "UFN_ALL_PRODUCT_WAREHOUSE_SEL",
    key: "UFN_ALL_PRODUCT_WAREHOUSE_SEL",
    parameters: {
        warehouseid: warehouseid
    }
}); };
exports.getProductProduct = function (productid) { return ({
    method: "UFN_ALL_PRODUCT_PRODUCT_SEL",
    key: "UFN_ALL_PRODUCT_PRODUCT_SEL",
    parameters: {
        productid: productid
    }
}); };
exports.insProductAlternative = function (_a) {
    var productalternativeid = _a.productalternativeid, productid = _a.productid, productaltid = _a.productaltid, status = _a.status, type = _a.type, operation = _a.operation;
    return ({
        method: "UFN_PRODUCTALTERNATIVE_INS",
        key: "UFN_PRODUCTALTERNATIVE_INS",
        parameters: { productalternativeid: productalternativeid, productid: productid, productaltid: productaltid, status: status, type: type, operation: operation }
    });
};
exports.getAllAttributeProduct = function (productid) { return ({
    method: "UFN_ALL_ATTRIBUTE_PRODUCT_SEL",
    key: "UFN_ALL_ATTRIBUTE_PRODUCT_SEL",
    parameters: {
        productid: productid
    }
}); };
exports.insProductAttribute = function (_a) {
    var productattributeid = _a.productattributeid, p_tableid = _a.p_tableid, attributeid = _a.attributeid, value = _a.value, unitmeasureid = _a.unitmeasureid, status = _a.status, type = _a.type, operation = _a.operation;
    return ({
        method: "UFN_PRODUCTATTRIBUTE_INS",
        key: "UFN_PRODUCTATTRIBUTE_INS",
        parameters: { productattributeid: productattributeid, p_tableid: p_tableid, attributeid: attributeid, value: value, unitmeasureid: unitmeasureid, status: status, type: type, operation: operation }
    });
};
exports.insStatusProduct = function (_a) {
    var statusid = _a.statusid, comment = _a.comment, status = _a.status, type = _a.type, productid = _a.productid, ismoveinventory = _a.ismoveinventory, operation = _a.operation;
    return ({
        method: "UFN_STATUSPRODUCT_INS",
        key: "UFN_STATUSPRODUCT_INS",
        parameters: { statusid: statusid, comment: comment, status: status, type: type, productid: productid, ismoveinventory: ismoveinventory, operation: operation }
    });
};
exports.insStatusProductMas = function (data) { return ({
    method: "UFN_STATUSPRODUCT_MAS",
    key: "UFN_STATUSPRODUCT_MAS",
    parameters: { json: JSON.stringify(data) }
}); };
exports.getProductsExport = function (_a) {
    var filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate;
    return ({
        method: "UFN_PRODUCT_EXPORT",
        key: "UFN_PRODUCT_EXPORT",
        parameters: {
            origin: "product",
            filters: filters,
            startdate: startdate,
            enddate: enddate,
            sorts: sorts,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getProducts = function () { return ({
    method: "UFN_PRODUCT_SEL",
    key: "UFN_PRODUCT_SEL",
    parameters: {
        productid: 0
    }
}); };
exports.getProductsWarehouse = function (productid) { return ({
    method: "UFN_ALL_WAREHOUSE_PRODUCT_SEL",
    key: "UFN_ALL_WAREHOUSE_PRODUCT_SEL",
    parameters: {
        productid: productid
    }
}); };
exports.getInventoryConsumptionDetail = function (inventoryconsumptionid) { return ({
    method: "UFN_INVENTORYCONSUMPTION_DETAILSELECT",
    key: "UFN_INVENTORYCONSUMPTION_DETAILSELECT",
    parameters: {
        inventoryconsumptionid: inventoryconsumptionid
    }
}); };
exports.insProductWarehouse = function (_a) {
    var productwarehouseid = _a.productwarehouseid, productid = _a.productid, warehouseid = _a.warehouseid, priceunit = _a.priceunit, ispredeterminate = _a.ispredeterminate, typecostdispatch = _a.typecostdispatch, unitdispatchid = _a.unitdispatchid, unitbuyid = _a.unitbuyid, lotecode = _a.lotecode, rackcode = _a.rackcode, status = _a.status, type = _a.type, operation = _a.operation, currentbalance = _a.currentbalance;
    return ({
        method: "UFN_PRODUCTWAREHOUSE_INS",
        key: "UFN_PRODUCTWAREHOUSE_INS",
        parameters: {
            productwarehouseid: productwarehouseid, productid: productid, warehouseid: warehouseid, priceunit: priceunit, ispredeterminate: ispredeterminate, typecostdispatch: typecostdispatch, unitdispatchid: unitdispatchid, unitbuyid: unitbuyid, lotecode: lotecode, rackcode: rackcode, status: status, type: type, operation: operation, currentbalance: currentbalance
        }
    });
};
exports.getPaginatedWarehouse = function (_a) {
    var skip = _a.skip, take = _a.take, filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate;
    return ({
        methodCollection: "UFN_WAREHOUSE_PAG",
        methodCount: "UFN_WAREHOUSE_TOTALRECORDS",
        parameters: {
            startdate: startdate,
            enddate: enddate,
            skip: skip,
            take: take,
            filters: filters,
            sorts: sorts,
            origin: "warehouse",
            warehouseid: 0,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.insInventory = function (_a) {
    var inventoryid = _a.inventoryid, productid = _a.productid, warehousid = _a.warehousid, iswharehousedefault = _a.iswharehousedefault, rackdefault = _a.rackdefault, typecostdispatch = _a.typecostdispatch, familyid = _a.familyid, subfamilyid = _a.subfamilyid, status = _a.status, type = _a.type, $urrentbalance = _a.$urrentbalance, operation = _a.operation;
    return ({
        method: "UFN_INVENTORY_INS",
        key: "UFN_INVENTORY_INS",
        parameters: {
            inventoryid: inventoryid, productid: productid, warehousid: warehousid, iswharehousedefault: iswharehousedefault, rackdefault: rackdefault, typecostdispatch: typecostdispatch, familyid: familyid, subfamilyid: subfamilyid, status: status, type: type, $urrentbalance: $urrentbalance, operation: operation
        }
    });
};
exports.getPaginatedInventory = function (_a) {
    var skip = _a.skip, take = _a.take, filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate;
    return ({
        methodCollection: "UFN_INVENTORY_PAG",
        methodCount: "UFN_INVENTORY_TOTALRECORDS",
        parameters: {
            startdate: startdate,
            enddate: enddate,
            skip: skip,
            take: take,
            filters: filters,
            sorts: sorts,
            origin: "inventory",
            inventoryid: 0,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getWarehouseExport = function (_a) {
    var filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate;
    return ({
        method: "UFN_WAREHOUSE_EXPORT",
        key: "UFN_WAREHOUSE_EXPORT",
        parameters: {
            origin: "warehouse",
            filters: filters,
            startdate: startdate,
            enddate: enddate,
            sorts: sorts,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getInventoryConsumptionExport = function (_a) {
    var filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate;
    return ({
        method: "UFN_INVENTORYCONSUMPTION_EXPORT",
        key: "UFN_INVENTORYCONSUMPTION_EXPORT",
        parameters: {
            origin: "inventoryconsumption",
            filters: filters,
            startdate: startdate,
            enddate: enddate,
            sorts: sorts,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getWarehouses = function () { return ({
    method: "UFN_WAREHOUSE_SEL",
    key: "UFN_WAREHOUSE_SEL",
    parameters: {
        warehouseid: 0
    }
}); };
exports.getProductStatusHistory = function (productid) { return ({
    method: "UFN_ALL_STATUSPRODUCT_PRODUCT_SEL",
    key: "UFN_ALL_STATUSPRODUCT_PRODUCT_SEL",
    parameters: {
        id: productid
    }
}); };
exports.importProducts = function (data) { return ({
    method: "UFN_PRODUCT_MAS",
    key: "UFN_PRODUCT_MAS",
    parameters: {
        json: JSON.stringify(data)
    }
}); };
exports.importProductManufacturer = function (data) { return ({
    method: "UFN_PRODUCTMANUFACTURER_MAS",
    key: "UFN_PRODUCTMANUFACTURER_MAS",
    parameters: {
        json: JSON.stringify(data)
    }
}); };
exports.importProductsWarehouse = function (data) { return ({
    method: "UFN_PRODUCTWAREHOUSE_MAS",
    key: "UFN_PRODUCTWAREHOUSE_MAS",
    parameters: {
        json: JSON.stringify(data)
    }
}); };
exports.getManufacturer = function (manufacturerid) { return ({
    method: "UFN_MANUFACTURER_SEL",
    key: "UFN_MANUFACTURER_SEL",
    parameters: {
        manufacturerid: manufacturerid
    }
}); };
exports.insProductManufacturer = function (_a) {
    var productcompanyid = _a.productcompanyid, productid = _a.productid, manufacturerid = _a.manufacturerid, model = _a.model, catalognumber = _a.catalognumber, webpage = _a.webpage, taxeid = _a.taxeid, isstockistdefault = _a.isstockistdefault, averagedeliverytime = _a.averagedeliverytime, lastprice = _a.lastprice, lastorderdate = _a.lastorderdate, unitbuy = _a.unitbuy, status = _a.status, type = _a.type, operation = _a.operation;
    return ({
        method: "UFN_PRODUCTMANUFACTURER_INS",
        key: "UFN_PRODUCTMANUFACTURER_INS",
        parameters: { productcompanyid: productcompanyid, productid: productid, manufacturerid: manufacturerid, model: model, catalognumber: catalognumber, webpage: webpage, taxeid: taxeid, isstockistdefault: isstockistdefault, averagedeliverytime: averagedeliverytime, lastprice: lastprice, lastorderdate: lastorderdate, unitbuy: unitbuy, status: status, type: type, operation: operation }
    });
};
exports.insProductDealer = function (_a) {
    var productcompanyid = _a.productcompanyid, p_tableid = _a.p_tableid, manufacturerid = _a.manufacturerid, model = _a.model, catalognumber = _a.catalognumber, webpage = _a.webpage, taxeid = _a.taxeid, isstockistdefault = _a.isstockistdefault, averagedeliverytime = _a.averagedeliverytime, lastprice = _a.lastprice, lastorderdate = _a.lastorderdate, unitbuy = _a.unitbuy, status = _a.status, type = _a.type, distributorid = _a.distributorid, operation = _a.operation;
    return ({
        method: "UFN_PRODUCTMANUFACTURER_INS",
        key: "UFN_PRODUCTMANUFACTURER_INS",
        parameters: {
            productcompanyid: productcompanyid, p_tableid: p_tableid,
            manufacturerid: manufacturerid || 0,
            model: model, catalognumber: catalognumber, webpage: webpage, taxeid: taxeid, isstockistdefault: isstockistdefault, averagedeliverytime: averagedeliverytime, lastprice: lastprice, lastorderdate: lastorderdate, unitbuy: unitbuy, status: status, type: type,
            distributorid: distributorid || 0,
            operation: operation
        }
    });
};
exports.getProductManufacturer = function (productid) { return ({
    method: "UFN_ALL_MANUFACTURER_PRODUCT_SEL",
    key: "UFN_ALL_MANUFACTURER_PRODUCT_SEL",
    parameters: {
        productid: productid
    }
}); };
exports.getProductOrderProp = function (productid) { return ({
    method: "UFN_ALL_PRODUCT_ORDER_SEL",
    key: "UFN_ALL_PRODUCT_ORDER_SEL",
    parameters: {
        productid: productid
    }
}); };
exports.importProductsAttribute = function (data) { return ({
    method: "UFN_PRODUCTATTRIBUTE_MAS",
    key: "UFN_PRODUCTATTRIBUTE_MAS",
    parameters: {
        json: JSON.stringify(data)
    }
}); };
exports.importWarehouse = function (data) { return ({
    method: "UFN_WAREHOUSE_MAS",
    key: "UFN_WAREHOUSE_MAS",
    parameters: {
        json: JSON.stringify(data)
    }
}); };
exports.getPaginatedCompanies = function (_a) {
    var skip = _a.skip, take = _a.take, filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate;
    return ({
        methodCollection: "UFN_MANUFACTURER_PAG",
        methodCount: "UFN_MANUFACTURER_TOTALRECORDS",
        parameters: {
            startdate: startdate,
            enddate: enddate,
            skip: skip,
            take: take,
            filters: filters,
            sorts: sorts,
            origin: "manufacturer",
            manufacturerid: 0,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getCompanyExport = function (_a) {
    var filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate;
    return ({
        method: "UFN_MANUFACTURER_EXPORT",
        key: "UFN_MANUFACTURER_EXPORT",
        parameters: {
            origin: "manufacturer",
            filters: filters,
            startdate: startdate,
            enddate: enddate,
            sorts: sorts,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.insCompany = function (_a) {
    var manufacturerid = _a.manufacturerid, description = _a.description, status = _a.status, type = _a.type, descriptionlarge = _a.descriptionlarge, clientenumbers = _a.clientenumbers, beginpage = _a.beginpage, currencyid = _a.currencyid, taxeid = _a.taxeid, ispaymentdelivery = _a.ispaymentdelivery, typemanufacterid = _a.typemanufacterid, manufacturercode = _a.manufacturercode, operation = _a.operation;
    return ({
        method: "UFN_MANUFACTURER_INS",
        key: "UFN_MANUFACTURER_INS",
        parameters: { manufacturerid: manufacturerid, description: description, status: status, type: type, descriptionlarge: descriptionlarge, clientenumbers: clientenumbers, beginpage: beginpage, currencyid: currencyid, taxeid: taxeid, ispaymentdelivery: ispaymentdelivery, typemanufacterid: typemanufacterid, manufacturercode: manufacturercode, operation: operation }
    });
};
exports.importManufacturer = function (data) { return ({
    method: "UFN_MANUFACTURER_MAS",
    key: "UFN_MANUFACTURER_MAS",
    parameters: {
        json: JSON.stringify(data)
    }
}); };
exports.importstatusProduct = function (data) { return ({
    method: "UFN_STATUSPRODUCT_MAS",
    key: "UFN_STATUSPRODUCT_MAS",
    parameters: {
        json: JSON.stringify(data)
    }
}); };
exports.duplicateProduct = function (productid) { return ({
    method: "UFN_PRODUCT_DUP",
    key: "UFN_PRODUCT_DUP",
    parameters: {
        productid: productid,
        operation: "INSERT"
    }
}); };
exports.getInventoryBalance = function (inventorybalanceid) { return ({
    method: "UFN_INVENTORYBALANCE_SEL",
    key: "UFN_INVENTORYBALANCE_SEL",
    parameters: {
        inventorybalanceid: inventorybalanceid
    }
}); };
exports.insInventoryBalance = function (_a) {
    var inventorybalanceid = _a.inventorybalanceid, inventoryid = _a.inventoryid, shelf = _a.shelf, lotecode = _a.lotecode, currentbalance = _a.currentbalance, recountphysical = _a.recountphysical, recountphysicaldate = _a.recountphysicaldate, isreconciled = _a.isreconciled, shelflifedays = _a.shelflifedays, duedate = _a.duedate, status = _a.status, type = _a.type, operation = _a.operation;
    return ({
        method: "UFN_INVENTORYBALANCE_INS",
        key: "UFN_INVENTORYBALANCE_INS",
        parameters: {
            inventorybalanceid: inventorybalanceid, inventoryid: inventoryid, shelf: shelf, lotecode: lotecode, currentbalance: currentbalance, recountphysical: recountphysical, recountphysicaldate: recountphysicaldate, isreconciled: isreconciled, shelflifedays: shelflifedays, duedate: duedate, status: status, type: type, operation: operation
        }
    });
};
exports.getInventoryExport = function (_a) {
    var filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate;
    return ({
        method: "UFN_INVENTORY_EXPORT",
        key: "UFN_INVENTORY_EXPORT",
        parameters: {
            origin: "inventory",
            filters: filters,
            startdate: startdate,
            enddate: enddate,
            sorts: sorts,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.getInventoryCost = function (inventoryid) { return ({
    method: "UFN_ALL_INVENTORY_INVENTORYCOST_SEL",
    key: "UFN_ALL_INVENTORY_INVENTORYCOST_SEL",
    parameters: {
        inventoryid: inventoryid
    }
}); };
exports.getInventoryRecount = function (inventoryid) { return ({
    method: "UFN_INVENTORYRECOUNT_SEL",
    key: "UFN_INVENTORYRECOUNT_SEL",
    parameters: {
        inventoryid: inventoryid
    }
}); };
exports.getInventoryWarehouse = function (inventoryid) { return ({
    method: "UFN_INVENTORYWAREHOUSE_SEL",
    key: "UFN_INVENTORYWAREHOUSE_SEL",
    parameters: {
        inventoryid: inventoryid
    }
}); };
exports.getInventoryLote = function (inventoryid) { return ({
    method: "UFN_INVENTORYLOTE_SEL",
    key: "UFN_INVENTORYLOTE_SEL",
    parameters: {
        inventoryid: inventoryid
    }
}); };
exports.getInventoryBooking = function (inventoryid) { return ({
    method: "UFN_INVENTORYBOOKING_SEL",
    key: "UFN_INVENTORYBOOKING_SEL",
    parameters: {
        inventoryid: inventoryid
    }
}); };
exports.insInventoryBooking = function (_a) {
    var inventorybookingid = _a.inventorybookingid, inventoryid = _a.inventoryid, warehouseid = _a.warehouseid, ticketid = _a.ticketid, bookingtype = _a.bookingtype, bookingquantity = _a.bookingquantity, status = _a.status, type = _a.type, operation = _a.operation, applicationdate = _a.applicationdate;
    return ({
        method: "UFN_INVENTORBOOKING_INS",
        key: "UFN_INVENTORBOOKING_INS",
        parameters: {
            inventorybookingid: inventorybookingid, inventoryid: inventoryid, warehouseid: warehouseid, ticketid: ticketid, bookingtype: bookingtype, bookingquantity: bookingquantity, status: status, type: type, operation: operation, applicationdate: applicationdate
        }
    });
};
exports.partnerSel = function (_a) {
    var id = _a.id, all = _a.all;
    return ({
        method: "UFN_PARTNER_SEL",
        key: "UFN_PARTNER_SEL",
        parameters: { id: id, all: all }
    });
};
exports.partnerIns = function (_a) {
    var id = _a.id, country = _a.country, billingcurrency = _a.billingcurrency, documenttype = _a.documenttype, documentnumber = _a.documentnumber, company = _a.company, address = _a.address, billingcontact = _a.billingcontact, email = _a.email, signaturedate = _a.signaturedate, enterprisepartner = _a.enterprisepartner, billingplan = _a.billingplan, typecalculation = _a.typecalculation, numbercontactsbag = _a.numbercontactsbag, puadditionalcontacts = _a.puadditionalcontacts, priceperbag = _a.priceperbag, automaticgenerationdrafts = _a.automaticgenerationdrafts, automaticperiodgeneration = _a.automaticperiodgeneration, montlyplancost = _a.montlyplancost, numberplancontacts = _a.numberplancontacts, status = _a.status, type = _a.type, operation = _a.operation;
    return ({
        method: "UFN_PARTNER_INS",
        key: "UFN_PARTNER_INS",
        parameters: { id: id, country: country, billingcurrency: billingcurrency, documenttype: documenttype, documentnumber: documentnumber, company: company, address: address, billingcontact: billingcontact, email: email, signaturedate: signaturedate, enterprisepartner: enterprisepartner, billingplan: billingplan, typecalculation: typecalculation, numbercontactsbag: numbercontactsbag, puadditionalcontacts: puadditionalcontacts, priceperbag: priceperbag, automaticgenerationdrafts: automaticgenerationdrafts, automaticperiodgeneration: automaticperiodgeneration, montlyplancost: montlyplancost, numberplancontacts: numberplancontacts, status: status, type: type, operation: operation }
    });
};
exports.customerByPartnerSel = function (partnerid) { return ({
    method: "UFN_CUSTOMER_BY_PARTNER_SEL",
    key: "UFN_CUSTOMER_BY_PARTNER_SEL",
    parameters: { partnerid: partnerid }
}); };
exports.customerPartnersByUserSel = function () { return ({
    method: "UFN_CUSTOMERPARTNER_BY_USER_SEL",
    key: "UFN_CUSTOMERPARTNER_BY_USER_SEL",
    parameters: {}
}); };
exports.customerByPartnerIns = function (_a) {
    var id = _a.id, corpid = _a.corpid, orgid = _a.orgid, partnerid = _a.partnerid, typepartner = _a.typepartner, billingplan = _a.billingplan, comissionpercentage = _a.comissionpercentage, status = _a.status, operation = _a.operation;
    return ({
        method: "UFN_CUSTOMER_BY_PARTNER_INS",
        key: "UFN_CUSTOMER_BY_PARTNER_INS",
        parameters: { id: id, corpid: corpid, orgid: orgid, partnerid: partnerid, typepartner: typepartner, billingplan: billingplan, comissionpercentage: comissionpercentage, status: status, operation: operation }
    });
};
exports.billingPeriodPartnerEnterprise = function (_a) {
    var partnerid = _a.partnerid, corpid = _a.corpid, orgid = _a.orgid, year = _a.year, month = _a.month, reporttype = _a.reporttype, username = _a.username;
    return ({
        method: "UFN_BILLINGPERIODPARTNER_ENTERPRISE",
        key: "UFN_BILLINGPERIODPARTNER_ENTERPRISE",
        parameters: { partnerid: partnerid, corpid: corpid, orgid: orgid, year: year, month: month, reporttype: reporttype, username: username }
    });
};
exports.getInventoryMovement = function (inventoryid) { return ({
    method: "UFN_ALL_INVENTORY_INVENTORYMOVEMENT_SEL",
    key: "UFN_ALL_INVENTORY_INVENTORYMOVEMENT_SEL",
    parameters: {
        inventoryid: inventoryid
    }
}); };
exports.insOrderInventory = function (_a) {
    var inventoryorderid = _a.inventoryorderid, inventoryid = _a.inventoryid, isneworder = _a.isneworder, replenishmentpoint = _a.replenishmentpoint, deliverytimedays = _a.deliverytimedays, securitystock = _a.securitystock, economicorderquantity = _a.economicorderquantity, unitbuyid = _a.unitbuyid, distributorid = _a.distributorid, manufacturerid = _a.manufacturerid, catalognumber = _a.catalognumber, model = _a.model, status = _a.status, type = _a.type, operation = _a.operation;
    return ({
        method: "UFN_ORDER_INS",
        key: "UFN_ORDER_INS",
        parameters: {
            inventoryorderid: inventoryorderid, inventoryid: inventoryid, isneworder: isneworder, replenishmentpoint: replenishmentpoint, deliverytimedays: deliverytimedays, securitystock: securitystock, economicorderquantity: economicorderquantity, unitbuyid: unitbuyid, distributorid: distributorid, manufacturerid: manufacturerid, catalognumber: catalognumber, model: model, status: status, type: type, operation: operation
        }
    });
};
exports.updateInventoryBalances = function (inventoryid) { return ({
    method: "UFN_INVENTORY_INVENTORYBALANCE_UPD",
    key: "UFN_INVENTORY_INVENTORYBALANCE_UPD",
    parameters: {
        inventoryid: inventoryid
    }
}); };
exports.getPaginatedInventoryConsumption = function (_a) {
    var skip = _a.skip, take = _a.take, filters = _a.filters, sorts = _a.sorts, startdate = _a.startdate, enddate = _a.enddate;
    return ({
        methodCollection: "UFN_INVENTORYCONSUMPTION_PAG",
        methodCount: "UFN_INVENTORYCONSUMPTION_TOTALRECORDS",
        parameters: {
            startdate: startdate,
            enddate: enddate,
            skip: skip,
            take: take,
            filters: filters,
            sorts: sorts,
            origin: "inventoryconsumption",
            inventoryconsumptionid: 0,
            offset: (new Date().getTimezoneOffset() / 60) * -1
        }
    });
};
exports.billingPeriodPartnerDeveloperReseller = function (_a) {
    var partnerid = _a.partnerid, corpid = _a.corpid, orgid = _a.orgid, year = _a.year, month = _a.month, username = _a.username;
    return ({
        method: "UFN_BILLINGPERIODPARTNER_DEVELOPER_RESELLER",
        key: "UFN_BILLINGPERIODPARTNER_DEVELOPER_RESELLER",
        parameters: { partnerid: partnerid, corpid: corpid, orgid: orgid, year: year, month: month, username: username }
    });
};
exports.insInventoryConsumption = function (_a) {
    var inventoryconsumptionid = _a.inventoryconsumptionid, description = _a.description, ordernumber = _a.ordernumber, transactiontype = _a.transactiontype, warehouseid = _a.warehouseid, inventorybookingid = _a.inventorybookingid, status = _a.status, type = _a.type, comment = _a.comment, operation = _a.operation;
    return ({
        method: "UFN_INVENTORYCONSUMPTION_INS",
        key: "UFN_INVENTORYCONSUMPTION_INS",
        parameters: {
            inventoryconsumptionid: inventoryconsumptionid, description: description, ordernumber: ordernumber, transactiontype: transactiontype, warehouseid: warehouseid, inventorybookingid: inventorybookingid, status: status, type: type, comment: comment, operation: operation
        }
    });
};
exports.inventoryConsumptionDetailIns = function (_a) {
    var inventoryconsumptiondetailid = _a.inventoryconsumptiondetailid, p_tableid = _a.p_tableid, line = _a.line, productid = _a.productid, description = _a.description, quantity = _a.quantity, onlinecost = _a.onlinecost, fromshelf = _a.fromshelf, fromlote = _a.fromlote, unitcost = _a.unitcost, ticketnumber = _a.ticketnumber, dispatchto = _a.dispatchto, realdate = _a.realdate, comment = _a.comment, status = _a.status, type = _a.type, operation = _a.operation, transactiontype = _a.transactiontype, warehouseto = _a.warehouseto, rackcodeto = _a.rackcodeto, lotecodeto = _a.lotecodeto;
    return ({
        method: "UFN_INVENTORYCONSUMPTIONDETAIL_INS",
        key: "UFN_INVENTORYCONSUMPTIONDETAIL_INS",
        parameters: { inventoryconsumptiondetailid: inventoryconsumptiondetailid, p_tableid: p_tableid, line: line, productid: productid, description: description, quantity: quantity, onlinecost: onlinecost, fromshelf: fromshelf, fromlote: fromlote, unitcost: unitcost, ticketnumber: ticketnumber, dispatchto: dispatchto, realdate: realdate, comment: comment, status: status, type: type, operation: operation, transactiontype: transactiontype, warehouseto: warehouseto, rackcodeto: rackcodeto, lotecodeto: lotecodeto }
    });
};
exports.getTemplatesChatflow = function () { return ({
    method: "UFN_CHATFLOW_BLOCK_TEMPLATES_SEL",
    key: "UFN_CHATFLOW_BLOCK_TEMPLATES_SEL",
    parameters: {}
}); };
exports.templatesChatflowClone = function (_a) {
    var chatblockid = _a.chatblockid, communicationchannelid = _a.communicationchannelid, prop_value = _a.prop_value;
    return ({
        method: "UFN_CHATFLOW_BLOCK_TEMPLATE_CLONE",
        key: "UFN_CHATFLOW_BLOCK_TEMPLATE_CLONE",
        parameters: { chatblockid: chatblockid, communicationchannelid: communicationchannelid, prop_value: prop_value }
    });
};
exports.insOrderConfig = function (_a) {
    var id = _a.id, orderconfig = _a.orderconfig, type = _a.type, status = _a.status, operation = _a.operation;
    return ({
        method: "UFN_ORDERCONFIG_INS",
        key: "UFN_ORDERCONFIG_INS",
        parameters: { id: id, orderconfig: orderconfig, type: type, status: status, operation: operation }
    });
};
exports.selOrderConfig = function () { return ({
    method: "UFN_ORDERCONFIG_SEL",
    key: "UFN_ORDERCONFIG_SEL",
    parameters: {}
}); };
exports.insLeadConfig = function (_a) {
    var id = _a.id, maxgreen = _a.maxgreen, maxyellow = _a.maxyellow;
    return ({
        method: "UFN_LEAD_CONFIG_INS",
        key: "UFN_LEAD_CONFIG_INS",
        parameters: { id: id, maxgreen: maxgreen, maxyellow: maxyellow }
    });
};
exports.inventoryConsumptionComplete = function (_a) {
    var inventoryconsumptionid = _a.inventoryconsumptionid, status = _a.status, comment = _a.comment;
    return ({
        method: "UFN_INVENTORYCONSUMPTION_PROCESS",
        key: "UFN_INVENTORYCONSUMPTION_PROCESS",
        parameters: { inventoryconsumptionid: inventoryconsumptionid, status: status, comment: comment }
    });
};
exports.reservationswarehouseSel = function (warehouseid) { return ({
    method: "UFN_BOOKINGWAREHOUSE_SEL",
    key: "UFN_BOOKINGWAREHOUSE_SEL",
    parameters: { warehouseid: warehouseid }
}); };
exports.inventoryconsumptionsbywarehouseSel = function (warehouseid) { return ({
    method: "UFN_ALL_WAREHOUSE_INVENTORYCONSUMPTION_SEL",
    key: "UFN_ALL_WAREHOUSE_INVENTORYCONSUMPTION_SEL",
    parameters: { warehouseid: warehouseid }
}); };
exports.generateLabelSel = function (inventoryconsumptionid) { return ({
    method: "UFN_GENERATE_LABEL_SEL",
    key: "UFN_GENERATE_LABEL_SEL",
    parameters: { inventoryconsumptionid: inventoryconsumptionid }
}); };
exports.generateguiaremisionSel = function (inventoryconsumptionid) { return ({
    method: "UFN_GUIAREMISIONDETAIL_SEL",
    key: "UFN_GUIAREMISIONDETAIL_SEL",
    parameters: { inventoryconsumptionid: inventoryconsumptionid }
}); };
exports.generateguiaremisiondetailSel = function (inventoryconsumptionid) { return ({
    method: "UFN_GUIAREMISION_SEL",
    key: "UFN_GUIAREMISION_SEL",
    parameters: { inventoryconsumptionid: inventoryconsumptionid }
}); };
exports.getStatusHistoryInventoryConsumption = function (inventoryconsumptionid) { return ({
    method: "UFN_ALL_INVENTORYCONSUMPTIONSTATUS_INVENTORYCONSUMPTION_SEL",
    key: "UFN_ALL_INVENTORYCONSUMPTIONSTATUS_INVENTORYCONSUMPTION_SEL",
    parameters: { inventoryconsumptionid: inventoryconsumptionid }
}); };
exports.assistantAiSel = function (_a) {
    var id = _a.id, all = _a.all;
    return ({
        method: "UFN_ASSISTANTAI_SEL",
        key: "UFN_ASSISTANTAI_SEL",
        parameters: { id: id, all: all }
    });
};
exports.insAssistantAi = function (_a) {
    var id = _a.id, code = _a.code, name = _a.name, description = _a.description, basemodel = _a.basemodel, language = _a.language, organizationname = _a.organizationname, querywithoutanswer = _a.querywithoutanswer, response = _a.response, prompt = _a.prompt, negativeprompt = _a.negativeprompt, generalprompt = _a.generalprompt, temperature = _a.temperature, max_tokens = _a.max_tokens, top_p = _a.top_p, apikey = _a.apikey, retrieval = _a.retrieval, codeinterpreter = _a.codeinterpreter, type = _a.type, status = _a.status, operation = _a.operation;
    return ({
        method: "UFN_ASSISTANTAI_INS",
        key: "UFN_ASSISTANTAI_INS",
        parameters: { id: id, code: code, name: name, description: description, basemodel: basemodel, language: language, organizationname: organizationname, querywithoutanswer: querywithoutanswer, response: response, prompt: prompt, negativeprompt: negativeprompt, generalprompt: generalprompt, temperature: temperature, max_tokens: max_tokens, top_p: top_p, apikey: apikey, retrieval: retrieval, codeinterpreter: codeinterpreter, type: type, status: status, operation: operation }
    });
};
exports.assistantAiDocumentSel = function (_a) {
    var assistantaiid = _a.assistantaiid, id = _a.id, all = _a.all;
    return ({
        method: "UFN_ASSISTANTAIDOCUMENT_SEL",
        key: "UFN_ASSISTANTAIDOCUMENT_SEL",
        parameters: { assistantaiid: assistantaiid, id: id, all: all }
    });
};
exports.insAssistantAiDoc = function (_a) {
    var assistantaiid = _a.assistantaiid, id = _a.id, description = _a.description, url = _a.url, fileid = _a.fileid, type = _a.type, status = _a.status, operation = _a.operation;
    return ({
        method: "UFN_ASSISTANTAIDOCUMENT_INS",
        key: "UFN_ASSISTANTAIDOCUMENT_INS",
        parameters: { assistantaiid: assistantaiid, id: id, description: description, url: url, fileid: fileid, type: type, status: status, operation: operation }
    });
};
exports.threadSel = function (_a) {
    var assistantaiid = _a.assistantaiid, id = _a.id, all = _a.all;
    return ({
        method: "UFN_THREAD_SEL",
        key: "UFN_THREAD_SEL",
        parameters: { assistantaiid: assistantaiid, id: id, all: all }
    });
};
exports.insThread = function (_a) {
    var assistantaiid = _a.assistantaiid, id = _a.id, code = _a.code, description = _a.description, type = _a.type, status = _a.status, operation = _a.operation;
    return ({
        method: "UFN_THREAD_INS",
        key: "UFN_THREAD_INS",
        parameters: { assistantaiid: assistantaiid, id: id, code: code, description: description, type: type, status: status, operation: operation }
    });
};
exports.messageAiSel = function (_a) {
    var assistantaiid = _a.assistantaiid, threadid = _a.threadid;
    return ({
        method: "UFN_MESSAGEAI_SEL",
        key: "UFN_MESSAGEAI_SEL",
        parameters: { assistantaiid: assistantaiid, threadid: threadid }
    });
};
exports.insMessageAi = function (_a) {
    var assistantaiid = _a.assistantaiid, threadid = _a.threadid, assistantaidocumentid = _a.assistantaidocumentid, id = _a.id, messagetext = _a.messagetext, infosource = _a.infosource, type = _a.type, status = _a.status, operation = _a.operation;
    return ({
        method: "UFN_MESSAGEAI_INS",
        key: "UFN_MESSAGEAI_INS",
        parameters: { assistantaiid: assistantaiid, threadid: threadid, assistantaidocumentid: assistantaidocumentid, id: id, messagetext: messagetext, infosource: infosource, type: type, status: status, operation: operation }
    });
};
exports.updateAssistantAiDocumentTraining = function (assistantaiid, documentsid) { return ({
    method: "UFN_ASSISTANTAIDOCUMENT_TRAINING_UPD",
    key: "UFN_ASSISTANTAIDOCUMENT_TRAINING_UPD",
    parameters: { assistantaiid: assistantaiid, documentsid: documentsid }
}); };
exports.getHeatmapConfig = function () { return ({
    method: "UFN_REPORT_CONFIGURATION_SEL",
    key: "UFN_REPORT_CONFIGURATION_SEL",
    parameters: { reportname: "" }
}); };
exports.heatmapConfigIns = function (_a) {
    var reportname = _a.reportname, configuration = _a.configuration;
    return ({
        method: "UFN_REPORT_CONFIGURATION_INS",
        key: "UFN_REPORT_CONFIGURATION_INS",
        parameters: { reportname: reportname, configuration: JSON.stringify(configuration) }
    });
};
exports.getWarehouseSel = function () { return ({
    method: "UFN_WAREHOUSE_SEL",
    key: "UFN_WAREHOUSE_SEL",
    parameters: {}
}); };
exports.deliveryConfigurationSel = function (_a) {
    var id = _a.id, all = _a.all;
    return ({
        method: "UFN_DELIVERYCONFIGURATION_SEL",
        key: "UFN_DELIVERYCONFIGURATION_SEL",
        parameters: { id: id, all: all }
    });
};
exports.deliveryConfigurationIns = function (_a) {
    var id = _a.id, config = _a.config, status = _a.status, type = _a.type, operation = _a.operation;
    return ({
        method: "UFN_DELIVERYCONFIGURATION_INS",
        key: "UFN_DELIVERYCONFIGURATION_INS",
        parameters: { id: id, config: config, status: status, type: type, operation: operation }
    });
};
exports.deliveryVehicleSel = function (_a) {
    var id = _a.id, all = _a.all;
    return ({
        method: "UFN_DELIVERYVEHICLE_SEL",
        key: "UFN_DELIVERYVEHICLE_SEL",
        parameters: { id: id, all: all }
    });
};
exports.deliveryVehicleIns = function (_a) {
    var id = _a.id, status = _a.status, type = _a.type, brand = _a.brand, model = _a.model, vehicleplate = _a.vehicleplate, capacity = _a.capacity, insuredamount = _a.insuredamount, averagespeed = _a.averagespeed, userid = _a.userid, license = _a.license, operation = _a.operation;
    return ({
        method: "UFN_DELIVERYVEHICLE_INS",
        key: "UFN_DELIVERYVEHICLE_INS",
        parameters: { id: id, status: status, type: type, brand: brand, model: model, vehicleplate: vehicleplate, capacity: capacity, insuredamount: insuredamount, averagespeed: averagespeed, userid: userid, license: license, operation: operation }
    });
};
exports.deliveryAppUsersSel = function () { return ({
    method: "UFN_USERS_APP_DELIVERY_SEL",
    key: "UFN_USERS_APP_DELIVERY_SEL",
    parameters: {}
}); };
exports.listOrderSel = function (ordersinattention) { return ({
    method: "UFN_LISTORDER_SEL",
    key: "UFN_LISTORDER_SEL",
    parameters: { ordersinattention: ordersinattention }
}); };
exports.reasonNonDeliverySel = function (id) { return ({
    method: "UFN_REASONNONDELIVERY_SEL",
    key: "UFN_REASONNONDELIVERY_SEL",
    parameters: { id: id, all: id === 0 }
}); };
exports.reasonNonDeliveryIns = function (_a) {
    var id = _a.id, status = _a.status, type = _a.type, description = _a.description, operation = _a.operation;
    return ({
        method: "UFN_REASONNONDELIVERY_INS",
        key: "UFN_REASONNONDELIVERY_INS",
        parameters: { id: id, status: status, type: type, description: description, operation: operation }
    });
};
exports.subReasonNonDeliverySel = function (reasonnondeliveryid) { return ({
    method: "UFN_SUBREASONNONDELIVERY_SEL",
    key: "UFN_SUBREASONNONDELIVERY_SEL",
    parameters: { reasonnondeliveryid: reasonnondeliveryid }
}); };
exports.subReasonNonDeliveryIns = function (_a) {
    var id = _a.id, reasonnondeliveryid = _a.reasonnondeliveryid, status = _a.status, type = _a.type, description = _a.description, statustypified = _a.statustypified, operation = _a.operation;
    return ({
        method: "UFN_SUBREASONNONDELIVERY_INS",
        key: "UFN_SUBREASONNONDELIVERY_INS",
        parameters: { id: id, reasonnondeliveryid: reasonnondeliveryid, status: status, type: type, description: description, statustypified: statustypified, operation: operation }
    });
};
