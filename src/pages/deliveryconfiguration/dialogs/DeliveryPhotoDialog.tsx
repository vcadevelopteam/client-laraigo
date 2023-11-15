import React, { useEffect, useState } from "react";
import { Button, makeStyles, IconButton, Typography } from "@material-ui/core";
import { DialogZyx, FieldEdit } from "components";
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/Save";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles(() => ({
    button: {
        display: "flex",
        gap: "10px",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    titlespace: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    addbutton: {
        backgroundColor: "#55BD84",
        margin: "1rem 0 ",
    },
}));

const DeliveryPhotoDialog = ({
    openModal,
    setOpenModal,
}: {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector((state) => state.main.execute);

    const [photoCount, setPhotoCount] = useState(1);
    const [savedPhotoCount, setSavedPhotoCount] = useState(1);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "success",
                        message: t(langKeys.successful_register),
                    })
                );
                dispatch(showBackdrop(false));
                setOpenModal(false);
                setWaitSave(false);
            } else if (executeRes.error) {
                const errorMessage = t(executeRes.code ?? "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errorMessage }));
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave]);

    const handleModalClose = () => {
        if (!waitSave) {
            setPhotoCount(savedPhotoCount);
            setOpenModal(false);
        }
    };

    const handleSave = () => {
        setSavedPhotoCount(photoCount);
        setWaitSave(true);
    };

    const handleDeleteField = () => {
        setPhotoCount((prevCount) => prevCount - 1);
    };

    return (
        <DialogZyx open={openModal} title={t(langKeys.deliveryphotoorder)} maxWidth="sm">
            <div className="row-zyx" style={{ gap: "1rem" }}>
                {Array.from({ length: photoCount }).map((_, index) => (
                    <div key={index} className="field-edit-container">
                        <div className={classes.titlespace}>
                            <div>
                                <Typography>{t(langKeys.photo) + " " + (index + 1)}</Typography>
                            </div>
                            <div>
                                <IconButton onClick={() => handleDeleteField()} className="delete-button">
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        </div>
                        <FieldEdit type="text" className="col-12" />
                    </div>
                ))}

                <Button
                    className={classes.addbutton}
                    variant="contained"
                    type="button"
                    color="primary"
                    startIcon={<AddIcon color="secondary" />}
                    onClick={() => {
                        setPhotoCount((prevCount) => prevCount + 1);
                    }}
                >
                    {t(langKeys.add) + " " + t(langKeys.deliveryphotoorder)}
                </Button>
            </div>

            <div className={classes.button}>
                <Button
                    variant="contained"
                    type="button"
                    color="primary"
                    startIcon={<ClearIcon color="secondary" />}
                    style={{ backgroundColor: "#FB5F5F" }}
                    onClick={handleModalClose}
                >
                    {t(langKeys.back)}
                </Button>

                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    type="button"
                    startIcon={<SaveIcon color="secondary" />}
                    style={{ backgroundColor: "#55BD84" }}
                    onClick={handleSave}
                >
                    {t(langKeys.save)}
                </Button>
            </div>
        </DialogZyx>
    );
};

export default DeliveryPhotoDialog;
