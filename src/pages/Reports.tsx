import React, { FC, useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { CircularProgress } from '@material-ui/core';
import TablePaginated from 'components/fields/table-paginated';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { TemplateBreadcrumbs, SearchField, FieldSelect } from 'components';
import { useForm } from 'react-hook-form';
import { useSelector } from 'hooks';
import { Dictionary, IFetchData, MultiData,IRequestBody } from "@types";
import { getReportSel, getReportColumnSel, getReportFilterSel, getValuesFromDomain, getPaginatedForReports, getReportExport } from 'common/helpers';
import { getCollection, resetMain, getCollectionPaginated, resetCollectionPaginated, exportData, getMultiCollection, resetMultiMain } from 'store/main/actions';
import { showSnackbar, showBackdrop } from 'store/popus/actions';
import { useDispatch } from 'react-redux';
import { reportsImage } from '../icons/index';

interface ItemProps {
    setViewSelected: (view: string) => void;
    row: Dictionary | null;
    multiData: MultiData[];
    allFilters: Dictionary[];
}

interface parameter{
    key: string;
    value: any;
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
        width: '100%'
    },
    root: {
        maxWidth: 340
    },
    media: {
        height: 140,
        backgroundSize: "auto"
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



const ReportItem: React.FC<ItemProps> = ({setViewSelected, row, multiData, allFilters}) => {
    const { t } = useTranslation();      
    const classes = useStyles();
    const dispatch = useDispatch();
    const reportColumns = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const mainPaginated = useSelector(state => state.main.mainPaginated);
    const resExportData = useSelector(state => state.main.exportData);
    const [pageCount, setPageCount] = useState(0);
    const [waitSave, setWaitSave] = useState(false);
    const [totalrow, settotalrow] = useState(0);
    const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({ pageSize: 0, pageIndex: 0, filters: {}, sorts: {}, daterange: null })
    const columns = React.useMemo(() => [{Header: 'null', accessor: 'null'}],[]);

    let allParameters = {};
    let allParameters2: parameter[] =[];

    if ( multiData.length > 0 ) {
        reportColumns.map(x => (        
            columns.push({Header: t('report_'+row?.origin+'_'+x.proargnames||''), accessor: x.proargnames})
            )
        );

        columns.shift();
    }

    useEffect(() => {
        if (!mainPaginated.loading && !mainPaginated.error) {
            setPageCount(Math.ceil(mainPaginated.count / fetchDataAux.pageSize));
            settotalrow(mainPaginated.count);
        }
    }, [mainPaginated]);

    useEffect(() => {
        if (waitSave) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(showBackdrop(false));
                setWaitSave(false);
                window.open(resExportData.url, '_blank');
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [resExportData, waitSave]);

    const triggerExportData = ({ filters, sorts, daterange }: IFetchData) => {
        dispatch(exportData(getReportExport(
            row?.methodexport||'',
            row?.origin||'',
            {
            filters,
            sorts,
            startdate: daterange.startDate!,
            enddate: daterange.endDate!
        })));
        dispatch(showBackdrop(true));
        setWaitSave(true);
    };

    const fetchData = ({ pageSize, pageIndex, filters, sorts, daterange }: IFetchData) => {

        console.log('allParameters',allParameters);
        console.log('...allParameters',{...allParameters});       
        console.log('...allParameters2',{...allParameters2});

        setfetchDataAux({ pageSize, pageIndex, filters, sorts, daterange });
        dispatch(getCollectionPaginated(getPaginatedForReports(
            row?.methodcollection||'',
            row?.methodcount||'',
            row?.origin||'',
            {
            startdate: daterange.startDate!,
            enddate: daterange.endDate!,
            take: pageSize,
            skip: pageIndex,
            sorts: sorts,
            filters: filters,
            ...allParameters2
            }
        )));
    };

    const handleSelected = () => {
        dispatch(resetCollectionPaginated());
        dispatch(resetMultiMain());
        setViewSelected("view-1");
    }

    const setValue = (optionValue: any, parameterName: any, value: any) => {
        Object.defineProperty(allParameters, parameterName, {value: value[optionValue], writable: true});
        allParameters2.push({key: parameterName, value: value[optionValue]});
    }

    return  (
        <div>
            <TemplateBreadcrumbs
                breadcrumbs={arrayBread}
                handleClick={handleSelected}
            />
            {multiData.length > 0 ?
                <div className={classes.container}>                    
					 {allFilters?
                        <div>
                            {
                                allFilters.map( filtro => (
                                        <FieldSelect
                                            label={t('report_'+row?.origin+'_filter_'+filtro.values[0].label||'')}
                                            className="col-6"
                                            key={filtro.values[0].filter}
                                            valueDefault=""
                                            //onChange={(value) => setValue('communicationchanneldesc', value ? value.domainvalue : '')}
                                            onChange={(value) => setValue(filtro.values[0].optionValue, filtro.values[0].parameterName, value ? value : '')}
                                            error=""
                                            data={multiData[multiData.findIndex(x => x.key === filtro.values[0].filter)].data}
                                            optionDesc= {filtro.values[0].optionDesc}
                                            optionValue= {filtro.values[0].optionValue}
                                        />
                                    )
                                )
                            }
                        </div> :``
                    }                   
                    <TablePaginated
                        columns={columns}
                        data={mainPaginated.data}
                        totalrow={totalrow}
                        loading={mainPaginated.loading}
                        pageCount={pageCount}
                        filterrange={true}
                        download={true}
                        fetchData={fetchData}
                        exportPersonalized={triggerExportData}
                        titlemodule={row?.description||''} 
                    />
                </div> :
                <div className={classes.container} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <h2>Cargando...</h2>
                    <CircularProgress />
                    <CircularProgress color="secondary"/>
                </div>
            }
        </div>
    ); 
}

const Reports: FC = () => {
    const { t } = useTranslation();    
    const classes = useStyles();
    const dispatch = useDispatch();     
    const reportsResult = useSelector(state => state.main);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [reports, setReports] = useState<Dictionary[]>([]);
    const [rowSelected, setRowSelected] = useState<Dictionary>([]);
    const fetchData = () => dispatch(getCollection(getReportSel('')));

    useEffect(() => {        
        dispatch(resetCollectionPaginated()); 
        dispatch(resetMultiMain());
        fetchData();
        
        return () => {
            dispatch(resetCollectionPaginated());            
            dispatch(resetMultiMain());
            dispatch(resetMain());
        };
        
    }, []);

    const handleFiend = (valor: string) => {        
        const filteredReports = reportsResult.mainData.data.filter(report => (`${report.description}`.toLowerCase().includes(valor.toLowerCase())))
        setReports(filteredReports);
    }

    const handleSelected = (row: Dictionary, allFilters: Dictionary[]) => {
        dispatch(resetCollectionPaginated());
        dispatch(resetMultiMain());       
        setRowSelected(row);

        let allRequestBody: IRequestBody[] = [];
        allRequestBody.push(getReportColumnSel(row?.methodcollection || ""));

        if (allFilters) {
            allFilters.sort((a, b) => a.order - b.order);
            allFilters.map(x => { allRequestBody.push(getReportFilterSel(String(x.values[0].filter))) });
        }

        dispatch(getMultiCollection(allRequestBody));
        setViewSelected("view-2");
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
                    <Container className={classes.containerDetails}>
                        <Grid container spacing={3}>
                            {
                                (reports.length > 0 ? reports : reportsResult.mainData.data).map (
                                    report => (
                                        <Grid item key={report.reportid} xs={12} md={6} lg={4}>
                                            <Card className={classes.root}>
                                                <CardActionArea onClick={() => handleSelected(report, report.filters)}>
                                                    <CardMedia
                                                        className={classes.media}                                                   
                                                        component= {report.component}
                                                        image = {reportsImage.find(x => x.name === report.image)?.image||'no_data.png'}
                                                        title={report.description}                                                        
                                                    />
                                                    <CardContent>
                                                        <Typography gutterBottom variant="h5" component="h2">
                                                            {report.description}
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
                    multiData={reportsResult.multiData.data}
                    allFilters={rowSelected.filters}
                />
            </div>
        )
    }
}

export default Reports;