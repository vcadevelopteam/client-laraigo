import React, { useState, useEffect } from 'react'
import 'emoji-mart/css/emoji-mart.css'
import { ImageIcon, QuickresponseIcon, SendIcon } from 'icons';
import { styled } from '@material-ui/core/styles';
import { useSelector } from 'hooks';
import { Dictionary } from '@types';
import { useDispatch } from 'react-redux';
import { emitEvent, replyTicket, goToBottom, reassignTicket } from 'store/inbox/actions';
import { uploadFile, resetUploadFile } from 'store/main/actions';
import { manageConfirmation } from 'store/popus/actions';
import InputBase from '@material-ui/core/InputBase';
import clsx from 'clsx';
import { EmojiPickerZyx, GifPickerZyx } from 'components'
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { langKeys } from 'lang/keys';
import { useTranslation } from 'react-i18next';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import AttachFileIcon from '@material-ui/icons/AttachFile';

interface IFile {
    type: string;
    url: string;
    id: string;
    error?: boolean;
}

const UploaderIcon: React.FC<{ classes: any, type: "image" | "file", setFiles: (param: any) => void }> = ({ classes, setFiles, type }) => {
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
                    <AttachFileIcon className={clsx(classes.iconResponse, { [classes.iconSendDisabled]: waitSave })} />
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

const QuickReplyIcon: React.FC<{ classes: any, setText: (param: string) => void }> = ({ classes, setText }) => {
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
            .replace("{{client_name}}", ticketSelected?.displayname)
            .replace("{{agent_name}}", user?.firstname + " " + user?.lastname)
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

const SmallAvatar = styled(Avatar)(({ theme }: any) => ({
    width: 22,
    backgroundColor: '#0ac630',
    height: 22,
    fontSize: 12,
}));


const BottomGoToUnder: React.FC = () => {
    const dispatch = useDispatch();
    const isOnBottom = useSelector(state => state.inbox.isOnBottom);
    const triggerNewMessageClient = useSelector(state => state.inbox.triggerNewMessageClient);
    const [countNewMessage, setCountNewMessage] = useState(0)

    useEffect(() => {
        if (triggerNewMessageClient !== null) {
            if (isOnBottom || isOnBottom === null)
                dispatch(goToBottom(null))
            else 
                setCountNewMessage(countNewMessage + 1)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [triggerNewMessageClient])


    useEffect(() => {
        if (isOnBottom) {
            setCountNewMessage(0)
        }
    }, [isOnBottom])

    if (isOnBottom || isOnBottom === null)
        return null;

    return (
        <div style={{ position: 'absolute', right: 20, top: -60 }}>
            <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                badgeContent={
                    countNewMessage > 0 && <SmallAvatar>{countNewMessage}</SmallAvatar>
                }
            >
                <Fab
                    size="small"
                    onClick={() => dispatch(goToBottom(true))}>
                    <DoubleArrowIcon style={{ color: '#2e2c34ba', transform: 'rotate(90deg)', width: 20, height: 20 }} />
                </Fab>
            </Badge>

        </div>
    )
}

const ReplyPanel: React.FC<{ classes: any }> = ({ classes }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const agentSelected = useSelector(state => state.inbox.agentSelected);
    const userType = useSelector(state => state.inbox.userType);
    const [text, setText] = useState("");
    const [files, setFiles] = useState<IFile[]>([]);

    const triggerReplyMessage = () => {
        const callback = () => {
            let wasSend = false;
            if (files.length > 0) {
                const listMessages = files.map(x => ({
                    ...ticketSelected!!,
                    interactiontype: x.type,
                    interactiontext: x.url,
                }))
                wasSend = true;
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
                    if (userType === "AGENT") {
                        dispatch(emitEvent({
                            event: 'newMessageFromAgent',
                            data: newInteractionSocket
                        }));
                    }
                })
                setFiles([])
            }
            if (text) {
                const textCleaned = text.trim();
                if (textCleaned) {
                    wasSend = true
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
                    if (userType === "AGENT") {
                        dispatch(emitEvent({
                            event: 'newMessageFromAgent',
                            data: newInteractionSocket
                        }));
                    }
                    //send to answer with integration
                    dispatch(replyTicket({
                        ...ticketSelected!!,
                        interactiontype: "text",
                        interactiontext: textCleaned,
                    }));
                    setText("");
                }
            }

            if (wasSend) {
                if (userType === "SUPERVISOR") {
                    dispatch(reassignTicket({
                        ...ticketSelected!!,
                        newUserId: 0,
                        newUserGroup: '',
                        observation: 'Reassigned from supervisor',
                        newConversation: true,
                        wasanswered: true
                    }));

                    dispatch(emitEvent({
                        event: 'reassignTicket',
                        data: {
                            ...ticketSelected,
                            userid: agentSelected?.userid,
                            newuserid: 0,
                        }
                    }));
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
            event.preventDefault();
            if (text.trim() || files.length > 0)
                return triggerReplyMessage()
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
                    <QuickReplyIcon classes={classes} setText={setText} />
                    <UploaderIcon type="image" classes={classes} setFiles={setFiles} />
                    <EmojiPickerZyx onSelect={e => setText(p => p + e.native)} />
                    <GifPickerZyx onSelect={(url: string) => setFiles(p => [...p, {type: 'image', url, id: new Date().toISOString()}])} />
                    <UploaderIcon type="file" classes={classes} setFiles={setFiles} />
                </div>
                <div className={clsx(classes.iconSend, { [classes.iconSendDisabled]: !(text || files.length > 0) })} onClick={triggerReplyMessage}>
                    <SendIcon />
                </div>
            </div>
            <BottomGoToUnder />
        </div>
    )
}

export default ReplyPanel;