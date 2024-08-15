"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
require("emoji-mart/css/emoji-mart.css");
var InputAdornment_1 = require("@material-ui/core/InputAdornment");
var icons_1 = require("icons");
var styles_1 = require("@material-ui/core/styles");
var hooks_1 = require("hooks");
var react_redux_1 = require("react-redux");
var actions_1 = require("store/inbox/actions");
var actions_2 = require("store/main/actions");
var actions_3 = require("store/popus/actions");
var InputBase_1 = require("@material-ui/core/InputBase");
var clsx_1 = require("clsx");
var components_1 = require("components");
var CircularProgress_1 = require("@material-ui/core/CircularProgress");
var IconButton_1 = require("@material-ui/core/IconButton");
var Close_1 = require("@material-ui/icons/Close");
var keys_1 = require("lang/keys");
var react_i18next_1 = require("react-i18next");
var ClickAwayListener_1 = require("@material-ui/core/ClickAwayListener");
var Tooltip_1 = require("@material-ui/core/Tooltip");
var Fab_1 = require("@material-ui/core/Fab");
var DoubleArrow_1 = require("@material-ui/icons/DoubleArrow");
var Avatar_1 = require("@material-ui/core/Avatar");
var Badge_1 = require("@material-ui/core/Badge");
var AttachFile_1 = require("@material-ui/icons/AttachFile");
var List_1 = require("@material-ui/core/List");
var ListItem_1 = require("@material-ui/core/ListItem");
var Divider_1 = require("@material-ui/core/Divider");
var ListItemText_1 = require("@material-ui/core/ListItemText");
var TextField_1 = require("@material-ui/core/TextField");
var functions_1 = require("common/helpers/functions");
var RichText_1 = require("components/fields/RichText");
var emojis_1 = require("common/constants/emojis");
var DragDropFile_1 = require("components/fields/DragDropFile");
var MailRecipients_1 = require("./MailRecipients");
var Menu_1 = require("@material-ui/core/Menu");
var MenuItem_1 = require("@material-ui/core/MenuItem");
var Delete_1 = require("@material-ui/icons/Delete");
var core_1 = require("@material-ui/core");
var icons_2 = require("@material-ui/icons");
var icons_3 = require("icons");
var StarRate_1 = require("@material-ui/icons/StarRate");
var react_audio_voice_recorder_1 = require("react-audio-voice-recorder");
var PlayArrow_1 = require("@material-ui/icons/PlayArrow");
var Pause_1 = require("@material-ui/icons/Pause");
var Stop_1 = require("@material-ui/icons/Stop");
var FormatBold_1 = require("@material-ui/icons/FormatBold");
var FormatItalic_1 = require("@material-ui/icons/FormatItalic");
var FormatUnderlined_1 = require("@material-ui/icons/FormatUnderlined");
var StrikethroughS_1 = require("@material-ui/icons/StrikethroughS");
var helpers_1 = require("common/helpers");
var useStylesInteraction = styles_1.makeStyles(function () { return ({
    textFileLibrary: {
        padding: "0px .5rem",
        width: 80,
        wordBreak: "break-word",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        textAlign: "center"
    },
    containerFiles: {
        display: "flex",
        gap: "1rem",
        flexWrap: "wrap",
        marginTop: 16,
        maxHeight: 300,
        overflowY: "auto"
    },
    containerFileLibrary: {
        cursor: "pointer",
        "&:hover": {
            backgroundColor: "rgb(235, 234, 237, 0.18)"
        }
    },
    inputPlaceholder: {
        padding: "2rem",
        "&::placeholder": {
            fontSize: "1rem",
            fontWeight: 500,
            color: "#84818A"
        }
    }
}); });
var EMOJISINDEXED = emojis_1.emojis.reduce(function (acc, item) {
    var _a;
    return (__assign(__assign({}, acc), (_a = {}, _a[item.emojihex] = item, _a)));
}, {});
var channelsWhatsapp = ["WHAT", "WHAD", "WHAP", "WHAG", "WHAM"];
var DialogSearchLibrary = function (_a) {
    var setOpenModal = _a.setOpenModal, openModal = _a.openModal, setFiles = _a.setFiles;
    var t = react_i18next_1.useTranslation().t;
    var classes = useStylesInteraction();
    var libraryList = hooks_1.useSelector(function (state) { return state.inbox.libraryList; });
    var _b = react_1.useState([]), categoryList = _b[0], setCategoryList = _b[1];
    var _c = react_1.useState(""), categoryFilter = _c[0], setCategoryFilter = _c[1];
    var _d = react_1.useState(""), generalFilter = _d[0], setGeneralFilter = _d[1];
    var _e = react_1.useState([]), libraryToShow = _e[0], setLibraryToShow = _e[1];
    var onSelectFile = function (file) {
        var iid = new Date().toISOString();
        setFiles(function (x) { return __spreadArrays(x, [{ id: iid, url: file.link, type: file.type }]); });
        setOpenModal(false);
    };
    react_1.useEffect(function () {
        if (openModal) {
            setCategoryList(Array.from(new Set(libraryList.map(function (x) { return x.category; })))
                .filter(function (x) { return x; })
                .map(function (x) { return ({ option: x }); }));
            setLibraryToShow(libraryList);
        }
    }, [openModal]);
    var applyFilter = function (value) {
        setGeneralFilter(value !== null && value !== void 0 ? value : "");
        if (value) {
            setLibraryToShow(libraryList.filter(function (x) { return x.category === categoryFilter; }).filter(function (x) { return x.title.includes(value); }));
        }
        else {
            setLibraryToShow(libraryList.filter(function (x) { return x.category === categoryFilter; }));
        }
    };
    var applyFilterCategory = function (value) {
        setCategoryFilter(value !== null && value !== void 0 ? value : "");
        if (value) {
            setLibraryToShow(libraryList.filter(function (x) { return x.category === value; }).filter(function (x) { return x.title.includes(generalFilter); }));
        }
        else {
            setLibraryToShow(libraryList.filter(function (x) { return x.title.includes(generalFilter); }));
        }
    };
    return (react_1["default"].createElement(components_1.DialogZyx, { open: openModal, title: t(keys_1.langKeys.documentlibrary), buttonText1: t(keys_1.langKeys.cancel), handleClickButton1: function () { return setOpenModal(false); }, button2Type: "submit" },
        react_1["default"].createElement("div", null,
            react_1["default"].createElement("div", { style: { display: "flex", gap: 12 } },
                react_1["default"].createElement("div", { style: { width: 200 } },
                    react_1["default"].createElement(components_1.FieldSelect, { label: t(keys_1.langKeys.category), className: "col-4", valueDefault: categoryFilter, onChange: function (value) { return applyFilterCategory(value === null || value === void 0 ? void 0 : value.option); }, data: categoryList, variant: "outlined", optionDesc: "option", optionValue: "option" })),
                react_1["default"].createElement("div", { style: { flex: 1 } },
                    react_1["default"].createElement(components_1.SearchField, { style: { fontSize: "1rem" }, className: "col-8", colorPlaceHolder: "#FFF", inputProps: { className: classes.inputPlaceholder }, handleChangeOther: applyFilter, lazy: true }))),
            libraryList.some(function (x) { return x.favorite; }) && (react_1["default"].createElement(react_1["default"].Fragment, null,
                react_1["default"].createElement("div", { style: { display: "flex", gap: 8, alignItems: "center", marginTop: 16, marginLeft: 4 } },
                    react_1["default"].createElement(StarRate_1["default"], { fontSize: "small", color: "primary" }),
                    react_1["default"].createElement("div", { style: { fontWeight: 500, fontSize: 16, color: "#7721AD" } }, t(keys_1.langKeys.favorites))),
                react_1["default"].createElement("div", { className: classes.containerFiles }, libraryToShow.map(function (x) {
                    if (!x.favorite) {
                        return null;
                    }
                    var extension = x.link.split(".").pop();
                    return (react_1["default"].createElement("div", { key: x.documentlibraryid, className: classes.containerFileLibrary, onClick: function () { return onSelectFile(x); } },
                        x.type === "image" ? (react_1["default"].createElement("div", { style: { padding: 10, width: "80px", height: "80px" } },
                            react_1["default"].createElement("img", { style: { objectFit: "cover" }, src: x.link, width: "100%", height: "100%" }))) : extension === "pdf" ? (react_1["default"].createElement(icons_3.PdfIcon, { width: "80", height: "80" })) : extension === "doc" || extension === "docx" ? (react_1["default"].createElement(icons_3.DocIcon, { width: "80", height: "80" })) : ["xls", "xlsx", "csv"].includes("" + extension) ? (react_1["default"].createElement(icons_3.XlsIcon, { width: "80", height: "80" })) : extension === "ppt" || extension === "pptx" ? (react_1["default"].createElement(icons_3.PptIcon, { width: "80", height: "80" })) : extension === "text" || extension === "txt" ? (react_1["default"].createElement(icons_3.TxtIcon, { width: "80", height: "80" })) : extension === "zip" || extension === "rar" ? (react_1["default"].createElement(icons_3.ZipIcon, { width: "80", height: "80" })) : (react_1["default"].createElement(icons_3.FileIcon1, { width: "80", height: "80" })),
                        react_1["default"].createElement("div", { className: classes.textFileLibrary }, x.title)));
                })))),
            react_1["default"].createElement("div", { style: { marginTop: 24, marginLeft: 4, fontWeight: 500, fontSize: 16, color: "#7721AD" } }, t(keys_1.langKeys.others)),
            react_1["default"].createElement("div", { className: classes.containerFiles }, libraryToShow.map(function (x) {
                var extension = x.link.split(".").pop();
                return (react_1["default"].createElement("div", { key: x.documentlibraryid, className: classes.containerFileLibrary, onClick: function () { return onSelectFile(x); } },
                    x.type === "image" ? (react_1["default"].createElement("div", { style: { padding: 10, width: "80px", height: "80px" } },
                        react_1["default"].createElement("img", { style: { objectFit: "cover" }, src: x.link, width: "100%", height: "100%" }))) : extension === "pdf" ? (react_1["default"].createElement(icons_3.PdfIcon, { width: "80", height: "80" })) : extension === "doc" || extension === "docx" ? (react_1["default"].createElement(icons_3.DocIcon, { width: "80", height: "80" })) : ["xls", "xlsx", "csv"].includes("" + extension) ? (react_1["default"].createElement(icons_3.XlsIcon, { width: "80", height: "80" })) : extension === "ppt" || extension === "pptx" ? (react_1["default"].createElement(icons_3.PptIcon, { width: "80", height: "80" })) : extension === "text" || extension === "txt" ? (react_1["default"].createElement(icons_3.TxtIcon, { width: "80", height: "80" })) : extension === "zip" || extension === "rar" ? (react_1["default"].createElement(icons_3.ZipIcon, { width: "80", height: "80" })) : (react_1["default"].createElement(icons_3.FileIcon1, { width: "80", height: "80" })),
                    react_1["default"].createElement("div", { className: classes.textFileLibrary }, x.title)));
            })))));
};
var UploaderIcon = function (_a) {
    var _b;
    var classes = _a.classes, setFiles = _a.setFiles, initfile = _a.initfile, setfileimage = _a.setfileimage;
    var t = react_i18next_1.useTranslation().t;
    var _c = react_1["default"].useState(null), anchorEl = _c[0], setAnchorEl = _c[1];
    var _d = react_1.useState(""), valuefile = _d[0], setvaluefile = _d[1];
    var dispatch = react_redux_1.useDispatch();
    var _e = react_1.useState(false), waitSave = _e[0], setWaitSave = _e[1];
    var uploadResult = hooks_1.useSelector(function (state) { return state.main.uploadFile; });
    var lock_send_file_pc = hooks_1.useSelector(function (state) { var _a, _b; return (_b = (_a = state.login.validateToken.user) === null || _a === void 0 ? void 0 : _a.properties) === null || _b === void 0 ? void 0 : _b.lock_send_file_pc; });
    var _f = react_1.useState(false), openModal = _f[0], setOpenModal = _f[1];
    var _g = react_1.useState(""), idUpload = _g[0], setIdUpload = _g[1];
    react_1.useEffect(function () {
        if (initfile) {
            onSelectImage(initfile);
            if (setfileimage) {
                setfileimage(null);
            }
        }
    }, [initfile]);
    react_1.useEffect(function () {
        if (waitSave) {
            if (!uploadResult.loading && !uploadResult.error) {
                setFiles(function (x) {
                    return x.map(function (item) { return (item.id === idUpload ? __assign(__assign({}, item), { url: uploadResult.url }) : item); });
                });
                setWaitSave(false);
                dispatch(actions_2.resetUploadFile());
            }
            else if (uploadResult.error) {
                // const errormessage = uploadResult.code || "error_unexpected_error"
                setFiles(function (x) {
                    return x.map(function (item) { return (item.id === idUpload ? __assign(__assign({}, item), { url: uploadResult.url, error: true }) : item); });
                });
                // dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
            }
        }
    }, [waitSave, uploadResult, dispatch, setFiles, idUpload]);
    var onSelectImage = function (files) {
        var selectedFile = files[0];
        var idd = new Date().toISOString();
        var fd = new FormData();
        fd.append("file", selectedFile, selectedFile.name);
        setvaluefile("");
        setIdUpload(idd);
        var type = selectedFile.type.match("image.*") ? "image" : "file";
        setFiles(function (x) { return __spreadArrays(x, [{ id: idd, url: "", type: type }]); });
        dispatch(actions_2.uploadFile(fd));
        setWaitSave(true);
    };
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(IconButton_1["default"], { color: "primary", size: "small", onClick: function (e) { return setAnchorEl(e.currentTarget); } },
            react_1["default"].createElement(AttachFile_1["default"], { className: clsx_1["default"](classes.iconResponse, (_b = {}, _b[classes.iconSendDisabled] = waitSave, _b)) })),
        react_1["default"].createElement("input", { name: "file", id: "laraigo-upload-file-x", type: "file", value: valuefile, style: { display: "none" }, onChange: function (e) { return onSelectImage(e.target.files); } }),
        react_1["default"].createElement(Menu_1["default"], { id: "menu-appbar", anchorEl: anchorEl, getContentAnchorEl: null, anchorOrigin: {
                vertical: "bottom",
                horizontal: "left"
            }, transformOrigin: {
                vertical: "bottom",
                horizontal: "left"
            }, open: Boolean(anchorEl), onClose: function () { return setAnchorEl(null); } },
            !lock_send_file_pc && (react_1["default"].createElement("label", { htmlFor: "laraigo-upload-file-x" },
                react_1["default"].createElement(MenuItem_1["default"], { onClick: function () {
                        setAnchorEl(null);
                    } },
                    react_1["default"].createElement(core_1.ListItemIcon, null,
                        react_1["default"].createElement(icons_2.Publish, { width: 18, style: { fill: "#2E2C34" } })),
                    "Subir archivos desde el ordenador"))),
            react_1["default"].createElement(MenuItem_1["default"], { onClick: function () {
                    setAnchorEl(null);
                    setOpenModal(true);
                } },
                react_1["default"].createElement(core_1.ListItemIcon, null,
                    react_1["default"].createElement(icons_2.LibraryBooks, { width: 18, style: { fill: "#2E2C34" } })),
                "Elegir desde la biblioteca de archivos")),
        react_1["default"].createElement(DialogSearchLibrary, { openModal: openModal, setOpenModal: setOpenModal, setFiles: setFiles })));
};
var ItemFile = function (_a) {
    var item = _a.item, setFiles = _a.setFiles;
    var extension = item.url.split(".").pop();
    return (react_1["default"].createElement("div", { style: { position: "relative" } },
        react_1["default"].createElement("div", { key: item.id, style: {
                width: 70,
                height: 70,
                border: "1px solid #e1e1e1",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            } }, item.url ? (item.type === "image" ? (react_1["default"].createElement("img", { alt: "loaded", src: item.url, style: { objectFit: "cover", width: "100%", maxHeight: 70 } })) : extension === "pdf" ? (react_1["default"].createElement(icons_3.PdfIcon, { width: "70", height: "70" })) : extension === "doc" || extension === "docx" ? (react_1["default"].createElement(icons_3.DocIcon, { width: "70", height: "70" })) : ["xls", "xlsx", "csv"].includes("" + extension) ? (react_1["default"].createElement(icons_3.XlsIcon, { width: "70", height: "70" })) : extension === "ppt" || extension === "pptx" ? (react_1["default"].createElement(icons_3.PptIcon, { width: "70", height: "70" })) : extension === "text" || extension === "txt" ? (react_1["default"].createElement(icons_3.TxtIcon, { width: "70", height: "70" })) : extension === "zip" || extension === "rar" ? (react_1["default"].createElement(icons_3.ZipIcon, { width: "70", height: "70" })) : (react_1["default"].createElement(icons_3.FileIcon1, { width: "70", height: "70" }))) : (react_1["default"].createElement(CircularProgress_1["default"], { color: "inherit" }))),
        react_1["default"].createElement(IconButton_1["default"], { onClick: function () { return setFiles(function (x) { return x.filter(function (y) { return y.id !== item.id; }); }); }, size: "small", style: { position: "absolute", top: -16, right: -14 } },
            react_1["default"].createElement(Close_1["default"], { fontSize: "small" }))));
};
var QuickReplyIcon = function (_a) {
    var classes = _a.classes, setText = _a.setText;
    var _b = react_1["default"].useState(false), open = _b[0], setOpen = _b[1];
    var quickReplies = hooks_1.useSelector(function (state) { return state.inbox.quickreplies; });
    var _c = react_1.useState([]), quickRepliesToShow = _c[0], setquickRepliesToShow = _c[1];
    var handleClick = function () { return setOpen(function (prev) { return !prev; }); };
    var _d = react_1.useState(false), showSearch = _d[0], setShowSearch = _d[1];
    var _e = react_1.useState(""), search = _e[0], setSearch = _e[1];
    var t = react_i18next_1.useTranslation().t;
    var ticketSelected = hooks_1.useSelector(function (state) { return state.inbox.ticketSelected; });
    var user = hooks_1.useSelector(function (state) { return state.login.validateToken.user; });
    var variablecontext = hooks_1.useSelector(function (state) { var _a; return (_a = state.inbox.person.data) === null || _a === void 0 ? void 0 : _a.variablecontext; });
    var handleClickAway = function () { return setOpen(false); };
    react_1.useEffect(function () {
        var ismail = (ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.communicationchanneltype) === "MAIL";
        var favoritequickreplies = quickReplies.data.filter(function (x) { return !!x.favorite; });
        debugger;
        setquickRepliesToShow(ismail ? favoritequickreplies.filter(function (x) { return x.quickreply_type === "CORREO ELECTRONICO"; }) : favoritequickreplies.filter(function (x) { return x.quickreply_type !== "CORREO ELECTRONICO"; }) || []);
    }, [quickReplies, ticketSelected]);
    react_1.useEffect(function () {
        var ismail = (ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.communicationchanneltype) === "MAIL";
        var quickreplyFiltered = ismail ? quickReplies.data.filter(function (x) { return x.quickreply_type === "CORREO ELECTRONICO"; }) : quickReplies.data.filter(function (x) { return x.quickreply_type !== "CORREO ELECTRONICO"; }) || [];
        if (search === "") {
            setquickRepliesToShow(quickreplyFiltered.filter(function (x) { return !!x.favorite; }));
        }
        else {
            setquickRepliesToShow(quickreplyFiltered.filter(function (x) { return x.description.toLowerCase().includes(search.toLowerCase()); }));
        }
    }, [search, quickReplies]);
    var handlerClickItem = function (item) {
        setOpen(false);
        var variablesList = item.quickreply.match(/({{)(.*?)(}})/g) || [];
        var myquickreply = item.quickreply
            .replace("{{numticket}}", ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.ticketnum)
            .replace("{{client_name}}", ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.displayname)
            .replace("{{agent_name}}", (user === null || user === void 0 ? void 0 : user.firstname) + " " + (user === null || user === void 0 ? void 0 : user.lastname))
            .replace("{{user_group}}", ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.usergroup);
        variablesList.forEach(function (x) {
            var variableData = variablecontext === null || variablecontext === void 0 ? void 0 : variablecontext[x.substring(2, x.length - 2)];
            if (variableData) {
                myquickreply = myquickreply.replaceAll(x, variableData);
            }
            else {
                myquickreply = myquickreply.replaceAll(x, "");
            }
        });
        setText(myquickreply);
    };
    return (react_1["default"].createElement(ClickAwayListener_1["default"], { onClickAway: handleClickAway },
        react_1["default"].createElement("div", { style: { display: "flex" } },
            react_1["default"].createElement(Tooltip_1["default"], { title: t(keys_1.langKeys.send_quickreply), arrow: true, placement: "top" },
                react_1["default"].createElement(icons_1.QuickresponseIcon, { className: classes.iconResponse, onClick: handleClick })),
            open && (react_1["default"].createElement("div", { style: {
                    position: "absolute",
                    bottom: 60,
                    zIndex: 1201
                } },
                react_1["default"].createElement("div", { className: classes.containerQuickReply2 },
                    react_1["default"].createElement("div", null, !showSearch ? (react_1["default"].createElement("div", { className: classes.headerQuickReply },
                        react_1["default"].createElement("div", null, "User Quick Response"),
                        react_1["default"].createElement(IconButton_1["default"], { size: "small", onClick: function () { return setShowSearch(true); }, edge: "end" },
                            react_1["default"].createElement(icons_1.SearchIcon, null)))) : (react_1["default"].createElement(TextField_1["default"], { color: "primary", fullWidth: true, autoFocus: true, placeholder: "Search quickreplies", style: { padding: "6px 6px 6px 12px" }, onBlur: function () { return !search && setShowSearch(false); }, onChange: function (e) { return setSearch(e.target.value); }, InputProps: {
                            endAdornment: (react_1["default"].createElement(InputAdornment_1["default"], { position: "end" },
                                react_1["default"].createElement(IconButton_1["default"], { size: "small" },
                                    react_1["default"].createElement(icons_1.SearchIcon, null))))
                        } }))),
                    react_1["default"].createElement(Divider_1["default"], null),
                    react_1["default"].createElement(List_1["default"], { component: "nav", disablePadding: true, style: { maxHeight: 200, width: "100%", overflowY: "overlay" } }, quickRepliesToShow.map(function (item) { return (react_1["default"].createElement(ListItem_1["default"], { button: true, key: item.quickreplyid, onClick: function () { return handlerClickItem(item); } },
                        react_1["default"].createElement(Tooltip_1["default"], { title: item.quickreply, arrow: true, placement: "top" },
                            react_1["default"].createElement(ListItemText_1["default"], { primary: item.description })))); }))))))));
};
var RecordComponent = function (_a) {
    var startRecording = _a.startRecording, setStartRecording = _a.setStartRecording, record = _a.record, setRecord = _a.setRecord;
    var _b = react_1.useState(false), uploadAudio = _b[0], setUploadAudio = _b[1];
    var _c = react_1.useState(false), eraseAudio = _c[0], setEraseAudio = _c[1];
    var _d = react_1.useState(false), previousRecord = _d[0], setPreviousRecord = _d[1];
    var dispatch = react_redux_1.useDispatch();
    var ticketSelected = hooks_1.useSelector(function (state) { return state.inbox.ticketSelected; });
    var uploadResult = hooks_1.useSelector(function (state) { return state.main.uploadFile; });
    var recorderControls = react_audio_voice_recorder_1.useAudioRecorder({
        noiseSuppression: true,
        echoCancellation: true
    }, function (err) { return console.table(err); } // onNotAllowedOrFound
    );
    react_1.useEffect(function () {
        if (startRecording) {
            setRecord(null);
            recorderControls.startRecording();
        }
    }, [startRecording]);
    react_1.useEffect(function () {
        if (recorderControls.isRecording) {
            if (recorderControls.isRecording) {
                var myElement = document.querySelector(".audio-recorder");
                var childNodes = myElement === null || myElement === void 0 ? void 0 : myElement.childNodes;
                if (childNodes) {
                    if (childNodes[0])
                        childNodes[0].style.display = "none";
                    if (childNodes[3])
                        childNodes[3].style.display = "none";
                    if (childNodes[4])
                        childNodes[4].style.display = "none";
                }
            }
        }
    }, [recorderControls.isRecording]);
    react_1.useEffect(function () {
        if (uploadAudio) {
            if (!uploadResult.loading && !uploadResult.error) {
                setUploadAudio(false);
                setRecord({
                    id: "audio",
                    type: "audio",
                    url: (uploadResult === null || uploadResult === void 0 ? void 0 : uploadResult.url) || ""
                });
                console.log(uploadResult === null || uploadResult === void 0 ? void 0 : uploadResult.url);
                setStartRecording(false);
            }
        }
    }, [uploadAudio, uploadResult]);
    react_1.useEffect(function () {
        if (previousRecord) {
            uploadAudioBlob(recorderControls.recordingBlob);
        }
    }, [recorderControls.recordingBlob]);
    function uploadAudioBlob(blob) {
        var fd = new FormData();
        var reader = new FileReader();
        reader.readAsArrayBuffer(blob);
        reader.onload = function () {
            var audioBlob = new Blob([blob], { type: "audio/mp3" });
            var currentDate = new Date();
            var timestamp = currentDate.getFullYear() + "-" + ("0" + (currentDate.getMonth() + 1)).slice(-2) + "-" + ("0" + currentDate.getDate()).slice(-2) + "_" + ("0" + currentDate.getHours()).slice(-2) + "-" + ("0" + currentDate.getMinutes()).slice(-2) + "-" + ("0" + currentDate.getSeconds()).slice(-2);
            fd.append("file", audioBlob, "audio_" + ((ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.ticketnum) || "") + "_" + timestamp + ".mp3");
            fd.append("convert", true);
            dispatch(actions_2.uploadFile(fd));
            recorderControls.stopRecording();
            setUploadAudio(true);
        };
    }
    var saveAudio = function (blob) {
        if (eraseAudio) {
            setEraseAudio(false);
            setStartRecording(false);
        }
        else {
            if (!previousRecord) {
                setPreviousRecord(true);
                uploadAudioBlob(blob);
            }
        }
    };
    if (uploadResult.loading) {
        return react_1["default"].createElement(CircularProgress_1["default"], { color: "inherit" });
    }
    if (!record) {
        return (react_1["default"].createElement("div", { style: { display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" } },
            react_1["default"].createElement("div", { style: {
                    display: "flex",
                    backgroundColor: "#ebebeb",
                    borderRadius: 20,
                    boxShadow: "0 2px 5px #bebebe"
                } },
                recorderControls.isPaused ? (react_1["default"].createElement(IconButton_1["default"], { onClick: function () {
                        recorderControls.togglePauseResume();
                    } },
                    react_1["default"].createElement(PlayArrow_1["default"], null))) : (react_1["default"].createElement(IconButton_1["default"], { onClick: function () {
                        recorderControls.togglePauseResume();
                    } },
                    react_1["default"].createElement(Pause_1["default"], null))),
                react_1["default"].createElement(react_audio_voice_recorder_1.AudioRecorder, { onRecordingComplete: function (blob) { return saveAudio(blob); }, audioTrackConstraints: {
                        noiseSuppression: true,
                        echoCancellation: true
                    }, onNotAllowedOrFound: function (err) { return console.table(err); }, recorderControls: recorderControls, downloadFileExtension: "webm", showVisualizer: true, mediaRecorderOptions: {
                        audioBitsPerSecond: 128000
                    } }),
                react_1["default"].createElement(IconButton_1["default"], { onClick: function () {
                        recorderControls.stopRecording();
                    } },
                    react_1["default"].createElement(Stop_1["default"], null))),
            react_1["default"].createElement(IconButton_1["default"], { onClick: function () {
                    setEraseAudio(true);
                    recorderControls.stopRecording();
                } },
                react_1["default"].createElement(Delete_1["default"], null))));
    }
    return (react_1["default"].createElement("div", { style: { display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" } },
        react_1["default"].createElement("audio", { controls: true },
            react_1["default"].createElement("source", { src: record === null || record === void 0 ? void 0 : record.url, type: "audio/mp3" })),
        react_1["default"].createElement(IconButton_1["default"], { onClick: function () {
                setRecord(null);
            } },
            react_1["default"].createElement(Delete_1["default"], null))));
};
var RecordAudioIcon = function (_a) {
    var classes = _a.classes, startRecording = _a.startRecording, setStartRecording = _a.setStartRecording, setRecord = _a.setRecord;
    var t = react_i18next_1.useTranslation().t;
    var handleClick = function () {
        setStartRecording(!startRecording);
    };
    return (react_1["default"].createElement("div", { style: { display: "flex" } },
        react_1["default"].createElement(Tooltip_1["default"], { title: t(keys_1.langKeys.record_audio), arrow: true, placement: "top" }, startRecording ? (react_1["default"].createElement(icons_1.RecordingIcon, { className: classes.iconResponse, onClick: handleClick, style: { width: 22, height: 22 } })) : (react_1["default"].createElement(icons_1.RecordIcon, { className: classes.iconResponse, onClick: handleClick, style: { width: 28, height: 28 } })))));
};
var CopilotLaraigoIcon = function (_a) {
    var classes = _a.classes, enabled = _a.enabled;
    var t = react_i18next_1.useTranslation().t;
    //{t(langKeys.currentlanguage) === "en" ? <FormatBoldIcon className={classes.root} /> : <BoldNIcon className={classes.root} style={{ width: 18, height: 18 }} />}
    return (react_1["default"].createElement("div", { style: { display: "flex" } },
        react_1["default"].createElement(Tooltip_1["default"], { title: "Copilot Laraigo", arrow: true, placement: "top" },
            react_1["default"].createElement(IconButton_1["default"], { size: "small", disabled: !enabled }, t(keys_1.langKeys.currentlanguage) === "en" ?
                react_1["default"].createElement(icons_1.CopilotIconEng, { className: enabled ? classes.iconResponse : "", style: { width: 22, height: 22 } }) :
                react_1["default"].createElement(icons_1.CopilotIconEsp, { className: enabled ? classes.iconResponse : "", style: { width: 22, height: 22 } })))));
};
var TmpRichResponseIcon = function (_a) {
    var classes = _a.classes, setText = _a.setText;
    var _b = react_1["default"].useState(false), open = _b[0], setOpen = _b[1];
    var dispatch = react_redux_1.useDispatch();
    var t = react_i18next_1.useTranslation().t;
    var _c = react_1.useState([]), richResponseToShow = _c[0], setRichResponseToShow = _c[1];
    var handleClick = function () { return setOpen(function (prev) { return !prev; }); };
    var _d = react_1.useState(false), showSearch = _d[0], setShowSearch = _d[1];
    var _e = react_1.useState(""), search = _e[0], setSearch = _e[1];
    var agentSelected = hooks_1.useSelector(function (state) { return state.inbox.agentSelected; });
    var userType = hooks_1.useSelector(function (state) { return state.inbox.userType; });
    var ticketSelected = hooks_1.useSelector(function (state) { return state.inbox.ticketSelected; });
    var richResponseList = hooks_1.useSelector(function (state) { return state.inbox.richResponseList.data; });
    var handleClickAway = function () { return setOpen(false); };
    react_1.useEffect(function () {
        setRichResponseToShow(richResponseList);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [richResponseList]);
    react_1.useEffect(function () {
        if (search === "") {
            setRichResponseToShow(richResponseList);
        }
        else {
            setRichResponseToShow(richResponseList.filter(function (x) { return x.title.toLowerCase().includes(search.toLowerCase()); }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);
    var reasignTicket = react_1["default"].useCallback(function () {
        dispatch(actions_1.reassignTicket(__assign(__assign({}, ticketSelected), { newUserId: 0, newUserGroup: "", observation: "Reassigned from supervisor", newConversation: true, wasanswered: (ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.isAnswered) || false })));
        dispatch(actions_1.emitEvent({
            event: "reassignTicket",
            data: __assign(__assign({}, ticketSelected), { userid: agentSelected === null || agentSelected === void 0 ? void 0 : agentSelected.userid, newuserid: 0 })
        }));
    }, [dispatch, ticketSelected, agentSelected]);
    var handlerClickItem = function (block) {
        setOpen(false);
        var parameters = {
            fullid: block.chatblockid + "_" + block.blockid,
            p_communicationchannelid: ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.communicationchannelid,
            p_conversationid: ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.conversationid,
            p_personid: ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.personid,
            p_communicationchanneltype: ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.communicationchanneltype,
            p_personcommunicationchannel: ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.personcommunicationchannel,
            p_messagesourcekey1: ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.personcommunicationchannel,
            p_communicationchannelsite: ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.communicationchannelsite,
            p_ticketnum: ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.ticketnum
        };
        dispatch(actions_1.triggerBlock(parameters));
        if (userType === "SUPERVISOR")
            reasignTicket();
    };
    return (react_1["default"].createElement(ClickAwayListener_1["default"], { onClickAway: handleClickAway },
        react_1["default"].createElement("div", { style: { display: "flex" } },
            react_1["default"].createElement(Tooltip_1["default"], { title: t(keys_1.langKeys.send_enrich_response), arrow: true, placement: "top" },
                react_1["default"].createElement(icons_1.SendToBlockIcon, { className: classes.iconResponse, onClick: handleClick, style: { width: 22, height: 22 } })),
            open && (react_1["default"].createElement("div", { style: {
                    position: "absolute",
                    bottom: 60,
                    zIndex: 1201
                } },
                react_1["default"].createElement("div", { className: classes.containerQuickReply2 },
                    react_1["default"].createElement("div", null, !showSearch ? (react_1["default"].createElement("div", { className: classes.headerQuickReply },
                        react_1["default"].createElement("div", null, t(keys_1.langKeys.sentoblock)),
                        react_1["default"].createElement(IconButton_1["default"], { size: "small", onClick: function () { return setShowSearch(true); }, edge: "end" },
                            react_1["default"].createElement(icons_1.SearchIcon, null)))) : (react_1["default"].createElement(TextField_1["default"], { color: "primary", fullWidth: true, autoFocus: true, placeholder: "Search quickreplies", style: { padding: "6px 6px 6px 12px" }, onBlur: function () { return !search && setShowSearch(false); }, onChange: function (e) { return setSearch(e.target.value); }, InputProps: {
                            endAdornment: (react_1["default"].createElement(InputAdornment_1["default"], { position: "end" },
                                react_1["default"].createElement(IconButton_1["default"], { size: "small" },
                                    react_1["default"].createElement(icons_1.SearchIcon, null))))
                        } }))),
                    react_1["default"].createElement(Divider_1["default"], null),
                    react_1["default"].createElement(List_1["default"], { component: "nav", disablePadding: true, style: { maxHeight: 200, width: "100%", overflowY: "overlay" } }, richResponseToShow.map(function (item) { return (react_1["default"].createElement(ListItem_1["default"], { button: true, key: item.blockid, onClick: function () { return handlerClickItem(item); } },
                        react_1["default"].createElement(ListItemText_1["default"], { primary: item.blocktitle }))); }))))))));
};
var SmallAvatar = styles_1.styled(Avatar_1["default"])(function () { return ({
    width: 22,
    backgroundColor: "#0ac630",
    height: 22,
    fontSize: 12
}); });
var BottomGoToUnder = function () {
    var dispatch = react_redux_1.useDispatch();
    var isOnBottom = hooks_1.useSelector(function (state) { return state.inbox.isOnBottom; });
    var boolShowGoToBottom = hooks_1.useSelector(function (state) { return state.inbox.showGoToBottom; });
    var triggerNewMessageClient = hooks_1.useSelector(function (state) { return state.inbox.triggerNewMessageClient; });
    var _a = react_1.useState(0), countNewMessage = _a[0], setCountNewMessage = _a[1];
    react_1.useEffect(function () {
        if (triggerNewMessageClient !== null) {
            if (isOnBottom || isOnBottom === null)
                dispatch(actions_1.goToBottom(isOnBottom ? null : true));
            else
                setCountNewMessage(countNewMessage + 1);
        }
    }, [triggerNewMessageClient]);
    react_1.useEffect(function () {
        if (isOnBottom) {
            dispatch(actions_1.showGoToBottom(false));
            setCountNewMessage(0);
        }
    }, [isOnBottom]);
    if (!boolShowGoToBottom || isOnBottom)
        return null;
    return (react_1["default"].createElement("div", { style: { position: "absolute", right: 20, top: -60 } },
        react_1["default"].createElement(Badge_1["default"], { overlap: "circular", anchorOrigin: { vertical: "top", horizontal: "right" }, badgeContent: countNewMessage > 0 && react_1["default"].createElement(SmallAvatar, null, countNewMessage) },
            react_1["default"].createElement(Fab_1["default"], { size: "small", onClick: function () { return dispatch(actions_1.goToBottom(isOnBottom ? null : true)); } },
                react_1["default"].createElement(DoubleArrow_1["default"], { style: { color: "#2e2c34ba", transform: "rotate(90deg)", width: 20, height: 20 } })))));
};
var ReplyPanel = function (_a) {
    var _b, _c, _d;
    var _e;
    var classes = _a.classes;
    var dispatch = react_redux_1.useDispatch();
    var t = react_i18next_1.useTranslation().t;
    var ticketSelected = hooks_1.useSelector(function (state) { return state.inbox.ticketSelected; });
    var listAllowRecords = ["FBDM", "FBMS", "WHA", "INDM", "INMS"];
    var _f = react_1.useState({ cc: false, cco: false, error: false }), copyEmails = _f[0], setCopyEmails = _f[1];
    var resReplyTicket = hooks_1.useSelector(function (state) { return state.inbox.triggerReplyTicket; });
    var _g = react_1.useState(false), triggerReply = _g[0], settriggerReply = _g[1];
    var _h = react_1.useState(0), lastSelection = _h[0], setLastSelection = _h[1];
    var variablecontext = hooks_1.useSelector(function (state) { var _a; return (_a = state.inbox.person.data) === null || _a === void 0 ? void 0 : _a.variablecontext; });
    var agentSelected = hooks_1.useSelector(function (state) { return state.inbox.agentSelected; });
    var user = hooks_1.useSelector(function (state) { return state.login.validateToken.user; });
    var richResponseList = hooks_1.useSelector(function (state) { return state.inbox.richResponseList; });
    var userType = hooks_1.useSelector(function (state) { return state.inbox.userType; });
    var _j = react_1.useState(""), text = _j[0], setText = _j[1];
    var _k = react_1.useState(null), previousTicket = _k[0], setpreviousTicket = _k[1];
    var _l = react_1.useState([]), files = _l[0], setFiles = _l[1];
    var _m = react_1.useState(false), startRecording = _m[0], setStartRecording = _m[1];
    var _o = react_1.useState(null), record = _o[0], setRecord = _o[1];
    var multiData = hooks_1.useSelector(function (state) { return state.main.multiData; });
    var groupInteractionList = hooks_1.useSelector(function (state) { return state.inbox.interactionList; });
    var _p = react_1.useState(""), typeHotKey = _p[0], setTypeHotKey = _p[1];
    var quickReplies = hooks_1.useSelector(function (state) { return state.inbox.quickreplies; });
    var innapropiateWords = hooks_1.useSelector(function (state) { return state.inbox.inappropriateWords; });
    var _q = react_1.useState([]), emojiNoShow = _q[0], setemojiNoShow = _q[1];
    var _r = react_1.useState(false), propertyCopilotLaraigo = _r[0], setPropertyCopilotLaraigo = _r[1];
    var _s = react_1.useState([]), emojiFavorite = _s[0], setemojiFavorite = _s[1];
    var _t = react_1.useState([]), inappropiatewordsList = _t[0], setinnappropiatewordsList = _t[1];
    // const [inappropiatewords, setinnappropiatewords] = useState<string[]>([])
    var _u = react_1.useState([]), quickRepliesToShow = _u[0], setquickRepliesToShow = _u[1];
    var _v = react_1.useState([]), richResponseToShow = _v[0], setRichResponseToShow = _v[1];
    var _w = react_1.useState(true), showReply = _w[0], setShowReply = _w[1];
    var _x = react_1.useState(null), fileimage = _x[0], setfileimage = _x[1];
    var _y = react_1.useState(1.5), numRows = _y[0], setNumRows = _y[1];
    var _z = react_1.useState([
        { type: "paragraph", align: "left", children: [{ text: "" }] },
    ]), bodyobject = _z[0], setBodyobject = _z[1];
    var allowRecording = listAllowRecords.some(function (record) { var _a; return (_a = ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.communicationchanneltype) === null || _a === void 0 ? void 0 : _a.includes(record); }) && ((_e = user === null || user === void 0 ? void 0 : user.properties) === null || _e === void 0 ? void 0 : _e.enable_send_audio);
    var lock_send_file_pc = hooks_1.useSelector(function (state) { var _a, _b; return (_b = (_a = state.login.validateToken.user) === null || _a === void 0 ? void 0 : _a.properties) === null || _b === void 0 ? void 0 : _b.lock_send_file_pc; });
    var _0 = react_1.useState(1), refresh = _0[0], setrefresh = _0[1];
    var _1 = react_1.useState(false), flagundo = _1[0], setflagundo = _1[1];
    var _2 = react_1.useState(false), flagredo = _2[0], setflagredo = _2[1];
    var _3 = react_1.useState([]), undotext = _3[0], setundotext = _3[1];
    var _4 = react_1.useState([]), redotext = _4[0], setredotext = _4[1];
    var inputRef = react_1.useRef(null);
    react_1.useEffect(function () {
        var _a;
        if ((ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.conversationid) !== (previousTicket === null || previousTicket === void 0 ? void 0 : previousTicket.conversationid))
            setpreviousTicket(ticketSelected);
        if ((ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.status) !== "ASIGNADO") {
            setShowReply(false);
        }
        else if (("," + (user === null || user === void 0 ? void 0 : user.roledesc) + ",").includes(",SUPERVISOR,") &&
            (user === null || user === void 0 ? void 0 : user.properties.environment) === "CLARO" &&
            [2, 3].includes((_a = agentSelected === null || agentSelected === void 0 ? void 0 : agentSelected.userid) !== null && _a !== void 0 ? _a : 0)) {
            //2 y 3 son BOT y HOLDING
            setShowReply(null);
        }
        else if (channelsWhatsapp.includes(ticketSelected.communicationchanneltype)) {
            if (!(ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.personlastreplydate)) {
                setShowReply(false);
            }
            else {
                var hoursWaiting = functions_1.getSecondsUntelNow(functions_1.convertLocalDate(ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.personlastreplydate)) / 3600;
                if (hoursWaiting >= 24) {
                    setShowReply(false);
                }
                else {
                    setShowReply(true);
                }
            }
        }
        else {
            setShowReply(true);
        }
    }, [ticketSelected]);
    react_1.useEffect(function () {
        if ((ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.communicationchanneltype) === "MAIL") {
            setBodyobject([{ type: "paragraph", align: "left", children: [{ text: "" }] }]);
            setText(RichText_1.renderToString(RichText_1.toElement([{ type: "paragraph", align: "left", children: [{ text: "" }] }])));
            setrefresh(refresh * -1);
        }
        else {
            setText("");
            setBodyobject([{ type: "paragraph", align: "left", children: [{ text: "" }] }]);
        }
    }, [previousTicket]);
    react_1.useEffect(function () {
        if (triggerReply) {
            if (!resReplyTicket.loading) {
                if (resReplyTicket.error) {
                    var errormessage = t(resReplyTicket.code || "error_unexpected_error", {
                        module: t(keys_1.langKeys.user).toLocaleLowerCase()
                    });
                    dispatch(actions_3.showSnackbar({ show: true, severity: "error", message: errormessage }));
                    settriggerReply(false);
                }
                else {
                    dispatch(actions_1.updateInteractionByUUID({ uuid: resReplyTicket.uuid || "", interactionid: resReplyTicket.interactionid || 0 }));
                }
            }
        }
    }, [resReplyTicket, triggerReply]);
    react_1.useEffect(function () {
        if (!flagundo) {
            if (!flagredo) {
                setredotext([]);
            }
            setundotext(__spreadArrays(undotext, [bodyobject]));
        }
        if ((ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.communicationchanneltype) === "MAIL") {
            setText(RichText_1.renderToString(RichText_1.toElement(bodyobject)));
        }
    }, [bodyobject]);
    react_1.useEffect(function () {
        if (flagundo) {
            setflagundo(false);
        }
    }, [undotext]);
    react_1.useEffect(function () {
        if (flagredo) {
            setflagredo(false);
        }
    }, [redotext]);
    var reasignTicket = react_1["default"].useCallback(function () {
        dispatch(actions_1.reassignTicket(__assign(__assign({}, ticketSelected), { newUserId: 0, newUserGroup: "", observation: "Reassigned from supervisor", newConversation: true, wasanswered: true })));
        dispatch(actions_1.emitEvent({
            event: "reassignTicket",
            data: __assign(__assign({}, ticketSelected), { userid: agentSelected === null || agentSelected === void 0 ? void 0 : agentSelected.userid, newuserid: 0 })
        }));
    }, [dispatch, ticketSelected, agentSelected]);
    function findDefaultAnswer(array, searchString) {
        var found = array.find(function (item) { return searchString.includes(item.description.toLocaleLowerCase()); });
        return found ? found.defaultanswer : "";
    }
    var triggerReplyMessage = function () {
        if (copyEmails.error)
            return;
        setNumRows(2);
        var callback = function () {
            var _a;
            var wasSend = false;
            if (files.length > 0 && (ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.communicationchanneltype) !== "MAIL") {
                var listMessages = files.map(function (x) { return (__assign(__assign({}, ticketSelected), { interactiontype: x.type, validateUserOnTicket: userType === "AGENT", interactiontext: x.url })); });
                wasSend = true;
                settriggerReply(true);
                dispatch(actions_1.replyTicket(listMessages, true));
                if (files.length > 0) {
                    files.forEach(function (x, i) {
                        var newInteractionSocket = __assign(__assign({}, ticketSelected), { interactionid: 0, typemessage: x.type, typeinteraction: null, lastmessage: x.url, createdate: new Date().toISOString(), userid: 0, usertype: "agent", ticketWasAnswered: !(ticketSelected.isAnswered || i > 0), isAnswered: !(ticketSelected.isAnswered || i > 0) });
                        if (userType === "AGENT") {
                            dispatch(actions_1.emitEvent({
                                event: "newMessageFromAgent",
                                data: newInteractionSocket
                            }));
                        }
                    });
                    setFiles([]);
                }
            }
            if (record && (ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.communicationchanneltype) !== "MAIL") {
                var listMessages = [
                    __assign(__assign({}, ticketSelected), { interactiontype: "audio", validateUserOnTicket: userType === "AGENT", interactiontext: record.url }),
                ];
                wasSend = true;
                settriggerReply(true);
                dispatch(actions_1.replyTicket(listMessages, true));
                var newInteractionSocket = __assign(__assign({}, ticketSelected), { interactionid: 0, typemessage: "audio", typeinteraction: null, lastmessage: record.url, createdate: new Date().toISOString(), userid: 0, usertype: "agent", ticketWasAnswered: !ticketSelected.isAnswered, isAnswered: !ticketSelected.isAnswered });
                if (userType === "AGENT") {
                    dispatch(actions_1.emitEvent({
                        event: "newMessageFromAgent",
                        data: newInteractionSocket
                    }));
                }
                setRecord(null);
            }
            if (text) {
                var textCleaned = text;
                if ((ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.communicationchanneltype) === "MAIL" && ((_a = groupInteractionList.data[0]) === null || _a === void 0 ? void 0 : _a.interactiontext)) {
                    textCleaned = ("Re: " +
                        groupInteractionList.data[0].interactiontext.split("&%MAIL%&")[0] +
                        "&%MAIL%&" +
                        text).trim();
                    var fileobj = files.reduce(function (acc, item, i) {
                        var _a;
                        return (__assign(__assign({}, acc), (_a = {}, _a[String(item.url.split("/").pop() === "tenor.gif"
                            ? "tenor" + i + ".gif"
                            : item.url.split("/").pop())] = item.url, _a)));
                    }, {});
                    textCleaned = textCleaned + "&%MAIL%&" + JSON.stringify(fileobj);
                    setFiles([]);
                }
                var errormessage = findDefaultAnswer(inappropiatewordsList, textCleaned.toLocaleLowerCase());
                debugger;
                if (textCleaned) {
                    if (!errormessage) {
                        var uuid = functions_1.uuidv4();
                        wasSend = true;
                        var newInteractionSocket = __assign(__assign({}, ticketSelected), { interactionid: 0, typemessage: (ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.communicationchanneltype) === "MAIL" ? "email" : "text", typeinteraction: null, uuid: uuid, lastmessage: textCleaned, createdate: new Date().toISOString(), userid: 0, usertype: "agent", ticketWasAnswered: !ticketSelected.isAnswered });
                        if (userType === "AGENT") {
                            dispatch(actions_1.emitEvent({
                                event: "newMessageFromAgent",
                                data: newInteractionSocket
                            }));
                        }
                        //send to answer with integration
                        settriggerReply(true);
                        dispatch(actions_1.replyTicket(__assign(__assign({}, ticketSelected), { interactiontype: (ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.communicationchanneltype) === "MAIL" ? "email" : "text", interactiontext: textCleaned, uuid: uuid, validateUserOnTicket: userType === "AGENT", isAnswered: !ticketSelected.isAnswered, emailcocopy: copyEmails.cco || "", emailcopy: copyEmails.cc || "" })));
                        setText("");
                        setrefresh(refresh * -1);
                        setBodyobject([{ type: "paragraph", align: "left", children: [{ text: "" }] }]);
                    }
                    else {
                        dispatch(actions_3.showSnackbar({ show: true, severity: "error", message: errormessage }));
                    }
                }
            }
            if (wasSend && userType === "SUPERVISOR")
                reasignTicket();
        };
        if (userType === "SUPERVISOR") {
            dispatch(actions_3.manageConfirmation({
                visible: true,
                question: t(keys_1.langKeys.confirmation_reasign_with_reply),
                callback: callback
            }));
        }
        else {
            callback();
        }
    };
    var _5 = react_1["default"].useState(false), openDialogHotKey = _5[0], setOpenDialogHotKey = _5[1];
    var handleClickAway = function () { return setOpenDialogHotKey(false); };
    react_1.useEffect(function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (!multiData.loading && !multiData.error && (multiData === null || multiData === void 0 ? void 0 : multiData.data[4])) {
            setemojiNoShow(((_b = (_a = multiData === null || multiData === void 0 ? void 0 : multiData.data) === null || _a === void 0 ? void 0 : _a[10]) === null || _b === void 0 ? void 0 : _b.data.filter(function (x) { return x.restricted; }).map(function (x) { return x.emojihex; })) || []);
            setemojiFavorite(((_d = (_c = multiData === null || multiData === void 0 ? void 0 : multiData.data) === null || _c === void 0 ? void 0 : _c[10]) === null || _d === void 0 ? void 0 : _d.data.filter(function (x) { return x.favorite; }).map(function (x) { return x.emojihex; })) || []);
            setPropertyCopilotLaraigo(((_h = (_g = (_f = (_e = multiData === null || multiData === void 0 ? void 0 : multiData.data) === null || _e === void 0 ? void 0 : _e.find(function (x) { return x.key === "UFN_PROPERTY_SELBYNAMECOPILOTLARAIGO"; })) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.propertyvalue) === "1");
            // setinnappropiatewords(multiData?.data[11].data.filter(x => (x.status === "ACTIVO")).map(y => (y.description)) || [])
        }
    }, [multiData]);
    react_1.useEffect(function () {
        var ismail = (ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.communicationchanneltype) === "MAIL";
        var favoritequickreplies = quickReplies.data.filter(function (x) { return x.favorite; });
        setquickRepliesToShow(ismail ? favoritequickreplies.filter(function (x) { return x.quickreply_type === "CORREO ELECTRONICO"; }) : favoritequickreplies.filter(function (x) { return x.quickreply_type !== "CORREO ELECTRONICO"; }) || []);
    }, [quickReplies, ticketSelected]);
    react_1.useEffect(function () {
        if (text.substring(0, 2).toLowerCase() === "\\q") {
            var ismail = (ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.communicationchanneltype) === "MAIL";
            var quickreplyFiltered = ismail ? quickReplies.data.filter(function (x) { return x.quickreply_type === "CORREO ELECTRONICO"; }) : quickReplies.data.filter(function (x) { return x.quickreply_type !== "CORREO ELECTRONICO"; }) || [];
            setTypeHotKey("quickreply");
            setOpenDialogHotKey(true);
            var textToSearch_1 = text.trim().split(text.trim().includes("\\q") ? "\\q" : "\\Q")[1];
            if (textToSearch_1 === "")
                setquickRepliesToShow(quickreplyFiltered.filter(function (x) { return x.favorite; }));
            else
                setquickRepliesToShow(quickreplyFiltered.filter(function (x) { return x.description.toLowerCase().includes(textToSearch_1.toLowerCase()); }));
        }
        else if (text.substring(0, 2).toLowerCase() === "\\r") {
            setTypeHotKey("richresponse");
            setOpenDialogHotKey(true);
            var textToSearch_2 = text.trim().split(text.trim().includes("\\r") ? "\\r" : "\\R")[1];
            if (textToSearch_2 === "")
                setRichResponseToShow(richResponseList.data);
            else
                setRichResponseToShow(richResponseList.data.filter(function (x) { return x.title.toLowerCase().includes(textToSearch_2.toLowerCase()); }));
        }
        else {
            setOpenDialogHotKey(false);
        }
    }, [text]);
    var selectQuickReply = function (value) {
        var variablesList = value.match(/({{)(.*?)(}})/g) || [];
        var myquickreply = value
            .replace("{{numticket}}", "" + (ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.ticketnum))
            .replace("{{client_name}}", "" + (ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.displayname))
            .replace("{{agent_name}}", (user === null || user === void 0 ? void 0 : user.firstname) + " " + (user === null || user === void 0 ? void 0 : user.lastname))
            .replace("{{user_group}}", (ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.usergroup) || "");
        variablesList.forEach(function (x) {
            var variableData = variablecontext === null || variablecontext === void 0 ? void 0 : variablecontext[x.substring(2, x.length - 2)];
            if (!!variableData) {
                myquickreply = myquickreply.replaceAll(x, variableData.Value);
            }
            else {
                myquickreply = myquickreply.replaceAll(x, "");
            }
        });
        setText(myquickreply);
    };
    var handleKeyPress = function (event) {
        var _a, _b, _c;
        if (event.ctrlKey && event.code === 'Enter') {
            setText(function (prevText) { return prevText + '\n'; });
            event.preventDefault();
        }
        else if (event.shiftKey) {
            console.log("");
            return;
        }
        else if ((((_a = user === null || user === void 0 ? void 0 : user.languagesettings) === null || _a === void 0 ? void 0 : _a.sendingmode) === "Default" && event.key === 'Enter') ||
            (((_b = user === null || user === void 0 ? void 0 : user.languagesettings) === null || _b === void 0 ? void 0 : _b.sendingmode) === "EnterKey" && event.code === 'Enter')) {
            event.preventDefault();
            if ((text.trim() || files.length > 0) && ((_c = user === null || user === void 0 ? void 0 : user.languagesettings) === null || _c === void 0 ? void 0 : _c.sendingmode) !== "ExecutionButton") {
                triggerReplyMessage();
            }
        }
    };
    var handleSelectionChange = function (event) {
        var _a, _b;
        setLastSelection((_b = (_a = event === null || event === void 0 ? void 0 : event.target) === null || _a === void 0 ? void 0 : _a.selectionEnd) !== null && _b !== void 0 ? _b : 0);
    };
    function onPasteTextbar(e) {
        if (!lock_send_file_pc && e.clipboardData.files.length) {
            e.preventDefault();
            if (e.clipboardData.files[0].type.includes("image")) {
                //uploadFile
                setfileimage(e.clipboardData.files);
            }
        }
    }
    var toggleTextStyle = function (style) {
        var _a;
        var input = inputRef.current.querySelector('textarea');
        var value = input.value, selectionStart = input.selectionStart, selectionEnd = input.selectionEnd;
        var selectedText = value.slice(selectionStart, selectionEnd);
        var beforeText = value.slice(0, selectionStart);
        var afterText = value.slice(selectionEnd);
        var newText = selectedText;
        if (selectedText) {
            var textWithStyle = helpers_1.formatTextToUnicode((_a = { text: selectedText }, _a[style] = true, _a));
            var textWithoutStyle = helpers_1.removeUnicodeStyle(selectedText, style);
            if (style === 'underline' || style === 'strikethrough') {
                var regex = new RegExp("[\\u0332\\u0336]", 'g');
                textWithoutStyle = selectedText.replace(regex, '');
                if (selectedText === textWithoutStyle) {
                    newText = textWithStyle;
                }
                else {
                    newText = textWithoutStyle;
                }
            }
            else {
                if (selectedText === textWithStyle) {
                    newText = textWithoutStyle;
                }
                else {
                    newText = textWithStyle;
                }
            }
            var newValue = "" + beforeText + newText + afterText;
            setText(newValue);
            var selectionLengthDiff = newText.length - selectedText.length;
            var newSelectionStart_1 = selectionStart;
            var newSelectionEnd_1 = selectionEnd + selectionLengthDiff;
            setTimeout(function () {
                input.setSelectionRange(newSelectionStart_1, newSelectionEnd_1);
                input.focus();
            }, 0);
        }
        else {
            var newValue = value;
            setText(newValue);
        }
    };
    var handleKeyDown = function (event) {
        var _a;
        if ((event.altKey || ((_a = user === null || user === void 0 ? void 0 : user.languagesettings) === null || _a === void 0 ? void 0 : _a.sendingmode) === "ExecutionButton") && event.key === 'Enter') {
            event.preventDefault();
            setText(text + '\n');
        }
    };
    var isTextEmptyOrWhitespace = function (text) {
        return text.trim() === '';
    };
    if ((ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.communicationchanneltype) === "MAIL") {
        return (react_1["default"].createElement("div", { className: classes.containerResponse },
            showReply ? (react_1["default"].createElement("div", null,
                files.length > 0 && (react_1["default"].createElement("div", { style: {
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                        borderBottom: "1px solid #EBEAED",
                        paddingBottom: 8
                    } }, files.map(function (item) { return (react_1["default"].createElement(ItemFile, { key: item.id, item: item, setFiles: setFiles })); }))),
                react_1["default"].createElement("div", { style: { alignItems: "center" } },
                    react_1["default"].createElement(ClickAwayListener_1["default"], { onClickAway: handleClickAway },
                        react_1["default"].createElement("div", null,
                            react_1["default"].createElement(MailRecipients_1["default"], { setCopyEmails: setCopyEmails }),
                            react_1["default"].createElement(RichText_1.RichText, { style: { width: "100%" }, value: bodyobject, onChange: setBodyobject, positionEditable: "top", spellCheck: true, onKeyPress: handleKeyPress, quickReplies: quickReplies.data.filter(function (x) { return x.quickreply_type === "CORREO ELECTRONICO"; }), refresh: refresh, placeholder: "Send your message...", emojiNoShow: emojiNoShow, emoji: true, emojiFavorite: emojiFavorite, setFiles: setFiles, collapsed: true, endinput: react_1["default"].createElement("div", { style: { display: "block" } },
                                    react_1["default"].createElement("div", { style: { marginLeft: "auto", marginRight: 0 }, className: clsx_1["default"](classes.iconSend, (_b = {},
                                            _b[classes.iconSendDisabled] = !(RichText_1.renderToString(RichText_1.toElement(bodyobject)) !==
                                                "<div data-reactroot=\"\"><p><span></span></p></div>" ||
                                                files.filter(function (x) { return x.url; }).length > 0),
                                            _b)), onClick: triggerReplyMessage },
                                        react_1["default"].createElement(icons_1.SendIcon, null))) },
                                react_1["default"].createElement(components_1.GifPickerZyx, { onSelect: function (url) {
                                        return setFiles(function (p) { return __spreadArrays(p, [
                                            { type: "image", url: url, id: new Date().toISOString() },
                                        ]); });
                                    } }),
                                react_1["default"].createElement(UploaderIcon, { classes: classes, setFiles: setFiles, initfile: fileimage, setfileimage: setfileimage })),
                            openDialogHotKey && (react_1["default"].createElement("div", { style: {
                                    position: "absolute",
                                    bottom: 100,
                                    left: 15,
                                    zIndex: 1201
                                } },
                                react_1["default"].createElement("div", { className: "scroll-style-go", style: {
                                        maxHeight: 200,
                                        display: "flex",
                                        gap: 4,
                                        flexDirection: "column"
                                    } }, typeHotKey === "quickreply"
                                    && quickRepliesToShow.map(function (item) { return (react_1["default"].createElement("div", { key: item.quickreplyid, className: classes.hotKeyQuickReply, onClick: function () { return selectQuickReply(item.quickreply); } }, item.description)); }))))))))) : (react_1["default"].createElement("div", { style: {
                    whiteSpace: "break-spaces",
                    color: "rgb(251, 95, 95)",
                    fontWeight: 500,
                    textAlign: "center"
                } }, showReply == null ? t(keys_1.langKeys.no_reply_claro) : t(keys_1.langKeys.no_reply_use_hsm))),
            react_1["default"].createElement(BottomGoToUnder, null)));
    }
    else
        return (react_1["default"].createElement(react_1["default"].Fragment, null,
            showReply && (react_1["default"].createElement(DragDropFile_1["default"], { setFiles: setFiles, disabled: lock_send_file_pc },
                react_1["default"].createElement("div", { className: classes.containerResponse },
                    (record || startRecording) && (react_1["default"].createElement("div", { style: {
                            display: "flex"
                        } },
                        react_1["default"].createElement("div", { style: {
                                display: "flex",
                                width: "100%",
                                gap: 8,
                                flexWrap: "wrap",
                                borderBottom: "1px solid #EBEAED",
                                paddingBottom: 8
                            } },
                            react_1["default"].createElement(RecordComponent, { record: record, setRecord: setRecord, setStartRecording: setStartRecording, startRecording: startRecording })),
                        react_1["default"].createElement("div", { className: clsx_1["default"](classes.iconSend, (_c = {},
                                _c[classes.iconSendDisabled] = !(text ||
                                    files.filter(function (x) { return !!x.url; }).length > 0 ||
                                    record),
                                _c)), style: { marginTop: 12 }, onClick: triggerReplyMessage },
                            react_1["default"].createElement(icons_1.SendIcon, null)))),
                    files.length > 0 && (react_1["default"].createElement("div", { style: {
                            display: "flex",
                            gap: 8,
                            flexWrap: "wrap",
                            borderBottom: "1px solid #EBEAED",
                            paddingBottom: 8
                        } }, files.map(function (item) { return (react_1["default"].createElement(ItemFile, { key: item.id, item: item, setFiles: setFiles })); }))),
                    !record && !startRecording && (react_1["default"].createElement(ClickAwayListener_1["default"], { onClickAway: handleClickAway },
                        react_1["default"].createElement("div", null,
                            react_1["default"].createElement("div", { style: { display: "flex", alignItems: "flex-end" } },
                                react_1["default"].createElement(InputBase_1["default"], { id: "chat-input", fullWidth: true, value: text, onChange: function (e) { return setText(e.target.value); }, placeholder: t(keys_1.langKeys.send_your_message), onKeyPress: handleKeyPress, rows: numRows, multiline: true, onKeyDown: handleKeyDown, minRows: 1, maxRows: 6, inputProps: {
                                        'aria-label': 'naked',
                                        style: {
                                            maxHeight: '144px',
                                            overflow: 'auto'
                                        }
                                    }, onPaste: onPasteTextbar, onSelect: handleSelectionChange, ref: inputRef }),
                                react_1["default"].createElement("div", { style: { marginLeft: '1rem', marginBottom: '0.5rem' } }, !files.length && isTextEmptyOrWhitespace(text) && allowRecording ? (react_1["default"].createElement(RecordAudioIcon, { classes: classes, setRecord: setRecord, setStartRecording: setStartRecording, startRecording: startRecording })) : (react_1["default"].createElement("div", { className: clsx_1["default"](classes.iconSend, (_d = {},
                                        _d[classes.iconSendDisabled] = isTextEmptyOrWhitespace(text) && !(files.filter(function (x) { return Boolean(x.url); }).length > 0 || record),
                                        _d)), onClick: triggerReplyMessage },
                                    react_1["default"].createElement(icons_1.SendIcon, null))))),
                            openDialogHotKey && (react_1["default"].createElement("div", { style: {
                                    position: "absolute",
                                    bottom: 100,
                                    left: 15,
                                    zIndex: 1201
                                } },
                                react_1["default"].createElement("div", { className: "scroll-style-go", style: {
                                        maxHeight: 200,
                                        display: "flex",
                                        gap: 4,
                                        flexDirection: "column"
                                    } }, typeHotKey === "quickreply"
                                    && quickRepliesToShow.map(function (item) { return (react_1["default"].createElement("div", { key: item.quickreplyid, className: classes.hotKeyQuickReply, onClick: function () { return selectQuickReply(item.quickreply); } }, item.description)); }))))))),
                    !record && !startRecording && (react_1["default"].createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
                        react_1["default"].createElement("div", { style: { display: "flex", gap: 12, alignItems: "center" } },
                            react_1["default"].createElement(QuickReplyIcon, { classes: classes, setText: setText }),
                            react_1["default"].createElement(TmpRichResponseIcon, { classes: classes, setText: setText }),
                            react_1["default"].createElement(UploaderIcon, { classes: classes, setFiles: setFiles, initfile: fileimage, setfileimage: setfileimage }),
                            react_1["default"].createElement(components_1.EmojiPickerZyx, { emojisIndexed: EMOJISINDEXED, onSelect: function (e) {
                                    lastSelection < (text || "").length - 1
                                        ? setText(function (p) {
                                            return p.substring(0, lastSelection) +
                                                e.native +
                                                p.substring(lastSelection);
                                        })
                                        : setText(function (p) { return p + e.native; });
                                }, emojisNoShow: emojiNoShow, emojiFavorite: emojiFavorite }),
                            react_1["default"].createElement(components_1.GifPickerZyx, { onSelect: function (url) {
                                    return setFiles(function (p) { return __spreadArrays(p, [
                                        { type: "image", url: url, id: new Date().toISOString() },
                                    ]); });
                                } }),
                            react_1["default"].createElement(CopilotLaraigoIcon, { classes: classes, enabled: propertyCopilotLaraigo })),
                        react_1["default"].createElement("div", { style: { display: 'flex', gap: '0.7rem' } },
                            react_1["default"].createElement(Tooltip_1["default"], { title: String(t(keys_1.langKeys.bold)), arrow: true, placement: "top" },
                                react_1["default"].createElement(IconButton_1["default"], { onClick: function () { return toggleTextStyle('bold'); }, size: 'small' }, t(keys_1.langKeys.currentlanguage) === "en" ? react_1["default"].createElement(FormatBold_1["default"], { className: classes.root }) : react_1["default"].createElement(icons_1.BoldNIcon, { className: classes.root, style: { width: 18, height: 18 } }))),
                            react_1["default"].createElement(Tooltip_1["default"], { title: String(t(keys_1.langKeys.italic)), arrow: true, placement: "top" },
                                react_1["default"].createElement(IconButton_1["default"], { onClick: function () { return toggleTextStyle('italic'); }, size: 'small' }, t(keys_1.langKeys.currentlanguage) === "en" ? react_1["default"].createElement(FormatItalic_1["default"], { className: classes.root }) : react_1["default"].createElement(icons_1.ItalicKIcon, { className: classes.root, style: { width: 18, height: 18 } }))),
                            (ticketSelected === null || ticketSelected === void 0 ? void 0 : ticketSelected.communicationchanneltype.includes("WHA")) && (react_1["default"].createElement(Tooltip_1["default"], { title: String(t(keys_1.langKeys.underline)), arrow: true, placement: "top" },
                                react_1["default"].createElement(IconButton_1["default"], { onClick: function () { return toggleTextStyle('underline'); }, size: 'small' }, t(keys_1.langKeys.currentlanguage) === "en" ? react_1["default"].createElement(FormatUnderlined_1["default"], { className: classes.root }) : react_1["default"].createElement(icons_1.UnderlineSIcon, { className: classes.root, style: { width: 18, height: 18 } })))),
                            react_1["default"].createElement(Tooltip_1["default"], { title: String(t(keys_1.langKeys.strikethrough)), arrow: true, placement: "top" },
                                react_1["default"].createElement(IconButton_1["default"], { onClick: function () { return toggleTextStyle('strikethrough'); }, size: 'small' }, t(keys_1.langKeys.currentlanguage) === "en" ? react_1["default"].createElement(StrikethroughS_1["default"], { className: classes.root }) : react_1["default"].createElement(icons_1.StrikethroughLineIcon, { className: classes.root, style: { width: 18, height: 18 } }))),
                            react_1["default"].createElement(Tooltip_1["default"], { title: String(t(keys_1.langKeys.monospaced)), arrow: true, placement: "top" },
                                react_1["default"].createElement(IconButton_1["default"], { onClick: function () { return toggleTextStyle('monospaced'); }, size: 'small' },
                                    react_1["default"].createElement(icons_1.CodeSnippetIcon, { className: classes.root, style: { width: 24, height: 24 } })))))),
                    react_1["default"].createElement(BottomGoToUnder, null)))),
            !showReply && (react_1["default"].createElement("div", { className: classes.containerResponse },
                react_1["default"].createElement("div", { style: {
                        whiteSpace: "break-spaces",
                        color: "rgb(251, 95, 95)",
                        fontWeight: 500,
                        textAlign: "center"
                    } }, showReply == null ? t(keys_1.langKeys.no_reply_claro) : t(keys_1.langKeys.no_reply_use_hsm)),
                react_1["default"].createElement(BottomGoToUnder, null)))));
};
exports["default"] = ReplyPanel;
