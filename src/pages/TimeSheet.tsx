import AddIcon from "@material-ui/icons/Add";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import Button from "@material-ui/core/Button";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import MenuItem from "@material-ui/core/MenuItem";
import React, { Suspense, FC, useCallback, useEffect, useState, useMemo } from "react";
import RefreshIcon from "@material-ui/icons/Refresh";
import RemoveIcon from "@material-ui/icons/Remove";
import SaveIcon from "@material-ui/icons/Save";
import TablePaginated, { useQueryParams } from "components/fields/table-paginated";

import {
    execute,
    exportData,
    getCollectionPaginated,
    getMultiCollection,
    resetAllMain,
    resetCollectionPaginated,
    uploadFile,
} from "store/main/actions";

import {
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
    getMessageTemplateExport,
    getPaginatedMessageTemplate,
    getValuesFromDomain,
    insMessageTemplate,
    richTextToString,
    selCommunicationChannelWhatsApp,
} from "common/helpers";

import { Box, CircularProgress, IconButton, Paper } from "@material-ui/core";
import { Close, FileCopy, GetApp, Delete, Search as SearchIcon } from "@material-ui/icons";
import { Descendant } from "slate";
import { Dictionary, MultiData, IFetchData } from "@types";
import { langKeys } from "lang/keys";
import { makeStyles } from "@material-ui/core/styles";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { RichText, renderToString, toElement } from "components/fields/RichText";
import { synchronizeTemplate, deleteTemplate, addTemplate } from "store/channel/actions";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";
import { useSelector } from "hooks";
import { useTranslation } from "react-i18next";

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
}));

const TimeSheet: FC = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const location = useLocation();
    const mainExecute = useSelector((state) => state.main.execute);
    const mainPaginated = useSelector((state) => state.main.mainPaginated);
    const mainResult = useSelector((state) => state.main);
    const query = useMemo(() => new URLSearchParams(location.search), [location]);
    const params = useQueryParams(query, { ignore: ["channelTypes"] });
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

    const [pageCount, setPageCount] = useState(0);
    const [rowWithDataSelected, setRowWithDataSelected] = useState<Dictionary[]>([]);
    const [selectedRows, setSelectedRows] = useState<any>({});
    const [totalRow, setTotalRow] = useState(0);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitDelete, setWaitDelete] = useState(false);
    const [waitSave, setWaitSave] = useState(false);

    const columns = React.useMemo(
        () => [
            {
                accessor: "id",
                isComponent: true,
                minWidth: 60,
                NoFilter: true,
                width: "1%",
                Cell: (props: any) => {
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
                accessor: "startdate",
                Header: t(langKeys.timesheet_date),
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return <div>{dateToLocalDate(row.startdate)}</div>;
                },
            },
            {
                accessor: "user",
                Header: t(langKeys.timesheet_user),
            },
            {
                accessor: "registerdate",
                Header: t(langKeys.timesheet_registerdate),
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return <div>{dateToLocalDate(row.registerdate)}</div>;
                },
            },
            {
                accessor: "registeruser",
                Header: t(langKeys.timesheet_registeruser),
            },
            {
                accessor: "organization",
                Header: t(langKeys.timesheet_organization),
            },
            {
                accessor: "profile",
                Header: t(langKeys.timesheet_profile),
            },
            {
                accessor: "duration",
                Header: t(langKeys.timesheet_duration),
                type: "time",
            },
            {
                accessor: "detail",
                Header: t(langKeys.timesheet_detail),
            },
        ],
        []
    );

    useEffect(() => {
        dispatch(resetCollectionPaginated());
        fetchData(fetchDataAux);

        return () => {
            dispatch(resetCollectionPaginated());
            dispatch(resetAllMain());
        };
    }, []);

    const fetchData = ({ pageSize, pageIndex, filters, sorts, daterange }: IFetchData) => {
        setfetchDataAux({ ...fetchDataAux, ...{ pageSize, pageIndex, filters, sorts } });
    };

    useEffect(() => {
        if (!mainPaginated.loading && !mainPaginated.error) {
            setPageCount(Math.ceil(mainPaginated.count / fetchDataAux.pageSize));
            setTotalRow(mainPaginated.count);
        }
    }, [mainPaginated]);

    useEffect(() => {
        if (!(Object.keys(selectedRows).length === 0 && rowWithDataSelected.length === 0)) {
            setRowWithDataSelected((p) =>
                Object.keys(selectedRows).map(
                    (x) =>
                        mainPaginated?.data.find((y) => y.id === parseInt(x)) ||
                        p.find((y) => y.id === parseInt(x)) ||
                        {}
                )
            );
        }
    }, [selectedRows]);

    useEffect(() => {
        if (waitDelete) {
            if (!mainExecute.loading && !mainExecute.error) {
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
            } else if (mainExecute.error) {
                dispatch(
                    showSnackbar({
                        message: t(mainExecute.code || "error_unexpected_error", {
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
    }, [mainExecute, waitDelete]);

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

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
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

    if (viewSelected === "view-1") {
        if (mainPaginated.error) {
            return <h1>ERROR</h1>;
        }
        return (
            <TablePaginated
                ButtonsElement={() => (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <Button
                            onClick={() => {
                                handleBulkDelete(rowWithDataSelected);
                            }}
                            color="primary"
                            disabled={mainPaginated.loading || Object.keys(selectedRows).length === 0}
                            startIcon={<Delete style={{ color: "white" }} />}
                            variant="contained"
                        >
                            {t(langKeys.delete)}
                        </Button>
                        <Button
                            onClick={() => {
                                fetchData(fetchDataAux);
                            }}
                            color="primary"
                            disabled={mainPaginated.loading}
                            startIcon={<SearchIcon style={{ color: "white" }} />}
                            style={{ width: 120, backgroundColor: "#55BD84" }}
                            variant="contained"
                        >
                            {t(langKeys.search)}
                        </Button>
                        <FieldSelect
                            onChange={(value) => { }}
                            data={[]}
                            label={t(langKeys.communicationchanneldesc)}
                            optionDesc="communicationchanneldesc"
                            optionValue="communicationchannelid"
                            style={{ width: 300 }}
                            valueDefault={""}
                            variant="outlined"
                        />
                    </div>
                )}
                autotrigger={true}
                columns={columns}
                data={mainPaginated.data}
                download={true}
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
            <DetailTimeSheet
                data={rowSelected}
                fetchData={() => fetchData(fetchDataAux)}
                multiData={mainResult.multiData.data}
                setViewSelected={setViewSelected}
            />
        );
};

const DetailTimeSheet: React.FC<DetailProps> = ({ data: { row, edit }, fetchData, multiData, setViewSelected }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeRes = useSelector((state) => state.main.execute);

    const [bodyAlert, setBodyAlert] = useState("");
    const [bodyAttachment, setBodyAttachment] = useState(row?.body || "");
    const [disableInput, setDisableInput] = useState(false);
    const [disableNamespace, setDisableNamespace] = useState(false);
    const [fileAttachment, setFileAttachment] = useState<File | null>(null);
    const [fileAttachmentTemplate, setFileAttachmentTemplate] = useState<File | null>(null);
    const [htmlEdit, setHtmlEdit] = useState(false);
    const [htmlLoad, setHtmlLoad] = useState<any | undefined>(undefined);
    const [isNew] = useState(row?.id ? false : true);
    const [isProvider, setIsProvider] = useState(row?.fromprovider ? true : false);
    const [waitAdd, setWaitAdd] = useState(false);
    const [waitSave, setWaitSave] = useState(false);
    const [waitUploadFile, setWaitUploadFile] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        unregister,
        trigger,
        formState: { errors },
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
            headertype: row?.headertype || "text",
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
                setWaitSave(false);
                fetchData();
                setViewSelected("view-1");
            } else if (executeRes.error) {
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "error",
                        message: t(executeRes.code || "error_unexpected_error", {
                            module: t(langKeys.messagetemplate).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeRes, waitSave]);

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
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
    });

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
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
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
                <div className={classes.containerDetail}></div>
            </form>
        </div>
    );
};

export default TimeSheet;