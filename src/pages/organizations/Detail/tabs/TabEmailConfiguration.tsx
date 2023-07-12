/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useState } from 'react'; // we need this to make JSX compile
import { FieldView, FieldEdit, TemplateSwitch } from 'components';
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { IconButton, InputAdornment} from '@material-ui/core';
import { Visibility, VisibilityOff} from '@material-ui/icons';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
interface TabEmailConfigurationProps {
    data: RowSelected;
    getValues: any;
    setValue: any;
    register:any;
    errors:any;
}
const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    text: {
        fontWeight: 500,
        fontSize: 16,
        color: '#381052',
    },
}));

const TabEmailConfiguration: React.FC<TabEmailConfigurationProps> = ({ data: { row, edit }, getValues, setValue,register, errors}) => {
    
    const classes = useStyles();
    const { t } = useTranslation();

    const [showCredential, setShowCredential] = useState(row?.private_mail || false);
    const [showPassword, setShowPassword] = useState(false);
    
    const emailRequired = (value: string) => {
        if (value.length === 0) {
            return t(langKeys.field_required) as string;
        } else if (!/\S+@\S+\.\S+/.test(value)) {
            return t(langKeys.emailverification) as string;
        }
    }

    return <div className={classes.containerDetail}>
    <div className="row-zyx">
        {edit ?
            <TemplateSwitch
                label={t(langKeys.private_mail)}
                className="col-6"
                valueDefault={getValues("private_mail")}
                onChange={(value) => { setValue('private_mail', value); setShowCredential(value) }}
            /> :
            <FieldView
                label={"private_mail"}
                value={row ? (row.private_mail ? t(langKeys.affirmative) : t(langKeys.negative)) : t(langKeys.negative)}
                className="col-6"
            />
        }
    </div>
    {
        showCredential &&

        <Fragment>
            <div className="row-zyx">
                    {edit ?
                        <FieldEdit
                            label={t(langKeys.email)} //transformar a multiselect
                            className="col-6"
                            fregister={{
                                ...register("email", { validate: emailRequired, value: '' })
                            }}
                            error={errors?.email?.message}
                            onChange={(value) => setValue('email', value)}
                            valueDefault={getValues("email")}
                        />
                        : <FieldView
                            label={t(langKeys.email)}
                            value={row ? (row.email || "") : ""}
                            className="col-6"
                        />}
                    {edit ?
                        <FieldEdit
                            label={t(langKeys.port)} //transformar a multiselect
                            className="col-6"
                            type="number"
                            fregister={{
                                ...register("port", {
                                    validate: (value:any) => (value && value > 0) || t(langKeys.validnumber)
                                })
                            }}
                            error={errors?.port?.message}
                            onChange={(value) => setValue('port', value)}
                            valueDefault={getValues("port")}
                        />
                        : <FieldView
                            label={t(langKeys.port)}
                            value={row ? (row.port || 0) : 0}
                            className="col-6"
                        />}
                </div>
                <div className="row-zyx">
                    {edit ?
                        <FieldEdit
                            label={t(langKeys.password)}
                            className="col-6"
                            type={showPassword ? 'text' : 'password'}
                            onChange={(value) => setValue('password', value)}
                            valueDefault={getValues("password")}
                            fregister={{
                                ...register("password"
                                    //,{ validate: (value) => (value && value.length) || t(langKeys.field_required)}
                                )
                            }}
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
                        : ""}
                </div>
                <div className="row-zyx">
                    {edit ?
                        <FieldEdit
                            label={t(langKeys.host)}
                            className="col-6"
                            fregister={{
                                ...register("host", {
                                    validate: (value:any) => (value && value.length) || t(langKeys.field_required)
                                })
                            }}
                            error={errors?.host?.message}
                            onChange={(value: any) => setValue('host', value)}
                            valueDefault={getValues("host")}
                        />
                        : <FieldView
                            label={t(langKeys.host)}
                            value={row ? (row.host || "") : ""}
                            className="col-6"
                        />
                    }
                    {edit ?
                        <TemplateSwitch
                            label={"SSL"}
                            className="col-3"
                            valueDefault={getValues("ssl")}
                            onChange={(value) => setValue('ssl', value)}
                        /> :
                        <FieldView
                            label={"SSL"}
                            value={row ? (row.ssl ? t(langKeys.affirmative) : t(langKeys.negative)) : t(langKeys.negative)}
                            className="col-6"
                        />
                    }
                    {edit ?
                        <TemplateSwitch
                            label={t(langKeys.default_credentials)}
                            className="col-3"
                            valueDefault={getValues("default_credentials")}
                            onChange={(value) => setValue('default_credentials', value)}
                        /> :
                        <FieldView
                            label={t(langKeys.default_credentials)}
                            value={row ? (row.default_credentials ? t(langKeys.affirmative) : t(langKeys.negative)) : t(langKeys.negative)}
                            className="col-6"
                        />
                    }
                </div>
            </Fragment>

        }
    </div>
}


export default TabEmailConfiguration;