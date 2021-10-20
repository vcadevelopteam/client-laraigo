import { IActionCall, IRequestBody, IRequestBodyPaginated } from "@types";
import { getValuesFromDomain } from "common/helpers";
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

export const getOpportunitiesByPerson = (payload: IRequestBody): IActionCall => ({
    callAPI: async () => PersonService.getOpportunitiesByPerson(payload),
    types: {
        loading: actionTypes.GET_OPPORTUNITY_LIST_BY_PERSON,
        failure: actionTypes.GET_OPPORTUNITY_LIST_BY_PERSON_FAILURE,
        success: actionTypes.GET_OPPORTUNITY_LIST_BY_PERSON_SUCCESS,
    },
    type: null,
});

export const resetGetOpportunitiesByPerson = () => ({type: actionTypes.GET_OPPORTUNITY_LIST_BY_PERSON_RESET });

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
    ]),
    types: {
        loading: actionTypes.GET_DOMAINS_BY_TYPENAME,
        failure: actionTypes.GET_DOMAINS_BY_TYPENAME_FAILURE,
        success: actionTypes.GET_DOMAINS_BY_TYPENAME_SUCCESS,
    },
    type: null,
});

export const resetGetDomainsByTypename = () => ({type: actionTypes.GET_DOMAINS_BY_TYPENAME_RESET });

export const editPerson = (payload: IRequestBody): IActionCall => ({
    callAPI: async () => CommonService.main(payload),
    types: {
        loading: actionTypes.EDIT_PERSON,
        failure: actionTypes.EDIT_PERSON_FAILURE,
        success: actionTypes.EDIT_PERSON_SUCCESS,
    },
    type: null,
});

export const resetEditPerson = () => ({type: actionTypes.EDIT_PERSON_RESET });
