import React, { useState, useEffect } from 'react'
import 'emoji-mart/css/emoji-mart.css'
import { AttachmentIcon, ImageIcon, QuickresponseIcon, SendIcon } from 'icons';

import { useSelector } from 'hooks';
import { Dictionary } from '@types';
import { useDispatch } from 'react-redux';
import { emitEvent, replyTicket } from 'store/inbox/actions';
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
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Tooltip from '@material-ui/core/Tooltip';

interface IFile {
    type: string;
    url: string;
    id: string;
    error?: boolean;
}
const IconUploader: React.FC<{ classes: any, type: "image" | "file", setFiles: (param: any) => void }> = ({ classes, setFiles, type }) => {
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
                style={{ display: 'none' }}
                onChange={(e) => onSelectImage(e.target.files)}
            />
            <label htmlFor={`laraigo-upload-${type}`}>
                {type === "image" ?
                    <ImageIcon className={clsx(classes.iconResponse, { [classes.iconSendDisabled]: waitSave })} /> :
                    <AttachmentIcon className={clsx(classes.iconResponse, { [classes.iconSendDisabled]: waitSave })} />
                }
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

const IconQuickReply: React.FC<{ classes: any, setText: (param: string) => void }> = ({ classes, setText }) => {
    const [open, setOpen] = React.useState(false);
    const [quickReplies, setquickReplies] = useState<Dictionary[]>([])
    const handleClick = () => setOpen((prev) => !prev);

    const multiData = useSelector(state => state.main.multiData);
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const user = useSelector(state => state.login.validateToken.user);

    const handleClickAway = () => setOpen(false);

    useEffect(() => {
        if (!multiData.loading && !multiData.error && multiData?.data[4]) {
            setquickReplies(multiData?.data[4].data)
        }
    }, [multiData])

    const handlerClickItem = (item: Dictionary) => {
        setOpen(false);
        setText(item.quickreply
            .replace("{{numticket}}", ticketSelected?.ticketnum)
            .replace("{{nombre_cliente}}", ticketSelected?.displayname)
            .replace("{{nombre_asesor}}", user?.firstname + " " + user?.lastname)
        );
    }

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div>
                <QuickresponseIcon className={classes.iconResponse} onClick={handleClick} />
                {open && (
                    <div style={{
                        position: 'absolute',
                        bottom: 50
                    }}>
                        <div className={classes.containerQuickReply}>
                            <div className={classes.headerQuickReply}>User Quick Response</div>
                            <div>
                                {quickReplies.slice(0, 7).map((item) => (
                                    <div key={item.quickreplyid} >
                                        <Tooltip title={item.quickreply} arrow placement="top">
                                            <div className={classes.itemQuickReply} onClick={() => handlerClickItem(item)}>
                                                {item.description}
                                            </div>
                                        </Tooltip>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ClickAwayListener>
    )
}

const ReplyPanel: React.FC<{ classes: any }> = ({ classes }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);

    const userType = useSelector(state => state.inbox.userType);
    const [text, setText] = useState("");
    const [files, setFiles] = useState<IFile[]>([]);

    const triggerReplyMessage = () => {
        const callback = () => {
            
            console.log("reply message success")

            if (files.length > 0) {
                const listMessages = files.map(x => ({
                    ...ticketSelected!!,
                    interactiontype: x.type,
                    interactiontext: x.url,
                }))
                dispatch(replyTicket(listMessages, true))

                files.forEach((x, i) => {
                    const newInteractionSocket = {
                        ...ticketSelected!!,
                        interactionid: 0,
                        typemessage: x.type,
                        typeinteraction: null,
                        lastmessage: x.url,
                        createdate: new Date().toISOString(),
                        userid: 0,
                        usertype: "agent",
                        ticketWasAnswered: !(ticketSelected!!.isAnswered || i > 0), //solo enviar el cambio en el primer mensaje
                    }
                    dispatch(emitEvent({
                        event: 'newMessageFromAgent',
                        data: newInteractionSocket
                    }));

                    // socketEmitEvent('newMessageFromAgent', newInteractionSocket);
                })
                setFiles([])
            }
            if (text) {
                const textCleaned = text.trim();
                if (textCleaned) {
                    const newInteractionSocket = {
                        ...ticketSelected!!,
                        interactionid: 0,
                        typemessage: "text",
                        typeinteraction: null,
                        lastmessage: textCleaned,
                        createdate: new Date().toISOString(),
                        userid: 0,
                        usertype: "agent",
                        ticketWasAnswered: !ticketSelected!!.isAnswered,
                    }
                    //websocket
                    dispatch(emitEvent({
                        event: 'newMessageFromAgent',
                        data: newInteractionSocket
                    }));
                    // socketEmitEvent('newMessageFromAgent', newInteractionSocket);

                    //send to answer with integration
                    dispatch(replyTicket({
                        ...ticketSelected!!,
                        interactiontype: "text",
                        interactiontext: textCleaned,
                    }));
                    setText("");
                }
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
        if (event.ctrlKey || event.shiftKey)
            return;
        if (event.charCode === 13) {
            if (text.trim() || files.length > 0)
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
                    <IconQuickReply classes={classes} setText={setText} />
                    <IconUploader type="image" classes={classes} setFiles={setFiles} />
                    <EmojiPickerZyx onSelect={e => setText(p => p + e.native)} />
                    <IconUploader type="file" classes={classes} setFiles={setFiles} />
                </div>
                <div className={clsx(classes.iconSend, { [classes.iconSendDisabled]: !(text || files.length > 0) })} onClick={triggerReplyMessage}>
                    <SendIcon />
                </div>
            </div>
        </div>
    )
}

export default ReplyPanel;