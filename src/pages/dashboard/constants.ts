export const graphTypes = [
    { key: 'pie' },
    { key: 'bar' },
    { key: 'line' },
];

export const groupingType = [
    { key: 'quantity' },
    { key: 'percentage' },
    // { key: 'both' },
];

export const contentTypes = [
    { key: 'kpi' },
    { key: 'report' },
    { key: 'funnel' },
];


export const viewDocumentation = [
    {name: 'dashboard', altname: 'dashboard_plural', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/dashboards`},
    {name: 'managerial', altname: 'managerial', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/dashboards#1.-dashboard-gerencial`},
    {name: 'productivity', altname: 'productivity', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/dashboards#2.-dashboard-productividad`},
    {name: 'operationalpush', altname: 'operationalpush', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/dashboards#3.-dashboard-operativo-push`},
    {name: 'tagranking', altname: 'tagranking', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/dashboards#4.-dashboard-ranking-de-tags`},
    {name: 'disconnections', altname: 'disconnections', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/dashboards#5.-dashboard-desconexiones`},
    {name: 'dashboardadd', altname: 'dashboardadd', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/dashboards#como-crear-un-dashboard-personalizado`},
    {name: 'reports', altname: 'reports', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/reportes`},
    {name: 'report_userproductivity', altname: 'report_userproductivity', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/reportes#1.-productividad-de-asesores`},
    {name: 'report_userproductivityhours', altname: 'report_userproductivityhours', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/reportes#2.-productividad-de-asesores-horas`},
    {name: 'heatmap', altname: 'heatmap', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/reportes#3.-mapa-de-calor`},
    {name: 'report_productivity', altname: 'report_productivity', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/reportes#4.-conversaciones`},
    {name: 'report_interaction', altname: 'report_interaction', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/reportes#5.-interacciones`},
    {name: 'report_tipification', altname: 'report_tipification', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/reportes#6.-clasificaciones`},
    {name: 'report_inputretry', altname: 'report_inputretry', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/reportes#7.-reintentos`},
    {name: 'report_loginhistory', altname: 'report_loginhistory', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/reportes#8.-conexion-de-usuario`},
    {name: 'recordhsmreport', altname: 'recordhsmreport', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/reportes#9.-historial-de-envios`},
    {name: 'report_conversationwhatsapp', altname: 'report_conversationwhatsapp', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/reportes#10.-conversaciones-de-whatsapp`},
    {name: 'report_ticketvsasesor', altname: 'report_ticketvsasesor', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/reportes#11.-tickets-vs.-asesor`},
    {name: 'hsmhistory', altname: 'hsmhistory', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/reportes#12.-historial-hsm`},
    {name: 'create_custom_report', altname: 'create_custom_report', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/reportes#como-crear-un-reporte-personalizado`},
    {name: 'message_inbox', altname: 'message_inbox', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/bandeja-de-mensajes`},
    {name: 'tickets', altname: 'tickets', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/tickets`},
    {name: 'supervisor', altname: 'supervisor', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/supervisor`},
    {name: 'kpimanager', altname: 'kpimanager', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/administrador-de-kpi`},
    {name: 'person', altname: 'person_plural', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/personas`},
    {name: 'crm', altname: 'crm', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/oportunidades`},
    {name: 'messagetemplate', altname: 'messagetemplate_plural', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/plantillas-de-comunicacion`},
    {name: 'domains', altname: 'domains', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/configuracion#1.-dominios`},
    {name: 'channels', altname: 'channels', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/configuracion#2.-canales`},
    {name: 'emojis', altname: 'emojis', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/configuracion#3.-emojis-restringidos`},
    {name: 'users', altname: 'users', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/configuracion#4.-usuarios`},
    {name: 'inappropriatewords', altname: 'inappropriatewords', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/configuracion#5.-palabras-inapropiadas`},
    {name: 'quickreplies', altname: 'quickreplies', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/configuracion#6.-respuestas-rapidas`},
    {name: 'tipifications', altname: 'tipifications', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/configuracion#7.-clasificaciones`},
    {name: 'integrationmanager', altname: 'integrationmanager', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/configuracion#8.-integraciones`},
    {name: 'sla', altname: 'sla', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/configuracion#9.-acuerdos-de-nivel-de-servicio`},
    {name: 'inputvalidation', altname: 'inputvalidation', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/configuracion#10.-validacion-de-datos`},
    {name: 'campaign', altname: 'campaign_plural', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/campanas`},
    {name: 'usersettings', altname: 'usersettings', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/configuracion-de-la-cuenta`},
    {name: 'botdesigner', altname: 'botdesigner', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/disenador-de-bots`},
    {name: 'configuration', altname: 'configuration', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/configuracion`},
    {name: 'variableconfiguration', altname: 'variableconfiguration', path: `https://docs-laraigo.gitbook.io/laraigo/contenido/configuracion-de-variables`},
];

export const notCustomUrl = ["/dev.laraigo.com","/testing.laraigo.com","/app.laraigo.com","/claro.laraigo.com","/localhost"]