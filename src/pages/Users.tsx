/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { DialogZyx, TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldEdit, FieldSelect, FieldMultiSelect, TemplateSwitch, TemplateSwitchYesNo } from 'components';
import { getOrgUserSel, getUserSel, getValuesFromDomain, getOrgsByCorp, getRolesByOrg, getSupervisors, getChannelsByOrg, getApplicationsByRole, insUser, insOrgUser, randomText, templateMaker, exportExcel, uploadExcel, array_trimmer } from 'common/helpers';
import { getDomainsByTypename } from 'store/person/actions';
import { Dictionary, MultiData } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import Avatar from '@material-ui/core/Avatar';
import { uploadFile } from 'store/main/actions';
import ListAltIcon from '@material-ui/icons/ListAlt';
import {
    getCollection, resetAllMain, getMultiCollection,
    execute, getCollectionAux, resetMainAux, getMultiCollectionAux
} from 'store/main/actions';
import { saveUser } from 'store/activationuser/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import AddIcon from '@material-ui/icons/Add';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import ClearIcon from '@material-ui/icons/Clear';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import { Divider, Grid, ListItem, Box, IconButton } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import DeleteIcon from '@material-ui/icons/Delete';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { DuplicateIcon } from 'icons';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}

interface DetailProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData?: () => void
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
        // maxWidth: '80%',
        padding: theme.spacing(2),
        background: '#fff',
    },
    mb2: {
        marginBottom: theme.spacing(4),
    },
    title: {
        fontSize: '22px',
        color: theme.palette.text.primary,
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    }
}));
const ListItemSkeleton: FC = () => (
    <ListItem style={{ display: 'flex', paddingLeft: 0, paddingRight: 0, paddingBottom: 8 }}>
        <Box style={{ padding: 20, backgroundColor: 'white', display: 'flex', flexDirection: 'column', flexGrow: 1, }}>
            <Grid container direction="column">
                <Grid container direction="row" spacing={1}>
                    <Grid item sm={12} xl={12} xs={12} md={12} lg={12}>
                        <Skeleton />
                    </Grid>
                </Grid>
                <Divider style={{ margin: '10px 0' }} />
                <Grid container direction="row" spacing={1}>
                    <Grid item sm={12} xl={12} xs={12} md={12} lg={12}>
                        <Skeleton />
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    </ListItem>
)

const DetailOrgUser: React.FC<ModalProps> = ({ index, data: { row, edit }, multiData, updateRecords, preData, triggerSave, setAllIndex, handleDelete }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const resFromOrg = useSelector(state => state.main.multiDataAux);

    // const dataTypeUser = multiData[5] && multiData[5].success ? multiData[5].data : [];
    // const dataGroups = multiData[6] && multiData[6].success ? multiData[6].data : [];
    const dataRoles = multiData[9] && multiData[9].success ? multiData[9].data : [];
    const dataOrganizationsTmp = multiData[8] && multiData[8].success ? multiData[8].data : []

    const [dataOrganizations, setDataOrganizations] = useState<{ loading: boolean; data: Dictionary[] }>({ loading: false, data: [] })
    const [dataSupervisors, setDataSupervisors] = useState<{ loading: boolean; data: Dictionary[] }>({ loading: false, data: [] });
    const [dataChannels, setDataChannels] = useState<{ loading: boolean; data: Dictionary[] }>({ loading: false, data: [] });
    const [dataGroups, setDataGroups] = useState<{ loading: boolean; data: Dictionary[] }>({ loading: false, data: [] });
    const [dataApplications, setDataApplications] = useState<{ loading: boolean; data: Dictionary[] }>({ loading: false, data: [] });

    const { register, handleSubmit, setValue, getValues, trigger, formState: { errors }, reset } = useForm();

    useEffect(() => {
        if (triggerSave) {
            (async () => {
                const allOk = await trigger(); //para q valide el formulario
                const data = getValues();
                if (allOk) {
                    if (!row)
                        updateRecords && updateRecords((p: Dictionary[], itmp: number) => {
                            p[index] = { ...data, operation: "INSERT" }
                            return p;
                        })
                    else
                        updateRecords && updateRecords((p: Dictionary[]) => p.map(x => x?.orgid === row.orgid ? { ...x, ...data, operation: (x.operation || "UPDATE") } : x))
                }
                setAllIndex((p: number[]) => [...p, { index, allOk }]);
            })()
        }
    }, [triggerSave])

    useEffect(() => {//validar la respuesta y asignar la  data a supervisores y canales segun la organización q cambió
        const indexSupervisor = resFromOrg.data.findIndex((x: MultiData) => x.key === ("UFN_USER_SUPERVISOR_LST" + (index + 1)));
        const indexChannels = resFromOrg.data.findIndex((x: MultiData) => x.key === ("UFN_COMMUNICATIONCHANNELBYORG_LST" + (index + 1)));
        const indexGroups = resFromOrg.data.findIndex((x: MultiData) => x.key === (`UFN_DOMAIN_LST_VALORES_GRUPOS${(index + 1)}`));
        const indexApplications = resFromOrg.data.findIndex((x: MultiData) => x.key === ("UFN_APPS_DATA_SEL" + (index + 1)));

        if (indexSupervisor > -1)
            setDataSupervisors({ loading: false, data: resFromOrg.data[indexSupervisor] && resFromOrg.data[indexSupervisor].success ? resFromOrg.data[indexSupervisor].data : [] });

        if (indexChannels > -1)
            setDataChannels({ loading: false, data: resFromOrg.data[indexChannels] && resFromOrg.data[indexChannels].success ? resFromOrg.data[indexChannels].data : [] });

        if (indexGroups > -1)
            setDataGroups({ loading: false, data: resFromOrg.data[indexGroups] && resFromOrg.data[indexGroups].success ? resFromOrg.data[indexGroups].data : [] });

        if (indexApplications > -1) {
            let tempdata = resFromOrg.data[indexApplications] && resFromOrg.data[indexApplications].success ? resFromOrg.data[indexApplications].data.map(x => ({
                ...x,
                description: (t(`app_${x.description}`.toLowerCase()) || "").toUpperCase(),
            })) : []
            tempdata.sort(function (a, b) {
                if (a.description < b.description) {
                    return -1;
                }
                if (a.description > b.description) {
                    return 1;
                }
                return 0;
            })
            setDataApplications({ loading: false, data: resFromOrg.data[indexApplications] && resFromOrg.data[indexApplications].success ? tempdata : [] });
        }
    }, [resFromOrg])
    useEffect(() => {
        //PARA MODALES SE DEBE RESETEAR EN EL EDITAR
        reset({
            orgid: row ? row.orgid : (dataOrganizationsTmp.length === 1 ? dataOrganizationsTmp[0].orgid : 0),
            roleid: row ? row.roleid : 0,
            roledesc: row ? row.roledesc : '', //for table
            orgdesc: row ? row.orgdesc : '', //for table
            supervisordesc: row ? row.supervisordesc : '', //for table
            channelsdesc: row ? row.channelsdesc : '', //for table
            supervisor: row ? row.supervisor : '',
            type: row?.type || '',
            channels: row?.channels || '',
            redirect: row?.redirect || '',
            groups: row?.groups || '',
            labels: row?.labels || '',
            status: 'DESCONECTADO',
            bydefault: row?.bydefault || false,
        })

        register('orgid', { validate: (value) => (value && value > 0) || t(langKeys.field_required) });
        register('roleid', { validate: (value) => (value && value > 0) || t(langKeys.field_required) });
        register('supervisor');
        // register('type', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('channels');
        register('redirect', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('groups');
        register('roledesc');
        register('orgdesc');
        register('supervisordesc');
        register('channelsdesc');
        register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('labels');
        register('bydefault');

        setDataOrganizations({ loading: false, data: dataOrganizationsTmp.filter(x => x.orgid === row?.orgid || !preData.some(y => y?.orgid === x.orgid)) });

        //forzar a que el select de aplicaciones renderice, por eso se desactivó el triggerOnChangeOnFirst en role
        if (row) {
            setDataApplications({ loading: true, data: [] });
            dispatch(getMultiCollectionAux([
                getApplicationsByRole(row.roleid, index + 1),
            ]))
        }
    }, [])

    const onSubmit = handleSubmit((data) => { //GUARDAR MODAL
        if (!row)
            updateRecords && updateRecords((p: Dictionary[]) => [...p, { ...data, operation: "INSERT" }])
        else
            updateRecords && updateRecords((p: Dictionary[]) => p.map(x => x.orgid === row ? { ...x, ...data, operation: (x.operation || "UPDATE") } : x))
        // setOpenModal(false)
    });

    const onChangeOrganization = (value: Dictionary) => {
        setValue('orgid', value ? value.orgid : 0);
        setValue('orgdesc', value ? value.orgdesc : '');
        if (value) {
            setDataSupervisors({ loading: true, data: [] });
            setDataChannels({ loading: true, data: [] });
            setDataGroups({ loading: true, data: [] });
            dispatch(getMultiCollectionAux([
                getSupervisors(value.orgid, 0, index + 1),
                getChannelsByOrg(value.orgid, index + 1),
                getValuesFromDomain("GRUPOS", `_GRUPOS${index + 1}`, value.orgid)
            ]))
        } else {
            setDataSupervisors({ loading: false, data: [] });
            setDataChannels({ loading: false, data: [] });
            setDataGroups({ loading: false, data: [] });
        }
    }

    const onChangeRole = (value: Dictionary) => {
        setValue('roleid', value ? value.roleid : 0);
        setValue('roledesc', value ? value.roldesc : 0);
        setValue('type', value ? value.type : 0);
        if (value) {
            setDataApplications({ loading: true, data: [] });
            dispatch(getMultiCollectionAux([
                getApplicationsByRole(value.roleid, index + 1),
            ]))
        } else {
            setDataApplications({ loading: false, data: [] })
        }
    }

    return (
        <Accordion defaultExpanded={!row} style={{ marginBottom: '8px' }}>

            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography>{(row) ? row.orgdesc : t(langKeys.neworganization)}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <form onSubmit={onSubmit} style={{ width: '100%' }}>
                    <div className="row-zyx">
                        <div className="col-6">
                            <FieldSelect
                                label={t(langKeys.organization)}
                                className={classes.mb2}
                                valueDefault={getValues('orgid')}
                                onChange={onChangeOrganization}
                                triggerOnChangeOnFirst={true}
                                error={errors?.orgid?.message}
                                data={dataOrganizations.data}
                                optionDesc="orgdesc"
                                optionValue="orgid"
                            />
                            <FieldSelect
                                label={t(langKeys.role)}
                                className={classes.mb2}
                                valueDefault={row?.roleid || ""}
                                onChange={onChangeRole}
                                error={errors?.roleid?.message}
                                // triggerOnChangeOnFirst={true}
                                data={dataRoles}
                                optionDesc="roldesc"
                                optionValue="roleid"
                            />
                            <FieldMultiSelect //los multiselect te devuelven un array de objetos en OnChange por eso se le recorre
                                label={t(langKeys.channel)}
                                className={classes.mb2}
                                valueDefault={row?.channels || ""}
                                onChange={(value) => {
                                    setValue('channels', value.map((o: Dictionary) => o.communicationchannelid).join())
                                    setValue('channelsdesc', value.map((o: Dictionary) => o.description).join())
                                }}
                                error={errors?.channels?.message}
                                loading={dataChannels.loading}
                                data={dataChannels.data}
                                optionDesc="description"
                                optionValue="communicationchannelid"
                            />
                        </div>
                        <div className="col-6">
                            <TemplateSwitchYesNo
                                label={t(langKeys.default_organization)}
                                className={classes.mb2}
                                valueDefault={row?.bydefault || false}
                                onChange={(value) => setValue('bydefault', value)} />
                            <FieldSelect
                                label={t(langKeys.supervisor)}
                                className={classes.mb2}
                                valueDefault={row?.supervisor || ""}
                                triggerOnChangeOnFirst={true}
                                onChange={(value) => {
                                    setValue('supervisor', value ? value.usr : '');
                                    setValue('supervisordesc', value ? value.userdesc : '');
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
                                valueDefault={row?.redirect || ""}
                                onChange={(value) => setValue('redirect', value ? value.path : '')}
                                error={errors?.redirect?.message}
                                data={dataApplications.data}
                                loading={dataApplications.loading}
                                triggerOnChangeOnFirst={true}
                                optionDesc="description"
                                optionValue="path"
                            />
                            <FieldMultiSelect //los multiselect te devuelven un array de objetos en OnChange por eso se le recorre
                                label={t(langKeys.group)}
                                className={classes.mb2}
                                valueDefault={row?.groups || ""}
                                onChange={(value) => setValue('groups', value.map((o: Dictionary) => o.domainvalue).join())}
                                error={errors?.groups?.message}
                                loading={dataGroups.loading}
                                data={dataGroups.data}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            />
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<DeleteIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => handleDelete(row, index)}
                        >{t(langKeys.delete)}</Button>
                    </div>
                </form>
            </AccordionDetails>
        </Accordion>
    );
}

interface ModalPasswordProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => any;
    data: any;
    parentSetValue: (...param: any) => any;
}

const ModalPassword: React.FC<ModalPasswordProps> = ({ openModal, setOpenModal, data, parentSetValue }) => {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register, handleSubmit, setValue, getValues, formState: { errors }, trigger, clearErrors } = useForm({
        defaultValues: {
            password: '',
            confirmpassword: '',
            generate_password: false,
            send_password_by_email: false,
            change_password_on_login: false
        }
    });

    useEffect(() => {
        setValue('password', data?.password);
        setValue('confirmpassword', data?.password);
        setValue('send_password_by_email', data?.send_password_by_email);
        setValue('change_password_on_login', data?.pwdchangefirstlogin);
    }, [data]);

    const validateSamePassword = (value: string): any => {
        return getValues('password') === value;
    }

    useEffect(() => {
        register('password', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('confirmpassword', {
            validate: {
                validate: (value: any) => (value && value.length) || t(langKeys.field_required),
                same: (value: any) => validateSamePassword(value) || "Contraseñas no coinciden"
            }
        });
    }, [])

    const setRandomPassword = (value: boolean) => {
        if (value) {
            const rndPassword = randomText(10, true, true, true);
            setValue('password', rndPassword);
            setValue('confirmpassword', rndPassword);
            trigger();
        }
    }

    const handleCancelModal = () => {
        setOpenModal(false);
        setValue('password', data?.password);
        setValue('confirmpassword', data?.password);
        setValue('send_password_by_email', data?.send_password_by_email);
        setValue('change_password_on_login', data?.pwdchangefirstlogin);
        clearErrors();
    }

    const onSubmitPassword = handleSubmit((data) => {
        parentSetValue('password', data.password);
        parentSetValue('send_password_by_email', data.send_password_by_email);
        parentSetValue('pwdchangefirstlogin', data.change_password_on_login);
        setOpenModal(false);
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
                    valueDefault={getValues('generate_password')}
                    onChange={setRandomPassword}
                />
                <TemplateSwitch
                    label={t(langKeys.send_password_by_email)}
                    className="col-4"
                    valueDefault={getValues('send_password_by_email')}
                    onChange={(value) => setValue('send_password_by_email', value)}
                />
                <TemplateSwitch
                    label={t(langKeys.change_password_on_login)}
                    className="col-4"
                    valueDefault={getValues('change_password_on_login')}
                    onChange={(value) => setValue('change_password_on_login', value)}
                />
            </div>
            <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.password)}
                    className="col-6"
                    valueDefault={getValues('password')}
                    type={showPassword ? 'text' : 'password'}
                    onChange={(value) => setValue('password', value)}
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
                    valueDefault={getValues('confirmpassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    onChange={(value) => setValue('confirmpassword', value)}
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
        </DialogZyx>
    )
}

const DetailUsers: React.FC<DetailProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.activationuser.saveUser);
    const detailRes = useSelector(state => state.main.mainAux); //RESULTADO DEL DETALLE

    const [dataOrganizations, setDataOrganizations] = useState<(Dictionary | null)[]>([]);
    const [orgsToDelete, setOrgsToDelete] = useState<Dictionary[]>([]);
    const [openDialogStatus, setOpenDialogStatus] = useState(false);
    const [openDialogPassword, setOpenDialogPassword] = useState(false);

    const [triggerSave, setTriggerSave] = useState(false)
    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataDocType = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataCompanies = multiData[2] && multiData[2].success ? multiData[2].data : [];
    const dataBillingGroups = multiData[3] && multiData[3].success ? multiData[3].data : [];
    const dataStatusUsers = multiData[4] && multiData[4].success ? multiData[4].data : [];
    const [allIndex, setAllIndex] = useState([])
    const [getOrganizations, setGetOrganizations] = useState(false);
    const [waitUploadFile, setWaitUploadFile] = useState(false);


    const uploadResult = useSelector(state => state.main.uploadFile);

    useEffect(() => { //RECIBE LA DATA DE LAS ORGANIZACIONES 
        if (!detailRes.loading && !detailRes.error && getOrganizations) {
            setDataOrganizations(detailRes.data);
        }
    }, [detailRes]);

    const handleRegister = () => {
        setDataOrganizations(p => [...p, null]);
    }
    const handleDelete = (row: Dictionary | null, index: number) => {
        if (row && row.operation !== "INSERT") {
            setOrgsToDelete(p => [...p, { ...row, operation: "DELETE", status: 'ELIMINADO' }]);
        }
        if (row)
            setDataOrganizations(p => p.filter((x) => row.orgid !== x?.orgid));
        else
            setDataOrganizations(p => p.filter((x, i) => i !== index));
    }


    useEffect(() => {
        if (waitUploadFile) {
            if (!uploadResult.loading && !uploadResult.error) {
                setValue('image', uploadResult.url)
                setWaitUploadFile(false);
            } else if (uploadResult.error) {

                setWaitUploadFile(false);
            }
        }
    }, [waitUploadFile, uploadResult])


    const onSelectImage = (files: any) => {
        const selectedFile = files[0];
        var fd = new FormData();
        fd.append('file', selectedFile, selectedFile.name);
        dispatch(uploadFile(fd));
        setWaitUploadFile(true);
    }

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            type: 'NINGUNO',
            id: edit ? (row?.userid || 0) : 0,
            operation: edit ? (row ? "EDIT" : "INSERT") : "INSERT",
            description: row?.description || '',
            firstname: row?.firstname || '',
            lastname: row?.lastname || '',
            password: edit ? (row?.password || '') : "",
            // usr: row?.usr || '',
            email: edit ? (row?.email || '') : "",
            doctype: row?.doctype || '',
            docnum: row?.docnum || '',
            company: row?.company || '',
            billinggroupid: row?.billinggroupid || 0,
            registercode: row?.registercode || '',
            twofactorauthentication: row?.twofactorauthentication || false,
            status: row?.status || 'ACTIVO',
            image: row?.image || null,
            send_password_by_email: false,
            pwdchangefirstlogin: false
        }
    });

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    React.useEffect(() => {
        register('type');
        register('id');
        register('password');
        register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('firstname', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('lastname', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('email', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('doctype', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('docnum', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('billinggroupid');
        register('description');
        register('twofactorauthentication');
        register('image');

        dispatch(resetMainAux())
        if (row && edit) {
            setGetOrganizations(true)
            dispatch(getCollectionAux(getOrgUserSel((row?.userid || 0), 0))); //TRAE LAS ORGANIZACIONES ASIGNADAS DEL USUARIO
        }
        if (!row)
            setDataOrganizations(p => [...p, null]);
    }, [register]);

    useEffect(() => {
        if (allIndex.length === dataOrganizations.length && triggerSave) {
            setTriggerSave(false);
            const error = allIndex.some((x: any) => !x.allOk)
            if (error) {
                return
            }
            if (!dataOrganizations.some(x => x?.bydefault)) {
                dispatch(showSnackbar({ show: true, success: false, message: t(langKeys.organization_by_default) }));
                return;
            } else if (dataOrganizations.filter(x => x?.bydefault).length > 1) {
                dispatch(showSnackbar({ show: true, success: false, message: t(langKeys.organization_by_default) }));
                return;
            }
            const data = getValues();

            const callback = () => {
                dispatch(showBackdrop(true));
                dispatch(saveUser({
                    header: insUser({ ...data, usr: data.email, language: t(langKeys.currentlanguage) }),
                    detail: [...dataOrganizations.filter(x => x && x?.operation).map(x => x && insOrgUser(x)), ...orgsToDelete.map(x => insOrgUser(x))]!
                }, true));
                setWaitSave(true)
            }

            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback
            }))
        }
    }, [allIndex, triggerSave])


    const onSubmit = handleSubmit((data) => {
        if (!row && !data.password) {
            dispatch(showSnackbar({ show: true, success: false, message: t(langKeys.password_required) }));
            return;
        }
        if (!edit && data.password === "") {
            dispatch(showSnackbar({ show: true, success: false, message: t(langKeys.password_required) }));
            return;
        }
        setAllIndex([])
        setTriggerSave(true)
    });

    const onChangeStatus = (value: Dictionary) => {
        setValue('status', (value ? value.domainvalue : ''));
        value && setOpenDialogStatus(true)
    }

    const arrayBread = [
        { id: "view-1", name: t(langKeys.user_plural) },
        { id: "view-2", name: `${t(langKeys.user)} ${t(langKeys.detail)}` }
    ];

    return (
        <div style={{ width: '100%' }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBread}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={edit ? (row ? `${row.firstname} ${row.lastname}` : t(langKeys.newuser)) : t(langKeys.newuser)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("view-1")}
                        >{t(langKeys.back)}</Button>
                        <>
                            <Button
                                variant="contained"
                                color="primary"
                                type="button"
                                startIcon={<LockOpenIcon color="secondary" />}
                                onClick={() => setOpenDialogPassword(true)}
                            >{t(edit ? (row ? langKeys.changePassword : langKeys.setpassword) : langKeys.setpassword)}</Button>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                            >{t(langKeys.save)}</Button>
                        </>
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        <div className="col-6" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <FieldEdit
                                label={t(langKeys.firstname)}
                                style={{ marginBottom: 8 }}
                                valueDefault={row?.firstname || ""}
                                onChange={(value) => setValue('firstname', value)}
                                error={errors?.firstname?.message}
                            />
                            <FieldEdit
                                label={t(langKeys.lastname)}
                                className="col-6"
                                valueDefault={row?.lastname || ""}
                                onChange={(value) => setValue('lastname', value)}
                                error={errors?.lastname?.message}
                            />
                        </div>
                        <div className="col-6" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ position: 'relative' }}>
                                <Avatar style={{ width: 120, height: 120 }} src={getValues('image')} />
                                <input
                                    name="file"
                                    accept="image/*"
                                    id="laraigo-upload-csv-file"
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={(e) => onSelectImage(e.target.files)}
                                />
                                <label htmlFor="laraigo-upload-csv-file">
                                    <Avatar style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#7721ad', cursor: 'pointer' }}>
                                        <CameraAltIcon style={{ color: '#FFF' }} />
                                    </Avatar>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={`${t(langKeys.email)} (${t(langKeys.user)})`}
                            className="col-6"
                            valueDefault={edit ? (row?.email || "") : ""}
                            onChange={(value) => setValue('email', value)}
                            error={errors?.email?.message}
                        />
                        <FieldSelect
                            label={t(langKeys.company)}
                            className="col-6"
                            valueDefault={row?.company || ""}
                            onChange={(value) => setValue('company', value ? value.domainvalue : '')}
                            error={errors?.company?.message}
                            data={dataCompanies}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.docType)}
                            className="col-6"
                            valueDefault={row?.doctype || ""}
                            onChange={(value) => setValue('doctype', value ? value.domainvalue : '')}
                            error={errors?.doctype?.message}
                            data={dataDocType}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                        />
                        <FieldEdit
                            label={t(langKeys.docNumber)}
                            className="col-6"
                            valueDefault={row?.docnum || ""}
                            onChange={(value) => setValue('docnum', value)}
                            error={errors?.docnum?.message}
                        />
                    </div>

                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.billingGroup)}
                            className="col-6"
                            valueDefault={row?.billinggroupid || ""}
                            onChange={(value) => setValue('billinggroupid', (value ? value.domainid : 0))}
                            error={errors?.billinggroupid?.message}
                            data={dataBillingGroups}
                            optionDesc="domaindesc"
                            optionValue="domainid"
                        />
                        <FieldEdit
                            label={t(langKeys.registerCode)}
                            className="col-6"
                            valueDefault={row?.registercode || ""}
                            onChange={(value) => setValue('registercode', value)}
                            error={errors?.registercode?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.twofactorauthentication)}
                            className="col-6"
                            valueDefault={getValues('twofactorauthentication') ? 'ACTIVO' : "INACTIVO"}
                            onChange={(value) => setValue('twofactorauthentication', (value ? value.domainvalue === 'ACTIVO' : false))}
                            error={errors?.twofactorauthentication?.message}
                            data={dataStatus}
                            uset={true}
                            prefixTranslation="status_"
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
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
                        />
                    </div>
                </div>
            </form>

            <div className={classes.containerDetail}>
                {detailRes.error ? <h1>ERROR</h1> :
                    <div>
                        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
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
                                >{t(langKeys.register)}
                                </Button>
                            </div>
                        </div>
                        {detailRes.loading ?
                            <ListItemSkeleton /> :
                            dataOrganizations.map((item, index) => (
                                <DetailOrgUser
                                    key={`detail${index}`}
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
                        }
                    </div>
                }
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
                    onChange={(value) => setValue('description', value)}
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
}

const Users: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main.mainData);
    const mainMultiResult = useSelector(state => state.main.multiData);
    const executeResult = useSelector(state => state.main.execute);
    const [dataUsers, setdataUsers] = useState<Dictionary[]>([]);
    const [dataOrganizationsTmp, setdataOrganizationsTmp] = useState<Dictionary[]>([]);
    const [waitImport, setWaitImport] = useState(false);
    const [waitChanges, setwaitChanges] = useState(false);
    const domains = useSelector(state => state.person.editableDomains);
    useEffect(() => {
        setdataOrganizationsTmp(mainMultiResult.data[8] && mainMultiResult.data[8].success ? mainMultiResult.data[8].data : [])
    }, [mainMultiResult.data]);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);

    const columns = React.useMemo(
        () => [
            {
                accessor: 'userid',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                            extraOption={t(langKeys.duplicate)}
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                            extraFunction={() => handleDuplicate(row)}
                            ExtraICon={() => <DuplicateIcon width={28} style={{ fill: '#7721AD' }} />}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.name),
                accessor: 'firstname',
                NoFilter: true
            },
            {
                Header: t(langKeys.lastname),
                accessor: 'lastname',
                NoFilter: true
            },
            {
                Header: `${t(langKeys.email)} (${t(langKeys.user)})`,
                accessor: 'email',
                NoFilter: true
            },
            {
                Header: t(langKeys.attention_group),
                accessor: 'groups',
                NoFilter: true
            },
            {
                Header: t(langKeys.role),
                accessor: 'roledesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                NoFilter: true,
                prefixTranslation: 'status_',
                Cell: (props: any) => {
                    const { status } = props.cell.row.original;
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
                }
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
            domains.value?.docTypes.reduce((a, d) => ({ ...a, [d.domainvalue]: t(`type_documenttype_${d.domainvalue?.toLowerCase()}`) }), {}),
            {},
            domains.value?.billinggroups?.reduce((a, d) => ({ ...a, [d.domainid]: d.domaindesc }), {}),
            {},
            domains.value?.genericstatus?.reduce((a, d) => ({ ...a, [d.domainvalue]: t(`status_${d.domainvalue?.toLowerCase()}`) }), {}),
            domains.value?.userstatus?.reduce((a, d) => ({ ...a, [d.domainvalue]: t(`status_${d.domainvalue?.toLowerCase()}`) }), {}),
            {},
            {},
            { 'true': 'true', 'false': 'false' },
            domains.value?.roles?.reduce((a, d) => ({ ...a, [d.roleid]: d.roldesc }), {}),
            dataOrganizationsTmp.reduce((a, d) => ({ ...a, [d.orgid]: d.orgdesc }), {}),
        ];
        const header = [
            'firstname',
            'lastname',
            'email',
            'company',
            'doctype',
            'docnum',
            'billinggroup',
            'registercode',
            'twofactorauthentication',
            'status',
            'image',
            'password',
            'pwdchangefirstlogin',
            'role',
            'organization',
        ];
        exportExcel(`${t(langKeys.template)} ${t(langKeys.import)}`, templateMaker(data, header));
    }
    const handleTemplateDrop = () => {
        const data = [
            {},
            domains.value?.userstatus?.reduce((a, d) => ({ ...a, [d.domainvalue]: t(`status_${d.domainvalue?.toLowerCase()}`) }), {}),
            { 0: 'true', 1: 'false' },
        ];
        const header = [
            'username',
            'status',
            'delete',
        ];
        exportExcel(`${t(langKeys.template)} ${t(langKeys.dropusers)}`, templateMaker(data, header));
    }

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
        ]));
        return () => {
            dispatch(resetAllMain());
        };
    }, []);
    useEffect(() => {
        if (waitImport) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_register) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitImport(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.organization).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitImport(false);
            }
        }
    }, [executeResult, waitImport])
    useEffect(() => {
        if (waitChanges) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_transaction) }))
                fetchData();
                dispatch(showBackdrop(false));
                setwaitChanges(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.organization).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setwaitChanges(false);
            }
        }
    }, [executeResult, waitChanges])

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    }

    const handleUpload = async (files: any) => {
        const file = files?.item(0);
        if (file) {
            debugger
            let excel: any = await uploadExcel(file, undefined);
            let data = array_trimmer(excel);
            data = data.filter((f: any) =>
                (f.company === undefined || Object.keys(domains.value?.company?.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domainvalue }), {})).includes('' + f.company))
                && (f.doctype === undefined || Object.keys(domains.value?.docTypes?.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domainvalue }), {})).includes('' + f.doctype))
                && (f.billinggroup === undefined || Object.keys(domains.value?.billinggroups?.reduce((a: any, d) => ({ ...a, [d.domainid]: `${d.domainid}` }), {})).includes('' + f.billinggroup))
                && (f.twofactorauthentication === undefined || Object.keys(domains.value?.genericstatus?.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domainvalue }), {})).includes('' + f.twofactorauthentication))
                && (f.status === undefined || Object.keys(domains.value?.userstatus?.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domainvalue }), {})).includes('' + f.status))
                && (f.pwdchangefirstlogin === undefined || ["true", "false"].includes('' + f.pwdchangefirstlogin))
                && (f.role === undefined || Object.keys(domains.value?.roles?.reduce((a: any, d) => ({ ...a, [d.roleid]: `${d.roleid}` }), {})).includes('' + f.role))
                && (f.organization === undefined || Object.keys(dataOrganizationsTmp.reduce((a: any, d) => ({ ...a, [d.orgid]: `${d.orgid}` }), {})).includes('' + f.organization))
            );
            console.log(data)
            if (data.length > 0) {
                dispatch(showBackdrop(true));
                let table: Dictionary = data.reduce((a: any, d) => ({
                    ...a,
                    [`${d.email}_${d.docnum}`]: {
                        id: 0,
                        usr: d.email,
                        doctype: d.doctype,
                        docnum: String(d.docnum),
                        password: d.password,
                        firstname: d.firstname,
                        lastname: d.lastname,
                        email: d.email,
                        pwdchangefirstlogin: Boolean(d.pwdchangefirstlogin),
                        type: "NINGUNO",
                        status: d.status,
                        operation: "INSERT",
                        company: d.company,
                        twofactorauthentication: d.twofactorauthentication === "ACTIVO",
                        registercode: d.registercode,
                        billinggroupid: d.billinggroup,
                        image: d?.image || "",
                        detail: {
                            roleid: d.role,
                            orgid: d.organization,
                            bydefault: true,
                            labels: "",
                            groups: "",
                            channels: "",
                            status: d.status,
                            type: "NINGUNO",
                            supervisor: "",
                            operation: "INSERT",
                            redirect: "/usersettings"
                        }
                    }
                }), {});
                Object.values(table).forEach((p) => {
                    dispatch(execute({
                        header: insUser({ ...p }),
                        detail: [
                            insOrgUser({ ...p.detail }),
                        ]
                    }, true));
                });
                setWaitImport(true)
            }
            else {
                dispatch(showSnackbar({ show: true, success: false, message: t(langKeys.no_records_valid) }));
            }
        }
    }
    const handleDropUsers = async (files: any) => {
        debugger
        const file = files?.item(0);
        if (file) {
            let excel: any = await uploadExcel(file, undefined);
            let data = array_trimmer(excel);
            data = data.filter((f: any) =>
                (f.status === undefined || Object.keys(domains.value?.userstatus?.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domainvalue }), {})).includes('' + f.status))
                && (f.delete === undefined || [0, 1].includes(Number(f.delete)))
            );
            if (data.length > 0) {
                dispatch(showBackdrop(true));
                let table: Dictionary = data.reduce((a: any, d) => ({
                    ...a,
                    [`${d.username}_${d.status}`]: {
                        ...dataUsers.filter(x => x.usr === d.username)[0],
                        status: Boolean(d.delete) ? "ELIMINADO" : d.status,
                        operation: d.delete === 0 ? "DELETE" : "UPDATE",
                    }
                }), {});
                Object.values(table).forEach((p) => {
                    dispatch(execute(insUser({ ...p, id: p.userid, pwdchangefirstlogin: false })));
                });
                setwaitChanges(true)
            }
            else {
                dispatch(showSnackbar({ show: true, success: false, message: t(langKeys.no_records_valid) }));
            }
        }
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }
    const handleDuplicate = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: false });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(insUser({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.userid, pwdchangefirstlogin: false })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    if (viewSelected === "view-1") {

        if (mainResult.error) {
            return <h1>ERROR</h1>;
        }

        return (
            <TableZyx
                columns={columns}
                titlemodule={t(langKeys.user, { count: 2 })}
                data={dataUsers}
                download={true}
                loading={mainResult.loading}
                register={true}
                hoverShadow={true}
                handleRegister={handleRegister}
                importCSV={handleUpload}
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
                                style={{ display: 'none' }}
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
                                    style={{ backgroundColor: "#fb5f5f" }}>
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
        )
    }
    else
        return (
            <DetailUsers
                data={rowSelected}
                setViewSelected={setViewSelected}
                multiData={mainMultiResult.data}
                fetchData={fetchData}
            />
        )
}

export default Users;