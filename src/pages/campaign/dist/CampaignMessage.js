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
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    var row = _a.row, edit = _a.edit, auxdata = _a.auxdata, detaildata = _a.detaildata, setDetaildata = _a.setDetaildata, multiData = _a.multiData, fetchData = _a.fetchData, tablevariable = _a.tablevariable, frameProps = _a.frameProps, setFrameProps = _a.setFrameProps, setPageSelected = _a.setPageSelected, setSave = _a.setSave, messageVariables = _a.messageVariables, setMessageVariables = _a.setMessageVariables, templateAux = _a.templateAux, jsonPersons = _a.jsonPersons, detectionChangeSource = _a.detectionChangeSource;
    var classes = useStyles();
    var t = react_i18next_1.useTranslation().t;
    var dataMessageTemplate = __spreadArrays(multiData[3] && multiData[3].success ? multiData[3].data : []);
    var templateId = templateAux.id;
    var selectedTemplate = dataMessageTemplate.find(function (template) { return template.id === templateId; }) || {};
    var _m = react_1.useState(__assign({}, selectedTemplate)), filledTemplate = _m[0], setFilledTemplate = _m[1];
    var headers = jsonPersons.length > 0 ? Object.keys(jsonPersons[0]) : [];
    var _o = react_1.useState(''), selectedHeader = _o[0], setSelectedHeader = _o[1];
    var _p = react_1.useState({}), selectedHeaders = _p[0], setSelectedHeaders = _p[1];
    var _q = react_1.useState([1]), additionalVariables = _q[0], setAdditionalVariables = _q[1];
    var _r = react_1.useState({}), additionalVariableValues = _r[0], setAdditionalVariableValues = _r[1];
    var _s = react_1.useState({}), selectedAdditionalHeaders = _s[0], setSelectedAdditionalHeaders = _s[1];
    var messagetemplateid = (_e = (_d = (_c = (_b = multiData[4]) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.messagetemplateid) !== null && _e !== void 0 ? _e : null;
    var getTemplateById = function (id, data) {
        var _a, _b, _c;
        return (_c = (_b = (_a = data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.find(function (template) { return template.id === id; })) !== null && _c !== void 0 ? _c : null;
    };
    var matchingTemplate = getTemplateById(messagetemplateid, multiData[3]);
    var isEmptyData = function (data) {
        return Object.keys(data).length === 0 && data.constructor === Object;
    };
    var templateToUse = isEmptyData(selectedTemplate) ? matchingTemplate : selectedTemplate;
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
    var _t = react_1.useState({}), bodyVariableValues = _t[0], setBodyVariableValues = _t[1];
    var _u = react_1.useState({}), headerVariableValues = _u[0], setHeaderVariableValues = _u[1];
    var _v = react_1.useState(''), videoHeaderValue = _v[0], setVideoHeaderValue = _v[1];
    var _w = react_1.useState({}), cardImageValues = _w[0], setCardImageValues = _w[1];
    var _x = react_1.useState({}), dynamicUrlValues = _x[0], setDynamicUrlValues = _x[1];
    var _y = react_1.useState({}), bubbleVariableValues = _y[0], setBubbleVariableValues = _y[1];
    var _z = react_1.useState({}), carouselVariableValues = _z[0], setCarouselVariableValues = _z[1];
    var _0 = react_1.useState({}), variableSelections = _0[0], setVariableSelections = _0[1];
    var templateData = (_g = (_f = multiData[4]) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g[0];
    var columnsArray = templateData && templateData.fields ? __spreadArrays([templateData.fields.primarykey], templateData.fields.columns) : [];
    var dataToUse = headers.length > 0 ? headers : columnsArray;
    var availableData = dataToUse.filter(function (header) { return !Object.values(__assign(__assign({}, selectedHeaders), selectedAdditionalHeaders)).includes(header); });
    var _1 = react_1.useState(null), campaignViewDetails = _1[0], setCampaignViewDetails = _1[1];
    var _2 = react_1.useState([]), variablesBodyView = _2[0], setVariablesBodyView = _2[1];
    var _3 = react_1.useState([]), variablesAdditionalView = _3[0], setVariablesAdditionalView = _3[1];
    var _4 = react_1.useState([]), variablesCarouselBubbleView = _4[0], setVariablesCarouselBubbleView = _4[1];
    var _5 = react_1.useState([]), variablesUrlView = _5[0], setVariablesUrlView = _5[1];
    var _6 = react_1.useState([]), variablesCardImageView = _6[0], setVariablesCardImageView = _6[1];
    var _7 = react_1.useState(''), selectedAuthVariable = _7[0], setSelectedAuthVariable = _7[1];
    var _8 = react_1.useState([]), variablesHeaderView = _8[0], setVariablesHeaderView = _8[1];
    var _9 = react_1.useState({}), selectedFields = _9[0], setSelectedFields = _9[1];
    var _10 = react_1.useState({}), allVariables = _10[0], setAllVariables = _10[1];
    var buildAllVariables = function (jsonPersons) {
        var allVars = {};
        if (jsonPersons.length > 0) {
            var firstPerson = jsonPersons[0];
            var fieldIndex = 1;
            for (var key in firstPerson) {
                if (firstPerson.hasOwnProperty(key)) {
                    allVars["field" + fieldIndex] = {
                        column: key,
                        value: firstPerson[key]
                    };
                    fieldIndex++;
                }
            }
        }
        return allVars;
    };
    react_1.useEffect(function () {
        var allVars = buildAllVariables(jsonPersons);
        setAllVariables(allVars);
    }, [jsonPersons]);
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
                var _a;
                return detectVariablesField((_a = button.btn) === null || _a === void 0 ? void 0 : _a.url);
            }) : [];
            var allUrlVariables = __spreadArrays(carouselUrlVariables, templateButtonsUrlVariables);
            var headerVariable = campaignData.messagetemplateheader ? detectVariablesField(campaignData.messagetemplateheader.value) : [];
            var cardImageVariables = campaignData.carouseljson ? campaignData.carouseljson.map(function (item) {
                return detectVariablesField(item.header);
            }) : [];
            setVariablesBodyView(bodyVariables_1);
            setVariablesAdditionalView(variablesHiddenMultidata.map(function (variable) { return variable; }));
            setVariablesCarouselBubbleView(carouselBubbleVariables);
            setVariablesUrlView(allUrlVariables);
            setSelectedAuthVariable(JSON.stringify(bodyVariableValues));
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
    //useffect seteador de values enviadas a template preview
    react_1.useEffect(function () {
        var _a;
        if (row && !detectionChangeSource) {
            if (multiData[4] && multiData[4].data && multiData[4].data.length > 0) {
                var combinedData_1 = __assign(__assign({}, multiData[4].data[0]), { operation: 'UPDATE' });
                setCampaignViewDetails(combinedData_1);
                var processedData = processMultiData(multiData[4].data);
                var bodyVariables_2 = combinedData_1.message ? detectVariablesField(combinedData_1.message) : [];
                var variablesHiddenMultidata = combinedData_1.variableshidden || [];
                var carouselBubbleVariables = combinedData_1.carouseljson ? combinedData_1.carouseljson.map(function (item) { return detectVariablesField(item.body); }) : [];
                var urlVariables = combinedData_1.carouseljson ? combinedData_1.carouseljson.flatMap(function (item) {
                    return item.buttons ? item.buttons.flatMap(function (button) { return detectVariablesField(button.btn.url); }) : [];
                }) : [];
                var templateButtonsUrlVariables = combinedData_1.messagetemplatebuttons ? combinedData_1.messagetemplatebuttons.flatMap(function (button) {
                    var _a;
                    return detectVariablesField((_a = button.btn) === null || _a === void 0 ? void 0 : _a.url);
                }) : [];
                var allUrlVariables = __spreadArrays(urlVariables, templateButtonsUrlVariables);
                var headerVariable = combinedData_1.messagetemplateheader ? detectVariablesField(combinedData_1.messagetemplateheader.value) : [];
                var cardImageVariables = combinedData_1.carouseljson ? combinedData_1.carouseljson.map(function (item) {
                    return detectVariablesField(item.header);
                }) : [];
                setVariablesBodyView(bodyVariables_2);
                setVariablesAdditionalView(variablesHiddenMultidata.map(function (variable) { return JSON.stringify(variable); }));
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
                var allVariables_1 = ((_a = combinedData_1 === null || combinedData_1 === void 0 ? void 0 : combinedData_1.fields) === null || _a === void 0 ? void 0 : _a.allVariables) || {};
                bodyVariables_2.forEach(function (variable, index) {
                    var _a;
                    var fieldIndex = parseInt(variable.variable.replace('field', ''), 10);
                    newBodyVariableValues_1[index + 1] = ((_a = allVariables_1["field" + fieldIndex]) === null || _a === void 0 ? void 0 : _a.value) || '';
                });
                variablesHiddenMultidata.forEach(function (variable) {
                    var _a;
                    var fieldIndex = parseInt(variable.replace('field', ''), 10);
                    newAdditionalVariableValues_1[variable] = ((_a = allVariables_1["field" + fieldIndex]) === null || _a === void 0 ? void 0 : _a.value) || '';
                });
                carouselBubbleVariables.forEach(function (variables, carouselIndex) {
                    newCarouselBubbleVariableValues_1[carouselIndex] = {};
                    variables.forEach(function (variable, index) {
                        var _a;
                        var fieldIndex = parseInt(variable.variable.replace('field', ''), 10);
                        newCarouselBubbleVariableValues_1[carouselIndex][index + 1] = ((_a = allVariables_1["field" + fieldIndex]) === null || _a === void 0 ? void 0 : _a.value) || '';
                    });
                });
                allUrlVariables.forEach(function (variable, index) {
                    var _a;
                    var fieldIndex = parseInt(variable.variable.replace('field', ''), 10);
                    newDynamicUrlValues_1[index + 1] = ((_a = allVariables_1["field" + fieldIndex]) === null || _a === void 0 ? void 0 : _a.value) || '';
                });
                headerVariable.forEach(function (variable, index) {
                    var _a;
                    var fieldIndex = parseInt(variable.variable.replace('field', ''), 10);
                    newHeaderValue_1[index + 1] = ((_a = allVariables_1["field" + fieldIndex]) === null || _a === void 0 ? void 0 : _a.value) || '';
                });
                cardImageVariables.forEach(function (variables, carouselIndex) {
                    var _a;
                    if (variables.length > 0 && variables[0].variable) {
                        var fieldIndex = parseInt(variables[0].variable.replace('field', ''), 10);
                        newCardImageValue_1[carouselIndex + 1] = ((_a = allVariables_1["field" + fieldIndex]) === null || _a === void 0 ? void 0 : _a.value) || '';
                    }
                });
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
        }
        else {
            if (multiData[4] && multiData[4].data && multiData[4].data.length > 0) {
                var combinedData_2 = __assign(__assign({}, multiData[4].data[0]), { operation: 'UPDATE' });
                setCampaignViewDetails(combinedData_2);
                var processedData = processMultiData(multiData[4].data);
                var bodyVariables_3 = combinedData_2.message ? detectVariablesField(combinedData_2.message) : [];
                var variablesHiddenMultidata = combinedData_2.variableshidden || [];
                var carouselBubbleVariables = combinedData_2.carouseljson ? combinedData_2.carouseljson.map(function (item) { return detectVariablesField(item.body); }) : [];
                var urlVariables = combinedData_2.carouseljson ? combinedData_2.carouseljson.flatMap(function (item) { return item.buttons ? item.buttons.flatMap(function (button) { return detectVariablesField(button.btn.url); }) : []; }) : [];
                var templateButtonsUrlVariables = combinedData_2.messagetemplatebuttons ? combinedData_2.messagetemplatebuttons.flatMap(function (button) { return button && button.btn && button.btn.url ? detectVariablesField(button.btn.url) : []; }) : [];
                var allUrlVariables = __spreadArrays(urlVariables, templateButtonsUrlVariables);
                var headerVariable = combinedData_2.messagetemplateheader ? detectVariablesField(combinedData_2.messagetemplateheader.value) : [];
                var cardImageVariables = combinedData_2.carouseljson ? combinedData_2.carouseljson.map(function (item) { return detectVariablesField(item.header); }) : [];
                setVariablesBodyView(bodyVariables_3);
                setVariablesAdditionalView(variablesHiddenMultidata.map(function (variable) { return JSON.stringify(variable); }));
                setVariablesCarouselBubbleView(carouselBubbleVariables);
                setVariablesUrlView(allUrlVariables);
                setVariablesHeaderView(headerVariable);
                setVariablesCardImageView(cardImageVariables);
                var newBodyVariableValues_2 = {};
                var newAdditionalVariableValues_2 = {};
                var newCarouselBubbleVariableValues_2 = {};
                var newDynamicUrlValues_2 = {};
                var newHeaderValue_2 = {};
                var newCardImageValue_2 = {};
                if (multiData[5] && multiData[5].data && multiData[5].data.length > 0) {
                    var personData_1 = multiData[5].data[0];
                    Object.entries(processedData.bodyVariableValues).forEach(function (_a, index) {
                        var key = _a[0], fieldKey = _a[1];
                        newBodyVariableValues_2[index + 1] = personData_1[fieldKey];
                    });
                    variablesHiddenMultidata.forEach(function (variable) {
                        var fieldIndex = parseInt(variable.replace('field', ''), 10);
                        if (personData_1["field" + fieldIndex]) {
                            newAdditionalVariableValues_2[variable] = personData_1["field" + fieldIndex];
                        }
                    });
                    carouselBubbleVariables.forEach(function (variables, carouselIndex) {
                        newCarouselBubbleVariableValues_2[carouselIndex] = {};
                        variables.forEach(function (variable, index) {
                            var fieldIndex = parseInt(variable.variable.replace('field', ''), 10);
                            newCarouselBubbleVariableValues_2[carouselIndex][index + 1] = personData_1["field" + fieldIndex];
                        });
                    });
                    allUrlVariables.forEach(function (variable, index) {
                        var fieldIndex = parseInt(variable.variable.replace('field', ''), 10);
                        newDynamicUrlValues_2[index + 1] = personData_1["field" + fieldIndex];
                    });
                    headerVariable.forEach(function (variable, index) {
                        var fieldIndex = parseInt(variable.variable.replace('field', ''), 10);
                        newHeaderValue_2[index + 1] = personData_1["field" + fieldIndex];
                    });
                    cardImageVariables.forEach(function (variables, carouselIndex) {
                        if (variables.length > 0 && variables[0].variable) {
                            var fieldIndex = parseInt(variables[0].variable.replace('field', ''), 10);
                            newCardImageValue_2[carouselIndex + 1] = personData_1["field" + fieldIndex];
                        }
                    });
                }
                setBodyVariableValues(newBodyVariableValues_2);
                setHeaderVariableValues(newHeaderValue_2);
                setVideoHeaderValue(processedData.videoHeaderValue);
                setCardImageValues(newCardImageValue_2);
                setDynamicUrlValues(newDynamicUrlValues_2);
                setBubbleVariableValues(newCarouselBubbleVariableValues_2);
                setCarouselVariableValues(processedData.carouselVariableValues);
                setAdditionalVariableValues(newAdditionalVariableValues_2);
                setSelectedAdditionalHeaders(processedData.selectedAdditionalHeaders);
                setSelectedAuthVariable(processedData.selectedAuthVariable);
                if (combinedData_2.fields && combinedData_2.fields.primarykey) {
                    setSelectedHeader(combinedData_2.fields.primarykey);
                }
                var bodyVars = detectVariablesField(combinedData_2.message);
                var newSelectedHeaders_2 = __assign({}, selectedHeaders);
                bodyVars.forEach(function (variable, index) {
                    var fieldIndex;
                    if (typeof variable.variable === 'string' && variable.variable.startsWith('field')) {
                        fieldIndex = parseInt(variable.variable.replace('field', ''), 10);
                    }
                    else {
                        fieldIndex = parseInt(variable.variable, 10);
                    }
                    var header = combinedData_2.fields.columns[fieldIndex - 2];
                    newSelectedHeaders_2["body-" + (index + 1)] = header;
                });
                setSelectedHeaders(newSelectedHeaders_2);
                updateTemplate();
            }
        }
    }, [multiData]);
    // funcion que updatea los value que le mandamos a templarepreview si el usuario selecciona otra cosa en el updatecampaign
    var updateValues = function (variableNumber, selectedOption, variableType, carouselIndex) {
        var _a;
        if (row && !detectionChangeSource) {
            var key_1 = selectedOption.key;
            var allVariables_2 = multiData[4].data[0].fields.allVariables || {};
            var field = Object.values(allVariables_2).find(function (item) { return item.column === key_1; });
            var value_1 = field ? field.value : '';
            if (variableType === 'body') {
                setBodyVariableValues(function (prevValues) {
                    var _a;
                    return (__assign(__assign({}, prevValues), (_a = {}, _a[variableNumber] = value_1, _a)));
                });
            }
            else if (variableType === 'header') {
                setHeaderVariableValues(function (prevValues) {
                    var _a;
                    return (__assign(__assign({}, prevValues), (_a = {}, _a[variableNumber] = value_1, _a)));
                });
            }
            else if (variableType === 'video') {
                setVideoHeaderValue(value_1);
                setHeaderVariableValues((_a = {}, _a[variableNumber] = value_1, _a));
            }
            else if (variableType === 'cardImage') {
                setCardImageValues(function (prevValues) {
                    var _a;
                    return (__assign(__assign({}, prevValues), (_a = {}, _a[variableNumber] = value_1, _a)));
                });
            }
            else if (variableType === 'dynamicUrl') {
                setDynamicUrlValues(function (prevValues) {
                    var _a;
                    return (__assign(__assign({}, prevValues), (_a = {}, _a[variableNumber] = value_1, _a)));
                });
            }
            else if (variableType === 'carousel' && carouselIndex !== undefined) {
                setCarouselVariableValues(function (prevValues) {
                    var _a, _b;
                    return (__assign(__assign({}, prevValues), (_a = {}, _a[carouselIndex] = __assign(__assign({}, prevValues[carouselIndex]), (_b = {}, _b[variableNumber] = value_1, _b)), _a)));
                });
                setBubbleVariableValues(function (prevValues) {
                    var newBubbleValues = __assign({}, prevValues);
                    if (!newBubbleValues[carouselIndex]) {
                        newBubbleValues[carouselIndex] = {};
                    }
                    newBubbleValues[carouselIndex][variableNumber] = value_1;
                    return newBubbleValues;
                });
            }
            else if (variableType === 'authentication') {
                setSelectedAuthVariable(value_1);
            }
            else if (variableType === 'additional') {
                setAdditionalVariableValues(function (prevValues) {
                    var _a;
                    return (__assign(__assign({}, prevValues), (_a = {}, _a[variableNumber] = value_1, _a)));
                });
            }
            else if (variableType === 'receiver') {
                setSelectedHeader(key_1);
            }
        }
        else {
            var header = selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.key;
            var value_2 = jsonPersons.length > 0 ? jsonPersons[0][header] : '';
            if (variableType === 'body') {
                setBodyVariableValues(function (prevValues) {
                    var _a;
                    return (__assign(__assign({}, prevValues), (_a = {}, _a[variableNumber] = value_2, _a)));
                });
            }
            else if (variableType === 'header') {
                setHeaderVariableValues(function (prevValues) {
                    var _a;
                    return (__assign(__assign({}, prevValues), (_a = {}, _a[variableNumber] = value_2, _a)));
                });
            }
            else if (variableType === 'video') {
                setVideoHeaderValue(value_2);
            }
            else if (variableType === 'cardImage') {
                setCardImageValues(function (prevValues) {
                    var _a;
                    return (__assign(__assign({}, prevValues), (_a = {}, _a[variableNumber] = value_2, _a)));
                });
            }
            else if (variableType === 'dynamicUrl') {
                setDynamicUrlValues(function (prevValues) {
                    var _a;
                    return (__assign(__assign({}, prevValues), (_a = {}, _a[variableNumber] = value_2, _a)));
                });
            }
            else if (variableType === 'carousel' && carouselIndex !== undefined) {
                setCarouselVariableValues(function (prevValues) {
                    var _a, _b;
                    return (__assign(__assign({}, prevValues), (_a = {}, _a[carouselIndex] = __assign(__assign({}, prevValues[carouselIndex]), (_b = {}, _b[variableNumber] = value_2, _b)), _a)));
                });
            }
            else if (variableType === 'authentication') {
                setSelectedAuthVariable(value_2);
            }
            else if (variableType === 'additional') {
                setAdditionalVariableValues(function (prevValues) {
                    var _a;
                    return (__assign(__assign({}, prevValues), (_a = {}, _a[variableNumber] = value_2, _a)));
                });
            }
            else if (variableType === 'receiver') {
                setSelectedHeader(header);
            }
        }
    };
    var getAdditionalVariableIndex = function () {
        var additionalIndexes = Object.keys(selectedFields)
            .filter(function (key) { return selectedFields[key].type === 'variablehidden'; })
            .map(function (key) { return parseInt(selectedFields[key].index, 10); });
        return additionalIndexes.length > 0 ? Math.max.apply(Math, additionalIndexes) + 1 : 1;
    };
    //manejo de cambio de variables en field selects, cambia los keys e index idedntificadores
    var handleVariableChange = function (variableNumber, selectedOption, variableType, carouselIndex) {
        var _a, _b, _c, _d, _e;
        var _f, _g, _h, _j, _k, _l;
        if (row && !detectionChangeSource) {
            //console.log(`Variable Change - type: ${variableType}, variableNumber: ${variableNumber}, selectedOption:`, selectedOption, "carouselIndex", carouselIndex);
            var header_1 = selectedOption ? selectedOption.key : '';
            var index = variableType === 'additional' ? getAdditionalVariableIndex() : variableNumber;
            updateValues(variableNumber, selectedOption, variableType, carouselIndex);
            var newSelectedFields = __assign({}, selectedFields);
            newSelectedFields["field" + index] = {
                column: selectedOption,
                value: selectedOption.key,
                type: variableType === 'additional' ? 'variablehidden' : variableType,
                index: index.toString(),
                carouselIndex: carouselIndex !== undefined ? carouselIndex : null
            };
            setSelectedFields(newSelectedFields);
            var key = generateKey(variableType, variableNumber, carouselIndex);
            var newSelectedHeaders = __assign(__assign({}, selectedHeaders), (_a = {}, _a[key] = header_1, _a));
            setSelectedHeaders(newSelectedHeaders);
            var newVariableSelections = __assign(__assign({}, variableSelections), (_b = {}, _b[key] = header_1, _b));
            setVariableSelections(newVariableSelections);
            if (variableType === 'header') {
                var allVariables_3 = ((_h = (_g = (_f = multiData[4]) === null || _f === void 0 ? void 0 : _f.data[0]) === null || _g === void 0 ? void 0 : _g.fields) === null || _h === void 0 ? void 0 : _h.allVariables) || {};
                var selectedFieldKey = Object.keys(allVariables_3).find(function (key) { var _a; return ((_a = allVariables_3[key]) === null || _a === void 0 ? void 0 : _a.column) === header_1; });
                var value_3 = selectedFieldKey ? allVariables_3[selectedFieldKey].value : '';
                setHeaderVariableValues(function (prevValues) {
                    var _a;
                    return (__assign(__assign({}, prevValues), (_a = {}, _a[variableNumber] = value_3, _a)));
                });
            }
            if (variableType === 'video') {
                var allVariables_4 = ((_l = (_k = (_j = multiData[4]) === null || _j === void 0 ? void 0 : _j.data[0]) === null || _k === void 0 ? void 0 : _k.fields) === null || _l === void 0 ? void 0 : _l.allVariables) || {};
                var selectedFieldKey = Object.keys(allVariables_4).find(function (key) { var _a; return ((_a = allVariables_4[key]) === null || _a === void 0 ? void 0 : _a.column) === header_1; });
                var value = selectedFieldKey ? allVariables_4[selectedFieldKey].value : '';
                setVideoHeaderValue(value);
                setHeaderVariableValues((_c = {}, _c[variableNumber] = value, _c));
            }
            if (variableType === 'receiver') {
                setSelectedHeader(header_1);
                setSelectedFields(function (prevFields) {
                    var _a;
                    return (__assign(__assign({}, prevFields), (_a = {}, _a["field" + variableNumber] = {
                        column: selectedOption,
                        value: selectedOption.key,
                        type: 'receiver',
                        index: variableNumber.toString(),
                        carouselIndex: null
                    }, _a)));
                });
            }
            updateTemplate();
        }
        else {
            updateValues(variableNumber, selectedOption, variableType, carouselIndex);
            //console.log(`Variable Change - type: ${variableType}, variableNumber: ${variableNumber}, selectedOption:`, selectedOption, "carouselIndex", carouselIndex);
            var header = selectedOption ? selectedOption.key : '';
            var index = variableType === 'additional' ? getAdditionalVariableIndex() : variableNumber;
            var key = generateKey(variableType, variableNumber, carouselIndex);
            var newSelectedHeaders = __assign(__assign({}, selectedHeaders), (_d = {}, _d[key] = header, _d));
            setSelectedHeaders(newSelectedHeaders);
            var newVariableSelections = __assign(__assign({}, variableSelections), (_e = {}, _e[key] = header, _e));
            setVariableSelections(newVariableSelections);
            var newSelectedFields = __assign({}, selectedFields);
            var value = row && !detectionChangeSource ? selectedOption.key : jsonPersons.length > 0 ? jsonPersons[0][header] : '';
            newSelectedFields["field" + index] = {
                column: selectedOption,
                value: value,
                type: variableType === 'additional' ? 'variablehidden' : variableType,
                index: index.toString(),
                carouselIndex: carouselIndex !== undefined ? carouselIndex : null
            };
            setSelectedFields(newSelectedFields);
            if (!header) {
                updateTemplate(true, variableNumber);
            }
            else {
                updateTemplate();
            }
        }
    };
    var generateKey = function (variableType, variableNumber, carouselIndex) {
        return carouselIndex !== undefined ? variableType + "-" + carouselIndex + "-" + variableNumber : variableType + "-" + variableNumber;
    };
    var getValueDefault = function (variableType, variableNumber, carouselIndex) {
        var key = generateKey(variableType, variableNumber, carouselIndex);
        var header = selectedHeaders[key];
        if ((variableType === 'video' || variableType === 'cardImage') && header === 'default') {
            return { key: 'default', value: 'Default ' };
        }
        return header ? { key: header, value: header } : undefined;
    };
    var _11 = react_1.useState(templateToUse), currentTemplate = _11[0], setCurrentTemplate = _11[1];
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
            var _a, _b;
            var match = (_b = (_a = button.btn) === null || _a === void 0 ? void 0 : _a.url) === null || _b === void 0 ? void 0 : _b.match(/{{field(\d+)}}/);
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
    var _12 = react_1.useState([]), unavailableVariables = _12[0], setUnavailableVariables = _12[1];
    var updateTemplate = react_1.useCallback(function (resetField, fieldToReset) {
        if (resetField === void 0) { resetField = false; }
        if (fieldToReset === void 0) { fieldToReset = null; }
        if (row && !detectionChangeSource) {
            var updatedTemplate_1 = JSON.parse(JSON.stringify(templateToUse));
            if (updatedTemplate_1.category === "AUTHENTICATION" && !updatedTemplate_1.body) {
                updatedTemplate_1.body = "Tu código de verificación es {{1}}. Por tu seguridad, no lo compartas.";
            }
            if (variablesBodyView.length > 0 && updatedTemplate_1.body) {
                var bodyIndex_1 = 1;
                variablesBodyView.forEach(function (variable) {
                    var placeholder = "{{" + bodyIndex_1 + "}}";
                    if (updatedTemplate_1.body.indexOf(placeholder) !== -1) {
                        updatedTemplate_1.body = updatedTemplate_1.body.replace(placeholder, "{{" + variable.variable + "}}");
                    }
                    bodyIndex_1++;
                });
            }
            if (variablesCarouselBubbleView.length > 0 && updatedTemplate_1.carouseldata) {
                variablesCarouselBubbleView.forEach(function (variables, carouselIndex) {
                    if (updatedTemplate_1.carouseldata[carouselIndex]) {
                        var bodyIndex_2 = 1;
                        variables.forEach(function (variable) {
                            var placeholder = "{{" + bodyIndex_2 + "}}";
                            if (updatedTemplate_1.carouseldata[carouselIndex].body.indexOf(placeholder) !== -1) {
                                updatedTemplate_1.carouseldata[carouselIndex].body = updatedTemplate_1.carouseldata[carouselIndex].body.replace(placeholder, "{{" + variable.variable + "}}");
                            }
                            bodyIndex_2++;
                        });
                    }
                });
            }
            if (variablesAdditionalView.length > 0) {
                updatedTemplate_1.variableshidden = variablesAdditionalView;
            }
            if (variablesUrlView.length > 0) {
                if (updatedTemplate_1.buttonsgeneric) {
                    updatedTemplate_1.buttonsgeneric.forEach(function (button, btnIndex) {
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
                if (updatedTemplate_1.carouseldata) {
                    updatedTemplate_1.carouseldata.forEach(function (item, carouselIndex) {
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
            if (variablesCardImageView.length > 0 && updatedTemplate_1.carouseldata) {
                variablesCardImageView.forEach(function (variables, carouselIndex) {
                    if (variables.length > 0 && variables[0].variable) {
                        updatedTemplate_1.carouseldata[carouselIndex].header = "{{" + variables[0].variable + "}}";
                    }
                });
            }
            if (variablesHeaderView.length > 0 && updatedTemplate_1.header) {
                variablesHeaderView.forEach(function (variable, index) {
                    var placeholder = "{{" + (index + 1) + "}}";
                    if (updatedTemplate_1.header.indexOf(placeholder) !== -1) {
                        updatedTemplate_1.header = updatedTemplate_1.header.replace(placeholder, "{{" + variable.variable + "}}");
                    }
                    else {
                        updatedTemplate_1.header = "{{" + variable.variable + "}}";
                    }
                });
            }
            Object.keys(variableSelections).forEach(function (key) {
                var _a, _b;
                var _c, _d;
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
                if (type === 'body' && updatedTemplate_1.body) {
                    var placeholders = __spreadArrays(updatedTemplate_1.body.matchAll(/{{field(\d+)}}/g));
                    if (placeholders.length >= number) {
                        var currentField = placeholders[number - 1][0];
                        var selectedOption_1 = variableSelections["body-" + number];
                        var allVariables_5 = multiData[4].data[0].fields.allVariables;
                        var newField = currentField;
                        if (selectedOption_1) {
                            var matchingField = Object.keys(allVariables_5).find(function (key) { return allVariables_5[key].column === selectedOption_1; });
                            if (matchingField) {
                                newField = "{{" + matchingField + "}}";
                            }
                        }
                        else {
                            var fieldNumber_1 = columns.indexOf(selectedOption_1) + 2;
                            newField = "{{field" + fieldNumber_1 + "}}";
                        }
                        updatedTemplate_1.body = updatedTemplate_1.body.replace(currentField, newField);
                    }
                }
                else if (type === 'header' && updatedTemplate_1.header) {
                    var placeholders = __spreadArrays(updatedTemplate_1.header.matchAll(/{{field(\d+)}}/g));
                    if (placeholders.length >= number) {
                        var currentField = placeholders[number - 1][0];
                        var newField = "{{field" + fieldNumber + "}}";
                        updatedTemplate_1.header = updatedTemplate_1.header.replace(currentField, newField);
                    }
                }
                else if (type === 'cardImage' && updatedTemplate_1.carouseldata) {
                    var carouselIndex = parseInt(number, 10);
                    if (!isNaN(carouselIndex) && updatedTemplate_1.carouseldata[carouselIndex]) {
                        if (header === 'Default ') {
                            var messageTemplateName_1 = multiData[4].data[0].messagetemplatename;
                            var campaign = multiData[3].data.find(function (campaign) { return campaign.name === messageTemplateName_1; });
                            if (campaign && campaign.carouseldata[carouselIndex]) {
                                updatedTemplate_1.carouseldata[carouselIndex].header = campaign.carouseldata[carouselIndex].header;
                            }
                        }
                        else {
                            var allVariables_6 = multiData[4].data[0].fields.allVariables;
                            var selectedField = allVariables_6 ? (_d = Object.keys(allVariables_6)) === null || _d === void 0 ? void 0 : _d.find(function (key) { var _a; return ((_a = allVariables_6 === null || allVariables_6 === void 0 ? void 0 : allVariables_6[key]) === null || _a === void 0 ? void 0 : _a.column) === header; }) : undefined;
                            if (selectedField) {
                                updatedTemplate_1.carouseldata[carouselIndex].header = "{{" + selectedField + "}}";
                            }
                            else {
                                var placeholders = __spreadArrays(updatedTemplate_1.carouseldata[carouselIndex].header.matchAll(/{{field(\d+)}}/g));
                                if (placeholders.length >= 1) {
                                    var currentField = placeholders[0][0];
                                    var newField = "{{field" + fieldNumber + "}}";
                                    updatedTemplate_1.carouseldata[carouselIndex].header = updatedTemplate_1.carouseldata[carouselIndex].header.replace(currentField, newField);
                                }
                            }
                        }
                    }
                }
                else if (type === 'dynamicUrl') {
                    if (updatedTemplate_1.buttonsgeneric) {
                        updatedTemplate_1.buttonsgeneric.forEach(function (button, btnIndex) {
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
                    if (updatedTemplate_1.carouseldata) {
                        updatedTemplate_1.carouseldata.forEach(function (item, carouselIndex) {
                            item.buttons.forEach(function (button, btnIndex) {
                                if (button.btn.type === 'dynamic') {
                                    var buttonKey = "dynamicUrl-dynamicUrl-" + carouselIndex + "-" + btnIndex;
                                    var variableSelectionsValue_1 = variableSelections[buttonKey];
                                    if (variableSelectionsValue_1) {
                                        var field = Object.keys(multiData[4].data[0].fields.allVariables).find(function (key) { return multiData[4].data[0].fields.allVariables[key].column === variableSelectionsValue_1; });
                                        var fieldKey = field ? field.replace('field', '') : null;
                                        if (fieldKey) {
                                            if (!button.btn.url.includes('{{')) {
                                                button.btn.url += '/{{1}}';
                                            }
                                            var regex = /{{field(\d+)}}/g;
                                            button.btn.url = button.btn.url.replace(regex, "{{field" + fieldKey + "}}");
                                        }
                                    }
                                }
                            });
                        });
                    }
                }
                else if (type === 'carousel' && updatedTemplate_1.carouseldata) {
                    var carouselIndex = parseInt(carouselIndexStr, 10);
                    if (!isNaN(carouselIndex) && updatedTemplate_1.carouseldata[carouselIndex]) {
                        var selectedField_1 = variableSelections[key];
                        var field = Object.keys(multiData[4].data[0].fields.allVariables).find(function (key) { return multiData[4].data[0].fields.allVariables[key].column === selectedField_1; });
                        var fieldKey = field ? field.replace('field', '') : null;
                        if (fieldKey) {
                            var placeholders = __spreadArrays(updatedTemplate_1.carouseldata[carouselIndex].body.matchAll(/{{field(\d+)}}/g));
                            if (placeholders.length >= number) {
                                var currentField = placeholders[number - 1][0];
                                var newField = "{{field" + fieldKey + "}}";
                                updatedTemplate_1.carouseldata[carouselIndex].body = updatedTemplate_1.carouseldata[carouselIndex].body.replace(currentField, newField);
                            }
                        }
                    }
                }
                else if (type === 'additional') {
                    var additionalIndex = parseInt(number, 10) - 1;
                    if (!isNaN(additionalIndex) && updatedTemplate_1.variableshidden) {
                        var selectedOption_2 = variableSelections["additional-" + number];
                        var allVariables_7 = multiData[4].data[0].fields.allVariables;
                        if (selectedOption_2) {
                            var matchingField = Object.keys(allVariables_7).find(function (key) { return allVariables_7[key].column === selectedOption_2; });
                            if (matchingField) {
                                updatedTemplate_1.variableshidden[additionalIndex] = matchingField;
                            }
                        }
                        else {
                            if (updatedTemplate_1.variableshidden[additionalIndex]) {
                                updatedTemplate_1.variableshidden[additionalIndex] = "field" + fieldNumber;
                            }
                        }
                    }
                }
                else if (['VIDEO', 'DOCUMENT', 'IMAGE'].includes(updatedTemplate_1.headertype) && variableSelections['video-videoHeader']) {
                    var selectedHeader_1 = variableSelections['video-videoHeader'];
                    if (selectedHeader_1 === 'Default ') {
                        var messageTemplateName_2 = multiData[4].data[0].messagetemplatename;
                        var campaign = multiData[3].data.find(function (campaign) { return campaign.name === messageTemplateName_2; });
                        if (campaign && campaign.header) {
                            updatedTemplate_1.header = campaign.header;
                        }
                    }
                    else {
                        var fieldNumber_2 = columns.indexOf(selectedHeader_1) + 2;
                        if (!isNaN(fieldNumber_2)) {
                            updatedTemplate_1.header = "{{field" + fieldNumber_2 + "}}";
                        }
                    }
                }
            });
            if (row && !detectionChangeSource) { // 
            }
            else {
                updatedTemplate_1.variableshidden = Object.values(selectedAdditionalHeaders).map(function (header) { return "field" + (columns.indexOf(header) + 2); });
            }
            if (resetField && fieldToReset !== null) {
                var placeholders = __spreadArrays(updatedTemplate_1.body.matchAll(/{{field(\d+)}}/g));
                if (placeholders.length >= fieldToReset) {
                    var currentField = placeholders[fieldToReset - 1][0];
                    updatedTemplate_1.body = updatedTemplate_1.body.replace(currentField, "{{" + fieldToReset + "}}");
                }
            }
            //console.log('editing final updatedTemplate:', updatedTemplate);
            setCurrentTemplate(updatedTemplate_1);
            setDetaildata(function (prev) { return (__assign(__assign({}, prev), { message: updatedTemplate_1.body, messagetemplateheader: __assign(__assign({}, prev.messagetemplateheader), { value: updatedTemplate_1.header }), messagetemplatebuttons: updatedTemplate_1.buttonsgeneric || [], carouseljson: updatedTemplate_1.carouseldata, variableshidden: updatedTemplate_1.variableshidden })); });
            var getUsedVariables = function (template) {
                var regex = /{{field(\d+)}}/g;
                var usedVariables = new Set();
                var extractVariables = function (str) {
                    var match;
                    while ((match = regex.exec(str)) !== null) {
                        usedVariables.add("field" + match[1]);
                    }
                };
                if (template.body)
                    extractVariables(template.body);
                if (template.header)
                    extractVariables(template.header);
                if (template.footer)
                    extractVariables(template.footer);
                if (template.buttonsgeneric) {
                    template.buttonsgeneric.forEach(function (button) {
                        if (button.btn.url)
                            extractVariables(button.btn.url);
                    });
                }
                if (template.carouseldata) {
                    template.carouseldata.forEach(function (carousel) {
                        if (carousel.body)
                            extractVariables(carousel.body);
                        if (carousel.header)
                            extractVariables(carousel.header);
                        carousel.buttons.forEach(function (button) {
                            if (button.btn.url)
                                extractVariables(button.btn.url);
                        });
                    });
                }
                if (template.variableshidden) {
                    template.variableshidden.forEach(function (variable) {
                        usedVariables.add(variable);
                    });
                }
                return usedVariables;
            };
            var usedVariables = getUsedVariables(updatedTemplate_1);
            setUnavailableVariables(__spreadArrays(usedVariables));
        }
        else {
            var updatedTemplate_2 = JSON.parse(JSON.stringify(templateToUse));
            if (updatedTemplate_2.category === "AUTHENTICATION" && !updatedTemplate_2.body) {
                updatedTemplate_2.body = "Tu código de verificación es {{1}}. Por tu seguridad, no lo compartas.";
            }
            var newSelectedFields_1 = __assign({}, selectedFields);
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
                var selectedOption = variableSelections[key];
                var value = jsonPersons.length > 0 ? jsonPersons[0][selectedOption] : '';
                var index = number;
                if (type === 'dynamicUrl') {
                    index = key;
                }
                newSelectedFields_1["field" + fieldNumber] = {
                    column: selectedOption,
                    value: value,
                    type: type,
                    index: index,
                    carouselIndex: carouselIndexStr !== undefined ? parseInt(carouselIndexStr, 10) : null
                };
                if (type === 'body' && updatedTemplate_2.body) {
                    updatedTemplate_2.body = updatedTemplate_2.body.replace("{{" + number + "}}", "{{field" + fieldNumber + "}}");
                }
                else if (type === 'header' && updatedTemplate_2.header) {
                    updatedTemplate_2.header = updatedTemplate_2.header.replace("{{" + number + "}}", "{{field" + fieldNumber + "}}");
                }
                else if (type === 'cardImage' && updatedTemplate_2.carouseldata) {
                    var carouselIndex = parseInt(number, 10) - 1;
                    if (!isNaN(carouselIndex) && updatedTemplate_2.carouseldata[carouselIndex]) {
                        if (selectedOption === 'default') {
                            updatedTemplate_2.carouseldata[carouselIndex].header = templateToUse.carouseldata[carouselIndex].header;
                        }
                        else {
                            updatedTemplate_2.carouseldata[carouselIndex].header = "{{field" + fieldNumber + "}}";
                        }
                    }
                }
                else if (type === 'dynamicUrl') {
                    if (updatedTemplate_2.buttonsgeneric) {
                        updatedTemplate_2.buttonsgeneric.forEach(function (button, btnIndex) {
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
                    if (updatedTemplate_2.carouseldata) {
                        updatedTemplate_2.carouseldata.forEach(function (item, carouselIndex) {
                            item.buttons.forEach(function (button, btnIndex) {
                                if (button.btn.type === 'dynamic') {
                                    var buttonKey = "dynamicUrl-dynamicUrl-" + carouselIndex + "-" + btnIndex;
                                    var variableSelectionsValue = variableSelections[buttonKey];
                                    if (variableSelectionsValue) {
                                        var fieldNumber_3 = headers.indexOf(variableSelectionsValue) + 1;
                                        if (!isNaN(fieldNumber_3)) {
                                            if (!button.btn.url.includes('{{')) {
                                                button.btn.url += '/{{1}}';
                                            }
                                            var regex = /{{\d+}}/g;
                                            button.btn.url = button.btn.url.replace(regex, "{{field" + fieldNumber_3 + "}}");
                                        }
                                    }
                                }
                            });
                        });
                    }
                }
                else if (type === 'carousel' && updatedTemplate_2.carouseldata) {
                    var index_1 = parseInt(carouselIndexStr, 10);
                    if (!isNaN(index_1) && updatedTemplate_2.carouseldata[index_1]) {
                        updatedTemplate_2.carouseldata[index_1].body = updatedTemplate_2.carouseldata[index_1].body.replace("{{" + number + "}}", "{{field" + fieldNumber + "}}");
                    }
                }
                else if (type === 'bubble' && updatedTemplate_2.carouseldata) {
                    var index_2 = parseInt(carouselIndexStr, 10);
                    if (!isNaN(index_2)) {
                        updatedTemplate_2.carouseldata[index_2].body = updatedTemplate_2.carouseldata[index_2].body.replace("{{" + number + "}}", "{{field" + fieldNumber + "}}");
                    }
                }
                else if (['VIDEO', 'DOCUMENT', 'IMAGE'].includes(updatedTemplate_2.headertype) && variableSelections['video-videoHeader']) {
                    var selectedHeader_2 = variableSelections['video-videoHeader'];
                    if (selectedHeader_2 === 'default') {
                        updatedTemplate_2.header = templateToUse.header;
                    }
                    else {
                        var fieldNumber_4 = headers.indexOf(selectedHeader_2) + 1;
                        if (!isNaN(fieldNumber_4)) {
                            updatedTemplate_2.header = "{{field" + fieldNumber_4 + "}}";
                        }
                    }
                }
            });
            if (updatedTemplate_2.category === "AUTHENTICATION" && selectedHeaders['authentication-authentication']) {
                var fieldNumber = headers.indexOf(selectedHeaders['authentication-authentication']) + 1;
                if (!isNaN(fieldNumber)) {
                    updatedTemplate_2.body = updatedTemplate_2.body.replace('{{1}}', "{{field" + fieldNumber + "}}");
                }
            }
            if (updatedTemplate_2.messagetemplatetype === "CAROUSEL" && updatedTemplate_2.carouseljson) {
                var carouselData = JSON.parse(updatedTemplate_2.carouseljson);
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
                updatedTemplate_2.carouseljson = JSON.stringify(carouselData);
            }
            updatedTemplate_2.variableshidden = Object.values(selectedAdditionalHeaders).map(function (header) { return "field" + (headers.indexOf(header) + 1); });
            newSelectedFields_1 = Object.fromEntries(Object.entries(newSelectedFields_1).filter(function (_a) {
                var key = _a[0], column = _a[1].column;
                return Object.values(variableSelections).includes(column);
            }));
            var newAllVariables_1 = buildAllVariables(jsonPersons);
            //console.log('vacio final updatedTemplate:', updatedTemplate);
            setSelectedFields(newSelectedFields_1);
            setAllVariables(newAllVariables_1);
            setFilledTemplate(updatedTemplate_2);
            setDetaildata(function (prev) { return (__assign(__assign({}, prev), { message: updatedTemplate_2.body, messagetemplateheader: __assign(__assign({}, prev.messagetemplateheader), { value: updatedTemplate_2.header }), messagetemplatebuttons: updatedTemplate_2.buttonsgeneric || [], fields: __assign(__assign({}, prev.fields), { campaignvariables: newSelectedFields_1, allVariables: newAllVariables_1 }), carouseljson: updatedTemplate_2.carouseldata, variableshidden: updatedTemplate_2.variableshidden })); });
        }
    }, [headers, selectedHeaders, templateToUse, variableSelections, jsonPersons, variablesBodyView, variablesAdditionalView, variablesCarouselBubbleView, variablesUrlView, variablesHeaderView, variablesCardImageView]);
    //logica para person y lead, previsualizacion de campaña ya creada
    var _13 = react_1.useState([]), unavailableValues = _13[0], setUnavailableValues = _13[1];
    var _14 = react_1.useState([]), availableOptions = _14[0], setAvailableOptions = _14[1];
    var checkTypeInMultiData = function () {
        var _a, _b;
        return (_b = (_a = multiData[5]) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.some(function (item) { return item.type === "PERSON" || item.type === "LEAD"; });
    };
    var getUnavailableVariableValues = function () {
        var unavailableValues = unavailableVariables.map(function (variable) {
            var fieldIndex = parseInt(variable.replace('field', ''), 10) - 2;
            return templateData.fields.columns[fieldIndex];
        });
        return unavailableValues;
    };
    var getAvailableOptions = function (dataToUse, unavailableValues) {
        return dataToUse.filter(function (option) { return option !== 'Destinatarios' && !unavailableValues.includes(option); });
    };
    var getAvailableOptionsForPersonOrLead = function () {
        var allVariables = multiData[4].data[0].fields.allVariables || {};
        var allColumns = Object.values(allVariables).map(function (item) { return item.column; });
        return allColumns.filter(function (option) { return option !== 'Destinatarios' && !unavailableValues.includes(option); });
    };
    react_1.useEffect(function () {
        if (checkTypeInMultiData()) {
            var campaignVariables = multiData[4].data[0].fields.campaignvariables || {};
            var newUnavailableValues = Object.values(campaignVariables).map(function (variable) { return variable.column; });
            setUnavailableValues(newUnavailableValues);
            var newAvailableOptions = getAvailableOptionsForPersonOrLead();
            setAvailableOptions(newAvailableOptions);
        }
        else {
            var newUnavailableValues = getUnavailableVariableValues();
            setUnavailableValues(newUnavailableValues);
            var newAvailableOptions = getAvailableOptions(dataToUse, newUnavailableValues);
            setAvailableOptions(newAvailableOptions);
        }
    }, [unavailableVariables, (_h = templateData.fields) === null || _h === void 0 ? void 0 : _h.columns, multiData]);
    var getMatchingUnavailableValues = function () {
        if (checkTypeInMultiData()) {
            var allVariables_8 = multiData[4].data[0].fields.allVariables || {};
            var matchingValues = unavailableValues
                .map(function (value) {
                return Object.entries(allVariables_8).find(function (_a) {
                    var key = _a[0], variable = _a[1];
                    return variable.column === value;
                });
            })
                .filter(Boolean)
                .map(function (_a) {
                var key = _a[0], variable = _a[1];
                return (__assign({ field: key }, variable));
            });
            return matchingValues;
        }
        return [];
    };
    var matchingUnavailableValues = getMatchingUnavailableValues();
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
    var renderDynamicUrlFields = function (carouselIndex, row, buttons) {
        var _a, _b, _c;
        var dynamicButtons = ((_a = templateToUse.buttonsgeneric) === null || _a === void 0 ? void 0 : _a.filter(function (button) { return button.btn.type === 'dynamic'; })) || [];
        var carouselDynamicButtons = ((_b = templateToUse.carouseldata) === null || _b === void 0 ? void 0 : _b.flatMap(function (item, index) {
            return item.buttons.filter(function (button) { return button.btn.type === 'dynamic'; }).map(function (button, btnIndex) { return ({
                button: button,
                btnIndex: btnIndex,
                carouselIndex: index
            }); });
        })) || [];
        var allDynamicButtons = buttons.length ? buttons : __spreadArrays(dynamicButtons, carouselDynamicButtons);
        var campaignVariables = ((_c = multiData[4].data[0].fields) === null || _c === void 0 ? void 0 : _c.campaignvariables) || {};
        return allDynamicButtons.map(function (buttonData, index) {
            var key = buttonData.carouselIndex !== undefined ?
                "dynamicUrl-" + buttonData.carouselIndex + "-" + buttonData.btnIndex :
                "dynamicUrl-" + (index + 1);
            var valueDefault;
            var dynamicUrlField = Object.values(campaignVariables).find(function (field) { return field.type === 'dynamicUrl' && field.index === key; });
            if (!dynamicUrlField) {
                var nonCarouselDynamicUrlField = Object.values(campaignVariables).find(function (field) { return field.type === 'dynamicUrl' && field.index === "dynamicUrl-dynamicUrl-" + (index + 1); });
                if (nonCarouselDynamicUrlField) {
                    valueDefault = nonCarouselDynamicUrlField.column;
                }
            }
            else {
                valueDefault = dynamicUrlField.column;
            }
            if (!valueDefault) {
                if (row && !detectionChangeSource) {
                    var fieldsInButtons = extractFieldKeysFromButtonsgeneric(currentTemplate.buttonsgeneric, currentTemplate.carouseldata);
                    var fieldKey_1 = fieldsInButtons[index];
                    if (fieldKey_1) {
                        var matchingField = matchingUnavailableValues.find(function (item) { return item.field === fieldKey_1; });
                        if (matchingField) {
                            valueDefault = matchingField.column ? matchingField.column : undefined;
                        }
                        else {
                            var fieldIndex = parseInt(fieldKey_1.replace('field', ''), 10) - 2;
                            var valor = templateData.fields.columns[fieldIndex];
                            valueDefault = valor ? valor : undefined;
                        }
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
            var allOptions = row //
                ? __spreadArrays(new Set(__spreadArrays(availableOptions, matchingUnavailableValues.map(function (item) { return item.column; })))) : availableData;
            return (react_1["default"].createElement("div", { key: key },
                react_1["default"].createElement("p", { style: { marginBottom: '3px' } }, "Url Dinamico {{" + (index + 1) + "}}"),
                react_1["default"].createElement(components_1.FieldSelectDisabled, { variant: "outlined", uset: true, className: "col-12", data: allOptions.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: valueDefault, onChange: function (selectedOption) { return handleVariableChange(key, selectedOption, 'dynamicUrl'); }, getOptionDisabled: function (option) { return option.key === 'No quedan más variables'; } })));
        });
    };
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", { className: classes.containerDetail, style: { display: 'flex', width: '100%' } },
            react_1["default"].createElement("div", { style: { width: '50%' } },
                react_1["default"].createElement("div", { className: "row-zyx" },
                    react_1["default"].createElement(core_1.FormControl, { className: "col-12" }, row && !detectionChangeSource ? (react_1["default"].createElement(react_1["default"].Fragment, null,
                        react_1["default"].createElement("div", { style: { fontSize: '1rem', color: 'black' } },
                            " ",
                            'Destinatarios',
                            " "),
                        react_1["default"].createElement("div", { className: classes.subtitle },
                            " ",
                            'Selecciona la columna que contiene los destinatarios para el envio del mensaje',
                            " "),
                        react_1["default"].createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 5 } },
                            react_1["default"].createElement("div", { style: { flex: 1 } }, (function () {
                                var _a;
                                var valueDefault;
                                var campaignVariables = ((_a = multiData[4].data[0].fields) === null || _a === void 0 ? void 0 : _a.campaignvariables) || {};
                                for (var field in campaignVariables) {
                                    if (campaignVariables[field].type === 'receiver') {
                                        valueDefault = campaignVariables[field].column;
                                    }
                                }
                                var selectedHeader = selectedHeaders['receiver-1'];
                                if (selectedHeader) {
                                    valueDefault = selectedHeader;
                                }
                                var allOptions = __spreadArrays(new Set(__spreadArrays(availableOptions, matchingUnavailableValues.map(function (item) { return item.column; }))));
                                return (react_1["default"].createElement(components_1.FieldSelectDisabled, { variant: "outlined", uset: true, label: 'Campos archivo', className: "col-12", data: checkTypeInMultiData() ? allOptions.map(function (header) { return ({ key: header, value: header }); }) : dataToUse.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: valueDefault, onChange: function (selectedOption) {
                                        handleVariableChange('1', selectedOption, 'receiver');
                                        setSelectedHeaders(function (prevHeaders) { return (__assign(__assign({}, prevHeaders), { 'receiver-1': selectedOption.key })); });
                                    }, getOptionDisabled: function (option) { return option.key === 'No quedan más variables'; } }));
                            })()),
                            react_1["default"].createElement(Tooltip_1["default"], { title: 'Selecciona el campo de columna que contiene los destinatarios para el envío del mensaje.', arrow: true, placement: "top" },
                                react_1["default"].createElement(InfoRounded_1["default"], { color: "action", className: classes.iconHelpText }))))) : (react_1["default"].createElement(react_1["default"].Fragment, null,
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
                                react_1["default"].createElement(components_1.FieldSelectDisabled, { variant: "outlined", uset: true, label: 'Campos archivo', className: "col-12", data: dataToUse.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: selectedHeader ? { key: selectedHeader, value: selectedHeader } : '', onChange: function (selectedOption) { return handleVariableChange('1', selectedOption, 'receiver'); }, getOptionDisabled: function (option) { return option.key === 'No quedan más variables'; } })),
                            react_1["default"].createElement(Tooltip_1["default"], { title: 'Selecciona el campo de columna que contiene los destinatarios para el envío del mensaje.', arrow: true, placement: "top" },
                                react_1["default"].createElement(InfoRounded_1["default"], { color: "action", className: classes.iconHelpText })))))),
                    react_1["default"].createElement(core_1.FormControl, { className: "col-12" },
                        react_1["default"].createElement("div", { style: { fontSize: '1rem', color: 'black' } },
                            " ",
                            'Variables Requeridas',
                            " "),
                        react_1["default"].createElement("div", { className: "subtitle" },
                            " ",
                            'Selecciona los campos que ocuparán la posición de cada variable para el envío de la campaña',
                            " "),
                        react_1["default"].createElement("div", { className: classes.containerStyle }, row && !detectionChangeSource ? (((function () {
                            var _a;
                            var campaignVariables = ((_a = multiData[4].data[0].fields) === null || _a === void 0 ? void 0 : _a.campaignvariables) || {};
                            var headerFields = Object.values(campaignVariables).filter(function (field) { return field.type === 'header'; });
                            var maxIndex = Math.max.apply(Math, __spreadArrays(headerFields.map(function (field) { return parseInt(field.index, 10); }), [0]));
                            return Array.from({ length: maxIndex }, function (_, index) {
                                var _a;
                                var field = headerFields.find(function (field) { return parseInt(field.index, 10) === index + 1; });
                                var valueDefault;
                                var key = "header-" + (index + 1);
                                var selectedHeader = selectedHeaders[key];
                                if (selectedHeader) {
                                    valueDefault = selectedHeader;
                                }
                                else if (field) {
                                    valueDefault = field.column ? (field.column === 'default' ? 'Default ' : field.column) : 'Default ';
                                }
                                else {
                                    var fieldsInHeader = extractFieldKeysFromTemplate(currentTemplate.header);
                                    var fieldKey_2 = fieldsInHeader[index];
                                    if (fieldKey_2) {
                                        var matchingField = matchingUnavailableValues.find(function (item) { return item.field === fieldKey_2; });
                                        if (matchingField) {
                                            valueDefault = matchingField.column ? matchingField.column : undefined;
                                        }
                                        else {
                                            var fieldIndex = parseInt(fieldKey_2.replace('field', ''), 10) - 2;
                                            var valor = templateData.fields.columns[fieldIndex];
                                            valueDefault = valor ? valor : undefined;
                                        }
                                    }
                                    else {
                                        valueDefault = undefined;
                                    }
                                }
                                var allOptions = __spreadArrays(new Set(__spreadArrays(availableOptions, matchingUnavailableValues.map(function (item) { return item.column; }))));
                                var headerType = (_a = multiData[4].data[0].messagetemplateheader) === null || _a === void 0 ? void 0 : _a.type;
                                if (headerType !== "TEXT") {
                                    allOptions.push("Default ");
                                }
                                return (react_1["default"].createElement("div", { key: key },
                                    react_1["default"].createElement("p", { style: { marginBottom: '3px' } }, "Variable Cabecera {{" + (index + 1) + "}}"),
                                    react_1["default"].createElement(components_1.FieldSelectDisabled, { variant: "outlined", uset: true, className: "col-12", data: allOptions.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: valueDefault, onChange: function (selectedOption) { return handleVariableChange((index + 1).toString(), selectedOption, 'header'); }, getOptionDisabled: function (option) { return option.key === 'No quedan más variables'; } })));
                            });
                        })())) : (react_1["default"].createElement(react_1["default"].Fragment, null, headerVariables.map(function (variable) { return (react_1["default"].createElement("div", { key: variable.variable },
                            react_1["default"].createElement("p", { style: { marginBottom: '3px' } }, "Variable Cabecera {{" + variable.variable + "}}"),
                            react_1["default"].createElement(components_1.FieldSelectDisabled, { variant: "outlined", uset: true, className: "col-12", data: availableData.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: getValueDefault('header', variable.variable), onChange: function (selectedOption) { return handleVariableChange(variable.variable, selectedOption, 'header'); }, getOptionDisabled: function (option) { return option.key === 'No quedan más variables'; } }))); })))),
                        react_1["default"].createElement("div", { className: classes.containerStyle }, (templateToUse.headertype === 'IMAGE' || templateToUse.headertype === 'VIDEO') && (row && !detectionChangeSource ? ((function () {
                            var _a;
                            var campaignVariables = ((_a = multiData[4].data[0].fields) === null || _a === void 0 ? void 0 : _a.campaignvariables) || {};
                            var headerFields = Object.values(campaignVariables).filter(function (field) { return field.type === 'video' || field.type === 'image'; });
                            var selectedHeader = selectedHeaders['videoHeader'];
                            var valueDefault;
                            if (selectedHeader) {
                                valueDefault = selectedHeader;
                            }
                            else if (headerFields.length > 0) {
                                var field = headerFields[0];
                                if (field.column) {
                                    valueDefault = field.column === 'default' ? 'Default ' : field.column;
                                }
                                else if (field.value) {
                                    valueDefault = field.value;
                                }
                                else {
                                    valueDefault = 'Default ';
                                }
                            }
                            else {
                                valueDefault = 'Default ';
                            }
                            var allOptions = __spreadArrays(new Set(__spreadArrays(availableOptions, matchingUnavailableValues.map(function (item) { return item.column; }), ['Default '])));
                            return (react_1["default"].createElement("div", { key: "header" },
                                react_1["default"].createElement("p", { style: { marginBottom: '3px' } }, "Cabecera Multimedia"),
                                react_1["default"].createElement(components_1.FieldSelectDisabled, { variant: "outlined", uset: true, className: "col-12", data: allOptions.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: valueDefault, onChange: function (selectedOption) {
                                        handleVariableChange('videoHeader', selectedOption, 'video');
                                        setSelectedHeaders(function (prevHeaders) { return (__assign(__assign({}, prevHeaders), { 'videoHeader': selectedOption.key })); });
                                    }, getOptionDisabled: function (option) { return option.key === 'No quedan más variables'; } })));
                        })()) : (react_1["default"].createElement("div", null,
                            react_1["default"].createElement("p", { style: { marginBottom: '3px' } }, "Cabecera Multimedia"),
                            react_1["default"].createElement(components_1.FieldSelectDisabled, { variant: "outlined", uset: true, className: "col-12", data: __spreadArrays([{ key: 'default', value: 'Default ' }], availableData.map(function (header) { return ({ key: header, value: header }); })), optionDesc: "value", optionValue: "key", valueDefault: getValueDefault('video', 'videoHeader'), onChange: function (selectedOption) { return handleVariableChange('videoHeader', selectedOption, 'video'); }, getOptionDisabled: function (option) { return option.key === 'No quedan más variables'; } }))))),
                        react_1["default"].createElement("div", { className: classes.containerStyle }, row && !detectionChangeSource ? (react_1["default"].createElement(react_1["default"].Fragment, null, variablesBodyView.map(function (variable, index) {
                            var fieldsInBody = extractFieldKeysFromTemplate(currentTemplate.body);
                            var fieldKey = fieldsInBody[index];
                            var valueDefault;
                            var allVariables = multiData[4].data[0].fields.allVariables;
                            var selectedField = Object.keys(allVariables || {}).find(function (key) { return allVariables[key].column === fieldKey; });
                            if (selectedField) {
                                valueDefault = allVariables[selectedField].column;
                            }
                            else {
                                var matchingField = matchingUnavailableValues.find(function (item) { return item.field === fieldKey; });
                                if (matchingField) {
                                    valueDefault = matchingField.column ? matchingField.column : undefined;
                                }
                                else {
                                    var fieldIndex = fieldKey ? parseInt(fieldKey.replace('field', ''), 10) - 2 : -1;
                                    var valor = templateData.fields.columns[fieldIndex];
                                    valueDefault = valor ? valor : undefined;
                                }
                            }
                            var selectedValue = variableSelections["body-" + (index + 1)];
                            if (selectedValue) {
                                valueDefault = selectedValue;
                            }
                            var allOptions = __spreadArrays(new Set(__spreadArrays(availableOptions, matchingUnavailableValues.map(function (item) { return item.column; }))));
                            return (react_1["default"].createElement("div", { key: "body-" + (index + 1) },
                                react_1["default"].createElement("p", { style: { marginBottom: '3px' } }, "Variable Cuerpo {{" + (index + 1) + "}}"),
                                react_1["default"].createElement(components_1.FieldSelectDisabled, { variant: "outlined", uset: true, className: "col-12", data: allOptions.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: valueDefault, onChange: function (selectedOption) {
                                        handleVariableChange(index + 1, selectedOption, 'body');
                                        setVariableSelections(function (prev) {
                                            var _a;
                                            return (__assign(__assign({}, prev), (_a = {}, _a["body-" + (index + 1)] = selectedOption.key, _a)));
                                        });
                                    } })));
                        }))) : (react_1["default"].createElement(react_1["default"].Fragment, null,
                            templateToUse.category === "AUTHENTICATION" && (react_1["default"].createElement("div", { key: "authentication" },
                                react_1["default"].createElement("p", { style: { marginBottom: '3px' } }, "Variable Cuerpo {{1}}"),
                                react_1["default"].createElement(components_1.FieldSelectDisabled, { variant: "outlined", uset: true, className: "col-12", data: availableData.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: { key: selectedAuthVariable, value: selectedAuthVariable }, onChange: function (selectedOption) { return handleVariableChange('authentication', selectedOption, 'authentication'); }, getOptionDisabled: function (option) { return option.key === 'No quedan más variables'; } }))),
                            bodyVariables.map(function (variable, index) {
                                var valueDefault = selectedHeaders["body-" + (index + 1)]
                                    ? { key: selectedHeaders["body-" + (index + 1)], value: selectedHeaders["body-" + (index + 1)] }
                                    : undefined;
                                return (react_1["default"].createElement("div", { key: "body-" + (index + 1) },
                                    react_1["default"].createElement("p", { style: { marginBottom: '3px' } }, "Variable Cuerpo {{" + variable.variable + "}}"),
                                    react_1["default"].createElement(components_1.FieldSelectDisabled, { variant: "outlined", uset: true, className: "col-12", data: availableData.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: valueDefault, onChange: function (selectedOption) { return handleVariableChange(index + 1, selectedOption, 'body'); }, getOptionDisabled: function (option) { return option.key === 'No quedan más variables'; } })));
                            })))),
                        react_1["default"].createElement("div", { style: { marginTop: '1rem' } }, (_j = templateToUse.carouseldata) === null || _j === void 0 ? void 0 : _j.map(function (item, index) {
                            var _a, _b;
                            var hasDynamicButton = item.buttons.some(function (button) { return button.btn.type === 'dynamic'; });
                            return (react_1["default"].createElement("div", { key: "card-" + index, style: { marginBottom: '20px', border: '1px solid #ddd', padding: '10px', borderRadius: '5px' } },
                                react_1["default"].createElement("div", { style: { fontSize: '1.2rem', fontWeight: 'bolder' } }, "Card " + (index + 1)),
                                react_1["default"].createElement("div", { className: classes.containerStyle }, item.header && (row && !detectionChangeSource ? ((function () {
                                    var _a;
                                    var cardImageFields = ((_a = multiData[4].data[0].fields) === null || _a === void 0 ? void 0 : _a.campaignvariables) || {};
                                    var cardImageField = Object.values(cardImageFields).find(function (field) { return field.type === 'cardImage' && parseInt(field.index, 10) === index + 1; });
                                    var valueDefault;
                                    if (cardImageField) {
                                        valueDefault = cardImageField.column ? (cardImageField.column === 'default' ? 'Default ' : cardImageField.column) : 'Default ';
                                    }
                                    else {
                                        valueDefault = 'Default ';
                                    }
                                    var recentSelection = variableSelections["cardImage-" + (index + 1)];
                                    if (recentSelection) {
                                        valueDefault = recentSelection;
                                    }
                                    else {
                                        var selectedKey = Object.keys(allVariables).find(function (key) { return allVariables[key].column === valueDefault; });
                                        if (selectedKey) {
                                            valueDefault = allVariables[selectedKey].column;
                                        }
                                    }
                                    var allOptions = __spreadArrays(new Set(__spreadArrays(availableOptions, matchingUnavailableValues.map(function (item) { return item.column; }), ['Default '])));
                                    return (react_1["default"].createElement("div", { key: "cardImage-" + index },
                                        react_1["default"].createElement("p", { style: { marginBottom: '3px' } }, "Card Imagen"),
                                        react_1["default"].createElement(components_1.FieldSelectDisabled, { variant: "outlined", uset: true, className: "col-12", data: allOptions.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: valueDefault, onChange: function (selectedOption) {
                                                handleVariableChange((index + 1).toString(), selectedOption, 'cardImage', index);
                                                setVariableSelections(function (prev) {
                                                    var _a;
                                                    return (__assign(__assign({}, prev), (_a = {}, _a["cardImage-" + (index + 1)] = selectedOption.key, _a)));
                                                });
                                            }, getOptionDisabled: function (option) { return option.key === 'No quedan más variables'; } })));
                                })()) : (react_1["default"].createElement("div", null,
                                    react_1["default"].createElement("p", { style: { marginBottom: '3px' } }, "Card Imagen"),
                                    react_1["default"].createElement(components_1.FieldSelectDisabled, { variant: "outlined", uset: true, className: "col-12", data: __spreadArrays([{ key: 'default', value: 'Default ' }], availableData.map(function (header) { return ({ key: header, value: header }); })), optionDesc: "value", optionValue: "key", valueDefault: getValueDefault('cardImage', (index + 1).toString()), onChange: function (selectedOption) { return handleVariableChange((index + 1).toString(), selectedOption, 'cardImage'); }, getOptionDisabled: function (option) { return option.key === 'No quedan más variables'; } }))))),
                                react_1["default"].createElement("div", { className: classes.containerStyle }, row && !detectionChangeSource ? ((_a = variablesCarouselBubbleView[index]) === null || _a === void 0 ? void 0 : _a.map(function (variable, variableIndex) {
                                    var fieldsInBody = extractFieldKeysFromTemplate(currentTemplate.carouseldata[index].body);
                                    var fieldKey = fieldsInBody[variableIndex];
                                    var valueDefault;
                                    var selectedOption = variableSelections["carousel-" + index + "-bubble-" + (variableIndex + 1)];
                                    if (selectedOption) {
                                        valueDefault = selectedOption;
                                    }
                                    else {
                                        if (fieldKey) {
                                            var matchingField = matchingUnavailableValues.find(function (item) { return item.field === fieldKey; });
                                            if (matchingField) {
                                                valueDefault = matchingField.column ? matchingField.column : undefined;
                                            }
                                            else {
                                                var allVariables_9 = multiData[4].data[0].fields.allVariables;
                                                var selectedField = Object.keys(allVariables_9).find(function (key) { return allVariables_9[key].column === fieldKey; });
                                                if (selectedField) {
                                                    valueDefault = allVariables_9[selectedField].column;
                                                }
                                                else {
                                                    var fieldIndex = parseInt(fieldKey.replace('field', ''), 10) - 2;
                                                    var valor = templateData.fields.columns[fieldIndex];
                                                    valueDefault = valor ? valor : undefined;
                                                }
                                            }
                                        }
                                        else {
                                            valueDefault = undefined;
                                        }
                                    }
                                    var allOptions = __spreadArrays(new Set(__spreadArrays(availableOptions, matchingUnavailableValues.map(function (item) { return item.column; }))));
                                    return (react_1["default"].createElement("div", { key: "carousel-" + index + "-bubble-" + variableIndex },
                                        react_1["default"].createElement("p", { style: { marginBottom: '3px' } }, "Variable Burbuja {{" + (variableIndex + 1) + "}}"),
                                        react_1["default"].createElement(components_1.FieldSelectDisabled, { variant: "outlined", uset: true, className: "col-12", data: allOptions.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: valueDefault, onChange: function (selectedOption) {
                                                handleVariableChange((variableIndex + 1).toString(), selectedOption, 'carousel', index);
                                                setVariableSelections(function (prev) {
                                                    var _a;
                                                    return (__assign(__assign({}, prev), (_a = {}, _a["carousel-" + index + "-bubble-" + (variableIndex + 1)] = selectedOption.key, _a)));
                                                });
                                            }, getOptionDisabled: function (option) { return option.key === 'No quedan más variables'; } })));
                                })) : (item.body && ((_b = item.body.match(/{{\d+}}/g)) === null || _b === void 0 ? void 0 : _b.map(function (match, variableIndex) { return (react_1["default"].createElement("div", { key: "carousel-" + index + "-bubble-" + variableIndex },
                                    react_1["default"].createElement("p", { style: { marginBottom: '3px' } }, "Variable Burbuja {{" + (variableIndex + 1) + "}}"),
                                    react_1["default"].createElement(components_1.FieldSelectDisabled, { variant: "outlined", uset: true, className: "col-12", data: availableData.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: getValueDefault('carousel', (variableIndex + 1).toString(), index), onChange: function (selectedOption) { return handleVariableChange((variableIndex + 1).toString(), selectedOption, 'carousel', index); }, getOptionDisabled: function (option) { return option.key === 'No quedan más variables'; } }))); })))),
                                hasDynamicButton && (react_1["default"].createElement("div", { className: classes.containerStyle }, renderDynamicUrlFields(index, row, [])))));
                        })),
                        ((_k = templateToUse.buttonsgeneric) === null || _k === void 0 ? void 0 : _k.some(function (button) { return button.btn.type === 'dynamic'; })) && (react_1["default"].createElement("div", { className: classes.containerStyle }, renderDynamicUrlFields(null, row, ((_l = templateToUse.buttonsgeneric) === null || _l === void 0 ? void 0 : _l.filter(function (button) { return button.btn.type === 'dynamic'; })) || [])))),
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
                        react_1["default"].createElement("div", { className: classes.containerStyle }, row && !detectionChangeSource ? (react_1["default"].createElement(react_1["default"].Fragment, null, variablesAdditionalView.map(function (variable, index) {
                            var _a;
                            var cleanVariable = variable.replace(/"/g, '');
                            var valueDefault;
                            if (cleanVariable) {
                                var matchingField = matchingUnavailableValues.find(function (item) { return item.field === cleanVariable; });
                                if (matchingField) {
                                    valueDefault = matchingField.column ? matchingField.column : undefined;
                                }
                                else {
                                    var allVariables_10 = ((_a = multiData[4].data[0].fields) === null || _a === void 0 ? void 0 : _a.allVariables) || {};
                                    var allVariablesField = allVariables_10[cleanVariable];
                                    if (allVariablesField) {
                                        valueDefault = allVariablesField.column ? allVariablesField.column : undefined;
                                    }
                                    else {
                                        var fieldIndex = parseInt(cleanVariable.replace('field', ''), 10) - 2;
                                        var valor = templateData.fields.columns[fieldIndex];
                                        valueDefault = valor ? valor : undefined;
                                    }
                                }
                            }
                            else {
                                valueDefault = undefined;
                            }
                            var allOptions = __spreadArrays(new Set(__spreadArrays(availableOptions, matchingUnavailableValues.map(function (item) { return item.column; }))));
                            return (react_1["default"].createElement("div", { style: { flex: 1 }, key: "additional-" + (index + 1) },
                                react_1["default"].createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 5 } },
                                    react_1["default"].createElement("p", null, "Variable Adicional {{" + (index + 1) + "}}"),
                                    react_1["default"].createElement(Delete_1["default"], { style: { cursor: 'pointer', color: 'grey' }, onClick: function () { return handleRemoveVariable(index); } })),
                                react_1["default"].createElement("div", { style: { flex: 1 } },
                                    react_1["default"].createElement(components_1.FieldSelectDisabled, { variant: "outlined", uset: true, className: "col-12", data: checkTypeInMultiData()
                                            ? allOptions.map(function (header) { return ({ key: header, value: header }); })
                                            : dataToUse.map(function (header) { return ({ key: header, value: header }); }), optionDesc: "value", optionValue: "key", valueDefault: valueDefault, onChange: function (selectedOption) {
                                            handleVariableChange((index + 1).toString(), selectedOption, 'additional');
                                            setVariableSelections(function (prev) {
                                                var _a;
                                                var newSelections = __assign(__assign({}, prev), (_a = {}, _a["additional-" + (index + 1)] = selectedOption.key, _a));
                                                return newSelections;
                                            });
                                        }, getOptionDisabled: function (option) { return option.key === 'No quedan más variables'; } }))));
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
                    react_1["default"].createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' } }, row && !detectionChangeSource ? (variablesAdditionalView.map(function (variable, index) {
                        var _a;
                        var cleanVariable = variable.replace(/"/g, '');
                        var fieldNumber = parseInt(cleanVariable.replace("field", ""), 10) - 2;
                        var valueDefault;
                        if (cleanVariable) {
                            var matchingField = matchingUnavailableValues.find(function (item) { return item.field === cleanVariable; });
                            if (matchingField) {
                                valueDefault = matchingField.value ? matchingField.value : undefined;
                            }
                            else {
                                var allVariables_11 = ((_a = multiData[4].data[0].fields) === null || _a === void 0 ? void 0 : _a.allVariables) || {};
                                var allVariablesField = allVariables_11[cleanVariable];
                                if (allVariablesField) {
                                    valueDefault = allVariablesField.value ? allVariablesField.value : undefined;
                                }
                                else {
                                    var valor = templateData.fields.columns[fieldNumber];
                                    valueDefault = valor ? valor : undefined;
                                }
                            }
                        }
                        else {
                            valueDefault = undefined;
                        }
                        return (react_1["default"].createElement("div", { style: { flex: '1 1 calc(25% - 20px)', boxSizing: 'border-box' }, key: "additional-" + (index + 1) },
                            react_1["default"].createElement("p", null, "Variable Adicional {{" + (index + 1) + "}}"),
                            react_1["default"].createElement("div", { style: { flex: 1 } },
                                react_1["default"].createElement(components_1.FieldEdit, { variant: "outlined", uset: true, className: "col-12", valueDefault: valueDefault || 'Sin valor', disabled: true }))));
                    })) : (additionalVariables.map(function (variable, index) { return (react_1["default"].createElement("div", { style: { flex: '1 1 calc(25% - 20px)', boxSizing: 'border-box' }, key: index },
                        react_1["default"].createElement("p", null, "Variable " + variable),
                        react_1["default"].createElement("div", { style: { flex: 1 } },
                            react_1["default"].createElement(components_1.FieldEdit, { variant: "outlined", uset: true, className: "col-12", valueDefault: additionalVariableValues[variable] || 'Sin valor', disabled: true })))); }))))))));
};
