import { IListState, IListStatePaginated, IObjectState, IPerson, IPersonAdditionalInfo, IPersonChannel, IPersonConversation, IPersonDomains, IPersonLead, IPersonReferrer, IProcessState } from "@types";
import { createReducer, initialListPaginatedState, initialListState, initialObjectState, initialProccessState } from "common/helpers";
import * as caseFUnctions from './caseFunctions';
import actionTypes from "./actionTypes";

export interface IState {
    personList: IListStatePaginated<IPerson>;
    personTicketList: IListStatePaginated<IPersonConversation>;
    personReferrerList: IListState<IPersonReferrer>;
    personChannelList: IListState<IPersonChannel>;
    personAdditionInfo: IListState<IPersonAdditionalInfo>;
    person: IObjectState<IPerson>;
    personLeadList: IListState<IPersonLead>;

    /**GET_DOMAINS_BY_TYPENAME */
    editableDomains: IObjectState<IPersonDomains>;

    editPerson: IProcessState;
}

export const initialState: IState = {
    personList: initialListPaginatedState,
    personTicketList: initialListPaginatedState,
    personReferrerList: initialListState,
    personChannelList: initialListState,
    personAdditionInfo: initialListState,
    person: initialObjectState,
    personLeadList: initialListState,

    editableDomains: initialObjectState,
    editPerson: initialProccessState,
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

    [actionTypes.GET_REFERRER_LIST_BY_PERSON]: caseFUnctions.getReferrerListByPerson,
    [actionTypes.GET_REFERRER_LIST_BY_PERSON_SUCCESS]: caseFUnctions.getReferrerListByPersonSuccess,
    [actionTypes.GET_REFERRER_LIST_BY_PERSON_FAILURE]: caseFUnctions.getReferrerListByPersonFailure,
    [actionTypes.GET_REFERRER_LIST_BY_PERSON_RESET]: caseFUnctions.getReferrerListByPersonReset,
    
    [actionTypes.GET_CHANNEL_LIST_BY_PERSON]: caseFUnctions.getChannelListByPerson,
    [actionTypes.GET_CHANNEL_LIST_BY_PERSON_SUCCESS]: caseFUnctions.getChannelListByPersonSuccess,
    [actionTypes.GET_CHANNEL_LIST_BY_PERSON_FAILURE]: caseFUnctions.getChannelListByPersonFailure,
    [actionTypes.GET_CHANNEL_LIST_BY_PERSON_RESET]: caseFUnctions.getChannelListByPersonReset,

    [actionTypes.GET_ADDITIONAL_INFO_BY_PERSON]: caseFUnctions.getAdditionalInfoByPerson,
    [actionTypes.GET_ADDITIONAL_INFO_BY_PERSON_SUCCESS]: caseFUnctions.getAdditionalInfoByPersonSuccess,
    [actionTypes.GET_ADDITIONAL_INFO_BY_PERSON_FAILURE]: caseFUnctions.getAdditionalInfoByPersonFailure,
    [actionTypes.GET_ADDITIONAL_INFO_BY_PERSON_RESET]: caseFUnctions.getAdditionalInfoByPerson,

    [actionTypes.GET_LEAD_LIST_BY_PERSON]: caseFUnctions.getLeadsByPerson,
    [actionTypes.GET_LEAD_LIST_BY_PERSON_SUCCESS]: caseFUnctions.getLeadsByPersonSuccess,
    [actionTypes.GET_LEAD_LIST_BY_PERSON_FAILURE]: caseFUnctions.getLeadsByPersonFailure,
    [actionTypes.GET_LEAD_LIST_BY_PERSON_RESET]: caseFUnctions.getLeadsByPersonReset,

    [actionTypes.GET_DOMAINS_BY_TYPENAME]: caseFUnctions.getDomainsByTypename,
    [actionTypes.GET_DOMAINS_BY_TYPENAME_SUCCESS]: caseFUnctions.getDomainsByTypenameSuccess,
    [actionTypes.GET_DOMAINS_BY_TYPENAME_FAILURE]: caseFUnctions.getDomainsByTypenameFailure,
    [actionTypes.GET_DOMAINS_BY_TYPENAME_RESET]: caseFUnctions.getDomainsByTypenameReset,

    [actionTypes.EDIT_PERSON]: caseFUnctions.editPerson,
    [actionTypes.EDIT_PERSON_SUCCESS]: caseFUnctions.editPersonSuccess,
    [actionTypes.EDIT_PERSON_FAILURE]: caseFUnctions.editPersonFailure,
    [actionTypes.EDIT_PERSON_RESET]: caseFUnctions.editPersonReset,
});
