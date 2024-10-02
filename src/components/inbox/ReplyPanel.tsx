import React, { useState, useEffect, useRef } from "react";
// import "emoji-mart/css/emoji-mart.css";
import InputAdornment from "@material-ui/core/InputAdornment";
import { QuickresponseIcon, SendIcon, SearchIcon, RecordIcon, RecordingIcon, CopilotIconEng, CopilotIconEsp, SendToBlockIcon, BoldNIcon, ItalicKIcon, UnderlineSIcon, StrikethroughLineIcon, CodeSnippetIcon } from "icons";
import { makeStyles, styled } from "@material-ui/core/styles";
import { useSelector } from "hooks";
import { Dictionary, IFile, ILibrary } from "@types";
import { useDispatch } from "react-redux";
import { emitEvent, replyTicket, goToBottom, showGoToBottom, reassignTicket, triggerBlock, updateInteractionByUUID, getInnapropiateWordTicketLst, resetInnapropiateWordTicketLst } from "store/inbox/actions";
import { uploadFile, resetUploadFile } from "store/main/actions";
import { manageConfirmation, showSnackbar } from "store/popus/actions";
import InputBase from "@material-ui/core/InputBase";
import clsx from "clsx";
import { DialogZyx, EmojiPickerZyx, FieldSelect, GifPickerZyx, SearchField } from "components";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import { convertLocalDate, getSecondsUntelNow, uuidv4 } from "common/helpers/functions";
import { Descendant } from "slate";
import { RichText, renderToString, toElement } from "components/fields/RichText";
import { emojis } from "common/constants/emojis";
import DragDropFile from "components/fields/DragDropFile";
import MailRecipients from "./MailRecipients";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import DeleteIcon from "@material-ui/icons/Delete";
import { ListItemIcon } from "@material-ui/core";
import { LibraryBooks, Publish } from "@material-ui/icons";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import { DocIcon, FileIcon1 as FileIcon, PdfIcon, PptIcon, TxtIcon, XlsIcon, ZipIcon } from "icons";
import StarRateIcon from "@material-ui/icons/StarRate";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import StopIcon from "@material-ui/icons/Stop";
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import StrikethroughSIcon from '@material-ui/icons/StrikethroughS';
import { formatTextToUnicode, removeUnicodeStyle } from "common/helpers";

const useStylesInteraction = makeStyles(() => ({
    textFileLibrary: {
        padding: "0px .5rem",
        width: 80,
        wordBreak: "break-word",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        textAlign: "center",
    },
    containerFiles: {
        display: "flex",
        gap: "1rem",
        flexWrap: "wrap",
        marginTop: 16,
        maxHeight: 300,
        overflowY: "auto",
    },
    containerFileLibrary: {
        cursor: "pointer",
        "&:hover": {
            backgroundColor: "rgb(235, 234, 237, 0.18)",
        },
    },
    inputPlaceholder: {
        padding: "2rem",
        paddingRight: "1rem",
        "&::placeholder": {
            fontSize: "1rem",
            fontWeight: 500,
            color: "#84818A",
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
    const libraryList = useSelector((state) => state.inbox.libraryList);
    const [categoryList, setCategoryList] = useState<Dictionary[]>([]);
    const [categoryFilter, setCategoryFilter] = useState("");
    const [generalFilter, setGeneralFilter] = useState("");
    const [libraryToShow, setLibraryToShow] = useState<ILibrary[]>([]);

    const onSelectFile = (file: ILibrary) => {
        const iid = new Date().toISOString();
        setFiles((x: IFile[]) => [...x, { id: iid, url: file.link, type: file.type }]);
        setOpenModal(false);
    };

    useEffect(() => {
        if (openModal) {
            setCategoryList(
                Array.from(new Set(libraryList.map((x) => x.category)))
                    .filter((x) => x)
                    .map((x) => ({ option: x }))
            );
            setLibraryToShow(libraryList);
        }
    }, [openModal]);

    const applyFilter = (value: string) => {
        setGeneralFilter(value ?? "");
        if (value) {
            setLibraryToShow(
                libraryList.filter((x) => x.category === categoryFilter || categoryFilter === "").filter((x) => (x.title.toLocaleLowerCase()).includes(value.toLocaleLowerCase()))
            );
        } else {
            setLibraryToShow(libraryList.filter((x) => x.category === categoryFilter || categoryFilter === ""));
        }
    };

    const applyFilterCategory = (value: string | undefined) => {
        setCategoryFilter(value ?? "");
        if (value) {
            setLibraryToShow(
                libraryList.filter((x) => x.category === value).filter((x) => x.title.includes(generalFilter))
            );
        } else {
            setLibraryToShow(libraryList.filter((x) => x.title.includes(generalFilter)));
        }
    };

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.documentlibrary)}
            buttonText1={t(langKeys.cancel)}
            handleClickButton1={() => setOpenModal(false)}
            button2Type="submit"
        >
            <div>
                <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ width: 200 }}>
                        <FieldSelect
                            label={t(langKeys.category)}
                            className="col-4"
                            valueDefault={categoryFilter}
                            onChange={(value) => applyFilterCategory(value?.option)}
                            data={categoryList}
                            variant="outlined"
                            optionDesc="option"
                            optionValue="option"
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <SearchField
                            style={{ fontSize: "1rem" }}
                            colorPlaceHolder="#FFF"
                            inputProps={{ className: classes.inputPlaceholder }}
                            handleChangeOther={applyFilter}
                            lazy
                        />
                    </div>
                </div>
                {libraryList.some((x) => x.favorite) && (
                    <>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 16, marginLeft: 4 }}>
                            <StarRateIcon fontSize="small" color="primary" />
                            <div style={{ fontWeight: 500, fontSize: 16, color: "#7721AD" }}>
                                {t(langKeys.favorites)}
                            </div>
                        </div>
                        <div className={classes.containerFiles}>
                            {libraryToShow.map((x) => {
                                if (!x.favorite) {
                                    return null;
                                }
                                const extension = x.link.split(".").pop();

                                return (
                                    <div
                                        key={x.documentlibraryid}
                                        className={classes.containerFileLibrary}
                                        onClick={() => onSelectFile(x)}
                                    >
                                        {x.type === "image" ? (
                                            <div style={{ padding: 10, width: "80px", height: "80px" }}>
                                                <img
                                                    style={{ objectFit: "cover" }}
                                                    src={x.link}
                                                    width={"100%"}
                                                    height={"100%"}
                                                />
                                            </div>
                                        ) : extension === "pdf" ? (
                                            <PdfIcon width="80" height="80" />
                                        ) : extension === "doc" || extension === "docx" ? (
                                            <DocIcon width="80" height="80" />
                                        ) : ["xls", "xlsx", "csv"].includes(`${extension}`) ? (
                                            <XlsIcon width="80" height="80" />
                                        ) : extension === "ppt" || extension === "pptx" ? (
                                            <PptIcon width="80" height="80" />
                                        ) : extension === "text" || extension === "txt" ? (
                                            <TxtIcon width="80" height="80" />
                                        ) : extension === "zip" || extension === "rar" ? (
                                            <ZipIcon width="80" height="80" />
                                        ) : (
                                            <FileIcon width="80" height="80" />
                                        )}
                                        <div className={classes.textFileLibrary}>{x.title}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
                <div style={{ marginTop: 24, marginLeft: 4, fontWeight: 500, fontSize: 16, color: "#7721AD" }}>
                    {t(langKeys.others)}
                </div>
                <div className={classes.containerFiles}>
                    {libraryToShow.map((x) => {
                        const extension = x.link.split(".").pop();
                        if (x.favorite) {
                            return null;
                        }
                        return (
                            <div
                                key={x.documentlibraryid}
                                className={classes.containerFileLibrary}
                                onClick={() => onSelectFile(x)}
                            >
                                {x.type === "image" ? (
                                    <div style={{ padding: 10, width: "80px", height: "80px" }}>
                                        <img
                                            style={{ objectFit: "cover" }}
                                            src={x.link}
                                            width={"100%"}
                                            height={"100%"}
                                        />
                                    </div>
                                ) : extension === "pdf" ? (
                                    <PdfIcon width="80" height="80" />
                                ) : extension === "doc" || extension === "docx" ? (
                                    <DocIcon width="80" height="80" />
                                ) : ["xls", "xlsx", "csv"].includes(`${extension}`) ? (
                                    <XlsIcon width="80" height="80" />
                                ) : extension === "ppt" || extension === "pptx" ? (
                                    <PptIcon width="80" height="80" />
                                ) : extension === "text" || extension === "txt" ? (
                                    <TxtIcon width="80" height="80" />
                                ) : extension === "zip" || extension === "rar" ? (
                                    <ZipIcon width="80" height="80" />
                                ) : (
                                    <FileIcon width="80" height="80" />
                                )}
                                <div className={classes.textFileLibrary}>{x.title}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </DialogZyx>
    );
};

const UploaderIcon: React.FC<{
    classes: ClassNameMap;
    setFiles: (param: any) => void;
    initfile?: any;
    setfileimage?: (param: any) => void;
}> = ({ classes, setFiles, initfile, setfileimage }) => {
    const { t } = useTranslation();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [valuefile, setvaluefile] = useState("");
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const uploadResult = useSelector((state) => state.main.uploadFile);
    const lock_send_file_pc = useSelector((state) => state.login.validateToken.user?.properties?.lock_send_file_pc);

    const [openModal, setOpenModal] = useState(false);
    const [idUpload, setIdUpload] = useState("");

    useEffect(() => {
        if (initfile) {
            onSelectImage(initfile);
            if (setfileimage) {
                setfileimage(null);
            }
        }
    }, [initfile]);

    useEffect(() => {
        if (waitSave) {
            if (!uploadResult.loading && !uploadResult.error) {
                setFiles((x: IFile[]) =>
                    x.map((item) => (item.id === idUpload ? { ...item, url: uploadResult.url } : item))
                );
                setWaitSave(false);
                dispatch(resetUploadFile());
            } else if (uploadResult.error) {
                // const errormessage = uploadResult.code || "error_unexpected_error"
                setFiles((x: IFile[]) =>
                    x.map((item) => (item.id === idUpload ? { ...item, url: uploadResult.url, error: true } : item))
                );
                // dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
            }
        }
    }, [waitSave, uploadResult, dispatch, setFiles, idUpload]);

    const onSelectImage = (files: any) => {
        const selectedFile = files[0];
        const idd = new Date().toISOString();
        const fd = new FormData();
        fd.append("file", selectedFile, selectedFile.name);
        setvaluefile("");
        setIdUpload(idd);
        const type = selectedFile.type.match("image.*") ? "image" : "file";
        setFiles((x: IFile[]) => [...x, { id: idd, url: "", type }]);
        dispatch(uploadFile(fd));
        setWaitSave(true);
    };

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
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                {!lock_send_file_pc && (
                    <label htmlFor={`laraigo-upload-file-x`}>
                        <MenuItem
                            onClick={() => {
                                setAnchorEl(null);
                            }}
                        >
                            <ListItemIcon>
                                <Publish width={18} style={{ fill: "#2E2C34" }} />
                            </ListItemIcon>
                            {"Subir archivos desde el ordenador"}
                        </MenuItem>
                    </label>
                )}
                <MenuItem
                    onClick={() => {
                        setAnchorEl(null);
                        setOpenModal(true);
                    }}
                >
                    <ListItemIcon>
                        <LibraryBooks width={18} style={{ fill: "#2E2C34" }} />
                    </ListItemIcon>
                    {"Elegir desde la biblioteca de archivos"}
                </MenuItem>
            </Menu>
            <DialogSearchLibrary openModal={openModal} setOpenModal={setOpenModal} setFiles={setFiles} />
        </>
    );
};

const ItemFile: React.FC<{ item: IFile; setFiles: (param: any) => void }> = ({ item, setFiles }) => {
    const extension = item.url.split(".").pop();

    return (
        <div style={{ position: "relative" }}>
            <div
                key={item.id}
                style={{
                    width: 70,
                    height: 70,
                    border: "1px solid #e1e1e1",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {item.url ? (
                    item.type === "image" ? (
                        <img alt="loaded" src={item.url} style={{ objectFit: "cover", width: "100%", maxHeight: 70 }} />
                    ) : extension === "pdf" ? (
                        <PdfIcon width="70" height="70" />
                    ) : extension === "doc" || extension === "docx" ? (
                        <DocIcon width="70" height="70" />
                    ) : ["xls", "xlsx", "csv"].includes(`${extension}`) ? (
                        <XlsIcon width="70" height="70" />
                    ) : extension === "ppt" || extension === "pptx" ? (
                        <PptIcon width="70" height="70" />
                    ) : extension === "text" || extension === "txt" ? (
                        <TxtIcon width="70" height="70" />
                    ) : extension === "zip" || extension === "rar" ? (
                        <ZipIcon width="70" height="70" />
                    ) : (
                        <FileIcon width="70" height="70" />
                    )
                ) : (
                    <CircularProgress color="inherit" />
                )}
            </div>
            <IconButton
                onClick={() => setFiles((x: IFile[]) => x.filter((y) => y.id !== item.id))}
                size="small"
                style={{ position: "absolute", top: -16, right: -14 }}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </div>
    );
};

const QuickReplyIcon: React.FC<{ classes: ClassNameMap; setText: (param: string) => void }> = ({
    classes,
    setText,
}) => {
    const [open, setOpen] = React.useState(false);
    const quickReplies = useSelector((state) => state.inbox.quickreplies);
    const [quickRepliesToShow, setquickRepliesToShow] = useState<Dictionary[]>([]);
    const handleClick = () => setOpen((prev) => !prev);
    const [showSearch, setShowSearch] = useState(false);
    const [search, setSearch] = useState("");
    const { t } = useTranslation();
    const ticketSelected = useSelector((state) => state.inbox.ticketSelected);
    const user = useSelector((state) => state.login.validateToken.user);
    const variablecontext = useSelector((state) => state.inbox.person.data?.variablecontext);

    const handleClickAway = () => setOpen(false);

    useEffect(() => {
        const ismail = ticketSelected?.communicationchanneltype === "MAIL"
        const favoritequickreplies = quickReplies.data.filter(x=> !!x.favorite)        

        setquickRepliesToShow(ismail? favoritequickreplies.filter(x=>x.quickreply_type === "CORREO ELECTRONICO") : favoritequickreplies.filter(x=>x.quickreply_type !== "CORREO ELECTRONICO") || []);
    }, [quickReplies, ticketSelected]);

    useEffect(() => {
        const ismail = ticketSelected?.communicationchanneltype === "MAIL"
        const quickreplyFiltered = ismail? quickReplies.data.filter(x=>x.quickreply_type === "CORREO ELECTRONICO") : quickReplies.data.filter(x=>x.quickreply_type !== "CORREO ELECTRONICO") || []
        if (search === "") {
            setquickRepliesToShow(quickreplyFiltered.filter((x) => !!x.favorite));
        } else {
            setquickRepliesToShow(
                quickreplyFiltered.filter((x) => x.description.toLowerCase().includes(search.toLowerCase()))
            );
        }
    }, [search, quickReplies]);

    const handlerClickItem = (item: Dictionary) => {
        setOpen(false);
        const variablesList = item.quickreply.match(/({{)(.*?)(}})/g) || [];
        let myquickreply = item.quickreply
            .replace("{{numticket}}", ticketSelected?.ticketnum)
            .replace("{{client_name}}", ticketSelected?.displayname)
            .replace("{{agent_name}}", user?.firstname + " " + user?.lastname)
            .replace("{{user_group}}", ticketSelected?.usergroup);

        variablesList.forEach((x: any) => {
            const variableData = variablecontext?.[x.substring(2, x.length - 2)];
            if (variableData) {
                myquickreply = myquickreply.replaceAll(x, variableData);
            } else {
                myquickreply = myquickreply.replaceAll(x, "");
            }
        });
        setText(myquickreply);
    };

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div style={{ display: "flex"}}>
                <Tooltip title={t(langKeys.send_quickreply)} arrow placement="top">
                    <QuickresponseIcon className={classes.iconResponse} onClick={handleClick} />
                </Tooltip>
                {open && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: 60,
                            zIndex: 1201,
                        }}
                    >
                        <div className={classes.containerQuickReply2}>
                            <div>
                                {!showSearch ? (
                                    <div className={classes.headerQuickReply}>
                                        <div>User Quick Response</div>
                                        <IconButton size="small" onClick={() => setShowSearch(true)} edge="end">
                                            <SearchIcon />
                                        </IconButton>
                                    </div>
                                ) : (
                                    <TextField
                                        color="primary"
                                        fullWidth
                                        autoFocus
                                        placeholder="Search quickreplies"
                                        style={{ padding: "6px 6px 6px 12px" }}
                                        onBlur={() => !search && setShowSearch(false)}
                                        onChange={(e) => setSearch(e.target.value)}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton size="small">
                                                        <SearchIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            </div>
                            <Divider />
                            <List
                                component="nav"
                                disablePadding
                                style={{ maxHeight: 200, width: "100%", overflowY: "overlay" as any }}
                            >
                                {quickRepliesToShow.map((item) => (
                                    <ListItem button key={item.quickreplyid} onClick={() => handlerClickItem(item)}>
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
    );
};

const RecordComponent: React.FC<{
    record: IFile | null;
    setRecord: (param: IFile | null) => void;
    startRecording: boolean;
    setStartRecording: (param: boolean) => void;
}> = ({ startRecording, setStartRecording, record, setRecord }) => {
    const [uploadAudio, setUploadAudio] = useState(false);
    const [eraseAudio, setEraseAudio] = useState(false);
    const [previousRecord, setPreviousRecord] = useState(false);
    const dispatch = useDispatch();
    const ticketSelected = useSelector((state) => state.inbox.ticketSelected);
    const uploadResult = useSelector((state) => state.main.uploadFile);
    const recorderControls = useAudioRecorder(
        {
            noiseSuppression: true,
            echoCancellation: true,
        },
        (err) => console.table(err) // onNotAllowedOrFound
    );

    useEffect(() => {
        if (startRecording) {
            setRecord(null);
            recorderControls.startRecording();
        }
    }, [startRecording]);

    useEffect(() => {
        if (recorderControls.isRecording) {
            if (recorderControls.isRecording) {
                const myElement = document.querySelector(".audio-recorder");
                const childNodes = myElement?.childNodes;
                if (childNodes) {
                    if (childNodes[0]) childNodes[0].style.display = "none";
                    if (childNodes[3]) childNodes[3].style.display = "none";
                    if (childNodes[4]) childNodes[4].style.display = "none";
                }
            }
        }
    }, [recorderControls.isRecording]);

    useEffect(() => {
        if (uploadAudio) {
            if (!uploadResult.loading && !uploadResult.error) {
                setUploadAudio(false);
                setRecord({
                    id: "audio",
                    type: "audio",
                    url: uploadResult?.url || "",
                });
                setStartRecording(false);
            }
        }
    }, [uploadAudio, uploadResult]);

    useEffect(() => {
        if (previousRecord) {
            uploadAudioBlob(recorderControls.recordingBlob);
        }
    }, [recorderControls.recordingBlob]);

    function uploadAudioBlob(blob: any) {
        const fd = new FormData();
        const reader = new FileReader();
        reader.readAsArrayBuffer(blob);
        reader.onload = () => {
            const audioBlob = new Blob([blob], { type: "audio/mp3" });
            const currentDate = new Date();
            const timestamp = `${currentDate.getFullYear()}-${("0" + (currentDate.getMonth() + 1)).slice(-2)}-${(
                "0" + currentDate.getDate()
            ).slice(-2)}_${("0" + currentDate.getHours()).slice(-2)}-${("0" + currentDate.getMinutes()).slice(-2)}-${(
                "0" + currentDate.getSeconds()
            ).slice(-2)}`;
            fd.append("file", audioBlob, `audio_${ticketSelected?.ticketnum || ""}_${timestamp}.mp3`);
            fd.append("convert", true);
            dispatch(uploadFile(fd));
            recorderControls.stopRecording();
            setUploadAudio(true);
        };
    }

    const saveAudio = (blob: any) => {
        if (eraseAudio) {
            setEraseAudio(false);
            setStartRecording(false);
        } else {
            if (!previousRecord) {
                setPreviousRecord(true);
                uploadAudioBlob(blob);
            }
        }
    };

    if (uploadResult.loading) {
        return <CircularProgress color="inherit" />;
    }
    if (!record) {
        return (
            <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                <div
                    style={{
                        display: "flex",
                        backgroundColor: "#ebebeb",
                        borderRadius: 20,
                        boxShadow: "0 2px 5px #bebebe",
                    }}
                >
                    {recorderControls.isPaused ? (
                        <IconButton
                            onClick={() => {
                                recorderControls.togglePauseResume();
                            }}
                        >
                            <PlayArrowIcon />
                        </IconButton>
                    ) : (
                        <IconButton
                            onClick={() => {
                                recorderControls.togglePauseResume();
                            }}
                        >
                            <PauseIcon />
                        </IconButton>
                    )}
                    <AudioRecorder
                        onRecordingComplete={(blob) => saveAudio(blob)}
                        audioTrackConstraints={{
                            noiseSuppression: true,
                            echoCancellation: true,
                        }}
                        onNotAllowedOrFound={(err) => console.table(err)}
                        recorderControls={recorderControls}
                        downloadFileExtension="webm"
                        showVisualizer={true}
                        mediaRecorderOptions={{
                            audioBitsPerSecond: 128000,
                        }}
                    />
                    <IconButton
                        onClick={() => {
                            recorderControls.stopRecording();
                        }}
                    >
                        <StopIcon />
                    </IconButton>
                </div>
                <IconButton
                    onClick={() => {
                        setEraseAudio(true);
                        recorderControls.stopRecording();
                    }}
                >
                    <DeleteIcon />
                </IconButton>
            </div>
        );
    }
    return (
        <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
            <audio controls>
                <source src={record?.url} type="audio/mp3" />
            </audio>
            <IconButton
                onClick={() => {
                    setRecord(null);
                }}
            >
                <DeleteIcon />
            </IconButton>
        </div>
    );
};

const RecordAudioIcon: React.FC<{
    classes: ClassNameMap;
    startRecording: boolean;
    setStartRecording: (param: boolean) => void;
    setRecord: (param: IFile | null) => void;
}> = ({ classes, startRecording, setStartRecording, setRecord }) => {
    const { t } = useTranslation();
    const handleClick = () => {
        setStartRecording(!startRecording);
    };

    return (
        <div style={{ display: "flex" }}>
            <Tooltip title={t(langKeys.record_audio)} arrow placement="top">
                {startRecording ? (
                    <RecordingIcon
                        className={classes.iconResponse}
                        onClick={handleClick}
                        style={{ width: 22, height: 22 }}
                    />
                ) : (
                    <RecordIcon
                        className={classes.iconResponse}
                        onClick={handleClick}
                        style={{ width: 28, height: 28 }}
                    />
                )}
            </Tooltip>
        </div>
    );
};

const CopilotLaraigoIcon: React.FC<{
    classes: ClassNameMap;
    enabled: boolean
}> = ({ classes, enabled }) => {
    const { t } = useTranslation();

    //{t(langKeys.currentlanguage) === "en" ? <FormatBoldIcon className={classes.root} /> : <BoldNIcon className={classes.root} style={{ width: 18, height: 18 }} />}
    return (
        <div style={{ display: "flex" }}>
            <Tooltip title={"Copilot Laraigo"} arrow placement="top">
                <IconButton size="small" disabled={!enabled}
                >
                    {t(langKeys.currentlanguage) === "en" ?
                        <CopilotIconEng
                            className={enabled ? classes.iconResponse : ""}
                            style={{ width: 22, height: 22}}
                        /> :
                        <CopilotIconEsp
                            className={enabled ? classes.iconResponse : ""}
                            style={{ width: 22, height: 22}}
                        />
                    }
                </IconButton>
            </Tooltip>
        </div>
    );
};

const TmpRichResponseIcon: React.FC<{ classes: ClassNameMap; setText: (param: string) => void }> = ({
    classes,
    setText,
}) => {
    const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [richResponseToShow, setRichResponseToShow] = useState<Dictionary[]>([]);
    const handleClick = () => setOpen((prev) => !prev);
    const [showSearch, setShowSearch] = useState(false);
    const [search, setSearch] = useState("");

    const agentSelected = useSelector((state) => state.inbox.agentSelected);
    const userType = useSelector((state) => state.inbox.userType);
    const ticketSelected = useSelector((state) => state.inbox.ticketSelected);
    const richResponseList = useSelector((state) => state.inbox.richResponseList.data);

    const handleClickAway = () => setOpen(false);

    useEffect(() => {
        setRichResponseToShow(richResponseList);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [richResponseList]);

    useEffect(() => {
        if (search === "") {
            setRichResponseToShow(richResponseList);
        } else {
            setRichResponseToShow(richResponseList.filter((x) => x.title.toLowerCase().includes(search.toLowerCase())));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const reasignTicket = React.useCallback(() => {
        dispatch(
            reassignTicket({
                ...ticketSelected!!,
                newUserId: 0,
                newUserGroup: "",
                observation: "Reassigned from supervisor",
                newConversation: true,
                wasanswered: ticketSelected?.isAnswered || false,
            })
        );
        dispatch(
            emitEvent({
                event: "reassignTicket",
                data: {
                    ...ticketSelected,
                    userid: agentSelected?.userid, //CAMBIAR ESTO
                    newuserid: 0,
                },
            })
        );
    }, [dispatch, ticketSelected, agentSelected]);

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
        };
        dispatch(triggerBlock(parameters));

        if (userType === "SUPERVISOR") reasignTicket();
    };

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div style={{ display: "flex" }}>
                <Tooltip title={t(langKeys.send_enrich_response)} arrow placement="top">
                    <SendToBlockIcon
                        className={classes.iconResponse}
                        onClick={handleClick}
                        style={{ width: 22, height: 22 }}
                    />
                </Tooltip>
                {open && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: 60,
                            zIndex: 1201,
                        }}
                    >
                        <div className={classes.containerQuickReply2}>
                            <div>
                                {!showSearch ? (
                                    <div className={classes.headerQuickReply}>
                                        <div>{t(langKeys.sentoblock)}</div>
                                        <IconButton size="small" onClick={() => setShowSearch(true)} edge="end">
                                            <SearchIcon />
                                        </IconButton>
                                    </div>
                                ) : (
                                    <TextField
                                        color="primary"
                                        fullWidth
                                        autoFocus
                                        placeholder="Search quickreplies"
                                        style={{ padding: "6px 6px 6px 12px" }}
                                        onBlur={() => !search && setShowSearch(false)}
                                        onChange={(e) => setSearch(e.target.value)}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton size="small">
                                                        <SearchIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            </div>
                            <Divider />
                            <List
                                component="nav"
                                disablePadding
                                style={{ maxHeight: 200, width: "100%", overflowY: "overlay" as any }}
                            >
                                {richResponseToShow.map((item) => (
                                    <ListItem button key={item.blockid} onClick={() => handlerClickItem(item)}>
                                        <ListItemText primary={item.blocktitle} />
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                    </div>
                )}
            </div>
        </ClickAwayListener>
    );
};

const SmallAvatar = styled(Avatar)(() => ({
    width: 22,
    backgroundColor: "#0ac630",
    height: 22,
    fontSize: 12,
}));

const BottomGoToUnder: React.FC = () => {
    const dispatch = useDispatch();
    const isOnBottom = useSelector((state) => state.inbox.isOnBottom);
    const boolShowGoToBottom = useSelector((state) => state.inbox.showGoToBottom);
    const triggerNewMessageClient = useSelector((state) => state.inbox.triggerNewMessageClient);
    const [countNewMessage, setCountNewMessage] = useState(0);

    useEffect(() => {
        if (triggerNewMessageClient !== null) {
            if (isOnBottom || isOnBottom === null) dispatch(goToBottom(isOnBottom ? null : true));
            else setCountNewMessage(countNewMessage + 1);
        }
    }, [triggerNewMessageClient]);

    useEffect(() => {
        if (isOnBottom) {
            dispatch(showGoToBottom(false));
            setCountNewMessage(0);
        }
    }, [isOnBottom]);

    if (!boolShowGoToBottom || isOnBottom) return null;

    return (
        <div style={{ position: "absolute", right: 20, top: -60 }}>
            <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                badgeContent={countNewMessage > 0 && <SmallAvatar>{countNewMessage}</SmallAvatar>}
            >
                <Fab size="small" onClick={() => dispatch(goToBottom(isOnBottom ? null : true))}>
                    <DoubleArrowIcon
                        style={{ color: "#2e2c34ba", transform: "rotate(90deg)", width: 20, height: 20 }}
                    />
                </Fab>
            </Badge>
        </div>
    );
};

const ReplyPanel: React.FC<{ classes: ClassNameMap }> = ({ classes }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const ticketSelected = useSelector((state) => state.inbox.ticketSelected);
    const listAllowRecords = ["FBDM", "FBMS", "WHA", "INDM", "INMS"];
    const [copyEmails, setCopyEmails] = useState<Dictionary>({ cc: false, cco: false, error: false });

    const resReplyTicket = useSelector((state) => state.inbox.triggerReplyTicket);
    const [triggerReply, settriggerReply] = useState(false);
    const [lastSelection, setLastSelection] = useState(0);

    const variablecontext = useSelector((state) => state.inbox.person.data?.variablecontext);
    const agentSelected = useSelector((state) => state.inbox.agentSelected);
    const user = useSelector((state) => state.login.validateToken.user);
    const richResponseList = useSelector((state) => state.inbox.richResponseList);
    const userType = useSelector((state) => state.inbox.userType);
    const [text, setText] = useState("");
    const [previousTicket, setpreviousTicket] = useState<any>(null);
    const [files, setFiles] = useState<IFile[]>([]);
    const [startRecording, setStartRecording] = useState(false);
    const [record, setRecord] = useState<IFile | null>(null);
    const multiData = useSelector((state) => state.main.multiData);
    const groupInteractionList = useSelector((state) => state.inbox.interactionList);
    const [typeHotKey, setTypeHotKey] = useState("");
    const quickReplies = useSelector((state) => state.inbox.quickreplies);
    const innapropiateWords = useSelector((state) => state.inbox.inappropriateWords);
    const [emojiNoShow, setemojiNoShow] = useState<string[]>([]);
    const [propertyCopilotLaraigo, setPropertyCopilotLaraigo] = useState(false);
    const [emojiFavorite, setemojiFavorite] = useState<string[]>([]);
    const [inappropiatewordsList, setinnappropiatewordsList] = useState<Dictionary[]>([]);
    // const [inappropiatewords, setinnappropiatewords] = useState<string[]>([])
    const [quickRepliesToShow, setquickRepliesToShow] = useState<Dictionary[]>([]);
    const [richResponseToShow, setRichResponseToShow] = useState<Dictionary[]>([]);
    const [showReply, setShowReply] = useState<boolean | null>(true);
    const [fileimage, setfileimage] = useState<any>(null);
    const [numRows, setNumRows] = useState(1.5);
    const [bodyobject, setBodyobject] = useState<Descendant[]>([
        { type: "paragraph", align: "left", children: [{ text: "" }] },
    ]);
    const allowRecording = listAllowRecords.some((record) => ticketSelected?.communicationchanneltype?.includes(record)) && user?.properties?.enable_send_audio;
    const lock_send_file_pc = useSelector((state) => state.login.validateToken.user?.properties?.lock_send_file_pc);
    const [refresh, setrefresh] = useState(1);
    const [flagundo, setflagundo] = useState(false);
    const [flagredo, setflagredo] = useState(false);
    const [undotext, setundotext] = useState<any>([]);
    const [redotext, setredotext] = useState<any>([]);
    const inputRef = useRef(null);


    useEffect(() => {
        dispatch(getInnapropiateWordTicketLst());

        return () => {
            dispatch(resetInnapropiateWordTicketLst());
        };
    }, [])

    useEffect(() => {
        if (ticketSelected?.conversationid !== previousTicket?.conversationid) setpreviousTicket(ticketSelected);
        if (ticketSelected?.status !== "ASIGNADO") {
            setShowReply(false);
        } else if (
            `,${user?.roledesc},`.includes(",SUPERVISOR,") &&
            user?.properties.environment === "CLARO" &&
            [2, 3].includes(agentSelected?.userid ?? 0)
        ) {
            //2 y 3 son BOT y HOLDING
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
            setShowReply(true);
        }
    }, [ticketSelected]);

    useEffect(() => {
        if (ticketSelected?.communicationchanneltype === "MAIL") {
            setBodyobject([{ type: "paragraph", align: "left", children: [{ text: "" }] }]);
            setText(renderToString(toElement([{ type: "paragraph", align: "left", children: [{ text: "" }] }])));
            setrefresh(refresh * -1);
        } else {
            setText("");
            setBodyobject([{ type: "paragraph", align: "left", children: [{ text: "" }] }]);
        }
    }, [previousTicket]);

    useEffect(() => {
        if (triggerReply) {
            if (!resReplyTicket.loading) {
                if (resReplyTicket.error) {
                    const errormessage = t(resReplyTicket.code || "error_unexpected_error", {
                        module: t(langKeys.user).toLocaleLowerCase(),
                    });
                    dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                    settriggerReply(false);
                } else {
                    dispatch(updateInteractionByUUID({ uuid: resReplyTicket.uuid || "", interactionid: resReplyTicket.interactionid || 0 }))
                }
            }
        }
    }, [resReplyTicket, triggerReply]);

    useEffect(() => {
        if (!flagundo) {
            if (!flagredo) {
                setredotext([]);
            }
            setundotext([...undotext, bodyobject]);
        }
        if (ticketSelected?.communicationchanneltype === "MAIL") {
            setText(renderToString(toElement(bodyobject)));
        }
    }, [bodyobject]);

    useEffect(() => {
        if (flagundo) {
            setflagundo(false);
        }
    }, [undotext]);

    useEffect(() => {
        if (flagredo) {
            setflagredo(false);
        }
    }, [redotext]);

    const reasignTicket = React.useCallback(() => {
        dispatch(
            reassignTicket({
                ...ticketSelected!!,
                newUserId: 0,
                newUserGroup: "",
                observation: "Reassigned from supervisor",
                newConversation: true,
                wasanswered: true,
            })
        );
        dispatch(
            emitEvent({
                event: "reassignTicket",
                data: {
                    ...ticketSelected,
                    userid: agentSelected?.userid,
                    newuserid: 0,
                },
            })
        );
    }, [dispatch, ticketSelected, agentSelected]);

    function findDefaultAnswer(array: any, searchString: string) {
        const found = array.find(item => searchString.includes(item.description.toLocaleLowerCase()));
        return found ? found.defaultanswer : "";
    }

    const triggerReplyMessage = () => {
        if (copyEmails.error) return;
        setNumRows(2);
        const callback = () => {
            let wasSend = false;
            if (files.length > 0 && ticketSelected?.communicationchanneltype !== "MAIL") {
                const listMessages = files.map((x) => ({
                    ...ticketSelected!!,
                    interactiontype: x.type,
                    validateUserOnTicket: userType === "AGENT",
                    interactiontext: x.url,
                }));
                wasSend = true;
                settriggerReply(true);
                dispatch(replyTicket(listMessages, true));
                if (files.length > 0) {
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
                        };
                        if (userType === "AGENT") {
                            dispatch(
                                emitEvent({
                                    event: "newMessageFromAgent",
                                    data: newInteractionSocket,
                                })
                            );
                        }
                    });
                    setFiles([]);
                }
            }
            if (record && ticketSelected?.communicationchanneltype !== "MAIL") {
                const listMessages = [
                    {
                        ...ticketSelected!!,
                        interactiontype: "audio",
                        validateUserOnTicket: userType === "AGENT",
                        interactiontext: record.url,
                    },
                ];
                wasSend = true;
                settriggerReply(true);
                dispatch(replyTicket(listMessages, true));
                const newInteractionSocket = {
                    ...ticketSelected!!,
                    interactionid: 0,
                    typemessage: "audio",
                    typeinteraction: null,
                    lastmessage: record.url,
                    createdate: new Date().toISOString(),
                    userid: 0,
                    usertype: "agent",
                    ticketWasAnswered: !ticketSelected!!.isAnswered,
                    isAnswered: !ticketSelected!!.isAnswered,
                };
                if (userType === "AGENT") {
                    dispatch(
                        emitEvent({
                            event: "newMessageFromAgent",
                            data: newInteractionSocket,
                        })
                    );
                }
                setRecord(null);
            }
            if (text) {
                let textCleaned = text;
                if (
                    ticketSelected?.communicationchanneltype === "MAIL" &&
                    groupInteractionList.data[0]?.interactiontext
                ) {
                    textCleaned = (
                        "Re: " +
                        groupInteractionList.data[0].interactiontext.split("&%MAIL%&")[0] +
                        "&%MAIL%&" +
                        text
                    ).trim();

                    const fileobj = files.reduce(
                        (acc, item, i) => ({
                            ...acc,
                            [String(
                                item.url.split("/").pop() === "tenor.gif"
                                    ? "tenor" + i + ".gif"
                                    : item.url.split("/").pop()
                            )]: item.url,
                        }),
                        {}
                    );
                    textCleaned = textCleaned + "&%MAIL%&" + JSON.stringify(fileobj);
                    setFiles([]);
                }

                const errormessage = findDefaultAnswer(inappropiatewordsList, textCleaned.toLocaleLowerCase())

                if (textCleaned) {
                    if (!errormessage) {
                        const uuid = uuidv4();
                        wasSend = true;
                        const newInteractionSocket = {
                            ...ticketSelected!!,
                            interactionid: 0,
                            typemessage: ticketSelected?.communicationchanneltype === "MAIL" ? "email" : "text",
                            typeinteraction: null,
                            uuid,
                            lastmessage: textCleaned,
                            createdate: new Date().toISOString(),
                            userid: 0,
                            usertype: "agent",
                            ticketWasAnswered: !ticketSelected!!.isAnswered,
                        };
                        if (userType === "AGENT") {
                            dispatch(
                                emitEvent({
                                    event: "newMessageFromAgent",
                                    data: newInteractionSocket,
                                })
                            );
                        }
                        //send to answer with integration
                        settriggerReply(true);
                        dispatch(
                            replyTicket({
                                ...ticketSelected!!,
                                interactiontype: ticketSelected?.communicationchanneltype === "MAIL" ? "email" : "text",
                                interactiontext: textCleaned,
                                uuid,
                                validateUserOnTicket: userType === "AGENT",
                                isAnswered: !ticketSelected!!.isAnswered,
                                emailcocopy: copyEmails.cco || "",
                                emailcopy: copyEmails.cc || "",
                            })
                        );
                        setText("");
                        setrefresh(refresh * -1);
                        setBodyobject([{ type: "paragraph", align: "left", children: [{ text: "" }] }]);
                    } else {
                        dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                    }
                }
            }

            if (wasSend && userType === "SUPERVISOR") reasignTicket();
        };

        if (userType === "SUPERVISOR") {
            dispatch(
                manageConfirmation({
                    visible: true,
                    question: t(langKeys.confirmation_reasign_with_reply),
                    callback,
                })
            );
        } else {
            callback();
        }
    };

    const [openDialogHotKey, setOpenDialogHotKey] = React.useState(false);
    const handleClickAway = () => setOpenDialogHotKey(false);

    useEffect(() => {
        if (!multiData.loading && !multiData.error && multiData?.data[4]) {
            setemojiNoShow(multiData?.data?.[10]?.data.filter((x) => x.restricted).map((x) => x.emojihex) || []);
            setemojiFavorite(multiData?.data?.[10]?.data.filter((x) => x.favorite).map((x) => x.emojihex) || []);
            setPropertyCopilotLaraigo(multiData?.data?.find(x => x.key === "UFN_PROPERTY_SELBYNAMECOPILOTLARAIGO")?.data?.[0]?.propertyvalue === "1")
            // setinnappropiatewords(multiData?.data[11].data.filter(x => (x.status === "ACTIVO")).map(y => (y.description)) || [])
        }
    }, [multiData]);

    useEffect(() => {        
        const ismail = ticketSelected?.communicationchanneltype === "MAIL"
        const favoritequickreplies = quickReplies.data.filter(x=>x.favorite)
        setquickRepliesToShow(ismail? favoritequickreplies.filter(x=>x.quickreply_type === "CORREO ELECTRONICO") : favoritequickreplies.filter(x=>x.quickreply_type !== "CORREO ELECTRONICO") || []);
    }, [quickReplies, ticketSelected]);

    useEffect(() => {
        if (text.substring(0, 2).toLowerCase() === "\\q") {
            const ismail = ticketSelected?.communicationchanneltype === "MAIL"
            const quickreplyFiltered = ismail? quickReplies.data.filter(x=>x.quickreply_type === "CORREO ELECTRONICO") : quickReplies.data.filter(x=>x.quickreply_type !== "CORREO ELECTRONICO") || []
            setTypeHotKey("quickreply");
            setOpenDialogHotKey(true);
            const textToSearch = text.trim().split(text.trim().includes("\\q") ? "\\q" : "\\Q")[1];
            if (textToSearch === "") setquickRepliesToShow(quickreplyFiltered.filter((x) => x.favorite));
            else
                setquickRepliesToShow(
                    quickreplyFiltered.filter((x) => x.description.toLowerCase().includes(textToSearch.toLowerCase()))
                );
        } else if (text.substring(0, 2).toLowerCase() === "\\r") {
            setTypeHotKey("richresponse");
            setOpenDialogHotKey(true);
            const textToSearch = text.trim().split(text.trim().includes("\\r") ? "\\r" : "\\R")[1];
            if (textToSearch === "") setRichResponseToShow(richResponseList.data);
            else
                setRichResponseToShow(
                    richResponseList.data.filter((x) => x.title.toLowerCase().includes(textToSearch.toLowerCase()))
                );
        } else {
            setOpenDialogHotKey(false);
        }
    }, [text]);

    const selectQuickReply = (value: string) => {
        const variablesList = value.match(/({{)(.*?)(}})/g) || [];
        let myquickreply = value
            .replace("{{numticket}}", `${ticketSelected?.ticketnum}`)
            .replace("{{client_name}}", `${ticketSelected?.displayname}`)
            .replace("{{agent_name}}", user?.firstname + " " + user?.lastname)
            .replace("{{user_group}}", ticketSelected?.usergroup || "");

        variablesList.forEach((x: any) => {
            let variableData = variablecontext?.[x.substring(2, x.length - 2)];
            if (!!variableData) {
                myquickreply = myquickreply.replaceAll(x, variableData.Value);
            } else {
                myquickreply = myquickreply.replaceAll(x, "");
            }
        });

        setText(myquickreply);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {     
        if (event.ctrlKey && event.code === 'Enter') {
            setText((prevText) => prevText + '\n');
            event.preventDefault();
        } else if (event.shiftKey) {
            return;
        } else if (
            (user?.languagesettings?.sendingmode === "Default" && event.key === 'Enter') || 
            ((!user?.languagesettings?.sendingmode || user?.languagesettings?.sendingmode === "EnterKey") && event.code === 'Enter')
        ) {
            event.preventDefault();
            if ((text.trim() || files.length > 0) && user?.languagesettings?.sendingmode !== "ExecutionButton") {
                triggerReplyMessage();
            }
        }
    };    

    const handleSelectionChange = (event: Dictionary) => {
        setLastSelection(event?.target?.selectionEnd ?? 0);
    };

    function onPasteTextbar(e: Dictionary) {
        if (!lock_send_file_pc && e.clipboardData.files.length) {
            e.preventDefault();
            if (e.clipboardData.files[0].type.includes("image")) {
                //uploadFile
                setfileimage(e.clipboardData.files);
            }
        }
    }

    const toggleTextStyle = (style) => {
        const input = inputRef.current.querySelector('textarea');
        const { value, selectionStart, selectionEnd } = input;
        const selectedText = value.slice(selectionStart, selectionEnd);
        const beforeText = value.slice(0, selectionStart);
        const afterText = value.slice(selectionEnd);
    
        let newText = selectedText;
    
        if (selectedText) {
            const textWithStyle = formatTextToUnicode({ text: selectedText, [style]: true });
            let textWithoutStyle = removeUnicodeStyle(selectedText);    
    
            if (style === 'underline' || style === 'strikethrough') {
                const regex = new RegExp(`[\\u0332\\u0336]`, 'g');
                textWithoutStyle = selectedText.replace(regex, '');
                if (selectedText === textWithoutStyle) {
                    newText = textWithStyle;
                } else {
                    newText = textWithoutStyle;
                }
            } else {
                if (selectedText === textWithStyle) {
                    newText = textWithoutStyle;
                } else {
                    newText = textWithStyle;
                }
            }
    
            const newValue = `${beforeText}${newText}${afterText}`;
            setText(newValue);
    
            const selectionLengthDiff = newText.length - selectedText.length;
            const newSelectionStart = selectionStart;
            const newSelectionEnd = selectionEnd + selectionLengthDiff;
    
            setTimeout(() => {
                input.setSelectionRange(newSelectionStart, newSelectionEnd);
                input.focus();
            }, 0);
        } else {
            const newValue = value; 
            setText(newValue);
        }
    };
    
    const handleKeyDown = (event: Dictionary) => {
        if ((event.altKey || user?.languagesettings?.sendingmode === "ExecutionButton") && event.key === 'Enter') {
            event.preventDefault();
            setText(text + '\n');
        }
    };

    const isTextEmptyOrWhitespace = (text: string) => {
        return text.trim() === '';
    };

    if (ticketSelected?.communicationchanneltype === "MAIL") {
        return (
            <div className={classes.containerResponse}>
                {showReply ? (
                    <div>
                        {files.length > 0 && (
                            <div
                                style={{
                                    display: "flex",
                                    gap: 8,
                                    flexWrap: "wrap",
                                    borderBottom: "1px solid #EBEAED",
                                    paddingBottom: 8,
                                }}
                            >
                                {files.map((item: IFile) => (
                                    <ItemFile key={item.id} item={item} setFiles={setFiles} />
                                ))}
                            </div>
                        )}
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
                                        quickReplies={quickReplies.data.filter(x=>x.quickreply_type === "CORREO ELECTRONICO")}
                                        refresh={refresh}
                                        placeholder="Send your message..."
                                        emojiNoShow={emojiNoShow}
                                        emoji={true}
                                        emojiFavorite={emojiFavorite}
                                        setFiles={setFiles}
                                        collapsed={true}
                                        endinput={
                                            <div style={{ display: "block" }}>
                                                <div
                                                    style={{ marginLeft: "auto", marginRight: 0 }}
                                                    className={clsx(classes.iconSend, {
                                                        [classes.iconSendDisabled]: !(
                                                            renderToString(toElement(bodyobject)) !==
                                                            `<div data-reactroot=""><p><span></span></p></div>` ||
                                                            files.filter((x) => x.url).length > 0
                                                        ),
                                                    })}
                                                    onClick={triggerReplyMessage}
                                                >
                                                    <SendIcon />
                                                </div>
                                            </div>
                                        }
                                    >
                                        <GifPickerZyx
                                            onSelect={(url: string) =>
                                                setFiles((p) => [
                                                    ...p,
                                                    { type: "image", url, id: new Date().toISOString() },
                                                ])
                                            }
                                        />
                                        <UploaderIcon
                                            classes={classes}
                                            setFiles={setFiles}
                                            initfile={fileimage}
                                            setfileimage={setfileimage}
                                        />
                                    </RichText>
                                    {openDialogHotKey && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                bottom: 100,
                                                left: 15,
                                                zIndex: 1201,
                                            }}
                                        >
                                            <div
                                                className="scroll-style-go"
                                                style={{
                                                    maxHeight: 200,
                                                    display: "flex",
                                                    gap: 4,
                                                    flexDirection: "column",
                                                }}
                                            >
                                                {typeHotKey === "quickreply"
                                                    && quickRepliesToShow.map((item) => (
                                                        <div
                                                            key={item.quickreplyid}
                                                            className={classes.hotKeyQuickReply}
                                                            onClick={() => selectQuickReply(item.quickreply)}
                                                        >
                                                            {item.description}
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ClickAwayListener>
                        </div>
                    </div>
                ) : (
                    <div
                        style={{
                            whiteSpace: "break-spaces",
                            color: "rgb(251, 95, 95)",
                            fontWeight: 500,
                            textAlign: "center",
                        }}
                    >
                        {showReply == null ? t(langKeys.no_reply_claro) : t(langKeys.no_reply_use_hsm)}
                    </div>
                )}
                <BottomGoToUnder />
            </div>
        );
    } else
        return (
            <>
                {showReply && (
                    <DragDropFile setFiles={setFiles} disabled={lock_send_file_pc}>
                        <div className={classes.containerResponse}>
                            {(record || startRecording) && (
                                <div
                                    style={{
                                        display: "flex",
                                    }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            width: "100%",
                                            gap: 8,
                                            flexWrap: "wrap",
                                            borderBottom: "1px solid #EBEAED",
                                            paddingBottom: 8,
                                        }}
                                    >
                                        <RecordComponent
                                            record={record}
                                            setRecord={setRecord}
                                            setStartRecording={setStartRecording}
                                            startRecording={startRecording}
                                        />
                                    </div>
                                    <div
                                        className={clsx(classes.iconSend, {
                                            [classes.iconSendDisabled]: !(
                                                text ||
                                                files.filter((x) => !!x.url).length > 0 ||
                                                record
                                            ),
                                        })}
                                        style={{ marginTop: 12 }}
                                        onClick={triggerReplyMessage}
                                    >
                                        <SendIcon />
                                    </div>
                                </div>
                            )}
                            {files.length > 0 && (
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 8,
                                        flexWrap: "wrap",
                                        borderBottom: "1px solid #EBEAED",
                                        paddingBottom: 8,
                                    }}
                                >
                                    {files.map((item: IFile) => (
                                        <ItemFile key={item.id} item={item} setFiles={setFiles} />
                                    ))}
                                </div>
                            )}
                            {!record && !startRecording && (
                                <ClickAwayListener onClickAway={handleClickAway}>
                                    <div>
                                        <div style={{ display: "flex", alignItems: "flex-end" }}>
                                            <InputBase
                                                id="chat-input"
                                                fullWidth
                                                value={text}
                                                onChange={(e) => setText(e.target.value)}
                                                placeholder={t(langKeys.send_your_message)}
                                                onKeyPress={handleKeyPress}
                                                rows={numRows}
                                                multiline
                                                onKeyDown={handleKeyDown}
                                                minRows={1}
                                                maxRows={6}
                                                inputProps={{
                                                    'aria-label': 'naked',
                                                    style: {
                                                        maxHeight: '144px',
                                                        overflow: 'auto',
                                                    },
                                                }}
                                                onPaste={onPasteTextbar}
                                                onSelect={handleSelectionChange}
                                                ref={inputRef}
                                            />
                                            <div style={{ marginLeft: '1rem', marginBottom: '0.5rem' }}>
                                                {!files.length && isTextEmptyOrWhitespace(text) && allowRecording ? (                                                    
                                                    <RecordAudioIcon
                                                        classes={classes}
                                                        setRecord={setRecord}
                                                        setStartRecording={setStartRecording}
                                                        startRecording={startRecording}
                                                    />
                                                ) : (
                                                    <div
                                                        className={clsx(classes.iconSend, {
                                                            [classes.iconSendDisabled]: isTextEmptyOrWhitespace(text) && !(
                                                                files.filter((x) => Boolean(x.url)).length > 0 || record
                                                            ),
                                                        })}
                                                        onClick={triggerReplyMessage}
                                                    >
                                                        <SendIcon />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {openDialogHotKey && (
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    bottom: 100,
                                                    left: 15,
                                                    zIndex: 1201,
                                                }}
                                            >
                                                <div
                                                    className="scroll-style-go"
                                                    style={{
                                                        maxHeight: 200,
                                                        display: "flex",
                                                        gap: 4,
                                                        flexDirection: "column",
                                                    }}
                                                >
                                                    {typeHotKey === "quickreply"
                                                        && quickRepliesToShow.map((item) => (
                                                            <div
                                                                key={item.quickreplyid}
                                                                className={classes.hotKeyQuickReply}
                                                                onClick={() => selectQuickReply(item.quickreply)}
                                                            >
                                                                {item.description}
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </ClickAwayListener>
                            )}
                            {!record && !startRecording && (
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                        <QuickReplyIcon classes={classes} setText={setText} />
                                        <TmpRichResponseIcon classes={classes} setText={setText} />
                                        <UploaderIcon
                                            classes={classes}
                                            setFiles={setFiles}
                                            initfile={fileimage}
                                            setfileimage={setfileimage}
                                        />
                                        <EmojiPickerZyx
                                            emojisIndexed={EMOJISINDEXED}
                                            onSelect={(e) => {
                                                lastSelection < (text || "").length - 1
                                                    ? setText(
                                                        (p) =>
                                                            p.substring(0, lastSelection) +
                                                            e.native +
                                                            p.substring(lastSelection)
                                                    )
                                                    : setText((p) => p + e.native);
                                            }}
                                            emojisNoShow={emojiNoShow}
                                            emojiFavorite={emojiFavorite}
                                        />
                                        <GifPickerZyx
                                            onSelect={(url: string) =>
                                                setFiles((p) => [
                                                    ...p,
                                                    { type: "image", url, id: new Date().toISOString() },
                                                ])
                                            }
                                        />
                                        <CopilotLaraigoIcon
                                            classes={classes}
                                            enabled={propertyCopilotLaraigo}
                                        />
                                    </div>                                 

                                    <div style={{ display: 'flex', gap: '0.7rem' }}>
                                        <Tooltip title={String(t(langKeys.bold))} arrow placement="top">
                                            <IconButton onClick={() => toggleTextStyle('bold')} size='small'>
                                            {t(langKeys.currentlanguage) === "en" ? <FormatBoldIcon className={classes.root} /> : <BoldNIcon className={classes.root} style={{ width: 18, height: 18 }} />}
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={String(t(langKeys.italic))} arrow placement="top">
                                            <IconButton onClick={() => toggleTextStyle('italic')} size='small'>
                                            {t(langKeys.currentlanguage) === "en" ? <FormatItalicIcon className={classes.root} /> : <ItalicKIcon className={classes.root} style={{ width: 18, height: 18 }} />}
                                            </IconButton>
                                        </Tooltip>
                                        {ticketSelected?.communicationchanneltype.includes("WHA") && (
                                            <Tooltip title={String(t(langKeys.underline))} arrow placement="top">
                                                <IconButton onClick={() => toggleTextStyle('underline')} size='small'>
                                                {t(langKeys.currentlanguage) === "en" ? <FormatUnderlinedIcon className={classes.root} /> : <UnderlineSIcon className={classes.root} style={{ width: 18, height: 18 }} />}
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        <Tooltip title={String(t(langKeys.strikethrough))} arrow placement="top">
                                            <IconButton onClick={() => toggleTextStyle('strikethrough')} size='small'>
                                            {t(langKeys.currentlanguage) === "en" ? <StrikethroughSIcon className={classes.root} /> : <StrikethroughLineIcon className={classes.root} style={{ width: 18, height: 18 }} />}
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={String(t(langKeys.monospaced))} arrow placement="top">
                                            <IconButton onClick={() => toggleTextStyle('monospaced')} size='small'>
                                                <CodeSnippetIcon className={classes.root} style={{ width: 24, height: 24 }} />
                                            </IconButton>
                                        </Tooltip>
                                    </div>







                                </div>
                            )}
                            <BottomGoToUnder />
                        </div>
                    </DragDropFile>
                )}
                {!showReply && (
                    <div className={classes.containerResponse}>
                        <div
                            style={{
                                whiteSpace: "break-spaces",
                                color: "rgb(251, 95, 95)",
                                fontWeight: 500,
                                textAlign: "center",
                            }}
                        >
                            {showReply == null ? t(langKeys.no_reply_claro) : t(langKeys.no_reply_use_hsm)}
                        </div>
                        <BottomGoToUnder />
                    </div>
                )}
            </>
        );
};

export default ReplyPanel;