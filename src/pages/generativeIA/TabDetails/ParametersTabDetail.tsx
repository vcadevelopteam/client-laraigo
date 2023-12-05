import React, { useState, useEffect } from "react";
import { Dictionary } from "@types";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { FieldErrors, UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { FieldEdit, FieldSelect, TitleDetail } from "components";
import { useSelector } from "hooks";
import { showSnackbar, showBackdrop } from "store/popus/actions";
import { useDispatch } from "react-redux";
import { Box, Card, Grid } from "@material-ui/core";
import { SynonimsRasaLogo } from "icons";

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: "#fff",
    },
    title: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: theme.palette.text.primary,
    },
    container: {
        width: '100%',
        color: "#2e2c34",
    },       
    containerHeader: {      
        marginTop: '1rem',      
    },
    button: {
        display: "flex",
        gap: "10px",
        alignItems: "center",
    },
    tabs: {
        color: "#989898",
        backgroundColor: "white",
    },
    titleandbuttons: {
        display: "flex",
        justifyContent: "space-between",
    },
    formcontainer: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },
}));

interface InventoryTabDetailProps {
    row: Dictionary | null;
    setValue: UseFormSetValue<any>;
    getValues: UseFormGetValues<any>;
    errors: FieldErrors;
}

const ParametersTabDetail: React.FC<InventoryTabDetailProps> = ({ row, setValue, getValues, errors }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const executeResult = useSelector((state) => state.main.execute);
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const [waitExport, setWaitExport] = useState(false);
    const resExportData = useSelector((state) => state.main.exportData);
    const [waitUpload, setWaitUpload] = useState(false);
    const importRes = useSelector((state) => state.main.execute);

    useEffect(() => {
        if (waitUpload) {
            if (!importRes.loading && !importRes.error) {
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "success",
                        message: t(langKeys.successful_import),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitUpload(false);
            } else if (importRes.error) {
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "error",
                        message: t(importRes.code || "error_unexpected_error"),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitUpload(false);
            }
        }
    }, [importRes, waitUpload]);

    useEffect(() => {
        if (waitExport) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(showBackdrop(false));
                setWaitExport(false);
                resExportData.url?.split(",").forEach((x) => window.open(x, "_blank"));
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code || "error_unexpected_error", {
                    module: t(langKeys.person).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitExport(false);
            }
        }
    }, [resExportData, waitExport]);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "success",
                        message: t(langKeys.successful_delete),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);

    return (
        <div className={classes.containerDetail}>
            <div id="parameters">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '1rem' }}>
                        <Box className={classes.containerHeader}>
                            <span className={classes.title}>
                                {t(langKeys.personality)}
                            </span>
                        </Box>
                    </div>                    
                </div>

                <div className="row-zyx" style={{marginTop:"1.5rem", gap:"1.5rem"}}>
                    <Grid item xs={2} md={1} lg={2} style={{ minWidth: 330, display: 'flex'}}>
                        <Card style={{ position: 'relative', width: '100%', padding:"1rem" }}>
                            <div style={{ textAlign: 'center', alignContent: 'center' }}>
                                <div className='col-6' style={{ display: 'flex', justifyContent: 'center', alignItems:'center', width: "50%" }}>
                                    <SynonimsRasaLogo style={{ height: 220, width:"100%", justifyContent: 'center' }} />
                                </div>
                                <div style={{ fontWeight: 'bold', paddingBottom:'1rem' }}>{t(langKeys.help_desk_clerk)}</div>
                                <div  style={{ textAlign: 'left' }}>{t(langKeys.help_desk_clerk_description)}</div>
                            </div>
                        </Card>
                    </Grid>
                    <Grid item xs={2} md={1} lg={2} style={{ minWidth: 330, display: 'flex'}}>
                        <Card style={{ position: 'relative', width: '100%', padding:"1rem" }}>
                            <div style={{ textAlign: 'center', alignContent: 'center' }}>
                                <div className='col-6' style={{ display: 'flex', justifyContent: 'center', alignItems:'center', width: "50%" }}>
                                    <SynonimsRasaLogo style={{ height: 220, width:"100%", justifyContent: 'center' }} />
                                </div>
                                <div style={{ fontWeight: 'bold', paddingBottom:'1rem'  }}>{t(langKeys.customer_service)}</div>
                                <div  style={{ textAlign: 'left' }}>{t(langKeys.customer_service_description)}</div>
                            </div>
                        </Card>
                    </Grid>
                    <Grid item xs={2} md={1} lg={2} style={{ minWidth: 330, display: 'flex'}}>
                        <Card style={{ position: 'relative', width: '100%', padding:"1rem" }}>
                            <div style={{ textAlign: 'center', alignContent: 'center' }}>
                                <div className='col-6' style={{ display: 'flex', justifyContent: 'center', alignItems:'center', width: "50%" }}>
                                    <SynonimsRasaLogo style={{ height: 220, width:"100%", justifyContent: 'center' }} />
                                </div>
                                <div style={{ fontWeight: 'bold', paddingBottom:'1rem'  }}>{t(langKeys.sales_expert)}</div>
                                <div  style={{ textAlign: 'left' }}>{t(langKeys.sales_expert_description)}</div>
                            </div>
                        </Card>
                    </Grid>
                    <Grid item xs={2} md={1} lg={2} style={{ minWidth: 330, display: 'flex'}}>
                        <Card style={{ position: 'relative', width: '100%', padding:"1rem" }}>
                            <div style={{ textAlign: 'center', alignContent: 'center' }}>
                                <div className='col-6' style={{ display: 'flex', justifyContent: 'center', alignItems:'center', width: "50%" }}>
                                    <SynonimsRasaLogo style={{ height: 220, width:"100%", justifyContent: 'center' }} />
                                </div>
                                <div style={{ fontWeight: 'bold', paddingBottom:'1rem'  }}>{t(langKeys.technical_support)}</div>
                                <div  style={{ textAlign: 'left' }}>{t(langKeys.technical_support_description)}</div>
                            </div>
                        </Card>
                    </Grid>
                    <Grid item xs={2} md={1} lg={2} style={{ minWidth: 330, display: 'flex'}}>
                        <Card style={{ position: 'relative', width: '100%', padding:"1rem" }}>
                            <div style={{ textAlign: 'center', alignContent: 'center' }}>
                                <div className='col-6' style={{ display: 'flex', justifyContent: 'center', alignItems:'center', width: "50%" }}>
                                    <SynonimsRasaLogo style={{ height: 220, width:"100%", justifyContent: 'center' }} />
                                </div>
                                <div style={{ fontWeight: 'bold', paddingBottom:'1rem'  }}>{t(langKeys.ai_base)}</div>
                                <div  style={{ textAlign: 'left' }}>{t(langKeys.ai_base_description)}</div>
                            </div>
                        </Card>
                    </Grid>
                    <Grid item xs={2} md={1} lg={2} style={{ minWidth: 330, display: 'flex'}}>
                        <Card style={{ position: 'relative', width: '100%', padding:"1rem" }}>
                            <div style={{ textAlign: 'center', alignContent: 'center' }}>
                                <div className='col-6' style={{ display: 'flex', justifyContent: 'center', alignItems:'center', width: "50%" }}>
                                    <SynonimsRasaLogo style={{ height: 220, width:"100%", justifyContent: 'center' }} />
                                </div>
                                <div style={{ fontWeight: 'bold', paddingBottom:'1rem'  }}>{t(langKeys.custom_mode)}</div>
                                <div  style={{ textAlign: 'left' }}>{t(langKeys.custom_mode_description)}</div>
                            </div>
                        </Card>
                    </Grid>
                </div>
            </div>

        </div>
    );
};

export default ParametersTabDetail;
