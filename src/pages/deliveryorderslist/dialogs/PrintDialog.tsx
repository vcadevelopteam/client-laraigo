import { Button, makeStyles } from "@material-ui/core";
import { DialogZyx } from "components";
import { langKeys } from "lang/keys";
import React, { useRef } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import GetAppIcon from '@material-ui/icons/GetApp';

const useStyles = makeStyles(() => ({
    buttonspace: {
        display: "flex",
        gap: "10px",
        alignItems: "center",
        justifyContent: "end",
        marginBottom: 10,
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
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const handlePrint = () => {
        window.open(`https://docs.google.com/viewerng/viewer?url=${pdfRender}`, "_blank")
    };

    return (
        <DialogZyx open={openModal} title="" maxWidth="md">
            <div className={classes.buttonspace}>
                <Button
                    variant="contained"
                    color="primary"
                    type="button"
                    startIcon={<GetAppIcon color="secondary"/>}
                    style={{ backgroundColor: "#55BD84" }}
                    onClick={() => window.open(pdfRender, "_blank")}
                >
                    {t(langKeys.download)}
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    type="button"
                    onClick={handlePrint}
                >
                    {t(langKeys.print)}
                </Button>
                <Button
                    variant="contained"
                    type="button"
                    color="primary"
                    startIcon={<ClearIcon color="secondary"/>}
                    style={{ backgroundColor: "#FB5F5F" }}
                    onClick={() => {
                        setOpenModal(false);
                        setPdfRender('')
                    }}
                >
                    {t(langKeys.back)}
                </Button>
            </div>
            <iframe ref={iframeRef} title="Document Viewer" src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdfRender)}&embedded=true`} width="100%" height="750" />
        </DialogZyx>
    );
};

export default PrintDialog;
