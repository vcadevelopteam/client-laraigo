//TODO: en conectares hay un tipo preguntar de donde sale

import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateBreadcrumbs } from 'components';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { getCollectionAux, resetAllMain } from 'store/main/actions';
import { showSnackbar, showBackdrop } from 'store/popus/actions';
import {Box, Card, Grid } from '@material-ui/core';
import { EntrenamientoIALogo, IntencionesIALogo, EntidadesIALogo, SynonimsRasaLogo, ModelsRasaLogo, TestModelRasa } from 'icons';
import { Intentions } from './assistant/Intentions';
import { Entities } from './assistant/Entities';
import { IntentionsRasa } from './rasa/IntentionsRasa';
import { SynonimsRasa } from './rasa/SynonimsRasa';
import TestModelDialog from 'components/inbox/TestModelDialog';
import { rasaModelSel } from 'common/helpers';
import { ModelsRasa } from './rasa/ModelsRasa';

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
    mb2: {
        marginBottom: theme.spacing(4),
    },
    switches: {
        background: '#ccc3',
        marginRight: '10px',
        padding: '10px 10px 20px 10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        marginBottom: '4px'
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
    media: {
        objectFit: "contain"
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

const RasaIA: React.FC<{arrayBread: any, setViewSelected: (view: string) => void}> = ({ setViewSelected, arrayBread }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const [viewSelectedTraining, setViewSelectedTraining] = useState("view-1");
    const executeResult = useSelector(state => state.main.execute);
    const classes = useStyles();
    const [openModal, setOpenModal] = useState(false);    

    const newArrayBread = [
        ...arrayBread,
        { id: "rasaia", name:  "RASA IA" },
    ];
    // const [mainData, setMainData] = useState<any>([]);
    const [waitSave, setWaitSave] = useState(false);

    const fetchData = () => dispatch(getCollectionAux(rasaModelSel()))
    const functionChange = (change:string) => {
        if(change === "rasaia"){
            setViewSelectedTraining("view-1")
            fetchData()
        }else{
            setViewSelected(change);
        }
    }
    useEffect(() => {
        fetchData()
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

    useEffect(() => {
        // setMainData(mainResult.mainData.data.map(x => ({
        //     ...x,
        //     typedesc: (t(`type_corp_${x.type}`.toLowerCase()) || "").toUpperCase(),
        //     statusdesc: (t(`status_${x.status}`.toLowerCase()) || "").toUpperCase()
        // })))
    }, [mainResult.mainData.data])


    if (viewSelectedTraining === "view-1") {
        return (
            <div style={{ width: "100%" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TemplateBreadcrumbs
                        breadcrumbs={newArrayBread}
                        handleClick={functionChange}
                    />
                </div>
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

                                        <div className="col-6" style={{width: "50%"}}>
                                            <div className={classes.containerInnertittle1}>{t(langKeys.ia)}</div>
                                            <div className={classes.containerInnertittle2}>{t(langKeys.intentionsandentities)}</div>
                                            <div className={classes.containerInnertittle3}>{t(langKeys.intentionsandentitiesdescription)}</div>                                            
                                            <Button
                                                className={classes.button}
                                                variant="contained"
                                                color="primary"
                                                onClick={()=>setViewSelectedTraining("intentions")}
                                                style={{ backgroundColor: "#55BD84" }}
                                            >{t(langKeys.enter)}
                                            </Button>
                                        </div>
                                        
                                        <div className='col-6' style={{ display: 'flex', justifyContent: 'center', width: "50%" }}>
                                            <IntencionesIALogo style={{ height: 220, width:"100%" }} />
                                        </div>
                                    </div>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6} lg={4} style={{ minWidth: 330 }}>
                                <Card style={{ position: 'relative', display:"flex" }}>
                                    <div className={classes.containerInner}>

                                        <div className="col-6" style={{width: "50%"}}>
                                            <div className={classes.containerInnertittle1}>{t(langKeys.ia)}</div>
                                            <div className={classes.containerInnertittle2}>{t(langKeys.sinonims)}</div>
                                            <div className={classes.containerInnertittle3}>{t(langKeys.sinonimsdescription)}</div>                                            
                                            <Button
                                                className={classes.button}
                                                variant="contained"
                                                color="primary"
                                                style={{ backgroundColor: "#55BD84" }}
                                                onClick={()=>setViewSelectedTraining("sinonims")}
                                            >{t(langKeys.enter)}
                                            </Button>
                                        </div>
                                        
                                        <div className='col-6' style={{ display: 'flex', justifyContent: 'center', width: "50%" }}>
                                            <SynonimsRasaLogo style={{ height: 220, width:"100%" }} />
                                        </div>
                                    </div>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6} lg={4} style={{ minWidth: 330 }}>
                                <Card style={{ position: 'relative', display:"flex" }}>
                                    <div className={classes.containerInner}>

                                        <div className="col-6" style={{width: "50%"}}>
                                            <div className={classes.containerInnertittle1}>{t(langKeys.ia)}</div>
                                            <div className={classes.containerInnertittle2}>{t(langKeys.model_plural)}</div>
                                            <div className={classes.containerInnertittle3}>{t(langKeys.modeldescription)}</div>                                            
                                            <Button
                                                className={classes.button}
                                                variant="contained"
                                                color="primary"
                                                style={{ backgroundColor: "#55BD84" }}
                                                onClick={()=>setViewSelectedTraining("models")}
                                            >{t(langKeys.enter)}
                                            </Button>
                                        </div>
                                        
                                        <div className='col-6' style={{ display: 'flex', justifyContent: 'center', width: "50%" }}>
                                            <ModelsRasaLogo style={{ height: 220, width:"100%" }} />
                                        </div>
                                    </div>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6} lg={4} style={{ minWidth: 330 }}>
                                <Card style={{ position: 'relative', display:"flex" }}>
                                    <div className={classes.containerInner}>

                                        <div className="col-6" style={{width: "50%"}}>
                                            <div className={classes.containerInnertittle1}>{t(langKeys.ia)}</div>
                                            <div className={classes.containerInnertittle2}>{t(langKeys.testmodel)}</div>
                                            <div className={classes.containerInnertittle3}>{t(langKeys.testmodeldescription)}</div>                                            
                                            <Button
                                                className={classes.button}
                                                variant="contained"
                                                color="primary"
                                                style={{ backgroundColor: "#55BD84" }}
                                                onClick={()=>setOpenModal(true)}
                                            >{t(langKeys.enter)}
                                            </Button>
                                        </div>
                                        <TestModelDialog
                                            openModal={openModal}
                                            setOpenModal={setOpenModal}
                                        />
                                        
                                        <div className='col-6' style={{ display: 'flex', justifyContent: 'center', width: "50%" }}>
                                            <TestModelRasa style={{ height: 220, width:"100%" }} />
                                        </div>
                                    </div>
                                </Card>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </div>
        )
    }else if (viewSelectedTraining === "intentions") {
        return <IntentionsRasa 
            setExternalViewSelected={functionChange}
            arrayBread={newArrayBread}
        />
    }else if (viewSelectedTraining === "sinonims") {
        return (
            <SynonimsRasa 
            setExternalViewSelected={functionChange}
            arrayBread={newArrayBread}
            />
        )
    }else if (viewSelectedTraining === "models") {
        return (
            <ModelsRasa 
            setExternalViewSelected={functionChange}
            arrayBread={newArrayBread}
            />
        )
    } else
        return null;

}
const WitIA: React.FC<{arrayBread: any, setViewSelected: (view: string) => void}> = ({ setViewSelected, arrayBread }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const [viewSelectedTraining, setViewSelectedTraining] = useState("view-1");
    const executeResult = useSelector(state => state.main.execute);
    const classes = useStyles();

    const newArrayBread = [
        ...arrayBread,
        { id: "witia", name:  "WIT IA" },
    ];
    // const [mainData, setMainData] = useState<any>([]);
    const [waitSave, setWaitSave] = useState(false);

    
    const functionChange = (change:string) => {
        if(change === "witia"){
            setViewSelectedTraining("view-1")
        }else{
            setViewSelected(change);
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

    useEffect(() => {
        // setMainData(mainResult.mainData.data.map(x => ({
        //     ...x,
        //     typedesc: (t(`type_corp_${x.type}`.toLowerCase()) || "").toUpperCase(),
        //     statusdesc: (t(`status_${x.status}`.toLowerCase()) || "").toUpperCase()
        // })))
    }, [mainResult.mainData.data])


    if (viewSelectedTraining === "view-1") {
        return (
            <div style={{ width: "100%" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TemplateBreadcrumbs
                        breadcrumbs={newArrayBread}
                        handleClick={functionChange}
                    />
                </div>
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

                                        <div className="col-6" style={{width: "50%"}}>
                                            <div className={classes.containerInnertittle1}>{t(langKeys.ia)}</div>
                                            <div className={classes.containerInnertittle2}>{t(langKeys.intentions)}</div>
                                            <div className={classes.containerInnertittle3}>{t(langKeys.intentionsdescription)}</div>                                            
                                            <Button
                                                className={classes.button}
                                                variant="contained"
                                                color="primary"
                                                onClick={()=>setViewSelectedTraining("intentions")}
                                                style={{ backgroundColor: "#55BD84" }}
                                            >{t(langKeys.enter)}
                                            </Button>
                                        </div>
                                        
                                        <div className='col-6' style={{ display: 'flex', justifyContent: 'center', width: "50%" }}>
                                            <IntencionesIALogo style={{ height: 220, width:"100%" }} />
                                        </div>
                                    </div>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6} lg={4} style={{ minWidth: 330 }}>
                                <Card style={{ position: 'relative', display:"flex" }}>
                                    <div className={classes.containerInner}>

                                        <div className="col-6" style={{width: "50%"}}>
                                            <div className={classes.containerInnertittle1}>{t(langKeys.ia)}</div>
                                            <div className={classes.containerInnertittle2}>{t(langKeys.entities)}</div>
                                            <div className={classes.containerInnertittle3}>{t(langKeys.entitiesdescription)}</div>                                            
                                            <Button
                                                className={classes.button}
                                                variant="contained"
                                                color="primary"
                                                style={{ backgroundColor: "#55BD84" }}
                                                onClick={()=>setViewSelectedTraining("entities")}
                                            >{t(langKeys.enter)}
                                            </Button>
                                        </div>
                                        
                                        <div className='col-6' style={{ display: 'flex', justifyContent: 'center', width: "50%" }}>
                                            <EntidadesIALogo style={{ height: 220, width:"100%" }} />
                                        </div>
                                    </div>
                                </Card>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </div>
        )
    }else if (viewSelectedTraining === "intentions") {
        return <Intentions 
            setExternalViewSelected={functionChange}
            arrayBread={newArrayBread}
        />
    }else if (viewSelectedTraining === "entities") {
        return (
            <Entities 
            setExternalViewSelected={functionChange}
            arrayBread={newArrayBread}
            />
        )
    } else
        return null;

}
const IATraining: React.FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const [viewSelectedTraining, setViewSelectedTraining] = useState("view-1");
    const executeResult = useSelector(state => state.main.execute);
    const classes = useStyles();

    const arrayBread = [
        { id: "view-1", name: t(langKeys.training) }
    ];
    // const [mainData, setMainData] = useState<any>([]);
    const [waitSave, setWaitSave] = useState(false);

    
    const functionChange = (change:string) => {
        if(change==="view-0"){
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

    useEffect(() => {
        // setMainData(mainResult.mainData.data.map(x => ({
        //     ...x,
        //     typedesc: (t(`type_corp_${x.type}`.toLowerCase()) || "").toUpperCase(),
        //     statusdesc: (t(`status_${x.status}`.toLowerCase()) || "").toUpperCase()
        // })))
    }, [mainResult.mainData.data])


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

                                        <div className="col-6" style={{width: "50%"}}>
                                            <div className={classes.containerInnertittle1}>{t(langKeys.ia)}</div>
                                            <div className={classes.containerInnertittle2}>WIT IA</div>
                                            <div className={classes.containerInnertittle3}>{t(langKeys.trainingwithaidescription)}</div>                                            
                                            <Button
                                                className={classes.button}
                                                variant="contained"
                                                color="primary"
                                                style={{ backgroundColor: "#55BD84" }}
                                                onClick={()=>setViewSelectedTraining("witia")}
                                            >{t(langKeys.enter)}
                                            </Button>
                                        </div>
                                        
                                        <div className='col-6' style={{ display: 'flex', justifyContent: 'center', width: "50%" }}>
                                            <EntrenamientoIALogo style={{ height: 220, width:"100%" }} />
                                        </div>
                                    </div>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6} lg={4} style={{ minWidth: 330 }}>
                                <Card style={{ position: 'relative', display:"flex" }}>
                                    <div className={classes.containerInner}>

                                        <div className="col-6" style={{width: "50%"}}>
                                            <div className={classes.containerInnertittle1}>{t(langKeys.ia)}</div>
                                            <div className={classes.containerInnertittle2}>RASA IA</div>
                                            <div className={classes.containerInnertittle3}>{t(langKeys.trainingwithaidescription)}</div>                                            
                                            <Button
                                                className={classes.button}
                                                variant="contained"
                                                color="primary"
                                                style={{ backgroundColor: "#55BD84" }}
                                                onClick={()=>setViewSelectedTraining("rasaia")}
                                            >{t(langKeys.enter)}
                                            </Button>
                                        </div>
                                        
                                        <div className='col-6' style={{ display: 'flex', justifyContent: 'center', width: "50%" }}>
                                            <EntrenamientoIALogo style={{ height: 220, width:"100%" }} />
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
    } else
        return null;

}

export default IATraining;