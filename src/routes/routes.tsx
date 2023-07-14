import { ViewsClassificationConfig, RouteConfig } from "@types";
import paths from "common/constants/paths";
import {
    DashboardIcon, TicketIcon, ReportsIcon, MessageInboxIcon, SupervisorIcon, ConfigurationIcon, ExtrasIcon,
    BotDesignerIcon, BillingSetupIcon, InvoiceIcon,
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
} from 'icons';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { langKeys } from "lang/keys";
import { Trans } from "react-i18next";

export const viewsClassifications: ViewsClassificationConfig[] = [
    {
        key: "analytics",
        description: <Trans i18nKey={langKeys.analytics} />,
        tooltip: <Trans i18nKey={langKeys.analytics} />,
        icon: (className) => <DashboardIcon style={{ width: 22, height: 22 }} className={className} />,
        options: [paths.DASHBOARD,paths.REPORTS,paths.KPIMANAGER]
    },
    {
        key: "crm",
        description: <Trans i18nKey={langKeys.crm} />,
        tooltip: <Trans i18nKey={langKeys.crm} />,
        icon: (className) => <ReportsIcon style={{ width: 22, height: 22 }} className={className} />,
        options: [paths.MESSAGE_INBOX,paths.SUPERVISOR,paths.PERSON, paths.CRM, paths.CAMPAIGN, paths.MESSAGETEMPLATE, paths.POSTCREATOR, paths.TICKETS]
    },
    {
        key: "automatization",
        description: <Trans i18nKey={langKeys.automatization}/>,
        tooltip: <Trans i18nKey={langKeys.automatization}/>,
        icon: (className) => <EnvioIcon style={{ width: 22, height: 22 }} className={className} />,
        options:[paths.BOTDESIGNER, paths.VARIABLECONFIGURATION, paths.INTEGRATIONMANAGER, paths.CALENDAR, paths.AUTOMATIZATIONRULES, paths.REPORTSCHEDULER]
    },
    {
        key: "sales",
        description: <Trans i18nKey={langKeys.reason_sales} />,
        tooltip: <Trans i18nKey={langKeys.reason_sales} />,
        icon: (className) => <KPIIcon style={{ width: 22, height: 22, stroke: 'none' }} className={className} />,
        options: [paths.ORDERS,paths.PRODUCTCATALOG,paths.CATALOGMASTER]
    },
    {
        key: "servicedesk",
        description: <Trans i18nKey={langKeys.servicedesk} />,
        tooltip: <Trans i18nKey={langKeys.servicedesk} />,
        icon: (className) => <CalendaryIcon style={{ width: 22, height: 22, stroke: 'none' }} className={className} />,
        options: [paths.SERVICE_DESK,paths.SLA]
    },
    {
        key: "ia",
        description: <Trans i18nKey={langKeys.ia} />, // prop:count for plural purposes
        tooltip: <Trans i18nKey={langKeys.ia} />,
        icon: (className) => <PostCreatorIcon style={{ width: 22, height: 22 }} className={className} />,
        options: [paths.INTELLIGENTMODELS,paths.IASERVICES]
    },
    {
        key: "configuration",
        description: <Trans i18nKey={langKeys.configuration} />,
        tooltip: <Trans i18nKey={langKeys.configuration} />,
        icon: (className) => <TicketIcon style={{ width: 22, height: 22 }} className={className} />,
        options: [paths.CORPORATIONS, paths.DOMAINS, paths.ORGANIZATIONS, paths.EMOJIS, paths.CHANNELS, paths.INAPPROPRIATEWORDS, paths.USERS, paths.INTEGRATIONMANAGER,paths.QUICKREPLIES,
        paths.TIPIFICATIONS, paths.INPUTVALIDATION,paths.WHITELIST, paths.EXTRASLOCATION, paths.SECURITYRULES,paths.PROPERTIES, paths.BILLING_SETUPS, paths.INVOICE]
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
    {
        key: paths.VARIABLECONFIGURATION,
        description: <Trans i18nKey={langKeys.variableconfiguration_plural} count={2} />,
        tooltip: <Trans i18nKey={langKeys.variableconfiguration} />,
        path: paths.VARIABLECONFIGURATION,
        icon: (color) => <ExtrasIcon stroke={color} fill={color} />,
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
        icon: (className) => <IALaraigoLogo style={{ width: 22, height: 22, opacity: 0.8}} className={className} />,
    },
    // {
    //     key: paths.EXTRAS,
    //     description: <Trans i18nKey={langKeys.extra} count={2} />,
    //     path: paths.EXTRAS,
    //     subroute: true,
    //     initialSubroute: paths.USERS,
    //     icon: (className) => <ExtrasIcon style={{width: 22, height: 22}} className={className} />,
    // },
];

export const subroutes: RouteConfig[] = [
    {
        key: paths.USERS,
        description: <Trans i18nKey={langKeys.user} />,
        tooltip: "",
        path: paths.USERS,
    },
    {
        key: paths.PROPERTIES,
        description: <Trans i18nKey={langKeys.property} count={2} />,
        tooltip: "",
        path: paths.PROPERTIES,
    },
    {
        key: paths.GROUPCONFIG,
        description: <Trans i18nKey={langKeys.groupconfig} />,
        tooltip: "",
        path: paths.GROUPCONFIG,
    },
    {
        key: paths.QUICKREPLIES,
        description: <Trans i18nKey={langKeys.quickreplies} />,
        tooltip: "",
        path: paths.QUICKREPLIES,
    },
    {
        key: paths.INPUTVALIDATION,
        description: <Trans i18nKey={langKeys.inputvalidation} />,
        tooltip: "",
        path: paths.INPUTVALIDATION,
    },
    {
        key: paths.INAPPROPRIATEWORDS,
        description: <Trans i18nKey={langKeys.inappropriatewords} />,
        tooltip: "",
        path: paths.INAPPROPRIATEWORDS,
    },
    {
        key: paths.INTELLIGENTMODELS,
        description: <Trans i18nKey={langKeys.intelligentmodels} count={2} />,
        tooltip: "",
        path: paths.INTELLIGENTMODELS,
        icon: (color) => <ExtrasIcon stroke={color} fill={color} />,
    },
    {
        key: paths.TIPIFICATIONS,
        description: <Trans i18nKey={langKeys.tipification_plural} count={2} />,
        tooltip: "",
        path: paths.TIPIFICATIONS,
        icon: (color) => <ExtrasIcon stroke={color} fill={color} />,
    },
    {
        key: paths.SLA,
        description: <Trans i18nKey={langKeys.sla} count={2} />,
        tooltip: "",
        path: paths.SLA,
        icon: (color) => <ExtrasIcon stroke={color} fill={color} />,
    },
    {
        key: paths.DOMAINS,
        description: <Trans i18nKey={langKeys.domain_plural} count={2} />,
        tooltip: "",
        path: paths.DOMAINS,
        icon: (color) => <ExtrasIcon stroke={color} fill={color} />,
    },
    {
        key: paths.WHITELIST,
        description: <Trans i18nKey={langKeys.whitelist} count={2} />,
        tooltip: "",
        path: paths.WHITELIST,
        icon: (color) => <ExtrasIcon stroke={color} fill={color} />,
    },
    {
        key: paths.SECURITYRULES,
        description: <Trans i18nKey={langKeys.securityrules} />,
        tooltip: <Trans i18nKey={langKeys.securityrules} />,
        path: paths.SECURITYRULES,
        icon: (className) => <LockOpenIcon style={{ width: 22, height: 22, stroke: 'none' }} className={className} />,
    },
    {
        key: paths.EXTRASLOCATION,
        description: <Trans i18nKey={langKeys.location} count={2} />,
        tooltip: "",
        path: paths.EXTRASLOCATION,
        icon: (color) => <ExtrasIcon stroke={color} fill={color} />,
    },
    {
        key: paths.PERSON,
        description: <Trans i18nKey={langKeys.person_plural} count={2} />,
        tooltip: "",
        path: paths.PERSON,
        icon: (color) => <ExtrasIcon stroke={color} fill={color} />,
    },
    {
        key: paths.MESSAGETEMPLATE,
        description: <Trans i18nKey={langKeys.messagetemplate_plural} count={2} />,
        tooltip: "",
        path: paths.MESSAGETEMPLATE,
        icon: (color) => <ExtrasIcon stroke={color} fill={color} />,
    },
    {
        key: paths.INTEGRATIONMANAGER,
        description: <Trans i18nKey={langKeys.integrationmanager_plural} count={2} />,
        tooltip: "",
        path: paths.INTEGRATIONMANAGER,
        icon: (color) => <ExtrasIcon stroke={color} fill={color} />,
    },
    {
        key: paths.CAMPAIGN,
        description: <Trans i18nKey={langKeys.campaign} count={2} />,
        tooltip: "",
        path: paths.CAMPAIGN,
        icon: (color) => <ExtrasIcon stroke={color} fill={color} />,
    },
    {
        key: paths.BOTDESIGNER,
        description: <Trans i18nKey={langKeys.botdesigner} count={2} />,
        tooltip: "",
        path: paths.BOTDESIGNER,
        icon: (color) => <ExtrasIcon stroke={color} fill={color} />,
    },
    {
        key: paths.VARIABLECONFIGURATION,
        description: <Trans i18nKey={langKeys.variableconfiguration_plural} count={2} />,
        tooltip: "",
        path: paths.VARIABLECONFIGURATION,
        icon: (color) => <ExtrasIcon stroke={color} fill={color} />,
    },
    {
        key: paths.EMOJIS,
        description: <Trans i18nKey={langKeys.emoji_plural} count={2} />,
        tooltip: "",
        path: paths.EMOJIS,
        icon: (color) => <ExtrasIcon stroke={color} fill={color} />,
    }
];

