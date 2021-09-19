import React, { useState, useEffect } from 'react'
import 'emoji-mart/css/emoji-mart.css'
import { AttachmentIcon, ImageIcon, QuickresponseIcon, SendIcon } from 'icons';

import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { replyMessage, replyTicket } from 'store/inbox/actions';
import { uploadFile, resetUploadFile } from 'store/main/actions';
import { manageConfirmation } from 'store/popus/actions';
import InputBase from '@material-ui/core/InputBase';
import clsx from 'clsx';
import { EmojiPickerZyx } from 'components'
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { langKeys } from 'lang/keys';
import { useTranslation } from 'react-i18next';

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

const ReplyPanel: React.FC<{ classes: any, socketEmitEvent: (event: string, param: any) => void }> = ({ classes, socketEmitEvent }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);

    const userType = useSelector(state => state.inbox.userType);
    const [text, setText] = useState("");
    const [files, setFiles] = useState<IFile[]>([]);

    const triggerReplyMessage = () => {
        const callback = () => {
            if (files.length > 0) {
                const listMessages = files.map(x => ({
                    ...ticketSelected!!,
                    interactiontype: "image",
                    interactiontext: x.url,
                    isAnswered: true
                }))
                dispatch(replyTicket(listMessages, true))

                files.forEach(x => {
                    const newInteraction = {
                        ...ticketSelected!!,
                        interactionid: 0,
                        typemessage: "image",
                        typeinteraction: null,
                        lastmessage: x.url,
                        createdate: new Date().toISOString(),
                        userid: 0,
                        usertype: "agent",
                    }
                    socketEmitEvent('newMessageFromAgent', newInteraction);
                })
                setFiles([])
            }
            if (text) {
                const textCleaned = text.trim();

                const newInteractionSocket = {
                    ...ticketSelected!!,
                    interactionid: 0,
                    typemessage: "text",
                    typeinteraction: null,
                    lastmessage: textCleaned,
                    createdate: new Date().toISOString(),
                    userid: 0,
                    usertype: "agent",
                    ticketWasAnswered: ticketSelected!!.isAnswered ? false : true,
                }
                //websocket
                socketEmitEvent('newMessageFromAgent', newInteractionSocket);

                //send to answer with integration
                dispatch(replyTicket({
                    ...ticketSelected!!,
                    interactiontype: "text",
                    interactiontext: textCleaned,
                }));
                setText("");
            }
        }

        if (userType === "SUPERVISOR") {
            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_reasign_with_reply),
                callback
            }))
        } else {
            callback();
        }
    }

    const handleKeyPress = (event: any) => {
        if (event.ctrlKey && event.charCode === 13) {
            triggerReplyMessage()
        }
    }

    return (
        <div className={classes.containerResponse}>
            {files.length > 0 &&
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', borderBottom: '1px solid #EBEAED', paddingBottom: 8 }}>
                    {files.map((item: IFile) => <ItemFile key={item.id} item={item} setFiles={setFiles} />)}
                </div>
            }
            <div>
                <InputBase
                    fullWidth
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Send your message..."
                    onKeyPress={handleKeyPress}
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