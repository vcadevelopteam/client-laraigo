import React from 'react'; 
import Button from '@material-ui/core/Button';
import { TemplateBreadcrumbs } from 'components';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import {Box, Card, Grid } from '@material-ui/core';
import { RASATrainingIcon, WitIcon} from 'icons';
import { BreadCrumb } from '@types';
import { useSelector } from 'hooks';

const useStyles = makeStyles((theme) => ({   
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

const CorporateIA: React.FC<{arrayBread: BreadCrumb[], setViewSelected: (view: string) => void}> = ({ setViewSelected, arrayBread }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const mainResult = useSelector(state => state.main.mainAux);

    const newArrayBread = [
        ...arrayBread,
        { id: "corporateia", name:  "Empresarial" },
    ];

    const functionChange = (change:string) => {
        if(change === "corporateia"){
            setViewSelected("view-1")
        }else{
            setViewSelected(change);
        }
    }

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

                                    <div className="col-6" style={{width: "50%", display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                                        <div>
                                            <div className={classes.containerInnertittle1}>{t(langKeys.ia)}</div>
                                            <div className={classes.containerInnertittle2}>WIT IA</div>
                                            <div className={classes.containerInnertittle3}>{t(langKeys.trainingwithaidescription)}</div>
                                        </div>                                           
                                        <Button
                                            className={classes.button}
                                            variant="contained"
                                            color="primary"
                                            style={{ backgroundColor: "#55BD84", width: "fit-content" }}
                                            onClick={()=>setViewSelected("witia")}
                                        >{t(langKeys.enter)}
                                        </Button>
                                    </div>
                                    
                                    <div className='col-6' style={{ display: 'flex', justifyContent: 'center', width: "50%" }}>
                                        <WitIcon style={{ height: 220, width:"100%" }} />
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
                                            <div className={classes.containerInnertittle2}>RASA IA</div>
                                            <div className={classes.containerInnertittle3}>{t(langKeys.trainingwithaidescription)}</div>
                                        </div>
                                        <Button
                                            className={classes.button}
                                            variant="contained"
                                            color="primary"
                                            style={{ backgroundColor: "#55BD84", width: "fit-content" }}
                                            onClick={()=>setViewSelected("rasaia")}
                                        >{t(langKeys.enter)}
                                        </Button>
                                    </div>
                                    
                                    <div className='col-6' style={{ display: 'flex', justifyContent: 'center', width: "50%" }}>
                                        <RASATrainingIcon style={{ height: 220, width:"100%" }} />
                                    </div>
                                </div>
                            </Card>
                        </Grid>

                        {!!mainResult.data.length && <Grid item xs={12} md={6} lg={4} style={{ minWidth: 330 }}>
                            <Card style={{ position: 'relative', display:"flex" }}>
                                <div className={classes.containerInner}>

                                    <div className="col-6" style={{width: "50%", display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                                        <div>
                                            <div className={classes.containerInnertittle1}>{t(langKeys.ia)}</div>
                                            <div className={classes.containerInnertittle2}>WATSONX ASSISTANT</div>
                                            <div className={classes.containerInnertittle3}>{t(langKeys.watsonxassistantdescription)}</div>
                                        </div>                                           
                                        <Button
                                            className={classes.button}
                                            variant="contained"
                                            color="primary"
                                            style={{ backgroundColor: "#55BD84", width: "fit-content" }}
                                            onClick={()=>setViewSelected("watsonx")}
                                        >{t(langKeys.enter)}
                                        </Button>
                                    </div>
                                    
                                    <div className='col-6' style={{ display: 'flex', justifyContent: 'center', width: "50%" }}>
                                        <WitIcon style={{ height: 220, width:"100%" }} />
                                    </div>
                                </div>
                            </Card>
                        </Grid>}
                    </Grid>
                </div>
            </div>
        </div>
    )
}

export default CorporateIA;