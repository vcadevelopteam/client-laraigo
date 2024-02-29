import { Button, makeStyles } from "@material-ui/core";
import { DialogZyx } from "components";
import { langKeys } from "lang/keys";
import React from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
    buttonspace: {
        display: "flex",
        gap: "10px",
        alignItems: "center",
        justifyContent: "end",
    },
    button: {
        marginRight: theme.spacing(2),
        justifyContent: "center",
        margin: "0rem 8rem 1rem 9rem",
    },
}));

const PrintDialog: React.FC<{
    openModal: boolean;
    setOpenModal: (dat: boolean) => void;
}> = ({ openModal, setOpenModal }) => {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <DialogZyx open={openModal} title="" maxWidth="sm">
            <div className={classes.buttonspace}>
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
            <img
                style={{ textAlign: "center" }}
                src="https://www.invoiceowl.com/wp-content/uploads/2023/02/freight-invoice-banner-template.svg"
                alt="Invoice"
            ></img>

            <div className="row-zyx">
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    type="button"
                    style={{ backgroundColor: "#55BD84" }}
                >
                    {t(langKeys.print)}
                </Button>
            </div>
        </DialogZyx>
    );
};

export default PrintDialog;
