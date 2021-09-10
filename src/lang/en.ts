import { ResourceLanguage } from 'i18next';
import { LangKeys } from './keys';

const translation: LangKeys = {
    dashboard: 'Dashboard',
    dashboard_plural: 'Dashboards',

    organization: 'Organization',
    organization_plural: 'Organizations',

    ticket: 'Ticket',
    ticket_plural: 'Tickets',

    billingSetup: 'Billing Setup',
    billingSetup_plural: 'Billing setups',
    
    channel: 'Channel',
    channel_plural: 'Channels',

    configuration: 'Configuration',
    configuration_plural: 'Configurations',

    eMailInbox: 'E-Mail inbox',

    extra: 'Extra',
    extra_plural: 'Extras',
    
    messageInbox: 'Message inbox',

    report: 'Report',
    report_plural: 'Reports',

    supervisor: 'Supervisor',
    supervisor_plural: 'Supervisors',

    system: 'System',
    system_plural: 'Systems',

    online: 'Online',
    offline: 'Offline',
    logIn: 'Log in',
    newRegisterMessage: 'Don\'t have an account? Sign up',
    signoff: 'Sign Off',

    changePassword: 'Change password',

    user: 'User',
    user_plural: 'Users',

    property: 'Property',
    property_plural: 'Properties',

    groupconfig: "Group Configuration",

    firstname: 'Firstname',
    lastname: 'Lastname',
    email: 'Email',
    address: 'Address',
    department: 'Department',
    phone: 'Phone',

    lastConnection: 'Last Connection',
    ticketCreatedOn: 'Ticket Created On',

    company: 'Company',

    billingGroup: 'Billing group',
    registerCode: 'Register code',
    docNumber: 'Document number',
    docType: 'Document type',
    doubleAuthentication: 'Double authentication',
    label:"Label",
    group: 'Group',
    group_plural: 'Groups',
    code:'Code',
    bydefault: 'Default Value',
    quickreply: 'Quickreply',
    review: 'Review',
    domain: 'Domain',
    classification: 'Classification',
    domain_plural: 'Domains',
    valuelist:'Values list',
    documenttype: 'Document type',
    documentnumber: 'Document number',
    usergroup: 'User group',
    inappropriatewords: 'Inappropriate words',
    intelligentmodels: 'Intelligent models',
    endpoint: 'Endpoint',
    modelid:'Model ID',
    apikey: 'API Key',
    provider: 'Supplier',
    sla: 'Service level agreement',
    communicationchanneldesc:'Channel name',
    communicationchannel:'Communication channel',
    tme:'TME',
    tmepercentobj: 'TME% objetive',
    tmopercentobj: 'TMO% objetive',
    usertme:'TME user',
    usertmepercentmax:'TME% user objetive',
    usertmo:'TMO user',
    usertmopercentmax:'TMO% user objetive',
    person: 'Person',
    person_plural: 'People',
    summarize:'Summarize',
    detail:'Detail',
    detail_plural:'Details',
    whitelist: 'Whitelist',
    newuser: "New user",
    newdomain: "New domain",
    newgroupconfig: "New group configuration",
    newinnapropiateword: "New innapropiate word",
    newintelligentmodel: "New intelligent model",
    newproperty: "New property",
    newquickreply: "New quickreply",
    newsla: "New service level agreement",
    newwhitelist: "New whitelist",
    registervalue: "Register value",
    neworganization: "New organization",
    productivitybyhour:'Productivity by hour',
    title:'Title',
    action: 'Action',
    action_plural: 'Actions',
    parent:'Parent',
    quantity: 'Quantity',
    quantity_plural: 'quantities',
    tag:'Tag',
    validationtext: 'Text Validation',
    completedesc: 'Complete description',
    actionplan:'Action plan',
    role: 'Role',
    role_plural: 'Roles',

    status: 'Status',
    status_plural: 'States',

    type: 'Type',
    type_plural: 'Types',

    corporation: 'Corporation',
    corporation_plural: 'Corporations',

    name: 'Name',
    name_plural: 'Names',

    username: 'Username',
    password: 'Password',
    confirmpassword: 'Confirm password',

    value: 'Value',
    value_plural: 'Values',

    description: 'Description',
    description_plural: 'Descriptions',

    active: 'Active',
    inactive: 'Inactive',

    editRecord: 'Edit record',
    deleteRecord: 'Delete record',
    changeDate: 'Change date',

    edit: 'Editar',
    delete: 'Eliminar',
    search: 'Search',
    organizationclass: "Organization of Classifications",
    tablePageOf: 'Page <0>{{currentPage}}</0> of <1>{{totalPages}}</1>',
    tableShowingRecordOf: 'Showing {{itemCount}} records of {{totalItems}}',
    tipification: 'Tipification',
    tipification_plural: 'Tipifications',
    recordPerPage: 'Record per page',
    recordPerPage_plural: 'Records per page',
    return: "Return",

    supplier:"Supplier",
    id: 'Id',
    newmessagetemplate: 'New Message Template',
    messagetemplate: 'Message Template',
    messagetemplate_plural: 'Message Templates',
    creationdate: 'Creation Date',
    messagetype: 'Message Type',
    sms: 'SMS',
    hsm: 'HSM',
    namespace: 'Namespace',
    category: 'Category',
    language: 'Language',
    templatetype: 'Template Type',
    templatestandard: 'Standard (text only)',
    templatemultimedia: 'Media & Interactive',
    header: 'Header',
    headertype: 'Header Type',
    text: 'Text',
    image: 'Image',
    document: 'Document',
    video: 'Video',
    body: 'Body',
    footer: 'Footer',
    buttons: 'Buttons',
    payload: 'Payload',
    message: 'Mensaje',
    addbutton: 'Add button',
    removebutton: 'Remove button',
    
    integrationmanager: 'Integration Manager',
    integrationmanager_plural: 'Integration Manager',
    newintegrationmanager: 'New Integration Manager',
    requesttype: 'Request Type',
    url: 'Url',
    authorization: 'Authorization',
    token: 'Token',
    key: 'Key',
    addheader: 'Add header',
    addparameter: 'Add parameter',
    bodytype: 'Body Type',
    level: 'Level',
    tablelayout: 'Table Layout',
    fields: 'Fields',
    addfield: 'Add field',
    order: 'Order',
    beautify: 'Beautify',
    invalidjson: 'Invalid json',
    test: 'Test',
    result: 'Result',

    flowdesigner: 'Flow designer',
    
    variable:"Variable",
    successful_transaction: 'Successful transaction',
    successful_edit: 'Edited successfully',
    successful_register: 'Registered successfully',
    successful_delete: 'Deleted successfully',
    quickreplies: 'Quickreplies',
    twofactorauthentication: 'Two factor authentication',
    save: 'Save',
    setpassword: 'Set password',
    select: "Select",
    data:"Data",
    cancel: 'Cancel',
    default_application: 'Default application',
    default_organization: 'Default organization',
    password_required: 'Password is required',
    field_required: 'Field is required',
    field_duplicate: 'Field duplicate',
    field_startwithchar: 'Field must start with a letter',
    field_basiclatinlowercase: 'Field must contain only basic Latin lowercase or digits',
    affirmative: 'Yes',
    negative: 'No',
    organization_by_default: 'You must select a default organization',
    attention_group: 'Attention group',
    register: 'Register',
    download: 'Download',
    import: 'Import',
    back: 'Back',
    continue: 'Continue',
    confirmation: 'Confirmation',
    confirmation_save: 'Are you sure to save the record?',
    confirmation_delete: 'Are you sure to delete the record?',
    login_with_facebook: 'Login with Facebook',
    login_with_google: 'Login with Google',

    hasactionplan:'Has action plan',
    error_already_exists_record: '23505: There is already the same {{module}} registered',
    error_parameter_too_long: '22001: There was an error, contact the administrator ',
    error_divison_by_zero: '22012: There was an error, contact the administrator ',
    error_unexpected_db_error: '5003: There was an error, contact the administrator ',
    error_not_function_error: '5002: There was an error, contact the administrator ',
    error_variable_incompatibility_error: '5001: There was an error, contact the administrator ',
    error_unexpected_error: '5000: There was an error, contact the administrator ',
    error_null_not_allowed: '23502: There was an error, contact the administrator ',
    error_function_not_exists: '42883: There was an error, contact the administrator ',
    error_parameter_is_missing: "5004: There was an error, contact the administrator",
    dateRangeFilterTitle: 'Filter by date range',

    apply: 'Apply',
    close: 'Close',

    today: 'Today',
    yesterday: 'Yesterday',
    thisWeek: 'This Week',
    lastWeek: 'Last Week',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    daysUpToToday: 'days up to today',
    daysStartingToday: 'days starting today',

    error_login_user_incorrect: "Incorrect user or password",
    error_login_user_pending: "User pending confirmation",
    error_login_locked_by_attempts_failed_password: "Your user was blocked for exceeding the attempts allowed to",
    error_login_locked_by_inactived: "Your user was blocked for exceeding the allowed days without connecting",
    error_login_locked_by_password_expired: "Your username was blocked because your password expired",
    error_login_locked: "Your user was blocked",
    error_login_user_inactive: "Your username is inactive",
    error_login_no_integration: "There is no registered user integrated to that account",

    all_adivisers: "All advisers",
    conected: "Conected",
    disconected: "Disconected",
    closed: "Closed",
    paused: "Paused",
    pending: "Pending",
    assigned: "Assigned",
    created_on: "Created on",
    closed_on: "Closed on",
    close_ticket: "Close ticket",
    client_detail: "Client detail",
};

const enResource: ResourceLanguage = {
    translation,
};

export default enResource;
