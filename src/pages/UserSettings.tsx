/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Box, IconButton, InputAdornment } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import SaveIcon from '@material-ui/icons/Save';
import { FieldEdit, FieldView, TemplateBreadcrumbs } from 'components';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import { showSnackbar, manageConfirmation } from 'store/popus/actions';
import { updateUserInformation } from 'store/login/actions';
import { useForm } from 'react-hook-form';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { uploadFile } from 'store/main/actions';
import { updateUserSettings } from 'store/setting/actions';
import CulqiModal from 'components/fields/CulqiModal';
import ClearIcon from '@material-ui/icons/Clear';

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
    containerHeader: {
        display: 'block',
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        },
    },
    title: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: theme.palette.text.primary,
    },
    seccionTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        paddingBottom: 10
    },
    hyperlinkstyle: {    
        color: "-webkit-link",
        cursor: "pointer",
        textDecoration: "underline"
    },
}));

interface DetailProps {
    //data: RowSelected;
    setViewSelected: (view: string) => void;
    //multiData: MultiData[];
    //fetchData?: () => void;
}

const PersonalInformation: React.FC<DetailProps> = ({ setViewSelected }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = useSelector(state => state.login.validateToken.user);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            oldpassword: '',
            password: '',
            confirmpassword: '',
            image: user?.image || null,
            lastname: user?.lastname,
            firstname: user?.firstname,
            operation: "SAVEINFORMATION" //"CHANGEPASSWORD"
        }
    });
    useEffect(() => {
        register('firstname', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('lastname', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
    }, [])
    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(updateUserSettings(data))
        }
        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });
    const arrayBread = [
        { id: "view-1", name: t(langKeys.accountsettings)},
        { id: "view-2", name: t(langKeys.changepersonalinformation)}
    ];
    return <div style={{width:"100%"}}>
        
        <form onSubmit={onSubmit}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <TemplateBreadcrumbs
                        breadcrumbs={arrayBread}
                        handleClick={setViewSelected}
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        startIcon={<ClearIcon color="secondary" />}
                        style={{ backgroundColor: "#FB5F5F" }}
                        onClick={() => setViewSelected("view-1")}>
                        {t(langKeys.back)}
                    </Button>
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        type="submit"
                        startIcon={<SaveIcon color="secondary" />}
                        style={{ backgroundColor: "#55BD84" }}>
                        {t(langKeys.save)}
                    </Button>
                </div>
            </div>
            <div className={classes.containerDetail}>
                <div className="row-zyx">
                    <div className={classes.seccionTitle}>{t(langKeys.changepersonalinformation)}</div>
                    <div className="col-6" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <FieldEdit
                            label={t(langKeys.firstname)}
                            style={{ marginBottom: 8 }}
                            onChange={(value) => setValue('firstname', value)}
                            valueDefault={user?.firstname || ""}
                            error={errors?.firstname?.message}
                        />
                    </div>
                    <div className="col-6" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <FieldEdit
                            label={t(langKeys.lastname)}
                            className="col-6"
                            onChange={(value) => setValue('lastname', value)}
                            valueDefault={user?.lastname || ""}
                            error={errors?.lastname?.message}
                        />
                    </div>
                </div>
            </div>
        </form>
    </div>
}

const UserSettings: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const classes = useStyles();
    const user = useSelector(state => state.login.validateToken.user);
    const [view, setView] = useState('view-1');
    const [showOldPassword, setOldShowPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [waitUploadFile, setWaitUploadFile] = useState(false);
    const [waitsave, setwaitsave] = useState(false);
    const resSetting = useSelector(state => state.setting.setting);
    const uploadResult = useSelector(state => state.main.uploadFile);

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            oldpassword: '',
            password: '',
            confirmpassword: '',
            lastname: user?.lastname,
            firstname: user?.firstname,
            image: user?.image || null,
        }
    });
    const onSelectImage = (files: any) => {
        const selectedFile = files[0];
        var fd = new FormData();
        fd.append('file', selectedFile, selectedFile.name);
        dispatch(uploadFile(fd));
        setWaitUploadFile(true);
    }

    useEffect(() => {
        if (waitsave) {
            if (!resSetting.loading && !resSetting.error) {
                setwaitsave(false)
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_register) }));
                dispatch(updateUserInformation(getValues('firstname') + "", getValues('lastname') + "", getValues('image') + ""));
            } else if (resSetting.error) {
                const errormessage = t(resSetting.code || "error_unexpected_error")
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                setwaitsave(false);
            }
        }
    }, [resSetting])

    useEffect(() => {
        if (waitUploadFile) {
            if (!uploadResult.loading && !uploadResult.error) {
                setValue('image', uploadResult.url || '')
                setWaitUploadFile(false);
            } else if (uploadResult.error) {

                setWaitUploadFile(false);
            }
        }
    }, [waitUploadFile, uploadResult])

    const validateSamePassword = (value: string): any => {
        return getValues('password') === value;
    }
    useEffect(() => {
        register('password');
        register('confirmpassword', {
            validate: {
                same: (value: any) => validateSamePassword(value) || "Contraseñas no coinciden"
            }
        });
        register('oldpassword', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('firstname', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('lastname', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('image');
    }, [])

    const onSubmit = handleSubmit((data) => {
        if (!data.oldpassword) {
            dispatch(showSnackbar({ show: true, success: false, message: t(langKeys.password_required) }));
            return;
        }
        setwaitsave(true)
        dispatch(updateUserSettings(data));
    });
    
    if(view==="view-1"){

        return (
            <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{
                        fontSize: '22px',
                        fontWeight: 'bold',
                    }}>
                        {t(langKeys.accountsettings)}
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className={classes.seccionTitle}>{t(langKeys.accountinformation)}</div>
                    <div className="row-zyx">
                        <div className="col-6" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <FieldView
                                label={t(langKeys.corporation)}
                                value={user?.orgdesc}
                            />
                            <FieldView
                                label={t(langKeys.firstname)}
                                value={`${user?.firstname} ${user?.lastname}`}
                            />
                            <FieldView
                                label={t(langKeys.account)}
                                value={user?.usr}
                            />
                        </div>
                        <div className="col-6" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div className="col-6">
                                <Box lineHeight="20px" fontSize={15} color="textPrimary"><div className={classes.hyperlinkstyle} onClick={()=>setView('view-2')}>{t(langKeys.changepersonalinformation)}</div></Box>
                            </div>
                            <div className="col-6">
                                <Box lineHeight="20px" fontSize={15} color="textPrimary"><div className={classes.hyperlinkstyle} onClick={()=>console.log("poop2")}>{t(langKeys.changePassword)}</div></Box>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className={classes.seccionTitle}>{t(langKeys.planinformation)}</div>
                    <div className="row-zyx">
                        <div className="col-6" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <FieldView
                                label={"Plan"}
                                value={"BASICO"}
                            />
                        </div>
                        <div className="col-6" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div className="col-6">
                                <Box lineHeight="20px" fontSize={15} color="textPrimary"><div className={classes.hyperlinkstyle} onClick={()=>console.log("poop3")}>{t(langKeys.changeplan)}</div></Box>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className={classes.seccionTitle}>{t(langKeys.suscription)}</div>
                    <div className="row-zyx">
                        <div className="col-6" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div className="col-6">
                                <Box lineHeight="20px" fontSize={15} color="textPrimary"><div className={classes.hyperlinkstyle} onClick={()=>console.log("poop4")}>{t(langKeys.cancelsuscription)}</div></Box>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else if(view==="view-2"){
        return  <PersonalInformation
            setViewSelected={setView}
        />
    }
    else{

        return <div>error</div>
    }

}

export default UserSettings;