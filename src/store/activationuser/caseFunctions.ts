import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const send = (state: IState, action: IAction): IState => ({
    ...state,
    activation: {
        ...state.activation,
        loading: true,
        error: false
    }
})

export const failure = (state: IState, action: IAction): IState => ({
    ...state,
    activation: {
        ...state.activation,
        loading: false,
        error: true,
        data: action.payload
    }
})

export const success = (state: IState, action: IAction): IState => ({
    ...state,
    activation: {
        ...state.activation,
        loading: false,
        error: false,
        data: action.payload
    }
})

export const reset = (state: IState): IState => ({
    ...state,
    activation: initialState.activation
})