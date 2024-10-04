import { apiUrls } from "common/constants";
import { APIManager } from "network/manager";

export function openLink(data: any) {
    return APIManager.post(apiUrls.LINK_COUNT, { data }, true);
}