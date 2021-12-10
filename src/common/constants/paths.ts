const paths = {
    DASHBOARD: '/dashboard',
    DASHBOARD_ADD: '/dashboard/add',
    DASHBOARD_LAYOUT: {
        path: '/dashboard/layout/:id',
        resolve: (dashboardtemplateid: string | number) => `/dashboard/layout/${dashboardtemplateid}`,
    },
    REPORTS: '/reports',
    REPORTDESIGNER: '/reportdesigner',
    TICKETS: '/tickets',
    EMAIL_INBOX: '/email_inbox',
    MESSAGE_INBOX: '/message_inbox',
    SUPERVISOR: '/supervisor',
    CORPORATIONS: '/corporations',
    ORGANIZATIONS: '/organizations',
    SIGNIN: "/sign-in",
    SIGNUPBASIC: "/sign-up/BASIC",
    SIGNUP: {
        path: "/sign-up/:token",
        resolve: (token: string) => `/sign-up/${token}`,
    },
    PRIVACY: "/privacy",
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
    CHANNELS_EDIT: {
        path: '/channels/edit/:id',
        resolve: (channelId: string | number) => `/channels/edit/${channelId}`,
    },
    CHANNELS_EDIT_CHATWEB: {
        path: '/channels/edit/:id/chatweb',
        resolve: (channelId: string | number) => `/channels/edit/${channelId}/chatweb`,
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
    CRM_ADD_LEAD: {
        path : '/crm/columns/:columnid/uuid/:columnuuid/leads/add',
        resolve: (columnid: string | number, uuid: string) => `/crm/columns/${columnid}/uuid/${uuid}/leads/add`,
    },
    CRM_EDIT_LEAD: {
        path: '/crm/leads/:id',
        resolve: (leadId: string | number) => `/crm/leads/${leadId}`,
    },
    CHNAGE_PWD_FIRST_LOGIN: '/changePasswordOnFirstLogin',
};

export default paths;
