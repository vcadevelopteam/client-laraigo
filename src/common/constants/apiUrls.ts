const ENV = "CLARO";

const APIS_URL = {
    DEVELOP: {
        API: 'https://apix.laraigo.com/api',
        // WS: 'http://localhost:7070',
        WS: 'https://socket.laraigo.com',
        CHATFLOW: 'https://zyxmelinux.zyxmeapp.com/zyxme/chatflow',
        FACEBOOKAPP: '367176075182579',
        INSTAGRAMAPP: '1924971937716955',
        CULQIKEY: 'pk_test_041501e753dcb2f9'
    },
    TESTING: {
        API: 'https://testapix.laraigo.com/api',
        WS: 'https://testsocket.laraigo.com',
        CHATFLOW: 'https://zyxmelinux.zyxmeapp.com/zyxmetest/chatflow',
        FACEBOOKAPP: '1094526090706564',
        INSTAGRAMAPP: '1924971937716955',
        CULQIKEY: 'pk_test_041501e753dcb2f9'
    },
    PRODUCTION: {
        API: 'https://apiprd.laraigo.com/api',
        WS: 'https://broker.laraigo.com',
        CHATFLOW: 'https://chatflow.s3-web.us-east.cloud-object-storage.appdomain.cloud',
        FACEBOOKAPP: '1980305408682607',
        INSTAGRAMAPP: '1924971937716955',
        CULQIKEY: 'pk_test_041501e753dcb2f9'
    },
    CLARO: {
        API: 'https://claroapi.laraigo.com/api',
        WS: 'https://clarobroker.laraigo.com',
        CHATFLOW: 'https://clarobackend.laraigo.com/zyxme/chatflow',
        FACEBOOKAPP: '1980305408682607',
        INSTAGRAMAPP: '1924971937716955',
        CULQIKEY: 'pk_test_041501e753dcb2f9'
    },
    LOCAL: {
        API: 'http://localhost:6065/api',
        //API: 'https://apix.laraigo.com/api',
        // WS: 'http://localhost:7070',
        WS: 'https://socket.laraigo.com',
        CHATFLOW: 'https://localhost:4200',
        FACEBOOKAPP: '367176075182579',
        INSTAGRAMAPP: '1924971937716955',
        CULQIKEY: 'pk_test_041501e753dcb2f9'
    }
}

const BASE_URL = APIS_URL[ENV].API
const WS_URL = APIS_URL[ENV].WS
const CHATFLOW_URL = APIS_URL[ENV].CHATFLOW
const FACEBOOKAPP = APIS_URL[ENV].FACEBOOKAPP
const INSTAGRAMAPP = APIS_URL[ENV].INSTAGRAMAPP
const CULQIKEY = APIS_URL[ENV].CULQIKEY

export const apiUrls = {
    WS_URL,
    FACEBOOKAPP,
    INSTAGRAMAPP,
    CULQIKEY,
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


    INTEGRATION_URL: `${BASE_URL}/load`,
    CHANNELS: `${BASE_URL}/channel`,
    GET_PAGELIST: `${BASE_URL}/channel/getpagelist`,
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
    SEND_INVOICE: `${BASE_URL}/billing/sendinvoice`,

    PERSON: `${BASE_URL}/person`,

    CULQI:  `${BASE_URL}/payment`,

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
};