/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, FieldMultiSelect } from 'components';
import { getSLASel, getValuesFromDomain, insSLA,getCommChannelLst } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, resetAllMain, getMultiCollection, execute } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
interface MultiData {
    data: Dictionary[];
    success: boolean;
}
interface DetailSLAProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: () => void
}
const arrayBread = [
    { id: "view-1", name: "Service level agreement" },
    { id: "view-2", name: "Service level agreement detail" }
];

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    title: {
        fontSize: '22px',
        lineHeight: '48px',
        // fontWeight: 'bold',
        height: '48px',
        color: theme.palette.text.primary,
    },
}));

const DetailSLA: React.FC<DetailSLAProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const user = useSelector(state => state.login.validateToken.user);

    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataSupplier = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataGroups = multiData[2] && multiData[2].success ? multiData[2].data : [];
    const datachannels = multiData[3] && multiData[3].success ? multiData[3].data : [];

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            type: 'NINGUNO',
            id: row?.slaid || 0,
            description: row?.description || '',
            company: row?.company || '',
            communicationchannelid:  row?.communicationchannelid || '',
            usergroup: row?.usergroup || '',
            status: row?.status || 'ACTIVO',
            totaltmo: row?.totaltmo || '',
            totaltmomin: row?.totaltmomin || '',
            totaltmopercentmax: row?.totaltmopercentmax || 0,
            usertmo: row?.usertmo || '',
            usertmomin: row?.usertmomin || '',
            usertmopercentmax: row?.usertmopercentmax || 0,
            usertme: row?.usertme || '',
            productivitybyhour: row?.productivitybyhour || 0,
            usertmepercentmax: row?.usertmepercentmax || 0,

            organization: row?.organization || '',
            operation: row ? "EDIT" : "INSERT"
        }
    });

    React.useEffect(() => {
        register('type');
        register('id');
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('company');
        register('usergroup');
        register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('totaltmo', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('totaltmomin', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('totaltmopercentmax', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('usertmo', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('usertmomin', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('usertmopercentmax', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('usertme', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('productivitybyhour', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('usertmepercentmax', { validate: (value) => (value && value.length) || t(langKeys.field_required) });

        register('communicationchannelid', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('organization');
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.sla).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])
    
    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(insSLA(data)));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    return (
        <div style={{width: '100%'}}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBread}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={row ? `${row.description}` : t(langKeys.newsla)}
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
                        {edit &&
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type="submit"
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}
                        >{t(langKeys.save)}
                        </Button>
                        }
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.organization)} 
                                className="col-6"
                                onChange={(value) => setValue('organization', value)}
                                valueDefault={row ? (row.orgdesc || "") : user?.orgdesc}
                                error={errors?.organization?.message}
                                disabled={true}
                            />
                            : <FieldView
                                label={t(langKeys.organization)}
                                value={row ? (row.organization || "") : ""}
                                className="col-6"
                            />}
                        {edit ?
                            <FieldSelect
                                label={t(langKeys.supplier)} 
                                className="col-6"
                                valueDefault={row ? (row.company || "") : ""}
                                onChange={(value) => setValue('company', value? value.domainvalue: '')}
                                error={errors?.company?.message}
                                data={dataSupplier}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            />
                            : <FieldView
                                label={t(langKeys.company)}
                                value={row ? (row.company || "") : ""}
                                className="col-6"
                            />}
                    </div>  
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.description)} //transformar a multiselect
                                className="col-12"
                                onChange={(value) => setValue('description', value)}
                                valueDefault={row ? (row.description || "") : ""}
                                error={errors?.description?.message}
                            />
                            : <FieldView
                                label={t(langKeys.description)}
                                value={row ? (row.description || "") : ""}
                                className="col-6"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldMultiSelect
                                label={t(langKeys.channel_plural)} //transformar a multiselect
                                className="col-12"
                                onChange={(value) => setValue('communicationchannelid', value.map((o: Dictionary) => o.communicationchannelid).join())}
                                valueDefault={row?.communicationchannelid || ""}
                                error={errors?.communicationchannelid?.message}
                                data={datachannels}
                                optionDesc="communicationchanneldesc"
                                optionValue="communicationchannelid"
                            />
                            : <FieldView
                                label={t(langKeys.channel_plural)}
                                value={row ? (row.communicationchannelid || "") : ""}
                                className="col-6"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldMultiSelect
                                label={t(langKeys.group)} 
                                className="col-6"
                                onChange={(value) => setValue('usergroup', value.map((o: Dictionary) => o.domainvalue).join())}
                                valueDefault={row?.usergroup || ""}
                                error={errors?.usergroup?.message}
                                data={dataGroups}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            />
                            : <FieldView
                                label={t(langKeys.usergroup)}
                                value={row ? row.usergroup : ""}
                            />}
                        {edit ?
                            <FieldSelect
                                label={t(langKeys.status)}
                                className="col-6"
                                valueDefault={row?.status || "ACTIVO"}
                                onChange={(value) => setValue('status', value? value.domainvalue: '')}
                                error={errors?.status?.message}
                                uset={true}
                                prefixTranslation="status_"
                                data={dataStatus}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            />
                            : <FieldView
                                label={t(langKeys.status)}
                                value={row ? (row.status || "") : ""}
                                className="col-6"
                            />}
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <div className={classes.title}>{t(langKeys.detail)}</div>
                        <div className="row-zyx">
                            {edit ?
                                <FieldEdit
                                type="time"
                                label={"TMO total min"} 
                                className="col-4"
                                onChange={(value) => setValue('totaltmomin', value)}
                                valueDefault={row ? (row.totaltmomin || "") : ""}
                                error={errors?.totaltmomin?.message}
                                />
                                : <FieldView
                                label={"TMO total min"} 
                                value={row ? (row.totaltmomin || "") : ""}
                                className="col-4"
                                />}
                            {edit ?
                                <FieldEdit
                                    type="time"
                                    label={"TMO total max"} 
                                    className="col-4"
                                    onChange={(value) => setValue('totaltmo', value)}
                                    valueDefault={row ? (row.totaltmo || "") : ""}
                                    error={errors?.totaltmo?.message}
                                />
                                : <FieldView
                                    label={"TMO total max"}
                                    value={row ? (row.totaltmo || "") : ""}
                                    className="col-4"
                                />}
                            {edit ?
                                <FieldEdit
                                    type="number"
                                    label={t(langKeys.tmopercentobj)} 
                                    className="col-4"
                                    onChange={(value) => setValue('totaltmopercentmax', value)}
                                    valueDefault={row ? (row.totaltmopercentmax || "") : ""}
                                    error={errors?.totaltmopercentmax?.message}
                                />
                                : <FieldView
                                    label={t(langKeys.tmopercentobj)}
                                    value={row ? (row.totaltmopercentmax || "") : ""}
                                    className="col-4"
                                />}
                        </div>
                        <div className="row-zyx">
                            {edit ?
                                <FieldEdit
                                type="time"
                                label={"TMO user min"} 
                                className="col-4"
                                onChange={(value) => setValue('usertmomin', value)}
                                valueDefault={row ? (row.usertmomin || "") : ""}
                                error={errors?.usertmomin?.message}
                                />
                                : <FieldView
                                label={"TMO user min"} 
                                value={row ? (row.usertmomin || "") : ""}
                                className="col-4"
                                />}
                            {edit ?
                                <FieldEdit
                                    type="time"
                                    label={"TMO user max"} 
                                    className="col-4"
                                    onChange={(value) => setValue('usertmo', value)}
                                    valueDefault={row ? (row.usertmo || "") : ""}
                                    error={errors?.usertmo?.message}
                                />
                                : <FieldView
                                    label={"TMO total max"}
                                    value={row ? (row.usertmo || "") : ""}
                                    className="col-4"
                                />}
                            {edit ?
                                <FieldEdit
                                    type="number"
                                    label={t(langKeys.usertmopercentmax)} 
                                    className="col-4"
                                    onChange={(value) => setValue('usertmopercentmax', value)}
                                    valueDefault={row ? (row.usertmopercentmax || "") : ""}
                                    error={errors?.usertmopercentmax?.message}
                                />
                                : <FieldView
                                    label={t(langKeys.usertmopercentmax)}
                                    value={row ? (row.usertmopercentmax || "") : ""}
                                    className="col-4"
                                />}
                        </div>
                        <div className="row-zyx">
                            
                            {edit ?
                                <FieldEdit
                                    type="time"
                                    label={"TME user max"} 
                                    className="col-4"
                                    onChange={(value) => setValue('usertme', value)}
                                    valueDefault={row ? (row.usertme || "") : ""}
                                    error={errors?.usertme?.message}
                                />
                                : <FieldView
                                    label={"TME total max"}
                                    value={row ? (row.usertme || "") : ""}
                                    className="col-4"
                                />}
                            {edit ?
                                <FieldEdit
                                    type="number"
                                    label={t(langKeys.usertmepercentmax)} 
                                    className="col-4"
                                    onChange={(value) => setValue('usertmepercentmax', value)}
                                    valueDefault={row ? (row.usertmepercentmax || "") : ""}
                                    error={errors?.usertmepercentmax?.message}
                                />
                                : <FieldView
                                    label={t(langKeys.usertmepercentmax)}
                                    value={row ? (row.usertmepercentmax || "") : ""}
                                    className="col-4"
                                />}
                            {edit ?
                                <FieldEdit
                                label={t(langKeys.productivitybyhour)} 
                                className="col-4"
                                onChange={(value) => setValue('productivitybyhour', value)}
                                valueDefault={row ? (row.productivitybyhour || "") : ""}
                                error={errors?.productivitybyhour?.message}
                                />
                                : <FieldView
                                label={"TME user min"} 
                                value={row ? (row.productivitybyhour || "") : ""}
                                className="col-4"
                                />}
                        </div>
                        
                    </div>
                </div>
            </form>
        </div>
    );
}

const SLA: FC = () => {
    // const history = useHistory();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);

    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);

    const columns = React.useMemo(
        () => [
            {
                accessor: 'slaid',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                            viewFunction={() => handleView(row)}
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.organization),
                accessor: 'orgdesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                NoFilter: true
            },
            {
                Header: t(langKeys.channel),
                accessor: 'communicationchanneldesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.tmototalobj),
                accessor: 'totaltmopercentmax',
                NoFilter: true
            },
            {
                Header: t(langKeys.tmoasesorobj),
                accessor: 'usertmopercentmax',
                NoFilter: true
            },
            {
                Header: t(langKeys.tmeasesorobj),
                accessor: 'usertmepercentmax',
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

    const fetchData = () => dispatch(getCollection(getSLASel(0)));

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([
            getValuesFromDomain("ESTADOGENERICO"),
            getValuesFromDomain("EMPRESA"),
            getValuesFromDomain("GRUPOS"),
            getCommChannelLst()
        ]));
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.sla).toLocaleLowerCase() })
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

    const handleView = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: false });
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(insSLA({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.slaid })));
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

        return (
            <TableZyx
                columns={columns}
                titlemodule={t(langKeys.sla, { count: 2 })}
                data={mainResult.mainData.data}
                download={true}
                loading={mainResult.mainData.loading}
                register={true}
                handleRegister={handleRegister}
            // fetchData={fetchData}
            />
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailSLA
                data={rowSelected}
                setViewSelected={setViewSelected}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
            />
        )
    } else
        return null;

}

export default SLA;