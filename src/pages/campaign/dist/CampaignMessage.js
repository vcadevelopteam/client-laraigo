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
    var _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var row = _a.row, edit = _a.edit, auxdata = _a.auxdata, detaildata = _a.detaildata, setDetaildata = _a.setDetaildata, multiData = _a.multiData, fetchData = _a.fetchData, tablevariable = _a.tablevariable, frameProps = _a.frameProps, setFrameProps = _a.setFrameProps, setPageSelected = _a.setPageSelected, setSave = _a.setSave, messageVariables = _a.messageVariables, setMessageVariables = _a.setMessageVariables, templateAux = _a.templateAux, jsonPersons = _a.jsonPersons;
    var classes = useStyles();
    var t = react_i18next_1.useTranslation().t;
    var dataMessageTemplate = __spreadArrays(multiData[3] && multiData[3].success ? multiData[3].data : []);
    var templateId = templateAux.id;
    var selectedTemplate = dataMessageTemplate.find(function (template) { return template.id === templateId; }) || {};
    var _l = react_1.useState(__assign({}, selectedTemplate)), filledTemplate = _l[0], setFilledTemplate = _l[1];
    var headers = jsonPersons.length > 0 ? Object.keys(jsonPersons[0]) : [];
    var _m = react_1.useState(''), selectedHeader = _m[0], setSelectedHeader = _m[1];
    var _o = react_1.useState({}), selectedHeaders = _o[0], setSelectedHeaders = _o[1];
    var _p = react_1.useState([1]), additionalVariables = _p[0], setAdditionalVariables = _p[1];
    var _q = react_1.useState({}), additionalVariableValues = _q[0], setAdditionalVariableValues = _q[1];
    var _r = react_1.useState({}), selectedAdditionalHeaders = _r[0], setSelectedAdditionalHeaders = _r[1];
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
    var _s = react_1.useState({}), bodyVariableValues = _s[0], setBodyVariableValues = _s[1];
    var _t = react_1.useState({}), headerVariableValues = _t[0], setHeaderVariableValues = _t[1];
    var _u = react_1.useState(''), videoHeaderValue = _u[0], setVideoHeaderValue = _u[1];
    var _v = react_1.useState({}), cardImageValues = _v[0], setCardImageValues = _v[1];
    var _w = react_1.useState({}), dynamicUrlValues = _w[0], setDynamicUrlValues = _w[1];
    var _x = react_1.useState({}), bubbleVariableValues = _x[0], setBubbleVariableValues = _x[1];
    var _y = react_1.useState({}), carouselVariableValues = _y[0], setCarouselVariableValues = _y[1];
    var _z = react_1.useState({}), variableSelections = _z[0], setVariableSelections = _z[1];
    var templateData = (_g = (_f = multiData[4]) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g[0];
    var columnsArray = templateData && templateData.fields ? __spreadArrays([templateData.fields.primarykey], templateData.fields.columns) : [];
    var dataToUse = headers.length > 0 ? headers : columnsArray;
    var availableData = dataToUse.filter(function (header) { return !Object.values(__assign(__assign({}, selectedHeaders), selectedAdditionalHeaders)).includes(header); });
    var _0 = react_1.useState(null), campaignViewDetails = _0[0], setCampaignViewDetails = _0[1];
    var _1 = react_1.useState([]), variablesBodyView = _1[0], setVariablesBodyView = _1[1];
    var _2 = react_1.useState([]), variablesAdditionalView = _2[0], setVariablesAdditionalView = _2[1];
    var _3 = react_1.useState([]), variablesCarouselBubbleView = _3[0], setVariablesCarouselBubbleView = _3[1];
    var _4 = react_1.useState([]), variablesUrlView = _4[0], setVariablesUrlView = _4[1];
    var _5 = react_1.useState([]), variablesCardImageView = _5[0], setVariablesCardImageView = _5[1];
    var _6 = react_1.useState(''), selectedAuthVariable = _6[0], setSelectedAuthVariable = _6[1];
    var _7 = react_1.useState([]), variablesHeaderView = _7[0], setVariablesHeaderView = _7[1];
    if (availableData.length === 0) {
        availableData.push('No quedan más variables');
    }
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
            var variablesHiddenMultidata = campaignData.variableshidden || [];
            var carouselBubbleVariables = campaignData.carouseljson ? campaignData.carouseljson.map(function (item) {
                return detectVariablesField(item.body);
            }) : [];
            var carouselUrlVariables = campaignData.carouseljson ? campaignData.carouseljson.flatMap(function (item) {
                return item.buttons ? item.buttons.flatMap(function (button) { return detectVariablesField(button.btn.url); }) : [];
            }) : [];
            var templateButtonsUrlVariables = campaignData.messagetemplatebuttons ? campaignData.messagetemplatebuttons.flatMap(function (button) {
                return detectVariablesField(button.btn.url);
            }) : [];
            var allUrlVariables = __spreadArrays(carouselUrlVariables, templateButtonsUrlVariables);
            var headerVariable = campaignData.messagetemplateheader ? detectVariablesField(campaignData.messagetemplateheader.value) : [];
            var cardImageVariables = campaignData.carouseljson ? campaignData.carouseljson.map(function (item) {
                return detectVariablesField(item.header);
            }) : [];
            setVariablesBodyView(bodyVariables_1);
            setVariablesAdditionalView(variablesHiddenMultidata);
            setVariablesCarouselBubbleView(carouselBubbleVariables);
            setVariablesUrlView(allUrlVariables);
            setSelectedAuthVariable(bodyVariableValues);
            setVariablesHeaderView(headerVariable);
            setVariablesCardImageView(cardImageVariables);
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
            var bodyVariables_2 = detectVariablesField(combinedData_1.message);
            var variablesHiddenMultidata = combinedData_1.variableshidden || [];
            var carouselBubbleVariables = combinedData_1.carouseljson ? combinedData_1.carouseljson.map(function (item) {
                return detectVariablesField(item.body);
            }) : [];
            var urlVariables = combinedData_1.carouseljson ? combinedData_1.carouseljson.flatMap(function (item) {
                return item.buttons ? item.buttons.flatMap(function (button) { return detectVariablesField(button.btn.url); }) : [];
            }) : [];
            var templateButtonsUrlVariables = combinedData_1.messagetemplatebuttons ? combinedData_1.messagetemplatebuttons.flatMap(function (button) {
                return detectVariablesField(button.btn.url);
            }) : [];
            var allUrlVariables = __spreadArrays(urlVariables, templateButtonsUrlVariables);
            var headerVariable = combinedData_1.messagetemplateheader ? detectVariablesField(combinedData_1.messagetemplateheader.value) : [];
            var cardImageVariables = combinedData_1.carouseljson ? combinedData_1.carouseljson.map(function (item) {
                return detectVariablesField(item.header);
            }) : [];
            setVariablesBodyView(bodyVariables_2);
            setVariablesAdditionalView(variablesHiddenMultidata);
            setVariablesCarouselBubbleView(carouselBubbleVariables);
            setVariablesUrlView(allUrlVariables);
            setVariablesHeaderView(headerVariable);
            setVariablesCardImageView(cardImageVariables);
            var newBodyVariableValues_1 = {};
            var newAdditionalVariableValues_1 = {};
            var newCarouselBubbleVariableValues_1 = {};
            var newDynamicUrlValues_1 = {};
            var newHeaderValue_1 = {};
            var newCardImageValue_1 = {};
            if (multiData[5] && multiData[5].data && multiData[5].data.length > 0) {
                var personData_1 = multiData[5].data[0];
                Object.entries(processedData.bodyVariableValues).forEach(function (_a, index) {
                    var key = _a[0], fieldKey = _a[1];
                    newBodyVariableValues_1[index + 1] = personData_1[fieldKey];
                });
                variablesHiddenMultidata.forEach(function (variable) {
                    var fieldIndex = parseInt(variable.replace('field', ''), 10);
                    if (personData_1["field" + fieldIndex]) {
                        newAdditionalVariableValues_1[variable] = personData_1["field" + fieldIndex];
                    }
                });
                carouselBubbleVariables.forEach(function (variables, carouselIndex) {
                    newCarouselBubbleVariableValues_1[carouselIndex] = {};
                    variables.forEach(function (variable, index) {
                        var fieldIndex = parseInt(variable.variable.replace('field', ''), 10);
                        newCarouselBubbleVariableValues_1[carouselIndex][index + 1] = personData_1["field" + fieldIndex];
                    });
                });
                allUrlVariables.forEach(function (variable, index) {
                    var fieldIndex = parseInt(variable.variable.replace('field', ''), 10);
                    newDynamicUrlValues_1[index + 1] = personData_1["field" + fieldIndex];
                });
                headerVariable.forEach(function (variable, index) {
                    var fieldIndex = parseInt(variable.variable.replace('field', ''), 10);
                    newHeaderValue_1[index + 1] = personData_1["field" + fieldIndex];
                });
                cardImageVariables.forEach(function (variables, carouselIndex) {
                    if (variables.length > 0 && variables[0].variable) {
                        var fieldIndex = parseInt(variables[0].variable.replace('field', ''), 10);
                        newCardImageValue_1[carouselIndex + 1] = personData_1["field" + fieldIndex];
                    }
                });
            }
            setBodyVariableValues(newBodyVariableValues_1);
            setHeaderVariableValues(newHeaderValue_1);
            setVideoHeaderValue(processedData.videoHeaderValue);
            setCardImageValues(newCardImageValue_1);
            setDynamicUrlValues(newDynamicUrlValues_1);
            setBubbleVariableValues(newCarouselBubbleVariableValues_1);
            setCarouselVariableValues(processedData.carouselVariableValues);
            setAdditionalVariableValues(newAdditionalVariableValues_1);
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
            updateTemplate();
        }
    }, [multiData]);
    react_1.useEffect(function () {
        if (multiData[5] && multiData[5].data && multiData[5].data.length > 0) {
            var newAdditionalVariableValues_2 = {};
            var personData_2 = multiData[5].data[0];
            variablesAdditionalView.forEach(function (variable) {
                var fieldIndex = parseInt(variable.replace('field', ''), 10);
                if (personData_2["field" + fieldIndex]) {
                    newAdditionalVariableValues_2[variable] = personData_2["field" + fieldIndex];
                }
            });
            setAdditionalVariableValues(newAdditionalVariableValues_2);
        }
    }, [variablesAdditionalView, multiData[5]]);
    var handleVariableChange = function (variableNumber, selectedOption, variableType, carouselIndex) {
        var _a, _b;
        //console.log(`Variable Change - type: ${variableType}, variableNumber: ${variableNumber}, selectedOption:`, selectedOption);
        var header = selectedOption ? selectedOption.key : '';
        var value = jsonPersons.length > 0 ? jsonPersons[0][header] : '';
        if (variableType === 'video') {
            setVideoHeaderValue(value);
        }
        else if (variableType === 'body') {
            setBodyVariableValues(function (prevValues) {
                var _a;
                var newBodyVariableValues = __assign(__assign({}, prevValues), (_a = {}, _a[variableNumber] = value, _a));
                setSelectedAuthVariable(newBodyVariableValues['authentication'] || '');
                return newBodyVariableValues;
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
        else if (variableType === 'additional') {
            setAdditionalVariableValues(function (prevValues) {
                var _a;
                return (__assign(__assign({}, prevValues), (_a = {}, _a[variableNumber] = value, _a)));
            });
        }
        var key = generateKey(variableType, variableNumber, carouselIndex);
        var newSelectedHeaders = __assign(__assign({}, selectedHeaders), (_a = {}, _a[key] = header, _a));
        setSelectedHeaders(newSelectedHeaders);
        var newVariableSelections = __assign(__assign({}, variableSelections), (_b = {}, _b[key] = header, _b));
        setVariableSelections(newVariableSelections);
        if (!header) {
            updateTemplate(true, variableNumber);
        }
        else {
            updateTemplate();
        }
    };
    var generateKey = function (variableType, variableNumber, carouselIndex) {
        return carouselIndex !== undefined ? variableType + "-" + carouselIndex + "-" + variableNumber : variableType + "-" + variableNumber;
    };
    var getValueDefault = function (variableType, variableNumber, carouselIndex) {
        var key = generateKey(variableType, variableNumber, carouselIndex);
        var header = selectedHeaders[key];
        if (variableType === 'video' && header === 'default') {
            return { key: 'default', value: 'Default ' };
        }
        return header ? { key: header, value: header } : undefined;
    };
    var _8 = react_1.useState(templateToUse), currentTemplate = _8[0], setCurrentTemplate = _8[1];
    var extractFieldKeysFromTemplate = function (templatePart) {
        var regex = /{{field(\d+)}}/g;
        var match;
        var fields = [];
        while ((match = regex.exec(templatePart)) !== null) {
            fields.push("field" + match[1]);
        }
        return fields;
    };
    var extractFieldKeysFromButtonsgeneric = function (buttonsgeneric, carouseldata) {
        var fields = [];
        buttonsgeneric === null || buttonsgeneric === void 0 ? void 0 : buttonsgeneric.forEach(function (button) {
            var match = button.btn.url.match(/{{field(\d+)}}/);
            if (match) {
                fields.push("field" + match[1]);
            }
        });
        carouseldata === null || carouseldata === void 0 ? void 0 : carouseldata.forEach(function (carousel) {
            var _a;
            (_a = carousel.buttons) === null || _a === void 0 ? void 0 : _a.forEach(function (button) {
                var match = button.btn.url.match(/{{field(\d+)}}/);
                if (match) {
                    fields.push("field" + match[1]);
                }
            });
        });
        return fields;
    };
    var updateTemplate = react_1.useCallback(function (resetField, fieldToReset) {
        if (resetField === void 0) { resetField = false; }
        if (fieldToReset === void 0) { fieldToReset = null; }
        if (!row) {
            var updatedTemplate_1 = JSON.parse(JSON.stringify(templateToUse));
            if (updatedTemplate_1.category === "AUTHENTICATION" && !updatedTemplate_1.body) {
                updatedTemplate_1.body = "Tu código de verificación es {{1}}. Por tu seguridad, no lo compartas.";
            }
            Object.keys(variableSelections).forEach(function (key) {
                var _a, _b;
                var type, number, carouselIndexStr;
                if (key.startsWith('carousel')) {
                    _a = key.split('-'), type = _a[0], carouselIndexStr = _a[1], number = _a[2];
                }
                else {
                    _b = key.split('-'), type = _b[0], number = _b[1], carouselIndexStr = _b[2];
                }
                var fieldNumber = headers.indexOf(variableSelections[key]) + 1;
                if (type === 'body' && updatedTemplate_1.body) {
                    updatedTemplate_1.body = updatedTemplate_1.body.replace("{{" + number + "}}", "{{field" + fieldNumber + "}}");
                }
                else if (type === 'header' && updatedTemplate_1.header) {
                    updatedTemplate_1.header = updatedTemplate_1.header.replace("{{" + number + "}}", "{{field" + fieldNumber + "}}");
                }
                else if (type === 'cardImage' && updatedTemplate_1.carouseldata) {
                    var index = parseInt(number, 10) - 1;
                    if (!isNaN(index) && updatedTemplate_1.carouseldata[index]) {
                        updatedTemplate_1.carouseldata[index].header = "{{field" + fieldNumber + "}}";
                    }
                }
                else if (type === 'dynamicUrl') {
                    if (updatedTemplate_1.buttonsgeneric) {
                        updatedTemplate_1.buttonsgeneric.forEach(function (button, btnIndex) {
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
                            }
                        });
                    }
                    if (updatedTemplate_1.carouseldata) {
                        updatedTemplate_1.carouseldata.forEach(function (item, carouselIndex) {
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
                else if (type === 'carousel' && updatedTemplate_1.carouseldata) {
                    var index = parseInt(carouselIndexStr, 10);
                    if (!isNaN(index) && updatedTemplate_1.carouseldata[index]) {
                        updatedTemplate_1.carouseldata[index].body = updatedTemplate_1.carouseldata[index].body.replace("{{" + number + "}}", "{{field" + fieldNumber + "}}");
                    }
                }
                else if (type === 'bubble' && updatedTemplate_1.carouseldata) {
                    var index = parseInt(carouselIndexStr, 10);
                    if (!isNaN(index)) {
                        updatedTemplate_1.carouseldata[index].body = updatedTemplate_1.carouseldata[index].body.replace("{{" + number + "}}", "{{field" + fieldNumber + "}}");
                    }
                }
                else if (['VIDEO', 'DOCUMENT', 'IMAGE'].includes(updatedTemplate_1.headertype) && variableSelections['video-videoHeader']) {
                    var selectedHeader_1 = variableSelections['video-videoHeader'];
                    if (selectedHeader_1 === 'default') {
                        updatedTemplate_1.header = templateToUse.header;
                    }
                    else {
                        var fieldNumber_2 = headers.indexOf(selectedHeader_1) + 1;
                        if (!isNaN(fieldNumber_2)) {
                            updatedTemplate_1.header = "{{field" + fieldNumber_2 + "}}";
                        }
                    }
                }
            });
            if (updatedTemplate_1.category === "AUTHENTICATION" && selectedHeaders['body-authentication']) {
                var fieldNumber = headers.indexOf(selectedHeaders['body-authentication']) + 1;
                if (!isNaN(fieldNumber)) {
                    updatedTemplate_1.body = updatedTemplate_1.body.replace('{{1}}', "{{field" + fieldNumber + "}}");
                }
            }
            if (updatedTemplate_1.messagetemplatetype === "CAROUSEL" && updatedTemplate_1.carouseljson) {
                var carouselData = JSON.parse(updatedTemplate_1.carouseljson);
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
                            var buttonKey = "dynamicUrl-dynamicUrl-" + index + "-" + btnIndex;
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
                updatedTemplate_1.carouseljson = JSON.stringify(carouselData);
            }
            updatedTemplate_1.variableshidden = Object.values(selectedAdditionalHeaders).map(function (header) { return "field" + (headers.indexOf(header) + 1); });
            console.log('final updatedTemplate:', updatedTemplate_1);
            setFilledTemplate(updatedTemplate_1);
            setDetaildata(function (prev) { return (__assign(__assign({}, prev), { message: updatedTemplate_1.body, messagetemplateheader: __assign(__assign({}, prev.messagetemplateheader), { value: updatedTemplate_1.header }), messagetemplatebuttons: updatedTemplate_1.buttonsgeneric || [], carouseljson: updatedTemplate_1.carouseldata, variableshidden: updatedTemplate_1.variableshidden })); });
        }
        if (row) {
            var updatedTemplate_2 = JSON.parse(JSON.stringify(templateToUse));
            if (updatedTemplate_2.category === "AUTHENTICATION" && !updatedTemplate_2.body) {
                updatedTemplate_2.body = "Tu código de verificación es {{1}}. Por tu seguridad, no lo compartas.";
            }
            if (variablesBodyView.length > 0 && updatedTemplate_2.body) {
                var bodyIndex_1 = 1;
                variablesBodyView.forEach(function (variable) {
                    var placeholder = "{{" + bodyIndex_1 + "}}";
                    if (updatedTemplate_2.body.indexOf(placeholder) !== -1) {
                        updatedTemplate_2.body = updatedTemplate_2.body.replace(placeholder, "{{" + variable.variable + "}}");
                    }
                    bodyIndex_1++;
                });
            }
            if (variablesCarouselBubbleView.length > 0 && updatedTemplate_2.carouseldata) {
                variablesCarouselBubbleView.forEach(function (variables, carouselIndex) {
                    if (updatedTemplate_2.carouseldata[carouselIndex]) {
                        var bodyIndex_2 = 1;
                        variables.forEach(function (variable) {
                            var placeholder = "{{" + bodyIndex_2 + "}}";
                            if (updatedTemplate_2.carouseldata[carouselIndex].body.indexOf(placeholder) !== -1) {
                                updatedTemplate_2.carouseldata[carouselIndex].body = updatedTemplate_2.carouseldata[carouselIndex].body.replace(placeholder, "{{" + variable.variable + "}}");
                            }
                            bodyIndex_2++;
                        });
                    }
                });
            }
            if (variablesAdditionalView.length > 0) {
                updatedTemplate_2.variableshidden = variablesAdditionalView;
            }
            if (variablesUrlView.length > 0) {
                if (updatedTemplate_2.buttonsgeneric) {
                    updatedTemplate_2.buttonsgeneric.forEach(function (button, btnIndex) {
                        if (button.btn.type === 'dynamic') {
                            var variable = variablesUrlView[btnIndex];
                            if (variable && variable.variable) {
                                if (!button.btn.url.includes('{{')) {
                                    button.btn.url += '/{{1}}';
                                }
                                var regex = /{{\d+}}/g;
                                button.btn.url = button.btn.url.replace(regex, "{{" + variable.variable + "}}");
                            }
                        }
                    });
                }
                if (updatedTemplate_2.carouseldata) {
                    updatedTemplate_2.carouseldata.forEach(function (item, carouselIndex) {
                        item.buttons.forEach(function (button, btnIndex) {
                            if (button.btn.type === 'dynamic') {
                                var variable = variablesUrlView[btnIndex];
                                if (variable && variable.variable) {
                                    if (!button.btn.url.includes('{{')) {
                                        button.btn.url += '/{{1}}';
                                    }
                                    var regex = /{{\d+}}/g;
                                    button.btn.url = button.btn.url.replace(regex, "{{" + variable.variable + "}}");
                                }
                            }
                        });
                    });
                }
            }
            if (variablesCardImageView.length > 0 && updatedTemplate_2.carouseldata) {
                variablesCardImageView.forEach(function (variables, carouselIndex) {
                    if (variables.length > 0 && variables[0].variable) {
                        updatedTemplate_2.carouseldata[carouselIndex].header = "{{" + variables[0].variable + "}}";
                    }
                });
            }
            if (variablesHeaderView.length > 0 && updatedTemplate_2.header) {
                variablesHeaderView.forEach(function (variable, index) {
                    var placeholder = "{{" + (index + 1) + "}}";
                    if (updatedTemplate_2.header.indexOf(placeholder) !== -1) {
                        updatedTemplate_2.header = updatedTemplate_2.header.replace(placeholder, "{{" + variable.variable + "}}");
                    }
                    else {
                        updatedTemplate_2.header = "{{" + variable.variable + "}}";
                    }
                });
            }
            Object.keys(variableSelections).forEach(function (key) {
                var _a, _b;
                var _c;
                var type, number, carouselIndexStr;
                if (key.startsWith('carousel')) {
                    _a = key.split('-'), type = _a[0], carouselIndexStr = _a[1], number = _a[2];
                }
                else {
                    _b = key.split('-'), type = _b[0], number = _b[1], carouselIndexStr = _b[2];
                }
                var header = variableSelections[key];
                var columns = ((_c = templateData.fields) === null || _c === void 0 ? void 0 : _c.columns) || [];
                var fieldNumber = columns.indexOf(header) + 2;
                if (type === 'body' && updatedTemplate_2.body) {
                    var placeholders = __spreadArrays(updatedTemplate_2.body.matchAll(/{{field(\d+)}}/g));
                    if (placeholders.length >= number) {
                        var currentField = placeholders[number - 1][0];
                        var newField = "{{field" + fieldNumber + "}}";
                        updatedTemplate_2.body = updatedTemplate_2.body.replace(currentField, newField);
                    }
                }
                else if (type === 'header' && updatedTemplate_2.header) {
                    var placeholders = __spreadArrays(updatedTemplate_2.header.matchAll(/{{field(\d+)}}/g));
                    if (placeholders.length >= number) {
                        var currentField = placeholders[number - 1][0];
                        var newField = "{{field" + fieldNumber + "}}";
                        updatedTemplate_2.header = updatedTemplate_2.header.replace(currentField, newField);
                    }
                }
                else if (type === 'cardImage' && updatedTemplate_2.carouseldata) {
                    var carouselIndex = parseInt(number, 10);
                    var index = parseInt(number, 10) - 1;
                    if (!isNaN(carouselIndex) && updatedTemplate_2.carouseldata[carouselIndex]) {
                        var placeholders = __spreadArrays(updatedTemplate_2.carouseldata[carouselIndex].header.matchAll(/{{field(\d+)}}/g));
                        if (placeholders.length >= 1) {
                            var currentField = placeholders[0][0];
                            var newField = "{{field" + fieldNumber + "}}";
                            updatedTemplate_2.carouseldata[carouselIndex].header = updatedTemplate_2.carouseldata[carouselIndex].header.replace(currentField, newField);
                        }
                    }
                }
                else if (type === 'dynamicUrl') {
                    if (updatedTemplate_2.buttonsgeneric) {
                        updatedTemplate_2.buttonsgeneric.forEach(function (button, btnIndex) {
                            var buttonKey = "dynamicUrl-dynamicUrl-" + (btnIndex + 1);
                            var variableSelectionsValue = variableSelections[buttonKey];
                            if (variableSelectionsValue) {
                                var variableKey = columns.indexOf(variableSelectionsValue) + 2;
                                if (variableKey !== -1) {
                                    if (button.btn.type === 'dynamic' && button.btn.url) {
                                        if (!button.btn.url.includes('{{')) {
                                            button.btn.url += '/{{1}}';
                                        }
                                        var regex = /{{field(\d+)}}/g;
                                        button.btn.url = button.btn.url.replace(regex, "{{field" + variableKey + "}}");
                                    }
                                }
                            }
                        });
                    }
                    if (updatedTemplate_2.carouseldata) {
                        updatedTemplate_2.carouseldata.forEach(function (item, carouselIndex) {
                            item.buttons.forEach(function (button, btnIndex) {
                                if (button.btn.type === 'dynamic') {
                                    var buttonKey = "dynamicUrl-dynamicUrl-" + carouselIndex + "-" + btnIndex;
                                    var variableSelectionsValue = variableSelections[buttonKey];
                                    if (variableSelectionsValue) {
                                        var variableKey = columns.indexOf(variableSelectionsValue) + 2;
                                        if (variableKey !== -1) {
                                            if (button.btn.type === 'dynamic' && button.btn.url) {
                                                if (!button.btn.url.includes('{{')) {
                                                    button.btn.url += '/{{1}}';
                                                }
                                                var regex = /{{field(\d+)}}/g;
                                                button.btn.url = button.btn.url.replace(regex, "{{field" + variableKey + "}}");
                                            }
                                        }
                                    }
                                }
                            });
                        });
                    }
                }
                else if (type === 'carousel' && updatedTemplate_2.carouseldata) {
                    var carouselIndex = parseInt(carouselIndexStr, 10);
                    if (!isNaN(carouselIndex) && updatedTemplate_2.carouseldata[carouselIndex]) {
                        var placeholders = __spreadArrays(updatedTemplate_2.carouseldata[carouselIndex].body.matchAll(/{{field(\d+)}}/g));
                        if (placeholders.length >= number) {
                            var currentField = placeholders[number - 1][0];
                            var newField = "{{field" + fieldNumber + "}}";
                            updatedTemplate_2.carouseldata[carouselIndex].body = updatedTemplate_2.carouseldata[carouselIndex].body.replace(currentField, newField);
                        }
                    }
                }
                else if (type === 'additional') {
                    var additionalIndex = parseInt(number, 10) - 1;
                    if (!isNaN(additionalIndex) && updatedTemplate_2.variableshidden) {
                        if (updatedTemplate_2.variableshidden[additionalIndex]) {
                            updatedTemplate_2.variableshidden[additionalIndex] = "field" + fieldNumber;
                        }
                    }
                }
                else if (['VIDEO', 'DOCUMENT', 'IMAGE'].includes(updatedTemplate_2.headertype) && variableSelections['video-videoHeader']) {
                    var selectedHeader_2 = variableSelections['video-videoHeader'];
                    if (selectedHeader_2 === 'default') {
                        updatedTemplate_2.header = templateToUse.header;
                    }
                    else {
                        var fieldNumber_3 = columns.indexOf(selectedHeader_2) + 2;
                        if (!isNaN(fieldNumber_3)) {
                            updatedTemplate_2.header = "{{field" + fieldNumber_3 + "}}";
                        }
                    }
                }
            });
            if (!row) {
                updatedTemplate_2.variableshidden = Object.values(selectedAdditionalHeaders).map(function (header) { return "field" + (columns.indexOf(header) + 2); });
            }
            if (resetField && fieldToReset !== null) {
                var placeholders = __spreadArrays(updatedTemplate_2.body.matchAll(/{{field(\d+)}}/g));
                if (placeholders.length >= fieldToReset) {
                    var currentField = placeholders[fieldToReset - 1][0];
                    updatedTemplate_2.body = updatedTemplate_2.body.replace(currentField, "{{" + fieldToReset + "}}");
                }
            }
            console.log('final updatedTemplate:', updatedTemplate_2);
            setCurrentTemplate(updatedTemplate_2);
            setDetaildata(function (prev) { return (__assign(__assign({}, prev), { message: updatedTemplate_2.body, messagetemplateheader: __assign(__assign({}, prev.messagetemplateheader), { value: updatedTemplate_2.header }), messagetemplatebuttons: updatedTemplate_2.buttonsgeneric || [], carouseljson: updatedTemplate_2.carouseldata, variableshidden: updatedTemplate_2.variableshidden })); });
        }
    }, [headers, selectedHeaders, templateToUse, variableSelections, jsonPersons, variablesBodyView, variablesAdditionalView, variablesCarouselBubbleView, variablesUrlView, variablesHeaderView, variablesCardImageView]);
    var renderDynamicUrlFields = function (carouselIndex, row, buttons) {
        var _a, _b;
        var dynamicButtons = ((_a = templateToUse.buttonsgeneric) === null || _a === void 0 ? void 0 : _a.filter(function (button) { return button.btn.type === 'dynamic'; })) || [];
        var carouselDynamicButtons = ((_b = templateToUse.carouseldata) === null || _b === void 0 ? void 0 : _b.flatMap(function (item, index) {
            return item.buttons.filter(function (button) { return button.btn.type === 'dynamic'; }).map(function (button, btnIndex) { return ({
                button: button,
                btnIndex: btnIndex,
                carouselIndex: index
            }); });
        })) || [];
        var allDynamicButtons = buttons.length ? buttons : __spreadArrays(dynamicButtons, carouselDynamicButtons);
        return allDynamicButtons.map(function (buttonData, index) {
            var key = buttonData.carouselIndex !== undefined ?
                "dynamicUrl-" + buttonData.carouselIndex + "-" + buttonData.btnIndex :
                "dynamicUrl-" + (index + 1);
            var valueDefault;
            if (row) {
                var fieldsInButtons = extractFieldKeysFromButtonsgeneric(currentTemplate.buttonsgeneric, currentTemplate.carouseldata);
                var fieldKey = fieldsInButtons[index];
                if (fieldKey) {
                    var fieldIndex = parseInt(fieldKey.replace('field', ''), 10) - 2;
                    var valor = templateData.fields.columns[fieldIndex];
                    valueDefault = valor ? valor : undefined;
                }
                else {
                    valueDefault = undefined;
                }
            }
            else {
                if (buttonData && buttonData.button) {
                    var match = buttonData.button.btn.url.match(/{{field(\d+)}}/);
                    if (match) {
                        var fieldNumber = parseInt(match[1], 10) - 2;
                        valueDefault = templateData.fields.columns[fieldNumber];
                    }
                }
            }
            var selectedValue = variableSelections[key];
            if (selectedValue) {
                valueDefault = selectedValue;
            }
            else if (!valueDefault || valueDefault === 'default') {
                var defaultValue = getValueDefault('dynamicUrl', key);
                valueDefault = defaultValue ? defaultValue.value : '';
            }
            if (buttonData.carouselIndex !== undefined && row && buttons.length > 0) {
                return null;
            }
            return (react_1["default"].createElement("div", { key: key },
                react_1["default"].createElement("p", { style: { marginBottom: '3px' } }, "Url Dinamico {{" + (index + 1) + "}}"),
                react_1["default"].createElement(components_1.FieldSelectDisabled, { variant: "outlined", uset: true, className: "col-12", data: dataToUse.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: valueDefault, onChange: function (selectedOption) { return handleVariableChange(key, selectedOption, 'dynamicUrl'); }, getOptionDisabled: function (option) { return option.key === 'No quedan más variables'; } })));
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
                                react_1["default"].createElement(components_1.FieldSelectDisabled, { variant: "outlined", uset: true, label: 'Campos archivo', className: "col-12", data: availableData.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: selectedHeader ? selectedHeader : '', onChange: handleHeaderChange, getOptionDisabled: function (option) { return option.key === 'No quedan más variables'; } })),
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
                        react_1["default"].createElement("div", { className: classes.containerStyle }, row ? (templateData.headertype === "VIDEO" || templateData.headertype === "IMAGE" || templateData.headertype === "FILE" || templateData.headertype !== "TEXT" ? (react_1["default"].createElement(react_1["default"].Fragment, null, variablesHeaderView.map(function (variable, index) {
                            var fieldsInHeader = extractFieldKeysFromTemplate(currentTemplate.header);
                            var fieldKey = fieldsInHeader[index];
                            var valueDefault;
                            if (fieldKey) {
                                var fieldIndex = parseInt(fieldKey.replace('field', ''), 10) - 2;
                                var valor = templateData.fields.columns[fieldIndex];
                                valueDefault = valor ? valor : undefined;
                            }
                            else {
                                valueDefault = undefined;
                            }
                            return (react_1["default"].createElement("div", { key: "header-" + (index + 1) },
                                react_1["default"].createElement("p", { style: { marginBottom: '3px' } }, "Variable Cabecera {{" + (index + 1) + "}}"),
                                react_1["default"].createElement(components_1.FieldSelect, { variant: "outlined", uset: true, className: "col-12", data: dataToUse.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: valueDefault, onChange: function (selectedOption) { return handleVariableChange(index + 1, selectedOption, 'header'); } })));
                        }))) : null) : (react_1["default"].createElement(react_1["default"].Fragment, null, headerVariables.map(function (variable) { return (react_1["default"].createElement("div", { key: variable.variable },
                            react_1["default"].createElement("p", { style: { marginBottom: '3px' } }, "Variable Cabecera {{" + variable.variable + "}}"),
                            react_1["default"].createElement(components_1.FieldSelectDisabled, { variant: "outlined", uset: true, className: "col-12", data: availableData.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: getValueDefault('header', variable.variable), onChange: function (selectedOption) { return handleVariableChange(variable.variable, selectedOption, 'header'); }, getOptionDisabled: function (option) { return option.key === 'No quedan más variables'; } }))); })))),
                        react_1["default"].createElement("div", { className: classes.containerStyle }, row ? (react_1["default"].createElement(react_1["default"].Fragment, null, variablesBodyView.map(function (variable, index) {
                            var fieldsInBody = extractFieldKeysFromTemplate(currentTemplate.body);
                            var fieldKey = fieldsInBody[index];
                            var valueDefault;
                            if (fieldKey) {
                                var fieldIndex = parseInt(fieldKey.replace('field', ''), 10) - 2;
                                var valor = templateData.fields.columns[fieldIndex];
                                valueDefault = valor ? valor : undefined;
                            }
                            else {
                                valueDefault = undefined;
                            }
                            return (react_1["default"].createElement("div", { key: "body-" + (index + 1) },
                                react_1["default"].createElement("p", { style: { marginBottom: '3px' } }, "Variable Cuerpo {{" + (index + 1) + "}}"),
                                react_1["default"].createElement(components_1.FieldSelectDisabled, { variant: "outlined", uset: true, className: "col-12", data: dataToUse.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: valueDefault, onChange: function (selectedOption) { return handleVariableChange(index + 1, selectedOption, 'body'); } })));
                        }))) : (react_1["default"].createElement(react_1["default"].Fragment, null, bodyVariables.map(function (variable, index) {
                            var valueDefault = selectedHeaders["body-" + (index + 1)]
                                ? { key: selectedHeaders["body-" + (index + 1)], value: selectedHeaders["body-" + (index + 1)] }
                                : undefined;
                            return (react_1["default"].createElement("div", { key: "body-" + (index + 1) },
                                react_1["default"].createElement("p", { style: { marginBottom: '3px' } }, "Variable Cuerpo {{" + variable.variable + "}}"),
                                react_1["default"].createElement(components_1.FieldSelectDisabled, { variant: "outlined", uset: true, className: "col-12", data: availableData.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: valueDefault, onChange: function (selectedOption) { return handleVariableChange(index + 1, selectedOption, 'body'); }, getOptionDisabled: function (option) { return option.key === 'No quedan más variables'; } })));
                        })))),
                        templateToUse.category === "AUTHENTICATION" && (react_1["default"].createElement("div", { className: classes.containerStyle }, templateAux.category === "AUTHENTICATION" && (react_1["default"].createElement("div", { key: "authentication-variable" },
                            react_1["default"].createElement("p", { style: { marginBottom: '3px' } }, "Variable Autenticaci\u00F3n"),
                            react_1["default"].createElement(components_1.FieldSelectDisabled, { variant: "outlined", uset: true, className: "col-12", data: availableData.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: selectedHeaders["body-authentication"] ? { key: selectedHeaders["body-authentication"], value: selectedHeaders["body-authentication"] } : undefined, onChange: function (selectedOption) { return handleVariableChange('authentication', selectedOption, 'body'); }, getOptionDisabled: function (option) { return option.key === 'No quedan más variables'; } }))))),
                        react_1["default"].createElement("div", { className: classes.containerStyle }, (templateToUse.headertype === 'IMAGE' || templateToUse.headertype === 'VIDEO') && (row ? (react_1["default"].createElement(react_1["default"].Fragment, null, variablesHeaderView.map(function (variable, index) {
                            var fieldsInHeader = extractFieldKeysFromTemplate(currentTemplate.header);
                            var fieldKey = fieldsInHeader[index];
                            var valueDefault;
                            if (fieldKey) {
                                var fieldIndex = parseInt(fieldKey.replace('field', ''), 10) - 2;
                                var valor = templateData.fields.columns[fieldIndex];
                                valueDefault = valor ? valor : undefined;
                            }
                            else {
                                valueDefault = undefined;
                            }
                            return (react_1["default"].createElement("div", { key: "header-" + (index + 1) },
                                react_1["default"].createElement("p", { style: { marginBottom: '3px' } }, "Cabecera Multimedia {{" + (index + 1) + "}}"),
                                react_1["default"].createElement(components_1.FieldSelectDisabled, { variant: "outlined", uset: true, className: "col-12", data: dataToUse.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: valueDefault, onChange: function (selectedOption) { return handleVariableChange(index + 1, selectedOption, 'header'); } })));
                        }))) : (react_1["default"].createElement("div", null,
                            react_1["default"].createElement("p", { style: { marginBottom: '3px' } }, "Cabecera Multimedia"),
                            react_1["default"].createElement(components_1.FieldSelect, { variant: "outlined", uset: true, className: "col-12", data: __spreadArrays([{ key: 'default', value: 'Default ' }], availableData.map(function (header) { return ({ key: header, value: header }); })), optionDesc: "value", optionValue: "key", valueDefault: getValueDefault('video', 'videoHeader'), onChange: function (selectedOption) { return handleVariableChange('videoHeader', selectedOption, 'video'); } }))))),
                        react_1["default"].createElement("div", { style: { marginTop: '1rem' } }, (_h = templateToUse.carouseldata) === null || _h === void 0 ? void 0 : _h.map(function (item, index) {
                            var _a, _b, _c;
                            var hasDynamicButton = item.buttons.some(function (button) { return button.btn.type === 'dynamic'; });
                            return (react_1["default"].createElement("div", { key: "card-" + index, style: { marginBottom: '20px', border: '1px solid #ddd', padding: '10px', borderRadius: '5px' } },
                                react_1["default"].createElement("div", { style: { fontSize: '1.2rem', fontWeight: 'bolder' } }, "Card " + (index + 1)),
                                react_1["default"].createElement("div", { className: classes.containerStyle }, row ? ((_a = variablesCarouselBubbleView[index]) === null || _a === void 0 ? void 0 : _a.map(function (variable, variableIndex) {
                                    var fieldsInBody = extractFieldKeysFromTemplate(currentTemplate.carouseldata[index].body);
                                    var fieldKey = fieldsInBody[variableIndex];
                                    var valueDefault;
                                    if (fieldKey) {
                                        var fieldIndex = parseInt(fieldKey.replace('field', ''), 10) - 2;
                                        var valor = templateData.fields.columns[fieldIndex];
                                        valueDefault = valor ? valor : undefined;
                                    }
                                    else {
                                        valueDefault = undefined;
                                    }
                                    return (react_1["default"].createElement("div", { key: "carousel-" + index + "-bubble-" + variableIndex },
                                        react_1["default"].createElement("p", { style: { marginBottom: '3px' } }, "Variable Burbuja {{" + (variableIndex + 1) + "}}"),
                                        react_1["default"].createElement(components_1.FieldSelectDisabled, { variant: "outlined", uset: true, className: "col-12", data: dataToUse.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: valueDefault, onChange: function (selectedOption) { return handleVariableChange((variableIndex + 1).toString(), selectedOption, 'carousel', index); }, getOptionDisabled: function (option) { return option.key === 'No quedan más variables'; } })));
                                })) : (item.body && ((_b = item.body.match(/{{\d+}}/g)) === null || _b === void 0 ? void 0 : _b.map(function (match, variableIndex) { return (react_1["default"].createElement("div", { key: "carousel-" + index + "-bubble-" + variableIndex },
                                    react_1["default"].createElement("p", { style: { marginBottom: '3px' } }, "Variable Burbuja {{" + (variableIndex + 1) + "}}"),
                                    react_1["default"].createElement(components_1.FieldSelectDisabled, { variant: "outlined", uset: true, className: "col-12", data: availableData.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: getValueDefault('carousel', (variableIndex + 1).toString(), index), onChange: function (selectedOption) { return handleVariableChange((variableIndex + 1).toString(), selectedOption, 'carousel', index); }, getOptionDisabled: function (option) { return option.key === 'No quedan más variables'; } }))); })))),
                                react_1["default"].createElement("div", { className: classes.containerStyle }, item.header && (row ? ((_c = variablesCardImageView[index]) === null || _c === void 0 ? void 0 : _c.map(function (variable, variableIndex) {
                                    var fieldsInHeader = extractFieldKeysFromTemplate(currentTemplate.carouseldata[index].header);
                                    var fieldKey = fieldsInHeader[variableIndex];
                                    var valueDefault;
                                    if (fieldKey) {
                                        var fieldIndex = parseInt(fieldKey.replace('field', ''), 10) - 2;
                                        var valor = templateData.fields.columns[fieldIndex];
                                        valueDefault = valor ? valor : undefined;
                                    }
                                    else {
                                        valueDefault = undefined;
                                    }
                                    return (react_1["default"].createElement("div", { key: "cardImage-" + index + "-" + variableIndex },
                                        react_1["default"].createElement("p", { style: { marginBottom: '3px' } }, "Card Imagen {{" + (variableIndex + 1) + "}}"),
                                        react_1["default"].createElement(components_1.FieldSelectDisabled, { variant: "outlined", uset: true, className: "col-12", data: dataToUse.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: valueDefault, onChange: function (selectedOption) { return handleVariableChange((variableIndex + 1).toString(), selectedOption, 'cardImage', index); }, getOptionDisabled: function (option) { return option.key === 'No quedan más variables'; } })));
                                })) : (react_1["default"].createElement("div", null,
                                    react_1["default"].createElement("p", { style: { marginBottom: '3px' } }, "Card Imagen"),
                                    react_1["default"].createElement(components_1.FieldSelectDisabled, { variant: "outlined", uset: true, className: "col-12", data: availableData.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: getValueDefault('cardImage', (index + 1).toString()), onChange: function (selectedOption) { return handleVariableChange((index + 1).toString(), selectedOption, 'cardImage'); }, getOptionDisabled: function (option) { return option.key === 'No quedan más variables'; } }))))),
                                hasDynamicButton && (react_1["default"].createElement("div", { className: classes.containerStyle }, renderDynamicUrlFields(index, row, [])))));
                        })),
                        ((_j = templateToUse.buttonsgeneric) === null || _j === void 0 ? void 0 : _j.some(function (button) { return button.btn.type === 'dynamic'; })) && (react_1["default"].createElement("div", { className: classes.containerStyle }, renderDynamicUrlFields(null, row, ((_k = templateToUse.buttonsgeneric) === null || _k === void 0 ? void 0 : _k.filter(function (button) { return button.btn.type === 'dynamic'; })) || [])))),
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
                        react_1["default"].createElement("div", { className: classes.containerStyle }, row ? (react_1["default"].createElement(react_1["default"].Fragment, null, variablesAdditionalView.map(function (variable, index) {
                            var fieldNumber = parseInt(variable.replace("field", ""), 10) - 2;
                            var columnName = templateData.fields.columns[fieldNumber];
                            return (react_1["default"].createElement("div", { style: { flex: 1 }, key: "body-" + (index + 1) },
                                react_1["default"].createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 5 } },
                                    react_1["default"].createElement("p", null, "Variable {{" + (index + 1) + "}}"),
                                    react_1["default"].createElement(Delete_1["default"], { style: { cursor: 'pointer', color: 'grey' }, onClick: function () { return handleRemoveVariable(index); } })),
                                react_1["default"].createElement("div", { style: { flex: 1 } },
                                    react_1["default"].createElement(components_1.FieldSelect, { variant: "outlined", uset: true, className: "col-12", data: dataToUse.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: columnName, onChange: function (selectedOption) {
                                            handleVariableChange(index + 1, selectedOption, 'additional');
                                        } }))));
                        }))) : (react_1["default"].createElement(react_1["default"].Fragment, null, additionalVariables.map(function (variable, index) { return (react_1["default"].createElement("div", { style: { flex: 1 }, key: index },
                            react_1["default"].createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 5 } },
                                react_1["default"].createElement("p", null, "Variable {{" + variable + "}}"),
                                react_1["default"].createElement(Delete_1["default"], { style: { cursor: 'pointer', color: 'grey' }, onClick: function () { return handleRemoveVariable(index); } })),
                            react_1["default"].createElement("div", { style: { flex: 1 } },
                                react_1["default"].createElement(components_1.FieldSelectDisabled, { variant: "outlined", uset: true, className: "col-12", data: availableData.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: selectedAdditionalHeaders[variable] ? { key: selectedAdditionalHeaders[variable], value: selectedAdditionalHeaders[variable] } : undefined, onChange: function (selectedOption) { return handleAdditionalVariableChange(variable, selectedOption); }, getOptionDisabled: function (option) { return option.key === 'No quedan más variables'; } })))); }))))))),
            react_1["default"].createElement("div", { className: classes.containerDetail, style: { marginLeft: '1rem', width: '50%' } },
                react_1["default"].createElement("div", { style: { fontSize: '1.2rem' } }, t('Previsualización del mensaje')),
                react_1["default"].createElement(TemplatePreview_1["default"], { selectedTemplate: templateToUse, bodyVariableValues: bodyVariableValues, headerVariableValues: headerVariableValues, videoHeaderValue: videoHeaderValue, cardImageValues: cardImageValues, dynamicUrlValues: dynamicUrlValues, bubbleVariableValues: bubbleVariableValues, carouselVariableValues: carouselVariableValues, selectedAuthVariable: selectedAuthVariable }),
                react_1["default"].createElement(core_1.FormControl, { style: { width: '100%' } },
                    react_1["default"].createElement("div", { style: { fontSize: '1rem', color: 'black' } },
                        " ",
                        'Variables Adicionales',
                        " "),
                    react_1["default"].createElement("div", { className: classes.subtitle },
                        " ",
                        'Previsualiza un ejemplo de las variables adicionales elegidas en el apartado de Variables Adicionales',
                        " "),
                    react_1["default"].createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' } }, row ? (variablesAdditionalView.map(function (variable, index) {
                        var fieldNumber = parseInt(variable.replace("field", ""), 10) - 2;
                        var columnName = templateData.fields.columns[fieldNumber];
                        return (react_1["default"].createElement("div", { style: { flex: '1 1 calc(25% - 20px)', boxSizing: 'border-box' }, key: "body-" + (index + 1) },
                            react_1["default"].createElement("p", null, "Variable " + (index + 1)),
                            react_1["default"].createElement("div", { style: { flex: 1 } },
                                react_1["default"].createElement(components_1.FieldEdit, { variant: "outlined", uset: true, className: "col-12", valueDefault: additionalVariableValues[variable] || columnName, disabled: true }))));
                    })) : (additionalVariables.map(function (variable, index) { return (react_1["default"].createElement("div", { style: { flex: '1 1 calc(25% - 20px)', boxSizing: 'border-box' }, key: index },
                        react_1["default"].createElement("p", null, "Variable " + variable),
                        react_1["default"].createElement("div", { style: { flex: 1 } },
                            react_1["default"].createElement(components_1.FieldEdit, { variant: "outlined", uset: true, className: "col-12", valueDefault: additionalVariableValues[variable] || '', disabled: true })))); }))))))));
};
