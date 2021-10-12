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
import { FieldEdit, TitleDetail } from 'components';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';

import { useForm } from 'react-hook-form';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { uploadFile } from 'store/main/actions';
import { updateUserSettings } from 'store/setting/actions';


const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
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
}));



const UserSettings: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const classes = useStyles();
    const user = useSelector(state => state.login.validateToken.user);
    const [showOldPassword, setOldShowPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [waitUploadFile, setWaitUploadFile] = useState(false);
    const [disableButton, setdisableButton] = useState(false);
    const setting = useSelector(state => state.setting.setting);
    const uploadResult = useSelector(state => state.main.uploadFile);

    const { register, handleSubmit, setValue, getValues, formState: { errors }, trigger, clearErrors } = useForm({
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
        console.log(setting)
    }, [setting])
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
        register('oldpassword', { validate: (value: any) => (value && value.length) || t(langKeys.field_required)} );
        register('firstname', { validate: (value: any) => (value && value.length) || t(langKeys.field_required)} );
        register('lastname', { validate: (value: any) => (value && value.length) || t(langKeys.field_required)} );
        register('image');
    }, [])
    
    const onSubmit = handleSubmit((data) => {
        if (!data.oldpassword) {
            dispatch(showSnackbar({ show: true, success: false, message: t(langKeys.password_required) }));
            return;
        }
        dispatch(updateUserSettings(data));
    });
    

    return (
        <div style={{ width: '100%' }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TitleDetail
                            title={t(langKeys.modifysettings)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={disableButton}
                            type="submit"
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}
                        >{t(langKeys.save)}</Button>
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        <div className="col-6" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <FieldEdit
                                label={t(langKeys.firstname)}
                                style={{ marginBottom: 8 }}
                                onChange={(value) => setValue('firstname', value)}
                                valueDefault={user?.firstname || ""}
                                error={errors?.firstname?.message}
                            />
                            <FieldEdit
                                label={t(langKeys.lastname)}
                                className="col-6"
                                onChange={(value) => setValue('lastname', value)}
                                valueDefault={user?.lastname || ""}
                                error={errors?.lastname?.message}
                            />
                        </div>
                        <div className="col-6" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ position: 'relative' }}>
                                <Avatar style={{ width: 120, height: 120 }} src={getValues('image')|| undefined} />
                                <input
                                    name="file"
                                    accept="image/*"
                                    id="laraigo-upload-csv-file"
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={(e) => onSelectImage(e.target.files)}
                                />
                                <label htmlFor="laraigo-upload-csv-file">
                                    <Avatar style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#7721ad', cursor: 'pointer' }}>
                                        <CameraAltIcon style={{ color: '#FFF' }} />
                                    </Avatar>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.newpassword)}
                            className="col-6"
                            valueDefault={getValues('password')}
                            type={showPassword ? 'text' : 'password'}
                            onChange={(value) => setValue('password', value)}
                            error={errors?.password?.message}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <FieldEdit
                            label={t(langKeys.confirmnewpassword)}
                            className="col-6"
                            valueDefault={getValues('confirmpassword')}
                            type={showConfirmPassword ? 'text' : 'password'}
                            onChange={(value) => setValue('confirmpassword', value)}
                            error={errors?.confirmpassword?.message}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />                        
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.password)}
                            className="col-6"
                            valueDefault={getValues('oldpassword')}
                            type={showOldPassword ? 'text' : 'password'}
                            onChange={(value) => setValue('oldpassword', value)}
                            error={errors?.oldpassword?.message}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setOldShowPassword(!showOldPassword)}
                                            edge="end"
                                        >
                                            {showOldPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                </div>
            </form>
        </div>
    )
}

export default UserSettings;