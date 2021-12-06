import { RouteConfig } from "@types";
import paths from "common/constants/paths";
import {
    DashboardIcon, TicketIcon, ReportsIcon, MessageInboxIcon, SupervisorIcon, ConfigurationIcon, ExtrasIcon,
    BotDesignerIcon, BillingSetupIcon,
    IAServicesIcon,
    OutboundIcon,
    MessageTemplateIcon,
    AIModelsIcon,
    ClientIcon,
    CRMIcon
} from 'icons';
import { langKeys } from "lang/keys";
import { Trans } from "react-i18next";

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
        icon: (className) => <BillingSetupIcon style={{width: 22, height: 22}} className={className} />,
    },
    // {
    //     key: paths.BILLING_SETUPS,
    //     description: <Trans i18nKey={langKeys.billingSetup} />,
    //     path: paths.BILLING_SETUPS,
    //     icon: (className) => <BillingSetupIcon style={{ width: 22, height: 22 }} className={className} />,
    // },
    {
        key: paths.CONFIGURATION,
        description: <Trans i18nKey={langKeys.configuration} />,
        tooltip: <Trans i18nKey={langKeys.configuration} />,
        path: paths.CONFIGURATION,
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
        description: <Trans i18nKey={langKeys.ia} />,
        tooltip: <Trans i18nKey={langKeys.ia} />,
        path: paths.IASERVICES,
        icon: (className) => <IAServicesIcon style={{ width: 22, height: 22, stroke: 'none' }} className={className} />,
    },
    {
        key: paths.CRM,
        description: 'CRM',
        tooltip: 'CRM',
        path: paths.CRM,
        icon: (className) => <CRMIcon style={{ width: 22, height: 22, stroke: 'none' }} className={className} />,
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
        key: paths.WHITELIST,
        description: <Trans i18nKey={langKeys.whitelist} />,
        tooltip: "",
        path: paths.WHITELIST,
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

