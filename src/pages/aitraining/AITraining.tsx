import React, { useEffect, useState } from 'react'; 
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { resetAllMain } from 'store/main/actions';
import { showSnackbar, showBackdrop } from 'store/popus/actions';
import {Box, Card, Grid } from '@material-ui/core';
import { AIGenerative, AIBussiness } from 'icons';
import GenerativeAIMainView from '../generativeIA/GenerativeAIMainView';
import WitIA from './corporateai/WITIA';
import RasaIA from './corporateai/RASA';
import CorporateIA from './corporateai/CorporateAI';
import WatsonX from './corporateai/WATSONX';

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
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
        display: 'block',
        marginBottom: 0,
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        },
    },
    containerDetails: {
        marginTop: theme.spacing(3)
    },   
    containerInner:{
        display:"flex",
        padding:15
    },
    containerInnertittle1:{
        width: "100%",
        textTransform: "uppercase",
        fontSize: "1.1em",
        padding: "7px 0",
    },
    containerInnertittle2:{
        width: "100%",
        fontSize: "1.5em",
        fontWeight: "bold",
        padding: "7px 0",
    },
    containerInnertittle3:{
        width: "100%",
        fontSize: "1.2em",
        padding: "7px 0",
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial',
        marginTop: 5
    },
}));

const AITraining: React.FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [viewSelectedTraining, setViewSelectedTraining] = useState("view-1");
    const executeResult = useSelector(state => state.main.execute);
    const classes = useStyles();

    const arrayBread = [
        { id: "view-1", name: t(langKeys.training) }
    ];
    const [waitSave, setWaitSave] = useState(false);

    
    const functionChange = (change:string) => {
        if(change==="view-0"){
            //empty
        }else{
            setViewSelectedTraining(change);
        }
    }

    useEffect(() => {
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.corporation_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    if (viewSelectedTraining === "view-1") {
        return (
            <div style={{ width: "100%" }}>
                <div className={classes.container}>
                    <Box className={classes.containerHeader} justifyContent="space-between" alignItems="center" style={{ marginBottom: 8 }}>
                        <span className={classes.title}>
                            {t(langKeys.training)}
                        </span>
                    </Box>
                    <div className={classes.containerDetails}>                        
                        <Grid container spacing={3} >
                            <Grid item xs={12} md={6} lg={4} style={{ minWidth: 330 }}>
                                <Card style={{ position: 'relative', display:"flex" }}>
                                    <div className={classes.containerInner}>

                                        <div className="col-6" style={{width: "50%", display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                                            <div>
                                                <div className={classes.containerInnertittle1}>{t(langKeys.ia)}</div>
                                                <div className={classes.containerInnertittle2}>{t(langKeys.corporate)}</div>
                                                <div className={classes.containerInnertittle3}>{t(langKeys.trainingwithaidescription)}</div>
                                            </div>
                                            <Button
                                                className={classes.button}
                                                variant="contained"
                                                color="primary"
                                                style={{ backgroundColor: "#55BD84", width: "fit-content" }}
                                                onClick={()=>setViewSelectedTraining("corporateia")}
                                            >{t(langKeys.enter)}
                                            </Button>
                                        </div>
                                        
                                        <div className='col-6' style={{ display: 'flex', justifyContent: 'center', width: "50%" }}>
                                            <AIBussiness style={{ height: 220, width:"100%" }} />
                                        </div>
                                    </div>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6} lg={4} style={{ minWidth: 330 }}>
                                <Card style={{ position: 'relative', display:"flex" }}>
                                    <div className={classes.containerInner}>

                                        <div className="col-6" style={{width: "50%", display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                                            <div>
                                                <div className={classes.containerInnertittle1}>{t(langKeys.ia)}</div>
                                                <div className={classes.containerInnertittle2}>{t(langKeys.generativeia)}</div>
                                                <div className={classes.containerInnertittle3}>{t(langKeys.generativeidescription)}</div>
                                            </div>
                                            <Button
                                                className={classes.button}
                                                variant="contained"
                                                color="primary"
                                                style={{ backgroundColor: "#55BD84", width: "fit-content" }}
                                                onClick={()=>setViewSelectedTraining("generativeia")}
                                            >{t(langKeys.enter)}
                                            </Button>
                                        </div>
                                        <div className='col-6' style={{ display: 'flex', justifyContent: 'center', width: "50%" }}>
                                            <AIGenerative style={{ height: 220, width:"100%" }} />
                                        </div>
                                    </div>
                                </Card>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </div>
        )
    }else if (viewSelectedTraining === "witia") {
        return <WitIA 
            setViewSelected={functionChange}
            arrayBread={arrayBread}
        />
    }else if (viewSelectedTraining === "rasaia") {
        return (
            <RasaIA 
            setViewSelected={functionChange}
            arrayBread={arrayBread}
            />
        )
    }else if (viewSelectedTraining === "watsonx") {
        return (
            <WatsonX 
                setViewSelected={functionChange}
                arrayBread={arrayBread}
            />
        )
    }else if (viewSelectedTraining === "generativeia") {
        return (
            <GenerativeAIMainView 
                setViewSelected={functionChange}
                arrayBread={arrayBread}
            />
        )
    }else if (viewSelectedTraining === "corporateia") {
        return (
            <CorporateIA
                setViewSelected={functionChange}
                arrayBread={arrayBread}
            />
        )
    } else
        return null;
}

export default AITraining;