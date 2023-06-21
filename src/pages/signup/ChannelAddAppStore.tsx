/* eslint-disable no-useless-escape */
/* eslint-disable react-hooks/exhaustive-deps */
import { DeleteOutline as DeleteOutlineIcon, Link as LinkIcon, LinkOff as LinkOffIcon } from "@material-ui/icons";
import { FC, useContext, useEffect, useState } from "react";
import { FieldEdit, FieldEditMulti } from "components";
import { langKeys } from "lang/keys";
import { MainData, SubscriptionContext } from "./context";
import { makeStyles, Breadcrumbs, Button, Link, IconButton, Typography, InputAdornment } from "@material-ui/core";
import { showBackdrop } from "store/popus/actions";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useFormContext } from "react-hook-form";
import { useSelector } from "hooks";
import { ZyxmeMessengerIcon } from "icons";

import clsx from "clsx";

const useChannelAddStyles = makeStyles((theme) => ({
    button: {
        fontSize: "14px",
        fontWeight: 500,
        padding: 12,
        textTransform: "initial",
        width: "180px",
    },
}));

export const ChannelAddAppStore: FC<{ setOpenWarning: (param: any) => void }> = ({ setOpenWarning }) => {
    const dispatch = useDispatch();

    const { commonClasses, foreground, submitObservable, setForeground, deleteChannel } =
        useContext(SubscriptionContext);
    const {
        getValues,
        setValue,
        register,
        unregister,
        formState: { errors },
        trigger,
    } = useFormContext<MainData>();
    const { t } = useTranslation();

    const [hasFinished, setHasFinished] = useState(false);
    const [nextbutton, setNextbutton] = useState(true);
    const [nextbutton2, setNextbutton2] = useState(true);
    const [submitError, setSubmitError] = useState(false);
    const [viewSelected, setViewSelected] = useState("view1");
    const [waitSave, setWaitSave] = useState(false);

    const classes = useChannelAddStyles();
    const mainResult = useSelector((state) => state.channel.channelList);

    useEffect(() => {
        /*const cb = async () => {
            const v1 = await trigger("channels.appstore.keyid");
            const v2 = await trigger("channels.appstore.issuerid");
            const v3 = await trigger("channels.appstore.secretkey");
            setSubmitError(!v1 || !v2 || !v3);
        };

        submitObservable.addListener(cb);
        return () => {
            submitObservable.removeListener(cb);
        };*/
    }, [submitObservable, trigger]);

    useEffect(() => {
        const strRequired = (value: string) => {
            if (!value) {
                return t(langKeys.field_required);
            }
        };

        /*register("channels.appstore.description", { validate: strRequired, value: "" });
        register("channels.appstore.keyid", { validate: strRequired, value: "" });
        register("channels.appstore.issuerid", { validate: strRequired, value: "" });
        register("channels.appstore.secretkey", { validate: strRequired, value: "" });
        register("channels.appstore.build", {
            value: (values) => ({
                method: "UFN_COMMUNICATIONCHANNEL_INS",
                parameters: {
                    apikey: "",
                    chatflowenabled: true,
                    color: "",
                    coloricon: "#1D9BF0",
                    communicationchannelowner: values.description,
                    communicationchannelsite: "",
                    description: values.description,
                    form: "",
                    icons: "",
                    id: 0,
                    integrationid: "",
                    other: "",
                    type: "",
                    voximplantcallsupervision: false,
                },
                service: {
                    keyid: values.keyid,
                    issuerid: values.issuerid,
                    secretkey: values.secretkey,
                },
                type: "APPSTORE",
            }),
        });

        return () => {
            unregister("channels.appstore");
        };*/
    }, [register, unregister]);

    useEffect(() => {
        if (foreground !== "appstore" && viewSelected !== "view1") {
            setViewSelected("view1");
        }
    }, [foreground, viewSelected]);

    useEffect(() => {
        if (waitSave) {
            dispatch(showBackdrop(false));
            setWaitSave(false);
        }
    }, [mainResult]);

    const setView = (option: "view1" | "view2") => {
        if (option === "view1") {
            setViewSelected(option);
            setForeground(undefined);
        } else {
            setViewSelected(option);
            setForeground("appstore");
        }
    };

    if (viewSelected === "view2") {
        return (
            <div style={{ marginTop: "auto", marginBottom: "auto", maxHeight: "100%" }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link
                        color="textSecondary"
                        href="/"
                        onClick={(e) => {
                            e.preventDefault();
                            setView("view1");
                        }}
                    >
                        {"<< "}
                        <Trans i18nKey={langKeys.previoustext} />
                    </Link>
                </Breadcrumbs>
                {/*<div>
                    <div
                        style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: "2em",
                            color: "#7721ad",
                            padding: "20px",
                        }}
                    >
                        {t(langKeys.channel_appstoretitle)}
                    </div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1em", padding: "20px" }}>
                        {t(langKeys.channel_appstorealert1)}
                    </div>
                    <div style={{ textAlign: "center", padding: "20px", color: "#969ea5" }}>
                        {t(langKeys.channel_appstorealert2)}
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={(v) => {
                                setNextbutton(
                                    v === "" ||
                                    getValues("channels.appstore.keyid") === "" ||
                                    getValues("channels.appstore.secretkey") === ""
                                );
                                setValue("channels.appstore.issuerid", v);
                            }}
                            valueDefault={getValues("channels.appstore.issuerid")}
                            label={t(langKeys.channel_appstore_issuerid)}
                            className="col-6"
                            error={errors.channels?.appstore?.issuerid?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={(v) => {
                                setNextbutton(
                                    v === "" ||
                                    getValues("channels.appstore.issuerid") === "" ||
                                    getValues("channels.appstore.secretkey") === ""
                                );
                                setValue("channels.appstore.keyid", v);
                            }}
                            valueDefault={getValues("channels.appstore.keyid")}
                            label={t(langKeys.channel_appstore_keyid)}
                            className="col-6"
                            error={errors.channels?.appstore?.keyid?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEditMulti
                            onChange={(v) => {
                                setNextbutton(
                                    v === "" ||
                                    getValues("channels.appstore.issuerid") === "" ||
                                    getValues("channels.appstore.keyid") === ""
                                );
                                setValue("channels.appstore.secretkey", v);
                            }}
                            valueDefault={getValues("channels.appstore.secretkey")}
                            label={t(langKeys.channel_appstore_secretkey)}
                            className="col-6"
                            error={errors.channels?.appstore?.secretkey?.message}
                        />
                    </div>
                    <div style={{ paddingLeft: "80%" }}>
                        <Button
                            onClick={async () => {
                                const v1 = await trigger("channels.appstore.issuerid");
                                const v2 = await trigger("channels.appstore.keyid");
                                const v3 = await trigger("channels.appstore.secretkey");
                                if (v1 && v2 && v3) {
                                    setView("view1");
                                    setHasFinished(true);
                                }
                            }}
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            disabled={nextbutton}
                        >
                            <Trans i18nKey={langKeys.next} />
                        </Button>
                    </div>
                </div>*/}
            </div>
        );
    }

    return (
        <div className={clsx(commonClasses.root, submitError && commonClasses.rootError)}>
            {!hasFinished && <ZyxmeMessengerIcon className={commonClasses.leadingIcon} />}
            {!hasFinished && (
                <IconButton
                    color="primary"
                    className={commonClasses.trailingIcon}
                    onClick={() => {
                        deleteChannel("appstore");
                    }}
                >
                    <DeleteOutlineIcon />
                </IconButton>
            )}
            {!hasFinished && (
                <Typography>
                    <Trans i18nKey={langKeys.subscription_genericconnect} />
                </Typography>
            )}
            {hasFinished && <ZyxmeMessengerIcon style={{ width: 100, height: 100, alignSelf: "center" }} />}
            {hasFinished && (
                <div style={{ alignSelf: "center" }}>
                    <Typography color="primary" style={{ fontSize: "1.5vw", fontWeight: "bold", textAlign: "center" }}>
                        {t(langKeys.subscription_congratulations)}
                    </Typography>
                    <Typography color="primary" style={{ fontSize: "1.2vw", fontWeight: 500 }}>
                        {t(langKeys.subscription_message1)} {t(langKeys.channel_appstore)}{" "}
                        {t(langKeys.subscription_message2)}
                    </Typography>
                </div>
            )}
            {/*<FieldEdit
                onChange={(value) => {
                    setValue("channels.appstore.description", value);
                    setNextbutton2(!value);
                }}
                valueDefault={getValues("channels.appstore.description")}
                label={t(langKeys.givechannelname)}
                variant="outlined"
                size="small"
                error={errors.channels?.appstore?.description?.message}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {hasFinished ? <LinkIcon color="primary" /> : <LinkOffIcon />}
                        </InputAdornment>
                    ),
                }}
            />*/}
            {!hasFinished && (
                <Button
                    onClick={() => setView("view2")}
                    className={commonClasses.button}
                    variant="contained"
                    color="primary"
                    disabled={nextbutton2}
                >
                    <Trans i18nKey={langKeys.next} />
                </Button>
            )}
        </div>
    );
};