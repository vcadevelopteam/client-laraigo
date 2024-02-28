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
    pdfRender: string;
    setPdfRender: (pdf: string) => void;
}> = ({ openModal, setOpenModal, pdfRender, setPdfRender }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    console.log(pdfRender)
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
                        setPdfRender('')
                    }}
                >
                    {t(langKeys.back)}
                </Button>
            </div>

            <iframe title="Document Viewer" src={pdfRender} width="100%" height="700" />

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
