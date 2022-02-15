/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext, useEffect, useState } from "react";
import { makeStyles, Breadcrumbs, Button, Box, Link, IconButton, Typography, InputAdornment } from '@material-ui/core';
import { DeleteOutline as DeleteOutlineIcon, Link as LinkIcon } from '@material-ui/icons';
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import { FieldEdit, ColorInput } from "components";
import { TelegramColor } from "icons";
import { MainData, SubscriptionContext } from "./context";
import { useFormContext } from "react-hook-form";

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
    } = useContext(SubscriptionContext);
    const { getValues, setValue, register, unregister, formState: { errors } } = useFormContext<MainData>();
    const [hasFinished, setHasFinished] = useState(false)
    const [coloricon, setcoloricon] = useState("#207FDD");
    const { t } = useTranslation();

    useEffect(() => {
        const strRequired = (value: string) => {
            if (!value) {
                return t(langKeys.field_required);
            }
        }
        
        register('channels.telegram.description', { validate: strRequired, value: '' });
        register('channels.telegram.accesstoken', { validate: strRequired, value: '' });
        register('channels.telegram.communicationchannelowner', { value: '' });
        register('channels.telegram.build', { value: values => ({
            "method": "UFN_COMMUNICATIONCHANNEL_INS",
            "parameters": {
                "id": 0,
                "description": values.description,
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
                "accesstoken": values.accesstoken
            }
        })});

        return () => {
            unregister('channels.telegram')
        }
    }, [register, unregister]);

    function setBotKey(val: string) {
        setValue('channels.telegram.accesstoken', val);
        setValue('channels.telegram.communicationchannelowner', "");
        if (val.length > 0 && !hasFinished) {
            setHasFinished(true);
        } else if (val.length === 0 && hasFinished) {
            setHasFinished(false);
        }
    }

    return (
        <div className={commonClasses.root}>
            {!hasFinished && <TelegramColor className={commonClasses.leadingIcon} />}
            {!hasFinished && <IconButton
                color="primary"
                className={commonClasses.trailingIcon}
                onClick={() => {
                    deleteChannel('telegram');
                    // setrequestchannels(prev => prev.filter(x => x.type !== "TELEGRAM"));
                }}
            >
                <DeleteOutlineIcon />
            </IconButton>}
            {!hasFinished && <Typography>
                <Trans i18nKey={langKeys.connectface2} />
            </Typography>}
            {hasFinished && <TelegramColor
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
                        Haz conectado Teletram
                    </Typography>
            </div>
            )}
            <FieldEdit
                onChange={v => setValue('channels.telegram.description', v)}
                valueDefault={getValues('channels.telegram.description')}
                label={t(langKeys.givechannelname)}
                variant="outlined"
                size="small"
                error={errors.channels?.telegram?.description?.message}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <LinkIcon />
                        </InputAdornment>
                    )
                }}
            />
            <FieldEdit
                onChange={(value) => setBotKey(value)}
                valueDefault={getValues('channels.telegram.accesstoken')}
                label={t(langKeys.enterbotapikey)}
                variant="outlined"
                size="small"
                error={errors.channels?.telegram?.accesstoken?.message}
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
                    variant="contained"
                    color="primary"
                >
                    <Trans i18nKey={langKeys.finishreg} />
                </Button>
            )}
        </div>
    );
}