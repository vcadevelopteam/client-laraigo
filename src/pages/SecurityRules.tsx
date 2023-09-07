/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateSwitch, TitleDetail, FieldEdit, FieldSelect } from 'components';
import { getSecurityRules, updSecurityRules } from 'common/helpers';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, resetAllMain, execute } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';



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
}));


const SecurityRules = () => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const [waiLoading, setWaiLoading] = useState(false);
    const [allowsconsecutivenumbers, setallowsconsecutivenumbers] = useState(false);
    const [numequalconsecutivecharacterspwd, setnumequalconsecutivecharacterspwd] = useState(0);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main.mainData);
    const dataFieldSelect = [
        {name: "Empieza", value: "01"},
        {name: "Incluye", value: "02"},
        {name: "Más de 1", value: "03"},
        {name: "No Considera", value: "04"},
        {name: "Termina", value: "05"},
    ]
    const fetchData = () => dispatch(getCollection(getSecurityRules()));

    useEffect(() => {
        setWaiLoading(true)
        fetchData();
        dispatch(showBackdrop(true));
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            id: 0,
            mincharacterspwd: 8,
            maxcharacterspwd: 100,
            specialcharacterspwd: "04",
            numericalcharacterspwd: "04",
            uppercaseletterspwd: "04",
            lowercaseletterspwd: "04",
            allowsconsecutivenumbers: false,
            numequalconsecutivecharacterspwd: 0,
            periodvaliditypwd: 0,
            maxattemptsbeforeblocked: 0,
            pwddifferentchangelogin: false,
        }
    });

    React.useEffect(() => {
        register('mincharacterspwd', { validate: (value) => ((value && value > 0) ? true : t(langKeys.field_required) + "") });
        register('maxcharacterspwd', { validate: (value) => ((value && value > 0) ? true : t(langKeys.field_required) + "") });
        register('numequalconsecutivecharacterspwd', { validate: (value) => ((!isNaN(value) && (value >= 0)) ? true : t(langKeys.field_required) + "") });
        register('specialcharacterspwd');
        register('numericalcharacterspwd');
        register('uppercaseletterspwd');
        register('lowercaseletterspwd');
        register('allowsconsecutivenumbers');
        register('id');
        register('periodvaliditypwd', { validate: (value) => ((!isNaN(value) && (value >= 0)) ? true : t(langKeys.field_required) + "") });
        register('maxattemptsbeforeblocked', { validate: (value) => ((!isNaN(value) && (value >= 0)) ? true : t(langKeys.field_required) + "") });
        register('pwddifferentchangelogin');
    }, [register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_edit) }))
                dispatch(showBackdrop(false));
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.whitelist).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    useEffect(() => {
        if (waiLoading) {
            if (!mainResult.loading && !mainResult.error) {
                setValue('id', mainResult?.data?.[0]?.securityrulesid)
                setValue('mincharacterspwd', mainResult?.data?.[0]?.mincharacterspwd)
                setValue('maxcharacterspwd', mainResult?.data?.[0]?.maxcharacterspwd)
                setValue('specialcharacterspwd', mainResult?.data?.[0]?.specialcharacterspwd)
                setValue('numericalcharacterspwd', mainResult?.data?.[0]?.numericalcharacterspwd)
                setValue('uppercaseletterspwd', mainResult?.data?.[0]?.uppercaseletterspwd)
                setValue('lowercaseletterspwd', mainResult?.data?.[0]?.lowercaseletterspwd)
                setValue('allowsconsecutivenumbers', mainResult?.data?.[0]?.allowsconsecutivenumbers)
                setValue('numequalconsecutivecharacterspwd', mainResult?.data?.[0]?.numequalconsecutivecharacterspwd)
                setValue('periodvaliditypwd', mainResult?.data?.[0]?.periodvaliditypwd)
                setValue('maxattemptsbeforeblocked', mainResult?.data?.[0]?.maxattemptsbeforeblocked)
                setValue('pwddifferentchangelogin', mainResult?.data?.[0]?.pwddifferentchangelogin)
                setallowsconsecutivenumbers(!!mainResult?.data?.[0]?.allowsconsecutivenumbers)
                setnumequalconsecutivecharacterspwd(mainResult?.data?.[0]?.numequalconsecutivecharacterspwd)
                dispatch(showBackdrop(false));
                setWaiLoading(false)
            } 
        }
    }, [mainResult, waiLoading])

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_edit) }))
                dispatch(showBackdrop(false));
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.whitelist).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])
    
    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(updSecurityRules(data)));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    return (
        <div style={{width: '100%'}}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TitleDetail
                            title={t(langKeys.securityrules)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center'  }}>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type="submit"
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}
                        >{t(langKeys.save)}
                        </Button>
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.mincharacterspwd)} 
                            error={errors?.mincharacterspwd?.message}
                            onChange={(value) => setValue('mincharacterspwd', value ? parseInt(value) : 0)}
                            type="number"
                            InputProps={{ inputProps: { min: 0 } }}
                            className="col-6"
                            valueDefault={getValues('mincharacterspwd')}
                        />
                        <FieldEdit
                            label={t(langKeys.maxcharacterspwd)} 
                            error={errors?.maxcharacterspwd?.message}
                            onChange={(value) => setValue('maxcharacterspwd', value ? parseInt(value) : 0)}
                            type="number"
                            InputProps={{ inputProps: { min: 0 } }}
                            className="col-6"
                            valueDefault={getValues('maxcharacterspwd')}
                        />
                        
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.specialcharacterspwd)}                                
                            className="col-6"
                            valueDefault={getValues('specialcharacterspwd')}
                            onChange={(value) => setValue('specialcharacterspwd', (value?value.value:""))}
                            error={errors?.specialcharacterspwd?.message}
                            data={dataFieldSelect}
                            optionDesc="name"
                            optionValue="value"
                        />
                        <FieldSelect
                            label={t(langKeys.numericalcharacterspwd)}                                
                            className="col-6"
                            valueDefault={getValues('numericalcharacterspwd')}
                            onChange={(value) => setValue('numericalcharacterspwd', (value?value.value:""))}
                            error={errors?.numericalcharacterspwd?.message}
                            data={dataFieldSelect}
                            optionDesc="name"
                            optionValue="value"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.uppercaseletterspwd)}                                
                            className="col-6"
                            valueDefault={getValues('uppercaseletterspwd')}
                            onChange={(value) => setValue('uppercaseletterspwd', (value?value.value:""))}
                            error={errors?.uppercaseletterspwd?.message}
                            data={dataFieldSelect}
                            optionDesc="name"
                            optionValue="value"
                        />
                        <FieldSelect
                            label={t(langKeys.lowercaseletterspwd)}                                
                            className="col-6"
                            valueDefault={getValues('lowercaseletterspwd')}
                            onChange={(value) => setValue('lowercaseletterspwd', (value?value.value:""))}
                            error={errors?.lowercaseletterspwd?.message}
                            data={dataFieldSelect}
                            optionDesc="name"
                            optionValue="value"
                        />
                    </div>
                    <div className="row-zyx">
                        <TemplateSwitch
                            label={t(langKeys.allowconsecutivenumbers)}
                            className="col-6"
                            valueDefault={getValues('allowsconsecutivenumbers')}
                            onChange={(value) => {
                                setValue('allowsconsecutivenumbers', value)
                                setallowsconsecutivenumbers(value)
                                if(!value){
                                    setValue('numequalconsecutivecharacterspwd', 0)
                                    setnumequalconsecutivecharacterspwd(0)
                                }
                            }}
                        />
                        <FieldEdit
                            label={t(langKeys.numequalconsecutivecharacterspwd)} 
                            error={errors?.numequalconsecutivecharacterspwd?.message}
                            onChange={(value) => {
                                setValue('numequalconsecutivecharacterspwd', value ? parseInt(value) : 0)
                                setnumequalconsecutivecharacterspwd(value ? parseInt(value) : 0)
                            }}
                            type="number"
                            InputProps={{ inputProps: { min: 0 } }}
                            className="col-6"
                            disabled={!allowsconsecutivenumbers}
                            valueDefault={numequalconsecutivecharacterspwd}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.periodvaliditypwd)} 
                            error={errors?.periodvaliditypwd?.message}
                            onChange={(value) => setValue('periodvaliditypwd', value ? parseInt(value) : 0)}
                            type="number"
                            InputProps={{ inputProps: { min: 0 } }}
                            className="col-6"
                            valueDefault={getValues('periodvaliditypwd')}
                        />
                        <FieldEdit
                            label={t(langKeys.maxattemptsbeforeblocked)} 
                            error={errors?.maxattemptsbeforeblocked?.message}
                            onChange={(value) => setValue('maxattemptsbeforeblocked', value ? parseInt(value) : 0)}
                            type="number"
                            InputProps={{ inputProps: { min: 0 } }}
                            className="col-6"
                            valueDefault={getValues('maxattemptsbeforeblocked')}
                        />
                    </div>
                    <div className="row-zyx">
                        <TemplateSwitch
                            label={t(langKeys.pwddifferentchangelogin)}
                            className="col-6"
                            valueDefault={getValues('pwddifferentchangelogin')}
                            onChange={(value) => setValue('pwddifferentchangelogin', value)}
                        />
                    </div>
                    
                </div>
            </form>
        </div>
    )

}

export default SecurityRules;