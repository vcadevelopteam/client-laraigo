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
import { SubscriptionContext } from "./context";

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
        setrequestchannels,
    } = useContext(SubscriptionContext);
    const [waitSave, setWaitSave] = useState(false);
    const [pageLink, setPageLink] = useState("");
    const [channelName, setChannelName] = useState("");
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
        if (waitSave) {
            dispatch(showBackdrop(false));
            setWaitSave(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mainResult])

    useEffect(() => {
        if (channelName.length > 0 && pageLink.length > 0) {
            setrequestchannels(prev => {
                const index = prev.findIndex(x => x.type === "FACEBOOK");
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
            setrequestchannels(prev => prev.filter(x => x.type !== "FACEBOOK"));
        }
    }, [channelName, pageLink, fields]);

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
        partialf.parameters.communicationchannelsite = value?.id || ""
        partialf.parameters.communicationchannelowner = value?.name || ""
        partialf.service.siteid = value?.id || ""
        partialf.service.accesstoken = value?.access_token || ""

        setFields(partialf)
    }
    function setnameField(value: any) {
        setChannelName(value)
        let partialf = fields;
        partialf.parameters.description = value
        setFields(partialf)
    }

    return (
        <div className={commonClasses.root}>
            <FacebookColor className={commonClasses.leadingIcon} />
            <IconButton
                color="primary"
                className={commonClasses.trailingIcon}
                onClick={() => {
                    deleteChannel('facebook');
                    setrequestchannels(prev => prev.filter(x => x.type !== "FACEBOOK"));
                }}
            >
                <DeleteOutlineIcon />
            </IconButton>
            <Typography>
                <Trans i18nKey={langKeys.connectface2} />
            </Typography>
            <FieldEdit
                onChange={(value) => setnameField(value)}
                label={t(langKeys.givechannelname)}
                valueDefault={channelName}
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
                valueDefault={pageLink}
                optionDesc="name"
                optionValue="id"
                variant="outlined"
                size="small"
            />

            {pageLink.length === 0 ? (
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
                />
            ) : selectedChannels === 1 && (
                <Button
                    onClick={finishreg}
                    className={commonClasses.button}
                    variant="contained"
                    color="primary"
                    disabled={channelName.length === 0}
                >
                    <Trans i18nKey={langKeys.finishreg} />
                </Button>
            )}
        </div>
    );
}