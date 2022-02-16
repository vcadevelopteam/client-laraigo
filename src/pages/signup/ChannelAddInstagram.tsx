/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext, useEffect, useState } from "react";
import { Button, Typography, IconButton, InputAdornment } from '@material-ui/core';
import { showBackdrop } from 'store/popus/actions';
import { DeleteOutline as DeleteOutlineIcon, Link as LinkIcon, LinkOff as LinkOffIcon } from "@material-ui/icons";
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import { FieldEdit, FieldSelect } from "components";
import { InstagramColor } from "icons";
import FacebookLogin from 'react-facebook-login';
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { getChannelsListSub } from "store/channel/actions";
import { apiUrls } from 'common/constants';
import { MainData, SubscriptionContext } from "./context";
import { useFormContext } from "react-hook-form";
interface ChannelAddInstagramProps {
    setOpenWarning: (param: any) => void;
}

export const ChannelAddInstagram: FC<ChannelAddInstagramProps> = ({ setOpenWarning }) => {
    const {
        commonClasses,
        FBButtonStyles,
        selectedChannels,
        finishreg,
        deleteChannel,
    } = useContext(SubscriptionContext);
    const { getValues, setValue, register, unregister, formState: { errors } } = useFormContext<MainData>();
    const [waitSave, setWaitSave] = useState(false);
    const [hasFinished, setHasFinished] = useState(false)
    const mainResult = useSelector(state => state.channel.channelList)
    const dispatch = useDispatch();
    const { t } = useTranslation();
    
    useEffect(() => {
        const strRequired = (value: string) => {
            if (!value) {
                return t(langKeys.field_required);
            }
        }
        
        register('channels.instagram.description', { validate: strRequired, value: '' });
        register('channels.instagram.accesstoken', { validate: strRequired, value: '' });
        register('channels.instagram.communicationchannelowner', { validate: strRequired, value: '' });
        register('channels.instagram.communicationchannelsite', { validate: strRequired, value: '' });
        register('channels.instagram.siteid', { validate: strRequired, value: '' });
        register('channels.instagram.build', { value: values => ({
            "method": "UFN_COMMUNICATIONCHANNEL_INS",
            "parameters": {
                "id": 0,
                "description": values.description,
                "type": "",
                "communicationchannelsite": values.communicationchannelsite,
                "communicationchannelowner": values.communicationchannelowner,
                "chatflowenabled": true,
                "integrationid": "",
                "color": "",
                "icons": "",
                "other": "",
                "form": "",
                "apikey": "",
                "coloricon": "#F56040",
            },
            "type": "INSTAGRAM",
            "service": {
                "accesstoken": values.accesstoken,
                "siteid": values.siteid,
                "appid": apiUrls.INSTAGRAMAPP
            }
        })});

        return () => {
            unregister('channels.instagram')
        }
    }, [register, unregister]);

    useEffect(() => {
        if (waitSave) {
            dispatch(showBackdrop(false));
            setWaitSave(false);
        }
    }, [mainResult, waitSave])

    const openprivacypolicies = () => {
        window.open("/privacy", '_blank');
    }

    const processFacebookCallback = async (r: any) => {
        if (r.status !== "unknown" && !r.error) {
            dispatch(getChannelsListSub(r.accessToken, apiUrls.INSTAGRAMAPP))
            dispatch(showBackdrop(true));
            setWaitSave(true);
            setHasFinished(true);
        }
    }
    function setValueField(value: any) {
        setValue('channels.instagram.communicationchannelsite', value?.id || "");
        setValue('channels.instagram.communicationchannelowner', value?.name || "");
        setValue('channels.instagram.siteid', value?.id || "");
        setValue('channels.instagram.accesstoken', value?.access_token || "");
    }

    return (
        <div className={commonClasses.root}>
            {!hasFinished && <InstagramColor className={commonClasses.leadingIcon} />}
            {!hasFinished && <IconButton
                color="primary"
                className={commonClasses.trailingIcon}
                onClick={() => {
                    deleteChannel('instagram');
                    // setrequestchannels(prev => prev.filter(x => x.type !== "INSTAGRAM"));
                }}
            >
                <DeleteOutlineIcon />
            </IconButton>}
            {!hasFinished && <Typography>
                <Trans i18nKey={langKeys.connectface2} />
            </Typography>}
            {hasFinished && <InstagramColor
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
                        Haz conectado Facebook con tu cuenta
                    </Typography>
            </div>
            )}
            <FieldEdit
                onChange={(value) => setValue('channels.instagram.description', value)}
                valueDefault={getValues('channels.instagram.description')}
                label={t(langKeys.givechannelname)}
                variant="outlined"
                size="small"
                error={errors.channels?.instagram?.description?.message}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {hasFinished ? <LinkIcon color="primary" /> : <LinkOffIcon />}
                        </InputAdornment>
                    )
                }}
            />
            <FieldSelect
                onChange={(value) => setValueField(value)}
                valueDefault={getValues('channels.instagram.siteid')}
                label={t(langKeys.selectpagelink)}
                data={mainResult.data}
                optionDesc="name"
                optionValue="id"
                variant="outlined"
                size="small"
                disabled={mainResult.loading || mainResult.data.length === 0}
                error={errors.channels?.instagram?.siteid?.message}
            />
            {/* <div className="row-zyx">
                <div className="col-3"></div>
                <div className="col-6">
                    <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                        {t(langKeys.givechannelcolor)}
                    </Box>
                    <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                        <InstagramIcon style={{ fill: `${coloricon}`, width: "100px" }} />
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
            {getValues('channels.facebook.siteid')?.length || 0 === 0 && mainResult.data.length === 0 ? (
                <FacebookLogin
                    appId={apiUrls.INSTAGRAMAPP}
                    autoLoad={false}
                    buttonStyle={FBButtonStyles}
                    fields="name,email,picture"
                    scope="instagram_basic,instagram_manage_comments,instagram_manage_messages,pages_manage_metadata,pages_read_engagement,pages_show_list,public_profile"
                    callback={processFacebookCallback}
                    textButton={t(langKeys.linkinstagrampage)}
                    onClick={(e: any) => {
                        e.view.window.FB.init({
                            appId: apiUrls.INSTAGRAMAPP,
                            cookie: true,
                            xfbml: true,
                            version: 'v8.0'
                        });
                    }}
                    isDisabled={mainResult.loading}
                />
            ) : selectedChannels === 1 && (
                <Button
                    onClick={finishreg}
                    className={commonClasses.button}
                    disabled={mainResult.loading}
                    variant="contained"
                    color="primary"
                >
                    <Trans i18nKey={langKeys.finishreg} />
                </Button>
            )}
        </div>
    );
}