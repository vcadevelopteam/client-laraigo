import { IAction, IInteraction} from "@types";
import { initialState, IState } from "./reducer";
import { convertLocalDate, toTime24HR } from "common/helpers";

export interface IGroupInteraction {
    createdate: string;
    userid?: number | null;
    personid?: number | null;
    usertype: string | null;
    interactions: IInteraction[];
    interactionid: number;
    interactiontext?: string;
    interactiontype?: string;
    listImage?: string[];
    emailcopy?: string;
    emailcocopy?: string;
}

const getGroupInteractions = (interactions: IInteraction[], hideLogs: boolean = false, returnHidden: boolean = false): IGroupInteraction[] => {

    const listImages = interactions.filter(x => x.interactiontype.includes("image")).map(x => x.interactiontext)
    let indexImage = 0;

    return (hideLogs ? interactions.filter(x => x.interactiontype !== "LOG") : cleanLogsReassignedTask(interactions, returnHidden)).reduce((acc: any, item: IInteraction) => {
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


export const conversation = (state: IState): IState => ({
    ...state,
    conversationData: { ...state.conversationData, data: null, loading: true, error: false }
});

export const conversationSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        conversationData: {
            key: action.payload.key,
            data: action.payload.params || null,
            loading: false,
            error: false
        }
    }
};

export const conversationFailure = (state: IState, action: IAction): IState => ({
    ...state,
    conversationData: {
        ...state.conversationData,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    }
});

export const conversationReset = (state: IState): IState => ({
    ...state,
    conversationData: initialState.conversationData,
});



export const interaction = (state: IState): IState => ({
    ...state,
    interactionData: { ...state.interactionData, data: [], loading: true, error: false }
});

export const interactionSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        interactionData: {
            key: action.payload.key,            
            data: getGroupInteractions(cleanLogsReassignedTask(action.payload.data || [], true), false, true),
            count: 0,
            loading: false,
            error: false
        }
    }
};

export const interactionFailure = (state: IState, action: IAction): IState => ({
    ...state,
    interactionData: {
        ...state.interactionData,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    }
});

export const interactionReset = (state: IState): IState => ({
    ...state,
    interactionData: initialState.interactionData,
});


