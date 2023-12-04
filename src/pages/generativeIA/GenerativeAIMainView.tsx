import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { TemplateBreadcrumbs, TitleDetail } from "components";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { showSnackbar, showBackdrop } from "store/popus/actions";
import TableZyx from "components/fields/table-simple";
import { Button } from "@material-ui/core";
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import CreateAssistant from "./CreateAssistant";

const useStyles = makeStyles((theme) => ({
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
    button: {
        backgroundColor: "#55BD84",
        marginLeft: theme.spacing(1.2),
        "&:hover": {
            backgroundColor: "#55BD84",
        },
    },
}));

interface GenerativeAIMainViewProps {
    setViewSelected: (view: string) => void;
    arrayBread: any;
}

const GenerativeAIMainView: React.FC<GenerativeAIMainViewProps> = ({ 
    setViewSelected,
    arrayBread,
}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [viewSelectedTraining, setViewSelectedTraining] = useState("generativeia")
    const executeResult = useSelector(state => state.main.execute);
    const classes = useStyles();

    const newArrayBread = [
        ...arrayBread,
        { id: "generativeia", name: t(langKeys.generativeia) },
        { id: "generativeia", name: t(langKeys.generativeiamodels)}
    ];

    const [waitSave, setWaitSave] = useState(false);

    const columnsGenerativeIA = React.useMemo(
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
                Header: t(langKeys.last_modification),
                accessor: 'last_modification',
                width: "auto",
            },
            {
                Header: t(langKeys.last_trainning),
                accessor: 'last_trainning',
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

    const ButtonsElement = () => {
        return (
            <div style={{display: 'flex', justifyContent: 'right'}}>           
                <Button
                    variant="contained"
                    type="button"
                    color="primary"
                    startIcon={<ClearIcon color="secondary" />}
                    style={{ backgroundColor: "#FB5F5F" }}
                >{t(langKeys.delete)}
                </Button>
                <Button
                    variant="contained"
                    type="button"
                    color="primary"
                    startIcon={<AddIcon color="secondary" />}
                    style={{ backgroundColor: "#55BD84", marginLeft: 9 }}
                    onClick={() => setViewSelectedTraining("createassistant")}
                >{t(langKeys.createssistant)}
                </Button>        
            </div>        
        )
    }

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

    if(viewSelectedTraining === 'generativeia') {
        return (
            <div className={classes.container}>
                <div className={classes.titleandcrumbs}>
                    <div style={{ flexGrow: 1}}>
                        <TemplateBreadcrumbs
                            breadcrumbs={newArrayBread}
                            handleClick={(view) => setViewSelected(view)}
                        />
                        <TitleDetail title={t(langKeys.ai_assistants)} />
                    </div>
                </div>
                <TableZyx
                    columns={columnsGenerativeIA}
                    data={[]}
                    filterGeneral={false}
                    useSelection={true}
                    download={true}
                    ButtonsElement={ButtonsElement}
                />
            </div>
        )
    } else if(viewSelectedTraining === 'createassistant') {
        return <CreateAssistant
            arrayBread={newArrayBread}
            setViewSelected={setViewSelectedTraining}
            setExternalViewSelected={setViewSelected}
        />
    } else return null;
}

export default GenerativeAIMainView;