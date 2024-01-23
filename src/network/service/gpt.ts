import { apiUrls } from "common/constants";
import { APIManager } from "network/manager";


export function createThread(data: any) {
    return APIManager.post(apiUrls.GPT_THREADS, { data }, true);
}

export function deleteThread(data: any) {
    return APIManager.post(apiUrls.GPT_THREADS_DELETE, { data }, true);
}

export function createAssistant(data: any) {
    return APIManager.post(apiUrls.GPT_ASSISTANT_NEW, { data }, true);
}

export function messages(data: any) {
    return APIManager.post(apiUrls.GPT_MESSAGES, { data }, true);
}

export function deleteFile(data: any) {
    return APIManager.post(apiUrls.GPT_FILE_DELETE, { data }, true);
}