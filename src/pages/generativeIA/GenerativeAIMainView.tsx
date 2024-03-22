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
import { Dictionary } from "@types";
import { CellProps } from "react-table";
import { deleteAssistant, deleteMassiveAssistant } from "store/gpt/actions";

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
        justifyContent: 'right',
        marginBottom: '1rem'
    },
    purpleButton: {
        backgroundColor: '#ffff',
        color: '#7721AD'
    },
    createButton: {
        backgroundColor: "#55BD84",
        marginLeft: 9
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
    const user = useSelector(state => state.login.validateToken.user);
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
    const [selectedRows, setSelectedRows] = useState<any>({});
    const [rowWithDataSelected, setRowWithDataSelected] = useState<Dictionary[]>([]);
    const newArrayBread = [
        ...arrayBread,
        { id: "generativeia", name: t(langKeys.generativeailow) },       
    ];
    const [waitSave, setWaitSave] = useState(false);

    const executeAssistants = useSelector((state) => state.gpt.gptResult);
    const [waitSaveAssistantsDelete, setWaitSaveAssistantDelete] = useState(false);
    const [assistantDelete, setAssistantDelete] = useState<Dictionary | null>(null);


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

    const handleDelete = (row: Dictionary) => {
        const callback = async () => {
            dispatch(showBackdrop(true));
            dispatch(deleteAssistant({
                assistant_id: row.code,
                apikey: row.apikey,
            }))
            setAssistantDelete(row)
            setWaitSaveAssistantDelete(true);  
        };
    
        dispatch(
          manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback,
          })
        );
    };
    
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

        dispatch(
            manageConfirmation({
              visible: true,
              question: t(langKeys.confirmation_delete_all),
              callback,
            })
        );
    };
    
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
                      deleteFunction={() => handleDelete(row)}
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
    const ButtonsElement = () => {
        return (
            <div className={classes.buttonsContainer}>   
               <Button
                    variant="contained"
                    type="button"
                    startIcon={<GetAppIcon color="primary" />}
                    className={classes.purpleButton}
                    onClick={() => exportExcel('Asistentes IA', main.data, columnsToExport)}
                >
                    {t(langKeys.download)}
                </Button>
                <Button
                    color="primary"
                    disabled={Object.keys(selectedRows).length === 0}
                    startIcon={<Delete style={{ color: "white" }} />}
                    variant="contained"
                    style={{marginLeft: 9}}
                    onClick={() => {
                        handleDeleteSelection(rowWithDataSelected);
                    }}
                >
                    {t(langKeys.delete)}
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
                        <TitleDetail title={t(langKeys.ai_assistants)} />
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