import { Button } from "@material-ui/core";
import { DialogZyx } from "components";
import { langKeys } from "lang/keys";
import React, { useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import TableZyx from "components/fields/table-simple";
import InsertVehicleTypeDialog from "./InsertVehicleTypeDialog";

const VehicleTypeDialog: React.FC<{
    openModal: boolean;
    setOpenModal: (dat: boolean) => void;
}> = ({ openModal, setOpenModal }) => {
    const { t } = useTranslation();
    const [openModalInsertVehicleType, setOpenModalInsertVehicleType] = useState(false);

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.vehicle),
                accessor: "vehicle",
                width: "auto",
            },
            {
                Header: t(langKeys.insuredamount),
                accessor: "insuredamount",
                width: "auto",
            },
            {
                Header: t(langKeys.averagespeed),
                accessor: "averagespeed",
                width: "auto",
            },
            {
                Header: t(langKeys.capacity),
                accessor: "capacity",
                width: "auto",
            },
        ],
        []
    );

    return (
        <DialogZyx open={openModal} title={t(langKeys.vehicletype)} maxWidth="md">
            <div className="row-zyx">
                <div className="row-zyx">
                    <TableZyx
                        columns={columns}
                        data={[]}
                        filterGeneral={false}
                        toolsFooter={false}
                        register={true}
                        handleRegister={setOpenModalInsertVehicleType}
                        ButtonsElement={() => (
                            <div style={{ textAlign: "right" }}>
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
                                    {t(langKeys.close)}
                                </Button>
                            </div>
                        )}
                    />
                </div>
            </div>
            <InsertVehicleTypeDialog
                openModal={openModalInsertVehicleType}
                setOpenModal={setOpenModalInsertVehicleType}
            />
        </DialogZyx>
    );
};

export default VehicleTypeDialog;
