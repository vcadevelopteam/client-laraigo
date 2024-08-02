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
import { manageConfirmation, showSnackbar } from 'store/popus/actions';
import { useForm } from 'react-hook-form';
import { execute } from 'store/main/actions';
import { updateLanguageSettings } from 'common/helpers';
import { updateUserSettings } from 'store/setting/actions';

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
    const resSetting = useSelector(state => state.setting.setting);
    const storedLanguageSettings = JSON.parse(localStorage.getItem('languagesettings') || '{}');
    const { register, handleSubmit, getValues, setValue, formState: { errors }, trigger } = useForm({
        defaultValues: {           
            languagesettings: user?.languagesettings || {
                language: storedLanguageSettings.language || 'ES_LAT',
                spellingcheck: storedLanguageSettings.spellingcheck || 'ACTIVED',
                translatelanguage: storedLanguageSettings.translatelanguage || 'ES_LAT',
                messagesendingmode: storedLanguageSettings.messagesendingmode || 'Default',
            },
            oldpassword: '',
            password: '',
            confirmpassword: '',
            image: '',
            lastname: '',
            firstname: '',
            operation: "SAVEINFORMATION" 
        }
    });    

    console.log('user: ', user)
    const capitalizeFirstLetter = (string: string) => {
        return string.toLowerCase().replace(/(?:^|\s|[(])[a-z]/g, (match) => match.toUpperCase());
    };    

    const dataExternalLanguage = [
        { description: t(langKeys.TEMPLATE_EN), value: "EN" },
        { description: t(langKeys.TEMPLATE_ES_LAT), value: "ES_LAT" },
        { description: t(langKeys.TEMPLATE_ES_ES), value: "ES_ES" },
        { description: t(langKeys.TEMPLATE_FR), value: "FR" },
        { description: t(langKeys.TEMPLATE_ZH_CN), value: "ZH_CN" },
        { description: t(langKeys.TEMPLATE_AR), value: "AR" },
        { description: t(langKeys.TEMPLATE_RU), value: "RU" },
        { description: t(langKeys.TEMPLATE_DE), value: "DE" },
        { description: t(langKeys.TEMPLATE_JA), value: "JA" },
        { description: t(langKeys.TEMPLATE_PT_BR), value: "PT_BR" },
        { description: t(langKeys.TEMPLATE_HI), value: "HI" },
        { description: t(langKeys.TEMPLATE_IT), value: "IT" },
        { description: t(langKeys.TEMPLATE_KO), value: "KO" },
        { description: t(langKeys.TEMPLATE_FA), value: "FA" },
        { description: t(langKeys.TEMPLATE_TR), value: "TR" }
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
        register('languagesettings.language', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('languagesettings.spellingcheck', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('languagesettings.translatelanguage', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('languagesettings.messagesendingmode', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
    }, [register, t]);    

    useEffect(() => {
        if (waitsave) {
            if (!resSetting.loading && !resSetting.error) {
                setwaitsave(false);
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_update) }));
                setViewSelected("view-1");
            } else if (resSetting.error) {
                const errormessage = t(resSetting.code || "error_unexpected_error");
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                setwaitsave(false);
            }
        }
    }, [resSetting, waitsave, dispatch, t]);

    const handleSave = () => {
        const data = getValues();
        console.log('Language settings form data:', data.languagesettings);
    
        const callback = () => {
            setwaitsave(true);
            const updatedUser = {
                ...user,
                languagesettings: data.languagesettings
            };
            console.log('Updated user with new language settings:', updatedUser);    
            localStorage.setItem('languagesettings', JSON.stringify(data.languagesettings));
    
            dispatch(execute(updateLanguageSettings({ languagesettings: updatedUser.languagesettings })));
            dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_update) }));
            setwaitsave(false);
        };
    
        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }));
    };
    
    

    return (
        <div style={{ width: "100%" }}>
            <form onSubmit={handleSave}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>                
                    <div className={classes.seccionTitle}>{t(langKeys.usagesettings)}</div>
                    <div style={{ display: 'flex', gap: '10px'}}>
                        <Button
                            className={classes.button}
                            variant="contained"
                            disabled={waitsave}
                            color="primary"
                            type="button"
                            onClick={handleSave}
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}>
                            {t(langKeys.save)}
                        </Button>
                    </div>
                </div>

                {/* <div style={{ margin: '2rem 0' }}>     
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
                </div> */}

                <div style={{ margin: '2rem 0' }}>     
                    <div className={classes.seccionTitle}>{t(langKeys.transcriptionandtranslation)}</div>         
                    <div style={{ display: 'flex', gap: '2rem', width: '100%' }}>
                        <div style={{ display: 'flex', gap: '12rem', alignItems: 'center' }}>
                            <h3 style={{ fontWeight: 'normal' }}>{t(langKeys.language)}</h3> 
                            <FieldSelect
                                style={{ width: '20rem' }}
                                data={dataExternalLanguage}
                                error={errors?.languagesettings?.translatelanguage?.message}
                                onChange={(value) => {
                                    if (value) {
                                        setValue("languagesettings.translatelanguage", value.value);
                                        trigger("languagesettings.translatelanguage");
                                    } else {
                                        setValue("languagesettings.translatelanguage", '');
                                        trigger("languagesettings.translatelanguage");
                                    }
                                }}
                                optionDesc="description"
                                optionValue="value"
                                uset={true}
                                valueDefault={getValues("languagesettings.translatelanguage")}   
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
                                error={errors?.languagesettings?.messagesendingmode?.message}
                                onChange={(value) => {
                                    if (value) {
                                        setValue("languagesettings.messagesendingmode", value.value);
                                        trigger("languagesettings.messagesendingmode");
                                    } else {
                                        setValue("languagesettings.messagesendingmode", '');
                                        trigger("languagesettings.messagesendingmode");
                                    }
                                }}
                                optionDesc="description"
                                optionValue="value"
                                uset={true}
                                valueDefault={getValues("languagesettings.messagesendingmode")}   
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