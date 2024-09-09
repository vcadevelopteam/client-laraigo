import React, { useEffect, useState } from 'react'; 
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { TemplateBreadcrumbs } from 'components';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { getCollectionAux, resetAllMain } from 'store/main/actions';
import { showSnackbar, showBackdrop } from 'store/popus/actions';
import {Box } from '@material-ui/core';
import { BreadCrumb, Dictionary } from '@types';
import TableZyx from 'components/fields/table-simple';
import { CellProps } from 'react-table';
import { rasaModelSel, selUtterance } from 'common/helpers';
import { IntentionsRasa } from 'pages/rasa/IntentionsRasa';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}

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
    labellink: {
        color: '#7721ad',
        textDecoration: 'underline',
        cursor: 'pointer'
    },  
}));

const WatsonX: React.FC<{arrayBread: BreadCrumb[], setViewSelected: (view: string) => void}> = ({ setViewSelected, arrayBread }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [viewSelectedTraining, setViewSelectedTraining] = useState("view-1");
    const executeResult = useSelector(state => state.main.execute);
    const classes = useStyles();
    const selectionKey = "id";
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });

    const newArrayBread = [
        ...arrayBread,
        { id: "corporateia", name:  "Empresarial" },
        { id: "watsonx", name:  "WATSONX ASSISTANT" },
    ];
    const [waitSave, setWaitSave] = useState(false);

    const simulatedData = [
        {
            name: "Connector 1",
            description: "This is the first WatsonX connector.",
            language: "HTML",
            tintentionsype: "Intent 1",
            entities: "Entity 1",
            updateddate: "2024-01-29 15:33:53.076646Z",
        },        
    ];
    
    const columns = React.useMemo(
        () => [            
            {
                Header: t(langKeys.name),
                accessor: 'name',
                width: 'auto',
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;
                    return (
                        <label
                            className={classes.labellink}
                            onClick={() => {      
                                dispatch(getCollectionAux(selUtterance(row?.name||"")))                  
                                setViewSelected("view-2");
                                setRowSelected({ row: row, edit: true })
                            }}
                        >
                            {row.name}
                        </label>
                    )
                }
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                width: 'auto',
            },
            {
                Header: t(langKeys.language),
                accessor: "language",
                type: "select",
                listSelectFilter: [
                    { key: "Español", value: "Español" },
                    { key: "Inglés", value: "Inglés" },                   
                ],
                width: 'auto',               
            },
            {
                Header: t(langKeys.intentions),
                accessor: 'tintentionsype',
                width: 'auto',
            },    
            {
                Header: t(langKeys.entities),
                accessor: 'entities',
                width: 'auto',
            },     
            {
                Header: t(langKeys.updateddate),
                accessor: 'updateddate',
                type: 'date',
                sortType: 'datetime',  
                width: 'auto', 
                Cell: (props: CellProps<Dictionary>) => {
                    const { updateddate } = props.cell.row.original || {};
                    if (updateddate) {
                        const date = new Date(updateddate)
                        return date.toLocaleString('es-PE', {day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false})
                    }
                    return null;
                },   
            },           
        ],
        []
    );

    const fetchData = () => dispatch(getCollectionAux(rasaModelSel()))
    const functionChange = (change:string) => {
        if(change === "watsonx"){
            setViewSelectedTraining("view-1")
            fetchData()
        }else if (change === "skill") {
            setViewSelectedTraining("view-2")
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
                            {'Skills'}
                        </span>
                    </Box>
                </div>
                <div style={{ width: "100%" }}>
                    <TableZyx
                        columns={columns}                    
                        data={simulatedData}
                        useSelection={true}                  
                        selectionKey={selectionKey}
                        download={true}
                        filterGeneral={false}
                    />
                </div>
            </div>
        )
    }
    else if (viewSelectedTraining === "view-2") {
        return (
            <IntentionsRasa 
                //data={rowSelected}
                setExternalViewSelected={functionChange}
                arrayBread={newArrayBread}
            />
        )
    } else
        return null;
    
}

export default WatsonX;