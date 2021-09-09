import React, { FC, useEffect, useState } from 'react';
import TableZyx from '../components/fields/table-simple';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { TemplateBreadcrumbs, SearchField } from 'components';
import { useSelector } from 'hooks';
import { Dictionary } from "@types";
import { getFunctionSel, getReportSel } from 'common/helpers';
import { getCollection, getCollectionAux, resetMain, resetMainAux }  from 'store/main/actions';
import { useDispatch } from 'react-redux';

interface ItemProps {
    setViewSelected: (view: string) => void;
    row: Dictionary | null;
    fetchData?: () => void;
}

const arrayBread = [
    { id: "view-1", name: "Reports" },
    { id: "view-2", name: "Reports detail" }
];

const useStyles = makeStyles((theme) => ({
    container: {
        width: '100%'
    },
    containerDetails: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),        
        background: '#fff',
        width: '100%'
    },
    root: {
        maxWidth: 345
    },
    media: {
        height: 140
    },
    containerSearch: {
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '50%',
        },
    },
    containerFilterGeneral: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: theme.spacing(2),
    },
    title: {
        fontSize: '22px',
        lineHeight: '48px',
        fontWeight: 'bold',
        height: '48px',
        color: theme.palette.text.primary,
    },
    containerHeader: {
        display: 'block',
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        },
    }
}));

const ReportItem: React.FC<ItemProps> = ({setViewSelected, row, fetchData}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const [dataReport, setdataReport] = useState<Dictionary[]>([]);
    const detailRes = useSelector(state => state.main.mainAux);
    
    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.domain),
                accessor: 'domainname',
                NoFilter: true
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                NoFilter: true
            },
            {
                Header: t(langKeys.type),
                accessor: 'type',
                NoFilter: true
            },
            {
                Header: t(langKeys.corporation),
                accessor: 'corpdesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.organization),
                accessor: 'orgdesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                NoFilter: true
            }
        ],
        []
    );

    const handleSelected = () => {
        setViewSelected("view-1");
    }

    useEffect(() => {
        dispatch(resetMainAux());
        dispatch(getCollectionAux(getFunctionSel(row?.function||'','',0)));
    }, [row]);

    return  (
        <div >
             <TemplateBreadcrumbs
                breadcrumbs={arrayBread}
                handleClick={handleSelected}
            />
            
            <TableZyx
                columns={columns}
                titlemodule={row?.description||''}
                data={detailRes.data}
                download={true}
                //loading={detailRes.loading}
                //filterGeneral={false}
                //register={false}
                //handleRegister={handleRegister}
            />
        </div>
    ); 
}

const Reports: FC = () => {
    const { t } = useTranslation();    
    const classes = useStyles();
    const dispatch = useDispatch();     
    const fetchData = () => dispatch(getCollection(getReportSel('')));
    const reportsResult = useSelector(state => state.main);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [reports, setReports] = useState<Dictionary[]>([]);
    const [rowSelected, setRowSelected] = useState<Dictionary>([]);

    useEffect(() => {
        fetchData();
        
        return () => {
            dispatch(resetMain());
        };
        
    }, []);

    const handleFiend = (valor: string) => {        
        const filteredReports = reportsResult.mainData.data.filter(report => (`${report.description}`.toLowerCase().includes(valor.toLowerCase())))
        setReports(filteredReports);
    }

    const handleSelected = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected(row);
    }

    if (viewSelected === "view-1") {
        return  (
            <div className={classes.container}>
                <Box className={classes.containerHeader} justifyContent="space-between" alignItems="center" mb="30px">
                    <span className={classes.title}>
                        {t(langKeys.report_plural)}
                    </span>
                </Box>
                <Box className={classes.containerFilterGeneral}>                    
                    <span></span>
                    <div className={classes.containerSearch}>
                        <SearchField
                            colorPlaceHolder='#FFF'
                            handleChangeOther={handleFiend}
                            lazy
                        />
                    </div>
                </Box>   
                <div className={classes.containerDetails}>
                    <Container>
                        <Grid container spacing={3}>
                            {
                                (reports.length > 0 ? reports : reportsResult.mainData.data).map (
                                    report => (
                                        <Grid item key={report.reportid} xs={12} md={6} lg={4}>
                                            <Card className={classes.root}>
                                                <CardActionArea onClick={() => handleSelected(report)}>
                                                    <CardMedia
                                                        className={classes.media}
                                                        image="https://www.hotelogix.com/images/Tomardecisionesbasadasendatos.png"                                                        
                                                        title= {report.description}
                                                    />
                                                    <CardContent>
                                                        <Typography gutterBottom variant="h5" component="h2">
                                                            {report.description}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary" component="p">
                                                            
                                                        </Typography>                                                    
                                                    </CardContent>
                                                </CardActionArea>      
                                            </Card>
                                        </Grid>
                                    )
                                )
                            }
                        </Grid>
                    </Container>
                </div>  
            </div>
        );
    } else {
        return (
            <div>
                <ReportItem
                    setViewSelected={setViewSelected}
                    row={rowSelected}
                    fetchData={fetchData}
                />
            </div>
        )
    }
}

export default Reports;