import React, { ChangeEvent, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { FieldEdit, FieldSelect, TemplateBreadcrumbs, AntTab, AntTabPanel, TitleDetail  } from "components";
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
    formcontainer: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },
    titleandcrumbs: {
        marginBottom: 12,
        marginTop: 4,
    },
}));

interface CreateAssistantProps {
    arrayBread: any,
    setViewSelected: (view: string) => void,
    setExternalViewSelected: (view: string) => void
    fetchData?: () => void;

}

const CreateAssistant: React.FC<CreateAssistantProps> = ({
    setViewSelected,
    fetchData,
    arrayBread,
    setExternalViewSelected
}) => {
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


    const onMainSubmit = ((data) => {
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
                        <div className={classes.titleandcrumbs}>
                            <div style={{ flexGrow: 1 }}>
                                <TemplateBreadcrumbs
                                    breadcrumbs={newArrayBread}
                                    handleClick={setExternalViewSelected}
                                />
                                <TitleDetail title={t(langKeys.createssistant)} />
                            </div>
                        </div>
                        <div className={classes.container}>     
                            <div id="assistant">
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: 10 }}>
                                    <Button
                                        variant="contained"
                                        type="button"
                                        startIcon={<ArrowBackIcon color="primary" />}
                                        style={{ backgroundColor: '#ffff', color: '#7721AD' }}
                                        onClick={() => setViewSelected('assistantdetail')}
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
                        <AssistantTabDetail />
                    </AntTabPanel>
                    <AntTabPanel index={1} currentIndex={tabIndex}>
                        <ParametersTabDetail />
                    </AntTabPanel>
                    <AntTabPanel index={2} currentIndex={tabIndex}>
                        <TrainingTabDetail />
                    </AntTabPanel>
                </form>
            </>
        )
    }  else return null;
}

export default CreateAssistant;