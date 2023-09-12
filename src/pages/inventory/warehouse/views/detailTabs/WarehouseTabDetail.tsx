/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { FieldErrors, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { FieldEdit, PhoneFieldEdit } from 'components';
import { useSelector } from 'hooks';

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    containerDescription: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: '10px',
    },
    containerDescriptionTitle: {
        fontSize: 24
    },
    containerDescriptionSubtitle: {
        fontSize: 14,
        fontWeight: 500
    },
    iconResponse: {
        cursor: 'pointer',
        poisition: 'relative',
        color: '#2E2C34',
        '&:hover': {
            // color: theme.palette.primary.main,
            backgroundColor: '#EBEAED',
            borderRadius: 4
        }
    },
    iconSendDisabled: {
        backgroundColor: "#EBEAED",
        cursor: 'not-allowed',
    },
}));

interface WarehouseTabDetailProps {
    row: Dictionary | null;
    setValue: UseFormSetValue<any>;
    getValues: UseFormGetValues<any>;
    errors: FieldErrors<any>;
}

const WarehouseTabDetail: React.FC<WarehouseTabDetailProps> = ({
    row,
    setValue,
    getValues,
    errors,
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const user = useSelector(state => state.login.validateToken.user);

    return (
        <div className={classes.containerDetail}>
            <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.warehouse)}
                    valueDefault={getValues('name')}
                    className="col-6"
                    error={errors?.name?.message}
                    onChange={(value) => setValue('name', value)}
                />
                <FieldEdit
                    label={t(langKeys.description)}
                    valueDefault={getValues('description')}
                    className="col-6"
                    error={errors?.description?.message}
                    onChange={(value) => setValue('description', value)}
                />         
                <FieldEdit
                    label={t(langKeys.physicaladdress)}
                    valueDefault={getValues('address')}
                    className="col-6"
                    error={errors?.address?.message}
                    onChange={(value) => setValue('address', value)}
                /> 
                <PhoneFieldEdit
                    value={"+" + getValues('phone')}
                    label={t(langKeys.phone)}
                    name="phone"
                    fullWidth
                    defaultCountry={user!.countrycode.toLowerCase()}
                    className="col-6"
                    onChange={(v: any) => {setValue('phone', v);}}
                    error={errors?.phone?.message}
                />        
                <FieldEdit
                    label={t(langKeys.latitude)}
                    valueDefault={getValues('latitude')}
                    className="col-6"
                    error={errors?.latitude?.message}
                    onChange={(value) => setValue('latitude', value)}
                />         
                <FieldEdit
                    label={t(langKeys.longitude)}
                    valueDefault={getValues('longitude')}
                    className="col-6"
                    error={errors?.longitude?.message}
                    onChange={(value) => setValue('longitude', value)}
                />         
            </div>
        </div>
    )
}

export default WarehouseTabDetail;