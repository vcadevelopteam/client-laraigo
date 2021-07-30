import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const main = (state: IState): IState => ({
    ...state,
    data: state.data,
    loading: true,
    error: false
});

export const mainSuccess = (state: IState, action: IAction): IState => {
    // saveAuthorizationToken(action.payload.data.token);
    console.log(action);
    
    return {
        ...state,
        data: action.payload.data || [],
        loading: false,
        error: false,
    }
};

export const mainFailure = (state: IState, action: IAction): IState => ({
    ...state,
    data: state.data,
    loading: false,
    error: true,
    code: action.payload.code || 'loginFailure:error',
    message: action.payload.message || 'Error al intentar loguearse',
});

export const mainReset = (state: IState): IState => ({
    ...state,
    data: initialState.data,
});
