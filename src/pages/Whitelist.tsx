/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect } from 'components';
import { getWhitelistSel, getValuesFromDomain, insWhitelist } from 'common/helpers';
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
interface DetailWhitelistProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: () => void
}
const arrayBread = [
    { id: "view-1", name: "Whitelist" },
    { id: "view-2", name: "Whitelist Detail" }
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

const DetailWhitelist: React.FC<DetailWhitelistProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const dataDomain = multiData[0] && multiData[0].success ? multiData[0].data : [];

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            type: 'NINGUNO',
            id: row ? row.whitelistid : 0,
            username: row ? (row.username || '') : '',
            documenttype: row ? (row.documenttype || '') : '',
            documentnumber: row ? row.documentnumber : 0,
            usergroup: row ? row.usergroup : "",
            operation: row ? "EDIT" : "INSERT",
            status: "ACTIVO",
        }
    });

    React.useEffect(() => {
        register('type');
        register('id');
        register('username', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('documenttype', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('documentnumber', { validate: (value) => (value && value > 0) || t(langKeys.field_required) });
        register('usergroup', { validate: (value) => (value && value.length ) || t(langKeys.field_required) });
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.whitelist).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])
    
    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(insWhitelist(data)));
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
                            title={row ? `${row.username}` : t(langKeys.newwhitelist)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center'  }}>
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
                                label={t(langKeys.username)} 
                                className="col-6"
                                onChange={(value) => setValue('username', value)}
                                valueDefault={row ? (row.username || "") : ""}
                                error={errors?.username?.message}
                            />
                            : <FieldView
                                label={t(langKeys.username)}
                                value={row ? (row.username || "") : ""}
                                className="col-6"
                            />}
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.documenttype)} 
                                className="col-6"
                                onChange={(value) => setValue('documenttype', value)}
                                valueDefault={row ? (row.documenttype || "") : ""}
                                error={errors?.documenttype?.message}
                            />
                            : <FieldView
                                label={t(langKeys.documenttype)}
                                value={row ? (row.documenttype || "") : ""}
                                className="col-6"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.documentnumber)} 
                                error={errors?.documentnumber?.message}
                                onChange={(value) => setValue('documentnumber', value ? parseInt(value) : 0)}
                                type="number"
                                className="col-6"
                                valueDefault={row ? (row.documentnumber || "") : ""}
                            />
                            : <FieldView
                                label={t(langKeys.documentnumber)}
                                value={row ? (row.documentnumber || "") : ""}
                                className="col-6"
                            />}
                        {edit ?
                            <FieldSelect
                                label={t(langKeys.usergroup)}                                
                                className="col-6"
                                valueDefault={row ? (row.usergroup || "") : ""}
                                onChange={(value) => setValue('usergroup', (value?value.domainvalue:""))}
                                error={errors?.usergroup?.message}
                                data={dataDomain}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            />
                            : <FieldView
                                label={t(langKeys.usergroup)}
                                value={row ? (row.domaindesc || "") : ""}
                                className="col-6"
                            />}
                    </div>
                    
                </div>
            </form>
        </div>
    );
}

const Whitelist: FC = () => {
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
                Header: t(langKeys.username),
                accessor: 'username',
                NoFilter: true
            },
            {
                Header: t(langKeys.documenttype),
                accessor: 'documenttype',
                NoFilter: true
            },
            {
                Header: t(langKeys.documentnumber),
                accessor: 'documentnumber',
                NoFilter: true
            },
            {
                Header: t(langKeys.usergroup),
                accessor: 'usergroup',
                NoFilter: true
            },
            
        ],
        [t]
    );

    const fetchData = () => dispatch(getCollection(getWhitelistSel(0)));

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([getValuesFromDomain("GRUPOS"), getValuesFromDomain("ESTADOGENERICO")]));
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
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.whitelist).toLocaleLowerCase() })
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
            dispatch(execute(insWhitelist({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.whitelistid })));
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
                titlemodule={t(langKeys.whitelist, { count: 2 })}
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
            <DetailWhitelist
                data={rowSelected}
                setViewSelected={setViewSelected}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
            />
        )
    } else
        return null;

}

export default Whitelist;