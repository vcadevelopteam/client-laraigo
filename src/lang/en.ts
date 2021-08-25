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

    action: 'Action',
    action_plural: 'Actions',

    quantity: 'Quantity',
    quantity_plural: 'quantities',

    validationtext: 'Text Validation',

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

    tablePageOf: 'Page <0>{{currentPage}}</0> of <1>{{totalPages}}</1>',
    tableShowingRecordOf: 'Showing {{itemCount}} records of {{totalItems}}',

    recordPerPage: 'Record per page',
    recordPerPage_plural: 'Records per page',

    successful_transaction: 'Successful transaction',
    successful_edit: 'Edited successfully',
    successful_register: 'Registered successfully',
    successful_delete: 'Deleted successfully',
    quickreplies: 'Quickreplies',
    twofactorauthentication: 'Two factor authentication',
    save: 'Save',
    setpassword: 'Set password',
    cancel: 'Cancel',
    default_application: 'Default application',
    default_organization: 'Default organization',
    password_required: 'Password is required',
    field_required: 'Field is required',
    affirmative: 'Yes',
    negative: 'No',
    organization_by_default: 'You must select a default organization',
    attention_group: 'Attention group',
    register: 'Register',
    download: 'Download',
    back: 'Back',
    continue: 'Continue',
    confirmation: 'Confirmation',
    confirmation_save: 'Are you sure to save the record?',
    confirmation_delete: 'Are you sure to delete the record?',

    error_already_exists_record: '23505: There is already the same {{module}} registered',
    error_parameter_too_long: '22001: There was an error, contact the administrator ',
    error_divison_by_zero: '22012: There was an error, contact the administrator ',
    error_unexpected_db_error: '5003: There was an error, contact the administrator ',
    error_not_function_error: '5002: There was an error, contact the administrator ',
    error_variable_incompatibility_error: '5001: There was an error, contact the administrator ',
    error_unexpected_error: '5000: There was an error, contact the administrator ',
    error_null_not_allowed: '23502: There was an error, contact the administrator ',
    error_function_not_exists: '42883: There was an error, contact the administrator ',

    error_login_user_incorrect: "Incorrect user or password",
    error_login_user_pending: "User pending confirmation",
    error_login_locked_by_attempts_failed_password: "Your user was blocked for exceeding the attempts allowed to",
    error_login_locked_by_inactived: "Your user was blocked for exceeding the allowed days without connecting",
    error_login_locked_by_password_expired: "Your username was blocked because your password expired",
    error_login_locked: "Your user was blocked",
    error_login_user_inactive: "Your username is inactive",
};

const enResource: ResourceLanguage = {
    translation,
};

export default enResource;