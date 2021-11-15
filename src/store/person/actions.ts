import { IActionCall, IRequestBody, IRequestBodyPaginated, ITransaction } from "@types";
import { getValuesFromDomain, adviserSel, getMessageTemplateSel, getCommChannelLst } from "common/helpers";
import { CommonService, PersonService } from "network";
import actionTypes from "./actionTypes";

export const getPerson = (payload: IRequestBody): IActionCall => ({
    callAPI: async () => CommonService.main(payload),
    types: {
        loading: actionTypes.GET_PERSON,
        failure: actionTypes.GET_PERSON_FAILURE,
        success: actionTypes.GET_PERSON_SUCCESS,
    },
    type: null,
});

export const resetGetPerson = () => ({type: actionTypes.GET_PERSON_RESET });

export const getPersonListPaginated = (payload: IRequestBodyPaginated): IActionCall => ({
    callAPI: async () => CommonService.mainPaginated(payload),
    types: {
        loading: actionTypes.GET_PERSON_LIST,
        failure: actionTypes.GET_PERSON_LIST_FAILURE,
        success: actionTypes.GET_PERSON_LIST_SUCCESS,
    },
    type: null,
});

export const resetGetPersonListPaginated = () => ({type: actionTypes.GET_PERSON_LIST_RESET });

export const getTicketListByPerson = (payload: IRequestBodyPaginated): IActionCall => ({
    callAPI: async () => CommonService.mainPaginated(payload),
    types: {
        loading: actionTypes.GET_TICKET_LIST_BY_PERSON,
        failure: actionTypes.GET_TICKET_LIST_BY_PERSON_FAILURE,
        success: actionTypes.GET_TICKET_LIST_BY_PERSON_SUCCESS,
    },
    type: null,
});

export const resetGetTicketListByPerson = () => ({type: actionTypes.GET_TICKET_LIST_BY_PERSON_RESET });

export const getReferrerListByPerson = (payload: IRequestBody): IActionCall => ({
    callAPI: async () => CommonService.main(payload),
    types: {
        loading: actionTypes.GET_REFERRER_LIST_BY_PERSON,
        failure: actionTypes.GET_REFERRER_LIST_BY_PERSON_FAILURE,
        success: actionTypes.GET_REFERRER_LIST_BY_PERSON_SUCCESS,
    },
    type: null,
});

export const resetGetReferrerListByPerson = () => ({type: actionTypes.GET_REFERRER_LIST_BY_PERSON_RESET });

export const getChannelListByPerson = (payload: IRequestBody): IActionCall => ({
    callAPI: async () => CommonService.main(payload),
    types: {
        loading: actionTypes.GET_CHANNEL_LIST_BY_PERSON,
        failure: actionTypes.GET_CHANNEL_LIST_BY_PERSON_FAILURE,
        success: actionTypes.GET_CHANNEL_LIST_BY_PERSON_SUCCESS,
    },
    type: null,
});

export const resetGetChannelListByPerson = () => ({type: actionTypes.GET_CHANNEL_LIST_BY_PERSON_RESET });

export const getAdditionalInfoByPerson = (payload: IRequestBody): IActionCall => ({
    callAPI: async () => CommonService.main(payload),
    types: {
        loading: actionTypes.GET_ADDITIONAL_INFO_BY_PERSON,
        failure: actionTypes.GET_ADDITIONAL_INFO_BY_PERSON_FAILURE,
        success: actionTypes.GET_ADDITIONAL_INFO_BY_PERSON_SUCCESS,
    },
    type: null,
});

export const resetgetAdditionalInfoByPerson = () => ({type: actionTypes.GET_ADDITIONAL_INFO_BY_PERSON_RESET });

export const getLeadsByPerson = (payload: IRequestBody): IActionCall => ({
    callAPI: async () => PersonService.getLeadsByPerson(payload),
    types: {
        loading: actionTypes.GET_LEAD_LIST_BY_PERSON,
        failure: actionTypes.GET_LEAD_LIST_BY_PERSON_FAILURE,
        success: actionTypes.GET_LEAD_LIST_BY_PERSON_SUCCESS,
    },
    type: null,
});

export const resetGetLeadsByPerson = () => ({type: actionTypes.GET_LEAD_LIST_BY_PERSON_RESET });

/**
 * Managed domain types
 * 
 * GENERO, TIPODOCUMENTO, OCUPACION, ESTADOCIVIL, NIVELEDUCATIVO
 */
export const getDomainsByTypename = (): IActionCall => ({
    callAPI: async () => CommonService.multiMain([
        getValuesFromDomain("GENERO"),
        getValuesFromDomain("TIPODOCUMENTO"),
        getValuesFromDomain("OCUPACION"),
        getValuesFromDomain("ESTADOCIVIL"),
        getValuesFromDomain("NIVELEDUCATIVO"),
        getValuesFromDomain("TIPOPERSONA"),
        getValuesFromDomain("GRUPOPERSONA"),
        getValuesFromDomain("TIPOPERSONAGEN"),
        getValuesFromDomain("TIPOCANAL"),
        adviserSel(),
        getMessageTemplateSel(0),
        getCommChannelLst(),
    ]),
    types: {
        loading: actionTypes.GET_DOMAINS_BY_TYPENAME,
        failure: actionTypes.GET_DOMAINS_BY_TYPENAME_FAILURE,
        success: actionTypes.GET_DOMAINS_BY_TYPENAME_SUCCESS,
    },
    type: null,
});

export const resetGetDomainsByTypename = () => ({type: actionTypes.GET_DOMAINS_BY_TYPENAME_RESET });

// dispatch(execute({
//     header: insPersonBody({ ...p }),
//     detail: [
//         ...p.pcc.map((x: IPersonCommunicationChannel) => insPersonCommunicationChannel({ ...x })),
//     ]
// }, true));
export const editPerson = (payload: IRequestBody | ITransaction, insert: boolean = false): IActionCall => {
    if (insert) {
        // dispatch(execute({
//     header: insPersonBody({ ...p }),
//     detail: [
//         ...p.pcc.map((x: IPersonCommunicationChannel) => insPersonCommunicationChannel({ ...x })),
//     ]
// }, true));
    }
    return {
        callAPI: async () => CommonService.main(payload, insert),
        types: {
            loading: actionTypes.EDIT_PERSON,
            failure: actionTypes.EDIT_PERSON_FAILURE,
            success: actionTypes.EDIT_PERSON_SUCCESS,
        },
        type: null,
    }
};

export const resetEditPerson = () => ({type: actionTypes.EDIT_PERSON_RESET });
