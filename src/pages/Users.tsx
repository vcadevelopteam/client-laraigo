import React, { FC, useEffect, useState } from "react";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import { DialogZyx, TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldEdit, FieldSelect, FieldMultiSelect, TemplateSwitch, TemplateSwitchYesNo, AntTab, } from "components";
import { getOrgUserSel, getUserSel, getValuesFromDomain, getOrgsByCorp, getRolesByOrg, getSupervisors, getChannelsByOrg, getApplicationsByRole, insUser, insOrgUser, randomText, templateMaker, exportExcel, uploadExcel, array_trimmer, checkUserPaymentPlan, getSecurityRules, validateNumbersEqualsConsecutive, validateDomainCharacters, validateDomainCharactersSpecials, getPropertySelByName, getWarehouseSel, selStore, getCustomVariableSelByTableName, getDomainByDomainNameList } from "common/helpers";
import { getDomainsByTypename } from "store/person/actions";
import { Dictionary, MultiData } from "@types";
import TableZyx from "../components/fields/table-simple";
import { makeStyles } from "@material-ui/core/styles";
import SaveIcon from "@material-ui/icons/Save";
import { Trans, useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { useForm } from "react-hook-form";
import Avatar from "@material-ui/core/Avatar";
import { cleanMemoryTable, getCollectionAux2, setMemoryTable, uploadFile } from "store/main/actions";
import ListAltIcon from "@material-ui/icons/ListAlt";
import clsx from "clsx";
import { getCollection, resetAllMain, getMultiCollection, getCollectionAux, resetMainAux, getMultiCollectionAux } from "store/main/actions";
import { saveUser, delUser } from "store/activationuser/actions";
import { showSnackbar, showBackdrop, manageConfirmation } from "store/popus/actions";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import AddIcon from "@material-ui/icons/Add";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import ClearIcon from "@material-ui/icons/Clear";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import { Divider, Grid, ListItem, Box, IconButton, Tabs, Tooltip } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import DeleteIcon from "@material-ui/icons/Delete";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { DuplicateIcon } from "icons";
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import { CellProps } from "react-table";
import CustomTableZyxEditable from "components/fields/customtable-editable";

interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
}

interface DetailProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData?: () => void;
    arrayBread: any;
}
interface ModalProps {
    data: RowSelected;
    multiData: MultiData[];
    preData: (Dictionary | null)[]; //ORGANIZATIONS
    openModal?: boolean;
    setOpenModal?: (open: boolean) => void;
    updateRecords?: (record: any) => void; //SETDATAORGANIZATION
    triggerSave?: boolean;
    index: number;
    setAllIndex: (index: any) => void;
    handleDelete: (row: Dictionary | null, index: number) => void;
}

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: "#fff",
    },
    mb2: {
        marginBottom: theme.spacing(4),
    },
    title: {
        fontSize: "22px",
        color: theme.palette.text.primary,
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: "14px",
        textTransform: "initial",
    },
    paswordCondition: {
        textAlign: "center",
    },
    badge: {
        paddingRight: "0.6em",
        paddingLeft: "0.6em",
        borderRadius: "10rem",
        display: "inline-block",
        padding: "0.25em 0.4em",
        fontSize: "75%",
        fontWeight: "bold",
        lineHeight: "1",
        textAlign: "center",
        whiteSpace: "nowrap",
        verticalAlign: "baseline",
        marginLeft: "10px",
    },
    badgeSuccess: {
        color: "#fff",
        backgroundColor: "#28a745",
    },
    badgeFailure: {
        color: "#fff",
        backgroundColor: "#fb5f5f",
    },
    iconHelpText: {
        width: 15,
        height: 15,
        cursor: 'pointer',
    },
}));
const ListItemSkeleton: FC = () => (
    <ListItem style={{ display: "flex", paddingLeft: 0, paddingRight: 0, paddingBottom: 8 }}>
        <Box style={{ padding: 20, backgroundColor: "white", display: "flex", flexDirection: "column", flexGrow: 1 }}>
            <Grid container direction="column">
                <Grid container direction="row" spacing={1}>
                    <Grid item sm={12} xl={12} xs={12} md={12} lg={12}>
                        <Skeleton />
                    </Grid>
                </Grid>
                <Divider style={{ margin: "10px 0" }} />
                <Grid container direction="row" spacing={1}>
                    <Grid item sm={12} xl={12} xs={12} md={12} lg={12}>
                        <Skeleton />
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    </ListItem>
);

const DetailOrgUser: React.FC<ModalProps> = ({
    index,
    data: { row, edit },
    multiData,
    updateRecords,
    preData,
    triggerSave,
    setAllIndex,
    handleDelete,
}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const resFromOrg = useSelector((state) => state.main.multiDataAux);

    const dataRoles = multiData[9] && multiData[9].success ? multiData[9].data : [];
    const dataOrganizationsTmp = multiData[8] && multiData[8].success ? multiData[8].data : []
    const propertyBots = multiData[12] && multiData[12].success ? multiData[12].data : []
    const rolesArray = (row?.roledesc || '').split(',').map((role: string) => role.trim());

    const [activateSwitchBots, setActivateSwitchBots] = useState(propertyBots?.[0]?.propertyvalue === "1" &&
        !rolesArray.some((role: any) => ["GESTOR DE SEGURIDAD", "GESTOR DE CAMPAÑAS", "VISOR SD", "ASESOR"].includes(role)))
    const [typeSwitch, settypeSwitch] = useState(row?.type === "ASESOR")
    const [dataOrganizations, setDataOrganizations] = useState<{ loading: boolean; data: Dictionary[] }>({
        loading: false,
        data: [],
    });
    const [dataSupervisors, setDataSupervisors] = useState<{ loading: boolean; data: Dictionary[] }>({
        loading: false,
        data: [],
    });
    const [dataChannels, setDataChannels] = useState<{ loading: boolean; data: Dictionary[] }>({
        loading: false,
        data: [],
    });
    const [dataGroups, setDataGroups] = useState<{ loading: boolean; data: Dictionary[] }>({
        loading: false,
        data: [],
    });
    const [dataApplications, setDataApplications] = useState<{ loading: boolean; data: Dictionary[] }>({
        loading: false,
        data: [],
    });
    const [dataStores, setDataStores] = useState<{ loading: boolean; data: Dictionary[] }>({
        loading: false,
        data: [],
    });
    const [dataWarehouses, setDataWarehouses] = useState<{ loading: boolean; data: Dictionary[] }>({
        loading: false,
        data: [],
    });

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        trigger,
        formState: { errors },
        reset,
    } = useForm();

    useEffect(() => {
        if (triggerSave) {
            (async () => {
                const allOk = await trigger(); //para q valide el formulario
                const data = getValues();
                if (allOk) {
                    updateRecords &&
                        updateRecords((p: Dictionary[], itmp: number) => {
                            p[index] = {
                                ...data,
                                operation: p[index].id === 0 || p[index].operation === "INSERT" ? "INSERT" : "UPDATE",
                            };
                            return p;
                        });
                }
                setAllIndex((p: number[]) => [...p, { index, allOk }]);
            })();
        }
    }, [triggerSave]);

    function updatefield(field: string, value: any) {
        updateRecords &&
            updateRecords((p: Dictionary[], itmp: number) => {
                p[index] = { ...p[index], [field]: value };
                return p;
            });
    }

    useEffect(() => {
        //validar la respuesta y asignar la  data a supervisores y canales segun la organización q cambió
        const indexSupervisor = resFromOrg.data.findIndex(
            (x: MultiData) => x.key === "UFN_USER_SUPERVISOR_LST" + (index + 1)
        );
        const indexChannels = resFromOrg.data.findIndex(
            (x: MultiData) => x.key === "UFN_COMMUNICATIONCHANNELBYORG_LST" + (index + 1)
        );
        const indexGroups = resFromOrg.data.findIndex(
            (x: MultiData) => x.key === `UFN_DOMAIN_LST_VALORES_GRUPOS${index + 1}`
        );
        const indexApplications = resFromOrg.data.findIndex(
            (x: MultiData) => x.key === "UFN_APPS_DATA_SEL" + (index + 1)
        );

        const indexStores = resFromOrg.data.findIndex(
            (x: MultiData) => x.key === "UFN_STORE_SEL"
        );

        const indexWarehouses = resFromOrg.data.findIndex(
            (x: MultiData) => x.key === "UFN_WAREHOUSE_SEL"
        );

        if (indexSupervisor > -1)
            setDataSupervisors({
                loading: false,
                data:
                    resFromOrg.data[indexSupervisor] && resFromOrg.data[indexSupervisor].success
                        ? resFromOrg.data[indexSupervisor].data
                        : [],
            });

        if (indexChannels > -1)
            setDataChannels({
                loading: false,
                data:
                    resFromOrg.data[indexChannels] && resFromOrg.data[indexChannels].success
                        ? resFromOrg.data[indexChannels].data
                        : [],
            });

        if (indexGroups > -1)
            setDataGroups({
                loading: false,
                data:
                    resFromOrg.data[indexGroups] && resFromOrg.data[indexGroups].success
                        ? resFromOrg.data[indexGroups].data
                        : [],
            });

        if (indexStores > -1)
            setDataStores({
                loading: false,
                data:
                    resFromOrg.data[indexStores] && resFromOrg.data[indexStores].success
                        ? resFromOrg.data[indexStores].data
                        : [],
            });

        if (indexWarehouses > -1)
            setDataWarehouses({
                loading: false,
                data:
                    resFromOrg.data[indexWarehouses] && resFromOrg.data[indexWarehouses].success
                        ? resFromOrg.data[indexWarehouses].data
                        : [],
            });

        if (indexApplications > -1) {
            let tempdata =
                resFromOrg.data[indexApplications] && resFromOrg.data[indexApplications].success
                    ? resFromOrg.data[indexApplications].data.map((x) => ({
                        ...x,
                        description: (t(`app_${x.description}`.toLowerCase()) || "").toUpperCase(),
                    }))
                    : [];
            tempdata.sort(function (a, b) {
                if (a.description < b.description) {
                    return -1;
                }
                if (a.description > b.description) {
                    return 1;
                }
                return 0;
            });
            setDataApplications({
                loading: false,
                data: resFromOrg.data[indexApplications] && resFromOrg.data[indexApplications].success ? tempdata : [],
            });
        }
    }, [resFromOrg]);

    useEffect(() => {
        //PARA MODALES SE DEBE RESETEAR EN EL EDITAR
        reset({
            orgid: row ? row.orgid : dataOrganizationsTmp.length === 1 ? dataOrganizationsTmp[0].orgid : 0,
            rolegroups: row ? row.rolegroups : "",
            roledesc: row ? row.roledesc : '', //for table
            orgdesc: row ? row.orgdesc : '', //for table
            supervisordesc: row ? row.supervisordesc : '', //for table
            channelsdesc: row ? row.channelsdesc : '', //for table
            supervisor: row ? row.supervisor : '',
            type: row?.type || '',
            showbots: activateSwitchBots ? (row?.showbots || false) : true,
            channels: row?.channels || '',
            redirect: row?.redirect || '',
            groups: row?.groups || '',
            labels: row?.labels || '',
            status: 'DESCONECTADO',
            bydefault: row?.bydefault || false,
            warehouseid: row?.warehouseid || 0,
            storeid: row?.storeid || 0,
        });

        register('orgid', { validate: (value) => (value && value > 0) || t(langKeys.field_required) });
        register('rolegroups', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('type');
        register('showbots');
        register('supervisor');
        register("channels");
        register("redirect", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("groups");
        register("roledesc");
        register("orgdesc");
        register("supervisordesc");
        register("channelsdesc");
        register("status", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("labels");
        register("bydefault");
        register('warehouseid');
        register('storeid');

        setDataOrganizations({
            loading: false,
            data: dataOrganizationsTmp.filter(
                (x) => x.orgid === row?.orgid || !preData.some((y) => y?.orgid === x.orgid)
            ),
        });

        //forzar a que el select de aplicaciones renderice, por eso se desactivó el triggerOnChangeOnFirst en role
        if (row && row.id !== 0) {
            setDataApplications({ loading: true, data: [] });
            dispatch(getMultiCollectionAux([getApplicationsByRole(row.rolegroups, index + 1)]));
        }
    }, [preData]);

    const onSubmit = handleSubmit((data) => {
        //GUARDAR MODAL
        if (!row) updateRecords && updateRecords((p: Dictionary[]) => [...p, { ...data, operation: "INSERT" }]);
        else
            updateRecords &&
                updateRecords((p: Dictionary[]) =>
                    p.map((x) => (x.orgid === row ? { ...x, ...data, operation: x.operation || "UPDATE" } : x))
                );

        setActivateSwitchBots(propertyBots?.[0]?.propertyvalue === "1")
        // setOpenModal(false)
    });

    const onChangeOrganization = (value: Dictionary) => {
        setValue("orgid", value?.orgid || 0);
        setValue("orgdesc", value?.orgdesc || "");
        updateRecords &&
            updateRecords((p: Dictionary[], itmp: number) => {
                p[index] = { ...p[index], orgid: value?.orgid || 0, orgdesc: value?.orgdesc || "" };
                return p;
            });
        if (value) {
            setDataSupervisors({ loading: true, data: [] });
            setDataChannels({ loading: true, data: [] });
            setDataGroups({ loading: true, data: [] });
            setDataStores({ loading: true, data: [] });
            setDataWarehouses({ loading: true, data: [] });
            dispatch(
                getMultiCollectionAux([
                    getSupervisors(value.orgid, 0, index + 1),
                    getChannelsByOrg(value.orgid, index + 1),
                    getValuesFromDomain("GRUPOS", `_GRUPOS${index + 1}`, value.orgid),
                    getWarehouseSel(),
                    selStore(0),
                ])
            );
        } else {
            setDataSupervisors({ loading: false, data: [] });
            setDataChannels({ loading: false, data: [] });
            setDataGroups({ loading: false, data: [] });
            setDataStores({ loading: false, data: [] });
            setDataWarehouses({ loading: false, data: [] });
        }
    };

    const onChangeRole = (value: Dictionary) => {
        setValue("rolegroups", value.map((o: Dictionary) => o.roleid).join());
        setValue("roledesc", value.map((o: Dictionary) => o.roledesc).join());
        setValue("redirect", "");
        updatefield("redirect", "");
        switch (value.slice(-1)[0].roldesc) {
            case "GESTOR DE SEGURIDAD":
            case "GESTOR DE CAMPAÑAS":
            case "VISOR SD":
                if (activateSwitchBots) setValue("showbots", false)
                setValue("type", "SUPERVISOR")
                updatefield("type", "SUPERVISOR");
                updatefield("showbots", false);
                settypeSwitch(false)
                setActivateSwitchBots(false)
                break;
            default:

                if (value.slice(-1)[0].roldesc.includes("ASESOR")) {
                    if (activateSwitchBots) setValue("showbots", true)
                    setValue("type", "ASESOR")
                    updatefield("type", "ASESOR");
                    updatefield("showbots", true);
                    settypeSwitch(true)
                    setActivateSwitchBots(false)
                } else {
                    if (propertyBots?.[0]?.propertyvalue === "1") {
                        setActivateSwitchBots(true)
                        setValue("showbots", false)
                    }
                    setValue("type", "SUPERVISOR")
                    updatefield("type", "SUPERVISOR");
                    updatefield("showbots", false);
                    settypeSwitch(false)
                }
                break;
        }

        updateRecords &&
            updateRecords((p: Dictionary[], itmp: number) => {
                p[index] = {
                    ...p[index],
                    rolegroups: value.map((o: Dictionary) => o.roleid).join(),
                    roledesc: value.map((o: Dictionary) => o.roledesc).join(),
                };
                return p;
            });
        if (value.length) {
            setDataApplications({ loading: true, data: [] });
            dispatch(
                getMultiCollectionAux([getApplicationsByRole(value.map((o: Dictionary) => o.roleid).join(), index + 1)])
            );
        } else {
            setDataApplications({ loading: false, data: [] });
        }
    };
    return (
        <Accordion defaultExpanded={row?.id === 0} style={{ marginBottom: "8px" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                <Typography>{row?.orgid ? row.orgdesc : t(langKeys.neworganization)}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <form onSubmit={onSubmit} style={{ width: "100%" }}>
                    <div className="row-zyx">
                        <div className="col-6">
                            <FieldSelect
                                label={t(langKeys.organization)}
                                className={classes.mb2}
                                valueDefault={getValues("orgid")}
                                onChange={onChangeOrganization}
                                triggerOnChangeOnFirst={true}
                                error={errors?.orgid?.message}
                                data={dataOrganizations.data}
                                optionDesc="orgdesc"
                                optionValue="orgid"
                            />
                            <TemplateSwitchYesNo
                                label={t(langKeys.default_organization)}
                                className={classes.mb2}
                                valueDefault={row?.bydefault || false}
                                helperText={t(langKeys.default_organization_tooltip)}
                                onChange={(value) => {
                                    setValue("bydefault", value);
                                    updatefield("bydefault", value);
                                }}
                            />
                            <FieldMultiSelect
                                label={getValues("rolegroups")?.length > 2 ? "Roles" : t(langKeys.role)}
                                className={classes.mb2}
                                valueDefault={row?.rolegroups || ""}
                                onChange={onChangeRole}
                                error={errors?.rolegroups?.message}
                                data={dataRoles}
                                optionDesc="roldesc"
                                optionValue="roleid"
                            />
                            <div className="row-zyx">
                                <TemplateSwitchYesNo
                                    label={"Balanceo"}
                                    className="col-6"
                                    valueDefault={typeSwitch}
                                    onChange={(value) => {
                                        setValue('type', value ? "ASESOR" : "SUPERVISOR");
                                        settypeSwitch(value)
                                        updatefield("type", value ? "ASESOR" : "SUPERVISOR");
                                    }} />
                                {activateSwitchBots &&

                                    <TemplateSwitchYesNo
                                        label={"Visualización Bots"}
                                        helperText={t(langKeys.visualizationBotTooltip)}
                                        className="col-6"
                                        valueDefault={getValues("showbots")}
                                        onChange={(value) => {
                                            setValue('showbots', value);
                                            updatefield("showbots", value);
                                        }} />
                                }

                            </div>
                            {/*<FieldSelect
                                label={t(langKeys.store)}
                                className={classes.mb2}
                                valueDefault={getValues('storeid')}
                                error={errors?.storeid?.message}
                                data={dataStores.data}
                                onChange={(value) => setValue('storeid', value.storeid)}
                                loading={dataStores.loading}
                                triggerOnChangeOnFirst={true}
                                optionDesc="description"
                                optionValue="storeid"
                            />*/}
                        </div>
                        <div className="col-6">
                            <FieldSelect
                                label={t(langKeys.supervisor)}
                                className={classes.mb2}
                                valueDefault={row?.supervisor || ""}
                                triggerOnChangeOnFirst={true}
                                onChange={(value) => {
                                    setValue("supervisor", value ? value.usr : "");
                                    setValue("supervisordesc", value ? value.userdesc : "");
                                    updatefield("supervisor", value?.usr || "");
                                    updatefield("supervisordesc", value?.userdesc || "");
                                }}
                                error={errors?.supervisor?.message}
                                data={dataSupervisors.data}
                                loading={dataSupervisors.loading}
                                optionDesc="userdesc"
                                optionValue="usr"
                            />

                            <FieldSelect
                                label={t(langKeys.default_application)}
                                className={classes.mb2}
                                valueDefault={getValues("redirect")}
                                onChange={(value) => {
                                    setValue("redirect", value?.path || "");
                                    updatefield("redirect", value?.path || "");
                                }}
                                error={errors?.redirect?.message}
                                data={dataApplications.data}
                                loading={dataApplications.loading}
                                triggerOnChangeOnFirst={true}
                                helperText={t(langKeys.default_application_tooltip)}
                                optionDesc="description"
                                optionValue="path"
                            />
                            <FieldMultiSelect //los multiselect te devuelven un array de objetos en OnChange por eso se le recorre
                                label={t(langKeys.group)}
                                className={classes.mb2}
                                valueDefault={row?.groups || ""}
                                onChange={(value) => {
                                    setValue("groups", value.map((o: Dictionary) => o.domainvalue).join());
                                    updatefield("groups", value.map((o: Dictionary) => o.domainvalue).join());
                                }}
                                error={errors?.groups?.message}
                                loading={dataGroups.loading}
                                data={dataGroups.data}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            />
                            <FieldMultiSelect //los multiselect te devuelven un array de objetos en OnChange por eso se le recorre
                                label={t(langKeys.channel)}
                                className={classes.mb2}
                                valueDefault={row?.channels || ""}
                                onChange={(value) => {
                                    setValue("channels", value.map((o: Dictionary) => o.communicationchannelid).join());
                                    setValue("channelsdesc", value.map((o: Dictionary) => o.description).join());
                                    updatefield(
                                        "channels",
                                        value.map((o: Dictionary) => o.communicationchannelid).join()
                                    );
                                    updatefield("channelsdesc", value.map((o: Dictionary) => o.description).join());
                                }}
                                error={errors?.channels?.message}
                                loading={dataChannels.loading}
                                data={dataChannels.data}
                                optionDesc="description"
                                optionValue="communicationchannelid"
                            />
                            {/*<FieldSelect
                                label={t(langKeys.warehouse)}
                                className={classes.mb2}
                                valueDefault={getValues('warehouseid')}
                                error={errors?.warehouseid?.message}
                                data={dataWarehouses.data}
                                onChange={(value) => setValue('warehouseid', value.warehouseid)}
                                loading={dataWarehouses.loading}
                                triggerOnChangeOnFirst={true}
                                optionDesc="description"
                                optionValue="warehouseid"
                            />*/}
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<DeleteIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => handleDelete(row, index)}
                        >
                            {t(langKeys.delete)}
                        </Button>
                    </div>
                </form>
            </AccordionDetails>
        </Accordion>
    );
};

interface ModalPasswordProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => any;
    data: any;
    parentSetValue: (...param: any) => any;
}

const ModalPassword: React.FC<ModalPasswordProps> = ({ openModal, setOpenModal, data, parentSetValue }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const mainMultiResult = useSelector((state) => state.main.multiData);
    const securityRules = mainMultiResult.data.filter((x) => x.key === "UFN_SECURITYRULES_SEL")?.[0];
    const [passwordConditions, setpasswordConditions] = useState({
        samepassword: Boolean(data?.password),
        mincharacters: (data?.password || "").length >= (securityRules?.data?.[0]?.mincharacterspwd || 0),
        maxcharacters: (data?.password || "").length <= (securityRules?.data?.[0]?.maxcharacterspwd || 0),
        consecutivecharacters: validateNumbersEqualsConsecutive(
            data?.password || "",
            securityRules?.data?.[0]?.numequalconsecutivecharacterspwd ||
            securityRules?.data?.[0]?.maxcharacterspwd ||
            0
        ),
        lowercaseletters: validateDomainCharacters(
            data?.password || "",
            "a-z",
            securityRules?.data?.[0]?.lowercaseletterspwd || "04"
        ),
        uppercaseletters: validateDomainCharacters(
            data?.password || "",
            "A-Z",
            securityRules?.data?.[0]?.uppercaseletterspwd || "04"
        ),
        numbers: validateDomainCharacters(
            data?.password || "",
            "1-9",
            securityRules?.data?.[0]?.numericalcharacterspwd || "04"
        ),
        specialcharacters: validateDomainCharactersSpecials(
            data?.password || "",
            securityRules?.data?.[0]?.specialcharacterspwd || "04"
        ),
    });
    const dataFieldSelect = [
        { name: "Empieza", value: "01" },
        { name: "Incluye", value: "02" },
        { name: "Más de 1", value: "03" },
        { name: "No Considera", value: "04" },
        { name: "Termina", value: "05" },
    ];

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
        trigger,
        clearErrors,
    } = useForm({
        defaultValues: {
            password: "",
            confirmpassword: "",
            generate_password: false,
            send_password_by_email: false,
            change_password_on_login: false,
        },
    });

    useEffect(() => {
        setValue("password", data?.password);
        setValue("confirmpassword", data?.password);
        setValue("send_password_by_email", data?.send_password_by_email);
        setValue("change_password_on_login", data?.pwdchangefirstlogin);
    }, [data]);

    useEffect(() => {
        register("password", { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register("confirmpassword", {
            validate: (value: any) => (value && value.length) || t(langKeys.field_required),
        });
    }, []);

    const setRandomPassword = (value: boolean) => {
        if (value) {
            const rndPassword = randomText(10, true, true, true);
            setValue("password", rndPassword);
            setValue("confirmpassword", rndPassword);
            trigger();
        }
    };

    const handleCancelModal = () => {
        setOpenModal(false);
        setValue("password", data?.password);
        setValue("confirmpassword", data?.password);
        setValue("send_password_by_email", data?.send_password_by_email);
        setValue("change_password_on_login", data?.pwdchangefirstlogin);
        clearErrors();
        setpasswordConditions({
            ...passwordConditions,
            samepassword: Boolean(data?.password),
            mincharacters: (data?.password || "").length >= (securityRules?.data?.[0]?.mincharacterspwd || 0),
            maxcharacters: (data?.password || "").length <= (securityRules?.data?.[0]?.maxcharacterspwd || 0),
            consecutivecharacters: validateNumbersEqualsConsecutive(
                data?.password || "",
                securityRules?.data?.[0]?.numequalconsecutivecharacterspwd ||
                securityRules?.data?.[0]?.maxcharacterspwd ||
                0
            ),
            lowercaseletters: validateDomainCharacters(
                data?.password || "",
                "a-z",
                securityRules?.data?.[0]?.lowercaseletterspwd || "04"
            ),
            uppercaseletters: validateDomainCharacters(
                data?.password || "",
                "A-Z",
                securityRules?.data?.[0]?.uppercaseletterspwd || "04"
            ),
            numbers: validateDomainCharacters(
                data?.password || "",
                "1-9",
                securityRules?.data?.[0]?.numericalcharacterspwd || "04"
            ),
            specialcharacters: validateDomainCharactersSpecials(
                data?.password || "",
                securityRules?.data?.[0]?.specialcharacterspwd || "04"
            ),
        });
    };
    //

    const onSubmitPassword = handleSubmit((data) => {
        if (!!Object.values(passwordConditions).reduce((acc, x) => acc * Number(x), 1)) {
            parentSetValue("password", data.password);
            parentSetValue("send_password_by_email", data.send_password_by_email);
            parentSetValue("pwdchangefirstlogin", data.change_password_on_login);
            setOpenModal(false);
        } else {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.invalid_password) }));
        }
    });

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.setpassword)}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.save)}
            handleClickButton1={handleCancelModal}
            handleClickButton2={onSubmitPassword}
        >
            <div className="row-zyx">
                <TemplateSwitch
                    label={t(langKeys.generate_password)}
                    className="col-4"
                    valueDefault={getValues("generate_password")}
                    onChange={setRandomPassword}
                />
                <TemplateSwitch
                    label={t(langKeys.send_password_by_email)}
                    className="col-4"
                    valueDefault={getValues("send_password_by_email")}
                    onChange={(value) => setValue("send_password_by_email", value)}
                />
                <TemplateSwitch
                    label={t(langKeys.change_password_on_login)}
                    className="col-4"
                    valueDefault={getValues("change_password_on_login")}
                    onChange={(value) => setValue("change_password_on_login", value)}
                />
            </div>
            <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.password)}
                    className="col-6"
                    valueDefault={getValues("password")}
                    type={showPassword ? "text" : "password"}
                    onChange={(value) => {
                        setpasswordConditions({
                            ...passwordConditions,
                            samepassword: getValues("confirmpassword") === value,
                            mincharacters: value.length >= (securityRules?.data?.[0]?.mincharacterspwd || 0),
                            maxcharacters: value.length <= (securityRules?.data?.[0]?.maxcharacterspwd || 0),
                            consecutivecharacters: validateNumbersEqualsConsecutive(
                                value,
                                securityRules?.data?.[0]?.numequalconsecutivecharacterspwd ||
                                securityRules?.data?.[0]?.maxcharacterspwd ||
                                0
                            ),
                            lowercaseletters: validateDomainCharacters(
                                value,
                                "a-z",
                                securityRules?.data?.[0]?.lowercaseletterspwd || "04"
                            ),
                            uppercaseletters: validateDomainCharacters(
                                value,
                                "A-Z",
                                securityRules?.data?.[0]?.uppercaseletterspwd || "04"
                            ),
                            numbers: validateDomainCharacters(
                                value,
                                "1-9",
                                securityRules?.data?.[0]?.numericalcharacterspwd || "04"
                            ),
                            specialcharacters: validateDomainCharactersSpecials(
                                value,
                                securityRules?.data?.[0]?.specialcharacterspwd || "04"
                            ),
                        });
                        setValue("password", value);
                    }}
                    error={errors?.password?.message}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <FieldEdit
                    label={t(langKeys.confirmpassword)}
                    className="col-6"
                    valueDefault={getValues("confirmpassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    onChange={(value) => {
                        setpasswordConditions({ ...passwordConditions, samepassword: getValues("password") === value });
                        setValue("confirmpassword", value);
                    }}
                    error={errors?.confirmpassword?.message}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    edge="end"
                                >
                                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </div>
            <div>
                <div className={classes.paswordCondition}>
                    <span>{t(langKeys.passwordCond1)}</span>
                    <span
                        className={clsx(classes.badge, {
                            [classes.badgeSuccess]: passwordConditions.samepassword,
                            [classes.badgeFailure]: !passwordConditions.samepassword,
                        })}
                    >
                        {passwordConditions.samepassword ? t(langKeys.yes) : t(langKeys.no)}
                    </span>
                </div>
                {!!securityRules?.data?.[0]?.mincharacterspwd && (
                    <div className={classes.paswordCondition}>
                        <span>{t(langKeys.passwordCond2)}</span>
                        <span
                            className={clsx(classes.badge, {
                                [classes.badgeSuccess]: passwordConditions.mincharacters,
                                [classes.badgeFailure]: !passwordConditions.mincharacters,
                            })}
                        >
                            {securityRules?.data?.[0]?.mincharacterspwd}
                        </span>
                    </div>
                )}
                {!!securityRules?.data?.[0]?.maxcharacterspwd && (
                    <div className={classes.paswordCondition}>
                        <span>{t(langKeys.passwordCond3)}</span>
                        <span
                            className={clsx(classes.badge, {
                                [classes.badgeSuccess]: passwordConditions.maxcharacters,
                                [classes.badgeFailure]: !passwordConditions.maxcharacters,
                            })}
                        >
                            {securityRules?.data?.[0]?.maxcharacterspwd}
                        </span>
                    </div>
                )}
                {!!securityRules?.data?.[0]?.allowsconsecutivenumbers && (
                    <div className={classes.paswordCondition}>
                        <span>{t(langKeys.passwordCond4)}</span>
                        <span
                            className={clsx(classes.badge, {
                                [classes.badgeSuccess]: passwordConditions.consecutivecharacters,
                                [classes.badgeFailure]: !passwordConditions.consecutivecharacters,
                            })}
                        >
                            {securityRules?.data?.[0]?.numequalconsecutivecharacterspwd}
                        </span>
                    </div>
                )}
                {securityRules?.data?.[0]?.lowercaseletterspwd !== "04" && (
                    <div className={classes.paswordCondition}>
                        <span>{t(langKeys.passwordCond7)}</span>
                        <span
                            className={clsx(classes.badge, {
                                [classes.badgeSuccess]: passwordConditions.lowercaseletters,
                                [classes.badgeFailure]: !passwordConditions.lowercaseletters,
                            })}
                        >
                            {
                                dataFieldSelect.filter(
                                    (x: any) => x.value === (securityRules?.data?.[0]?.lowercaseletterspwd || "04")
                                )[0].name
                            }
                        </span>
                    </div>
                )}
                {securityRules?.data?.[0]?.uppercaseletterspwd !== "04" && (
                    <div className={classes.paswordCondition}>
                        <span>{t(langKeys.passwordCond8)}</span>
                        <span
                            className={clsx(classes.badge, {
                                [classes.badgeSuccess]: passwordConditions.uppercaseletters,
                                [classes.badgeFailure]: !passwordConditions.uppercaseletters,
                            })}
                        >
                            {
                                dataFieldSelect.filter(
                                    (x: any) => x.value === (securityRules?.data?.[0]?.uppercaseletterspwd || "04")
                                )[0].name
                            }
                        </span>
                    </div>
                )}
                {securityRules?.data?.[0]?.numericalcharacterspwd !== "04" && (
                    <div className={classes.paswordCondition}>
                        <span>{t(langKeys.passwordCond9)}</span>
                        <span
                            className={clsx(classes.badge, {
                                [classes.badgeSuccess]: passwordConditions.numbers,
                                [classes.badgeFailure]: !passwordConditions.numbers,
                            })}
                        >
                            {
                                dataFieldSelect.filter(
                                    (x: any) => x.value === (securityRules?.data?.[0]?.numericalcharacterspwd || "04")
                                )[0].name
                            }
                        </span>
                    </div>
                )}
                <div className={classes.paswordCondition}>
                    <span>{t(langKeys.passwordCond5)}</span>
                    <span
                        className={clsx(classes.badge, {
                            [classes.badgeSuccess]: passwordConditions.specialcharacters,
                            [classes.badgeFailure]: !passwordConditions.specialcharacters,
                        })}
                    >
                        {
                            dataFieldSelect.filter(
                                (x: any) => x.value === (securityRules?.data?.[0]?.specialcharacterspwd || "04")
                            )[0].name
                        }
                    </span>
                </div>
                <div className={classes.paswordCondition}>
                    <span>{t(langKeys.passwordCond6)}</span>
                </div>
            </div>
        </DialogZyx>
    );
};

const DetailUsers: React.FC<DetailProps> = ({
    data: { row, edit },
    setViewSelected,
    multiData,
    fetchData,
    arrayBread,
}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector((state) => state.activationuser.saveUser);
    const detailRes = useSelector((state) => state.main.mainAux);
    const domainsCustomTable = useSelector((state) => state.main.mainAux2);
    const user = useSelector((state) => state.login.validateToken.user);

    const [dataOrganizations, setDataOrganizations] = useState<(Dictionary | null)[]>([]);
    const [orgsToDelete, setOrgsToDelete] = useState<Dictionary[]>([]);
    const [openDialogStatus, setOpenDialogStatus] = useState(false);
    const [openDialogPassword, setOpenDialogPassword] = useState(false);

    const [triggerSave, setTriggerSave] = useState(false);
    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataDocType = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataCompanies = multiData[2] && multiData[2].success ? multiData[2].data : [];
    const dataBillingGroups = multiData[3] && multiData[3].success ? multiData[3].data : [];
    const dataStatusUsers = multiData[4] && multiData[4].success ? multiData[4].data : [];
    const [allIndex, setAllIndex] = useState([]);
    const [getOrganizations, setGetOrganizations] = useState(false);
    const [waitUploadFile, setWaitUploadFile] = useState(false);
    const [pageSelected, setPageSelected] = useState(0);
    const [skipAutoReset, setSkipAutoReset] = useState(false)
    const [updatingDataTable, setUpdatingDataTable] = useState(false);
    const [tableDataVariables, setTableDataVariables] = useState<Dictionary[]>([]);

    const updateCell = (rowIndex: number, columnId: string, value: string) => {
        setSkipAutoReset(true);
        debugger
        const auxTableData = tableDataVariables
        auxTableData[rowIndex][columnId] = value
        setTableDataVariables(auxTableData)
        setUpdatingDataTable(!updatingDataTable);
    }

    useEffect(() => {
        if (multiData[13]) {
            const variableDataList = multiData[13].data || []
            setTableDataVariables(variableDataList.map(x => ({ ...x, value: row?.variablecontext[x.variablename] || "" })))
        }
    }, [multiData]);

    const uploadResult = useSelector((state) => state.main.uploadFile);

    useEffect(() => {
        //RECIBE LA DATA DE LAS ORGANIZACIONES
        if (!detailRes.loading && !detailRes.error && getOrganizations) {
            setDataOrganizations(detailRes.data);
        }
    }, [detailRes]);

    const handleRegister = () => {
        setDataOrganizations((p) => [...p, { id: 0 }]);
    };
    const handleDelete = (row: Dictionary | null, index: number) => {
        if (row && row.id !== 0 && row.operation !== "INSERT") {
            setOrgsToDelete((p) => [...p, { ...row, operation: "DELETE", status: "ELIMINADO" }]);
        }
        const filterDataOrg = dataOrganizations.filter((x, i) => i !== index);
        setDataOrganizations(filterDataOrg);
    };

    useEffect(() => {
        if (waitUploadFile) {
            if (!uploadResult.loading && !uploadResult.error) {
                setValue("image", uploadResult.url);
                setWaitUploadFile(false);
            } else if (uploadResult.error) {
                setWaitUploadFile(false);
            }
        }
    }, [waitUploadFile, uploadResult]);

    const onSelectImage = (files: any) => {
        const selectedFile = files[0];
        var fd = new FormData();
        fd.append("file", selectedFile, selectedFile.name);
        dispatch(uploadFile(fd));
        setWaitUploadFile(true);
    };

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm({
        defaultValues: {
            type: "NINGUNO",
            id: edit ? row?.userid || 0 : 0,
            operation: edit ? (row ? "EDIT" : "INSERT") : "INSERT",
            description: row?.description || "",
            firstname: row?.firstname || "",
            lastname: row?.lastname || "",
            password: edit ? row?.password || "" : "",
            usr: row?.usr || "",
            email: edit ? row?.email || "" : "",
            doctype: row?.doctype || "",
            docnum: row?.docnum || "",
            company: row?.company || "",
            billinggroupid: row?.billinggroupid || 0,
            registercode: row?.registercode || "",
            twofactorauthentication: row?.twofactorauthentication || false,
            status: row?.status || "ACTIVO",
            image: row?.image || null,
            send_password_by_email: false,
            pwdchangefirstlogin: false,
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
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", {
                    module: t(langKeys.user).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave]);

    const emailRequired = (value: string) => {
        if (value.length === 0) {
            return t(langKeys.field_required) as string;
        } else if (!/\S+@\S+\.\S+/.test(value)) {
            return t(langKeys.emailverification) as string;
        }
    };

    React.useEffect(() => {
        register("type");
        register("id");
        register("password");
        register("status", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("firstname", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("lastname", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("usr", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("email", { validate: emailRequired, value: "" });
        register("doctype", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("docnum", {
            validate: {
                needsvalidation: (value: any) => (value && value.length) || t(langKeys.field_required),
                dnivalidation: (value: any) =>
                    getValues("doctype") === "DNI"
                        ? (value && value.length === 8) || t(langKeys.doctype_dni_error)
                        : true,
                cevalidation: (value: any) =>
                    getValues("doctype") === "CE"
                        ? (value && value.length === 12) || t(langKeys.doctype_foreigners_card)
                        : true,
                rucvalidation: (value: any) =>
                    getValues("doctype") === "RUC"
                        ? (value && value.length === 11) || t(langKeys.doctype_ruc_error)
                        : true,
            },
        });
        register("billinggroupid");
        register("description");
        register("twofactorauthentication");
        register("image");

        dispatch(resetMainAux());
        if (row && edit) {
            setGetOrganizations(true);
            dispatch(getCollectionAux(getOrgUserSel(row?.userid || 0, 0))); //TRAE LAS ORGANIZACIONES ASIGNADAS DEL USUARIO
        }
        if (!row) setDataOrganizations((p) => [...p, { id: 0 }]);
    }, [register]);

    useEffect(() => {
        if (allIndex.length === dataOrganizations.length && triggerSave) {
            setTriggerSave(false);
            const error = allIndex.some((x: any) => !x.allOk);
            if (error) {
                return;
            }
            if (!dataOrganizations.some((x) => x?.bydefault)) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.organization_by_default) }));
                return;
            } else if (dataOrganizations.filter((x) => x?.bydefault).length > 1) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.organization_by_default) }));
                return;
            }
            const data = getValues();

            const callback = () => {
                dispatch(showBackdrop(true));
                dispatch(
                    saveUser(
                        {
                            header: insUser({
                                ...data, language: t(langKeys.currentlanguage),
                                variablecontext: tableDataVariables.filter(x => x.value).reduce((acc, x) => ({ ...acc, [x.variablename]: x.value }), {})
                            }),
                            detail: [
                                ...dataOrganizations.filter((x) => x && x?.operation).map((x) => x && insOrgUser(x)),
                                ...orgsToDelete.map((x) => insOrgUser(x)),
                            ]!,
                        },
                        true
                    )
                );
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
    }, [allIndex, triggerSave]);

    const onSubmit = handleSubmit((data) => {
        if ((!row || !edit) && !data.password && user?.properties.environment === "CLARO") {
            data.password = '$2y$10$Pc4Aiy6e/gnatp.EowJAnuxe03pJpdavyG9q0K3o7GRKlmkPkEOEW'
        }

        if (!row && !data.password) {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.password_required) }));
            return;
        }
        if (!edit && data.password === "") {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.password_required) }));
            return;
        }
        setTriggerSave(true);
        setAllIndex([]);
    });

    const onChangeStatus = (value: Dictionary) => {
        setValue("status", value ? value.domainvalue : "");
        value && setOpenDialogStatus(true);
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
                            breadcrumbs={[
                                ...arrayBread,
                                { id: "view-2", name: `${t(langKeys.user)} ${t(langKeys.detail)}` },
                            ]}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={
                                edit
                                    ? row
                                        ? `${row.firstname} ${row.lastname}`
                                        : t(langKeys.newuser)
                                    : t(langKeys.newuser)
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
                        <>
                            <Button
                                variant="contained"
                                color="primary"
                                type="button"
                                startIcon={<LockOpenIcon color="secondary" />}
                                onClick={() => setOpenDialogPassword(true)}
                            >
                                {t(
                                    edit ? (row ? langKeys.changePassword : langKeys.setpassword) : langKeys.setpassword
                                )}
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                            >
                                {t(langKeys.save)}
                            </Button>
                        </>
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
                    <AntTab label={t(langKeys.userinformation)} />
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
                    <div className="row-zyx">
                        <div
                            className="col-6"
                            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                            <div style={{ position: "relative" }}>
                                <Avatar style={{ width: 120, height: 120 }} src={getValues("image")} />
                                <input
                                    name="file"
                                    accept="image/*"
                                    id="laraigo-upload-csv-file"
                                    type="file"
                                    style={{ display: "none" }}
                                    onChange={(e) => onSelectImage(e.target.files)}
                                />
                                <label htmlFor="laraigo-upload-csv-file">
                                    <Avatar
                                        style={{
                                            position: "absolute",
                                            bottom: 0,
                                            right: 0,
                                            backgroundColor: "#7721ad",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <CameraAltIcon style={{ color: "#FFF" }} />
                                    </Avatar>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.firstname)}
                            style={{ marginBottom: 8 }}
                            className="col-6"
                            valueDefault={row?.firstname || ""}
                            onChange={(value) => setValue("firstname", value)}
                            error={errors?.firstname?.message}
                        />
                        <FieldSelect
                            label={t(langKeys.billingGroup)}
                            className="col-6"
                            valueDefault={row?.billinggroupid || ""}
                            onChange={(value) => setValue("billinggroupid", value ? value.domainid : 0)}
                            error={errors?.billinggroupid?.message}
                            data={dataBillingGroups}
                            optionDesc="domaindesc"
                            optionValue="domainid"
                            helperText={t(langKeys.billingGroup_tooltip)}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.lastname)}
                            className="col-6"
                            valueDefault={row?.lastname || ""}
                            onChange={(value) => setValue("lastname", value)}
                            error={errors?.lastname?.message}
                        />
                        <FieldSelect
                            label={t(langKeys.twofactorauthentication)}
                            className="col-6"
                            valueDefault={getValues("twofactorauthentication") ? "ACTIVO" : "INACTIVO"}
                            onChange={(value) =>
                                setValue("twofactorauthentication", value ? value.domainvalue === "ACTIVO" : false)
                            }
                            error={errors?.twofactorauthentication?.message}
                            data={dataStatus}
                            uset={true}
                            helperText={t(langKeys.twofactorauthentication_tooltip)}
                            prefixTranslation="status_"
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={`${t(langKeys.email)}`}
                            className="col-6"
                            valueDefault={edit ? row?.email || "" : ""}
                            onChange={(value) => setValue("email", value)}
                            error={errors?.email?.message}
                        />
                        <FieldSelect
                            label={t(langKeys.company)}
                            className="col-6"
                            valueDefault={row?.company || ""}
                            onChange={(value) => setValue("company", value ? value.domainvalue : "")}
                            error={errors?.company?.message}
                            data={dataCompanies}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                            helperText={t(langKeys.company_tooltip)}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.docType)}
                            className="col-6"
                            valueDefault={row?.doctype || ""}
                            onChange={(value) => setValue("doctype", value ? value.domainvalue : "")}
                            error={errors?.doctype?.message}
                            data={dataDocType}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                        />
                        <FieldEdit
                            label={t(langKeys.registerCode)}
                            className="col-6"
                            valueDefault={row?.registercode || ""}
                            onChange={(value) => setValue("registercode", value)}
                            error={errors?.registercode?.message}
                            helperText={t(langKeys.registerCode_tooltip)}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.docNumber)}
                            className="col-6"
                            valueDefault={row?.docnum || ""}
                            type="number"
                            onChange={(value) => setValue("docnum", value)}
                            error={errors?.docnum?.message}
                        />
                        <FieldSelect
                            label={t(langKeys.status)}
                            className="col-6"
                            valueDefault={row?.status || "ACTIVO"}
                            onChange={onChangeStatus}
                            uset={true}
                            error={errors?.status?.message}
                            data={dataStatusUsers}
                            prefixTranslation="status_"
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                            helperText={t(langKeys.userstatus_tooltip)}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={`${t(langKeys.user)}`}
                            className="col-6"
                            valueDefault={edit ? row?.usr || "" : ""}
                            onChange={(value) => setValue("usr", value)}
                            error={errors?.usr?.message}
                            helperText={t(langKeys.user_tooltip)}
                        />
                    </div>
                </div>}
                {pageSelected === 1 &&
                    <div className={classes.containerDetail}>
                        <CustomTableZyxEditable
                            columns={columns}
                            data={(tableDataVariables).map(x => ({
                                ...x,
                                domainvalues: (domainsCustomTable?.data || []).filter(y => y.domainname === x?.domainname)
                            }))}
                            download={false}
                            //loading={multiData.loading}
                            register={false}
                            filterGeneral={false}
                            updateCell={updateCell}
                            skipAutoReset={skipAutoReset}
                        />
                    </div>}
            </form>

            <div className={classes.containerDetail} style={{ display: pageSelected === 0 ? "" : "None" }}>
                {detailRes.error ? (
                    <h1>ERROR</h1>
                ) : (
                    <div>
                        <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between" }}>
                            <div className={classes.title}>{t(langKeys.organization_permissions)}</div>
                            <div>
                                <Button
                                    className={classes.button}
                                    variant="contained"
                                    color="primary"
                                    disabled={detailRes.loading}
                                    startIcon={<AddIcon color="secondary" />}
                                    onClick={handleRegister}
                                    style={{ backgroundColor: "#55BD84" }}
                                >
                                    {t(langKeys.register)}
                                </Button>
                            </div>
                        </div>
                        {detailRes.loading ? (
                            <ListItemSkeleton />
                        ) : (
                            dataOrganizations.map((item, index) => (
                                <DetailOrgUser
                                    key={item?.orgid || `detail${index * 1000}`}
                                    index={index}
                                    data={{ row: item, edit }}
                                    multiData={multiData}
                                    updateRecords={setDataOrganizations}
                                    preData={dataOrganizations}
                                    triggerSave={triggerSave}
                                    handleDelete={handleDelete}
                                    setAllIndex={setAllIndex}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>
            <DialogZyx
                open={openDialogStatus}
                title={t(langKeys.status)}
                buttonText1={t(langKeys.save)}
                handleClickButton1={() => setOpenDialogStatus(false)}
            >
                <FieldEdit
                    label={t(langKeys.description)}
                    className="col-6"
                    valueDefault={row?.description || ""}
                    onChange={(value) => setValue("description", value)}
                    error={errors?.description?.message}
                />
            </DialogZyx>
            <ModalPassword
                openModal={openDialogPassword}
                setOpenModal={setOpenDialogPassword}
                data={getValues()}
                parentSetValue={setValue}
            />
        </div>
    );
};

const IDUSER = "IDUSER"

const Users: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector((state) => state.main.mainData);
    const mainMultiResult = useSelector((state) => state.main.multiData);
    const executeRes = useSelector((state) => state.activationuser.saveUser);
    const deleteResult = useSelector((state) => state.activationuser.delUser);
    const [dataUsers, setdataUsers] = useState<Dictionary[]>([]);
    const memoryTable = useSelector(state => state.main.memoryTable);
    // const [dataOrganizationsTmp, setdataOrganizationsTmp] = useState<Dictionary[]>([]);
    const [dataChannelsTemp, setdataChannelsTemp] = useState<Dictionary[]>([]);
    const [waitImport, setWaitImport] = useState(false);
    const [waitChanges, setwaitChanges] = useState(false);
    const [cleanImport, setCleanImport] = useState(false);
    const domains = useSelector((state) => state.person.editableDomains);
    const user = useSelector((state) => state.login.validateToken.user);
    useEffect(() => {
        // setdataOrganizationsTmp(mainMultiResult.data[8] && mainMultiResult.data[8].success ? mainMultiResult.data[8].data : [])
        setdataChannelsTemp(
            mainMultiResult.data[10] && mainMultiResult.data[10].success ? mainMultiResult.data[10].data : []
        );
    }, [mainMultiResult.data]);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);
    const [waitCheck, setWaitCheck] = useState(false);
    const [operation, setOperation] = useState("REGISTER");
    const [fileToUpload, setFileToUpload] = useState(null);
    const mainAuxResult = useSelector(state => state.main.mainAux);
    const [messageError, setMessageError] = useState('');
    const [importCount, setImportCount] = useState(0)
    const propertyBots = mainMultiResult?.data?.[12] && mainMultiResult?.data?.[12].success ? mainMultiResult?.data?.[12].data : []
    const arrayBread = [
        { id: "view-1", name: t(langKeys.user_plural) },
    ];
    function redirectFunc(view: string) {
        setViewSelected(view);
    }

    const columns = React.useMemo(
        () => [
            {
                accessor: "userid",
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: "1%",
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                            extraOption={t(langKeys.duplicate)}
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                            extraFunction={() => handleDuplicate(row)}
                            ExtraICon={() => <DuplicateIcon width={28} style={{ fill: "#7721AD" }} />}
                        />
                    );
                },
            },
            {
                Header: t(langKeys.name),
                accessor: "firstname",
                NoFilter: true,
            },
            {
                Header: t(langKeys.lastname),
                accessor: "lastname",
                NoFilter: true,
            },
            {
                Header: `${t(langKeys.user)}`,
                accessor: "usr",
                NoFilter: true,
            },
            {
                Header: `${t(langKeys.email)}`,
                accessor: "email",
                NoFilter: true,
            },
            {
                Header: t(langKeys.attention_group),
                accessor: "groups",
                NoFilter: true,
            },
            {
                Header: t(langKeys.role),
                accessor: "roledesc",
                NoFilter: true,
            },
            {
                Header: t(langKeys.status),
                accessor: "status",
                NoFilter: true,
                prefixTranslation: "status_",
                Cell: (props: CellProps<Dictionary>) => {
                    if (props.cell.row.original) {
                        const { status } = props.cell.row.original;
                        return (t(`status_${status}`.toLowerCase()) || "").toUpperCase();
                    }
                    return null

                },
            },
            {
                Header: t(langKeys.billingGroup),
                accessor: "billinggroup",
                NoFilter: true,
            },
        ],
        []
    );
    const handleTemplate = () => {
        const data = [
            {},
            {},
            {},
            domains.value?.company?.reduce((a, d) => ({ ...a, [d.domainvalue]: d.domaindesc }), {}),
            domains.value?.docTypes.reduce(
                (a, d) => ({ ...a, [d.domainvalue]: t(`type_documenttype_${d.domainvalue?.toLowerCase()}`) }),
                {}
            ),
            {},
            domains.value?.billinggroups?.reduce((a, d) => ({ ...a, [d.domainid]: d.domaindesc }), {}),
            {},
            domains.value?.genericstatus?.reduce(
                (a, d) => ({ ...a, [d.domainvalue]: t(`status_${d.domainvalue?.toLowerCase()}`) }),
                {}
            ),
            domains.value?.userstatus?.reduce(
                (a, d) => ({ ...a, [d.domainvalue]: t(`status_${d.domainvalue?.toLowerCase()}`) }),
                {}
            ),
            {},
            {},
            {},
            { true: "true", false: "false" },
            domains.value?.roles?.reduce((a, d) => ({ ...a, [d.roleid]: d.roldesc }), {}),
            dataChannelsTemp.reduce((a, d) => ({ ...a, [d.communicationchannelid]: d.description }), {}),
            domains.value?.usergroup?.reduce((a, d) => ({ ...a, [d.domainvalue]: d.domaindesc }), {}),
            { true: "true", false: "false" },
            { true: "true", false: "false" },
        ];
        const header = [
            "firstname",
            "lastname",
            "email",
            "company",
            "doctype",
            "docnum",
            "billinggroup",
            "registercode",
            "twofactorauthentication",
            "status",
            "image",
            "user",
            "password",
            "pwdchangefirstlogin",
            "role",
            "channels",
            "groups",
            "balanced",
            'showbots',
        ];
        if (mainMultiResult?.data?.[12]?.data?.[0]?.propertyvalue !== "1") {
            data.pop();
            header.pop();
        }
        exportExcel(`${t(langKeys.template)} ${t(langKeys.import)}`, templateMaker(data, header));
    };
    const handleTemplateDrop = () => {
        const data = [
            {},
            domains.value?.userstatus?.reduce(
                (a, d) => ({ ...a, [d.domainvalue]: t(`status_${d.domainvalue?.toLowerCase()}`) }),
                {}
            ),
            { 0: "true", 1: "false" },
        ];
        const header = ["username", "status", "delete"];
        exportExcel(`${t(langKeys.template)} ${t(langKeys.dropusers)}`, templateMaker(data, header));
    };

    const fetchData = () => dispatch(getCollection(getUserSel(0)));

    useEffect(() => {
        mainResult.data && setdataUsers(mainResult.data);
    }, [mainResult]);

    useEffect(() => {
        fetchData();
        dispatch(getDomainsByTypename());
        dispatch(getMultiCollection([
            getValuesFromDomain("ESTADOGENERICO"),
            getValuesFromDomain("TIPODOCUMENTO"),
            getValuesFromDomain("EMPRESA"),
            getValuesFromDomain("GRUPOFACTURACION"),
            getValuesFromDomain("ESTADOUSUARIO"),
            getValuesFromDomain("TIPOUSUARIO"), //formulario orguser
            getValuesFromDomain("GRUPOS"), //formulario orguser
            getValuesFromDomain("ESTADOORGUSER"), //formulario orguser
            getOrgsByCorp(0), //formulario orguser
            getRolesByOrg(), //formulario orguser
            getChannelsByOrg(user?.orgid),
            getSecurityRules(),
            getPropertySelByName("VISUALIZACIONBOTSUSUARIOS"),
        ]));
        dispatch(setMemoryTable({
            id: IDUSER
        }))
        return () => {
            dispatch(cleanMemoryTable());
            dispatch(resetAllMain());
        };
    }, []);
    useEffect(() => {
        if (!mainMultiResult.loading && !mainMultiResult.error && mainMultiResult?.data?.[13]?.data) {
            dispatch(getCollectionAux2(getDomainByDomainNameList(mainMultiResult?.data?.[13]?.data.filter(item => item.domainname !== "").map(item => item.domainname).join(","))));
        }
    }, [mainMultiResult]);

    useEffect(() => {
        if (waitImport) {
            if (!executeRes.loading && !executeRes.error) {
                const newcount = importCount - 1;

                if (newcount === 0) {
                    setImportCount(0);
                    setMessageError("");
                    if (messageError) {
                        dispatch(showSnackbar({ show: true, severity: "error", message: messageError }));
                    } else {
                        dispatch(
                            showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) })
                        );
                    }
                    fetchData();
                    dispatch(showBackdrop(false));
                    setWaitImport(false);
                } else {
                    setImportCount(newcount);
                }
                // dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }))
            } else if (executeRes.error) {
                const newcount = importCount - 1;
                const errormessage = t(executeRes.code || "error_unexpected_error", {
                    module: `${t(langKeys.user).toLocaleLowerCase()}(${executeRes.key})`,
                });
                if (newcount === 0) {
                    setImportCount(0);
                    setMessageError("");
                    dispatch(showSnackbar({ show: true, severity: "error", message: messageError + errormessage }));

                    fetchData();
                    dispatch(showBackdrop(false));
                    setWaitImport(false);
                } else {
                    setImportCount(newcount);
                    setMessageError(messageError + errormessage + "\n");
                }
                // dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                // dispatch(showBackdrop(false));
                // setWaitImport(false);
            }
        }
    }, [executeRes, waitImport, importCount]);

    useEffect(() => {
        if (waitChanges) {
            if (!deleteResult.loading && !deleteResult.error) {
                dispatch(
                    showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_transaction) })
                );
                fetchData();
                dispatch(showBackdrop(false));
                setwaitChanges(false);
            } else if (deleteResult.error) {
                const errormessage = t(deleteResult.code || "error_unexpected_error", {
                    module: t(langKeys.user).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setwaitChanges(false);
            }
        }
    }, [deleteResult, waitChanges]);

    useEffect(() => {
        if (waitSave) {
            if (!deleteResult.loading && !deleteResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }));
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (deleteResult.error) {
                const errormessage = t(deleteResult.code || "error_unexpected_error", {
                    module: t(langKeys.user).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [deleteResult, waitSave]);

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    };

    const handleUpload = async (files: any, useravailable: number, limit: number) => {
        const file = files?.item(0);
        if (file) {
            const excel: any = await uploadExcel(file, undefined);
            const firstdatainit = array_trimmer(excel);
            const channellist = dataChannelsTemp.map(x => x.communicationchannelid).join().split(",")
            const datainit = firstdatainit.map(item => ({
                ...item,
                role: !!item.role?String(item.role).replace(/\s+/g, '').replace(/;/g, ','):item.role,
                groups: !!item.groups?String(item.groups).replace(/\s+/g, '').replace(/;/g, ','):item.groups,
                channels: !!item.channels?String(item.channels).replace(/\s+/g, '').replace(/;/g, ','):item.channels,
            }));
            const data = datainit.filter((f: Dictionary) => {
                const getDomainValues = (key: string, domainList: any[] | undefined) =>
                    domainList?.reduce((acc: any, d) => ({ ...acc, [d[key]]: d[key] }), {}) || {};

                const domainCompanyValues = getDomainValues('domainvalue', domains.value?.company);
                const domainDocTypeValues = getDomainValues('domainvalue', domains.value?.docTypes);
                const domainBillingGroupValues = getDomainValues('domainid', domains.value?.billinggroups);
                const domainTwoFactorValues = getDomainValues('domainvalue', domains.value?.genericstatus);
                const domainStatusValues = getDomainValues('domainvalue', domains.value?.userstatus);

                const isInDomain = (value: any, domainValues: any) =>
                    value === undefined || Object.keys(domainValues).includes(String(value));

                const isBooleanLike = (value: any) => ["true", "false"].includes(String(value));

                const isValidIdList = (value: string | undefined, list: any[] | undefined) =>
                (String(value).split(",").every((id: string) => {
                    const idNum = parseInt(id.trim(), 10);
                    return !isNaN(idNum) && list?.includes(idNum);
                }));

                return (
                    isInDomain(f.company, domainCompanyValues) &&
                    isInDomain(f.doctype, domainDocTypeValues) &&
                    isInDomain(f.billinggroup, domainBillingGroupValues) &&
                    isInDomain(f.twofactorauthentication, domainTwoFactorValues) &&
                    isInDomain(f.status, domainStatusValues) &&
                    (f.pwdchangefirstlogin === undefined || isBooleanLike(f.pwdchangefirstlogin)) &&
                    (f.balanced === undefined || isBooleanLike(f.balanced)) &&
                    (f.role === undefined || isValidIdList(f.role, domains.value?.roles?.map(d => d.roleid))) &&
                    (f.channels === undefined || isValidIdList(f.channels, channellist)) &&
                    (f.showbots === undefined || isBooleanLike(f.showbots))
                );
            });
            debugger
            const messageerrors = datainit
                .filter((f: Dictionary) => {
                    const getDomainValues = (key: string, domainList: any[] | undefined) =>
                        domainList?.reduce((acc: any, d) => ({ ...acc, [d[key]]: d[key] }), {}) || {};

                    const companyValues = getDomainValues('domainvalue', domains.value?.company);
                    const docTypeValues = getDomainValues('domainvalue', domains.value?.docTypes);
                    const billingGroupValues = getDomainValues('domainid', domains.value?.billinggroups);
                    const twoFactorAuthValues = getDomainValues('domainvalue', domains.value?.genericstatus);
                    const statusValues = getDomainValues('domainvalue', domains.value?.userstatus);
                    const roleIds = domains.value?.roles?.map(d => d.roleid);
                    const channelIds = channellist?.map(String);

                    const isInDomain = (value: any, domainValues: any) =>
                        value === undefined || Object.keys(domainValues).includes(String(value));

                    const isBooleanLike = (value: any) =>
                        ["true", "false"].includes(String(value));

                    const isValidIdList = (value: string | undefined, list: any[] | undefined) =>
                    (String(value).split(",").every((id: string) => {
                        const idNum = parseInt(id.trim(), 10);
                        return !isNaN(idNum) && list?.includes(idNum);
                    }));

                    return (
                        !isInDomain(f.company, companyValues) ||
                        !isInDomain(f.doctype, docTypeValues) ||
                        !isInDomain(f.billinggroup, billingGroupValues) ||
                        !isInDomain(f.twofactorauthentication, twoFactorAuthValues) ||
                        !isInDomain(f.status, statusValues) ||
                        !(f.pwdchangefirstlogin === undefined || isBooleanLike(f.pwdchangefirstlogin)) ||
                        !(f.balanced === undefined || isBooleanLike(f.balanced)) ||
                        !(f.role === undefined || isValidIdList(f.role, roleIds)) ||
                        !(f.channels === undefined || isValidIdList(f.channels, channelIds)) ||
                        !(f.showbots === undefined || isBooleanLike(f.showbots))
                    );
                })
                .reduce((acc, x) => acc + t(langKeys.error_estructure_user, { email: x.user || x.email }) + `\n`, "");

            setMessageError(messageerrors);

            if (data.length > 0) {
                if (data.length > useravailable) {
                    dispatch(
                        showSnackbar({ show: true, severity: "error", message: t(langKeys.userlimit, { limit }) })
                    );
                } else {
                    dispatch(showBackdrop(true));
                    setImportCount(data.length);
                    const channelError: Dictionary[] = [];
                    data.forEach((x) => {
                        const pattern = /^(\d+(,\s*\d+)*)?$/;
                        if (x.channels || x?.channels?.length > 0) {
                            if (!pattern.test(x.channels)) {
                                channelError.push(x.email);
                            }
                        }
                    });
                    if (channelError.length === 0) {
                        const table: Dictionary = data.reduce(
                            (a: any, d) => {
                                const roleids = String(d?.role || "").split(",") || []
                                let roles = domains?.value?.roles?.filter(x => roleids.includes(String(x.roleid))) || []
                                let type = d.balanced === "true" ? "ASESOR" : "SUPERVISOR"
                                let showbots = d.showbots === "true"
                                if (propertyBots?.[0]?.propertyvalue === "1") {
                                    if (roles.filter(x => x.roldesc.includes("ASESOR")).length) {
                                        type = "ASESOR"
                                        showbots = false
                                        roles = roles.filter(x => !x.roldesc.includes("ASESOR"))
                                    }
                                    if (roles.filter(x => x.roldesc.includes("GESTOR DE SEGURIDAD")).length || roles.filter(x => x.roldesc.includes("GESTOR DE CAMPAÑAS")).length || roles.filter(x => x.roldesc.includes("VISOR SD")).length) {
                                        type = "SUPERVISOR"
                                        showbots = false
                                        roles = roles.filter(x => !x.roldesc.includes("GESTOR DE SEGURIDAD") && !x.roldesc.includes("GESTOR DE CAMPAÑAS") && !x.roldesc.includes("VISOR SD"))
                                    }
                                    if (roles.length) {
                                        type = d.balanced === "true" ? "ASESOR" : "SUPERVISOR"
                                        showbots = d.showbots === "true"
                                    }
                                }
                                return ({
                                    ...a,
                                    [`${d.user}_${d.docnum}`]: {
                                        id: 0,
                                        usr: String(d.user || d.email),
                                        doctype: d.doctype,
                                        docnum: String(d.docnum),
                                        password: String(d.password),
                                        firstname: String(d.firstname),
                                        lastname: String(d.lastname),
                                        email: String(d.email),
                                        showbots: Boolean(d.showbots),
                                        pwdchangefirstlogin: d.pwdchangefirstlogin === "true",
                                        type: "NINGUNO",
                                        status: d.status,
                                        operation: "INSERT",
                                        company: d.company,
                                        twofactorauthentication: d.twofactorauthentication === "ACTIVO",
                                        registercode: String(d.registercode),
                                        billinggroupid: parseInt(RegExp(/\d+/).exec(String(d?.billinggroup))?.[0] ?? "0"),
                                        image: d?.image || "",
                                        detail: {
                                            showbots: Boolean(showbots),
                                            rolegroups: String(d?.role || ""),
                                            orgid: user?.orgid,
                                            bydefault: true,
                                            labels: "",
                                            warehouseid: "0",
                                            groups: d?.groups?.replace(/\s+/g, '') || null,
                                            storeid: "0",
                                            channels: d?.channels ? String(d?.channels).replace(/\s+/g, '') : "",
                                            status: "DESCONECTADO",
                                            type: type,
                                            supervisor: "",
                                            operation: "INSERT",
                                            redirect: "/usersettings",
                                        },
                                    },
                                })
                            },
                            {}
                        );
                        Object.values(table).forEach((p) => {
                            dispatch(
                                saveUser(
                                    {
                                        header: insUser({ ...p, key: p.usr }),
                                        detail: [insOrgUser({ ...p.detail })],
                                    },
                                    true
                                )
                            );
                        });
                        setWaitImport(true);
                    } else {
                        dispatch(
                            showSnackbar({
                                show: true,
                                severity: "error",
                                message: t(langKeys.error_rows_channel, { rows: channelError.join(",") }),
                            })
                        );
                    }
                    setCleanImport(!cleanImport)
                }
            } else {
                dispatch(showSnackbar({ show: true, severity: "error", message: messageerrors }));
                setCleanImport(!cleanImport)
            }
        }
    };
    const handleDropUsers = async (files: any) => {
        const file = files?.item(0);
        if (file) {
            let excel: any = await uploadExcel(file, undefined);
            let data = array_trimmer(excel);
            data = data.filter(
                (f: any) =>
                    (f.status === undefined ||
                        Object.keys(
                            domains.value?.userstatus?.reduce(
                                (a: any, d) => ({ ...a, [d.domainvalue]: d.domainvalue }),
                                {}
                            )
                        ).includes("" + f.status)) &&
                    (f.delete === undefined || [0, 1].includes(Number(f.delete)))
            );
            if (data.length > 0) {
                dispatch(showBackdrop(true));
                let table: Dictionary = data.reduce(
                    (a: any, d) => ({
                        ...a,
                        [`${d.username}_${d.status}`]: {
                            ...dataUsers.filter((x) => x.usr === d.username)[0],
                            status: d.delete === 0 ? "ELIMINADO" : d.status,
                            operation: d.delete === 0 ? "DELETE" : "UPDATE",
                        },
                    }),
                    {}
                );
                Object.values(table).forEach((p) => {
                    dispatch(
                        delUser(
                            {
                                header: null,
                                detail: [insUser({ ...p, id: p.userid, pwdchangefirstlogin: false })],
                            },
                            false
                        )
                    );
                    // dispatch(execute(insUser({ ...p, id: p.userid, pwdchangefirstlogin: false })));
                });
                setwaitChanges(true);
            } else {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.no_records_valid) }));
            }
        }
    };

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    };
    const handleDuplicate = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: false });
    };

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(
                delUser(
                    {
                        header: null,
                        detail: [
                            insUser({
                                ...row,
                                operation: "DELETE",
                                status: "ELIMINADO",
                                id: row.userid,
                                pwdchangefirstlogin: false,
                            }),
                        ],
                    },
                    false
                )
            );
            // dispatch(execute(insUser({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.userid, pwdchangefirstlogin: false })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        };

        dispatch(
            manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_delete),
                callback,
            })
        );
    };

    const checkLimit = (operation: string) => {
        setOperation(operation);
        dispatch(getCollectionAux(checkUserPaymentPlan()));
        setWaitCheck(true);
    };

    useEffect(() => {
        if (waitCheck) {
            if (!mainAuxResult.loading && !mainAuxResult.error) {
                if (mainAuxResult.data.length > 0) {
                    dispatch(showBackdrop(false));
                    setWaitCheck(false);
                    if (!(mainAuxResult.data[0].usernumber < mainAuxResult.data[0].userscontracted)) {
                        dispatch(
                            showSnackbar({
                                show: true,
                                severity: "error",
                                message: t(langKeys.userlimit, {
                                    limit: mainAuxResult.data[0].userscontracted,
                                }),
                            })
                        );
                    } else {
                        if (operation === "REGISTER") {
                            handleRegister();
                        }
                        if (operation === "UPLOAD") {
                            handleUpload(
                                fileToUpload,
                                mainAuxResult.data[0].userscontracted - mainAuxResult.data[0].usernumber,
                                mainAuxResult.data[0].userscontracted
                            );
                        }
                    }
                }
            } else if (mainAuxResult.error) {
                const errormessage = t(mainAuxResult.code || "error_unexpected_error", {
                    module: t(langKeys.user).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitCheck(false);
            }
        }
    }, [mainAuxResult, waitCheck]);

    if (viewSelected === "view-1") {
        if (mainResult.error) {
            return <h1>ERROR</h1>;
        }

        return (
            <div style={{ width: "100%", display: "flex", flexDirection: "column", flex: 1 }}>
                <TableZyx
                    columns={columns}
                    titlemodule={t(langKeys.user, { count: 2 })}
                    data={dataUsers}
                    download={true}
                    loading={mainResult.loading}
                    register={true}
                    hoverShadow={true}
                    cleanImport={cleanImport}
                    handleRegister={() => checkLimit("REGISTER")}
                    pageSizeDefault={IDUSER === memoryTable.id ? memoryTable.pageSize === -1 ? 20 : memoryTable.pageSize : 20}
                    initialPageIndex={IDUSER === memoryTable.id ? memoryTable.page === -1 ? 0 : memoryTable.page : 0}
                    initialStateFilter={IDUSER === memoryTable.id ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value })) : undefined}
                    importCSV={(file) => {
                        setFileToUpload(file);
                        checkLimit("UPLOAD");
                    }}
                    onClickRow={handleEdit}
                    ButtonsElement={() => (
                        <>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={mainResult.loading}
                                startIcon={<ListAltIcon color="secondary" />}
                                onClick={handleTemplateDrop}
                                style={{ backgroundColor: "#55BD84" }}
                            >
                                {`${t(langKeys.template)}  ${t(langKeys.dropusers)}`}
                            </Button>
                            <>
                                <input
                                    name="file"
                                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.csv"
                                    id="laraigo-dropusers-csv-file"
                                    type="file"
                                    style={{ display: "none" }}
                                    onChange={(e) => handleDropUsers(e.target.files)}
                                />
                                <label htmlFor="laraigo-dropusers-csv-file">
                                    <Button
                                        variant="contained"
                                        component="span"
                                        color="primary"
                                        disabled={mainResult.loading}
                                        startIcon={<ClearIcon color="secondary" />}
                                        //onClick={handleTemplate}
                                        style={{ backgroundColor: "#fb5f5f" }}
                                    >
                                        <Trans i18nKey={langKeys.dropusers} />
                                    </Button>
                                </label>
                            </>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={mainResult.loading}
                                startIcon={<ListAltIcon color="secondary" />}
                                onClick={handleTemplate}
                                style={{ backgroundColor: "#55BD84" }}
                            >
                                {`${t(langKeys.template)}  ${t(langKeys.import)}`}
                            </Button>
                        </>
                    )}
                />
            </div>
        );
    } else
        return (
            <DetailUsers
                data={rowSelected}
                setViewSelected={redirectFunc}
                multiData={mainMultiResult.data}
                fetchData={fetchData}
                arrayBread={arrayBread}
            />
        );
};

export default Users;