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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.RadioGroudFieldEdit = exports.PhoneFieldEdit = exports.FieldUploadImage = exports.TemplateSwitchArray = exports.FieldEditArray = exports.FieldEditWithSelect = exports.GifPickerZyx = exports.EmojiPickerZyx = exports.ListItemSkeleton = exports.AntTabPanelAux = exports.AntTabPanel = exports.AntTab = exports.FieldCheckbox = exports.OnlyCheckbox = exports.TemplateSwitchYesNo = exports.TemplateSwitch = exports.FieldMultiSelectEmails = exports.FieldMultiSelectFreeSolo = exports.FieldMultiSelectVirtualized = exports.FieldMultiSelect = exports.FieldSelect = exports.GetIconColor = exports.GetIcon = exports.FieldEditAdvanced = exports.FieldEditMulti = exports.FieldEdit = exports.DialogZyxDiv = exports.DialogZyx3Opt = exports.DialogZyx = exports.FieldView = exports.Title = exports.TitleDetail = exports.TemplateBreadcrumbs = exports.TemplateIcons = void 0;
require("emoji-mart/css/emoji-mart.css");
var icons_1 = require("icons");
var icons_2 = require("icons");
var core_1 = require("@material-ui/core");
var keys_1 = require("lang/keys");
var styles_1 = require("@material-ui/core/styles");
var emoji_mart_1 = require("emoji-mart");
var components_1 = require("components");
var lab_1 = require("@material-ui/lab");
var react_i18next_1 = require("react-i18next");
var react_window_1 = require("react-window");
var Autocomplete_1 = require("@material-ui/lab/Autocomplete");
var Box_1 = require("@material-ui/core/Box");
var Breadcrumbs_1 = require("@material-ui/core/Breadcrumbs");
var Button_1 = require("@material-ui/core/Button");
var CameraAlt_1 = require("@material-ui/icons/CameraAlt");
var Checkbox_1 = require("@material-ui/core/Checkbox");
var CheckBox_1 = require("@material-ui/icons/CheckBox");
var CheckBoxOutlineBlank_1 = require("@material-ui/icons/CheckBoxOutlineBlank");
var CircularProgress_1 = require("@material-ui/core/CircularProgress");
var ClickAwayListener_1 = require("@material-ui/core/ClickAwayListener");
var Delete_1 = require("@material-ui/icons/Delete");
var Dialog_1 = require("@material-ui/core/Dialog");
var DialogActions_1 = require("@material-ui/core/DialogActions");
var DialogContent_1 = require("@material-ui/core/DialogContent");
var DialogTitle_1 = require("@material-ui/core/DialogTitle");
var IconButton_1 = require("@material-ui/core/IconButton");
var Info_1 = require("@material-ui/icons/Info");
var InfoRounded_1 = require("@material-ui/icons/InfoRounded");
var IOSSwitch_1 = require("./IOSSwitch");
var Link_1 = require("@material-ui/core/Link");
var ListSubheader_1 = require("@material-ui/core/ListSubheader");
var Menu_1 = require("@material-ui/core/Menu");
var MenuItem_1 = require("@material-ui/core/MenuItem");
var MoreVert_1 = require("@material-ui/icons/MoreVert");
var material_ui_phone_number_1 = require("material-ui-phone-number");
var react_quick_reactions_1 = require("react-quick-reactions");
var react_1 = require("react");
var Tab_1 = require("@material-ui/core/Tab");
var TextField_1 = require("@material-ui/core/TextField");
var Tooltip_1 = require("@material-ui/core/Tooltip");
var Typography_1 = require("@material-ui/core/Typography");
exports.TemplateIcons = function (_a) {
    var extraOption = _a.extraOption, viewFunction = _a.viewFunction, deleteFunction = _a.deleteFunction, editFunction = _a.editFunction, extraFunction = _a.extraFunction, ExtraICon = _a.ExtraICon;
    var _b = react_1["default"].useState(null), anchorEl = _b[0], setAnchorEl = _b[1];
    var handleClose = function (e) {
        e.stopPropagation();
        setAnchorEl(null);
    };
    return (react_1["default"].createElement("div", { style: { whiteSpace: 'nowrap', display: 'flex' } },
        react_1["default"].createElement(IconButton_1["default"], { "aria-label": "more", "aria-controls": "long-menu", "aria-haspopup": "true", size: "small", onClick: function (e) {
                setAnchorEl(e.currentTarget);
                e.stopPropagation();
            }, style: { display: (deleteFunction || extraFunction) ? 'block' : 'none' } },
            react_1["default"].createElement(MoreVert_1["default"], { style: { color: '#B6B4BA' } })),
        react_1["default"].createElement(Menu_1["default"], { id: "menu-appbar", anchorEl: anchorEl, getContentAnchorEl: null, anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'right'
            }, transformOrigin: {
                vertical: 'top',
                horizontal: 'right'
            }, open: Boolean(anchorEl), onClose: handleClose },
            extraOption &&
                react_1["default"].createElement(MenuItem_1["default"], { onClick: function (e) {
                        e.stopPropagation();
                        setAnchorEl(null);
                        extraFunction === null || extraFunction === void 0 ? void 0 : extraFunction(e);
                    } },
                    ExtraICon &&
                        react_1["default"].createElement(core_1.ListItemIcon, { color: "inherit" },
                            react_1["default"].createElement(ExtraICon, null)),
                    extraOption),
            deleteFunction &&
                react_1["default"].createElement(MenuItem_1["default"], { onClick: function (e) {
                        e.stopPropagation();
                        setAnchorEl(null);
                        deleteFunction === null || deleteFunction === void 0 ? void 0 : deleteFunction(e);
                    } },
                    react_1["default"].createElement(core_1.ListItemIcon, { color: "inherit" },
                        react_1["default"].createElement(Delete_1["default"], { width: 18, style: { fill: '#7721AD' } })),
                    react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys["delete"] })))));
};
exports.TemplateBreadcrumbs = function (_a) {
    var breadcrumbs = _a.breadcrumbs, handleClick = _a.handleClick;
    var handleClickBreadcrumb = function (event, id) {
        event.preventDefault();
        handleClick === null || handleClick === void 0 ? void 0 : handleClick(id);
    };
    return (react_1["default"].createElement(Breadcrumbs_1["default"], { "aria-label": "breadcrumb" }, breadcrumbs.map(function (x, i) { return (breadcrumbs.length - 1 === i) ?
        react_1["default"].createElement(Typography_1["default"], { key: x.id, color: "textPrimary" }, x.name)
        :
            react_1["default"].createElement(Link_1["default"], { color: "textSecondary", key: x.id, href: "/", onClick: function (e) { return handleClickBreadcrumb(e, x.id); } }, x.name); })));
};
exports.TitleDetail = function (_a) {
    var title = _a.title, variant = _a.variant;
    return (react_1["default"].createElement(Typography_1["default"], { variant: variant, style: { fontSize: 32 }, color: "textPrimary" }, title));
};
exports.Title = function (_a) {
    var children = _a.children;
    var theme = core_1.useTheme();
    var style = {
        fontSize: '22px',
        fontWeight: 'bold',
        color: theme.palette.text.primary
    };
    return react_1["default"].createElement("label", { style: style }, children);
};
exports.FieldView = function (_a) {
    var label = _a.label, value = _a.value, className = _a.className, styles = _a.styles, tooltip = _a.tooltip, onclick = _a.onclick;
    return (react_1["default"].createElement("div", { className: className },
        react_1["default"].createElement(Box_1["default"], { fontWeight: 500, lineHeight: "18px", fontSize: 14, mb: 1, color: "textPrimary" },
            label,
            !!tooltip && react_1["default"].createElement(Tooltip_1["default"], { title: tooltip, placement: "top-start" },
                react_1["default"].createElement(Info_1["default"], { style: { padding: "5px 0 0 5px" } }))),
        react_1["default"].createElement(Box_1["default"], { onClick: onclick, lineHeight: "20px", fontSize: 15, color: "textPrimary", style: styles }, value || "")));
};
exports.DialogZyx = function (_a) {
    var children = _a.children, open = _a.open, buttonText0 = _a.buttonText0, buttonText1 = _a.buttonText1, buttonText2 = _a.buttonText2, buttonText3 = _a.buttonText3, handleClickButton0 = _a.handleClickButton0, handleClickButton1 = _a.handleClickButton1, handleClickButton2 = _a.handleClickButton2, handleClickButton3 = _a.handleClickButton3, title = _a.title, _b = _a.maxWidth, maxWidth = _b === void 0 ? "sm" : _b, _c = _a.button1Type, button1Type = _c === void 0 ? "button" : _c, _d = _a.button2Type, button2Type = _d === void 0 ? "button" : _d, _e = _a.zIndex, zIndex = _e === void 0 ? 1300 : _e, _f = _a.showClose, showClose = _f === void 0 ? false : _f, _g = _a.height, height = _g === void 0 ? "auto" : _g, buttonStyle1 = _a.buttonStyle1, buttonStyle2 = _a.buttonStyle2, buttonStyle3 = _a.buttonStyle3, button1Props = _a.button1Props;
    return (react_1["default"].createElement(Dialog_1["default"], { open: open, fullWidth: true, maxWidth: maxWidth, style: { zIndex: zIndex, height: height } },
        react_1["default"].createElement("form", { onSubmit: (button1Type === "submit" ? handleClickButton1 : (button2Type === "submit" ? handleClickButton2 : undefined)) },
            title && (react_1["default"].createElement(DialogTitle_1["default"], null,
                react_1["default"].createElement("div", { style: { display: 'flex', justifyContent: 'space-between' } },
                    react_1["default"].createElement("div", { style: { display: 'flex', overflow: 'hidden', wordBreak: 'break-word', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: 120 } }, title),
                    showClose && react_1["default"].createElement("div", { onClick: (button1Type !== "submit" ? handleClickButton1 : undefined), style: { display: 'flex', overflow: 'hidden', wordBreak: 'break-word', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer' } },
                        react_1["default"].createElement("b", null, "X"))))),
            react_1["default"].createElement(DialogContent_1["default"], null, children),
            react_1["default"].createElement(DialogActions_1["default"], null,
                !!buttonText0 &&
                    react_1["default"].createElement(Button_1["default"], { onClick: (handleClickButton0) }, buttonText0),
                !!buttonText1 &&
                    react_1["default"].createElement(Button_1["default"], __assign({ type: button1Type, onClick: (button1Type !== "submit" ? handleClickButton1 : undefined), style: buttonStyle1 || {} }, button1Props), buttonText1),
                !!buttonText2 &&
                    react_1["default"].createElement(Button_1["default"], { style: buttonStyle2 || {}, type: button2Type, onClick: (button2Type !== "submit" ? handleClickButton2 : undefined), color: "primary" }, buttonText2),
                !!buttonText3 &&
                    react_1["default"].createElement(Button_1["default"], { onClick: (handleClickButton3) },
                        react_1["default"].createElement("p", { style: { color: "red" } }, buttonText3))))));
};
exports.DialogZyx3Opt = function (_a) {
    var children = _a.children, open = _a.open, buttonText1 = _a.buttonText1, buttonText2 = _a.buttonText2, buttonText3 = _a.buttonText3, handleClickButton1 = _a.handleClickButton1, handleClickButton2 = _a.handleClickButton2, handleClickButton3 = _a.handleClickButton3, title = _a.title, _b = _a.maxWidth, maxWidth = _b === void 0 ? "sm" : _b, _c = _a.button1Type, button1Type = _c === void 0 ? "button" : _c, _d = _a.button2Type, button2Type = _d === void 0 ? "button" : _d, _e = _a.button3Type, button3Type = _e === void 0 ? "button" : _e;
    return (react_1["default"].createElement(Dialog_1["default"], { open: open, fullWidth: true, maxWidth: maxWidth, style: { zIndex: 1300 } },
        react_1["default"].createElement("form", { onSubmit: (button1Type === "submit" ? handleClickButton1 : (button2Type === "submit" ? handleClickButton2 : function () { })) },
            title && react_1["default"].createElement(DialogTitle_1["default"], null, title),
            react_1["default"].createElement(DialogContent_1["default"], null, children),
            react_1["default"].createElement(DialogActions_1["default"], null,
                !!buttonText1 &&
                    react_1["default"].createElement(Button_1["default"], { type: button1Type, onClick: (button1Type !== "submit" ? handleClickButton1 : function () { }) }, buttonText1),
                !!buttonText2 &&
                    react_1["default"].createElement(Button_1["default"], { type: button2Type, onClick: (button2Type !== "submit" ? handleClickButton2 : function () { }), color: "primary" }, buttonText2),
                !!buttonText3 &&
                    react_1["default"].createElement(Button_1["default"], { type: button3Type, onClick: (button3Type !== "submit" ? handleClickButton3 : function () { }), color: "primary" }, buttonText3)))));
};
exports.DialogZyxDiv = function (_a) {
    var children = _a.children, open = _a.open, buttonText1 = _a.buttonText1, buttonText2 = _a.buttonText2, handleClickButton2 = _a.handleClickButton2, handleClickButton1 = _a.handleClickButton1, title = _a.title, _b = _a.maxWidth, maxWidth = _b === void 0 ? "sm" : _b, _c = _a.button2Type, button2Type = _c === void 0 ? "button" : _c, _d = _a.button1Type, button1Type = _d === void 0 ? "button" : _d;
    return (react_1["default"].createElement(Dialog_1["default"], { open: open, fullWidth: true, maxWidth: maxWidth, style: { zIndex: 1300 } },
        react_1["default"].createElement("div", { onSubmit: (button1Type === "submit" ? handleClickButton1 : (button2Type === "submit" ? handleClickButton2 : function () { })) },
            title && react_1["default"].createElement(DialogTitle_1["default"], null, title),
            react_1["default"].createElement(DialogContent_1["default"], null, children),
            react_1["default"].createElement(DialogActions_1["default"], null,
                !!buttonText1 &&
                    react_1["default"].createElement(Button_1["default"], { type: button1Type, onClick: (button1Type !== "submit" ? handleClickButton1 : function () { }) }, buttonText1),
                !!buttonText2 &&
                    react_1["default"].createElement(Button_1["default"], { type: button2Type, onClick: (button2Type !== "submit" ? handleClickButton2 : function () { }), color: "primary" }, buttonText2)))));
};
exports.FieldEdit = function (_a) {
    var _b = _a.width, width = _b === void 0 ? "100%" : _b, label = _a.label, size = _a.size, className = _a.className, _c = _a.disabled, disabled = _c === void 0 ? false : _c, _d = _a.valueDefault, valueDefault = _d === void 0 ? "" : _d, onChange = _a.onChange, onBlur = _a.onBlur, error = _a.error, _e = _a.type, type = _e === void 0 ? "text" : _e, _f = _a.rows, rows = _f === void 0 ? 1 : _f, _g = _a.fregister, fregister = _g === void 0 ? {} : _g, _h = _a.inputProps, inputProps = _h === void 0 ? {} : _h, _j = _a.InputProps, InputProps = _j === void 0 ? {} : _j, _k = _a.variant, variant = _k === void 0 ? "standard" : _k, _l = _a.maxLength, maxLength = _l === void 0 ? 0 : _l, _m = _a.helperText, helperText = _m === void 0 ? "" : _m;
    var _o = react_1.useState(""), value = _o[0], setvalue = _o[1];
    react_1.useEffect(function () {
        setvalue(valueDefault);
    }, [valueDefault]);
    return (react_1["default"].createElement("div", { className: className },
        (variant === "standard" && !!label) &&
            react_1["default"].createElement(Box_1["default"], { fontWeight: 500, lineHeight: "18px", fontSize: 14, mb: .5, color: "textPrimary", style: { display: "flex" } },
                label,
                !!helperText &&
                    react_1["default"].createElement("div", { style: { display: 'flex', alignItems: 'center' } },
                        react_1["default"].createElement(Tooltip_1["default"], { title: react_1["default"].createElement("div", { style: { fontSize: 12 } }, helperText), arrow: true, placement: "top" },
                            react_1["default"].createElement(InfoRounded_1["default"], { color: "action", style: { width: 15, height: 15, cursor: 'pointer' } })))),
        react_1["default"].createElement(TextField_1["default"], __assign({}, fregister, { color: "primary", fullWidth: width === "100%", label: variant !== "standard" && label, disabled: disabled, type: type, style: { width: width }, value: value, variant: variant, error: !!error, helperText: error || null, minRows: rows, size: size, onChange: function (e) {
                if (maxLength === 0 || e.target.value.length <= maxLength) {
                    setvalue(e.target.value);
                    onChange && onChange(e.target.value);
                }
            }, onBlur: function (e) {
                onBlur && onBlur(e.target.value);
            }, inputProps: inputProps, InputProps: InputProps }))));
};
exports.FieldEditMulti = function (_a) {
    var label = _a.label, className = _a.className, _b = _a.disabled, disabled = _b === void 0 ? false : _b, _c = _a.valueDefault, valueDefault = _c === void 0 ? "" : _c, onChange = _a.onChange, onBlur = _a.onBlur, error = _a.error, _d = _a.type, type = _d === void 0 ? "text" : _d, _e = _a.rows, rows = _e === void 0 ? 4 : _e, _f = _a.maxLength, maxLength = _f === void 0 ? 0 : _f, _g = _a.fregister, fregister = _g === void 0 ? {} : _g, _h = _a.inputProps, inputProps = _h === void 0 ? {} : _h, _j = _a.variant, variant = _j === void 0 ? "standard" : _j;
    var _k = react_1.useState(""), value = _k[0], setvalue = _k[1];
    react_1.useEffect(function () {
        setvalue(valueDefault || "");
    }, [valueDefault]);
    return (react_1["default"].createElement("div", { className: className },
        react_1["default"].createElement(Box_1["default"], { fontWeight: 500, lineHeight: "18px", fontSize: 14, mb: 1, color: "textPrimary" }, label),
        react_1["default"].createElement(TextField_1["default"], __assign({}, fregister, { color: "primary", fullWidth: true, disabled: disabled, variant: variant, type: type, error: !!error, value: value, multiline: true, minRows: rows, helperText: error || null, onChange: function (e) {
                if (maxLength === 0 || e.target.value.length <= maxLength) {
                    setvalue(e.target.value);
                    onChange && onChange(e.target.value);
                }
            }, onBlur: function (e) {
                onBlur && onBlur(e.target.value);
            }, inputProps: inputProps, style: { border: '1px solid #762AA9' } })),
        maxLength !== 0 && react_1["default"].createElement(core_1.FormHelperText, { style: { textAlign: 'right' } },
            maxLength - value.length,
            "/",
            maxLength)));
};
exports.FieldEditAdvanced = function (_a) {
    var label = _a.label, className = _a.className, _b = _a.disabled, disabled = _b === void 0 ? false : _b, _c = _a.valueDefault, valueDefault = _c === void 0 ? "" : _c, onChange = _a.onChange, onBlur = _a.onBlur, error = _a.error, _d = _a.type, type = _d === void 0 ? "text" : _d, _e = _a.rows, rows = _e === void 0 ? 4 : _e, _f = _a.maxLength, maxLength = _f === void 0 ? 0 : _f, _g = _a.fregister, fregister = _g === void 0 ? {} : _g, _h = _a.inputProps, inputProps = _h === void 0 ? {} : _h, _j = _a.style, style = _j === void 0 ? {} : _j, _k = _a.emoji, emoji = _k === void 0 ? false : _k, _l = _a.hashtag, hashtag = _l === void 0 ? false : _l;
    var _m = react_1.useState(""), value = _m[0], setvalue = _m[1];
    var _o = react_1.useState(false), isVisible = _o[0], setIsVisible = _o[1];
    react_1.useEffect(function () {
        setvalue(valueDefault || "");
    }, [valueDefault]);
    return (react_1["default"].createElement("div", { className: className },
        label && react_1["default"].createElement(Box_1["default"], { fontWeight: 500, lineHeight: "18px", fontSize: 14, mb: 1, color: "textPrimary" }, label),
        (emoji || hashtag) && react_1["default"].createElement("div", { style: { display: 'flex', width: '100%', alignItems: 'right', alignContent: 'right', justifyContent: 'flex-end', marginLeft: '6px' } },
            emoji && react_1["default"].createElement(react_quick_reactions_1["default"], { reactionsArray: [
                    {
                        id: "laughing",
                        name: "Laughing",
                        content: "😂"
                    },
                    {
                        id: "crying",
                        name: "Crying",
                        content: "😢"
                    },
                    {
                        id: "thinking",
                        name: "Thinking",
                        content: "🤔"
                    },
                    {
                        id: "screaming",
                        name: "Screaming",
                        content: "😱"
                    },
                ], isVisible: isVisible, onClose: function () { return setIsVisible(false); }, onClickReaction: function (reaction) {
                    if (maxLength === 0 || ("" + value + reaction.content).length <= maxLength) {
                        setvalue("" + value + reaction.content);
                        onChange && onChange("" + value + reaction.content);
                    }
                }, trigger: react_1["default"].createElement("button", { type: 'button', onClick: function () {
                        setIsVisible(!isVisible);
                    }, style: { border: 'none', width: '28px', height: '28px', backgroundImage: 'url(https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/d710976d-8894-4f37-935b-f4dc102bc294/Emoji.png)', backgroundSize: '28px 28px', cursor: 'pointer' } }), placement: 'left', header: 'Emojis' }),
            hashtag && react_1["default"].createElement("button", { type: 'button', onClick: function () {
                    if (maxLength === 0 || (value + "#").length <= maxLength) {
                        setvalue(value + "#");
                        onChange && onChange(value + "#");
                    }
                }, style: { border: 'none', width: '28px', height: '28px', backgroundImage: 'url(https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/ccbdbce8-db2e-4437-b28f-53fa371334a7/Hashtag.png)', backgroundSize: '28px 28px', cursor: 'pointer' } })),
        react_1["default"].createElement(TextField_1["default"], __assign({}, fregister, { color: "primary", fullWidth: true, disabled: disabled, type: type, error: !!error, value: value, multiline: true, minRows: rows, onChange: function (e) {
                if (maxLength === 0 || e.target.value.length <= maxLength) {
                    setvalue(e.target.value);
                    onChange && onChange(e.target.value);
                }
            }, onBlur: function (e) {
                onBlur && onBlur(e.target.value);
            }, inputProps: inputProps, style: style })),
        maxLength !== 0 && react_1["default"].createElement(core_1.FormHelperText, { style: { textAlign: 'right' } },
            " ",
            value.length,
            "/",
            maxLength)));
};
exports.GetIcon = function (_a) {
    var channelType = _a.channelType, _b = _a.width, width = _b === void 0 ? 15 : _b, _c = _a.height, height = _c === void 0 ? 15 : _c, _d = _a.color, color = _d === void 0 ? "#7721AD" : _d;
    if (channelType === "ANDR")
        return react_1["default"].createElement(icons_2.ChannelAndroid, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "APPL")
        return react_1["default"].createElement(icons_2.ChannelIos, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "APPS")
        return react_1["default"].createElement(icons_2.ChannelAppStore, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "BLOG")
        return react_1["default"].createElement(icons_1.ChannelBlogger, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "CHATZ")
        return react_1["default"].createElement(icons_2.ChannelChat01, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "CHAZ")
        return react_1["default"].createElement(icons_2.ChannelChat01, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "FACEBOOKWORPLACE")
        return react_1["default"].createElement(icons_2.ChannelWorkplace, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "FBDM")
        return react_1["default"].createElement(icons_2.ChannelMessenger, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "FBMS")
        return react_1["default"].createElement(icons_2.ChannelMessenger, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "FBWA")
        return react_1["default"].createElement(icons_2.ChannelFacebook, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "FBWM")
        return react_1["default"].createElement(icons_2.ChannelWorkplace, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "FBWP")
        return react_1["default"].createElement(icons_2.ChannelWorkplace, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "FORM")
        return react_1["default"].createElement(icons_2.ChannelForm, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "GOBU")
        return react_1["default"].createElement(icons_2.ChannelMyBusiness, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "INDM")
        return react_1["default"].createElement(icons_2.ChannelInstagram01, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "INMS")
        return react_1["default"].createElement(icons_2.ChannelInstagram01, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "INST")
        return react_1["default"].createElement(icons_2.ChannelInstagram02, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "LINE")
        return react_1["default"].createElement(icons_2.ChannelLine, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "LNKD")
        return react_1["default"].createElement(icons_2.ChannelLinkedIn, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "MAII")
        return react_1["default"].createElement(icons_2.ChannelMail, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "MAIL")
        return react_1["default"].createElement(icons_2.ChannelMail, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "PLAY")
        return react_1["default"].createElement(icons_2.ChannelPlayStore, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "SMS")
        return react_1["default"].createElement(icons_2.ChannelSms, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "SMSI")
        return react_1["default"].createElement(icons_2.ChannelSms, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "TEAM")
        return react_1["default"].createElement(icons_2.ChannelTeams, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "TELE")
        return react_1["default"].createElement(icons_2.ChannelTelegram, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "TKTA")
        return react_1["default"].createElement(icons_2.ChannelTikTok, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "TKTK")
        return react_1["default"].createElement(icons_2.ChannelTikTok, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "TKTT")
        return react_1["default"].createElement(icons_2.ChannelTikTok, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "TWDM")
        return react_1["default"].createElement(icons_2.ChannelTwitter01, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "TWIT")
        return react_1["default"].createElement(icons_2.ChannelTwitter01, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "TWMS")
        return react_1["default"].createElement(icons_2.ChannelTwitter02, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "VOXI")
        return react_1["default"].createElement(icons_2.ChannelPhone, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "WEBM")
        return react_1["default"].createElement(icons_2.ChannelChat02, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "WHAC")
        return react_1["default"].createElement(icons_2.ChannelWhatsApp01, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "WHAD")
        return react_1["default"].createElement(icons_2.ChannelWhatsApp01, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "WHAG")
        return react_1["default"].createElement(icons_2.ChannelWhatsApp02, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "WHAM")
        return react_1["default"].createElement(icons_2.ChannelWhatsApp02, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "WHAP")
        return react_1["default"].createElement(icons_2.ChannelWhatsApp03, { color: color, width: width, fill: color, stroke: color, height: height });
    if (channelType === "WHAT")
        return react_1["default"].createElement(icons_2.ChannelWhatsApp04, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "YOUA")
        return react_1["default"].createElement(icons_2.ChannelYouTube, { width: width, fill: color, stroke: color, height: height, color: color });
    if (channelType === "YOUT")
        return react_1["default"].createElement(icons_2.ChannelYouTube, { width: width, fill: color, stroke: color, height: height, color: color });
    return react_1["default"].createElement(icons_2.ChannelGeneric, { width: width, fill: color, stroke: color, height: height, color: color });
};
exports.GetIconColor = function (_a) {
    var channelType = _a.channelType;
    if (channelType === 'ANDR')
        return react_1["default"].createElement(icons_1.AndroidColor, null);
    if (channelType === 'APPL')
        return react_1["default"].createElement(icons_1.IosColor, null);
    if (channelType === 'APPS')
        return react_1["default"].createElement(icons_1.AppStoreColor, null);
    if (channelType === 'BLOG')
        return react_1["default"].createElement(icons_1.BloggerColor, null);
    if (channelType === 'CHATZ')
        return react_1["default"].createElement(icons_1.ChatWebColor, null);
    if (channelType === 'CHAZ')
        return react_1["default"].createElement(icons_1.ChatWebColor, null);
    if (channelType === 'FACEBOOKWORPLACE')
        return react_1["default"].createElement(icons_1.WorkplaceColor, null);
    if (channelType === 'FBDM')
        return react_1["default"].createElement(icons_1.MessengerColor, null);
    if (channelType === 'FBMS')
        return react_1["default"].createElement(icons_1.MessengerColor, null);
    if (channelType === 'FBWA')
        return react_1["default"].createElement(icons_1.FacebookColor, null);
    if (channelType === 'FBWM')
        return react_1["default"].createElement(icons_1.WorkplaceColor, null);
    if (channelType === 'FBWP')
        return react_1["default"].createElement(icons_1.WorkplaceColor, null);
    if (channelType === 'FORM')
        return react_1["default"].createElement(icons_1.FormColor, null);
    if (channelType === 'GOBU')
        return react_1["default"].createElement(icons_1.MyBusinessColor, null);
    if (channelType === 'INDM')
        return react_1["default"].createElement(icons_1.InstagramColor, null);
    if (channelType === 'INMS')
        return react_1["default"].createElement(icons_1.InstagramColor, null);
    if (channelType === 'INST')
        return react_1["default"].createElement(icons_1.InstagramColor, null);
    if (channelType === 'LINE')
        return react_1["default"].createElement(icons_1.LineColor, null);
    if (channelType === 'LNKD')
        return react_1["default"].createElement(icons_1.LinkedInColor, null);
    if (channelType === 'MAII')
        return react_1["default"].createElement(icons_1.MailColor, null);
    if (channelType === 'MAIL')
        return react_1["default"].createElement(icons_1.MailColor, null);
    if (channelType === 'PLAY')
        return react_1["default"].createElement(icons_1.PlayStoreColor, null);
    if (channelType === 'SMS')
        return react_1["default"].createElement(icons_1.SmsColor, null);
    if (channelType === 'SMSI')
        return react_1["default"].createElement(icons_1.SmsColor, null);
    if (channelType === 'TEAM')
        return react_1["default"].createElement(icons_1.TeamsColor, null);
    if (channelType === 'TELE')
        return react_1["default"].createElement(icons_1.TelegramColor, null);
    if (channelType === 'TKTA')
        return react_1["default"].createElement(icons_1.TikTokColor, null);
    if (channelType === 'TKTK')
        return react_1["default"].createElement(icons_1.TikTokColor, null);
    if (channelType === 'TKTT')
        return react_1["default"].createElement(icons_1.TikTokColor, null);
    if (channelType === 'TWDM')
        return react_1["default"].createElement(icons_1.TwitterColor, null);
    if (channelType === 'TWIT')
        return react_1["default"].createElement(icons_1.TwitterColor, null);
    if (channelType === 'TWMS')
        return react_1["default"].createElement(icons_1.TwitterColor, null);
    if (channelType === 'VOXI')
        return react_1["default"].createElement(icons_1.VoiceColor, null);
    if (channelType === 'WEBM')
        return react_1["default"].createElement(icons_1.ChatWebColor, null);
    if (channelType === 'WHAC')
        return react_1["default"].createElement(icons_1.WhatsAppColor, null);
    if (channelType === 'WHAD')
        return react_1["default"].createElement(icons_1.WhatsAppColor, null);
    if (channelType === 'WHAG')
        return react_1["default"].createElement(icons_1.WhatsAppColor, null);
    if (channelType === 'WHAM')
        return react_1["default"].createElement(icons_1.WhatsAppColor, null);
    if (channelType === 'WHAP')
        return react_1["default"].createElement(icons_1.WhatsAppColor, null);
    if (channelType === 'WHAT')
        return react_1["default"].createElement(icons_1.WhatsAppColor, null);
    if (channelType === 'YOUA')
        return react_1["default"].createElement(icons_1.YouTubeColor, null);
    if (channelType === 'YOUT')
        return react_1["default"].createElement(icons_1.YouTubeColor, null);
    return react_1["default"].createElement(icons_1.TelegramColor, null);
};
exports.FieldSelect = function (_a) {
    var _b = _a.multiline, multiline = _b === void 0 ? false : _b, error = _a.error, label = _a.label, _c = _a.data, data = _c === void 0 ? [] : _c, optionValue = _a.optionValue, optionDesc = _a.optionDesc, _d = _a.valueDefault, valueDefault = _d === void 0 ? "" : _d, onChange = _a.onChange, _e = _a.disabled, disabled = _e === void 0 ? false : _e, _f = _a.className, className = _f === void 0 ? null : _f, _g = _a.style, style = _g === void 0 ? null : _g, _h = _a.triggerOnChangeOnFirst, triggerOnChangeOnFirst = _h === void 0 ? false : _h, _j = _a.loading, loading = _j === void 0 ? false : _j, _k = _a.fregister, fregister = _k === void 0 ? {} : _k, _l = _a.uset, uset = _l === void 0 ? false : _l, _m = _a.prefixTranslation, prefixTranslation = _m === void 0 ? "" : _m, _o = _a.variant, variant = _o === void 0 ? "standard" : _o, _p = _a.readOnly, readOnly = _p === void 0 ? false : _p, _q = _a.orderbylabel, orderbylabel = _q === void 0 ? false : _q, _r = _a.helperText, helperText = _r === void 0 ? "" : _r;
    var t = react_i18next_1.useTranslation().t;
    var _s = react_1.useState(null), value = _s[0], setValue = _s[1];
    var _t = react_1.useState([]), dataG = _t[0], setDataG = _t[1];
    react_1.useEffect(function () {
        if (orderbylabel) {
            if (data.length > 0) {
                if (uset) {
                    var datatmp = data.sort(function (a, b) { var _a, _b; return t(prefixTranslation + ((_a = a[optionDesc]) === null || _a === void 0 ? void 0 : _a.toLowerCase())).toUpperCase().localeCompare(t(prefixTranslation + ((_b = b[optionDesc]) === null || _b === void 0 ? void 0 : _b.toLowerCase())).toUpperCase()); });
                    setDataG(datatmp);
                    return;
                }
                else {
                    var datatmp = data.sort(function (a, b) { return (a[optionDesc] || '').localeCompare(b[optionDesc] || ''); });
                    setDataG(datatmp);
                    return;
                }
            }
        }
        setDataG(data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);
    react_1.useEffect(function () {
        if (valueDefault && data.length > 0) {
            var optionfound = data.find(function (o) { return o[optionValue] === valueDefault; });
            if (optionfound) {
                setValue(optionfound);
                if (triggerOnChangeOnFirst)
                    onChange && onChange(optionfound);
            }
        }
        else {
            setValue(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, valueDefault]);
    return (react_1["default"].createElement("div", { className: className },
        (variant === "standard" && !!label) &&
            react_1["default"].createElement(Box_1["default"], { fontWeight: 500, lineHeight: "18px", fontSize: 14, mb: .5, color: "textPrimary", style: { display: "flex" } },
                label,
                !!helperText &&
                    react_1["default"].createElement("div", { style: { display: 'flex', alignItems: 'center' } },
                        react_1["default"].createElement(Tooltip_1["default"], { title: react_1["default"].createElement("div", { style: { fontSize: 12 } }, helperText), arrow: true, placement: "top" },
                            react_1["default"].createElement(InfoRounded_1["default"], { color: "action", style: { width: 15, height: 15, cursor: 'pointer' } })))),
        react_1["default"].createElement(Autocomplete_1["default"], __assign({ filterSelectedOptions: true, style: style, fullWidth: true }, fregister, { disabled: disabled, value: (data === null || data === void 0 ? void 0 : data.length) > 0 ? value : null, onChange: function (_, newValue) {
                if (readOnly)
                    return;
                setValue(newValue);
                onChange && onChange(newValue);
            }, getOptionLabel: function (option) { var _a, _b; return option ? (uset && Object.keys(keys_1.langKeys).includes(prefixTranslation + ((_a = option[optionDesc]) === null || _a === void 0 ? void 0 : _a.toLowerCase())) ? t(prefixTranslation + ((_b = option[optionDesc]) === null || _b === void 0 ? void 0 : _b.toLowerCase())).toUpperCase() : (option[optionDesc] || '')) : ''; }, options: dataG, loading: loading, size: "small", renderInput: function (params) { return (react_1["default"].createElement(TextField_1["default"], __assign({}, params, { label: variant !== "standard" && label, variant: variant, multiline: multiline, helperText: error || null, error: !!error, InputProps: __assign(__assign({}, params.InputProps), { endAdornment: (react_1["default"].createElement(react_1["default"].Fragment, null,
                        loading ? react_1["default"].createElement(CircularProgress_1["default"], { color: "inherit", size: 20 }) : null,
                        params.InputProps.endAdornment)), readOnly: readOnly }) }))); } }))));
};
var icon = react_1["default"].createElement(CheckBoxOutlineBlank_1["default"], { fontSize: "small" });
var checkedIcon = react_1["default"].createElement(CheckBox_1["default"], { fontSize: "small" });
exports.FieldMultiSelect = function (_a) {
    var error = _a.error, label = _a.label, data = _a.data, optionValue = _a.optionValue, optionDesc = _a.optionDesc, _b = _a.valueDefault, valueDefault = _b === void 0 ? "" : _b, onChange = _a.onChange, _c = _a.disabled, disabled = _c === void 0 ? false : _c, loading = _a.loading, _d = _a.className, className = _d === void 0 ? null : _d, _e = _a.style, style = _e === void 0 ? null : _e, _f = _a.variant, variant = _f === void 0 ? "standard" : _f, _g = _a.uset, uset = _g === void 0 ? false : _g, _h = _a.prefixTranslation, prefixTranslation = _h === void 0 ? "" : _h, _j = _a.limitTags, limitTags = _j === void 0 ? -1 : _j;
    var t = react_i18next_1.useTranslation().t;
    var _k = react_1.useState([]), optionsSelected = _k[0], setOptionsSelected = _k[1];
    react_1.useEffect(function () {
        if (typeof valueDefault === 'string' && valueDefault.trim() !== '' && data.length > 0) {
            var optionsSelected_1 = data.filter(function (o) { return valueDefault.split(",").indexOf(o[optionValue].toString()) > -1; });
            setOptionsSelected(optionsSelected_1);
        }
        else {
            setOptionsSelected([]);
        }
    }, [data, valueDefault]);
    // useEffect(() => {
    //     if (valueDefault && data.length > 0) {
    //         const optionsSelected = data.filter(o => valueDefault.split(",").indexOf(o[optionValue].toString()) > -1)
    //         setOptionsSelected(optionsSelected);
    //     } else {
    //         setOptionsSelected([]);
    //     }
    // }, [data]);
    return (react_1["default"].createElement("div", { className: className },
        variant === "standard" &&
            react_1["default"].createElement(Box_1["default"], { fontWeight: 500, lineHeight: "18px", fontSize: 14, mb: 1, color: "textPrimary" }, label),
        react_1["default"].createElement(Autocomplete_1["default"], { multiple: true, limitTags: limitTags, filterSelectedOptions: true, style: style, disabled: disabled, disableCloseOnSelect: true, loading: loading, value: optionsSelected, renderOption: function (option, _a) {
                var _b;
                var selected = _a.selected;
                return (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement(Checkbox_1["default"], { icon: icon, checkedIcon: checkedIcon, style: { marginRight: 8 }, checked: selected }),
                    option ? (uset ? t(prefixTranslation + ((_b = option[optionDesc]) === null || _b === void 0 ? void 0 : _b.toLowerCase())).toUpperCase() : (option[optionDesc] || '')) : ''));
            }, onChange: function (_, values, action, option) {
                setOptionsSelected(values);
                onChange && onChange(values, { action: action, option: option });
            }, size: "small", getOptionLabel: function (option) { var _a; return option ? (uset ? t(prefixTranslation + ((_a = option[optionDesc]) === null || _a === void 0 ? void 0 : _a.toLowerCase())).toUpperCase() : (option[optionDesc] || '')) : ''; }, options: data, renderInput: function (params) { return (react_1["default"].createElement(TextField_1["default"], __assign({}, params, { label: variant !== "standard" && label, variant: variant, size: "small", InputProps: __assign(__assign({}, params.InputProps), { endAdornment: (react_1["default"].createElement(react_1["default"].Fragment, null,
                        loading ? react_1["default"].createElement(CircularProgress_1["default"], { color: "inherit", size: 20 }) : null,
                        params.InputProps.endAdornment)) }), error: !!error, helperText: error || null }))); } })));
};
// FieldMultiSelectVirtualized
var LISTBOX_PADDING_MultiSelect = 8;
var renderRowMultiSelect = function (props) {
    var data = props.data, index = props.index, style = props.style;
    return react_1["default"].cloneElement(data[index], {
        style: __assign(__assign({}, style), { top: style.top + LISTBOX_PADDING_MultiSelect })
    });
};
var OuterElementContextMultiSelect = react_1["default"].createContext({});
var OuterElementTypeMultiSelect = react_1["default"].forwardRef(function (props, ref) {
    var outerProps = react_1["default"].useContext(OuterElementContextMultiSelect);
    return react_1["default"].createElement("div", __assign({ ref: ref }, props, outerProps));
});
var useResetCacheMultiSelect = function (data) {
    var ref = react_1["default"].useRef(null);
    react_1["default"].useEffect(function () {
        if (ref.current != null) {
            ref.current.resetAfterIndex(0, true);
        }
    }, [data]);
    return ref;
};
var ListboxComponentMultiSelect = react_1["default"].forwardRef(function ListboxComponent(props, ref) {
    var children = props.children, other = __rest(props, ["children"]);
    var itemData = react_1["default"].Children.toArray(children);
    var itemCount = itemData.length;
    var itemSize = 48;
    var getChildSize = function (child) {
        if (react_1["default"].isValidElement(child) && child.type === ListSubheader_1["default"]) {
            return 48;
        }
        return itemSize;
    };
    var getHeight = function () {
        if (itemCount > 8) {
            return 8 * itemSize;
        }
        return itemData.map(getChildSize).reduce(function (a, b) { return a + b; }, 0);
    };
    var gridRef = useResetCacheMultiSelect(itemCount);
    return (react_1["default"].createElement("div", { ref: ref },
        react_1["default"].createElement(OuterElementContextMultiSelect.Provider, { value: other },
            react_1["default"].createElement(react_window_1.VariableSizeList, { itemData: itemData, height: getHeight(), width: "100%", ref: gridRef, outerElementType: OuterElementTypeMultiSelect, itemSize: function (index) { return getChildSize(itemData[index]); }, overscanCount: 5, itemCount: itemCount }, renderRowMultiSelect))));
});
exports.FieldMultiSelectVirtualized = function (_a) {
    var error = _a.error, label = _a.label, data = _a.data, optionValue = _a.optionValue, optionDesc = _a.optionDesc, _b = _a.valueDefault, valueDefault = _b === void 0 ? "" : _b, onChange = _a.onChange, _c = _a.disabled, disabled = _c === void 0 ? false : _c, loading = _a.loading, _d = _a.className, className = _d === void 0 ? null : _d, _e = _a.style, style = _e === void 0 ? null : _e, _f = _a.variant, variant = _f === void 0 ? "standard" : _f, _g = _a.uset, uset = _g === void 0 ? false : _g, _h = _a.prefixTranslation, prefixTranslation = _h === void 0 ? "" : _h, _j = _a.limitTags, limitTags = _j === void 0 ? -1 : _j;
    var t = react_i18next_1.useTranslation().t;
    var _k = react_1.useState([]), optionsSelected = _k[0], setOptionsSelected = _k[1];
    react_1.useEffect(function () {
        if (valueDefault && data.length > 0) {
            var optionsSelected_2 = data.filter(function (o) { return ("" + valueDefault).split(",").indexOf(o[optionValue].toString()) > -1; });
            setOptionsSelected(optionsSelected_2);
        }
        else {
            setOptionsSelected([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);
    return (react_1["default"].createElement("div", { className: className },
        variant === "standard" &&
            react_1["default"].createElement(Box_1["default"], { fontWeight: 500, lineHeight: "18px", fontSize: 14, mb: 1, color: "textPrimary" }, label),
        react_1["default"].createElement(Autocomplete_1["default"], { multiple: true, disableListWrap: true, limitTags: limitTags, filterSelectedOptions: true, style: style, disabled: disabled, disableCloseOnSelect: true, loading: loading, value: optionsSelected, ListboxComponent: ListboxComponentMultiSelect, renderOption: function (option, _a) {
                var _b;
                var selected = _a.selected;
                return (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement(Checkbox_1["default"], { icon: icon, checkedIcon: checkedIcon, style: { marginRight: 8 }, checked: selected }),
                    react_1["default"].createElement(Typography_1["default"], { noWrap: true }, option ? (uset ? t(prefixTranslation + ((_b = option[optionDesc]) === null || _b === void 0 ? void 0 : _b.toLowerCase())).toUpperCase() : (option[optionDesc] || '')) : '')));
            }, onChange: function (_, values, action, option) {
                setOptionsSelected(values);
                onChange && onChange(values, { action: action, option: option });
            }, size: "small", getOptionLabel: function (option) { var _a; return option ? (uset ? t(prefixTranslation + ((_a = option[optionDesc]) === null || _a === void 0 ? void 0 : _a.toLowerCase())).toUpperCase() : (option[optionDesc] || '')) : ''; }, options: data, renderInput: function (params) { return (react_1["default"].createElement(TextField_1["default"], __assign({}, params, { label: variant !== "standard" && label, variant: variant, size: "small", InputProps: __assign(__assign({}, params.InputProps), { endAdornment: (react_1["default"].createElement(react_1["default"].Fragment, null,
                        loading ? react_1["default"].createElement(CircularProgress_1["default"], { color: "inherit", size: 20 }) : null,
                        params.InputProps.endAdornment)) }), error: !!error, helperText: error || null }))); } })));
};
exports.FieldMultiSelectFreeSolo = function (_a) {
    var error = _a.error, label = _a.label, data = _a.data, optionValue = _a.optionValue, optionDesc = _a.optionDesc, _b = _a.valueDefault, valueDefault = _b === void 0 ? "" : _b, onBlur = _a.onBlur, onChange = _a.onChange, _c = _a.disabled, disabled = _c === void 0 ? false : _c, loading = _a.loading, _d = _a.className, className = _d === void 0 ? null : _d, _e = _a.style, style = _e === void 0 ? null : _e, _f = _a.variant, variant = _f === void 0 ? "standard" : _f, _g = _a.readOnly, readOnly = _g === void 0 ? false : _g;
    var _h = react_1.useState([]), optionsSelected = _h[0], setOptionsSelected = _h[1];
    react_1.useEffect(function () {
        if (valueDefault && data.length > 0) {
            var optionsSelected_3 = data.filter(function (o) { return ("" + valueDefault).split(",").indexOf(o[optionValue].toString()) > -1; });
            setOptionsSelected(optionsSelected_3);
        }
        else {
            setOptionsSelected([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [valueDefault, data]);
    return (react_1["default"].createElement("div", { className: className },
        variant === "standard" &&
            react_1["default"].createElement(Box_1["default"], { fontWeight: 500, lineHeight: "18px", fontSize: 14, mb: 1, color: "textPrimary" }, label),
        react_1["default"].createElement(Autocomplete_1["default"], { multiple: true, freeSolo: true, filterSelectedOptions: true, style: style, disabled: disabled, loading: loading, value: optionsSelected, renderOption: function (item, _a) {
                var selected = _a.selected;
                return (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement(Checkbox_1["default"], { icon: icon, checkedIcon: checkedIcon, style: { marginRight: 8 }, checked: selected, readOnly: readOnly }),
                    item[optionDesc]));
            }, onChange: function (_, values, action, option) {
                if (readOnly)
                    return;
                setOptionsSelected(values);
                onChange && onChange(values, { action: action, option: option });
            }, size: "small", getOptionLabel: function (option) { return String(option ? option[optionDesc] || option : ''); }, options: data, renderInput: function (params) { return (react_1["default"].createElement(TextField_1["default"], __assign({}, params, { label: variant !== "standard" && label, variant: variant, InputProps: __assign(__assign({}, params.InputProps), { endAdornment: (react_1["default"].createElement(react_1["default"].Fragment, null,
                        loading ? react_1["default"].createElement(CircularProgress_1["default"], { color: "inherit", size: 20 }) : null,
                        params.InputProps.endAdornment)), readOnly: readOnly }), onBlur: function (e) {
                    onBlur && onBlur(e.target.value);
                }, error: !!error, helperText: error || null }))); } })));
};
exports.FieldMultiSelectEmails = function (_a) {
    var error = _a.error, label = _a.label, data = _a.data, optionValue = _a.optionValue, optionDesc = _a.optionDesc, _b = _a.valueDefault, valueDefault = _b === void 0 ? "" : _b, onBlur = _a.onBlur, onChange = _a.onChange, _c = _a.disabled, disabled = _c === void 0 ? false : _c, loading = _a.loading, _d = _a.className, className = _d === void 0 ? null : _d, _e = _a.style, style = _e === void 0 ? null : _e, _f = _a.variant, variant = _f === void 0 ? "standard" : _f, _g = _a.readOnly, readOnly = _g === void 0 ? false : _g;
    var _h = react_1.useState([]), optionsSelected = _h[0], setOptionsSelected = _h[1];
    react_1.useEffect(function () {
        if (valueDefault && data.length > 0) {
            var optionsSelected_4 = data.filter(function (o) { return ("" + valueDefault).split(",").indexOf(o[optionValue].toString()) > -1; });
            setOptionsSelected(optionsSelected_4);
        }
        else {
            setOptionsSelected([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [valueDefault, data]);
    var el = react_1["default"].useRef(null);
    var ke = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, keyCode: 13 });
    return (react_1["default"].createElement("div", { className: className },
        variant === "standard" &&
            react_1["default"].createElement(Box_1["default"], { fontWeight: 500, lineHeight: "18px", fontSize: 14, mb: 1, color: "textPrimary" }, label),
        react_1["default"].createElement(Autocomplete_1["default"], { multiple: true, freeSolo: true, filterSelectedOptions: true, style: style, disabled: disabled, loading: loading, ref: el, value: optionsSelected, renderOption: function (item, _a) {
                var selected = _a.selected;
                return (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement(Checkbox_1["default"], { icon: icon, checkedIcon: checkedIcon, style: { marginRight: 8 }, checked: selected, readOnly: readOnly }),
                    item[optionDesc]));
            }, onInput: function (e) {
                var _a;
                if (e.target.value.indexOf(",") > -1) {
                    var values = ("" + e.target.value).split(",");
                    e.target.value = values[0];
                    (_a = el === null || el === void 0 ? void 0 : el.current) === null || _a === void 0 ? void 0 : _a.dispatchEvent(ke);
                }
            }, onChange: function (_, values, action, option) {
                if (readOnly)
                    return;
                setOptionsSelected(values);
                onChange && onChange(values, { action: action, option: option });
            }, size: "small", getOptionLabel: function (option) { return String(option ? option[optionDesc] || option : ''); }, options: data, renderInput: function (params) {
                return (react_1["default"].createElement(TextField_1["default"], __assign({}, params, { label: variant !== "standard" && label, variant: variant, InputProps: __assign(__assign({}, params.InputProps), { endAdornment: (react_1["default"].createElement(react_1["default"].Fragment, null,
                            loading ? react_1["default"].createElement(CircularProgress_1["default"], { color: "inherit", size: 20 }) : null,
                            params.InputProps.endAdornment)), readOnly: readOnly }), onBlur: function (e) {
                        var _a;
                        (_a = el === null || el === void 0 ? void 0 : el.current) === null || _a === void 0 ? void 0 : _a.dispatchEvent(ke);
                    }, error: !!error, helperText: error || null })));
            } })));
};
exports.TemplateSwitch = function (_a) {
    var className = _a.className, onChange = _a.onChange, valueDefault = _a.valueDefault, label = _a.label, style = _a.style;
    var _b = react_1.useState(false), checkedaux = _b[0], setChecked = _b[1];
    react_1.useEffect(function () {
        setChecked(!!valueDefault);
    }, [valueDefault]);
    return (react_1["default"].createElement("div", { className: className, style: __assign(__assign({}, style), { paddingBottom: '3px' }) },
        react_1["default"].createElement(Box_1["default"], { fontWeight: 500, lineHeight: "18px", fontSize: 14, mb: 2, color: "textPrimary" }, label),
        react_1["default"].createElement(IOSSwitch_1["default"], { checked: checkedaux, onChange: function (e) {
                setChecked(e.target.checked);
                onChange && onChange(e.target.checked);
            } })));
};
exports.TemplateSwitchYesNo = function (_a) {
    var className = _a.className, onChange = _a.onChange, valueDefault = _a.valueDefault, label = _a.label, style = _a.style, textYes = _a.textYes, textNo = _a.textNo, _b = _a.labelPlacement, labelPlacement = _b === void 0 ? "end" : _b, _c = _a.disabled, disabled = _c === void 0 ? false : _c, _d = _a.helperText, helperText = _d === void 0 ? "" : _d;
    var _e = react_1.useState(false), checkedaux = _e[0], setChecked = _e[1];
    var t = react_i18next_1.useTranslation().t;
    react_1.useEffect(function () {
        setChecked(!!valueDefault);
    }, [valueDefault]);
    return (react_1["default"].createElement("div", { className: className, style: __assign(__assign({}, style), { paddingBottom: '3px' }) },
        (!!label) &&
            react_1["default"].createElement(Box_1["default"], { fontWeight: 500, lineHeight: "18px", fontSize: 14, mb: 2, color: "textPrimary", style: { display: "flex" } },
                label,
                !!helperText &&
                    react_1["default"].createElement("div", { style: { display: 'flex', alignItems: 'center' } },
                        react_1["default"].createElement(Tooltip_1["default"], { title: react_1["default"].createElement("div", { style: { fontSize: 12 } }, helperText), arrow: true, placement: "top" },
                            react_1["default"].createElement(InfoRounded_1["default"], { color: "action", style: { width: 15, height: 15, cursor: 'pointer' } })))),
        react_1["default"].createElement(core_1.FormControlLabel, { labelPlacement: labelPlacement, style: { paddingLeft: 10 }, control: react_1["default"].createElement(IOSSwitch_1["default"], { checked: checkedaux, disabled: disabled, onChange: function (e) {
                    setChecked(e.target.checked);
                    onChange && onChange(e.target.checked);
                } }), label: checkedaux ? (textYes || t(keys_1.langKeys.yes)) : (textNo || "No") })));
};
var useCheckboxStyles = styles_1.makeStyles({
    root: {
        '&:hover': {
            backgroundColor: 'transparent'
        }
    },
    icon: {
        borderRadius: 3,
        width: 16,
        height: 16,
        boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
        backgroundColor: '#f5f8fa',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
        '$root.Mui-focusVisible &': {
            outline: '2px auto rgba(19,124,189,.6)',
            outlineOffset: 2
        },
        'input:hover ~ &': {
            backgroundColor: '#ebf1f5'
        },
        'input:disabled ~ &': {
            boxShadow: 'none',
            background: 'rgba(119,33,173,.5)'
        }
    },
    checkedIcon: {
        backgroundColor: 'rgba(119, 33, 173, 0.9)',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
        '&:before': {
            display: 'block',
            width: 16,
            height: 16,
            backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
                " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
                "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
            content: '""'
        },
        'input:hover ~ &': {
            backgroundColor: '#7721AD'
        }
    }
});
exports.OnlyCheckbox = function (_a) {
    var className = _a.className, style = _a.style, onChange = _a.onChange, valueDefault = _a.valueDefault, label = _a.label, _b = _a.disabled, disabled = _b === void 0 ? false : _b;
    var classes = useCheckboxStyles();
    var _c = react_1.useState(false), checkedaux = _c[0], setChecked = _c[1];
    react_1.useEffect(function () {
        setChecked(!!valueDefault);
    }, [valueDefault]);
    return (react_1["default"].createElement(Box_1["default"], { className: className, style: style },
        react_1["default"].createElement(Checkbox_1["default"], { checked: checkedaux, checkedIcon: react_1["default"].createElement("span", { className: classes.icon + " " + classes.checkedIcon }), icon: react_1["default"].createElement("span", { className: classes.icon }), disabled: disabled, onChange: function (e) {
                setChecked(e.target.checked);
                onChange && onChange(e.target.checked);
            } })));
};
exports.FieldCheckbox = function (_a) {
    var className = _a.className, onChange = _a.onChange, valueDefault = _a.valueDefault, label = _a.label, _b = _a.disabled, disabled = _b === void 0 ? false : _b, _c = _a.helperText, helperText = _c === void 0 ? "" : _c;
    var classes = useCheckboxStyles();
    var _d = react_1.useState(false), checkedaux = _d[0], setChecked = _d[1];
    react_1.useEffect(function () {
        setChecked(!!valueDefault);
    }, [valueDefault]);
    return (react_1["default"].createElement("div", { className: className, style: { paddingBottom: '3px' } },
        react_1["default"].createElement(Box_1["default"], { fontWeight: 500, lineHeight: "18px", fontSize: 14, mb: .5, color: "textPrimary", style: { display: "flex" } },
            label,
            !!helperText &&
                react_1["default"].createElement("div", { style: { display: 'flex', alignItems: 'center' } },
                    react_1["default"].createElement(Tooltip_1["default"], { title: react_1["default"].createElement("div", { style: { fontSize: 12 } }, helperText), arrow: true, placement: "top" },
                        react_1["default"].createElement(InfoRounded_1["default"], { color: "action", style: { width: 15, height: 15, cursor: 'pointer' } })))),
        react_1["default"].createElement(Checkbox_1["default"], { checked: checkedaux, checkedIcon: react_1["default"].createElement("span", { className: classes.icon + " " + classes.checkedIcon }), icon: react_1["default"].createElement("span", { className: classes.icon }), disabled: disabled, onChange: function (e) {
                setChecked(e.target.checked);
                onChange && onChange(e.target.checked);
            } })));
};
exports.AntTab = styles_1.withStyles(function (theme) { return ({
    root: {
        textTransform: 'none',
        minWidth: 72,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover': {
            color: theme.palette.primary.main,
            opacity: 1
        },
        '&$selected': {
            color: theme.palette.primary.main,
            fontWeight: theme.typography.fontWeightMedium
        },
        '&:focus': {
            color: theme.palette.primary.main
        }
    },
    labelIcon: {
        minHeight: 40
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'row-reverse'
    },
    selected: {}
}); })(function (props) { return react_1["default"].createElement(Tab_1["default"], __assign({ disableRipple: true }, props)); });
exports.AntTabPanel = function (_a) {
    var index = _a.index, currentIndex = _a.currentIndex, children = _a.children;
    if (index !== currentIndex) {
        return null;
    }
    return (react_1["default"].createElement("div", { role: "tabpanel" }, children));
};
exports.AntTabPanelAux = function (_a) {
    var index = _a.index, currentIndex = _a.currentIndex, children = _a.children;
    return (react_1["default"].createElement("div", { role: "tabpanel", style: { display: index === currentIndex ? 'block' : 'none' } }, children));
};
exports.ListItemSkeleton = function () { return (react_1["default"].createElement(core_1.ListItem, { style: { display: 'flex', paddingLeft: 0, paddingRight: 0, paddingBottom: 8 } },
    react_1["default"].createElement(Box_1["default"], { style: { padding: 20, backgroundColor: 'white', display: 'flex', flexDirection: 'column', flexGrow: 1 } },
        react_1["default"].createElement(core_1.Grid, { container: true, direction: "column" },
            react_1["default"].createElement(core_1.Grid, { container: true, direction: "row", spacing: 1 },
                react_1["default"].createElement(core_1.Grid, { item: true, sm: 12, xl: 12, xs: 12, md: 12, lg: 12 },
                    react_1["default"].createElement(lab_1.Skeleton, { animation: "wave" }))),
            react_1["default"].createElement(core_1.Divider, { style: { margin: '10px 0' } }),
            react_1["default"].createElement(core_1.Grid, { container: true, direction: "row", spacing: 1 },
                react_1["default"].createElement(core_1.Grid, { item: true, sm: 12, xl: 12, xs: 12, md: 12, lg: 12 },
                    react_1["default"].createElement(lab_1.Skeleton, null))),
            react_1["default"].createElement(core_1.Divider, { style: { margin: '10px 0' } }),
            react_1["default"].createElement(core_1.Grid, { container: true, direction: "row", spacing: 1 },
                react_1["default"].createElement(core_1.Grid, { item: true, sm: 12, xl: 12, xs: 12, md: 12, lg: 12 },
                    react_1["default"].createElement(lab_1.Skeleton, null))))))); };
var emojiPickerStyle = styles_1.makeStyles({
    root: {
        cursor: 'pointer',
        position: 'relative',
        '&:hover': {
            backgroundColor: '#EBEAED',
            borderRadius: 4
        }
    }
});
exports.EmojiPickerZyx = function (_a) {
    var emojisIndexed = _a.emojisIndexed, _b = _a.emojisNoShow, emojisNoShow = _b === void 0 ? [] : _b, _c = _a.emojiFavorite, emojiFavorite = _c === void 0 ? [] : _c, onSelect = _a.onSelect, style = _a.style, icon = _a.icon, _d = _a.bottom, bottom = _d === void 0 ? 50 : _d;
    var _e = react_1["default"].useState(false), open = _e[0], setOpen = _e[1];
    var classes = emojiPickerStyle();
    var handleClick = function () { return setOpen(function (prev) { return !prev; }); };
    var t = react_i18next_1.useTranslation().t;
    var handleClickAway = function () { return setOpen(false); };
    return (react_1["default"].createElement(ClickAwayListener_1["default"], { onClickAway: handleClickAway },
        react_1["default"].createElement("span", { style: style },
            (icon === null || icon === void 0 ? void 0 : icon(handleClick)) || react_1["default"].createElement(Tooltip_1["default"], { title: String(t(keys_1.langKeys.send_emoji)), arrow: true, placement: "top" },
                react_1["default"].createElement(IconButton_1["default"], { onClick: handleClick, size: 'small' },
                    react_1["default"].createElement(icons_1.EmojiICon, { className: classes.root }))),
            open && (react_1["default"].createElement("div", { style: {
                    position: 'absolute',
                    bottom: bottom,
                    zIndex: 1201
                } },
                react_1["default"].createElement(emoji_mart_1.Picker, { onSelect: onSelect, native: true, sheetSize: 32, i18n: {
                        search: t(keys_1.langKeys.search),
                        categories: {
                            search: t(keys_1.langKeys.search_result),
                            recent: t(keys_1.langKeys.favorites),
                            people: t(keys_1.langKeys.emoticons),
                            nature: t(keys_1.langKeys.animals),
                            foods: t(keys_1.langKeys.food),
                            activity: t(keys_1.langKeys.activities),
                            places: t(keys_1.langKeys.travel),
                            objects: t(keys_1.langKeys.objects),
                            symbols: t(keys_1.langKeys.symbols),
                            flags: t(keys_1.langKeys.flags)
                        }
                    }, recent: emojiFavorite.length > 0 ? emojiFavorite === null || emojiFavorite === void 0 ? void 0 : emojiFavorite.map(function (x) { var _a, _b; return ((_b = (_a = emojisIndexed) === null || _a === void 0 ? void 0 : _a[x || ""]) === null || _b === void 0 ? void 0 : _b.id) || ''; }) : undefined, emojisToShowFilter: emojisNoShow && emojisNoShow.length > 0 ? function (emoji) { return emojisNoShow.map(function (x) { return x.toUpperCase(); }).indexOf(emoji.unified.toUpperCase()) === -1; } : undefined }))))));
};
exports.GifPickerZyx = function (_a) {
    var onSelect = _a.onSelect, style = _a.style;
    var _b = react_1["default"].useState(false), open = _b[0], setOpen = _b[1];
    var classes = emojiPickerStyle();
    var handleClick = function () { return setOpen(function (prev) { return !prev; }); };
    var t = react_i18next_1.useTranslation().t;
    var handleClickAway = function () { return setOpen(false); };
    var _c = react_1.useState([]), listGif = _c[0], setListGif = _c[1];
    var handlerSearch = function (text) {
        setListGif([]);
        fetch("https://api.tenor.com/v1/search?tag=" + text + "&key=WL0G6J5OBD12&locale=pe_EN&media_filter=minimal&limit=30")
            .then(function (response) { return response.json(); })
            .then(function (res) {
            setListGif(res.results);
        });
    };
    react_1["default"].useEffect(function () {
        var isSubscribed = true;
        fetch('https://api.tenor.com/v1/trending?key=WL0G6J5OBD12&locale=pe_ES&media_filter=minimal&limit=30')
            .then(function (response) { return response.json(); })
            .then(function (res) {
            if (isSubscribed)
                setListGif(res.results);
        });
        return function () {
            isSubscribed = false;
        };
    }, []);
    return (react_1["default"].createElement(ClickAwayListener_1["default"], { onClickAway: handleClickAway },
        react_1["default"].createElement("span", { style: style || undefined },
            react_1["default"].createElement(Tooltip_1["default"], { title: String(t(keys_1.langKeys.send_gif)), arrow: true, placement: "top" },
                react_1["default"].createElement(IconButton_1["default"], { onClick: handleClick, size: 'small' },
                    react_1["default"].createElement(icons_1.GifIcon, { className: classes.root }))),
            open && (react_1["default"].createElement("div", { style: {
                    position: 'absolute',
                    bottom: 50,
                    width: 342,
                    height: 400,
                    zIndex: 1201,
                    backgroundColor: 'white',
                    padding: 4,
                    boxShadow: '0 1px 2px 0 rgb(16 35 47 / 15%)',
                    display: 'flex',
                    flexDirection: 'column'
                } },
                react_1["default"].createElement(components_1.SearchField, { colorPlaceHolder: '#FFF', handleChangeOther: handlerSearch, lazy: true }),
                react_1["default"].createElement("div", { style: {
                        display: 'flex',
                        gap: 8,
                        marginTop: 4,
                        flexWrap: 'wrap',
                        height: '100%',
                        width: '100%',
                        overflowY: 'auto'
                    } }, listGif.map(function (item, index) {
                    return (react_1["default"].createElement("img", { style: { cursor: 'pointer' }, alt: "gif", width: 100, height: 100, className: "pointer", onClick: function () {
                            onSelect && onSelect(item.media[0].tinygif.url);
                            handleClickAway();
                        }, src: item.media[0].tinygif.url, key: index }));
                })))))));
};
exports.FieldEditWithSelect = function (_a) {
    var label = _a.label, className = _a.className, _b = _a.disabled, disabled = _b === void 0 ? false : _b, _c = _a.valueDefault, valueDefault = _c === void 0 ? "" : _c, onChange = _a.onChange, onBlur = _a.onBlur, error = _a.error, _d = _a.type, type = _d === void 0 ? "text" : _d, _e = _a.rows, rows = _e === void 0 ? 4 : _e, _f = _a.maxLength, maxLength = _f === void 0 ? 0 : _f, _g = _a.fregister, fregister = _g === void 0 ? {} : _g, _h = _a.primitive, primitive = _h === void 0 ? false : _h, _j = _a.inputProps, inputProps = _j === void 0 ? {} : _j, show = _a.show, data = _a.data, datakey = _a.datakey, datalabel = _a.datalabel, _k = _a.top, top = _k === void 0 ? 0 : _k, _l = _a.left, left = _l === void 0 ? 0 : _l, onClickSelection = _a.onClickSelection, onClickAway = _a.onClickAway;
    var _m = react_1.useState(""), value = _m[0], setvalue = _m[1];
    react_1.useEffect(function () {
        setvalue(valueDefault);
    }, [valueDefault]);
    var renderRow = function (props) {
        var index = props.index, style = props.style;
        return (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement(core_1.ListItem, { key: index, button: true, style: __assign(__assign({}, style), { padding: '8px' }), onClick: function (e) { return onClickSelection(e, data[index][datakey]); }, divider: true },
                react_1["default"].createElement(core_1.ListItemText, { primary: data[index][datalabel || datakey] }))));
    };
    return (react_1["default"].createElement("div", { className: className },
        react_1["default"].createElement(Box_1["default"], { fontWeight: 500, lineHeight: "18px", fontSize: 14, mb: 1, color: "textPrimary" }, label),
        react_1["default"].createElement(ClickAwayListener_1["default"], { onClickAway: function (_a) {
                var param = __rest(_a, []);
                return onClickAway(__assign({}, param));
            } },
            react_1["default"].createElement("div", { style: { position: 'relative' } },
                react_1["default"].createElement(TextField_1["default"], __assign({}, fregister, { color: "primary", fullWidth: true, disabled: disabled, type: type, error: !!error, value: value, multiline: true, minRows: rows, helperText: error || null, onChange: function (e) {
                        if (maxLength === 0 || e.target.value.length <= maxLength) {
                            setvalue(e.target.value);
                            onChange && onChange(e.target.value);
                        }
                    }, onBlur: function (e) {
                        onBlur && onBlur(e.target.value);
                    }, inputProps: inputProps })),
                maxLength !== 0 && react_1["default"].createElement(core_1.FormHelperText, { style: { textAlign: 'right' } },
                    maxLength - value.length,
                    "/",
                    maxLength),
                show ?
                    react_1["default"].createElement("div", { style: {
                            backgroundColor: '#FFFFFF',
                            position: 'absolute',
                            top: top,
                            left: left,
                            borderColor: 'lightgray',
                            borderStyle: 'solid',
                            borderWidth: '1px',
                            borderRadius: '5px',
                            zIndex: 9999
                        } },
                        react_1["default"].createElement(react_window_1.FixedSizeList, { className: "scroll-style-go", direction: "vertical", height: 200, width: 280, itemSize: 28, itemCount: data === null || data === void 0 ? void 0 : data.length }, renderRow))
                    : null))));
};
exports.FieldEditArray = function (_a) {
    var label = _a.label, _b = _a.style, style = _b === void 0 ? {} : _b, className = _a.className, _c = _a.disabled, disabled = _c === void 0 ? false : _c, _d = _a.valueDefault, valueDefault = _d === void 0 ? "" : _d, onChange = _a.onChange, onBlur = _a.onBlur, error = _a.error, _e = _a.type, type = _e === void 0 ? "text" : _e, _f = _a.rows, rows = _f === void 0 ? 1 : _f, _g = _a.fregister, fregister = _g === void 0 ? {} : _g, _h = _a.inputProps, inputProps = _h === void 0 ? {} : _h, _j = _a.variant, variant = _j === void 0 ? "standard" : _j;
    return (react_1["default"].createElement("div", { className: className, style: style },
        label && react_1["default"].createElement(Box_1["default"], { fontWeight: 500, lineHeight: "18px", fontSize: 14, mb: 1, color: "textPrimary" }, label),
        react_1["default"].createElement(TextField_1["default"], __assign({}, fregister, { color: "primary", fullWidth: true, disabled: disabled, type: type, defaultValue: valueDefault, variant: variant, error: !!error, helperText: error || null, minRows: rows, onChange: function (e) {
                onChange && onChange(e.target.value);
            }, onBlur: function (e) {
                onBlur && onBlur(e.target.value);
            }, inputProps: inputProps }))));
};
exports.TemplateSwitchArray = function (_a) {
    var className = _a.className, onChange = _a.onChange, defaultValue = _a.defaultValue, label = _a.label, _b = _a.tooltip, tooltip = _b === void 0 ? {} : _b;
    var t = react_i18next_1.useTranslation().t;
    var _c = react_1.useState([true, '1'].includes(defaultValue) ? true : false), value = _c[0], setValue = _c[1];
    return (react_1["default"].createElement("div", { className: className, style: { paddingBottom: '3px' } },
        label && react_1["default"].createElement(Box_1["default"], { fontWeight: 500, lineHeight: "18px", fontSize: 14, mb: 2, color: "textPrimary" }, label),
        react_1["default"].createElement(Tooltip_1["default"], { title: !!value ? t(keys_1.langKeys[tooltip === null || tooltip === void 0 ? void 0 : tooltip["true"]]) || '' : t(keys_1.langKeys[tooltip === null || tooltip === void 0 ? void 0 : tooltip["false"]]) || '' },
            react_1["default"].createElement(IOSSwitch_1["default"], { defaultChecked: defaultValue, onChange: function (e) {
                    onChange && onChange(e.target.checked);
                    setValue(e.target.checked);
                } }))));
};
var sxImageBox = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    p: 2,
    border: '1px dashed grey',
    textAlign: 'center'
};
exports.FieldUploadImage = function (_a) {
    var className = _a.className, onChange = _a.onChange, valueDefault = _a.valueDefault, label = _a.label;
    var t = react_i18next_1.useTranslation().t;
    var _b = react_1.useState(""), url = _b[0], setUrl = _b[1];
    react_1.useEffect(function () {
        setUrl(valueDefault || "");
    }, [valueDefault]);
    var getUrl = function (file) {
        if (!file)
            return "";
        try {
            var url_1 = URL.createObjectURL(file);
            return url_1;
        }
        catch (ex) {
            console.error(ex);
            return "";
        }
    };
    return (react_1["default"].createElement("div", { className: className },
        react_1["default"].createElement(Box_1["default"], { fontWeight: 500, lineHeight: "18px", fontSize: 14, mb: 1, color: "textPrimary" }, label),
        url === ""
            ?
                react_1["default"].createElement(Box_1["default"], { component: "label", sx: sxImageBox, style: { cursor: 'pointer' } },
                    react_1["default"].createElement(react_1["default"].Fragment, null,
                        react_1["default"].createElement("input", { type: "file", accept: "image/*", style: { display: 'none' }, onChange: function (e) {
                                var _a, _b, _c, _d, _e;
                                if ((((_a = e.target.files) === null || _a === void 0 ? void 0 : _a.length) || 0) > 0) {
                                    setUrl(getUrl((_c = (_b = e.target) === null || _b === void 0 ? void 0 : _b.files) === null || _c === void 0 ? void 0 : _c.item(0)));
                                    onChange && onChange((_e = (_d = e.target) === null || _d === void 0 ? void 0 : _d.files) === null || _e === void 0 ? void 0 : _e.item(0));
                                }
                            } }),
                        react_1["default"].createElement(CameraAlt_1["default"], null),
                        react_1["default"].createElement("span", null, t(keys_1.langKeys.uploadImage))))
            :
                react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement(Box_1["default"], { sx: sxImageBox, style: { cursor: 'pointer' }, onClick: function () {
                            setUrl("");
                            onChange && onChange("");
                        } },
                        react_1["default"].createElement(Delete_1["default"], null),
                        react_1["default"].createElement("span", null, t(keys_1.langKeys["delete"]))),
                    react_1["default"].createElement(Box_1["default"], { sx: __assign(__assign({}, sxImageBox), { borderTop: '0px' }) },
                        react_1["default"].createElement("img", { src: url, alt: url, style: { maxWidth: '300px' } })))));
};
var CssPhonemui = core_1.styled(material_ui_phone_number_1["default"])({
    minHeight: 'unset',
    '& .MuiInput-underline:after': {
        borderBottomColor: '#7721ad'
    }
});
exports.PhoneFieldEdit = function (_a) {
    var label = _a.label, error = _a.error, className = _a.className, props = __rest(_a, ["label", "error", "className"]);
    return (react_1["default"].createElement("div", { style: { display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }, className: className },
        react_1["default"].createElement(Box_1["default"], { fontWeight: 500, lineHeight: "18px", fontSize: 14, mb: 1, color: "textPrimary" }, label),
        react_1["default"].createElement(CssPhonemui, __assign({ variant: "standard", margin: "none", countryCodeEditable: false, disableAreaCodes: true, error: !!error, helperText: error || null }, props))));
};
function RadioGroudFieldEdit(_a) {
    var className = _a.className, onChange = _a.onChange, label = _a.label, data = _a.data, optionDesc = _a.optionDesc, optionValue = _a.optionValue, error = _a.error, _b = _a.readOnly, readOnly = _b === void 0 ? false : _b, _c = _a.disabled, disabled = _c === void 0 ? false : _c, props = __rest(_a, ["className", "onChange", "label", "data", "optionDesc", "optionValue", "error", "readOnly", "disabled"]);
    return (react_1["default"].createElement("div", { style: { display: 'flex', flexDirection: 'column' }, className: className },
        react_1["default"].createElement(Box_1["default"], { fontWeight: 500, lineHeight: "18px", fontSize: 14, mb: 1, color: "textPrimary" }, label),
        react_1["default"].createElement(core_1.RadioGroup, __assign({}, props), data.map(function (e, i) {
            return (react_1["default"].createElement(core_1.FormControlLabel, { key: i, value: e[optionValue], control: react_1["default"].createElement(core_1.Radio, { color: "primary" }), label: e[optionDesc], onChange: function () { return !readOnly && (onChange === null || onChange === void 0 ? void 0 : onChange(e)); }, disabled: disabled }));
        })),
        error && error !== '' && react_1["default"].createElement(core_1.FormHelperText, { error: true }, error)));
}
exports.RadioGroudFieldEdit = RadioGroudFieldEdit;
