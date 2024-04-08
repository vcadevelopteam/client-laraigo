import { apiUrls } from "common/constants";
import { APIManager } from "network/manager";

export function createCollection(data: any) {
    return APIManager.post(apiUrls.LLAMA_CREATE_COLLECTION, { data }, true);
}

export function deleteCollection(data: any) {
    return APIManager.post(apiUrls.LLAMA_DELETE_COLLECTION, { data }, true);
}

export function addFile(data: any) {
    return APIManager.post(apiUrls.LLAMA_ADD_FILE, { data }, true);
}

export function query(data: any) {
    return APIManager.post(apiUrls.LLAMA_QUERY, { data }, true);
}