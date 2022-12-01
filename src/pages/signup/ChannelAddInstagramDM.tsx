/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext, useEffect, useState } from "react";
import { IconButton, InputAdornment, Typography } from '@material-ui/core';
import { showBackdrop } from 'store/popus/actions';
import { DeleteOutline as DeleteOutlineIcon, Link as LinkIcon, LinkOff as LinkOffIcon } from "@material-ui/icons";
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import { FieldEdit, FieldSelect } from "components";
import { InstagramColor3 } from "icons";
import FacebookLogin from 'react-facebook-login';
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { getInstagramDMPages, resetGetInstagramDMPages } from "store/channel/actions";
import { apiUrls } from 'common/constants';
import { MainData, SubscriptionContext } from "./context";
import { useFormContext } from "react-hook-form";

export const ChannelAddInstagramDM: FC<{ setOpenWarning: (param: any) => void }> = ({ setOpenWarning }) => {
    const {
        commonClasses,
        FBButtonStyles,
        deleteChannel,
    } = useContext(SubscriptionContext);
    const { getValues, setValue, register, unregister, formState: { errors } } = useFormContext<MainData>();
    const [waitSave, setWaitSave] = useState(false);
    const [hasFinished, setHasFinished] = useState(false)
    const mainResult = useSelector(state => state.channel.instagramDMPages)
    const dispatch = useDispatch();
    const { t } = useTranslation();

    useEffect(() => {
        const strRequired = (value: string) => {
            if (!value) {
                return t(langKeys.field_required);
            }
        }

        register('channels.instagramDM.description', { validate: strRequired, value: '' });
        register('channels.instagramDM.accesstoken', { validate: strRequired, value: '' });
        register('channels.instagramDM.communicationchannelowner', { validate: strRequired, value: '' });
        register('channels.instagramDM.communicationchannelsite', { validate: strRequired, value: '' });
        register('channels.instagramDM.siteid', { validate: strRequired, value: '' });
        register('channels.instagramDM.build', {
            value: values => ({
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
                    "voximplantcallsupervision": false
                },
                "type": "INSTAMESSENGER",
                "service": {
                    "accesstoken": values.accesstoken,
                    "siteid": values.siteid,
                    "appid": apiUrls.INSTAGRAMAPP
                }
            })
        });

        return () => {
            unregister('channels.instagramDM');
            dispatch(resetGetInstagramDMPages());
        }
    }, [register, unregister, dispatch]);

    useEffect(() => {
        if (waitSave) {
            dispatch(showBackdrop(false));
            setWaitSave(false);
        }
    }, [mainResult, waitSave])

    const processFacebookCallback = async (r: any) => {
        if (r.status !== "unknown" && !r.error) {
            dispatch(getInstagramDMPages(r.accessToken, apiUrls.INSTAGRAMAPP))
            dispatch(showBackdrop(true));
            setWaitSave(true);
            setHasFinished(true);
        }
    }

    function setValueField(value: any) {
        setValue('channels.instagramDM.communicationchannelsite', value?.id || "");
        setValue('channels.instagramDM.communicationchannelowner', value?.name || "");
        setValue('channels.instagramDM.siteid', value?.id || "");
        setValue('channels.instagramDM.accesstoken', value?.access_token || "");
    }

    const openviewsteps = () => {
        window.open("https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/a61f2d61-a974-42e4-b393-481ef8311bb0/Instagram_warning.png", '_blank');
    }

    return (
        <div className={commonClasses.root}>
            {!hasFinished && <InstagramColor3 className={commonClasses.leadingIcon} />}
            {!hasFinished && <IconButton
                color="primary"
                className={commonClasses.trailingIcon}
                onClick={() => {
                    deleteChannel('instagramDM');
                    // setrequestchannels(prev => prev.filter(x => x.type !== "INSTAMESSENGER"));
                }}
            >
                <DeleteOutlineIcon />
            </IconButton>}
            {!hasFinished && <Typography>
                <Trans i18nKey={langKeys.subscription_instagramconnect} />
            </Typography>}
            {!hasFinished && <Typography style={{ color: "#cc3333" }}>
                <Trans i18nKey={langKeys.instagram_warning}></Trans> <a style={{ fontWeight: 'bold', color: '#6F1FA1', cursor: 'pointer' }} onClick={openviewsteps} rel="noopener noreferrer">[{t(langKeys.view_steps)}]</a>
            </Typography>}
            {hasFinished && <InstagramColor3
                style={{ width: 100, height: 100, alignSelf: 'center' }} />
            }
            {hasFinished && (
                <div style={{ alignSelf: 'center' }}>
                    <Typography
                        color="primary"
                        style={{ fontSize: '1.5vw', fontWeight: 'bold', textAlign: 'center' }}>
                        {t(langKeys.subscription_congratulations)}
                    </Typography>
                    <Typography
                        color="primary"
                        style={{ fontSize: '1.2vw', fontWeight: 500 }}>
                        {t(langKeys.subscription_message1)} {t(langKeys.channel_instagramdm)} {t(langKeys.subscription_message2)}
                    </Typography>
                </div>
            )}
            <FieldEdit
                onChange={(value) => setValue('channels.instagramDM.description', value)}
                valueDefault={getValues('channels.instagramDM.description')}
                label={t(langKeys.givechannelname)}
                variant="outlined"
                size="small"
                error={errors.channels?.instagramDM?.description?.message}
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
                valueDefault={getValues('channels.instagramDM.siteid')}
                label={t(langKeys.selectpagelink)}
                data={mainResult.data}
                optionDesc="name"
                optionValue="id"
                variant="outlined"
                size="small"
                disabled={mainResult.loading || mainResult.data.length === 0}
                error={errors.channels?.instagramDM?.siteid?.message}
            />
            {((getValues('channels.instagramDM.siteid')?.length || 0) === 0) && (mainResult.data.length === 0) && (
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
                            version: apiUrls.FACEBOOKVERSION,
                        });
                    }}
                    isDisabled={mainResult.loading}
                    disableMobileRedirect={true}
                />
            )}
        </div>
    );
}