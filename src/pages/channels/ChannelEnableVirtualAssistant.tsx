import React, { FC, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Breadcrumbs, Button, Link, makeStyles } from "@material-ui/core";
import { Trans, useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import Input from "@material-ui/core/Input";

import paths from "common/constants/paths";
import { IChannel } from "@types";
import { useLocation } from "react-router-dom";
import { FieldSelect } from "components";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import Tooltip from "@material-ui/core/Tooltip";
import InfoRoundedIcon from "@material-ui/icons/InfoRounded";
import { execute, getCollectionAux } from "store/main/actions";
import { getTemplatesChatflow, templatesChatflowClone } from "common/helpers";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import { useSelector } from "hooks";

const useStyles = makeStyles(() => ({
    maincontainer: {
        width: "700px",
        marginLeft: "auto",
        marginRight: "auto",
        display: "flex",
        flexDirection: "column",
        flex: "wrap",
    },
    headerContainer: {
        display: "flex",
        width: "100%",
        justifyContent: "space-between",
    },
    title: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "2em",
        color: "#7721ad",
        padding: "20px",
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: "800px",
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: "14px",
        textTransform: "initial",
        width: "180px",
    },
    fieldContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 12,
    },
    iconHelpText: {
        width: 15,
        height: 15,
        cursor: "pointer",
    },
    closingTimeContainerLabel: {
        color: "#7721ad",
        fontWeight: "bold",
        width: "50%",
        display: "flex",
        border: "2px #7721ad solid",
        borderRadius: "10px 0 0 10px",
        alignItems: "center",
        padding: "10px",
    },
    closingTimeContainerField: {
        color: "#7721ad",
        fontWeight: "bold",
        width: "50%",
        display: "flex",
        border: "2px #7721ad solid",
        borderRadius: "0 10px 10px 0",
        alignItems: "center",
        padding: "10px",
    },
}));

const ChannelEnableVirtualAssistant: FC<{ communicationchannelid?: number, finishFunction?: any, gobackFunction?: any }> = ({ communicationchannelid, finishFunction, gobackFunction }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const location = useLocation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const [templateBody, setTemplateBody] = useState("");
    const channel = location.state as IChannel | null;
    const maindata = useSelector((state) => state.main.mainAux);
    const response = useSelector(state => state.main.execute);

    const {
        formState: { errors },
        getValues,
        handleSubmit,
        register,
        setValue,
        trigger
    } = useForm({
        defaultValues: {
            chatblockid: "",
            communicationchannelid: communicationchannelid ?? channel?.communicationchannelid ?? 0,
            template_body: "",
            prop_value: 0,
        },
    });

    useEffect(() => {
        dispatch(getCollectionAux(getTemplatesChatflow()));
    }, []);

    useEffect(() => {
        register('chatblockid');
        register("communicationchannelid")
        register("prop_value")
    }, [register])

    const handleGoBack = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            if (gobackFunction) {
                gobackFunction();
            } else {
                history.push(paths.CHANNELS);
            }
        },
        [history]
    );

    useEffect(() => {
        if (waitSave) {
            if (!response.loading && !response.error) {
                dispatch(showBackdrop(false));
                setWaitSave(false);
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_enablecirtualassistant) }))
                if (finishFunction) {
                    finishFunction()
                } else {
                    history.push(paths.CHANNELS);
                }
            } else if (response.error) {
                const errormessage = t(response.code ?? "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [response, waitSave])

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            if (data.chatblockid) {
                dispatch(showBackdrop(true));
                dispatch(execute(templatesChatflowClone(data)));

                setWaitSave(true);
            } else {
                if (finishFunction) {
                    finishFunction()
                } else {
                    history.push(paths.CHANNELS);
                }
            }
        };
        dispatch(
            manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback,
            })
        );
    });

    return (
        <form onSubmit={onSubmit} style={{ width: "100%", display: "flex", flexDirection: "column" }}>
            <div className={classes.headerContainer}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="textSecondary" key="mainview" href="/" onClick={handleGoBack}>
                        {t(langKeys.previoustext)}
                    </Link>
                </Breadcrumbs>

                <Button
                    type="submit"
                    className={classes.button}
                    variant="contained"
                    color="primary"
                >
                    <Trans i18nKey={langKeys.finish} />
                </Button>
            </div>
            <div className={classes.maincontainer}>
                <div className={classes.title}>{t(langKeys.enablevirtualassistantforurchannel)}</div>

                <div style={{ display: "flex", gap: 24 }}>
                    <div className={classes.fieldContainer}>
                        <FieldSelect
                            label={t(langKeys.select) + " " + t(langKeys.template)}
                            className="col-12"
                            valueDefault={getValues("chatblockid")}
                            onChange={(value) => {
                                setValue("chatblockid", value?.chatblockid || "");
                                setValue("template_body", value?.template_body || "");
                                setTemplateBody(value?.template_body || "");
                            }}
                            loading={maindata.loading}
                            error={errors?.chatblockid?.message}
                            data={maindata?.data || []}
                            optionDesc="title"
                            optionValue="chatblockid"
                        />
                    </div>
                </div>
                <div
                    style={{ minHeight: "300px", margin: "15px 0", backgroundColor: "white" }}
                    dangerouslySetInnerHTML={{ __html: templateBody }}
                ></div>
                <div style={{ display: "flex", marginTop: 24 }}>
                    <div className={classes.fieldContainer}>
                        <div style={{ fontSize: 18 }}>
                            {t(langKeys.automaticclosingtime)}
                            <Tooltip
                                title={<div style={{ fontSize: 12 }}>{t(langKeys.automaticclosingtimehelpertext)}</div>}
                                arrow
                                placement="top"
                            >
                                <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                            </Tooltip>
                        </div>
                    </div>
                </div>
                <div style={{ display: "flex" }}>
                    <div style={{ width: "60%", display: "flex" }}>
                        <div className={classes.closingTimeContainerLabel}>
                            <AccessTimeIcon />
                            <div>{t(langKeys.closingtime)}</div>
                        </div>
                        <div className={classes.closingTimeContainerField}>
                            <Input
                                value={getValues("prop_value")}
                                style={{ width: "50%" }}
                                onChange={(e) => {
                                    const value = parseFloat(e.target.value);
                                    if (!isNaN(value) && value > 0) {
                                        setValue("prop_value", value);
                                    } else {
                                        setValue("prop_value", 0);
                                    }
                                    trigger('prop_value');

                                }}
                                inputProps={{
                                    "aria-label": "description",
                                    type: "number",
                                    min: "0"
                                }}
                            />
                            <Trans i18nKey={langKeys.minute_plural} />
                        </div>
                    </div>
                    <div style={{ width: "40%", padding: "0 10px" }}>
                        <div style={{ color: "#7721ad", fontWeight: "bold" }}>{t(langKeys.note)}</div>
                        <div>{t(langKeys.noteclosingtime)}</div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default ChannelEnableVirtualAssistant;
