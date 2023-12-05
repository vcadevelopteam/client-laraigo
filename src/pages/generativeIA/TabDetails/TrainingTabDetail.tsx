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
import { Box, Button, Card, Grid } from "@material-ui/core";
import { SynonimsRasaLogo } from "icons";
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import TableZyx from "components/fields/table-simple";

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: "#fff",
    },
    containerHeader: {      
        marginTop: '1rem',      
    },
    title: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: theme.palette.text.primary,
    },
}));

interface InventoryTabDetailProps {
    row: Dictionary | null;
    setValue: UseFormSetValue<any>;
    getValues: UseFormGetValues<any>;
    errors: FieldErrors;
}

const TrainingTabDetail: React.FC<InventoryTabDetailProps> = ({ row, setValue, getValues, errors }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const executeResult = useSelector((state) => state.main.execute);
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const [waitExport, setWaitExport] = useState(false);
    const resExportData = useSelector((state) => state.main.exportData);
    const [waitUpload, setWaitUpload] = useState(false);
    const importRes = useSelector((state) => state.main.execute);

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.name),
                accessor: 'name',
                width: "auto",
            },
            {
                Header: t(langKeys.upload),
                accessor: 'upload',
                width: "auto",
            },           
            {
                Header: t(langKeys.last_trainning),
                accessor: 'last_trainning',
                width: "auto",
            },         
        ],
        []
    );

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
            <div className="row-zyx" style={{marginTop:"1.5rem"}}>

            
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ justifyContent: 'flex-start', gap: '1rem' }}>
                        <Box className={classes.containerHeader}>
                            <span className={classes.title}>
                                {t(langKeys.knowledge_base)}
                            </span>                               
                        </Box>
                        <Box className={classes.containerHeader}>                               
                            <span>
                                {t(langKeys.knowledge_based_description)}
                            </span>
                        </Box>
                    </div>                    
                </div>

                <div className="row-zyx" style={{marginTop:"1.5rem", gap:"1.5rem", alignItems: 'center'}}>
                    <Grid item xs={2} md={1} lg={2} style={{ minWidth: 330, display: 'flex'}}>
                        <Card style={{ position: 'relative', width: '100%', padding:"1rem" }}>
                            <div style={{ textAlign: 'center', alignContent: 'center' }}>
                                <div className='col-6' style={{ display: 'flex', justifyContent: 'center', alignItems:'center', width: "50%" }}>
                                    <SynonimsRasaLogo style={{ height: 220, width:"100%", justifyContent: 'center' }} />
                                </div>
                                <div style={{ fontWeight: 'bold', paddingBottom:'1rem' }}>{t(langKeys.upload_document)}</div>
                                <div  style={{ textAlign: 'left' }}>{t(langKeys.upload_document_description)}</div>
                            </div>
                        </Card>
                    </Grid>
                    <Grid item xs={2} md={1} lg={2} style={{ minWidth: 330, display: 'flex'}}>
                        <Card style={{ position: 'relative', width: '100%', padding:"1rem" }}>
                            <div style={{ textAlign: 'center', alignContent: 'center' }}>
                                <div className='col-6' style={{ display: 'flex', justifyContent: 'center', alignItems:'center', width: "50%" }}>
                                    <SynonimsRasaLogo style={{ height: 220, width:"100%", justifyContent: 'center' }} />
                                </div>
                                <div style={{ fontWeight: 'bold', paddingBottom:'1rem'  }}>{t(langKeys.import_web_page)}</div>
                                <div  style={{ textAlign: 'left' }}>{t(langKeys.import_web_page_description)}</div>
                            </div>
                        </Card>
                    </Grid>
                   
                </div>

                <div style={{ display: 'block', justifyContent: 'space-between', alignItems: 'center', marginTop:'3rem' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <Button
                            variant="contained"
                            type="button"
                            startIcon={<DeleteIcon color="primary" />}
                            style={{ backgroundColor: '#ffff', color: '#7721AD' }}
                        >
                            {t(langKeys.delete)}
                        </Button>

                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<RefreshIcon color="primary" />}
                            style={{ backgroundColor: '#ffff', color: '#7721AD' }}
                        >
                            {t(langKeys.train)}
                        </Button>
                    </div>

                    <div style={{ justifyContent: 'flex-start', gap: '1rem' }}>
                        <Box className={classes.containerHeader}>
                            <span className={classes.title}>
                                {t(langKeys.saved_documents)}
                            </span>
                        </Box>
                        <Box className={classes.containerHeader}>
                            <span >
                                {t(langKeys.saved_documents_description)}
                            </span>
                        </Box>
                    </div>
                    
                </div>

                <div style={{marginTop:'2rem'}}>
                    <TableZyx
                        columns={columns}
                        data={[]}
                        filterGeneral={false}
                        useSelection={true}
                    />
                </div>

                
               
                           
        
            </div>
          
        </div>
    );
};

export default TrainingTabDetail;
