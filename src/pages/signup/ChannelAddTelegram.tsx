/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext, useEffect, useState } from "react";
import { makeStyles, Breadcrumbs, Button, Box, Link, IconButton, Typography } from '@material-ui/core';
import { DeleteOutline as DeleteOutlineIcon } from '@material-ui/icons';
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import { FieldEdit, ColorInput } from "components";
import { TelegramIcon } from "icons";
import { SubscriptionContext } from "./context";

const useChannelAddStyles = makeStyles(theme => ({
    centerbutton: {
        marginLeft: "calc(50% - 96px)",
        marginTop: "30px",
        marginBottom: "20px",
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial',
        width: "180px"
    },
}));

export const ChannelAddTelegram: FC<{ setOpenWarning: (param: any) => void }> = ({ setOpenWarning }) => {
    const {
        commonClasses,
        selectedChannels,
        finishreg,
        deleteChannel,
        setrequestchannels,
    } = useContext(SubscriptionContext);
    const [botKey, $setBotKey] = useState("");
    const [coloricon, setcoloricon] = useState("#207FDD");
    const [channelName, setChannelName] = useState("");
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
            "coloricon": "#207FDD",
        },
        "type": "TELEGRAM",
        "service": {
            "accesstoken": ""
        }
    })

    useEffect(() => {
        if (channelName.length > 0 && botKey.length > 0) {
            setrequestchannels(prev => {
                const index = prev.findIndex(x => x.type === "TELEGRAM");
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
            setrequestchannels(prev => prev.filter(x => x.type !== "TELEGRAM"));
        }
    }, [channelName, botKey, fields]);

    function setnameField(value: any) {
        setChannelName(value)
        let partialf = fields;
        partialf.parameters.description = value
        setFields(partialf)
    }
    function setBotKey(val: string) {
        $setBotKey(val)
        let partialf = fields;
        partialf.service.accesstoken = val;
        partialf.parameters.communicationchannelowner = "";
        setFields(partialf)
    }

    return (
        <div className={commonClasses.root}>
            <TelegramIcon
                className={commonClasses.leadingIcon}
            />
            <IconButton
                color="primary"
                className={commonClasses.trailingIcon}
                onClick={() => {
                    deleteChannel('telegram');
                    setrequestchannels(prev => prev.filter(x => x.type !== "TELEGRAM"));
                }}
            >
                <DeleteOutlineIcon />
            </IconButton>
            <Typography>
                <Trans i18nKey={langKeys.connectface2} />
            </Typography>
            <FieldEdit
                onChange={(value) => setnameField(value)}
                valueDefault={channelName}
                label={t(langKeys.givechannelname)}
                variant="outlined"
                size="small"
            />
            <FieldEdit
                onChange={(value) => setBotKey(value)}
                valueDefault={botKey}
                label={t(langKeys.enterbotapikey)}
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
                        <TelegramIcon style={{ fill: `${coloricon}`, width: "100px" }} />
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
            {selectedChannels === 1 && (
                <Button
                    onClick={finishreg}
                    className={commonClasses.button}
                    disabled={channelName.length === 0 && botKey.length === 0}
                    variant="contained"
                    color="primary"
                >
                    <Trans i18nKey={langKeys.finishreg} />
                </Button>
            )}
        </div>
    );
}