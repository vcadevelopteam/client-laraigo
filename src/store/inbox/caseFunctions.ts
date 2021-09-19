import { IAction, IInteraction, IGroupInteraction, ITicket, INewMessageParams, IDeleteTicketParams } from "@types";
import { de } from "date-fns/locale";
import { initialState, IState } from "./reducer";


const getGroupInteractions = (interactions: IInteraction[]): IGroupInteraction[] => {

    const listImages = interactions.filter(x => x.interactiontype === "image").map(x => x.interactiontext)
    let indexImage = 0;

    return interactions.reduce((acc: any, item: IInteraction) => {
        item.indexImage = indexImage;
        item.listImage = listImages;
        const currentUser = item.usertype === "BOT" ? "BOT" : (item.userid ? "agent" : "client");
        if (acc.last === "") {
            return { data: [{ ...item, usertype: currentUser, interactions: [item] }], last: currentUser }
        } else if (currentUser === "BOT" && (acc.last === "BOT")) {
            acc.data[acc.data.length - 1].interactions.push(item)
        } else if (currentUser === "agent" && (acc.last === "agent")) {
            acc.data[acc.data.length - 1].interactions.push(item)
        } else if (currentUser === "BOT" && acc.last !== "BOT") {
            acc.data.push({ ...item, usertype: currentUser, interactions: [item] });
        } else if (currentUser === "agent" && acc.last !== "agent") {
            acc.data.push({ ...item, usertype: currentUser, interactions: [item] });
        } else if (!item.userid && (acc.last === "agent" || acc.last === "BOT")) {
            acc.data.push({ ...item, usertype: currentUser, interactions: [item] });
        } else if (!item.userid && acc.last === "client") {
            acc.data[acc.data.length - 1].interactions.push(item)
        }
        if (item.interactiontype === "image")
            indexImage++;
        return { data: acc.data, last: currentUser }
    }, { data: [], last: "" }).data;
}

const AddNewInteraction = (groupsInteraction: IGroupInteraction[], interaction: IInteraction): IGroupInteraction[] => {

    const lastGroupInteraction = groupsInteraction[groupsInteraction.length - 1];
    const lastType = lastGroupInteraction.usertype;

    if (interaction.usertype === "BOT" && (lastType === "BOT")) {
        groupsInteraction[groupsInteraction.length - 1].interactions.push(interaction)
    } else if (interaction.usertype === "agent" && (lastType === "agent")) {
        groupsInteraction[groupsInteraction.length - 1].interactions.push(interaction)
    } else if (interaction.usertype === "BOT" && lastType !== "BOT") {
        groupsInteraction.push({ ...interaction, usertype: interaction.usertype!!, interactions: [interaction] });
    } else if (interaction.usertype === "agent" && lastType !== "agent") {
        groupsInteraction.push({ ...interaction, usertype: interaction.usertype!!, interactions: [interaction] });
    } else if (!interaction.userid && (lastType === "agent" || lastType === "BOT")) {
        groupsInteraction.push({ ...interaction, usertype: interaction.usertype!!, interactions: [interaction] });
    } else if (!interaction.userid && lastType === "client") {
        groupsInteraction[groupsInteraction.length - 1].interactions.push(interaction)
    }
    return groupsInteraction;
}

export const getAgents = (state: IState): IState => ({
    ...state,
    userType: "SUPERVISOR",
    interactionList: initialState.interactionList,
    ticketSelected: initialState.ticketSelected,
    agentSelected: initialState.agentSelected,
    triggerCloseTicket: initialState.triggerCloseTicket,
    agentList: { ...state.agentList, loading: true, error: false },

});

export const getAgentsSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    agentList: {
        data: action.payload.data ? action.payload.data.map((x: any) => ({
            ...x,
            channels: x.channels?.split(",") || [],
            countNotAnwsered: x.countActive - x.countAnwsered
        })) : [],
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
    ticketList: initialState.ticketList,
    interactionList: initialState.interactionList,
    ticketSelected: initialState.ticketSelected,
    agentSelected: initialState.agentSelected,
    triggerCloseTicket: initialState.triggerCloseTicket,
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

export const setUserType = (state: IState, action: IAction): IState => ({
    ...state,
    userType: action.payload,
    agentSelected: initialState.agentSelected

})

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


export const addTicket = (state: IState, action: IAction): IState => ({
    ...state,
    ticketList: { ...state.ticketList, data: [...state.ticketList.data, action.payload] },
})


export const modifyTicket = (state: IState, action: IAction): IState => ({
    ...state,
    ticketList: { ...state.ticketList, data: state.ticketList.data.map((x: ITicket) => x.conversationid === action.payload.conversationid ? action.payload : x) },
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

export const newMessageFromClient = (state: IState, action: IAction): IState => {
    const data: INewMessageParams = action.payload;

    let newticketList = [...state.ticketList.data];
    let newInteractionList = [...state.interactionList.data];
    let newTicketSelected: any = { ...state.ticketSelected };
    let newAgentList = [...state.agentList.data];

    const { agentSelected, ticketSelected, userType } = state;

    if (userType === 'SUPERVISOR') {
        if (data.newConversation) {
            newAgentList = newAgentList.map(x => x.userid === data.userid ? {
                ...x,
                countAnwsered: x.countAnwsered + (data.userid === 2 ? 1 : 0),
                countNotAnwsered: (x.countNotAnwsered || 0) + (data.userid === 2 ? 0 : 1),
            } : x)
        } else if (data.usertype === "agent" && data.ticketWasAnswered) {
            newAgentList = newAgentList.map(x => x.userid === data.userid ? {
                ...x,
                countAnwsered: (data.status === "ASIGNADO") ? x.countAnwsered + 1 : x.countAnwsered,
                countNotAnwsered: (data.status === "ASIGNADO") ? (x.countNotAnwsered || 1) - 1 : x.countNotAnwsered,
            } : x)
        }
    }

    if (agentSelected?.userid === data.userid || userType === 'AGENT' || newticketList.some(x => x.conversationid === data.conversationid)) {
        if (data.newConversation) {
            newticketList = [...newticketList, { ...data, isAnswered: data.userid === 2 }]
        } else {
            newticketList = newticketList.map((x: ITicket) => x.conversationid === data.conversationid ? ({
                ...data,
                countnewmessages: data.usertype === "agent" ? 0 : x.countnewmessages + 1,
                lastmessage: data.typemessage === "text" ? data.lastmessage : data.typemessage.toUpperCase()
            }) : x)
        }

        if (ticketSelected?.conversationid === data.conversationid) {

            if (data.usertype === "agent" && data.ticketWasAnswered) {
                newTicketSelected.isAnswered = true;
            }

            const newInteraction: IInteraction = {
                interactionid: data.interactionid,
                interactiontype: data.typemessage,
                interactiontext: data.lastmessage,
                createdate: new Date().toISOString(),
                userid: data.usertype === "agent" ? data.userid : 0,
                usertype: data.usertype === "agent" && data.userid === 2 ? "BOT" : data.usertype,
            }
            newInteractionList = AddNewInteraction(state.interactionList.data, newInteraction)
        }
    }

    return {
        ...state,
        ticketList: {
            ...state.ticketList,
            data: newticketList
        },
        agentList: {
            data: newAgentList,
            count: action.payload.count,
            loading: false,
            error: false,
        },
        ticketSelected: newTicketSelected,
        interactionList: {
            data: newInteractionList,
            count: action.payload.count,
            loading: false,
            error: false,
        },
    };
}

export const deleteTicket = (state: IState, action: IAction): IState => {
    const data: IDeleteTicketParams = action.payload;
    let newticketList = [...state.ticketList.data];
    let newAgentList = [...state.agentList.data];
    let newTicketSelected: any = { ...state.ticketSelected };

    const { agentSelected, userType } = state;

    if (userType === 'SUPERVISOR') {
        newAgentList = newAgentList.map(x => x.userid === data.userid ? {
            ...x,
            countClosed: x.countClosed + 1,
            countAnwsered: ((data.status === "ASIGNADO" && data.isanswered) || data.userid === 2) ? x.countAnwsered - 1 : x.countAnwsered,
            countNotAnwsered: (data.status === "ASIGNADO" && !data.isanswered && data.userid !== 2) ? (x.countNotAnwsered || 1) - 1 : x.countNotAnwsered,
            countPaused: (data.status === "PAUSED") ? x.countPaused - 1 : x.countPaused
        } : x)
    }

    if (agentSelected?.userid === data.userid || userType === 'AGENT' || newticketList.some(x => x.conversationid === data.conversationid)) {
        if (newTicketSelected?.conversationid === data.conversationid) {
            newTicketSelected = null;
        }
        newticketList = newticketList.filter((x: ITicket) => x.conversationid !== data.conversationid);
    }

    return {
        ...state,
        ticketSelected: newTicketSelected,
        ticketList: {
            ...state.ticketList,
            data: newticketList
        },
        agentList: {
            data: newAgentList,
            count: action.payload.count,
            loading: false,
            error: false,
        },
    };
}


export const getDataTicket = (state: IState): IState => ({
    ...state,
    interactionList: { ...state.interactionList, loading: true, error: false },
    person: { ...state.person, loading: true, error: false },
});

export const getDataTicketSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    ticketSelected: { ...state.ticketSelected!!, isAnswered: action.payload.data[0].data.some((x: IInteraction) => x.userid === state.agentSelected?.userid && x.interactiontype !== "LOG") },
    interactionList: {
        data: getGroupInteractions(action.payload.data[0].data),
        count: action.payload.count,
        loading: false,
        error: false,
    },
    configurationVariables: {
        data: action.payload.data[2].data.filter((x: any) => !x.visible).sort((a: any, b: any) => (a.priority > b.priority) ? 1 : ((b.priority > a.priority) ? -1 : 0)) || [],
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


export const reassignTicket = (state: IState): IState => ({
    ...state,
    triggerReassignTicket: { ...state.triggerReassignTicket, loading: true, error: false },
});

export const reassignTicketSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    triggerReassignTicket: {
        loading: false,
        error: false,
    },
});

export const reassignTicketFailure = (state: IState, action: IAction): IState => ({
    ...state,
    triggerReassignTicket: {
        ...state.triggerReassignTicket,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    },
});

export const reassignTicketReset = (state: IState): IState => ({
    ...state,
    triggerReassignTicket: initialState.triggerReassignTicket,
});


export const replyTicket = (state: IState): IState => ({
    ...state,
    triggerReplyTicket: { ...state.triggerReplyTicket, loading: true, error: false },
});

export const replyTicketSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    triggerReplyTicket: {
        loading: false,
        error: false,
    },
});

export const replyTicketFailure = (state: IState, action: IAction): IState => ({
    ...state,
    triggerReplyTicket: {
        ...state.triggerReplyTicket,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    },
});

export const replyTicketReset = (state: IState): IState => ({
    ...state,
    triggerReplyTicket: initialState.triggerReplyTicket,
});




export const getTipificationLevel2 = (state: IState): IState => ({
    ...state,
    tipificationsLevel2: { ...state.tipificationsLevel2, loading: true, error: false },
    tipificationsLevel3: initialState.tipificationsLevel3
});

export const getTipificationLevel2Success = (state: IState, action: IAction): IState => ({
    ...state,
    tipificationsLevel2: {
        data: action.payload.data || [],
        count: action.payload.count,
        loading: false,
        error: false,
    },
});

export const getTipificationLevel2Failure = (state: IState, action: IAction): IState => ({
    ...state,
    tipificationsLevel2: {
        ...state.tipificationsLevel2,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    },
});

export const getTipificationLevel2Reset = (state: IState): IState => ({
    ...state,
    tipificationsLevel2: initialState.tipificationsLevel2,
    tipificationsLevel3: initialState.tipificationsLevel3
});

export const getTipificationLevel3 = (state: IState): IState => ({
    ...state,
    tipificationsLevel3: { ...state.tipificationsLevel3, loading: true, error: false },
});

export const getTipificationLevel3Success = (state: IState, action: IAction): IState => ({
    ...state,
    tipificationsLevel3: {
        data: action.payload.data || [],
        count: action.payload.count,
        loading: false,
        error: false,
    },
});

export const getTipificationLevel3Failure = (state: IState, action: IAction): IState => ({
    ...state,
    tipificationsLevel3: {
        ...state.tipificationsLevel3,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    },
});

export const getTipificationLevel3Reset = (state: IState): IState => ({
    ...state,
    tipificationsLevel3: initialState.tipificationsLevel3,
});