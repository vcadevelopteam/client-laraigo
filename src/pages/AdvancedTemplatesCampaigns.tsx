import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Card, Grid } from '@material-ui/core';
import { TemplatesIcon, CampaignsIcon } from 'icons';
import MessageTemplates from './messagetemplates/MessageTemplates';
import Campaign from './campaign/Campaign';

const useStyles = makeStyles((theme) => ({
    title: {
        fontSize: '25px',
        fontWeight: 'bold',
        color: theme.palette.text.primary,
        margin: '6px 0px 10px 0px'
    },
    container: {
        width: '100%',
        color: "#2e2c34",
    },
    containerInner:{
        display:"flex",
        padding:15
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

const AdvancedTemplatesCampaigns: React.FC = () => {
    const { t } = useTranslation();
    const [viewSelectedTraining, setViewSelectedTraining] = useState("view-1");
    const classes = useStyles();
    const arrayBread = [
        { id: "view-1", name: t(langKeys.advanced) }
    ];

    const functionChange = (change:string) => {
        if(change==="view-0"){
            //empty
        }else{
            setViewSelectedTraining(change);
        }
    }

    if (viewSelectedTraining === "view-1") {
        return (
            <div style={{ width: "100%" }}>
                <div className={classes.container}>
                    <div className={classes.title}>{t(langKeys.advancedtemplatescampaigns)}</div>
                    <div>                        
                        <Grid container spacing={3} >
                            <Grid item xs={12} md={6} lg={4} style={{ minWidth: 330 }}>
                                <Card style={{ position: 'relative', display:"flex" }}>
                                    <div className={classes.containerInner}>
                                        <div className="col-6" style={{width: "50%", display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                                            <div>
                                                <div className={classes.containerInnertittle2}>{t(langKeys.templates).toUpperCase()}</div>
                                                <div className={classes.containerInnertittle3}>{t(langKeys.templatestext)}</div>
                                            </div>
                                            <Button
                                                className={classes.button}
                                                variant="contained"
                                                color="primary"
                                                style={{ backgroundColor: "#55BD84", width: "fit-content" }}
                                                onClick={()=>setViewSelectedTraining("templates")}
                                            >{t(langKeys.enter)}
                                            </Button>
                                        </div>
                                        <div className='col-6' style={{ display: 'flex', justifyContent: 'center', width: "50%" }}>
                                            <TemplatesIcon style={{ height: 220, width:"100%" }} />
                                        </div>
                                    </div>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6} lg={4} style={{ minWidth: 330 }}>
                                <Card style={{ position: 'relative', display:"flex" }}>
                                    <div className={classes.containerInner}>
                                        <div className="col-6" style={{width: "50%", display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                                            <div>
                                                <div className={classes.containerInnertittle2}>{t(langKeys.app_campaign).toUpperCase()}</div>
                                                <div className={classes.containerInnertittle3}>{t(langKeys.campaignstext)}</div>
                                            </div>
                                            <Button
                                                className={classes.button}
                                                variant="contained"
                                                color="primary"
                                                style={{ backgroundColor: "#55BD84", width: "fit-content" }}
                                                onClick={()=>setViewSelectedTraining("campaigns")}
                                            >{t(langKeys.enter)}
                                            </Button>
                                        </div>
                                        <div className='col-6' style={{ display: 'flex', justifyContent: 'center', width: "50%" }}>
                                            <CampaignsIcon style={{ height: 220, width:"100%" }} />
                                        </div>
                                    </div>
                                </Card>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </div>
        )
    }else if (viewSelectedTraining === "templates") {
        return (
            <MessageTemplates
                setAuxViewSelected={functionChange}
                arrayBread={arrayBread}
            />
        )
    }else if (viewSelectedTraining === "campaigns") {
        return (
            <Campaign
                setAuxViewSelected={functionChange}
                arrayBread={arrayBread}
            />
        )
    } else
        return null;
}

export default AdvancedTemplatesCampaigns;