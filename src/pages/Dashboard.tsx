/* eslint-disable react-hooks/exhaustive-deps */
import { FC, Fragment, useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { getReportSel } from 'common/helpers';
import { getCollection, resetMain, resetCollectionPaginated, resetMultiMain, resetMainAux } from 'store/main/actions';
import { useDispatch } from 'react-redux';
import { default as DashboardManagerial } from './DashboardManagerial';
import { default as DashboardProductivity } from './DashboardProductivity';
import { default as DashboardOperationalPush } from './DashboardOperationalPush';
import { default as Heatmap } from './Heatmap';
import { TemplateBreadcrumbs } from 'components';


const arrayBread = [
    { id: "view-1", name: "Dashboard" },
    { id: "dashboardgerencial", name: "Dashboard managerial" },
];

const useStyles = makeStyles((theme) => ({
    container: {
        width: '100%'
    },
    containerDetails: {
        marginTop: theme.spacing(3)
    },
    media: {
        objectFit: "none"
    },
    containerSearch: {
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '50%',
        },
    },
    containerFilter: {
        width: '100%',
        marginBottom: theme.spacing(2),
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap'
    },
    filterComponent: {
        width: '220px'
    },
    containerFilterGeneral: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: theme.spacing(2),
    },
    title: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: theme.palette.text.primary,
    },
    containerHeader: {
        display: 'block',
        marginBottom: 0,
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        },
    },
    mb2: {
        marginBottom: theme.spacing(4),
    }
}));

const Dashboard: FC = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const [viewSelected, setViewSelected] = useState("view-1");

    const fetchData = () => dispatch(getCollection(getReportSel('')));

    useEffect(() => {
        dispatch(resetMainAux());
        dispatch(resetCollectionPaginated());
        dispatch(resetMultiMain());
        fetchData();

        return () => {
            dispatch(resetMainAux());
            dispatch(resetCollectionPaginated());
            dispatch(resetMultiMain());
            dispatch(resetMain());
        };

    }, []);

    const handleSelected = (key:string) => {
        setViewSelected(key);
    }

    if (viewSelected === "view-1") {
        return (
            <div className={classes.container}>
                <Box className={classes.containerHeader} justifyContent="space-between" alignItems="center" mb={1}>
                    <span className={classes.title}>
                        {t(langKeys.dashboard_plural)}
                    </span>
                </Box>
                <div className={classes.containerDetails}>
                    <Grid container spacing={3}>
                            <Grid item key={"dashboardgerencial"} xs={12} md={4} lg={3} style={{ minWidth: 360 }}>
                                <Card >
                                    <CardActionArea onClick={() => handleSelected("dashboardgerencial")}>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            className={classes.media}
                                            image={'https://www.datacrm.com/upload/article/b201902121011569.jpg'}
                                            title={t(langKeys.managerial)}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h6" component="div">
                                                {t(langKeys.managerial)}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                            <Grid item key={"dashboardproductivity"} xs={12} md={4} lg={3} style={{ minWidth: 360 }}>
                                <Card >
                                    <CardActionArea onClick={() => handleSelected("dashboardproductivity")}>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            className={classes.media}
                                            image={'https://www.datacrm.com/upload/article/b201902121011569.jpg'}
                                            title={t(langKeys.productivity)}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h6" component="div">
                                                {t(langKeys.productivity)}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                            <Grid item key={"dashboardoperationalpush"} xs={12} md={4} lg={3} style={{ minWidth: 360 }}>
                                <Card >
                                    <CardActionArea onClick={() => handleSelected("dashboardoperationalpush")}>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            className={classes.media}
                                            image={'https://www.datacrm.com/upload/article/b201902121011569.jpg'}
                                            title={t(langKeys.operationalpush)}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h6" component="div">
                                                {t(langKeys.operationalpush)}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                    </Grid>
                </div>
            </div>
        );
    } 
    else if(viewSelected === "dashboardgerencial"){
        return(
            <Fragment>
                <div style={{ width: '100%' }}>
                    <TemplateBreadcrumbs
                        breadcrumbs={arrayBread}
                        handleClick={handleSelected}
                    />
                    <DashboardManagerial/>
                </div>
            </Fragment>
        )
    }
    else if(viewSelected === "dashboardproductivity"){
        return(
            <Fragment>
                <div style={{ width: '100%' }}>
                    <TemplateBreadcrumbs
                        breadcrumbs={arrayBread}
                        handleClick={handleSelected}
                    />
                    <DashboardProductivity/>
                </div>
            </Fragment>
        )
    }
    else if(viewSelected === "dashboardoperationalpush"){
        return(
            
            <Fragment>
                <div style={{ width: '100%' }}>
                    <TemplateBreadcrumbs
                        breadcrumbs={arrayBread}
                        handleClick={handleSelected}
                    />
                    <DashboardOperationalPush/>
                </div>
            </Fragment>
        )
    }    
    else{
        return (
            <div>error</div>
        )
    }
}

export default Dashboard;