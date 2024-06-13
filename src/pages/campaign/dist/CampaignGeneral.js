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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.CampaignGeneral = void 0;
var react_1 = require("react");
var components_1 = require("components");
var helpers_1 = require("common/helpers");
var _types_1 = require("@types");
var styles_1 = require("@material-ui/core/styles");
var react_i18next_1 = require("react-i18next");
var keys_1 = require("lang/keys");
var react_hook_form_1 = require("react-hook-form");
var core_1 = require("@material-ui/core");
var actions_1 = require("store/main/actions");
var react_redux_1 = require("react-redux");
var actions_2 = require("store/popus/actions");
var TemplatePreview_1 = require("./components/TemplatePreview");
var ModalCampaignSchedule_1 = require("./components/ModalCampaignSchedule");
var useStyles = styles_1.makeStyles(function (theme) { return ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff'
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    flexgrow1: {
        flexGrow: 1
    },
    subtitle: {
        fontSize: '0.9rem',
        color: 'grey',
        marginBottom: '0.5rem'
    },
    title: {
        fontSize: '1rem',
        color: 'black'
    },
    buttonPreview: {
        color: '#009C8F',
        padding: '0.8rem 1rem',
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        cursor: 'pointer',
        textDecoration: 'none',
        borderTop: '1px solid #D7D7D7',
        '&:hover': {
            backgroundColor: '#FBFBFB'
        }
    },
    previewHour: {
        display: 'flex', justifyContent: 'right', fontSize: '0.78rem', color: 'grey', margin: '10px 0'
    },
    pdfPreview: {
        width: '100%',
        height: '500px',
        border: 'none',
        display: 'block',
        margin: '0 auto',
        borderRadius: '0.5rem'
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        background: '#F5D9D9',
        padding: '10px',
        marginTop: '7px',
        borderRadius: '5px',
        maxWidth: '100%',
        overflow: 'hidden'
    },
    copyButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        padding: '5px 10px',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    icon: {
        marginRight: '10px',
        color: '#DF3636'
    },
    fileName: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        flex: 1
    },
    carouselContainer: {
        display: 'flex',
        overflowX: 'auto',
        gap: '1rem',
        padding: '1rem 0'
    },
    carouselItem: {
        minWidth: '200px',
        maxWidth: '300px',
        borderRadius: '0.5rem',
        backgroundColor: '#fff',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '1rem',
        textAlign: 'center'
    }
}); });
var dataExecutionType = {
    MANUAL: 'manual',
    SCHEDULED: 'scheduled'
};
var dataSource = {
    INTERNAL: 'datasource_internal',
    EXTERNAL: 'datasource_external',
    PERSON: 'datasource_person',
    LEAD: 'datasource_lead'
};
var dataCampaignType = [
    { key: 'TEXTO', value: 'text' },
    { key: 'HSM', value: 'hsm', rif: 'startsWith', rifvalue: 'WHA' },
    { key: 'SMS', value: 'sms', rif: 'startsWith', rifvalue: 'SMS' },
    { key: 'CALL', value: 'call', rif: 'starsWith', rifvalue: 'VOX' },
    { key: 'MAIL', value: 'mail', rif: 'starsWith', rifvalue: 'MAI' },
];
exports.CampaignGeneral = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
    var row = _a.row, edit = _a.edit, auxdata = _a.auxdata, detaildata = _a.detaildata, setDetaildata = _a.setDetaildata, multiData = _a.multiData, fetchData = _a.fetchData, frameProps = _a.frameProps, setFrameProps = _a.setFrameProps, setPageSelected = _a.setPageSelected, setSave = _a.setSave, setIdAux = _a.setIdAux, setTemplateAux = _a.setTemplateAux;
    var classes = useStyles();
    var dispatch = react_redux_1.useDispatch();
    var t = react_i18next_1.useTranslation().t;
    var dataStatus = __spreadArrays(multiData[0] && multiData[0].success ? multiData[0].data : []);
    var dataChannel = __spreadArrays(multiData[1] && multiData[1].success ? (multiData[1].data || []).filter(function (x) { return ((x.type || '').startsWith('WHA') || (x.type || '').startsWith('SMS') || (x.type || '').startsWith('MAI') || (x.type || '').startsWith('VOX')); }) : []);
    var dataGroup = __spreadArrays(multiData[2] && multiData[2].success ? multiData[2].data : []);
    var dataMessageTemplate = __spreadArrays(multiData[3] && multiData[3].success ? multiData[3].data : []);
    var groupObligatory = ((_e = (_d = (_c = (_b = multiData.filter(function (x) { return x.key === "UFN_PROPERTY_SELBYNAMEVALIDACIONCAMPAÑASGRUPO"; })) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.propertyvalue) === "1";
    var _2 = react_1.useState(false), openModal = _2[0], setOpenModal = _2[1];
    var _3 = react_hook_form_1.useForm({
        defaultValues: {
            isnew: row ? false : true,
            id: row ? row.id : 0,
            communicationchannelid: (detaildata === null || detaildata === void 0 ? void 0 : detaildata.communicationchannelid) || ((auxdata === null || auxdata === void 0 ? void 0 : auxdata.length) > 0 ? auxdata[0].communicationchannelid : 0),
            communicationchanneltype: '',
            usergroup: (detaildata === null || detaildata === void 0 ? void 0 : detaildata.usergroup) || ((auxdata === null || auxdata === void 0 ? void 0 : auxdata.length) > 0 ? auxdata[0].usergroup : ''),
            type: (detaildata === null || detaildata === void 0 ? void 0 : detaildata.type) || ((auxdata === null || auxdata === void 0 ? void 0 : auxdata.length) > 0 ? auxdata[0].type : 'TEXTO'),
            status: (detaildata === null || detaildata === void 0 ? void 0 : detaildata.status) || ((auxdata === null || auxdata === void 0 ? void 0 : auxdata.length) > 0 ? auxdata[0].status : 'ACTIVO'),
            title: '',
            description: '',
            subject: '',
            message: '',
            startdate: '',
            enddate: '',
            repeatable: false,
            frecuency: 0,
            source: (detaildata === null || detaildata === void 0 ? void 0 : detaildata.source) || ((auxdata === null || auxdata === void 0 ? void 0 : auxdata.length) > 0 ? auxdata[0].source : 'EXTERNAL'),
            messagetemplateid: (detaildata === null || detaildata === void 0 ? void 0 : detaildata.messagetemplateid) || ((auxdata === null || auxdata === void 0 ? void 0 : auxdata.length) > 0 ? auxdata[0].messagetemplateid : 0),
            messagetemplatename: '',
            messagetemplatenamespace: '',
            messagetemplatetype: 'STANDARD',
            messagetemplateheader: {},
            messagetemplatebuttons: [],
            messagetemplatefooter: '',
            messagetemplateattachment: '',
            messagetemplatelanguage: '',
            messagetemplatepriority: '',
            executiontype: (detaildata === null || detaildata === void 0 ? void 0 : detaildata.executiontype) || ((auxdata === null || auxdata === void 0 ? void 0 : auxdata.length) > 0 ? auxdata[0].executiontype : 'MANUAL'),
            batchjson: ((_f = detaildata === null || detaildata === void 0 ? void 0 : detaildata.batchjson) === null || _f === void 0 ? void 0 : _f[0]) || { date: '', time: '', quantity: 0 },
            carouseljson: [],
            fields: new _types_1.SelectedColumns(),
            operation: row ? "UPDATE" : "INSERT",
            sourcechanged: false,
            headertype: (row === null || row === void 0 ? void 0 : row.headertype) || "none",
            buttonsphone: row ? row.buttonsphone || [] : [],
            buttonstext: row ? row.buttonstext || [] : [],
            header: (row === null || row === void 0 ? void 0 : row.header) || "",
            footer: (row === null || row === void 0 ? void 0 : row.footer) || "",
            buttons: row ? row.buttons || [] : [],
            date: (row === null || row === void 0 ? void 0 : row.date) || null,
            time: (row === null || row === void 0 ? void 0 : row.time) || null
        }
    }), register = _3.register, setValue = _3.setValue, getValues = _3.getValues, trigger = _3.trigger, errors = _3.formState.errors;
    var templateId = getValues('messagetemplateid');
    var selectedTemplate = dataMessageTemplate.find(function (template) { return template.id === templateId; }) || {};
    var fieldCounter = 5;
    var initialFieldCounter = fieldCounter;
    fieldCounter = initialFieldCounter;
    // console.log('Template en General', selectedTemplate)
    var carouseljsonData = selectedTemplate.carouseldata
        ? selectedTemplate.carouseldata.map(function (_a) {
            var bodyvariables = _a.bodyvariables, buttons = _a.buttons, rest = __rest(_a, ["bodyvariables", "buttons"]);
            return (__assign(__assign({}, rest), { body: rest.body.replace(/{{\d+}}/g, function () { return "{{field" + fieldCounter++ + "}}"; }), buttons: buttons.map(function (_a) {
                    var btn = _a.btn, buttonRest = __rest(_a, ["btn"]);
                    var url = btn.url;
                    if (btn.type === "dynamic" && !url.includes("{{")) {
                        url = url + "/{{field" + fieldCounter++ + "}}";
                    }
                    return __assign(__assign({}, buttonRest), { btn: __assign(__assign({}, btn), { url: url, variables: undefined }) });
                }) }));
        })
        : [];
    var templateButtonsData = __spreadArrays((selectedTemplate.buttonsgeneric || []).map(function (_a) {
        var btn = _a.btn, rest = __rest(_a, ["btn"]);
        return (__assign(__assign({}, rest), { btn: __assign(__assign({}, Object.fromEntries(Object.entries(btn).filter(function (_a) {
                var key = _a[0];
                return key !== 'variables';
            }))), { url: btn.url ? btn.url.replace(/{{\d+}}/g, function () { return "{{field" + fieldCounter++ + "}}"; }) : btn.url }) }));
    }), (selectedTemplate.buttonsquickreply || []).map(function (_a) {
        var btn = _a.btn, rest = __rest(_a, ["btn"]);
        return (__assign(__assign({}, rest), { btn: __assign(__assign({}, btn), { text: btn.text ? btn.text.replace(/{{\d+}}/g, function () { return "{{field" + fieldCounter++ + "}}"; }) : btn.text }) }));
    }));
    react_1.useEffect(function () {
        register('title', { validate: function (value) { return (value && value.length) || t(keys_1.langKeys.field_required); } });
        register('description', { validate: function (value) { return (value && value.length) || t(keys_1.langKeys.field_required); } });
        register('startdate', { validate: function (value) { return (value && value.length) || t(keys_1.langKeys.field_required); } });
        register('enddate', {
            validate: {
                value: function (value) { return (value && value.length) || t(keys_1.langKeys.field_required); },
                afterstart: function (value) { return validateDate(value) || t(keys_1.langKeys.field_afterstart); }
            }
        });
        register('executiontype', { validate: function (value) { return (value && value.length) || t(keys_1.langKeys.field_required); } });
        register('batchjson.date', { validate: function (value) { return (getValues('executiontype') !== 'SCHEDULED' || (value && value.length)) || t(keys_1.langKeys.field_required); } });
        register('batchjson.time', { validate: function (value) { return (getValues('executiontype') !== 'SCHEDULED' || (value && value.length)) || t(keys_1.langKeys.field_required); } });
        register('batchjson.quantity', { validate: function (value) { return (getValues('executiontype') !== 'SCHEDULED' || (value && value > 0)) || t(keys_1.langKeys.field_required); } });
        register('communicationchannelid', { validate: function (value) { return (value && value > 0) || t(keys_1.langKeys.field_required); } });
        register('status', { validate: function (value) { return (value && value.length) || t(keys_1.langKeys.field_required); } });
        register('source', { validate: function (value) { return (value && value.length) || t(keys_1.langKeys.field_required); } });
        register('type', { validate: function (value) { return (value && value.length) || t(keys_1.langKeys.field_required); } });
        if (groupObligatory) {
            register('usergroup', { validate: function (value) { return (value && value.length) || t(keys_1.langKeys.field_required); } });
        }
    }, [edit, register, multiData, groupObligatory]);
    react_1.useEffect(function () {
        if (row !== null && Object.keys(detaildata).length === 0) {
            if (auxdata.length > 0) {
                var messageTemplateData = dataMessageTemplate.find(function (d) { return d.id === auxdata[0].messagetemplateid; }) || {};
                setStepData(__assign(__assign({}, auxdata[0]), { messagetemplatename: messageTemplateData.name || auxdata[0].messagetemplatename || '', messagetemplatenamespace: messageTemplateData.namespace || auxdata[0].messagetemplatenamespace || '', messagetemplatetype: messageTemplateData.templatetype || 'STANDARD' }));
                trigger();
                dispatch(actions_1.resetMainAux());
            }
        }
        else if (Object.keys(detaildata).length !== 0) {
            setStepData(detaildata);
            trigger();
        }
    }, [auxdata, detaildata]);
    var setStepData = function (data) {
        var _a;
        setValue('id', data.id);
        setValue('communicationchannelid', data.communicationchannelid);
        setValue('communicationchanneltype', (_a = dataChannel.filter(function (d) { return d.communicationchannelid === (data === null || data === void 0 ? void 0 : data.communicationchannelid); })[0]) === null || _a === void 0 ? void 0 : _a.type);
        setValue('usergroup', data.usergroup);
        setValue('type', data.type);
        setValue('status', data.status);
        setValue('title', data.title);
        setValue('description', data.description);
        setValue('subject', data.subject);
        setValue('message', data.message);
        setValue('startdate', data.startdate);
        setValue('enddate', data.enddate);
        setValue('repeatable', data.repeatable);
        setValue('frecuency', data.frecuency);
        setValue('source', data.source || 'INTERNAL');
        setValue('messagetemplateid', data.messagetemplateid);
        setValue('messagetemplatename', data.messagetemplatename);
        setValue('messagetemplatenamespace', data.messagetemplatenamespace);
        setValue('messagetemplatetype', data.messagetemplatetype);
        setValue('messagetemplateheader', data.messagetemplateheader || {});
        setValue('messagetemplatebuttons', templateButtonsData || []);
        setValue('messagetemplatefooter', data.messagetemplatefooter || '');
        setValue('messagetemplateattachment', data.messagetemplateattachment || '');
        setValue('messagetemplatelanguage', data.messagetemplatelanguage || '');
        setValue('messagetemplatepriority', data.messagetemplatepriority || '');
        setValue('executiontype', data.executiontype);
        setValue('batchjson', data.batchjson || []);
        setValue('carouseljson', carouseljsonData || ['faileaste']);
        setValue('fields', __assign(__assign({}, new _types_1.SelectedColumns()), data.fields));
    };
    react_1.useEffect(function () {
        if (frameProps.checkPage) {
            trigger().then(function (valid) {
                var data = getValues();
                data.messagetemplateheader = data.messagetemplateheader || {};
                data.messagetemplatebuttons = templateButtonsData || [];
                data.batchjson = data.batchjson || [];
                data.carouseljson = carouseljsonData || ['faileaste'];
                data.fields = __assign(__assign({}, new _types_1.SelectedColumns()), data.fields);
                setDetaildata(__assign(__assign({}, detaildata), data));
                setFrameProps(__assign(__assign({}, frameProps), { executeSave: false, checkPage: false, valid: __assign(__assign({}, frameProps.valid), { 0: valid }) }));
                if (frameProps.page === 2 && !frameProps.valid[1]) {
                    dispatch(actions_2.showSnackbar({ show: true, severity: "error", message: t(keys_1.langKeys.no_person_selected) }));
                }
                else if (valid) {
                    setPageSelected(frameProps.page);
                }
                if (valid && frameProps.executeSave) {
                    setSave('VALIDATION');
                }
            });
        }
    }, [frameProps.checkPage]);
    var validateDate = function (value) {
        return new Date(value) >= new Date(getValues('startdate'));
    };
    var onChangeExecutionType = function (data) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setValue('executiontype', (data === null || data === void 0 ? void 0 : data.key) || '');
                    return [4 /*yield*/, trigger('executiontype')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var onChangeChannel = function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var channeltype;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setValue('communicationchannelid', (data === null || data === void 0 ? void 0 : data.communicationchannelid) || 0);
                    channeltype = (_a = dataChannel.filter(function (d) { return d.communicationchannelid === (data === null || data === void 0 ? void 0 : data.communicationchannelid); })[0]) === null || _a === void 0 ? void 0 : _a.type;
                    setValue('communicationchanneltype', channeltype);
                    if (channeltype === null || channeltype === void 0 ? void 0 : channeltype.startsWith('WHA')) {
                        onChangeType({ key: 'HSM' });
                    }
                    else if (channeltype === null || channeltype === void 0 ? void 0 : channeltype.startsWith('SMS')) {
                        onChangeType({ key: 'SMS' });
                    }
                    else if (channeltype === null || channeltype === void 0 ? void 0 : channeltype.startsWith('VOX')) {
                        onChangeType({ key: 'CALL' });
                    }
                    else if (channeltype === null || channeltype === void 0 ? void 0 : channeltype.startsWith('MAI')) {
                        onChangeType({ key: 'MAIL' });
                    }
                    else {
                        onChangeType({ key: 'TEXTO' });
                    }
                    return [4 /*yield*/, trigger(['communicationchannelid', 'communicationchanneltype', 'type'])];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var onChangeGroup = function (data) {
        setValue('usergroup', (data === null || data === void 0 ? void 0 : data.domainvalue) || '');
    };
    var onChangeStatus = function (data) {
        setValue('status', (data === null || data === void 0 ? void 0 : data.domainvalue) || '');
    };
    var filterDataSource = function () {
        return row !== null ? helpers_1.dictToArrayKV(dataSource) : helpers_1.filterPipe(helpers_1.dictToArrayKV(dataSource), 'key', 'INTERNAL', '!');
    };
    var onChangeSource = function (data) {
        if (['PERSON', 'LEAD'].includes(getValues('source'))) {
            setValue('message', getValues('message').replace(new RegExp(/{{field[0-9]+}}/, 'g'), '{{???}}'));
        }
        setValue('source', (data === null || data === void 0 ? void 0 : data.key) || '');
        setValue('sourcechanged', true);
        setFrameProps(__assign(__assign({}, frameProps), { valid: __assign(__assign({}, frameProps.valid), { 1: false }) }));
        dispatch(actions_1.resetCollectionPaginatedAux());
    };
    var filterDataCampaignType = function () {
        var _a, _b, _c, _d;
        if ((_a = getValues('communicationchanneltype')) === null || _a === void 0 ? void 0 : _a.startsWith('WHA')) {
            return dataCampaignType.filter(function (t) { return t.key === 'HSM'; });
        }
        else if ((_b = getValues('communicationchanneltype')) === null || _b === void 0 ? void 0 : _b.startsWith('SMS')) {
            return dataCampaignType.filter(function (t) { return t.key === 'SMS'; });
        }
        else if ((_c = getValues('communicationchanneltype')) === null || _c === void 0 ? void 0 : _c.startsWith('VOX')) {
            return dataCampaignType.filter(function (t) { return t.key === 'CALL'; });
        }
        else if ((_d = getValues('communicationchanneltype')) === null || _d === void 0 ? void 0 : _d.startsWith('MAI')) {
            return dataCampaignType.filter(function (t) { return t.key === 'MAIL'; });
        }
        else {
            return helpers_1.filterIf(dataCampaignType);
        }
    };
    var onChangeType = function (data) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setValue('type', (data === null || data === void 0 ? void 0 : data.key) || '');
                    setValue('message', '');
                    setValue('messagetemplateid', 0);
                    setValue('messagetemplatename', '');
                    setValue('messagetemplatenamespace', '');
                    setValue('messagetemplatetype', 'STANDARD');
                    setValue('messagetemplateheader', {});
                    setValue('messagetemplatebuttons', []);
                    setValue('messagetemplatefooter', '');
                    setValue('messagetemplateattachment', '');
                    setValue('messagetemplatelanguage', '');
                    setValue('messagetemplatepriority', '');
                    return [4 /*yield*/, trigger('type')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var filterMessageTemplate = function () {
        if (getValues('type') === "MAIL") {
            var mailTemplate = helpers_1.filterPipe(dataMessageTemplate, 'type', getValues('type'));
            var htmlTemplate = helpers_1.filterPipe(dataMessageTemplate, 'type', 'HTML');
            return __spreadArrays(mailTemplate, htmlTemplate);
        }
        else {
            return helpers_1.filterPipe(dataMessageTemplate, 'type', getValues('type'));
        }
    };
    var onChangeMessageTemplateId = function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var messageTemplate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setValue('messagetemplateid', (data === null || data === void 0 ? void 0 : data.id) || 0);
                    setIdAux((data === null || data === void 0 ? void 0 : data.id) || 0);
                    setTemplateAux(dataMessageTemplate.find(function (template) { return template.id === data.id; }) || {});
                    messageTemplate = dataMessageTemplate.filter(function (d) { return d.id === (data === null || data === void 0 ? void 0 : data.id); })[0];
                    setValue('message', messageTemplate === null || messageTemplate === void 0 ? void 0 : messageTemplate.body);
                    setValue('messagetemplatename', messageTemplate === null || messageTemplate === void 0 ? void 0 : messageTemplate.name);
                    setValue('messagetemplatenamespace', messageTemplate === null || messageTemplate === void 0 ? void 0 : messageTemplate.namespace);
                    setValue('messagetemplatetype', messageTemplate === null || messageTemplate === void 0 ? void 0 : messageTemplate.templatetype);
                    setValue('messagetemplatelanguage', messageTemplate === null || messageTemplate === void 0 ? void 0 : messageTemplate.language);
                    setValue('messagetemplatepriority', messageTemplate === null || messageTemplate === void 0 ? void 0 : messageTemplate.priority);
                    if ((data === null || data === void 0 ? void 0 : data.type) === 'HSM') {
                        if (messageTemplate.headerenabled)
                            setValue('messagetemplateheader', { type: messageTemplate === null || messageTemplate === void 0 ? void 0 : messageTemplate.headertype, value: messageTemplate === null || messageTemplate === void 0 ? void 0 : messageTemplate.header });
                        else
                            setValue('messagetemplateheader', { type: '', value: '' });
                        if (messageTemplate.buttonsenabled)
                            setValue('messagetemplatebuttons', (messageTemplate === null || messageTemplate === void 0 ? void 0 : messageTemplate.buttons) || []);
                        else
                            setValue('messagetemplatebuttons', []);
                        if (messageTemplate.footerenabled)
                            setValue('messagetemplatefooter', (messageTemplate === null || messageTemplate === void 0 ? void 0 : messageTemplate.footer) || '');
                        else
                            setValue('messagetemplatefooter', '');
                    }
                    if ((data === null || data === void 0 ? void 0 : data.type) === 'MAIL' || (data === null || data === void 0 ? void 0 : data.type) === 'HTML') {
                        if (messageTemplate.header) {
                            setValue('messagetemplateheader', { type: "TEXT", value: messageTemplate === null || messageTemplate === void 0 ? void 0 : messageTemplate.header });
                            setValue('subject', messageTemplate === null || messageTemplate === void 0 ? void 0 : messageTemplate.header);
                        }
                        else {
                            setValue('messagetemplateheader', { type: '', value: '' });
                            setValue('subject', '');
                        }
                        if (messageTemplate.attachment)
                            setValue('messagetemplateattachment', (messageTemplate === null || messageTemplate === void 0 ? void 0 : messageTemplate.attachment) || '');
                        else
                            setValue('messagetemplateattachment', '');
                    }
                    return [4 /*yield*/, trigger(['messagetemplateid', 'messagetemplatename', 'messagetemplatenamespace', 'messagetemplatetype'])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", { style: { display: 'flex', gap: '1rem', width: '100%' } },
            react_1["default"].createElement("div", { className: classes.containerDetail, style: { width: '50%' } },
                react_1["default"].createElement("div", { className: "row-zyx" },
                    edit ?
                        react_1["default"].createElement(core_1.FormControl, { className: "col-12" },
                            react_1["default"].createElement("div", { style: { fontSize: '1rem', color: 'black' } },
                                " ",
                                t(keys_1.langKeys.title),
                                " "),
                            react_1["default"].createElement("div", { className: classes.subtitle },
                                " ",
                                t(keys_1.langKeys.campaign_title_desc),
                                " "),
                            react_1["default"].createElement(components_1.FieldEdit, { variant: "outlined", className: "col-12", valueDefault: getValues('title'), onChange: function (value) { return setValue('title', value); }, error: (_g = errors === null || errors === void 0 ? void 0 : errors.title) === null || _g === void 0 ? void 0 : _g.message }))
                        :
                            react_1["default"].createElement(components_1.FieldView, { label: t(keys_1.langKeys.title), value: (row === null || row === void 0 ? void 0 : row.title) || "", className: "col-12" }),
                    edit ?
                        react_1["default"].createElement(core_1.FormControl, { className: "col-12" },
                            react_1["default"].createElement("div", { style: { fontSize: '1rem', color: 'black' } },
                                " ",
                                t(keys_1.langKeys.description),
                                " "),
                            react_1["default"].createElement("div", { className: classes.subtitle },
                                " ",
                                t(keys_1.langKeys.campaign_description_desc),
                                " "),
                            react_1["default"].createElement(components_1.FieldEdit, { variant: "outlined", className: "col-12", valueDefault: getValues('description'), onChange: function (value) { return setValue('description', value); }, error: (_h = errors === null || errors === void 0 ? void 0 : errors.description) === null || _h === void 0 ? void 0 : _h.message }))
                        :
                            react_1["default"].createElement(components_1.FieldView, { label: t(keys_1.langKeys.description), value: (row === null || row === void 0 ? void 0 : row.description) || "", className: "col-12" })),
                react_1["default"].createElement("div", { className: "row-zyx" },
                    edit ?
                        react_1["default"].createElement(core_1.FormControl, { className: "col-6" },
                            react_1["default"].createElement("div", { style: { fontSize: '1rem', color: 'black' } },
                                " ",
                                t(keys_1.langKeys.startdate),
                                " "),
                            react_1["default"].createElement("div", { className: classes.subtitle },
                                " ",
                                t(keys_1.langKeys.campaign_startdate_desc),
                                " "),
                            react_1["default"].createElement(components_1.FieldEdit, { variant: "outlined", type: "date", className: "col-6", valueDefault: getValues('startdate'), onChange: function (value) { return setValue('startdate', value); }, error: (_j = errors === null || errors === void 0 ? void 0 : errors.startdate) === null || _j === void 0 ? void 0 : _j.message }))
                        :
                            react_1["default"].createElement(components_1.FieldView, { label: t(keys_1.langKeys.startdate), value: (row === null || row === void 0 ? void 0 : row.startdate) || "", className: "col-6" }),
                    edit ?
                        react_1["default"].createElement(core_1.FormControl, { className: "col-6" },
                            react_1["default"].createElement("div", { className: classes.title },
                                " ",
                                t(keys_1.langKeys.enddate),
                                " "),
                            react_1["default"].createElement("div", { className: classes.subtitle },
                                " ",
                                t(keys_1.langKeys.campaign_enddate_desc),
                                " "),
                            react_1["default"].createElement(components_1.FieldEdit, { variant: "outlined", type: "date", className: "col-6", valueDefault: getValues('enddate'), onChange: function (value) { return setValue('enddate', value); }, error: (_k = errors === null || errors === void 0 ? void 0 : errors.enddate) === null || _k === void 0 ? void 0 : _k.message }))
                        :
                            react_1["default"].createElement(components_1.FieldView, { label: t(keys_1.langKeys.enddate), value: (row === null || row === void 0 ? void 0 : row.enddate) || "", className: "col-6" }),
                    edit ?
                        react_1["default"].createElement(core_1.FormControl, { className: "col-12" },
                            react_1["default"].createElement("div", { style: { fontSize: '1rem', color: 'black' } },
                                " ",
                                t(keys_1.langKeys.source),
                                " "),
                            react_1["default"].createElement("div", { className: classes.subtitle },
                                " ",
                                t(keys_1.langKeys.campaign_origin_desc),
                                " "),
                            react_1["default"].createElement(components_1.FieldSelect, { variant: "outlined", uset: true, className: "col-12", valueDefault: getValues('source'), onChange: onChangeSource, error: (_l = errors === null || errors === void 0 ? void 0 : errors.source) === null || _l === void 0 ? void 0 : _l.message, data: filterDataSource(), optionDesc: "value", optionValue: "key" }))
                        :
                            react_1["default"].createElement(components_1.FieldView, { label: t(keys_1.langKeys.source), value: t(dataSource[row === null || row === void 0 ? void 0 : row.source]) || "", className: "col-12" }),
                    edit ?
                        react_1["default"].createElement(core_1.FormControl, { className: "col-6" },
                            react_1["default"].createElement("div", { style: { fontSize: '1rem', color: 'black' } },
                                " ",
                                t(keys_1.langKeys.executiontype),
                                " "),
                            react_1["default"].createElement("div", { className: classes.subtitle },
                                " ",
                                t(keys_1.langKeys.campaign_executiontype_desc),
                                " "),
                            react_1["default"].createElement(components_1.FieldSelect, { variant: "outlined", uset: true, className: classes.flexgrow1, valueDefault: getValues('executiontype'), onChange: onChangeExecutionType, error: (_m = errors === null || errors === void 0 ? void 0 : errors.executiontype) === null || _m === void 0 ? void 0 : _m.message, data: helpers_1.dictToArrayKV(dataExecutionType), optionDesc: "value", optionValue: "key" }))
                        :
                            react_1["default"].createElement(components_1.FieldView, { label: t(keys_1.langKeys.executiontype), value: t(dataExecutionType[row === null || row === void 0 ? void 0 : row.executiontype]) || "", className: "col-6" }),
                    edit && getValues('executiontype') === 'SCHEDULED' &&
                        react_1["default"].createElement("div", { className: "row-zyx" },
                            react_1["default"].createElement(core_1.FormControl, { className: "col-3" },
                                react_1["default"].createElement("div", { style: { fontSize: '1rem', color: 'black' } },
                                    " ",
                                    t(keys_1.langKeys.date),
                                    " "),
                                react_1["default"].createElement("div", { className: classes.subtitle },
                                    " ",
                                    t(keys_1.langKeys.campaign_execution_date),
                                    " "),
                                react_1["default"].createElement(components_1.FieldEdit, { variant: "outlined", type: "date", className: "col-6", valueDefault: getValues('batchjson.date'), onChange: function (value) {
                                        var batchjson = getValues('batchjson') || {};
                                        batchjson.date = value;
                                        setValue('batchjson', batchjson);
                                    }, error: (_p = (_o = errors === null || errors === void 0 ? void 0 : errors.batchjson) === null || _o === void 0 ? void 0 : _o.date) === null || _p === void 0 ? void 0 : _p.message })),
                            react_1["default"].createElement(core_1.FormControl, { className: "col-3" },
                                react_1["default"].createElement("div", { className: classes.title },
                                    " ",
                                    t(keys_1.langKeys.hour),
                                    " "),
                                react_1["default"].createElement("div", { className: classes.subtitle },
                                    " ",
                                    t(keys_1.langKeys.campaign_execution_time),
                                    " "),
                                react_1["default"].createElement(components_1.FieldEdit, { variant: "outlined", type: "time", className: "col-6", valueDefault: getValues('batchjson.time'), onChange: function (value) {
                                        var batchjson = getValues('batchjson') || {};
                                        batchjson.time = value;
                                        setValue('batchjson', batchjson);
                                    }, error: (_r = (_q = errors === null || errors === void 0 ? void 0 : errors.batchjson) === null || _q === void 0 ? void 0 : _q.time) === null || _r === void 0 ? void 0 : _r.message })),
                            react_1["default"].createElement(core_1.FormControl, { className: "col-3" },
                                react_1["default"].createElement("div", { className: classes.title },
                                    " ",
                                    t(keys_1.langKeys.quantity),
                                    " "),
                                react_1["default"].createElement("div", { className: classes.subtitle },
                                    " ",
                                    t(keys_1.langKeys.campaign_execution_time),
                                    " "),
                                react_1["default"].createElement(components_1.FieldEdit, { variant: "outlined", type: "number", className: "col-4", valueDefault: getValues('batchjson.quantity'), onChange: function (value) {
                                        var batchjson = getValues('batchjson') || {};
                                        batchjson.quantity = parseInt(value, 10);
                                        setValue('batchjson', batchjson);
                                    }, error: (_t = (_s = errors === null || errors === void 0 ? void 0 : errors.batchjson) === null || _s === void 0 ? void 0 : _s.quantity) === null || _t === void 0 ? void 0 : _t.message, inputProps: { min: 0, step: 1 } }))),
                    edit ?
                        react_1["default"].createElement(core_1.FormControl, { className: "col-6" },
                            react_1["default"].createElement("div", { style: { fontSize: '1rem', color: 'black' } },
                                " ",
                                t(keys_1.langKeys.group),
                                " "),
                            react_1["default"].createElement("div", { className: classes.subtitle },
                                " ",
                                t(keys_1.langKeys.campaign_group_desc),
                                " "),
                            react_1["default"].createElement(components_1.FieldSelect, { variant: "outlined", className: "col-6", valueDefault: getValues('usergroup'), onChange: onChangeGroup, error: (_u = errors === null || errors === void 0 ? void 0 : errors.usergroup) === null || _u === void 0 ? void 0 : _u.message, data: dataGroup, optionDesc: "domaindesc", optionValue: "domainvalue" }))
                        :
                            react_1["default"].createElement(components_1.FieldView, { label: t(keys_1.langKeys.group), value: dataGroup.filter(function (d) { return d.domainvalue === (row === null || row === void 0 ? void 0 : row.usergroup); })[0].domaindesc || "", className: "col-6" })),
                react_1["default"].createElement("div", { className: "row-zyx" }, edit ?
                    react_1["default"].createElement(core_1.FormControl, { className: "col-12" },
                        react_1["default"].createElement("div", { style: { fontSize: '1rem', color: 'black' } },
                            " ",
                            t(keys_1.langKeys.channel),
                            " "),
                        react_1["default"].createElement("div", { className: classes.subtitle },
                            " ",
                            t(keys_1.langKeys.campaign_channel_desc),
                            " "),
                        react_1["default"].createElement(components_1.FieldSelect, { variant: "outlined", className: "col-12", valueDefault: getValues('communicationchannelid'), disabled: !getValues('isnew'), onChange: onChangeChannel, error: (_v = errors === null || errors === void 0 ? void 0 : errors.communicationchannelid) === null || _v === void 0 ? void 0 : _v.message, data: dataChannel, optionDesc: "communicationchanneldesc", optionValue: "communicationchannelid" }))
                    :
                        react_1["default"].createElement(components_1.FieldView, { label: t(keys_1.langKeys.type), value: dataChannel.filter(function (d) { return d.communicationchannelid === (row === null || row === void 0 ? void 0 : row.communicationchannelid); })[0].communicationchanneldesc || "", className: "col-12" })),
                ['HSM'].includes(getValues('type')) ?
                    react_1["default"].createElement("div", { className: "row-zyx" },
                        edit ?
                            react_1["default"].createElement(core_1.FormControl, { className: "col-6" },
                                react_1["default"].createElement("div", { style: { fontSize: '1rem', color: 'black' } },
                                    " ",
                                    t(keys_1.langKeys.messagetemplate),
                                    " "),
                                react_1["default"].createElement("div", { className: classes.subtitle },
                                    " ",
                                    t(keys_1.langKeys.campaign_comunicationtemplate_desc),
                                    " "),
                                react_1["default"].createElement(components_1.FieldSelect, { fregister: __assign({}, register("messagetemplateid", {
                                        validate: function (value) { return (value) || t(keys_1.langKeys.field_required); }
                                    })), variant: "outlined", valueDefault: getValues('messagetemplateid'), disabled: !getValues('isnew'), onChange: onChangeMessageTemplateId, error: (_w = errors === null || errors === void 0 ? void 0 : errors.messagetemplateid) === null || _w === void 0 ? void 0 : _w.message, data: filterMessageTemplate(), optionDesc: "name", optionValue: "id" }))
                            :
                                react_1["default"].createElement(components_1.FieldView, { label: t(keys_1.langKeys.messagetemplate), value: dataMessageTemplate.filter(function (d) { return d.id === (row === null || row === void 0 ? void 0 : row.messagetemplateid); })[0].name || "", className: "col-6" }),
                        edit ?
                            react_1["default"].createElement(core_1.FormControl, { className: "col-6" },
                                react_1["default"].createElement("div", { style: { fontSize: '1rem', color: 'black' } },
                                    " ",
                                    t(keys_1.langKeys.namespace),
                                    " "),
                                react_1["default"].createElement("div", { className: classes.subtitle },
                                    " ",
                                    t(keys_1.langKeys.campaign_comunicationtemplate_desc),
                                    " "),
                                react_1["default"].createElement(components_1.FieldEdit, { fregister: __assign({}, register("messagetemplatenamespace", {
                                        validate: function (value) { return (getValues('type') !== 'HSM' ? true : value && value.length) || t(keys_1.langKeys.field_required); }
                                    })), variant: "outlined", className: "col-6", valueDefault: getValues('messagetemplatenamespace'), onChange: function (value) { return setValue('messagetemplatenamespace', value); }, disabled: !getValues('isnew') || getValues('messagetemplateid') !== 0, error: (_x = errors === null || errors === void 0 ? void 0 : errors.messagetemplatenamespace) === null || _x === void 0 ? void 0 : _x.message }))
                            :
                                react_1["default"].createElement(components_1.FieldView, { label: t(keys_1.langKeys.namespace), value: (row === null || row === void 0 ? void 0 : row.messagetemplatenamespace) || "", className: "col-4" }))
                    : null,
                ['SMS', 'MAIL'].includes(getValues('type')) ?
                    react_1["default"].createElement("div", { className: "row-zyx" }, edit ?
                        react_1["default"].createElement(components_1.FieldSelect, { fregister: __assign({}, register("messagetemplateid", {
                                validate: function (value) { return (value) || t(keys_1.langKeys.field_required); }
                            })), label: t(keys_1.langKeys.messagetemplate), className: "col-6", valueDefault: getValues('messagetemplateid'), disabled: !getValues('isnew'), onChange: onChangeMessageTemplateId, error: (_y = errors === null || errors === void 0 ? void 0 : errors.messagetemplateid) === null || _y === void 0 ? void 0 : _y.message, data: filterMessageTemplate(), optionDesc: "name", optionValue: "id" })
                        :
                            react_1["default"].createElement(components_1.FieldView, { label: t(keys_1.langKeys.messagetemplate), value: dataMessageTemplate.filter(function (d) { return d.id === (row === null || row === void 0 ? void 0 : row.messagetemplateid); })[0].name || "", className: "col-6" }))
                    : null,
                react_1["default"].createElement("div", { className: "row-zyx" },
                    edit ?
                        react_1["default"].createElement(core_1.FormControl, { className: "col-6" },
                            react_1["default"].createElement("div", { style: { fontSize: '1rem', color: 'black' } },
                                " ",
                                t(keys_1.langKeys.status),
                                " "),
                            react_1["default"].createElement("div", { className: classes.subtitle },
                                " ",
                                t(keys_1.langKeys.campaign_status_desc),
                                " "),
                            react_1["default"].createElement(components_1.FieldSelect, { variant: "outlined", valueDefault: getValues('status'), onChange: onChangeStatus, error: (_z = errors === null || errors === void 0 ? void 0 : errors.status) === null || _z === void 0 ? void 0 : _z.message, data: dataStatus, optionDesc: "domaindesc", optionValue: "domainvalue" }))
                        :
                            react_1["default"].createElement(components_1.FieldView, { label: t(keys_1.langKeys.status), value: dataGroup.filter(function (d) { return d.domainvalue === (row === null || row === void 0 ? void 0 : row.status); })[0].domaindesc || "", className: "col-6" }),
                    edit ?
                        react_1["default"].createElement(core_1.FormControl, { className: "col-6" },
                            react_1["default"].createElement("div", { style: { fontSize: '1rem', color: 'black' } },
                                " ",
                                t(keys_1.langKeys.messagetype),
                                " "),
                            react_1["default"].createElement("div", { className: classes.subtitle },
                                " ",
                                t(keys_1.langKeys.campaign_messagetype_desc),
                                " "),
                            react_1["default"].createElement(components_1.FieldSelect, { variant: "outlined", uset: true, className: "col-6", valueDefault: getValues('type'), disabled: !getValues('isnew'), onChange: onChangeType, error: (_0 = errors === null || errors === void 0 ? void 0 : errors.type) === null || _0 === void 0 ? void 0 : _0.message, data: filterDataCampaignType(), optionDesc: "value", optionValue: "key" }))
                        :
                            react_1["default"].createElement(components_1.FieldView, { label: t(keys_1.langKeys.messagetype), value: t((_1 = filterDataCampaignType().filter(function (d) { return d.key === (row === null || row === void 0 ? void 0 : row.type); })[0]) === null || _1 === void 0 ? void 0 : _1.value) || "", className: "col-6" }))),
            react_1["default"].createElement("div", { style: { width: '50%' } },
                react_1["default"].createElement("div", { style: { fontSize: '1.2rem', marginTop: '2.1rem' } }, t('Previsualización de la Plantilla')),
                react_1["default"].createElement(TemplatePreview_1["default"], { selectedTemplate: selectedTemplate, variableValues: [] }))),
        react_1["default"].createElement(ModalCampaignSchedule_1.ModalCampaignSchedule, { openModal: openModal, setOpenModal: setOpenModal, data: getValues('batchjson'), parentSetValue: setValue })));
};
