import { APIManager } from "../manager";
import { apiUrls } from "common/constants";
import { IRequestBody } from "@types";

export function getPagelist(accessToken: string, appId: string) {
    const data = { accessToken: accessToken, appId: appId };
    return APIManager.post(apiUrls.GET_PAGELIST, { data }, true);
}

export function getPhoneList(request: unknown) {
    return APIManager.post(apiUrls.GET_PHONELIST, { data: request }, true);
}

export function getPagelistSub(accessToken: string, appId: string) {
    const data = { accessToken: accessToken, appId: appId };
    return APIManager.post(apiUrls.GET_PAGELISTSUB, { data }, true);
}

export function insertchnl(requestBody: IRequestBody) {
    return APIManager.post(apiUrls.INSERT_CHANNEL, { data: requestBody }, true);
}

export function activateChannel(requestBody: IRequestBody) {
    return APIManager.post(apiUrls.ACTIVATE_CHANNEL, { data: requestBody }, true);
}

export function execSub(requestBody: IRequestBody) {
    return APIManager.post(apiUrls.EXEC_SUB, { data: requestBody }, true);
}

export function valChannels(requestBody: IRequestBody) {
    return APIManager.post(apiUrls.VALIDATE_CHANNELS, { data: requestBody }, true);
}

export function validateNewUser(requestBody: IRequestBody) {
    return APIManager.post(apiUrls.VALIDATE_NEW_USER, { data: requestBody }, true);
}

export function getCurrencyList() {
    return APIManager.get(apiUrls.CURRENCYLIST, { data: {} }, true);
}

export function getCountryList() {
    return APIManager.get(apiUrls.COUNTRYLIST, { data: {} }, true);
}

export function deletechnl(requestBody: IRequestBody) {
    return APIManager.post(apiUrls.DELETE_CHANNEL, { data: requestBody }, true);
}

export function checkPaymentPlan(requestBody: IRequestBody) {
    return APIManager.post(apiUrls.CHECK_PAYMENTPLAN, { data: requestBody }, true);
}

export function editchnl(requestBody: IRequestBody) {
    const uri = `${apiUrls.CHANNELS}/updatechannel`;
    return APIManager.post(uri, { data: requestBody }, true);
}

export function vrfplan(accessToken: string) {
    const data = { parameters: { code: accessToken } };
    return APIManager.post(apiUrls.VERIFY_CHANNEL, { data }, true);
}

export function synchronizeTemplate() {
    return APIManager.post(apiUrls.SYNCHRONIZE_TEMPLATE, {}, true);
}

export function addTemplate(request: unknown) {
    return APIManager.post(apiUrls.ADD_TEMPLATE, { data: request }, true);
}

export function deleteTemplate(request: unknown) {
    return APIManager.post(apiUrls.DELETE_TEMPLATE, { data: request }, true);
}

export function getGroupList(request: unknown) {
    return APIManager.post(apiUrls.GET_GROUP_LIST, { data: request }, true);
}