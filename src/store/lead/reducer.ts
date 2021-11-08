import { ICrmColumn, ICrmLead, IcrmLeadActivity, ICrmLeadNote, IListState, IObjectState, IProcessState } from "@types";
import { createReducer, initialListState, initialObjectState, initialProccessState } from "common/helpers";
import * as caseFUnctions from './caseFunctions';
import actionTypes from "./actionTypes";

export interface IState {
    lead: IObjectState<ICrmLead>;
    saveLead: IProcessState;
    advisers: IListState<any>;
    leadPhases: IListState<ICrmColumn>;
    leadActivities: IListState<IcrmLeadActivity>;
    leadLogNotes: IListState<ICrmLeadNote>;
    saveLeadActivity: IProcessState;
    saveLeadNote: IProcessState;
}

export const initialState: IState = {
    lead: initialObjectState,
    saveLead: initialProccessState,
    advisers: initialListState,
    leadPhases: initialListState,
    leadActivities: initialListState,
    leadLogNotes: initialListState,
    saveLeadActivity: initialProccessState,
    saveLeadNote: initialProccessState,
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

    [actionTypes.GET_ADVISERS]: caseFUnctions.getAdvisers,
    [actionTypes.GET_ADVISERS_SUCCESS]: caseFUnctions.getAdvisersSuccess,
    [actionTypes.GET_ADVISERS_FAILURE]: caseFUnctions.getAdvisersFailure,
    [actionTypes.GET_ADVISERS_RESET]: caseFUnctions.getAdvisersReset,

    [actionTypes.GET_PHASES]: caseFUnctions.getPhases,
    [actionTypes.GET_PHASES_SUCCESS]: caseFUnctions.getPhasesSuccess,
    [actionTypes.GET_PHASES_FAILURE]: caseFUnctions.getPhasesFailure,
    [actionTypes.GET_PHASES_RESET]: caseFUnctions.getPhasesReset,

    [actionTypes.GET_LEADACTIVITIES]: caseFUnctions.getLeadActivities,
    [actionTypes.GET_LEADACTIVITIES_SUCCESS]: caseFUnctions.getLeadActivitiesSuccess,
    [actionTypes.GET_LEADACTIVITIES_FAILURE]: caseFUnctions.getLeadActivitiesFailure,
    [actionTypes.GET_LEADACTIVITIES_RESET]: caseFUnctions.getLeadActivitiesReset,

    [actionTypes.GET_LEADNOTES]: caseFUnctions.getLeadNotes,
    [actionTypes.GET_LEADNOTES_SUCCESS]: caseFUnctions.getLeadNotesSuccess,
    [actionTypes.GET_LEADNOTES_FAILURE]: caseFUnctions.getLeadNotesFailure,
    [actionTypes.GET_LEADNOTES_RESET]: caseFUnctions.getLeadNotesReset,

    [actionTypes.SAVE_LEADACTIVITY]: caseFUnctions.saveLeadActivity,
    [actionTypes.SAVE_LEADACTIVITY_SUCCESS]: caseFUnctions.saveLeadActivitySuccess,
    [actionTypes.SAVE_LEADACTIVITY_FAILURE]: caseFUnctions.saveLeadActivityFailure,
    [actionTypes.SAVE_LEADACTIVITY_RESET]: caseFUnctions.saveLeadActivityReset,

    [actionTypes.SAVE_LEADNOIE]: caseFUnctions.saveLeadNote,
    [actionTypes.SAVE_LEADNOIE_SUCCESS]: caseFUnctions.saveLeadNoteSuccess,
    [actionTypes.SAVE_LEADNOIE_FAILURE]: caseFUnctions.saveLeadNoteFailure,
    [actionTypes.SAVE_LEADNOIE_RESET]: caseFUnctions.saveLeadNoteReset,
});
