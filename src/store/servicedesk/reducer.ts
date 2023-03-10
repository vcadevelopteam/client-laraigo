import { Dictionary, ICrmColumn, IcrmLeadActivity, ICrmLeadHistory, ICrmLeadNote, IDomain, IListState, IObjectState, IProcessState, IServiceDeskLead } from "@types";
import { createReducer, initialDisplayState, initialListState, initialObjectState, initialProccessState } from "common/helpers";
import * as caseFUnctions from './caseFunctions';
import actionTypes from "./actionTypes";

export interface IProduct {
    corpid: Number,
    orgid: Number,
    productcatalogid: Number,
    code: String,
    description: String,
    category: String,
    status: String,
    unitprice: Number
}

export interface IState {
    lead: IObjectState<IServiceDeskLead>;
    saveLead: IProcessState;
    advisers: IListState<any>;
    leadTemplates: IListState<Dictionary>;
    leadChannels: IListState<Dictionary>;
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
    leadProductsDomain: IListState<IProduct>;
    leadTagsDomain: IListState<IDomain>;
    personTypeDomain: IListState<IDomain>;
    urgency: IListState<IDomain>;
    impact: IListState<IDomain>;
    priority: IListState<IDomain>;
    groups: IListState<Dictionary>;
}

export const initialState: IState = {
    lead: initialObjectState,
    saveLead: initialProccessState,
    advisers: initialListState,
    leadPhases: initialListState,
    leadActivities: initialListState,
    leadTemplates: initialListState,
    leadChannels: initialListState,
    leadLogNotes: initialListState,
    saveLeadActivity: initialProccessState,
    saveLeadNote: initialProccessState,
    display: initialDisplayState,
    archiveLead: initialProccessState,
    markDoneActivity: initialProccessState,
    leadHistory: initialListState,
    updateLeadTags: initialProccessState,
    leadProductsDomain: initialListState,
    leadTagsDomain: initialListState,
    personTypeDomain: initialListState,
    urgency: initialListState,
    impact: initialListState,
    priority: initialListState,
    groups: initialListState,
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

    [actionTypes.GET_LEAD_PRODUCTS_DOMAIN]: caseFUnctions.getLeadProductsDomain,
    [actionTypes.GET_LEAD_PRODUCTS_DOMAIN_SUCCESS]: caseFUnctions.getLeadProductsDomainSuccess,
    [actionTypes.GET_LEAD_PRODUCTS_DOMAIN_FAILURE]: caseFUnctions.getLeadProductsDomainFailure,
    [actionTypes.GET_LEAD_PRODUCTS_DOMAIN_RESET]: caseFUnctions.getLeadProductsDomainReset,

    [actionTypes.GET_LEAD_TAGS_DOMAIN]: caseFUnctions.getLeadTagsDomain,
    [actionTypes.GET_LEAD_TAGS_DOMAIN_SUCCESS]: caseFUnctions.getLeadTagsDomainSuccess,
    [actionTypes.GET_LEAD_TAGS_DOMAIN_FAILURE]: caseFUnctions.getLeadTagsDomainFailure,
    [actionTypes.GET_LEAD_TAGS_DOMAIN_RESET]: caseFUnctions.getLeadTagsDomainReset,

    [actionTypes.GET_PERSON_TYPE]: caseFUnctions.getPersonType,
    [actionTypes.GET_PERSON_TYPE_SUCCESS]: caseFUnctions.getPersonTypeSuccess,
    [actionTypes.GET_PERSON_TYPE_FAILURE]: caseFUnctions.getPersonTypeFailure,
    [actionTypes.GET_PERSON_TYPE_RESET]: caseFUnctions.getPersonTypeReset,

    [actionTypes.GET_URGENCY]: caseFUnctions.getUrgency,
    [actionTypes.GET_URGENCY_SUCCESS]: caseFUnctions.getUrgencySuccess,
    [actionTypes.GET_URGENCY_FAILURE]: caseFUnctions.getUrgencyFailure,
    [actionTypes.GET_URGENCY_RESET]: caseFUnctions.getUrgencyReset,

    [actionTypes.GET_IMPACT]: caseFUnctions.getImpact,
    [actionTypes.GET_IMPACT_SUCCESS]: caseFUnctions.getImpactSuccess,
    [actionTypes.GET_IMPACT_FAILURE]: caseFUnctions.getImpactFailure,
    [actionTypes.GET_IMPACT_RESET]: caseFUnctions.getImpactReset,

    [actionTypes.GET_PRIORITY]: caseFUnctions.getPriority,
    [actionTypes.GET_PRIORITY_SUCCESS]: caseFUnctions.getPrioritySuccess,
    [actionTypes.GET_PRIORITY_FAILURE]: caseFUnctions.getPriorityFailure,
    [actionTypes.GET_PRIORITY_RESET]: caseFUnctions.getPriorityReset,

    [actionTypes.GET_LEAD_TEMPLATES]: caseFUnctions.getLeadTemplates,
    [actionTypes.GET_LEAD_TEMPLATES_SUCCESS]: caseFUnctions.getLeadTemplatesSuccess,
    [actionTypes.GET_LEAD_TEMPLATES_FAILURE]: caseFUnctions.getLeadTemplatesFailure,
    [actionTypes.GET_LEAD_TEMPLATES_RESET]: caseFUnctions.getLeadTemplatesReset,

    [actionTypes.GET_LEAD_CHANNELS]: caseFUnctions.getLeadChannels,
    [actionTypes.GET_LEAD_CHANNELS_SUCCESS]: caseFUnctions.getLeadChannelsSuccess,
    [actionTypes.GET_LEAD_CHANNELS_FAILURE]: caseFUnctions.getLeadChannelsFailure,
    [actionTypes.GET_LEAD_CHANNELS_RESET]: caseFUnctions.getLeadChannelsReset,

    [actionTypes.GET_GROUPS]: caseFUnctions.getGroups,
    [actionTypes.GET_GROUPS_SUCCESS]: caseFUnctions.getGroupsSuccess,
    [actionTypes.GET_GROUPS_FAILURE]: caseFUnctions.getGroupsFailure,
    [actionTypes.GET_GROUPS_RESET]: caseFUnctions.getGroupsReset,
});
