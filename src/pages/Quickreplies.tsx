/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect } from 'components';

import { getPropertySel, getChannelsByOrg, getValuesFromDomain, insProperty } from 'common/helpers';

import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, resetMain, getMultiCollection, execute } from 'store/main/actions';
import { showSnackbar, showBackdrop } from 'store/popus/actions';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
interface MultiData {
    data: Dictionary[];
    success: boolean;
}
interface DetailQuickreplyProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: () => void
}
const arrayBread = [
    { id: "view-1", name: "Quickreplies" },
    { id: "view-2", name: "Quickreply detail" }
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

const DetailQuickreply: React.FC<DetailQuickreplyProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const dataStatus = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataChannel = multiData[0] && multiData[0].success ? multiData[0].data : [];

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            type: 'NINGUNO',
            communicationchannelid: row ? row.communicationchannelid : 0,
            id: row ? row.Quickreplyid : 0,
            Quickreplyname: row ? row.Quickreplyname : '',
            Quickreplyvalue: row ? row.Quickreplyvalue : '',
            description: row ? (row.description || '') : '',
            status: row ? row.status : 'ACTIVO',
            operation: row ? "EDIT" : "INSERT"
        }
    });

    React.useEffect(() => {
        register('communicationchannelid');
        register('type');
        register('id');
        register('Quickreplyname', { validate: (value) => (value && value.length) || 'This is required.' });
        register('Quickreplyvalue', { validate: (value) => (value && value.length) || 'This is required.' });
        register('description', { validate: (value) => (value && value.length) || 'This is required.' });
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
        dispatch(execute(insProperty(data))); //executeRes
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
                title={row ? `${row.Quickreplyname}` : "New Quickreply"}
            />
            <form onSubmit={onSubmit}>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.corporation)} // "Corporation"
                                className="col-6"
                                valueDefault={row ? (row.corpdesc || "") : ""}
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
                                valueDefault={row ? (row.orgdesc || "") : ""}
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
                                onChange={(value) => setValue('communicationchannelid', value.communicationchannelid)}
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
                                valueDefault={row ? (row.Quickreplyname || "") : ""}
                                onChange={(value) => setValue('Quickreplyname', value)}
                                error={errors?.Quickreplyname?.message}
                            />
                            : <FieldView
                                label={t(langKeys.name)}
                                value={row ? (row.Quickreplyname || "") : ""}
                                className="col-6"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.value)}
                                className="col-6"
                                valueDefault={row ? (row.Quickreplyvalue || "") : ""}
                                onChange={(value) => setValue('Quickreplyvalue', value)}
                                error={errors?.Quickreplyvalue?.message}
                            />
                            : <FieldView
                                label={t(langKeys.value)}
                                value={row ? (row.Quickreplyvalue || "") : ""}
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

const Quickreplies: FC = () => {
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
                accessor: 'Quickreplyname',
                NoFilter: true
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                NoFilter: true
            },
            {
                Header: t(langKeys.value),
                accessor: 'Quickreplyvalue',
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
                            // viewFunction={() => history.push(`/Quickreplies/${row.Quickreplyid}`)}
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                        />
                    )
                }
            },
        ],
        [t]
    );

    const fetchData = () => dispatch(getCollection(getPropertySel(0))); //mainResult.mainData.data

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([getChannelsByOrg(), getValuesFromDomain("ESTADOGENERICO")])); //mainResult.multiData.data
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
        dispatch(execute(insProperty({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.quickreplyid })));
        dispatch(showBackdrop(true));
        setWaitSave(true);
    }

    if (viewSelected === "view-1") {

        return (
            <TableZyx
                columns={columns}
                titlemodule={t(langKeys.quickreplies, { count: 2 })}
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
            <DetailQuickreply
                data={rowSelected}
                setViewSelected={setViewSelected}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
            />
        )
    } else
        return null;

}

export default Quickreplies;