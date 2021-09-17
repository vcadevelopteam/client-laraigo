/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect } from 'components';
import { getPropertySel, getChannelsByOrg, getValuesFromDomain, insProperty, getDistinctPropertySel } from 'common/helpers';
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
import { IconButton } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';

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
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBread}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={row ? `${row.propertyname}` : t(langKeys.newproperty)}
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

                </div>
            </form>
        </div>
    );
}

const Properties: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const classes = useStyles();

    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);

    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);

    const [categoryFilter, setCategoryFilter] = useState('');
    const [levelFilter, setLevelFilter] = useState('');

    const HeaderFilter = () => {
        return <div className={classes.containerDetail}>
            <div className="row-zyx">
                <FieldSelect
                    label={t(langKeys.level)}
                    className="col-6"
                    valueDefault={levelFilter}
                    onChange={(value) => setLevelFilter((value?.levelvalue || ''))}
                    data={[
                        {leveldesc:t(langKeys.corporation), levelvalue: "CORPORATION"},
                        {leveldesc:t(langKeys.organization), levelvalue: "ORGANIZATION"},
                        {leveldesc:t(langKeys.channel), levelvalue: "CHANNEL"},
                        {leveldesc:t(langKeys.group), levelvalue: "GROUP"}
                    ]}
                    optionDesc="leveldesc"
                    optionValue="levelvalue"
                />
                <FieldSelect
                    label={t(langKeys.category)}
                    className="col-6"
                    valueDefault={categoryFilter}
                    onChange={(value) => setCategoryFilter((value?.categoryvalue || ''))}
                    data={[
                        {categorydesc:t(langKeys.closure), categoryvalue: "CLOSURE"},
                        {categorydesc:t(langKeys.message), categoryvalue: "MESSAGE"},
                        {categorydesc:t(langKeys.system), categoryvalue: "SYSTEM"},
                        {categorydesc:t(langKeys.indicators), categoryvalue: "INDICATORS"},
                        {categorydesc:t(langKeys.quiz), categoryvalue: "QUIZ"},
                        {categorydesc:t(langKeys.labels), categoryvalue: "LABELS"}
                    ]}
                    optionDesc="categorydesc"
                    optionValue="categoryvalue"
                />
            </div>
        </div>
    }

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
                        <IconButton
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            aria-label="more"
                            onClick={() => handleEdit(row)}
                            size="small">
                                <VisibilityIcon style={{ color: '#B6B4BA' }} />
                        </IconButton>
                    )
                }
            },
            {
                Header: t(langKeys.name),
                accessor: 'propertyname'
            },
            {
                Header: t(langKeys.description),
                accessor: 'description'
            },
            {
                Header: t(langKeys.category),
                accessor: 'category'
            },
            {
                Header: t(langKeys.level),
                accessor: 'level'
            },
            {
                Header: t(langKeys.status),
                accessor: 'status'
            },
        ],
        []
    );

    var fetchData = () => dispatch(getCollection(getDistinctPropertySel(categoryFilter, levelFilter)));

    useEffect(() => {
        console.log(categoryFilter);
        console.log(levelFilter);

        fetchData = () => dispatch(getCollection(getDistinctPropertySel(categoryFilter, levelFilter)));
        fetchData();
    }, [categoryFilter, levelFilter]);

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

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }

    if (viewSelected === "view-1") {
        if (mainResult.mainData.error) {
            return <h1>ERROR</h1>;
        }

        return (
            <TableZyx
                ButtonsElement={HeaderFilter}
                columns={columns}
                data={mainResult.mainData.data}
                loading={mainResult.mainData.loading}
                download={true}
                register={false}
                handleRegister={handleRegister}
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