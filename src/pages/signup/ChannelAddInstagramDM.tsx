/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext, useEffect, useState } from "react";
import { Button, IconButton, Typography } from '@material-ui/core';
import { showBackdrop } from 'store/popus/actions';
import { DeleteOutline as DeleteOutlineIcon } from "@material-ui/icons";
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import { FieldEdit, FieldSelect, ColorInput } from "components";
import { InstagramColor3 } from "icons";
import FacebookLogin from 'react-facebook-login';
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { getChannelsListSub } from "store/channel/actions";
import { apiUrls } from 'common/constants';
import { SubscriptionContext, useChannelsCount } from "./context";

export const ChannelAddInstagramDM: FC<{ setOpenWarning: (param: any) => void }> = ({ setOpenWarning }) => {
    const {
        commonClasses,
        FBButtonStyles,
        finishreg,
        deleteChannel,
    } = useContext(SubscriptionContext);
    const selectedChannels = useChannelsCount();
    const [waitSave, setWaitSave] = useState(false);
    const [hasFinished, setHasFinished] = useState(false)
    const [pageLink, setPageLink] = useState("");
    const [channelName, setChannelName] = useState("");
    const mainResult = useSelector(state => state.channel.channelList)
    const [coloricon, setcoloricon] = useState("#F56040");
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
            "coloricon": "#F56040",
        },
        "type": "INSTAMESSENGER",
        "service": {
            "accesstoken": "",
            "siteid": "",
            "appid": apiUrls.INSTAGRAMAPP
        }
    })

    useEffect(() => {
        if (waitSave) {
            dispatch(showBackdrop(false));
            setWaitSave(false);
        }
    }, [mainResult, waitSave])

    // useEffect(() => {
    //     if (channelName.length > 0 && pageLink.length > 0) {
    //         setrequestchannels(prev => {
    //             const index = prev.findIndex(x => x.type === "INSTAMESSENGER");
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
    //         setrequestchannels(prev => prev.filter(x => x.type !== "INSTAMESSENGER"));
    //     }
    // }, [channelName, pageLink, fields]);

    const openprivacypolicies = () => {
        window.open("/privacy", '_blank');
    }

    const processFacebookCallback = async (r: any) => {
        if (r.status !== "unknown" && !r.error) {
            dispatch(getChannelsListSub(r.accessToken, apiUrls.INSTAGRAMAPP))
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }
    }
    function setValueField(value: any) {
        setPageLink(value?.id || "");
        let partialf = fields;
        partialf.parameters.communicationchannelsite = value?.id || ""
        partialf.parameters.communicationchannelowner = value?.name || ""
        partialf.service.siteid = value?.id || ""
        partialf.service.accesstoken = value?.access_token || ""

        setFields(partialf)
    }
    function setnameField(value: any) {
        setChannelName(value);
        let partialf = fields;
        partialf.parameters.description = value
        setFields(partialf)
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
                <Trans i18nKey={langKeys.connectface2} />
            </Typography>}
            {hasFinished && <InstagramColor3
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
                onChange={(value) => setnameField(value)}
                valueDefault={channelName}
                label={t(langKeys.givechannelname)}
                variant="outlined"
                size="small"
            />
            <FieldSelect
                onChange={(value) => setValueField(value)}
                valueDefault={pageLink}
                label={t(langKeys.selectpagelink)}
                data={mainResult.data}
                optionDesc="name"
                optionValue="id"
                variant="outlined"
                size="small"
                disabled={mainResult.loading || mainResult.data.length === 0}
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
            {pageLink.length === 0 && mainResult.data.length === 0 ? (
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
                    disabled={channelName.length === 0 || mainResult.loading}
                    variant="contained"
                    color="primary"
                >
                    <Trans i18nKey={langKeys.finishreg} />
                </Button>
            )}
        </div>
    );
}