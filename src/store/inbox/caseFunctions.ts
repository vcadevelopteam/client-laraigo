import { IAction, IInteraction, IGroupInteraction, ITicket, INewMessageParams, IDeleteTicketParams, IConnectAgentParams, Dictionary, IVariablesSyncParams } from "@types";
import { initialState, IState } from "./reducer";
import { toTime24HR, convertLocalDate } from 'common/helpers';
import { keys } from 'common/constants';

const getGroupInteractions = (interactions: IInteraction[], hideLogs: boolean = false, returnHidden: boolean = false): IGroupInteraction[] => {
    const ticketWall = interactions.some(y => y.interactiontype.includes("post"));
    interactions = interactions.map(x => ({
        ...x,
        reply: ticketWall && ["text", "image"].includes(x.interactiontype) && Boolean(!x.userid)
    }))
    const listImages = interactions.filter(x => x.interactiontype.includes("image")).map(x => x.interactiontext)
    let indexImage = 0;

    return (!hideLogs ? interactions.filter(x => x.interactiontype !== "LOG") : cleanLogsReassignedTask(interactions, returnHidden)).reduce((acc: any, item: IInteraction) => {
        item.indexImage = indexImage;
        item.listImage = listImages;
        item.onlyTime = toTime24HR(convertLocalDate(item.createdate, false).toLocaleTimeString())
        const currentUser = item?.usertype === "BOT" ? "BOT" : (item.userid ? "agent" : "client");
        
        if (item.interactiontype.includes("image"))
            indexImage++;
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

        return { data: acc.data, last: currentUser }
    }, { data: [], last: "" }).data;
}

const AddNewInteraction = (groupsInteraction: IGroupInteraction[], interaction: IInteraction): IGroupInteraction[] => {
    const listImage = groupsInteraction.length > 0 ? groupsInteraction[0].listImage || [] : [];
    const ticketWall = (groupsInteraction.length > 0 ? groupsInteraction[0].interactions || [] : []).some(y => y.interactiontype?.includes("post"));
    const lastGroupInteraction = groupsInteraction[groupsInteraction.length - 1];
    const lastType = lastGroupInteraction.usertype;

    interaction.reply = ticketWall && ["text", "image"].includes(interaction.interactiontype) && lastType === "client";

    interaction.listImage = interaction.interactiontype.includes("image") ? [...listImage, interaction.interactiontext] : listImage;

    interaction.onlyTime = toTime24HR(convertLocalDate(interaction.createdate, false, false).toLocaleTimeString())

    interaction.indexImage = interaction.interactiontype.includes("image") ? listImage.length : 0;

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

const cleanLogsReassignedTask = (interactions: IInteraction[], returnHidden: boolean = false) => {
    let validatelog = true;
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
    return returnHidden ? interactions : interactions.filter(x => !x.isHide);
}

export const getAgents = (state: IState): IState => ({
    ...initialState,
    holdingBySupervisor: state.holdingBySupervisor,
    botBySupervisor: state.botBySupervisor,
    userGroup: state.userGroup,
    channels: state.channels,
    role: state.role,
    wsConnected: state.wsConnected,
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
            countNotAnswered: x.countActive - x.countAnswered,
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
    ...initialState,
    wsConnected: state.wsConnected,
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
    showInfoPanel: !action.payload ? false : state.showInfoPanel,
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

export const updatePersonClassification = (state: IState, action: IAction): IState => ({
    ...state,
    person: {
        ...state.person,
        data: {
            ...state.person.data!!,
            haveclassification: action.payload
        }
    }
})

export const resetSelectTicket = (state: IState): IState => ({
    ...state,
    ticketSelected: null,
    person: {
        ...state.person,
        data: null
    }
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

export const resetSelectAgent = (state: IState): IState => ({
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

export const changeStatusTicket = (state: IState, action: IAction): IState => ({
    ...state,
    ticketSelected: {
        ...state.ticketSelected!!,
        status: action.payload.status
    },
    ticketList: {
        ...state.ticketList,
        data: state.ticketList.data.map((x: ITicket) => x.conversationid === action.payload.conversationid ? {
            ...x,
            status: action.payload.status
        } : x)
    },
})


export const getTickets = (state: IState): IState => ({
    ...state,
    ticketList: { ...state.ticketList, loading: true, error: false },
    ticketSelected: null
});

export const getTicketsSuccess = (state: IState, action: IAction): IState => {
    if ((state.agentSelected?.userid + "") === action.payload.key.split("_")?.pop()) {
        return {
            ...state,
            isOnBottom: null,
            ticketList: {
                data: action.payload.data || [],
                count: action.payload.count,
                loading: false,
                error: false,
            },
        }
    } else {
        return state
    }
};

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

export const getTicketsClosed = (state: IState): IState => ({
    ...state,
    closedticketList: { ...state.closedticketList, loading: true, error: false },
});

export const getTicketsClosedSuccess = (state: IState, action: IAction): IState => {
    if ((state.agentSelected?.userid + "") === action.payload.key.split("_")?.pop()) {
        return {
            ...state,
            isOnBottom: null,
            closedticketList: {
                data: action.payload.data || [],
                count: action.payload.count,
                loading: false,
                error: false,
            },
        }
    } else {
        return state
    }
};

export const getTicketsClosedFailure = (state: IState, action: IAction): IState => ({
    ...state,
    closedticketList: {
        ...state.closedticketList,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    },
});

export const getTicketsClosedReset = (state: IState): IState => ({
    ...state,
    closedticketList: initialState.closedticketList,
});

export const connectAgentWS = (state: IState, action: IAction): IState => {
    let newAgentList = [...state.agentList.data];
    const data: IConnectAgentParams = action.payload;

    const { userType } = state;

    if (userType === 'SUPERVISOR') {
        newAgentList = newAgentList.map(x => x.userid === data.userid ? {
            ...x,
            isConnected: data.isconnected,
            status: data.isconnected ? "ACTIVO" : "DESCONECTADO",
            motivetype: data.motive,
            userstatustype: (data.isconnected ? "ACTIVO" : (data.motive ? "INBOX" : "LOGOUT"))
        } : x).sort((a: any, b: any) => (a.isConnected === b.isConnected) ? 0 : a.isConnected ? -1 : 1)
    }

    return {
        ...state,
        agentToReassignList: state.agentToReassignList.map(x => x.userid === data.userid ? { ...x, status: data.isconnected ? 'ACTIVO' : "DESCONECTADO" } : x),
        agentList: {
            data: newAgentList,
            count: action.payload.count,
            loading: false,
            error: false,
        },
    };
}

export const setAgentsToReassign = (state: IState, action: IAction): IState => {
    return {
        ...state,
        agentToReassignList: state.userType === "AGENT" ? action.payload.filter((x: any) => x.userid !== state.agentSelected?.userid) : action.payload
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

export const resetInboxSupervisor = (state: IState, action: IAction): IState => {
    return {
        ...state,
        agentSelected: null
    };
}


export const newMessageFromClient = (state: IState, action: IAction): IState => {
    const data: INewMessageParams = action.payload;
    if (state.role.split(",").includes("SUPERVISOR") && data.newConversation) {
        const property = data.userid === 3 ? state.holdingBySupervisor : (data.userid === 2 ? state.botBySupervisor : "")
        if (property === "GRUPO") {
            if (state.userGroup && !state.userGroup.split(",").includes(data.usergroup || "")) {
                return state;
            }
        } else if (property === "CANAL") {
            if (state.channels && !state.channels.split(",").includes(`${data.communicationchannelid}`)) {
                return state;
            }
        }
    }
    let newticketList = [...state.ticketList.data];
    let newInteractionList = [...state.interactionList.data];
    let newTicketSelected = state.ticketSelected ? { ...state.ticketSelected } : null;
    let newAgentList = [...state.agentList.data];
    let newInteraction = null;
    const { agentSelected, ticketSelected, userType } = state;
    if (userType === 'SUPERVISOR') {
        if (data.newConversation) {
            newAgentList = newAgentList.map(x => x.userid === data.userid ? {
                ...x,
                countAnswered: (data.status === "ASIGNADO") ? (x.countAnswered + (data.userid === 2 ? 1 : (data.isAnswered ? 1 : 0))) : x.countAnswered,
                countNotAnswered: (data.status === "ASIGNADO") ? ((x.countNotAnswered || 0) + (data.userid === 2 ? 0 : (data.isAnswered ? 0 : 1))) : x.countNotAnswered,

                countPaused: (data.status === "SUSPENDIDO") ? x.countPaused + 1 : x.countPaused
            } : x)
        } else if (data.usertype === "agent" && data.ticketWasAnswered) {
            newAgentList = newAgentList.map(x => x.userid === data.userid ? {
                ...x,
                countAnswered: (data.status === "ASIGNADO") ? x.countAnswered + 1 : x.countAnswered,
                countNotAnswered: (data.status === "ASIGNADO") ? (x.countNotAnswered || 1) - 1 : x.countNotAnswered,
            } : x)
        }
    }

    if (agentSelected?.userid === data.userid || newticketList.some(x => x.conversationid === data.conversationid)) {
        if (data.newConversation) {
            if (!newticketList.some(x => x.conversationid === data.conversationid)) { // a veces se cruza cuando esta cargando al data
                newticketList = [
                    {
                        ...data,
                        lastconversationdate: data.usertype === "client" ? (data.lastconversationdate || new Date().toISOString()) : null,
                        personlastreplydate: data.usertype === "client" ? (new Date().toISOString()) : null,
                        firstconversationdate: data.firstconversationdate || new Date().toISOString(),
                        isAnswered: data.userid === 2
                    },
                    ...newticketList
                ]
            }
        } else {
            const conversation = newticketList.find(x => x.conversationid === data.conversationid);
            if (conversation) {
                newticketList = [
                    {
                        ...conversation,
                        lastconversationdate: (data.usertype === "client" || (data.usertype === "agent" && data.typeinteraction === "CRON")) ? (conversation.lastconversationdate || new Date().toISOString()) : null,
                        personlastreplydate: data.usertype === "client" ? (new Date().toISOString()) : conversation.personlastreplydate,
                        lastreplyuser: data.usertype === "agent" ? new Date().toISOString() : conversation.lastreplyuser,
                        countnewmessages: data.usertype === "agent" ? (data.typeinteraction === "CRON" ? conversation.countnewmessages : 0) : conversation.countnewmessages + 1,
                        lastmessage: data.typemessage === "text" ? data.lastmessage : data.typemessage.toUpperCase(),
                    },
                    ...newticketList.filter(x => x.conversationid !== data.conversationid)
                ]
            }
        }

        if (ticketSelected?.conversationid === data.conversationid) {

            if (data.usertype === "agent" && data.ticketWasAnswered) {
                newTicketSelected!!.isAnswered = true;
            } else if (data.usertype === "client") {
                newTicketSelected!!.lastconversationdate = new Date().toISOString();
                newTicketSelected!!.personlastreplydate = new Date().toISOString();
            }
            if (data.usertype === "agent") {
                newTicketSelected!!.lastreplyuser = new Date().toISOString();
            }

            newInteraction = {
                interactionid: data.interactionid,
                interactiontype: data.typemessage,
                interactiontext: data.lastmessage,
                uuid: data.uuid,
                createdate: new Date().toISOString(),
                userid: data.usertype === "agent" ? data.userid : 0,
                usertype: data?.usertype === "agent" && data.userid === 2 ? "BOT" : data?.usertype,
            }
            newInteractionList = AddNewInteraction(state.interactionList.data, newInteraction)
        }
    }

    return {
        ...state,
        triggerNewMessageClient: state.ticketSelected?.conversationid === data.conversationid ? !state.triggerNewMessageClient : state.triggerNewMessageClient,
        ticketList: {
            ...state.ticketList,
            data: newticketList
        },
        interactionBaseList: !!newInteraction ? [...state.interactionBaseList, newInteraction] : state.interactionBaseList,
        aNewTicket: (data.newConversation && data.usertype !== "agent") ? !(state.aNewTicket || false) : state.aNewTicket,
        aNewMessage: (!data.newConversation && data.usertype !== "agent") ? !(state.aNewMessage || false) : state.aNewMessage,
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

export const changeStatusTicketWS = (state: IState, action: IAction): IState => {
    const { userid, status, isanswered }: Dictionary = action.payload;

    let newAgentList = [...state.agentList.data];

    const { agentList: { data }, userType } = state;

    if (userType === 'SUPERVISOR') {

        newAgentList = data.map(x => x.userid === userid ? {
            ...x,
            countPaused: status === "SUSPENDIDO" ? x.countPaused + 1 : x.countPaused - 1,
            countAnswered: isanswered ? x.countAnswered + (status === "ASIGNADO" ? 1 : -1) : x.countAnswered,
            countNotAnswered: !isanswered ? (x.countNotAnswered || 0) + (status === "ASIGNADO" ? 1 : -1) : x.countNotAnswered,
        } : x)
    }

    return {
        ...state,
        ticketSelected: state.ticketSelected?.conversationid === action.payload.conversationid ? {
            ...state.ticketSelected!!,
            status: action.payload.status
        } : state.ticketSelected,
        ticketList: {
            ...state.ticketList,
            data: state.ticketList.data.map((x: ITicket) => x.conversationid === action.payload.conversationid ? {
                ...x,
                status: action.payload.status
            } : x)
        },
        agentList: {
            data: newAgentList,
            count: newAgentList.length,
            loading: false,
            error: false,
        },
    };
}

export const updateExternalIDs = (state: IState, action: IAction): IState => {
    return {
        ...state,
        ticketSelected: state.ticketSelected?.conversationid === action.payload.conversationid ? {
            ...state.ticketSelected!!,
            postexternalid: action.payload.postexternalid,
            commentexternalid: action.payload.commentexternalid,
        } : state.ticketSelected,
        ticketList: {
            ...state.ticketList,
            data: state.ticketList.data.map((x: ITicket) => x.conversationid === action.payload.conversationid ? {
                ...x,
                postexternalid: action.payload.postexternalid,
                commentexternalid: action.payload.commentexternalid,
            } : x)
        }
    };
}

export const callWasAnswred = (state: IState, action: IAction): IState => {
    const { userType } = state;

    if (userType !== 'SUPERVISOR') {
        return state;
    }

    return {
        ...state,
        ticketSelected: state.ticketSelected?.conversationid === action.payload.conversationid ? {
            ...state.ticketSelected!!,
            callanswereddate: new Date().toISOString(),
        } : state.ticketSelected,
        ticketList: {
            ...state.ticketList,
            data: state.ticketList.data.map((x: ITicket) => x.conversationid === action.payload.conversationid ? {
                ...x,
                callanswereddate: new Date().toISOString(),
            } : x)
        }
    };
}


export const newCallTicket = (state: IState, action: IAction): IState => ({
    ...state,
    ticketList: {
        ...state.ticketList,
        data: state.ticketList.data.some(x => x.conversationid === action.payload.conversationid) ? state.ticketList.data : state.userType === "AGENT" ? [action.payload, ...state.ticketList.data] : state.ticketList.data
    },
})


export const setSearchTerm = (state: IState, action: IAction): IState => {
    return {
        ...state,
        searchTerm: action.payload||"",
    };
};

export const setPinnedComment = (state: IState, action: IAction): IState => {
    return {
        ...state,
        pinnedmessages: action.payload||[],
    };
};


export const resetShowModal = (state: IState): IState => ({
    ...state,
    showModalClose: 0,
})

export const deleteTicket = (state: IState, action: IAction): IState => {
    const data: IDeleteTicketParams = action.payload;

    if (state.role.split(",").includes("SUPERVISOR")) {
        const property = data.userid === 3 ? state.holdingBySupervisor : (data.userid === 2 ? state.botBySupervisor : "")
        if (property === "GRUPO") {
            if (state.userGroup && !state.userGroup.split(",").includes(data.usergroup || "")) {
                return state;
            }
        } else if (property === "CANAL") {
            if (state.channels && !state.channels.split(",").includes(`${data.communicationchannelid}`)) {
                return state;
            }
        }
    }
    
    if (state.role === "SUPERVISOR" && state.holdingBySupervisor === "GRUPO" && data.userid === 3 && !!state.userGroup) {
        if (!state.userGroup.split(",").includes(data.usergroup || "")) {
            return state;
        }
    }

    let newticketList = [...state.ticketList.data];
    let newAgentList = [...state.agentList.data];
    let ticketToClose = null;
    let newTicketSelected = state.ticketSelected ? { ...state.ticketSelected } : null;
    let showModalClose = state.showModalClose;
    const { agentSelected, userType } = state;

    if (userType === 'SUPERVISOR') {
        newAgentList = newAgentList.map(x => x.userid === data.userid ? {
            ...x,
            countClosed: data.closedTicket ? x.countClosed + 1 : x.countClosed,
            countAnswered: ((data.isanswered || data.userid === 2) && data.status === "ASIGNADO") ? x.countAnswered - 1 : x.countAnswered,
            countNotAnswered: ((!data.isanswered && data.userid !== 2) && data.status === "ASIGNADO") ? (x.countNotAnswered || 1) - 1 : x.countNotAnswered,
            countPaused: (data.status === "SUSPENDIDO") ? x.countPaused - 1 : x.countPaused
        } : x)
    }


    if ((userType === 'AGENT') || (userType === 'SUPERVISOR' && agentSelected?.userid === data.userid)) {
        const ticket = newticketList.find(x => x.conversationid === data.conversationid);
        if (ticket) {
            if (newTicketSelected?.conversationid === data.conversationid) {
                ticketToClose = ticket;
                newTicketSelected = null;
            }
            if (ticket.communicationchanneltype === "VOXI" && userType === 'AGENT' && data.closedTicket) {
                showModalClose++;
            }
            newticketList = newticketList.filter((x: ITicket) => x.conversationid !== data.conversationid);
        }
    }

    return {
        ...state,
        ticketSelected: newTicketSelected,
        ticketList: {
            ...state.ticketList,
            data: newticketList
        },
        person: {
            ...state.person,
            data: newTicketSelected ? state.person.data : null
        },
        ticketToClose: showModalClose === state.showModalClose ? null : ticketToClose,
        showModalClose: showModalClose,
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

export const variablesSync = (state: IState, action: IAction): IState => {
    const data: IVariablesSyncParams = action.payload;
    
    const { ticketSelected } = state;
    if (ticketSelected?.conversationid === data.conversationid) {
        const vv = { ...state.person.data?.variablecontext };
        Object.keys(data.variables).forEach(x => {
            vv[x] = data.variables[x]
        })
        
        return {
            ...state,
            person: {
                ...state.person,
                data: {
                    ...state.person.data!!,
                    variablecontext : vv

                }
            }
        }
    } else {
        return state;
    }
}


export const triggerBlock = (state: IState): IState => ({
    ...state,
    triggerBlock: { ...state.triggerBlock, loading: true, error: false }
});

export const triggerBlockSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        triggerBlock: {
            loading: false,
            error: false
        }
    }
};

export const triggerBlockFailure = (state: IState, action: IAction): IState => ({
    ...state,
    triggerBlock: {
        ...state.triggerBlock,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    }
});

export const triggerBlockReset = (state: IState): IState => ({
    ...state,
    triggerBlock: initialState.triggerBlock,
});



export const getDataTicket = (state: IState): IState => ({
    ...state,
    interactionList: { ...state.interactionList, data: [], loading: true, error: false },
    interactionBaseList: [],
    person: { ...state.person, loading: true, error: false },
});

export const getDataTicketSuccess = (state: IState, action: IAction): IState => {
    if (action.payload.data[0].key === `UFN_CONVERSATION_SEL_INTERACTION_${state.ticketSelected?.conversationid}`) {
        return {
            ...state,
            ticketSelected: { ...state.ticketSelected!!, isAnswered: action.payload.data[0].data.some((x: IInteraction) => x.userid === state.agentSelected?.userid && x.interactiontype !== "LOG") },
            interactionBaseList: action.payload.data?.[0]?.data || [],
            interactionList: {
                data: getGroupInteractions(action.payload.data[0].data, state.hideLogsOnTicket),
                count: action.payload.count,
                loading: false,
                error: false,
            },
            isOnBottom: null,
            configurationVariables: {
                data: action.payload.data[2].data.filter((x: any) => x.visible) || [],
                count: action.payload.count,
                loading: false,
                error: false,
            },
            richResponseList: {
                data: action.payload.data[3].data,//action.payload.data[3].data.map((x: any) => JSON.parse(x.block)) || [],
                count: action.payload.count,
                loading: false,
                error: false,
            },
            person: {
                data: action.payload.data[1].data && action.payload.data[1].data.length > 0 ? action.payload.data[1].data[0] : null,
                loading: false,
                error: false,
            },
            pinnedmessages: action.payload.data[1].data && action.payload.data[1].data.length > 0 ? action.payload.data[1].data[0].pinnedmessages : [],
        }
    } else {
        return state;
    }
};


export const hideLogInteractions = (state: IState, action: IAction): IState => {
    localStorage.setItem(keys.HIDE_LOGS, action.payload ? "1" : "0");
    // const interactions = state.interactionList.data.reduce((acc: IInteraction[], item: IGroupInteraction) => [...acc, ...item.interactions], [])
    return {
        ...state,
        hideLogsOnTicket: action.payload,
        interactionList: {
            data: getGroupInteractions(state.interactionBaseList, action.payload),
            count: action.payload.count,
            loading: false,
            error: false,
        },
    }
};

export const setHideLogsOnTicket = (state: IState, action: IAction): IState => {
    const localHideLogs = localStorage.getItem(keys.HIDE_LOGS);
    return {
        ...state,
        hideLogsOnTicket: !!localHideLogs ? localHideLogs === "1" : action.payload
    }
};


export const updateInteractionByUUID = (state: IState, action: IAction): IState => {
    return {
        ...state,
        interactionList: {
            ...state.interactionList,
            data: state.interactionList.data.map(group => ({
                ...group,
                interactions: group.interactions.map(interaction => interaction.uuid === action.payload.uuid ? { ...interaction, interactionid: action.payload.interactionid } : interaction)
            }))
        }
    }
};

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
        data: getGroupInteractions(cleanLogsReassignedTask(action.payload.data || [], true), true, true),
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

export const closeTicketSuccess = (state: IState): IState => ({
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

export const massiveCloseTicketSuccess = (state: IState): IState => ({
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

export const reassignTicketSuccess = (state: IState): IState => ({
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

export const connectAgentUItmpSuccess = (state: IState): IState => ({
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
        interactionid: action.payload.Result.interactionid,
        uuid: action.payload.Result.uuid,
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

export const sendHSMSuccess = (state: IState): IState => ({
    ...state,
    triggerSendHSM: { ...state.triggerSendHSM, loading: false, error: false },
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



export const importTicket = (state: IState): IState => ({
    ...state,
    triggerImportTicket: { ...state.triggerImportTicket, loading: true, error: false },
});

export const importTicketSuccess = (state: IState): IState => ({
    ...state,
    triggerImportTicket: {
        loading: false,
        error: false,
    },
});

export const importTicketFailure = (state: IState, action: IAction): IState => ({
    ...state,
    triggerImportTicket: {
        ...state.triggerImportTicket,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    },
});

export const importTicketReset = (state: IState): IState => ({
    ...state,
    triggerImportTicket: initialState.triggerImportTicket,
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

export const setLibraryByUser = (state: IState, action: IAction): IState => ({
    ...state,
    libraryList: action.payload.map((x:any) => {
        const extension = x.link.split('.').pop().toLocaleLowerCase()
        const type = ["png", "jpg", "jpeg", "gif"].includes(extension) ? "image" :
                        (["avi", "mp4", "mov", "flv", "rm", "rmvb", "mkv", "3gp", "mpg"].includes(extension) ? "video" : "file")
        return {
            ...x,
            type
        }
    })
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

export const forceddesconection = (state: IState, action: IAction): IState => ({
    ...state,
    showModalClose: 0,
    forceddisconnect: {
        error: false,
        loading: false,
        code: action.payload.code,
        message: action.payload.code,
        value: action.payload,
    },
});
export const callConnected = (state: IState, action: IAction): IState => ({
    ...state,
    ticketList: {
        ...state.ticketList,
        data: state.ticketList.data.map(x => x.personcommunicationchannel === action.payload ? { ...x, callanswereddate: new Date().toISOString() } : x)
    }
});

export const resetForceddesconection = (state: IState): IState => ({
    ...state,
    forceddisconnect: initialState.forceddisconnect,
});

export const setDataUser = (state: IState, action: IAction): IState => ({
    ...state,
    holdingBySupervisor: action.payload.holdingBySupervisor,
    botBySupervisor: action.payload.botBySupervisor,
    userGroup: action.payload.userGroup,
    role: action.payload.role,
    channels: action.payload.channels,
});


export const updQuickreplies = (state: IState, action: IAction): IState => ({
    ...state,
    quickreplies: { 
        data: ((action.payload.operation==="DELETE" || action.payload.status === "INACTIVO" )?state.quickreplies.data.filter((x:any)=>x.quickreplyid !== action.payload.id): [...state.quickreplies.data.filter((x:any)=>x.quickreplyid !== action.payload.id),
        {
            quickreplyid: action.payload.id,
            description:  action.payload.description,
            quickreply:  action.payload.quickreply,
            favorite: action.payload.favorite
        }]),loading: true, error: false },
});

export const getDataQuickreplies = (state: IState): IState => ({
    ...state,
    quickreplies: { ...state.quickreplies, loading: true, error: false },
});

export const getDataQuickrepliesSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    quickreplies: {
        data: action.payload.data || [],
        loading: false,
        error: false,
    },
});

export const getDataQuickrepliesFailure = (state: IState, action: IAction): IState => ({
    ...state,
    quickreplies: {
        ...state.quickreplies,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    },
});

export const getDataQuickrepliesReset = (state: IState): IState => ({
    ...state,
    quickreplies: initialState.quickreplies,
});

export const getDataInnapropiatewords = (state: IState): IState => ({
    ...state,
    inappropriateWords: { ...state.inappropriateWords, loading: true, error: false },
});

export const getDataInnapropiatewordsSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    inappropriateWords: {
        data: action.payload.data || [],
        loading: false,
        error: false,
    },
});

export const getDataInnapropiatewordsFailure = (state: IState, action: IAction): IState => ({
    ...state,
    inappropriateWords: {
        ...state.inappropriateWords,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    },
});

export const getDataInnapropiatewordsReset = (state: IState): IState => ({
    ...state,
    inappropriateWords: initialState.inappropriateWords,
});