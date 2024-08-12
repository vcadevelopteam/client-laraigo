import React, { FC, useEffect, useState } from "react";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import { TemplateBreadcrumbs, TitleDetail, FieldEdit, FieldSelect, FieldMultiSelect } from "components";
import {
    getReassignmentRulesSel,
    getValuesFromDomain,
    insReassignmentRules,
    massDelReassignmentRules,
} from "common/helpers";
import { Dictionary } from "@types";
import TableZyx from "../components/fields/table-simple";
import { makeStyles } from "@material-ui/core/styles";
import SaveIcon from "@material-ui/icons/Save";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { useForm } from "react-hook-form";
import DeleteIcon from "@material-ui/icons/Delete";
import { getCollection, resetAllMain, getMultiCollection, execute } from "store/main/actions";
import { showSnackbar, showBackdrop, manageConfirmation } from "store/popus/actions";
import ClearIcon from "@material-ui/icons/Clear";

interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
}
interface MultiData {
    data: Dictionary[];
    success: boolean;
}
interface DetailReassignmentRulesProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: () => void;
    arrayBread: any;
}

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: "#fff",
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: "14px",
        textTransform: "initial",
    },
}));

const DetailReassignmentRules: React.FC<DetailReassignmentRulesProps> = ({
    data: { row, edit },
    setViewSelected,
    multiData,
    fetchData,
    arrayBread,
}) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(row?.group || "");
    const executeRes = useSelector((state) => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const dataStatus = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataGrupos = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm({
        defaultValues: {
            type: "NINGUNO",
            id: row?.assignmentruleid || 0,
            group: row?.group || "",
            assignedgroup: row?.assignedgroup || "",
            description: row?.description || "",
            status: row?.status || "ACTIVO",
            operation: row ? "EDIT" : "INSERT",
        },
    });

    React.useEffect(() => {
        register("type");
        register("id");
        register("description");
        register("group", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("assignedgroup", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("status", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
    }, [edit, register]);

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
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
                setSelectedGroup("");
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", {
                    module: t(langKeys.reassignmentrules).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave]);

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(insReassignmentRules(data)));
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
    });

    return (
        <div style={{ width: "100%" }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={[
                                ...arrayBread,
                                { id: "view-2", name: `${t(langKeys.reassignmentrule)} ${t(langKeys.detail)}` },
                            ]}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={
                                row ? `${t(langKeys.reassignmentrule)}` : "Nueva" + " " + t(langKeys.reassignmentrule)
                            }
                        />
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("view-1")}
                        >
                            {t(langKeys.back)}
                        </Button>
                        {edit && (
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                type="submit"
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                            >
                                {t(langKeys.save)}
                            </Button>
                        )}
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.group)}
                            className="col-6"
                            valueDefault={getValues("group")}
                            onChange={(value) => {
                                setValue("group", value?.domainvalue || "");
                                setSelectedGroup(value?.domainvalue || "");
                                setValue("assignedgroup", "");
                            }}
                            error={errors?.group?.message}
                            uset={true}
                            data={dataGrupos}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                        />
                        <FieldEdit
                            label={t(langKeys.description)}
                            className="col-6"
                            onChange={(value) => setValue("description", value)}
                            valueDefault={getValues("description")}
                            error={errors?.description?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldMultiSelect
                            label={t(langKeys.assignedgroup)}
                            className="col-6"
                            valueDefault={getValues("assignedgroup")}
                            onChange={(value) =>
                                setValue("assignedgroup", value?.map((o: Dictionary) => o?.domainvalue || "").join())
                            }
                            error={errors?.assignedgroup?.message}
                            uset={true}
                            data={dataGrupos.filter((x) => x.domainvalue !== selectedGroup)}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                        />
                        <FieldSelect
                            label={t(langKeys.status)}
                            className="col-6"
                            valueDefault={getValues("status")||"ACTIVO"}
                            onChange={(value) => setValue("status", value ? value.domainvalue : "")}
                            error={errors?.status?.message}
                            data={dataStatus}
                            uset={true}
                            prefixTranslation="status_"
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};
const selectionKey = "assignmentruleid";

const ReassignmentRules: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const classes = useStyles();
    const mainResult = useSelector((state) => state.main);
    const executeResult = useSelector((state) => state.main.execute);

    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);
    const [mainData, setMainData] = useState<any>([]);
    const [selectedRows, setSelectedRows] = useState<any>({});

    const arrayBread = [{ id: "view-1", name: t(langKeys.reassignmentrules) }];
    function redirectFunc(view: string) {
        setViewSelected(view);
    }

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.group),
                accessor: "groupdescription",
                NoFilter: true,
                width: "25%",
            },
            {
                Header: t(langKeys.description),
                accessor: "description",
                NoFilter: true,
                width: "25%",
            },
            {
                Header: t(langKeys.assignedgroup),
                accessor: "assignedgroupdescription",
                NoFilter: true,
                width: "25%",
            },
            {
                Header: t(langKeys.status),
                accessor: "status",
                NoFilter: true,
                width: "25%",
            },
        ],
        [t]
    );

    const fetchData = () => dispatch(getCollection(getReassignmentRulesSel(0)));

    useEffect(() => {
        fetchData();
        dispatch(
            getMultiCollection([
                getValuesFromDomain("GRUPOS"),
                getValuesFromDomain("ESTADOGENERICO"),
                getValuesFromDomain("CLASSINNAWORDS"),
            ])
        );
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }));
                fetchData();
                dispatch(showBackdrop(false));
                setSelectedRows({});
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", {
                    module: t(langKeys.inappropriatewords).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    };

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    };

    useEffect(() => {
        setMainData(
            mainResult.mainData.data.map((x) => ({
                ...x,
                statusdesc: (t(`status_${x.status}`.toLowerCase()) || "").toUpperCase(),
            }))
        );
    }, [mainResult.mainData.data]);

    if (viewSelected === "view-1") {
        return (
            <div style={{ width: "100%", display: "flex", flexDirection: "column", flex: 1 }}>
                <TableZyx
                    columns={columns}
                    ButtonsElement={() => (
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            disabled={!Object.keys(selectedRows).length}
                            type="button"
                            style={{ backgroundColor: !Object.keys(selectedRows).length ? "#e0e0e0" : "#7721ad" }}
                            startIcon={<DeleteIcon style={{ color: "white" }} />}
                            onClick={() => {
                                const selectedRules = Object.keys(selectedRows).join(",");
                                setWaitSave(true);
                                dispatch(execute(massDelReassignmentRules(selectedRules)));
                                dispatch(showBackdrop(true));
                            }}
                        >
                            {t(langKeys.delete)}
                        </Button>
                    )}
                    titlemodule={t(langKeys.reassignmentrules, { count: 2 })}
                    data={mainData}
                    download={true}
                    useSelection={true}
                    selectionKey={selectionKey}
                    setSelectedRows={setSelectedRows}
                    onClickRow={handleEdit}
                    loading={mainResult.mainData.loading}
                    register={true}
                    handleRegister={handleRegister}
                />
            </div>
        );
    } else if (viewSelected === "view-2") {
        return (
            <DetailReassignmentRules
                data={rowSelected}
                setViewSelected={redirectFunc}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
                arrayBread={arrayBread}
            />
        );
    } else return null;
};

export default ReassignmentRules;
