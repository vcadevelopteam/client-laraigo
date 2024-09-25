import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import SaveIcon from '@material-ui/icons/Save';
import { FieldEdit } from 'components';
import { showSnackbar, manageConfirmation } from 'store/popus/actions';
import { updateUserInformation } from 'store/login/actions';
import { useForm } from 'react-hook-form';
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
    }
}));

interface DetailProps {
    setViewSelected: (view: string) => void;  
}

const PersonalInformation: React.FC<DetailProps> = ({ setViewSelected }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = useSelector(state => state.login.validateToken.user);
    const [waitsave, setwaitsave] = useState(false);
    const resSetting = useSelector(state => state.setting.setting);
    const { register, handleSubmit, getValues, setValue, formState: { errors } } = useForm({
        defaultValues: {
            oldpassword: '',
            password: '',
            confirmpassword: '',
            image: user?.image || null,
            lastname: user?.lastname,
            firstname: user?.firstname,
            languagesettings: user?.languagesettings || {
                language: '',
                spellingcheck: '',
                translatelanguage: '',
                messagesendingmode: '',
            },
            operation: "SAVEINFORMATION" //"CHANGEPASSWORD"
        }
    });
    useEffect(() => {
        register('firstname', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('lastname', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
    }, [])
    useEffect(() => {
        if (waitsave) {
            if (!resSetting.loading && !resSetting.error) {
                setwaitsave(false)
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_update) }));
                dispatch(updateUserInformation(getValues('firstname') + "", getValues('lastname') + "", getValues('image') + ""));
            } else if (resSetting.error) {
                const errormessage = t(resSetting.code || "error_unexpected_error")
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setwaitsave(false);
            }
        }
    }, [resSetting])
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

    return <div style={{ width: "100%" }}>
        <form onSubmit={onSubmit}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom:'2rem' }}>                
                <div className={classes.seccionTitle}>{t(langKeys.changepersonalinformation)}</div>
                <div style={{ display: 'flex', gap: '10px'}}>                   
                    <Button
                        className={classes.button}
                        variant="contained"
                        disabled={resSetting.loading}
                        color="primary"
                        type="submit"
                        startIcon={<SaveIcon color="secondary" />}
                        style={{ backgroundColor: "#55BD84" }}>
                        {t(langKeys.save)}
                    </Button>
                </div>
            </div>
            <div className="row-zyx">                
                <FieldEdit
                    label={t(langKeys.corporation)}     
                    className="col-6"                  
                    disabled={true}
                    valueDefault={user?.orgdesc}
                />                          
            </div>
            <div className="row-zyx" style={{marginRight:'1rem'}}>                         
                <FieldEdit
                    label={t(langKeys.firstname)}
                    className="col-6"   
                    style={{ marginBottom: 8 }}
                    onChange={(value) => setValue('firstname', value)}
                    valueDefault={user?.firstname || ""}
                    error={errors?.firstname?.message}
                />
                <FieldEdit
                    label={t(langKeys.ticket_lastname)}
                    className="col-6"
                    onChange={(value) => setValue('lastname', value)}
                    valueDefault={user?.lastname || ""}
                    error={errors?.lastname?.message}
                />
            </div>        
        </form>
    </div>
}

export default PersonalInformation;