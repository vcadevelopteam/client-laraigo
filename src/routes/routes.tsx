import { Dashboard, Report } from "@material-ui/icons";
import { RouteConfig } from "@types";
import paths from "common/constants/paths";
import React from "react";

const routes: RouteConfig[] = [
    {
        description: 'Dashboard',
        path: paths.DASHBOARD,
        icon: (className) => <Dashboard className={className} />,
    },
    {
        description: 'Reports',
        path: paths.REPORTS,
        icon: (className) => <Report className={className} />,
    },
    {
        description: 'Tickets',
        path: paths.TICKETS,
    },
    {
        description: 'E-Mail Inbox',
        path: paths.EMAIL_INBOX,
    },
    {
        description: 'Message Inbox',
        path: paths.MESSAGE_INBOX,
    },
    {
        description: 'Supervisor',
        path: paths.SUPERVISOR,
    },
    {
        description: "System",
    },
    {
        description: 'Organizations',
        path: paths.ORGANIZATIONS,
    },
    {
        description: 'Channels',
        path: paths.CHANNELS,
    },
    {
        description: 'Billing Setups',
        path: paths.BILLING_SETUPS,
    },
    {
        description: 'Configuration',
        path: paths.CONFIGURATION,
    },
    {
        description: 'Extras',
        path: paths.EXTRAS,
    },
];

export default routes;
