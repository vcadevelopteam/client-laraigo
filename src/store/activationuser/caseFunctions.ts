import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const send = (state: IState): IState => ({
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



export const saveUser = (state: IState): IState => ({
    ...state,
    saveUser: { ...state.saveUser, loading: true, error: false, success: undefined }
});

export const saveUserSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        saveUser: {
            data: action.payload.data || [],
            count: 0,
            loading: false,
            error: false,
            success: true,
        }
    }
};

export const saveUserFailure = (state: IState, action: IAction): IState => ({
    ...state,
    saveUser: {
        ...state.saveUser,
        loading: false,
        error: true,
        key: action.payload.key,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
        success: false,
    }
});

export const saveUserReset = (state: IState): IState => ({
    ...state,
    saveUser: initialState.saveUser,
});

export const delUser = (state: IState): IState => ({
    ...state,
    delUser: {
        ...state.delUser,
        loading: true,
        error: false,
        success: undefined
    }
});

export const delUserSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        delUser: {
            ...state.delUser,
            data: action.payload,
            loading: false,
            error: false,
        }
    }
};

export const delUserFailure = (state: IState, action: IAction): IState => ({
    ...state,
    delUser: {
        ...state.delUser,
        data: action.payload,
        loading: false,
        error: true,
        success: false,
    }
});

export const delUserReset = (state: IState): IState => ({
    ...state,
    delUser: initialState.delUser,
});