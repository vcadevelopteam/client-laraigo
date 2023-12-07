import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { useSelector } from "hooks";
import { showSnackbar, showBackdrop } from "store/popus/actions";
import { useDispatch } from "react-redux";
import { Button, Card, Grid } from "@material-ui/core";
import { SynonimsRasaLogo } from "icons";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { FieldEdit, FieldSelect } from "components";

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
    cardsContainer: {
        marginTop:"1.5rem",
        gap:"1.5rem"
    },
    card: {
        position: 'relative',
        width: '100%',
        padding:"1rem"
    },
    cardContent: {
        textAlign: 'center',
        alignContent: 'center'
    },
    logo: {
        height: 220,
        width:"100%",
        justifyContent: 'center'
    },
    cardTitle: {
        fontWeight: 'bold',
        paddingBottom:'1rem'
    },
    grid: {
        minWidth: 330,
        display: 'flex'
    },
    container2: {
        display: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
}));

const ParametersTabDetail: React.FC = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const executeResult = useSelector((state) => state.main.execute);
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const [waitExport, setWaitExport] = useState(false);
    const resExportData = useSelector((state) => state.main.exportData);
    const [waitUpload, setWaitUpload] = useState(false);
    const [viewSelected, setViewSelected] = useState('main');
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

    if(viewSelected === 'main') {
        return (
            <div className={classes.containerDetail}>
                <div id="parameters">
                    <span className={classes.title}>
                        {t(langKeys.personality)}
                    </span>
                    <div className={`row-zyx ${classes.cardsContainer}`} >
                        <Grid item xs={2} md={1} lg={2} className={classes.grid}>
                            <Card className={classes.card} onClick={() => setViewSelected('detail')}>
                                <div className={classes.cardContent}>
                                    <SynonimsRasaLogo className={classes.logo} />
                                    <div className={classes.cardTitle}>{t(langKeys.help_desk_clerk)}</div>
                                    <div  style={{ textAlign: 'left' }}>{t(langKeys.help_desk_clerk_description)}</div>
                                </div>
                            </Card>
                        </Grid>
                        <Grid item xs={2} md={1} lg={2} className={classes.grid}>
                            <Card className={classes.card}>
                                <div className={classes.cardContent}>
                                    <SynonimsRasaLogo className={classes.logo} />
                                    <div className={classes.cardTitle}>{t(langKeys.customer_service)}</div>
                                    <div  style={{ textAlign: 'left' }}>{t(langKeys.customer_service_description)}</div>
                                </div>
                            </Card>
                        </Grid>
                        <Grid item xs={2} md={1} lg={2} className={classes.grid}>
                            <Card className={classes.card}>
                                <div className={classes.cardContent}>
                                    <SynonimsRasaLogo className={classes.logo} />
                                    <div className={classes.cardTitle}>{t(langKeys.sales_expert)}</div>
                                    <div  style={{ textAlign: 'left' }}>{t(langKeys.sales_expert_description)}</div>
                                </div>
                            </Card>
                        </Grid>
                        <Grid item xs={2} md={1} lg={2} className={classes.grid}>
                            <Card className={classes.card}>
                                <div className={classes.cardContent}>
                                    <SynonimsRasaLogo className={classes.logo} />
                                    <div className={classes.cardTitle}>{t(langKeys.technical_support)}</div>
                                    <div  style={{ textAlign: 'left' }}>{t(langKeys.technical_support_description)}</div>
                                </div>
                            </Card>
                        </Grid>
                        <Grid item xs={2} md={1} lg={2} className={classes.grid}>
                            <Card className={classes.card}>
                                <div className={classes.cardContent}>
                                    <SynonimsRasaLogo className={classes.logo} />
                                    <div className={classes.cardTitle}>{t(langKeys.ai_base)}</div>
                                    <div  style={{ textAlign: 'left' }}>{t(langKeys.ai_base_description)}</div>
                                </div>
                            </Card>
                        </Grid>
                        <Grid item xs={2} md={1} lg={2} className={classes.grid}>
                            <Card className={classes.card}>
                                <div className={classes.cardContent}>
                                    <SynonimsRasaLogo className={classes.logo} />
                                    <div className={classes.cardTitle}>{t(langKeys.custom_mode)}</div>
                                    <div  style={{ textAlign: 'left' }}>{t(langKeys.custom_mode_description)}</div>
                                </div>
                            </Card>
                        </Grid>
                    </div>
                </div>
    
            </div>
        );
    } else if(viewSelected === 'detail') {
        return (
            <>
                <div className={classes.containerDetail}>
                    <div className="row-zyx" style={{marginBottom:0}}>
                        <div>
                            <Button
                                type="button"
                                style={{color: '#7721AD'}}
                                startIcon={<ArrowBackIcon />}
                                onClick={() => setViewSelected('main')}
                            >
                                {t(langKeys.personality)}
                            </Button>
                        </div>
                        <div style={{height:10}}/>
                        <span className={classes.title}>
                            {t(langKeys.reason_customerservice)}
                        </span>
                        <div style={{height: 10}}/>
                        <div className="col-4">
                            <span style={{fontWeight:'bold', fontSize: 18}}>{t(langKeys.language)}</span>
                            <div><span style={{fontSize: 16}}>{t(langKeys.language)}</span></div>
                            <FieldSelect
                                label={t(langKeys.language)}
                                data={[]}
                                optionValue={""}
                                optionDesc={""}
                            />
                        </div>
                        <div className="col-4">
                            <span style={{fontWeight:'bold', fontSize: 18}}>{t(langKeys.language)}</span>
                            <div><span style={{fontSize: 16}}>{t(langKeys.language)}</span></div>
                            <FieldSelect
                                label={t(langKeys.organization)}
                                data={[]}
                                optionValue={""}
                                optionDesc={""}
                            />
                        </div>
                        <div className="col-4">
                            <span style={{fontWeight:'bold', fontSize: 18}}>{t(langKeys.language)}</span>
                            <div><span style={{fontSize: 16}}>{t(langKeys.language)}</span></div>
                            <FieldSelect
                                label={t(langKeys.language)}
                                data={[]}
                                optionValue={""}
                                optionDesc={""}
                            />
                        </div>
                        <div style={{height: 20}}/>
                        <div>
                            <span style={{fontWeight:'bold', fontSize: 18}}>{t(langKeys.answeredmessages)}</span>
                            <div><span style={{fontSize: 16}}>{t(langKeys.language)}</span></div>
                            <FieldEdit
                                variant="outlined"
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    } else return null;
};

export default ParametersTabDetail;
