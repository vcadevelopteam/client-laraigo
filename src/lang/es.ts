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
    billingGroup: 'Grupo de facturación',
    registerCode: 'Código de registro',
    docNumber: 'Número de documento',
    docType: 'Tipo de documento',
    doubleAuthentication: 'Doble autenticación',
    completedesc: 'Descripción completa',
    actionplan:'Plan de acción',
    group: 'Grupo',
    group_plural: 'Grupos',
    hasactionplan:'Tiene Plan de Acción',
    action: 'Acción',
    action_plural: 'Acciones',

    role: 'Rol',
    role_plural: 'Roles',

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
    header: 'Cabecera',
    headertype: 'Tipo de Cabecera',
    body: 'Cuerpo',
    footer: 'Pie',
    buttons: 'Botones',
    payload: 'Payload',
    message: 'Mensaje',
    supplier:"Proveedor",
    addbutton: 'Añadir botón',
    removebutton: 'Quitar botón',

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
};

const esResource: ResourceLanguage = {
    translation,
};

export default esResource;
