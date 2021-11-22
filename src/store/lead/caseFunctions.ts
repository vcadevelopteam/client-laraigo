import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const getLead = (state: IState): IState => ({
    ...state,
    lead: { ...state.lead, loading: true, error: false },
});

export const getLeadSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    lead: {
        value: (action.payload.data || [])[0],
        loading: false,
        error: false,
    },
});

export const getLeadFailure = (state: IState, action: IAction): IState => ({
    ...state,
    lead: {
        ...state.lead,
        loading: false,
        error: true,
        code: action.payload.code || 'getTicketsFailure:error',
        message: action.payload.message || 'Error al obtener la oportunidad',
    },
});

export const getLeadReset = (state: IState): IState => ({
    ...state,
    lead: initialState.lead,
});

export const saveLead = (state: IState): IState => ({
    ...state,
    saveLead: { ...state.saveLead, loading: true, error: false },
});

export const saveLeadSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    saveLead: {
        success: true,
        loading: false,
        error: false,
    },
});

export const saveLeadFailure = (state: IState, action: IAction): IState => ({
    ...state,
    saveLead: {
        ...state.saveLead,
        loading: false,
        error: true,
        code: action.payload.code || 'getTicketsFailure:error',
        message: action.payload.message || 'Error al guardar la oportunidad',
    },
});

export const saveLeadReset = (state: IState): IState => ({
    ...state,
    saveLead: initialState.saveLead,
});

export const getAdvisers = (state: IState): IState => ({
    ...state,
    advisers: { ...state.advisers, loading: true, error: false },
});

export const getAdvisersSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    advisers: {
        data: action.payload.data || [],
        loading: false,
        error: false,
    },
});

export const getAdvisersFailure = (state: IState, action: IAction): IState => ({
    ...state,
    advisers: {
        ...state.advisers,
        loading: false,
        error: true,
        code: action.payload.code || 'getTicketsFailure:error',
        message: action.payload.message || 'Error al cargar los asesores',
    },
});

export const getAdvisersReset = (state: IState): IState => ({
    ...state,
    advisers: initialState.advisers,
});

export const getLeadNotes = (state: IState): IState => ({
    ...state,
    leadLogNotes: { ...state.leadLogNotes, loading: true, error: false },
});

export const getLeadNotesSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    leadLogNotes: {
        data: action.payload.data || [],
        loading: false,
        error: false,
    },
});

export const getLeadNotesFailure = (state: IState, action: IAction): IState => ({
    ...state,
    leadLogNotes: {
        ...state.leadLogNotes,
        loading: false,
        error: true,
        code: action.payload.code || 'getTicketsFailure:error',
        message: action.payload.message || 'Error al cargar las notas',
    },
});

export const getLeadNotesReset = (state: IState): IState => ({
    ...state,
    leadLogNotes: initialState.leadLogNotes,
});

export const getLeadActivities = (state: IState): IState => ({
    ...state,
    leadActivities: { ...state.leadActivities, loading: true, error: false },
});

export const getLeadActivitiesSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    leadActivities: {
        data: action.payload.data || [],
        loading: false,
        error: false,
    },
});

export const getLeadActivitiesFailure = (state: IState, action: IAction): IState => ({
    ...state,
    leadActivities: {
        ...state.leadActivities,
        loading: false,
        error: true,
        code: action.payload.code || 'getTicketsFailure:error',
        message: action.payload.message || 'Error al cargar las actividades',
    },
});

export const getLeadActivitiesReset = (state: IState): IState => ({
    ...state,
    leadActivities: initialState.leadActivities,
});

export const saveLeadNote = (state: IState): IState => ({
    ...state,
    saveLeadNote: { ...state.saveLeadNote, loading: true, error: false },
});

export const saveLeadNoteSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    saveLeadNote: {
        success: true,
        loading: false,
        error: false,
    },
});

export const saveLeadNoteFailure = (state: IState, action: IAction): IState => ({
    ...state,
    saveLeadNote: {
        success: false,
        loading: false,
        error: true,
        code: action.payload.code || 'getTicketsFailure:error',
        message: action.payload.message || 'Error al guardar la nota',
    },
});

export const saveLeadNoteReset = (state: IState): IState => ({
    ...state,
    saveLeadNote: initialState.saveLeadNote,
});

export const saveLeadActivity = (state: IState): IState => ({
    ...state,
    saveLeadActivity: { ...state.saveLeadActivity, loading: true, error: false },
});

export const saveLeadActivitySuccess = (state: IState, action: IAction): IState => ({
    ...state,
    saveLeadActivity: {
        success: true,
        loading: false,
        error: false,
    },
});

export const saveLeadActivityFailure = (state: IState, action: IAction): IState => ({
    ...state,
    saveLeadActivity: {
        success: false,
        loading: false,
        error: true,
        code: action.payload.code || 'getTicketsFailure:error',
        message: action.payload.message || 'Error al guardar la actividad',
    },
});

export const saveLeadActivityReset = (state: IState): IState => ({
    ...state,
    saveLeadActivity: initialState.saveLeadActivity,
});

export const getPhases = (state: IState): IState => ({
    ...state,
    leadPhases: { ...state.leadPhases, loading: true, error: false },
});

export const getPhasesSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    leadPhases: {
        data: action.payload.data || [],
        loading: false,
        error: false,
    },
});

export const getPhasesFailure = (state: IState, action: IAction): IState => ({
    ...state,
    leadPhases: {
        ...state.leadPhases,
        loading: false,
        error: true,
        code: action.payload.code || 'getTicketsFailure:error',
        message: action.payload.message || 'Error al cargar las fases',
    },
});

export const getPhasesReset = (state: IState): IState => ({
    ...state,
    leadPhases: initialState.leadPhases,
});

export const displaySet = (state: IState, action: IAction): IState => ({
    ...state,
    display: action.payload
});

export const displayReset = (state: IState): IState => ({
    ...state,
    display: 'BOARD'
});

export const archiveLead = (state: IState): IState => ({
    ...state,
    archiveLead: { ...state.archiveLead, loading: true, error: false },
});

export const archiveLeadSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    archiveLead: {
        success: true,
        loading: false,
        error: false,
    },
});

export const archiveLeadFailure = (state: IState, action: IAction): IState => ({
    ...state,
    archiveLead: {
        success: false,
        loading: false,
        error: true,
        code: action.payload.code || 'archiveLeadFailure:error',
        message: action.payload.message || 'Error al cerrar la oportunidad',
    },
});

export const archiveLeadReset = (state: IState): IState => ({
    ...state,
    archiveLead: initialState.archiveLead,
});

export const markDoneActivity = (state: IState): IState => ({
    ...state,
    markDoneActivity: { ...state.markDoneActivity, loading: true, error: false },
});

export const markDoneActivitySuccess = (state: IState, action: IAction): IState => ({
    ...state,
    markDoneActivity: {
        success: true,
        loading: false,
        error: false,
    },
});

export const markDoneActivityFailure = (state: IState, action: IAction): IState => ({
    ...state,
    markDoneActivity: {
        success: false,
        loading: false,
        error: true,
        code: action.payload.code || 'archiveLeadFailure:error',
        message: action.payload.message || 'Error al guardar la actividad',
    },
});

export const markDoneActivityReset = (state: IState): IState => ({
    ...state,
    markDoneActivity: initialState.markDoneActivity,
});

export const getLeadHistory = (state: IState): IState => ({
    ...state,
    leadHistory: { ...state.leadHistory, loading: true, error: false },
});

export const getLeadHistorySuccess = (state: IState, action: IAction): IState => ({
    ...state,
    leadHistory: {
        data: action.payload.data || [],
        loading: false,
        error: false,
    },
});

export const getLeadHistoryFailure = (state: IState, action: IAction): IState => ({
    ...state,
    leadHistory: {
        ...state.leadHistory,
        loading: false,
        error: true,
        code: action.payload.code || 'getLeadHistoryFailure:error',
        message: action.payload.message || 'Error al cargar el historial de la oportunidad',
    },
});

export const getLeadHistoryReset = (state: IState): IState => ({
    ...state,
    leadHistory: initialState.leadHistory,
});

export const updateLeadTags = (state: IState): IState => ({
    ...state,
    updateLeadTags: { ...state.updateLeadTags, loading: true, error: false },
});

export const updateLeadTagsSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    updateLeadTags: {
        success: true,
        loading: false,
        error: false,
    },
});

export const updateLeadTagsFailure = (state: IState, action: IAction): IState => ({
    ...state,
    updateLeadTags: {
        success: false,
        loading: false,
        error: true,
        code: action.payload.code || 'updateLeadTagsFailure:error',
        message: action.payload.message || 'Error al guardar los tags',
    },
});

export const updateLeadTagsReset = (state: IState): IState => ({
    ...state,
    updateLeadTags: initialState.updateLeadTags,
});
