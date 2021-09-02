/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, FieldMultiSelect, TemplateSwitch } from 'components';
import { getParentSel, getChannelsByOrg, getValuesFromDomain, insProperty, getClassificationSel, insClassification } from 'common/helpers';
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
import AddIcon from '@material-ui/icons/Add';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
interface DetailTipificationProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: () => void
}
const arrayBread = [
    { id: "view-1", name: "Tipifications" },
    { id: "view-2", name: "Tipification detail" }
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
    title: {
        fontSize: '22px',
        lineHeight: '48px',
        // fontWeight: 'bold',
        height: '48px',
        color: theme.palette.text.primary,
    },
    halfplace: {
        width: "50%",
    }
}));

const DetailTipification: React.FC<DetailTipificationProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const [hasactionplan, setHasactionplan] = useState(row?.jobplan || false);
    // let jobplan: any[] = [];
    // if (row) {
    //     if (row.jobplan) {
    //         jobplan = JSON.parse(row.jobplan)
    //     }
    // }
    // console.log(jobplan)

    const [jobplan, setjobplan] = useState<Dictionary[]>(row && row.jobplan ? JSON.parse(row.jobplan) : [])

    const executeRes = useSelector(state => state.main.execute);
    const user = useSelector(state => state.login.validateToken.user);

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataParent = multiData[1] && multiData[1].success ? multiData[1].data : [];

    const datachannels = multiData[2] && multiData[2].success ? multiData[2].data : [];


    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            type: 'TIPIFICACION',
            id: row?.classificationid || 0,
            description: row?.description || '',
            parent: row?.classificationid || 0,
            communicationchannel: row?.communicationchannelid || '',
            status: row ? row.status : 'ACTIVO',
            operation: row ? "EDIT" : "INSERT",
            path: row?.path || '',
            // jobplan: row?.jobplan || '',
        }
    });

    React.useEffect(() => {
        register('id');
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('parent', { validate: (value) => (value && value > 0) || t(langKeys.field_required) });
        register('communicationchannel', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('type');
        register('path');
        // register('jobplan');
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
    function addaction() {
        setjobplan((p) => [...p, { element: "text" }])
    }
    function showactionplan() {
        return jobplan.forEach((e: any) => {
            return (<div>lol</div>)
        })
    }
    // const ActionsPlan: FC = () => {
    //     return jobplan.map((e: any) => <div>lol</div>)
    // }

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
                title={row ? `${row.description}` : t(langKeys.tipification)}
            />
            <form onSubmit={onSubmit}>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.organization)}
                                className="col-6"
                                valueDefault={row ? (row.orgdesc || "") : user?.orgdesc}
                                disabled={true}
                            />
                            : <FieldView
                                label={t(langKeys.organization)}
                                value={row ? (row.orgdesc || "") : ""}
                                className="col-6"
                            />}
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.classification)}
                                className="col-6"
                                onChange={(value) => setValue('description', value)}
                                valueDefault={row ? (row.description || "") : ""}
                                error={errors?.description?.message}
                                disabled={true}
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
                                label={t(langKeys.parent)}
                                className="col-6"
                                valueDefault={row ? (row.parent || "") : ""}
                                onChange={(value) => setValue('parent', value ? value.classificationid : 0)}
                                error={errors?.parent?.message}
                                data={dataParent}
                                optionDesc="description"
                                optionValue="classificationid"
                            />
                            : <FieldView
                                label={t(langKeys.parent)}
                                value={row ? (row.parent || "") : ""}
                                className="col-6"
                            />}
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.completedesc)}
                                className="col-6"
                                valueDefault={row ? (row.path || "") : ""}
                                onChange={(value) => setValue('path', value)}
                                error={errors?.path?.message}
                            />
                            : <FieldView
                                label={t(langKeys.completedesc)}
                                value={row ? (row.path || "") : ""}
                                className="col-6"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldMultiSelect
                                label={t(langKeys.channel_plural)}
                                className="col-6"
                                onChange={(value) => setValue('communicationchannel', value.map((o: Dictionary) => o.domainvalue).join())}
                                valueDefault={row?.communicationchannel || ""}
                                error={errors?.communicationchannel?.message}
                                data={datachannels}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            />
                            : <FieldView
                                label={t(langKeys.channel_plural)}
                                value={row ? (row.communicationchannelid || "") : ""}
                                className="col-6"
                            />}
                        {edit ?
                            <FieldSelect
                                label={t(langKeys.status)}
                                className="col-6"
                                valueDefault={row ? (row.status || "") : ""}
                                onChange={(value) => setValue('status', value ? value.domainvalue : '')}
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
                    <div style={{ marginBottom: '16px' }}>
                        <div className={classes.title}>{t(langKeys.actionplan)}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            {edit ?
                                <TemplateSwitch
                                    // className={classes.halfplace}
                                    label={t(langKeys.hasactionplan)}
                                    valueDefault={hasactionplan}
                                    onChange={(value) => setHasactionplan(value)}
                                /> :
                                <FieldView
                                    label={t(langKeys.default_organization)}
                                    value={row ? (row.bydefault ? t(langKeys.affirmative) : t(langKeys.negative)) : t(langKeys.negative)}
                                />
                            }
                            {edit && hasactionplan &&
                                <div>
                                    <Button
                                        variant="contained"
                                        type="button"
                                        color="primary"
                                        endIcon={<AddIcon style={{ color: "#deac32" }} />}
                                        style={{ backgroundColor: "#6c757d" }}
                                        onClick={() => addaction()}
                                    >{t(langKeys.action)}
                                    </Button>
                                </div>
                            }
                        </div>
                        <div className="row-zyx">
                            {
                                // edit ? (
                                //     hasactionplan ? (
                                //         () => showactionplan()
                                //     )
                                //         : null
                                // )
                                //     : null
                                (edit && hasactionplan) && jobplan.map((e: any) => (
                                    <div>lol</div>
                                ))
                            }
                        </div>
                        <div className="row-zyx">

                        </div>

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

const Tipifications: FC = () => {
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
                Header: t(langKeys.title),
                accessor: 'description',
                NoFilter: true
            },
            {
                Header: t(langKeys.description),
                accessor: 'path',
                NoFilter: true
            },
            {
                Header: t(langKeys.parent),
                accessor: 'parentdesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.tag),
                accessor: 'tags',
                NoFilter: true
            },

            {
                Header: t(langKeys.channel),
                accessor: 'communicationchanneldesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.status),
                accessor: 'statusdesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.action),
                accessor: 'classificationid',
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

    const fetchData = () => dispatch(getCollection(getClassificationSel(0)));

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([
            getValuesFromDomain("ESTADOGENERICO"),
            getParentSel(),
            getValuesFromDomain("TIPOCANAL"),
        ]));
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
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.tipification).toLocaleLowerCase() })
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
                titlemodule={t(langKeys.tipification, { count: 2 })}
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
            <DetailTipification
                data={rowSelected}
                setViewSelected={setViewSelected}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
            />
        )
    } else
        return null;

}

export default Tipifications;