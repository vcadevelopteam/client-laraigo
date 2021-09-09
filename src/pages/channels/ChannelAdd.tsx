import React, { FC, useEffect, useState } from "react";
import { Box, makeStyles, Typography, Paper, Breadcrumbs, Button } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { Facebook as FacebookIcon, Instagram as InstagramIcon, WhatsApp as WhatsAppIcon, Message as MessageIcon } from "@material-ui/icons";
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import { FieldEdit, FieldSelect, TemplateSwitch } from "components";
import { useHistory, useRouteMatch } from "react-router";
import paths from "common/constants/paths";
import FacebookLogin from 'react-facebook-login';
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { getChannelsList, insertChannel } from "store/channel/actions";

interface ChannelOption {
    icon: React.ReactNode;
    label: React.ReactNode;
    onClick: () => void;
}

const useChannelAddStyles = makeStyles(theme => ({
    root: {
        // maxWidth: 815,
        width: 'inherit',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flexGrow: 1,
        backgroundColor: 'inherit',
        textAlign: 'start',
        padding: '0 34px',
        display: 'flex',
        flexDirection: 'column',
    },
    title: {
        fontWeight: 500,
        fontSize: 32,
        margin: '20px 0',
        color: theme.palette.primary.main,
    },
    subtitle: {
        margin: '8px 0 8px 4px',
        fontSize: 20,
        fontWeight: 500,
    },
    optionContainer: {
        margin: 4,
        display: 'flex',
        flexDirection: 'column',
        width: 124,
        height: 110,
        backgroundColor: 'white',
        fontSize: 16,
        fontWeight: 400,
        color: '#A59F9F',
        '&:hover': {
            color: 'white',
            backgroundColor: '#7721AD',
            cursor: 'pointer',
            fontWeight: 700,
        },
    },
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

export const ChannelAdd: FC = () => {
    const [viewSelected, setViewSelected] = useState("mainview");
    const [previousView, setPreviousView] = useState("mainview");
    const [listpages, setListpages] = useState([]);
    const mainResult = useSelector(state => state.channel.channelList)
    const executeResult = useSelector(state => state.channel.successinsert)
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const classes = useChannelAddStyles();
    const { t } = useTranslation();
    const history = useHistory();
    const match = useRouteMatch<{ id: string }>();
    const [fields, setFields] = useState({
        "method": "UFN_COMMUNICATIONCHANNEL_INS",
        "parameters": {
            "id": 0,
            "description": "",
            "type": "",
            "communicationchannelsite": "id del canal",
            "communicationchannelowner": "id del canal",
            "chatflowenabled": false,
            "integrationid": "",
            "color": "",
            "icons": "",
            "other": "",
            "form": "",
            "apikey": "",
        },
        "type": "FACEBOOK",
        "service": {
            "accesstoken": " r.accessToken",
            "siteid": "id sitio",
            "appid": "1094526090706564"
        }
    })

    useEffect(() => {
        if (waitSave) {
            dispatch(showBackdrop(false));
            setWaitSave(false);
        }
    }, [mainResult])
    useEffect(() => {
        if (waitSave) {
            if (mainResult.loading && !mainResult.error && executeResult) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_register) }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (mainResult.error) {
                const errormessage = t(mainResult.code || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult])

    function setView(name: any) {
        let partialf = fields;
        partialf.type = name
        if (name === "INSTAGRAM" || name === "FACEBOOK" || name === "MESSENGER") {
            partialf.service.appid = name === "INSTAGRAM" ? "1924971937716955" : "1094526090706564"
        }
        setFields(partialf)
        if (name === "WHATSAPP") {
            setViewSelected("viewwhatsapp");
        } else
            setViewSelected("viewfacebook");
    }


    const socialMediaOptions: ChannelOption[] = [
        {
            icon: <FacebookIcon color="inherit" />,
            label: 'Facebook',
            onClick: () => {
                // FB.init({
                //     appId: '1094526090706564',
                //     cookie: true,
                //     xfbml: true,
                //     version: 'v8.0'
                // });
                setView("FACEBOOK")
            },
        },
        {
            icon: <InstagramIcon color="inherit" />,
            label: 'Instagram',
            onClick: () => { setView("INSTAGRAM") },
        },
        {
            icon: <MessageIcon color="inherit" />,
            label: 'Messenger',
            onClick: () => { setView("MESSENGER") },
        },
        {
            icon: <WhatsAppIcon color="inherit" />,
            label: 'Whatsapp',
            onClick: () => { setView("WHATSAPP") },
        },
    ];


    const businessChannelOptions: ChannelOption[] = [
        {
            icon: <FacebookIcon color="inherit" />,
            label: 'Chat Web',
            onClick: () => history.push(paths.CHANNELS_ADD_CHATWEB.resolve(match.params.id)),
        },
        {
            icon: <InstagramIcon color="inherit" />,
            label: 'Instagram',
            onClick: () => { },
        },
    ];
    const processFacebookCallback = async (r: any) => {

        setListpages([])
        if (r.status != "unknown" && !r.error) {
            dispatch(getChannelsList(r.accessToken))
            setViewSelected("viewfacebook2")
            setPreviousView("viewfacebook2")
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }
    }
    function setValueField(value: any) {
        let partialf = fields;
        partialf.parameters.communicationchannelsite = value.id
        partialf.parameters.communicationchannelowner = value.name
        partialf.service.siteid = value.id
        partialf.service.accesstoken = value.access_token

        setFields(partialf)
    }
    function setnameField(value: any) {
        let partialf = fields;
        partialf.parameters.description = value
        setFields(partialf)
    }
    function setvalField(value: any) {
        let partialf = fields;
        partialf.parameters.chatflowenabled = value
        setFields(partialf)
    }
    async function finishreg() {
        dispatch(insertChannel(fields))
        setWaitSave(true);
        setViewSelected("main")
    }
    function setParameter(value: string, field: string) {
        let partialf = fields;
        if (field === "communicationchannel") {
            partialf.parameters.communicationchannelowner = value;
            partialf.parameters.communicationchannelsite = value;
            partialf.service.siteid = value;
        }
        setFields(partialf)
    }
    function setService(value: string, field: string) {
        let partialf = fields;
        partialf.service.accesstoken = value;
        setFields(partialf)
    }

    const Option: FC<{ option: ChannelOption }> = ({ option }) => {
        const [color, setColor] = useState('#989898');

        return (
            <Paper
                className={classes.optionContainer}
                elevation={0}
                onClick={option.onClick}
                onMouseOver={() => setColor('white')}
                onMouseLeave={() => setColor('#989898')}
            >
                <div style={{ flexGrow: 2, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                    {option.icon}
                </div>
                <div style={{ height: 1, backgroundColor: color }} />
                <div style={{ flexGrow: 1, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                    {option.label}
                </div>
            </Paper>
        );
    };

    if (viewSelected === "viewfacebook") {
        return (
            <div style={{ width: '100%' }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); setViewSelected("mainview") }}>
                        {"<< Previous"}
                    </Link>
                </Breadcrumbs>
                <div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>Connect your Facebook</div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1em", padding: "20px" }}>Install the chatbot on your Facebook page and start getting leads.</div>
                    <div style={{ textAlign: "center", padding: "20px", color: "#969ea5" }}>You only need to be an administrator of your Facebook page.</div>

                    {
                        fields.type === "INSTAGRAM" ?
                            <FacebookLogin
                                appId="1924971937716955"
                                autoLoad={false}
                                buttonStyle={{ marginLeft: "calc(50% - 135px)", marginTop: "30px", marginBottom: "20px", backgroundColor: "#7721AD", textTransform: "none" }}
                                fields="name,email,picture"
                                scope="pages_show_list,instagram_basic,instagram_manage_comments,instagram_manage_insights,instagram_content_publish,pages_manage_metadata,public_profile"
                                callback={processFacebookCallback}
                                textButton={"Link your Instagram page"}
                                onClick={(e: any) => {
                                    e.view.window.FB.init({
                                        appId: '1924971937716955',
                                        cookie: true,
                                        xfbml: true,
                                        version: 'v8.0'
                                    });
                                }}
                                icon={<FacebookIcon style={{ color: 'white', marginRight: '8px' }} />}
                            /> :
                            <FacebookLogin
                                appId="1094526090706564"
                                autoLoad={false}
                                buttonStyle={{ marginLeft: "calc(50% - 135px)", marginTop: "30px", marginBottom: "20px", backgroundColor: "#7721ad", textTransform: "none" }}
                                fields="name,email,picture"
                                scope="pages_messaging,pages_read_engagement,pages_manage_engagement,pages_read_user_content,pages_manage_metadata,pages_show_list,public_profile"
                                callback={processFacebookCallback}
                                textButton={"Link your Facebook page"}
                                icon={<FacebookIcon style={{ color: 'white', marginRight: '8px' }} />}
                                onClick={(e: any) => {
                                    e.view.window.FB.init({
                                        appId: '1094526090706564',
                                        cookie: true,
                                        xfbml: true,
                                        version: 'v8.0'
                                    });
                                }}
                            />


                    }
                    <div style={{ textAlign: "center", paddingBottom: "80px", color: "#969ea5", fontStyle: "italic" }}>*We will not publish any content</div>

                </div>
            </div>
        )
    }
    else if (viewSelected === "viewfacebook2") {
        return (
            <div style={{ width: '100%' }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); setViewSelected("viewfacebook") }}>
                        {"<< Previous"}
                    </Link>
                </Breadcrumbs>
                <div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>Connect your Facebook</div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldSelect
                            onChange={(value) => setValueField(value)}
                            label={"Select the page to link"}
                            className="col-6"
                            data={mainResult.data}
                            optionDesc="name"
                            optionValue="id"
                        />
                    </div>

                    <div style={{ paddingLeft: "80%" }}>
                        <Button
                            onClick={() => { setViewSelected("viewfinishreg") }}
                            className={classes.button}
                            variant="contained"
                            color="primary"
                        >{t(langKeys.next)}
                        </Button>

                    </div>

                </div>
            </div>
        )
    }
    else if (viewSelected === "viewwhatsapp") {
        return (
            <div style={{ width: '100%' }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); setViewSelected("mainview") }}>
                        {"<< Previous"}
                    </Link>
                </Breadcrumbs>
                <div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px", marginLeft: "auto", marginRight: "auto", maxWidth: "800px" }}>To connect a whatsapp channel you must click on "Register Whatsapp account" and once you finishthe registration, enter the number and the API Key in this form</div>

                    <Button
                        className={classes.centerbutton}
                        variant="contained"
                        color="primary"
                        //disabled={loading}
                        onClick={() => { setViewSelected("viewfinishreg") }}
                    >Register Whatsapp Account
                    </Button>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={(value) => setParameter(value, "communicationchannel")}
                            label={"Enter the number to connect"}
                            className="col-6"
                        />
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={(value) => setService(value, "accesstoken")}
                            label={"Enter the API Key"}
                            className="col-6"
                        />
                    </div>

                </div>
            </div>
        )
    }
    else if (viewSelected === "viewfinishreg") {
        return (
            <div style={{ width: '100%' }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); setViewSelected(previousView) }}>
                        {"<< Previous"}
                    </Link>
                </Breadcrumbs>
                <div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px", marginLeft: "auto", marginRight: "auto", maxWidth: "800px" }}>You are one click away from connecting your communication channel</div>

                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={(value) => setnameField(value)}
                            label={"Give your channel a name"}
                            className="col-6"
                        />
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <TemplateSwitch
                            onChange={(value) => setvalField(value)}
                            label={"Enable Automated Conversational Flow"}
                            className="col-6"
                        />
                    </div>
                    <div style={{ paddingLeft: "80%" }}>
                        <Button
                            onClick={() => { finishreg() }}
                            className={classes.button}
                            variant="contained"
                            color="primary"
                        >{"FINISH REGISTRATION"}
                        </Button>

                    </div>

                </div>
            </div>
        )
    }

    else {
        return (<Box className={classes.root}>
            <div className={classes.content}>
                <h2 className={classes.title}>We want to know how you communicate</h2>
                <div style={{ height: 29 }} />
                <Typography className={classes.subtitle}>Social Media Channel</Typography>
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    {socialMediaOptions.map((e, i) =>
                        <Option
                            key={`social_media_option_${i}`}
                            option={e}
                        />
                    )}
                </div>
                <Typography className={classes.subtitle}>Business Channel</Typography>
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    {businessChannelOptions.map((e, i) => <Option key={`business_channel_option_${i}`} option={e} />)}
                </div>
            </div>
        </Box>)
    }
};
function setWaitSave(arg0: boolean) {
    throw new Error("Function not implemented.");
}

