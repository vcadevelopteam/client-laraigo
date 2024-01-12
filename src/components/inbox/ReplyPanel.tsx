import React, { useState, useEffect } from 'react'
import 'emoji-mart/css/emoji-mart.css'
import InputAdornment from '@material-ui/core/InputAdornment';
import { ImageIcon, QuickresponseIcon, RichResponseIcon, SendIcon, SearchIcon } from 'icons';
import { makeStyles, styled } from '@material-ui/core/styles';
import { useSelector } from 'hooks';
import { Dictionary, IFile, ILibrary } from '@types';
import { useDispatch } from 'react-redux';
import { emitEvent, replyTicket, goToBottom, showGoToBottom, reassignTicket, triggerBlock } from 'store/inbox/actions';
import { uploadFile, resetUploadFile } from 'store/main/actions';
import { manageConfirmation, showSnackbar } from 'store/popus/actions';
import InputBase from '@material-ui/core/InputBase';
import clsx from 'clsx';
import { DialogZyx, EmojiPickerZyx, FieldSelect, GifPickerZyx, SearchField } from 'components'
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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import { cleanedRichResponse, convertLocalDate, getSecondsUntelNow } from 'common/helpers/functions'
import { Descendant } from 'slate';
import { RichText, renderToString, toElement } from 'components/fields/RichText';
import { emojis } from "common/constants/emojis";
import DragDropFile from 'components/fields/DragDropFile';
import MailRecipients from './MailRecipients';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { ListItemIcon } from '@material-ui/core';
import { LibraryBooks, Publish } from '@material-ui/icons';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { DocIcon, FileIcon1 as FileIcon, PdfIcon, PptIcon, TxtIcon, XlsIcon, ZipIcon } from 'icons';
import StarRateIcon from '@material-ui/icons/StarRate';

const useStylesInteraction = makeStyles(() => ({
    textFileLibrary: {
        padding: '0px .5rem',
        width: 80,
        wordBreak: "break-word",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        textAlign: "center"
    },
    containerFiles: {
        display: "flex",
        gap: '1rem',
        flexWrap: "wrap",
        marginTop: 16,
        maxHeight: 300,
        overflowY: 'auto'
    },
    containerFileLibrary: {
        cursor: "pointer",
        '&:hover': {
            backgroundColor: 'rgb(235, 234, 237, 0.18)'
        },
    },
    inputPlaceholder: {
        padding: "2rem",
        '&::placeholder': {
            fontSize: "1rem",
            fontWeight: 500,
            color: '#84818A',
        },
    },
}));

const EMOJISINDEXED = emojis.reduce((acc: any, item: any) => ({ ...acc, [item.emojihex]: item }), {});

const channelsWhatsapp = ["WHAT", "WHAD", "WHAP", "WHAG", "WHAM"];

const DialogSearchLibrary: React.FC<{
    setOpenModal: (param: any) => void;
    openModal: boolean;
    setFiles: (param: any) => void;
}> = ({ setOpenModal, openModal, setFiles }) => {
    const { t } = useTranslation();
    const classes = useStylesInteraction();
    const libraryList = useSelector(state => state.inbox.libraryList);
    const [categoryList, setCategoryList] = useState<Dictionary[]>([]);
    const [libraryToShow, setLibraryToShow] = useState<ILibrary[]>([]);

    const onSelectFile = (file: ILibrary) => {
        const iid = new Date().toISOString();
        setFiles((x: IFile[]) => [...x, { id: iid, url: file.link, type: file.type }]);
        setOpenModal(false)
    }

    useEffect(() => {
        if (openModal) {
            setCategoryList(Array.from(new Set(libraryList.map(x => x.category))).filter(x => x).map(x => ({ option: x })));
            setLibraryToShow(libraryList);
        }
    }, [openModal])

    const applyFilter = (value: string) => {
        if (value) {
            setLibraryToShow(libraryToShow.filter(x => x.title.includes(value)))
        } else {
            setLibraryToShow(libraryList);
        }
    }

    const applyFilterCategory = (value: string | undefined) => {
        if (value) {
            setLibraryToShow(libraryList.filter(x => x.category === value))
        } else {
            setLibraryToShow(libraryList);
        }
    }

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.documentlibrary)}
            buttonText1={t(langKeys.cancel)}
            handleClickButton1={() => setOpenModal(false)}
            button2Type="submit"
        >
            <div>
                <div style={{ display: "flex", gap: 16 }}>
                    <div style={{ width: 200 }}>
                        <FieldSelect
                            label={t(langKeys.category)}
                            className="col-4"
                            onChange={(value) => applyFilterCategory(value?.option)}
                            data={categoryList}
                            variant='outlined'
                            optionDesc="option"
                            optionValue="option"
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <SearchField
                            style={{ fontSize: "1rem" }}
                            className='col-8'
                            colorPlaceHolder='#FFF'
                            inputProps={{ className: classes.inputPlaceholder }}
                            handleChangeOther={applyFilter}
                            lazy
                        />

                    </div>
                </div>
                {libraryList.some(x => x.favorite) && (
                    <>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 16, marginLeft: 4 }}>
                            <StarRateIcon fontSize='small' color='primary' />
                            <div style={{ fontWeight: 500, fontSize: 16, color: "#7721AD" }}>{t(langKeys.favorites)}</div>

                        </div>
                        <div className={classes.containerFiles}>
                            {libraryToShow.map(x => {
                                if (!x.favorite) {
                                    return null
                                }
                                const extension = x.link.split('.').pop()

                                return (
                                    <div
                                        key={x.documentlibraryid}
                                        className={classes.containerFileLibrary}
                                        onClick={() => onSelectFile(x)}
                                    >
                                        {x.type === "image" ? (
                                            <div style={{ padding: 10, width: "80px", height: "80px" }}>
                                                <img style={{ objectFit: 'cover' }} src={x.link} width={"100%"} height={"100%"} />
                                            </div>
                                        ) : extension === "pdf" ? (
                                            <PdfIcon width="80" height="80" />
                                        ) : (extension === "doc" || extension === "docx") ? (
                                            <DocIcon width="80" height="80" />
                                        ) : (["xls", "xlsx", "csv"].includes(`${extension}`)) ? (
                                            <XlsIcon width="80" height="80" />
                                        ) : (extension === "ppt" || extension === "pptx") ? (
                                            <PptIcon width="80" height="80" />
                                        ) : (extension === "text" || extension === "txt") ? (
                                            <TxtIcon width="80" height="80" />
                                        ) : (extension === "zip" || extension === "rar") ? (
                                            <ZipIcon width="80" height="80" />
                                        ) : <FileIcon width="80" height="80" />
                                        }
                                        <div className={classes.textFileLibrary}>{x.title}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}
                <div style={{ marginTop: 24, marginLeft: 4, fontWeight: 500, fontSize: 16, color: "#7721AD" }}>{t(langKeys.others)}</div>
                <div className={classes.containerFiles}>
                    {libraryToShow.map(x => {
                        const extension = x.link.split('.').pop()

                        return (
                            <div
                                key={x.documentlibraryid}
                                className={classes.containerFileLibrary}
                                onClick={() => onSelectFile(x)}
                            >
                                {x.type === "image" ? (
                                    <div style={{ padding: 10, width: "80px", height: "80px" }}>
                                        <img style={{ objectFit: 'cover' }} src={x.link} width={"100%"} height={"100%"} />
                                    </div>
                                ) : extension === "pdf" ? (
                                    <PdfIcon width="80" height="80" />
                                ) : (extension === "doc" || extension === "docx") ? (
                                    <DocIcon width="80" height="80" />
                                ) : (["xls", "xlsx", "csv"].includes(`${extension}`)) ? (
                                    <XlsIcon width="80" height="80" />
                                ) : (extension === "ppt" || extension === "pptx") ? (
                                    <PptIcon width="80" height="80" />
                                ) : (extension === "text" || extension === "txt") ? (
                                    <TxtIcon width="80" height="80" />
                                ) : (extension === "zip" || extension === "rar") ? (
                                    <ZipIcon width="80" height="80" />
                                ) : <FileIcon width="80" height="80" />
                                }
                                <div className={classes.textFileLibrary}>{x.title}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </DialogZyx>)
}

const UploaderIcon: React.FC<{
    classes: ClassNameMap,
    setFiles: (param: any) => void, initfile?: any, setfileimage?: (param: any) => void
}> = ({ classes, setFiles, initfile, setfileimage }) => {
    const { t } = useTranslation();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [valuefile, setvaluefile] = useState('')
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const uploadResult = useSelector(state => state.main.uploadFile);
    const lock_send_file_pc = useSelector(state => state.login.validateToken.user?.properties?.lock_send_file_pc);

    const [openModal, setOpenModal] = useState(false)
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
        setFiles((x: IFile[]) => [...x, { id: idd, url: '' }]);
        dispatch(uploadFile(fd));
        setWaitSave(true)
    }

    return (
        <>
            <IconButton color="primary" size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
                <AttachFileIcon className={clsx(classes.iconResponse, { [classes.iconSendDisabled]: waitSave })} />
            </IconButton>
            <input
                name="file"
                id={`laraigo-upload-file-x`}
                type="file"
                value={valuefile}
                style={{ display: "none" }}
                onChange={(e) => onSelectImage(e.target.files)}
            />
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                {!lock_send_file_pc && (
                    <label htmlFor={`laraigo-upload-file-x`}>
                        <MenuItem onClick={() => {
                            setAnchorEl(null)
                        }}>
                            <ListItemIcon>
                                <Publish width={18} style={{ fill: '#2E2C34' }} />
                            </ListItemIcon>
                            {"Subir archivos desde el ordenador"}
                        </MenuItem>
                    </label>
                )}
                <MenuItem onClick={() => {
                    setAnchorEl(null)
                    setOpenModal(true)
                }}>
                    <ListItemIcon>
                        <LibraryBooks width={18} style={{ fill: '#2E2C34' }} />
                    </ListItemIcon>
                    {"Elegir desde la biblioteca de archivos"}
                </MenuItem>
            </Menu>
            <DialogSearchLibrary
                openModal={openModal}
                setOpenModal={setOpenModal}
                setFiles={setFiles}
            />
        </>
    );
}

const ItemFile: React.FC<{ item: IFile, setFiles: (param: any) => void }> = ({ item, setFiles }) => {
    const extension = item.url.split('.').pop()

    return (
        <div style={{ position: 'relative' }}>
            <div key={item.id} style={{ width: 70, height: 70, border: '1px solid #e1e1e1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {item.url ?
                    (item.type === 'image' ?
                        <img alt="loaded" src={item.url} style={{ objectFit: 'cover', width: '100%', maxHeight: 70 }} /> :
                        (extension === "pdf" ? (
                            <PdfIcon width="70" height="70" />
                        ) : (extension === "doc" || extension === "docx") ? (
                            <DocIcon width="70" height="70" />
                        ) : (["xls", "xlsx", "csv"].includes(`${extension}`)) ? (
                            <XlsIcon width="70" height="70" />
                        ) : (extension === "ppt" || extension === "pptx") ? (
                            <PptIcon width="70" height="70" />
                        ) : (extension === "text" || extension === "txt") ? (
                            <TxtIcon width="70" height="70" />
                        ) : (extension === "zip" || extension === "rar") ? (
                            <ZipIcon width="70" height="70" />
                        ) : <FileIcon width="70" height="70" />
                        )) :
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
}

const QuickReplyIcon: React.FC<{ classes: ClassNameMap, setText: (param: string) => void }> = ({ classes, setText }) => {
    const [open, setOpen] = React.useState(false);
    const quickReplies = useSelector(state => state.inbox.quickreplies);
    const [quickRepliesToShow, setquickRepliesToShow] = useState<Dictionary[]>([])
    const handleClick = () => setOpen((prev) => !prev);
    const [showSearch, setShowSearch] = useState(false);
    const [search, setSearch] = useState("");
    const { t } = useTranslation();
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const user = useSelector(state => state.login.validateToken.user);
    const variablecontext = useSelector(state => state.inbox.person.data?.variablecontext);

    const handleClickAway = () => setOpen(false);

    useEffect(() => {
        setquickRepliesToShow(quickReplies.data.filter(x => !!x.favorite))
    }, [quickReplies])

    useEffect(() => {
        if (search === "") {
            setquickRepliesToShow(quickReplies.data.filter(x => !!x.favorite))
        } else {
            setquickRepliesToShow(quickReplies.data.filter(x => x.description.toLowerCase().includes(search.toLowerCase())))
        }
    }, [search, quickReplies])

    const handlerClickItem = (item: Dictionary) => {
        setOpen(false);
        const variablesList = item.quickreply.match(/({{)(.*?)(}})/g) || [];
        let myquickreply = item.quickreply
            .replace("{{numticket}}", ticketSelected?.ticketnum)
            .replace("{{client_name}}", ticketSelected?.displayname)
            .replace("{{agent_name}}", user?.firstname + " " + user?.lastname)
            .replace("{{user_group}}", ticketSelected?.usergroup)

        variablesList.forEach((x: any) => {
            const variableData = variablecontext?.[x.substring(2, x.length - 2)]
            if (variableData) {
                myquickreply = myquickreply.replaceAll(x, variableData)
            } else {
                myquickreply = myquickreply.replaceAll(x, "")
            }
        })
        setText(myquickreply)
    }

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div style={{ display: 'flex' }}>
                <Tooltip title={t(langKeys.send_quickreply)} arrow placement="top">
                    <QuickresponseIcon className={classes.iconResponse} onClick={handleClick} />
                </Tooltip>
                {open && (
                    <div style={{
                        position: 'absolute',
                        bottom: 60,
                        zIndex: 1201,
                    }}>
                        <div className={classes.containerQuickReply}>
                            <div>
                                {!showSearch ?
                                    <div className={classes.headerQuickReply}>
                                        <div >User Quick Response</div>
                                        <IconButton
                                            size="small"
                                            onClick={() => setShowSearch(true)} edge="end"
                                        >
                                            <SearchIcon />
                                        </IconButton>

                                    </div>
                                    :
                                    <TextField
                                        color="primary"
                                        fullWidth
                                        autoFocus
                                        placeholder="Search quickreplies"
                                        style={{ padding: '6px 6px 6px 12px' }}
                                        onBlur={() => !search && setShowSearch(false)}
                                        onChange={e => setSearch(e.target.value)}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton size="small">
                                                        <SearchIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                }
                            </div>
                            <Divider />
                            <List component="nav" disablePadding style={{ maxHeight: 200, width: '100%', overflowY: 'overlay' as any }}>
                                {quickRepliesToShow.map((item) => (
                                    <ListItem
                                        button
                                        key={item.quickreplyid}
                                        onClick={() => handlerClickItem(item)}
                                    >
                                        <Tooltip title={item.quickreply} arrow placement="top">
                                            <ListItemText primary={item.description} />
                                        </Tooltip>
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                    </div>
                )}
            </div>
        </ClickAwayListener>
    )
}

const TmpRichResponseIcon: React.FC<{ classes: ClassNameMap, setText: (param: string) => void }> = ({ classes, setText }) => {
    const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [richResponseToShow, setRichResponseToShow] = useState<Dictionary[]>([])
    const handleClick = () => setOpen((prev) => !prev);
    const [showSearch, setShowSearch] = useState(false);
    const [search, setSearch] = useState("");

    const agentSelected = useSelector(state => state.inbox.agentSelected);
    const userType = useSelector(state => state.inbox.userType);
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const richResponseList = useSelector(state => state.inbox.richResponseList.data);

    const handleClickAway = () => setOpen(false);

    useEffect(() => {
        setRichResponseToShow(richResponseList)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [richResponseList])

    useEffect(() => {
        if (search === "") {
            setRichResponseToShow(richResponseList)
        } else {
            setRichResponseToShow(richResponseList.filter(x => x.title.toLowerCase().includes(search.toLowerCase())))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search])

    const reasignTicket = React.useCallback(() => {
        dispatch(reassignTicket({
            ...ticketSelected!!,
            newUserId: 0,
            newUserGroup: '',
            observation: 'Reassigned from supervisor',
            newConversation: true,
            wasanswered: ticketSelected?.isAnswered || false
        }));
        dispatch(emitEvent({
            event: 'reassignTicket',
            data: {
                ...ticketSelected,
                userid: agentSelected?.userid,//CAMBIAR ESTO
                newuserid: 0,
            }
        }));
    }, [dispatch, ticketSelected, agentSelected])

    const handlerClickItem = (block: Dictionary) => {
        setOpen(false);
        const parameters = {
            fullid: `${block.chatblockid}_${block.blockid}`,
            p_communicationchannelid: ticketSelected?.communicationchannelid,
            p_conversationid: ticketSelected?.conversationid,
            p_personid: ticketSelected?.personid,
            p_communicationchanneltype: ticketSelected?.communicationchanneltype,
            p_personcommunicationchannel: ticketSelected?.personcommunicationchannel,
            p_messagesourcekey1: ticketSelected?.personcommunicationchannel,
            p_communicationchannelsite: ticketSelected?.communicationchannelsite,
            p_ticketnum: ticketSelected?.ticketnum,
        }
        dispatch(triggerBlock(parameters))

        if (userType === "SUPERVISOR")
            reasignTicket()
    }

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div style={{ display: 'flex' }}>
                <Tooltip title={t(langKeys.send_enrich_response)} arrow placement="top">
                    <RichResponseIcon className={classes.iconResponse} onClick={handleClick} style={{ width: 22, height: 22 }} />
                </Tooltip>
                {open && (
                    <div style={{
                        position: 'absolute',
                        bottom: 60,
                        zIndex: 1201,
                    }}>
                        <div className={classes.containerQuickReply}>
                            <div>
                                {!showSearch ?
                                    <div className={classes.headerQuickReply}>
                                        <div >User Rich Response</div>
                                        <IconButton
                                            size="small"
                                            onClick={() => setShowSearch(true)} edge="end"
                                        >
                                            <SearchIcon />
                                        </IconButton>

                                    </div>
                                    :
                                    <TextField
                                        color="primary"
                                        fullWidth
                                        autoFocus
                                        placeholder="Search quickreplies"
                                        style={{ padding: '6px 6px 6px 12px' }}
                                        onBlur={() => !search && setShowSearch(false)}
                                        onChange={e => setSearch(e.target.value)}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton size="small">
                                                        <SearchIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                }
                            </div>
                            <Divider />
                            <List component="nav" disablePadding style={{ maxHeight: 200, width: '100%', overflowY: 'overlay' as any }}>
                                {richResponseToShow.map((item) => (
                                    <ListItem
                                        button
                                        key={item.blockid}
                                        onClick={() => handlerClickItem(item)}
                                    >
                                        <ListItemText primary={item.blocktitle} />
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                    </div>
                )}
            </div>
        </ClickAwayListener>
    )
}

const SmallAvatar = styled(Avatar)(() => ({
    width: 22,
    backgroundColor: '#0ac630',
    height: 22,
    fontSize: 12,
}));


const BottomGoToUnder: React.FC = () => {
    const dispatch = useDispatch();
    const isOnBottom = useSelector(state => state.inbox.isOnBottom);
    const boolShowGoToBottom = useSelector(state => state.inbox.showGoToBottom);
    const triggerNewMessageClient = useSelector(state => state.inbox.triggerNewMessageClient);
    const [countNewMessage, setCountNewMessage] = useState(0)

    useEffect(() => {
        if (triggerNewMessageClient !== null) {
            if (isOnBottom || isOnBottom === null)
                dispatch(goToBottom(isOnBottom ? null : true))
            else
                setCountNewMessage(countNewMessage + 1)
        }
    }, [triggerNewMessageClient])


    useEffect(() => {
        if (isOnBottom) {
            dispatch(showGoToBottom(false));
            setCountNewMessage(0);
        }
    }, [isOnBottom])

    if (!boolShowGoToBottom || isOnBottom)
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
                    onClick={() => dispatch(goToBottom(isOnBottom ? null : true))}>
                    <DoubleArrowIcon style={{ color: '#2e2c34ba', transform: 'rotate(90deg)', width: 20, height: 20 }} />
                </Fab>
            </Badge>

        </div>
    )
}

const ReplyPanel: React.FC<{ classes: ClassNameMap }> = ({ classes }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const [copyEmails, setCopyEmails] = useState<Dictionary>({ cc: false, cco: false, error: false });

    const resReplyTicket = useSelector(state => state.inbox.triggerReplyTicket);
    const [triggerReply, settriggerReply] = useState(false);
    const [lastSelection, setLastSelection] = useState(0);

    const variablecontext = useSelector(state => state.inbox.person.data?.variablecontext);
    const agentSelected = useSelector(state => state.inbox.agentSelected);
    const user = useSelector(state => state.login.validateToken.user);
    const richResponseList = useSelector(state => state.inbox.richResponseList);
    const userType = useSelector(state => state.inbox.userType);
    const [text, setText] = useState("");
    const [previousTicket, setpreviousTicket] = useState<any>(null);
    const [files, setFiles] = useState<IFile[]>([]);
    const multiData = useSelector(state => state.main.multiData);
    const groupInteractionList = useSelector(state => state.inbox.interactionList);
    const [typeHotKey, setTypeHotKey] = useState("")
    const quickReplies = useSelector(state => state.inbox.quickreplies);
    const [emojiNoShow, setemojiNoShow] = useState<string[]>([])
    const [emojiFavorite, setemojiFavorite] = useState<string[]>([])
    const [inappropiatewordsList, setinnappropiatewordsList] = useState<Dictionary[]>([])
    // const [inappropiatewords, setinnappropiatewords] = useState<string[]>([])
    const [quickRepliesToShow, setquickRepliesToShow] = useState<Dictionary[]>([])
    const [richResponseToShow, setRichResponseToShow] = useState<Dictionary[]>([])
    const [showReply, setShowReply] = useState<boolean | null>(true);
    const [fileimage, setfileimage] = useState<any>(null);
    const [bodyobject, setBodyobject] = useState<Descendant[]>([{ "type": "paragraph", align: "left", "children": [{ "text": "" }] }])
    const lock_send_file_pc = useSelector(state => state.login.validateToken.user?.properties?.lock_send_file_pc);
    const [refresh, setrefresh] = useState(1)
    const [flagundo, setflagundo] = useState(false)
    const [flagredo, setflagredo] = useState(false)
    const [undotext, setundotext] = useState<any>([])
    const [redotext, setredotext] = useState<any>([])

    useEffect(() => {
        if ((ticketSelected?.conversationid) !== (previousTicket?.conversationid)) setpreviousTicket(ticketSelected)
        if (ticketSelected?.status !== "ASIGNADO") {
            setShowReply(false);
        }
        else if (`,${user?.roledesc},`.includes(",SUPERVISOR,") && user?.properties.environment === "CLARO" && [2, 3].includes(agentSelected?.userid ?? 0)) { //2 y 3 son BOT y HOLDING
            setShowReply(null);
        } else if (channelsWhatsapp.includes(ticketSelected.communicationchanneltype)) {
            if (!ticketSelected?.personlastreplydate) {
                setShowReply(false);
            } else {
                const hoursWaiting = getSecondsUntelNow(convertLocalDate(ticketSelected?.personlastreplydate)) / 3600;
                if (hoursWaiting >= 24) {
                    setShowReply(false);
                } else {
                    setShowReply(true);
                }
            }
        } else {
            setShowReply(true)
        }
    }, [ticketSelected])

    useEffect(() => {
        if (ticketSelected?.communicationchanneltype === "MAIL") {
            setBodyobject([{ "type": "paragraph", align: "left", "children": [{ "text": "" }] }])
            setText(renderToString(toElement([{ "type": "paragraph", align: "left", "children": [{ "text": "" }] }])))
            setrefresh(refresh * -1)
        } else {
            setText("")
            setBodyobject([{ "type": "paragraph", align: "left", "children": [{ "text": "" }] }])
        }
    }, [previousTicket])

    useEffect(() => {
        if (triggerReply) {
            if (!resReplyTicket.loading && resReplyTicket.error) {
                const errormessage = t(resReplyTicket.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                settriggerReply(false);
            }
        }
    }, [resReplyTicket, triggerReply])


    useEffect(() => {
        if (!flagundo) {
            if (!flagredo) {
                setredotext([])
            }
            setundotext([...undotext, (bodyobject)])
        }
        if (ticketSelected?.communicationchanneltype === "MAIL") {
            setText(renderToString(toElement(bodyobject)))
        }
    }, [bodyobject])

    useEffect(() => {
        if (flagundo) {
            setflagundo(false)
        }
    }, [undotext])

    useEffect(() => {
        if (flagredo) {
            setflagredo(false)
        }
    }, [redotext])

    const reasignTicket = React.useCallback(() => {
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
    }, [dispatch, ticketSelected, agentSelected])

    const triggerReplyMessage = () => {
        if (copyEmails.error) return
        const callback = () => {
            let wasSend = false;
            if (files.length > 0 && ticketSelected?.communicationchanneltype !== "MAIL") {
                const listMessages = files.map(x => ({
                    ...ticketSelected!!,
                    interactiontype: x.type,
                    validateUserOnTicket: userType === "AGENT",
                    interactiontext: x.url,
                }))
                wasSend = true;
                settriggerReply(true);
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
                        isAnswered: !(ticketSelected!!.isAnswered || i > 0), //solo enviar el cambio en el primer mensaje
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
                let textCleaned = text;
                if (ticketSelected?.communicationchanneltype === "MAIL" && groupInteractionList.data[0]?.interactiontext) {
                    textCleaned = ("Re: " + (groupInteractionList.data[0].interactiontext).split("&%MAIL%&")[0] + "&%MAIL%&" + text).trim();

                    const fileobj = files.reduce((acc, item, i) => ({ ...acc, [String(item.url.split('/').pop() === "tenor.gif" ? "tenor" + i + ".gif" : item.url.split('/').pop())]: item.url }), {})
                    textCleaned = textCleaned + "&%MAIL%&" + JSON.stringify(fileobj)
                    setFiles([])
                }

                const wordlist = textCleaned.split(" ").map(x => x.toLowerCase())

                const errormessage = inappropiatewordsList.find(x => wordlist.includes(x.description.toLowerCase()))?.defaultanswer || "";

                if (textCleaned) {
                    if (!errormessage) {
                        wasSend = true
                        const newInteractionSocket = {
                            ...ticketSelected!!,
                            interactionid: 0,
                            typemessage: ticketSelected?.communicationchanneltype === "MAIL" ? "email" : "text",
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
                        settriggerReply(true);
                        dispatch(replyTicket({
                            ...ticketSelected!!,
                            interactiontype: ticketSelected?.communicationchanneltype === "MAIL" ? "email" : "text",
                            interactiontext: textCleaned,
                            validateUserOnTicket: userType === "AGENT",
                            isAnswered: !ticketSelected!!.isAnswered,
                            emailcocopy: copyEmails.cco || "",
                            emailcopy: copyEmails.cc || ""
                        }));
                        setText("");
                        setrefresh(refresh * -1)
                        setBodyobject([{ "type": "paragraph", align: "left", "children": [{ "text": "" }] }]);

                    } else {
                        dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                    }
                }
            }

            if (wasSend && userType === "SUPERVISOR")
                reasignTicket()
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

    const [openDialogHotKey, setOpenDialogHotKey] = React.useState(false);
    const handleClickAway = () => setOpenDialogHotKey(false);

    useEffect(() => {
        if (!multiData.loading && !multiData.error && multiData?.data[4]) {
            setemojiNoShow(multiData?.data?.[10]?.data.filter(x => (x.restricted)).map(x => x.emojihex) || [])
            setemojiFavorite(multiData?.data?.[10]?.data.filter(x => (x.favorite)).map(x => x.emojihex) || [])
            setinnappropiatewordsList(multiData?.data?.[11]?.data || [])
            // setinnappropiatewords(multiData?.data[11].data.filter(x => (x.status === "ACTIVO")).map(y => (y.description)) || [])
        }
    }, [multiData])

    useEffect(() => {
        setquickRepliesToShow(quickReplies?.data?.filter(x => x.favorite) || [])
    }, [quickReplies])

    useEffect(() => {
        if (text.substring(0, 2).toLowerCase() === "\\q") {
            setTypeHotKey("quickreply")
            setOpenDialogHotKey(true);
            const textToSearch = text.trim().split(text.trim().includes("\\q") ? "\\q" : "\\Q")[1];
            if (textToSearch === "")
                setquickRepliesToShow(quickReplies.data.filter(x => x.favorite))
            else
                setquickRepliesToShow(quickReplies.data.filter(x => x.description.toLowerCase().includes(textToSearch.toLowerCase())))
        } else if (text.substring(0, 2).toLowerCase() === "\\r") {
            setTypeHotKey("richresponse")
            setOpenDialogHotKey(true);
            const textToSearch = text.trim().split(text.trim().includes("\\r") ? "\\r" : "\\R")[1];
            if (textToSearch === "")
                setRichResponseToShow(richResponseList.data)
            else
                setRichResponseToShow(richResponseList.data.filter(x => x.title.toLowerCase().includes(textToSearch.toLowerCase())))
        } else {
            setOpenDialogHotKey(false);
        }
    }, [text])

    const selectQuickReply = (value: string) => {
        const variablesList = value.match(/({{)(.*?)(}})/g) || [];
        let myquickreply = value
            .replace("{{numticket}}", `${ticketSelected?.ticketnum}`)
            .replace("{{client_name}}", `${ticketSelected?.displayname}`)
            .replace("{{agent_name}}", user?.firstname + " " + user?.lastname)
            .replace("{{user_group}}", ticketSelected?.usergroup || "")

        variablesList.forEach((x: any) => {
            let variableData = variablecontext?.[x.substring(2, x.length - 2)]
            if (!!variableData) {
                myquickreply = myquickreply.replaceAll(x, variableData.Value)
            } else {
                myquickreply = myquickreply.replaceAll(x, "")
            }
        })

        setText(myquickreply)
    }

    const selectRichResponse = (block: Dictionary) => {
        const callback = () => {
            const listInteractions = cleanedRichResponse(block.cards, variablecontext)

            if (listInteractions.length === 0) {
                dispatch(showSnackbar({ show: true, severity: "error", message: 'No hay cards' }))
                return;
            }
            settriggerReply(true);
            dispatch(replyTicket(listInteractions.map(x => ({
                ...ticketSelected!!,
                interactiontype: x.type,
                interactiontext: x.content,
                validateUserOnTicket: userType === "AGENT",
            })), true));

            listInteractions.forEach((x: Dictionary, i: number) => {
                const newInteractionSocket = {
                    ...ticketSelected!!,
                    interactionid: 0,
                    typemessage: x.type,
                    typeinteraction: null,
                    lastmessage: x.content,
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

            if (userType === "SUPERVISOR")
                reasignTicket()

            setText("");
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

    const handleSelectionChange = (event: any) => {
        setLastSelection(event?.target?.selectionEnd ?? 0);
    }

    function onPasteTextbar(e: any) {
        if (e.clipboardData.files.length) {
            e.preventDefault()
            if (e.clipboardData.files[0].type.includes("image")) {
                setfileimage(e.clipboardData.files)
            }
        }
    }

    if (ticketSelected?.communicationchanneltype === "MAIL") {
        return (<div className={classes.containerResponse}>
            {showReply ?
                <div>
                    {files.length > 0 &&
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', borderBottom: '1px solid #EBEAED', paddingBottom: 8 }}>
                            {files.map((item: IFile) => <ItemFile key={item.id} item={item} setFiles={setFiles} />)}
                        </div>
                    }
                    <div style={{ alignItems: "center" }}>
                        <ClickAwayListener onClickAway={handleClickAway}>
                            <div>
                                <MailRecipients setCopyEmails={setCopyEmails} />
                                <RichText
                                    style={{ width: "100%" }}
                                    value={bodyobject}
                                    onChange={setBodyobject}
                                    positionEditable="top"
                                    spellCheck
                                    onKeyPress={handleKeyPress}
                                    quickReplies={quickReplies.data}
                                    refresh={refresh}
                                    placeholder="Send your message..."
                                    emojiNoShow={emojiNoShow}
                                    emoji={true}
                                    emojiFavorite={emojiFavorite}
                                    setFiles={setFiles}
                                    collapsed={true}
                                    endinput={
                                        <div style={{ display: 'block' }}>
                                            <div style={{ marginLeft: "auto", marginRight: 0 }} className={clsx(classes.iconSend, { [classes.iconSendDisabled]: !(renderToString(toElement(bodyobject)) !== `<div data-reactroot=""><p><span></span></p></div>` || files.filter(x => x.url).length > 0) })} onClick={triggerReplyMessage}>
                                                <SendIcon />
                                            </div>
                                        </div>
                                    }
                                >
                                    <GifPickerZyx onSelect={(url: string) => setFiles(p => [...p, { type: 'image', url, id: new Date().toISOString() }])} />
                                    <UploaderIcon classes={classes} setFiles={setFiles}
                                    />
                                </RichText>
                                {openDialogHotKey && (
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 100,
                                        left: 15,
                                        zIndex: 1201
                                    }}>
                                        <div className="scroll-style-go" style={{
                                            maxHeight: 200,
                                            display: 'flex',
                                            gap: 4,
                                            flexDirection: 'column',
                                        }}>
                                            {typeHotKey === "quickreply" ?
                                                quickRepliesToShow.map((item) => (
                                                    <div
                                                        key={item.quickreplyid}
                                                        className={classes.hotKeyQuickReply}
                                                        onClick={() => selectQuickReply(item.quickreply)}
                                                    >
                                                        {item.description}
                                                    </div>

                                                )) :
                                                richResponseToShow.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className={classes.hotKeyQuickReply}
                                                        onClick={() => selectRichResponse(item)}
                                                    >
                                                        {item.title}
                                                    </div>

                                                ))
                                            }
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ClickAwayListener>

                    </div>
                </div>
                :
                <div style={{ whiteSpace: 'break-spaces', color: 'rgb(251, 95, 95)', fontWeight: 500, textAlign: 'center' }}>
                    {showReply == null ? t(langKeys.no_reply_claro) : t(langKeys.no_reply_use_hsm)}
                </div>
            }
            <BottomGoToUnder />
        </div >)
    } else return (
        <>
            {showReply && (
                <DragDropFile setFiles={setFiles} disabled={lock_send_file_pc}>
                    <div className={classes.containerResponse}>
                        {files.length > 0 &&
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', borderBottom: '1px solid #EBEAED', paddingBottom: 8 }}>
                                {files.map((item: IFile) => <ItemFile key={item.id} item={item} setFiles={setFiles} />)}
                            </div>
                        }
                        <ClickAwayListener onClickAway={handleClickAway}>
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
                                    onPaste={onPasteTextbar}
                                    onSelect={handleSelectionChange}
                                />
                                {openDialogHotKey && (
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 100,
                                        left: 15,
                                        zIndex: 1201
                                    }}>
                                        <div className="scroll-style-go" style={{
                                            maxHeight: 200,
                                            display: 'flex',
                                            gap: 4,
                                            flexDirection: 'column',
                                        }}>
                                            {typeHotKey === "quickreply" ?
                                                quickRepliesToShow.map((item) => (
                                                    <div
                                                        key={item.quickreplyid}
                                                        className={classes.hotKeyQuickReply}
                                                        onClick={() => selectQuickReply(item.quickreply)}
                                                    >
                                                        {item.description}
                                                    </div>

                                                )) :
                                                richResponseToShow.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className={classes.hotKeyQuickReply}
                                                        onClick={() => selectRichResponse(item)}
                                                    >
                                                        {item.title}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ClickAwayListener>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                                <QuickReplyIcon classes={classes} setText={setText} />
                                <TmpRichResponseIcon classes={classes} setText={setText} />
                                <UploaderIcon classes={classes} setFiles={setFiles} />
                                <GifPickerZyx onSelect={(url: string) => setFiles(p => [...p, { type: 'image', url, id: new Date().toISOString() }])} />
                                <EmojiPickerZyx emojisIndexed={EMOJISINDEXED} onSelect={e => { (lastSelection < (text || '').length - 1) ? setText(p => p.substring(0, lastSelection) + e.native + p.substring(lastSelection)) : setText(p => p + e.native) }} emojisNoShow={emojiNoShow} emojiFavorite={emojiFavorite} />
                            </div>
                            <div className={clsx(classes.iconSend, { [classes.iconSendDisabled]: !(text || files.filter(x => !!x.url).length > 0) })} onClick={triggerReplyMessage}>
                                <SendIcon />
                            </div>
                        </div>
                        <BottomGoToUnder />
                    </div>
                </DragDropFile>
            )}
            {!showReply && (
                <div className={classes.containerResponse}>
                    <div style={{ whiteSpace: 'break-spaces', color: 'rgb(251, 95, 95)', fontWeight: 500, textAlign: 'center' }}>
                        {showReply == null ? t(langKeys.no_reply_claro) : t(langKeys.no_reply_use_hsm)}
                    </div>
                    <BottomGoToUnder />
                </div>
            )}
        </ >
    )
}

export default ReplyPanel;