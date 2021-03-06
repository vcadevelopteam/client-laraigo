import React, { useState, useEffect } from 'react'
import 'emoji-mart/css/emoji-mart.css'
import { IInteraction } from "@types";
import { AttachmentIcon, ImageIcon, QuickresponseIcon, SendIcon } from 'icons';

import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { replyMessage, replyTicket } from 'store/inbox/actions';
import { uploadFile, resetUploadFile } from 'store/main/actions';
import InputBase from '@material-ui/core/InputBase';
import clsx from 'clsx';
import { EmojiPickerZyx } from 'components'
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

interface IFile {
    type: string;
    url: string;
    id: string;
    error?: boolean;
}
const IconUploadImage: React.FC<{ classes: any, setFiles: (param: any) => void }> = ({ classes, setFiles }) => {
    const [valuefile, setvaluefile] = useState('')
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);

    const uploadResult = useSelector(state => state.main.uploadFile);
    const [idUpload, setIdUpload] = useState('');

    useEffect(() => {
        if (waitSave) {
            if (!uploadResult.loading && !uploadResult.error) {
                console.log("into effect", idUpload)
                setFiles((x: IFile[]) => x.map(item => item.id === idUpload ? { ...item, url: uploadResult.url } : item))
                setWaitSave(false);
                dispatch(resetUploadFile());
            } else if (uploadResult.error) {
                // const errormessage = uploadResult.code || "error_unexpected_error"
                setFiles((x: IFile[]) => x.map(item => item.id === idUpload ? { ...item, url: uploadResult.url, error: true } : item))
                // dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                setWaitSave(false);
            }
        }
    }, [waitSave, uploadResult, dispatch, setFiles, idUpload])

    const onSelectImage = (files: any) => {
        const selectedFile = files[0];
        const idd = new Date().toISOString()
        var fd = new FormData();
        fd.append('file', selectedFile, selectedFile.name);
        setvaluefile('')
        setIdUpload(idd);
        setFiles((x: IFile[]) => [...x, { id: idd, url: '', type: 'image' }]);
        dispatch(uploadFile(fd));
        setWaitSave(true)
    }

    return (
        <>
            <input
                name="file"
                accept="image/*"
                id="laraigo-upload-image-file"
                type="file"
                value={valuefile}
                style={{ display: 'none' }}
                onChange={(e) => onSelectImage(e.target.files)}
            />
            <label htmlFor="laraigo-upload-image-file">
                <ImageIcon className={clsx(classes.iconResponse, { [classes.iconSendDisabled]: waitSave })} />
            </label>
        </>
    )
}
const ItemFile: React.FC<{ item: IFile, setFiles: (param: any) => void }> = ({ item, setFiles }) => (
    <div style={{ position: 'relative' }}>
        <div key={item.id} style={{ width: 70, height: 70, border: '1px solid #e1e1e1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {item.url ?
                (item.type === 'image' ?
                    <img alt="loaded" src={item.url} style={{ objectFit: 'cover', width: '100%' }} /> :
                    <img width="30" height="30" alt="loaded" src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/1631292621392file-trans.png" />) :
                <CircularProgress color="inherit" />
            }
        </div>
        <IconButton
            onClick={() => setFiles((x: IFile[]) => x.filter(y => y.id !== item.id))}
            size="small"
            style={{ position: 'absolute', top: -16, right: -14 }}
        >
            <CloseIcon fontSize="small" />
        </IconButton>
    </div>
)

const ReplyPanel: React.FC<{ classes: any }> = ({ classes }) => {
    const dispatch = useDispatch();
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const [text, setText] = useState("");
    const [files, setFiles] = useState<IFile[]>([]);

    const triggerReplyMessage = () => {
        if (files.length > 0) {
            files.forEach(x => {
                dispatch(replyMessage({
                    interactionid: 0,
                    interactiontype: "image",
                    interactiontext: x.url,
                    createdate: new Date().toISOString(),
                    userid: 999999,
                    usertype: "agent",
                }))
            })
            setFiles([])
        }
        if (text) {
            const textCleaned = text.trim();
            const newInteraction: IInteraction = {
                interactionid: 0,
                interactiontype: "text",
                interactiontext: textCleaned,
                createdate: new Date().toISOString(),
                userid: 999999,
                usertype: "agent",
            }
            dispatch(replyMessage(newInteraction));
            dispatch(replyTicket({
                ...ticketSelected!!,
                interactiontype: "text",
                interactiontext: textCleaned,
                isAnswered: true
            }))
            setText("");
        }
    }

    return (
        <div className={classes.containerResponse}>
            {files.length > 0 &&
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', borderBottom: '1px solid #EBEAED', paddingBottom: 8 }}>
                    {files.map((item: IFile, index: number) => (
                        <ItemFile key={index} item={item} setFiles={setFiles} />
                    ))}
                </div>
            }
            <div>
                <InputBase
                    fullWidth
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Send your message..."
                    rows={2}
                    multiline
                    inputProps={{ 'aria-label': 'naked' }}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 16 }}>
                    <QuickresponseIcon className={classes.iconResponse} />
                    <IconUploadImage classes={classes} setFiles={setFiles} />
                    <EmojiPickerZyx onSelect={e => setText(p => p + e.native)} />
                    <AttachmentIcon className={classes.iconResponse} />
                </div>
                <div className={clsx(classes.iconSend, { [classes.iconSendDisabled]: !(text || files.length > 0) })} onClick={triggerReplyMessage}>
                    <SendIcon />
                </div>
            </div>
        </div>
    )
}

export default ReplyPanel;