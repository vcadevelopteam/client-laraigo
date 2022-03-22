/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, IconButton } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useHistory, useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import paths from 'common/constants/paths';
import { FieldEdit } from 'components';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { useForm } from 'react-hook-form';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import Popus from 'components/layout/Popus';
import { changePassword } from 'store/subscription/actions';

const useStyles = makeStyles(theme => ({
    titlecards:{
        fontWeight: "bold",
        fontSize: "1.5em",
        color: "#883db7",
        width: "100%",
        textAlign: "center",
    },
    subtitlecards:{
        fontWeight: "bold",
        fontSize: "1.0em",
        color: "#883db7",
        width: "100%",
        textAlign: "center",
    },
    containerHead: {
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "30px"
    },
    boxstyles: {
        textAlign: "justify",
        margin: "25px 10%",
        border: "grey 1px solid",
        padding: 25
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    spinnerContainer: {
        margin: '20px auto',
        color: '#883db7'
    },
    link: {
        color: '#883db7',
        cursor: 'pointer'
    }
}));

export const RecoverPassword: FC = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const changeResponse = useSelector(state => state.subscription.requestChangePassword);
    const classes = useStyles();
    const history = useHistory();

    const { token }: any = useParams();

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [valid, setValid] = useState<boolean>(false);
    const [waitSave, setWaitSave] = useState(false);

    const { register, handleSubmit, setValue, getValues, formState: { errors }, trigger, clearErrors } = useForm({
        defaultValues: {
            password: '',
            confirmpassword: '',
            token: token
        }
    });

    const validateSamePassword = (value: string): any => getValues('password') === value;

    useEffect(() => {
        register('password', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('confirmpassword', {
            validate: {
                validate: (value: any) => (value && value.length) || t(langKeys.field_required),
                same: (value: any) => validateSamePassword(value) || t(langKeys.password_different)
            }
        });
    }, [])

    useEffect(() => {
        if (!token) {
            history.push(paths.SIGNIN);
        }
        else {
            setValid(true);
        }
    }, []);

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(changePassword(data));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    useEffect(() => {
        if (waitSave) {
            if (!changeResponse.loading && !changeResponse.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(changeResponse.msg || langKeys.successful_register) }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
                setValid(false);
            } else if (changeResponse.error) {
                dispatch(showSnackbar({ show: true, success: false, message: t(changeResponse.msg || 'error_unexpected_error') }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
                setValid(false);
            }
        }
    }, [changeResponse, waitSave])

    switch (valid) {
        case true:
            return (
                <div style={{ width: '100%' }}>
                    <form onSubmit={onSubmit}>
                        <div style={{ width: "100%",marginTop:25}}>
                            <div className={classes.containerHead}>
                                <img src="/Laraigo-vertical-logo-name.svg" style={{ height: 200}} alt="logo" />
                            </div>
                            <div className={classes.titlecards}>{t(langKeys.recoverpasswordtitle)}</div>
                            <div className={classes.subtitlecards}>{t(langKeys.recoverpasswordsubtitle)}</div>
                            <Box className={classes.boxstyles}>
                                    <div className="row-zyx">
                                        <FieldEdit
                                            label={t(langKeys.password)}
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
                                            label={t(langKeys.confirmpassword)}
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
                                    <div className={classes.buttonContainer}>
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            color="primary"
                                            style={{ backgroundColor: "#7721AD" }}
                                        >{t(langKeys.save)}</Button>
                                    </div>
                            </Box>
                        </div>
                        <Popus />
                    </form>
                </div>
            );

        case false:
            return (
                <div style={{ width: '100%' }}>
                    <div style={{ width: "100%",marginTop:25}}>
                        <div className={classes.containerHead}>
                            <img src="/Laraigo-vertical-logo-name.svg" style={{ height: 200}} alt="logo" />
                        </div>
                        <div className={classes.titlecards}>{t(langKeys.recoverpasswordtitle)}</div>
                        <div className={classes.subtitlecards}>{t(langKeys.recoverpasswordsubtitle)}</div>
                        <Box className={classes.boxstyles}>
                            <p>{t(langKeys.recoverpassword_finish)}</p>
                            <div className={classes.buttonContainer}>
                                <Button
                                    variant="contained"
                                    type="button"
                                    color="primary"
                                    style={{ backgroundColor: "#7721AD" }}
                                    onClick={() => window.open(paths.SIGNIN, "_self")}
                                >{t(langKeys.continue)}</Button>
                            </div>
                        </Box>
                    </div>
                    <Popus />
                </div>
            );
    }
};

export default RecoverPassword;