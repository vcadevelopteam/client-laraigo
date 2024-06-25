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
exports.CampaignMessage = void 0;
var react_1 = require("react");
var components_1 = require("components");
var styles_1 = require("@material-ui/core/styles");
var react_i18next_1 = require("react-i18next");
var core_1 = require("@material-ui/core");
var Tooltip_1 = require("@material-ui/core/Tooltip");
var InfoRounded_1 = require("@material-ui/icons/InfoRounded");
var Add_1 = require("@material-ui/icons/Add");
var TemplatePreview_1 = require("./components/TemplatePreview");
var Delete_1 = require("@material-ui/icons/Delete");
var useStyles = styles_1.makeStyles(function (theme) { return ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff'
    },
    subtitle: {
        fontSize: '0.9rem',
        color: 'grey',
        marginBottom: '0.5rem'
    },
    iconHelpText: {
        width: 'auto',
        height: 23,
        cursor: 'pointer'
    },
    containerStyle: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
    }
}); });
exports.CampaignMessage = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j;
    var row = _a.row, edit = _a.edit, auxdata = _a.auxdata, detaildata = _a.detaildata, setDetaildata = _a.setDetaildata, multiData = _a.multiData, fetchData = _a.fetchData, tablevariable = _a.tablevariable, frameProps = _a.frameProps, setFrameProps = _a.setFrameProps, setPageSelected = _a.setPageSelected, setSave = _a.setSave, messageVariables = _a.messageVariables, setMessageVariables = _a.setMessageVariables, templateAux = _a.templateAux, jsonPersons = _a.jsonPersons;
    var classes = useStyles();
    var t = react_i18next_1.useTranslation().t;
    var dataMessageTemplate = __spreadArrays(multiData[3] && multiData[3].success ? multiData[3].data : []);
    var templateId = templateAux.id;
    var selectedTemplate = dataMessageTemplate.find(function (template) { return template.id === templateId; }) || {};
    var _k = react_1.useState(__assign({}, selectedTemplate)), filledTemplate = _k[0], setFilledTemplate = _k[1];
    var headers = jsonPersons.length > 0 ? Object.keys(jsonPersons[0]) : [];
    var _l = react_1.useState(''), selectedHeader = _l[0], setSelectedHeader = _l[1];
    var _m = react_1.useState({}), selectedHeaders = _m[0], setSelectedHeaders = _m[1];
    var _o = react_1.useState([1]), additionalVariables = _o[0], setAdditionalVariables = _o[1];
    var _p = react_1.useState({}), additionalVariableValues = _p[0], setAdditionalVariableValues = _p[1];
    var _q = react_1.useState({}), selectedAdditionalHeaders = _q[0], setSelectedAdditionalHeaders = _q[1];
    var messagetemplateid = (_e = (_d = (_c = (_b = multiData[4]) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.messagetemplateid) !== null && _e !== void 0 ? _e : null;
    var getTemplateById = function (id, data) {
        var _a, _b;
        return (_b = (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.find(function (template) { return template.id === id; })) !== null && _b !== void 0 ? _b : null;
    };
    var matchingTemplate = getTemplateById(messagetemplateid, multiData[3]);
    var isEmptyData = function (data) {
        return Object.keys(data).length === 0 && data.constructor === Object;
    };
    var templateToUse = isEmptyData(selectedTemplate) ? matchingTemplate : selectedTemplate;
    var handleHeaderChange = function (selectedOption) {
        setSelectedHeader(selectedOption ? selectedOption.key : '');
        setSelectedHeaders(function (prev) { return (__assign(__assign({}, prev), { main: selectedOption ? selectedOption.key : '' })); });
    };
    var detectVariables = function (text) {
        var regex = /{{(\d+)}}/g;
        var matches = [];
        var match;
        while ((match = regex.exec(text)) !== null) {
            matches.push({ variable: match[1] });
        }
        return matches;
    };
    var detectVariablesField = function (text) {
        var regex = /{{(field\d+|\d+)}}/g;
        var matches = [];
        var match;
        while ((match = regex.exec(text)) !== null) {
            matches.push({ variable: match[1] });
        }
        return matches;
    };
    var bodyVariables = detectVariables(templateToUse.body);
    var headerVariables = templateToUse.headertype === 'TEXT' ? detectVariables(templateToUse.header) : [];
    var _r = react_1.useState({}), bodyVariableValues = _r[0], setBodyVariableValues = _r[1];
    var _s = react_1.useState({}), headerVariableValues = _s[0], setHeaderVariableValues = _s[1];
    var _t = react_1.useState(''), videoHeaderValue = _t[0], setVideoHeaderValue = _t[1];
    var _u = react_1.useState({}), cardImageValues = _u[0], setCardImageValues = _u[1];
    var _v = react_1.useState({}), dynamicUrlValues = _v[0], setDynamicUrlValues = _v[1];
    var _w = react_1.useState({}), bubbleVariableValues = _w[0], setBubbleVariableValues = _w[1];
    var _x = react_1.useState({}), carouselVariableValues = _x[0], setCarouselVariableValues = _x[1];
    var _y = react_1.useState({}), variableSelections = _y[0], setVariableSelections = _y[1];
    var templateData = (_g = (_f = multiData[4]) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g[0];
    var columnsArray = templateData && templateData.fields ? __spreadArrays([templateData.fields.primarykey], templateData.fields.columns) : [];
    var dataToUse = headers.length > 0 ? headers : columnsArray;
    var _z = react_1.useState(''), selectedAuthVariable = _z[0], setSelectedAuthVariable = _z[1];
    var availableData = dataToUse.filter(function (header) { return !Object.values(__assign(__assign({}, selectedHeaders), selectedAdditionalHeaders)).includes(header); });
    var _0 = react_1.useState(null), campaignViewDetails = _0[0], setCampaignViewDetails = _0[1];
    var _1 = react_1.useState([]), variablesAux = _1[0], setVariablesAux = _1[1];
    var processMultiData = function (data) {
        var _a;
        var processedData = {
            bodyVariableValues: {},
            headerVariableValues: {},
            videoHeaderValue: '',
            cardImageValues: {},
            dynamicUrlValues: {},
            bubbleVariableValues: {},
            carouselVariableValues: {},
            additionalVariableValues: {},
            selectedAdditionalHeaders: {},
            selectedAuthVariable: ''
        };
        var campaignData = data[0];
        if (campaignData) {
            var bodyVariables_1 = detectVariablesField(campaignData.message);
            setVariablesAux(bodyVariables_1);
            bodyVariables_1.forEach(function (variable, index) {
                var fieldIndex = typeof variable.variable === 'string' ? parseInt(variable.variable.replace('field', ''), 10) : variable.variable;
                processedData.bodyVariableValues[index + 1] = "field" + fieldIndex;
            });
            if (campaignData.headertype === 'TEXT') {
                var headerVariables_1 = detectVariablesField(campaignData.header);
                headerVariables_1.forEach(function (variable, index) {
                    var fieldIndex = typeof variable.variable === 'string' ? parseInt(variable.variable.replace('field', ''), 10) : variable.variable;
                    processedData.headerVariableValues[index + 1] = "field" + fieldIndex;
                });
            }
            processedData.videoHeaderValue = ((_a = campaignData.messagetemplateheader) === null || _a === void 0 ? void 0 : _a.value) || '';
            if (campaignData.carouseljson) {
                campaignData.carouseljson.forEach(function (item, carouselIndex) {
                    processedData.carouselVariableValues[carouselIndex] = {};
                    if (item.bodyvariables) {
                        item.bodyvariables.forEach(function (variable, index) {
                            var fieldIndex = typeof variable.variable === 'string' ? parseInt(variable.variable.replace('field', ''), 10) : variable.variable;
                            processedData.carouselVariableValues[carouselIndex][index + 1] = "field" + fieldIndex;
                        });
                    }
                });
            }
        }
        return processedData;
    };
    react_1.useEffect(function () {
        if (multiData[4] && multiData[4].data && multiData[4].data.length > 0) {
            var combinedData_1 = __assign(__assign({}, multiData[4].data[0]), { operation: 'UPDATE' });
            setCampaignViewDetails(combinedData_1);
            var processedData = processMultiData(multiData[4].data);
            var newBodyVariableValues_1 = {};
            if (multiData[5] && multiData[5].data && multiData[5].data.length > 0) {
                var personData_1 = multiData[5].data[0];
                Object.entries(processedData.bodyVariableValues).forEach(function (_a, index) {
                    var key = _a[0], fieldKey = _a[1];
                    var fieldIndex = parseInt(fieldKey.replace('field', ''), 10);
                    newBodyVariableValues_1[index + 1] = personData_1[fieldKey];
                });
            }
            setBodyVariableValues(newBodyVariableValues_1);
            setHeaderVariableValues(processedData.headerVariableValues);
            setVideoHeaderValue(processedData.videoHeaderValue);
            setCardImageValues(processedData.cardImageValues);
            setDynamicUrlValues(processedData.dynamicUrlValues);
            setBubbleVariableValues(processedData.bubbleVariableValues);
            setCarouselVariableValues(processedData.carouselVariableValues);
            setAdditionalVariableValues(processedData.additionalVariableValues);
            setSelectedAdditionalHeaders(processedData.selectedAdditionalHeaders);
            setSelectedAuthVariable(processedData.selectedAuthVariable);
            if (combinedData_1.fields && combinedData_1.fields.primarykey) {
                setSelectedHeader(combinedData_1.fields.primarykey);
            }
            var bodyVars = detectVariablesField(combinedData_1.message);
            var newSelectedHeaders_1 = __assign({}, selectedHeaders);
            bodyVars.forEach(function (variable, index) {
                var fieldIndex;
                if (typeof variable.variable === 'string' && variable.variable.startsWith('field')) {
                    fieldIndex = parseInt(variable.variable.replace('field', ''), 10);
                }
                else {
                    fieldIndex = parseInt(variable.variable, 10);
                }
                var header = combinedData_1.fields.columns[fieldIndex - 2];
                newSelectedHeaders_1["body-" + (index + 1)] = header;
            });
            setSelectedHeaders(newSelectedHeaders_1);
            console.log('selectedHeaders:', newSelectedHeaders_1);
        }
    }, [multiData]);
    var handleVariableChange = function (variableNumber, selectedOption, variableType, carouselIndex) {
        var _a, _b;
        var header = selectedOption ? selectedOption.key : '';
        var value = jsonPersons.length > 0 ? jsonPersons[0][header] : '';
        if (variableType === 'video') {
            setVideoHeaderValue(value);
        }
        else if (variableType === 'body') {
            setBodyVariableValues(function (prevValues) {
                var _a;
                return (__assign(__assign({}, prevValues), (_a = {}, _a[variableNumber] = value, _a)));
            });
        }
        else if (variableType === 'header') {
            setHeaderVariableValues(function (prevValues) {
                var _a;
                return (__assign(__assign({}, prevValues), (_a = {}, _a[variableNumber] = value, _a)));
            });
        }
        else if (variableType === 'cardImage') {
            setCardImageValues(function (prevValues) {
                var _a;
                return (__assign(__assign({}, prevValues), (_a = {}, _a[variableNumber] = value, _a)));
            });
        }
        else if (variableType === 'dynamicUrl') {
            setDynamicUrlValues(function (prevValues) {
                var _a;
                return (__assign(__assign({}, prevValues), (_a = {}, _a[variableNumber] = value, _a)));
            });
        }
        else if (variableType === 'carousel' && carouselIndex !== undefined) {
            setCarouselVariableValues(function (prevValues) {
                var _a, _b;
                return (__assign(__assign({}, prevValues), (_a = {}, _a[carouselIndex] = __assign(__assign({}, prevValues[carouselIndex]), (_b = {}, _b[variableNumber] = value, _b)), _a)));
            });
        }
        else if (variableType === 'authentication') {
            setSelectedAuthVariable(value);
        }
        var key = generateKey(variableType, variableNumber, carouselIndex);
        var newSelectedHeaders = __assign(__assign({}, selectedHeaders), (_a = {}, _a[key] = header, _a));
        setSelectedHeaders(newSelectedHeaders);
        var newVariableSelections = __assign(__assign({}, variableSelections), (_b = {}, _b[key] = header, _b));
        setVariableSelections(newVariableSelections);
        updateTemplate();
    };
    var generateKey = function (variableType, variableNumber, carouselIndex) {
        return variableType + "-" + variableNumber + (carouselIndex !== undefined ? "-" + carouselIndex : '');
    };
    var getValueDefault = function (variableType, variableNumber, carouselIndex) {
        var key = generateKey(variableType, variableNumber, carouselIndex);
        var header = selectedHeaders[key];
        if (variableType === 'video' && header === 'default') {
            return { key: 'default', value: 'Default ' };
        }
        return header ? { key: header, value: header } : undefined;
    };
    var updateTemplate = react_1.useCallback(function () {
        var updatedTemplate = JSON.parse(JSON.stringify(templateToUse));
        if (updatedTemplate.category === "AUTHENTICATION" && !updatedTemplate.body) {
            updatedTemplate.body = "Tu código de verificación es {{1}}. Por tu seguridad, no lo compartas.";
        }
        Object.keys(variableSelections).forEach(function (key) {
            var _a = key.split('-'), type = _a[0], number = _a[1], carouselIndexStr = _a[2];
            var fieldNumber = headers.indexOf(variableSelections[key]) + 1;
            if (type === 'body' && updatedTemplate.body) {
                updatedTemplate.body = updatedTemplate.body.replace("{{" + number + "}}", "{{field" + fieldNumber + "}}");
            }
            else if (type === 'header' && updatedTemplate.header) {
                updatedTemplate.header = updatedTemplate.header.replace("{{" + number + "}}", "{{field" + fieldNumber + "}}");
            }
            else if (type === 'cardImage' && updatedTemplate.carouseldata) {
                var index = parseInt(carouselIndexStr) - 1;
                if (!isNaN(index) && updatedTemplate.carouseldata[index]) {
                    updatedTemplate.carouseldata[index].header = "{{field" + fieldNumber + "}}";
                }
            }
            else if (type === 'dynamicUrl') {
                if (updatedTemplate.buttonsgeneric) {
                    updatedTemplate.buttonsgeneric.forEach(function (button, btnIndex) {
                        var buttonKey = "dynamicUrl-dynamicUrl-" + (btnIndex + 1);
                        var variableSelectionsValue = variableSelections[buttonKey];
                        if (variableSelectionsValue) {
                            var variableKey = headers.indexOf(variableSelectionsValue);
                            if (variableKey !== -1) {
                                if (button.btn.type === 'dynamic' && button.btn.url) {
                                    if (!button.btn.url.includes('{{')) {
                                        button.btn.url += '/{{1}}';
                                    }
                                    var regex = /{{\d+}}/g;
                                    button.btn.url = button.btn.url.replace(regex, "{{field" + (variableKey + 1) + "}}");
                                }
                            }
                            else {
                                console.log("Value \"" + variableSelectionsValue + "\" not found in headers");
                            }
                        }
                        else {
                            console.log("No selection found for button key: " + buttonKey);
                        }
                    });
                }
                if (updatedTemplate.carouseldata) {
                    updatedTemplate.carouseldata.forEach(function (item, carouselIndex) {
                        item.buttons.forEach(function (button, btnIndex) {
                            if (button.btn.type === 'dynamic') {
                                var buttonKey = "dynamicUrl-dynamicUrl-" + carouselIndex + "-" + btnIndex;
                                var variableSelectionsValue = variableSelections[buttonKey];
                                if (variableSelectionsValue) {
                                    var fieldNumber_1 = headers.indexOf(variableSelectionsValue) + 1;
                                    if (!isNaN(fieldNumber_1)) {
                                        if (!button.btn.url.includes('{{')) {
                                            button.btn.url += '/{{1}}';
                                        }
                                        var regex = /{{\d+}}/g;
                                        button.btn.url = button.btn.url.replace(regex, "{{field" + fieldNumber_1 + "}}");
                                    }
                                }
                            }
                        });
                    });
                }
            }
            else if (type === 'carousel' && updatedTemplate.carouseldata) {
                var index = parseInt(carouselIndexStr);
                if (!isNaN(index)) {
                    updatedTemplate.carouseldata[index].body = updatedTemplate.carouseldata[index].body.replace("{{" + number + "}}", "{{field" + fieldNumber + "}}");
                }
            }
            else if (type === 'bubble' && updatedTemplate.carouseldata) {
                var index = parseInt(carouselIndexStr);
                if (!isNaN(index)) {
                    updatedTemplate.carouseldata[index].body = updatedTemplate.carouseldata[index].body.replace("{{" + number + "}}", "{{field" + fieldNumber + "}}");
                }
            }
            else if (['VIDEO', 'DOCUMENT', 'IMAGE'].includes(updatedTemplate.headertype) && variableSelections['video-videoHeader']) {
                var selectedHeader_1 = variableSelections['video-videoHeader'];
                if (selectedHeader_1 === 'default') {
                    updatedTemplate.header = templateToUse.header;
                }
                else {
                    var fieldNumber_2 = headers.indexOf(selectedHeader_1) + 1;
                    if (!isNaN(fieldNumber_2)) {
                        updatedTemplate.header = "{{field" + fieldNumber_2 + "}}";
                    }
                }
            }
        });
        if (updatedTemplate.category === "AUTHENTICATION" && selectedHeaders['body-authentication']) {
            var fieldNumber = headers.indexOf(selectedHeaders['body-authentication']) + 1;
            if (!isNaN(fieldNumber)) {
                updatedTemplate.body = updatedTemplate.body.replace('{{1}}', "{{field" + fieldNumber + "}}");
            }
        }
        if (updatedTemplate.messagetemplatetype === "CAROUSEL" && updatedTemplate.carouseljson) {
            var carouselData = JSON.parse(updatedTemplate.carouseljson);
            carouselData.forEach(function (item, index) {
                var key = "cardImage-cardImage-" + (index + 1);
                var variableSelectionKey = variableSelections[key];
                if (variableSelectionKey) {
                    var fieldNumber = headers.indexOf(variableSelectionKey) + 1;
                    if (!isNaN(fieldNumber)) {
                        item.header = "{{field" + fieldNumber + "}}";
                    }
                }
                item.buttons.forEach(function (button, btnIndex) {
                    if (button.btn.type === 'dynamic') {
                        var buttonKey = "dynamicUrl-" + index + "-" + btnIndex;
                        var variableSelectionsValue = variableSelections[buttonKey];
                        if (variableSelectionsValue) {
                            var fieldNumber = headers.indexOf(variableSelectionsValue) + 1;
                            if (!isNaN(fieldNumber)) {
                                if (!button.btn.url.includes('{{')) {
                                    button.btn.url += '/{{1}}';
                                }
                                var regex = /{{\d+}}/g;
                                button.btn.url = button.btn.url.replace(regex, "{{field" + fieldNumber + "}}");
                            }
                        }
                    }
                });
            });
            updatedTemplate.carouseljson = JSON.stringify(carouselData);
        }
        updatedTemplate.variableshidden = Object.values(selectedAdditionalHeaders).map(function (header) { return "field" + (headers.indexOf(header) + 1); });
        console.log('row', row);
        setFilledTemplate(updatedTemplate);
        setDetaildata(function (prev) { return (__assign(__assign({}, prev), { message: updatedTemplate.body, messagetemplateheader: __assign(__assign({}, prev.messagetemplateheader), { value: updatedTemplate.header }), messagetemplatebuttons: updatedTemplate.buttonsgeneric || [], carouseljson: updatedTemplate.carouseldata, variableshidden: updatedTemplate.variableshidden })); });
    }, [variableSelections, headers, templateToUse, jsonPersons, setDetaildata, selectedAdditionalHeaders]);
    var renderDynamicUrlFields = function () {
        var _a, _b;
        var dynamicButtons = ((_a = templateToUse.buttonsgeneric) === null || _a === void 0 ? void 0 : _a.filter(function (button) { return button.btn.type === 'dynamic'; })) || [];
        var carouselDynamicButtons = ((_b = templateToUse.carouseldata) === null || _b === void 0 ? void 0 : _b.flatMap(function (item, index) {
            return item.buttons.filter(function (button) { return button.btn.type === 'dynamic'; }).map(function (button, btnIndex) { return ({
                button: button,
                btnIndex: btnIndex,
                carouselIndex: index
            }); });
        })) || [];
        var allDynamicButtons = __spreadArrays(dynamicButtons, carouselDynamicButtons);
        return allDynamicButtons.map(function (buttonData, index) {
            var key = buttonData.carouselIndex !== undefined ?
                "dynamicUrl-" + buttonData.carouselIndex + "-" + buttonData.btnIndex :
                "dynamicUrl-" + (index + 1);
            return (react_1["default"].createElement("div", { key: key },
                react_1["default"].createElement("p", { style: { marginBottom: '3px' } }, "Url Dinamico {{" + (index + 1) + "}}"),
                react_1["default"].createElement(components_1.FieldSelect, { variant: "outlined", uset: true, className: "col-12", data: availableData.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: headers, onChange: function (selectedOption) { return handleVariableChange(key, selectedOption, 'dynamicUrl'); } })));
        });
    };
    react_1.useEffect(function () {
        updateTemplate();
    }, [variableSelections, selectedAdditionalHeaders]);
    var handleAddVariable = function () {
        setAdditionalVariables(function (prev) {
            if (prev.length < 10) {
                return __spreadArrays(prev, [prev.length + 1]);
            }
            return prev;
        });
    };
    var handleRemoveVariable = function (indexToRemove) {
        setAdditionalVariables(function (prev) {
            var newVariables = prev.filter(function (_, index) { return index !== indexToRemove; });
            return newVariables.map(function (_, index) { return index + 1; });
        });
    };
    var handleAdditionalVariableChange = function (variableNumber, selectedOption) {
        var header = selectedOption ? selectedOption.key : '';
        var value = jsonPersons.length > 0 ? jsonPersons[0][header] : '';
        setAdditionalVariableValues(function (prevValues) {
            var _a;
            var newValues = __assign(__assign({}, prevValues), (_a = {}, _a[variableNumber] = value, _a));
            return newValues;
        });
        setSelectedAdditionalHeaders(function (prev) {
            var _a;
            var newHeaders = __assign(__assign({}, prev), (_a = {}, _a[variableNumber] = header, _a));
            return newHeaders;
        });
        updateTemplate();
    };
    var collectButtonsFromTemplate = function (template) {
        var buttons = __spreadArrays((template.buttonsgeneric || []), (template.buttonsquickreply || []));
        return buttons;
    };
    react_1.useEffect(function () {
        var buttons = collectButtonsFromTemplate(templateToUse);
        setDetaildata(function (prev) { return (__assign(__assign({}, prev), { messagetemplatebuttons: buttons })); });
    }, [templateToUse]);
    react_1.useEffect(function () {
        if (frameProps.checkPage) {
            setFrameProps(__assign(__assign({}, frameProps), { executeSave: false, checkPage: false }));
            setPageSelected(frameProps.page);
            if (frameProps.executeSave) {
                setSave('VALIDATION');
            }
        }
    }, [frameProps.checkPage]);
    react_1.useEffect(function () {
        var _a, _b;
        if ((_a = detaildata.communicationchanneltype) === null || _a === void 0 ? void 0 : _a.startsWith('MAI')) {
            var variablesList = ((_b = detaildata.message) === null || _b === void 0 ? void 0 : _b.match(/({{)(.*?)(}})/g)) || [];
            var varaiblesCleaned = variablesList.map(function (x) { return x.substring(x.indexOf("{{") + 2, x.indexOf("}}")); });
            setMessageVariables(varaiblesCleaned.map(function (x, i) {
                var _a;
                return ({
                    name: x,
                    text: ((_a = messageVariables[i]) === null || _a === void 0 ? void 0 : _a.text) || x,
                    type: 'text'
                });
            }));
        }
        else {
            -setMessageVariables([]);
        }
    }, [detaildata.message]);
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", { className: classes.containerDetail, style: { display: 'flex', width: '100%' } },
            react_1["default"].createElement("div", { style: { width: '50%' } },
                react_1["default"].createElement("div", { className: "row-zyx" },
                    react_1["default"].createElement(core_1.FormControl, { className: "col-12" },
                        react_1["default"].createElement("div", { style: { fontSize: '1rem', color: 'black' } },
                            " ",
                            'Destinatarios',
                            " "),
                        react_1["default"].createElement("div", { className: classes.subtitle },
                            " ",
                            'Selecciona la columna que contiene los destinatarios para el envio del mensaje',
                            " "),
                        react_1["default"].createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 5 } },
                            react_1["default"].createElement("div", { style: { flex: 1 } },
                                react_1["default"].createElement(components_1.FieldSelect, { variant: "outlined", uset: true, label: 'Campos archivo', className: "col-12", data: availableData.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: selectedHeader ? selectedHeader : '', onChange: handleHeaderChange })),
                            react_1["default"].createElement(Tooltip_1["default"], { title: 'Selecciona el campo de columna que contiene los destinatarios para el envío del mensaje.', arrow: true, placement: "top" },
                                react_1["default"].createElement(InfoRounded_1["default"], { color: "action", className: classes.iconHelpText })))),
                    react_1["default"].createElement(core_1.FormControl, { className: "col-12" },
                        react_1["default"].createElement("div", { style: { fontSize: '1rem', color: 'black' } },
                            " ",
                            'Variables Requeridas',
                            " "),
                        react_1["default"].createElement("div", { className: "subtitle" },
                            " ",
                            'Selecciona los campos que ocuparán la posición de cada variable para el envío de la campaña',
                            " "),
                        react_1["default"].createElement("div", { className: classes.containerStyle }, headerVariables.map(function (variable) { return (react_1["default"].createElement("div", { key: variable.variable },
                            react_1["default"].createElement("p", { style: { marginBottom: '3px' } }, "Variable Cabecera {{" + variable.variable + "}}"),
                            react_1["default"].createElement(components_1.FieldSelect, { variant: "outlined", uset: true, className: "col-12", data: availableData.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: getValueDefault('header', variable.variable), onChange: function (selectedOption) { return handleVariableChange(variable.variable, selectedOption, 'header'); } }))); })),
                        react_1["default"].createElement("div", { className: classes.containerStyle }, row ? (react_1["default"].createElement(react_1["default"].Fragment, null, variablesAux.map(function (variable, index) {
                            var confe = parseInt(variable.variable.replace("field", ""), 10) - 2;
                            var valor = templateData.fields.columns[confe];
                            return (react_1["default"].createElement("div", { key: "body-" + (index + 1) },
                                react_1["default"].createElement("p", { style: { marginBottom: '3px' } }, "Variable Cuerpo {{" + (index + 1) + "}}"),
                                react_1["default"].createElement(components_1.FieldSelect, { variant: "outlined", uset: true, className: "col-12", data: dataToUse.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: valor, onChange: function (selectedOption) { return handleVariableChange(index + 1, selectedOption, 'body'); } })));
                        }))) : (react_1["default"].createElement(react_1["default"].Fragment, null, bodyVariables.map(function (variable, index) {
                            var valueDefault = selectedHeaders["body-" + (index + 1)]
                                ? { key: selectedHeaders["body-" + (index + 1)], value: selectedHeaders["body-" + (index + 1)] }
                                : undefined;
                            return (react_1["default"].createElement("div", { key: "body-" + (index + 1) },
                                react_1["default"].createElement("p", { style: { marginBottom: '3px' } }, "Variable Cuerpo {{" + variable.variable + "}}"),
                                react_1["default"].createElement(components_1.FieldSelect, { variant: "outlined", uset: true, className: "col-12", data: availableData.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: valueDefault, onChange: function (selectedOption) { return handleVariableChange(index + 1, selectedOption, 'body'); } })));
                        })))),
                        templateToUse.category === "AUTHENTICATION" && (react_1["default"].createElement("div", { className: classes.containerStyle }, templateAux.category === "AUTHENTICATION" && (react_1["default"].createElement("div", { key: "authentication-variable" },
                            react_1["default"].createElement("p", { style: { marginBottom: '3px' } }, "Variable Autenticaci\u00F3n"),
                            react_1["default"].createElement(components_1.FieldSelect, { variant: "outlined", uset: true, className: "col-12", data: availableData.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: selectedHeaders["body-authentication"] ? { key: selectedHeaders["body-authentication"], value: selectedHeaders["body-authentication"] } : undefined, onChange: function (selectedOption) { return handleVariableChange('authentication', selectedOption, 'body'); } }))))),
                        react_1["default"].createElement("div", { className: classes.containerStyle }, (_h = templateToUse.carouseldata) === null || _h === void 0 ? void 0 : _h.map(function (item, index) {
                            var _a;
                            return item.body && ((_a = item.body.match(/{{\d+}}/g)) === null || _a === void 0 ? void 0 : _a.map(function (match, variableIndex) { return (react_1["default"].createElement("div", { key: "carousel-" + index + "-bubble-" + variableIndex },
                                react_1["default"].createElement("p", { style: { marginBottom: '3px' } }, "Variable Burbuja {{" + (variableIndex + 1) + "}}"),
                                react_1["default"].createElement(components_1.FieldSelect, { variant: "outlined", uset: true, className: "col-12", data: availableData.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: getValueDefault('carousel', (variableIndex + 1).toString(), index), onChange: function (selectedOption) { return handleVariableChange((variableIndex + 1).toString(), selectedOption, 'carousel', index); } }))); }));
                        })),
                        react_1["default"].createElement("div", { className: classes.containerStyle }, (templateToUse.headertype === 'IMAGE' || templateToUse.headertype === 'VIDEO') && (react_1["default"].createElement("div", null,
                            react_1["default"].createElement("p", { style: { marginBottom: '3px' } }, "Cabecera Multimedia"),
                            react_1["default"].createElement(components_1.FieldSelect, { variant: "outlined", uset: true, className: "col-12", data: __spreadArrays([{ key: 'default', value: 'Default ' }], availableData.map(function (header) { return ({ key: header, value: header }); })), optionDesc: "value", optionValue: "key", valueDefault: getValueDefault('video', 'videoHeader'), onChange: function (selectedOption) { return handleVariableChange('videoHeader', selectedOption, 'video'); } })))),
                        react_1["default"].createElement("div", { className: classes.containerStyle }, (_j = templateToUse.carouseldata) === null || _j === void 0 ? void 0 : _j.map(function (item, index) {
                            return item.header && (react_1["default"].createElement("div", { key: "cardImage-" + index },
                                react_1["default"].createElement("p", { style: { marginBottom: '3px' } }, "Card Imagen " + (index + 1)),
                                react_1["default"].createElement(components_1.FieldSelect, { variant: "outlined", uset: true, className: "col-12", data: availableData.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: getValueDefault('cardImage', (index + 1).toString()), onChange: function (selectedOption) { return handleVariableChange((index + 1).toString(), selectedOption, 'cardImage'); } })));
                        })),
                        react_1["default"].createElement("div", { className: classes.containerStyle }, renderDynamicUrlFields())),
                    react_1["default"].createElement(core_1.FormControl, { className: "col-12" },
                        react_1["default"].createElement("div", { style: { fontSize: '1rem', color: 'black' } },
                            " ",
                            'Variables Adicionales',
                            " "),
                        react_1["default"].createElement("div", { className: classes.subtitle },
                            " ",
                            'Selecciona los campos adicionales que deseas que viajen en conjunto con la campaña, se utiliza para dar trazabilidad al cliente. También para poder utilizarlo en reportes personalizados y en flujos',
                            " "),
                        react_1["default"].createElement("div", { style: { width: '50%', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }, onClick: handleAddVariable },
                            react_1["default"].createElement(Add_1["default"], null),
                            " A\u00F1adir variable adicional"),
                        react_1["default"].createElement("div", { className: classes.containerStyle }, additionalVariables.map(function (variable, index) { return (react_1["default"].createElement("div", { style: { flex: 1 }, key: index },
                            react_1["default"].createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 5 } },
                                react_1["default"].createElement("p", null, "Variable {{" + variable + "}}"),
                                react_1["default"].createElement(Delete_1["default"], { style: { cursor: 'pointer', color: 'grey' }, onClick: function () { return handleRemoveVariable(index); } })),
                            react_1["default"].createElement("div", { style: { flex: 1 } },
                                react_1["default"].createElement(components_1.FieldSelect, { variant: "outlined", uset: true, className: "col-12", data: availableData.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: selectedAdditionalHeaders[variable] ? { key: selectedAdditionalHeaders[variable], value: selectedAdditionalHeaders[variable] } : undefined, onChange: function (selectedOption) { return handleAdditionalVariableChange(variable, selectedOption); } })))); }))))),
            react_1["default"].createElement("div", { className: classes.containerDetail, style: { marginLeft: '1rem', width: '50%' } },
                react_1["default"].createElement("div", { style: { fontSize: '1.2rem' } }, t('Previsualización del mensaje')),
                react_1["default"].createElement(TemplatePreview_1["default"], { selectedTemplate: templateToUse, bodyVariableValues: bodyVariableValues, headerVariableValues: headerVariableValues, videoHeaderValue: videoHeaderValue, cardImageValues: cardImageValues, dynamicUrlValues: dynamicUrlValues, bubbleVariableValues: bubbleVariableValues, carouselVariableValues: carouselVariableValues, selectedAuthVariable: selectedAuthVariable }),
                react_1["default"].createElement(core_1.FormControl, { className: "col-12" },
                    react_1["default"].createElement("div", { style: { fontSize: '1rem', color: 'black' } },
                        " ",
                        'Variables Adicionales',
                        " "),
                    react_1["default"].createElement("div", { className: classes.subtitle },
                        " ",
                        'Previsualiza un ejemplo de las variables adicionales elegidas en el apartado de Variables Adicionales',
                        " "),
                    react_1["default"].createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' } }, additionalVariables.map(function (variable, index) { return (react_1["default"].createElement("div", { style: { flex: 1 }, key: index },
                        react_1["default"].createElement("p", null, "Variable " + variable),
                        react_1["default"].createElement("div", { style: { flex: 1 } },
                            react_1["default"].createElement(components_1.FieldEdit, { variant: "outlined", uset: true, className: "col-12", valueDefault: additionalVariableValues[variable] || '', disabled: true })))); })))))));
};
