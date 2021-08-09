import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const showSnackbar = (state: IState, action: IAction): IState => ({
    ...state,
    snackbar: action.payload,
})

export const showBackdrop = (state: IState, action: IAction): IState => ({
    ...state,
    showBackDrop: action.payload,
})