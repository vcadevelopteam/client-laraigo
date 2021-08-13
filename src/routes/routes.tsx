import { RouteConfig } from "@types";
import paths from "common/constants/paths";
import { DashboardIcon, TicketIcon, ReportsIcon, EMailInbocIcon, MessageInboxIcon, BillingSetupIcon, SupervisorIcon, OrganizationIcon, ChannelIcon, ConfigurationIcon, ExtrasIcon } from 'icons';
import { langKeys } from "lang/keys";
import { Trans } from "react-i18next";

export const routes: RouteConfig[] = [
    {
        key: paths.DASHBOARD,
        description: <Trans i18nKey={langKeys.dashboard} />,
        path: paths.DASHBOARD,
        icon: (className) => <DashboardIcon className={className} />,
    },
    {
        key: paths.REPORTS,
        description: <Trans i18nKey={langKeys.report} count={2} />, // prop:count for plural purposes
        path: paths.REPORTS,
        icon: (className) => <ReportsIcon className={className} />,
    },
    {
        key: paths.TICKETS,
        description: <Trans i18nKey={langKeys.ticket} count={2} />,
        path: paths.TICKETS,
        icon: (className) => <TicketIcon className={className} />,
    },
    {
        key: paths.EMAIL_INBOX,
        description: <Trans i18nKey={langKeys.eMailInbox} />,
        path: paths.EMAIL_INBOX,
        icon: (className) => <EMailInbocIcon className={className} />,
    },
    {
        key: paths.MESSAGE_INBOX,
        description: <Trans i18nKey={langKeys.messageInbox} />,
        path: paths.MESSAGE_INBOX,
        icon: (className) => <MessageInboxIcon className={className} />,
    },
    {
        key: paths.SUPERVISOR,
        description: <Trans i18nKey={langKeys.supervisor} />,
        path: paths.SUPERVISOR,
        icon: (className) => <SupervisorIcon className={className} />,
    },
    {
        key: 'system-label',
        description: <Trans i18nKey={langKeys.system} />,
    },
    {
        key: paths.ORGANIZATIONS,
        description: <Trans i18nKey={langKeys.organization} count={2} />,
        path: paths.ORGANIZATIONS,
        icon: (className) => <OrganizationIcon className={className} />,
    },
    {
        key: paths.CHANNELS,
        description: <Trans i18nKey={langKeys.channel} count={2} />,
        path: paths.CHANNELS,
        icon: (className) => <ChannelIcon className={className} />,
    },
    {
        key: paths.BILLING_SETUPS,
        description: <Trans i18nKey={langKeys.billingSetup} />,
        path: paths.BILLING_SETUPS,
        icon: (className) => <BillingSetupIcon className={className} />,
    },
    {
        key: paths.CONFIGURATION,
        description: <Trans i18nKey={langKeys.configuration} />,
        path: paths.CONFIGURATION,
        icon: (className) => <ConfigurationIcon className={className} />,
    },
    {
        key: paths.EXTRAS,
        description: <Trans i18nKey={langKeys.extra} count={2} />,
        path: paths.EXTRAS,
        subroute: true,
        initialSubroute: paths.USERS,
        icon: (className) => <ExtrasIcon className={className} />,
    },
];

export const subroutes: RouteConfig[] = [
    {
        key: paths.USERS,
        description: <Trans i18nKey={langKeys.user} />,
        path: paths.USERS,
    },
    {
        key: paths.PROPERTIES,
        description: <Trans i18nKey={langKeys.property} count={2} />,
        path: paths.PROPERTIES,
    },
    {
        key: paths.GROUPCONFIG,
        description: <Trans i18nKey={langKeys.groupconfig} />,
        path: paths.GROUPCONFIG,
    },
    {
        key: paths.QUICKREPLIES,
        description: <Trans i18nKey={langKeys.quickreplies} />,
        path: paths.QUICKREPLIES,
    },
    {
        key: paths.WHITELIST,
        description: <Trans i18nKey={langKeys.whitelist} />,
        path: paths.WHITELIST,
    },
    {
        key: paths.INAPPROPRIATEWORDS,
        description: <Trans i18nKey={langKeys.inappropriatewords} />,
        path: paths.INAPPROPRIATEWORDS,
    },
];
