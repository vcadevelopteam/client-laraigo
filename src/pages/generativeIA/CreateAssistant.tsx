import React, { ChangeEvent, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { FieldEdit, FieldSelect, TemplateBreadcrumbs, AntTab, AntTabPanel  } from "components";
import { Trans, useTranslation } from "react-i18next";
import { resetAllMain } from 'store/main/actions';
import { langKeys } from "lang/keys";
import { showSnackbar, showBackdrop, manageConfirmation } from "store/popus/actions";
import { Box, Button, Card, Grid, Tabs } from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { SynonimsRasaLogo } from "icons";
import GenerativeAIMainView from "./GenerativeAIMainView";
import { Dictionary } from "@types";
import { useForm } from "react-hook-form";
import AssistantTabDetail from "./TabDetails/AssistantTabDetail";
import ParametersTabDetail from "./TabDetails/ParametersTabDetail";
import TrainingTabDetail from "./TabDetails/TrainingTabDetail";


interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
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
        marginTop: '1rem',      
    },
    button: {
        display: "flex",
        gap: "10px",
        alignItems: "center",
    },
    tabs: {
        color: "#989898",
        backgroundColor: "white",
    },
    titleandbuttons: {
        display: "flex",
        justifyContent: "space-between",
    },
    formcontainer: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },
}));

interface CreateAssistantProps {
    data: RowSelected;
    arrayBread: any,
    setViewSelected: (view: string) => void,
    setExternalViewSelected: (view: string) => void
    fetchData?: () => void;

}


const CreateAssistant: React.FC<CreateAssistantProps> = ({
    data = { row: null, edit: false }, 
    setViewSelected,
    fetchData,
    arrayBread,
    setExternalViewSelected
}) => {
    const { row, edit } = data;
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [waitSave, setWaitSave] = useState(false);
    const [viewSelectedTraining, setViewSelectedTraining] = useState("createssistant")
    const executeResult = useSelector(state => state.main.execute);
    const classes = useStyles();
    const [tabIndex, setTabIndex] = useState(0);
    


    const newArrayBread = [
        ...arrayBread,
        { id: "createssistant", name: t(langKeys.createssistant) },       
    ];

    const {
        register,
        handleSubmit: handleMainSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm({
        defaultValues: {
            warehouseid: row?.warehouseid || 0,
            operation: edit ? "EDIT" : "INSERT",
            type: row?.type || "",
            name: row?.name || "",
            description: row?.description || "",
            address: row?.address || "",
            phone: row?.phone || "",
            latitude: row?.latitude || "",
            longitude: row?.longitude || "",
            status: row?.status || "ACTIVO",
        },
    });


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


    const onMainSubmit = handleMainSubmit((data) => {
        const callback = () => {
            dispatch(showBackdrop(true));
            //dispatch(execute(insWarehouse(data)));

            setWaitSave(true);
        };
        dispatch(
            manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback,
            })
        );
    });

	const handleChangeTab = (event: ChangeEvent<NonNullable<unknown>>, newIndex: number) => {
        setTabIndex(newIndex);
    };

    if(viewSelectedTraining === 'createssistant') {
        return (
            <>
            <form onSubmit={onMainSubmit} className={classes.formcontainer}>
                <div style={{ width: "100%" }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <TemplateBreadcrumbs
                            breadcrumbs={newArrayBread}
                            handleClick={(view) => setExternalViewSelected(view)}
                        />
                    </div>
                    <div className={classes.container}>     
                        <div id="assistant">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '1rem' }}>
                                    <Box className={classes.containerHeader}>
                                        <span className={classes.title}>
                                            {t(langKeys.createssistant)}
                                        </span>
                                    </Box>
                                </div>
        
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                    <Button
                                        variant="contained"
                                        type="button"
                                        startIcon={<ArrowBackIcon color="primary" />}
                                        style={{ backgroundColor: '#ffff', color: '#7721AD' }}
                                        onClick={() => setViewSelected('generativeia')}
                                    >
                                        {t(langKeys.return)}
                                    </Button>
        
                                    <Button
                                        variant="contained"
                                        type="button"
                                        color="primary"
                                        startIcon={<SaveIcon color="secondary" />}
                                        style={{ backgroundColor: '#55BD84' }}
                                    >
                                        {t(langKeys.save)}
                                    </Button>
                                </div>
                            </div>
        
                          
                        </div>
                       
                    </div>
                </div>
                <Tabs
                    value={tabIndex}
                    onChange={handleChangeTab}
                    className={classes.tabs}
                    textColor="primary"
                    indicatorColor="primary"
                    variant="fullWidth"
                >
                    <AntTab
                        label={
                            <div>
                                <Trans i18nKey={langKeys.assistant_singular} />
                            </div>
                        }
                    />
                    <AntTab
                        label={
                            <div>
                                <Trans i18nKey={langKeys.parameters} />
                            </div>
                        }
                    />
                    <AntTab
                        label={
                            <div>
                                <Trans i18nKey={langKeys.training} />
                            </div>
                        }
                    />
                </Tabs>
                <AntTabPanel index={0} currentIndex={tabIndex}>
                    <AssistantTabDetail row={row} setValue={setValue} getValues={getValues} errors={errors} />
                </AntTabPanel>
                <AntTabPanel index={1} currentIndex={tabIndex}>
                    <ParametersTabDetail  row={row} setValue={setValue} getValues={getValues} errors={errors} />
                </AntTabPanel>
                <AntTabPanel index={2} currentIndex={tabIndex}>
                    <TrainingTabDetail row={row} setValue={setValue} getValues={getValues} errors={errors} />
                </AntTabPanel>


            </form>
        </>
        )
    }  else return null;

   
}

export default CreateAssistant;