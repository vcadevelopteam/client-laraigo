import { IActionCall, IRequestBody, IRequestBodyPaginated } from "@types";
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

export const getTicketListByPerson = (payload: IRequestBody): IActionCall => ({
    callAPI: async () => CommonService.main(payload),
    types: {
        loading: actionTypes.GET_TICKET_LIST_BY_PERSON,
        failure: actionTypes.GET_TICKET_LIST_BY_PERSON_FAILURE,
        success: actionTypes.GET_TICKET_LIST_BY_PERSON_SUCCESS,
    },
    type: null,
});

export const resetGetTicketListByPerson = () => ({type: actionTypes.GET_TICKET_LIST_BY_PERSON_RESET });

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
