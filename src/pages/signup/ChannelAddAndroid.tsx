/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext, useEffect, useState } from "react";
import { makeStyles, Button, Box, IconButton, Typography } from '@material-ui/core';
import { DeleteOutline as DeleteOutlineIcon } from '@material-ui/icons';
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import { ColorInput, FieldEdit, } from "components";
import { AndroidColor } from "icons";
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

export const ChannelAddAndroid: FC<{ setOpenWarning: (param: any) => void }> = ({ setOpenWarning }) => {
    const {
        commonClasses,
        selectedChannels,
        finishreg,
        deleteChannel,
        setrequestchannels,
    } = useContext(SubscriptionContext);
    const [hasFinished, setHasFinished] = useState(false)
    const [channelName, setChannelName] = useState("");
    const { t } = useTranslation();
    const [coloricon, setcoloricon] = useState("#90c900");
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
            "coloricon": "#90c900",
        },
        "type": "SMOOCHANDROID",
    })

    useEffect(() => {
        if (channelName.length > 0) {
            setrequestchannels(prev => {
                const index = prev.findIndex(x => x.type === "SMOOCHANDROID");
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
            setHasFinished(true)
        } else {
            setrequestchannels(prev => prev.filter(x => x.type !== "SMOOCHANDROID"));
        }
    }, [channelName, fields]);

    function setnameField(value: any) {
        setChannelName(value)
        let partialf = fields;
        partialf.parameters.description = value
        setFields(partialf)
    }
    return (
        <div className={commonClasses.root}>
            {!hasFinished && <AndroidColor className={commonClasses.leadingIcon} />}
            {!hasFinished && <IconButton
                color="primary"
                className={commonClasses.trailingIcon}
                onClick={() => {
                    deleteChannel('android');
                    setrequestchannels(prev => prev.filter(x => x.type !== "SMOOCHANDROID"));
                }}
            >
                <DeleteOutlineIcon />
            </IconButton>}
            {!hasFinished && <Typography>
                <Trans i18nKey={langKeys.connectface2} />
            </Typography>}
            {hasFinished && <AndroidColor
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
                        Haz integrado con Android SDK
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
            {/* <div className="row-zyx">
                <div className="col-3"></div>
                <div className="col-6">
                    <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                        {t(langKeys.givechannelcolor)}
                    </Box>
                    <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                        <AndroidIcon style={{ fill: `${coloricon}`, width: "100px" }} />
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
                    disabled={channelName.length === 0}
                    variant="contained"
                    color="primary"
                >
                    <Trans i18nKey={langKeys.finishreg} />
                </Button>
            )}
        </div>
    )
}