/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, Fragment, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, FieldMultiSelect, TemplateSwitch, FieldEditMulti, DialogZyx } from 'components';
import { getParentSel, getValuesFromDomain, getClassificationSel, insClassification, uploadExcel, getValuesForTree, exportExcel, templateMaker } from 'common/helpers';
import { Dictionary, MultiData } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { useForm } from 'react-hook-form';
import { getCollection, resetAllMain, getMultiCollection, execute } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import { TreeItem, TreeView } from '@material-ui/lab';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
interface DetailTipificationProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: () => void;
    externalUse?: boolean;
    externalType?: string;
    externalSaveHandler?: ({...param}?: any) => void;
    externalCancelHandler?: ({...param}?: any) => void;
}
const arrayBread = [
    { id: "view-1", name: "Tipifications" },
    { id: "view-2", name: "Tipification detail" }
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
    halfplace: {
        width: "50%",
    },
    dataaction: {
        width: "100%",
        paddingBottom: "20px",
    },
    treeviewroot: {
        height: 240,
        flexGrow: 1,
        maxWidth: 400,
    }
}));
const dataTypeAction = [
    { dat: "Simple" },
    { dat: "Variable" },
    { dat: "Request" }
]
const TreeItemsFromData: React.FC<{ dataClassTotal: Dictionary}> = ({ dataClassTotal }) => {
    const parents: any[] = []
    const children: any[] = []

    dataClassTotal.forEach((x: Dictionary) => {
        if (x.parent === 0) {
            let item = {
                key: x.classificationid,
                nodeId: x.classificationid.toString(),
                label: x.description.toString(),
                children: x.haschildren
            }
            parents.push(item)// = [...parents, item])
        } else {
            let item = {
                key: x.classificationid,
                nodeId: x.classificationid?.toString(),
                label: x.description?.toString(),
                children: x.haschildren,
                father: x.parent
            }
            children.push(item)
        }
    })

    function loadchildren(id: number) {
        return children.map(x => {
            if (x.father === id) {
                return (
                    <TreeItem
                        key={x.key}
                        nodeId={String(x.nodeId)}
                        label={x.label}
                    >
                        {x.children ? loadchildren(x.key) : null}
                    </TreeItem>
                )
            }
            return null;
        })
    }
    return (
        <>
            {parents.map(x =>
                <TreeItem
                    key={x.key}
                    nodeId={String(x.nodeId)}
                    label={x.label}
                >
                    {x.children ? loadchildren(x.key) : null}
                </TreeItem>)}
        </>
    )
};

export const DetailTipification: React.FC<DetailTipificationProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData, externalUse = false, externalType, externalSaveHandler, externalCancelHandler }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const [showAddAction, setShowAddAction] = useState(!!row?.jobplan || false);
    const [jobplan, setjobplan] = useState<Dictionary[]>(row && row.jobplan ? JSON.parse(row.jobplan) : [])

    const executeRes = useSelector(state => state.main.execute);
    // const user = useSelector(state => state.login.validateToken.user);

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataParent = multiData[1] && multiData[1].success ? multiData[1].data : [];

    const datachannels = multiData[2] && multiData[2].success ? multiData[2].data : [];
    
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            type: externalUse ? externalType : (row ? row?.type : 'TIPIFICACION'),
            id: row?.classificationid || 0,
            description: row?.description || '',
            title: row?.title || '',
            parent: row?.parentid || 0,
            communicationchannel: row?.communicationchannel || '',
            status: row?.status || 'ACTIVO',
            operation: row ? "EDIT" : "INSERT",
            path: row?.path || '',
            tags: row?.tags || ''
        }
    });

    React.useEffect(() => {
        register('id');
        register('title', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('parent');
        register('communicationchannel', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('type');
        register('path');
        register('tags');
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                if (externalUse) {
                    dispatch(showSnackbar({ show: true, success: true, message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                    dispatch(showBackdrop(false));
                    externalSaveHandler && externalSaveHandler();
                }
                else {
                    dispatch(showSnackbar({ show: true, success: true, message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                    fetchData();
                    dispatch(showBackdrop(false));
                    setViewSelected("view-1")
                }
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.classification).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeRes, waitSave])
    function addaction() {
        setjobplan((p) => [...p, { action: "", type: "Simple" }])
    }
    function deleteitem(i: number) {
        setjobplan(jobplan.filter((e, index) => index !== i))

    }
    function setValueAction(field: string, value: string, i: number) {
        setjobplan((p: Dictionary[]) => p.map((x, index) => index === i ? { ...x, [field]: value } : x))
    }
    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(insClassification({ ...data, jobplan: JSON.stringify(jobplan) })));
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
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {!externalUse ?
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBread}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={row ? `${row.title}` : t(langKeys.tipification)}
                        />
                    </div>
                    : <div></div>}
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => {
                                if (externalUse)
                                    externalCancelHandler && externalCancelHandler();
                                else
                                    setViewSelected("view-1")
                            }}
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
                                label={t(langKeys.classification)}
                                className="col-6"
                                onChange={(value) => setValue('title', value)}
                                valueDefault={row ? (row.title || "") : ""}
                                error={errors?.title?.message}
                            />
                            : <FieldView
                                label={t(langKeys.title)}
                                value={row ? (row.title || "") : ""}
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
                                label={t(langKeys.parent)}
                                className="col-6"
                                valueDefault={row ? (row.parentid || "") : ""}
                                onChange={(value) => setValue('parent', value ? value.classificationid : 0)}
                                error={errors?.parent?.message}
                                data={dataParent}
                                optionDesc="title"
                                optionValue="classificationid"
                            />
                            : <FieldView
                                label={t(langKeys.parent)}
                                value={row ? (row.parent || "") : ""}
                                className="col-6"
                            />}
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.path)}
                                className="col-6"
                                valueDefault={row ? (row.path || "") : ""}
                                onChange={(value) => setValue('path', value)}
                                error={errors?.path?.message}
                                disabled={true}
                            />
                            : <FieldView
                                label={t(langKeys.path)}
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
                                valueDefault={row?.status || "ACTIVO"}
                                onChange={(value) => setValue('status', value ? value.domainvalue : '')}
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
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.tag)}
                                className="col-6"
                                valueDefault={row ? (row.tags || "") : ""}
                                onChange={(value) => setValue('tags', value)}
                                error={errors?.tags?.message}
                            />
                            : <FieldView
                                label={t(langKeys.tag)}
                                value={row ? (row.tags || "") : ""}
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
                                    valueDefault={showAddAction ? "x" : ""}
                                    onChange={(value) => setShowAddAction(value)}
                                /> :
                                <FieldView
                                    label={t(langKeys.default_organization)}
                                    value={row ? (row.bydefault ? t(langKeys.affirmative) : t(langKeys.negative)) : t(langKeys.negative)}
                                />
                            }
                            {(edit && showAddAction) &&
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

                        {
                            (edit && showAddAction) && jobplan.map((e: any, i: number) => (
                                <div className="row-zyx" key={i}>
                                    <FieldEdit
                                        label={t(langKeys.action)}
                                        className="col-6"
                                        valueDefault={e.action ? e.action : ""}
                                        onChange={(value) => setValueAction('action', value, i)}
                                    />
                                    <FieldSelect
                                        label={t(langKeys.type)}
                                        className="col-5"
                                        valueDefault={e.type ? e.type : "Simple"}
                                        //onChange={(value) => setValue('status', value ? value.domainvalue : '')}
                                        error={errors?.status?.message}
                                        data={dataTypeAction}
                                        optionDesc="dat"
                                        optionValue="dat"
                                        onChange={(value) => setValueAction('type', value.dat, i)}
                                    />
                                    <div className="col-1" style={{ paddingTop: "15px" }}>
                                        <IconButton aria-label="delete" onClick={() => deleteitem(i)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </div>
                                    {e.type === "Variable" ?
                                        <FieldEdit
                                            label={t(langKeys.variable)}
                                            className={classes.dataaction}
                                            valueDefault={e.variable ? e.variable : ""}
                                            onChange={(value) => setValueAction('variable', value, i)}
                                        />

                                        : null}
                                    {e.type === "Request" ?
                                        <div>
                                            <FieldEdit
                                                label={t(langKeys.endpoint)}
                                                className={classes.dataaction}
                                                valueDefault={e.endpoint ? e.endpoint : ""}
                                                onChange={(value) => setValueAction('endpoint', value, i)}
                                            />
                                            <FieldEditMulti
                                                label={t(langKeys.data)}
                                                className={classes.dataaction}
                                                valueDefault={e.data ? e.data : ""}
                                                onChange={(value) => setValueAction('data', value, i)}
                                                maxLength={2048}
                                            />

                                        </div>
                                        : null}
                                    <hr></hr>
                                </div>
                            ))
                        }

                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>

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
    const classes = useStyles();
    const [openDialog, setOpenDialog] = useState(false);
    const [insertexcel, setinsertexcel] = useState(false);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);

    const columns = React.useMemo(
        () => [

            {
                accessor: 'classificationid',
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
                Header: t(langKeys.title),
                accessor: 'title',
                NoFilter: true
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
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
                NoFilter: true,
                prefixTranslation: 'status_',
                Cell: (props: any) => {
                    const { status } = props.cell.row.original;
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
                }
            }
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
            getValuesForTree()
        ]));
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(insertexcel?langKeys.successful_edit: langKeys.successful_delete) }))
                setinsertexcel(false)
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
            dispatch(execute(insClassification({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.classificationid, parent: row.parentid })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }


    const importCSV = async (files: any[]) => {
        setinsertexcel(true)
        const file = files[0];
        if (file) {
            let data: any = (await uploadExcel(file, undefined) as any[])
                .filter((d: any) => !['', null, undefined].includes(d.classification)
                    && !['', null, undefined].includes(d.channels)    
                    && Object.keys(mainResult.multiData.data[1].data.reduce((a,d) => ({...a, [d.classificationid]: d.title}), {0: ''})).includes('' + d.parent)
                );
            if (data.length > 0) {
                dispatch(showBackdrop(true));
                dispatch(execute({
                    header: null,
                    detail: data.map((x: any) => insClassification({
                        ...x,
                        title: x.classification,
                        description: x.description,
                        communicationchannel: x.channels,
                        tags: x.tag || '',
                        parent: x.parent || 0,
                        operation: "INSERT",
                        type: 'TIPIFICACION',
                        status: x.status || "ACTIVO",
                        id: 0,
                    }))
                }, true));
                setWaitSave(true)
            }
        }
    }

    const handleTemplate = () => {
        const data = [
            {},
            {},
            mainResult.multiData.data[2].data.reduce((a,d) => ({...a, [d.domainvalue]: d.domaindesc}), {}),
            {},
            mainResult.multiData.data[1].data.reduce((a,d) => ({...a, [d.classificationid]: d.title}), {0: ''}),
            mainResult.multiData.data[0].data.reduce((a,d) => ({...a, [d.domainvalue]: d.domainvalue}), {})
        ];
        const header = ['classification', 'description', 'channels', 'tag', 'parent', 'status'];
        exportExcel(t(langKeys.template), templateMaker(data, header));
    }

    if (viewSelected === "view-1") {

        if (mainResult.mainData.error) {
            return <h1>ERROR</h1>;
        }

        return (
            <Fragment>
                <TableZyx
                    columns={columns}
                    titlemodule={t(langKeys.tipification, { count: 2 })}
                    data={mainResult.mainData.data}
                    loading={mainResult.mainData.loading}
                    download={true}
                    register={true}
                    importCSV={importCSV}
                    handleTemplate={handleTemplate}
                    handleRegister={handleRegister}
                    ButtonsElement={()=>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            style={{ backgroundColor: "#7721ad" }}
                            onClick={() => setOpenDialog(true)}
                            startIcon={<AccountTreeIcon color="secondary" />}
                        >{t(langKeys.opendrilldown)}
                        </Button>
                    }
                />
                <DialogZyx
                    open={openDialog}
                    title={t(langKeys.organizationclass)}
                    buttonText1={t(langKeys.close)}
                    //buttonText2={t(langKeys.select)}
                    handleClickButton1={() => setOpenDialog(false)}
                    handleClickButton2={() => setOpenDialog(false)}
                >   
                <TreeView
                    className={classes.treeviewroot}
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                >
                        <TreeItemsFromData
                            dataClassTotal={mainResult.multiData.data[3] && mainResult.multiData.data[3].success ? mainResult.multiData.data[3].data : []}
                        />
                    </TreeView>
                    <div className="row-zyx">
                    </div>
                </DialogZyx>
            </Fragment>
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