import React, { FC, useState, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { uploadFile, resetUploadFile } from 'store/main/actions';
import { useDispatch } from 'react-redux';
import { IFile } from '@types';
import { useSelector } from 'hooks';

const useStyles = makeStyles((theme: Theme) => ({
    formFileUpload: {
        width: '100%',
        maxWidth: '100%',
        position: 'relative',
    },
    inputFileUpload: {
        display: "none"
    },
    dragActive: {
        backgroundColor: "#FFF",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#7c7777",
        border: "4px dashed #e1e1e1",
        opacity: .8
    },
    dragFileElement: {
        position: "absolute",
        width: "100%",
        height: "100%",
        borderRadius: "1rem",
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
    }
}));

const DragDropFile: FC<{ setFiles: (param: any) => void, setfileimage?: (param: any) => void }> = ({ children, setFiles, setfileimage }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const uploadResult = useSelector(state => state.main.uploadFile);
    const [dragActive, setDragActive] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const [listFiles, setListFiles] = useState<any[]>([])
    const [indexfile, setIndexfile] = useState(0)
    const [waitSave, setWaitSave] = useState(false);
    const [idUpload, setIdUpload] = useState('');

    const handleDrag = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        if (waitSave) {
            return
        }
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    // triggers when file is dropped
    const handleDrop = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setIndexfile(1)
            setListFiles(Array.from(e.dataTransfer.files))
            triggerUpload(e.dataTransfer.files[0])
        }
    };

    const triggerUpload = (selectedFile: any) => {
        const idd = new Date().toISOString()
        const fd = new FormData();
        fd.append('file', selectedFile, selectedFile.name);
        setIdUpload(idd);
        setFiles((x: IFile[]) => [...x, { id: idd, url: '', type: selectedFile.type.includes("image") ? "image" : "file" }]);
        dispatch(uploadFile(fd));
        setWaitSave(true)
    }

    useEffect(() => {
        if (waitSave) {
            if (!uploadResult.loading && !uploadResult.error) {
                setFiles((x: IFile[]) => x.map(item => item.id === idUpload ? { ...item, url: uploadResult.url } : item))
                setWaitSave(false);
                if (listFiles.length === indexfile) {
                    dispatch(resetUploadFile());
                } else {
                    setIndexfile(indexfile + 1)
                    triggerUpload(listFiles[indexfile])
                }
            } else if (uploadResult.error) {
                setFiles((x: IFile[]) => x.map(item => item.id === idUpload ? { ...item, url: uploadResult.url, error: true } : item))
                setWaitSave(false);
            }
        }
    }, [waitSave, uploadResult, dispatch, setFiles, idUpload])

    const clickLabel = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
    }

    return (
        <div className={classes.formFileUpload} onDragEnter={handleDrag}>
            <input ref={inputRef} type="file" className={classes.inputFileUpload} id="input-file-upload-xdg" multiple={true} />
            {children}
            <label onClick={clickLabel} id="label-file-upload" htmlFor="input-file-upload-xdg">
                {dragActive && (
                    <div className={classes.dragActive}>
                        Drag file here
                    </div>
                )}
            </label>
            {dragActive && <div className={classes.dragFileElement} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}
        </div>
    );
};

export default DragDropFile;
