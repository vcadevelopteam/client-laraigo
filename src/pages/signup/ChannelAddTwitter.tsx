/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext, useEffect, useState } from "react";
import { makeStyles, Breadcrumbs, Button, Box, Link, IconButton, Typography } from '@material-ui/core';
import { DeleteOutline as DeleteOutlineIcon } from '@material-ui/icons';
import { showBackdrop } from 'store/popus/actions';
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import { FieldEdit, ColorInput } from "components";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { TwitterColor } from "icons";
import { SubscriptionContext } from "./context";

const useChannelAddStyles = makeStyles(theme => ({
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial',
        width: "180px"
    },
}));

export const ChannelAddTwitter: FC<{ setOpenWarning: (param: any) => void }> = ({ setOpenWarning }) => {
    const {
        commonClasses,
        foreground,
        selectedChannels,
        setConfirmations,
        finishreg,
        setForeground,
        deleteChannel,
        setrequestchannels,
    } = useContext(SubscriptionContext);
    const [hasFinished, setHasFinished] = useState(false);
    const [viewSelected, setViewSelected] = useState("view1");
    const [waitSave, setWaitSave] = useState(false);
    const [nextbutton, setNextbutton] = useState(true);
    const [devenvironment, setDevenvironment] = useState("");
    const [channelName, setChannelName] = useState("");
    const [coloricon, setcoloricon] = useState("#1D9BF0");
    const mainResult = useSelector(state => state.channel.channelList)
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const classes = useChannelAddStyles();
    const [fields, setFields] = useState({
        "method": "UFN_COMMUNICATIONCHANNEL_INS",
        "parameters": {
            "id": 0,
            "description": "",
            "type": "",
            "communicationchannelsite": "",
            "communicationchannelowner": "",
            "chatflowenabled": true,
            "integrationid": "",
            "color": "",
            "icons": "",
            "other": "",
            "form": "",
            "apikey": "",
            "coloricon": "#1D9BF0",
        },
        "type": "TWITTER",
        "service": {
            "consumerkey": "",
            "consumersecret": "",
            "accesstoken": "",
            "accesssecret": "",
            "devenvironment": ""
        }
    })

    useEffect(() => {
        if (foreground !== 'twitter' && viewSelected !== "view1") {
            setViewSelected("view1");
        } 
    }, [foreground, viewSelected]);

    useEffect(() => {
        if (channelName.length > 0 && devenvironment.length > 0) {
            setrequestchannels(prev => {
                const index = prev.findIndex(x => x.type === "TWITTER");
                if (index === -1) {
                    return [
                        ...prev,
                        fields,
                    ]
                } else {
                    prev.splice(index, 1);
                    return [
                        ...prev,
                        fields,
                    ];
                }
            });
        } else {
            setrequestchannels(prev => prev.filter(x => x.type !== "TWITTER"));
        }
    }, [channelName, devenvironment, fields]);

    useEffect(() => {
        if (waitSave) {
            dispatch(showBackdrop(false));
            setWaitSave(false);
        }
    }, [mainResult])

    function setnameField(value: any) {
        setChannelName(value)
        let partialf = fields;
        partialf.parameters.description = value
        setFields(partialf)
    }

    const setView = (option: "view1" | "view2") => {
        if (option === "view1") {
            setViewSelected(option);
            setForeground(undefined);
        } else {
            setViewSelected(option);
            setForeground('twitter');
        }
    }

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
                        {'<< '}<Trans i18nKey={langKeys.previoustext} />
                    </Link>
                </Breadcrumbs>
                <div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.twittertitle)}</div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1em", padding: "20px 80px" }}>{t(langKeys.twittertitle2)}</div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={(value) => {
                                setNextbutton(value === "" || fields.service.consumersecret === "" || fields.service.accesstoken === "" || fields.service.accesssecret === "")
                                let partialf = fields;
                                partialf.service.consumerkey = value
                                setFields(partialf)
                            }}
                            valueDefault={fields.service.consumerkey}
                            label={t(langKeys.consumerapikey)}
                            className="col-6"
                        />
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={(value) => {
                                setNextbutton(value === "" || fields.service.consumerkey === "" || fields.service.accesstoken === "" || fields.service.accesssecret === "")
                                let partialf = fields;
                                partialf.service.consumersecret = value
                                setFields(partialf)
                            }}
                            valueDefault={fields.service.consumersecret}
                            label={t(langKeys.consumerapisecret)}
                            className="col-6"
                        />
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={(value) => {
                                setNextbutton(value === "" || fields.service.consumerkey === "" || fields.service.consumersecret === "" || fields.service.accesssecret === "")
                                let partialf = fields;
                                partialf.service.accesstoken = value
                                setFields(partialf)
                            }}
                            valueDefault={fields.service.accesstoken}
                            label={t(langKeys.authenticationtoken)}
                            className="col-6"
                        />
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={(value) => {
                                setNextbutton(value === "" || fields.service.consumerkey === "" || fields.service.consumersecret === "" || fields.service.accesstoken === "")
                                let partialf = fields;
                                partialf.service.accesssecret = value
                                setFields(partialf)
                            }}
                            valueDefault={fields.service.accesssecret}
                            label={t(langKeys.authenticationsecret)}
                            className="col-6"
                        />
                    </div>

                    <div style={{ paddingLeft: "80%" }}>
                        <Button
                            disabled={nextbutton}
                            onClick={() => {
                                setView("view1");
                                setHasFinished(true);
                                setConfirmations(prev => prev++);
                            }}
                            className={classes.button}
                            variant="contained"
                            color="primary"
                        >{t(langKeys.next)}
                        </Button>

                    </div>

                </div>
            </div>
        )
    }

    return (
        <div className={commonClasses.root}>
            {!hasFinished && <TwitterColor className={commonClasses.leadingIcon} />}
            {!hasFinished && <IconButton
                color="primary"
                className={commonClasses.trailingIcon}
                onClick={() => {
                    deleteChannel('twitter');
                    setrequestchannels(prev => prev.filter(x => x.type !== "TWITTER"));
                }}
            >
                <DeleteOutlineIcon />
            </IconButton>}
            {!hasFinished && <Typography>
                <Trans i18nKey={langKeys.connectface2} />
            </Typography>}
            {hasFinished && <TwitterColor
                style={{ width: 100, height: 100, alignSelf: 'center' }}/>
            }
            {hasFinished && (
                <div style={{ alignSelf: 'center' }}>
                    <Typography
                        color="primary"
                        style={{ fontSize: '1.5vw', fontWeight: 'bold', textAlign: 'center' }}>
                        ¡Felicitaciones!
                    </Typography>
                    <Typography
                        color="primary"
                        style={{ fontSize: '1.2vw', fontWeight: 500 }}>
                        Haz conectado Twitter con tu cuenta
                    </Typography>
            </div>
            )}
            <FieldEdit
                onChange={(value) => setnameField(value)}
                valueDefault={channelName}
                label={t(langKeys.givechannelname)}
                variant="outlined"
                size="small"
            />
            <FieldEdit
                onChange={(value) => {
                    setDevenvironment(value)
                    let partialf = fields;
                    partialf.parameters.communicationchannelowner = "";
                    partialf.service.devenvironment = value;
                    setFields(partialf)
                }}
                // valueDefault={fields.service.devenvironment}
                valueDefault={devenvironment}
                label={t(langKeys.devenvironment)}
                variant="outlined"
                size="small"
            />
            {/* <div className="row-zyx">
                <div className="col-3"></div>
                <div className="col-6">
                    <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                        {t(langKeys.givechannelcolor)}
                    </Box>
                    <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                        <TwitterIcon style={{ fill: `${coloricon}`, width: "100px" }} />
                        <ColorInput
                            hex={fields.parameters.coloricon}
                            onChange={e => {
                                setFields(prev => ({
                                    ...prev,
                                    parameters: { ...prev.parameters, coloricon: e.hex, color: e.hex },
                                }));
                                setcoloricon(e.hex)
                            }}
                        />
                    </div>
                </div>
            </div> */}
            {!hasFinished ? (
                <Button
                    onClick={() => setView("view2")}
                    className={commonClasses.button}
                    disabled={channelName.length === 0 || devenvironment.length === 0}
                    variant="contained"
                    color="primary"
                >
                    <Trans i18nKey={langKeys.next} />
                </Button>
            ) : selectedChannels === 1 && (
                <Button
                    onClick={finishreg}
                    className={commonClasses.button}
                    disabled={channelName.length === 0 || devenvironment.length === 0}
                    variant="contained"
                    color="primary"
                >
                    <Trans i18nKey={langKeys.finishreg} />
                </Button>
            )}
        </div>
    );
}