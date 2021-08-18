/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit } from 'components';
import { getIntelligentModelsSel, insIntelligentModels } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, resetMain, execute } from 'store/main/actions';
import { showSnackbar, showBackdrop } from 'store/popus/actions';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
interface MultiData {
    data: Dictionary[];
    success: boolean;
}
interface DetailIntelligentModelsProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: () => void
}
const arrayBread = [
    { id: "view-1", name: "Intelligent models" },
    { id: "view-2", name: "Intelligent models detail" }
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

const DetailIntelligentModels: React.FC<DetailIntelligentModelsProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            type: 'NINGUNO',
            id: row ? row.id : 0,
            endpoint: row ? (row.endpoint || '') : '',
            modelid: row ? (row.modelid || '') : '',
            apikey: row ? (row.apikey || '') : '',
            description: row ? (row.description || '') : '',
            provider: row ? (row.provider || '') : '',
            status: row ? row.status : 'ACTIVO',
            operation: row ? "EDIT" : "INSERT"
        }
    });

    React.useEffect(() => {
        register('type');
        register('id');
        register('endpoint', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('apikey', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('modelid', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('provider', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
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
        dispatch(execute(insIntelligentModels(data)));
        dispatch(showBackdrop(true));
        setWaitSave(true)
    });

    return (
        <div style={{width: '100%'}}>
            <TemplateBreadcrumbs
                breadcrumbs={arrayBread}
                handleClick={setViewSelected}
            />
            <TitleDetail
                title={row ? `${row.endpoint}` : "New Intelligent Model"}
            />
            <form onSubmit={onSubmit}>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.endpoint)} 
                                className="col-6"
                                onChange={(value) => setValue('endpoint', value)}
                                valueDefault={row ? (row.endpoint || "") : ""}
                                error={errors?.endpoint?.message}
                            />
                            : <FieldView
                                label={t(langKeys.endpoint)}
                                value={row ? (row.endpoint || "") : ""}
                                className="col-6"
                            />}
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.modelid)} 
                                className="col-6"
                                onChange={(value) => setValue('modelid', value)}
                                valueDefault={row ? (row.modelid || "") : ""}
                                error={errors?.modelid?.message}
                            />
                            : <FieldView
                                label={t(langKeys.modelid)}
                                value={row ? (row.modelid || "") : ""}
                                className="col-6"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.apikey)} 
                                className="col-6"
                                onChange={(value) => setValue('apikey', value)}
                                valueDefault={row ? (row.apikey || "") : ""}
                                error={errors?.apikey?.message}
                            />
                            : <FieldView
                                label={t(langKeys.apikey)}
                                value={row ? (row.apikey || "") : ""}
                                className="col-6"
                            />}
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.description)} 
                                className="col-6"
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
                                label={t(langKeys.provider)} 
                                className="col-6"
                                onChange={(value) => setValue('provider', value)}
                                valueDefault={row ? (row.provider || "") : ""}
                                error={errors?.provider?.message}
                            />
                            : <FieldView
                                label={t(langKeys.provider)}
                                value={row ? (row.provider || "") : ""}
                                className="col-6"
                            />}
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.type)} 
                                className="col-6"
                                onChange={(value) => setValue('type', value)}
                                valueDefault={row ? (row.type || "") : ""}
                                error={errors?.type?.message}
                            />
                            : <FieldView
                                label={t(langKeys.type)}
                                value={row ? (row.type || "") : ""}
                                className="col-6"
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

const IntelligentModels: FC = () => {
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
                Header: t(langKeys.endpoint),
                accessor: 'endpoint',
                NoFilter: true
            },
            {
                Header: t(langKeys.modelid),
                accessor: 'modelid',
                NoFilter: true
            },
            {
                Header: t(langKeys.apikey),
                accessor: 'apikey',
                NoFilter: true
            },
            {
                Header: t(langKeys.provider),
                accessor: 'provider',
                NoFilter: true
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                NoFilter: true
            },
            {
                Header: t(langKeys.type),
                accessor: 'type',
                NoFilter: true
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                NoFilter: true
            },
            {
                Header: t(langKeys.action),
                accessor: 'userid',
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

    const fetchData = () => dispatch(getCollection(getIntelligentModelsSel(0)));

    useEffect(() => {
        fetchData();
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
        dispatch(execute(insIntelligentModels({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.id })));
        dispatch(showBackdrop(true));
        setWaitSave(true);
    }

    if (viewSelected === "view-1") {

        return (
            <TableZyx
                columns={columns}
                titlemodule={t(langKeys.intelligentmodels, { count: 2 })}
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
            <DetailIntelligentModels
                data={rowSelected}
                setViewSelected={setViewSelected}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
            />
        )
    } else
        return null;

}

export default IntelligentModels;