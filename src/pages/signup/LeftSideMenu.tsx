import { FC, useContext, useMemo, useState } from "react";
import { Breadcrumbs, Button, Link, makeStyles, TextField } from "@material-ui/core";
import { ChannelAddFacebook } from './ChannelAddFacebook'
import { ChannelAddInstagram } from './ChannelAddInstagram'
import { ChannelAddInstagramDM } from './ChannelAddInstagramDM'
import { ChannelAddMessenger } from './ChannelAddMessenger'
import { ChannelAddWhatsapp } from './ChannelAddWhatsapp'
import { ChannelAddTelegram } from './ChannelAddTelegram'
import { ChannelAddTwitter } from './ChannelAddTwitter'
import { ChannelAddTwitterDM } from './ChannelAddTwitterDM'
import { ChannelAddChatWeb } from './ChannelAddChatWeb'
import { ChannelAddAndroid } from './ChannelAddAndroid'
import { ChannelAddIos } from './ChannelAddIos'
import { Trans, useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { ListChannels, SubscriptionContext, MainData } from "./context";
import { useSelector } from "hooks";
import { Controller, useFormContext } from "react-hook-form";
import { FieldSelect } from "components";

const useLeftSideStyles = makeStyles(theme => ({
    root: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        padding: 40,
        overflowY: 'auto',
        overflowX: 'hidden',
    },
    title: {
        color: theme.palette.primary.main,
        textAlign: 'center',
    },
    channelList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2em',
    },
}));

interface LeftSideProps {
    setOpenWarning: (param: any) => void;
}

export const LeftSide: FC<LeftSideProps> = ({ setOpenWarning }) => {
    const { t } = useTranslation();
    const [currentView, setCurrentView] = useState("view-1");
    const { getValues, control, trigger } = useFormContext<MainData>();
    const classes = useLeftSideStyles();
    const {
        foreground,
        listchannels,
        selectedChannels,
        finishreg,
        onCheckFunc,
        commonClasses,
    } = useContext(SubscriptionContext);  
    const executeResult = useSelector(state => state.signup.insertChannel);
    const datamonth = useMemo(() => ([
        { id: 1, desc: "01" },
        { id: 2, desc: "02" },
        { id: 3, desc: "03" },
        { id: 4, desc: "04" },
        { id: 5, desc: "05" },
        { id: 6, desc: "06" },
        { id: 7, desc: "07" },
        { id: 8, desc: "08" },
        { id: 9, desc: "09" },
        { id:10, desc: "10" },
        { id:11, desc: "11" },
        { id:12, desc: "12" },
    ]), [t]);
    const channels = useMemo(() => {
        if (listchannels === undefined) {
            return null;
        }

        return Object
            .keys(listchannels)
            .filter(x => {
                /*if (foreground !== undefined) {
                    return (
                        listchannels[x as keyof ListChannels] === true &&
                        foreground === x
                    );
                }*/

                return listchannels[x as keyof ListChannels] === true;
            })
            .map((key, i) => {
                let display = true;
                if (foreground !== undefined) {
                    display = foreground === key;
                }

                return (
                    <GetComponent
                        channel={key as keyof ListChannels}
                        setOpenWarning={setOpenWarning}
                        key={key}
                        display={display}
                    />
                );
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listchannels, foreground]);

    return (
        <div className={classes.root}>
            {currentView==="view-1"?(<>
                {!foreground && (
                    <Breadcrumbs aria-label="breadcrumb" style={{ marginBottom: '1em' }}>
                        <Link
                            color="textSecondary"
                            href="/"
                            onClick={(e) => {
                                e.preventDefault();
                                setOpenWarning(true);
                            }}
                        >
                            {'<< '}<Trans i18nKey={langKeys.previoustext} />
                        </Link>
                    </Breadcrumbs>
                )}
                {!foreground && <h1 className={classes.title}>Canal seleccionado</h1>}
                <div className={classes.channelList}>
                    {channels}
                </div>
                {(!foreground && selectedChannels >= 1) && (
                    <>
                        <div style={{ textAlign: "center", padding: "20px" }}>{t(langKeys.finishregmessage)}</div>
                        <Button
                            onClick={(e)=>{
                                e.preventDefault();
                                onCheckFunc(()=>setCurrentView("view-2"))
                            }}
                            className={commonClasses.button}
                            style={{ marginTop: '3em' }}
                            variant="contained"
                            color="primary"
                            disabled={executeResult.loading}
                        >
                            <Trans i18nKey={langKeys.addpaymentmethod} />
                        </Button>
                    </>
                )}
            </>):(
                <>
                    <Breadcrumbs aria-label="breadcrumb" style={{ marginBottom: '1em' }}>
                        <Link
                            color="textSecondary"
                            href="/"
                            onClick={(e) => {
                                e.preventDefault();
                                setOpenWarning(true);
                            }}
                        >
                            {'<< '}<Trans i18nKey={langKeys.previoustext} />
                        </Link>
                    </Breadcrumbs>
                    <h1 className={classes.title}>{t(langKeys.addpaymentmethod)}</h1>
                    <div style={{ padding: "20px" }}>{t(langKeys.addpaymentmethodsub)}</div>
                    <Controller
                        name="firstname"
                        control={control}
                        rules={{
                            validate: (value) => {
                                if (value.length === 0) {
                                    return t(langKeys.field_required) as string;
                                }
                            }
                        }}
                        render={({ field, formState: { errors } }) => (
                            <TextField
                                {...field}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                size="small"
                                label={t(langKeys.firstname)}
                                error={!!errors.firstname}
                                helperText={errors.firstname?.message}
                            />
                        )}
                    />
                    <Controller
                        name="lastname"
                        control={control}
                        rules={{
                            validate: (value) => {
                                if (value.length === 0) {
                                    return t(langKeys.field_required) as string;
                                }
                            }
                        }}
                        render={({ field, formState: { errors } }) => (
                            <TextField
                                {...field}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                size="small"
                                label={t(langKeys.lastname)}
                                error={!!errors.lastname}
                                helperText={errors.lastname?.message}
                            />
                        )}
                    />
                    <Controller
                        name="pmemail"
                        control={control}
                        rules={{
                            validate: (value) => {
                                if (value.length === 0) {
                                    return t(langKeys.field_required) as string;
                                } else if (!/\S+@\S+\.\S+/.test(value)) {
                                    return t(langKeys.emailverification) as string;
                                }
                            }
                        }}
                        render={({ field, formState: { errors } }) => (
                            <TextField
                                {...field}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                size="small"
                                label={t(langKeys.email)}
                                error={!!errors.pmemail}
                                helperText={errors.pmemail?.message}
                            />
                        )}
                    />
                    
                    <h3 >{t(langKeys.creditcard)}</h3>
                    <div style={{display:"flex"}}>
                        <img src="https://static.culqi.com/v2/v2/static/img/visa.svg" width="50px" style={{padding: 5}}></img>
                        <img src="https://static.culqi.com/v2/v2/static/img/mastercard.svg" width="50px" style={{padding: 5}}></img>
                        <img src="https://static.culqi.com/v2/v2/static/img/amex.svg" width="50px" style={{padding: 5}}></img>
                        <img src="https://static.culqi.com/v2/v2/static/img/diners.svg" width="50px" style={{padding: 5}}></img>
                        
                    </div>
                    <div style={{display: "flex",width:"100%"}} >
                        <div style={{width:"50%"}} >
                            <Controller
                                name="creditcard"
                                control={control}
                                rules={{
                                    validate: (value) => {
                                        if (value.length === 0) {
                                            return t(langKeys.field_required) as string;
                                        } else if (value.length!==16) {
                                            return t(langKeys.creditcardvalidate) as string;
                                        }
                                    }
                                }}
                                render={({ field, formState: { errors } }) => (
                                    <TextField
                                        {...field}
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        type="number"
                                        size="small"
                                        label={t(langKeys.creditcard)}
                                        error={!!errors.creditcard}
                                        helperText={errors.creditcard?.message}
                                    />
                                )}
                            />
                            
                            <div style={{ padding: "20px" }}>{t(langKeys.dueDate)}</div>
                            <div style={{display:"flex"}}>
                                <Controller
                                    name="mm"
                                    control={control}
                                    rules={{
                                        validate: (value) => {
                                            if (value === null || value === undefined) {
                                                return t(langKeys.field_required) as string;
                                            }
                                        }
                                    }}
                                    render={({ field: { onChange }, formState: { errors } }) => (
                                        <FieldSelect
                                            onChange={(data: typeof datamonth[number]) => {
                                                onChange(data?.id || "");
                                            }}
                                            variant="outlined"
                                            style={{ marginTop: 8, marginRight: 5 }}
                                            className="col-6"
                                            valueDefault={getValues('mm')}
                                            label={"MM"}
                                            error={errors.mm?.message}
                                            data={datamonth}
                                            optionDesc="desc"
                                            optionValue="id"
                                        />
                                    )}
                                />
                                <Controller
                                    name="yyyy"
                                    control={control}
                                    rules={{
                                        validate: (value) => {
                                            if (value.length === 0) {
                                                return t(langKeys.field_required) as string;
                                            } else if (value.length!==4) {
                                                return t(langKeys.field_required) as string;
                                            }
                                        }
                                    }}
                                    render={({ field, formState: { errors } }) => (
                                        <TextField
                                            {...field}
                                            variant="outlined"
                                            margin="normal"
                                            fullWidth
                                            className="col-6"
                                            style={{ marginTop: 8 }}
                                            type="number"
                                            size="small"
                                            label={"yyyy"}
                                            error={!!errors.yyyy}
                                            helperText={errors.yyyy?.message}
                                        />
                                    )}
                                />
                            </div>
                            
                            <Controller
                                name="securitycode"
                                control={control}
                                rules={{
                                    validate: (value) => {
                                        if (value.length === 0) {
                                            return t(langKeys.field_required) as string;
                                        }
                                    }
                                }}
                                render={({ field, formState: { errors } }) => (
                                    <TextField
                                        {...field}
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        type="password"
                                        size="small"
                                        label={t(langKeys.securitycode)}
                                        error={!!errors.securitycode}
                                        helperText={errors.securitycode?.message}
                                    />
                                )}
                            /> 
                        </div>   
                        <div style={{width:"50%"}} >
                            <div style={{ textAlign: "center", padding: "20px", border: "1px solid #7721ad", borderRadius: "15px", margin: "10px" }}>{t(langKeys.finishregwarn)}</div>
                        </div>                
                    </div>
                    <Button
                            onClick={(e)=>{
                                e.preventDefault();
                                finishreg()
                            }}
                            className={commonClasses.button}
                            style={{ marginTop: '3em' }}
                            variant="contained"
                            color="primary"
                            disabled={executeResult.loading}
                        >
                            <Trans i18nKey={langKeys.finishreg} />
                    </Button>
                </>
            )
            }
        </div>
    );
}

interface GetComponentProps {
    channel: keyof ListChannels;
    display: boolean;
    setOpenWarning: (param: any) => void;
}

const GetComponent: FC<GetComponentProps> = ({ channel: key, display, setOpenWarning }) => {
    switch (key as keyof ListChannels) {
        case 'facebook':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                <ChannelAddFacebook setOpenWarning={setOpenWarning} />
                </div>
            );
        case 'instagram':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                <ChannelAddInstagram setOpenWarning={setOpenWarning} />
                </div>
            );
        case 'instagramDM':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                <ChannelAddInstagramDM setOpenWarning={setOpenWarning} />
                </div>
            );
        case 'messenger':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                <ChannelAddMessenger setOpenWarning={setOpenWarning} />
                </div>
            );
        case 'whatsapp':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                <ChannelAddWhatsapp setOpenWarning={setOpenWarning} />
                </div>
            );
        case 'telegram':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                <ChannelAddTelegram setOpenWarning={setOpenWarning} />
                </div>
            );
        case 'twitter':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                <ChannelAddTwitter setOpenWarning={setOpenWarning} />
                </div>
            );
        case 'twitterDM':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                <ChannelAddTwitterDM setOpenWarning={setOpenWarning} />
                </div>
            );
        case 'chatWeb':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                <ChannelAddChatWeb setOpenWarning={setOpenWarning} />
                </div>
            );
        case 'email':
            return <div>email</div>;
        case 'phone':
            return <div>phone</div>;
        case 'sms':
            return <div>sms</div>;
        case 'android':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                <ChannelAddAndroid setOpenWarning={setOpenWarning} />
                </div>
            );
        case 'apple':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                <ChannelAddIos setOpenWarning={setOpenWarning} />
                </div>
            );
        default: return <div />;
    }
}
