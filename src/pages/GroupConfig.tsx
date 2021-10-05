/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect } from 'components';
import { getGroupConfigSel, getValuesFromDomain, insGroupConfig } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import {
    getCollection, resetMain, getMultiCollection,
    execute
} from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';
// import { useHistory } from 'react-router-dom';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
interface MultiData {
    data: Dictionary[];
    success: boolean;
}
interface DetailGroupConfigProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: () => void
}
const arrayBread = [
    { id: "view-1", name: "Group Configuration" },
    { id: "view-2", name: "Group Configuration Detail" }
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
}));

const DetailGroupConfig: React.FC<DetailGroupConfigProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const dataStatus = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataDomain = multiData[0] && multiData[0].success ? multiData[0].data : [];

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            type: 'NINGUNO',
            id: row ? row.groupconfigurationid : 0,
            description: row ? (row.description || '') : '',
            status: row?.status || 'ACTIVO',
            quantity: row ? row.quantity : 0,
            domainid: row ? row.domainid : 0,
            validationtext: row ? row.validationtext : '',
            operation: row ? "EDIT" : "INSERT"
        }
    });

    React.useEffect(() => {
        register('type');
        register('id');
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('quantity', { validate: (value) => (value && value > 0) || t(langKeys.field_required) });
        register('domainid', { validate: (value) => (value && value > 0) || t(langKeys.field_required) });
        register('validationtext', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.groupconfig).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])
    
    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(insGroupConfig(data)));
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
                            title={row ? `${row.description}` : t(langKeys.newgroupconfig)}
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
                            <FieldSelect
                                label={t(langKeys.domain)}                                
                                className="col-6"
                                valueDefault={row ? (row.domainid || "") : ""}
                                onChange={(value) => setValue('domainid', (value?value.domainid:0))}
                                error={errors?.domainid?.message}
                                data={dataDomain}
                                optionDesc="domaindesc"
                                optionValue="domainid"
                            />
                            : <FieldView
                                label={t(langKeys.domain)}
                                value={row ? (row.domaindesc || "") : ""}
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
                            <FieldSelect
                                label={t(langKeys.status)}
                                className="col-6"
                                valueDefault={row?.status || "ACTIVO"}
                                onChange={(value) => setValue('status', (value?value.domainvalue:""))}
                                error={errors?.status?.message}
                                data={dataStatus}
                                uset={true}
                                prefixTranslation="status_"
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            />
                            : <FieldView
                                label={t(langKeys.status)}
                                value={row ? (row.status || "") : ""}
                                className="col-6"
                            />}
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.quantity)} 
                                error={errors?.quantity?.message}
                                onChange={(value) => setValue('quantity', value ? parseInt(value) : 0)}
                                type="number"
                                className="col-6"
                                valueDefault={row ? (row.quantity || "") : ""}
                            />
                            : <FieldView
                                label={t(langKeys.quantity)}
                                value={row ? (row.quantity || "") : ""}
                                className="col-6"
                            />}
                    </div>

                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.validationtext)}
                                className="col-6"
                                valueDefault={row ? (row.validationtext || "") : ""}
                                onChange={(value) => setValue('validationtext', value)}
                                error={errors?.validationtext?.message}
                            />
                            : <FieldView
                                label={t(langKeys.validationtext)}
                                value={row ? (row.validationtext || "") : ""}
                                className="col-6"
                            />}
                    </div>
                </div>
            </form>
        </div>
    );
}

const GroupConfig: FC = () => {
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
                accessor: 'userid',
                NoFilter: true,
                isComponent: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                            viewFunction={() => handleView(row)}
                            // viewFunction={() => history.push(`/properties/${row.GroupConfigid}`)}
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.domain),
                accessor: 'domaindesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                NoFilter: true
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                NoFilter: true
            },
            {
                Header: t(langKeys.quantity),
                accessor: 'quantity',
                NoFilter: true
            },
            {
                Header: t(langKeys.validationtext),
                accessor: 'validationtext',
                NoFilter: true
            },
            
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getGroupConfigSel(0)));

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([getValuesFromDomain("GRUPOS"), getValuesFromDomain("ESTADOGENERICO")]));
        return () => {
            dispatch(resetMain());
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
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.groupconfig).toLocaleLowerCase() })
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
            dispatch(execute(insGroupConfig({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.groupconfigurationid })));
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
                titlemodule={t(langKeys.groupconfig, { count: 2 })}
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
            <DetailGroupConfig
                data={rowSelected}
                setViewSelected={setViewSelected}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
            />
        )
    } else
        return null;

}

export default GroupConfig;