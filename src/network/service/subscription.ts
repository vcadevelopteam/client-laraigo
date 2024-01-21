import { APIManager } from "../manager";
import { apiUrls } from "../../common/constants";

export function recoverPassword(request: unknown) {
    return APIManager.post(apiUrls.RECOVERPASSWORD, { data: request }, true);
}

export function changePassword(request: unknown) {
    return APIManager.post(apiUrls.CHANGEPASSWORD, { data: request }, true);
}

export function validateChannels(request: unknown) {
    return APIManager.post(apiUrls.VALIDATE_CHANNELS, { data: request }, true);
}