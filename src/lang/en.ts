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

    lastConnection: 'Last connection',
    firstConnection: 'First connection',
    ticketCreatedOn: 'Ticket Created On',

    company: 'Company',

    billingGroup: 'Billing group',
    registerCode: 'Register code',
    docNumber: 'Document number',
    docType: 'Document type',
    doubleAuthentication: 'Double authentication',
    label: "Label",
    group: 'Group',
    group_plural: 'Groups',
    code: 'Code',
    bydefault: 'Default Value',
    quickreply: 'Quickreply',
    review: 'Review',
    domain: 'Domain',
    classification: 'Classification',
    domain_plural: 'Domains',
    emoji: 'Emoji',
    emoji_plural: 'Emojis',
    valuelist: 'Values list',
    documenttype: 'Document type',
    documentnumber: 'Document number',
    usergroup: 'User group',
    inappropriatewords: 'Inappropriate words',
    intelligentmodels: 'Intelligent models',
    endpoint: 'Endpoint',
    modelid: 'Model ID',
    apikey: 'API Key',
    provider: 'Supplier',
    sla: 'Service level agreement',
    communicationchanneldesc: 'Channel name',
    communicationchannel: 'Communication channel',
    tme: 'TME',
    tmepercentobj: 'TME% objetive',
    tmopercentobj: 'TMO% objetive',
    usertme: 'TME user',
    usertmepercentmax: 'TME% user objetive',
    usertmo: 'TMO user',
    usertmopercentmax: 'TMO% user objetive',
    person: 'Person',
    person_plural: 'People',
    summarize: 'Summarize',
    detail: 'Detail',
    detail_plural: 'Details',
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
    productivitybyhour: 'Productivity by hour',
    title: 'Title',
    action: 'Action',
    action_plural: 'Actions',
    parent: 'Parent',
    quantity: 'Quantity',
    quantity_plural: 'quantities',
    tag: 'Tag',
    validationtext: 'Text Validation',
    completedesc: 'Complete description',
    actionplan: 'Action plan',
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

    status_activo: 'active',
    status_inactivo: 'inactive',
    status_bloqueado: 'locked',

    attending: 'Attending',

    type_domain_bot: 'Bot domain',
    type_domain_cliente: 'Client domain',
    type_domain_sistema: 'System domain',

    editRecord: 'Edit record',
    deleteRecord: 'Delete record',
    changeDate: 'Change date',

    edit: 'Editar',
    delete: 'Eliminar',
    search: 'Search',
    duplicate: 'Duplicate',
    organizationclass: "Organization of Classifications",
    tablePageOf: 'Page <0>{{currentPage}}</0> of <1>{{totalPages}}</1>',
    tableShowingRecordOf: 'Showing {{itemCount}} records of {{totalItems}}',
    tipification: 'Tipification',
    tipification_plural: 'Tipifications',

    report_designer: 'Report designer',
    column_plural: 'Columns',
    new_report_designer: 'New report',
    designed_reports: 'Personalized reports',
    filters: 'Filters',


    recordPerPage: 'Record per page',
    recordPerPage_plural: 'Records per page',
    return: "Return",

    supplier: "Supplier",
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
    import: 'Import',
    integrationmanager: 'Integration Manager',
    integrationmanager_plural: 'Integration Manager',
    newintegrationmanager: 'New Integration',
    standard: 'Standard',
    custom: 'Custom',
    requesttype: 'Request Type',
    url: 'Url',
    authorization: 'Authorization',
    none: 'None',
    basic: 'Basic',
    bearer: 'Bearer',
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
    closing_reason: 'Closing Reason',
    reassign: 'Reassign',
    reassign_ticket: 'Reassign ticket',
    typify: 'Typify',
    typify_ticket: 'Typify ticket',
    observation: 'Observation',
    laststepsignup: "We want to help you grow",
    laststepsignup2: "Knowing you better helps us to optimize the service to what your clients need.",
    flowdesigner: 'Flow designer',
    passwordsmustbeequal:"The passwords must be equal",
    industry: "Industry",
    favorite: "Favorite",
    companysize: "Company size",
    roleincompany: "Your role in the company",
    variableconfiguration: 'Variable Configuration',
    variableconfiguration_plural: 'Variable Configuration',
    flow: 'Flow',
    color: 'Color',
    bold: 'Bold',
    tos: "By signing up you accept our terms of use and privacy policy",
    signupstep1title2: 'Complete Personal and Business Information',
    show: 'Show',
    submit: 'Submit',
    firstandlastname: "First and last name",
    companybusinessname: "Company or Business name",
    campaign: 'Campaign',
    mobilephoneoptional: "Mobile number (optional)",
    laraigouse: "What do you want to use laraigo for?",
    sales: "Sales",
    marketing: "Marketing",
    customerservice: "Customer service",
    campaign_plural: 'Campaigns',
    newcampaign: 'New campaign',
    startdate: 'Start date',
    enddate: 'End date',
    blacklist: 'Blacklist',
    executiontype: 'Execution type',
    manual: 'Manual',
    scheduled: 'Scheduled',
    source: 'Source',
    bdinternal: 'Internal data',
    bdexternal: 'External data',
    date: 'Date',
    hour: 'Hour',
    clean: 'Clean',
    column: 'Column',
    select_column_plural: 'Select columns',
    field: 'Field',
    missing_header: 'Missing header',
    invalid_parameter: 'Invalid parameter',
    no_record_selected: 'No record selected',

    signupstep1title: 'Sign up in less than a minute!',
    signupfacebookbutton: 'Sign up with Facebook',
    signupgooglebutton: 'Sign up with Google',
    variable: "Variable",
    successful_transaction: 'Successful transaction',
    successful_edit: 'Edited successfully',
    successful_register: 'Registered successfully',
    successful_delete: 'Deleted successfully',
    quickreplies: 'Quickreplies',
    twofactorauthentication: 'Two factor authentication',
    save: 'Save',
    setpassword: 'Set password',
    select: "Select",
    data: "Data",
    cancel: 'Cancel',
    default_application: 'Default application',
    default_organization: 'Default organization',
    password_required: 'Password is required',
    field_required: 'Field is required',
    field_duplicate: 'Field duplicate',
    field_startwithchar: 'Field must start with a letter',
    field_basiclatinlowercase: 'Field must contain only basic Latin lowercase or digits',
    field_afterstart: 'Field must be after start',
    affirmative: 'Yes',
    negative: 'No',
    opendrilldown: "Open Drilldown",
    organization_by_default: 'You must select a default organization',
    attention_group: 'Attention group',
    register: 'Register',
    tmototalobj: "Objective Total TMO",
    tmoasesorobj: "Objective Asesor TMO",
    tmeasesorobj: "Objective Asesor TME",
    download: 'Download',
    back: 'Back',
    continue: 'Continue',
    confirmation: 'Confirmation',
    confirmation_save: 'Are you sure to save the record?',
    confirmation_delete: 'Are you sure to delete the record?',
    login_with_facebook: 'Login with Facebook',
    next: "Next",
    defaultanswer: "Default answer",
    login_with_google: 'Login with Google',
    insults: "Insults",
    entities: "Entities",
    links: "Links",
    emotions: "Emotions",
    path: "Path",
    connectface: "Connect your Facebook",
    connectface2: "Install the chatbot on your Facebook page and start getting leads.",
    connectface3: "You only need to be an administrator of your Facebook page.",
    connectface4: "*We will not publish any content",
    connectinsta: "Connect your Instagram",
    connectinsta2: "Install the chatbot on your Instagram page and start getting leads.",
    connectinsta3: "You only need to be an administrator of the Facebook page associated to the Instagram Business.",
    connectinsta4: "*We will not publish any content",
    linkfacebookpage: "Link your Facebook page",
    linkinstagrampage: "Link your Instagram page",
    selectpagelink: "Select the page to link",
    commchannelfinishreg: "You are one click away from connecting your communication channel",
    givechannelname: "Give your channel a name",
    enablechatflow: "Enable Automated Conversational Flow",
    finishreg: "FINISH REGISTRATION",
    whatsapptitle: 'To connect a whatsapp channel you must click on "Register Whatsapp account" and once you finishthe registration, enter the number and the API Key in this form',
    registerwhats: "Register Whatsapp Account",
    connectnumberfield: "Enter the number to connect",
    enterapikey: "Enter the API Key",
    connecttelegram: "Connect your Telegram Bot",
    connecttelegramins: "To connect a Telegram Bot you need to provide us with the ApiKey and the name of the Bot. You can obtain this information by talking with @BotFather on Telegram",
    enterbotname: "Enter the Bot name",
    enterbotapikey: "Enter the Bot ApiKey",
    twittertitle: "Connect your Twitter page",
    twittertitle2: "In order to connect your Twitter page we need the consumer key and the Authentication Token from the app you wish to use and some additional info about the page. This information can be found in the Twitter Developer Portal",
    devenvironment: "Enter the Development Environment",
    consumerapikey: "Enter the Consumer Api Key",
    consumerapisecret: "Enter the Consumer Api Secret",
    authenticationtoken: "Enter the Authentication Token",
    authenticationsecret: "Enter the Authentication Secret",
    consumerpageid: "Enter the Consumer Page id",
    channeladdtitle: "We want to know how you communicate",
    socialmediachannel: "Social Media Channel",
    businesschannel: "Business Channel",
    hasactionplan: 'Has action plan',
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
    tipify_ticket: 'Tipify ticket',
    successful_close_ticket: 'Ticket closed successfully',
    successful_tipify_ticket: 'Ticket tipified successfully',
    successful_reasign_ticket: 'Ticket reasigned successfully',
    confirmation_reasign_with_reply: 'If you confirm sending the message the ticket will be assigned to your tray.',
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

    equals: 'Equals',
    notequals: 'Not equals',
    contains: 'Contains',
    notcontains: 'Not contains',
    isempty: 'Is empty',
    isnotempty: 'Is not empty',
    isnull: 'Is null',
    isnotnull: 'Is not null',
    greater: 'Greater',
    greaterorequals: 'Greater or equals',
    less: 'Less',
    lessorequals: 'Less or equals',
    after: 'After',
    afterequals: 'After or equals',
    before: 'Before',
    beforeequals: 'Before or equals',
    all: 'All',
    istrue: 'Is true',
    isfalse: 'Is false',

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

    emoji_name: 'Name',
    emoji_category_name: 'Category',
    emoji_favorites: 'Favorites',
    emoji_restricted: 'Restricted',
    emoji_message_favorites: 'You want to send the emoji as a favorite to all organizations and channels',
    emoji_message_restricted: 'You want to restrict the emoji to all organizations and channels',

    ticket_numeroticket: 'Ticket',
    ticket_fecha: 'Date',
    ticket_firstusergroup: 'First user group',
    ticket_ticketgroup: 'Ticket group',
    ticket_communicationchanneldescription: 'Channel',
    ticket_name: 'Client',
    ticket_canalpersonareferencia: 'ID User channel',
    ticket_fechainicio: 'Start Date',
    ticket_fechafin: 'Close Date',
    ticket_fechaprimeraconversacion: 'First communication',
    ticket_fechaultimaconversacion: 'Last conversation',
    ticket_fechahandoff: 'Derivation',
    ticket_asesorinicial: 'First assessor',
    ticket_asesorfinal: 'Last assessor',
    ticket_supervisor: 'Supervisor',
    ticket_empresa: 'Company',
    ticket_attentiongroup: 'Users group',
    ticket_classification: 'Service',
    ticket_tiempopromediorespuesta: 'ART (Average response time)',
    ticket_tiempoprimerarespuestaasesor: 'FRT (First response time)',
    ticket_tiempopromediorespuestaasesor: 'ART Assessor',
    ticket_tiempopromediorespuestapersona: 'ART Client',
    ticket_duraciontotal: 'Total Duration',
    ticket_duracionreal: 'Real Duration',
    ticket_duracionpausa: 'Leisurely Time',
    ticket_tmoasesor: 'TMO Assessor',
    ticket_tiempoprimeraasignacion: 'First Assignment',
    ticket_estadoconversacion: 'Status',
    ticket_tipocierre: 'Close type',
    ticket_tipification: 'Tipification',
    ticket_firstname: 'Name or social name',
    ticket_contact: 'Person who contact',
    ticket_lastname: 'Last name',
    ticket_email: 'Email',
    ticket_phone: 'Phone number',
    ticket_balancetimes: 'Quantity of balances',
    ticket_documenttype: 'Document type',
    ticket_dni: 'Document number',
    ticket_abandoned: 'Abandoned',
    ticket_enquiries: 'Question',
    ticket_labels: 'Labels',
    ticket_tdatime: 'TDA',

    report_loginhistory: 'User login',
    report_loginhistory_createdate: 'Date',
    report_loginhistory_createhour: 'Hour',
    report_loginhistory_nombre_usuario: 'Username',
    report_loginhistory_usuario: 'User',
    report_loginhistory_status: 'Status ',
    report_loginhistory_type: 'Type',

    report_inputretry: 'Retries',
    report_inputretry_numeroticket: 'Ticket',
    report_inputretry_cliente: 'User',
    report_inputretry_canal: 'Channel',
    report_inputretry_fecha: 'Date',
    report_inputretry_pregunta: 'Question',
    report_inputretry_respuesta: 'Answer',
    report_inputretry_intento: 'Attempt',
    report_inputretry_valido: 'Valid?',

    report_interaction: 'Interactions',
    report_interaction_numeroticket: 'Ticket',
    report_interaction_anioticket: 'Year',
    report_interaction_mesticket: 'Month',
    report_interaction_fechaticket: 'Ticket day',
    report_interaction_horaticket: 'Ticket hour',
    report_interaction_linea: 'Line',
    report_interaction_fechalinea: 'Date line',
    report_interaction_horalinea: 'Hour line',
    report_interaction_cliente: 'Client',
    report_interaction_displayname: 'Original Name',
    report_interaction_canal: 'Channel',
    report_interaction_asesor: 'Advisor',
    report_interaction_intencion: 'Intention',
    report_interaction_tipotexto: 'Interaction Type',
    report_interaction_usergroup: 'Group ',
    report_interaction_texto: 'Text',
    report_interaction_phone: 'Client number',
    least_user_or_group: 'Should choose at least user or group',

    report_productivity: 'Conversations',
    report_productivity_numeroticket: 'Ticket number',
    report_productivity_anio: 'Year',
    report_productivity_mes: 'Month',
    report_productivity_semana: 'Week',
    report_productivity_dia: 'Day',
    report_productivity_hora: 'Hour ',
    report_productivity_canal: 'Channel',
    report_productivity_cliente: 'Client',
    report_productivity_displayname: 'Name or Business name',
    report_productivity_cerradopor: 'Closed by',
    report_productivity_asesor: 'Assesor',
    report_productivity_tipocierre: 'Close type',
    report_productivity_fechainicio: 'Start date',
    report_productivity_horainicio: 'Start hour',
    report_productivity_fechafin: 'Close day',
    report_productivity_horafin: 'Close time ',
    report_productivity_fechaderivacion: 'Derivation date',
    report_productivity_horaderivacion: 'Derivation time',
    report_productivity_fechaprimerainteraccion: 'First interation date',
    report_productivity_horaprimerainteraccion: 'First interation time',
    report_productivity_tmo: 'TMO',
    report_productivity_tmg: 'TMG ',
    report_productivity_tiemposuspension: 'Suspension time',
    report_productivity_tiempopromediorespuestaasesor: 'Average advisor response',
    report_productivity_firstname: 'Name ',
    report_productivity_lastname: 'Last name',
    report_productivity_email: 'Mail ',
    report_productivity_phone: 'Phone',
    report_productivity_contact: 'Number swinging',
    report_productivity_tmoasesor: 'TMO advisor',
    report_productivity_holdingwaitingtime: 'Holding hold time',

    report_tipification: 'Classifications',
    report_tipification_numeroticket: 'Ticket',
    report_tipification_fechaticket: 'Date',
    report_tipification_horaticket: 'Hour',
    report_tipification_numerodocumento: 'Number of document',
    report_tipification_displayname: 'Name or Social reason',
    report_tipification_contact: 'Person who contact',
    report_tipification_phone: 'Telephone',
    report_tipification_asesor: 'Advisor',
    report_tipification_canal: 'Platform',
    report_tipification_tipo: 'Type',
    report_tipification_submotivo: 'Sub motive',
    report_tipification_valoracion: 'Assessment',

    report_userproductivityhours: 'Hourly advisor productivity',
    report_userproductivityhours_datestr: 'Date',
    report_userproductivityhours_fullname: 'Adviser',
    report_userproductivityhours_hours: 'Hour',
    report_userproductivityhours_hoursrange: 'Range of hour',
    report_userproductivityhours_worktime: 'Time worked',
    report_userproductivityhours_busytimewithinwork: 'Time occupied within working hours',
    report_userproductivityhours_freetimewithinwork: 'Free time within working hours',
    report_userproductivityhours_busytimeoutsidework: 'Busy time outside of work hours',
    report_userproductivityhours_onlinetime: 'Connected time',
    report_userproductivityhours_idletime: 'Time in which the advisor did nothing',
    report_userproductivityhours_qtytickets: 'Ticket quantity',
    report_userproductivityhours_qtyconnection: 'Number of connections made',
    report_userproductivityhours_qtydisconnection: 'Number of disconnections made',

    report_userproductivityhours_filter_adviser: 'Adviser',
    report_userproductivityhours_filter_channels: 'Channels',
    report_userproductivityhours_filter_hours: 'Hour',

    report_userproductivity: 'Adviser productivity',
    report_userproductivity_totalclosedtickets: 'Closed ticket number',
    report_userproductivity_holdingtickets: 'Holding ticket number',
    report_userproductivity_asesortickets: 'Adviser ticket number',
    report_userproductivity_usersconnected: 'Connected advisors',

    report_userproductivity_userid: 'Id',
    report_userproductivity_fullname: 'Name of advisor',
    report_userproductivity_hourfirstlogin: 'First login',
    report_userproductivity_totaltickets: 'Nº ticket',
    report_userproductivity_closedtickets: 'Closed',
    report_userproductivity_asignedtickets: 'Assigned',
    report_userproductivity_suspendedtickets: 'Suspended',
    report_userproductivity_avgfirstreplytime: 'TME AVG',
    report_userproductivity_maxfirstreplytime: 'TME MAX',
    report_userproductivity_minfirstreplytime: 'TME MIN',
    report_userproductivity_avgtotalduration: 'TMO AVG',
    report_userproductivity_maxtotalduration: 'TMO MAX',
    report_userproductivity_mintotalduration: 'TMO MIN',
    report_userproductivity_avgtotalasesorduration: 'TMO advisor AVG',
    report_userproductivity_maxtotalasesorduration: 'TMO advisor max',
    report_userproductivity_mintotalasesorduration: 'TMO advisor min',
    report_userproductivity_userconnectedduration: 'Minutes connected',
    report_userproductivity_userstatus: 'Actual state',
    report_userproductivity_groups: 'Attetion group',

    report_userproductivity_cardtme: 'TME',
    report_userproductivity_cardtmo: 'TMO',
    report_userproductivity_cardtmoadviser: 'TMO Adviser',

    report_userproductivity_cardavgmax: 'Highest average',
    report_userproductivity_cardmaxmax: 'Highest',
    report_userproductivity_cardavgmin: 'Lowest average',
    report_userproductivity_cardminmin: 'Lower',

    report_userproductivity_filter_channels: 'Channels',
    report_userproductivity_filter_group: 'Group',
    report_userproductivity_filter_status: 'User Status',
    report_userproductivity_filter_includebot: 'Include bot',

    chatHeaderTitle: 'Chat header title',
    subtitle: 'Subtitle',
    chatHeaderSubtitle: 'Chat header subtitle',
    chatButton: 'Chat button',
    botButton: 'Bot button',
    chatHeader: 'Chat header',
    chatBackground: 'Chat background',
    chatBorder: 'Chat border',
    clientMessage: 'Client message',
    clientMessage_plural: 'Client messages',
    botMessage: 'Bot message',
    botMessage_plural: 'Bot messages',
    required: 'Required',
    enterYourName: 'Enter your name',
    errorText: 'Error text',
    pleaseEnterYourName: 'Please enter your name',
    inputValidation: 'Input validation',
    validationOnKeychange: 'Validation on keychange',
    wantAddFormToSiteQuestion: 'Do you want to add the form to you site?',
    selectField: 'Select field',
    add: 'Add',
    waitingMessageStyle: 'Waiting message style',
    enableWaitingMessage: 'Enable waiting message',
    textOfTheMessage: 'Text of the message',
    uploadFile: 'Upload file',
    uploadFile_plural: 'Upload files',
    uploadVideo: 'Upload video',
    uploadVideo_plural: 'Upload videos',
    sendLocation: 'Send location',
    uploadImage: 'Upload image',
    uploadImage_plural: 'Upload images',
    uploadAudio: 'Upload audio',
    uploadAudio_plural: 'Upload audios',
    refreshChat: 'Refresh chat',
    inputAlwaysEnabled: 'Input always enabled',
    abandonmentEvent: 'Abandonment event',
    newMessageRing: 'New message ring',
    formBaseHistory: 'Form base history',
    sendMetaData: 'Send meta data',
    enableBotName: 'Enable bot name',
    botName: 'Bot name',
    activeLaraigoOnYourWebsite: 'Active Laraigo on your website',
    interface: 'Interface',
    color_plural: 'Colors',
    form: 'Form',
    bubble: 'Bubble',
    bubble_plural: 'Bubbles',

    closure: 'Closure',
    indicators: 'Indicators',
    quiz: 'Quiz',
    labels: 'Labels',

    personDetail: 'Person detail',
    audit: 'Audit',
    conversation: 'Conversation',
    opportunity: 'Opportunity',
    claim: 'Claim',
    claim_plural: 'Claims',
    gender: 'Gender',
    internalIdentifier: 'Internal identifier',
    personType: 'Person type',
    civilStatus: 'Civil status',
    educationLevel: 'Education level',
    occupation: 'Occupation',
    alternativePhone: 'Alternative Phone',
    alternativeEmail: 'Alternative Email',
    referredBy: 'Referred by',
    firstContactDate: 'First contact date',
    lastContactDate: 'Last contact date',
    lastCommunicationChannel: 'Last communication channel',
    createdBy: 'Created by',
    creationDate: 'Creation date',
    modifiedBy: 'Modified by',
    modificationDate: 'Modification date',
    advisor: 'Advisor',
    startDate: 'Start date',
    endDate: 'End date',
    ticketInformation: 'Ticket information',
    firstTicketassignTime: 'First ticket assign time',
    firstReply: 'First reply',
    pauseTime: 'Pause time',
    avgResponseTimeOfAdvisor: 'Avg. Response time of advisor',
    avgResponseTimeOfClient: 'Avg. response time of client',
    totalTime: 'Total time',
    salesperson: 'Salesperson',
    lastUpdate: 'Last update',
    phase: 'Phase',
    expectedRevenue: 'Expected revenue',
    probability: 'Probability',
    expectedClosing: 'Expected closing',
    priority: 'Priority',
    extraInformation: 'Extra information',
    contactInformation: 'Contact information',
};

const enResource: ResourceLanguage = {
    translation,
};

export default enResource;
