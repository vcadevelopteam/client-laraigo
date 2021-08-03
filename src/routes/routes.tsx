import { Dashboard, Report, Email, Message, Person, Receipt, Apartment, Equalizer, CreditCard, Tune } from "@material-ui/icons";
import { RouteConfig } from "@types";
import paths from "common/constants/paths";

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
        icon: (className) => <Receipt className={className} />,
    },
    {
        description: 'E-Mail Inbox',
        path: paths.EMAIL_INBOX,
        icon: (className) => <Email className={className} />,
    },
    {
        description: 'Message Inbox',
        path: paths.MESSAGE_INBOX,
        icon: (className) => <Message className={className} />,
    },
    {
        description: 'Supervisor',
        path: paths.SUPERVISOR,
        icon: (className) => <Person className={className} />,
    },
    {
        description: "System",
    },
    {
        description: 'Organizations',
        path: paths.ORGANIZATIONS,
        icon: (className) => <Apartment className={className} />,
    },
    {
        description: 'Channels',
        path: paths.CHANNELS,
        icon: (className) => <Equalizer className={className} />,
    },
    {
        description: 'Billing Setups',
        path: paths.BILLING_SETUPS,
        icon: (className) => <CreditCard className={className} />,
    },
    {
        description: 'Configuration',
        path: paths.CONFIGURATION,
        icon: (className) => <Tune className={className} />,
    },
    {
        description: 'Extras',
        path: paths.EXTRAS,
        icon: (className) => <Person className={className} />,
    },
];

export default routes;
