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
    summarize:'Resumen',
    validationtext: 'Validación de textos',
    quickreply: 'Respuesta rápida',
    review: 'Resumen',
    domain: 'Dominio',
    domain_plural: 'Dominios',
    valuelist:'Lista de valores',
    classification: 'Clasificación',
    code:'Código',
    bydefault: 'Valor por defecto',
    documenttype: 'Tipo de documento',
    documentnumber: 'Número de documento',
    usergroup: 'Grupo usuario',
    inappropriatewords: 'Palabras inapropiadas',
    intelligentmodels: 'Modelos inteligentes',
    endpoint: 'Endpoint',
    modelid:'ID Modelo',
    apikey: 'API Key',
    provider: 'Proveedor',
    sla: 'Acuerdo de nivel de servicio',
    communicationchanneldesc:'Nombre canal',
    tme:'TME',
    tmepercentobj: 'TME% objetivo',
    tmopercentobj: 'TMO% objetivo',
    usertme:'TME usuario',
    usertmepercentmax:'TME% usuario objetivo',
    usertmo:'TMO usuario',
    usertmopercentmax:'TMO% usuario objetivo',
    person: 'Persona',
    person_plural: 'Personas',
    detail:'Detalle',
    detail_plural:'Detalles',
    whitelist: 'Whitelist',
    productivitybyhour:'Productividad por hora',
    firstname: 'Nombre',
    lastname: 'Apellido',
    email: 'Correo',
    address: 'Dirección',
    department: 'Departamento',
    phone: 'Teléfono',
    title:'Título',
    lastConnection: 'Última Conexión',
    ticketCreatedOn: 'Ticket Creado',
    parent:'Padre',
    company: 'Compañia',
    tag:'Tag',
    communicationchannel:'Canal de comunicación',
    billingGroup: 'Grupo de facturación',
    registerCode: 'Código de registro',
    docNumber: 'Número de documento',
    docType: 'Tipo de documento',
    doubleAuthentication: 'Doble autenticación',
    next:"Siguiente",
    completedesc: 'Descripción completa',
    actionplan:'Plan de acción',
    group: 'Grupo',
    group_plural: 'Grupos',
    hasactionplan:'Tiene Plan de Acción',
    action: 'Acción',
    action_plural: 'Acciones',
    variable:"Variable",
    role: 'Rol',
    role_plural: 'Roles',
    data:"Data",

    status: 'Estado',
    status_plural: 'Estados',

    type: 'Tipo',
    type_plural: 'Tipos',

    corporation: 'Corporación',
    corporation_plural: 'Corporaciones',

    name: 'Nombre',
    name_plural: 'Nombres',

    username: 'Usuario',
    password: 'Contraseña',
    confirmpassword: 'Confirmar contraseña',

    value: 'Valor',
    value_plural: 'Valores',

    description: 'Descripción',
    description_plural: 'Descripciones',
    return: "Regresar",
    active: 'Activo',
    inactive: 'Inactivo',
    organizationclass: "Organización de Clasificaciones",
    editRecord: 'Editar registro',
    deleteRecord: 'Eliminar registro',
    changeDate: 'Fecha de cambio',
    select: "Seleccionar",
    edit: 'Editar',
    delete: 'Eliminar',
    search: 'Buscar',
    label:"Etiqueta",
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

    tipification: 'Tipificación',
    tipification_plural: 'Tipificaciones',
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
    supplier:"Proveedor",
    addbutton: 'Añadir botón',
    removebutton: 'Quitar botón',
    
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

    flowdesigner: 'Diseñador de flujos',

    variableconfiguration: 'Configuración de variables',
    variableconfiguration_plural: 'Configuración de variables',

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
    affirmative: 'Si',
    negative: 'No',
    organization_by_default: 'Debe seleccionar una organización por defecto',
    attention_group: 'Grupo de atención',
    register: 'Registrar',
    download: 'Descargar',
    import: 'Importar',
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

    today: 'Hoy',
    yesterday: 'Ayer',
    thisWeek: 'Esta Semana',
    lastWeek: 'Semana Pasada',
    thisMonth: 'Este Mes',
    lastMonth: 'Mes Pasado',
    daysUpToToday: 'días hasta hoy',
    daysStartingToday: 'días a partir de hoy',
    
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

    report_loginhistory_createdate: 'Fecha',
    report_loginhistory_createhour: 'Hora',
    report_loginhistory_nombre_usuario: 'Nombre del usuario',
    report_loginhistory_usuario: 'Usuario',
    report_loginhistory_status: 'Estado',
    report_loginhistory_type: 'Tipo',

    report_inputretry_numeroticket: 'Ticket',
    report_inputretry_cliente: 'Usuario',
    report_inputretry_canal: 'Canal',
    report_inputretry_fecha: 'Fecha',
    report_inputretry_pregunta: 'Pregunta',
    report_inputretry_respuesta: 'Respuesta',
    report_inputretry_intento: 'Intento',
    report_inputretry_valido: 'Válido',

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
};

const esResource: ResourceLanguage = {
    translation,
};

export default esResource;