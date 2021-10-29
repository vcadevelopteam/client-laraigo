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

export const getLeadTags = (state: IState): IState => ({
    ...state,
    tags: { ...state.tags, loading: true, error: false },
});

export const getLeadTagsSuccess = (state: IState, action: IAction): IState => {
    console.log(action.payload);
    return {
        ...state,
        tags: {
            data: action.payload.data || [],
            loading: false,
            error: false,
        },
    };
}

export const getLeadTagsFailure = (state: IState, action: IAction): IState => ({
    ...state,
    tags: {
        ...state.tags,
        loading: false,
        error: true,
        code: action.payload.code || 'getTicketsFailure:error',
        message: action.payload.message || 'Error al cargar los tags',
    },
});

export const getLeadTagsReset = (state: IState): IState => ({
    ...state,
    tags: initialState.tags,
});

export const getAdvisers = (state: IState): IState => ({
    ...state,
    advisers: { ...state.advisers, loading: true, error: false },
});

export const getAdvisersSuccess = (state: IState, action: IAction): IState => {
    console.log(action.payload);
    return {
        ...state,
        advisers: {
            data: action.payload.data || [],
            loading: false,
            error: false,
        },
    };
}

export const getAdvisersFailure = (state: IState, action: IAction): IState => ({
    ...state,
    advisers: {
        ...state.tags,
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
