import { Button } from "@material-ui/core";
import { DialogZyx, TemplateIcons } from "components";
import { langKeys } from "lang/keys";
import React, { useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import TableZyx from "components/fields/table-simple";
import InsertDeliverySchedulesDialog from "./InsertDeliverySchedulesDialog";
import { CellProps } from "react-table";
import { Dictionary } from "@types";

interface DeliveryShift {
    shift: string;
    startTime: string;
    endTime: string;
}

interface RowSelected {
    row2: Dictionary | null;
    edit: boolean;
}

const DeliverySchedulesDialog: React.FC<{
    openModal: boolean;
    setOpenModal: (dat: boolean) => void;
    setNewShift: (shift: DeliveryShift) => void;
    newShift: DeliveryShift;
    onMainSubmit: () => void;
    configjson: Dictionary;
	handleDelete: (shiftToDelete: Dictionary) => void;
}> = ({ openModal, setOpenModal, setNewShift, newShift, onMainSubmit, configjson, handleDelete }) => {
    const { t } = useTranslation();
    const [openModalInsertDeliverySchedules, setOpenModalInsertDeliverySchedules] = useState(false);
	const [selectedRow, setSelectedRow] = useState<RowSelected>({
        row2: null,
        edit: false,
    });

	function handleRegister() {
        setSelectedRow({row2: null, edit: false})
        setOpenModalInsertDeliverySchedules(true)
    }

    const handleEdit = (row2: Dictionary) => {
        setSelectedRow({ row2, edit: true });
        setOpenModalInsertDeliverySchedules(true);
    };

    const columns = React.useMemo(
        () => [
            {
                accessor: "id",
                NoFilter: true,
                disableGlobalFilter: true,
                isComponent: true,
                minWidth: 60,
                width: "1%",
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                        	deleteFunction={() => handleDelete(row)}
                        	editFunction={() => handleEdit(row)}
                        />
                    );
                },
            },
            {
                Header: t(langKeys.shifts),
                accessor: "shift",
                width: "auto",
            },
            {
                Header: t(langKeys.from),
                accessor: "startTime",
                width: "auto",
            },
            {
                Header: t(langKeys.until),
                accessor: "endTime",
                width: "auto",
            },
        ],
        []
    );

    return (
        <DialogZyx open={openModal} title={t(langKeys.deliveryshifts)} maxWidth="md">
            <div className="row-zyx">
                <div className="row-zyx">
                    <TableZyx
                        columns={columns}
                        data={configjson.deliveryShifts || []}
                        filterGeneral={false}
                        toolsFooter={false}
                        register={true}
						onClickRow={handleEdit}
                        handleRegister={handleRegister}
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
            <InsertDeliverySchedulesDialog
                openModal={openModalInsertDeliverySchedules}
                setOpenModal={setOpenModalInsertDeliverySchedules}
                setNewShift={setNewShift}
                newShift={newShift}
                onMainSubmit={onMainSubmit}
				data={selectedRow}
            />
        </DialogZyx>
    );
};

export default DeliverySchedulesDialog;
