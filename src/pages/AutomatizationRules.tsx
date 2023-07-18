/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TableZyx from '../components/fields/table-simple';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { TemplateIcons, TemplateBreadcrumbs, FieldView, FieldEdit, FieldSelect, TitleDetail, FieldMultiSelectFreeSolo, FieldEditArray } from 'components';
import { getProductCatalogSel, getValuesFromDomain , getAutomatizationRulesSel, getCommChannelLst, getColumnsSel, insAutomatizationRules} from 'common/helpers';
import { AutomatizationRuleSave, Dictionary, MultiData } from "@types";
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useFieldArray, useForm } from 'react-hook-form';
import { getCollection, getMultiCollection, execute, resetAllMain } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { getLeadTemplates } from 'store/lead/actions';


interface RowSelected {
    row: Dictionary | null;
    domainname: string | "";
    edit: boolean;
}

interface DetailProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData?: () => void;
    arrayBread: any;
}


const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    button: {
        marginRight: theme.spacing(2),
    },
    field: {
        margin: theme.spacing(1),
        minHeight: 58,
    },
}));

const DetailAutomatizationRules: React.FC<DetailProps> = ({ data: { row, domainname, edit }, setViewSelected, multiData, fetchData,arrayBread }) => {
    const { t } = useTranslation();
    const variables = ['firstname', 'lastname', 'displayname', 'email', 'phone', 'documenttype', 'documentnumber', 'custom'].map(x => ({ key: x, value: t(x) }))
    const dispatch = useDispatch();
    const user = useSelector(state => state.login.validateToken.user);
    const useradmin = ["ADMINISTRADOR","ADMINISTRADOR P"].includes(user?.roledesc || '');
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const [orderVariable, setOrderVariable] = useState(row?.typeorder? "ORDER":"LEAD");
    const executeRes = useSelector(state => state.main.execute);
    const [shippingtype, setshippingtype] = useState(row?.shippingtype || "");
    const templates = useSelector(state => state.lead.leadTemplates);
    const [bodyMessage, setBodyMessage] = useState(templates.data.find(x=>x.id===row?.messagetemplateid)?.body||"");
    const dataDomainStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataProducts = multiData[0] && multiData[1].success ? (useradmin?multiData[1].data.filter(x=>x.domainvalue === "BOT"):multiData[1].data) : [];
    const dataCommChannels = multiData[2] && multiData[2].success ? multiData[2].data : [];
    const dataLeads = multiData[3] && multiData[3].success ? multiData[3].data : [];
    const dataTags = multiData[4] && multiData[4].success ? multiData[4].data : [];
    const dataOrder = [
        {value: "new",description:t(langKeys.new)},
        {value: "dispatched",description:t(langKeys.dispatched)},
        {value: "delivered",description:t(langKeys.delivered)},
        {value: "prepared",description:t(langKeys.prepared)},
    ]

    const { register, handleSubmit, setValue,control, getValues,trigger, formState: { errors } } = useForm<AutomatizationRuleSave>({
        defaultValues: {
            id: row?.leadautomatizationrulesid || 0,
            operation: row ? "EDIT" : "INSERT",
            description: row?.description || '',
            communicationchannelid: row?.communicationchannelid || 0,
            columnid: row?.columnid|| 0,
            columnname: row?.columnname|| 0,
            shippingtype: row?.shippingtype || "",
            xdays: row?.xdays || 0,
            status: row?.status || 'ACTIVO',
            type: "NINGUNO",
            schedule: row?.schedule || "",
            orderstatus: row?.orderstatus || "",
            tags: row?.tags || "",
            products: row?.products || "",
            messagetemplateid: row?.messagetemplateid||0,
            order: row?.typeorder ||false,
            hsmtemplatename: row?.hsmtemplatename||"",
            variables: row?.messagetemplateparameters||[],
        }
    });
    const { fields } = useFieldArray({
        control,
        name: 'variables',
    });

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])
    useEffect(() => {
        console.log(errors)
    }, [errors])

    React.useEffect(() => {
        register('id');
        register('description', { validate: (value:any) => Boolean(value && value.length) || String(t(langKeys.field_required)) });
        register('communicationchannelid', { validate: (value:any) => Boolean(value && value>0) || String(t(langKeys.field_required)) });
        register('columnid');
        register('shippingtype', { validate: (value:any) => Boolean(value && value.length) || String(t(langKeys.field_required)) });
        register('schedule', { validate: (value:any) => Boolean(value && value.length) || String(t(langKeys.field_required)) });
        register('tags');
        register('products');
        register('messagetemplateid', { validate: (value) => Boolean(value && value>0) || String(t(langKeys.field_required)) });
        register('hsmtemplatename');
        register('variables');
        register('order');
        if(shippingtype === "DAY"){
            register('xdays', { validate: (value) => Boolean(value && Number(value)>0) || String(t(langKeys.field_required)) });
        }
        register('columnname', { validate: (value:any) => orderVariable === "ORDER" || Boolean(value && value.length) || String(t(langKeys.field_required)) });
        register('orderstatus', { validate: (value:any) => orderVariable === "LEAD" || Boolean(value && value.length) || String(t(langKeys.field_required)) });
    }, [register, orderVariable, shippingtype]);
    const onSelectTemplate = (value: Dictionary) => {
        if (value) {
            setBodyMessage(value.body);
            setValue('messagetemplateid', value ? value.id : 0);
            setValue('hsmtemplatename', value ? value.name : '');
            const variablesList = value.body.match(/({{)(.*?)(}})/g) || [];
            const varaiblesCleaned = variablesList.map((x: string) => x.substring(x.indexOf("{{") + 2, x.indexOf("}}")))
            setValue('variables', varaiblesCleaned.map((x: string) => ({ name: x, text: '', type: 'text' })));
        } else {
            setValue('hsmtemplatename', '');
            setValue('variables', []);
            setBodyMessage('');
            setValue('messagetemplateid', 0);
        }
    }

    const onSubmit = handleSubmit((data) => {
        debugger
        const callback = () => {
            dispatch(showBackdrop(true));
            dispatch(execute(insAutomatizationRules({...data, messagetemplateparameters: JSON.stringify(data.variables)})));

            setWaitSave(true);
        }
        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });
    return (
        <div style={{width: "100%"}}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={[...arrayBread,{ id: "view-2", name: `${t(langKeys.automatizationrules)} ${t(langKeys.detail)}` }]}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={row ? `${row.description}` : `${t(langKeys.new)} ${t(langKeys.automatizationrule)}`}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("view-1")}>
                            {t(langKeys.back)}
                        </Button>
                        {edit &&
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                type="submit"
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}>
                                {t(langKeys.save)}
                            </Button>
                        }
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.description)}
                            className="col-6"
                            valueDefault={getValues('description')}
                            onChange={(value) => setValue('description', value)}
                            error={errors?.description?.message}
                        />
                        <FieldSelect
                            label={t(langKeys.shippingchannel)}
                            className="col-6"
                            onChange={(value) => setValue('communicationchannelid', value?.communicationchannelid||0)}
                            valueDefault={getValues('communicationchannelid')}
                            data={dataCommChannels}
                            optionDesc="communicationchanneldesc"
                            optionValue="communicationchannelid"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.status)}
                            className="col-6"
                            valueDefault={row?.status || "ACTIVO"}
                            onChange={(value) => setValue('status', value ? value.domainvalue : '')}
                            error={errors?.status?.message}
                            data={dataDomainStatus}
                            optionDesc="domaindesc"
                            uset={true}
                            prefixTranslation="status_"
                            optionValue="domainvalue"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            label={"App"}
                            className="col-6"
                            valueDefault={orderVariable}
                            onChange={(value) => {
                                setOrderVariable(value?.alt || "")
                                setValue('order', value?.value || false)
                                setValue('orderstatus', "")
                                setValue('columnname', "")
                                setValue('columnid', 0)
                            }}
                            error={!!orderVariable?"":t(langKeys.field_required)}
                            data={[
                                {column: t(langKeys.lead_plural), value: false, alt: "LEAD"},
                                {column: t(langKeys.orders), value: true, alt: "ORDER"},
                            ]}
                            optionDesc="column"
                            optionValue="alt"
                        />
                        {orderVariable==="LEAD" &&
                            <FieldSelect
                                label={t(langKeys.whensettingstate)}
                                className="col-6"
                                valueDefault={getValues('columnname')}
                                onChange={(value) => {
                                    setValue('columnname', value?.description || "")
                                    setValue('columnid', value?.columnid || 0)
                                }}
                                error={errors?.columnname?.message}
                                data={dataLeads}
                                prefixTranslation=""
                                optionDesc="description"
                                uset={true}
                                optionValue="description"
                            />
                        }
                        {orderVariable==="ORDER" &&
                            <FieldSelect
                                label={t(langKeys.whensettingstate)}
                                className="col-6"
                                valueDefault={getValues('orderstatus')}
                                onChange={(value) => {
                                    setValue('orderstatus', value?.value || "")
                                }}
                                error={errors?.orderstatus?.message}
                                data={dataOrder}
                                optionDesc="description"
                                optionValue="value"
                            />
                        }
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.shippingtype)}
                            className="col-6"
                            valueDefault={getValues('shippingtype')}
                            onChange={(value) => {setshippingtype(value?.val || '');setValue('shippingtype', value?.val || '')}}
                            error={errors?.shippingtype?.message}
                            data={[{desc: t(langKeys.inmediately),val:"INMEDIATELY"}, {desc: t(langKeys.day),val:"DAY"}]}
                            optionDesc="desc"
                            optionValue="val"
                        />
                        {shippingtype === "DAY" && <FieldEdit
                            label={`${t(langKeys.day)}s`}
                            className="col-6"
                            type="number"
                            valueDefault={row?.xdays||0}
                            onChange={(value) => setValue('xdays', value)}
                            error={errors?.xdays?.message}
                        />}
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.shippingschedule)}
                            className="col-6"
                            valueDefault={getValues("schedule")}
                            onChange={(value) => setValue('schedule', value?.value || "")}
                            error={errors?.schedule?.message}
                            data={[
                                {value: "00:00:00", desc: "00:00"},
                                {value: "01:00:00", desc: "01:00"},
                                {value: "02:00:00", desc: "02:00"},
                                {value: "03:00:00", desc: "03:00"},
                                {value: "04:00:00", desc: "04:00"},
                                {value: "05:00:00", desc: "05:00"},
                                {value: "06:00:00", desc: "06:00"},
                                {value: "07:00:00", desc: "07:00"},
                                {value: "08:00:00", desc: "08:00"},
                                {value: "09:00:00", desc: "09:00"},
                                {value: "10:00:00", desc: "10:00"},
                                {value: "11:00:00", desc: "11:00"},
                                {value: "12:00:00", desc: "12:00"},
                                {value: "13:00:00", desc: "13:00"},
                                {value: "14:00:00", desc: "14:00"},
                                {value: "15:00:00", desc: "15:00"},
                                {value: "16:00:00", desc: "16:00"},
                                {value: "17:00:00", desc: "17:00"},
                                {value: "18:00:00", desc: "18:00"},
                                {value: "19:00:00", desc: "19:00"},
                                {value: "20:00:00", desc: "20:00"},
                                {value: "21:00:00", desc: "21:00"},
                                {value: "22:00:00", desc: "22:00"},
                                {value: "23:00:00", desc: "23:00"},
                            ]}
                            optionDesc="desc"
                            optionValue="value"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldMultiSelectFreeSolo
                            label={t(langKeys.tags)}
                            className="col-6"
                            valueDefault={getValues('tags')}
                            onChange={(value: ({domaindesc: string} | string)[]) => {
                                const tags = value.map((o: any) => o.domaindesc || o).join(',');
                                setValue('tags', tags);
                            }}
                            error={errors?.tags?.message}
                            loading={false}
                            data={dataTags}
                            optionDesc="domaindesc"
                            optionValue="domaindesc"
                        />
                        <FieldMultiSelectFreeSolo
                            label={t(langKeys.product_plural)}
                            className="col-6"
                            valueDefault={getValues('products')}
                            onChange={(value: ({title: string} | string)[]) => {
                                const products = value.map((o: any) => o.productid || o).join(',');
                                setValue('products', products);
                            }}
                            error={errors?.products?.message}
                            loading={false}
                            data={dataProducts}
                            optionDesc="title"
                            optionValue="productid"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.hsm_template)}
                            className="col-6"
                            valueDefault={getValues('messagetemplateid')}
                            onChange={onSelectTemplate}
                            error={errors?.messagetemplateid?.message}
                            data={templates.data}
                            optionDesc="name"
                            optionValue="id"
                        />
                        <FieldView
                            className="col-6"
                            label={t(langKeys.message)}
                            value={bodyMessage}
                        />
                    </div>
                    <div className="row-zyx">
                        {fields.map((item: Dictionary, i) => (
                            <div key={item.id} style={{width:"50%"}}>
                                <FieldSelect
                                    key={"var_" + item.id}
                                    fregister={{
                                        ...register(`variables.${i}.variable`, {
                                            validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                        })
                                    }}
                                    className={classes.field}
                                    label={item.name}
                                    valueDefault={getValues(`variables.${i}.variable`)}
                                    onChange={(value) => {
                                        setValue(`variables.${i}.variable`, value.key)
                                        trigger(`variables.${i}.variable`)
                                    }}
                                    error={errors?.variables?.[i]?.variable?.message}
                                    data={variables}
                                    optionDesc="value"
                                    optionValue="key"
                                />
                                {getValues(`variables.${i}.variable`) === 'custom' &&
                                    <FieldEditArray
                                        key={"custom_" + item.id}
                                        fregister={{
                                            ...register(`variables.${i}.text`, {
                                                validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                            })
                                        }}
                                        prefixTranslation=""
                                        className={classes.field}
                                        valueDefault={item.value}
                                        error={errors?.variables?.[i]?.text?.message}
                                        onChange={(value) => setValue(`variables.${i}.text`, "" + value)}
                                    />
                                }
                            </div>
                        ))}
                    </div>
                </div>
            </form>
        </div>
    );
}

const AutomatizationRules: FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [filerchanneltype, setfilerchanneltype] = useState(0);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, domainname: "", edit: false });
    const [waitSave, setWaitSave] = useState(false);
    const user = useSelector(state => state.login.validateToken.user);
    const superadmin = ["SUPERADMIN","ADMINISTRADOR","ADMINISTRADOR P"].includes(user?.roledesc || '');
    const [dataGrid, setDataGrid] = useState<any[]>([]);

    const arrayBread = [
        { id: "view-1", name: t(langKeys.automatizationrules) },
    ];
    function redirectFunc(view:string){
        setViewSelected(view)
    }
    useEffect(() => {
        let data = mainResult.mainData.data
        data = data.map(x=>({...x,columnamefilter: (x.typeorder) ? (t(`${x.orderstatus?.toLowerCase()}`)).toUpperCase() :(t(`${x.columnname?.toLowerCase()}`.toLowerCase()) || "").toUpperCase()}))
        setDataGrid(data)
    }, [mainResult.mainData.data])
    const columns = React.useMemo(
        () => [
            {
                accessor: 'leadautomatizationrulesid ',
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
                Header: t(langKeys.shippingchannel),
                accessor: 'communicationchanneldesc',
                NoFilter: false
            },
            {
                Header: t(langKeys.whensettingstate),
                accessor: 'columnamefilter',
                NoFilter: false,
            },
            {
                Header: t(langKeys.conditional),
                accessor: 'tags',
                NoFilter: false,
                Cell: (props: any) => {
                    const { tags, products } = props.cell.row.original;
                    return (
                        <>
                            <div><b>Tags:</b> {tags}</div>
                            <div><b>{t(langKeys.product_plural)}:</b> {products}</div>
                        </>
                    )
                }
            },
            {
                Header: t(langKeys.templatetosend),
                accessor: 'messagetemplatename',
                NoFilter: false,
            },
            {
                Header: t(langKeys.shippingtype),
                accessor: 'shippingtype',
                NoFilter: false,
                prefixTranslation: 'xdays_',
                Cell: (props: any) => {
                    const { shippingtype } = props.cell.row.original;
                    return (t(`xdays_${shippingtype}`.toLowerCase()) || "").toUpperCase()
                }
            },
            {
                Header: `X ${t(langKeys.day)}s`,
                accessor: 'xdays',
                NoFilter: false,
            },
            {
                Header: t(langKeys.schedule),
                accessor: 'schedule',
                NoFilter: false
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                NoFilter: false,
                prefixTranslation: 'status_',
                Cell: (props: any) => {
                    const { status } = props.cell.row.original;
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
                }
            },
        ],
        []
    );

    const fetchData = (communicationchannelid?:number) => dispatch(getCollection(getAutomatizationRulesSel({id:0,communicationchannelid:communicationchannelid||0})));

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([
            getValuesFromDomain("ESTADOGENERICO"),
            getProductCatalogSel(),
            getCommChannelLst(),
            getColumnsSel(0, true),
            getValuesFromDomain('OPORTUNIDADETIQUETAS'),
        ]));
        dispatch(getLeadTemplates());

        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, domainname: "", edit: true });
    }

    const handleView = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, domainname: row.domainname, edit: false });
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, domainname: row.domainname, edit: true });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(insAutomatizationRules({ ...row,id: row?.leadautomatizationrulesid, order: row?.typeorder, operation: 'DELETE', status: 'ELIMINADO' })));
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
            <div style={{width:"100%"}}>
                <TableZyx
                    columns={columns}
                    titlemodule={t(langKeys.automatizationrules, { count: 2 })}
                    data={dataGrid}
                    download={false}
                    //fetchData={fetchData}
                    onClickRow={handleEdit}
                    ButtonsElement={()=>(<>
                        <FieldSelect
                            onChange={(value) => {setfilerchanneltype(value?.communicationchannelid||0);fetchData(value?.communicationchannelid||0)}}
                            size="small"
                            label={t(langKeys.shippingchannel)}
                            style={{ maxWidth: 300, minWidth: 200 }}
                            variant="outlined"
                            loading={mainResult.multiData.loading}
                            data={mainResult.multiData?.data[2]?.data || []}
                            optionValue="communicationchannelid"
                            optionDesc="communicationchanneldesc"
                            valueDefault={filerchanneltype}
                        />
                    </>)}
                    loading={mainResult.mainData.loading}
                    register={superadmin}
                    handleRegister={handleRegister}
                    
            />
            </div>
        )
    }
    else
        return (
            <DetailAutomatizationRules
                data={rowSelected}
                setViewSelected={redirectFunc}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
                arrayBread={arrayBread}
            />
        )
}

export default AutomatizationRules;