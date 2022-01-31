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
import { TwitterIcon } from "icons";
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
        deleteChannel,
        setrequestchannels,
    } = useContext(SubscriptionContext);
    const [viewSelected, setViewSelected] = useState("view1");
    const [waitSave, setWaitSave] = useState(false);
    const [nextbutton, setNextbutton] = useState(true);
    const [nextbutton2, setNextbutton2] = useState(true);
    const [channelreg, setChannelreg] = useState(true);
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

    async function finishreg() {
        setrequestchannels((p: any) => ([...p, fields]))
        deleteChannel('twitter')
    }

    useEffect(() => {
        if (waitSave) {
            dispatch(showBackdrop(false));
            setWaitSave(false);
        }
    }, [mainResult])

    function setnameField(value: any) {
        setChannelreg(value === "")
        let partialf = fields;
        partialf.parameters.description = value
        setFields(partialf)
    }
    if (viewSelected === "view2") {
        return (
            <div style={{ marginTop: "auto", marginBottom: "auto", maxHeight: "100%" }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); setOpenWarning(true) }}>
                        {t(langKeys.previoustext)}
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
                            onClick={() => { setViewSelected("view2") }}
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
            <TwitterIcon
                className={commonClasses.leadingIcon}
            />
            <IconButton
                color="primary"
                className={commonClasses.trailingIcon}
                onClick={() => deleteChannel('twitter')}
            >
                <DeleteOutlineIcon />
            </IconButton>
            <Typography>
                <Trans i18nKey={langKeys.connectface2} />
            </Typography>
            <FieldEdit
                onChange={(value) => setnameField(value)}
                label={t(langKeys.givechannelname)}
                variant="outlined"
                size="small"
            />
            <FieldEdit
                onChange={(value) => {
                    setNextbutton2(value === "")
                    let partialf = fields;
                    partialf.parameters.communicationchannelowner = "";
                    partialf.service.devenvironment = value;
                    setFields(partialf)
                }}
                valueDefault={fields.service.devenvironment}
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
            <Button
                // onClick={() => { finishreg() }}
                onClick={() => setViewSelected("view2")}
                className={commonClasses.button}
                disabled={channelreg}
                variant="contained"
                color="primary"
            >
                <Trans i18nKey={langKeys.next} />
            </Button>
        </div>
    );
}