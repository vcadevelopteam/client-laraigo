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

    validationtext: 'Validación de textos',

    domain: 'Dominio',
    domain_plural: 'Dominios',
    valuelist:'Lista de valores',
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
    changeDate: 'Cambiar fecha',

    edit: 'Editar',
    delete: 'Eliminar',
    search: 'Buscar',

    tablePageOf: 'Página <0>{{currentPage}}</0> de <1>{{totalPages}}</1>',
    tableShowingRecordOf: 'Mostrando {{itemCount}} registros de {{totalItems}}',

    recordPerPage: 'Registro por página',
    recordPerPage_plural: 'Registros por página',

    successful_transaction: 'Transacción exitosa',
    successful_edit: 'Se editó correctamente',
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
};

const esResource: ResourceLanguage = {
    translation,
};

export default esResource;
