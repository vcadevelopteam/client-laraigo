import { ICrmColumn, ICrmLead, IcrmLeadActivity, ICrmLeadHistory, ICrmLeadNote, IListState, IObjectState, IProcessState } from "@types";
import { createReducer, initialDisplayState, initialListState, initialObjectState, initialProccessState } from "common/helpers";
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
    display: string;
    archiveLead: IProcessState;
    markDoneActivity: IProcessState;
    leadHistory: IListState<ICrmLeadHistory>;
    updateLeadTags: IProcessState;
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
    display: initialDisplayState,
    archiveLead: initialProccessState,
    markDoneActivity: initialProccessState,
    leadHistory: initialListState,
    updateLeadTags: initialProccessState,
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

    [actionTypes.DISPLAY_LEAD]: caseFUnctions.displaySet,
    [actionTypes.DISPLAY_LEAD_RESET]: caseFUnctions.displayReset,

    [actionTypes.ARCHIVE_LEAD]: caseFUnctions.archiveLead,
    [actionTypes.ARCHIVE_LEAD_SUCCESS]: caseFUnctions.archiveLeadSuccess,
    [actionTypes.ARCHIVE_LEAD_FAILURE]: caseFUnctions.archiveLeadFailure,
    [actionTypes.ARCHIVE_LEAD_RESET]: caseFUnctions.archiveLeadReset,

    [actionTypes.MARK_DONE_ACTIVITY]: caseFUnctions.markDoneActivity,
    [actionTypes.MARK_DONE_ACTIVITY_SUCCESS]: caseFUnctions.markDoneActivitySuccess,
    [actionTypes.MARK_DONE_ACTIVITY_FAILURE]: caseFUnctions.markDoneActivityFailure,
    [actionTypes.MARK_DONE_ACTIVITY_RESET]: caseFUnctions.markDoneActivityReset,

    [actionTypes.GET_LEAD_HISTORY]: caseFUnctions.getLeadHistory,
    [actionTypes.GET_LEAD_HISTORY_SUCCESS]: caseFUnctions.getLeadHistorySuccess,
    [actionTypes.GET_LEAD_HISTORY_FAILURE]: caseFUnctions.getLeadHistoryFailure,
    [actionTypes.GET_LEAD_HISTORY_RESET]: caseFUnctions.getLeadHistoryReset,

    [actionTypes.UPDATE_LEAD_TAGS]: caseFUnctions.updateLeadTags,
    [actionTypes.UPDATE_LEAD_TAGS_SUCCESS]: caseFUnctions.updateLeadTagsSuccess,
    [actionTypes.UPDATE_LEAD_TAGS_FAILURE]: caseFUnctions.updateLeadTagsFailure,
    [actionTypes.UPDATE_LEAD_TAGS_RESET]: caseFUnctions.updateLeadTagsReset,
});
