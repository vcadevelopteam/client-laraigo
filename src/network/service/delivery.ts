import { apiUrls } from "common/constants";
import { APIManager } from "network/manager";

export function deliveryRouting(data: any) {
    return APIManager.post(apiUrls.DELIVERY_ROUTING, { data: {parameters: data} }, true);
}