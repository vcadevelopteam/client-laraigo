import { SvgIcon } from "@material-ui/core";
import { RouteConfig } from "@types";
import { icons } from "common/constants";
import paths from "common/constants/paths";
import { DashboardIcon, TicketIcon, ReportsIcon, EMailInbocIcon, MessageInboxIcon, BillingSetupIcon, SupervisorIcon, OrganizationIcon, ChannelIcon, ConfigurationIcon, ExtrasIcon } from 'icons';

const routes: RouteConfig[] = [
    {
        description: 'Dashboard',
        path: paths.DASHBOARD,
        icon: (color) => <DashboardIcon stroke={color} fill={color} />,
    },
    {
        description: 'Reports',
        path: paths.REPORTS,
        icon: (color) => <ReportsIcon stroke={color} fill={color} />,
    },
    {
        description: 'Tickets',
        path: paths.TICKETS,
        icon: (color) => <TicketIcon  stroke={color} fill={color} />,
    },
    {
        description: 'E-Mail Inbox',
        path: paths.EMAIL_INBOX,
        icon: (color) => <EMailInbocIcon stroke={color} fill={color} />,
    },
    {
        description: 'Message Inbox',
        path: paths.MESSAGE_INBOX,
        icon: (color) => <MessageInboxIcon stroke={color} fill={color} />,
    },
    {
        description: 'Supervisor',
        path: paths.SUPERVISOR,
        icon: (color) => <SupervisorIcon stroke={color} fill={color} />,
    },
    {
        description: "System",
    },
    {
        description: 'Organizations',
        path: paths.ORGANIZATIONS,
        icon: (color) => <OrganizationIcon stroke={color} fill={color} />,
    },
    {
        description: 'Channels',
        path: paths.CHANNELS,
        icon: (color) => <ChannelIcon stroke={color} fill={color} />,
    },
    {
        description: 'Billing Setups',
        path: paths.BILLING_SETUPS,
        icon: (color) => <BillingSetupIcon stroke={color} fill={color} />,
    },
    {
        description: 'Configuration',
        path: paths.CONFIGURATION,
        icon: (color) => <ConfigurationIcon stroke={color} fill={color} />,
    },
    {
        description: 'Extras',
        path: paths.EXTRAS,
        icon: (color) => <ExtrasIcon stroke={color} fill={color} />,
    },
];

export default routes;
