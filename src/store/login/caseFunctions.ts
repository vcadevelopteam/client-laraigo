import { IAction } from "@types";
import { initialState, IState } from "./reducer";
import { saveAuthorizationToken } from "common/helpers";

export const login = (state: IState): IState => ({
    ...state,
    user: state.user,
    loading: true,
    error: false
});

export const loginSuccess = (state: IState, action: IAction): IState => {
    saveAuthorizationToken(action.payload.data.token);
    
    return {
        ...state,
        user: action.payload.data,
        loading: false,
        error: false,
    }
};

export const loginFailure = (state: IState, action: IAction): IState => ({
    ...state,
    user: state.user,
    loading: false,
    error: true,
    code: action.payload.code || 'loginFailure:error',
    message: action.payload.message || 'Error al intentar loguearse',
});

export const loginReset = (state: IState): IState => ({
    ...state,
    user: initialState.user,
});
