const ENV = "TESTING";

const APIS_URL = {
    DEVELOP: {
        API: 'https://apix.laraigo.com/api',
        //WS: 'http://localhost:7070',
        WS: 'https://socket.laraigo.com',
        CHATFLOW: 'https://zyxmelinux2.zyxmeapp.com/zyxme/chatflow',
        FACEBOOKAPP: '367176075182579',
        INSTAGRAMAPP: '1872023336244866',
        CULQIKEY: 'pk_test_041501e753dcb2f9',
        GOOGLECLIENTID_LOGIN: '792367159924-f7uvieuu5bq7m7mvnik2a7t5mnepekel.apps.googleusercontent.com',
        GOOGLECLIENTID_CHANNEL: '129996056340-5spevp6sdv32c8dpbf9vhbfjjpvfqrth.apps.googleusercontent.com',
        FACEBOOKVERSION: 'v15.0',
        DIALOG360PARTNERID: 'nPJXndPA',
    },
    TESTING: {
        API: 'https://testapix.laraigo.com/api',
        WS: 'https://testsocket.laraigo.com',
        CHATFLOW: 'https://zyxmelinux2.zyxmeapp.com/zyxmetest/chatflow',
        FACEBOOKAPP: '1094526090706564',
        INSTAGRAMAPP: '1872023336244866',
        CULQIKEY: 'pk_test_041501e753dcb2f9',
        GOOGLECLIENTID_LOGIN: '792367159924-f7uvieuu5bq7m7mvnik2a7t5mnepekel.apps.googleusercontent.com',
        GOOGLECLIENTID_CHANNEL: '129996056340-5spevp6sdv32c8dpbf9vhbfjjpvfqrth.apps.googleusercontent.com',
        FACEBOOKVERSION: 'v15.0',
        DIALOG360PARTNERID: 'nPJXndPA',
    },
    PRODUCTION: {
        API: 'https://apiprd.laraigo.com/api',
        WS: 'https://broker.laraigo.com',
        CHATFLOW: 'https://chatflow.s3-web.us-east.cloud-object-storage.appdomain.cloud',
        FACEBOOKAPP: '1980305408682607',
        INSTAGRAMAPP: '1924971937716955',
        CULQIKEY: 'pk_test_041501e753dcb2f9',
        GOOGLECLIENTID_LOGIN: '792367159924-f7uvieuu5bq7m7mvnik2a7t5mnepekel.apps.googleusercontent.com',
        GOOGLECLIENTID_CHANNEL: '129996056340-5spevp6sdv32c8dpbf9vhbfjjpvfqrth.apps.googleusercontent.com',
        FACEBOOKVERSION: 'v15.0',
        DIALOG360PARTNERID: 'nPJXndPA',
    },
    CLARO: {
        API: 'https://claroapi.laraigo.com/api',
        WS: 'https://clarobroker.laraigo.com',
        CHATFLOW: 'https://clarobackend.laraigo.com/zyxme/chatflow',
        FACEBOOKAPP: '1980305408682607',
        INSTAGRAMAPP: '1924971937716955',
        CULQIKEY: 'pk_test_041501e753dcb2f9',
        GOOGLECLIENTID_LOGIN: '792367159924-f7uvieuu5bq7m7mvnik2a7t5mnepekel.apps.googleusercontent.com',
        GOOGLECLIENTID_CHANNEL: '129996056340-5spevp6sdv32c8dpbf9vhbfjjpvfqrth.apps.googleusercontent.com',
        FACEBOOKVERSION: 'v15.0',
        DIALOG360PARTNERID: 'nPJXndPA',
    },
    CLOUD: {
        API: 'https://cloudapi.laraigo.com/api',
        WS: 'https://cloudbroker.laraigo.com',
        CHATFLOW: 'https://zyxmelinux2.zyxmeapp.com/zyxmedemo/chatflowcloud',
        FACEBOOKAPP: '1094526090706564',
        INSTAGRAMAPP: '1872023336244866',
        CULQIKEY: 'pk_test_041501e753dcb2f9',
        GOOGLECLIENTID_LOGIN: '792367159924-f7uvieuu5bq7m7mvnik2a7t5mnepekel.apps.googleusercontent.com',
        GOOGLECLIENTID_CHANNEL: '129996056340-5spevp6sdv32c8dpbf9vhbfjjpvfqrth.apps.googleusercontent.com',
        FACEBOOKVERSION: 'v15.0',
        DIALOG360PARTNERID: 'nPJXndPA',
    },
    DEMO: {
        API: 'https://demoapix.laraigo.com/api',
        WS: 'https://demosocket.laraigo.com',
        CHATFLOW: 'https://zyxmelinux2.zyxmeapp.com/zyxmedemo/chatflow',
        FACEBOOKAPP: '1094526090706564',
        INSTAGRAMAPP: '1872023336244866',
        CULQIKEY: 'pk_test_041501e753dcb2f9',
        GOOGLECLIENTID_LOGIN: '792367159924-f7uvieuu5bq7m7mvnik2a7t5mnepekel.apps.googleusercontent.com',
        GOOGLECLIENTID_CHANNEL: '129996056340-5spevp6sdv32c8dpbf9vhbfjjpvfqrth.apps.googleusercontent.com',
        FACEBOOKVERSION: 'v15.0',
        DIALOG360PARTNERID: 'nPJXndPA',
    },
    LOCAL: {
        API: 'http://localhost:6065/api',
        //API: 'https://apix.laraigo.com/api',
        //WS: 'http://localhost:7070',
        WS: 'https://socket.laraigo.com',
        CHATFLOW: 'https://zyxmelinux2.zyxmeapp.com/zyxme/chatflow',
        FACEBOOKAPP: '367176075182579',
        INSTAGRAMAPP: '1924971937716955',
        CULQIKEY: 'pk_test_041501e753dcb2f9',
        GOOGLECLIENTID_LOGIN: '792367159924-f7uvieuu5bq7m7mvnik2a7t5mnepekel.apps.googleusercontent.com',
        GOOGLECLIENTID_CHANNEL: '129996056340-5spevp6sdv32c8dpbf9vhbfjjpvfqrth.apps.googleusercontent.com',
        FACEBOOKVERSION: 'v15.0',
        DIALOG360PARTNERID: 'nPJXndPA',
    }
}

const BASE_URL = APIS_URL[ENV].API
const WS_URL = APIS_URL[ENV].WS
const CHATFLOW_URL = APIS_URL[ENV].CHATFLOW
const FACEBOOKAPP = APIS_URL[ENV].FACEBOOKAPP
const INSTAGRAMAPP = APIS_URL[ENV].INSTAGRAMAPP
const CULQIKEY = APIS_URL[ENV].CULQIKEY
const GOOGLECLIENTID_LOGIN = APIS_URL[ENV].GOOGLECLIENTID_LOGIN
const GOOGLECLIENTID_CHANNEL = APIS_URL[ENV].GOOGLECLIENTID_CHANNEL
const FACEBOOKVERSION = APIS_URL[ENV].FACEBOOKVERSION
const DIALOG360PARTNERID = APIS_URL[ENV].DIALOG360PARTNERID

export const apiUrls = {
    WS_URL,
    FACEBOOKAPP,
    INSTAGRAMAPP,
    CULQIKEY,
    GOOGLECLIENTID_LOGIN,
    GOOGLECLIENTID_CHANNEL,
    FACEBOOKVERSION,
    DIALOG360PARTNERID,
    LOGIN_URL: `${BASE_URL}/auth`,
    CONNECT_INBOX: `${BASE_URL}/auth/connect`,
    CHANGE_ORGANIZATION: `${BASE_URL}/auth/changeorganization`,
    LOGOUT_URL: `${BASE_URL}/auth/logout`,
    MAIN_URL: `${BASE_URL}/main`,
    MAIN_EVENT_BOOKING_URL: `${BASE_URL}/event-booking/collection`,
    MAIN_URL_PUBLIC: `${BASE_URL}/main/public/domainvalues`,
    MAIN_MULTI: `${BASE_URL}/main/multi`,
    MAIN_MULTI_PUBLIC: `${BASE_URL}/main/public/multi/domainvalues`,
    EXECUTE_TRANSACTION: `${BASE_URL}/main/executetransaction`,
    MAIN_PAGINATED: `${BASE_URL}/main/paginated`,
    MAIN_GRAPHIC: `${BASE_URL}/main/graphic`,
    MAIN_DYNAMIC: `${BASE_URL}/reportdesigner`,
    MAIN_DYNAMIC_EXPORT: `${BASE_URL}/reportdesigner/export`,
    INTEGRATION: `${BASE_URL}/integration`,
    UPLOAD_FILE: `${BASE_URL}/upload`,
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

    BILLING_REPORTPDF: `${BASE_URL}/drawpdf`,
};