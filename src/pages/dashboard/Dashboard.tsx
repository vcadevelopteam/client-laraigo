import React from 'react';
import { FC, Fragment, useCallback, useEffect, useState } from 'react';
import { Box, Button, Card, CardActionArea, CardContent, CardMedia, CircularProgress, Grid, IconButton, makeStyles, Menu, MenuItem, Typography } from '@material-ui/core';
import { Add as AddIcon, MoreVert as MoreVertIcon } from '@material-ui/icons';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { getDashboardTemplateIns, getDashboardTemplateSel } from 'common/helpers';
import { getCollection, resetMain, resetCollectionPaginated, resetMultiMain, resetMainAux } from 'store/main/actions';
import { useDispatch } from 'react-redux';
import { default as DashboardManagerial } from './DashboardManagerial';
import { default as DashboardProductivity } from './DashboardProductivity';
import { default as DashboardOperationalPush } from './DashboardOperationalPush';
import { default as DashboardTagRanking } from './DashboardTagRanking';
import { default as DashboardDisconnections } from './DashboardDisconnections';
import DashboardAssesorProductivity from './DashBoardAssesorProductivity';
import { SearchField, TemplateBreadcrumbs } from 'components';
import paths from 'common/constants/paths';
import { useHistory } from 'react-router';
import { useSelector } from 'hooks';
import { manageConfirmation, showSnackbar } from 'store/popus/actions';
import { DashboardTemplate, IListStatePaginated } from '@types';
import { deleteDashboardTemplate, resetDeleteDashboardTemplate } from 'store/dashboard/actions';
import DashboardKPI from './DashboardKPI';
import DashboardKPIMonthly from './DashboardKPIMonthly';
const isIncremental = window.location.href.includes("incremental")
import productivity_advisors from 'icons/reports_productivity_advisors.svg';
import { Dictionary } from "@types";
import DashboardOpportunityFunnel from "./DashboardOpportunityFunnel";



const arrayBread = [
    { id: "view-1", name: "Dashboard" }
];

const useStyles = makeStyles((theme) => ({
    container: {
        width: '100%'
    },
    containerDetails: {
        marginTop: theme.spacing(3)
    },
    media: {
        objectFit: "cover"
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
        justifyContent: 'end',
        alignItems: 'center',
        gap: 8,
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
interface ItemProps {   
    row: Dictionary | null;   
    allFilters: Dictionary[];   
}

const Dashboard: React.FC<ItemProps> = ({ row, allFilters }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const [viewSelected, setViewSelected] = useState("view-1");
    const dashboardtemplates = useSelector(state => state.main.mainData) as IListStatePaginated<DashboardTemplate>;
    const dashboardtemplateDelete = useSelector(state => state.dashboard.dashboardtemplateDelete);    
    const user = useSelector(state => state.login.validateToken.user);
    const [searchValue, setSearchValue] = useState('');
    const [allDashboards, setAllDashboards] = useState<any>([]);
    const [allDashboardsToShow, setallDashboardsToShow] = useState<any[]>([]);
    
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
        let temparray = allDashboards.filter((el:any)=> String(el.description).toLowerCase().includes(searchValue.toLowerCase()))
        setallDashboardsToShow(temparray)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchValue]);
    useEffect(() => {
        if (dashboardtemplates.loading) return;
        if (dashboardtemplates.error) {
            const error = t(dashboardtemplates.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: error,
                severity: "error",
                show: true,
            }));
        }else{
            
            setAllDashboards(dashboardtemplates.data)
            setallDashboardsToShow(dashboardtemplates.data)
        }
    }, [dashboardtemplates, t, dispatch]);

    useEffect(() => {
        if (dashboardtemplateDelete.loading) return;
        if (dashboardtemplateDelete.error) {
            const error = t(dashboardtemplateDelete.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: error,
                severity: "error",
                show: true,
            }));
            dispatch(resetDeleteDashboardTemplate());
        } else if (dashboardtemplateDelete.success) {
            dispatch(showSnackbar({
                message: "Se eliminó el dashboard",
                severity: "success",
                show: true,
            }));
            dispatch(getCollection(getDashboardTemplateSel()));
            dispatch(resetDeleteDashboardTemplate());
        }
    }, [dashboardtemplateDelete, history, t, dispatch]);

    const onDelete = useCallback((template: DashboardTemplate) => {
        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback: () => {
                dispatch(deleteDashboardTemplate(getDashboardTemplateIns({
                    ...template,
                    id: template.dashboardtemplateid,
                    status: 'ELIMINADO',
                    operation: 'DELETE',
                })));
            },
        }))
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
    const handleFiend = (valor: string) => {
        setSearchValue(valor);
    }

    const dashboardCounter = () => {
        let counter = 0;
        if (t(langKeys.managerial).toLowerCase().includes(searchValue.toLowerCase())) {
            counter++;
        }
        if (t(langKeys.productivity).toLowerCase().includes(searchValue.toLowerCase())) {
            counter++;
        }
        if (t(langKeys.operationalpush).toLowerCase().includes(searchValue.toLowerCase())) {
            counter++;
        }

        return counter += allDashboardsToShow.length;
    }

    if (viewSelected === "view-1") {
        return (
            <div className={classes.container}>
                <Box className={classes.containerHeader} justifyContent="space-between" alignItems="center" mb={1}>
                    <span className={classes.title}>
                        {t(langKeys.dashboard_plural)} ({dashboardCounter()})
                    </span>
                </Box>
                <Box className={classes.containerFilterGeneral}>
                    <div className={classes.containerSearch}>
                        <SearchField
                            colorPlaceHolder='#FFF'
                            handleChangeOther={handleFiend}
                            disabled={dashboardtemplates.loading}
                            lazy
                        />
                    </div>
                    {!isIncremental &&
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={dashboardtemplates.loading}
                            startIcon={<AddIcon color="secondary" />}
                            onClick={() => history.push(paths.DASHBOARD_ADD)}
                            style={{ backgroundColor: "#55BD84" }}
                        >
                            <Trans i18nKey={langKeys.create_custom_dashboard} />
                        </Button>
                    }
                </Box>
                <div className={classes.containerDetails}>
                    <Grid container spacing={3}>
                        { t(langKeys.managerial).toLowerCase().includes(searchValue.toLowerCase()) && <Grid item xs={12} md={4} lg={3} style={{ minWidth: 360 }}>
                            <Card>
                                <CardActionArea onClick={() => handleSelected("dashboardgerencial")}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        className={classes.media}
                                        image={'https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/1gerencial.png'}
                                        title={t(langKeys.managerial)}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {t(langKeys.managerial)}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>}
                        {t(langKeys.productivity).toLowerCase().includes(searchValue.toLowerCase()) && <Grid item xs={12} md={4} lg={3} style={{ minWidth: 360 }}>
                            <Card>
                                <CardActionArea onClick={() => handleSelected("dashboardproductivity")}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        className={classes.media}
                                        image={'https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/2productividad.png'}
                                        title={t(langKeys.productivity)}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {t(langKeys.productivity)}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>}
                        {t(langKeys.operationalpush).toLowerCase().includes(searchValue.toLowerCase()) && <Grid item xs={12} md={4} lg={3} style={{ minWidth: 360 }}>
                            <Card>
                                <CardActionArea onClick={() => handleSelected("dashboardoperationalpush")}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        className={classes.media}
                                        image={'https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/3operativoPush.png'}
                                        title={t(langKeys.operationalpush)}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {t(langKeys.operationalpush)}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>}
                        {t(langKeys.tagranking).toLowerCase().includes(searchValue.toLowerCase()) && <Grid item xs={12} md={4} lg={3} style={{ minWidth: 360 }}>
                            <Card>
                                <CardActionArea onClick={() => handleSelected("dashboardtagranking")}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        className={classes.media}
                                        image={'https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/randkinfg.png'}
                                        title={t(langKeys.tagranking)}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {t(langKeys.tagranking)}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>}
                        {t(langKeys.disconnections).toLowerCase().includes(searchValue.toLowerCase()) && <Grid item xs={12} md={4} lg={3} style={{ minWidth: 360 }}>
                            <Card>
                                <CardActionArea onClick={() => handleSelected("dashboarddisconnections")}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        style={{objectFit: "contain"}}
                                        className={classes.media}
                                        image={'https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/PROCESOSYCONSULTORIA/d4a7c4c3-1ff8-48ea-b10a-6a74a03142e4/desconexionestickets.png'}
                                        title={t(langKeys.disconnections)}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {t(langKeys.disconnections)}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>}
                        {(t(langKeys.dashboardkpi).toLowerCase().includes(searchValue.toLowerCase() ) && (user?.properties.environment==="CLARO")) && <Grid item xs={12} md={4} lg={3} style={{ minWidth: 360 }}>
                            <Card>
                                <CardActionArea onClick={() => handleSelected("dashboardkpi")}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        style={{objectFit: "contain"}}
                                        className={classes.media}
                                        image={'https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/PROCESOSYCONSULTORIA/d4a7c4c3-1ff8-48ea-b10a-6a74a03142e4/desconexionestickets.png'}
                                        title={t(langKeys.dashboardkpi)}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {t(langKeys.dashboardkpi)}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>}
                        {(t(langKeys.dashboardkpimonthly).toLowerCase().includes(searchValue.toLowerCase() ) && (user?.properties.environment==="CLARO")) && <Grid item xs={12} md={4} lg={3} style={{ minWidth: 360 }}>
                            <Card>
                                <CardActionArea onClick={() => handleSelected("dashboardkpimonthly")}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        style={{objectFit: "contain"}}
                                        className={classes.media}
                                        image={'https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/PROCESOSYCONSULTORIA/d4a7c4c3-1ff8-48ea-b10a-6a74a03142e4/desconexionestickets.png'}
                                        title={t(langKeys.dashboardkpimonthly)}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {t(langKeys.dashboardkpimonthly)}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>}
                        {t(langKeys.report_userproductivity).toLowerCase().includes(searchValue.toLowerCase()) && <Grid item xs={12} md={4} lg={3} style={{ minWidth: 360 }}>
                            <Card>
                                <CardActionArea onClick={() => handleSelected("dashboardassesorproductivity")}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        className={classes.media}
                                        image={productivity_advisors}
                                        title={t(langKeys.report_userproductivity)}
                                        style={{ objectFit: 'contain'}} 
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {t(langKeys.report_userproductivity)}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>}
                        {t(langKeys.opportunity_funnel).toLowerCase().includes(searchValue.toLowerCase()) && <Grid item xs={12} md={4} lg={3} style={{ minWidth: 360 }}>
                            <Card>
                                <CardActionArea onClick={() => handleSelected("dashboardopportunityfunnel")}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        className={classes.media}
                                        image={'https://publico-storage-01.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20SOPORTE/edcd2a86-977e-4fa2-9fcd-ef5d04f8fcd6/dashboard01.png'}
                                        title={t(langKeys.opportunity_funnel)}
                                        style={{ objectFit: 'contain'}}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {t(langKeys.opportunity_funnel)}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>}

                        {allDashboardsToShow.map((e:any, i:number) => (
                            <Grid item xs={12} md={4} lg={3} style={{ minWidth: 360 }} key={i}>
                                <DashboardCard
                                    dashboardtemplate={e}
                                    disabled={dashboardtemplateDelete.loading}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        goToDashboardLayout(e.dashboardtemplateid);
                                    }}
                                    onEdit={() => {
                                        history.push(paths.DASHBOARD_EDIT.resolve(e.dashboardtemplateid));
                                    }}
                                    onDuplicate={() => {
                                        history.push({
                                            pathname: paths.DASHBOARD_COPY,
                                            state: e,
                                        });
                                    }}
                                    onDelete={() => onDelete(e)}
                                />
                            </Grid>
                        ))}
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
                        breadcrumbs={[...arrayBread, {id: 'dashboardgerencial', name: t(langKeys.managerial) }]}
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
                        breadcrumbs={[...arrayBread, {id: 'dashboardproductivity', name: t(langKeys.productivity) }]}
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
                        breadcrumbs={[...arrayBread, {id: 'dashboardoperationalpush', name: t(langKeys.operationalpush) }]}
                        handleClick={handleSelected}
                    />
                    <DashboardOperationalPush/>
                </div>
            </Fragment>
        )
    }    
    else if(viewSelected === "dashboardtagranking"){
        return(
            
            <Fragment>
                <div style={{ width: '100%' }}>
                    <TemplateBreadcrumbs
                        breadcrumbs={[...arrayBread, {id: 'dashboardtagranking', name: t(langKeys.tagranking) }]}
                        handleClick={handleSelected}
                    />
                    <DashboardTagRanking/>
                </div>
            </Fragment>
        )
    }    
    else if(viewSelected === "dashboarddisconnections"){
        return(
            
            <Fragment>
                <div style={{ width: '100%' }}>
                    <TemplateBreadcrumbs
                        breadcrumbs={[...arrayBread, {id: 'dashboarddisconnections', name: t(langKeys.disconnections) }]}
                        handleClick={handleSelected}
                    />
                    <DashboardDisconnections/>
                </div>
            </Fragment>
        )
    }    
    else if(viewSelected === "dashboardkpi"){
        return(
            
            <Fragment>
                <div style={{ width: '100%' }}>
                    <TemplateBreadcrumbs
                        breadcrumbs={[...arrayBread, {id: 'dashboardkpi', name: t(langKeys.dashboardkpi) }]}
                        handleClick={handleSelected}
                    />
                    <DashboardKPI/>
                </div>
            </Fragment>
        )
    }    
    else if(viewSelected === "dashboardkpimonthly"){
        return(
            
            <Fragment>
                <div style={{ width: '100%' }}>
                    <TemplateBreadcrumbs
                        breadcrumbs={[...arrayBread, {id: 'dashboardkpimonthly', name: t(langKeys.dashboardkpimonthly) }]}
                        handleClick={handleSelected}
                    />
                    <DashboardKPIMonthly/>
                </div>
            </Fragment>
        )
    }    
    else if(viewSelected === "dashboardassesorproductivity"){
        return(
            
            <Fragment>
                <div style={{ width: '100%' }}>
                    <TemplateBreadcrumbs
                        breadcrumbs={[...arrayBread, {id: 'dashboardassesorproductivity', name: t(langKeys.report_userproductivity) }]}
                        handleClick={handleSelected}
                    />
                    <DashboardAssesorProductivity
                      row={row}
                      allFilters={allFilters}
                    />
                </div>
            </Fragment>
        )
    }
    else if(viewSelected === "dashboardopportunityfunnel"){
        return(

            <Fragment>
                <div style={{ width: '100%' }}>
                    <TemplateBreadcrumbs
                        breadcrumbs={[...arrayBread, {id: 'dashboardopportunityfunnel', name: t(langKeys.opportunity_funnel) }]}
                        handleClick={handleSelected}
                    />
                    <DashboardOpportunityFunnel
                        row={row}
                        allFilters={allFilters}
                    />
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
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    onEdit: (e: React.MouseEvent<HTMLLIElement>) => void;
    onDelete: (e: React.MouseEvent<HTMLLIElement>) => void;
    onDuplicate: (e: React.MouseEvent<HTMLLIElement>) => void;
}

const useDashboardCardStyles = makeStyles(theme => ({
    media: {
        objectFit: "none"
    },
}));

const DashboardCard: FC<DashboardCardProps> = ({
    dashboardtemplate,
    disabled,
    onClick,
    onEdit,
    onDelete,
    onDuplicate,
}) => {
    const classes = useDashboardCardStyles();
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
                    image="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/PROCESOSYCONSULTORIA/5444004f-d675-42cb-905f-27ea0604c0cf/image.png"
                    title={dashboardtemplate.description}
                />
                <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                        {dashboardtemplate.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
            {!isIncremental && 
            <>
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
                        onClick={e => {
                            onEdit(e);
                            setAnchorEl(null);
                        }}
                        disabled={disabled}
                    >
                        <Trans i18nKey={langKeys.edit} />
                    </MenuItem>
                    <MenuItem
                        onClick={e => {
                            onDuplicate(e);
                            setAnchorEl(null);
                        }}
                        disabled={disabled}
                    >
                        <Trans i18nKey={langKeys.duplicate} />
                    </MenuItem>
                    <MenuItem
                        onClick={e => {
                            onDelete(e);
                            setAnchorEl(null);
                        }}
                        disabled={disabled}
                    >
                        <Trans i18nKey={langKeys.delete} />
                    </MenuItem>
                </Menu>
            </>}
        </Card>
    );
}

export default Dashboard;
