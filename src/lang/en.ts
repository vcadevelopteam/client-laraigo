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

    group: 'Group',
    group_plural: 'Groups',

    domain: 'Domain',
    documenttype: 'Document type',
    documentnumber: 'Document number',
    usergroup: 'User group',
    inappropriatewords: 'Inappropriate words',

    whitelist: 'Whitelist',

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

    tablePageOf: 'Page <1>{{currentPage}}</1> of <1>{{totalPages}}</1>',
    tableShowingRecordOf: 'Showing {{itemCount}} records of {{totalItems}}',

    recordPerPage: 'Record per page',
    recordPerPage_plural: 'Records per page',

    successful_transaction: 'Successful transaction',
    successful_edit: 'Edited successfully',
    
    quickreplies: 'Quickreplies',
    twofactorauthentication: 'Two factor authentication',
    save: 'Save',
    setpassword: 'Set password',
    cancel: 'Cancel'
};

const enResource: ResourceLanguage = {
    translation,
};

export default enResource;
