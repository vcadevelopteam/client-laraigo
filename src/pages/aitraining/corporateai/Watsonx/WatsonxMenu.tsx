import React, { useEffect, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateBreadcrumbs } from 'components';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { getCollectionAux, resetAllMain } from 'store/main/actions';
import { showSnackbar, showBackdrop } from 'store/popus/actions';
import { Box, Card, Grid } from '@material-ui/core';
import { IntencionesIALogo, TestModelRasa, EntidadesIALogo } from 'icons';
import TestModelDialog from 'components/inbox/TestModelDialog';
import { rasaModelSel } from 'common/helpers';
import { BreadCrumb } from '@types';
import { Intentions } from './Intentions';
import { ModelTest } from './ModelTest';
import { Entities } from './Entities';
import TestModelWatsonXDialog from './TestModelWatsonXDialog';

const useStyles = makeStyles((theme) => ({
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
    containerInner: {
        display: "flex",
        padding: 15
    },
    containerInnertittle1: {
        width: "100%",
        textTransform: "uppercase",
        fontSize: "1.1em",
        padding: "7px 0",
    },
    containerInnertittle2: {
        width: "100%",
        fontSize: "1.5em",
        fontWeight: "bold",
        padding: "7px 0",
    },
    containerInnertittle3: {
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

const WatsonxMenu: React.FC<{ data: any, arrayBread: BreadCrumb[], setViewSelected: (view: string) => void }> = ({ data, setViewSelected, arrayBread }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const [viewSelectedTraining, setViewSelectedTraining] = useState("view-1");
    const executeResult = useSelector(state => state.main.execute);
    const classes = useStyles();
    const [openModal, setOpenModal] = useState(false);

    const newArrayBread = [
        ...arrayBread,
        { id: "watsonxmenu", name: "Entrenamiento" },
    ];
    const [waitSave, setWaitSave] = useState(false);

    const fetchData = () => dispatch(getCollectionAux(rasaModelSel()))
    const functionChange = (change: string) => {
        if (change === "watsonxmenu") {
            setViewSelectedTraining("view-1")
            fetchData()
        } else {
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
                                <Card style={{ position: 'relative', display: "flex" }}>
                                    <div className={classes.containerInner}>

                                        <div className="col-6" style={{ width: "50%", display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <div>
                                                <div className={classes.containerInnertittle1}>{t(langKeys.ia)}</div>
                                                <div className={classes.containerInnertittle2}>{t(langKeys.intentions)}</div>
                                                <div className={classes.containerInnertittle3}>{t(langKeys.intentionsdescription)}</div>
                                            </div>
                                            <Button
                                                className={classes.button}
                                                variant="contained"
                                                color="primary"
                                                onClick={() => setViewSelectedTraining("intentions")}
                                                style={{ backgroundColor: "#55BD84", width: "fit-content" }}
                                            >{t(langKeys.enter)}
                                            </Button>
                                        </div>

                                        <div className='col-6' style={{ display: 'flex', justifyContent: 'center', width: "50%" }}>
                                            <IntencionesIALogo style={{ height: 220, width: "100%" }} />
                                        </div>
                                    </div>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6} lg={4} style={{ minWidth: 330 }}>
                                <Card style={{ position: 'relative', display: "flex" }}>
                                    <div className={classes.containerInner}>

                                        <div className="col-6" style={{ width: "50%", display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <div>
                                                <div className={classes.containerInnertittle1}>{t(langKeys.ia)}</div>
                                                <div className={classes.containerInnertittle2}>{t(langKeys.entities)}</div>
                                                <div className={classes.containerInnertittle3}>{t(langKeys.entitiesdescription)}</div>
                                            </div>
                                            <Button
                                                className={classes.button}
                                                variant="contained"
                                                color="primary"
                                                style={{ backgroundColor: "#55BD84", width: "fit-content" }}
                                                onClick={() => setViewSelectedTraining("entities")}
                                            >{t(langKeys.enter)}
                                            </Button>
                                        </div>

                                        <div className='col-6' style={{ display: 'flex', justifyContent: 'center', width: "50%" }}>
                                            <EntidadesIALogo style={{ height: 220, width: "100%" }} />
                                        </div>
                                    </div>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6} lg={4} style={{ minWidth: 330 }}>
                                <Card style={{ position: 'relative', display: "flex" }}>
                                    <div className={classes.containerInner}>

                                        <div className="col-6" style={{ width: "50%", display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <div>
                                                <div className={classes.containerInnertittle1}>{t(langKeys.ia)}</div>
                                                <div className={classes.containerInnertittle2}>{t(langKeys.testmodel)}</div>
                                                <div className={classes.containerInnertittle3}>{t(langKeys.testmodeldescription)}</div>
                                            </div>
                                            <Button
                                                className={classes.button}
                                                variant="contained"
                                                color="primary"
                                                style={{ backgroundColor: "#55BD84", width: "fit-content" }}
                                                onClick={() => setOpenModal(true)}
                                            >{t(langKeys.enter)}
                                            </Button>
                                        </div>
                                        <TestModelWatsonXDialog
                                            data={data}
                                            openModal={openModal}
                                            setOpenModal={setOpenModal}
                                        />

                                        <div className='col-6' style={{ display: 'flex', justifyContent: 'center', width: "50%" }}>
                                            <TestModelRasa style={{ height: 220, width: "100%", color: "#7721ad"}} />
                                        </div>
                                    </div>
                                </Card>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </div>
        )
    } else if (viewSelectedTraining === "intentions") {
        return <Intentions
            setExternalViewSelected={functionChange}
            arrayBread={newArrayBread}
            data={data}
        />
    } else if (viewSelectedTraining === "entities") {
        return (
            <Entities
                data={data}
                setExternalViewSelected={functionChange}
                arrayBread={newArrayBread}
            />
        )
    } else if (viewSelectedTraining === "models") {
        return (
            <ModelTest
                setExternalViewSelected={functionChange}
                arrayBread={newArrayBread}
            />
        )
    } else
        return null;

}

export default WatsonxMenu;