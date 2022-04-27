import { IAction } from "@types";
import { initialState, IState } from "./reducer";
import { saveAuthorizationToken } from "common/helpers";
import * as VoxImplant from 'voximplant-websdk';

export const manageConnection = (state: IState, action: IAction): IState => {
    console.log("voximplant: manageConnection", action.payload)
    return {
        ...state,
        connection: {
            error: action.payload.error,
            message: action.payload.message,
            loading: action.payload.loading
        }
    }
};

export const initCall = (state: IState, action: IAction): IState => {
    console.log("voximplant: manageConnection", action.payload)

    return {
        ...state,
        call: action.payload,
        statusCall: "CONNECTING"
    }
}

export const manageStatusCall = (state: IState, action: IAction): IState => {
    console.log("voximplant: manageConnection", action.payload)
    return {
        ...state,
        statusCall: action.payload
    }
}