import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { TemplateBreadcrumbs } from "components";
import { useTranslation } from "react-i18next";
import { resetAllMain } from 'store/main/actions';
import { langKeys } from "lang/keys";
import { showSnackbar, showBackdrop } from "store/popus/actions";
import { Intentions } from "pages/assistant/Intentions";
import { Entities } from "pages/assistant/Entities";
import TableZyx from "components/fields/table-simple";
import { Button } from "@material-ui/core";
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import CreateAssistant from "./CreateAssistant";



const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    title: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: theme.palette.text.primary,
    },
    container: {
        width: '100%',
        color: "#2e2c34",
    },
   
    containerDetails: {
        marginTop: theme.spacing(3)
    },       
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial',
        marginTop: 5
    },
}));

const GenerativeAI: React.FC<{arrayBread: any, setViewSelected: (view: string) => void}> = ({ setViewSelected, arrayBread }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [viewSelectedTraining, setViewSelectedTraining] = useState("view-1");
    const executeResult = useSelector(state => state.main.execute);
    const classes = useStyles();

    const newArrayBread = [
        ...arrayBread,
        { id: "generativeia", name: t(langKeys.generativeia) },
    ];

    const [waitSave, setWaitSave] = useState(false);

    
    const functionChange = (change:string) => {
        if(change === "generativeia"){
            setViewSelectedTraining("view-1")
        }else{
            setViewSelected(change);
        }
    }

    const columnsGenerativeIA = React.useMemo(
        () => [
            {
                Header: t(langKeys.name),
                accessor: 'name',
                NoFilter: true,
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                NoFilter: true,
            },
            {
                Header: t(langKeys.last_modification),
                accessor: 'last_modification',
                NoFilter: true,
            },
            {
                Header: t(langKeys.last_trainning),
                accessor: 'last_trainning',
                NoFilter: true,
            },
            {
                Header: t(langKeys.basemodel),
                accessor: 'basemodel',
                NoFilter: true,
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                NoFilter: true,
            },
            {
                Header: t(langKeys.chatwithassistant),
                accessor: 'chatwithassistant',
                NoFilter: true,
            },
        ],
        []
    );

    const ButtonsElement = () => {
        return (
            <div style={{display: 'flex', gap: '8px'}}>           
                <Button
                    variant="contained"
                    type="button"
                    color="primary"
                    startIcon={<ClearIcon color="secondary" />}
                    style={{ backgroundColor: "#FB5F5F" }}
                    onClick={() => setViewSelected("view-1")}
                >{t(langKeys.delete)}
                </Button>
                <Button
                    variant="contained"
                    type="button"
                    color="primary"
                    startIcon={<AddIcon color="secondary" />}
                    style={{ backgroundColor: "#55BD84" }}
                    onClick={() => setViewSelected("createassistant")}
                    
                >{t(langKeys.createssistant)}
                </Button>        
            </div>        
        )
    }

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

                    <div className={classes.containerDetails}>                          
                        <TableZyx
                            columns={columnsGenerativeIA}
                            titlemodule={t(langKeys.ai_assistants)}
                            data={[]}
                            filterGeneral={false}
                            download={true}
                            ButtonsElement={ButtonsElement}
                            useFooter = {true}
                            
                        />
                    </div>
                </div>
            </div>
        )  
    } else if (viewSelectedTraining === "createassistant") {
        return <CreateAssistant 
            setViewSelected={functionChange}
            arrayBread={arrayBread}
        /> 
    } else
        return null;

}

export default GenerativeAI;