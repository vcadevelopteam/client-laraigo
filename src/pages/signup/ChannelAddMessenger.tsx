/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext, useEffect, useState } from "react";
import { Button, Typography, IconButton } from '@material-ui/core';
import { showBackdrop } from 'store/popus/actions';
import { DeleteOutline as DeleteOutlineIcon } from "@material-ui/icons";
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import { FieldEdit, FieldSelect, ColorInput } from "components";
import FacebookLogin from 'react-facebook-login';
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { getChannelsListSub } from "store/channel/actions";
import { FacebookMessengerColor } from "icons";
import { apiUrls } from 'common/constants';
import { SubscriptionContext } from "./context";

interface ChannelAddMessengerProps {
    setOpenWarning:(param:any)=>void;
}

export const ChannelAddMessenger: FC<ChannelAddMessengerProps> = ({ setOpenWarning }) => {
    const {
        commonClasses,
        FBButtonStyles,
        selectedChannels,
        finishreg,
        deleteChannel,
    } = useContext(SubscriptionContext);
    const [pageLink, setPageLink] = useState("");
    const [hasFinished, setHasFinished] = useState(false)
    const [waitSave, setWaitSave] = useState(false);
    const [coloricon, setcoloricon] = useState("#0078FF");
    const [channelName, setChannelName] = useState("");
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
            "coloricon": "#0078FF",
        },
        "type": "MESSENGER",
        "service": {
            "accesstoken": "",
            "siteid": "",
            "appid": apiUrls.FACEBOOKAPP
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
    //             const index = prev.findIndex(x => x.type === "MESSENGER");
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
    //         setrequestchannels(prev => prev.filter(x => x.type !== "MESSENGER"));
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
        setPageLink(value?.id || "");
        let partialf = fields;
        partialf.parameters.communicationchannelsite = value?.id||""
        partialf.parameters.communicationchannelowner = value?.name||""
        partialf.service.siteid = value?.id||""
        partialf.service.accesstoken = value?.access_token||""

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
            {!hasFinished && <FacebookMessengerColor className={commonClasses.leadingIcon} />}
            {!hasFinished && <IconButton
                color="primary"
                className={commonClasses.trailingIcon}
                onClick={() => {
                    deleteChannel('messenger');
                    // setrequestchannels(prev => prev.filter(x => x.type !== "MESSENGER"));
                }}
            >
                <DeleteOutlineIcon />
            </IconButton>}
            {!hasFinished && <Typography>
                <Trans i18nKey={langKeys.connectface2} />
            </Typography>}
            {hasFinished && <FacebookMessengerColor
                style={{ width: 100, height: 100, alignSelf: 'center', fill: 'gray' }}/>
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
                    <div style={{display:"flex",justifyContent:"space-around", alignItems: "center"}}>
                        <FacebookMessengerIcon style={{fill: `${coloricon}`, width: "100px" }}/>
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
                    appId={apiUrls.FACEBOOKAPP}
                    autoLoad={false}
                    buttonStyle={FBButtonStyles}
                    fields="name,email,picture"
                    scope="pages_manage_engagement,pages_manage_metadata,pages_messaging,pages_read_engagement,pages_read_user_content,pages_show_list,public_profile"
                    callback={processFacebookCallback}
                    textButton={t(langKeys.connectface)}
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
                    disabled={channelName.length === 0 || mainResult.loading}
                >
                    <Trans i18nKey={langKeys.finishreg} />
                </Button>
            )}
        </div>
    );
}