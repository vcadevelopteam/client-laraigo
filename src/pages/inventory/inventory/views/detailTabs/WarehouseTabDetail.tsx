/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'; // we need this to make JSX compile
import { Dictionary, IFile } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { ItemFile, UploaderIcon } from '../../components/components';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { FieldErrors, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { FieldEdit, FieldCheckbox } from 'components';
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
    const initialValueAttachments = getValues('attachments');
    const [files, setFiles] = useState<IFile[]>(initialValueAttachments? initialValueAttachments.split(',').map((url:string) => ({ url })):[]);

    return (
        <div className={classes.containerDetail}>
            <div className="row-zyx">
                <div className='col-6'>
                    <div className='row-zyx'>
                        <FieldEdit
                            label={t(langKeys.product)}
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
                    </div>
                    <div className='row-zyx'>
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
                    </div>
                    <div className='row-zyx'>
                        <FieldCheckbox
                            label={`${t(langKeys.warehouse)} ${t(langKeys.default)}`}
                            className="col-6"
                            valueDefault={getValues("ispredeterminate")}
                            onChange={(value) => setValue("ispredeterminate", value)}
                        />
                    </div>
                    <div className='row-zyx'>
                        <FieldEdit
                            label={t(langKeys.default_shelf)}
                            valueDefault={getValues('address')}
                            className="col-6"
                            error={errors?.address?.message}
                            onChange={(value) => setValue('address', value)}
                        />
                    </div>
                </div>
                <div className='row-zyx col-6'>
                    <div className='col-6'>
                        <div className='row-zyx'>
                            <FieldEdit
                                label={t(langKeys.physicaladdress)}
                                valueDefault={getValues('address')}
                                className="col-6"
                                error={errors?.address?.message}
                                onChange={(value) => setValue('address', value)}
                            />  
                        </div>
                        <div className='row-zyx'>
                            <FieldEdit
                                label={t(langKeys.current_balance)}
                                valueDefault={getValues('latitude')}
                                className="col-6"
                                error={errors?.latitude?.message}
                                onChange={(value) => setValue('latitude', value)}
                            />
                        </div>
                        <div className='row-zyx'>
                            <FieldEdit
                                label={t(langKeys.family)}
                                valueDefault={getValues('longitude')}
                                className="col-6"
                                error={errors?.longitude?.message}
                                onChange={(value) => setValue('longitude', value)}
                            /> 
                        </div>
                        <div className='row-zyx'>
                            <FieldEdit
                                label={t(langKeys.status)}
                                valueDefault={getValues('longitude')}
                                className="col-6"
                                error={errors?.longitude?.message}
                                onChange={(value) => setValue('longitude', value)}
                            /> 
                        </div>  
                    </div>
                    <div className='row-zyx col-6'>
                        <div className="col-12">
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{t(langKeys.files)}</Box>
                            <UploaderIcon classes={classes} setFiles={setFiles} />
                            
                            {files.length > 0 &&
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', borderBottom: '1px solid #EBEAED', paddingBottom: 8 }}>
                                    {files.map((item: IFile) => <ItemFile key={item.id} item={item} setFiles={setFiles} />)}
                                </div>
                            }
                        </div>
                        <div className='col-12'>
                            <FieldEdit
                                label={t(langKeys.subfamily)}
                                valueDefault={getValues('longitude')}
                                className="col-6"
                                error={errors?.longitude?.message}
                                onChange={(value) => setValue('longitude', value)}
                            /> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WarehouseTabDetail;