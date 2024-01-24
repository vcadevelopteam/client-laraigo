import { Button, makeStyles } from "@material-ui/core";
import { DialogZyx, FieldEdit } from "components";
import { langKeys } from "lang/keys";
import React, { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import GetAppIcon from "@material-ui/icons/GetApp";
import { useTranslation } from "react-i18next";
import { useSelector } from "hooks";
import { Dictionary } from "@types";
import { useDispatch } from "react-redux";
import { getMultiCollectionAux2 } from "store/main/actions";
import { formatDate, generateguiaremisionSel, generateguiaremisiondetailSel, getStatusHistoryInventoryConsumption } from "common/helpers";
import DomToImage from "dom-to-image";
import { showBackdrop } from "store/popus/actions";


const useStyles = makeStyles(() => ({
    cells: {
        padding: 12,
        fontSize: '14px',
        border:"1px solid black"
    },
}));

const GenerateReferralGuideDialog: React.FC<{
    openModal: boolean;
    row: Dictionary | null;
    setOpenModal: (dat: boolean) => void;
}> = ({ openModal, setOpenModal, row }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [mainData, setMainData] = useState<Dictionary[]>([]);
    const [detailData, setDetailData] = useState<Dictionary[]>([]);
    const [dateFinish, setDateFinish] = useState("");
    const multiData = useSelector((state) => state.main.multiDataAux2);
    const el = React.useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        if (openModal) {
            dispatch(
                getMultiCollectionAux2([
                    generateguiaremisionSel(row?.inventoryconsumptionid || 0),
                    generateguiaremisiondetailSel(row?.inventoryconsumptionid || 0),
                ])
            );
        } else {
            setMainData([]);
            setDetailData([]);
        }
    }, [openModal]);

    useEffect(() => {
        if (!multiData?.loading && !multiData?.error && openModal) {
            setMainData(multiData.data[1].data);
            setDetailData(multiData.data[0].data);
        }
    }, [multiData]);

    const downloadGeneratedLabel = () => {
        dispatch(showBackdrop(true));
        import("jspdf").then((jsPDF) => {
            if (el.current) {
                const gg = document.createElement("div");
                gg.style.display = "flex";
                gg.style.flexDirection = "column";
                gg.style.width = "210mm";
                gg.id = "newexportcontainer";

                gg.innerHTML = el.current.innerHTML;

                document.body.appendChild(gg);
                const pdf = new jsPDF.jsPDF("l", "mm");
                if (pdf) {
                    DomToImage.toPng(gg).then((imgData) => {
                        const imgWidth = 270;
                        const pageHeight = 297;
                        const imgHeight = Math.ceil(gg.scrollHeight * 0.3645833333);
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
                        doc.save(`label${mainData?.[0]?.businessname}.pdf`);
                        document.getElementById("newexportcontainer")?.remove();
                    });
                }
            }
        });
        dispatch(showBackdrop(false));
        setOpenModal(false);
    };

    return (
        <DialogZyx open={openModal} title={t(langKeys.referralguide)} maxWidth="lg">
            <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.transferdate)}
                    valueDefault={dateFinish}
                    className="col-4"
                    type="date"
                    onChange={(value) => {setDateFinish(value)}}
                />
            </div>
            <div
                style={{ fontSize: "1rem", width: "100%", border: "1px solid black", marginBottom: "10px", padding: 15 }}
                ref={el}
            >
                <div style={{display:"flex"}}>
                    <div style={{width:"50%"}}>
                        <div style={{fontSize: "1.8rem"}}>{mainData?.[0]?.businessname}</div>
                        <div style={{display:"flex", gap:8}}>
                            <div style={{fontWeight:"bold"}}>Domicilio Fiscal: </div>
                            <div>{mainData?.[0]?.fiscaladdress}</div>
                        </div>
                        <div style={{display:"flex", gap:8}}>
                            <div style={{fontWeight:"bold"}}>Punto de origen: </div>
                            <div>{mainData?.[0]?.address}</div>
                        </div>
                        <div style={{display:"flex", gap:8}}>
                            <div style={{fontWeight:"bold"}}>Punto de destino: </div>
                            <div>{mainData?.[0]?.destinationaddress}</div>
                        </div>
                        <div style={{display:"flex", gap:8}}>
                            <div style={{fontWeight:"bold"}}>Fecha de traslado: </div>
                            <div>{dateFinish?formatDate(dateFinish, { withTime: false }):"dd/mm/yyyy"}</div>
                        </div>
                    </div>
                    <div style={{width:"50%", justifyContent:"end",display:"flex"}}>
                        <div style={{border: "1px solid black", fontSize:"1.1rem", textAlign:"center", padding:15,width:"50%"}}>
                            <div style={{textAlign:"center"}}>
                                <b>RUC:</b> {mainData?.[0]?.docnum}
                            </div>
                            <div style={{fontWeight:"bold"}}>GUIA REMISIÓN REMITENTE</div>
                            <div>{mainData?.[0]?.serie}-{mainData?.[0]?.sequence}</div>
                        </div>
                    </div>
                </div>
                <div style={{margin: "20px 0"}}>
                    <table style={{textAlign:"center", width: "100%", borderCollapse: "collapse"}}>
                        <tr style={{fontWeight:"bold"}}>
                            <th className={classes.cells}>N°</th>
                            <th className={classes.cells}>{t(langKeys.product)}</th>
                            <th className={classes.cells}>Descripción del Producto</th>
                            <th className={classes.cells}>{t(langKeys.quantity)}</th>
                        </tr>
                        {detailData.map((x,i)=>{
                            return <tr key={i}>
                                <td className={classes.cells}>{i}</td>
                                <td className={classes.cells}>{x.productcode}</td>
                                <td className={classes.cells}>{x.description}</td>
                                <td className={classes.cells}>{x.quantity}</td>
                            </tr>
                        })}
                    </table>
                </div>
                <div style={{display:"flex", justifyContent:"space-around", marginTop:80, marginBottom:15}}>
                    <div style={{borderTop:"2px solid black", fontWeight:"bold"}}>Firma de responsable despacho</div>
                    <div style={{borderTop:"2px solid black", fontWeight:"bold"}}>Firma de responsable transporte</div>
                </div>
                <div style={{marginLeft:"12%", gap: 15}}>
                    <div style={{fontWeight:"bold"}}>Responsable de Despacho:</div>
                    <div style={{fontWeight:"bold"}}>Responsable de Transporte:</div>
                </div>
                <div style={{textAlign:"end"}}><b>Fecha de impresión: </b>{formatDate(mainData?.[0]?.printdate, { withTime: false })}</div>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "flex-end" }}>
                <Button
                    variant="contained"
                    type="button"
                    color="primary"
                    startIcon={<GetAppIcon color="secondary" />}
                    style={{ backgroundColor: "#55bd84" }}
                    disabled={!dateFinish}
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

export default GenerateReferralGuideDialog;
