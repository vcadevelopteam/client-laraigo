/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useRef, useState } from "react";
import { makeStyles, Breadcrumbs, Button, Box, AppBar, Tabs, Tab, Grid, IconButton, FormHelperText, Tooltip, TextField, withStyles, Typography } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import { ColorInput, FieldEdit, IOSSwitch } from "components";
import { useHistory, useLocation } from "react-router";
import paths from "common/constants/paths";
import { useForm, UseFormReturn } from 'react-hook-form';
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { insertChannel } from "store/channel/actions";
import { AndroidIcon } from "icons";
import clsx from 'clsx';
import { Close, CloudUpload } from "@material-ui/icons";
import InfoIcon from '@material-ui/icons/Info';
import { IAndroidSDKAdd } from "@types";

interface TabPanelProps {
    value: string;
    index: string;
}
const useTabPanelStyles = makeStyles(theme => ({
    root: {
        border: '#A59F9F 1px solid',
        borderRadius: 6,
    },
}));
const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
}))(Tooltip);
const TabPanel: FC<TabPanelProps> = ({ children, value, index }) => {
    const classes = useTabPanelStyles();

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            className={classes.root}
            id={`wrapped-tabpanel-${index}`}
            aria-labelledby={`wrapped-tab-${index}`}
            style={{ display: value === index ? 'block' : 'none' }}
        >
            <Box p={3}>
                {children}
            </Box>
        </div>
    );
}


const useChannelAddStyles = makeStyles(theme => ({
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial',
        width: "180px"
    },
    tabs: {
        color: '#989898',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 'inherit',
    },
    activetab: {
        color: 'white',
        backgroundColor: '#7721ad!important',
    },
    tab: {
        // width: 130,
        height: 45,
        maxWidth: 'unset',
        border: '#A59F9F 1px solid',
        borderRadius: 6,
        backgroundColor: 'white',
        flexGrow: 1,
    },
    arrowRight: {
        width: 0, 
        height: 0, 
        borderTop: "20px solid transparent",
        borderBottom: "20px solid transparent",
    },
    currentArrow:{
        borderLeft: "20px solid #7721ad"
    },
    nextArrow: {
        borderLeft: "20px solid #c0bcbc"
    },
    previousArrow: {
        borderLeft: "20px solid #00b050"
    },
    step: {
        backgroundColor: "#7721ad",
        height: "40px",
        color: "white",
        padding: "10px 25px 5px",
        textAlign: "center",
        verticalAlign: "middle",
        width: 100
    },
    currentStep:{
        backgroundColor: "#7721ad",
    },
    nextStep: {
        backgroundColor: "#c0bcbc",
    },
    previousStep: {
        backgroundColor: "#00b050",
    },
    separator: {
        borderBottom: "2px solid #D1CBCB",
        width: "15%",
        height: 0,
        paddingTop: 18,
        marginLeft: 4,
        marginRight: 4
    },
    text: {
        fontWeight: 500,
        fontSize: 16,
        color: '#381052',
    },
    imgContainer: {
        borderRadius: 20,
        backgroundColor: 'white',
        width: 157,
        height: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    img: {
        height: '80%',
        width: 'auto',
    },
    icon: {
        '&:hover': {
            cursor: 'pointer',
            color: theme.palette.primary.main,
        }
    },
}));

const isEmpty = (str?: string) => {
    return !str || str.length === 0;
}
interface whatsAppData {
    typeWhatsApp?: string;
    row?: any;
}

const getImgUrl = (file: File | string | null): string | null => {
    if (!file) return null;

    try {
        if (typeof file === "string") {
            return file;
        } else if (typeof file === "object") {
            return URL.createObjectURL(file);
        }
        return null;
    } catch (ex) {
        console.error(ex);
        return null;
    }
}

export const AndroidExtra: FC = () => {return <></>}
export const AndroidForm: FC = () => {return <></>}
export const AndroidColor: FC = () => {return <></>}
export const AndroidInterface: FC<{setTabIndex: (f:string)=>void, form: UseFormReturn<IAndroidSDKAdd>}> = ({setTabIndex,form}) => {    
    const classes = useChannelAddStyles();
    const { setValue, getValues, formState: { errors } } = form;
    const { t } = useTranslation();
    const [enable, setEnable] = useState(getValues('bubble.active'));
    const [msgTooltip, setMsgTooltip] = useState(getValues('bubble.messagebubble'));
    const [chatTittle, setchatTittle] = useState(getValues('interface.chattitle'));
    const [chatSubtittle, setchatSubtittle] = useState(getValues('interface.chattitle'));
    const [botnametext, setbotnametext] = useState(getValues('extra.botnametext'));
    const [msgTooltipIMGPosition, setMsgTooltipIMGPosition] = useState({
        right: document?.getElementById("msgtooltip")?.clientWidth||0,
        bottom: document?.getElementById("msgtooltip")?.clientHeight||0
    });
    const [chatBtn, setChatBtn] = useState<File | string | null>(getValues('interface.iconbutton'));
    const [waitingImg, setWaitingImg] = useState<File | string | null>(getValues('bubble.iconbubble'));
    const [headerBtn, setHeaderBtn] = useState<File | string | null>(getValues('interface.iconheader'));
    const [botBtn, setBotBtn] = useState<File | string | null>(getValues('interface.iconbot'));
    const chatImgUrl = getImgUrl(chatBtn);
    const waitingImgUrl = getImgUrl(waitingImg);
    const headerImgUrl = getImgUrl(headerBtn);
    const botImgUrl = getImgUrl(botBtn);


    useEffect(() => {
        setMsgTooltipIMGPosition({
            right: document?.getElementById("msgtooltip")?.clientWidth||0,
            bottom: document?.getElementById("msgtooltip")?.clientHeight||0
        })
    }, [msgTooltip])

    const handleEnableChange = (checked: boolean) => {
        setEnable(checked);
        setValue('bubble.active', checked);
    }

    const onChangeChatInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.files) return;
        setChatBtn(e.target.files[0]);
        //setValue("interface.iconbutton", e.target.files[0]);
    }

    const handleChatBtnClick = () => {
        const input = document.getElementById('chatBtnInput');
        input!.click();
    }

    const handleCleanChatInput = () => {
        if (!chatBtn) return;
        const input = document.getElementById('chatBtnInput') as HTMLInputElement;
        input.value = "";
        setChatBtn(null);
        //setValue('interface.iconbutton', null);
    }

    const onChangeWaitingInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.files) return;
        setWaitingImg(e.target.files[0]);
        setValue('bubble.iconbubble', e.target.files[0]);
    }

    const handleWaitingBtnClick = () => {
        const input = document.getElementById('waitingBtnInput');
        input!.click();
    }

    const handleCleanWaitingInput = () => {
        if (!waitingImg) return;
        const input = document.getElementById('waitingBtnInput') as HTMLInputElement;
        input.value = "";
        setWaitingImg(null);
        setValue('bubble.iconbubble', null);
    }
    
    const onChangeHeaderInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.files) return;
        setHeaderBtn(e.target.files[0]);
        setValue('interface.iconheader', e.target.files[0]);
    }

    const onChangeBotInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.files) return;
        setBotBtn(e.target.files[0]);
        setValue('interface.iconbot', e.target.files[0]);
    }

    const handleHeaderBtnClick = () => {
        const input = document.getElementById('headerBtnInput');
        input!.click();
    }

    const handleBotBtnClick = () => {
        const input = document.getElementById('botBtnInput');
        input!.click();
    }

    const handleCleanHeaderInput = () => {
        if (!headerBtn) return;
        const input = document.getElementById('headerBtnInput') as HTMLInputElement;
        input.value = "";
        setHeaderBtn(null);
        setValue('interface.iconheader', null);
    }

    const handleCleanBotInput = () => {
        if (!botBtn) return;
        const input = document.getElementById('botBtnInput') as HTMLInputElement;
        input.value = "";
        setBotBtn(null);
        setValue('interface.iconbot', null);
    }

    return <>
        <div style={{ display: 'flex', width: "100%" }}>
            <div style={{width: "50%", minWidth: 500, borderRight: "2px solid #76acdc", padding: 10}}>
                
                <Grid container direction="column">
                    <Grid container direction="row" style={{display: "flex", width: "100%", margin: "5px 8px"}}>
                        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                            <label className={classes.text}>
                                <Trans i18nKey={langKeys.chatButton} />
                                <Tooltip title={`${t(langKeys.chatButtonTooltip)}`} placement="top-start">
                                    <InfoIcon style={{padding: "5px 0 0 5px"}} />
                                </Tooltip>
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                <div className={classes.imgContainer}>
                                    {chatImgUrl && <img src={chatImgUrl} alt="icon button" className={classes.img} />}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', marginLeft: 12 }}>
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="chatBtnInput"
                                        type="file"
                                        onChange={onChangeChatInput}
                                    />
                                    <IconButton onClick={handleChatBtnClick}>
                                        <CloudUpload className={classes.icon} />
                                    </IconButton>
                                    <IconButton onClick={handleCleanChatInput}>
                                        <Close className={classes.icon} />
                                    </IconButton>
                                </div>
                            </div>
                            <FormHelperText error={!isEmpty(errors?.interface?.iconbutton?.message)} style={{ marginLeft: 14 }}>
                                {errors?.interface?.iconbutton?.message}
                            </FormHelperText>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Box m={1}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                    <label className={classes.text}>
                                        <Trans i18nKey={langKeys.bubble} />
                                        <Tooltip title={`${t(langKeys.bubbleTooltip)}`} placement="top-start">
                                            <InfoIcon style={{padding: "5px 0 0 5px"}} />
                                        </Tooltip>
                                    </label>
                                </Grid>
                                <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                                    <IOSSwitch checked={enable} onChange={(_, v) => handleEnableChange(v)} />
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Box m={1} style={{ display: enable ? 'block' : 'none' }}>
                            <Grid container direction="row">
                                <Grid item xs={1} sm={2} md={2} lg={2} xl={2}/>
                                <Grid item xs={11} sm={2} md={2} lg={2} xl={2}>
                                    <label className={classes.text}>{t(langKeys.text)}</label>
                                    <Tooltip title={`${t(langKeys.bubbleTooltipText)}`} placement="top-start">
                                        <InfoIcon style={{padding: "5px 0 0 5px"}} />
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        placeholder={t(langKeys.textOfTheMessage)}
                                        name="text"
                                        size="small"
                                        defaultValue={getValues('bubble.messagebubble')}
                                        onChange={e => {setValue('bubble.messagebubble', e.target.value);setMsgTooltip(e.target.value);}}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid container direction="row" style={{ width: "100%", display: enable ? 'flex' : 'none'}} >
                        <Grid item xs={1} sm={2} md={2} lg={2} xl={2}/>
                        <Grid item xs={11} sm={2} md={2} lg={2} xl={2}>
                            <label className={classes.text} style={{margin: "5px 8px"}}>
                                <Trans i18nKey={langKeys.image} />
                                <Tooltip title={`${t(langKeys.bubbleTooltipImage)}`} placement="top-start">
                                    <InfoIcon style={{padding: "5px 0 0 5px"}} />
                                </Tooltip>
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                <div className={classes.imgContainer}>
                                    {waitingImgUrl && <img src={waitingImgUrl} alt="bubble button" className={classes.img} />}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', marginLeft: 12 }}>
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="waitingBtnInput"
                                        type="file"
                                        onChange={onChangeWaitingInput}
                                    />
                                    <IconButton onClick={handleWaitingBtnClick}>
                                        <CloudUpload className={classes.icon} />
                                    </IconButton>
                                    <IconButton onClick={handleCleanWaitingInput}>
                                        <Close className={classes.icon} />
                                    </IconButton>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Box m={1}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                    <label className={classes.text}>
                                        <Trans i18nKey={langKeys.title} />
                                        <Tooltip title={`${t(langKeys.interfaceTitleTooltip)}`} placement="top-start">
                                            <InfoIcon style={{padding: "5px 0 0 5px"}} />
                                        </Tooltip>
                                    </label>
                                </Grid>
                                <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        name="titulo"
                                        size="small"
                                        placeholder={t(langKeys.chatHeaderTitle)} // "Título de la cabecera del chat"
                                        defaultValue={getValues('interface.chattitle')}
                                        onChange={(e) => {setValue('interface.chattitle', e.target.value); setchatTittle(e.target.value)}}
                                        error={!isEmpty(errors?.interface?.chattitle?.message)}
                                        helperText={errors?.interface?.chattitle?.message}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Box m={1}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                    <label className={classes.text}>
                                        <Trans i18nKey={langKeys.subtitle} />
                                        <Tooltip title={`${t(langKeys.interfaceSubtitleTooltip)}`} placement="top-start">
                                            <InfoIcon style={{padding: "5px 0 0 5px"}} />
                                        </Tooltip>
                                    </label>
                                </Grid>
                                <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        placeholder={t(langKeys.chatHeaderSubtitle)}
                                        name="subtitulo"
                                        size="small"
                                        defaultValue={getValues('interface.chatsubtitle')}
                                        onChange={(e) => {setValue('interface.chatsubtitle', e.target.value);setchatSubtittle(e.target.value)}}
                                        error={!isEmpty(errors?.interface?.chatsubtitle?.message)}
                                        helperText={errors?.interface?.chatsubtitle?.message}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid container direction="row" style={{display: "flex", width: "100%", margin: "5px 8px"}}>
                        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                            <label className={classes.text}>
                                <Trans i18nKey={langKeys.header} />
                                <Tooltip title={`${t(langKeys.headerTooltip)}`} placement="top-start">
                                    <InfoIcon style={{padding: "5px 0 0 5px"}} />
                                </Tooltip>
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                <div className={classes.imgContainer}>
                                    {headerImgUrl && <img src={headerImgUrl} alt="header button" className={classes.img} />}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', marginLeft: 12 }}>
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="headerBtnInput"
                                        type="file"
                                        onChange={onChangeHeaderInput}
                                    />
                                    <IconButton onClick={handleHeaderBtnClick}>
                                        <CloudUpload className={classes.icon} />
                                    </IconButton>
                                    <IconButton onClick={handleCleanHeaderInput}>
                                        <Close className={classes.icon} />
                                    </IconButton>
                                </div>
                            </div>
                            <FormHelperText error={!isEmpty(errors?.interface?.iconheader?.message)} style={{ marginLeft: 14 }}>
                                {errors?.interface?.iconheader?.message}
                            </FormHelperText>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" style={{display: "flex", width: "100%", margin: "5px 8px"}}>
                        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                            <label className={classes.text}>
                                <Trans i18nKey={langKeys.botButton} />
                                <Tooltip title={`${t(langKeys.botButtonTooltip)}`} placement="top-start">
                                    <InfoIcon style={{padding: "5px 0 0 5px"}} />
                                </Tooltip>
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                <div className={classes.imgContainer}>
                                    {botImgUrl && <img src={botImgUrl} alt="bot button" className={classes.img} />}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', marginLeft: 12 }}>
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="botBtnInput"
                                        type="file"
                                        onChange={onChangeBotInput}
                                    />
                                    <IconButton onClick={handleBotBtnClick}>
                                        <CloudUpload className={classes.icon} />
                                    </IconButton>
                                    <IconButton onClick={handleCleanBotInput}>
                                        <Close className={classes.icon} />
                                    </IconButton>
                                </div>
                            </div>
                            <FormHelperText error={!isEmpty(errors?.interface?.iconbot?.message)} style={{ marginLeft: 14 }}>
                                {errors?.interface?.iconbot?.message}
                            </FormHelperText>
                        </Grid>
                    </Grid>                    
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Box m={1}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                    <label className={classes.text}>
                                        <Trans i18nKey={langKeys.botName} />
                                        <Tooltip title={`${t(langKeys.botNameTooltip)}`} placement="top-start">
                                            <InfoIcon style={{padding: "5px 0 0 5px"}} />
                                        </Tooltip>
                                    </label>
                                </Grid>
                                <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        name="titulo"
                                        size="small"
                                        placeholder={t(langKeys.botName)}
                                        defaultValue={getValues('extra.botnametext')}
                                        onChange={e => {setValue('extra.botnametext', e.target.value); setbotnametext(e.target.value)}}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </div>            
            <div style={{width: "50%", minWidth: 500, display:"flex", paddingLeft: 24, paddingBottom: 24, flexDirection: 'column', gap: 8}}>
                <div><Typography variant="h6" >{t(langKeys.homepage)}</Typography></div>
                <div style={{ display: 'flex', width: "100%"}} className={classes.tab}>   
                    <HtmlTooltip  arrow 
                        open={enable}
                        placement="top-end"
                        title={
                            <React.Fragment>
                                {!!waitingImgUrl &&
                                    <Avatar src={waitingImgUrl||""}  style={{width: 50, height: 50, border: '0.1px solid lightgray', position:'absolute', right: msgTooltipIMGPosition.right, bottom: msgTooltipIMGPosition.bottom }}/>
                                }
                                <Typography color="inherit" id="msgtooltip">{msgTooltip}</Typography>
                            </React.Fragment>
                            }
                    >  
                        <Avatar src={chatImgUrl||""}  style={{width: 75, height: 75, border: '0.1px solid lightgray', top: "calc(50% - 38px)", left: "calc(50% - 38px)" }}/>
                    </HtmlTooltip>
                </div>
                <div><Typography variant="h6" >Chat</Typography></div>
                <div style={{ display: 'flex', width: "100%", flexDirection: 'column' }} className={classes.tab}>
                    <div style={{padding:20, margin:"20px 20px 0 20px", display:"flex", width:"calc(100% - 40px)", height: 75, border: '#A59F9F 1px solid', borderRadius: "6px 6px 0 0 "}}>
                         <Avatar src={headerImgUrl||""}  style={{width: 35, height: 35, border: '0.1px solid lightgray' }}/>
                        <div style={{height: "100%", width: "100%",  paddingLeft: 25, fontSize: "1.1em", paddingTop: 5}}>{chatTittle}</div>
                    </div>
                    <div style={{padding:5, margin:"0 20px", display:"flex", width:"calc(100% - 40px)", height: 45, border: '#A59F9F 1px solid'}}>  
                        <div style={{height: "100%", width: "100%",  textAlign: 'center', fontSize: "1em", paddingTop: 5}}>{chatSubtittle}</div>
                    </div>
                    <div style={{padding:5, margin:"0 20px", display:"flex", width:"calc(100% - 40px)", height: 'calc(100% - 160px)', border: '#A59F9F 1px solid', flexDirection: 'column', borderRadius: "0 0 6px 6px"}}>  
                        <div style={{fontSize: "0.8em", paddingTop: 5, width: 50, textAlign: 'center',whiteSpace: "initial", wordWrap: 'break-word'}}>{botnametext}</div>
                        <div style={{display:"flex", height: 30, paddingLeft: 10, }}>
                            <Avatar src={botImgUrl||""}  style={{width: 30, height: 30, border: '0.1px solid lightgray' }}/>
                            <div style={{height: "100%", width: "100%",  paddingLeft: 10, fontSize: "1.1em", paddingTop: 5}}>Te saluda {botnametext}. en qúe puedo ayudarte</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Button
            variant="contained"
            color="primary"
            style={{width: "100%", backgroundColor: "#7721ad", padding: 10}}
            onClick={()=>setTabIndex('1')}>
            {t(langKeys.next)}
        </Button>
    </>
}
export const ChannelAddAndroidDetail: FC<{form: UseFormReturn<IAndroidSDKAdd>}> = ({form}) => {    
    const classes = useChannelAddStyles();
    const [tabIndex, setTabIndex] = useState('0');
    const { t } = useTranslation();
    return <>
        <div style={{ height: 20 }} />
        <div style={{display: "flex", width: "100%", paddingLeft: "calc(27.5% - 240px)", minWidth: 500}} >
            <div style={{display: "flex"}}>
                <div className={clsx(classes.step, tabIndex === "0" && classes.currentStep, tabIndex > "0" && classes.previousStep, tabIndex < "0" && classes.nextStep)}>{t(langKeys.step)} 1</div>
                <div className={clsx(classes.arrowRight, tabIndex === "0" && classes.currentArrow, tabIndex > "0" && classes.previousArrow, tabIndex < "0" && classes.nextArrow)}></div>
            </div>
            <div className={classes.separator}> </div>
            <div style={{display: "flex"}}>
                <div className={clsx(classes.step, tabIndex === "1" && classes.currentStep, tabIndex > "1" && classes.previousStep, tabIndex < "1" && classes.nextStep)}>{t(langKeys.step)} 2</div>
                <div className={clsx(classes.arrowRight, tabIndex === "1" && classes.currentArrow, tabIndex > "1" && classes.previousArrow, tabIndex < "1" && classes.nextArrow)}></div>
            </div>
            <div className={classes.separator}> </div>
            <div style={{display: "flex"}}>
                <div className={clsx(classes.step, tabIndex === "2" && classes.currentStep, tabIndex > "2" && classes.previousStep, tabIndex < "2" && classes.nextStep)}>{t(langKeys.step)} 3</div>
                <div className={clsx(classes.arrowRight, tabIndex === "2" && classes.currentArrow, tabIndex > "2" && classes.previousArrow, tabIndex < "2" && classes.nextArrow)}></div>
            </div>
            <div className={classes.separator}> </div>
            <div style={{display: "flex"}}>
                <div className={clsx(classes.step, tabIndex === "3" && classes.currentStep, tabIndex > "3" && classes.previousStep, tabIndex < "3" && classes.nextStep)}>{t(langKeys.step)} 4</div>
                <div className={clsx(classes.arrowRight, tabIndex === "3" && classes.currentArrow, tabIndex > "3" && classes.previousArrow, tabIndex < "3" && classes.nextArrow)}></div>
            </div>
        </div>
        <div style={{ height: 20 }} />
        <AppBar position="static" elevation={0}>
            <Tabs
                value={tabIndex}
                className={classes.tabs}
                TabIndicatorProps={{ style: { display: 'none' } }}
            >
                <Tab className={clsx(classes.tab, tabIndex === "0" && classes.activetab)} label={<Trans i18nKey={langKeys.chatinterface} />} value="0" />
                <Tab className={clsx(classes.tab, tabIndex === "1" && classes.activetab)} label={<Trans i18nKey={langKeys.color} count={2} />} value="1" />
                <Tab className={clsx(classes.tab, tabIndex === "2" && classes.activetab)} label={<Trans i18nKey={langKeys.form} />} value="2" />
                <Tab className={clsx(classes.tab, tabIndex === "3" && classes.activetab)} label={<Trans i18nKey={langKeys.extra} count={2}/>} value="3" />
            </Tabs>
        </AppBar>
        <TabPanel value="0" index={tabIndex}><AndroidInterface  form={form} setTabIndex={setTabIndex}/></TabPanel>
        <TabPanel value="1" index={tabIndex}><AndroidColor/></TabPanel>
        <TabPanel value="2" index={tabIndex}><AndroidForm/></TabPanel>
        <TabPanel value="3" index={tabIndex}><AndroidExtra/></TabPanel>
    </>
}

export const ChannelAddAndroid: FC<{ edit: boolean }> = ({ edit }) => {
    const [waitSave, setWaitSave] = useState(false);
    const [setins, setsetins] = useState(false);
    const [channelreg, setChannelreg] = useState(true);
    const [showRegister, setShowRegister] = useState(true);
    const [showClose, setShowClose] = useState(false);
    const [showScript, setShowScript] = useState(false);
    const [integrationId, setIntegrationId] = useState('');
    const [view, setView] = useState('view-1');
    const mainResult = useSelector(state => state.channel.channelList);
    const executeResult = useSelector(state => state.channel.successinsert);
    const history = useHistory();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [coloricon, setcoloricon] = useState("#90c900");
    const classes = useChannelAddStyles();
    const service = useRef<IAndroidSDKAdd | null>(null);
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
            "coloricon": "#90c900",
        },
        "type": "SMOOCHANDROID",
    })

    const form: UseFormReturn<IAndroidSDKAdd> = useForm<IAndroidSDKAdd>({
        defaultValues: service.current || {
            interface: {
                chattitle: "",
                chatsubtitle: "",
                iconbutton: null,
                iconheader: null,
                iconbot: null,
            },
            color: {
                header: "#fff",
                background: "#F9F9FA",
                border: "#EBEAED",
                client: "#fff",
                bot: "#aa53e0",
            },
            form: [],
            bubble: {
                active: true,
                messagebubble: "",
                iconbubble: null,
            },
            extra: {
                uploadfile: true,
                uploadaudio: true,
                uploadimage: true,
                uploadlocation: true,
                uploadvideo: true,
                reloadchat: true,
                poweredby: true,

                persistentinput: true,
                abandonevent: true,
                alertsound: true,
                formhistory: true,
                enablemetadata: true,

                customcss: "",
                customjs: "",

                botnameenabled: true,
                botnametext: "",
            },
        }
    });
    const location = useLocation<whatsAppData>();

    const whatsAppData = location.state as whatsAppData | null;

    async function finishreg() {
        setsetins(true)
        dispatch(insertChannel(fields))
        setWaitSave(true);
    }

    async function goback() {
        history.push(paths.CHANNELS);
    }

    useEffect(() => {
        if (!mainResult.loading && setins) {
            if (executeResult) {
                setsetins(false)
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
                setShowRegister(false);
                setShowClose(true);
                setShowScript(true);
                setIntegrationId(mainResult.data[0].integrationId);
            } else if (!executeResult) {
                const errormessage = t(mainResult.code || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [mainResult])

    useEffect(() => {
        if (waitSave) {
            dispatch(showBackdrop(false));
            setWaitSave(false);
        }
    }, [mainResult])

    function setnameField(value: any) {
        setChannelreg(value === "")
        let partialf = fields;
        partialf.parameters.description = value
        setFields(partialf)
    }

    return (
        <div style={{ width: '100%' }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); history.push(paths.CHANNELS_ADD, whatsAppData) }}>
                    {t(langKeys.previoustext)}
                </Link>
            </Breadcrumbs>
            {view === "view-1" && <ChannelAddAndroidDetail form={form} />}
            {view === "view-2" && <><div>
                <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px", marginLeft: "auto", marginRight: "auto", maxWidth: "800px" }}>{t(langKeys.commchannelfinishreg)}</div>
                <div className="row-zyx">
                    <div className="col-3"></div>
                    <FieldEdit
                        onChange={(value) => setnameField(value)}
                        label={t(langKeys.givechannelname)}
                        className="col-6"
                    />
                </div>
                <div className="row-zyx">
                    <div className="col-3"></div>
                    <div className="col-6">
                        <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                            {t(langKeys.givechannelcolor)}
                        </Box>
                        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                            <AndroidIcon style={{ fill: `${coloricon}`, width: "100px" }} />
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
                </div>
                <div style={{ paddingLeft: "80%" }}>
                    {showRegister ?
                        <Button
                            onClick={() => { finishreg() }}
                            className={classes.button}
                            disabled={channelreg || mainResult.loading}
                            variant="contained"
                            color="primary"
                        >{t(langKeys.finishreg)}
                        </Button>
                        : null
                    }
                    {showClose ?
                        <Button
                            onClick={() => { goback() }}
                            className={classes.button}
                            disabled={channelreg}
                            variant="contained"
                            color="primary"
                        >{t(langKeys.close)}
                        </Button>
                        : null
                    }
                </div>
            </div>
            <div style={{ display: showScript ? 'flex' : 'none', height: 10 }} />
            <div style={{ display: showScript ? 'flex' : 'none', flexDirection: 'column', marginLeft: 120, marginRight: 120 }}><pre style={{ background: '#d9edf7', border: '1px solid #bce8f1', color: '#31708f', pageBreakInside: 'avoid', fontFamily: 'monospace', lineHeight: 1.6, maxWidth: '100%', overflow: 'auto', padding: '1em 1.5em', display: 'block', wordWrap: 'break-word', width: '100%', whiteSpace: 'break-spaces' }}>
                {<code>{t(langKeys.androidalert)}</code>}
            </pre>
            </div>
            <div style={{ display: showScript ? 'flex' : 'none', height: 10 }} />
            <div style={{ display: showScript ? 'flex' : 'none', flexDirection: 'column', marginLeft: 120, marginRight: 120 }}>
                {t(langKeys.androidlibrary)}
            </div>
            <div style={{ display: showScript ? 'flex' : 'none', flexDirection: 'column', marginLeft: 120, marginRight: 120 }}><pre style={{ background: '#f4f4f4', border: '1px solid #ddd', color: '#666', pageBreakInside: 'avoid', fontFamily: 'monospace', lineHeight: 1.6, maxWidth: '100%', overflow: 'auto', padding: '1em 1.5em', display: 'block', wordWrap: 'break-word', width: '100%', whiteSpace: 'break-spaces' }}><code>
                {"// See https://github.com/smooch/smooch-android to pin the latest version\nimplementation 'io.smooch:core:8.2.2'\nimplementation 'io.smooch:ui:8.2.2'"}
            </code></pre><div style={{ height: 10 }} />
            </div>
            <div style={{ display: showScript ? 'flex' : 'none', flexDirection: 'column', marginLeft: 120, marginRight: 120 }}>
                {t(langKeys.androidstep1)}
            </div>
            <div style={{ display: showScript ? 'flex' : 'none', flexDirection: 'column', marginLeft: 120, marginRight: 120 }}><pre style={{ background: '#f4f4f4', border: '1px solid #ddd', color: '#666', pageBreakInside: 'avoid', fontFamily: 'monospace', lineHeight: 1.6, maxWidth: '100%', overflow: 'auto', padding: '1em 1.5em', display: 'block', wordWrap: 'break-word', width: '100%', whiteSpace: 'break-spaces' }}><code>
                {`Smooch.init(this, new Settings("${integrationId}"), new SmoochCallback<InitializationStatus>() {\n\t@Override\n\tpublic void run(@NonNull Response<InitializationStatus> response) {\n\t\t// Response handling\n\t\tif (response.getData() == InitializationStatus.SUCCESS) {\n\t\t\t// Initialization complete\n\t\t} else {\n\t\t\t// Something went wrong\n\t\t}\n\t}\n});`}
            </code></pre><div style={{ height: 10 }} />
            </div>
            <div style={{ display: showScript ? 'flex' : 'none', flexDirection: 'column', marginLeft: 120, marginRight: 120 }}>
                {t(langKeys.androidstep2)}
            </div>
            <div style={{ display: showScript ? 'flex' : 'none', height: 20 }} /></>}
        </div>
    )
}

export default ChannelAddAndroid