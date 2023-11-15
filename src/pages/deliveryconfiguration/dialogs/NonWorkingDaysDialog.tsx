import { Button } from "@material-ui/core";
import { DialogZyx } from "components";
import { langKeys } from "lang/keys";
import React, { useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import TableZyx from "components/fields/table-simple";
import InsertNonWorkingDaysDialog from "./InsertNonWorkingDaysDialog";

const NonWorkingDaysDialog: React.FC<{
    openModal: boolean;
    setOpenModal: (dat: boolean) => void;
}> = ({ openModal, setOpenModal }) => {
    const { t } = useTranslation();
    const [openModalInsertNonWorkingDays, setOpenModalInsertNonWorkingDays] = useState(false);

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.nonworkingdays) + " " + t(langKeys.selected_plural),
                accessor: "deliverynumber",
                width: "auto",
            },
        ],
        []
    );

    return (
        <DialogZyx open={openModal} title={t(langKeys.nonworkingdaysregister)} maxWidth="md">
            <div className="row-zyx">
                <div>
                    <TableZyx
                        columns={columns}
                        data={[]}
                        filterGeneral={false}
                        toolsFooter={false}
                        register={true}
                        handleRegister={setOpenModalInsertNonWorkingDays}
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
                                    {t(langKeys.back)}
                                </Button>
                            </div>
                        )}
                    />
                </div>
            </div>

            <InsertNonWorkingDaysDialog
                openModal={openModalInsertNonWorkingDays}
                setOpenModal={setOpenModalInsertNonWorkingDays}
            />
        </DialogZyx>
    );
};

export default NonWorkingDaysDialog;
