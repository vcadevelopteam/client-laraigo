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
import { Dictionary } from "@types";
import { FieldErrors } from "react-hook-form";

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: "#fff",
    },
    containerDetail2: {
        padding: theme.spacing(2),
        background: "#F9F9FA",
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
        padding:"1rem",
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        '&:hover': {
            backgroundColor: '#D2DBE4',
        },
    },
    cardContent: {
        textAlign: 'center',
        alignContent: 'center'
    },
    logo: {
        height: 100,
        width:"100%",
        justifyContent: 'center'
    },
    cardTitle: {
        fontWeight: 'bold',
        paddingBottom:'1rem'
    },
    grid: {
        minWidth: 300,
        display: 'flex'
    },
    container2: {
        display: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    selectedCard: {
        backgroundColor: '#EBF4FD',
        border: '1px solid #7721AD'
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        margin: '1rem',
        cursor: 'pointer',
        color: '#7721AD'
    },
    cardText: {
        textAlign: 'left',
        marginBottom:30
    },
    detailTitle: {
        fontWeight:'bold',
        fontSize: 18
    },
}));

interface ParametersTabDetailProps {
    row: Dictionary | null
    setValue: any
    getValues: any,
    errors: FieldErrors
}

const ParametersTabDetail: React.FC<ParametersTabDetailProps> = ({
    row,
    setValue,
    getValues,
    errors
}) => {
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
    const [selectedCard, setSelectedCard] = useState<number | null>(null);
    const multiDataAux = useSelector(state => state.main.multiDataAux);
    const [unansweredQueries, setUnansweredQueries] = useState<string | null>(null);

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

    const handleCardClick = (cardIndex: number) => {
        if (selectedCard === cardIndex) {
          setSelectedCard(null);
        } else {
          setSelectedCard(cardIndex);
        }
      };
    
    const isCardSelected = (cardIndex: number) => {
        return selectedCard === cardIndex;
    };

    console.log(unansweredQueries)

    if(viewSelected === 'main') {
        return (
            <div className={classes.containerDetail}>
                <div id="parameters">
                    <span className={classes.title}>
                        {t(langKeys.personality)}
                    </span>
                    <div><span style={{fontSize: 16}}>{t(langKeys.selectpersonality)}</span></div>
                    <div className={`row-zyx ${classes.cardsContainer}`} >
                        <Grid item xs={2} md={1} lg={2} className={classes.grid}>
                            <Card className={`${classes.card} ${isCardSelected(0) ? classes.selectedCard : ''}`} onClick={() => handleCardClick(0)}>
                                <div className={classes.cardContent}>
                                    <SynonimsRasaLogo className={classes.logo} />
                                    <div className={classes.cardTitle}>{t(langKeys.help_desk_clerk)}</div>
                                    <div className={classes.cardText}>{t(langKeys.help_desk_clerk_description)}</div>
                                    <div className={classes.footer} onClick={() => setViewSelected('detail')}>{t(langKeys.seeMore)}</div>
                                </div>
                            </Card>
                        </Grid>
                        <Grid item xs={2} md={1} lg={2} className={classes.grid}>
                            <Card className={`${classes.card} ${isCardSelected(1) ? classes.selectedCard : ''}`} onClick={() => handleCardClick(1)}>
                                <div className={classes.cardContent}>
                                    <SynonimsRasaLogo className={classes.logo} />
                                    <div className={classes.cardTitle}>{t(langKeys.customer_service)}</div>
                                    <div className={classes.cardText}>{t(langKeys.customer_service_description)}</div>
                                    <div className={classes.footer} onClick={() => setViewSelected('detail')}>{t(langKeys.seeMore)}</div>
                                </div>
                            </Card>
                        </Grid>
                        <Grid item xs={2} md={1} lg={2} className={classes.grid}>
                            <Card className={`${classes.card} ${isCardSelected(2) ? classes.selectedCard : ''}`} onClick={() => handleCardClick(2)}>
                                <div className={classes.cardContent}>
                                    <SynonimsRasaLogo className={classes.logo} />
                                    <div className={classes.cardTitle}>{t(langKeys.sales_expert)}</div>
                                    <div className={classes.cardText}>{t(langKeys.sales_expert_description)}</div>
                                    <div className={classes.footer} onClick={() => setViewSelected('detail')}>{t(langKeys.seeMore)}</div>
                                </div>
                            </Card>
                        </Grid>
                        <Grid item xs={2} md={1} lg={2} className={classes.grid}>
                            <Card className={`${classes.card} ${isCardSelected(3) ? classes.selectedCard : ''}`} onClick={() => handleCardClick(3)}>
                                <div className={classes.cardContent}>
                                    <SynonimsRasaLogo className={classes.logo} />
                                    <div className={classes.cardTitle}>{t(langKeys.technical_support)}</div>
                                    <div className={classes.cardText}>{t(langKeys.technical_support_description)}</div>
                                    <div className={classes.footer} onClick={() => setViewSelected('detail')}>{t(langKeys.seeMore)}</div>
                                </div>
                            </Card>
                        </Grid>
                        <Grid item xs={2} md={1} lg={2} className={classes.grid}>
                            <Card className={`${classes.card} ${isCardSelected(4) ? classes.selectedCard : ''}`} onClick={() => handleCardClick(4)}>
                                <div className={classes.cardContent}>
                                    <SynonimsRasaLogo className={classes.logo} />
                                    <div className={classes.cardTitle}>{t(langKeys.ai_base)}</div>
                                    <div className={classes.cardText}>{t(langKeys.ai_base_description)}</div>
                                    <div className={classes.footer} onClick={() => setViewSelected('detail')}>{t(langKeys.seeMore)}</div>
                                </div>
                            </Card>
                        </Grid>
                        <Grid item xs={2} md={1} lg={2} className={classes.grid}>
                            <Card className={`${classes.card} ${isCardSelected(6) ? classes.selectedCard : ''}`} onClick={() => handleCardClick(6)}>
                                <div className={classes.cardContent}>
                                    <SynonimsRasaLogo className={classes.logo} />
                                    <div className={classes.cardTitle}>{t(langKeys.custom_mode)}</div>
                                    <div className={classes.cardText}>{t(langKeys.custom_mode_description)}</div>
                                    <div className={classes.footer} onClick={() => setViewSelected('detail')}>{t(langKeys.seeMore)}</div>
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
                            <span className={classes.detailTitle}>{t(langKeys.language2)}</span>
                            <div style={{height:70}}><span style={{fontSize: 16}}>{t(langKeys.selectAILang)}</span></div>
                            <FieldSelect
                                label={t(langKeys.language)}
                                data={[]}
                                optionValue={""}
                                optionDesc={""}
                            />
                        </div>
                        <div className="col-4">
                            <span className={classes.detailTitle}>{t(langKeys.orgname)}</span>
                            <div style={{height:70}}><span style={{fontSize: 16}}>{t(langKeys.enterorgnametext)}</span></div>
                            <FieldEdit
                                label={t(langKeys.organization)}
                            />
                        </div>
                        <div className="col-4">
                            <span className={classes.detailTitle}>{t(langKeys.unansweredqueries)}</span>
                            <div style={{height:70}}><span style={{fontSize: 16}}>{t(langKeys.aireaction)}</span></div>
                            <FieldSelect
                                label={t(langKeys.queries)}
                                data={(multiDataAux?.data?.[1]?.data||[])}
                                onChange={(value) => {
                                    if(value?.domainvalue) {
                                        setUnansweredQueries(value.domainvalue)
                                    } else {
                                        setUnansweredQueries('')
                                    }
                                }}
                                optionValue="domainvalue"
                                optionDesc="domainvalue"
                            />
                        </div>
                        {unansweredQueries === 'Respuesta Sugerida' && (
                            <>
                                <div style={{height: 20}}/>
                                <div>
                                    <span className={classes.detailTitle}>{t(langKeys.dashboard_managerial_survey3_answervalue)}</span>
                                    <div style={{marginBottom:20}}><span style={{fontSize: 16}}>{t(langKeys.aianswer)}</span></div>
                                    <FieldEdit
                                        variant="outlined"
                                        InputProps={{
                                            multiline: true,
                                        }}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className={`row-zyx ${classes.containerDetail2}`}>
                    <div className="col-8" style={{paddingRight:50}}>
                        <span className={classes.detailTitle}>{t(langKeys.prompt)}</span>
                        <div style={{marginBottom:20}}><span style={{fontSize: 16}}>{t(langKeys.promptinstructions)}</span></div>
                        <FieldEdit
                            variant="outlined"
                            InputProps={{
                                multiline: true,
                            }}
                        />
                        <div style={{height: 20}}/>
                        <span className={classes.detailTitle}>{t(langKeys.negativeprompt)}</span>
                        <div style={{marginBottom:20}}><span style={{fontSize: 16}}>{t(langKeys.negativepromptinstructions)}</span></div>
                        <FieldEdit
                            variant="outlined"
                            InputProps={{
                                multiline: true,
                            }}
                        />
                    </div>
                    <div className="col-4">
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <span className={classes.detailTitle}>{t(langKeys.maxtokens)}</span>
                            <div style={{width:10}}/>
                            <FieldEdit
                                type="number"
                                variant="outlined"
                                size="small"
                                width={80}
                            />
                        </div>
                        <div style={{marginTop:15}}><span style={{fontSize: 16}}>{t(langKeys.maxtokensdesc)}</span></div>
                        <div style={{height: 20}}/>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <span className={classes.detailTitle}>{t(langKeys.temperature)}</span>
                            <div style={{width:10}}/>
                            <span>0 - 2.0</span>
                            <div style={{width:10}}/>
                            <FieldEdit
                                type="number"
                                variant="outlined"
                                size="small"
                                width={80}
                            />
                        </div>
                        <div style={{marginTop:15}}><span style={{fontSize: 16}}>{t(langKeys.temperaturedesc)}</span></div>
                        <div style={{height: 20}}/>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <span className={classes.detailTitle}>{t(langKeys.topp)}</span>
                            <div style={{width:10}}/>
                            <span>0 - 1.0</span>
                            <div style={{width:10}}/>
                            <FieldEdit
                                type="number"
                                variant="outlined"
                                size="small"
                                width={80}
                            />
                        </div>
                        <div style={{marginTop:15}}><span style={{fontSize: 16}}>{t(langKeys.toppdesc)}</span></div>
                    </div>
                </div>
            </>
        );
    } else return null;
};

export default ParametersTabDetail;
