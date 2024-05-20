import { deleteTemplate, synchronizeTemplate } from "store/channel/actions";
import { Delete, Search } from "@material-ui/icons";
import { Dictionary, IFetchData } from "@types";
import { langKeys } from "lang/keys";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";
import { useSelector } from "hooks";
import { useTranslation } from "react-i18next";

import {
    exportData,
    getCollectionPaginated,
    getMultiCollection,
    resetAllMain,
    resetCollectionPaginated,
} from "store/main/actions";

import {
    FieldSelect,
    TemplateIcons,
} from "components";

import {
    dateToLocalDate,
    getMessageTemplateExport,
    getPaginatedMessageTemplate,
    getValuesFromDomain,
    selCommunicationChannelWhatsApp,
} from "common/helpers";

import Button from "@material-ui/core/Button";
import React, { FC, useEffect, useMemo, useState } from "react";
import RefreshIcon from "@material-ui/icons/Refresh";
import TablePaginated, { useQueryParams } from "components/fields/table-paginated";
import { CellProps } from "react-table";
import DetailMessageTemplates from "./views/MessageTemplatesDetail";

interface RowSelected {
    edit: boolean;
    row: Dictionary | null;
}

const MessageTemplates: FC = () => {
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
                    return <div style={{ textAlign: 'center' }}>{dateToLocalDate(row.original.createdate)}</div>;
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
                            return showId ? <div style={{ textAlign: 'center' }}>{row.id}</div> : null;
                        }
                    },
                ]
                : []),
            {
                accessor: "communicationchanneltype",
                Header: t(langKeys.channel),
                Cell: (props: CellProps<Dictionary>) => {
                    const { row } = props.cell;
                    return <div style={{ textAlign: 'center' }}>{row.original.communicationchanneltype}</div>;
                }
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
                    return <div style={{ textAlign: 'center' }}>{row.original.language}</div>;
                }
            },
            {
                accessor: "type",
                Header: t(langKeys.messagetype),
                prefixTranslation: "messagetemplate_",
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
                accessor: "externalstatus",
                Header: t(langKeys.status),
                Cell: (props: CellProps<Dictionary>) => {
                    const { row } = props.cell;
                    const { externalstatus, type } = row?.original || {};

                    let statusText = '';

                    if (type) {
                        switch (type) {
                            case "HSM":
                                statusText = t(`TEMPLATE_${externalstatus}`);
                                break;
                            default:
                                statusText = t('TEMPLATE_APPROVED');
                                break;
                        }

                        let color = '';

                        switch (statusText) {
                            case 'PENDIENTE':
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
            },
            {
                accessor: "priority",
                Header: t(langKeys.quality),
                Cell: (props: CellProps<Dictionary>) => {
                    const { row } = props.cell;
                    return <div style={{ textAlign: 'center' }}>{row.original.priority}</div>;
                }
            },
            {
                accessor: "limit",
                Header: t(langKeys.messageslimit),
                Cell: (props: CellProps<Dictionary>) => {
                    const { row } = props.cell;
                    return <div style={{ textAlign: 'center' }}>{row.original.limit}</div>;
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

export default MessageTemplates;