import { Button, makeStyles } from "@material-ui/core";
import { DialogZyx } from "components";
import { langKeys } from "lang/keys";
import React, { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import TableZyx from "components/fields/table-simple";
import InsertNonWorkingDaysDialog from "./InsertNonWorkingDaysDialog";

const useStyles = makeStyles(() => ({
    button: {
        display: "flex", 
        gap: "10px", 
        alignItems: "center", 
        justifyContent: "end" 
    },
}));

const NonWorkingDaysDialog: React.FC<{
    openModal: boolean;
    setOpenModal: (dat: boolean) => void;
}> = ({ openModal, setOpenModal }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector((state) => state.main.execute);
    const [openModalInsertNonWorkingDays, setOpenModalInsertNonWorkingDays] = useState(false);


    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "success",
                        message: t(row ? langKeys.successful_edit : langKeys.successful_register),
                    })
                );
                dispatch(showBackdrop(false));
                setOpenModal(false);
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code ?? "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave]);

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
                            <div style={{ textAlign: 'right'}}>            
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
