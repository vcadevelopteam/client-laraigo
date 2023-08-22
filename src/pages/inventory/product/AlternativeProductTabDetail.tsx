/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { Dictionary, IFile } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { FieldErrors, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { Avatar, Button } from '@material-ui/core';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import { FieldEdit, FieldSelect } from 'components';
import { useSelector } from 'hooks';
import { uploadFile } from 'store/main/actions';
import { useDispatch } from 'react-redux';
import Box from '@material-ui/core/Box';
import { ItemFile, UploaderIcon } from './components/components';
import TableZyx from 'components/fields/table-simple';

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

interface AlternativeProductDetailProps {
    row: Dictionary | null;
    setValue: UseFormSetValue<any>;
    getValues: UseFormGetValues<any>;
    errors: FieldErrors<any>;
}

const AlternativeProductTab: React.FC<AlternativeProductDetailProps> = ({
    row,
    setValue,
    getValues,
    errors,
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [files, setFiles] = useState<IFile[]>([]);
    const [waitUploadFile, setWaitUploadFile] = useState(false);
    const uploadResult = useSelector(state => state.main.uploadFile);
    const dispatch = useDispatch();

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


    const columns = React.useMemo(
        () => [

            {
                Header: t(langKeys.product),
                accessor: 'product',
                width: "auto",
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                width: "auto",
            },
            {
                Header: t(langKeys.family),
                accessor: 'family',
                width: "auto",
            },
            {
                Header: t(langKeys.subfamily),
                accessor: 'subfamily',
                width: "auto",
            },
        ],
        []
    );
    return (
        <div className={classes.containerDetail}>
            <div className="row-zyx">
                <Button variant="contained" color="primary" className="btn-zyx">
                    {t(langKeys.alternativePhone)}
                </Button>
            </div>
        </div>
    )
}

export default AlternativeProductTab;