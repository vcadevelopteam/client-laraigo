import React from 'react';
import { ViewsClassificationConfig, RouteConfig } from "@types";
import paths from "common/constants/paths";
import {
    DashboardIcon, TicketIcon, ReportsIcon, MessageInboxIcon, SupervisorIcon, ConfigurationIcon, ExtrasIcon,
    BotDesignerIcon, BillingSetupIcon, TimeSheetIcon, InvoiceIcon,
    //IAServicesIcon,
    OutboundIcon,
    MessageTemplateIcon,
    AIModelsIcon,
    ClientIcon,
    CRMIcon,
    EnvioIcon,
    KPIIcon,
    CalendaryIcon,
    RulesIcon,
    ProductsIcon,
    PostCreatorIcon,
    OrdersIcon,
    IALaraigoLogo,
    ServiceDeskIcon,
    AnalyticRouteIcon,
    DashboardRouteIcon,
    AutomatizationRouteIcon,
    SalesRouteIcon,
    ServiceDeskRouteIcon,
    IARouteIcon,
    UserGroupIcon,
    ConfigPropertiesIcon,
    QuickReplyIcon,
    ForbiddenWordsIcon,
    EmojiSadFaceIcon,
    DomainsIcon,
    OrganizationsIcon,
    IntegrationIcon,
    ClassificationIcon,
    LocationIcon,
    Corporation2Icon,
    ChannelsIcon,
    WhitelistIcon,
    ConfiguratuinIARouteIcon,
    ConectivityIARouteIcon,
    IAEntrenamientoIcon,
    ProductMasterIcon,
    WarehouseIcon,
    SLAIcon,
    CompaniesIcon,
    InventoryConsumptionIcon,
    InventoryIcon,
    DocumentLibraryIcon,
    DeliveryIcon,
    StoreCoverageIcon,
    OrdersListIcon,
    OrdersInAttentionIcon,
    ConfigurationDeliveryIcon,
} from 'icons';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import InputIcon from '@material-ui/icons/Input';
import { langKeys } from "lang/keys";
import { Trans } from "react-i18next";
import GroupIcon from '@material-ui/icons/Group';

export const viewsClassifications: ViewsClassificationConfig[] = [
    {
        id: 1,
        key: "analytics",
        description: <Trans i18nKey={langKeys.analytics} />,
        icon: (className) => <AnalyticRouteIcon style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        id: 2,
        key: "CRM",
        description: <span>CRM</span>, 
        icon: (className) => <DashboardRouteIcon style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        id: 3,
        key: "automatization",
        description: <Trans i18nKey={langKeys.automatization}/>,
        icon: (className) => <AutomatizationRouteIcon style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        id: 4,
        key: "sales",
        description: <Trans i18nKey={langKeys.reason_sales} />,
        icon: (className) => <SalesRouteIcon style={{ width: 22, height: 22, stroke: 'none' }} className={className} />,
    },
    {
        id: 5,
        key: "delivery",
        description: <Trans i18nKey={langKeys.delivery} />,
        // tooltip: <Trans i18nKey={langKeys.reason_sales} />,
        icon: (className) => <DeliveryIcon style={{ width: 22, height: 22, stroke: 'none' }} className={className} />,
        // options: [paths.CONFIGURATIONDELIVERY,paths.ORDERLIST]
    },
    {
        id: 6,
        key: "servicedesk",
        description: <span>Service Desk</span>, 
        icon: (className) => <ServiceDeskRouteIcon style={{ width: 22, height: 22, stroke: 'none' }} className={className} />,
    },
    {
        id: 7,
        key: "ia",
        description: <Trans i18nKey={langKeys.ia} />, // prop:count for plural purposes
        icon: (className) => <IARouteIcon style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        id: 8,
        key: "configuration",
        description: <Trans i18nKey={langKeys.configuration} />,
        icon: (className) => <ConfigurationIcon style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        id: 9,
        key: "billing",
        description: <Trans i18nKey={langKeys.invoice} />,
        icon: (className) => <InvoiceIcon style={{ width: 22, height: 22 }} className={className} />,
    },
];

export const routes: RouteConfig[] = [
    {
        key: paths.DASHBOARD,
        description: <Trans i18nKey={langKeys.dashboard} />,
        tooltip: <Trans i18nKey={langKeys.dashboard} />,
        path: paths.DASHBOARD,
        icon: (className) => <DashboardIcon style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        key: paths.REPORTS,
        description: <Trans i18nKey={langKeys.report} count={2} />, // prop:count for plural purposes
        tooltip: <Trans i18nKey={langKeys.report} count={2} />,
        path: paths.REPORTS,
        icon: (className) => <ReportsIcon style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        key: paths.REPORTSCHEDULER,
        description: <Trans i18nKey={langKeys.reportscheduler} count={2} />, // prop:count for plural purposes
        tooltip: <Trans i18nKey={langKeys.reportscheduler} count={2} />,
        path: paths.REPORTSCHEDULER,
        icon: (className) => <EnvioIcon style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        key: paths.KPIMANAGER,
        description: <Trans i18nKey={langKeys.kpimanager_plural} />,
        tooltip: <Trans i18nKey={langKeys.kpimanager} />,
        path: paths.KPIMANAGER,
        icon: (className) => <KPIIcon style={{ width: 22, height: 22, stroke: 'none' }} className={className} />,
    },
    {
        key: paths.CALENDAR,
        description: <Trans i18nKey={langKeys.calendar_plural} />,
        tooltip: <Trans i18nKey={langKeys.calendar} />,
        path: paths.CALENDAR,
        icon: (className) => <CalendaryIcon style={{ width: 22, height: 22, stroke: 'none' }} className={className} />,
    },
    {
        key: paths.POSTCREATOR,
        description: <Trans i18nKey={langKeys.postcreator} count={2} />, // prop:count for plural purposes
        tooltip: <Trans i18nKey={langKeys.postcreator} count={2} />,
        path: paths.POSTCREATOR,
        icon: (className) => <PostCreatorIcon style={{ width: 22, height: 22 }} className={className} />,
    },
    // {
    //     key: paths.REPORTDESIGNER,
    //     description: <Trans i18nKey={langKeys.report_designer} count={2} />, // prop:count for plural purposes
    //     tooltip: <Trans i18nKey={langKeys.report_designer} count={2} />,
    //     path: paths.REPORTDESIGNER,
    //     icon: (className) => <ReportsIcon style={{ width: 22, height: 22 }} className={className} />,
    // },
    {
        key: paths.TICKETS,
        description: <Trans i18nKey={langKeys.ticket} count={2} />,
        tooltip: <Trans i18nKey={langKeys.ticket} count={2} />,
        path: paths.TICKETS,
        icon: (className) => <TicketIcon style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        key: paths.PERSON,
        description: <Trans i18nKey={langKeys.person} count={2} />,
        tooltip: <Trans i18nKey={langKeys.person} count={2} />,
        path: paths.PERSON,
        icon: (className) => <ClientIcon style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        key: paths.CRM,
        description: <Trans i18nKey={langKeys.lead} count={2} />,
        tooltip: <Trans i18nKey={langKeys.lead} count={2} />,
        path: paths.CRM,
        icon: (className) => <CRMIcon style={{ width: 22, height: 26 }} className={className} />,
    },
    {
        key: paths.SERVICE_DESK,
        description: <Trans i18nKey={langKeys.servicedesk} count={2} />,
        tooltip: <Trans i18nKey={langKeys.servicedesk} count={2} />,
        path: paths.SERVICE_DESK,
        icon: (className) => <ServiceDeskIcon style={{ width: 22, height: 26 }} className={className} />,
    },
    {
        key: paths.AUTOMATIZATIONRULES,
        description: <Trans i18nKey={langKeys.automatizationrules} count={2} />,
        tooltip: <Trans i18nKey={langKeys.automatizationrules} count={2} />,
        path: paths.AUTOMATIZATIONRULES,
        icon: (className) => <RulesIcon style={{ width: 22, height: 26 }} className={className} />,
    },
    {
        key: paths.PRODUCTCATALOG,
        description: <Trans i18nKey={langKeys.productcatalog} count={2} />,
        tooltip: <Trans i18nKey={langKeys.productcatalog} count={2} />,
        path: paths.PRODUCTCATALOG,
        icon: (className) => <ProductsIcon style={{ width: 22, height: 26 }} className={className} />,
    },
    {
        key: paths.CATALOGMASTER,
        description: <Trans i18nKey={langKeys.catalogmaster} count={2} />,
        tooltip: <Trans i18nKey={langKeys.catalogmaster} count={2} />,
        path: paths.CATALOGMASTER,
        icon: (className) => <ProductsIcon style={{ width: 22, height: 26 }} className={className} />,
    },
    {
        key: paths.ORDERS,
        description: <Trans i18nKey={langKeys.orders} count={2} />,
        tooltip: <Trans i18nKey={langKeys.orders} count={2} />,
        path: paths.ORDERS,
        icon: (className) => <OrdersIcon style={{ width: 22, height: 26 }} className={className} />,
    },
    // {
    //     key: paths.EMAIL_INBOX,
    //     description: <Trans i18nKey={langKeys.eMailInbox} />,
    //     path: paths.EMAIL_INBOX,
    //     icon: (className) => <EMailInboxIcon style={{ width: 22, height: 22 }} className={className} />,
    // },
    // {
    //     key: paths.EMAIL_INBOX,
    //     description: <Trans i18nKey={langKeys.eMailInbox} />,
    //     path: paths.EMAIL_INBOX,
    //     icon: (className) => <EMailInboxIcon style={{width: 22, height: 22}} className={className} />,
    // },
    {
        key: paths.MESSAGE_INBOX,
        description: <Trans i18nKey={langKeys.messageInbox} />,
        tooltip: <Trans i18nKey={langKeys.messageInbox} />,
        path: paths.MESSAGE_INBOX,
        icon: (className) => <MessageInboxIcon style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        key: paths.SUPERVISOR,
        description: <Trans i18nKey={langKeys.supervisor} />,
        tooltip: <Trans i18nKey={langKeys.supervisor} />,
        path: paths.SUPERVISOR,
        icon: (className) => <SupervisorIcon style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        key: paths.BILLING_SETUPS,
        description: <Trans i18nKey={langKeys.billingSetup} />,
        tooltip: <Trans i18nKey={langKeys.billingSetup} />,
        path: paths.BILLING_SETUPS,
        icon: (className) => <BillingSetupIcon style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        key: paths.TIMESHEET,
        description: <Trans i18nKey={langKeys.timesheet} />,
        tooltip: <Trans i18nKey={langKeys.timesheet} />,
        path: paths.TIMESHEET,
        icon: (className) => <TimeSheetIcon style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        key: paths.INVOICE,
        description: <Trans i18nKey={langKeys.invoice} />,
        tooltip: <Trans i18nKey={langKeys.invoice} />,
        path: paths.INVOICE,
        icon: (className) => <InvoiceIcon style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        key: paths.CONFIGURATION,
        description: <Trans i18nKey={langKeys.configuration} />,
        tooltip: <Trans i18nKey={langKeys.configuration} />,
        subroute: true,
        path: paths.CONFIGURATION,
        initialSubroute: paths.CONFIGURATION,
        icon: (className) => <ConfigurationIcon style={{ width: 22, height: 22 }} className={className} />,
    },
    // {
    //     key: 'outbound-messages-label',
    //     description: <Trans i18nKey={langKeys.outboundMessage} count={2} />,
    //     tooltip: <Trans i18nKey={langKeys.outboundMessage} count={2} />,
    // },
    {
        key: paths.CORPORATIONS,
        description: <Trans i18nKey={langKeys.corporation_plural} />,
        tooltip: <Trans i18nKey={langKeys.corporation_plural} />,
        subroute: true,
        path: paths.CORPORATIONS,
        initialSubroute: paths.CORPORATIONS,
        icon: (className) => <Corporation2Icon style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        key: paths.PARTNERS,
        description: <Trans i18nKey={langKeys.partner} />,
        tooltip: <Trans i18nKey={langKeys.partner} />,
        subroute: true,
        path: paths.PARTNERS,
        initialSubroute: paths.PARTNERS,
        icon: (className) => <Corporation2Icon style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        key: paths.ORGANIZATIONS,
        description: <Trans i18nKey={langKeys.organization_plural} />,
        tooltip: <Trans i18nKey={langKeys.organization_plural} />,
        subroute: true,
        path: paths.ORGANIZATIONS,
        initialSubroute: paths.ORGANIZATIONS,
        icon: (className) => <OrganizationsIcon style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        key: paths.CONFIGURATIONDELIVERY,
        description: <Trans i18nKey={langKeys.configuration} />,
        tooltip: <Trans i18nKey={langKeys.configuration} />,
        subroute: true,
        path: paths.CONFIGURATIONDELIVERY,
        initialSubroute: paths.CONFIGURATIONDELIVERY,
        icon: (className) => <ConfigurationDeliveryIcon style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        key: paths.ORDERLIST,
        description: <Trans i18nKey={langKeys.orderlist} />,
        tooltip: <Trans i18nKey={langKeys.orderlist} />,
        subroute: true,
        path: paths.ORDERLIST,
        initialSubroute: paths.ORDERLIST,
        icon: (className) => <OrdersListIcon style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        key: paths.ORDERINSTORE,
        description: <Trans i18nKey={langKeys.storeorders} />,
        tooltip: <Trans i18nKey={langKeys.storeorders} />,
        subroute: true,
        path: paths.ORDERINSTORE,
        initialSubroute: paths.ORDERINSTORE,
        icon: (className) => <WhitelistIcon style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        key: paths.ORDERSINATTENTION,
        description: <Trans i18nKey={langKeys.attentionorders} />,
        tooltip: <Trans i18nKey={langKeys.attentionorders} />,
        subroute: true,
        path: paths.ORDERSINATTENTION,
        initialSubroute: paths.ORDERSINATTENTION,
        icon: (className) => <OrdersInAttentionIcon style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        key: paths.STORECOVERAGE,
        description: <Trans i18nKey={langKeys.storecoveragearea} />,
        tooltip: <Trans i18nKey={langKeys.storecoveragearea} />,
        subroute: true,
        path: paths.STORECOVERAGE,
        initialSubroute: paths.STORECOVERAGE,
        icon: (className) => <StoreCoverageIcon style={{ width: 22, height: 22 }} className={className} />,
    },    
    {
        key: '/channels',
        description: <Trans i18nKey={langKeys.channel_plural} />,
        tooltip: <Trans i18nKey={langKeys.channel} />,
        subroute: true,
        path: paths.CHANNELS,
        initialSubroute: paths.CHANNELS,
        icon: (className) => <ChannelsIcon style={{ width: 22, height: 22 }} className={className} />,
    },

    {
        key: paths.MESSAGETEMPLATE,
        description: <Trans i18nKey={langKeys.messagetemplate} count={2} />,
        tooltip: <Trans i18nKey={langKeys.messagetemplate} count={2} />,
        path: paths.MESSAGETEMPLATE,
        icon: (className) => <MessageTemplateIcon style={{ width: 22, height: 22, stroke: 'none' }} className={className} />,
    },
    {
        key: paths.CAMPAIGN,
        description: <Trans i18nKey={langKeys.campaign} count={2} />,
        tooltip: <Trans i18nKey={langKeys.campaign} count={2} />,
        path: paths.CAMPAIGN,
        icon: (className) => <OutboundIcon style={{ width: 22, height: 22, stroke: 'none' }} className={className} />,
    },
    {
        key: paths.BOTDESIGNER,
        description: <Trans i18nKey={langKeys.botdesigner} />,
        tooltip: <Trans i18nKey={langKeys.botdesigner} />,
        path: paths.BOTDESIGNER,
        icon: (className) => <BotDesignerIcon style={{ width: 22, height: 22, stroke: 'none' }} className={className} />,
    },
    {
        key: paths.ASSISTANT,
        description: <Trans i18nKey={langKeys.assistant} />,
        tooltip: <Trans i18nKey={langKeys.assistant} />,
        path: paths.ASSISTANT,
        icon: (className) => <BotDesignerIcon style={{ width: 22, height: 22, stroke: 'none' }} className={className} />,
    },
  
    // {
    //     key: 'ia-services-label',
    //     description: <Trans i18nKey={langKeys.iaservices} count={2} />,
    //     tooltip: <Trans i18nKey={langKeys.iaservices} count={2} />,
    // },
    {
        key: paths.INTELLIGENTMODELS,
        description: <Trans i18nKey={langKeys.iaModel} count={2} />,
        tooltip: <Trans i18nKey={langKeys.iaModel} count={2} />,
        path: paths.INTELLIGENTMODELS,
        icon: (className) => <AIModelsIcon style={{ width: 22, height: 22, stroke: 'none' }} className={className} />,
    },
    {
        key: paths.IASERVICES,
        //description: <Trans i18nKey={langKeys.ia} />,
        //tooltip: <Trans i18nKey={langKeys.ia} />,
        description: <Trans i18nKey={langKeys.laraigoia} />,
        tooltip: <Trans i18nKey={langKeys.laraigoia} />,
        path: paths.IASERVICES,
        //icon: (className) => <IAServicesIcon style={{ width: 22, height: 22, stroke: 'none' }} className={className} />,
        icon: (className) => <IALaraigoLogo style={{ width: 22, height: 22, opacity: 0.8 }} className={className} />,
    },
    // {
    //     key: paths.EXTRAS,
    //     description: <Trans i18nKey={langKeys.extra} count={2} />,
    //     path: paths.EXTRAS,
    //     subroute: true,
    //     initialSubroute: paths.USERS,
    //     icon: (className) => <ExtrasIcon style={{width: 22, height: 22}} className={className} />,
    // },
    {
        key: paths.TIPIFICATIONS,
        description: <Trans i18nKey={langKeys.tipification_plural} count={2} />,
        tooltip: "",
        path: paths.TIPIFICATIONS,
        icon: (className) => <ClassificationIcon style={{ width: 22, height: 22, opacity: 0.8}} className={className} />,
    },
    {
        key: paths.INTEGRATIONMANAGER,
        description: <Trans i18nKey={langKeys.integrationmanager_plural} count={2} />,
        tooltip: "",
        path: paths.INTEGRATIONMANAGER,
        icon: (className) => <IntegrationIcon style={{ width: 22, height: 22, opacity: 0.8}} className={className} />,
    },
    {
        key: paths.PROPERTIES,
        description: <Trans i18nKey={langKeys.property} count={2} />,
        tooltip: "",
        path: paths.PROPERTIES,
        icon: (className) => <ConfigPropertiesIcon style={{ width: 22, height: 22, opacity: 0.8}} className={className} />,
    },
    {
        key: paths.DOCUMENTLIBRARY,
        description: <Trans i18nKey={langKeys.documentlibrary} count={2} />,
        tooltip: "",
        path: paths.DOCUMENTLIBRARY,
        icon: (className) => <DocumentLibraryIcon style={{ width: 22, height: 22, opacity: 0.8}} className={className} />,
    },
    {
        key: paths.EXTRASLOCATION,
        description: <Trans i18nKey={langKeys.locations} count={2} />,
        tooltip: "",
        path: paths.EXTRASLOCATION,
        icon: (className) => <LocationIcon style={{ width: 22, height: 22, opacity: 0.8}} className={className} />,
    },
    {
        key: paths.VARIABLECONFIGURATION,
        description: <Trans i18nKey={langKeys.variableconfiguration_plural} count={2} />,
        tooltip: <Trans i18nKey={langKeys.variableconfiguration} />,
        path: paths.VARIABLECONFIGURATION,
        icon: (className) => <ExtrasIcon style={{ width: 22, height: 22, opacity: 0.8}} className={className}  />,
    },
    {
        key: paths.USERS,
        description: <Trans i18nKey={langKeys.user_plural} />,
        tooltip: "",
        path: paths.USERS,
        icon: (className) => <UserGroupIcon style={{ width: 22, height: 22, opacity: 0.8}} className={className} />,
    },
   
    {
        key: paths.GROUPCONFIG,
        description: <Trans i18nKey={langKeys.groupconfig} />,
        tooltip: "",
        path: paths.GROUPCONFIG,
        icon: (className) => <QuickReplyIcon style={{ width: 22, height: 22, opacity: 0.8}} className={className} />,
    },
    {
        key: paths.QUICKREPLIES,
        description: <Trans i18nKey={langKeys.quickreplies} />,
        tooltip: "",
        path: paths.QUICKREPLIES,
        icon: (className) => <QuickReplyIcon style={{ width: 22, height: 22, opacity: 0.8}} className={className} />,
    },
    {
        key: paths.INPUTVALIDATION,
        description: <Trans i18nKey={langKeys.inputvalidation} />,
        tooltip: "",
        path: paths.INPUTVALIDATION,
        icon: (className) => <InputIcon style={{ width: 22, height: 22, opacity: 0.8}} className={className} />,
    },
    {
        key: paths.INAPPROPRIATEWORDS,
        description: <Trans i18nKey={langKeys.inappropriatewords} />,
        tooltip: "",
        path: paths.INAPPROPRIATEWORDS,
        icon: (className) => <ForbiddenWordsIcon style={{ width: 22, height: 22, opacity: 0.8}} className={className} />,
    },
    {
        key: paths.INTELLIGENTMODELS,
        description: <Trans i18nKey={langKeys.intelligentmodels} count={2} />,
        tooltip: "",
        path: paths.INTELLIGENTMODELS,
        icon: (className) => <ExtrasIcon style={{ width: 22, height: 22, opacity: 0.8}} className={className} />,
    },
    
    {
        key: paths.SLA,
        description: <Trans i18nKey={langKeys.sla} count={2} />,
        tooltip: "",
        path: paths.SLA,
        icon: (className) => <SLAIcon style={{ width: 22, height: 22, opacity: 0.8}} className={className} />,
    },
    {
        key: paths.DOMAINS,
        description: <Trans i18nKey={langKeys.domain_plural} count={2} />,
        tooltip: "",
        path: paths.DOMAINS,
        icon: (className) => <DomainsIcon style={{ width: 22, height: 22, opacity: 0.8}} className={className} />,
    },
    {
        key: paths.WHITELIST,
        description: <Trans i18nKey={langKeys.whitelist} count={2} />,
        tooltip: "",
        path: paths.WHITELIST,
        icon: (className) => <WhitelistIcon style={{ width: 22, height: 22, opacity: 0.8}} className={className} />,
    },
    {
        key: paths.SECURITYRULES,
        description: <Trans i18nKey={langKeys.securityrules} />,
        tooltip: <Trans i18nKey={langKeys.securityrules} />,
        path: paths.SECURITYRULES,
        icon: (className) => <LockOpenIcon style={{ width: 22, height: 22, stroke: 'none' }} className={className} />,
    },
    
    {
        key: '/person',
        description: <Trans i18nKey={langKeys.person_plural} count={2} />,
        tooltip: "",
        path: paths.PERSON,
        icon: (className) => <ExtrasIcon style={{ width: 22, height: 22, opacity: 0.8}} className={className} />,
    },
    {
        key: paths.MESSAGETEMPLATE,
        description: <Trans i18nKey={langKeys.messagetemplate_plural} count={2} />,
        tooltip: "",
        path: paths.MESSAGETEMPLATE,
        icon: (className) => <ExtrasIcon style={{ width: 22, height: 22, opacity: 0.8}} className={className} />,
    },
   
    {
        key: paths.CAMPAIGN,
        description: <Trans i18nKey={langKeys.campaign} count={2} />,
        tooltip: "",
        path: paths.CAMPAIGN,
        icon: (className) => <ExtrasIcon style={{ width: 22, height: 22, opacity: 0.8}} className={className} />,
    },
    {
        key: paths.BOTDESIGNER,
        description: <Trans i18nKey={langKeys.botdesigner} count={2} />,
        tooltip: "",
        path: paths.BOTDESIGNER,
        icon: (className) => <ExtrasIcon style={{ width: 22, height: 22, opacity: 0.8}} className={className} />,
    },
    {
        key: paths.VARIABLECONFIGURATION,
        description: <Trans i18nKey={langKeys.variableconfiguration_plural} count={2} />,
        tooltip: "",
        path: paths.VARIABLECONFIGURATION,
        icon: (className) => <ExtrasIcon style={{ width: 22, height: 22, opacity: 0.8}} className={className} />,
    },
    {
        key: paths.EMOJIS,
        description: <Trans i18nKey={langKeys.restrictedEmoji} count={2} />,
        tooltip: "",
        path: paths.EMOJIS,
        icon: (className) => <EmojiSadFaceIcon style={{ width: 22, height: 22, opacity: 0.8}} className={className} />,
    },
    {
        key: paths.IACONECTORS,
        description: <Trans i18nKey={langKeys.connectors} />,
        tooltip: <Trans i18nKey={langKeys.iaconnectors} />,
        subroute: true,
        path: paths.IACONECTORS,
        initialSubroute: paths.IACONECTORS,
        icon: (className) => <ConectivityIARouteIcon style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        key: paths.IACONFIGURATION,
        description: <Trans i18nKey={langKeys.iaconfiguration} />,
        tooltip: <Trans i18nKey={langKeys.iaconfiguration} />,
        subroute: true,
        path: paths.IACONFIGURATION,
        initialSubroute: paths.IACONFIGURATION,
        icon: (className) => <ConfiguratuinIARouteIcon style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        key: paths.IATRAINING,
        description: <Trans i18nKey={langKeys.training} />,
        tooltip: <Trans i18nKey={langKeys.trainingwithai} />,
        subroute: true,
        path: paths.IATRAINING,
        initialSubroute: paths.IATRAINING,
        icon: (className) => <IAEntrenamientoIcon style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        key: paths.PRODUCTMASTER,
        description: <Trans i18nKey={langKeys.productMaster} />,
        tooltip: <Trans i18nKey={langKeys.productMaster} />,
        subroute: true,
        path: paths.PRODUCTMASTER,
        initialSubroute: paths.PRODUCTMASTER,
        icon: (className) => <ProductMasterIcon style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        key: paths.WAREHOUSE,
        description: <Trans i18nKey={langKeys.warehouses} />,
        tooltip: <Trans i18nKey={langKeys.warehouses} />,
        subroute: true,
        path: paths.WAREHOUSE,
        initialSubroute: paths.WAREHOUSE,
        icon: (className) => <WarehouseIcon style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        key: paths.COMPANIES,
        description: <Trans i18nKey={langKeys.company_plural} />,
        tooltip: <Trans i18nKey={langKeys.company_plural} />,
        subroute: true,
        path: paths.COMPANIES,
        initialSubroute: paths.COMPANIES,
        icon: (className) => <CompaniesIcon style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        key: paths.INVENTORY,
        description: <Trans i18nKey={langKeys.inventory} />,
        tooltip: <Trans i18nKey={langKeys.inventory} />,
        subroute: true,
        path: paths.INVENTORY,
        initialSubroute: paths.INVENTORY,
        icon: (className) => <InventoryIcon style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        key: paths.INVENTORYCONSUMPTION,
        description: <Trans i18nKey={langKeys.inventory_consumption} />,
        tooltip: <Trans i18nKey={langKeys.inventory_consumption} />,
        subroute: true,
        path: paths.INVENTORYCONSUMPTION,
        initialSubroute: paths.INVENTORYCONSUMPTION,
        icon: (className) => <InventoryConsumptionIcon style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        key: paths.IATRAINING2,
        description: <Trans i18nKey={langKeys.training} />,
        tooltip: <Trans i18nKey={langKeys.trainingwithai} />,
        subroute: true,
        path: paths.IATRAINING2,
        initialSubroute: paths.IATRAINING2,
        icon: (className) => <IAEntrenamientoIcon style={{ width: 22, height: 22 }} className={className} />,
    },
    {
        key: paths.REASSIGNMENTRULES,
        description: <Trans i18nKey={langKeys.reassignmentrules} />,
        tooltip: "",
        path: paths.REASSIGNMENTRULES,
        icon: (className) => <GroupIcon style={{ width: 22, height: 22, opacity: 0.8}} className={className} />,
    },
];

export const subroutes: RouteConfig[] = [
];