import { ICrmLead, IListState, IObjectState, IProcessState } from "@types";
import { createReducer, initialListState, initialObjectState, initialProccessState } from "common/helpers";
import * as caseFUnctions from './caseFunctions';
import actionTypes from "./actionTypes";

export interface IState {
    lead: IObjectState<ICrmLead>;
    saveLead: IProcessState;
    tags: IListState<any>; // cambiar por notas notes
    advisers: IListState<any>;
}

export const initialState: IState = {
    lead: initialObjectState,
    saveLead: initialProccessState,
    tags: initialListState,
    advisers: initialListState,
};

export default createReducer<IState>(initialState, {
    [actionTypes.GET_LEAD]: caseFUnctions.getLead,
    [actionTypes.GET_LEAD_SUCCESS]: caseFUnctions.getLeadSuccess,
    [actionTypes.GET_LEAD_FAILURE]: caseFUnctions.getLeadFailure,
    [actionTypes.GET_LEAD_RESET]: caseFUnctions.getLeadReset,

    [actionTypes.SAVE_LEAD]: caseFUnctions.saveLead,
    [actionTypes.SAVE_LEAD_SUCCESS]: caseFUnctions.saveLeadSuccess,
    [actionTypes.SAVE_LEAD_FAILURE]: caseFUnctions.saveLeadFailure,
    [actionTypes.SAVE_LEAD_RESET]: caseFUnctions.saveLeadReset,

    [actionTypes.GET_TAGS]: caseFUnctions.getLeadTags,
    [actionTypes.GET_TAGS_SUCCESS]: caseFUnctions.getLeadTagsSuccess,
    [actionTypes.GET_TAGS_FAILURE]: caseFUnctions.getLeadTagsFailure,
    [actionTypes.GET_TAGS_RESET]: caseFUnctions.getLeadTagsReset,

    [actionTypes.GET_ADVISERS]: caseFUnctions.getAdvisers,
    [actionTypes.GET_ADVISERS_SUCCESS]: caseFUnctions.getAdvisersSuccess,
    [actionTypes.GET_ADVISERS_FAILURE]: caseFUnctions.getAdvisersFailure,
    [actionTypes.GET_ADVISERS_RESET]: caseFUnctions.getAdvisersReset,
});
