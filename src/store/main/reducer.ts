import { IListStatePaginated, MultiData, Dictionary, ITemplate } from "@types";
import { createReducer, initialListPaginatedState, initialCommon } from "common/helpers";
import * as caseFunctions from './caseFunctions';
import actionTypes from "./actionTypes";

export interface itemMulti {
    key: string;
    data: Dictionary[];
    success: boolean;
}

export interface IFilter {
    value: string;
    operator: string;
    type: string;
}

export interface IMemoryTable {
    page: number;
    pageSize: number;
    id: string;
    filters: { [key: string]: IFilter }
}

export interface IUpload extends ITemplate {
    url?: string;
    height?: string;
    width?: string;
    name?: string;
    thumbnail?: string;
}


export interface IState {
    mainData: IListStatePaginated<Dictionary> & { key?: string };
    mainEventBooking: IListStatePaginated<Dictionary> & { key?: string };
    mainDynamic: IListStatePaginated<Dictionary>;
    multiData: IListStatePaginated<MultiData>;
    multiDataAux: IListStatePaginated<itemMulti>;
    multiDataAux2: IListStatePaginated<itemMulti>;
    multiDataAux3: IListStatePaginated<itemMulti>;
    execute: IListStatePaginated<Dictionary> & { success: boolean | undefined | null };
    mainAux: IListStatePaginated<Dictionary> & { key?: string };
    mainAux2: IListStatePaginated<Dictionary> & { key?: string };
    mainPaginated: IListStatePaginated<Dictionary>;
    mainPaginatedAux: IListStatePaginated<Dictionary>;
    mainGraphic: IListStatePaginated<Dictionary> & { key?: string };
    uploadFile: IUpload;
    exportData: IUpload;
    testRequest: ITemplate & { data?: Dictionary };
    exportDynamicData: IUpload;
    memoryTable: IMemoryTable;
    viewChange: string;
}

export const initialState: IState = {
    mainData: initialListPaginatedState,
    mainEventBooking: initialListPaginatedState,
    mainDynamic: initialListPaginatedState,
    multiData: initialListPaginatedState,
    multiDataAux: initialListPaginatedState,
    multiDataAux2: initialListPaginatedState,
    multiDataAux3: initialListPaginatedState,
    execute: { success: undefined, ...initialListPaginatedState },
    mainAux: initialListPaginatedState,
    mainAux2: initialListPaginatedState,
    mainPaginated: initialListPaginatedState,
    mainPaginatedAux: initialListPaginatedState,
    mainGraphic: initialListPaginatedState,
    testRequest: initialCommon,
    uploadFile: { ...initialCommon },
    exportData: { ...initialCommon },
    exportDynamicData: { ...initialCommon },
    memoryTable: {
        id: "",
        page: -1,
        pageSize: -1,
        filters: {}
    },
    viewChange: ""
};

export default createReducer<IState>(initialState, {
    [actionTypes.MAIN]: caseFunctions.main,
    [actionTypes.MAIN_SUCCESS]: caseFunctions.mainSuccess,
    [actionTypes.MAIN_FAILURE]: caseFunctions.mainFailure,
    [actionTypes.MAIN_RESET]: caseFunctions.mainReset,

    [actionTypes.MULTI_MAIN]: caseFunctions.multiMain,
    [actionTypes.MULTI_MAIN_SUCCESS]: caseFunctions.multiMainSuccess,
    [actionTypes.MULTI_MAIN_FAILURE]: caseFunctions.multiMainFailure,
    [actionTypes.MULTI_MAIN_RESET]: caseFunctions.multiMainReset,

    [actionTypes.EXECUTE_MAIN]: caseFunctions.execute,
    [actionTypes.EXECUTE_MAIN_SUCCESS]: caseFunctions.executeSuccess,
    [actionTypes.EXECUTE_MAIN_FAILURE]: caseFunctions.executeFailure,
    [actionTypes.EXECUTE_MAIN_RESET]: caseFunctions.executeReset,

    [actionTypes.TEST_REQUEST]: caseFunctions.testRequest,
    [actionTypes.TEST_REQUEST_SUCCESS]: caseFunctions.testRequestSuccess,
    [actionTypes.TEST_REQUEST_FAILURE]: caseFunctions.testRequestFailure,
    [actionTypes.TEST_REQUEST_RESET]: caseFunctions.testRequestReset,

    [actionTypes.AUX_MAIN]: caseFunctions.mainAux,
    [actionTypes.AUX_MAIN_SUCCESS]: caseFunctions.mainAuxSuccess,
    [actionTypes.AUX_MAIN_FAILURE]: caseFunctions.mainAuxFailure,
    [actionTypes.AUX_MAIN_RESET]: caseFunctions.mainAuxReset,

    [actionTypes.AUX2_MAIN]: caseFunctions.mainAux2,
    [actionTypes.AUX2_MAIN_SUCCESS]: caseFunctions.mainAux2Success,
    [actionTypes.AUX2_MAIN_FAILURE]: caseFunctions.mainAux2Failure,
    [actionTypes.AUX2_MAIN_RESET]: caseFunctions.mainAux2Reset,

    [actionTypes.AUX_MULTI_MAIN]: caseFunctions.auxMultiMain,
    [actionTypes.AUX_MULTI_MAIN_SUCCESS]: caseFunctions.auxMultiMainSuccess,
    [actionTypes.AUX_MULTI_MAIN_FAILURE]: caseFunctions.auxMultiMainFailure,
    [actionTypes.AUX_MULTI_MAIN_RESET]: caseFunctions.auxMultiMainReset,

    [actionTypes.AUX2_MULTI_MAIN]: caseFunctions.aux2MultiMain,
    [actionTypes.AUX2_MULTI_MAIN_SUCCESS]: caseFunctions.aux2MultiMainSuccess,
    [actionTypes.AUX2_MULTI_MAIN_FAILURE]: caseFunctions.aux2MultiMainFailure,
    [actionTypes.AUX2_MULTI_MAIN_RESET]: caseFunctions.aux2MultiMainReset,

    [actionTypes.AUX3_MULTI_MAIN]: caseFunctions.aux3MultiMain,
    [actionTypes.AUX3_MULTI_MAIN_SUCCESS]: caseFunctions.aux3MultiMainSuccess,
    [actionTypes.AUX3_MULTI_MAIN_FAILURE]: caseFunctions.aux3MultiMainFailure,
    [actionTypes.AUX3_MULTI_MAIN_RESET]: caseFunctions.aux3MultiMainReset,

    [actionTypes.PAGINATED_MAIN]: caseFunctions.mainPaginated,
    [actionTypes.PAGINATED_MAIN_SUCCESS]: caseFunctions.mainPaginatedSuccess,
    [actionTypes.PAGINATED_MAIN_FAILURE]: caseFunctions.mainPaginatedFailure,
    [actionTypes.PAGINATED_MAIN_RESET]: caseFunctions.mainPaginatedReset,

    [actionTypes.AUX_PAGINATED_MAIN]: caseFunctions.mainAuxPaginated,
    [actionTypes.AUX_PAGINATED_MAIN_SUCCESS]: caseFunctions.mainAuxPaginatedSuccess,
    [actionTypes.AUX_PAGINATED_MAIN_FAILURE]: caseFunctions.mainAuxPaginatedFailure,
    [actionTypes.AUX_PAGINATED_MAIN_RESET]: caseFunctions.mainAuxPaginatedReset,

    [actionTypes.GRAPHIC_MAIN]: caseFunctions.mainGraphic,
    [actionTypes.GRAPHIC_MAIN_SUCCESS]: caseFunctions.mainGraphicSuccess,
    [actionTypes.GRAPHIC_MAIN_FAILURE]: caseFunctions.mainGraphicFailure,
    [actionTypes.GRAPHIC_MAIN_RESET]: caseFunctions.mainGraphicReset,

    [actionTypes.UPLOAD_FILE]: caseFunctions.uploadFile,
    [actionTypes.UPLOAD_FILE_SUCCESS]: caseFunctions.uploadFileSuccess,
    [actionTypes.UPLOAD_FILE_FAILURE]: caseFunctions.uploadFileFailure,
    [actionTypes.UPLOAD_FILE_RESET]: caseFunctions.uploadFileReset,

    [actionTypes.EXPORT_DATA]: caseFunctions.exportData,
    [actionTypes.EXPORT_DATA_SUCCESS]: caseFunctions.exportDataSuccess,
    [actionTypes.EXPORT_DATA_FAILURE]: caseFunctions.exportDataFailure,
    [actionTypes.EXPORT_DATA_RESET]: caseFunctions.exportDataReset,

    [actionTypes.DATA_DYNAMIC]: caseFunctions.mainDynamic,
    [actionTypes.DATA_DYNAMIC_SUCCESS]: caseFunctions.mainDynamicSuccess,
    [actionTypes.DATA_DYNAMIC_FAILURE]: caseFunctions.mainDynamicFailure,
    [actionTypes.DATA_DYNAMIC_RESET]: caseFunctions.mainDynamicReset,

    [actionTypes.MAIN_EVENT_BOOKING]: caseFunctions.mainEventBooking,
    [actionTypes.MAIN_EVENT_BOOKING_SUCCESS]: caseFunctions.mainEventBookingSuccess,
    [actionTypes.MAIN_EVENT_BOOKING_FAILURE]: caseFunctions.mainEventBookingFailure,
    [actionTypes.MAIN_EVENT_BOOKING_RESET]: caseFunctions.mainEventBookingReset,

    [actionTypes.DATA_EXPORT_DYNAMIC]: caseFunctions.exportDataDynamic,
    [actionTypes.DATA_EXPORT_DYNAMIC_SUCCESS]: caseFunctions.exportDataDynamicSuccess,
    [actionTypes.DATA_EXPORT_DYNAMIC_FAILURE]: caseFunctions.exportDataDynamicFailure,
    [actionTypes.DATA_EXPORT_DYNAMIC_RESET]: caseFunctions.exportDataDynamicReset,
    [actionTypes.RESET_ALL]: caseFunctions.resetAll,
    [actionTypes.SET_MEMORY_TABLE]: caseFunctions.setMemoryTable,
    [actionTypes.CLEAN_MEMORY_TABLE]: caseFunctions.cleanMemoryTable,
    [actionTypes.VIEWCHANGE]: caseFunctions.setViewChange,
    [actionTypes.CLEAN_VIEWCHANGE]: caseFunctions.cleanViewChange,
});