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
exports.__esModule = true;
var react_1 = require("react");
var core_1 = require("@material-ui/core");
var components_1 = require("components");
var keys_1 = require("lang/keys");
var react_i18next_1 = require("react-i18next");
var actions_1 = require("store/main/actions");
var helpers_1 = require("common/helpers");
var hooks_1 = require("hooks");
var Edit_1 = require("@material-ui/icons/Edit");
var Delete_1 = require("@material-ui/icons/Delete");
var react_redux_1 = require("react-redux");
var actions_2 = require("store/popus/actions");
var useStyles = core_1.makeStyles(function () { return ({
    submotiveButton: {
        cursor: 'pointer',
        color: 'blue',
        textDecoration: 'underline',
        transition: 'color 0.3s',
        '&:hover': {
            color: '#002394',
            textDecoration: 'underline',
            backgroundColor: 'white'
        }
    },
    cancelButton: {
        marginLeft: 10,
        backgroundColor: 'red',
        color: 'white',
        '&:hover': {
            backgroundColor: '#850000'
        }
    },
    motiveForm: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    motiveRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    motiveText: {
        width: 200,
        border: '1px solid black',
        padding: 5,
        borderRadius: 5
    },
    actionButtons: {
        marginRight: 20,
        marginLeft: 20
    }
}); });
var MotiveDialog = function (_a) {
    var _b, _c, _d, _e;
    var openModal = _a.openModal, setOpenModal = _a.setOpenModal, fetchData = _a.fetchData, setOpenSubmotiveModal = _a.setOpenSubmotiveModal, row = _a.row, setRow = _a.setRow;
    var t = react_i18next_1.useTranslation().t;
    var classes = useStyles();
    var dispatch = react_redux_1.useDispatch();
    var executeRes = hooks_1.useSelector(function (state) { return state.main.execute; });
    var subreasons = hooks_1.useSelector(function (state) { return state.main.mainAux2; });
    var multiData = hooks_1.useSelector(function (state) { return state.main.multiData; });
    var _f = react_1.useState(''), newMotive = _f[0], setNewMotive = _f[1];
    var _g = react_1.useState(false), isEditing = _g[0], setIsEditing = _g[1];
    var _h = react_1.useState(false), waitSave = _h[0], setWaitSave = _h[1];
    var _j = react_1.useState(false), waitSave2 = _j[0], setWaitSave2 = _j[1];
    var _k = react_1.useState(false), motiveError = _k[0], setMotiveError = _k[1];
    var fetchSubReasons = function (id) { return dispatch(actions_1.getCollectionAux2(helpers_1.subReasonNonDeliverySel(id))); };
    var handleCreateMotive = (function () {
        var callback = function () {
            dispatch(actions_2.showBackdrop(true));
            if (isEditing) {
                dispatch(actions_1.execute(helpers_1.reasonNonDeliveryIns({
                    id: row === null || row === void 0 ? void 0 : row.reasonnondeliveryid,
                    status: row === null || row === void 0 ? void 0 : row.status,
                    type: row === null || row === void 0 ? void 0 : row.type,
                    description: newMotive,
                    operation: 'UPDATE'
                })));
            }
            else {
                dispatch(actions_1.execute(helpers_1.reasonNonDeliveryIns({
                    id: 0,
                    status: 'ACTIVO',
                    type: 'NINGUNO',
                    description: newMotive,
                    operation: 'INSERT'
                })));
            }
            setWaitSave(true);
        };
        if (newMotive !== '') {
            dispatch(actions_2.manageConfirmation({
                visible: true,
                question: t(keys_1.langKeys.confirmation_save),
                callback: callback
            }));
            cancelEdit();
        }
        else {
            setMotiveError(true);
        }
    });
    var handleDelete = function (row2) {
        var callback = function () {
            dispatch(actions_1.execute(helpers_1.reasonNonDeliveryIns(__assign(__assign({}, row2), { id: row2.reasonnondeliveryid, operation: "DELETE", status: "ELIMINADO" }))));
            dispatch(actions_2.showBackdrop(true));
            setWaitSave(true);
        };
        dispatch(actions_2.manageConfirmation({
            visible: true,
            question: t(keys_1.langKeys.confirmation_delete),
            callback: callback
        }));
    };
    react_1.useEffect(function () {
        var _a;
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                fetchData();
                dispatch(actions_2.showBackdrop(false));
            }
            else if (executeRes.error) {
                var errormessage = t((_a = executeRes.code) !== null && _a !== void 0 ? _a : "error_unexpected_error", {
                    module: t(keys_1.langKeys.domain).toLocaleLowerCase()
                });
                dispatch(actions_2.showSnackbar({ show: true, severity: "error", message: errormessage }));
                setWaitSave(false);
                dispatch(actions_2.showBackdrop(false));
            }
        }
    }, [executeRes, waitSave]);
    var handleEdit = function (row2) {
        setMotiveError(false);
        setIsEditing(true);
        setRow(row2);
        setNewMotive(row2.description);
    };
    var cancelEdit = function () {
        setIsEditing(false);
        setRow(null);
        setNewMotive('');
        setMotiveError(false);
    };
    var handleCloseModal = function () {
        setOpenModal(false);
        cancelEdit();
    };
    var handleSubmotives = function (row2) {
        dispatch(actions_2.showBackdrop(true));
        setRow(row2);
        setIsEditing(false);
        setNewMotive('');
        setMotiveError(false);
        fetchSubReasons(row2.reasonnondeliveryid);
        setWaitSave2(true);
    };
    react_1.useEffect(function () {
        var _a;
        if (waitSave2) {
            if (!subreasons.loading && !subreasons.error) {
                setOpenSubmotiveModal(true);
                dispatch(actions_2.showBackdrop(false));
            }
            else if (subreasons.error) {
                var errormessage = t((_a = subreasons.code) !== null && _a !== void 0 ? _a : "error_unexpected_error", {
                    module: t(keys_1.langKeys.domain).toLocaleLowerCase()
                });
                dispatch(actions_2.showSnackbar({ show: true, severity: "error", message: errormessage }));
                setWaitSave2(false);
                dispatch(actions_2.showBackdrop(false));
            }
        }
    }, [subreasons, waitSave2]);
    return (react_1["default"].createElement(components_1.DialogZyx, { open: openModal, title: t(keys_1.langKeys.ticket_reason) + " " + t(keys_1.langKeys.undelivered), maxWidth: "md", buttonText0: t(keys_1.langKeys.back), handleClickButton0: handleCloseModal },
        react_1["default"].createElement("div", null,
            react_1["default"].createElement("div", { className: classes.motiveForm },
                react_1["default"].createElement(components_1.FieldEdit, { variant: "outlined", label: t(keys_1.langKeys.ticket_reason), width: 280, error: motiveError, valueDefault: newMotive, onChange: function (value) {
                        setNewMotive(value);
                        setMotiveError(false);
                    } }),
                react_1["default"].createElement(core_1.Button, { variant: "contained", color: "primary", style: { marginLeft: 20 }, onClick: handleCreateMotive }, (isEditing ? t(keys_1.langKeys.edit) : t(keys_1.langKeys.add) + " " + t(keys_1.langKeys["new"])) + " " + t(keys_1.langKeys.ticket_reason)),
                isEditing && (react_1["default"].createElement(core_1.Button, { variant: "contained", className: classes.cancelButton, onClick: cancelEdit }, t(keys_1.langKeys.cancel)))),
            react_1["default"].createElement("div", null, ((_c = (_b = multiData === null || multiData === void 0 ? void 0 : multiData.data) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.data.length) > 0 && (react_1["default"].createElement("div", { style: { marginTop: 20 } }, (_e = (_d = multiData === null || multiData === void 0 ? void 0 : multiData.data) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.data.map(function (motive) { return (react_1["default"].createElement("div", { key: motive.reasonnondeliveryid, className: classes.motiveRow },
                react_1["default"].createElement("span", { className: classes.motiveText }, motive.description),
                react_1["default"].createElement("div", { className: classes.actionButtons },
                    react_1["default"].createElement(core_1.IconButton, { onClick: function () { return handleEdit(motive); } },
                        react_1["default"].createElement(Edit_1["default"], null)),
                    react_1["default"].createElement(core_1.IconButton, { onClick: function () { return handleDelete(motive); } },
                        react_1["default"].createElement(Delete_1["default"], null))),
                react_1["default"].createElement(core_1.Button, { className: classes.submotiveButton, onClick: function () { return handleSubmotives(motive); } }, t(keys_1.langKeys.managesubmotives)))); })))))));
};
exports["default"] = MotiveDialog;
