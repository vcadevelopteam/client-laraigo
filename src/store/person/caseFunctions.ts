import { Dictionary, IAction, IDomain } from "@types";
import { IState, initialState } from './reducer';

export const getPerson = (state: IState): IState => ({
    ...state,
    person: { ...state.person, loading: true },
});

export const getPersonSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    person: {
        ...state.person,
        value: action.payload,
        loading: false,
        error: false,
    },
});

export const getPersonFailure = (state: IState, action: IAction): IState => ({
    ...state,
    person: {
        ...state.person,
        error: true,
        loading: false,
        message: action.payload?.message || "Ocurrio un error Obtener la lista de personas"
    },
});

export const getPersonReset = (state: IState): IState => ({
    ...state,
    person: initialState.person,
});

export const getPersonListPaginated = (state: IState): IState => ({
    ...state,
    personList: { ...state.personList, loading: true },
});

export const getPersonListPaginatedSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    personList: {
        ...state.personList,
        data: action.payload.data || [],
        count: action.payload.count || 0,
        loading: false,
        error: false,
    },
});

export const getPersonListPaginatedFailure = (state: IState, action: IAction): IState => ({
    ...state,
    personList: {
        ...state.personList,
        error: true,
        loading: false,
        message: action.payload?.message || "Ocurrio un error Obtener la lista de personas"
    },
});

export const getPersonListPaginatedReset = (state: IState): IState => ({
    ...state,
    personList: initialState.personList,
});

export const getTicketListByPerson = (state: IState): IState => ({
    ...state,
    personTicketList: { ...state.personTicketList, loading: true },
});

export const getTicketListByPersonSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    personTicketList: {
        ...state.personTicketList,
        data: action.payload.data || [],
        count: action.payload.count || 0,
        loading: false,
        error: false,
    },
});

export const getTicketListByPersonFailure = (state: IState, action: IAction): IState => ({
    ...state,
    personTicketList: {
        ...state.personTicketList,
        error: true,
        loading: false,
        message: action.payload?.message || "Ocurrio un error Obtener la lista"
    },
});

export const getTicketListByPersonReset = (state: IState): IState => ({
    ...state,
    personTicketList: initialState.personTicketList,
});

export const getReferrerListByPerson = (state: IState): IState => ({
    ...state,
    personReferrerList: { ...state.personReferrerList, loading: true },
});

export const getReferrerListByPersonSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    personReferrerList: {
        ...state.personReferrerList,
        data: action.payload.data || [],
        loading: false,
        error: false,
    },
});

export const getReferrerListByPersonFailure = (state: IState, action: IAction): IState => ({
    ...state,
    personReferrerList: {
        ...state.personReferrerList,
        error: true,
        loading: false,
        message: action.payload?.message || "Ocurrio un error Obtener la lista"
    },
});

export const getReferrerListByPersonReset = (state: IState): IState => ({
    ...state,
    personReferrerList: initialState.personReferrerList,
});

export const getChannelListByPerson = (state: IState): IState => ({
    ...state,
    personChannelList: { ...state.personChannelList, loading: true },
});

export const getChannelListByPersonSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    personChannelList: {
        ...state.personChannelList,
        data: action.payload.data || [],
        loading: false,
        error: false,
    },
});

export const getChannelListByPersonFailure = (state: IState, action: IAction): IState => ({
    ...state,
    personChannelList: {
        ...state.personChannelList,
        error: true,
        loading: false,
        message: action.payload?.message || "Ocurrio un error Obtener la lista"
    },
});

export const getChannelListByPersonReset = (state: IState): IState => ({
    ...state,
    personChannelList: initialState.personChannelList,
});

export const getAdditionalInfoByPerson = (state: IState): IState => ({
    ...state,
    personAdditionInfo: { ...state.personAdditionInfo, loading: true },
});

export const getAdditionalInfoByPersonSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    personAdditionInfo: {
        ...state.personAdditionInfo,
        data: action.payload.data || [],
        loading: false,
        error: false,
    },
});

export const getAdditionalInfoByPersonFailure = (state: IState, action: IAction): IState => ({
    ...state,
    personAdditionInfo: {
        ...state.personAdditionInfo,
        loading: false,
        error: true,
        message: action.payload?.message || "Ocurrio un error Obtener la lista"
    },
});

export const getAdditionalInfoByPersonReset = (state: IState): IState => ({
    ...state,
    personAdditionInfo: initialState.personAdditionInfo,
});

export const getLeadsByPerson = (state: IState): IState => ({
    ...state,
    personLeadList: { ...state.personLeadList, loading: true },
});

export const getLeadsByPersonSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    personLeadList: {
        ...state.personLeadList,
        data: action.payload.data || [],
        loading: false,
        error: false,
    },
});

export const getLeadsByPersonFailure = (state: IState, action: IAction): IState => ({
    ...state,
    personLeadList: {
        ...state.personLeadList,
        error: true,
        loading: false,
        message: action.payload?.message || "Ocurrio un error Obtener la lista"
    },
});

export const getLeadsByPersonReset = (state: IState): IState => ({
    ...state,
    personLeadList: initialState.personLeadList,
});

export const getDomainsByTypename = (state: IState): IState => ({
    ...state,
    editableDomains: { ...state.editableDomains, loading: true },
});

export const getDomainsByTypenameSuccess = (state: IState, action: IAction): IState => {
    const genders = (action.payload.data as any[])[0].data as IDomain[] | null;
    const docTypes = (action.payload.data as any[])[1].data as IDomain[] | null;
    const occupations = (action.payload.data as any[])[2].data as IDomain[] | null;
    const civilStatuses = (action.payload.data as any[])[3].data as IDomain[] | null;
    const educationLevels = (action.payload.data as any[])[4].data as IDomain[] | null;
    const personTypes = (action.payload.data as any[])[5].data as IDomain[] | null;
    const groups = (action.payload.data as any[])[6].data as IDomain[] | null;
    const personGenTypes = (action.payload.data as any[])[7].data as IDomain[] | null;
    const channelTypes = (action.payload.data as any[])[8].data as IDomain[] | null;
    const agents = (action.payload.data as any[])[9].data as Dictionary[] | null;
    const templates = (action.payload.data as any[])[10].data as Dictionary[] | null;
    const channels = (action.payload.data as any[])[11].data as Dictionary[] | null;

    return {
        ...state,
        editableDomains: {
            ...state.editableDomains,
            value: {
                civilStatuses: civilStatuses || [],
                docTypes: docTypes || [],
                educationLevels: educationLevels || [],
                genders: genders || [],
                occupations: occupations || [],
                personTypes: personTypes || [],
                groups: groups || [],
                personGenTypes: personGenTypes || [],
                channelTypes: channelTypes || [],
                templates: templates || [],
                agents: agents || [],
                channels: channels || [],
            },
            loading: false,
            error: false,
        },
    };
};

export const getDomainsByTypenameFailure = (state: IState, action: IAction): IState => ({
    ...state,
    editableDomains: {
        ...state.editableDomains,
        error: true,
        loading: false,
        message: action.payload?.message || "Ocurrio un error Obtener los dominios"
    },
});

export const getDomainsByTypenameReset = (state: IState): IState => ({
    ...state,
    editableDomains: initialState.editableDomains,
});

export const editPerson = (state: IState): IState => ({
    ...state,
    editPerson: { ...state.editPerson, loading: true },
});

export const editPersonSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    editPerson: {
        ...state.editPerson,
        loading: false,
        error: false,
        success: true,
    },
});

export const editPersonFailure = (state: IState, action: IAction): IState => ({
    ...state,
    editPerson: {
        ...state.editPerson,
        error: true,
        loading: false,
        message: action.payload?.message || "Ocurrio un error al editar la persona",
    },
});

export const editPersonReset = (state: IState): IState => ({
    ...state,
    editPerson: initialState.editPerson,
});
