import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const items = (state: IState): IState => ({
    ...state,
    items: { ...state.items, data: [], loading: true, error: false }
});

export const itemsSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        items: {
            key: action.payload.key,
            data: action.payload.data || [],
            count: 0,
            loading: false,
            error: false
        }
    }
};

export const itemsFailure = (state: IState, action: IAction): IState => ({
    ...state,
    items: {
        ...state.items,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    }
});

export const itemsReset = (state: IState): IState => ({
    ...state,
    items: initialState.items,
});

export const setRow = (state: IState, action: IAction): IState => {
    return {
        ...state,
        selectedRow: action?.payload?.row||null
    }
}
