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
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import CreateAssistant from "./CreateAssistant";
import ChatAI from "./ChatAI";
import { execute, getCollection, resetAllMain } from "store/main/actions";
import { assistantAiSel, insAssistantAi } from "common/helpers";
import { Dictionary } from "@types";
import { CellProps } from "react-table";

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
    }
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

    const newArrayBread = [
        ...arrayBread,
        { id: "generativeia", name: t(langKeys.generativeailow) },       
    ];

    const [waitSave, setWaitSave] = useState(false);

    const handleRegister = () => {
        setViewSelectedTraining("createassistant")
        setRowSelected({ row: null, edit: false });
    };

    const handleEdit = (row: Dictionary) => {
        setViewSelectedTraining("createassistant")
        setRowSelected({ row, edit: true });
    };
    console.log(viewSelectedTraining)

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
          dispatch(
            execute(insAssistantAi({ ...row, id: row.assistantaiid, operation: "DELETE", status: "ELIMINADO", type: "NINGUNO" }))
          );
          dispatch(showBackdrop(true));
          setWaitSave(true);
        };
    
        dispatch(
          manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
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
                Header: t(langKeys.last_trainning),
                accessor: 'lasttraining',
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
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(assistantAiSel({id: 0, all: true})));

    useEffect(() => {
        fetchData();
    }, []);

    const ButtonsElement = () => {
        return (
            <div style={{display: 'flex', justifyContent: 'right', marginBottom: '1rem'}}>   
               <Button
                    variant="contained"
                    type="button"
                    startIcon={<GetAppIcon color="primary" />}
                    style={{ backgroundColor: '#ffff', color: '#7721AD' }}
                >
                    {t(langKeys.download)}
                </Button>
                <Button
                    variant="contained"
                    type="button"
                    color="primary"
                    startIcon={<AddIcon color="secondary" />}
                    style={{ backgroundColor: "#55BD84", marginLeft: 9 }}
                    onClick={handleRegister}
                >{t(langKeys.createssistant)}
                </Button>
                <Button
                    variant="contained"
                    type="button"
                    color="primary"
                    startIcon={<ChatBubbleIcon color="secondary" />}
                    style={{ backgroundColor: "#55BD84", marginLeft: 9 }}
                    onClick={() => setViewSelectedTraining("chatai")}
                >{t(langKeys.chat)}
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
        />
    } else return null;
}

export default GenerativeAIMainView;