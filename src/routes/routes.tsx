import { RouteConfig } from "@types";
import paths from "common/constants/paths";
import { DashboardIcon, TicketIcon, ReportsIcon, EMailInbocIcon, MessageInboxIcon, BillingSetupIcon, SupervisorIcon, OrganizationIcon, ChannelIcon, ConfigurationIcon, ExtrasIcon } from 'icons';
import { langKeys } from "lang/keys";
import { Trans } from "react-i18next";

const routes: RouteConfig[] = [
    {
        key: paths.DASHBOARD,
        description: <Trans i18nKey={langKeys.dashboard} />,
        path: paths.DASHBOARD,
        icon: (color) => <DashboardIcon stroke={color} fill={color} />,
    },
    {
        key: paths.REPORTS,
        description: <Trans i18nKey={langKeys.report} count={2} />, // prop:count for plural purposes
        path: paths.REPORTS,
        icon: (color) => <ReportsIcon stroke={color} fill={color} />,
    },
    {
        key: paths.TICKETS,
        description: <Trans i18nKey={langKeys.ticket} count={2} />,
        path: paths.TICKETS,
        icon: (color) => <TicketIcon  stroke={color} fill={color} />,
    },
    {
        key: paths.EMAIL_INBOX,
        description: <Trans i18nKey={langKeys.eMailInbox} />,
        path: paths.EMAIL_INBOX,
        icon: (color) => <EMailInbocIcon stroke={color} fill={color} />,
    },
    {
        key: paths.MESSAGE_INBOX,
        description: <Trans i18nKey={langKeys.messageInbox} />,
        path: paths.MESSAGE_INBOX,
        icon: (color) => <MessageInboxIcon stroke={color} fill={color} />,
    },
    {
        key: paths.SUPERVISOR,
        description: <Trans i18nKey={langKeys.supervisor} />,
        path: paths.SUPERVISOR,
        icon: (color) => <SupervisorIcon stroke={color} fill={color} />,
    },
    {
        key: 'system-label',
        description: <Trans i18nKey={langKeys.system} />,
    },
    {
        key: paths.ORGANIZATIONS,
        description: <Trans i18nKey={langKeys.organization} count={2} />,
        path: paths.ORGANIZATIONS,
        icon: (color) => <OrganizationIcon stroke={color} fill={color} />,
    },
    {
        key: paths.CHANNELS,
        description: <Trans i18nKey={langKeys.channel} count={2} />,
        path: paths.CHANNELS,
        icon: (color) => <ChannelIcon stroke={color} fill={color} />,
    },
    {
        key: paths.BILLING_SETUPS,
        description: <Trans i18nKey={langKeys.billingSetup} />,
        path: paths.BILLING_SETUPS,
        icon: (color) => <BillingSetupIcon stroke={color} fill={color} />,
    },
    {
        key: paths.CONFIGURATION,
        description: <Trans i18nKey={langKeys.configuration} />,
        path: paths.CONFIGURATION,
        icon: (color) => <ConfigurationIcon stroke={color} fill={color} />,
    },
    {
        key: paths.EXTRAS,
        description: <Trans i18nKey={langKeys.extra} count={2} />,
        path: paths.EXTRAS,
        icon: (color) => <ExtrasIcon stroke={color} fill={color} />,
    },
    {
        key: paths.USERS,
        description: <Trans i18nKey={langKeys.user} />,
        path: paths.USERS,
        icon: (color) => <ExtrasIcon stroke={color} fill={color} />,
    },
    {
        key: paths.PROPERTIES,
        description: <Trans i18nKey={langKeys.property} count={2} />,
        path: paths.PROPERTIES,
        icon: (color) => <ExtrasIcon stroke={color} fill={color} />,
    },
    {
        key: paths.GROUPCONFIG,
        description: <Trans i18nKey={langKeys.groupconfig} count={2} />,
        path: paths.GROUPCONFIG,
        icon: (color) => <ExtrasIcon stroke={color} fill={color} />,
    },
    {
        key: paths.QUICKREPLIES,
        description: <Trans i18nKey={langKeys.quickreplies} count={2} />,
        path: paths.QUICKREPLIES,
        icon: (color) => <ExtrasIcon stroke={color} fill={color} />,
    },
    {
        key: paths.WHITELIST,
        description: <Trans i18nKey={langKeys.whitelist} count={2} />,
        path: paths.WHITELIST,
        icon: (color) => <ExtrasIcon stroke={color} fill={color} />,
    },
    {
        key: paths.INAPPROPRIATEWORDS,
        description: <Trans i18nKey={langKeys.inappropriatewords} count={2} />,
        path: paths.INAPPROPRIATEWORDS,
        icon: (color) => <ExtrasIcon stroke={color} fill={color} />,
    },
    {
        key: paths.INTELLIGENTMODELS,
        description: <Trans i18nKey={langKeys.intelligentmodels} count={2} />,
        path: paths.INTELLIGENTMODELS,
        icon: (color) => <ExtrasIcon stroke={color} fill={color} />,
    },
    {
        key: paths.SLA,
        description: <Trans i18nKey={langKeys.sla} count={2} />,
        path: paths.SLA,
        icon: (color) => <ExtrasIcon stroke={color} fill={color} />,
    },
];

export default routes;
