/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext, useState } from "react";
import { makeStyles, Button, Box, IconButton, Typography } from '@material-ui/core';
import { DeleteOutline as DeleteOutlineIcon } from '@material-ui/icons';
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import { ColorInput, FieldEdit, } from "components";
import { AppleIcon, TelegramIcon } from "icons";
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

export const ChannelAddIos: FC<{ setrequestchannels: (param: any) => void, setOpenWarning: (param: any) => void }> = ({ setrequestchannels, setOpenWarning }) => {
    const { commonClasses, deleteChannel } = useContext(SubscriptionContext);
    const [channelreg, setChannelreg] = useState(true);
    const { t } = useTranslation();
    const [coloricon, setcoloricon] = useState("#000000");
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
            "coloricon": "#000000",
        },
        "type": "SMOOCHIOS",
    })

    async function finishreg() {
        setrequestchannels((p: any) => ([...p, fields]))
        deleteChannel('apple');
    }

    function setnameField(value: any) {
        setChannelreg(value === "")
        let partialf = fields;
        partialf.parameters.description = value
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
                onClick={() => deleteChannel('apple')}
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
            {/* <div className="row-zyx">
                <div className="col-3"></div>
                <div className="col-6">
                    <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                        {t(langKeys.givechannelcolor)}
                    </Box>
                    <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                        <AppleIcon style={{ fill: `${coloricon}`, width: "100px" }} />
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
                onClick={() => { finishreg() }}
                className={commonClasses.button}
                disabled={channelreg}
                variant="contained"
                color="primary"
            >
                <Trans i18nKey={langKeys.next} />
            </Button>
        </div>
    )
}