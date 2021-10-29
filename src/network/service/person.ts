import { IRequestBody } from "@types";
import { apiUrls } from "common/constants";
import { APIManager } from "network/manager";

export function getLeadsByPerson(data: IRequestBody) {
    const url = apiUrls.PERSON + '/get/leads';
    return APIManager.post(url, { data });
}
