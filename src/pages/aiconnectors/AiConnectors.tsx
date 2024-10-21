import React, { useEffect, useState } from 'react'; 
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateBreadcrumbs } from 'components';
import { getIntelligentModelsSel, getValuesFromDomain, insIntelligentModels } from 'common/helpers';
import { Dictionary } from "@types";
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { getCollection, resetAllMain, execute, getMultiCollection } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';
import { CellProps } from 'react-table';
import { Delete } from "@material-ui/icons";
import TableZyx from 'components/fields/table-simple';
import DetailIntelligentModels from './AiConnectorsDetail';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}

interface Breadcrumb {
    id: string;
    name: string;
}

interface IAConnectors {
    setExternalViewSelected?: (view: string) => void;
    arrayBread?: Breadcrumb[];
}

const AiConnectors: React.FC<IAConnectors> = ({ setExternalViewSelected, arrayBread }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);
    const mainPaginated = useSelector((state) => state.main.mainPaginated);
    const [selectedRows, setSelectedRows] = useState<Dictionary>({});
    const [rowWithDataSelected, setRowWithDataSelected] = useState<Dictionary[]>([]);
    const selectionKey = "id";
    const providerOptions = [
        { key: "Laraigo", value: "Laraigo" },
        { key: "IBM", value: "IBM" },
        { key: "OpenAI", value: "OpenAI" },
        { key: "Google", value: "Google" },
        { key: "Microsoft Azure", value: "Microsoft Azure" },
        { key: "Meta", value: "Meta" },
        { key: "Rasa", value: "Rasa" },
    ]   

    const functionChange = (change:string) => {
        if(change==="view-0"){
            setExternalViewSelected && setExternalViewSelected("view-1");
        }else{
            setViewSelected(change);
        }
    }

    const columns = React.useMemo(
        () => [          
            {
                Header: t(langKeys.name),
                accessor: 'name',
                NoFilter: false,
                width: '240px',
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                NoFilter: false,
                width: '200px',
            },
            {
                Header: t(langKeys.type_service),
                accessor: 'type',
                type: "select",
                listSelectFilter: [
                    { key: "Gen AI", value: "Gen AI" },
                    { key: "Assistant", value: "Assistant" },
                    { key: "Conversor de voz", value: "Conversor de voz" },
                ],                
                Cell: ({ cell: { value } }: CellProps<Dictionary>) => {
                    if (value === "LARGE LANGUAGE MODEL") {
                        return "Gen AI";
                    } else if (value === "WATSON ASSISTANT" || value === "RASA") {
                        return "Assistant";
                    } else {
                        return value;
                    }
                },
                width: '200px'                
            },                     
            {
                Header: t(langKeys.provider),
                accessor: 'provider',
                type: "select",
                listSelectFilter: providerOptions,                
                Cell: ({ row }: CellProps<Dictionary>) => {
                    const { type, provider } = row.original;
                    if (type === "WATSON ASSISTANT") {
                        return "IBM";
                    } else if (type === "RASA") {
                        return "Rasa";
                    } else {
                        return provider !== '' ? provider : t(langKeys.none);
                    }
                },
                width: '200px',
            },            
            {
                accessor: "createdate",
                Header: t(langKeys.timesheet_registerdate),
                NoFilter: false,               
                type: "date",
                sortType: "date",
                Cell: (props: CellProps<Dictionary>) => {
                    const { createdate } = props.cell.row.original || {};
                    if (createdate) {
                        const date = new Date(createdate);
                        return date.toLocaleString('es-PE', { day: 'numeric', month: 'numeric', year: 'numeric' });
                    }
                    return null;
                },
                width: '200px',                     
            },  
            {
                accessor: "registertime",
                Header: t(langKeys.registertime),
                NoFilter: false,              
                type: "time",  
                Cell: (props: CellProps<Dictionary>) => {
                    const { createdate } = props.cell.row.original || {};
                    if (createdate) {
                        const date = new Date(createdate)
                        return date.toLocaleString('es-PE', {day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false})
                        return date.toLocaleString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false})
                    }
                    return null;
                },             
                width: '200px',                                  
            },
            {
                Header: t(langKeys.createdBy),
                accessor: 'createby',
                NoFilter: false,               
                width: '300px',
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                type: "select",
                listSelectFilter: [
                    { key: "ACTIVO", value: "ACTIVO" },
                    { key: "DESACTIVO", value: "DESACTIVO" },                
                ],
                prefixTranslation: 'status_',
                width: 'auto'                         
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getIntelligentModelsSel(0)));

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([
            getValuesFromDomain("SERVICIOIA"),
        ]));

        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.intelligentmodels).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: false });
    } 

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }

    useEffect(() => {
        if (!(Object.keys(selectedRows).length === 0 && rowWithDataSelected.length === 0)) {
            const newRowWithDataSelected = Object.keys(selectedRows)
                .map((key) =>
                    mainResult.mainData.data.find((row) => row.id === parseInt(key)) ??
                    rowWithDataSelected.find((row) => row.id === parseInt(key)) ??
                    {}
                )
                .filter(row => row.id)    
            setRowWithDataSelected(newRowWithDataSelected);
        }
    }, [selectedRows, mainResult.mainData.data])
  
    const handleMassiveDelete = (dataSelected: Dictionary[]) => {
        const callback = () => {
            dataSelected.forEach(row => {
                const deleteOperation = {
                    ...row,
                    operation: 'DELETE',                   
                    status: 'ELIMINADO',
                    id: row.id
                } 
                dispatch(execute(insIntelligentModels(deleteOperation)))
            })
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }  
        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    if (viewSelected === "view-1") {
        return (            
            <div style={{ width: "100%", marginTop:'1rem', marginRight:'0.5rem' }}>
                {Boolean(arrayBread) && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TemplateBreadcrumbs
                        breadcrumbs={[...(arrayBread ?? []), { id: "view-1", name: t(langKeys.iaconnectors) }]}
                        handleClick={functionChange}
                    />
                </div>}
                <div style={{fontSize:'1.5rem', fontWeight:'bolder'}}>{t(langKeys.connectors)}</div>
                <TableZyx
                    ButtonsElement={() => {
                        if (!setExternalViewSelected) {
                            return (
                                <>
                                    <div style={{marginTop:'0rem'}}>
                                        <Button
                                            color="primary"
                                            disabled={mainPaginated.loading || Object.keys(selectedRows).length === 0}
                                            startIcon={<Delete style={{ color: "white" }} />}
                                            variant="contained"
                                            onClick={() => {
                                                handleMassiveDelete(rowWithDataSelected);
                                            }}
                                        >
                                            {t(langKeys.delete)}
                                        </Button>  
                                    </div>                                    
                                </>                             
                            )
                        } else {
                            return (
                                <Button
                                    disabled={mainResult.mainData.loading}
                                    variant="contained"
                                    type="button"
                                    color="primary"
                                    startIcon={<ClearIcon color="secondary" />}
                                    style={{ backgroundColor: "#FB5F5F" }}
                                    onClick={() => setExternalViewSelected("view-1")}
                                >
                                    {t(langKeys.back)}
                                </Button>
                            )
                        }
                    }}
                    autotrigger={true}
                    columns={columns}
                    data={mainResult.mainData.data}
                    filterGeneral={false}
                    handleRegister={handleRegister}
                    onClickRow={handleEdit}                    
                    loading={mainResult.mainData.loading}
                    register={true}
                    download={true}
                    useSelection={true}                  
                    selectionKey={selectionKey}
                    setSelectedRows={setSelectedRows}
                    titlemodule={window.location.href.includes("iaconectors")?" ":t(langKeys.intelligentmodels, { count: 2 })}
                />
            </div>
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailIntelligentModels
                data={rowSelected}
                setViewSelected={functionChange}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
                arrayBread2={arrayBread}
            />
        )
    } else
        return null;
}

export default AiConnectors