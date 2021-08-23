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
    whitelist: 'Whitelist',

    firstname: 'Nombre',
    lastname: 'Apellido',
    email: 'Correo',

    company: 'Compañia',

    billingGroup: 'Grupo de facturación',
    registerCode: 'Código de registro',
    docNumber: 'Número de documento',
    docType: 'Tipo de documento',
    doubleAuthentication: 'Doble autenticación',

    group: 'Grupo',
    group_plural: 'Grupos',

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

    active: 'Activo',
    inactive: 'Inactivo',

    editRecord: 'Editar registro',
    deleteRecord: 'Eliminar registro',
    changeDate: 'Fecha de cambio',

    edit: 'Editar',
    delete: 'Eliminar',
    search: 'Buscar',

    tablePageOf: 'Página <0>{{currentPage}}</0> de <1>{{totalPages}}</1>',
    tableShowingRecordOf: 'Mostrando {{itemCount}} registros de {{totalItems}}',

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

    error_already_exists_record: '23505: Ya existe un mismo {{module}} registrado',
    error_parameter_too_long: '22001: Hubo un error, comuniquese con el administrador',
    error_divison_by_zero: '22012: Hubo un error, comuniquese con el administrador',
    error_unexpected_db_error: '5003: Hubo un error, comuniquese con el administrador',
    error_not_function_error: '5002: Hubo un error, comuniquese con el administrador',
    error_variable_incompatibility_error: '5001: Hubo un error, comuniquese con el administrador',
    error_unexpected_error: '5000: Hubo un error, comuniquese con el administrador',
    error_null_not_allowed: '23502: Hubo un error, comuniquese con el administrador',
    error_function_not_exists: '42883: Hubo un error, comuniquese con el administrador',
};

const esResource: ResourceLanguage = {
    translation,
};

export default esResource;
