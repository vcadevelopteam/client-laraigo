import { Button } from "@material-ui/core";
import { DialogZyx } from "components";
import { langKeys } from "lang/keys";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/Save";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import TableZyx from "components/fields/table-simple";
import { useSelector } from "hooks";
import { Dictionary } from "@types";

const selectionKey = "inventorybookingid";

const SelectReservedProductsDialog: React.FC<{
    openModal: boolean;
    setOpenModal: (dat: boolean) => void;
    updateRecords: (dat: any) => void;
}> = ({ openModal, setOpenModal, updateRecords }) => {
    const { t } = useTranslation();
    const multiData = useSelector((state) => state.main.multiData);
    const [selectedRows, setSelectedRows] = useState<Dictionary>({});

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.product),
                accessor: "productcode",
                width: "auto",
            },
            {
                Header: t(langKeys.description),
                accessor: "productdescription",
                width: "auto",
            },
            {
                Header: t(langKeys.reservedquantity),
                accessor: "bookingquantity",
                width: "auto",
            },
            {
                Header: t(langKeys.ticketapplication),
                accessor: "ticketid",
                width: "auto",
            },
            {
                Header: t(langKeys.requestedby),
                accessor: "createby",
                width: "auto",
            },
            {
                Header: t(langKeys.applicationdate),
                accessor: "requestdate",
                width: "auto",
            },
        ],
        []
    );

    return (
        <DialogZyx open={openModal} title={t(langKeys.selectreservedproducts)} maxWidth="lg">
            <div className="row-zyx">
                <TableZyx
                    columns={columns}
                    data={multiData?.data?.[1]?.data || []}
                    useSelection={true}
                    selectionKey={selectionKey}
                    setSelectedRows={setSelectedRows}
                    initialSelectedRows={selectedRows}
                    filterGeneral={false}
                />
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "flex-end" }}>
                <Button
                    variant="contained"
                    type="button"
                    color="primary"
                    startIcon={<ClearIcon color="secondary" />}
                    style={{ backgroundColor: "#FB5F5F" }}
                    onClick={() => {
                        setOpenModal(false);
                    }}
                >
                    {t(langKeys.back)}
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    type="button"
                    onClick={() => {
                        const data = multiData?.data?.[1]?.data;
                        const dataTosend = data
                            .filter((item) => Object.keys(selectedRows).includes(item.inventorybookingid.toString()))
                            .map((item) => ({
                                ...item,
                                comment: "",
                                dispatchto: "",
                                fromlote: "",
                                fromshelf: "",
                                inventoryconsumptiondetailid: 0,
                                line: 0,
                                operation: "INSERT",
                                p_tableid: 0,
                                onlinecost: Number(item.bookingquantity) * Number(item.costunit),
                                realdate: null,
                                status: "ACTIVO",
                                type: "NINGUNO",
                                description: item.productdescription,
                                quantity: Number(item.bookingquantity),
                                unitcost: Number(item.costunit),
                                productid: Number(item.productparentid),
                                ticketnumber: item.ticketid,
                                transactiontype: "DESPACHO",
                            }));
                        updateRecords((p: Dictionary[]) => [...p, ...dataTosend]);
                        setOpenModal(false);
                        setSelectedRows({});
                    }}
                    startIcon={<SaveIcon color="secondary" />}
                    style={{ backgroundColor: "#55BD84" }}
                >
                    {t(langKeys.save)}
                </Button>
            </div>
        </DialogZyx>
    );
};

export default SelectReservedProductsDialog;
