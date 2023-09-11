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
import { ItemFile, UploaderIcon } from '../../components/components';
import { showSnackbar } from 'store/popus/actions';

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

const ProductTabDetail: React.FC<ProductDetailProps> = ({
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
    const initialValueAttachments = getValues('attachments');
    const [files, setFiles] = useState<IFile[]>(initialValueAttachments? initialValueAttachments.split(',').map((url:string) => ({ url })):[]);
    const multiData = useSelector(state => state.main.multiDataAux);

    useEffect(() => {
        if (waitUploadFile) {
            if (!uploadResult.loading && !uploadResult.error) {
                setValue('imagereference', uploadResult.url)
                setWaitUploadFile(false);
            } else if (uploadResult.error) {

                setWaitUploadFile(false);
            }
        }
    }, [waitUploadFile, uploadResult])


    const onSelectImage = (files: any) => {
        const selectedFile = files[0];
        if(selectedFile.size>5 * 1024 * 1024){
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.imagetoobig)}))
        }else{
            var fd = new FormData();
            fd.append('file', selectedFile, selectedFile.name);
            dispatch(uploadFile(fd));
            setWaitUploadFile(true);
        }
    }
    return (
        <div className={classes.containerDetail}>
            <div className="row-zyx">
                <div className='col-6'>
                    <div className='row-zyx'>
                        <FieldEdit
                            label={t(langKeys.code)}
                            valueDefault={getValues('productcode')}
                            className="col-4"
                            error={errors?.productcode?.message}
                            onChange={(value) => setValue('productcode', value)}
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
                            valueDefault={getValues('descriptionlarge')}
                            error={errors?.descriptionlarge?.message}
                            onChange={(value) => setValue('descriptionlarge', value)}
                            inputProps={{ maxLength: 10000 }}
                        />
                    </div>
                    <div className='row-zyx'>
                        <FieldSelect
                            label={t(langKeys.type)}
                            className="col-6"
                            valueDefault={getValues('producttype')}
                            onChange={(value) => setValue('producttype', value?.domainvalue||"")}
                            error={errors?.producttype?.message}
                            data={multiData.data[0].data}
                            optionValue="domainvalue"
                            optionDesc="domaindesc"
                        />
                        <FieldSelect
                            label={t(langKeys.family)}
                            className="col-6"
                            valueDefault={getValues('familyid')}
                            onChange={(value) => setValue('familyid', value?.domainid||0)}
                            error={errors?.familyid?.message}
                            data={multiData.data[1].data}
                            optionValue="domainid"
                            optionDesc="domaindesc"
                        />
                    </div>
                    <div className='row-zyx'>
                        <FieldSelect
                            label={t(langKeys.subfamily)}
                            className="col-6"
                            valueDefault={getValues('subfamilyid')}
                            onChange={(value) => setValue('subfamilyid', value?.domainid||0)}
                            error={errors?.subfamilyid?.message}
                            data={multiData.data[2].data}
                            optionDesc="domaindesc"
                            optionValue="domainid"
                        />
                        <FieldSelect
                            label={t(langKeys.batch)}
                            className="col-6"
                            valueDefault={getValues('loteid')}
                            onChange={(value) => setValue('loteid', value?.domainid||0)}
                            error={errors?.loteid?.message}
                            data={multiData.data[6].data}
                            optionDesc="domaindesc"
                            optionValue="domainid"
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
                                data={multiData.data[5].data}
                                optionDesc="domainvalue"
                                optionValue="domaindesc"
                            />
                        </div>
                        <div className='row-zyx'>
                            <FieldSelect
                                label={t(langKeys.purchase_unit)}
                                valueDefault={getValues('unitbuyid')}
                                onChange={(value) => setValue('unitbuyid', value?.domainid||0)}
                                error={errors?.unitbuyid?.message}
                                data={multiData.data[3].data}
                                optionDesc="domaindesc"
                                optionValue="domainid"
                            />
                        </div>
                        <div className='row-zyx'>
                            <FieldSelect
                                label={t(langKeys.dispatch_unit)}
                                valueDefault={getValues('unitdispatchid')}
                                onChange={(value) => setValue('unitdispatchid', value?.domainid||0)}
                                error={errors?.unitdispatchid?.message}
                                data={multiData.data[4].data}
                                optionDesc="domaindesc"
                                optionValue="domainid"
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
                                <Avatar style={{ width: 120, height: 120 }} src={getValues('imagereference')} />
                                <input
                                    name="file"
                                    accept="image/*"
                                    id="laraigo-upload-img-file"
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={(e) => onSelectImage(e.target.files)}
                                />
                                <label htmlFor="laraigo-upload-img-file">
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

export default ProductTabDetail;