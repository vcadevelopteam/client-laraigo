const paths = {
    REPORTSCHEDULER: '/reportscheduler',
    PRODUCTCATALOG: '/productcatalog',
    CATALOGMASTER: '/catalogmaster',
    ORDERS: '/orders',
    DASHBOARD: '/dashboard',
    DASHBOARD_ADD: '/dashboard/add',
    DASHBOARD_EDIT: {
        path: '/dashboard/edit/:id',
        resolve: (id: string | number) => `/dashboard/edit/${id}`,
    },
    DASHBOARD_COPY: '/dashboard/copy',
    DASHBOARD_LAYOUT: {
        path: '/dashboard/layout/:id',
        resolve: (dashboardtemplateid: string | number) => `/dashboard/layout/${dashboardtemplateid}`,
    },
    REPORTS: '/reports',
    REPORTDESIGNER: '/reportdesigner',
    POSTCREATOR: '/postcreator',
    TICKETS: '/tickets',
    EMAIL_INBOX: '/email_inbox',
    MESSAGE_INBOX: '/message_inbox',
    SUPERVISOR: '/supervisor',
    INVOICE: '/invoice',
    CORPORATIONS: '/corporations',
    ORGANIZATIONS: '/organizations',
    SIGNIN: "/sign-in",
    SIGNUPBASIC: "/sign-up/BASIC",
    ASSISTANT: "/assistant",
    SIGNUP: {
        path: "/sign-up/:token",
        resolve: (token: string) => `/sign-up/${token}`,
    },
    CALENDAR_EVENT: {
        path: "/events/:orgid/:eventcode",
        resolve: (orgid: number, eventcode: string) => `/events/${orgid}/${eventcode}`,
    },
    CANCEL_EVENT: {
        path: "/cancelevent/:corpid/:orgid/:calendareventid/:calendarbookinguuid",
        resolve: (corpid: number, orgid: number, calendareventid: number, calendarbookinguuid: string) => `/events/${corpid}/${orgid}/${calendareventid}/${calendarbookinguuid}`,
    },
    CULQI_PAYMENTORDER: {
        path: "/paymentorder/:corpid/:orgid/:ordercode",
        resolve: (corpid: number, orgid: number, ordercode: string) => `/paymentorder/${corpid}/${orgid}/${ordercode}`,
    },
    NIUBIZ_PAYMENTORDER: {
        path: "/paymentorderniubiz/:corpid/:orgid/:ordercode",
        resolve: (corpid: number, orgid: number, ordercode: string) => `/paymentorderniubiz/${corpid}/${orgid}/${ordercode}`,
    },
    NIUBIZ_PAYMENTORDERSTATUS: {
        path: "/paymentorderniubizstatus/:corpid/:orgid/:ordercode",
        resolve: (corpid: number, orgid: number, ordercode: string) => `/paymentorderniubizstatus/${corpid}/${orgid}/${ordercode}`,
    },
    LOCATION: {
        path: "/getLocations/:token",
        resolve: (token: string) => `/getLocations/${token}`,
    },
    PRIVACY: "/privacy",
    AUTOMATIZATIONRULES: "/automatizationrules",
    ACTIVATE_USER: {
        path: '/activateuser/:token',
        resolve: (token: string) => `/activateuser/${token}`
    },
    CHANNELS: '/channels',
    CHANNELS_ADD_FACEBOOK: {
        path: '/channels/:id/add/facebook',
        resolve: (channelId: string | number) => `/channels/${channelId}/add/facebook`,
    },
    CHANNELS_ADD_MESSENGER: {
        path: '/channels/:id/add/messenger',
        resolve: (channelId: string | number) => `/channels/${channelId}/add/messenger`,
    },
    CHANNELS_ADD_INSTAGRAM: {
        path: '/channels/:id/add/instagram',
        resolve: (channelId: string | number) => `/channels/${channelId}/add/instagram`,
    },
    CHANNELS_ADD_INSTAGRAMDM: {
        path: '/channels/:id/add/instagramdm',
        resolve: (channelId: string | number) => `/channels/${channelId}/add/instagramdm`,
    },
    CHANNELS_ADD_WHATSAPP: {
        path: '/channels/:id/add/whatsapp',
        resolve: (channelId: string | number) => `/channels/${channelId}/add/whatsapp`,
    },
    CHANNELS_ADD_TELEGRAM: {
        path: '/channels/:id/add/telegram',
        resolve: (channelId: string | number) => `/channels/${channelId}/add/telegram`,
    },
    CHANNELS_ADD_TWITTER: {
        path: '/channels/:id/add/twitter',
        resolve: (channelId: string | number) => `/channels/${channelId}/add/twitter`,
    },
    CHANNELS_ADD_TWITTERDM: {
        path: '/channels/:id/add/twitterdm',
        resolve: (channelId: string | number) => `/channels/${channelId}/add/twitterdm`,
    },
    CHANNELS_ADD_SMS: {
        path: '/channels/:id/add/sms',
        resolve: (channelId: string | number) => `/channels/${channelId}/add/sms`,
    },
    CHANNELS_ADD_PHONE: {
        path: '/channels/:id/add/phone',
        resolve: (channelId: string | number) => `/channels/${channelId}/add/phone`,
    },
    CHANNELS_ADD_EMAIL: {
        path: '/channels/:id/add/email',
        resolve: (channelId: string | number) => `/channels/${channelId}/add/email`,
    },
    CHANNELS_ADD_ANDROID: {
        path: '/channels/:id/add/ChannelAddAndroid',
        resolve: (channelId: string | number) => `/channels/${channelId}/add/ChannelAddAndroid`,
    },
    CHANNELS_ADD_IOS: {
        path: '/channels/:id/add/ChannelAddIos',
        resolve: (channelId: string | number) => `/channels/${channelId}/add/ChannelAddIos`,
    },
    CHANNELS_ADD: '/channels/add',
    CHANNELS_ADD_CHATWEB: '/channels/add/chatweb',
    CHANNELS_ADD_WEBFORM: '/channels/add/webform',
    CHANNELS_ADD_TIKTOK: {
        path: '/channels/:id/add/ChannelAddTikTok',
        resolve: (channelId: string | number) => `/channels/${channelId}/add/ChannelAddTikTok`,
    },
    CHANNELS_ADD_YOUTUBE: {
        path: '/channels/:id/add/ChannelAddYouTube',
        resolve: (channelId: string | number) => `/channels/${channelId}/add/ChannelAddYouTube`,
    },
    CHANNELS_ADD_BUSINESS: {
        path: '/channels/:id/add/ChannelAddBusiness',
        resolve: (channelId: string | number) => `/channels/${channelId}/add/ChannelAddBusiness`,
    },
    CHANNELS_ADD_LINKEDIN: {
        path: '/channels/:id/add/ChannelAddLinkedIn',
        resolve: (channelId: string | number) => `/channels/${channelId}/add/ChannelAddLinkedIn`,
    },
    CHANNELS_ADD_TEAMS: {
        path: '/channels/:id/add/ChannelAddTeams',
        resolve: (channelId: string | number) => `/channels/${channelId}/add/ChannelAddTeams`,
    },
    CHANNELS_ADD_BLOGGER: {
        path: '/channels/:id/add/ChannelAddBlogger',
        resolve: (channelId: string | number) => `/channels/${channelId}/add/ChannelAddBlogger`,
    },
    CHANNELS_ADD_WHATSAPPONBOARDING: {
        path: '/channels/:id/add/ChannelAddWhatsAppOnboarding',
        resolve: (channelId: string | number) => `/channels/${channelId}/add/ChannelAddWhatsAppOnboarding`,
    },
    CHANNELS_EDIT: {
        path: '/channels/edit/:id',
        resolve: (channelId: string | number) => `/channels/edit/${channelId}`,
    },
    CHANNELS_EDIT_CHATWEB: {
        path: '/channels/edit/:id/chatweb',
        resolve: (channelId: string | number) => `/channels/edit/${channelId}/chatweb`,
    },
    CHANNELS_EDIT_WEBFORM: {
        path: '/channels/edit/:id/webform',
        resolve: (channelId: string | number) => `/channels/edit/${channelId}/webform`,
    },
    CHANNELS_EDIT_WHATSAPP: {
        path: '/channels/edit/:id/whatsapp',
        resolve: (channelId: string | number) => `/channels/edit/${channelId}/whatsapp`,
    },
    BILLING_SETUPS: '/billing_setups',
    CONFIGURATION: '/configuration',
    EXTRAS: '/extras',
    PROPERTIES: '/extras/properties',
    QUICKREPLIES: '/extras/quickreplies',
    USERS: '/extras/users',
    GROUPCONFIG: '/extras/groupconfig',
    WHITELIST: '/extras/whitelist',
    SECURITYRULES: '/extras/securityrules',
    EXTRASLOCATION: '/extras/location',
    USERSETTINGS: '/usersettings',
    INAPPROPRIATEWORDS: '/extras/inappropriatewords',
    INTELLIGENTMODELS: '/extras/intelligentmodels',
    SLA: '/extras/sla',
    DOMAINS: '/extras/domains',
    PERSON: '/extras/person',
    PERSON_DETAIL: {
        path: '/extras/person/:id',
        resolve: (personId: string | number) => `/extras/person/${personId}`,
    },
    MESSAGETEMPLATE: '/extras/messagetemplate',
    TIPIFICATIONS: '/extras/tipifications',
    INPUTVALIDATION: '/extras/inputvalidation',
    INTEGRATIONMANAGER: '/extras/integrationmanager',
    CAMPAIGN: '/extras/campaign',
    BOTDESIGNER: '/extras/botdesigner',
    VARIABLECONFIGURATION: '/extras/variableconfiguration',
    EMOJIS: '/extras/emojis',
    DASHBOARDMANAGERIAL: '/dashboard/dashboardmanagerial',
    DASHBOARDOPERATIONALPUSH: '/dashboard/dashboardoperationalpush',
    HEATMAP: '/dashboard/heatmap',
    RECORDHSMREPORT: '/dashboard/recordhsmreport',
    IASERVICES: '/iaservices',
    // IAMODELS: '/extras/intelligentmodels',
    IA: '/iaservices/ia',

    SETTINGS: '/settings',
    CRM: '/crm',
    CRM_ADD_LEAD: '/crm/leads/add',
    CRM_EDIT_LEAD: {
        path: '/crm/leads/:id',
        resolve: (leadId: string | number) => `/crm/leads/${leadId}`,
    },
    SERVICE_DESK: '/servicedesk',
    SERVICE_DESK_ADD_LEAD: '/servicedesk/leads/add',
    SERVICE_DESK_EDIT_LEAD: {
        path: '/servicedesk/leads/:id',
        resolve: (leadId: string | number) => `/servicedesk/leads/${leadId}`,
    },
    KPIMANAGER: '/kpimanager',
    CALENDAR: '/calendar',
    CHNAGE_PWD_FIRST_LOGIN: '/changePasswordOnFirstLogin',
    RECOVER_PASSWORD: {
        path: '/recoverpassword/:token',
        resolve: (token: string) => `/recoverpassword/${token}`
    },
};

export default paths;
