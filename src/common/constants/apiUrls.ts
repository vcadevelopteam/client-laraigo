const ENV = "DEVELOP";

const APIS_URL = {
    DEVELOP: {
        API: 'https://apix.laraigo.com/api',
        //WS: 'http://localhost:7070',
        WS: 'https://socket.laraigo.com',
        CHATFLOW: 'https://zyxmelinux2.zyxmeapp.com/zyxme/chatflow',
        FACEBOOKAPP: '235008923608113',
        APIKEY_GMAPS: "AIzaSyAqrFCH95Tbqwo6opvVPcdtrVd-1fnBLr4",
        INSTAGRAMAPP: '467230660781510',
        CATALOGAPP: '2131127810437236',
        CULQIKEY: 'pk_test_041501e753dcb2f9',
        GOOGLECLIENTID_LOGIN: '792367159924-f7uvieuu5bq7m7mvnik2a7t5mnepekel.apps.googleusercontent.com',
        GOOGLECLIENTID_CHANNEL: '129996056340-5spevp6sdv32c8dpbf9vhbfjjpvfqrth.apps.googleusercontent.com',
        FACEBOOKVERSION: 'v15.0',
        DIALOG360PARTNERID: 'nPJXndPA',
        GOOGLECLIENTID_CALENDAR: '283248303891-7kttlq9tn5f43bk821fg7lnbhj5hvf6b.apps.googleusercontent.com',
        NIUBIZSCRIPT: 'https://static-content-qas.vnforapps.com/v2/js/checkout.js?qa=true',
        WEBFORMCHANNEL_FORM: 'https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/anonymous/static/test-FormWebClient.min.js',
        USELARAIGO: false,
    },
    TESTING: {
        API: 'https://testapix.laraigo.com/api',
        WS: 'https://testsocket.laraigo.com',
        CHATFLOW: 'https://zyxmelinux2.zyxmeapp.com/zyxmetest/chatflow',
        FACEBOOKAPP: '1094526090706564',
        APIKEY_GMAPS: "AIzaSyAqrFCH95Tbqwo6opvVPcdtrVd-1fnBLr4",
        INSTAGRAMAPP: '1872023336244866',
        CATALOGAPP: '2131127810437236',
        CULQIKEY: 'pk_test_041501e753dcb2f9',
        GOOGLECLIENTID_LOGIN: '792367159924-f7uvieuu5bq7m7mvnik2a7t5mnepekel.apps.googleusercontent.com',
        GOOGLECLIENTID_CHANNEL: '129996056340-5spevp6sdv32c8dpbf9vhbfjjpvfqrth.apps.googleusercontent.com',
        FACEBOOKVERSION: 'v15.0',
        DIALOG360PARTNERID: 'nPJXndPA',
        GOOGLECLIENTID_CALENDAR: '283248303891-7kttlq9tn5f43bk821fg7lnbhj5hvf6b.apps.googleusercontent.com',
        NIUBIZSCRIPT: 'https://static-content-qas.vnforapps.com/v2/js/checkout.js?qa=true',
        WEBFORMCHANNEL_FORM: 'https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/anonymous/static/testing-form.min.js',
        USELARAIGO: false,
    },
    PRODUCTION: {
        API: 'https://apiprd.laraigo.com/api',
        WS: 'https://broker.laraigo.com',
        CHATFLOW: 'https://chatflow.s3-web.us-east.cloud-object-storage.appdomain.cloud',
        FACEBOOKAPP: '1980305408682607',
        APIKEY_GMAPS: "AIzaSyAqrFCH95Tbqwo6opvVPcdtrVd-1fnBLr4",
        INSTAGRAMAPP: '1924971937716955',
        CATALOGAPP: '2131127810437236',
        CULQIKEY: 'pk_test_041501e753dcb2f9',
        GOOGLECLIENTID_LOGIN: '792367159924-f7uvieuu5bq7m7mvnik2a7t5mnepekel.apps.googleusercontent.com',
        GOOGLECLIENTID_CHANNEL: '129996056340-5spevp6sdv32c8dpbf9vhbfjjpvfqrth.apps.googleusercontent.com',
        FACEBOOKVERSION: 'v15.0',
        DIALOG360PARTNERID: 'nPJXndPA',
        GOOGLECLIENTID_CALENDAR: '283248303891-7kttlq9tn5f43bk821fg7lnbhj5hvf6b.apps.googleusercontent.com',
        NIUBIZSCRIPT: 'https://static-content.vnforapps.com/v2/js/checkout.js',
        WEBFORMCHANNEL_FORM: 'https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/anonymous/static/production-form.min.js',
        USELARAIGO: true,
    },
    INCREMENTAL_PROD: {
        API: 'https://api-incremental.laraigo.com/api',
        WS: 'https://socket.laraigo.com',
        CHATFLOW: 'https://chatflow.s3-web.us-east.cloud-object-storage.appdomain.cloud',
        FACEBOOKAPP: '1980305408682607',
        APIKEY_GMAPS: "AIzaSyAqrFCH95Tbqwo6opvVPcdtrVd-1fnBLr4",
        INSTAGRAMAPP: '1924971937716955',
        CATALOGAPP: '2131127810437236',
        CULQIKEY: 'pk_test_041501e753dcb2f9',
        GOOGLECLIENTID_LOGIN: '792367159924-f7uvieuu5bq7m7mvnik2a7t5mnepekel.apps.googleusercontent.com',
        GOOGLECLIENTID_CHANNEL: '129996056340-5spevp6sdv32c8dpbf9vhbfjjpvfqrth.apps.googleusercontent.com',
        FACEBOOKVERSION: 'v15.0',
        DIALOG360PARTNERID: 'nPJXndPA',
        GOOGLECLIENTID_CALENDAR: '283248303891-7kttlq9tn5f43bk821fg7lnbhj5hvf6b.apps.googleusercontent.com',
        NIUBIZSCRIPT: 'https://static-content.vnforapps.com/v2/js/checkout.js',
        WEBFORMCHANNEL_FORM: 'https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/anonymous/static/production-form.min.js',
        USELARAIGO: true,
    },
    CLARO: {
        API: 'https://claroapi.laraigo.com/api',
        WS: 'https://clarobroker.laraigo.com',
        CHATFLOW: 'https://chatflow-claro.s3-web.us-east.cloud-object-storage.appdomain.cloud',
        FACEBOOKAPP: '1980305408682607',
        APIKEY_GMAPS: "AIzaSyCDfPhg86YSt25QynLajl7GA5Ux6YEphoA",
        INSTAGRAMAPP: '1924971937716955',
        CATALOGAPP: '2131127810437236',
        CULQIKEY: 'pk_test_041501e753dcb2f9',
        GOOGLECLIENTID_LOGIN: '792367159924-f7uvieuu5bq7m7mvnik2a7t5mnepekel.apps.googleusercontent.com',
        GOOGLECLIENTID_CHANNEL: '129996056340-5spevp6sdv32c8dpbf9vhbfjjpvfqrth.apps.googleusercontent.com',
        FACEBOOKVERSION: 'v15.0',
        DIALOG360PARTNERID: 'nPJXndPA',
        GOOGLECLIENTID_CALENDAR: '283248303891-7kttlq9tn5f43bk821fg7lnbhj5hvf6b.apps.googleusercontent.com',
        NIUBIZSCRIPT: 'https://static-content.vnforapps.com/v2/js/checkout.js',
        WEBFORMCHANNEL_FORM: 'https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/anonymous/static/production-form.min.js',
        USELARAIGO: true,
    },
    CLAROHISTORICAL: {
        API: 'http://10.240.65.10:6066/api',
        WS: 'https://clarobroker.laraigo.com',
        CHATFLOW: 'https://chatflow-claro.s3-web.us-east.cloud-object-storage.appdomain.cloud',
        FACEBOOKAPP: '1980305408682607',
        APIKEY_GMAPS: "AIzaSyAqrFCH95Tbqwo6opvVPcdtrVd-1fnBLr4",
        INSTAGRAMAPP: '1924971937716955',
        CATALOGAPP: '2131127810437236',
        CULQIKEY: 'pk_test_041501e753dcb2f9',
        GOOGLECLIENTID_LOGIN: '792367159924-f7uvieuu5bq7m7mvnik2a7t5mnepekel.apps.googleusercontent.com',
        GOOGLECLIENTID_CHANNEL: '129996056340-5spevp6sdv32c8dpbf9vhbfjjpvfqrth.apps.googleusercontent.com',
        FACEBOOKVERSION: 'v15.0',
        DIALOG360PARTNERID: 'nPJXndPA',
        GOOGLECLIENTID_CALENDAR: '283248303891-7kttlq9tn5f43bk821fg7lnbhj5hvf6b.apps.googleusercontent.com',
        USELARAIGO: false,
    },
    CLOUD: {
        API: 'https://cloudapi.laraigo.com/api',
        WS: 'https://cloudbroker.laraigo.com',
        CHATFLOW: 'https://zyxmelinux2.zyxmeapp.com/zyxmedemo/chatflowcloud',
        FACEBOOKAPP: '235008923608113',
        APIKEY_GMAPS: "AIzaSyAqrFCH95Tbqwo6opvVPcdtrVd-1fnBLr4",
        INSTAGRAMAPP: '467230660781510',
        CATALOGAPP: '2131127810437236',
        CULQIKEY: 'pk_test_041501e753dcb2f9',
        GOOGLECLIENTID_LOGIN: '792367159924-f7uvieuu5bq7m7mvnik2a7t5mnepekel.apps.googleusercontent.com',
        GOOGLECLIENTID_CHANNEL: '129996056340-5spevp6sdv32c8dpbf9vhbfjjpvfqrth.apps.googleusercontent.com',
        FACEBOOKVERSION: 'v15.0',
        DIALOG360PARTNERID: 'nPJXndPA',
        GOOGLECLIENTID_CALENDAR: '283248303891-7kttlq9tn5f43bk821fg7lnbhj5hvf6b.apps.googleusercontent.com',
        NIUBIZSCRIPT: 'https://static-content-qas.vnforapps.com/v2/js/checkout.js?qa=true',
        WEBFORMCHANNEL_FORM: 'https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/anonymous/static/production-form.min.js',
        USELARAIGO: false,
    },
    DEMO: {
        API: 'https://demoapix.laraigo.com/api',
        WS: 'https://demosocket.laraigo.com',
        CHATFLOW: 'https://zyxmelinux2.zyxmeapp.com/zyxmedemo/chatflow',
        FACEBOOKAPP: '235008923608113',
        APIKEY_GMAPS: "AIzaSyAqrFCH95Tbqwo6opvVPcdtrVd-1fnBLr4",
        INSTAGRAMAPP: '467230660781510',
        CATALOGAPP: '2131127810437236',
        CULQIKEY: 'pk_test_041501e753dcb2f9',
        GOOGLECLIENTID_LOGIN: '792367159924-f7uvieuu5bq7m7mvnik2a7t5mnepekel.apps.googleusercontent.com',
        GOOGLECLIENTID_CHANNEL: '129996056340-5spevp6sdv32c8dpbf9vhbfjjpvfqrth.apps.googleusercontent.com',
        FACEBOOKVERSION: 'v15.0',
        DIALOG360PARTNERID: 'nPJXndPA',
        GOOGLECLIENTID_CALENDAR: '283248303891-7kttlq9tn5f43bk821fg7lnbhj5hvf6b.apps.googleusercontent.com',
        NIUBIZSCRIPT: 'https://static-content-qas.vnforapps.com/v2/js/checkout.js?qa=true',
        WEBFORMCHANNEL_FORM: 'https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/anonymous/static/production-form.min.js',
        USELARAIGO: false,
    },
    LOCAL: {
        API: 'http://localhost:6065/api',
        //API: 'https://apix.laraigo.com/api',
        //WS: 'http://localhost:7070',
        WS: 'https://socket.laraigo.com',
        CHATFLOW: 'https://zyxmelinux2.zyxmeapp.com/zyxme/chatflow',
        FACEBOOKAPP: '235008923608113',
        APIKEY_GMAPS: "AIzaSyAqrFCH95Tbqwo6opvVPcdtrVd-1fnBLr4",
        INSTAGRAMAPP: '467230660781510',
        CATALOGAPP: '2131127810437236',
        CULQIKEY: 'pk_test_041501e753dcb2f9',
        GOOGLECLIENTID_LOGIN: '792367159924-f7uvieuu5bq7m7mvnik2a7t5mnepekel.apps.googleusercontent.com',
        GOOGLECLIENTID_CHANNEL: '129996056340-5spevp6sdv32c8dpbf9vhbfjjpvfqrth.apps.googleusercontent.com',
        FACEBOOKVERSION: 'v15.0',
        DIALOG360PARTNERID: 'nPJXndPA',
        GOOGLECLIENTID_CALENDAR: '283248303891-7kttlq9tn5f43bk821fg7lnbhj5hvf6b.apps.googleusercontent.com',
        NIUBIZSCRIPT: 'https://static-content-qas.vnforapps.com/v2/js/checkout.js?qa=true',
        WEBFORMCHANNEL_FORM: 'https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/anonymous/static/test-FormWebClient.min.js',
        USELARAIGO: false,
    }
}

const BASE_URL = APIS_URL[ENV].API
const WS_URL = APIS_URL[ENV].WS
const CHATFLOW_URL = APIS_URL[ENV].CHATFLOW
const FACEBOOKAPP = APIS_URL[ENV].FACEBOOKAPP
const INSTAGRAMAPP = APIS_URL[ENV].INSTAGRAMAPP
const CATALOGAPP = APIS_URL[ENV].CATALOGAPP
const CULQIKEY = APIS_URL[ENV].CULQIKEY
const GOOGLECLIENTID_LOGIN = APIS_URL[ENV].GOOGLECLIENTID_LOGIN
const GOOGLECLIENTID_CHANNEL = APIS_URL[ENV].GOOGLECLIENTID_CHANNEL
const FACEBOOKVERSION = APIS_URL[ENV].FACEBOOKVERSION
const DIALOG360PARTNERID = APIS_URL[ENV].DIALOG360PARTNERID
const GOOGLECLIENTID_CALENDAR = APIS_URL[ENV].GOOGLECLIENTID_CALENDAR
const NIUBIZSCRIPT = APIS_URL[ENV].NIUBIZSCRIPT
const WEBFORMCHANNEL_FORM = APIS_URL[ENV].WEBFORMCHANNEL_FORM
const APIKEY_GMAPS = APIS_URL[ENV].APIKEY_GMAPS
const USELARAIGO = APIS_URL[ENV].USELARAIGO

export const apiUrls = {
    WS_URL,
    FACEBOOKAPP,
    INSTAGRAMAPP,
    CATALOGAPP,
    CULQIKEY,
    GOOGLECLIENTID_LOGIN,
    GOOGLECLIENTID_CHANNEL,
    FACEBOOKVERSION,
    DIALOG360PARTNERID,
    GOOGLECLIENTID_CALENDAR,
    NIUBIZSCRIPT,
    WEBFORMCHANNEL_FORM,
    APIKEY_GMAPS,
    USELARAIGO,

    LOGIN_URL: `${BASE_URL}/auth`,
    CONNECT_INBOX: `${BASE_URL}/auth/connect`,
    CHANGE_ORGANIZATION: `${BASE_URL}/auth/changeorganization`,
    LOGOUT_URL: `${BASE_URL}/auth/logout`,
    MAIN_URL: `${BASE_URL}/main`,
    MAIN_EVENT_BOOKING_URL: `${BASE_URL}/event-booking/collection`,
    MAIN_EVENT_CANCELBOOKING_URL: `${BASE_URL}/event-booking/canceleventlaraigo`,
    MAIN_URL_PUBLIC: `${BASE_URL}/main/public/domainvalues`,
    MAIN_URL_PAYMENTORDER: `${BASE_URL}/main/public/paymentorder`,
    MAIN_URL_PAYMENTORDERNIUBIZ: `${BASE_URL}/main/public/paymentorderniubiz`,
    MAIN_MULTI: `${BASE_URL}/main/multi`,
    MAIN_MULTI_PUBLIC: `${BASE_URL}/main/public/multi/domainvalues`,
    EXECUTE_TRANSACTION: `${BASE_URL}/main/executetransaction`,
    MAIN_PAGINATED: `${BASE_URL}/main/paginated`,
    MAIN_GRAPHIC: `${BASE_URL}/main/graphic`,
    MAIN_DYNAMIC: `${BASE_URL}/reportdesigner`,
    MAIN_DYNAMIC_EXPORT: `${BASE_URL}/reportdesigner/export`,
    INTEGRATION: `${BASE_URL}/integration`,
    UPLOAD_FILE: `${BASE_URL}/upload`,
    TEST_REQUEST: `${BASE_URL}/flow/testrequest`,
    UPLOAD_FILEMETADATA: `${BASE_URL}/upload/metadata`,
    EXPORT_DATA: `${BASE_URL}/main/export`,

    CLOSE_TICKET: `${BASE_URL}/ticket/close`,
    MASSIVE_CLOSE_TICKET: `${BASE_URL}/ticket/massiveclose`,
    REPLY_TICKET: `${BASE_URL}/ticket/reply`,
    REPLY_LIST_TICKET: `${BASE_URL}/ticket/reply/list`,
    REASSIGN_TICKET: `${BASE_URL}/ticket/reassign`,
    SEND_HSM: `${BASE_URL}/ticket/send/hsm`,
    IMPORT_TICKET: `${BASE_URL}/ticket/import`,
    UPDATE_USER: `${BASE_URL}/user/update/info`,
    SAVE_USER: `${BASE_URL}/user/sendmail/password`,
    DEL_USER: `${BASE_URL}/user/delete`,
    WITAITEST: `${BASE_URL}/witai/message`,
    WITAITRAIN: `${BASE_URL}/witai/train_model`,
    WITAIENTITYINS: `${BASE_URL}/witai/entity`,
    WITAIUTTERANCEINS: `${BASE_URL}/witai/intent_utterance`,
    WITAIINTENTDEL: `${BASE_URL}/witai/intent_del`,
    WITAIENTITYDEL: `${BASE_URL}/witai/entity_del`,
    WITAIENTITYIMPORT: `${BASE_URL}/witai/entity_import`,
    WITAIINTENTIMPORT: `${BASE_URL}/witai/intent_import`,
    GETGEOCODE: `${BASE_URL}/gmaps/geocode`,
    GETLOCATION: `${BASE_URL}/flow/location`,
    GETVERSION: `${BASE_URL}/check/version`,
    TRIGGERBLOCK: `${BASE_URL}/flow/triggerblock`,

    INTEGRATION_URL: `${BASE_URL}/load`,
    CHANNELS: `${BASE_URL}/channel`,
    GET_PAGELIST: `${BASE_URL}/channel/getpagelist`,
    GET_PHONELIST: `${BASE_URL}/channel/getphonelist`,
    VERIFY_CHANNEL: `${BASE_URL}/subscription/get/contract`,
    GET_PAGELISTSUB: `${BASE_URL}/subscription/getpagelist`,
    INSERT_CHANNEL: `${BASE_URL}/channel/insertchannel`,
    ACTIVATE_CHANNEL: `${BASE_URL}/channel/activatechannel`,
    EXEC_SUB: `${BASE_URL}/subscription/createsubscription`,
    VALIDATE_NEW_USER: `${BASE_URL}/subscription/validateusername`,
    CURRENCYLIST: `${BASE_URL}/subscription/currencylist`,
    COUNTRYLIST: `${BASE_URL}/subscription/countrylist`,
    ACTIVATION_USER: `${BASE_URL}/subscription/activateuser`,
    DELETE_CHANNEL: `${BASE_URL}/channel/deletechannel`,
    CHECK_PAYMENTPLAN: `${BASE_URL}/channel/checkpaymentplan`,
    REESCHEDULECALL: `${BASE_URL}/campaign/hsmcall`,
    SEND_INVOICE: `${BASE_URL}/billing/sendinvoice`,

    PERSON: `${BASE_URL}/person`,

    CULQI: `${BASE_URL}/payment`,

    CHATFLOW: `${CHATFLOW_URL}`,

    BILLINGCREATEINVOICE: `${BASE_URL}/payment/createinvoice`,
    BILLINGCREATECREDITNOTE: `${BASE_URL}/payment/createcreditnote`,
    BILLINGREGULARIZEINVOICE: `${BASE_URL}/payment/regularizeinvoice`,
    GETEXCHANGERATE: `${BASE_URL}/payment/getexchangerate`,
    BILLINGEMITINVOICE: `${BASE_URL}/payment/emitinvoice`,

    RECOVERPASSWORD: `${BASE_URL}/subscription/recoverpassword`,
    CHANGEPASSWORD: `${BASE_URL}/subscription/changepassword`,

    VALIDATE_CHANNELS: `${BASE_URL}/subscription/validatechannels`,

    CARDCREATE: `${BASE_URL}/payment/cardcreate`,
    CARDDELETE: `${BASE_URL}/payment/carddelete`,
    CARDGET: `${BASE_URL}/payment/cardget`,

    VOXIMPLANT_GET_CATEGORIES: `${BASE_URL}/voximplant/getphonenumbercategories`,
    VOXIMPLANT_GET_COUNTRYSTATES: `${BASE_URL}/voximplant/getphonenumbercountrystates`,
    VOXIMPLANT_GET_REGIONS: `${BASE_URL}/voximplant/getphonenumberregions`,

    VOXIMPLANT_GET_MAXIMUMCONSUMPTION: `${BASE_URL}/voximplant/getmaximumconsumption`,
    VOXIMPLANT_TRANSFER_ACCOUNTBALANCE: `${BASE_URL}/voximplant/transferaccountbalance`,
    VOXIMPLANT_GET_ACCOUNTBALANCE: `${BASE_URL}/voximplant/getaccountbalance`,

    VOXIMPLANT_GET_CALLRECORD: `${BASE_URL}/voximplant/getcallrecord`,

    VOXIMPLANT_UPDATE_SCENARIO: `${BASE_URL}/voximplant/updatescenario`,

    GOOGLE_EXCHANGECODE: `${BASE_URL}/google/exchangecode`,
    GOOGLE_LISTBLOGGER: `${BASE_URL}/google/listblogger`,
    GOOGLE_LISTYOUTUBE: `${BASE_URL}/google/listyoutube`,
    SYNCHRONIZE_TEMPLATE: `${BASE_URL}/channel/synchronizetemplate`,
    ADD_TEMPLATE: `${BASE_URL}/channel/addtemplate`,
    DELETE_TEMPLATE: `${BASE_URL}/channel/deletetemplate`,
    GET_GROUP_LIST: `${BASE_URL}/channel/getgrouplist`,

    BILLING_REPORTPDF: `${BASE_URL}/drawpdf`,

    PRODUCT_IMPORT: `${BASE_URL}/product/import`,
    POSTHISTORY_SCHEDULE: `${BASE_URL}/posthistory/schedulepost`,
    EVENTBOOKING_GOOGLE_LOGIN: `${BASE_URL}/event-booking/googlelogin`,
    EVENTBOOKING_GOOGLE_DISCONNECT: `${BASE_URL}/event-booking/googledisconnect`,
    EVENTBOOKING_GOOGLE_VALIDATE: `${BASE_URL}/event-booking/googlevalidate`,

    PAYMENTORDER_PAY: `${BASE_URL}/payment/newpayment`,

    CATALOG_BUSINESSLIST: `${BASE_URL}/catalog/getbusinesslist`,
    CATALOG_MANAGECATALOG: `${BASE_URL}/catalog/managecatalog`,
    CATALOG_SYNCHROCATALOG: `${BASE_URL}/catalog/synchrocatalog`,
    CATALOG_SYNCHROPRODUCT: `${BASE_URL}/catalog/synchroproduct`,
    CATALOG_IMPORTPRODUCT: `${BASE_URL}/catalog/importproduct`,
    CATALOG_MANAGEPRODUCT: `${BASE_URL}/catalog/manageproduct`,
    CATALOG_DELETEPRODUCT: `${BASE_URL}/catalog/deleteproduct`,
    CATALOG_DOWNLOADPRODUCT: `${BASE_URL}/catalog/downloadproduct`,

    PAYMENTORDER_NIUBIZ_CREATESESSIONTOKEN: `${BASE_URL}/paymentniubiz/createsessiontoken`,
    PAYMENTORDER_NIUBIZ_AUTHORIZETRANSACTION: `${BASE_URL}/paymentniubiz/authorizetransaction`,
};