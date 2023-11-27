import { ReactElement } from "react";

export interface ConsumptionLine {
    comment: string; //""
    dispatchto: string; //""
    fromlote: string;//""
    fromshelf: string;//""
    inventoryconsumptiondetailid: number; //0
    line: number;//0
    operation: string;//"INSERT"
    p_tableid: number;//"0"
    onlinecost: number; //cant* price
    realdate:  any;//null
    status: string;//ACTIVO
    type: string;//"NINGUNO"
    
    createby: string;
    description: string;
    productcode: string;
    quantity: number;
    transactiontype: string;
    ticketnumber: string;

    unitcost: number;
    productid: number;

}
