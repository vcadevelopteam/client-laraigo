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
var hooks_1 = require("hooks");
var react_redux_1 = require("react-redux");
var Button_1 = require("@material-ui/core/Button");
var components_1 = require("components");
var helpers_1 = require("common/helpers");
var table_simple_1 = require("../components/fields/table-simple");
var styles_1 = require("@material-ui/core/styles");
var Save_1 = require("@material-ui/icons/Save");
var react_i18next_1 = require("react-i18next");
var keys_1 = require("lang/keys");
var react_hook_form_1 = require("react-hook-form");
var actions_1 = require("store/main/actions");
var actions_2 = require("store/popus/actions");
var Clear_1 = require("@material-ui/icons/Clear");
var icons_1 = require("@material-ui/icons");
var Warning_1 = require("@material-ui/icons/Warning");
var core_1 = require("@material-ui/core");
var InfoRounded_1 = require("@material-ui/icons/InfoRounded");
var arrayBread = [
    { id: "view-1", name: "Intelligent models" },
    { id: "view-2", name: "Intelligent models detail" }
];
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
    warningContainer: {
        backgroundColor: '#FFD9D9',
        padding: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        borderRadius: 5
    },
    customFieldPackageContainer: {
        marginBottom: '1rem',
        display: 'flex',
        flexDirection: 'column'
    },
    iconHelpText: {
        width: 15,
        height: 15,
        cursor: 'pointer'
    }
}); });
var DetailIntelligentModels = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    var _m = _a.data, row = _m.row, edit = _m.edit, setViewSelected = _a.setViewSelected, multiData = _a.multiData, fetchData = _a.fetchData, arrayBread2 = _a.arrayBread2;
    var classes = useStyles();
    var _o = react_1.useState(false), waitSave = _o[0], setWaitSave = _o[1];
    var executeRes = hooks_1.useSelector(function (state) { return state.main.execute; });
    var dispatch = react_redux_1.useDispatch();
    var t = react_i18next_1.useTranslation().t;
    var dataDomainStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    var _p = react_1.useState(''), selectedValue = _p[0], setSelectedValue = _p[1];
    var _q = react_1.useState(''), helperText = _q[0], setHelperText = _q[1];
    var statusData = [
        {
            domainvalue: "ACTIVO",
            domaindesc: "ACTIVO"
        },
        {
            domainvalue: "INACTIVO",
            domaindesc: "INACTIVO"
        },
    ];
    var helperServiceType = react_1.useCallback(function (value) {
        switch (value) {
            case "GENAI":
                return "Registra un servicio de inteligencia artificial generativa, con el uso de modelos como Llama3, GPT4, Gemini y más.";
            case "ASSISTANT":
                return "Registra un servicio de inteligencia artificial tradicional, crea tus modelos de detección de intenciones y entidades.";
            case "VOICECONVERSOR":
                return "Registra un servicio de transcripción y traducción de audio para tus conversaciones.";
            default:
                return "";
        }
    }, []);
    react_1.useEffect(function () {
        var updatedHelperText = helperServiceType(selectedValue);
        setHelperText(updatedHelperText);
    }, [selectedValue, helperServiceType]);
    var _r = react_hook_form_1.useForm({
        defaultValues: {
            type: row ? (row.type || '') : '',
            id: row ? row.id : 0,
            endpoint: row ? (row.endpoint || '') : '',
            modelid: row ? (row.modelid || '') : '',
            url: row ? (row.url || '') : '',
            apikey: row ? (row.apikey || '') : '',
            skillid: row ? (row.skillid || '') : '',
            name: row ? (row.name || '') : '',
            description: row ? (row.description || '') : '',
            provider: row ? (row.provider || '') : '',
            status: row ? row.status : 'ACTIVO',
            operation: row ? "EDIT" : "INSERT"
        }
    }), getValues = _r.getValues, register = _r.register, handleSubmit = _r.handleSubmit, setValue = _r.setValue, clearErrors = _r.clearErrors, errors = _r.formState.errors;
    react_1["default"].useEffect(function () {
        register('type');
        register('id');
        register('apikey', {
            validate: function (value) {
                return (value && value.length) || String(t(keys_1.langKeys.field_required));
            }
        });
        register('name', {
            validate: function (value) {
                return (value && value.length) || String(t(keys_1.langKeys.field_required));
            }
        });
        register('description', {
            validate: function (value) {
                return (value && value.length) || String(t(keys_1.langKeys.field_required));
            }
        });
        register('status', {
            validate: function (value) {
                return (value && value.length) || String(t(keys_1.langKeys.field_required));
            }
        });
        register('url', {
            validate: function (value) {
                return getValues('type') === 'Assistant' && getValues('provider') === 'IBM'
                    ? (value && value.length) || String(t(keys_1.langKeys.field_required))
                    : true;
            }
        });
        register('skillid', {
            validate: function (value) {
                return getValues('type') === 'Assistant' && getValues('provider') === 'IBM'
                    ? (value && value.length) || String(t(keys_1.langKeys.field_required))
                    : true;
            }
        });
    }, [register, getValues]);
    react_1["default"].useEffect(function () {
        var selectedType = getValues('type');
        if (selectedType === 'Conversor de voz') {
            setValue('provider', 'OpenAI');
            clearErrors('provider');
        }
        else if (selectedType === 'Assistant' && getValues('provider') === 'IBM') {
            register('url', {
                validate: function (value) {
                    return (value && value.length) || String(t(keys_1.langKeys.field_required));
                }
            });
            register('skillid', {
                validate: function (value) {
                    return (value && value.length) || String(t(keys_1.langKeys.field_required));
                }
            });
        }
        else {
            setValue('provider', '');
            clearErrors('provider');
        }
    }, [getValues, setValue, clearErrors, register]);
    react_1.useEffect(function () {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(actions_2.showSnackbar({ show: true, severity: "success", message: t(row ? keys_1.langKeys.successful_edit : keys_1.langKeys.successful_register) }));
                fetchData && fetchData();
                dispatch(actions_2.showBackdrop(false));
                setViewSelected("view-1");
            }
            else if (executeRes.error) {
                var errormessage = t(executeRes.code || "error_unexpected_error", { module: t(keys_1.langKeys.intelligentmodels).toLocaleLowerCase() });
                dispatch(actions_2.showSnackbar({ show: true, severity: "error", message: errormessage }));
                setWaitSave(false);
                dispatch(actions_2.showBackdrop(false));
            }
        }
    }, [executeRes, waitSave]);
    var onSubmit = handleSubmit(function (data) {
        var callback = function () {
            dispatch(actions_1.execute(helpers_1.insIntelligentModels(data)));
            dispatch(actions_2.showBackdrop(true));
            setWaitSave(true);
        };
        dispatch(actions_2.manageConfirmation({
            visible: true,
            question: t(keys_1.langKeys.confirmation_save),
            callback: callback
        }));
    });
    var genAiProviders = [
        {
            domaindesc: 'Laraigo',
            domainvalue: 'Laraigo'
        },
        {
            domaindesc: 'IBM',
            domainvalue: 'IBM'
        },
        {
            domaindesc: 'OpenAI',
            domainvalue: 'OpenAI'
        },
        {
            domaindesc: 'Google',
            domainvalue: 'Google'
        },
        {
            domaindesc: 'Microsoft Azure',
            domainvalue: 'Microsoft Azure'
        },
    ];
    var assistantProviders = [
        {
            domaindesc: 'IBM',
            domainvalue: 'IBM'
        },
        {
            domaindesc: 'Microsoft Azure',
            domainvalue: 'Microsoft Azure'
        },
        {
            domaindesc: 'Google',
            domainvalue: 'Google'
        },
        {
            domaindesc: 'Rasa',
            domainvalue: 'Rasa'
        },
        {
            domaindesc: 'Meta',
            domainvalue: 'Meta'
        },
    ];
    var handleFieldSelectChange = react_1.useCallback(function (newValue) {
        var selectedDomainValue = (newValue === null || newValue === void 0 ? void 0 : newValue.domainvalue) || '';
        setSelectedValue(selectedDomainValue);
    }, []);
    return (react_1["default"].createElement("div", { style: { width: '100%' } },
        react_1["default"].createElement("form", { onSubmit: onSubmit },
            react_1["default"].createElement("div", { style: { display: 'flex', justifyContent: 'space-between' } },
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement(components_1.TemplateBreadcrumbs, { breadcrumbs: !!arrayBread2 ? __spreadArrays(arrayBread2, [{ id: "view-1", name: t(keys_1.langKeys.preferred) }, { id: "view-2", name: t(keys_1.langKeys.iaconnectors) + " " + t(keys_1.langKeys.detail) }]) : arrayBread, handleClick: setViewSelected }),
                    react_1["default"].createElement(components_1.TitleDetail, { title: row ? "" + row.name : 'Nuevo Conector' })),
                react_1["default"].createElement("div", { style: { display: 'flex', gap: '10px', alignItems: 'center' } },
                    react_1["default"].createElement(Button_1["default"], { variant: "contained", type: "button", color: "primary", startIcon: react_1["default"].createElement(Clear_1["default"], { color: "secondary" }), style: { backgroundColor: "#FB5F5F" }, onClick: function () { return setViewSelected("view-1"); } }, t(keys_1.langKeys.back)),
                    react_1["default"].createElement(Button_1["default"], { className: classes.button, variant: "contained", color: "primary", type: "submit", startIcon: react_1["default"].createElement(Save_1["default"], { color: "secondary" }), style: { backgroundColor: "#55BD84" } }, t(keys_1.langKeys.save)))),
            react_1["default"].createElement("div", { className: classes.containerDetail },
                react_1["default"].createElement("div", { style: { display: 'flex', width: '100%' } },
                    react_1["default"].createElement("div", { className: classes.customFieldPackageContainer, style: { marginBottom: '1rem' } },
                        react_1["default"].createElement("span", { style: { fontWeight: 'bold', fontSize: 20 } }, 'Tipo de Servicio'),
                        react_1["default"].createElement("span", null, 'Selecciona el tipo de servicio que registrarás y emplearas en Laraigo'),
                        react_1["default"].createElement("div", { style: { display: 'flex', alignItems: 'center', marginTop: '0.5rem' } },
                            react_1["default"].createElement("div", { className: "row-zyx", style: { width: '30vw', marginBottom: 0 } },
                                react_1["default"].createElement(components_1.FieldSelect, { data: dataDomainStatus, variant: "outlined", optionDesc: 'domaindesc', optionValue: 'domainvalue', onChange: function (value) {
                                        handleFieldSelectChange(value);
                                        if (value) {
                                            setValue('type', value.domaindesc);
                                        }
                                        else {
                                            setValue('type', '');
                                        }
                                    }, valueDefault: getValues('type') })),
                            react_1["default"].createElement("div", { style: { margin: '0 0.5rem' } }, helperText && selectedValue && (react_1["default"].createElement(core_1.Tooltip, { title: helperText, arrow: true, placement: "top" },
                                react_1["default"].createElement(InfoRounded_1["default"], { color: "action", className: classes.iconHelpText })))),
                            react_1["default"].createElement("div", { style: { margin: '0 1rem', padding: '0' } }, getValues('type') === '' && (react_1["default"].createElement("div", { className: classes.warningContainer, style: { width: 220 } },
                                react_1["default"].createElement(Warning_1["default"], { style: { color: '#FF7575' } }),
                                "Selecciona una opci\u00F3n"))))),
                    getValues('type') &&
                        react_1["default"].createElement("div", { className: classes.customFieldPackageContainer, style: { marginBottom: '1rem' } },
                            react_1["default"].createElement("span", { style: { fontWeight: 'bold', fontSize: 20 } }, 'Proveedor'),
                            react_1["default"].createElement("span", null, 'Selecciona el proveedor del servicio de inteligencia artificial que deseas registrar.'),
                            react_1["default"].createElement("div", { style: { display: 'flex', alignItems: 'center', marginTop: '0.5rem' } },
                                react_1["default"].createElement("div", { className: "row-zyx", style: { width: '30vw', marginBottom: 0 } },
                                    react_1["default"].createElement(components_1.FieldSelect, { data: getValues('type') === 'Gen AI' ? genAiProviders : getValues('type') === 'Assistant' ? assistantProviders : getValues('type') === 'Conversor de voz' ? [{ domaindesc: 'OpenAI', domainvalue: 'OpenAI' }] : [], variant: "outlined", disabled: getValues('type') === 'Conversor de voz', optionDesc: 'domaindesc', optionValue: 'domainvalue', onChange: function (value) {
                                            handleFieldSelectChange(value);
                                            if (value) {
                                                setValue('provider', value.domaindesc);
                                            }
                                            else {
                                                setValue('provider', '');
                                            }
                                        }, valueDefault: getValues('type') === 'Conversor de voz' ? 'OpenAI' : getValues('provider') })),
                                react_1["default"].createElement("div", { style: { margin: '0 1rem', padding: '0' } }, getValues('provider') === '' && (react_1["default"].createElement("div", { className: classes.warningContainer, style: { width: 220 } },
                                    react_1["default"].createElement(Warning_1["default"], { style: { color: '#FF7575' } }),
                                    "Selecciona una opci\u00F3n")))))),
                getValues('type') && getValues('provider') && !(getValues('type') === 'Assistant' && getValues('provider') === 'IBM') && (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement("div", { className: 'row-zyx', style: { borderBottom: '1px solid black', padding: '15px 0 10px 0' } },
                        react_1["default"].createElement("span", { style: { fontWeight: 'bold', fontSize: 20 } }, 'Registro de Servicios')),
                    react_1["default"].createElement("div", { style: { display: 'flex', width: '100%', gap: '1rem' } },
                        react_1["default"].createElement("div", { className: classes.customFieldPackageContainer, style: { marginBottom: '1rem' } },
                            react_1["default"].createElement("span", { style: { fontWeight: 'bold', fontSize: 18 } }, 'Api Key'),
                            react_1["default"].createElement("span", null, 'Registra el api key proporcionado por el proveedor de IA seleccionado.'),
                            react_1["default"].createElement("div", { style: { display: 'flex', alignItems: 'center', marginTop: '0.5rem' } },
                                react_1["default"].createElement("div", { className: "row-zyx", style: { width: '45vw', marginBottom: 0 } },
                                    react_1["default"].createElement(components_1.FieldEditPassword, { label: '', onChange: function (value) {
                                            setValue("apikey", value);
                                            clearErrors('apikey');
                                        }, valueDefault: getValues("apikey"), maxLength: 512, variant: "outlined", error: (_b = errors === null || errors === void 0 ? void 0 : errors.apikey) === null || _b === void 0 ? void 0 : _b.message })),
                                react_1["default"].createElement("div", { style: { margin: '0 0.5rem' } },
                                    react_1["default"].createElement(core_1.Tooltip, { title: 'El api key usualmente se encuentra en el perfil de tu cuenta relacionada al proveedor de la inteligencia artificial.', arrow: true, placement: "top" },
                                        react_1["default"].createElement(InfoRounded_1["default"], { color: "action", className: classes.iconHelpText }))))),
                        react_1["default"].createElement("div", { className: classes.customFieldPackageContainer, style: { marginBottom: '1rem' } },
                            react_1["default"].createElement("span", { style: { fontWeight: 'bold', fontSize: 18 } }, 'Estado'),
                            react_1["default"].createElement("span", null, 'Selecciona el estado de tu conector, si deseas que se encuentre activo o inactivo.'),
                            react_1["default"].createElement("div", { style: { display: 'flex', alignItems: 'center', marginTop: '0.5rem' } },
                                react_1["default"].createElement("div", { className: "row-zyx", style: { width: '45vw', marginBottom: 0 } },
                                    react_1["default"].createElement(components_1.FieldSelect, { data: statusData, variant: "outlined", optionDesc: 'domaindesc', optionValue: 'domainvalue', onChange: function (value) {
                                            handleFieldSelectChange(value);
                                            if (value) {
                                                setValue('status', value.domaindesc);
                                                clearErrors('status');
                                            }
                                            else {
                                                setValue('status', '');
                                                clearErrors('status');
                                            }
                                        }, valueDefault: getValues('status'), error: (_c = errors === null || errors === void 0 ? void 0 : errors.status) === null || _c === void 0 ? void 0 : _c.message }))))),
                    react_1["default"].createElement("div", { style: { display: 'flex', width: '100%', gap: '3rem' } },
                        react_1["default"].createElement("div", { className: classes.customFieldPackageContainer, style: { marginBottom: '1rem' } },
                            react_1["default"].createElement("span", { style: { fontWeight: 'bold', fontSize: 18 } }, 'Nombre'),
                            react_1["default"].createElement("span", null, 'Asigna un nombre para el conector que registrarás.'),
                            react_1["default"].createElement("div", { style: { display: 'flex', alignItems: 'center', marginTop: '0.5rem' } },
                                react_1["default"].createElement("div", { className: "row-zyx", style: { width: '45vw', marginBottom: 0 } },
                                    react_1["default"].createElement(components_1.FieldEdit, { label: '', onChange: function (value) {
                                            setValue("name", value);
                                            clearErrors('name');
                                        }, valueDefault: getValues("name"), maxLength: 512, variant: "outlined", error: (_d = errors === null || errors === void 0 ? void 0 : errors.name) === null || _d === void 0 ? void 0 : _d.message })))),
                        react_1["default"].createElement("div", { className: classes.customFieldPackageContainer, style: { marginBottom: '1rem' } },
                            react_1["default"].createElement("span", { style: { fontWeight: 'bold', fontSize: 18 } }, 'Descripción'),
                            react_1["default"].createElement("span", null, 'Asigna una breve descripción al conector que registrarás.'),
                            react_1["default"].createElement("div", { style: { display: 'flex', alignItems: 'center', marginTop: '0.5rem' } },
                                react_1["default"].createElement("div", { className: "row-zyx", style: { width: '45vw', marginBottom: 0 } },
                                    react_1["default"].createElement(components_1.FieldEdit, { label: '', onChange: function (value) {
                                            setValue("description", value);
                                            clearErrors('description');
                                        }, valueDefault: getValues("description"), maxLength: 512, variant: "outlined", error: (_e = errors === null || errors === void 0 ? void 0 : errors.description) === null || _e === void 0 ? void 0 : _e.message }))))))),
                getValues('type') === 'Assistant' && getValues('provider') === 'IBM' && (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement("div", { className: 'row-zyx', style: { borderBottom: '1px solid black', padding: '15px 0 10px 0' } },
                        react_1["default"].createElement("span", { style: { fontWeight: 'bold', fontSize: 20 } }, 'Registro de Servicios')),
                    react_1["default"].createElement("div", { style: { display: 'flex', width: '100%', gap: '3rem' } },
                        react_1["default"].createElement("div", { className: classes.customFieldPackageContainer, style: { marginBottom: '1rem' } },
                            react_1["default"].createElement("span", { style: { fontWeight: 'bold', fontSize: 18 } }, 'Url'),
                            react_1["default"].createElement("span", null, 'Coloca la url que brinda IBM relacionada a la instancia del modelo que deseas registrar.'),
                            react_1["default"].createElement("div", { style: { display: 'flex', alignItems: 'center', marginTop: '0.5rem' } },
                                react_1["default"].createElement("div", { className: "row-zyx", style: { width: '92.2vw', marginBottom: 0 } },
                                    react_1["default"].createElement(components_1.FieldEditPassword, { label: '', onChange: function (value) {
                                            setValue("url", value);
                                            clearErrors('url');
                                        }, valueDefault: getValues("url"), maxLength: 512, variant: "outlined", error: (_f = errors === null || errors === void 0 ? void 0 : errors.url) === null || _f === void 0 ? void 0 : _f.message }))))),
                    react_1["default"].createElement("div", { style: { display: 'flex', width: '100%', gap: '3rem' } },
                        react_1["default"].createElement("div", { className: classes.customFieldPackageContainer, style: { marginBottom: '1rem' } },
                            react_1["default"].createElement("span", { style: { fontWeight: 'bold', fontSize: 18 } }, 'Api Key'),
                            react_1["default"].createElement("span", null, 'Registra el api key proporcionado por el proveedor de IA seleccionado.'),
                            react_1["default"].createElement("div", { style: { display: 'flex', alignItems: 'center', marginTop: '0.5rem' } },
                                react_1["default"].createElement("div", { className: "row-zyx", style: { width: '45vw', marginBottom: 0 } },
                                    react_1["default"].createElement(components_1.FieldEditPassword, { label: '', onChange: function (value) {
                                            setValue("apikey", value);
                                            clearErrors('apikey');
                                        }, valueDefault: getValues("apikey"), maxLength: 512, variant: "outlined", error: (_g = errors === null || errors === void 0 ? void 0 : errors.apikey) === null || _g === void 0 ? void 0 : _g.message })))),
                        react_1["default"].createElement("div", { className: classes.customFieldPackageContainer, style: { marginBottom: '1rem' } },
                            react_1["default"].createElement("span", { style: { fontWeight: 'bold', fontSize: 18 } }, 'Skill ID'),
                            react_1["default"].createElement("span", null, 'Registra el api key proporcionado por el proveedor de IA seleccionado.'),
                            react_1["default"].createElement("div", { style: { display: 'flex', alignItems: 'center', marginTop: '0.5rem' } },
                                react_1["default"].createElement("div", { className: "row-zyx", style: { width: '45vw', marginBottom: 0 } },
                                    react_1["default"].createElement(components_1.FieldEditPassword, { label: '', onChange: function (value) {
                                            setValue("skillid", value);
                                            clearErrors('skillid');
                                        }, valueDefault: getValues("skillid"), maxLength: 512, variant: "outlined", error: (_h = errors === null || errors === void 0 ? void 0 : errors.skillid) === null || _h === void 0 ? void 0 : _h.message })),
                                react_1["default"].createElement("div", { style: { margin: '0 0.5rem' } },
                                    react_1["default"].createElement(core_1.Tooltip, { title: 'Si no cuentas con un skill creado previamente en IBM, podrás crearlo en la opción de “Entrenamiento IA” de Laraigo.', arrow: true, placement: "top" },
                                        react_1["default"].createElement(InfoRounded_1["default"], { color: "action", className: classes.iconHelpText })))))),
                    react_1["default"].createElement("div", { style: { display: 'flex', width: '100%', gap: '3rem' } },
                        react_1["default"].createElement("div", { className: classes.customFieldPackageContainer, style: { marginBottom: '1rem' } },
                            react_1["default"].createElement("span", { style: { fontWeight: 'bold', fontSize: 18 } }, 'Nombre'),
                            react_1["default"].createElement("span", null, 'Asigna un nombre para el conector que registrarás.'),
                            react_1["default"].createElement("div", { style: { display: 'flex', alignItems: 'center', marginTop: '0.5rem' } },
                                react_1["default"].createElement("div", { className: "row-zyx", style: { width: '45vw', marginBottom: 0 } },
                                    react_1["default"].createElement(components_1.FieldEdit, { label: '', onChange: function (value) {
                                            setValue("name", value);
                                            clearErrors('name');
                                        }, valueDefault: getValues("name"), maxLength: 512, variant: "outlined", error: (_j = errors === null || errors === void 0 ? void 0 : errors.name) === null || _j === void 0 ? void 0 : _j.message })))),
                        react_1["default"].createElement("div", { className: classes.customFieldPackageContainer, style: { marginBottom: '1rem' } },
                            react_1["default"].createElement("span", { style: { fontWeight: 'bold', fontSize: 18 } }, 'Descripción'),
                            react_1["default"].createElement("span", null, 'Asigna una breve descripción al conector que registrarás.'),
                            react_1["default"].createElement("div", { style: { display: 'flex', alignItems: 'center', marginTop: '0.5rem' } },
                                react_1["default"].createElement("div", { className: "row-zyx", style: { width: '45vw', marginBottom: 0 } },
                                    react_1["default"].createElement(components_1.FieldEdit, { label: '', onChange: function (value) {
                                            setValue("description", value);
                                            clearErrors('description');
                                        }, valueDefault: getValues("description"), maxLength: 512, variant: "outlined", error: (_k = errors === null || errors === void 0 ? void 0 : errors.description) === null || _k === void 0 ? void 0 : _k.message }))))),
                    react_1["default"].createElement("div", { style: { display: 'flex', width: '100%', gap: '3rem' } },
                        react_1["default"].createElement("div", { className: classes.customFieldPackageContainer, style: { marginBottom: '1rem' } },
                            react_1["default"].createElement("span", { style: { fontWeight: 'bold', fontSize: 18 } }, 'Estado'),
                            react_1["default"].createElement("span", null, 'Selecciona el estado de tu conector, si deseas que se encuentre activo o inactivo.'),
                            react_1["default"].createElement("div", { style: { display: 'flex', alignItems: 'center', marginTop: '0.5rem' } },
                                react_1["default"].createElement("div", { className: "row-zyx", style: { width: '45vw', marginBottom: 0 } },
                                    react_1["default"].createElement(components_1.FieldSelect, { data: statusData, variant: "outlined", optionDesc: 'domaindesc', optionValue: 'domainvalue', onChange: function (value) {
                                            handleFieldSelectChange(value);
                                            if (value) {
                                                setValue('status', value.domaindesc);
                                                clearErrors('status');
                                            }
                                            else {
                                                setValue('status', '');
                                                clearErrors('status');
                                            }
                                        }, valueDefault: getValues('status'), error: (_l = errors === null || errors === void 0 ? void 0 : errors.status) === null || _l === void 0 ? void 0 : _l.message })))))))))));
};
var IntelligentModels = function (_a) {
    var setExternalViewSelected = _a.setExternalViewSelected, arrayBread = _a.arrayBread;
    var dispatch = react_redux_1.useDispatch();
    var t = react_i18next_1.useTranslation().t;
    var mainResult = hooks_1.useSelector(function (state) { return state.main; });
    var executeResult = hooks_1.useSelector(function (state) { return state.main.execute; });
    var _b = react_1.useState("view-1"), viewSelected = _b[0], setViewSelected = _b[1];
    var _c = react_1.useState({ row: null, edit: false }), rowSelected = _c[0], setRowSelected = _c[1];
    var _d = react_1.useState(false), waitSave = _d[0], setWaitSave = _d[1];
    var mainPaginated = hooks_1.useSelector(function (state) { return state.main.mainPaginated; });
    var _e = react_1.useState({}), selectedRows = _e[0], setSelectedRows = _e[1];
    var _f = react_1.useState([]), rowWithDataSelected = _f[0], setRowWithDataSelected = _f[1];
    var selectionKey = "id";
    var functionChange = function (change) {
        if (change === "view-0") {
            setExternalViewSelected && setExternalViewSelected("view-1");
        }
        else {
            setViewSelected(change);
        }
    };
    var columns = react_1["default"].useMemo(function () { return [
        {
            Header: t(keys_1.langKeys.name),
            accessor: 'name',
            NoFilter: false,
            width: 'auto'
        },
        {
            Header: t(keys_1.langKeys.description),
            accessor: 'description',
            NoFilter: false,
            width: 'auto'
        },
        {
            Header: t(keys_1.langKeys.type_service),
            accessor: 'type',
            type: "select",
            listSelectFilter: [
                { key: "Gen AI", value: "GenAI" },
                { key: "Assistant", value: "Assistant" },
                { key: "Conversor de voz", value: "VoiceConversor" },
            ],
            width: 'auto'
        },
        {
            Header: t(keys_1.langKeys.provider),
            accessor: 'provider',
            type: "select",
            listSelectFilter: [
                { key: "LaraigoLLM", value: "LaraigoLLM" },
                { key: "WatsonX", value: "WatsonX" },
                { key: "Open AI", value: "Open AI" },
                { key: "Meta", value: "Meta" },
                { key: "Mistral", value: "Mistral" },
            ],
            width: 'auto',
            Cell: function (props) {
                var provider = props.cell.row.original.provider;
                return provider !== '' ? provider : t(keys_1.langKeys.none);
            }
        },
        {
            accessor: "createdate",
            Header: t(keys_1.langKeys.timesheet_registerdate),
            NoFilter: false,
            type: "date",
            sortType: "datetime",
            width: 'auto',
            Cell: function (props) {
                var row = props.cell.row.original;
                if (row && row.createdate) {
                    return helpers_1.convertLocalDate(row.createdate).toLocaleString();
                }
                else {
                    return "";
                }
            }
        },
        {
            Header: t(keys_1.langKeys.createdBy),
            accessor: 'createby',
            NoFilter: false,
            width: 'auto'
        },
        {
            Header: t(keys_1.langKeys.status),
            accessor: 'status',
            type: "select",
            listSelectFilter: [
                { key: "ACTIVO", value: "ACTIVO" },
                { key: "DESACTIVO", value: "DESACTIVO" },
            ],
            prefixTranslation: 'status_',
            width: 'auto',
            Cell: function (props) {
                var status = (props.cell.row.original || {}).status;
                return (t(("status_" + status).toLowerCase()) || "").toUpperCase();
            }
        },
    ]; }, []);
    var fetchData = function () { return dispatch(actions_1.getCollection(helpers_1.getIntelligentModelsSel(0))); };
    react_1.useEffect(function () {
        fetchData();
        dispatch(actions_1.getMultiCollection([
            helpers_1.getValuesFromDomain("SERVICIOIA"),
        ]));
        return function () {
            dispatch(actions_1.resetAllMain());
        };
    }, []);
    react_1.useEffect(function () {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(actions_2.showSnackbar({ show: true, severity: "success", message: t(keys_1.langKeys.successful_delete) }));
                fetchData();
                dispatch(actions_2.showBackdrop(false));
                setWaitSave(false);
            }
            else if (executeResult.error) {
                var errormessage = t(executeResult.code || "error_unexpected_error", { module: t(keys_1.langKeys.intelligentmodels).toLocaleLowerCase() });
                dispatch(actions_2.showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(actions_2.showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);
    var handleRegister = function () {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: false });
    };
    var handleEdit = function (row) {
        setViewSelected("view-2");
        setRowSelected({ row: row, edit: true });
    };
    react_1.useEffect(function () {
        if (!(Object.keys(selectedRows).length === 0 && rowWithDataSelected.length === 0)) {
            var newRowWithDataSelected = Object.keys(selectedRows)
                .map(function (key) { var _a, _b; return (_b = (_a = mainResult.mainData.data.find(function (row) { return row.id === parseInt(key); })) !== null && _a !== void 0 ? _a : rowWithDataSelected.find(function (row) { return row.id === parseInt(key); })) !== null && _b !== void 0 ? _b : {}; })
                .filter(function (row) { return row.id; });
            setRowWithDataSelected(newRowWithDataSelected);
        }
    }, [selectedRows, mainResult.mainData.data]);
    var handleMassiveDelete = function (dataSelected) {
        var callback = function () {
            dataSelected.forEach(function (row) {
                var deleteOperation = __assign(__assign({}, row), { operation: 'DELETE', status: 'ELIMINADO', id: row.id });
                dispatch(actions_1.execute(helpers_1.insIntelligentModels(deleteOperation)));
            });
            dispatch(actions_2.showBackdrop(true));
            setWaitSave(true);
        };
        dispatch(actions_2.manageConfirmation({
            visible: true,
            question: t(keys_1.langKeys.confirmation_delete),
            callback: callback
        }));
    };
    if (viewSelected === "view-1") {
        return (react_1["default"].createElement("div", { style: { width: "100%", marginTop: '1rem', marginRight: '0.5rem' } },
            !!arrayBread && react_1["default"].createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                react_1["default"].createElement(components_1.TemplateBreadcrumbs, { breadcrumbs: __spreadArrays(arrayBread, [{ id: "view-1", name: t(keys_1.langKeys.iaconnectors) }]), handleClick: functionChange })),
            react_1["default"].createElement("div", { style: { fontSize: '1.5rem', fontWeight: 'bolder' } }, t(keys_1.langKeys.connectors)),
            react_1["default"].createElement(table_simple_1["default"], { ButtonsElement: function () {
                    if (!setExternalViewSelected) {
                        return (react_1["default"].createElement(react_1["default"].Fragment, null,
                            react_1["default"].createElement("div", { style: { marginTop: '0rem' } },
                                react_1["default"].createElement(Button_1["default"], { color: "primary", disabled: mainPaginated.loading || Object.keys(selectedRows).length === 0, startIcon: react_1["default"].createElement(icons_1.Delete, { style: { color: "white" } }), variant: "contained", onClick: function () {
                                        handleMassiveDelete(rowWithDataSelected);
                                    } }, t(keys_1.langKeys["delete"])))));
                    }
                    else {
                        return (react_1["default"].createElement(Button_1["default"], { disabled: mainResult.mainData.loading, variant: "contained", type: "button", color: "primary", startIcon: react_1["default"].createElement(Clear_1["default"], { color: "secondary" }), style: { backgroundColor: "#FB5F5F" }, onClick: function () { return setExternalViewSelected("view-1"); } }, t(keys_1.langKeys.back)));
                    }
                }, autotrigger: true, columns: columns, data: mainResult.mainData.data, filterGeneral: false, handleRegister: handleRegister, onClickRow: handleEdit, loading: mainResult.mainData.loading, register: true, download: true, useSelection: true, selectionKey: selectionKey, setSelectedRows: setSelectedRows, titlemodule: !!window.location.href.includes("iaconectors") ? " " : t(keys_1.langKeys.intelligentmodels, { count: 2 }) })));
    }
    else if (viewSelected === "view-2") {
        return (react_1["default"].createElement(DetailIntelligentModels, { data: rowSelected, setViewSelected: functionChange, multiData: mainResult.multiData.data, fetchData: fetchData, arrayBread2: arrayBread }));
    }
    else
        return null;
};
exports["default"] = IntelligentModels;
