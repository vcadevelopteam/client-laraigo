import { FC, useContext, useEffect, useState } from "react";
import { Button, IconButton, Typography } from '@material-ui/core';
import { showBackdrop } from 'store/popus/actions';
import { DeleteOutline as DeleteOutlineIcon } from "@material-ui/icons";
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import { FacebookColor } from "icons";
import { FieldEdit, FieldSelect, ColorInput } from "components";
import FacebookLogin from 'react-facebook-login';
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { getChannelsListSub } from "store/channel/actions";
import { apiUrls } from 'common/constants';
import { MainData, SubscriptionContext } from "./context";
import { useFormContext } from "react-hook-form";

interface ChannelAddFacebookProps {
    setOpenWarning: (param: any) => void;
}

export const ChannelAddFacebook: FC<ChannelAddFacebookProps> = ({ setOpenWarning }) => {
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
    const [coloricon, setcoloricon] = useState("#2d88ff");
    const mainResult = useSelector(state => state.channel.channelList)
    const dispatch = useDispatch();
    const { t } = useTranslation();
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
            "coloricon": "#2d88ff",
        },
        "type": "FACEBOOK",
        "service": {
            "accesstoken": "",
            "siteid": "",
            "appid": apiUrls.FACEBOOKAPP
        }
    })

    const openprivacypolicies = () => {
        window.open("/privacy", '_blank');
    }

    useEffect(() => {
        const strRequired = (value: string) => {
            if (!value) {
                return t(langKeys.field_required);
            }
        }
        
        register('channels.facebook.description', { validate: strRequired, value: '' });
        register('channels.facebook.accesstoken', { validate: strRequired, value: '' });
        register('channels.facebook.communicationchannelowner', { validate: strRequired, value: '' });
        register('channels.facebook.communicationchannelsite', { validate: strRequired, value: '' });
        register('channels.facebook.siteid', { validate: strRequired, value: '' });
        register('channels.facebook.build', { value: values => ({
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
                "coloricon": "#2d88ff",
            },
            "type": "FACEBOOK",
            "service": {
                "accesstoken": values.accesstoken,
                "siteid": values.siteid,
                "appid": apiUrls.FACEBOOKAPP
            }
        })});

        return () => {
            unregister('channels.facebook.description')
            unregister('channels.facebook.accesstoken')
            unregister('channels.facebook.communicationchannelowner');
            unregister('channels.facebook.communicationchannelsite')
            unregister('channels.facebook.siteid')
            unregister('channels.facebook.build')
        }
    }, [register, unregister]);

    useEffect(() => {
        if (waitSave) {
            dispatch(showBackdrop(false));
            setWaitSave(false);
        }
    }, [mainResult, waitSave])

    // useEffect(() => {
    //     if (channelName.length > 0 && pageLink.length > 0) {
    //         setrequestchannels(prev => {
    //             const index = prev.findIndex(x => x.type === "FACEBOOK");
    //             if (index === -1) {
    //                 return [
    //                     ...prev,
    //                     fields,
    //                 ]
    //             } else {
    //                 prev.splice(index, 1);
    //                 return [
    //                     ...prev,
    //                     fields,
    //                 ];
    //             }
    //         });
    //         setHasFinished(true)
    //     } else {
    //         setrequestchannels(prev => prev.filter(x => x.type !== "FACEBOOK"));
    //     }
    // }, [channelName, pageLink, fields]);

    const processFacebookCallback = async (r: any) => {
        if (r.status !== "unknown" && !r.error) {
            dispatch(getChannelsListSub(r.accessToken, apiUrls.FACEBOOKAPP))
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }
    }
    function setValueField(value: any) {
        setValue('channels.facebook.communicationchannelsite', value?.id || "");
        setValue('channels.facebook.communicationchannelowner', value?.name || "");
        setValue('channels.facebook.siteid', value?.id || "");
        setValue('channels.facebook.accesstoken', value?.access_token || "");
    }

    return (
        <div className={commonClasses.root}>
            {!hasFinished && <FacebookColor className={commonClasses.leadingIcon} />}
            {!hasFinished && <IconButton
                color="primary"
                className={commonClasses.trailingIcon}
                onClick={() => {
                    deleteChannel('facebook');
                    // setrequestchannels(prev => prev.filter(x => x.type !== "FACEBOOK"));
                }}
            >
                <DeleteOutlineIcon />
            </IconButton>}
            {!hasFinished && <Typography>
                <Trans i18nKey={langKeys.connectface2} />
            </Typography>}
            {hasFinished && <FacebookColor
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
                onChange={(value) => setValue('channels.facebook.description', value)}
                label={t(langKeys.givechannelname)}
                valueDefault={getValues('channels.facebook.description')}
                variant="outlined"
                size="small"
                error={errors.channels?.facebook?.description?.message}
            />
            {/* <div className="row-zyx">
                <div className="col-3"></div>
                <div className="col-6">
                    <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                        {t(langKeys.givechannelcolor)}
                    </Box>
                    <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                        <FacebookWallIcon style={{ fill: `${coloricon}`, width: "100px" }} />
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
            <FieldSelect
                onChange={(value) => setValueField(value)}
                label={t(langKeys.selectpagelink)}
                data={mainResult.data}
                valueDefault={getValues('channels.facebook.siteid')}
                optionDesc="name"
                optionValue="id"
                variant="outlined"
                size="small"
                disabled={mainResult.loading || mainResult.data.length === 0}
                error={errors.channels?.facebook?.siteid?.message}
            />

            {getValues('channels.facebook.siteid')?.length || 0 === 0 && mainResult.data.length === 0 ? (
                <FacebookLogin
                    appId={apiUrls.FACEBOOKAPP}
                    autoLoad={false}
                    buttonStyle={FBButtonStyles}
                    fields="name,email,picture"
                    scope="pages_manage_engagement,pages_manage_metadata,pages_messaging,pages_read_engagement,pages_read_user_content,pages_show_list,public_profile"
                    callback={processFacebookCallback}
                    textButton={t(langKeys.linkfacebookpage)}
                    // icon={<FacebookIcon style={{ color: 'white', marginRight: '8px' }} />}
                    onClick={(e: any) => {
                        e.view.window.FB.init({
                            appId: apiUrls.FACEBOOKAPP,
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
                    variant="contained"
                    color="primary"
                    disabled={mainResult.loading}
                >
                    <Trans i18nKey={langKeys.finishreg} />
                </Button>
            )}
        </div>
    );
}