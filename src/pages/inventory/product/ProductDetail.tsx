/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { Dictionary, IFile } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { FieldErrors, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { Avatar } from '@material-ui/core';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import { FieldEdit, FieldSelect } from 'components';
import { useSelector } from 'hooks';
import { uploadFile } from 'store/main/actions';
import { useDispatch } from 'react-redux';
import Box from '@material-ui/core/Box';
import { ItemFile, UploaderIcon } from './components/components';

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

interface ProductDetailProps {
    row: Dictionary | null;
    setValue: UseFormSetValue<any>;
    getValues: UseFormGetValues<any>;
    errors: FieldErrors<any>;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
    row,
    setValue,
    getValues,
    errors,
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [waitUploadFile, setWaitUploadFile] = useState(false);
    const uploadResult = useSelector(state => state.main.uploadFile);
    const dispatch = useDispatch();
    const [files, setFiles] = useState<IFile[]>([]);
    

    useEffect(() => {
        if (waitUploadFile) {
            if (!uploadResult.loading && !uploadResult.error) {
                setValue('image', uploadResult.url)
                setWaitUploadFile(false);
            } else if (uploadResult.error) {

                setWaitUploadFile(false);
            }
        }
    }, [waitUploadFile, uploadResult])


    const onSelectImage = (files: any) => {
        const selectedFile = files[0];
        var fd = new FormData();
        fd.append('file', selectedFile, selectedFile.name);
        dispatch(uploadFile(fd));
        setWaitUploadFile(true);
    }
    return (
        <div className={classes.containerDetail}>
            <div className="row-zyx">
                <div className='col-6'>
                    <div className='row-zyx'>
                        <FieldEdit
                            label={t(langKeys.code)}
                            valueDefault={getValues('code')}
                            className="col-4"
                            error={errors?.code?.message}
                            onChange={(value) => setValue('code', value)}
                            inputProps={{ maxLength: 20 }}
                        />
                        <FieldEdit
                            label={t(langKeys.description)}
                            valueDefault={getValues('description')}
                            className="col-8"
                            error={errors?.description?.message}
                            onChange={(value) => setValue('description', value)}
                            inputProps={{ maxLength: 256 }}
                        />
                    </div>
                    <div className='row-zyx'>
                        <FieldEdit
                            label={t(langKeys.completedesc)}
                            valueDefault={getValues('longdescription')}
                            error={errors?.longdescription?.message}
                            onChange={(value) => setValue('longdescription', value)}
                            inputProps={{ maxLength: 10000 }}
                        />
                    </div>
                    <div className='row-zyx'>
                        <FieldSelect
                            label={t(langKeys.type)}
                            className="col-6"
                            valueDefault={getValues('type')}
                            onChange={(value) => setValue('type', value?.domainvalue||"")}
                            error={errors?.type?.message}
                            data={[]}
                            optionValue="domainvalue"
                            optionDesc="domainvalue"
                        />
                        <FieldSelect
                            label={t(langKeys.family)}
                            className="col-6"
                            valueDefault={getValues('family')}
                            onChange={(value) => setValue('family', value?.domainvalue||"")}
                            error={errors?.family?.message}
                            data={[]}
                            optionDesc="domainvalue"
                            optionValue="domainvalue"
                        />
                    </div>
                    <div className='row-zyx'>
                        <FieldSelect
                            label={t(langKeys.subfamily)}
                            className="col-6"
                            valueDefault={getValues('subfamily')}
                            onChange={(value) => setValue('subfamily', value?.domainvalue||"")}
                            error={errors?.subfamily?.message}
                            data={[]}
                            optionDesc="domainvalue"
                            optionValue="domainvalue"
                        />
                        <FieldSelect
                            label={t(langKeys.batch)}
                            className="col-6"
                            valueDefault={getValues('batch')}
                            onChange={(value) => setValue('batch', value?.domainvalue||"")}
                            error={errors?.batch?.message}
                            data={[]}
                            optionDesc="domainvalue"
                            optionValue="domainvalue"
                        />
                    </div>
                </div>
                <div className='row-zyx col-6'>
                    <div className='col-6'>
                        <div className='row-zyx'>
                            <FieldSelect
                                label={t(langKeys.status)}
                                valueDefault={getValues('status')}
                                onChange={(value) => setValue('status', value?.domainvalue||"")}
                                error={errors?.status?.message}
                                data={[]}
                                optionDesc="domainvalue"
                                optionValue="domainvalue"
                            />
                        </div>
                        <div className='row-zyx'>
                            <FieldSelect
                                label={t(langKeys.purchase_unit)}
                                valueDefault={getValues('purchase_unit')}
                                onChange={(value) => setValue('purchase_unit', value?.domainvalue||"")}
                                error={errors?.purchase_unit?.message}
                                data={[]}
                                optionDesc="domainvalue"
                                optionValue="domainvalue"
                            />
                        </div>
                        <div className='row-zyx'>
                            <FieldSelect
                                label={t(langKeys.dispatch_unit)}
                                valueDefault={getValues('dispatch_unit')}
                                onChange={(value) => setValue('dispatch_unit', value?.domainvalue||"")}
                                error={errors?.dispatch_unit?.message}
                                data={[]}
                                optionDesc="domainvalue"
                                optionValue="domainvalue"
                            />
                        </div>
                    </div>
                    <div className="row-zyx col-6">
                        <div className="col-12">
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{t(langKeys.files)}</Box>
                            <UploaderIcon classes={classes} setFiles={setFiles} />
                            
                            {files.length > 0 &&
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', borderBottom: '1px solid #EBEAED', paddingBottom: 8 }}>
                                    {files.map((item: IFile) => <ItemFile key={item.id} item={item} setFiles={setFiles} />)}
                                </div>
                            }
                        </div>
                        <div className="col-12" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            
                            <div style={{ position: 'relative' }}>
                                <Avatar style={{ width: 120, height: 120 }} src={getValues('image')} />
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
                </div>
            </div>
        </div>
    )
}

export default ProductDetail;