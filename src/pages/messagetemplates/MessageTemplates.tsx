import { deleteTemplate, synchronizeTemplate } from "store/channel/actions";
import { Delete, Search } from "@material-ui/icons";
import { Dictionary, IFetchData } from "@types";
import { langKeys } from "lang/keys";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";
import { useSelector } from "hooks";
import { useTranslation } from "react-i18next";
import { ExpandLess, ExpandMore, KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';

import {
    exportData,
    getCollectionPaginated,
    getMultiCollection,
    resetAllMain,
    resetCollectionPaginated,
} from "store/main/actions";

import {
    TemplateBreadcrumbs,
} from "components";

import {
    dateToLocalDate,
    exportExcel,
    getMessageTemplateExport,
    getPaginatedMessageTemplate,
    getValuesFromDomain,
    selCommunicationChannelWhatsApp,
} from "common/helpers";

import Button from "@material-ui/core/Button";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import TablePaginated, { useQueryParams } from "components/fields/table-paginated";
import { CellProps } from "react-table";
import DetailMessageTemplates from "./views/MessageTemplatesDetail";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
    titleandcrumbs: {
        marginBottom: 4,
        marginTop: 4,
    },
    container: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        flex: 1,
    },
    tag: {
        backgroundColor: '#EBF2F3',
        borderRadius: '8px',
        padding: '2px 8px',
        marginRight: '4px',
        marginBottom: '4px',
        whiteSpace: 'nowrap',
        wordBreak: 'keep-all',
    },
    tagcontainer: {
        display: 'flex', 
        whiteSpace: 'nowrap', 
        overflow: 'hidden',
        width: '300px'
    }
}));
interface RowSelected {
    edit: boolean;
    row: Dictionary | null;
}
type BreadCrumb = {
    id: string,
    name: string
}
interface MessageTemplatesProps {
    arrayBread: BreadCrumb[];
    setAuxViewSelected: (view: string) => void;  
}

const MessageTemplates: React.FC<MessageTemplatesProps> = ({ 
    setAuxViewSelected,
    arrayBread,
}) => {
    const dispatch = useDispatch();
    const classes = useStyles();
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
    const newArrayBread = [
        ...arrayBread,
        { id: "templates", name: t(langKeys.templates) },
    ];
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
            /*{
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
            },*/
            {
                accessor: "createdate",
                Header: t(langKeys.creationdate),
                NoFilter: false,
                type: 'date',
                Cell: (props: CellProps<Dictionary>) => {
                    const { row } = props.cell;
                    if (!row || !row.original || !row.original.createdate) {
                        return null;
                    }
                    return <div>{dateToLocalDate(row.original.createdate)}</div>;
                },
            },
            {
                accessor: "id",
                Header: t(langKeys.messagetemplateid),
                type: "number",
                Cell: (props: CellProps<Dictionary>) => {
                    const { row } = props.cell;
                    const { providerstatus } = row?.original || {};
                    if (providerstatus !== 'REJECTED') {
                        return <div style={{ textAlign: 'left' }}>{row.id}</div>;
                    } else {
                        return '';
                    }
                }
            },
            {
                accessor: "communicationchanneldesc",
                Header: t(langKeys.channel),
                width: '300px',
                helpText: t(langKeys.message_templates_channel_help),                
                Cell: (props: CellProps<Dictionary>) => {
                    const { row } = props.cell;
                    const data = row?.original?.communicationchanneldesc || '';
                    return <TagTypeCell separator={","} data={data}/>
                },
                
                                
            },

            {
                accessor: "name",
                Header: t(langKeys.name),
            },
            {
                accessor: "language",
                Header: t(langKeys.language),
                Cell: (props: CellProps<Dictionary>) => {
                    const { row } = props.cell;
                    return <div>{row.original.language.toUpperCase()}</div>;
                }
            },
            {
                accessor: "type",
                Header: t(langKeys.messagetype),
                type: "select",
                listSelectFilter: [
                    { key: "HSM", value: "HSM" },
                    { key: "HTML", value: "HTML" },
                    { key: "CORREO", value: "MAIL" },
                    { key: "SMS", value: "SMS" },
                ],
                Cell: (props: CellProps<Dictionary>) => {
                    const { row } = props.cell;
                    return <div>{t(`messagetemplate_${row.original.type.toLowerCase()}`).toUpperCase()}</div>;
                }
            },
            {
                accessor: "category",
                Header: t(langKeys.category),
                type: "select",
                listSelectFilter: [
                    { key: t(langKeys.TEMPLATE2_AUTHENTICATION), value: "AUTHENTICATION" },
                    { key: t(langKeys.TEMPLATE2_MARKETING), value: "MARKETING" },
                    { key: t(langKeys.TEMPLATE2_UTILITY), value: "UTILITY" },
                    { key: "NINGUNO ", value: "NINGUNO" },
                ],
                Cell: (props: CellProps<Dictionary>) => {
                    const { row } = props.cell;
                    const { category, type } = row?.original || {};
                    if (category && type) {
                        return (type === "HSM" ? t(`TEMPLATE2_${category}`) : category).toUpperCase();
                    } else {
                        return '';
                    }
                }

            },
            {
                accessor: "providerstatus",
                Header: t(langKeys.status),
                type: "select",
                listSelectFilter: [
                    { key: t(langKeys.TEMPLATE2_APPROVED), value: "APPROVED" },
                    { key: t(langKeys.TEMPLATE2_PENDING), value: "PENDING" },
                    { key: t(langKeys.TEMPLATE2_REJECTED), value: "REJECTED" },
                    { key: t(langKeys.TEMPLATE2_CREATED), value: "CREATED" },
                    { key: t(langKeys.TEMPLATE2_SUBMITTED), value: "SUBMITTED" },
                ],
                Cell: (props: CellProps<Dictionary>) => {
                    const { row } = props.cell;
                    const { providerstatus, type } = row?.original || {};

                    let statusText = '';

                    if (type) {
                        switch (type) {
                            case "HSM":
                                if (providerstatus === null) statusText = t(langKeys.TEMPLATE_REJECTED);
                                else statusText = t(`TEMPLATE2_${providerstatus}`);
                                break;
                            default:
                                statusText = t(langKeys.TEMPLATE2_APPROVED);
                                break;
                        }

                        let color = '';

                        switch (statusText) {
                            case 'EN REVISIÓN':
                                color = '#E6C300';
                                break;
                            case 'CREADO':
                                color = '#E6C300';
                                break;
                            case 'PRESENTADO':
                                color = '#E6C300';
                                break;
                            case 'RECHAZADA':
                                color = 'red';
                                break;
                            case 'APROBADA':
                                color = 'green';
                                break;
                            default:
                                color = 'black';
                                break;
                        }
                        return (
                            <span style={{ color: color, textAlign: 'center' }}>
                                {statusText.toUpperCase()}
                            </span>
                        );
                    } else {
                        return '';
                    }
                }
            },
            {
                accessor: "templatetype",
                Header: t(langKeys.templatetype),
                prefixTranslation: "messagetemplate_",
                type: "select",
                listSelectFilter: [
                    { key: t(langKeys.TEMPLATE2_MULTIMEDIA), value: "MULTIMEDIA" },
                    { key: t(langKeys.TEMPLATE2_CAROUSEL), value: "CAROUSEL" },
                ],
                Cell: (props: CellProps<Dictionary>) => {
                    const { row } = props.cell;
                    const { category, type, templatetype } = row?.original || {};
                    if (category && type) {
                        return t(`messagetemplate_${templatetype.toLowerCase()}`).toUpperCase();
                    } else {
                        return '';
                    }
                }
            },
            {
                accessor: "providerquality",
                Header: t(langKeys.quality),
                type: "select",
                listSelectFilter: [
                    { key: t(langKeys.messagetemplate_high).toUpperCase(), value: "HIGH" },
                    { key: t(langKeys.messagetemplate_medium).toUpperCase(), value: "MEDIUM" },
                    { key: t(langKeys.messagetemplate_low).toUpperCase(), value: "LOW" },
                    { key: t(langKeys.productcatalog_reviewstatus_pending).toUpperCase(), value: 'NA'}
                ],
                Cell: (props: CellProps<Dictionary>) => {
                    const { row } = props.cell;
                    const { providerquality, type } = row?.original || {};

                    let qText = '';

                    if (type) {
                        switch (type) {
                            case "HSM":
                                if (!providerquality) {
                                    return "-";
                                }
                                else if (providerquality === 'HIGH' || providerquality === 'MEDIUM' || providerquality === 'LOW') {
                                    qText = t(`template_${providerquality}`);
                                }
                                else {
                                    qText = t(langKeys.TEMPLATE_PENDING);
                                }
                                break;
                            default:
                                qText = "-";
                                break;
                        }

                        let color = '';

                        switch (qText) {
                            case 'Media':
                                color = '#E6C300';
                                break;
                            case 'Baja':
                                color = 'red';
                                break;
                            case 'Alta':
                                color = 'green';
                                break;
                            case 'PENDIENTE':
                                color = '#E6C300';
                                break;
                            default:
                                color = 'black';
                                break;
                        }

                        return (
                            <span style={{ color: color, textAlign: 'center' }}>
                                {qText.toUpperCase()}
                            </span>
                        );
                    } else {
                        return '';
                    }
                }
            },
            {
                accessor: "providermessagelimit",
                Header: t(langKeys.messageslimit),
                helpText: t(langKeys.limitmessagehelptext),
                type: "select",
                listSelectFilter: [
                    { key: `50 ${t(langKeys.clients)}/24 ${t(langKeys.hours)}`, value: "TIER_0.05K" },
                    { key: `250 ${t(langKeys.clients)}/24 ${t(langKeys.hours)}`, value: "TIER_0.25K" },
                    { key: `1K ${t(langKeys.clients)}/24 ${t(langKeys.hours)}`, value: "TIER_1K" },
                    { key: `10K ${t(langKeys.clients)}/24 ${t(langKeys.hours)}`, value: "TIER_10K" },
                    { key: `100K ${t(langKeys.clients)}/24 ${t(langKeys.hours)}`, value: "TIER_100K" },
                    { key: t(langKeys.unlimited).toUpperCase(), value: "TIER_UNLIMITED" },
                ],
                Cell: (props: CellProps<Dictionary>) => {
                    const { row } = props.cell;
                    const { providermessagelimit, type } = row?.original || {};

                    let limit = '-';

                    if (type) {
                        if (type === 'HSM') {
                            switch (providermessagelimit) {
                                case "TIER_0.05K":
                                    limit = `50 ${t(langKeys.clients)}/24 ${t(langKeys.hours)}`;
                                    break;
                                case "TIER_0.25K":
                                    limit = `250 ${t(langKeys.clients)}/24 ${t(langKeys.hours)}`;
                                    break;
                                case "TIER_1K":
                                    limit = `1K ${t(langKeys.clients)}/24 ${t(langKeys.hours)}`;
                                    break;
                                case "TIER_10K":
                                    limit = `10K ${t(langKeys.clients)}/24 ${t(langKeys.hours)}`;
                                    break;
                                case "TIER_100K":
                                    limit = `100K ${t(langKeys.clients)}/24 ${t(langKeys.hours)}`;
                                    break;
                                case "TIER_UNLIMITED":
                                    limit = t(langKeys.unlimited);
                                    break;
                                default:
                                    limit = "-";
                                    break;
                            }
                        }

                        return (
                            <span style={{ textAlign: 'center' }}>
                                {limit}
                            </span>
                        );
                    } else {
                        return '-';
                    }
                }
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
        handleSynchronize()

        dispatch(
            getMultiCollection([
                getValuesFromDomain("MESSAGETEMPLATECATEGORY"),
                getValuesFromDomain("LANGUAGE"),
                selCommunicationChannelWhatsApp(),
            ])
        );

        return () => {
            dispatch(resetCollectionPaginated());
            dispatch(resetAllMain());
        };
    }, []);

    const fetchData = ({ pageSize, pageIndex, filters, sorts, daterange }: IFetchData) => {
        setfetchDataAux({ ...fetchDataAux, ...{ pageSize, pageIndex, filters, sorts } });
        dispatch(
            getCollectionPaginated(
                getPaginatedMessageTemplate({
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
                dispatch(showBackdrop(false));
                setWaitSynchronize(false);
                fetchData(fetchDataAux);
            } else if (mainSynchronize.error) {
                dispatch(
                    showSnackbar({
                        message: mainSynchronize.code === 'BAD REQUEST' ? t(langKeys.synchronizeError) : t(mainSynchronize.code ?? "error_unexpected_error"),
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

    const handleSynchronize = () => {
        dispatch(synchronizeTemplate());
        dispatch(showBackdrop(true));
        setWaitSynchronize(true);
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

        if (row.type === 'HSM') {
            dispatch(
                manageConfirmation({
                    callback,
                    question: t(langKeys.templatesdeletemessage),
                    visible: true,
                })
            );
        } else {
            callback()
        }
    };

    const handleBulkDelete = (dataSelected: Dictionary[]) => {
        const hasHSMType = dataSelected.some(item => item.type === 'HSM');
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

        if (hasHSMType) {
            dispatch(
                manageConfirmation({
                    callback,
                    question: t(langKeys.templatesdeletemessage),
                    visible: true,
                })
            );
        } else {
            callback()
        }
    };

    const triggerExportData = ({ filters, sorts }: IFetchData) => {
        const columnsExport = columns
            .filter((x) => !x.isComponent)
            .map((x) => ({
                key: x.accessor,
                alias: x.Header,
            }));
        dispatch(
            exportData(
                getMessageTemplateExport({
                    filters: {
                        ...filters,
                    },
                    sorts,
                    translation: 'es',
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

    const functionChange = (change:string) => {
        if(change === "templates"){
            setViewSelected("view-1")
        }else{
            setAuxViewSelected(change);
        }
    }

    if (viewSelected === "view-1") {
        if (mainPaginated.error) {
            return <h1>ERROR</h1>;
        }
        return (
            <div className={classes.container}>
                <div className={classes.titleandcrumbs}>
                    <div style={{ flexGrow: 1}}>
                        <TemplateBreadcrumbs
                            breadcrumbs={newArrayBread}
                            handleClick={functionChange}
                        />
                    </div>
                </div>
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
            </div>
        );
    } else
        return (
            <DetailMessageTemplates
                data={rowSelected}
                fetchData={() => fetchData(fetchDataAux)}
                multiData={mainResult.multiData.data}
                setViewSelected={setViewSelected}
                handleSynchronize={handleSynchronize}
            />
        );
};

export default MessageTemplates;