import { RouteConfig } from "@types";
import paths from "common/constants/paths";
import { DashboardIcon, TicketIcon, ReportsIcon, EMailInbocIcon, MessageInboxIcon, BillingSetupIcon, SupervisorIcon, OrganizationIcon, ChannelIcon, ConfigurationIcon, ExtrasIcon } from 'icons';
import { langKeys } from "lang/keys";
import { Trans } from "react-i18next";

const routes: RouteConfig[] = [
    {
        key: paths.DASHBOARD,
        description: <Trans>{langKeys.dashboard}</Trans>,
        path: paths.DASHBOARD,
        icon: (color) => <DashboardIcon stroke={color} fill={color} />,
    },
    {
        key: paths.REPORTS,
        description: <Trans count={2}>{langKeys.report}</Trans>, // prop:count for plural purposes
        path: paths.REPORTS,
        icon: (color) => <ReportsIcon stroke={color} fill={color} />,
    },
    {
        key: paths.TICKETS,
        description: <Trans count={2}>{langKeys.ticket}</Trans>,
        path: paths.TICKETS,
        icon: (color) => <TicketIcon  stroke={color} fill={color} />,
    },
    {
        key: paths.EMAIL_INBOX,
        description: <Trans>{langKeys.eMailInbox}</Trans>,
        path: paths.EMAIL_INBOX,
        icon: (color) => <EMailInbocIcon stroke={color} fill={color} />,
    },
    {
        key: paths.MESSAGE_INBOX,
        description: <Trans>{langKeys.messageInbox}</Trans>,
        path: paths.MESSAGE_INBOX,
        icon: (color) => <MessageInboxIcon stroke={color} fill={color} />,
    },
    {
        key: paths.SUPERVISOR,
        description: <Trans>{langKeys.supervisor}</Trans>,
        path: paths.SUPERVISOR,
        icon: (color) => <SupervisorIcon stroke={color} fill={color} />,
    },
    {
        key: 'system-label',
        description: <Trans>{langKeys.system}</Trans>,
    },
    {
        key: paths.ORGANIZATIONS,
        description: <Trans count={2}>{langKeys.organization}</Trans>,
        path: paths.ORGANIZATIONS,
        icon: (color) => <OrganizationIcon stroke={color} fill={color} />,
    },
    {
        key: paths.CHANNELS,
        description: <Trans count={2}>{langKeys.channel}</Trans>,
        path: paths.CHANNELS,
        icon: (color) => <ChannelIcon stroke={color} fill={color} />,
    },
    {
        key: paths.BILLING_SETUPS,
        description: <Trans>{langKeys.billingSetup}</Trans>,
        path: paths.BILLING_SETUPS,
        icon: (color) => <BillingSetupIcon stroke={color} fill={color} />,
    },
    {
        key: paths.CONFIGURATION,
        description: <Trans>{langKeys.configuration}</Trans>,
        path: paths.CONFIGURATION,
        icon: (color) => <ConfigurationIcon stroke={color} fill={color} />,
    },
    {
        key: paths.EXTRAS,
        description: <Trans count={2}>{langKeys.extra}</Trans>,
        path: paths.EXTRAS,
        icon: (color) => <ExtrasIcon stroke={color} fill={color} />,
    },
];

export default routes;
