import React, { ChangeEvent, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { TemplateBreadcrumbs, AntTab, AntTabPanel, TitleDetail  } from "components";
import { Trans, useTranslation } from "react-i18next";
import { resetAllMain } from 'store/main/actions';
import { langKeys } from "lang/keys";
import { showSnackbar, showBackdrop, manageConfirmation } from "store/popus/actions";
import { Button, Tabs } from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AssistantTabDetail from "./TabDetails/AssistantTabDetail";
import ParametersTabDetail from "./TabDetails/ParametersTabDetail";
import TrainingTabDetail from "./TabDetails/TrainingTabDetail";
import { useForm } from "react-hook-form";
import { Dictionary } from "@types";

const useStyles = makeStyles(() => ({
    container: {
        width: '100%',
        color: "#2e2c34",
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
    buttonscontainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '1rem',
        marginBottom: 10
    },
    purpleButton: {
        backgroundColor: '#ffff',
        color: '#7721AD'
    },
}));

type BreadCrumb = {
    id: string,
    name: string
}

interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
}

interface CreateAssistantProps {
    data: RowSelected;
    arrayBread: BreadCrumb[],
    setViewSelected: (view: string) => void,
    setExternalViewSelected: (view: string) => void
}

const CreateAssistant: React.FC<CreateAssistantProps> = ({
    data: {row, edit},
    setViewSelected,
    arrayBread,
    setExternalViewSelected
}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [waitSave, setWaitSave] = useState(false);
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

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            id: row?.assistantiid || 0,
            name: row?.name || '',
            description: row?.description || '',
            basemodel: row?.basemodel || '',
            language: row?.language || '',
            organizationname: row?.organizationname || '',
            querywithoutanswer: row?.querywithoutanswer || '',
            response: row?.response || '',
            prompt: row?.prompt || '',
            negativeprompt: row?.negativeprompt || '',
            generalprompt: row?.generalprompt || '',
            temperature: row?.temperature || 0,
            max_tokens: row?.max_tokens || 0,
            top_p: row?.top_p || 0,
            apikey: row?.apikey || '',
            type: row?.type || '',
            status: row?.status || '',
            operation: edit ? 'UPDATE' : 'INSERT',
        }
    });

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
                            <div className={classes.buttonscontainer}>
                                <Button
                                    variant="contained"
                                    type="button"
                                    startIcon={<ArrowBackIcon color="primary" />}
                                    className={classes.purpleButton}
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
                    <AssistantTabDetail row={row} setValue={setValue} getValues={getValues} errors={errors} />
                </AntTabPanel>
                <AntTabPanel index={1} currentIndex={tabIndex}>
                    <ParametersTabDetail row={row} setValue={setValue} getValues={getValues} errors={errors} />
                </AntTabPanel>
                <AntTabPanel index={2} currentIndex={tabIndex}>
                    <TrainingTabDetail />
                </AntTabPanel>
            </form>
        </>
    )
}

export default CreateAssistant;