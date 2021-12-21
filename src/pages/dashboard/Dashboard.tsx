import { FC, Fragment, useCallback, useEffect, useState } from 'react';
import { Box, Card, CardActionArea, CardContent, CardMedia, CircularProgress, Grid, IconButton, makeStyles, Menu, MenuItem, Typography } from '@material-ui/core';
import { Add as AddIcon, MoreVert as MoreVertIcon } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { getDashboardTemplateIns, getDashboardTemplateSel } from 'common/helpers';
import { getCollection, resetMain, resetCollectionPaginated, resetMultiMain, resetMainAux } from 'store/main/actions';
import { useDispatch } from 'react-redux';
import { default as DashboardManagerial } from './DashboardManagerial';
import { default as DashboardProductivity } from './DashboardProductivity';
import { default as DashboardOperationalPush } from './DashboardOperationalPush';
import { TemplateBreadcrumbs } from 'components';
import paths from 'common/constants/paths';
import { useHistory } from 'react-router';
import { useSelector } from 'hooks';
import { showSnackbar } from 'store/popus/actions';
import { DashboardTemplate, IListStatePaginated } from '@types';
import { deleteDashboardTemplate, resetDeleteDashboardTemplate } from 'store/dashboard/actions';


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
    const history = useHistory();
    const [viewSelected, setViewSelected] = useState("view-1");
    const dashboardtemplates = useSelector(state => state.main.mainData) as IListStatePaginated<DashboardTemplate>;
    const dashboardtemplateDelete = useSelector(state => state.dashboard.dashboardtemplateDelete);

    useEffect(() => {
        dispatch(getCollection(getDashboardTemplateSel()));

        return () => {
            dispatch(resetMainAux());
            dispatch(resetCollectionPaginated());
            dispatch(resetMultiMain());
            dispatch(resetMain());
            dispatch(resetDeleteDashboardTemplate());
        };

    }, [dispatch]);

    useEffect(() => {
        if (dashboardtemplates.loading) return;
        if (dashboardtemplates.error) {
            const error = t(dashboardtemplates.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: error,
                success: false,
                show: true,
            }));
        }
    }, [dashboardtemplates, t, dispatch]);

    useEffect(() => {
        if (dashboardtemplateDelete.loading) return;
        if (dashboardtemplateDelete.error) {
            const error = t(dashboardtemplateDelete.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: error,
                success: false,
                show: true,
            }));
        } else if (dashboardtemplateDelete.success) {
            dispatch(showSnackbar({
                message: "Se eliminó el dashboard",
                success: true,
                show: true,
            }));
            dispatch(getCollection(getDashboardTemplateSel()));
        }
    }, [dashboardtemplateDelete, history, t, dispatch]);

    const onDelete = useCallback((template: DashboardTemplate) => {
        dispatch(deleteDashboardTemplate(getDashboardTemplateIns({
            ...template,
            id: template.dashboardtemplateid,
            status: 'ELIMINADO',
            operation: 'DELETE',
        })));
    }, [dispatch]);

    const goToDashboardLayout = useCallback((dashboardtemplateid: number) => {
        history.push(paths.DASHBOARD_LAYOUT.resolve(dashboardtemplateid));
    }, [history]);

    const handleSelected = (key:string) => {
        setViewSelected(key);
    }

    if (dashboardtemplates.loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <CircularProgress />
            </div>
        );
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
                        <Grid item xs={12} md={4} lg={3} style={{ minWidth: 360 }}>
                            <Card>
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
                        <Grid item xs={12} md={4} lg={3} style={{ minWidth: 360 }}>
                            <Card>
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
                        <Grid item xs={12} md={4} lg={3} style={{ minWidth: 360 }}>
                            <Card>
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
                        {dashboardtemplates.data.map((e, i) => (
                            <Grid item xs={12} md={4} lg={3} style={{ minWidth: 360 }} key={i}>
                                <DashboardCard
                                    dashboardtemplate={e}
                                    disabled={dashboardtemplateDelete.loading}
                                    onClick={() => goToDashboardLayout(e.dashboardtemplateid)}
                                    onDelete={() => onDelete(e)}
                                />
                            </Grid>
                        ))}
                        <Grid item xs={12} md={4} lg={3} style={{ minWidth: 360 }}>
                            <Card style={{ height: '100%', minHeight: 211 }}>
                                <CardActionArea
                                    onClick={() => {
                                        history.push(paths.DASHBOARD_ADD);
                                    }}
                                    style={{
                                        marginLeft: 'auto',
                                        marginRight: 'auto',
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <AddIcon
                                        color="action"
                                        style={{ width: 60, height: 60 }}
                                    />
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

interface DashboardCardProps {
    disabled: boolean;
    dashboardtemplate: DashboardTemplate;
    onClick: () => void;
    onDelete: () => void;
}

const useDashboardCardStyles = makeStyles(theme => ({
    media: {
        objectFit: "none"
    },
}));

const DashboardCard: FC<DashboardCardProps> = ({ dashboardtemplate, disabled, onClick, onDelete }) => {
    const classes = useDashboardCardStyles();
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    return (
        <Card style={{ position: 'relative' }}>
            <CardActionArea
                href={paths.DASHBOARD_LAYOUT.resolve(dashboardtemplate.dashboardtemplateid)}
                onClick={onClick}
            >
                <CardMedia
                    component="img"
                    height="140"
                    className={classes.media}
                    image="https://www.datacrm.com/upload/article/b201902121011569.jpg"
                    title={dashboardtemplate.description}
                />
                <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                        {dashboardtemplate.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <IconButton
                aria-label="settings"
                aria-describedby={`${dashboardtemplate.dashboardtemplateid}reporttemplate`}
                aria-haspopup
                style={{ position: 'absolute', right: 0, top: 0 }}
                onClick={(e) => setAnchorEl(e.currentTarget)}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem
                    onClick={() => {
                        onDelete();
                        setAnchorEl(null);
                    }}
                    disabled={disabled}
                >
                    {t(langKeys.delete)}
                </MenuItem>
            </Menu>
        </Card>
    );
}

export default Dashboard;
