import { IListState, IListStatePaginated, IObjectState, IPerson, IPersonAdditionalInfo, IPersonChannel, IPersonConversation } from "@types";
import { createReducer, initialListPaginatedState, initialListState, initialObjectState } from "common/helpers";
import * as caseFUnctions from './caseFunctions';
import actionTypes from "./actionTypes";

export interface IState {
    personList: IListStatePaginated<IPerson>;
    personTicketList: IListState<IPersonConversation>;
    personChannelList: IListState<IPersonChannel>;
    personAdditionInfo: IListState<IPersonAdditionalInfo>;
    person: IObjectState<IPerson>;
    personOpportunityList: IListState<any>;
}

export const initialState: IState = {
    personList: initialListPaginatedState,
    personTicketList: initialListState,
    personChannelList: initialListState,
    personAdditionInfo: initialListState,
    person: initialObjectState,
    personOpportunityList: initialListState,
};

export default createReducer<IState>(initialState, {
    [actionTypes.GET_PERSON]: caseFUnctions.getPerson,
    [actionTypes.GET_PERSON_SUCCESS]: caseFUnctions.getPersonSuccess,
    [actionTypes.GET_PERSON_FAILURE]: caseFUnctions.getPersonFailure,
    [actionTypes.GET_PERSON_RESET]: caseFUnctions.getPersonReset,

    [actionTypes.GET_PERSON_LIST]: caseFUnctions.getPersonListPaginated,
    [actionTypes.GET_PERSON_LIST_SUCCESS]: caseFUnctions.getPersonListPaginatedSuccess,
    [actionTypes.GET_PERSON_LIST_FAILURE]: caseFUnctions.getPersonListPaginatedFailure,
    [actionTypes.GET_PERSON_LIST_RESET]: caseFUnctions.getPersonListPaginatedReset,

    [actionTypes.GET_TICKET_LIST_BY_PERSON]: caseFUnctions.getTicketListByPerson,
    [actionTypes.GET_TICKET_LIST_BY_PERSON_SUCCESS]: caseFUnctions.getTicketListByPersonSuccess,
    [actionTypes.GET_TICKET_LIST_BY_PERSON_FAILURE]: caseFUnctions.getTicketListByPersonFailure,
    [actionTypes.GET_TICKET_LIST_BY_PERSON_RESET]: caseFUnctions.getTicketListByPersonReset,

    [actionTypes.GET_CHANNEL_LIST_BY_PERSON]: caseFUnctions.getChannelListByPerson,
    [actionTypes.GET_CHANNEL_LIST_BY_PERSON_SUCCESS]: caseFUnctions.getChannelListByPersonSuccess,
    [actionTypes.GET_CHANNEL_LIST_BY_PERSON_FAILURE]: caseFUnctions.getChannelListByPersonFailure,
    [actionTypes.GET_CHANNEL_LIST_BY_PERSON_RESET]: caseFUnctions.getChannelListByPersonReset,

    [actionTypes.GET_ADDITIONAL_INFO_BY_PERSON]: caseFUnctions.getAdditionalInfoByPerson,
    [actionTypes.GET_ADDITIONAL_INFO_BY_PERSON_SUCCESS]: caseFUnctions.getAdditionalInfoByPersonSuccess,
    [actionTypes.GET_ADDITIONAL_INFO_BY_PERSON_FAILURE]: caseFUnctions.getAdditionalInfoByPersonFailure,
    [actionTypes.GET_ADDITIONAL_INFO_BY_PERSON_RESET]: caseFUnctions.getAdditionalInfoByPerson,

    [actionTypes.GET_OPPORTUNITY_LIST_BY_PERSON]: caseFUnctions.getOpportunitiesByPerson,
    [actionTypes.GET_OPPORTUNITY_LIST_BY_PERSON_SUCCESS]: caseFUnctions.getOpportunitiesByPersonSuccess,
    [actionTypes.GET_OPPORTUNITY_LIST_BY_PERSON_FAILURE]: caseFUnctions.getOpportunitiesByPersonFailure,
    [actionTypes.GET_OPPORTUNITY_LIST_BY_PERSON_RESET]: caseFUnctions.getOpportunitiesByPersonReset,
});
