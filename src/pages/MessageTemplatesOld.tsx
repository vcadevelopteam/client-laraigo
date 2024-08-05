import { addTemplate, deleteTemplate, synchronizeTemplate } from "store/channel/actions";
import { Box, CircularProgress, IconButton, Paper, Tabs, Tooltip } from "@material-ui/core";
import { Close, Delete, FileCopy, GetApp, Search } from "@material-ui/icons";
import { Descendant } from "slate";
import { Dictionary, IFetchData, MultiData } from "@types";
import { langKeys } from "lang/keys";
import { makeStyles } from "@material-ui/core/styles";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { RichText, renderToString, toElement } from "components/fields/RichText";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";
import { useSelector } from "hooks";
import { Trans, useTranslation } from "react-i18next";

import {
    execute,
    exportData,
    getCollectionAux2,
    getCollectionPaginated,
    getMultiCollection,
    resetAllMain,
    resetCollectionPaginated,
    uploadFile,
} from "store/main/actions";

import {
    AntTab,
    FieldEdit,
    FieldEditMulti,
    FieldSelect,
    FieldView,
    TemplateBreadcrumbs,
    TemplateIcons,
    TitleDetail,
} from "components";

import {
    dateToLocalDate,
    getCustomVariableSelByTableName,
    getDomainByDomainNameList,
    getMessageTemplateExport,
    getPaginatedMessageTemplateOld,
    getValuesFromDomain,
    insMessageTemplateOld,
    richTextToString,
    selCommunicationChannelWhatsApp,
} from "common/helpers";

import AddIcon from "@material-ui/icons/Add";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import Button from "@material-ui/core/Button";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import MenuItem from "@material-ui/core/MenuItem";
import React, { FC, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import RefreshIcon from "@material-ui/icons/Refresh";
import RemoveIcon from "@material-ui/icons/Remove";
import SaveIcon from "@material-ui/icons/Save";
import TablePaginated, { useQueryParams } from "components/fields/table-paginated";
import { CellProps } from "react-table";
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import CustomTableZyxEditable from "components/fields/customtable-editable";

const CodeMirror = React.lazy(() => import("@uiw/react-codemirror"));

interface RowSelected {
    edit: boolean;
    row: Dictionary | null;
}

interface DetailProps {
    data: RowSelected;
    fetchData: () => void;
    multiData: MultiData[];
    setViewSelected: (view: string) => void;
}

const arrayBread = (view1: string, view2: string) => [
    { id: "view-1", name: view1 },
    { id: "view-2", name: view2 },
];

const useStyles = makeStyles((theme) => ({
    btnButton: {
        flexBasis: 0,
        flexGrow: 0,
        minHeight: "30px",
        minWidth: "max-content",
    },
    button: {
        fontSize: "14px",
        fontWeight: 500,
        padding: 12,
        textTransform: "initial",
    },
    buttonTitle: {
        marginRight: "0.25rem",
        width: "auto",
    },
    containerDetail: {
        background: "#fff",
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
    },
    headerText: {
        flexBasis: "200px",
        flexGrow: 1,
    },
    headerType: {
        flexBasis: "130px",
        flexGrow: 0,
        marginRight: "10px",
    },
    mb1: {
        marginBottom: "0.25rem",
    },
    mediabutton: {
        flexBasis: 0,
        flexGrow: 1,
        margin: theme.spacing(1),
        minHeight: "30px",
        opacity: 0.8,
        padding: 0,
        "&:hover": {
            opacity: 1,
        },
    },
    iconHelpText: {
        width: 15,
        height: 15,
        cursor: 'pointer',
    }
}));

const MessageTemplatesOld: FC = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const location = useLocation();
    const mainDelete = useSelector((state) => state.channel.requestDeleteTemplate);
    const mainPaginated = useSelector((state) => state.main.mainPaginated);
    const mainResult = useSelector((state) => state.main);
    const mainSynchronize = useSelector((state) => state.channel.requestSynchronizeTemplate);
    const query = useMemo(() => new URLSearchParams(location.search), [location]);
    const params = useQueryParams(query, { ignore: ["channelTypes"] });
    const resExportData = useSelector((state) => state.main.exportData);
    const selectionKey = "id";

    const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({
        daterange: null,
        filters: {},
        pageIndex: 0,
        pageSize: 20,
        sorts: {},
    });

    const [rowSelected, setRowSelected] = useState<RowSelected>({
        edit: false,
        row: null,
    });

    const [communicationChannel, setCommunicationChannel] = useState<any>(null);
    const [communicationChannelList, setCommunicationChannelList] = useState<Dictionary[]>([]);
    const [pageCount, setPageCount] = useState(0);
    const [rowWithDataSelected, setRowWithDataSelected] = useState<Dictionary[]>([]);
    const [selectedRows, setSelectedRows] = useState<any>({});
    const [showId, setShowId] = useState(false);
    const [totalRow, setTotalRow] = useState(0);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitDelete, setWaitDelete] = useState(false);
    const [waitSaveExport, setWaitSaveExport] = useState(false);
    const [waitSynchronize, setWaitSynchronize] = useState(false);

    const columns = React.useMemo(
        () => [
            {
                accessor: "templateid",
                isComponent: true,
                minWidth: 60,
                NoFilter: true,
                width: "1%",
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                            viewFunction={() => handleView(row)}
                        />
                    );
                },
            },
            {
                accessor: "createdate",
                Header: t(langKeys.creationdate),
                NoFilter: true,
                Cell: (props: CellProps<Dictionary>) => {
                    const { row } = props.cell;
                    if (!row || !row.original || !row.original.createdate) {
                        return null;
                    }
                    return <div>{dateToLocalDate(row.original.createdate)}</div>;
                },
            },
            ...(showId
                ? [
                    {
                        accessor: "id",
                        Header: t(langKeys.messagetemplateid),
                        type: "number",
                        Cell: (props: CellProps<Dictionary>) => {
                            const { row } = props.cell;
                            return showId ? <div>{row.id}</div> : null;
                        }
                    },
                ]
                : []),
            {
                accessor: "type",
                Header: t(langKeys.type),
                prefixTranslation: "messagetemplate_",
            },
            {
                accessor: "name",
                Header: t(langKeys.name),
            },
            {
                accessor: "category",
                Header: t(langKeys.category),
                Cell: (props: CellProps<Dictionary>) => {
                    const { row } = props.cell;
                    const { category, type } = row?.original || {};
                    if (category && type) {
                        return (type === "HSM" ? t(`TEMPLATE_${category}`) : category).toUpperCase();
                    } else {
                        return '';
                    }
                }

            },
            {
                accessor: "language",
                Header: t(langKeys.language),
                Cell: (props: CellProps<Dictionary>) => {
                    const { row } = props.cell;
                    const { language } = row?.original || {};
                    return language.toUpperCase();
                }
            },
            {
                accessor: "templatetype",
                Header: t(langKeys.templatetype),
                prefixTranslation: "messagetemplate_",
            },
            {
                accessor: "body",
                Header: t(langKeys.body),
                Cell: (props: CellProps<Dictionary>) => {
                    const { row } = props.cell;
                    const body = row?.original?.body;

                    return body && body.length > 40 ? `${body.substring(0, 40)}...` : body || '';
                }


            },
        ],
        [showId]
    );

    useEffect(() => {
        dispatch(resetCollectionPaginated());
        fetchData(fetchDataAux);

        dispatch(
            getMultiCollection([
                getValuesFromDomain("MESSAGETEMPLATECATEGORY"),
                getValuesFromDomain("LANGUAGE"),
                selCommunicationChannelWhatsApp(),
                getCustomVariableSelByTableName("messagetemplate")
            ])
        );

        return () => {
            dispatch(resetCollectionPaginated());
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (!mainResult.multiData.loading && !mainResult.multiData.error && mainResult.multiData.data?.[3]) {
            dispatch(getCollectionAux2(getDomainByDomainNameList(mainResult.multiData?.data?.[3]?.data.filter(item => item.domainname !== "").map(item => item.domainname).join(","))));
        }
    }, [mainResult.multiData]);

    const fetchData = ({ pageSize, pageIndex, filters, sorts, daterange }: IFetchData) => {
        setfetchDataAux({ ...fetchDataAux, ...{ pageSize, pageIndex, filters, sorts } });
        dispatch(
            getCollectionPaginated(
                getPaginatedMessageTemplateOld({
                    communicationchannelid: communicationChannel?.communicationchannelid || 0,
                    enddate: daterange?.endDate!,
                    filters: filters,
                    skip: pageIndex * pageSize,
                    sorts: sorts,
                    startdate: daterange?.startDate!,
                    take: pageSize,
                })
            )
        );
    };

    useEffect(() => {
        if (!mainPaginated.loading && !mainPaginated.error) {
            setPageCount(Math.ceil(mainPaginated.count / fetchDataAux.pageSize));
            setTotalRow(mainPaginated.count);
        }
    }, [mainPaginated]);

    useEffect(() => {
        if (waitSaveExport) {
            if (!resExportData.loading && !resExportData.error) {
                resExportData.url?.split(",").forEach((x) => window.open(x, "_blank"));
                dispatch(showBackdrop(false));
                setWaitSaveExport(false);
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code ?? "error_unexpected_error", {
                    module: t(langKeys.property).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSaveExport(false);
            }
        }
    }, [resExportData, waitSaveExport]);

    useEffect(() => {
        if (!(Object.keys(selectedRows).length === 0 && rowWithDataSelected.length === 0)) {
            setRowWithDataSelected((p) =>
                Object.keys(selectedRows).map(
                    (x) =>
                        mainPaginated?.data.find((y) => y.id === parseInt(x)) ??
                        p.find((y) => y.id === parseInt(x)) ??
                        {}
                )
            );
        }
    }, [selectedRows]);

    useEffect(() => {
        if (waitDelete) {
            if (!mainDelete.loading && !mainDelete.error) {
                dispatch(
                    showSnackbar({
                        message: t(langKeys.successful_delete),
                        severity: "success",
                        show: true,
                    })
                );
                dispatch(showBackdrop(false));
                setWaitDelete(false);
                fetchData(fetchDataAux);
            } else if (mainDelete.error) {
                dispatch(
                    showSnackbar({
                        message: t(mainDelete.code ?? "error_unexpected_error", {
                            module: t(langKeys.messagetemplate).toLocaleLowerCase(),
                        }),
                        severity: "error",
                        show: true,
                    })
                );
                dispatch(showBackdrop(false));
                setWaitDelete(false);
            }
        }
    }, [mainDelete, waitDelete]);

    useEffect(() => {
        if (waitSynchronize) {
            if (!mainSynchronize.loading && !mainSynchronize.error) {
                dispatch(
                    showSnackbar({
                        message: t(mainSynchronize.code ?? "success"),
                        severity: "success",
                        show: true,
                    })
                );
                dispatch(showBackdrop(false));
                setWaitSynchronize(false);
                fetchData(fetchDataAux);
            } else if (mainSynchronize.error) {
                dispatch(
                    showSnackbar({
                        message: t(mainSynchronize.code ?? "error_unexpected_error"),
                        severity: "error",
                        show: true,
                    })
                );
                dispatch(showBackdrop(false));
                setWaitSynchronize(false);
                fetchData(fetchDataAux);
            }
        }
    }, [mainSynchronize, waitSynchronize]);

    useEffect(() => {
        if (mainPaginated.data.length > 0) {
            setShowId(mainPaginated.data[0]?.showid);
        }
    }, [mainPaginated.data]);

    useEffect(() => {
        if (mainResult.multiData.data.length > 0) {
            if (mainResult.multiData.data[2] && mainResult.multiData.data[2].success) {
                setCommunicationChannelList(mainResult.multiData.data[2].data || []);
            }
        }
    }, [mainResult.multiData.data]);

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    };

    const handleView = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: false });
    };

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    };

    const handleSynchronize = (channel: any, selectedData: any) => {
        const callback = () => {
            dispatch(synchronizeTemplate({ communicationchannel: channel, messagetemplatelist: selectedData }));
            dispatch(showBackdrop(true));
            setWaitSynchronize(true);
        };

        dispatch(
            manageConfirmation({
                callback,
                question: channel
                    ? t(langKeys.messagetemplate_synchronize_alert01) +
                    `${channel.communicationchanneldesc} (${channel.phone})` +
                    t(langKeys.messagetemplate_synchronize_alert02)
                    : t(langKeys.messagetemplate_synchronize_alert03),
                visible: true,
            })
        );
    };

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(
                deleteTemplate({
                    messagetemplatelist: [
                        {
                            ...row,
                            id: row.id,
                            operation: "DELETE",
                            status: "ELIMINADO",
                        },
                    ],
                })
            );
            dispatch(showBackdrop(true));
            setWaitDelete(true);
        };

        dispatch(
            manageConfirmation({
                callback,
                question: t(langKeys.confirmation_delete),
                visible: true,
            })
        );
    };

    const handleBulkDelete = (dataSelected: Dictionary[]) => {
        const callback = () => {
            dispatch(
                deleteTemplate({
                    messagetemplatelist: dataSelected.reduce((ad: any[], d: any) => {
                        ad.push({ ...d, operation: "DELETE", status: "ELIMINADO" });
                        return ad;
                    }, []),
                })
            );
            dispatch(showBackdrop(true));
            setWaitDelete(true);
        };

        dispatch(
            manageConfirmation({
                callback,
                question: t(langKeys.confirmation_delete),
                visible: true,
            })
        );
    };

    const triggerExportData = ({ filters, sorts, daterange }: IFetchData) => {
        const columnsExport = columns
            .filter((x) => !x.isComponent)
            .map((x) => ({
                key: x.accessor,
                alias: x.Header,
            }));
        dispatch(
            exportData(
                getMessageTemplateExport({
                    communicationchannelid: communicationChannel?.communicationchannelid || 0,
                    filters: {
                        ...filters,
                    },
                    sorts,
                }),
                "",
                "excel",
                false,
                columnsExport
            )
        );
        dispatch(showBackdrop(true));
        setWaitSaveExport(true);
    };



    if (viewSelected === "view-1") {
        if (mainPaginated.error) {
            return <h1>ERROR</h1>;
        }
        return (
            <TablePaginated
                ButtonsElement={() => (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <Button
                            color="primary"
                            disabled={mainPaginated.loading || Object.keys(selectedRows).length === 0}
                            startIcon={<Delete style={{ color: "white" }} />}
                            variant="contained"
                            onClick={() => {
                                handleBulkDelete(rowWithDataSelected);
                            }}
                        >
                            {t(langKeys.delete)}
                        </Button>
                        <Button
                            color="primary"
                            disabled={mainPaginated.loading}
                            startIcon={<Search style={{ color: "white" }} />}
                            style={{ width: 120, backgroundColor: "#55BD84" }}
                            variant="contained"
                            onClick={() => {
                                fetchData(fetchDataAux);
                            }}
                        >
                            {t(langKeys.search)}
                        </Button>
                        <FieldSelect
                            data={communicationChannelList}
                            label={t(langKeys.communicationchanneldesc)}
                            optionDesc="communicationchanneldesc"
                            optionValue="communicationchannelid"
                            style={{ width: 300 }}
                            valueDefault={communicationChannel?.communicationchannelid}
                            variant="outlined"
                            onChange={(value) => {
                                setCommunicationChannel(value);
                            }}
                        />
                    </div>
                )}
                autotrigger={true}
                columns={columns}
                data={mainPaginated.data}
                download={true}
                exportPersonalized={triggerExportData}
                fetchData={fetchData}
                filterGeneral={true}
                handleRegister={handleRegister}
                initialFilters={params.filters}
                initialPageIndex={params.page}
                loading={mainPaginated.loading}
                onClickRow={handleEdit}
                pageCount={pageCount}
                register={true}
                selectionKey={selectionKey}
                setSelectedRows={setSelectedRows}
                titlemodule={t(langKeys.messagetemplate_plural)}
                totalrow={totalRow}
                useSelection={true}
            />
        );
    } else
        return (
            <DetailMessageTemplates
                data={rowSelected}
                fetchData={() => fetchData(fetchDataAux)}
                multiData={mainResult.multiData.data}
                setViewSelected={setViewSelected}
            />
        );
};

const DetailMessageTemplates: React.FC<DetailProps> = ({
    data: { row, edit },
    fetchData,
    multiData,
    setViewSelected,
}) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const addRequest = useSelector((state) => state.channel.requestAddTemplate);
    const classes = useStyles();
    const dataCategory = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataLanguage = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const domainsCustomTable = useSelector((state) => state.main.mainAux2);
    const executeRes = useSelector((state) => state.main.execute);
    const uploadResult = useSelector((state) => state.main.uploadFile);
    const [skipAutoReset, setSkipAutoReset] = useState(false)
    const [updatingDataTable, setUpdatingDataTable] = useState(false);
    const [tableDataVariables, setTableDataVariables] = useState<Dictionary[]>([]);

    const updateCell = (rowIndex: number, columnId: string, value: string) => {
        setSkipAutoReset(true);
        const auxTableData = tableDataVariables
        auxTableData[rowIndex][columnId] = value
        setTableDataVariables(auxTableData)
        setUpdatingDataTable(!updatingDataTable);
    }


    const dataChannel =
        multiData[2] && multiData[2].success
            ? multiData[2].data.filter((x) => x.type !== "WHAG" && x.type !== "WHAM")
            : [];

    const [bodyAlert, setBodyAlert] = useState("");
    const [bodyAttachment, setBodyAttachment] = useState(row?.body || "");
    const [disableInput, setDisableInput] = useState(false);
    const [disableNamespace, setDisableNamespace] = useState(false);
    const [fileAttachment, setFileAttachment] = useState<File | null>(null);
    const [fileAttachmentTemplate, setFileAttachmentTemplate] = useState<File | null>(null);
    const [htmlEdit, setHtmlEdit] = useState(false);
    const [htmlLoad, setHtmlLoad] = useState<any>(undefined);
    const [isNew] = useState(row?.id ? false : true);
    const [isProvider, setIsProvider] = useState(row?.fromprovider ? true : false);
    const [waitAdd, setWaitAdd] = useState(false);
    const [waitSave, setWaitSave] = useState(false);
    const [waitUploadFile, setWaitUploadFile] = useState(false);
    const [pageSelected, setPageSelected] = useState(0);
    useEffect(() => {
        if (multiData[3]) {
            const variableDataList = multiData[3].data || []
            setTableDataVariables(variableDataList.map(x => ({ ...x, value: row?.variablecontext?.[x.variablename] || "" })))
        }
    }, [multiData]);

    const [bodyObject, setBodyObject] = useState<Descendant[]>(
        row?.bodyobject || [{ type: "paragraph", children: [{ text: row?.body || "" }] }]
    );

    const dataNewCategory = [
        { value: "AUTHENTICATION", description: t(langKeys.TEMPLATE_AUTHENTICATION) },
        { value: "MARKETING", description: t(langKeys.TEMPLATE_MARKETING) },
        { value: "UTILITY", description: t(langKeys.TEMPLATE_UTILITY) },
    ];

    const dataExternalStatus = [
        { value: "APPROVED", description: t(langKeys.TEMPLATE_APPROVED) },
        { value: "DELETED", description: t(langKeys.TEMPLATE_DELETED) },
        { value: "DISABLED", description: t(langKeys.TEMPLATE_DISABLED) },
        { value: "IN_APPEAL", description: t(langKeys.TEMPLATE_IN_APPEAL) },
        { value: "LOCKED", description: t(langKeys.TEMPLATE_LOCKED) },
        { value: "NONE", description: (t(langKeys.NONE) || "").toUpperCase() },
        { value: "PAUSED", description: t(langKeys.TEMPLATE_PAUSED) },
        { value: "PENDING", description: t(langKeys.TEMPLATE_PENDING) },
        { value: "PENDING_DELETION", description: t(langKeys.TEMPLATE_PENDING_DELETION) },
        { value: "REJECTED", description: t(langKeys.TEMPLATE_REJECTED) },
        { value: "SUBMITTED", description: t(langKeys.TEMPLATE_SUBMITTED) },
    ];

    const dataExternalLanguage = [
        { description: t(langKeys.TEMPLATE_AF), value: "AF" },
        { description: t(langKeys.TEMPLATE_AR), value: "AR" },
        { description: t(langKeys.TEMPLATE_AZ), value: "AZ" },
        { description: t(langKeys.TEMPLATE_BG), value: "BG" },
        { description: t(langKeys.TEMPLATE_BN), value: "BN" },
        { description: t(langKeys.TEMPLATE_CA), value: "CA" },
        { description: t(langKeys.TEMPLATE_CS), value: "CS" },
        { description: t(langKeys.TEMPLATE_DA), value: "DA" },
        { description: t(langKeys.TEMPLATE_DE), value: "DE" },
        { description: t(langKeys.TEMPLATE_EL), value: "EL" },
        { description: t(langKeys.TEMPLATE_EN), value: "EN" },
        { description: t(langKeys.TEMPLATE_EN_GB), value: "EN_GB" },
        { description: t(langKeys.TEMPLATE_EN_US), value: "EN_US" },
        { description: t(langKeys.TEMPLATE_ES), value: "ES" },
        { description: t(langKeys.TEMPLATE_ES_AR), value: "ES_AR" },
        { description: t(langKeys.TEMPLATE_ES_ES), value: "ES_ES" },
        { description: t(langKeys.TEMPLATE_ES_MX), value: "ES_MX" },
        { description: t(langKeys.TEMPLATE_ET), value: "ET" },
        { description: t(langKeys.TEMPLATE_FA), value: "FA" },
        { description: t(langKeys.TEMPLATE_FI), value: "FI" },
        { description: t(langKeys.TEMPLATE_FIL), value: "FIL" },
        { description: t(langKeys.TEMPLATE_FR), value: "FR" },
        { description: t(langKeys.TEMPLATE_GA), value: "GA" },
        { description: t(langKeys.TEMPLATE_GU), value: "GU" },
        { description: t(langKeys.TEMPLATE_HA), value: "HA" },
        { description: t(langKeys.TEMPLATE_HE), value: "HE" },
        { description: t(langKeys.TEMPLATE_HI), value: "HI" },
        { description: t(langKeys.TEMPLATE_HR), value: "HR" },
        { description: t(langKeys.TEMPLATE_HU), value: "HU" },
        { description: t(langKeys.TEMPLATE_ID), value: "ID" },
        { description: t(langKeys.TEMPLATE_IT), value: "IT" },
        { description: t(langKeys.TEMPLATE_JA), value: "JA" },
        { description: t(langKeys.TEMPLATE_KA), value: "KA" },
        { description: t(langKeys.TEMPLATE_KK), value: "KK" },
        { description: t(langKeys.TEMPLATE_KN), value: "KN" },
        { description: t(langKeys.TEMPLATE_KO), value: "KO" },
        { description: t(langKeys.TEMPLATE_KY_KG), value: "KY_KG" },
        { description: t(langKeys.TEMPLATE_LO), value: "LO" },
        { description: t(langKeys.TEMPLATE_LT), value: "LT" },
        { description: t(langKeys.TEMPLATE_LV), value: "LV" },
        { description: t(langKeys.TEMPLATE_MK), value: "MK" },
        { description: t(langKeys.TEMPLATE_ML), value: "ML" },
        { description: t(langKeys.TEMPLATE_MR), value: "MR" },
        { description: t(langKeys.TEMPLATE_MS), value: "MS" },
        { description: t(langKeys.TEMPLATE_NB), value: "NB" },
        { description: t(langKeys.TEMPLATE_NL), value: "NL" },
        { description: t(langKeys.TEMPLATE_PA), value: "PA" },
        { description: t(langKeys.TEMPLATE_PL), value: "PL" },
        { description: t(langKeys.TEMPLATE_PT_BR), value: "PT_BR" },
        { description: t(langKeys.TEMPLATE_PT_PT), value: "PT_PT" },
        { description: t(langKeys.TEMPLATE_RO), value: "RO" },
        { description: t(langKeys.TEMPLATE_RU), value: "RU" },
        { description: t(langKeys.TEMPLATE_RW_RW), value: "RW_RW" },
        { description: t(langKeys.TEMPLATE_SK), value: "SK" },
        { description: t(langKeys.TEMPLATE_SL), value: "SL" },
        { description: t(langKeys.TEMPLATE_SQ), value: "SQ" },
        { description: t(langKeys.TEMPLATE_SR), value: "SR" },
        { description: t(langKeys.TEMPLATE_SV), value: "SV" },
        { description: t(langKeys.TEMPLATE_SW), value: "SW" },
        { description: t(langKeys.TEMPLATE_TA), value: "TA" },
        { description: t(langKeys.TEMPLATE_TE), value: "TE" },
        { description: t(langKeys.TEMPLATE_TH), value: "TH" },
        { description: t(langKeys.TEMPLATE_TR), value: "TR" },
        { description: t(langKeys.TEMPLATE_UK), value: "UK" },
        { description: t(langKeys.TEMPLATE_UR), value: "UR" },
        { description: t(langKeys.TEMPLATE_UZ), value: "UZ" },
        { description: t(langKeys.TEMPLATE_VI), value: "VI" },
        { description: t(langKeys.TEMPLATE_ZH_CN), value: "ZH_CN" },
        { description: t(langKeys.TEMPLATE_ZH_HK), value: "ZH_HK" },
        { description: t(langKeys.TEMPLATE_ZH_TW), value: "ZH_TW" },
        { description: t(langKeys.TEMPLATE_ZU), value: "ZU" },
    ];

    const dataMessageType = [
        { value: "HSM", text: t(langKeys.messagetemplate_hsm) },
        { value: "HTML", text: t(langKeys.messagetemplate_html) },
        { value: "MAIL", text: t(langKeys.messagetemplate_mail) },
        { value: "SMS", text: t(langKeys.messagetemplate_sms) },
    ];

    const dataTemplateType = [
        { value: "MULTIMEDIA", text: t(langKeys.messagetemplate_multimedia) },
        { value: "STANDARD", text: t(langKeys.messagetemplate_standard) },
    ];

    const dataHeaderType = [
        { value: "document", text: t(langKeys.messagetemplate_document) },
        { value: "image", text: t(langKeys.messagetemplate_image) },
        { value: "text", text: t(langKeys.messagetemplate_text) },
        { value: "video", text: t(langKeys.messagetemplate_video) },
    ];

    const dataButtonType = [
        { value: "phone_number", text: t(langKeys.messagetemplate_phonenumber) },
        { value: "quick_reply", text: t(langKeys.messagetemplate_quickreply) },
        { value: "url", text: t(langKeys.messagetemplate_url) },
    ];

    const dataPriority = [
        { value: 1, text: t(langKeys.messagetemplate_low) },
        { value: 2, text: t(langKeys.messagetemplate_medium) },
        { value: 3, text: t(langKeys.messagetemplate_high) },
    ];

    const {
        formState: { errors },
        getValues,
        handleSubmit,
        register,
        setValue,
        trigger,
        watch,
        unregister,
    } = useForm({
        defaultValues: {
            attachment: row?.attachment || "",
            body: row?.body || "",
            buttons: row ? row.buttons || [] : [],
            buttonsenabled: ![null, undefined].includes(row?.buttonsenabled) ? row?.buttonsenabled : false,
            category: row?.category || "",
            communicationchannelid: row?.communicationchannelid || 0,
            communicationchanneltype: row?.communicationchanneltype || "",
            description: row?.description || "",
            exampleparameters: row?.exampleparameters || "",
            externalid: row?.externalid || "",
            externalstatus: row?.externalstatus || "NONE",
            footer: row?.footer || "",
            footerenabled: ![null, undefined].includes(row?.footerenabled) ? row?.footerenabled : false,
            fromprovider: row?.fromprovider || false,
            header: row?.header || "",
            headerenabled: ![null, undefined].includes(row?.headerenabled) ? row?.headerenabled : false,
            headertype: (row?.headertype || "text").toLowerCase(),
            id: row ? row.id : 0,
            integrationid: row?.communicationchannelintegrationid || "",
            language: row?.language || "",
            name: row?.name || "",
            namespace: row?.namespace || "",
            operation: row ? "EDIT" : "INSERT",
            priority: row?.priority || 2,
            servicecredentials: row?.communicationchannelservicecredentials || "",
            status: row?.status || "ACTIVO",
            templatetype: row?.templatetype || "STANDARD",
            type: row?.type || "HSM",
            typeattachment: row?.typeattachment || "",
        },
    });

    const [templateTypeDisabled, setTemplateTypeDisabled] = useState(["SMS", "MAIL"].includes(getValues("type")));

    const [type] = watch(["type"]);

    React.useEffect(() => {
        register("body");
        register("category");
        register("communicationchannelid");
        register("communicationchanneltype");
        register("exampleparameters");
        register("externalid");
        register("externalstatus");
        register("footer");
        register("fromprovider");
        register("header");
        register("integrationid");
        register("language");
        register("name");
        register("namespace");
        register("servicecredentials");
        register("templatetype");
        register("type");
        register("typeattachment");

        register("body", {
            validate: (value) => {
                if (type === "HSM") return (value && (value || "").length <= 1024) || t(langKeys.field_required);
                if (type === "SMS") return (value && (value || "").length <= 160) || t(langKeys.field_required);
                return true;
            },
        });

        register("namespace", {
            validate: (value) => {
                if (type === "HSM") return (value && value.length) || t(langKeys.field_required);
                return true;
            },
        });

        switch (type) {
            case "HSM":
                // register("body", {
                //     validate: (value) => (value && (value || "").length <= 1024) || "" + t(langKeys.validationchar),
                // });
                register("name", {
                    validate: (value) =>
                        (value && (value || "").match("^[a-z0-9_]+$") !== null) || t(langKeys.nametemplate_validation),
                });
                // register("namespace", {
                //     validate: (value) => (value && value.length) || t(langKeys.field_required),
                // });
                if (getValues("headerenabled")) {
                    register("header", {
                        validate: (value) => (value && value.length) || t(langKeys.field_required),
                    });
                }
                if (getValues("footerenabled")) {
                    register("footer", {
                        validate: (value) => (value && value.length) || t(langKeys.field_required),
                    });
                }
                setTemplateTypeDisabled(false);
                onChangeTemplateMedia();
                break;

            case "MAIL":
            case "HTML":
                register("header", {
                    validate: (value) => (value && value.length) || t(langKeys.field_required),
                });
                register("name", {
                    validate: (value) => (value && value.length) || t(langKeys.field_required),
                });
                onChangeTemplateType({ value: "STANDARD" });
                setTemplateTypeDisabled(true);
                break;

            case "SMS":
                // register("body", {
                //     validate: (value) => (value && value.length <= 160) || "" + t(langKeys.validationchar),
                // });
                register("name", {
                    validate: (value) => (value && value.length) || t(langKeys.field_required),
                });
                onChangeTemplateType({ value: "STANDARD" });
                setTemplateTypeDisabled(true);
                break;
        }

        if (type === "HSM") {
            // register("body", {
            //     validate: (value) => (value && (value || "").length <= 1024) || "" + t(langKeys.validationchar),
            // });

            register("name", {
                validate: (value) =>
                    (value && (value || "").match("^[a-z0-9_]+$") !== null) || t(langKeys.nametemplate_validation),
            });

            // register("namespace", {
            //     validate: (value) => (value && value.length) || t(langKeys.field_required),
            // });

            if (row?.headerenabled) {
                register("header", {
                    validate: (value) => (value && value.length) || t(langKeys.field_required),
                });
            }

            if (row?.footerenabled) {
                register("footer", {
                    validate: (value) => (value && value.length) || t(langKeys.field_required),
                });
            }

            onChangeTemplateMedia();
        } else {
            register("name", {
                validate: (value) => (value && value.length) || t(langKeys.field_required),
            });

            // register("namespace");

            if (type === "SMS") {
                // register("body", {
                //     validate: (value) => (value && value.length <= 160) || "" + t(langKeys.validationchar),
                // });
            } else {
                // register("body", {
                //     validate: (value) => (value && value.length) || t(langKeys.field_required),
                // });
                register("header", {
                    validate: (value) => (value && value.length) || t(langKeys.field_required),
                });
            }
        }
    }, [register, type]);

    useEffect(() => {
        import("@codemirror/lang-html").then((html) => {
            setHtmlLoad([html.html({ matchClosingTags: true })]);
        });
    }, []);

    useEffect(() => {
        if (!isNew && isProvider) {
            setDisableInput(true);
        }
    }, [isNew, isProvider]);

    useEffect(() => {
        if (waitAdd) {
            if (!addRequest.loading && !addRequest.error) {
                dispatch(
                    showSnackbar({
                        message: t(row ? langKeys.successful_edit : langKeys.successful_register),
                        severity: "success",
                        show: true,
                    })
                );
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
                fetchData && fetchData();
                setWaitAdd(false);
            } else if (addRequest.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(addRequest.code ?? "error_unexpected_error", {
                            module: t(langKeys.messagetemplate).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitAdd(false);
            }
        }
    }, [addRequest, waitAdd]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "success",
                        message: t(row ? langKeys.successful_edit : langKeys.successful_register),
                    })
                );
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
                fetchData && fetchData();
                setWaitSave(false);
            } else if (executeRes.error) {
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "error",
                        message: t(executeRes.code ?? "error_unexpected_error", {
                            module: t(langKeys.messagetemplate).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeRes, waitSave]);

    useEffect(() => {
        if (waitUploadFile) {
            if (!uploadResult.loading && !uploadResult.error) {
                setValue(
                    "attachment",
                    (getValues("attachment")
                        ? [getValues("attachment"), uploadResult?.url ?? ""]
                        : [uploadResult?.url ?? ""]
                    ).join(",")
                );
                setWaitUploadFile(false);
            } else if (uploadResult.error) {
                setWaitUploadFile(false);
            }
        }
    }, [waitUploadFile, uploadResult]);

    const onSubmit = handleSubmit((data) => {
        if (data.type === "MAIL") {
            data.body = renderToString(toElement(bodyObject));
            if (data.body === `<div data-reactroot=""><p><span></span></p></div>`) {
                setBodyAlert(t(langKeys.field_required));
                return;
            } else {
                setBodyAlert("");
            }
        }

        if (data.type === "HTML") {
            if (data.body) {
                setBodyAlert("");
            } else {
                setBodyAlert(t(langKeys.field_required));
                return;
            }
        }

        if (isNew && isProvider) {
            const callback = () => {
                if (data.type === "MAIL") {
                    data.body = renderToString(toElement(bodyObject));
                    if (data.body === '<div data-reactroot=""><p><span></span></p></div>') {
                        setBodyAlert(t(langKeys.field_required));
                        return;
                    } else {
                        setBodyAlert("");
                    }
                }

                if (data.type === "HTML") {
                    if (data.body) {
                        setBodyAlert("");
                    } else {
                        setBodyAlert(t(langKeys.field_required));
                        return;
                    }
                }
                const { buttons, ...dataAux } = data;
                dispatch(addTemplate({
                    ...dataAux,
                    bodyobject: bodyObject,
                    buttons: buttons,
                    provideraccountid: null,
                    providerexternalid: null,
                    providerid: null,
                    providermessagelimit: null,
                    providerpartnerid: null,
                    providerquality: null,
                    providerstatus: null,
                    oldversion: true,
                }));
                dispatch(showBackdrop(true));
                setWaitAdd(true);
            };

            dispatch(
                manageConfirmation({
                    visible: true,
                    question: t(langKeys.confirmation_save),
                    callback,
                })
            );
        } else {
            const callback = () => {
                if (data.type === "MAIL") {
                    data.body = renderToString(toElement(bodyObject));
                    if (data.body === '<div data-reactroot=""><p><span></span></p></div>') {
                        setBodyAlert(t(langKeys.field_required));
                        return;
                    } else {
                        setBodyAlert("");
                    }
                }

                if (data.type === "HTML") {
                    if (data.body) {
                        setBodyAlert("");
                    } else {
                        setBodyAlert(t(langKeys.field_required));
                        return;
                    }
                }

                dispatch(execute(insMessageTemplateOld({
                    ...data,
                    authenticationdata: {},
                    bodyobject: getValues('type') === "MAIL" ? bodyObject : [],
                    bodyvariables: [],
                    buttonsgeneric: [],
                    buttonsquickreply: [],
                    carouseldata: [],
                    headervariables: [],
                    provideraccountid: null,
                    providerexternalid: null,
                    providerid: null,
                    providermessagelimit: null,
                    providerpartnerid: null,
                    providerquality: null,
                    providerstatus: null,
                    variablecontext: tableDataVariables.filter(x => x.value).reduce((acc, x) => ({ ...acc, [x.variablename]: x.value }), {},
                    )
                })));
                dispatch(showBackdrop(true));
                setWaitSave(true);
            };

            dispatch(
                manageConfirmation({
                    visible: true,
                    question: t(langKeys.confirmation_save),
                    callback,
                })
            );
        }
    });

    useEffect(() => {
        if (row) {
            if (row.fromprovider && row.communicationchanneltype) {
                setDisableNamespace(row.communicationchanneltype !== "WHAT");
            } else {
                setDisableNamespace(false);
            }
        }
    }, [row, register]);

    const onChangeMessageType = (data: Dictionary) => {
        if (getValues("type") === "MAIL" && (data?.value || "") !== "MAIL") {
            setValue("body", richTextToString(bodyObject));
        }

        setIsProvider(false);

        setValue("communicationchannelid", 0);
        setValue("communicationchanneltype", "");
        setValue("exampleparameters", "");
        setValue("externalid", "");
        setValue("externalstatus", "");
        setValue("fromprovider", false);
        setValue("integrationid", "");
        setValue("servicecredentials", "");
        setValue("type", data?.value || "");

        trigger("body");
        trigger("category");
        trigger("communicationchannelid");
        trigger("communicationchanneltype");
        trigger("exampleparameters");
        trigger("externalid");
        trigger("externalstatus");
        trigger("footer");
        trigger("fromprovider");
        trigger("header");
        trigger("integrationid");
        trigger("language");
        trigger("name");
        trigger("namespace");
        trigger("servicecredentials");
        trigger("templatetype");
        trigger("type");
        trigger("typeattachment");
    };

    const onChangeTemplateMedia = async () => {
        if (getValues("headerenabled")) {
            register("header", {
                validate: (value) => (value && value.length) || t(langKeys.field_required),
            });
        } else {
            register("header");
        }

        if (getValues("footerenabled")) {
            register("footer", {
                validate: (value) => (value && value.length) || t(langKeys.field_required),
            });
        } else {
            register("footer");
        }

        trigger("footer");
        trigger("footerenabled");
        trigger("header");
        trigger("headerenabled");
    };

    const onChangeTemplateType = async (data: Dictionary) => {
        setValue("templatetype", data?.value || "");

        trigger("templatetype");
    };

    const onClickHeaderToogle = async ({ value }: { value?: boolean | null } = {}) => {
        if (value) {
            setValue("headerenabled", value);
        } else {
            setValue("headerenabled", !getValues("headerenabled"));
        }

        trigger("headerenabled");
        trigger("header");

        await onChangeTemplateMedia();
    };

    const onClickFooterToogle = async ({ value }: { value?: boolean | null } = {}) => {
        if (value) {
            setValue("footerenabled", value);
        } else {
            setValue("footerenabled", !getValues("footerenabled"));
        }

        trigger("footerenabled");
        trigger("footer");

        await onChangeTemplateMedia();
    };

    const onClickButtonsToogle = async ({ value }: { value?: boolean | null } = {}) => {
        if (value) {
            setValue("buttonsenabled", value);
        } else {
            setValue("buttonsenabled", !getValues("buttonsenabled"));
        }

        trigger("buttonsenabled");
    };

    const onChangeHeaderType = async (data: Dictionary) => {
        setValue("headertype", data?.value || "");

        trigger("headertype");
    };

    const onChangeButton = (index: number, param: string, value: string) => {
        setValue(`buttons.${index}.${param}`, value);
    };

    const onClickAddButton = async () => {
        if (getValues("buttons") && getValues("buttons").length < 3) {
            setValue("buttons", [...getValues("buttons"), { title: "", type: "", payload: "" }]);
        }

        trigger("buttons");
    };

    const onClickRemoveButton = async () => {
        let btns = getValues("buttons");

        if (btns && btns.length > 0) {
            unregister(`buttons.${btns.length - 1}`);
            setValue(
                "buttons",
                btns.filter((x: any, i: number) => i !== btns.length - 1)
            );
        }

        trigger("buttons");
    };

    const onClickAttachment = useCallback(() => {
        const input = document.getElementById("attachmentInput");
        input!.click();
    }, []);

    const onChangeAttachment = useCallback((files: any) => {
        const file = files?.item(0);

        if (file) {
            setFileAttachment(file);
            let fd = new FormData();
            fd.append("file", file, file.name);
            dispatch(uploadFile(fd));
            setWaitUploadFile(true);
        }
    }, []);

    useEffect(() => {
        if (fileAttachmentTemplate) {
            let reader = new FileReader();
            reader.readAsText(fileAttachmentTemplate);
            reader.onload = (event: any) => {
                let content = event.target.result.toString();
                setValue("body", content);
                setBodyAttachment(content);
            };
        }
    }, [fileAttachmentTemplate]);

    const onChangeAttachmentTemplate = useCallback((files: any) => {
        const file = files?.item(0);
        if (file) {
            setFileAttachmentTemplate(file);
        }
    }, []);

    const handleCleanMediaInput = async (f: string) => {
        const input = document.getElementById("attachmentInput") as HTMLInputElement;

        if (input) {
            input.value = "";
        }

        setFileAttachment(null);
        setValue(
            "attachment",
            getValues("attachment")
                .split(",")
                .filter((a: string) => a !== f)
                .join(",")
        );

        trigger("attachment");
    };

    const changeProvider = async (value: any) => {
        if (!value || !isProvider) {
            setValue("category", "");
        }

        if (value) {
            setIsProvider(true);

            setValue("communicationchannelid", value.communicationchannelid);
            setValue("communicationchanneltype", value.type);
            setValue("exampleparameters", "");
            setValue("externalid", "");
            setValue("externalstatus", "PENDING");
            setValue("fromprovider", true);
            setValue("integrationid", value.integrationid);
            setValue("servicecredentials", value.servicecredentials);

            if (value.type === "WHAT") {
                setDisableNamespace(false);
            } else {
                setDisableNamespace(true);
                setValue("namespace", "-");
            }
        } else {
            setIsProvider(false);

            setValue("communicationchannelid", 0);
            setValue("communicationchanneltype", "");
            setValue("exampleparameters", "");
            setValue("externalid", "");
            setValue("externalstatus", "NONE");
            setValue("fromprovider", false);
            setValue("integrationid", "");
            setValue("servicecredentials", "");

            setDisableNamespace(false);
        }

        trigger("body");
        trigger("category");
        trigger("communicationchannelid");
        trigger("communicationchanneltype");
        trigger("exampleparameters");
        trigger("externalid");
        trigger("externalstatus");
        trigger("footer");
        trigger("fromprovider");
        trigger("header");
        trigger("integrationid");
        trigger("language");
        trigger("name");
        trigger("namespace");
        trigger("servicecredentials");
        trigger("templatetype");
        trigger("type");
        trigger("typeattachment");
    };
    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.variable),
                accessor: 'variablename',
                NoFilter: true,
                sortType: 'string'
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                NoFilter: true,
                sortType: 'string',
            },
            {
                Header: t(langKeys.datatype),
                accessor: 'variabletype',
                NoFilter: true,
                sortType: 'string',
                prefixTranslation: 'datatype_',
                Cell: (props: any) => {
                    const { variabletype } = props.cell.row.original || {};
                    return (t(`datatype_${variabletype}`.toLowerCase()) || "").toUpperCase()
                }
            },
            {
                Header: t(langKeys.value),
                accessor: 'value',
                NoFilter: true,
                type: 'string',
                editable: true,
                width: 250,
                maxWidth: 250
            },
        ],
        []
    )


    return (
        <div style={{ width: "100%" }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBread(t(langKeys.messagetemplate), t(langKeys.messagetemplatedetail))}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail title={row ? `${row.name}` : t(langKeys.newmessagetemplate)} />
                    </div>
                    <div
                        style={{
                            alignItems: "center",
                            display: "flex",
                            gap: "10px",
                        }}
                    >
                        <Button
                            color="primary"
                            onClick={() => setViewSelected("view-1")}
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            type="button"
                            variant="contained"
                        >
                            {t(langKeys.back)}
                        </Button>
                        <Button
                            className={classes.button}
                            color="primary"
                            disabled={waitUploadFile}
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}
                            type="submit"
                            variant="contained"
                        >
                            {t(langKeys.save)}
                        </Button>
                    </div>
                </div>
                <Tabs
                    value={pageSelected}
                    indicatorColor="primary"
                    variant="fullWidth"
                    style={{ borderBottom: '1px solid #EBEAED', backgroundColor: '#FFF', marginTop: 8 }}
                    textColor="primary"
                    onChange={(_, value) => setPageSelected(value)}
                >
                    <AntTab label={t(langKeys.templateinformation)} />
                    <AntTab
                        label={(
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <Trans i18nKey={langKeys.customvariables} />
                                <Tooltip title={<div style={{ fontSize: 12 }}>{t(langKeys.customvariableslist_helper_lead)}</div>} arrow placement="top" >
                                    <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                                </Tooltip>
                            </div>
                        )} />
                </Tabs>
                {pageSelected === 0 && <div className={classes.containerDetail}>
                    {row?.showid && (
                        <div className="row-zyx">
                            <FieldView
                                className="col-12"
                                label={t(langKeys.messagetemplateid)}
                                value={row ? row.id || "" : ""}
                            />
                        </div>
                    )}
                    <div className="row-zyx">
                        <FieldSelect
                            className="col-6"
                            data={dataMessageType}
                            disabled={disableInput}
                            error={errors?.type?.message}
                            label={t(langKeys.messagetype)}
                            onChange={onChangeMessageType}
                            optionDesc="text"
                            optionValue="value"
                            valueDefault={getValues("type")}
                        />
                        <FieldEdit
                            className="col-6"
                            disabled={disableInput}
                            error={errors?.name?.message}
                            label={t(langKeys.name)}
                            onChange={(value) => setValue("name", value)}
                            valueDefault={getValues("name")}
                        />
                    </div>
                    <div className="row-zyx">
                        {getValues("type") === "HSM" && (
                            <>
                                {isNew && (
                                    <FieldSelect
                                        className="col-6"
                                        data={dataNewCategory}
                                        disabled={disableInput}
                                        error={errors?.category?.message}
                                        label={t(langKeys.category)}
                                        onChange={(value) => setValue("category", value?.value)}
                                        optionDesc="description"
                                        optionValue="value"
                                        valueDefault={getValues("category")}
                                    />
                                )}
                                {!isNew && (
                                    <FieldView
                                        className="col-6"
                                        label={t(langKeys.category)}
                                        value={row ? t(`TEMPLATE_${row.category}`) : ""}
                                    />
                                )}
                            </>
                        )}
                        {getValues("type") !== "HSM" && (
                            <FieldSelect
                                className="col-6"
                                data={dataCategory}
                                disabled={disableInput}
                                error={errors?.category?.message}
                                label={t(langKeys.category)}
                                onChange={(value) => setValue("category", value?.domainvalue)}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                                valueDefault={getValues("category")}
                            />
                        )}
                        {isProvider && (
                            <FieldSelect
                                className="col-6"
                                data={dataExternalLanguage}
                                disabled={disableInput}
                                error={errors?.language?.message}
                                label={t(langKeys.language)}
                                onChange={(value) => setValue("language", value?.value)}
                                optionDesc="description"
                                optionValue="value"
                                valueDefault={getValues("language")}
                            />
                        )}
                        {!isProvider && (
                            <FieldSelect
                                className="col-6"
                                data={dataExternalLanguage}
                                disabled={disableInput}
                                error={errors?.language?.message}
                                label={t(langKeys.language)}
                                onChange={(value) => setValue("language", value?.domainvalue)}
                                optionDesc="description"
                                optionValue="value"
                                uset={true}
                                valueDefault={getValues("language")?.toUpperCase()}
                            />
                        )}
                    </div>
                    {getValues("type") === "HSM" && (
                        <div className="row-zyx">
                            <FieldSelect
                                className="col-6"
                                data={dataChannel}
                                disabled={!isNew || disableInput}
                                error={errors?.communicationchannelid?.message}
                                label={t(langKeys.messagetemplate_fromprovider)}
                                onChange={(value) => changeProvider(value)}
                                optionDesc="communicationchanneldesc"
                                optionValue="communicationchannelid"
                                valueDefault={getValues("communicationchannelid")}
                            />
                            <FieldSelect
                                className="col-6"
                                data={dataExternalStatus}
                                disabled={true}
                                error={errors?.externalstatus?.message}
                                label={t(langKeys.messagetemplate_externalstatus)}
                                optionDesc="description"
                                optionValue="value"
                                valueDefault={getValues("externalstatus")}
                            />
                        </div>
                    )}
                    {getValues("type") === "HSM" && (
                        <div className="row-zyx">
                            <FieldEdit
                                className="col-12"
                                disabled={disableNamespace}
                                error={errors?.namespace?.message}
                                label={t(langKeys.namespace)}
                                onChange={(value) => setValue("namespace", value)}
                                valueDefault={getValues("namespace")}
                            />
                        </div>
                    )}
                    <div className="row-zyx">
                        <FieldSelect
                            className="col-12"
                            data={dataTemplateType}
                            disabled={templateTypeDisabled || disableInput}
                            error={errors?.templatetype?.message}
                            label={t(langKeys.templatetype)}
                            onChange={onChangeTemplateType}
                            optionDesc="text"
                            optionValue="value"
                            valueDefault={getValues("templatetype")}
                        />
                    </div>
                    {getValues("templatetype") === "MULTIMEDIA" && getValues("type") === "HSM" && (
                        <div className="row-zyx">
                            <React.Fragment>
                                <Button
                                    className={classes.mediabutton}
                                    disabled={disableInput}
                                    onClick={() => onClickHeaderToogle()}
                                    startIcon={<CheckIcon htmlColor="#FFFFFF" />}
                                    type="button"
                                    variant="contained"
                                    style={{
                                        backgroundColor: getValues("headerenabled") ? "#000000" : "#AAAAAA",
                                        color: "#FFFFFF",
                                    }}
                                >
                                    {t(langKeys.header)}
                                </Button>
                                <Button
                                    className={classes.mediabutton}
                                    disabled={disableInput}
                                    startIcon={<CheckIcon htmlColor="#FFFFFF" />}
                                    type="button"
                                    variant="contained"
                                    style={{
                                        backgroundColor: "#000000",
                                        color: "#FFFFFF",
                                    }}
                                >
                                    {t(langKeys.body)}
                                </Button>
                                <Button
                                    className={classes.mediabutton}
                                    disabled={disableInput}
                                    onClick={() => onClickFooterToogle()}
                                    startIcon={<CheckIcon htmlColor="#FFFFFF" />}
                                    type="button"
                                    variant="contained"
                                    style={{
                                        backgroundColor: getValues("footerenabled") ? "#000000" : "#AAAAAA",
                                        color: "#FFFFFF",
                                    }}
                                >
                                    {t(langKeys.footer)}
                                </Button>
                                <Button
                                    className={classes.mediabutton}
                                    disabled={disableInput}
                                    onClick={() => onClickButtonsToogle()}
                                    startIcon={<CheckIcon htmlColor="#FFFFFF" />}
                                    type="button"
                                    variant="contained"
                                    style={{
                                        backgroundColor: getValues("buttonsenabled") ? "#000000" : "#AAAAAA",
                                        color: "#FFFFFF",
                                    }}
                                >
                                    {t(langKeys.buttons)}
                                </Button>
                            </React.Fragment>
                        </div>
                    )}
                    {getValues("templatetype") === "MULTIMEDIA" &&
                        getValues("headerenabled") &&
                        getValues("type") === "HSM" && (
                            <div className="row-zyx">
                                <React.Fragment>
                                    <FieldSelect
                                        className={classes.headerType}
                                        data={dataHeaderType}
                                        disabled={disableInput}
                                        label={t(langKeys.headertype)}
                                        onChange={onChangeHeaderType}
                                        optionDesc="text"
                                        optionValue="value"
                                        valueDefault={getValues("headertype")}
                                    />
                                    <FieldEdit
                                        className={classes.headerText}
                                        disabled={disableInput && getValues("header") === "text"}
                                        error={errors?.header?.message}
                                        label={t(langKeys.header)}
                                        onChange={(value) => setValue("header", value)}
                                        valueDefault={getValues("header")}
                                    />
                                </React.Fragment>
                            </div>
                        )}
                    {(getValues("type") === "SMS" || getValues("type") === "HSM") && (
                        <div className="row-zyx">
                            <FieldEditMulti
                                className="col-12"
                                disabled={disableInput}
                                error={errors?.body?.message}
                                label={t(langKeys.body)}
                                maxLength={getValues("type") === "SMS" ? 160 : 1024}
                                onChange={(value) => setValue("body", value)}
                                valueDefault={getValues("body")}
                            />
                        </div>
                    )}
                    {getValues("templatetype") === "MULTIMEDIA" &&
                        getValues("footerenabled") &&
                        getValues("type") === "HSM" && (
                            <div className="row-zyx">
                                <FieldEditMulti
                                    className="col-12"
                                    disabled={disableInput}
                                    error={errors?.footer?.message}
                                    label={t(langKeys.footer)}
                                    maxLength={60}
                                    onChange={(value) => setValue("footer", value)}
                                    rows={2}
                                    valueDefault={getValues("footer")}
                                />
                            </div>
                        )}
                    {getValues("templatetype") === "MULTIMEDIA" &&
                        getValues("buttonsenabled") &&
                        getValues("type") === "HSM" && (
                            <div className="row-zyx" style={{ alignItems: "flex-end" }}>
                                <FieldView className={classes.buttonTitle} label={t(langKeys.buttons)} />
                                {getValues("buttons")?.length < 3 && (
                                    <Button
                                        className={classes.btnButton}
                                        color="primary"
                                        disabled={disableInput}
                                        onClick={() => onClickAddButton()}
                                        startIcon={<AddIcon color="primary" />}
                                        style={{ margin: "10px" }}
                                        type="button"
                                        variant="outlined"
                                    >
                                        {t(langKeys.addbutton)}
                                    </Button>
                                )}
                                {getValues("buttons")?.length > 0 && (
                                    <Button
                                        className={classes.btnButton}
                                        color="primary"
                                        disabled={disableInput}
                                        onClick={() => onClickRemoveButton()}
                                        startIcon={<RemoveIcon color="primary" />}
                                        style={{ margin: "10px" }}
                                        type="button"
                                        variant="outlined"
                                    >
                                        {t(langKeys.removebutton)}
                                    </Button>
                                )}
                            </div>
                        )}
                    {getValues("templatetype") === "MULTIMEDIA" &&
                        getValues("buttonsenabled") &&
                        getValues("type") === "HSM" && (
                            <div className="row-zyx">
                                <React.Fragment>
                                    {getValues("buttons")?.map((btn: any, i: number) => {
                                        return (
                                            <div key={`btn-${i}`} className="col-4">
                                                <FieldEdit
                                                    className={classes.mb1}
                                                    disabled={disableInput}
                                                    error={errors?.buttons?.[i]?.title?.message}
                                                    label={t(langKeys.title)}
                                                    onChange={(value) => onChangeButton(i, "title", value)}
                                                    valueDefault={btn?.title || ""}
                                                    fregister={{
                                                        ...register(`buttons.${i}.title`, {
                                                            validate: (value) =>
                                                                (value && value.length) || t(langKeys.field_required),
                                                        }),
                                                    }}
                                                />
                                                <FieldSelect
                                                    className={classes.mb1}
                                                    data={dataButtonType}
                                                    disabled={disableInput}
                                                    error={errors?.buttons?.[i]?.type?.message}
                                                    label={t(langKeys.type)}
                                                    onChange={(value) => onChangeButton(i, "type", value?.value)}
                                                    optionDesc="text"
                                                    optionValue="value"
                                                    valueDefault={btn?.type || ""}
                                                    fregister={{
                                                        ...register(`buttons.${i}.type`, {
                                                            validate: (value) =>
                                                                (value && value.length) || t(langKeys.field_required),
                                                        }),
                                                    }}
                                                />
                                                <FieldEdit
                                                    className={classes.mb1}
                                                    disabled={disableInput}
                                                    error={errors?.buttons?.[i]?.payload?.message}
                                                    label={t(langKeys.payload)}
                                                    onChange={(value) => onChangeButton(i, "payload", value)}
                                                    valueDefault={btn?.payload || ""}
                                                    fregister={{
                                                        ...register(`buttons.${i}.payload`, {
                                                            validate: (value) =>
                                                                (value && value.length) || t(langKeys.field_required),
                                                        }),
                                                    }}
                                                />
                                            </div>
                                        );
                                    })}
                                </React.Fragment>
                            </div>
                        )}
                    {(getValues("type") === "MAIL" || getValues("type") === "HTML") && (
                        <div className="row-zyx">
                            <FieldEdit
                                className="col-6"
                                disabled={disableInput}
                                error={errors?.header?.message}
                                label={t(langKeys.subject)}
                                onChange={(value) => setValue("header", value)}
                                valueDefault={getValues("header")}
                            />
                            <FieldSelect
                                className="col-6"
                                data={dataPriority}
                                disabled={disableInput}
                                error={errors?.priority?.message}
                                label={t(langKeys.priority)}
                                onChange={(value) => setValue("priority", value?.value)}
                                optionDesc="text"
                                optionValue="value"
                                valueDefault={getValues("priority")}
                            />
                        </div>
                    )}
                    {getValues("type") === "MAIL" && (
                        <div className="row-zyx">
                            <React.Fragment>
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                                    {t(langKeys.body)}
                                </Box>
                                <RichText
                                    spellCheck
                                    value={bodyObject}
                                    onChange={(value) => {
                                        setBodyObject(value);
                                    }}
                                    style={{
                                        borderColor: "#762AA9",
                                        borderRadius: "4px",
                                        borderStyle: "solid",
                                        borderWidth: "1px",
                                        padding: "10px",
                                    }}
                                />
                                <FieldEdit
                                    className={classes.headerText}
                                    disabled={true}
                                    error={bodyAlert}
                                    label={""}
                                />
                            </React.Fragment>
                        </div>
                    )}
                    {getValues("type") === "HTML" && (
                        <div className="row-zyx">
                            <Button component="label" disabled={disableInput} variant="contained">
                                <input
                                    accept=".html"
                                    onChange={(e) => onChangeAttachmentTemplate(e.target.files)}
                                    type="file"
                                />
                            </Button>
                            <FieldEdit className={classes.headerText} disabled={true} error={bodyAlert} label={""} />
                        </div>
                    )}
                    {getValues("type") === "HTML" && (
                        <div className="row-zyx">
                            {bodyAttachment && (
                                <React.Fragment>
                                    <MenuItem onClick={() => setHtmlEdit(!htmlEdit)} disabled={disableInput}>
                                        <ListItemIcon color="inherit">
                                            <RefreshIcon
                                                fontSize="small"
                                                style={{
                                                    color: "#7721AD",
                                                    width: 16,
                                                }}
                                            />
                                        </ListItemIcon>
                                        <div style={{ fontSize: 16 }}>
                                            {htmlEdit
                                                ? t(langKeys.messagetemplate_changetoview)
                                                : t(langKeys.messagetemplate_changetoeditor)}
                                        </div>
                                    </MenuItem>
                                    {!htmlEdit ? (
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: bodyAttachment,
                                            }}
                                            style={{
                                                borderColor: "#762AA9",
                                                borderRadius: "4px",
                                                borderStyle: "solid",
                                                borderWidth: "1px",
                                                padding: "20px",
                                            }}
                                        />
                                    ) : (
                                        <Suspense fallback={<div>Loading...</div>}>
                                            <CodeMirror
                                                extensions={htmlLoad}
                                                height={"600px"}
                                                value={bodyAttachment}
                                                onChange={(value) => {
                                                    setValue("body", value || "");
                                                    setBodyAttachment(value || "");
                                                }}
                                            />
                                        </Suspense>
                                    )}
                                </React.Fragment>
                            )}
                        </div>
                    )}
                    {(getValues("type") === "MAIL" || getValues("type") === "HTML") && (
                        <div className="row-zyx">
                            <FieldView label={t(langKeys.messagetemplate_attachment)} />
                            <React.Fragment>
                                <input
                                    accept="file/*"
                                    disabled={disableInput}
                                    id="attachmentInput"
                                    onChange={(e) => onChangeAttachment(e.target.files)}
                                    style={{ display: "none" }}
                                    type="file"
                                />
                                {
                                    <IconButton
                                        disabled={waitUploadFile || disableInput}
                                        onClick={onClickAttachment}
                                        style={{ borderRadius: "0px" }}
                                    >
                                        <AttachFileIcon color="primary" />
                                    </IconButton>
                                }
                                {!!getValues("attachment") &&
                                    getValues("attachment")
                                        .split(",")
                                        .map((f: string, i: number) => (
                                            <FilePreview
                                                key={`attachment-${i}`}
                                                src={f}
                                                onClose={(f) => handleCleanMediaInput(f)}
                                            />
                                        ))}
                                {waitUploadFile && fileAttachment && (
                                    <FilePreview key={`attachment-x`} src={fileAttachment} />
                                )}
                            </React.Fragment>
                        </div>
                    )}
                </div>}
                {pageSelected === 1 &&
                    <div className={classes.containerDetail}>
                        <CustomTableZyxEditable
                            columns={columns}
                            download={false}
                            data={(tableDataVariables).map(x => ({
                                ...x,
                                domainvalues: (domainsCustomTable?.data || []).filter(y => y.domainname === x?.domainname)
                            }))}
                            //loading={multiData.loading}
                            register={false}
                            filterGeneral={false}
                            updateCell={updateCell}
                            skipAutoReset={skipAutoReset}
                        />
                    </div>}
            </form>
        </div>
    );
};

interface FilePreviewProps {
    onClose?: (f: string) => void;
    src: File | string;
}

const useFilePreviewStyles = makeStyles((theme) => ({
    btnContainer: {
        color: "lightgrey",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },
    infoContainer: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
    },
    root: {
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 4,
        display: "flex",
        flexDirection: "row",
        margin: theme.spacing(1),
        maxHeight: 80,
        maxWidth: 300,
        overflow: "hidden",
        padding: theme.spacing(1),
        width: "fit-content",
    },
}));

const FilePreview: FC<FilePreviewProps> = ({ src, onClose }) => {
    const classes = useFilePreviewStyles();

    const isUrl = useCallback(() => typeof src === "string" && src.includes("http"), [src]);

    const getFileName = useCallback(() => {
        if (isUrl()) {
            const m = RegExp(/.*\/(.+?)\./).exec(src as string);
            return m && m.length > 1 ? m[1] : "";
        }
        return (src as File).name;
    }, [isUrl, src]);

    const getFileExt = useCallback(() => {
        if (isUrl()) {
            return (src as string).split(".").pop()?.toUpperCase() ?? "-";
        }
        return (src as File).name?.split(".").pop()?.toUpperCase() ?? "-";
    }, [isUrl, src]);

    return (
        <Paper className={classes.root} elevation={2}>
            <FileCopy />
            <div style={{ width: "0.5em" }} />
            <div className={classes.infoContainer}>
                <div>
                    <div
                        style={{
                            fontWeight: "bold",
                            maxWidth: 190,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {getFileName()}
                    </div>
                    {getFileExt()}
                </div>
            </div>
            <div style={{ width: "0.5em" }} />
            {!isUrl() && !onClose && <CircularProgress color="primary" />}
            <div className={classes.btnContainer}>
                {onClose && (
                    <IconButton size="small" onClick={() => onClose(src as string)}>
                        <Close />
                    </IconButton>
                )}
                {isUrl() && <div style={{ height: "10%" }} />}
                {isUrl() && (
                    <a
                        download={`${getFileName()}.${getFileExt()}`}
                        href={src as string}
                        rel="noreferrer"
                        target="_blank"
                    >
                        <IconButton size="small">
                            <GetApp />
                        </IconButton>
                    </a>
                )}
            </div>
        </Paper>
    );
};

export default MessageTemplatesOld;