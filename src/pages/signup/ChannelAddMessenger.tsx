/* eslint-disable react-hooks/exhaustive-deps */
import { CSSProperties, FC, useContext, useState } from "react";
import { makeStyles, Breadcrumbs, Button, Box, Typography, IconButton } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { showBackdrop } from 'store/popus/actions';
import { Facebook as FacebookIcon, DeleteOutline as DeleteOutlineIcon } from "@material-ui/icons";
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import { FieldEdit, FieldSelect, ColorInput } from "components";
import FacebookLogin from 'react-facebook-login';
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { getChannelsListSub } from "store/channel/actions";
import { FacebookMessengerIcon } from "icons";
import { apiUrls } from 'common/constants';
import { SubscriptionContext } from "./context";

interface ChannelAddMessengerProps {
    setrequestchannels:(param:any)=>void;
    setOpenWarning:(param:any)=>void;
}

export const ChannelAddMessenger: FC<ChannelAddMessengerProps> = ({
    setrequestchannels,
    setOpenWarning,
}) => {
    const {
        commonClasses,
        FBButtonStyles,
        deleteChannel,
    } = useContext(SubscriptionContext);
    const [viewSelected, setViewSelected] = useState("view1");
    const [nextbutton, setNextbutton] = useState(true);
    const [coloricon, setcoloricon] = useState("#0078FF");
    const [channelreg, setChannelreg] = useState(true);
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

    async function finishreg() {
        setrequestchannels((p:any)=>([...p,fields]))
        deleteChannel('messenger');
    }

    const processFacebookCallback = async (r: any) => {
        if (r.status !== "unknown" && !r.error) {
            dispatch(getChannelsListSub(r.accessToken))
            setViewSelected("view2")
            dispatch(showBackdrop(true));
        }
    }
    function setValueField(value: any) {
        setNextbutton(value==null)
        let partialf = fields;
        partialf.parameters.communicationchannelsite = value?.id||""
        partialf.parameters.communicationchannelowner = value?.name||""
        partialf.service.siteid = value?.id||""
        partialf.service.accesstoken = value?.access_token||""

        setFields(partialf)
    }
    function setnameField(value: any) {
        setChannelreg(value === "")
        let partialf = fields;
        partialf.parameters.description = value
        setFields(partialf)
    }

    return (
        <div className={commonClasses.root}>
            {viewSelected === "view1" && (
                <FacebookMessengerIcon
                    className={commonClasses.leadingIcon}
                />
            )}
            {viewSelected === "view1" && (
                <IconButton
                    color="primary"
                    className={commonClasses.trailingIcon}
                    onClick={() => deleteChannel('messenger')}
                >
                    <DeleteOutlineIcon />
                </IconButton>
            )}
            <Typography>
                <Trans i18nKey={langKeys.connectface2} />
            </Typography>
            <FieldEdit
                onChange={(value) => setnameField(value)}
                label={t(langKeys.givechannelname)}
                variant="outlined"
                size="small"
            />
            <FieldSelect
                onChange={(value) => setValueField(value)}
                label={t(langKeys.selectpagelink)}
                data={mainResult.data}
                optionDesc="name"
                optionValue="id"
                variant="outlined"
                size="small"
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
            {viewSelected === "view1" ? (
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
                />
            ) :
            (
                <Button
                    onClick={finishreg}
                    className={commonClasses.button}
                    variant="contained"
                    color="primary"
                    disabled={nextbutton}
                >
                    <Trans i18nKey={langKeys.next} />
                </Button>
            )}
        </div>
    );
}