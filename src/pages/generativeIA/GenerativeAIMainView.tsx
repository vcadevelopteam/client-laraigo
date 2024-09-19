import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { TemplateBreadcrumbs, TemplateIcons, TitleDetail } from "components";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { showSnackbar, showBackdrop, manageConfirmation } from "store/popus/actions";
import TableZyx from "components/fields/table-simple";
import { Button } from "@material-ui/core";
import GetAppIcon from '@material-ui/icons/GetApp';
import ForumIcon from '@material-ui/icons/Forum';
import AddIcon from '@material-ui/icons/Add';
import { Delete } from "@material-ui/icons";
import CreateAssistant from "./CreateAssistant";
import ChatAI from "./ChatAI";
import { execute, getCollection, getMultiCollectionAux } from "store/main/actions";
import { assistantAiSel, exportExcel, getIntelligentModelsSel, getValuesFromDomain, insAssistantAi } from "common/helpers";
import { Dictionary, IActionCall } from "@types";
import { CellProps } from "react-table";
import { deleteMassiveAssistant } from "store/gpt/actions";
import { massiveDeleteCollection } from "store/llama/actions";
import { massiveDeleteCollection3 } from "store/llama3/actions";
import { DownloadIcon } from "icons";

interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
}

const useStyles = makeStyles(() => ({
    titleandcrumbs: {
        marginBottom: 12,
        marginTop: 4,
    },
    container: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        flex: 1,
    },
    chatContainer: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer'
    },
    buttonsContainer: {
        display: 'flex',
        backgroundColor: "#fff",
        justifyContent: 'right',
        marginBottom: '1rem',
        padding:'0.2rem 0',
        gap:'0.5rem'
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: "14px",
        textTransform: "initial",
    },
    createButton: {
        backgroundColor: "#55BD84",
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
            backgroundColor: "#55BD84",
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
        }
    },
    purpleButton: {
        backgroundColor: "#7721AD",
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
            backgroundColor: "#7721AD",
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
        }
    },  
    downloadModelButton: {
        backgroundColor: '#ffff',
        color: '#7721AD',
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
            backgroundColor: "#ffff",
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
        }
    },
}));

type BreadCrumb = {
    id: string,
    name: string
}

interface GenerativeAIMainViewProps {
    arrayBread: BreadCrumb[];
    setViewSelected: (view: string) => void;  
}

const GenerativeAIMainView: React.FC<GenerativeAIMainViewProps> = ({ 
    setViewSelected,
    arrayBread,
}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [viewSelectedTraining, setViewSelectedTraining] = useState("assistantdetail")
    const executeResult = useSelector(state => state.main.execute);
    const classes = useStyles();
    const [rowSelected, setRowSelected] = useState<RowSelected>({
        row: null,
        edit: false,
    });
    const main = useSelector((state) => state.main.mainData);
    const selectionKey = "assistantaiid";
    const [selectedRows, setSelectedRows] = useState<Dictionary>({});
    const [rowWithDataSelected, setRowWithDataSelected] = useState<Dictionary[]>([]);
    const newArrayBread = [
        ...arrayBread,
        { id: "generativeia", name: t(langKeys.generativeailow) },
    ];
    const [waitSave, setWaitSave] = useState(false);
    const executeAssistants = useSelector((state) => state.gpt.gptResult);
    const llamaResult = useSelector((state) => state.llama.llamaResult);
    const [waitSaveAssistantsDelete, setWaitSaveAssistantDelete] = useState(false);
    const [assistantDelete, setAssistantDelete] = useState<Dictionary | null>(null);
    const [waitSaveAssistantDeleteLlama, setWaitSaveAssistantDeleteLlama] = useState(false)

    useEffect(() => {
        if (!(Object.keys(selectedRows).length === 0 && rowWithDataSelected.length === 0)) {
            setRowWithDataSelected((p) =>
                Object.keys(selectedRows).map(
                    (x) =>
                        main?.data.find((y) => y.assistantaiid === parseInt(x)) ??
                        p.find((y) => y.assistantaiid === parseInt(x)) ??
                        {}
                )
            );
        }
    }, [selectedRows]);

    const handleRegister = () => {
        setViewSelectedTraining("createassistant")
        setRowSelected({ row: null, edit: false });
    };

    const handleEdit = (row: Dictionary) => {
        setViewSelectedTraining("createassistant")
        setRowSelected({ row, edit: true });
    };

    const handleChat = (row: Dictionary) => {
        setViewSelectedTraining("chatai")
        setRowSelected({ row, edit: false });
    }

    useEffect(() => {
        if (waitSaveAssistantsDelete) {
            if (!executeAssistants.loading && !executeAssistants.error) {
                setWaitSaveAssistantDelete(false);
                dispatch(execute(insAssistantAi({
                        ...assistantDelete,
                        id: assistantDelete?.assistantaiid,
                        operation: "DELETE",
                        status: "ELIMINADO",
                        type: "NINGUNO" 
                    }))
                );
                setAssistantDelete(null);
                setWaitSave(true);
            } else if (executeAssistants.error) {
                const errormessage = t(executeAssistants.code || "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSaveAssistantDelete(false);
            }
        }
    }, [executeAssistants, waitSaveAssistantsDelete]);

    useEffect(() => {
        if (waitSaveAssistantDeleteLlama) {
            if (!llamaResult.loading && !llamaResult.error) {
                setWaitSaveAssistantDeleteLlama(false);
                dispatch(execute(insAssistantAi({
                        ...assistantDelete,
                        id: assistantDelete?.assistantaiid,
                        operation: "DELETE",
                        status: "ELIMINADO",
                        type: "NINGUNO" 
                    }))
                );
                setAssistantDelete(null);
                setWaitSave(true);
            } else if (llamaResult.error) {
                const errormessage = t(llamaResult.code || "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSaveAssistantDeleteLlama(false);
            }
        }
    }, [llamaResult, waitSaveAssistantDeleteLlama]);

    const handleDeleteSelection = async (dataSelected: Dictionary[]) => {
        const callback = async () => {
            dispatch(showBackdrop(true));  
            const codes = dataSelected.map(obj=> obj.code)
            dispatch(deleteMassiveAssistant({
                ids: codes,
                apikey: dataSelected[0].apikey,            
            }))

            dataSelected.map(async (row) => {          
                dispatch(
                    execute(insAssistantAi({
                        ...row,
                        id: row.assistantaiid,
                        operation: "DELETE",
                        status: "ELIMINADO",
                        type: "NINGUNO" 
                    }))
                );
            });
            setWaitSave(true);
        }
        console.log('ibm borrando', dataSelected[0].apikey)


        dispatch(
            manageConfirmation({
              visible: true,
              question: t(langKeys.confirmation_delete_all),
              callback,
            })
        );
    };

    const handleDeleteSelection3 = async (dataSelected: Dictionary[]) => {
        const callback = async () => {
            dispatch(showBackdrop(true));  
            const collections = dataSelected.map(obj=> obj.name)
            dispatch(massiveDeleteCollection3({
                names: collections,
            }))

            dataSelected.map(async (row) => {
                dispatch(
                    execute(insAssistantAi({
                        ...row,
                        id: row.assistantaiid,
                        operation: "DELETE",
                        status: "ELIMINADO",
                        type: "NINGUNO" 
                    }))
                );
            });
            setWaitSave(true);
        }

        dispatch(
            manageConfirmation({
              visible: true,
              question: t(langKeys.confirmation_delete_all),
              callback,
            })
        );
    }

    const handleDeleteSelection2 = async (dataSelected: Dictionary[]) => {
        const callback = async () => {
            dispatch(showBackdrop(true));  
            const collections = dataSelected.map(obj=> obj.name)
            dispatch(massiveDeleteCollection({
                names: collections,
            }))

            dataSelected.map(async (row) => {
                dispatch(
                    execute(insAssistantAi({
                        ...row,
                        id: row.assistantaiid,
                        operation: "DELETE",
                        status: "ELIMINADO",
                        type: "NINGUNO" 
                    }))
                );
            });
            setWaitSave(true);
        }

        dispatch(
            manageConfirmation({
              visible: true,
              question: t(langKeys.confirmation_delete_all),
              callback,
            })
        );
    };

    const handleDeleteBothSelection = (gptObjects: Dictionary[], watsonObjects: Dictionary[], llama3Objects: Dictionary[]) => {
        type Action = (args: { names: string[] }) => IActionCall
        const processDeletion = async (objects: Dictionary[], filterFn: (obj: Dictionary) => boolean, mapFn: (obj: Dictionary) => string, action: Action) => {
            const items = objects.filter(filterFn).map(mapFn);
            if (items.length > 0) {
                const actionResult = action({ names: items });
                await dispatch(actionResult);
            }
        }    
        const callback = async () => {
            dispatch(showBackdrop(true));
            try {
                await processDeletion(watsonObjects, obj => !obj.basemodel.startsWith('gpt') && !obj.basemodel.startsWith('llama'), obj => obj.name, massiveDeleteCollection);
                await processDeletion(llama3Objects, obj => obj.basemodel.startsWith('llama'), obj => obj.name, massiveDeleteCollection3);
                await processDeletion(gptObjects, obj => obj.basemodel.startsWith('gpt'), obj => obj.code, data => deleteMassiveAssistant({ ids: data, apikey: gptObjects[0].apikey }));                
                const dataSelected = [...gptObjects, ...watsonObjects, ...llama3Objects];
                const processedIds = new Set();        
                for (const row of dataSelected) {
                    if (!processedIds.has(row.assistantaiid)) {
                        processedIds.add(row.assistantaiid);
                        await dispatch(execute(insAssistantAi({ 
                            ...row, 
                            id: row.assistantaiid, 
                            operation: "DELETE", 
                            status: "ELIMINADO", 
                            type: "NINGUNO" 
                        })));
                    }
                }        
                setWaitSave(true);
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : "Ocurrió un error desconocido";
                dispatch(showSnackbar({ show: true, severity: "error", message }));
            } finally {
                dispatch(showBackdrop(false));
            }
        }       
        dispatch(manageConfirmation({ visible: true, question: t(langKeys.confirmation_delete_all), callback }));
    }
    
    const columnsGenerativeIA = React.useMemo(
        () => [
            {
                accessor: "assistantaiid",
                NoFilter: true,
                disableGlobalFilter: true,
                isComponent: true,
                minWidth: 60,
                width: "1%",
                Cell: (props: CellProps<Dictionary>) => {
                  const row = props.cell.row.original;
                  return (
                    <TemplateIcons
                      editFunction={() => handleEdit(row)}
                    />
                  );
                },
            },
            {
                Header: t(langKeys.name),
                accessor: 'name',
                width: "auto",
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                width: "auto",
            },
            {
                Header: t(langKeys.last_modification),
                accessor: 'changedate',
                width: "auto",
            },
            {
                Header: t(langKeys.basemodel),
                accessor: 'basemodel',
                width: "auto",
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                width: "auto",
            },
            {
                Header: t(langKeys.chatwithassistant),
                accessor: 'chatwithassistant',
                width: "auto",
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;
                    return (
                        <div
                            className={classes.chatContainer}
                            onClick={(event) => {
                                event.stopPropagation();
                                handleChat(row);
                            }}
                        >
                            <ForumIcon style={{ color: '#7721AD' }}/>
                            <span style={{ marginLeft: '5px' }}>
                                {t(langKeys.chat)}
                            </span>
                        </div>
                    );
                },
            },
        ],
        []
    );

    const columnsToExport = React.useMemo(
        () => [
            {
                Header: t(langKeys.name),
                accessor: 'name',
                width: "auto",
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                width: "auto",
            },
            {
                Header: t(langKeys.basemodel),
                accessor: 'basemodel',
                width: "auto",
            },
            {
                Header: t(langKeys.prompt),
                accessor: 'generalprompt',
                width: "auto",
            },
            {
                Header: t(langKeys.language),
                accessor: 'language',
                width: "auto",
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                width: "auto",
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(assistantAiSel({id: 0, all: true})));

    useEffect(() => {
        fetchData();
        dispatch(
            getMultiCollectionAux([
              getValuesFromDomain('ESTADOGENERICO'),
              getValuesFromDomain('QUERYWITHOUTANSWER'),
              getValuesFromDomain('BASEMODEL'),
              getIntelligentModelsSel(0),
            ])
          );
    }, []);

    const downloadSelectedModels = (selectedRows: Dictionary) => {
        const selectedIds = Object.keys(selectedRows).map(Number);
        const filteredData = main.data.filter(item => selectedIds.includes(item.assistantaiid));      
        if (filteredData.length === 0) return;      
        const jsonString = JSON.stringify(filteredData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Modelos.json');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const handleMassiveDelete = () => {
        if (rowWithDataSelected.every(obj => obj.basemodel.startsWith('gpt'))) {
            handleDeleteSelection(rowWithDataSelected);
        } else if (rowWithDataSelected.every(obj => obj.basemodel.startsWith('llama'))) {
            handleDeleteSelection3(rowWithDataSelected);
        } else if (rowWithDataSelected.every(obj => !obj.basemodel.startsWith('gpt') && !obj.basemodel.startsWith('llama'))) {
            handleDeleteSelection2(rowWithDataSelected);
        } else {
            const gptObjects = rowWithDataSelected.filter(obj => obj.basemodel.startsWith('gpt'));
            const llama3Objects = rowWithDataSelected.filter(obj => obj.basemodel.startsWith('llama'));
            const watsonObjetcs = rowWithDataSelected.filter(obj => !obj.basemodel.startsWith('gpt'));
            handleDeleteBothSelection(gptObjects, watsonObjetcs, llama3Objects)
        }
    }

    const ButtonsElement = () => {
        return (
            <>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <TitleDetail title={t(langKeys.ai_assistants)} />
                    <Button
                        variant="contained"
                        type="button"
                        disabled={Object.keys(selectedRows).length === 0}
                        startIcon={<GetAppIcon color={Object.keys(selectedRows).length === 0 ? "disabled" : "primary"}/>}
                        className={classes.downloadModelButton}
                        onClick={() => downloadSelectedModels(selectedRows)}
                    >
                        {t(langKeys.download) + " " + t(langKeys.model)}
                    </Button>
               </div>
                <div className={classes.buttonsContainer}>   
                    <Button
                            color="primary"
                            disabled={Object.keys(selectedRows).length === 0}
                            startIcon={<Delete style={{ color: "white" }} />}
                            variant="contained"
                            style={{marginLeft: 9}}
                            onClick={handleMassiveDelete}
                        >
                            {t(langKeys.delete)}
                        </Button>
                    <Button
                            variant="contained"
                            color="primary"
                            startIcon={<DownloadIcon />}
                            className={classes.purpleButton}
                            onClick={() => exportExcel('Asistentes IA', main.data, columnsToExport)}
                        >
                            {t(langKeys.download)}
                        </Button>                 
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<AddIcon color="secondary" />}
                            className={classes.createButton}
                            onClick={handleRegister}
                        >{t(langKeys.createssistant)}
                        </Button>
                 </div>        
            </>           
        )
    }

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                fetchData();
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

    const functionChange = (change:string) => {
        if(change === "generativeia"){
            setViewSelectedTraining("assistantdetail")
        }else{
            setViewSelected(change);
        }
    }

    if(viewSelectedTraining === 'assistantdetail') {
        return (
            <div className={classes.container}>
                <div className={classes.titleandcrumbs}>
                    <div style={{ flexGrow: 1}}>
                        <TemplateBreadcrumbs
                            breadcrumbs={newArrayBread}
                            handleClick={functionChange}
                        />
                    </div>
                </div>
                <TableZyx
                    columns={columnsGenerativeIA}
                    data={main.data}
                    filterGeneral={false}
                    ButtonsElement={ButtonsElement}
                    onClickRow={handleEdit}
                    selectionKey={selectionKey}
                    setSelectedRows={setSelectedRows}
                    useSelection={true}
                />
            </div>
        )
    } else if(viewSelectedTraining === 'createassistant') {
        return <CreateAssistant
            data={rowSelected}
            arrayBread={newArrayBread}
            fetchData={fetchData}
            setViewSelected={setViewSelectedTraining}
            setExternalViewSelected={functionChange}
        />
    } else if(viewSelectedTraining === 'chatai') {
        return <ChatAI
            setViewSelected={setViewSelectedTraining}
            row={rowSelected.row}
        />
    } else return null;
}

export default GenerativeAIMainView;