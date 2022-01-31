export interface IBaseState {
    loading: boolean;
    /** Error code */
    code?: string;
    key?: string;
    error: boolean;
    /** Error message */
    message?: string;
}

export interface IListState<T> extends IBaseState {
    data: T[];
}

export interface IListStatePaginated<T> extends IListState<T> {
    /** total de elementos sin paginado */
    count: number;
}

export interface IObjectState<T> extends IBaseState {
    value?: T;
}

export interface IProcessState extends IBaseState {
    success: boolean;
}
