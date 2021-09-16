import { IAction, IInteraction, IGroupInteraction } from "@types";
import { initialState, IState } from "./reducer";


const getGroupInteractions = (interactions: IInteraction[]): IGroupInteraction[] => {
    return interactions.reduce((acc: any, item: IInteraction, index: number) => {
        const currentUser = item.usertype === "BOT" ? "BOT" : (item.userid ? "agent" : "client");
        if (acc.last === "") {
            return { data: [{ ...item, usertype: currentUser, interactions: [item] }], last: currentUser }
        } else if (item.userid && (acc.last === "agent" || acc.last === "BOT")) {
            acc.data[acc.data.length - 1].interactions.push(item)
        } else if (item.userid && acc.last === "client") {
            acc.data.push({ ...item, usertype: currentUser, interactions: [item] });
        } else if (!item.userid && (acc.last === "agent" || acc.last === "BOT")) {
            acc.data.push({ ...item, usertype: currentUser, interactions: [item] });
        } else if (!item.userid && acc.last === "client") {
            acc.data[acc.data.length - 1].interactions.push(item)
        }
        return { data: acc.data, last: currentUser }
    }, { data: [], last: "" }).data;
}

const AddNewInteraction = (groupsInteraction: IGroupInteraction[], interaction: IInteraction): IGroupInteraction[] => {
    
    const lastGroupInteraction = groupsInteraction[groupsInteraction.length - 1];
    const lastType = lastGroupInteraction.usertype;

    const currentUser = interaction.userid ? "agent" : "client";
    if (interaction.userid && (lastType === "agent" || lastType === "BOT")) {
        groupsInteraction[groupsInteraction.length - 1].interactions.push(interaction)
    } else if (interaction.userid && lastType === "client") {
        groupsInteraction.push({ ...interaction, usertype: currentUser, interactions: [interaction] });
    } else if (!interaction.userid && (lastType === "agent" || lastType === "BOT")) {
        groupsInteraction.push({ ...interaction, usertype: currentUser, interactions: [interaction] });
    } else if (!interaction.userid && lastType === "client") {
        groupsInteraction[groupsInteraction.length - 1].interactions.push(interaction)
    }
    return groupsInteraction;
}

export const getAgents = (state: IState): IState => ({
    ...state,
    agentList: { ...state.agentList, loading: true, error: false },
});

export const getAgentsSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    agentList: {
        data: action.payload.data ? action.payload.data.map((x: any) => ({ ...x, channels: x.channels?.split(",") || [] })) : [],
        count: action.payload.count,
        loading: false,
        error: false,
    },
});

export const getAgentsFailure = (state: IState, action: IAction): IState => ({
    ...state,
    agentList: {
        ...state.agentList,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    },
});

export const getAgentsReset = (state: IState): IState => ({
    ...state,
    agentList: initialState.agentList,
});

export const getPerson = (state: IState): IState => ({
    ...state,
    agentList: { ...state.agentList, loading: true, error: false },
});

export const getPersonSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    agentList: {
        data: action.payload.data && action.payload.data.length > 0 ? { ...action.payload.data[0], variablecontext: (action.payload.data[0].variablecontext ? JSON.parse(action.payload.data[0].variablecontext) : {}) } : null,
        count: action.payload.count,
        loading: false,
        error: false,
    },
});

export const getPersonFailure = (state: IState, action: IAction): IState => ({
    ...state,
    agentList: {
        ...state.agentList,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    },
});

export const getPersonReset = (state: IState): IState => ({
    ...state,
    agentList: initialState.agentList,
});



export const getTicketsByPerson = (state: IState): IState => ({
    ...state,
    previewTicketList: { ...state.previewTicketList, loading: true, error: false },
});

export const getTicketsByPersonSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    previewTicketList: {
        data: action.payload.data || [],
        count: action.payload.count,
        loading: false,
        error: false,
    },
});

export const getTicketsByPersonFailure = (state: IState, action: IAction): IState => ({
    ...state,
    previewTicketList: {
        ...state.previewTicketList,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    },
});

export const getTicketsByPersonReset = (state: IState): IState => ({
    ...state,
    previewTicketList: initialState.previewTicketList,
});



export const selectTicket = (state: IState, action: IAction): IState => ({
    ...state,
    ticketSelected: action.payload,
    showInfoPanel: false
})

export const resetSelectTicket = (state: IState, action: IAction): IState => ({
    ...state,
    ticketSelected: null,
})

export const selectAgent = (state: IState, action: IAction): IState => ({
    ...state,
    agentSelected: action.payload,
})

export const showInfoPanel = (state: IState): IState => ({
    ...state,
    showInfoPanel: !state.showInfoPanel
})

export const resetSelectAgent = (state: IState, action: IAction): IState => ({
    ...state,
    agentSelected: null,
})


export const getTickets = (state: IState): IState => ({
    ...state,
    ticketList: { ...state.ticketList, loading: true, error: false },
    ticketSelected: null
});

export const getTicketsSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    ticketList: {
        data: action.payload.data || [],
        count: action.payload.count,
        loading: false,
        error: false,
    },
});

export const getTicketsFailure = (state: IState, action: IAction): IState => ({
    ...state,
    ticketList: {
        ...state.ticketList,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    },
});

export const getTicketsReset = (state: IState): IState => ({
    ...state,
    ticketList: initialState.ticketList,
});

export const getDataTicket = (state: IState): IState => ({
    ...state,
    interactionList: { ...state.interactionList, loading: true, error: false },
    person: { ...state.person, loading: true, error: false },
});

export const getDataTicketSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    interactionList: {
        data: getGroupInteractions(action.payload.data[0].data),
        count: action.payload.count,
        loading: false,
        error: false,
    },
    person: {
        data: action.payload.data[1].data && action.payload.data[1].data.length > 0 ? action.payload.data[1].data[0] : null,
        loading: false,
        error: false,
    },
});

export const addMessage = (state: IState, action: IAction): IState => {
    const newInteraction: IInteraction = action.payload;
    newInteraction.interactionid = state.interactionList.data.length * -1; 
    return {
        ...state,
        interactionList: {
            data: AddNewInteraction(state.interactionList.data, newInteraction),
            count: action.payload.count,
            loading: false,
            error: false,
        },
    };
}

export const getDataTicketFailure = (state: IState, action: IAction): IState => ({
    ...state,
    interactionList: {
        ...state.interactionList,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    },
    person: {
        ...state.person,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    },
});

export const getDataTicketReset = (state: IState): IState => ({
    ...state,
    interactionList: initialState.interactionList,
    person: initialState.person,
});

export const getInteractions = (state: IState): IState => ({
    ...state,
    interactionList: { ...state.interactionList, loading: true, error: false },
});

export const getInteractionsSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    interactionList: {
        data: action.payload.data || [],
        count: action.payload.count,
        loading: false,
        error: false,
    },
});

export const getInteractionsFailure = (state: IState, action: IAction): IState => ({
    ...state,
    interactionList: {
        ...state.interactionList,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    },
});

export const getInteractionsReset = (state: IState): IState => ({
    ...state,
    interactionList: initialState.interactionList,
});








export const closeTicket = (state: IState): IState => ({
    ...state,
    triggerCloseTicket: { ...state.triggerCloseTicket, loading: true, error: false },
});

export const closeTicketSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    triggerCloseTicket: {
        loading: false,
        error: false,
    },
});

export const closeTicketFailure = (state: IState, action: IAction): IState => ({
    ...state,
    triggerCloseTicket: {
        ...state.triggerCloseTicket,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    },
});

export const closeTicketReset = (state: IState): IState => ({
    ...state,
    triggerCloseTicket: initialState.triggerCloseTicket,
});