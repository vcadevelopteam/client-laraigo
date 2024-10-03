import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import SaveIcon from '@material-ui/icons/Save';
import { FieldSelect } from 'components';
import { manageConfirmation, showSnackbar, showBackdrop } from 'store/popus/actions';
import { useForm } from 'react-hook-form';
import { updateUserSettings } from 'store/setting/actions';
import { updateLocalLanguage } from 'store/login/actions';

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(1),
        padding: theme.spacing(2),
        background: '#fff',
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial',
        marginRight: theme.spacing(2),
    },  
    seccionTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        paddingBottom: 10
    },
    rowZyx: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        margin: '1rem 0',
    },
    fieldContainer: {
        flex: 1,
        marginRight: '1rem',
    },
}));

interface DetailProps {
    setViewSelected: (view: string) => void;  
}

const UsageSettings: React.FC<DetailProps> = ({ setViewSelected }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = useSelector(state => state.login.validateToken.user);
    const [waitsave, setwaitsave] = useState(false);
    const langupdate = useSelector(state => state.main.execute);
    const storedLanguageSettings = JSON.parse(localStorage.getItem('languagesettings') || '{}');
    const { register, handleSubmit, getValues, setValue, formState: { errors }, trigger } = useForm({
        defaultValues: {   
            oldpassword: '',
            password: '',
            confirmpassword: '',
            image: '',
            lastname: '',
            firstname: '',        
            languagesettings: user?.languagesettings || {
                languagereview: "",
                gramaticalactivation: "",
                languagetranslation: storedLanguageSettings.languagetranslation || 'es-419',
                sendingmode: storedLanguageSettings.sendingmode || 'Default',
            },           
            operation: "SAVEINFORMATION" 
        }
    });    

    const capitalizeFirstLetter = (string: string) => {
        return string.toLowerCase().replace(/(?:^|\s|[(])[a-z]/g, (match) => match.toUpperCase());
    };
    

    const dataExternalLanguage = [
        { description: t(langKeys.TEMPLATE_EN), value: "en-US" },
        { description: t(langKeys.TEMPLATE_ES_LAT), value: "es-419" },
        { description: t(langKeys.TEMPLATE_ES_ES), value: "es-ES" },
        { description: t(langKeys.TEMPLATE_FR), value: "fr-FR" },
        { description: t(langKeys.TEMPLATE_ZH_CN), value: "zh-CN" },
        { description: t(langKeys.TEMPLATE_AR), value: "ar-SA" },
        { description: t(langKeys.TEMPLATE_RU), value: "ru-RU" },
        { description: t(langKeys.TEMPLATE_DE), value: "de-DE" },
        { description: t(langKeys.TEMPLATE_JA), value: "ja-JP" },
        { description: t(langKeys.TEMPLATE_PT_BR), value: "pt-BR" },
        { description: t(langKeys.TEMPLATE_HI), value: "hi-IN" },
        { description: t(langKeys.TEMPLATE_IT), value: "it-IT" },
        { description: t(langKeys.TEMPLATE_KO), value: "ko-KR" },
        { description: t(langKeys.TEMPLATE_FA), value: "fa-IR" },
        { description: t(langKeys.TEMPLATE_TR), value: "tr-TR" }
    ].map(item => ({
        ...item,
        description: capitalizeFirstLetter(item.description)
    }));

    const dataActivated = [
        { description: t(langKeys.activated), value: "ACTIVED" },
        { description: t(langKeys.desactivated), value: "DESACTIVATED" },        
    ];

    const dataMessageSendingMode = [
        { description: 'Predefinido', value: "Default" },
        { description: 'Solo por ejecución del botón enviar', value: "ExecutionButton" },   
        { description: 'Por acción de la tecla enter o botón enviar', value: "EnterKey" },        
    ];

    useEffect(() => {
        register('languagesettings.languagereview')
        register('languagesettings.gramaticalactivation')
        register('languagesettings.languagetranslation', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('languagesettings.sendingmode', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
    }, [register, t]);    

    useEffect(() => {
        if (waitsave) {
            if (!langupdate.loading && !langupdate.error) {
                dispatch(showBackdrop(false))
                setwaitsave(false);
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_update) }));
                const data = getValues();
                dispatch(updateLocalLanguage(JSON.stringify(data.languagesettings)))
                setViewSelected("view-4");
            } else if (langupdate.error) {
                const errormessage = t(langupdate.code || "error_unexpected_error");
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                setwaitsave(false);
            }
        }
    }, [langupdate, waitsave, dispatch, t])

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            setwaitsave(true)
            dispatch(updateUserSettings(data))
        }
        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });  
    
    return (
        <div style={{ width: "100%" }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>                
                    <div className={classes.seccionTitle}>{t(langKeys.usagesettings)}</div>
                    <div style={{ display: 'flex', gap: '10px'}}>
                        <Button
                            className={classes.button}
                            variant="contained"
                            disabled={waitsave}
                            color="primary"
                            type="submit"
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}>
                            {t(langKeys.save)}
                        </Button>
                    </div>
                </div>

                {/*<div style={{ margin: '2rem 0' }}>     
                    <div className={classes.seccionTitle}>{t(langKeys.correctionandlanguages)}</div>    
                    <div style={{ display: 'flex', gap: '2rem', width: '100%' }}>
                        <div style={{ display: 'flex', gap: '12rem', alignItems: 'center' }}>
                            <h3 style={{ fontWeight: 'normal' }}>{t(langKeys.language)}</h3> 
                            <FieldSelect
                                style={{ width: '20rem' }}
                                data={dataExternalLanguage}
                                error={errors?.languagesettings?.language?.message}
                                onChange={(value) => {
                                    if (value) {
                                        setValue("languagesettings.language", value.value);
                                        trigger("languagesettings.language");
                                    } else {
                                        setValue("languagesettings.language", '');
                                        trigger("languagesettings.language");
                                    }
                                }}
                                optionDesc="description"
                                optionValue="value"
                                uset={true}
                                valueDefault={getValues("languagesettings.language")}   
                                variant={'outlined'}                    
                            />
                        </div>     
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                            <h3 style={{ fontWeight: 'normal' }}>{t(langKeys.spellingcheck)}</h3> 
                            <FieldSelect
                                style={{ width: '20rem' }}
                                data={dataActivated}
                                error={errors?.languagesettings?.spellingcheck?.message}
                                onChange={(value) => {
                                    if (value) {
                                        setValue("languagesettings.spellingcheck", value.value);
                                        trigger("languagesettings.spellingcheck");
                                    } else {
                                        setValue("languagesettings.spellingcheck", '');
                                        trigger("languagesettings.spellingcheck");
                                    }
                                }}
                                optionDesc="description"
                                optionValue="value"
                                uset={true}
                                valueDefault={getValues("languagesettings.spellingcheck")}   
                                variant={'outlined'}                    
                            />     
                        </div> 
                    </div>                         
                </div>*/}

                <div style={{ margin: '2rem 0' }}>     
                    <div className={classes.seccionTitle}>{t(langKeys.transcriptionandtranslation)}</div>         
                    <div style={{ display: 'flex', gap: '2rem', width: '100%' }}>
                        <div style={{ display: 'flex', gap: '12rem', alignItems: 'center' }}>
                            <h3 style={{ fontWeight: 'normal' }}>{t(langKeys.language)}</h3> 
                            <FieldSelect
                                style={{ width: '20rem' }}
                                data={dataExternalLanguage}
                                error={errors?.languagesettings?.languagetranslation?.message}
                                onChange={(value) => {
                                    if (value) {
                                        setValue("languagesettings.languagetranslation", value.value);
                                        trigger("languagesettings.languagetranslation");
                                    } else {
                                        setValue("languagesettings.languagetranslation", '');
                                        trigger("languagesettings.languagetranslation");
                                    }
                                }}
                                optionDesc="description"
                                optionValue="value"
                                uset={true}
                                valueDefault={getValues("languagesettings.languagetranslation")}   
                                variant={'outlined'}                    
                            /> 
                        </div>    
                    </div>                         
                </div>

                <div style={{ margin: '2rem 0' }}>     
                    <div className={classes.seccionTitle}>{t(langKeys.chatsettings)}</div>         
                    <div style={{ display: 'flex', gap: '2rem', width: '100%' }}>
                        <div style={{ display: 'flex', gap: '2.6rem', alignItems: 'center' }}>
                            <h3 style={{ fontWeight: 'normal' }}>{t(langKeys.messagesendingmode)}</h3> 
                            <FieldSelect
                                style={{ width: '20rem' }}
                                data={dataMessageSendingMode}
                                error={errors?.languagesettings?.sendingmode?.message}
                                onChange={(value) => {
                                    if (value) {
                                        setValue("languagesettings.sendingmode", value.value);
                                        trigger("languagesettings.sendingmode");
                                    } else {
                                        setValue("languagesettings.sendingmode", '');
                                        trigger("languagesettings.sendingmode");
                                    }
                                }}
                                optionDesc="description"
                                optionValue="value"
                                uset={true}
                                valueDefault={getValues("languagesettings.sendingmode")}   
                                variant={'outlined'}                    
                            /> 
                        </div>    
                    </div>                         
                </div>        
            </form>
        </div>
    );
};

export default UsageSettings;