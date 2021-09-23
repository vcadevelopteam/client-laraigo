// import { Dispatch } from 'redux';
// import actionTypes from '../../store/auth/actionTypes';
import { keys } from '../constants';
// import { AxiosResponse } from 'axios';

export function getAccessToken(): string | null {
    return localStorage.getItem(keys.JWT_TOKEN);
}

export function saveAuthorizationToken(token: string): void {
    localStorage.setItem(keys.JWT_TOKEN, token);
}

export function removeAuthorizationToken(): void {
    localStorage.removeItem(keys.JWT_TOKEN);
    localStorage.removeItem(keys.AGENT_CONNECTED);
}

export function getAuthorizationToken(): string {
    let token = localStorage.getItem(keys.JWT_TOKEN);
    if (!token) token = '';
    const authString = token;
    return authString;
}

/*export function isUnauthorizedCall(dispatch: Dispatch, response: AxiosResponse): boolean {
    if (!response) return false;
    if (response.status === httpStatus.UNAUTHORIZED) {
        dispatch({ type: actionTypes.LOGOUT_USER });
        localStorage.removeItem(keys.JWT_TOKEN);
        return true;
    }
    return false;
}*/
