/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect } from 'components';
import { getPropertySel, getChannelsByOrg, getValuesFromDomain, insProperty } from 'common/helpers';
import { Dictionary, MultiData } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, resetMain, getMultiCollection, execute } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
interface DetailPropertyProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: () => void
}
const arrayBread = [
    { id: "view-1", name: "Properties" },
    { id: "view-2", name: "Property detail" }
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

const DetailProperty: React.FC<DetailPropertyProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const user = useSelector(state => state.login.validateToken.user);

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const dataStatus = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataChannel = multiData[0] && multiData[0].success ? multiData[0].data : [];

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            type: 'NINGUNO',
            communicationchannelid: row ? row.communicationchannelid : 0,
            id: row ? row.propertyid : 0,
            propertyname: row ? row.propertyname : '',
            propertyvalue: row ? row.propertyvalue : '',
            description: row ? (row.description || '') : '',
            status: row ? row.status : 'ACTIVO',
            operation: row ? "EDIT" : "INSERT"
        }
    });

    React.useEffect(() => {
        register('communicationchannelid');
        register('type');
        register('id');
        register('propertyname', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('propertyvalue', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeRes, waitSave])

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(insProperty(data)));
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
        <div style={{ width: '100%' }}>
            <TemplateBreadcrumbs
                breadcrumbs={arrayBread}
                handleClick={setViewSelected}
            />
            <TitleDetail
                title={row ? `${row.propertyname}` : t(langKeys.newproperty)}
            />
            <form onSubmit={onSubmit}>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.corporation)} // "Corporation"
                                className="col-6"
                                valueDefault={row ? (row.corpdesc || "") : user?.corpdesc}
                                disabled={true}
                            />
                            : <FieldView
                                label={t(langKeys.corporation)}
                                value={row ? (row.corpdesc || "") : ""}
                                className="col-6"
                            />}
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.organization)} // "Organization"
                                className="col-6"
                                valueDefault={row ? (row.orgdesc || "") : user?.orgdesc}
                                disabled={true}
                            />
                            : <FieldView
                                label={t(langKeys.organization)}
                                value={row ? (row.orgdesc || "") : ""}
                                className="col-6"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldSelect
                                label={t(langKeys.channel)}
                                valueDefault={row ? (row.communicationchanneldesc || "") : ""}
                                className="col-6"
                                onChange={(value) => setValue('communicationchannelid', value ? value.communicationchannelid : 0)}
                                error={errors?.status?.message}
                                data={dataChannel}
                                optionDesc="description"
                                optionValue="communicationchannelid"
                            />
                            : <FieldView
                                label={t(langKeys.channel)}
                                value={row ? (row.communicationchanneldesc || "") : ""}
                                className="col-6"
                            />}
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.name)}
                                className="col-6"
                                valueDefault={row ? (row.propertyname || "") : ""}
                                onChange={(value) => setValue('propertyname', value)}
                                error={errors?.propertyname?.message}
                            />
                            : <FieldView
                                label={t(langKeys.name)}
                                value={row ? (row.propertyname || "") : ""}
                                className="col-6"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.value)}
                                className="col-6"
                                valueDefault={row ? (row.propertyvalue || "") : ""}
                                onChange={(value) => setValue('propertyvalue', value)}
                                error={errors?.propertyvalue?.message}
                            />
                            : <FieldView
                                label={t(langKeys.value)}
                                value={row ? (row.propertyvalue || "") : ""}
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
                                label={t(langKeys.description)}
                                className="col-6"
                                valueDefault={row ? (row.description || "") : ""}
                                onChange={(value) => setValue('description', value)}
                                error={errors?.description?.message}
                            />
                            : <FieldView
                                label={t(langKeys.description)}
                                value={row ? (row.description || "") : ""}
                                className="col-6"
                            />}

                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
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
            </form>
        </div>
    );
}

const Properties: FC = () => {
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
                Header: t(langKeys.name),
                accessor: 'propertyname',
                NoFilter: true
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                NoFilter: true
            },
            {
                Header: t(langKeys.value),
                accessor: 'propertyvalue',
                NoFilter: true
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
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
                Header: t(langKeys.channel),
                accessor: 'communicationchanneldesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.changeDate),
                accessor: 'changedate',
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

    const fetchData = () => dispatch(getCollection(getPropertySel(0)));

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([getChannelsByOrg(), getValuesFromDomain("ESTADOGENERICO")]));
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
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() })
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
            dispatch(execute(insProperty({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.propertyid })));
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

        if (mainResult.mainData.error) {
            return <h1>ERROR</h1>;
        }

        return (
            <TableZyx
                columns={columns}
                titlemodule={t(langKeys.property, { count: 2 })}
                data={mainResult.mainData.data}
                loading={mainResult.mainData.loading}
                download={true}
                register={true}
                handleRegister={handleRegister}
            // fetchData={fetchData}
            />
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailProperty
                data={rowSelected}
                setViewSelected={setViewSelected}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
            />
        )
    } else
        return null;

}

export default Properties;