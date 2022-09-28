import { IActionCall } from "@types";
import { WitaiService } from "network";
import actionTypes from "./actionTypes";


export const testwitai = (requestBody: any): any => ({
    callAPI: () => WitaiService.witaitest(requestBody),
    types: {
        loading: actionTypes.TESTMESSAGE_SEND,
        success: actionTypes.TESTMESSAGE_SUCCESS,
        failure: actionTypes.TESTMESSAGE_FAILURE,
    },
    type: null,
});

export const resetWitaiTest = (): IActionCall => ({type: actionTypes.TESTMESSAGE_RESET});
