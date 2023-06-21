import { DeleteOutline as DeleteOutlineIcon, Link as LinkIcon, LinkOff as LinkOffIcon } from "@material-ui/icons";
import { FC, useContext, useEffect, useState } from "react";
import { FieldEdit } from "components";
import { langKeys } from "lang/keys";
import { MainData, SubscriptionContext } from "./context";
import { makeStyles, Breadcrumbs, Button, Link, IconButton, Typography, InputAdornment } from "@material-ui/core";
import { showBackdrop } from "store/popus/actions";
import { TikTokColor } from "icons";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useFormContext } from "react-hook-form";
import { useSelector } from "hooks";

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

export const ChannelAddTikTok: FC<{ setOpenWarning: (param: any) => void }> = ({ setOpenWarning }) => {
    const dispatch = useDispatch();

    const { commonClasses, foreground, submitObservable, setForeground, deleteChannel } = useContext(SubscriptionContext);
    const { getValues, setValue, register, unregister, formState: { errors }, trigger } = useFormContext<MainData>();
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
            const v1 = await trigger("channels.tiktok.accesstoken");
            setSubmitError(!v1);
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

        /*register("channels.tiktok.description", { validate: strRequired, value: "" });
        register("channels.tiktok.accesstoken", { validate: strRequired, value: "" });
        register("channels.tiktok.build", {
            value: (values) => ({
                method: "UFN_COMMUNICATIONCHANNEL_INS",
                parameters: {
                    apikey: "",
                    chatflowenabled: true,
                    color: "",
                    coloricon: "#000000",
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
                    accesstoken: values.accesstoken,
                },
                type: "AYRSHARE-TIKTOK",
            }),
        });

        return () => {
            unregister("channels.tiktok");
        };*/
    }, [register, unregister]);

    useEffect(() => {
        if (foreground !== "tiktok" && viewSelected !== "view1") {
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
            setForeground("tiktok");
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
                        {t(langKeys.channel_tiktoktitle)}
                    </div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1em", padding: "20px 80px" }}>
                        {t(langKeys.channel_tiktokalert01)}
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={(v) => {
                                setNextbutton(v === "");
                                setValue("channels.tiktok.accesstoken", v);
                            }}
                            valueDefault={getValues("channels.tiktok.accesstoken")}
                            label={t(langKeys.channel_tiktokaccesstoken)}
                            className="col-6"
                            error={errors.channels?.tiktok?.accesstoken?.message}
                        />
                    </div>
                    <div style={{ paddingLeft: "80%" }}>
                        <Button
                            onClick={async () => {
                                const v1 = await trigger("channels.tiktok.accesstoken");
                                if (v1) {
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
            {!hasFinished && <TikTokColor className={commonClasses.leadingIcon} />}
            {!hasFinished && (
                <IconButton
                    color="primary"
                    className={commonClasses.trailingIcon}
                    onClick={() => {
                        deleteChannel("tiktok");
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
            {hasFinished && <TikTokColor style={{ width: 100, height: 100, alignSelf: "center" }} />}
            {hasFinished && (
                <div style={{ alignSelf: "center" }}>
                    <Typography color="primary" style={{ fontSize: "1.5vw", fontWeight: "bold", textAlign: "center" }}>
                        {t(langKeys.subscription_congratulations)}
                    </Typography>
                    <Typography color="primary" style={{ fontSize: "1.2vw", fontWeight: 500 }}>
                        {t(langKeys.subscription_message1)} {t(langKeys.channel_tiktok)}{" "}
                        {t(langKeys.subscription_message2)}
                    </Typography>
                </div>
            )}
            {/*<FieldEdit
                onChange={(value) => {
                    setValue("channels.tiktok.description", value);
                    setNextbutton2(!value);
                }}
                valueDefault={getValues("channels.tiktok.description")}
                label={t(langKeys.givechannelname)}
                variant="outlined"
                size="small"
                error={errors.channels?.tiktok?.description?.message}
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

export default ChannelAddTikTok;