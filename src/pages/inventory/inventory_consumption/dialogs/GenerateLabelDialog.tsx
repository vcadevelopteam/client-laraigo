import { Button } from "@material-ui/core";
import { DialogZyx } from "components";
import { langKeys } from "lang/keys";
import React, { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import GetAppIcon from "@material-ui/icons/GetApp";
import { useTranslation } from "react-i18next";
import Barcode from "react-barcode";
import { useSelector } from "hooks";
import { Dictionary } from "@types";
import { useDispatch } from "react-redux";
import { getCollection } from "store/main/actions";
import { formatDate, generateLabelSel } from "common/helpers";
import DomToImage from "dom-to-image";
import { showBackdrop } from "store/popus/actions";

const GenerateLabelDialog: React.FC<{
    openModal: boolean;
    row: Dictionary | null;
    setOpenModal: (dat: boolean) => void;
}> = ({ openModal, setOpenModal, row }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [data, setData] = useState<Dictionary[]>([]);
    const mainData = useSelector((state) => state.main.mainData);
    const el = React.useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        if (openModal) {
            dispatch(getCollection(generateLabelSel(row?.inventoryconsumptionid || 0)));
        } else {
            setData([]);
        }
    }, [openModal]);

    useEffect(() => {
        if (!mainData?.loading && !mainData?.error) {
            if (mainData?.key === "UFN_GENERATE_LABEL_SEL") {
                setData(mainData?.data || []);
            }
        }
    }, [mainData]);

    const downloadGeneratedLabel = () => {
        dispatch(showBackdrop(true));
        import("jspdf").then((jsPDF) => {
            if (el.current) {
                const gg = document.createElement("div");
                gg.style.display = "flex";
                gg.style.border = "1px solid black";
                gg.style.flexDirection = "column";
                gg.style.margin = "8px";
                gg.style.width = "190mm";
                gg.id = "newexportcontainer";

                gg.innerHTML = el.current.innerHTML;

                document.body.appendChild(gg);
                const pdf = new jsPDF.jsPDF("l", "mm");
                if (pdf) {
                    DomToImage.toPng(gg).then((imgData) => {
                        const imgWidth = 200;
                        const pageHeight = 297;
                        const imgHeight = Math.ceil(gg.scrollHeight * 0.2645833333);
                        let heightLeft = imgHeight;
                        const doc = new jsPDF.jsPDF("l", "mm");
                        const topPadding = 10;
                        let position = topPadding;

                        doc.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
                        heightLeft -= pageHeight;

                        while (heightLeft >= 0) {
                            position = heightLeft - imgHeight + topPadding;
                            doc.addPage();
                            doc.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
                            heightLeft -= pageHeight;
                        }
                        doc.save(`label${data?.[0]?.businessname}.pdf`);
                        document.getElementById("newexportcontainer")?.remove();
                    });
                }
            }
        });
        dispatch(showBackdrop(false));
        setOpenModal(false);
    };

    return (
        <DialogZyx open={openModal} title={t(langKeys.generatelabel)} maxWidth="md">
            <div style={{ fontSize: "1rem", width: "100%", border: "1px solid black", marginBottom: "10px" }} ref={el}>
                <div style={{ padding: "5px", fontSize: "1.5rem", borderBottom: "1px solid black" }}>
                    {data?.[0]?.businessname}
                </div>
                <div style={{ display: "flex", borderBottom: "1px solid black" }}>
                    <div style={{ width: "50%", padding: "5px", borderRight: "1px solid black" }}>
                        <div style={{ fontWeight: "bold" }}>{t(langKeys.batch)}</div>
                        <div>{data?.[0]?.lote}</div>
                    </div>
                    <div style={{ width: "50%", padding: "5px" }}>
                        <div style={{ fontWeight: "bold" }}>Fecha mov. Inventario:</div>
                        <div style={{ textAlign: "center" }}>{formatDate(data?.[0]?.movementdate)}</div>
                    </div>
                </div>
                <div style={{ display: "flex", borderBottom: "1px solid black" }}>
                    <div style={{ width: "50%", padding: "5px", borderRight: "1px solid black" }}>
                        <div style={{ fontWeight: "bold" }}>{t(langKeys.product)}</div>
                        <div>{data?.[0]?.productcode}</div>
                    </div>
                    <div style={{ display: "flex", width: "50%" }}>
                        <div style={{ width: "50%", padding: "5px", borderRight: "1px solid black" }}>
                            <div style={{ fontWeight: "bold" }}>{t(langKeys.quantity)}</div>
                            <div style={{ textAlign: "center" }}>{data?.[0]?.quantity}</div>
                        </div>
                        <div style={{ width: "50%", padding: "5px" }}>
                            <div style={{ fontWeight: "bold" }}>{t(langKeys.dispatch_unit)}</div>
                            <div style={{ textAlign: "center" }}>{data?.[0]?.unitdispatchname}</div>
                        </div>
                    </div>
                </div>
                <div style={{ width: "100%", padding: "5px" }}>
                    <div style={{ fontWeight: "bold" }}>{t(langKeys.description)}</div>
                    <div style={{ textAlign: "center", textTransform: "uppercase" }}>
                        {data?.[0]?.productdescription}
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        {Boolean(data.length) && <Barcode value={data?.[0]?.codebar + "a"} />}
                    </div>
                </div>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "flex-end" }}>
                <Button
                    variant="contained"
                    type="button"
                    color="primary"
                    startIcon={<GetAppIcon color="secondary" />}
                    style={{ backgroundColor: "#55bd84" }}
                    onClick={() => {
                        downloadGeneratedLabel();
                    }}
                >
                    {t(langKeys.download)}
                </Button>
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
        </DialogZyx>
    );
};

export default GenerateLabelDialog;
