import { IconButton } from "@material-ui/core";
import { IFile } from "@types";
import { ImageIcon } from "icons";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { resetUploadFile, uploadFile } from "store/main/actions";
import AttachFileIcon from '@material-ui/icons/AttachFile';
import clsx from "clsx";

export const UploaderIcon: React.FC<{ classes: any, type: "image" | "file", setFiles: (param: any) => void, initfile?: any, setfileimage?: (param: any) => void }> = ({ classes, setFiles, type, initfile, setfileimage }) => {
    const [valuefile, setvaluefile] = useState('')
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const { t } = useTranslation();
    const uploadResult = useSelector(state => state.main.uploadFile);
    const [idUpload, setIdUpload] = useState('');

    useEffect(() => {
        if (initfile) {
            onSelectImage(initfile)
            if (setfileimage) {
                setfileimage(null)
            }
        }
    }, [initfile])

    useEffect(() => {
        if (waitSave) {
            if (!uploadResult.loading && !uploadResult.error) {
                setFiles((x: IFile[]) => x.map(item => item.id === idUpload ? { ...item, url: uploadResult.url } : item))
                setWaitSave(false);
                dispatch(resetUploadFile());
            } else if (uploadResult.error) {
                // const errormessage = uploadResult.code || "error_unexpected_error"
                setFiles((x: IFile[]) => x.map(item => item.id === idUpload ? { ...item, url: uploadResult.url, error: true } : item))
                // dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
            }
        }
    }, [waitSave, uploadResult, dispatch, setFiles, idUpload])

    const onSelectImage = (files: any) => {
        const selectedFile = files[0];
        const idd = new Date().toISOString()
        const fd = new FormData();
        fd.append('file', selectedFile, selectedFile.name);
        setvaluefile('')
        setIdUpload(idd);
        setFiles((x: IFile[]) => [...x, { id: idd, url: '', type }]);
        dispatch(uploadFile(fd));
        setWaitSave(true)
    }

    return (
        <>
            <input
                name="file"
                accept={type === "image" ? "image/*" : undefined}
                id={`laraigo-upload-${type}`}
                type="file"
                value={valuefile}
                style={{ display: "none" }}
                onChange={(e) => onSelectImage(e.target.files)}
            />
            <label htmlFor={`laraigo-upload-${type}`}>
                <IconButton color="primary" aria-label="upload picture" component="span">
                    {type === 'image' &&
                        <ImageIcon className={clsx(classes.iconResponse, { [classes.iconSendDisabled]: waitSave })} />
                    }
                    {type !== 'image' &&
                        <AttachFileIcon className={clsx(classes.iconResponse, { [classes.iconSendDisabled]: waitSave })} />
                    }
                </IconButton>
            </label>
        </>
    );
}
