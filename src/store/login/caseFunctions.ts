import { IAction, IUser } from "@types";
import { initialState, IState } from "./reducer";
import { saveAuthorizationToken, removeAuthorizationToken } from "common/helpers";

export const login = (state: IState): IState => ({
    ...state,
    validateToken: initialState.validateToken,
    login: {
        ...state.login,
        loading: true,
        error: false
    }
});

export const loginSuccess = (state: IState, action: IAction): IState => {
    saveAuthorizationToken(action.payload.data.token);
    return {
        ...state,
        login: {
            ...state.login,
            loading: false,
            error: false,
            user: action.payload.data,
        }
    }
};

export const loginFailure = (state: IState, action: IAction): IState => ({
    ...state,
    login: {
        ...state.login,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
    }
});

export const loginReset = (state: IState): IState => ({
    ...state,
    login: initialState.login,
});

export const updateUserInformation = (state: IState, action: IAction): IState => ({
    ...state,
    validateToken: {
        ...state.validateToken,
        user: {
            ...state.validateToken.user,
            ...action.payload
        },
    }
});

export const validateToken = (state: IState): IState => ({
    ...state,
    validateToken: {
        ...state.validateToken,
        loading: true,
        error: false
    }
});

export const validateTokenSuccess = (state: IState, action: IAction): IState => {
    saveAuthorizationToken(action.payload.data.token);
    return {
        ...state,
        validateToken: {
            ...state.validateToken,
            loading: false,
            error: false,
            user: action.payload.data,
        }
    }
};

export const validateTokenFailure = (state: IState, action: IAction): IState => {
    removeAuthorizationToken()
    return {
        ...state,
        validateToken: {
            ...state.validateToken,
            loading: false,
            error: true,
            code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        }
    }
};

export const validateTokenReset = (state: IState): IState => ({
    ...state,
    validateToken: initialState.validateToken,
});







export const changeOrganization = (state: IState): IState => ({
    ...state,
    triggerChangeOrganization: {
        ...state.triggerChangeOrganization,
        loading: true,
        error: false
    }
});

export const changeOrganizationSuccess = (state: IState, action: IAction): IState => {
    saveAuthorizationToken(action.payload.data.token);
    return {
        ...state,
        triggerChangeOrganization: {
            ...state.triggerChangeOrganization,
            loading: false,
            error: false,
        }
    }
};

export const changeOrganizationFailure = (state: IState, action: IAction): IState => {
    // removeAuthorizationToken()
    return {
        ...state,
        triggerChangeOrganization: {
            ...state.triggerChangeOrganization,
            loading: false,
            error: true,
            code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        }
    }
};

export const changeOrganizationReset = (state: IState): IState => ({
    ...state,
    triggerChangeOrganization: initialState.triggerChangeOrganization,
});







export const logout = (state: IState): IState => {
    return {
        ...state,
        login: {
            ...state.login,
            loading: false,
            error: false,
            user: null
        },
        logout: {
            ...state.logout,
            loading: true,
            error: false
        }
    }
};

export const logoutSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        logout: {
            ...state.logout,
            loading: false,
            error: false,
        }
    }
};

export const logoutFailure = (state: IState, action: IAction): IState => {
    return {
        ...state,
        logout: {
            ...state.logout,
            loading: false,
            error: true,
            code: action.payload.code || 'logoutFailure:error',
        }
    }
};

export const logoutReset = (state: IState): IState => ({
    ...state,
    logout: initialState.logout,
});

export const changePwdFirstLogin = (state: IState, action: IAction): IState => ({
    ...state,
    validateToken: {
        ...state.validateToken,
        user: {
            ...(state.validateToken.user || {} as IUser),
            pwdchangefirstlogin: action.payload.value,
        },
    },
    ignorePwdchangefirstloginValidation: action.payload.ignorePwdchangefirstloginValidation,
});
