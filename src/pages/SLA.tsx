import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect } from 'components';
import { getSLASel, getValuesFromDomain, insSLA } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm, NestedValue } from 'react-hook-form';
import { getCollection, resetMain, getMultiCollection, execute } from 'store/main/actions';
import { showSnackbar, showBackdrop } from 'store/popus/actions';
import { useHistory } from 'react-router-dom';

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
        maxWidth: '80%',
        padding: theme.spacing(2),
        background: '#fff',
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
}));

const DetailSLA: React.FC<DetailSLAProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const dataStatus = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataChannel = multiData[0] && multiData[0].success ? multiData[0].data : [];

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            type: 'NINGUNO',
            slaid: row ? row.slaid : 0,
            company: row ? (row.company || '') : '',
            communicationchannelid: row ? row.communicationchannelid : 0,
            modelid: row ? (row.modelid || '') : '',
            apikey: row ? (row.apikey || '') : '',
            description: row ? (row.description || '') : '',
            provider: row ? (row.provider || '') : '',
            organization: row ? (row.organization || '') : '',
            totaltmo: row ? (row.totaltmo || '') : '',
            totaltmomin: row ? (row.totaltmomin || '') : '',
            totaltmopercentmax: row ? (row.totaltmopercentmax || '') : '',
            group: row ? (row.group || '') : '',
            usertmomin: row ? (row.usertmomin || '') : '',
            usertmo: row ? (row.usertmo || '') : '',
            usertmopercentmax: row ? (row.usertmopercentmax || '') : '',
            usertmemin: row ? (row.usertmemin || '') : '',
            usertme: row ? (row.usertme || '') : '',
            usertmepercentmax: row ? (row.usertmepercentmax || '') : '',
            status: row ? row.status : 'ACTIVO',
            operation: row ? "EDIT" : "INSERT"
        }
    });

    React.useEffect(() => {
        register('type');
        register('communicationchannelid');
        register('slaid');
        register('company', { validate: (value) => (value && value.length) || 'This is required.' });
        register('usertmomin', { validate: (value) => (value && value.length) || 'This is required.' });
        register('usertmo', { validate: (value) => (value && value.length) || 'This is required.' });
        register('usertmopercentmax', { validate: (value) => (value && value.length) || 'This is required.' });
        register('usertmemin', { validate: (value) => (value && value.length) || 'This is required.' });
        register('usertme', { validate: (value) => (value && value.length) || 'This is required.' });
        register('usertmepercentmax', { validate: (value) => (value && value.length) || 'This is required.' });
        register('apikey', { validate: (value) => (value && value.length) || 'This is required.' });
        register('modelid', { validate: (value) => (value && value.length) || 'This is required.' });
        register('description', { validate: (value) => (value && value.length) || 'This is required.' });
        register('provider', { validate: (value) => (value && value.length) || 'This is required.' });
        register('communicationchannelid', { validate: (value) => (value && value.length) || 'This is required.' });
        register('organization', { validate: (value) => (value && value.length) || 'This is required.' });
        register('totaltmo', { validate: (value) => (value && value.length) || 'This is required.' });
        register('totaltmomin', { validate: (value) => (value && value.length) || 'This is required.' });
        register('totaltmopercentmax', { validate: (value) => (value && value.length) || 'This is required.' });
        register('group', { validate: (value) => (value && value.length) || 'This is required.' });
        register('status', { validate: (value) => (value && value.length) || 'This is required.' });
    }, [edit, register]);

    useEffect(() => {
        if (!executeRes.loading && !executeRes.error && waitSave) {
            dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_edit) }))
            setWaitSave(false);
            dispatch(showBackdrop(false));
            fetchData();
        }
    }, [executeRes, waitSave])
    

    const onSubmit = handleSubmit((data) => {
        dispatch(execute(insSLA(data)));
        dispatch(showBackdrop(true));
        setWaitSave(true)
    });

    return (
        <div>
            <TemplateBreadcrumbs
                breadcrumbs={arrayBread}
                handleClick={setViewSelected}
            />
            <TitleDetail
                title={row ? `${row.endpoint}` : "New Service level agreement"}
            />
            <form onSubmit={onSubmit}>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.organization)} 
                                className="col-6"
                                onChange={(value) => setValue('organization', value)}
                                valueDefault={row ? (row.organization || "") : ""}
                                error={errors?.organization?.message}
                            />
                            : <FieldView
                                label={t(langKeys.organization)}
                                value={row ? (row.organization || "") : ""}
                                className="col-6"
                            />}
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.company)} 
                                className="col-6"
                                onChange={(value) => setValue('company', value)}
                                valueDefault={row ? (row.company || "") : ""}
                                error={errors?.company?.message}
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
                            <FieldEdit
                                label={t(langKeys.channel_plural)} //transformar a multiselect
                                className="col-12"
                                onChange={(value) => setValue('communicationchannelid', value)}
                                valueDefault={row ? (row.communicationchannelid || "") : ""}
                                error={errors?.communicationchannelid?.message}
                            />
                            : <FieldView
                                label={t(langKeys.channel_plural)}
                                value={row ? (row.communicationchannelid || "") : ""}
                                className="col-6"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.group)} 
                                className="col-6"
                                onChange={(value) => setValue('group', value)}
                                valueDefault={row ? (row.group || "") : ""}
                                error={errors?.group?.message}
                            />
                            : <FieldView
                                label={t(langKeys.group)}
                                value={row ? (row.group || "") : ""}
                                className="col-6"
                            />}
                        {edit ?
                            <FieldSelect
                                label={t(langKeys.status)}
                                className="col-6"
                                valueDefault={row ? (row.status || "") : ""}
                                onChange={(value) => setValue('status', value.domainvalue)}
                                error={errors?.status?.message}
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
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
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
                            label={"TME user min"} 
                            className="col-4"
                            onChange={(value) => setValue('usertmemin', value)}
                            valueDefault={row ? (row.usertmemin || "") : ""}
                            error={errors?.usertmemin?.message}
                            />
                            : <FieldView
                            label={"TME user min"} 
                            value={row ? (row.usertmemin || "") : ""}
                            className="col-4"
                            />}
                        {edit ?
                            <FieldEdit
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
                    </div>
                    
                    {edit &&
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                type="submit"
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                            >Save
                            </Button>
                        </div>
                    }
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
                Header: t(langKeys.company),
                accessor: 'company',
                NoFilter: true
            },
            {
                Header: t(langKeys.corporation),
                accessor: 'corpdesc',
                NoFilter: true
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
                Header: t(langKeys.communicationchanneldesc),
                accessor: 'communicationchanneldesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.tme),
                accessor: 'tme',
                NoFilter: true
            },
            {
                Header: t(langKeys.tmepercentobj),
                accessor: 'tmepercentmin',
                NoFilter: true
            },
            {
                Header: "TMO total",
                accessor: 'totaltmo',
                NoFilter: true
            },
            {
                Header: t(langKeys.tmopercentobj),
                accessor: 'totaltmopercentmax',
                NoFilter: true
            },
            {
                Header: t(langKeys.usertme),
                accessor: 'usertme',
                NoFilter: true
            },
            {
                Header: t(langKeys.usertmepercentmax),
                accessor: 'usertmepercentmax',
                NoFilter: true
            },
            {
                Header: t(langKeys.usertmo),
                accessor: 'usertmo',
                NoFilter: true
            },
            {
                Header: t(langKeys.usertmopercentmax),
                accessor: 'usertmopercentmax',
                NoFilter: true
            },
            {
                Header: t(langKeys.action),
                accessor: 'slaid',
                NoFilter: true,
                isComponent: true,
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
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getSLASel(0)));

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([getValuesFromDomain("GRUPOS"), getValuesFromDomain("ESTADOGENERICO")]));
        return () => {
            dispatch(resetMain());
        };
    }, []);

    useEffect(() => {
        if (!executeResult.loading && !executeResult.error && waitSave) {
            dispatch(showBackdrop(false));
            dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_edit) }))
            setWaitSave(false);
            fetchData();
        } else if (executeResult.error) {
            dispatch(showSnackbar({ show: true, success: false, message: executeResult.message}))
            dispatch(showBackdrop(false));
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
        dispatch(execute(insSLA({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.id })));
        dispatch(showBackdrop(true));
        setWaitSave(true);
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