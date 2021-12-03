import { IAction, IInteraction, IGroupInteraction, ITicket, INewMessageParams, IDeleteTicketParams, IConnectAgentParams, Dictionary } from "@types";
import { initialState, IState } from "./reducer";
import { toTime24HR, convertLocalDate } from 'common/helpers';


const getGroupInteractions = (interactions: IInteraction[]): IGroupInteraction[] => {

    const listImages = interactions.filter(x => x.interactiontype.includes("image")).map(x => x.interactiontext)
    let indexImage = 0;

    return interactions.reduce((acc: any, item: IInteraction) => {
        item.indexImage = indexImage;
        item.listImage = listImages;
        item.onlyTime = toTime24HR(convertLocalDate(item.createdate, false).toLocaleTimeString())
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
        if (item.interactiontype.includes("image"))
            indexImage++;
        return { data: acc.data, last: currentUser }
    }, { data: [], last: "" }).data;
}

const AddNewInteraction = (groupsInteraction: IGroupInteraction[], interaction: IInteraction): IGroupInteraction[] => {
    const listImage = groupsInteraction.length > 0 ? groupsInteraction[0].listImage || [] : [];
    interaction.listImage = interaction.interactiontype.includes("image") ? [...listImage, interaction.interactiontext] : listImage;

    interaction.onlyTime = toTime24HR(convertLocalDate(interaction.createdate, false, false).toLocaleTimeString())

    interaction.indexImage = interaction.interactiontype.includes("image") ? listImage.length : 0;
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

const cleanLogsReassignedTask = (interactions: IInteraction[]) => {
    let validatelog = true;
    //#region HIDE LOGS, ONLY SHOW LAST LOG
    for (let i = 0; i < interactions.length; i++) {
        if (interactions[i].interactiontext.toLowerCase().includes("balanceo") && validatelog) {
            let countlogconsecutive = 0;
            for (let j = i + 1; j < interactions.length; j++) {
                if (interactions[j].interactiontext.toLowerCase().includes("balanceo")) {
                    countlogconsecutive++;
                    validatelog = false;
                } else
                    break;
            }
            if (countlogconsecutive > 0) {
                const cc = countlogconsecutive;
                for (let k = 0; k < cc; k++) {
                    interactions[i + k].isHide = true
                }
            }
        } else
            validatelog = true;
    }
    //#endregion
    //interactions = interactions.filter(i => i.interactiontype != "HIDE");
    return interactions.filter(x => !x.isHide);
}

export const getAgents = (state: IState): IState => ({
    ...initialState,
    userConnected: state.userConnected,
    userType: "SUPERVISOR",
    agentList: { ...state.agentList, loading: true, error: false },

});

export const getAgentsSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    agentList: {
        data: action.payload.data ? action.payload.data.map((x: any) => ({
            ...x,
            channels: x.channels?.split(",") || [],
            countNotAnwsered: x.countActive - x.countAnwsered,
            isConnected: x.status === "ACTIVO"
        })).sort((a: any, b: any) => (a.isConnected === b.isConnected) ? 0 : a.isConnected ? -1 : 1) : [],
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
    ...initialState
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



export const filterTickets = (state: IState): IState => ({
    ...state,
    ticketFilteredList: { ...state.ticketFilteredList, loading: true, error: false },
    isFiltering: true
});

export const filterTicketsSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    ticketFilteredList: {
        data: action.payload.data || [],
        count: action.payload.count,
        loading: false,
        error: false,
    },
});

export const filterTicketsFailure = (state: IState, action: IAction): IState => ({
    ...state,
    ticketFilteredList: {
        ...state.ticketFilteredList,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    },
});

export const filterTicketsReset = (state: IState): IState => ({
    ...state,
    ticketFilteredList: initialState.ticketFilteredList,
});




export const setUserType = (state: IState, action: IAction): IState => ({
    ...state,
    userType: action.payload,
    agentSelected: initialState.agentSelected

})

export const selectTicket = (state: IState, action: IAction): IState => ({
    ...state,
    ticketSelected: action.payload,
    showInfoPanel: false,
    tipificationsLevel2: initialState.tipificationsLevel2,
    tipificationsLevel3: initialState.tipificationsLevel3
})


export const updatePerson = (state: IState, action: IAction): IState => ({
    ...state,
    person: {
        ...state.person,
        data: action.payload
    },
    ticketSelected: {
        ...state.ticketSelected!!,
        displayname: action.payload.name
    }
})



export const resetSelectTicket = (state: IState, action: IAction): IState => ({
    ...state,
    ticketSelected: null,
})

export const selectAgent = (state: IState, action: IAction): IState => ({
    ...state,
    agentSelected: action.payload,
    isFiltering: false,
    ticketFilteredList: initialState.ticketFilteredList
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
    isOnBottom: null,
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

export const connectAgentWS = (state: IState, action: IAction): IState => {
    let newAgentList = [...state.agentList.data];
    const data: IConnectAgentParams = action.payload;

    const { userType } = state;

    if (userType === 'SUPERVISOR') {
        newAgentList = newAgentList.map(x => x.userid === data.userid ? { ...x, isConnected: data.isconnected } : x).sort((a: any, b: any) => (a.isConnected === b.isConnected) ? 0 : a.isConnected ? -1 : 1)
    }

    return {
        ...state,
        agentList: {
            data: newAgentList,
            count: action.payload.count,
            loading: false,
            error: false,
        },
    };
}

export const connectAgentUI = (state: IState, action: IAction): IState => {
    return {
        ...state,
        userConnected: action.payload
    };
}

export const goToBottom = (state: IState, action: IAction): IState => {
    return {
        ...state,
        isOnBottom: action.payload
    };
}

export const showGoToBottom = (state: IState, action: IAction): IState => {
    return {
        ...state,
        showGoToBottom: action.payload
    };
}

export const setIsFiltering = (state: IState, action: IAction): IState => {
    return {
        ...state,
        isFiltering: action.payload,
        ticketFilteredList: initialState.ticketFilteredList
    };
}

export const newMessageFromClient = (state: IState, action: IAction): IState => {
    const data: INewMessageParams = action.payload;
    let newticketList = [...state.ticketList.data];
    let newInteractionList = [...state.interactionList.data];
    let newTicketSelected = state.ticketSelected ? { ...state.ticketSelected } : null;
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
            if (!newticketList.some(x => x.conversationid === data.conversationid)) { // a veces se cruza cuando esta cargando al data
                newticketList = [...newticketList, { ...data, isAnswered: data.userid === 2 }]
            }
        } else {
            newticketList = newticketList.map((x: ITicket) => x.conversationid === data.conversationid ? ({
                ...x,
                personlastreplydate: data.usertype === "client" ? new Date().toISOString() : x.personlastreplydate,
                countnewmessages: data.usertype === "agent" ? 0 : x.countnewmessages + 1,
                lastmessage: data.typemessage === "text" ? data.lastmessage : data.typemessage.toUpperCase(),
            }) : x)
        }

        if (ticketSelected?.conversationid === data.conversationid) {
        
            if (data.usertype === "agent" && data.ticketWasAnswered) {
                newTicketSelected!!.isAnswered = true;
            } else if (data.usertype === "client") {
                newTicketSelected!!.personlastreplydate = new Date().toISOString();
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
        triggerNewMessageClient: !state.triggerNewMessageClient,
        ticketList: {
            ...state.ticketList,
            data: newticketList
        },
        aNewTicket: data.newConversation ? !(state.aNewTicket || false) : state.aNewTicket,
        aNewMessage: !data.newConversation ? !(state.aNewMessage || false) : state.aNewMessage,
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
    let newTicketSelected = state.ticketSelected ? { ...state.ticketSelected } : null;

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
// CLEAN_ALERT
export const cleanAlerts = (state: IState): IState => ({
    ...state,
    aNewTicket: null,
    aNewMessage: null,
})

export const personSawChat = (state: IState, action: IAction): IState => {
    const data: IDeleteTicketParams = action.payload;
    let newticketList = [...state.ticketList.data];
    let newTicketSelected = state.ticketSelected ? { ...state.ticketSelected } : null;

    const { agentSelected, userType } = state;

    if (agentSelected?.userid === data.userid || userType === 'AGENT' || newticketList.some(x => x.conversationid === data.conversationid)) {

        if (newTicketSelected?.conversationid === data.conversationid) {
            newTicketSelected.lastseendate = new Date().toISOString();
        }
        newticketList = newticketList.map(x => x.conversationid === data.conversationid ? { ...x, lastseendate: new Date().toISOString() } : x)
    }

    return {
        ...state,
        ticketSelected: newTicketSelected,
        ticketList: {
            ...state.ticketList,
            data: newticketList
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
        data: getGroupInteractions(cleanLogsReassignedTask(action.payload.data[0].data)),
        count: action.payload.count,
        loading: false,
        error: false,
    },
    isOnBottom: null,
    configurationVariables: {
        data: action.payload.data[2].data.filter((x: any) => !!x.visible).sort((a: any, b: any) => (a.priority < b.priority) ? 1 : ((b.priority < a.priority) ? -1 : 0)) || [],
        count: action.payload.count,
        loading: false,
        error: false,
    },
    richResponseList: {
        data: action.payload.data[3].data.map((x: any) => JSON.parse(x.block)) || [],
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

export const getInteractionsExtra = (state: IState): IState => ({
    ...state,
    interactionExtraList: { ...state.interactionExtraList, loading: true, error: false },
});

export const getInteractionsExtraSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    interactionExtraList: {
        data: getGroupInteractions(cleanLogsReassignedTask(action.payload.data || [])),
        count: action.payload.count,
        loading: false,
        error: false,
    },
});

export const getInteractionsExtraFailure = (state: IState, action: IAction): IState => ({
    ...state,
    interactionExtraList: {
        ...state.interactionExtraList,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    },
});

export const getInteractionsExtraReset = (state: IState): IState => ({
    ...state,
    interactionExtraList: initialState.interactionExtraList,
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



export const massiveCloseTicket = (state: IState): IState => ({
    ...state,
    triggerMassiveCloseTicket: { ...state.triggerMassiveCloseTicket, loading: true, error: false },
});

export const massiveCloseTicketSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    triggerMassiveCloseTicket: {
        loading: false,
        error: false,
    },
});

export const massiveCloseTicketFailure = (state: IState, action: IAction): IState => ({
    ...state,
    triggerMassiveCloseTicket: {
        ...state.triggerMassiveCloseTicket,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    },
});

export const massiveCloseTicketReset = (state: IState): IState => ({
    ...state,
    triggerMassiveCloseTicket: initialState.triggerMassiveCloseTicket,
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






export const connectAgentUItmp = (state: IState): IState => ({
    ...state,
    triggerConnectAgentGo: { ...state.triggerConnectAgentGo, loading: true, error: false },
});

export const connectAgentUItmpSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    triggerConnectAgentGo: {
        loading: false,
        error: false,
    },
});

export const connectAgentUItmpFailure = (state: IState, action: IAction): IState => ({
    ...state,
    triggerConnectAgentGo: {
        ...state.triggerConnectAgentGo,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    },
});

export const connectAgentUItmpReset = (state: IState): IState => ({
    ...state,
    triggerConnectAgentGo: initialState.triggerConnectAgentGo,
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






export const sendHSM = (state: IState): IState => ({
    ...state,
    triggerSendHSM: { ...state.triggerSendHSM, loading: true, error: false },
});

export const sendHSMSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    triggerSendHSM: {
        loading: false,
        error: false,
    },
});

export const sendHSMFailure = (state: IState, action: IAction): IState => ({
    ...state,
    triggerSendHSM: {
        ...state.triggerSendHSM,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    },
});

export const sendHSMReset = (state: IState): IState => ({
    ...state,
    triggerSendHSM: initialState.triggerSendHSM,
});



export const getDataForOutbound = (state: IState): IState => ({
    ...state,
    outboundData: { ...state.outboundData, loading: true },
});

export const getDataForOutboundSuccess = (state: IState, action: IAction): IState => {
    const channels = (action.payload.data as any[])[0].data as Dictionary[] | null;
    const templates = (action.payload.data as any[])[1].data as Dictionary[] | null;

    return {
        ...state,
        outboundData: {
            ...state.outboundData,
            value: {
                channels: channels || [],
                templates: templates || [],
            },
            loading: false,
            error: false,
        },
    };
};

export const getDataForOutboundFailure = (state: IState, action: IAction): IState => ({
    ...state,
    outboundData: {
        ...state.outboundData,
        error: true,
        loading: false,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    },
});

export const getDataForOutboundReset = (state: IState): IState => ({
    ...state,
    outboundData: initialState.outboundData,
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


export const wsConnect = (state: IState, action: IAction): IState => ({
    ...state,
    wsConnected: action.payload
});