import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { FieldEdit, FieldSelect, TemplateBreadcrumbs } from "components";
import { useTranslation } from "react-i18next";
import { resetAllMain } from 'store/main/actions';
import { langKeys } from "lang/keys";
import { showSnackbar, showBackdrop } from "store/popus/actions";
import { Box, Button, Card, Grid } from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { SynonimsRasaLogo } from "icons";

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
   
    containerDetails: {
        marginTop: theme.spacing(3)
    },       
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial',
        marginTop: 5
    },
    containerHeader: {      
        marginTop: '1rem',      
    },
}));

interface CreateAssistantProps {
    arrayBread: any,
    setViewSelected: (view: string) => void,
    setExternalViewSelected: (view: string) => void
}

const CreateAssistant: React.FC<CreateAssistantProps> = ({
    setViewSelected,
    arrayBread,
    setExternalViewSelected
}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const executeResult = useSelector(state => state.main.execute);
    const classes = useStyles();

    const newArrayBread = [
        ...arrayBread,
        { id: "createassistant", name: t(langKeys.createssistant) },
    ];

    const [waitSave, setWaitSave] = useState(false);

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

    return (
        <div style={{ width: "100%" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <TemplateBreadcrumbs
                    breadcrumbs={newArrayBread}
                    handleClick={(view) => setExternalViewSelected(view)}
                />
            </div>
            <div className={classes.container}>     
                <div id="assistant">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '1rem' }}>
                            <Box className={classes.containerHeader}>
                                <span className={classes.title}>
                                    {t(langKeys.createssistant)}
                                </span>
                            </Box>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <Button
                                variant="contained"
                                type="button"
                                startIcon={<ArrowBackIcon color="primary" />}
                                style={{ backgroundColor: '#ffff', color: '#7721AD' }}
                                onClick={() => setViewSelected('generativeia')}
                            >
                                {t(langKeys.return)}
                            </Button>

                            <Button
                                variant="contained"
                                type="button"
                                color="primary"
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: '#55BD84' }}
                            >
                                {t(langKeys.save)}
                            </Button>
                        </div>
                    </div>

                    <div className="row-zyx" style={{marginTop:"1.5rem"}}>
                        <FieldEdit
                            className="col-6"
                            label={t(langKeys.name)}
                            type="text"
                        />
                        <FieldEdit
                            className="col-6"
                            label={t(langKeys.description)}
                            type="text"
                        />

                        <FieldSelect
                            label={t(langKeys.basemodel)}
                            data={[]}
                            optionDesc="value"
                            optionValue="value"
                            className="col-6"
                        />
                                        
                        <FieldEdit
                            className="col-6"
                            label={t(langKeys.status)}
                            type="text"
                        />
                        <FieldEdit
                            className="col-12"
                            label={t(langKeys.apikey)}
                            type="text"
                        />
                    </div>
                </div>
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

                    <div className="row-zyx" style={{marginTop:"1.5rem"}}>

                        <Grid item xs={12} md={6} lg={4} style={{ minWidth: 330, display: 'flex'}}>
                            <Card style={{ position: 'relative', width: '80%' }}>
                                <div style={{ textAlign: 'center', alignContent: 'center' }}>
                                    <div className='col-6' style={{ display: 'flex', justifyContent: 'center', width: "50%" }}>
                                        <SynonimsRasaLogo style={{ height: 220, width:"100%" }} />
                                    </div>
                                    <div style={{ fontWeight: 'bold' }}>{t(langKeys.employeeaplication)}</div>
                                    <div>{t(langKeys.sinonimsdescription)}</div>
                                </div>
                            </Card>
                        </Grid>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateAssistant;