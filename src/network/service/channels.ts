
import { IRequestBody } from '@types';
import { apiUrls } from 'common/constants';
import { APIManager } from '../manager';

export function getPagelist(accessToken: String, appId: String) {
    const data = { accessToken: accessToken, appId: appId };
    return APIManager.post(apiUrls.GET_PAGELIST, { data }, true);
}

export function getPhoneList(request: any) {
    return APIManager.post(apiUrls.GET_PHONELIST, { data: request }, true);
}

export function getPagelistSub(accessToken: String, appId: String) {
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

export function vrfplan(accessToken: String) {
    const data = { parameters: { code: accessToken } };
    return APIManager.post(apiUrls.VERIFY_CHANNEL, { data }, true);
}

export function synchronizeTemplate(request: any) {
    return APIManager.post(apiUrls.SYNCHRONIZE_TEMPLATE, { data: request }, true);
}

export function addTemplate(request: any) {
    return APIManager.post(apiUrls.ADD_TEMPLATE, { data: request }, true);
}

export function deleteTemplate(request: any) {
    return APIManager.post(apiUrls.DELETE_TEMPLATE, { data: request }, true);
}

export function getGroupList(request: any) {
    return APIManager.post(apiUrls.GET_GROUP_LIST, { data: request }, true);
}