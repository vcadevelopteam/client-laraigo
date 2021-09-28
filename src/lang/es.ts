import { ResourceLanguage } from 'i18next';
import { LangKeys } from './keys';

const translation: LangKeys = {
    dashboard: 'Panel',
    dashboard_plural: 'Paneles',

    organization: "Organización",
    organization_plural: 'Organizaciones',

    ticket: "Ticket",
    ticket_plural: 'Tickets',

    billingSetup: 'Facturación',
    billingSetup_plural: 'Facturaciones',

    channel: 'Canal',
    channel_plural: 'Canales',

    configuration: 'Configuración',
    configuration_plural: 'Configuraciones',

    eMailInbox: 'Bandeja de correo',

    extra: 'Extra',
    extra_plural: 'Extras',

    messageInbox: 'Bandeja de messages',

    report: 'Reporte',
    report_plural: 'Reportes',

    supervisor: 'Supervisor',
    supervisor_plural: 'Supervisores',

    system: 'Sistema',
    system_plural: 'Sistemas',

    online: 'Conectado',
    offline: 'Desconectado',
    logIn: 'Iniciar sesión',
    newRegisterMessage: '¿No tienes una cuenta? Registrate',
    signoff: 'Cerrar Sesión',

    changePassword: 'Cambiar contraseña',

    user: 'Usuario',
    user_plural: 'Usuarios',

    property: 'Propiedad',
    property_plural: 'Propiedades',

    groupconfig: "Configuración de Grupos",

    quantity: 'Cantidad',
    quantity_plural: "Cantidades",
    summarize: 'Resumen',
    validationtext: 'Validación de textos',
    quickreply: 'Respuesta rápida',
    review: 'Resumen',
    domain: 'Dominio',
    domain_plural: 'Dominios',
    emoji: 'Emoji',
    emoji_plural: 'Emojis',
    valuelist: 'Lista de valores',
    classification: 'Clasificación',
    code: 'Código',
    bydefault: 'Valor por defecto',
    documenttype: 'Tipo de documento',
    documentnumber: 'Número de documento',
    usergroup: 'Grupo usuario',
    inappropriatewords: 'Palabras inapropiadas',
    intelligentmodels: 'Modelos inteligentes',
    endpoint: 'Endpoint',
    modelid: 'ID Modelo',
    apikey: 'API Key',
    provider: 'Proveedor',
    sla: 'Acuerdo de nivel de servicio',
    communicationchanneldesc: 'Nombre canal',
    tme: 'TME',
    tmepercentobj: 'TME% objetivo',
    tmopercentobj: 'TMO% objetivo',
    usertme: 'TME usuario',
    usertmepercentmax: 'TME% usuario objetivo',
    usertmo: 'TMO usuario',
    usertmopercentmax: 'TMO% usuario objetivo',
    person: 'Persona',
    person_plural: 'Personas',
    detail: 'Detalle',
    detail_plural: 'Detalles',
    whitelist: 'Whitelist',
    productivitybyhour: 'Productividad por hora',
    firstname: 'Nombre',
    lastname: 'Apellido',
    email: 'Correo',
    address: 'Dirección',
    department: 'Departamento',
    phone: 'Teléfono',
    title: 'Título',
    lastConnection: 'Última Conexión',
    ticketCreatedOn: 'Ticket Creado',
    parent: 'Padre',
    firstConnection: 'Primera conecxión',
    company: 'Compañia',
    tag: 'Tag',
    communicationchannel: 'Canal de comunicación',
    billingGroup: 'Grupo de facturación',
    registerCode: 'Código de registro',
    docNumber: 'Número de documento',
    docType: 'Tipo de documento',
    doubleAuthentication: 'Doble autenticación',
    next: "Siguiente",
    completedesc: 'Descripción completa',
    actionplan: 'Plan de acción',
    group: 'Grupo',
    group_plural: 'Grupos',
    hasactionplan: 'Tiene Plan de Acción',
    action: 'Acción',
    action_plural: 'Acciones',
    variable: "Variable",
    role: 'Rol',
    favorite: "Favorito",
    role_plural: 'Roles',
    submit:'Enviar',
    passwordsmustbeequal:"Las contraseñas deben ser iguales",
    data: "Data",
    firstandlastname: "Nombres y apellidos",
    companybusinessname: "Nombre de la Empresa o Compañia",
    signupstep1title2: 'Complete su Información personal y comercial',
    tos: "Al registrarte aceptas nuestras condiciones de uso y política de privacidad",
    signupstep1title: '¡Registrate en menos de un minuto!',
    signupfacebookbutton: 'Registrate por Facebook',
    mobilephoneoptional: "Teléfono móvil (opcional)",
    laraigouse: "¿Para qué deseas usar laraigo?",
    sales: "Ventas",
    marketing: "Marketing",
    customerservice: "Servicio al cliente",
    signupgooglebutton: 'Registrate por Google',
    connectface: "Conecta tu Facebook",
    connectface2: "Instala el chatbot en tu página de Facebook y empieza a conseguir clientes potenciales.",
    connectface3: "Solo necesitas ser administrador de tu página de Facebook.",
    connectface4: "*No publicaremos ningún contenido",
    connectinsta: "Conecta tu Instagram",
    connectinsta2: "Instala el chatbot en tu página de Instagram y empieza a conseguir clientes potenciales.",
    connectinsta3: "Solo necesitas ser administrador de la página de Facebook asociada a tu cuenta Business de Instagram.",
    connectinsta4: "*No publicaremos ningún contenido",
    linkfacebookpage: "Vincula tu página de Facebook",
    linkinstagrampage: "Vincula tu página de Instagram",
    selectpagelink: "Seleccione la página para vincular",
    commchannelfinishreg: "Estás a un clic de conectar tu canal de comunicación",
    givechannelname: "Dale un nombre a tu canal",
    enablechatflow: "Habilitar el flujo conversacional automatizado",
    finishreg: "FINALIZAR REGISTRO",
    whatsapptitle: 'Para conectar un canal de whatsapp debes hacer clic en "Registrar cuenta de Whatsapp" y una vez que termines el registro, ingresar el número y la Clave API en este formulario',
    registerwhats: "Registrar cuenta de Whatsapp",
    connectnumberfield: "Ingrese el número para conectarse",
    enterapikey: "Ingrese la API Key",
    connecttelegram: "Conecta tu Bot de Telegram",
    connecttelegramins: "Para conectar un Telegram Bot, debes proporcionarnos la ApiKey y el nombre del Bot. Puedes obtener esta información hablando con @BotFather en Telegram",
    enterbotname: "Introduzca el nombre del bot",
    enterbotapikey: "Ingrese el ApiKey del Bot",
    twittertitle: "Conecta tu página de Twitter",
    twittertitle2: "Para conectar su página de Twitter, necesitamos la clave del consumidor y el Token de autenticación de la aplicación que desea utilizar y alguna información adicional sobre la página. Esta información se puede encontrar en el Portal de desarrolladores de Twitter",
    devenvironment: "Ingrese el entorno de desarrollo",
    consumerapikey: "Ingrese el API Key del consumidor",
    consumerapisecret: "Ingrese el API Secret del consumidor",
    authenticationtoken: "Ingrese el Token de autenticación",
    authenticationsecret: "Ingrese el Secret de autenticación",
    consumerpageid: "Ingrese el Page id del consumidor",
    socialmediachannel: "Canales de redes sociales",
    businesschannel: "Canales de negocios",
    channeladdtitle: "Queremos saber cómo te comunicas",
    status: 'Estado',
    status_plural: 'Estados',
    tmototalobj: "Objetivo Total TMO",
    tmoasesorobj: "Objetivo Asesor TMO",
    tmeasesorobj: "Objetivo Asesor TME",
    type: 'Tipo',
    type_plural: 'Tipos',
    opendrilldown: "Abrir árbol",
    corporation: 'Corporación',
    corporation_plural: 'Corporaciones',
    insults: "Lisuras",
    entities: "Entidades",
    links: "Links",
    emotions: "Emociones",
    name: 'Nombre',
    name_plural: 'Nombres',

    username: 'Usuario',
    password: 'Contraseña',
    confirmpassword: 'Confirmar contraseña',

    value: 'Valor',
    value_plural: 'Valores',
    path: "Path",
    description: 'Descripción',
    defaultanswer: "Respuesta predeterminada",
    description_plural: 'Descripciones',
    return: "Regresar",
    active: 'Activo',
    inactive: 'Inactivo',

    status_activo: 'activo',
    status_inactivo: 'inactivo',
    status_bloqueado: 'bloqueado',

    attending: 'En atención',

    type_domain_bot: 'Dominio de bot',
    type_domain_cliente: 'Dominio de cliente',
    type_domain_sistema: 'Dominio de sistema',

    organizationclass: "Organización de Clasificaciones",
    editRecord: 'Editar registro',
    deleteRecord: 'Eliminar registro',
    changeDate: 'Fecha de cambio',
    select: "Seleccionar",
    edit: 'Editar',
    delete: 'Eliminar',
    search: 'Buscar',
    duplicate: 'Duplicar',
    label: "Etiqueta",
    newuser: "Nuevo usuario",
    newdomain: "Nuevo dominio",
    newgroupconfig: "Nuevo grupo configuración",
    newinnapropiateword: "Nueva palabra inapropiada",
    newintelligentmodel: "Nuevo modelo inteligente",
    newproperty: "Nueva propiedad",
    newquickreply: "Nueva respuesta rápida",
    newsla: "Nuevo acuerdo de nivel de servicio",
    newwhitelist: "Nueva whitelist",
    registervalue: "Registrar valor",
    neworganization: "Nueva organización",
    tablePageOf: 'Página <0>{{currentPage}}</0> de <1>{{totalPages}}</1>',
    tableShowingRecordOf: 'Mostrando {{itemCount}} registros de {{totalItems}}',
    least_user_or_group: 'Debe elegir al menos usuario o grupo',
    tipification: 'Tipificación',
    tipification_plural: 'Tipificaciones',

    report_designer: 'Diseñador de reportes',
    column_plural: 'Columnas',
    new_report_designer: 'Nuevo reporte',
    designed_reports: 'Reportes personalizados',
    filters: 'Filtros',


    id: 'Id',
    newmessagetemplate: 'Nueva plantilla de comunicación',
    messagetemplate: 'Plantilla de comunicación',
    messagetemplate_plural: 'Plantillas de comunicación',
    creationdate: 'Fecha Creación',
    messagetype: 'Tipo de Mensaje',
    sms: 'SMS',
    hsm: 'HSM',
    namespace: 'Espacio de nombres',
    category: 'Categoría',
    language: 'Idioma',
    templatetype: 'Tipo de Plantilla',
    templatestandard: 'Estándar (sólo texto)',
    templatemultimedia: 'Multimedia e interactivo',
    header: 'Cabecera',
    headertype: 'Tipo de Cabecera',
    text: 'Texto',
    image: 'Imagen',
    document: 'Documento',
    video: 'Video',
    body: 'Cuerpo',
    footer: 'Pie',
    buttons: 'Botones',
    payload: 'Payload',
    message: 'Mensaje',
    supplier: "Proveedor",
    addbutton: 'Añadir botón',
    removebutton: 'Quitar botón',
    import: 'Importar',
    integrationmanager: 'Administrador de Integraciones',
    integrationmanager_plural: 'Administrador de Integraciones',
    newintegrationmanager: 'Nueva integración',
    standard: 'Estándar',
    custom: 'Personalizado',
    requesttype: 'Tipo de solicitud',
    url: 'Url',
    authorization: 'Autorización',
    none: 'Ninguno',
    basic: 'Básico',
    bearer: 'Bearer',
    token: 'Token',
    key: 'Llave',
    addheader: 'Añadir cabecera',
    addparameter: 'Añadir parámetro',
    bodytype: 'Tipo de Cuerpo',
    level: 'Nivel',
    tablelayout: 'Diseño de la Tabla',
    fields: 'Campos',
    addfield: 'Añadir campo',
    order: 'Orden',
    beautify: 'Embellecer',
    invalidjson: 'Json inválido',
    test: 'Probar',
    result: 'Resultado',
    closing_reason: 'Motivo de cierre',
    reassign: 'Reasignar',
    reassign_ticket: 'Reasignar ticket',
    typify: 'Tipificar',
    typify_ticket: 'Tipificar ticket',
    observation: 'Observación',
    flowdesigner: 'Diseñador de flujos',

    variableconfiguration: 'Configuración de variables',
    variableconfiguration_plural: 'Configuración de variables',
    flow: 'Flujo',
    color: 'Color',
    bold: 'Negrita',
    show: 'Mostrar',

    campaign: 'Campaña',
    campaign_plural: 'Campañas',
    newcampaign: 'Nueva campaña',
    startdate: 'Fecha inicio',
    enddate: 'Fecha fin',
    blacklist: 'Blacklist',
    executiontype: 'Tipo de ejecución',
    manual: 'Manual',
    scheduled: 'Programado',
    source: 'Fuente',
    bdinternal: 'Base interna',
    bdexternal: 'Base externa',
    date: 'Fecha',
    hour: 'Hora',
    clean: 'Limpiar',
    column: 'Columna',
    select_column_plural: 'Seleccione columnas',
    field: 'Campo',
    missing_header: 'Falta cabecera',
    invalid_parameter: 'Parámetro inválido',
    no_record_selected: 'Ningún registro seleccionado',
    rundate: 'Fecha ejecución',
    total: 'Total',
    success: 'Satisfactorio',
    success_percent: '% Satisfactorio',
    failed: 'Fallido',
    failed_percent: '% Fallido',
    attended: 'Atendido',
    locked: 'Bloqueado',
    blacklisted: 'Lista negra',
    default: 'Predeterminado',
    proactive: 'Proactivo',
    log: 'Log',

    successful_close_ticket: 'El ticket fue cerrado satisfactoriamente',
    successful_tipify_ticket: 'El ticket se tipificó satisfactoriamente',
    successful_reasign_ticket: 'El ticket se reasignó satisfactoriamente',
    confirmation_reasign_with_reply: 'Si confirma enviar el mensaje el ticket se asignará a su bandeja.',
    recordPerPage: 'Registro por página',
    recordPerPage_plural: 'Registros por página',

    successful_transaction: 'Transacción exitosa',
    successful_edit: 'Se editó satisfactoriamente',
    successful_register: 'Se registró satisfactoriamente',
    successful_delete: 'Se eliminó satisfactoriamente',
    quickreplies: 'Repuestas rapidas',
    twofactorauthentication: 'Doble factor autentificación',
    save: 'Guardar',
    setpassword: 'Ingresar contraseña',
    cancel: 'Cancelar',
    default_application: 'Aplicación por defecto',
    default_organization: 'Organización por defecto',
    password_required: 'La contraseña es requerida',
    field_required: 'El campo es requerido',
    field_duplicate: 'Campo duplicado',
    field_startwithchar: 'El campo debe comenzar con una letra',
    field_basiclatinlowercase: 'El campo debe contener únicamente mínusculas de latín básico o dígitos',
    field_afterstart: 'El campo debe ser posterio al inicio.',
    affirmative: 'Si',
    negative: 'No',
    organization_by_default: 'Debe seleccionar una organización por defecto',
    attention_group: 'Grupo de atención',
    register: 'Registrar',
    download: 'Descargar',
    back: 'Regresar',
    continue: 'Continuar',
    confirmation: 'Confirmación',
    confirmation_save: '¿Está seguro de guardar el registro?',
    confirmation_delete: '¿Está seguro de eliminar el registro?',
    login_with_facebook: 'Iniciar sesión con Facebook',
    login_with_google: 'Iniciar sesión con Google',

    error_already_exists_record: '23505: Ya existe un mismo {{module}} registrado',
    error_parameter_too_long: '22001: Hubo un error, comuniquese con el administrador',
    error_divison_by_zero: '22012: Hubo un error, comuniquese con el administrador',
    error_unexpected_db_error: '5003: Hubo un error, comuniquese con el administrador',
    error_not_function_error: '5002: Hubo un error, comuniquese con el administrador',
    error_variable_incompatibility_error: '5001: Hubo un error, comuniquese con el administrador',
    error_unexpected_error: '5000: Hubo un error, comuniquese con el administrador',
    error_null_not_allowed: '23502: Hubo un error, comuniquese con el administrador',
    error_function_not_exists: '42883: Hubo un error, comuniquese con el administrador',
    error_parameter_is_missing: "5004: Hubo un error, comuniquese con el administrador",
    dateRangeFilterTitle: 'Filtrar por rango de fechas',

    apply: 'Aplicar',
    close: 'Cerrar',
    tipify_ticket: 'Tipificar ticket',
    today: 'Hoy',
    yesterday: 'Ayer',
    thisWeek: 'Esta Semana',
    lastWeek: 'Semana Pasada',
    thisMonth: 'Este Mes',
    lastMonth: 'Mes Pasado',
    daysUpToToday: 'días hasta hoy',
    daysStartingToday: 'días a partir de hoy',

    equals: 'Igual',
    notequals: 'No igual',
    contains: 'Contiene',
    notcontains: 'No contiene',
    isempty: 'Es vacío',
    isnotempty: 'No es vacío',
    isnull: 'Es nulo',
    isnotnull: 'No es nulo',
    greater: 'Mayor que',
    greaterorequals: 'Mayor o igual que',
    less: 'Menor que',
    lessorequals: 'Menor o igual que',
    after: 'Después del',
    afterequals: 'Después o igual del',
    before: 'Antes del',
    beforeequals: 'Antes o igual del',
    all: 'Todos',
    istrue: 'Es verdadero',
    isfalse: 'Es falso',

    error_login_user_incorrect: "Usuario o contraseña incorrecta",
    error_login_user_pending: "Usuario pendiente de confirmación",
    error_login_locked_by_attempts_failed_password: "Tu usuario fue bloqueado por exceder los intentos permitidos al loguearse",
    error_login_locked_by_inactived: "Tu usuario fue bloqueado por exceder los dias permitidos sin conectarse",
    error_login_locked_by_password_expired: "Tu usuario fue bloqueado por qué tu contraseña expiró",
    error_login_locked: "Tu usuario fue bloqueado",
    error_login_user_inactive: "Tu usuario está inactivo",
    error_login_no_integration: "No hay ningun usuario registrado integrado a esa cuenta",

    all_adivisers: "Todos",
    conected: "Activos",
    disconected: "Inactivos",
    closed: "Cerrados",
    paused: "Pausados",
    pending: "Pendientes",
    assigned: "Asignados",
    created_on: "Creado en",
    closed_on: "Cerrado en",
    close_ticket: "Cerrar ticket",
    client_detail: "Detalle cliente",

    emoji_name: 'Nombre',
    emoji_category_name: 'Categoría',
    emoji_favorites: 'Favoritos',
    emoji_restricted: 'Restringidos',
    emoji_message_favorites: 'Usted desea enviar el emoji como favorito a todas las organizaciones y canales',
    emoji_message_restricted: 'Usted desea restringir el emoji a todas las organizaciones y canales',

    report_loginhistory: 'Conexión de usuario',
    report_loginhistory_createdate: 'Fecha',
    report_loginhistory_createhour: 'Hora',
    report_loginhistory_nombre_usuario: 'Nombre del usuario',
    report_loginhistory_usuario: 'Usuario',
    report_loginhistory_status: 'Estado',
    report_loginhistory_type: 'Tipo',

    report_inputretry: 'Reintentos',
    report_inputretry_numeroticket: 'Ticket',
    report_inputretry_cliente: 'Usuario',
    report_inputretry_canal: 'Canal',
    report_inputretry_fecha: 'Fecha',
    report_inputretry_pregunta: 'Pregunta',
    report_inputretry_respuesta: 'Respuesta',
    report_inputretry_intento: 'Intento',
    report_inputretry_valido: 'Válido',

    report_interaction: 'Interacciones',
    report_interaction_numeroticket: 'Ticket',
    report_interaction_anioticket: 'Año',
    report_interaction_mesticket: 'Mes',
    report_interaction_fechaticket: 'Fechas ticket',
    report_interaction_horaticket: 'Hora ticket',
    report_interaction_linea: 'Línea',
    report_interaction_fechalinea: 'Fecha línea',
    report_interaction_horalinea: 'Hora línea',
    report_interaction_cliente: 'Cliente',
    report_interaction_displayname: 'Nombre original',
    report_interaction_canal: 'Canal',
    report_interaction_asesor: 'Asesor',
    report_interaction_intencion: 'Intención',
    report_interaction_tipotexto: 'Tipo interacción',
    report_interaction_usergroup: 'Grupo',
    report_interaction_texto: 'Texto',
    report_interaction_phone: 'Número cliente',

    report_productivity: 'Conversaciones',
    report_productivity_numeroticket: 'Ticket',
    report_productivity_anio: 'Año',
    report_productivity_mes: 'Mes',
    report_productivity_semana: 'Semana',
    report_productivity_dia: 'Día',
    report_productivity_hora: 'Hora',
    report_productivity_canal: 'Canal',
    report_productivity_cliente: 'Cliente',
    report_productivity_displayname: 'Nombre o Razón social',
    report_productivity_cerradopor: 'Cerrado por',
    report_productivity_asesor: 'Asesor',
    report_productivity_tipocierre: 'Tipo cierre',
    report_productivity_fechainicio: 'Fecha inicio',
    report_productivity_horainicio: 'Hora inicio',
    report_productivity_fechafin: 'Fecha fin',
    report_productivity_horafin: 'Hora fin',
    report_productivity_fechaderivacion: 'Fecha derivación',
    report_productivity_horaderivacion: 'Hora derivación',
    report_productivity_fechaprimerainteraccion: 'Fecha 1ra interacción',
    report_productivity_horaprimerainteraccion: 'Hora 1ra interacción',
    report_productivity_tmo: 'TMO',
    report_productivity_tmg: 'TMG',
    report_productivity_tiemposuspension: 'Tiempo suspensión',
    report_productivity_tiempopromediorespuestaasesor: 'Promedio respuesta asesor',
    report_productivity_firstname: 'Nombre',
    report_productivity_lastname: 'Apeliidos',
    report_productivity_email: 'Correo',
    report_productivity_phone: 'Teléfono',
    report_productivity_contact: 'N° Balanceos',
    report_productivity_tmoasesor: 'TMO Asesor',
    report_productivity_holdingwaitingtime: 'Tiempo espera holding',

    report_tipification: 'Tipificaciones',
    report_tipification_numeroticket: 'Ticket',
    report_tipification_fechaticket: 'Fecha',
    report_tipification_horaticket: 'Hora',
    report_tipification_numerodocumento: 'N° Documento',
    report_tipification_displayname: 'Nombre o Razón social',
    report_tipification_contact: 'Persona quien contacta',
    report_tipification_phone: 'Teléfono',
    report_tipification_asesor: 'Asesor',
    report_tipification_canal: 'Plataforma',
    report_tipification_tipo: 'Tipo',
    report_tipification_submotivo: 'Submotivo',
    report_tipification_valoracion: 'Valoración',

    report_userproductivityhours: 'Productividad de asesores hora',
    report_userproductivityhours_datestr: 'Fecha',
    report_userproductivityhours_fullname: 'Asesor',
    report_userproductivityhours_hours: 'Hora',
    report_userproductivityhours_hoursrange: 'Rango de horas',
    report_userproductivityhours_worktime: 'Tiempo trabajado',
    report_userproductivityhours_busytimewithinwork: 'Tiempo ocupado dentro del horario de trabajo',
    report_userproductivityhours_freetimewithinwork: 'Tiempo libre dentro del horario de trabajo',
    report_userproductivityhours_busytimeoutsidework: 'Tiempo ocupado fuera del horario de trabajo',
    report_userproductivityhours_onlinetime: 'Tiempo conectado',
    report_userproductivityhours_idletime: 'Tiempo desocupado',
    report_userproductivityhours_qtytickets: 'Cantidad de tickets',
    report_userproductivityhours_qtyconnection: 'Cantidad de conexiones realizadas',
    report_userproductivityhours_qtydisconnection: 'Cantidad de desconexiones realizadas',

    report_userproductivityhours_filter_adviser: 'Asesor',
    report_userproductivityhours_filter_channels: 'Canal',
    report_userproductivityhours_filter_hours: 'Hora',

    report_userproductivity: 'Productividad de asesores',
    report_userproductivity_totalclosedtickets: 'N° Tickets cerrados',
    report_userproductivity_holdingtickets: 'N° Tickets en holding',
    report_userproductivity_asesortickets: 'N° Tickets en asesor',
    report_userproductivity_usersconnected: 'Asesores conectados',

    report_userproductivity_userid: 'Id',
    report_userproductivity_fullname: 'Nombre del asesor',
    report_userproductivity_hourfirstlogin: 'Primer logueo',
    report_userproductivity_totaltickets: 'Nº ticket',
    report_userproductivity_closedtickets: 'Cerrados',
    report_userproductivity_asignedtickets: 'Asignados',
    report_userproductivity_suspendedtickets: 'Suspendidos',
    report_userproductivity_avgfirstreplytime: 'TME AVG',
    report_userproductivity_maxfirstreplytime: 'TME MAX',
    report_userproductivity_minfirstreplytime: 'TME MIN',
    report_userproductivity_avgtotalduration: 'TMO AVG',
    report_userproductivity_maxtotalduration: 'TMO MAX',
    report_userproductivity_mintotalduration: 'TMO MIN',
    report_userproductivity_avgtotalasesorduration: 'TMO Asesor AVG',
    report_userproductivity_maxtotalasesorduration: 'TMO Asesor MAX',
    report_userproductivity_mintotalasesorduration: 'TMO Asesor MIN',
    report_userproductivity_userconnectedduration: 'Minutos conectados',
    report_userproductivity_userstatus: 'Estado actual',
    report_userproductivity_groups: 'Grupo de atención',

    report_userproductivity_cardtme: 'TME',
    report_userproductivity_cardtmo: 'TMO',
    report_userproductivity_cardtmoadviser: 'TMO Asesor',

    report_userproductivity_cardavgmax: 'Promedio más alto',
    report_userproductivity_cardmaxmax: 'Más alto',
    report_userproductivity_cardavgmin: 'Promedio más bajo',
    report_userproductivity_cardminmin: 'Más bajo',

    report_userproductivity_filter_channels: 'Canal',
    report_userproductivity_filter_group: 'Grupo',
    report_userproductivity_filter_status: 'Estado de usuario',
    report_userproductivity_filter_includebot: 'Incluir bot',

    chatHeaderTitle: 'Título de la cabecera del chat',
    subtitle: 'Subtítulo',
    chatHeaderSubtitle: 'Subtítulo de la cabecera del chat',
    chatButton: 'Botón del chat',
    botButton: 'Botón del bot',
    chatHeader: 'Cabecera del chat',
    chatBackground: 'Fondo del chat',
    chatBorder: 'Borde del chat',
    clientMessage: 'Mensaje del cliente',
    clientMessage_plural: 'Mensajes del cliente',
    botMessage: 'Mensaje del bot',
    botMessage_plural: 'Mensajes del bot',
    required: 'Requerido',
    enterYourName: 'Ingresa tu nombre',
    errorText: 'Mensaje de error',
    pleaseEnterYourName: 'Por favor ingresa tu nombre',
    inputValidation: 'Validación de campo',
    validationOnKeychange: 'Validación en KeyChange',
    wantAddFormToSiteQuestion: '¿Quieres agregar el formulario a tu sitio web?',
    selectField: 'Seleccionar campo',
    add: 'Agregar',
    waitingMessageStyle: 'Estilo de mensaje de espera',
    enableWaitingMessage: 'Habilitar mensaje de espera',
    textOfTheMessage: 'Texto del mensaje',
    uploadFile: 'Subir archivo',
    uploadFile_plural: 'Subir archivos',
    uploadVideo: 'Subir video',
    uploadVideo_plural: 'Subir videos',
    sendLocation: 'Enviar ubicación',
    uploadImage: 'Subir imagen',
    uploadImage_plural: 'Subir imagenes',
    uploadAudio: 'Subir audio',
    uploadAudio_plural: 'Subir audios',
    refreshChat: 'Actualizar chat',
    inputAlwaysEnabled: 'Input siempre activo',
    abandonmentEvent: 'Evento de abandono',
    newMessageRing: 'Timbre de nuevo mensaje',
    formBaseHistory: 'Formulario en base a historial',
    sendMetaData: 'Enviar metadata',
    enableBotName: 'Habilitar nombre del bot',
    botName: 'Nombre del bot',
    activeLaraigoOnYourWebsite: 'Activa Laraigo en tu sitio web',
    interface: 'Interfaz',
    color_plural: 'Colores',
    form: 'Formulario',
    bubble: 'Burbuja',
    bubble_plural: 'Burbujas',

    closure: 'Cierre',
    indicators: 'Indicadores',
    quiz: 'Encuesta',
    labels: 'Etiquetas',

    personDetail: 'Detalle de persona',
    audit: 'Auditoría',
    conversation: 'Conversación',
    opportunity: 'Oportunidad',
    claim: 'Reclamo',
    claim_plural: 'Reclamos',
    gender: 'Género',
    internalIdentifier: 'Identificación interna',
    personType: 'Tipo de persona',
    civilStatus: 'Estado civil',
    educationLevel: 'Nivel de educación',
    occupation: 'Ocupación',
    alternativePhone: 'Teléfono alternativo',
    alternativeEmail: 'Email alternativo',
    referredBy: 'Referido por',
    firstContactDate: 'Fecha de primer contacto',
    lastContactDate: 'Fecha de último contacto',
    lastCommunicationChannel: 'Último canal de comunicación',
    createdBy: 'Creado por',
    creationDate: 'Fecha de creación',
    modifiedBy: 'Modificado por',
    modificationDate: 'Fecha de modificación',
    advisor: 'Asesor',
    startDate: 'Fecha inicio',
    endDate: 'Fecha fin',
    ticketInformation: 'Información de ticket',
    firstTicketassignTime: 'Tiempo del primer Ticket asignado',
    firstReply: 'Primera respuesta',
    pauseTime: 'Tiempo de pausa',
    avgResponseTimeOfAdvisor: 'Tiempo promedio de respuesta del asesor',
    avgResponseTimeOfClient: 'Tiempo promedio de respuesta del cliente',
    totalTime: 'Tiempo total',
    salesperson: 'Vendedor/a',
    lastUpdate: 'Última actualización',
    phase: 'Fase',
    expectedRevenue: 'Iingreso esperado',
    probability: 'Probabilidad',
    expectedClosing: 'Cierre esperado',
    priority: 'Prioridad',
    extraInformation: 'Información extra',
    contactInformation: 'Información de contacto',
};

const esResource: ResourceLanguage = {
    translation,
};

export default esResource;