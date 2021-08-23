import { IAction } from "@types";
import { IState } from "./reducer";

export const showSnackbar = (state: IState, action: IAction): IState => ({
    ...state,
    snackbar: action.payload,
})

export const showBackdrop = (state: IState, action: IAction): IState => {
    return {
        ...state,
        showBackDrop: action.payload,
    }
}

export const openDrawer = (state: IState, action: IAction): IState => ({
    ...state,
    openDrawer: action.payload,
})
