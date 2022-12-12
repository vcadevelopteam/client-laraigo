const actionType = {
    CHARGE: 'culqi/CHARGE',
    CHARGE_FAILURE: 'culqi/CHARGE_FAILURE',
    CHARGE_SUCCESS: 'culqi/CHARGE_SUCCESS',
    CHARGE_RESET: 'culqi/CHARGE_RESET',

    PAYMENTORDER: 'culqi/PAYMENTORDER',
    PAYMENTORDER_FAILURE: 'culqi/PAYMENTORDER_FAILURE',
    PAYMENTORDER_SUCCESS: 'culqi/PAYMENTORDER_SUCCESS',
    PAYMENTORDER_RESET: 'culqi/PAYMENTORDER_RESET',

    BALANCE: 'culqi/BALANCE',
    BALANCE_FAILURE: 'culqi/BALANCE_FAILURE',
    BALANCE_SUCCESS: 'culqi/BALANCE_SUCCESS',
    BALANCE_RESET: 'culqi/BALANCE_RESET',

    SUBSCRIBE: 'culqi/SUBSCRIBE',
    SUBSCRIBE_FAILURE: 'culqi/SUBSCRIBE_FAILURE',
    SUBSCRIBE_SUCCESS: 'culqi/SUBSCRIBE_SUCCESS',
    SUBSCRIBE_RESET: 'culqi/SUBSCRIBE_RESET',

    UNSUBSCRIBE: 'culqi/UNSUBSCRIBE',
    UNSUBSCRIBE_FAILURE: 'culqi/UNSUBSCRIBE_FAILURE',
    UNSUBSCRIBE_SUCCESS: 'culqi/UNSUBSCRIBE_SUCCESS',
    UNSUBSCRIBE_RESET: 'culqi/UNSUBSCRIBE_RESET',

    SEND_INVOICE: 'culqi/SEND_INVOICE',
    SEND_INVOICE_FAILURE: 'culqi/SEND_INVOICE_FAILURE',
    SEND_INVOICE_SUCCESS: 'culqi/SEND_INVOICE_SUCCESS',
    SEND_INVOICE_RESET: 'culqi/SEND_INVOICE_RESET',

    CREATE_INVOICE: 'culqi/CREATE_INVOICE',
    CREATE_INVOICE_FAILURE: 'culqi/CREATE_INVOICE_FAILURE',
    CREATE_INVOICE_SUCCESS: 'culqi/CREATE_INVOICE_SUCCESS',
    CREATE_INVOICE_RESET: 'culqi/CREATE_INVOICE_RESET',

    CREATE_CREDITNOTE: 'culqi/CREATE_CREDITNOTE',
    CREATE_CREDITNOTE_FAILURE: 'culqi/CREATE_CREDITNOTE_FAILURE',
    CREATE_CREDITNOTE_SUCCESS: 'culqi/CREATE_CREDITNOTE_SUCCESS',
    CREATE_CREDITNOTE_RESET: 'culqi/CREATE_CREDITNOTE_RESET',

    REGULARIZE_INVOICE: 'culqi/REGULARIZE_INVOICE',
    REGULARIZE_INVOICE_FAILURE: 'culqi/REGULARIZE_INVOICE_FAILURE',
    REGULARIZE_INVOICE_SUCCESS: 'culqi/REGULARIZE_INVOICE_SUCCESS',
    REGULARIZE_INVOICE_RESET: 'culqi/REGULARIZE_INVOICE_RESET',

    GET_EXCHANGERATE: 'culqi/GET_EXCHANGERATE',
    GET_EXCHANGERATE_FAILURE: 'culqi/GET_EXCHANGERATE_FAILURE',
    GET_EXCHANGERATE_SUCCESS: 'culqi/GET_EXCHANGERATE_SUCCESS',
    GET_EXCHANGERATE_RESET: 'culqi/GET_EXCHANGERATE_RESET',

    EMIT_INVOICE: 'culqi/EMIT_INVOICE',
    EMIT_INVOICE_FAILURE: 'culqi/EMIT_INVOICE_FAILURE',
    EMIT_INVOICE_SUCCESS: 'culqi/EMIT_INVOICE_SUCCESS',
    EMIT_INVOICE_RESET: 'culqi/EMIT_INVOICE_RESET',

    CARD_CREATE: 'subscription/CARD_CREATE',
    CARD_CREATE_FAILURE: 'subscription/CARD_CREATE_FAILURE',
    CARD_CREATE_RESET: 'subscription/CARD_CREATE_RESET',
    CARD_CREATE_SUCCESS: 'subscription/CARD_CREATE_SUCCESS',

    CARD_DELETE: 'subscription/CARD_DELETE',
    CARD_DELETE_FAILURE: 'subscription/CARD_DELETE_FAILURE',
    CARD_DELETE_RESET: 'subscription/CARD_DELETE_RESET',
    CARD_DELETE_SUCCESS: 'subscription/CARD_DELETE_SUCCESS',

    CARD_GET: 'subscription/CARD_GET',
    CARD_GET_FAILURE: 'subscription/CARD_GET_FAILURE',
    CARD_GET_RESET: 'subscription/CARD_GET_RESET',
    CARD_GET_SUCCESS: 'subscription/CARD_GET_SUCCESS',

    DRAW_REPORTPDF: 'subscription/DRAW_REPORTPDF',
    DRAW_REPORTPDF_FAILURE: 'subscription/DRAW_REPORTPDF_FAILURE',
    DRAW_REPORTPDF_RESET: 'subscription/DRAW_REPORTPDF_RESET',
    DRAW_REPORTPDF_SUCCESS: 'subscription/DRAW_REPORTPDF_SUCCESS',
};

export default actionType;