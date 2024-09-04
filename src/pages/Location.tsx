import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateBreadcrumbs, TitleDetail, FieldEdit, Title, TemplateIcons } from 'components';
import { array_trimmer, exportExcel, getLocationExport, getPaginatedLocation, locationIns, templateMaker, uploadExcel } from 'common/helpers';
import { Dictionary, IFetchData } from "@types";
import ListAltIcon from '@material-ui/icons/ListAlt';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import {
    resetAllMain,
    execute,
    getCollectionPaginated,
    exportData
} from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';
import TablePaginated from 'components/fields/table-paginated';
import MapLocation from './MapLocation.jsx'
import { CellProps } from 'recharts';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
interface MultiData {
    data: Dictionary[];
    success: boolean;
}
interface DetailLocationProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: (arg0: IFetchData) => void;
    arrayBread: any;
}

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
    labellink: {
        color: '#7721ad',
        textDecoration: 'underline',
        cursor: 'pointer'
    },
}));

interface ILocation {
    phone: string,
    alternativephone: string,
    email: string,
    alternativeemail: string,
    type: string,
    name: string,
    country: string,
    city: string,
    district: string,
    address: string,
    schedule: string,
    latitude: number,
    longitude: number,
}

const DetailLocation: React.FC<DetailLocationProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData,arrayBread }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const user = useSelector(state => state.login.validateToken.user);
    const [directionData, setDirectionData] = React.useState({
        country: row?.country||"",
        city: row?.city||"",
        district: row?.district||"",
        address: row?.address||"",
        lat: row?.latitude||0,
        lng: row?.longitude||0,
        movedmarker: false,
        searchLocation: "",
    });

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {

            operation: row && row.locationid ? "EDIT" : "INSERT",
            googleurl: row?.googleurl||"",
            id: row?.locationid|| 0,
            name: row?.name||"",
            country: row?.country||"",
            city: row?.city||"",
            district: row?.district||"",
            address: row?.address||"",
            phone: row?.phone||"",
            alternativephone: row?.alternativephone||"",
            email: row?.email||"",
            alternativeemail: row?.alternativeemail||"",
            type: row?.type||"",
            description: "",
            status: "ACTIVO",
            schedule: row?.schedule||"",
            latitude: row?.latitude||0,
            longitude: row?.longitude||0,
            username: user?.usr||""
        }
    });

    React.useEffect(() => {
        register('id');
        register('phone', {
            pattern: {
                value: /^[0-9]{9,}$/,
                message: t(langKeys.invalid_phone)
            }
        });
        register('alternativephone', {
            pattern: {
                value: /^[0-9]{9,}$/,
                message: t(langKeys.invalid_phone)
            }
        });
        register('email', {
            pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: t(langKeys.invalid_email)
            }
        });
        register('alternativeemail', {
            pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: t(langKeys.invalid_email)
            }
        });
        register('googleurl');
        register('type', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('name', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('country', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('city', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('district', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('address', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('schedule', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('latitude', { validate: (value) => (value && !isNaN(value)) || t(langKeys.field_required) });
        register('longitude', { validate: (value) => (value && !isNaN(value)) || t(langKeys.field_required) });
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData({ pageSize: 20, pageIndex: 0, filters: {}, sorts: {}, daterange: null });
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.locations).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])
    useEffect(() => {
        setValue("latitude",directionData.lat)
        setValue("longitude",directionData.lng)
        setValue("country",directionData.country)
        setValue("city",directionData.city)
        setValue("district",directionData.district)
        setValue("address",directionData.address)
        setValue("googleurl",`https://www.google.com/maps?q=${directionData.lat},${directionData.lng}`)
    }, [directionData])

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(locationIns(data)));
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
                            breadcrumbs={[...arrayBread,{ id: "view-2", name: `${t(langKeys.locations)} ${t(langKeys.detail)}` }]}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={row ? `${row.name}` : `${t(langKeys.new)} ${t(langKeys.location)}`}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center'}}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("view-1")}
                        >{t(langKeys.back)}</Button>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type="submit"
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}
                        >{t(langKeys.save)}
                        </Button>
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.name)}
                            className="col-6"
                            onChange={(value) => setValue('name', value)}
                            valueDefault={row ? (row.name || "") : ""}
                            error={errors?.name?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.country)}
                            className="col-6"
                            onChange={(e) => setDirectionData((prev)=>({...prev, country: e}))}
                            valueDefault={directionData.country}
                            error={errors?.country?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.city)}
                            className="col-6"
                            onChange={(e) => setDirectionData((prev)=>({...prev, city: e}))}
                            valueDefault={directionData.city}
                            error={errors?.city?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.district)}
                            className="col-6"
                            onChange={(e) => setDirectionData((prev)=>({...prev, district: e}))}
                            valueDefault={directionData.district}
                            error={errors?.district?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.address)}
                            className="col-6"
                            onChange={(e) => setDirectionData((prev)=>({...prev, address: e}))}
                            valueDefault={directionData.address}
                            error={errors?.address?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.phone)}
                            className="col-6"
                            type="number"
                            onChange={(value) => setValue('phone', value)}
                            valueDefault={row ? (row.phone || "") : ""}
                            error={errors?.phone?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.alternativephone)}
                            className="col-6"
                            type="number"
                            onChange={(value) => setValue('alternativephone', value)}
                            valueDefault={row ? (row.alternativephone || "") : ""}
                            error={errors?.alternativephone?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.email)}
                            className="col-6"
                            onChange={(value) => setValue('email', value)}
                            valueDefault={row ? (row.email || "") : ""}
                            error={errors?.email?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.alternativeEmail)}
                            className="col-6"
                            onChange={(value) => setValue('alternativeemail', value)}
                            valueDefault={row ? (row.alternativeemail || "") : ""}
                            error={errors?.alternativeemail?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.type)}
                            className="col-6"
                            onChange={(value) => setValue('type', value)}
                            valueDefault={row ? (row.type || "") : ""}
                            error={errors?.type?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.schedule)}
                            className="col-12"
                            onChange={(value) => setValue('schedule', value)}
                            valueDefault={row ? (row.schedule || "") : ""}
                            error={errors?.schedule?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.latitude)}
                            className="col-6"
                            type="number"
                            onChange={(e) => setDirectionData((prev)=>({...prev, lat: e}))}
                            valueDefault={directionData.lat}
                            error={errors?.latitude?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.longitude)}
                            className="col-6"
                            type="number"
                            onChange={(e) => setDirectionData((prev)=>({...prev, lng: e}))}
                            valueDefault={directionData.lng}
                            error={errors?.longitude?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <div>
                            <div style={{ width: "100%" }}>
                                <MapLocation directionData={directionData} setDirectionData={setDirectionData}/>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

const Location: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);

    const [viewSelected, setViewSelected] = useState("view-1");
    const mainPaginated = useSelector(state => state.main.mainPaginated);
    const [pageCount, setPageCount] = useState(0);
    const [waitSaveExport, setWaitSaveExport] = useState(false);
    const [waitSave, setWaitSave] = useState(false);
    const [totalrow, settotalrow] = useState(0);
    const resExportData = useSelector(state => state.main.exportData);
    const [waitImport, setWaitImport] = useState(false);
    const executeResult = useSelector(state => state.main.execute);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({ pageSize: 20, pageIndex: 0, filters: {}, sorts: {}, daterange: null })
    const user = useSelector(state => state.login.validateToken.user);

    const classes = useStyles();

    const arrayBread = [
        { id: "view-1", name: t(langKeys.locations) },
    ];
    function redirectFunc(view:string){
        setViewSelected(view)
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
            dispatch(execute(locationIns({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.locationid, username: user?.usr||"" })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    const columns = React.useMemo(
        () => [
            {
                accessor: 'locationid',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original || {};
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
                Header: t(langKeys.name),
                accessor: 'name',
            },
            {
                Header: t(langKeys.phone),
                accessor: 'phone',
            },
            {
                Header: t(langKeys.alternativephone),
                accessor: 'alternativephone',
            },
            {
                Header: t(langKeys.address),
                accessor: 'address',
            },
            {
                Header: t(langKeys.city),
                accessor: 'city',
            },
            {
                Header: t(langKeys.country),
                accessor: 'country',
            },
            {
                Header: t(langKeys.latitude),
                accessor: 'latitude',
            },
            {
                Header: t(langKeys.longitude),
                accessor: 'longitude',
            },
            {
                Header: t(langKeys.type),
                accessor: 'type',
            },
            {
                Header: t(langKeys.schedule),
                accessor: 'schedule',
            },
            {
                Header: "",
                accessor: 'googleurl',
                NoFilter: true,
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original || {};
                    return (
                        <label
                            className={classes.labellink}
                            onClick={() => {window.open(`https://www.google.com/maps?q=${row.latitude},${row.longitude}`, '_blank')?.focus()}}
                        >
                            {t(langKeys.seeonthemap)}
                        </label>
                    )
                }
            },
        ],
        [t]
    );

    useEffect(() => {
        if (!mainPaginated.loading && !mainPaginated.error) {
            setPageCount(fetchDataAux.pageSize ? Math.ceil(mainPaginated.count / fetchDataAux.pageSize) : 0);
            settotalrow(mainPaginated.count);
        }
    }, [mainPaginated])


    useEffect(() => {
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                dispatch(showBackdrop(false));
                fetchData(fetchDataAux)
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])
    useEffect(() => {
        if (waitSaveExport) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(showBackdrop(false));
                resExportData.url?.split(",").forEach(x => window.open(x, '_blank'))
                setWaitSaveExport(false);
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSaveExport(false);
            }
        }
    }, [resExportData, waitSaveExport])

    useEffect(() => {
        if (waitImport) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }))
                fetchData(fetchDataAux);
                dispatch(showBackdrop(false));
                setWaitImport(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.quickreplies).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitImport(false);
            }
        }
    }, [executeResult, waitImport])

    const fetchData = ({ pageSize, pageIndex, filters, sorts, daterange }: IFetchData) => {
        setfetchDataAux({ pageSize, pageIndex, filters, sorts, daterange })
        dispatch(getCollectionPaginated(getPaginatedLocation({
            take: pageSize,
            skip: pageIndex * pageSize,
            sorts: sorts,
            filters: {
                ...filters,
            },
        })))
    };


    useEffect(() => {
        fetchData(fetchDataAux)
    }, [])

    const triggerExportData = ({ filters, sorts, daterange }: IFetchData) => {
        const columnsExport = columns.filter(x => !x.isComponent).map(x => ({
            key: x.accessor,
            alias: x.Header ? x.Header : 'Google Maps URL'
        }))
        dispatch(exportData(getLocationExport({
            filters: {
                ...filters,
            },
            sorts,
        }), "", "excel", false, columnsExport));
        dispatch(showBackdrop(true));
        setWaitSaveExport(true);
    };

    const handleTemplate = () => {
        const data = [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
        ];
        const header = [
            'name',
            'address',
            'district',
            'city',
            'country',
            'schedule',
            'phone',
            'alternativephone',
            'email',
            'alternativeemail',
            'latitude',
            'longitude',
            'type',
        ];
        exportExcel(t(langKeys.template), templateMaker(data, header));
    }

    const handleUpload = async (files: any) => {
        const file = files?.item(0);
        if (file && file.name.split('.')[file.name.split('.').length-1]==="xlsx") {

            let excel: any = await uploadExcel(file, undefined);
            let data: ILocation[] = array_trimmer(excel);
            data = data.filter((f: ILocation) =>
                (f.type === undefined || f.type !== "") &&
                (f.name === undefined || f.name !== "") &&
                (f.country === undefined || f.country !== "") &&
                (f.city === undefined || f.city !== "") &&
                (f.district === undefined || f.district !== "") &&
                (f.address === undefined || f.address !== "") &&
                (f.schedule === undefined || f.schedule !== "") &&
                (f.latitude === undefined || !isNaN(f.latitude)) &&
                (f.longitude === undefined || !isNaN(f.longitude))
            );
            if (data.length > 0) {
                dispatch(showBackdrop(true));
                let table: Dictionary = data.reduce((a: any, d: ILocation) => ({
                    ...a,
                    [`location_${d.latitude}_${d.longitude}`]: {
                        id: 0,
                        name: d.name || '',
                        address: d.address || '',
                        district: d.district || '',
                        city: d.city|| '',
                        country: d.country || '',
                        schedule: d.schedule || '',
                        phone: d.phone || '',
                        alternativephone: d.alternativephone || '',
                        email: d.email || '',
                        alternativeemail: d.alternativeemail || '',
                        type: d.type || '',
                        username: user?.usr,
                        latitude: d.latitude || 0,
                        longitude: d.longitude || 0,
                        status: "ACTIVO",
                        description: '',
                        googleurl: `https://www.google.com/maps?q=${d.latitude},${d.longitude}`,
                        operation: 'INSERT',
                    }
                }), {});
                Object.values(table).forEach((p: ILocation) => {
                    dispatch(execute({
                        header: locationIns({ ...p }),
                        detail: [ ]
                    }, true));
                });
                setWaitImport(true)
            }
            else {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.no_records_valid) }));
            }
        }
        if(file.name.split('.')[file.name.split('.').length-1]!=="xlsx"){
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.invalidformat) }))
        }
    }

    if (viewSelected === "view-1") {

        return (


            <div style={{ height: '100%', width: 'inherit' }}>
            <div style={{ display: 'flex', gap: 8, flexDirection: 'row', marginBottom: 12, marginTop: 4 }}>
                <div style={{ flexGrow: 1 }} >
                    <Title><Trans i18nKey={langKeys.locations} count={2} /></Title>
                </div>
            </div>
            <TablePaginated
                columns={columns}
                data={mainPaginated.data}
                pageCount={pageCount}
                totalrow={totalrow}
                filterGeneral={true}
                loading={mainPaginated.loading}
                download={true}
                exportPersonalized={triggerExportData}
                fetchData={fetchData}
                onClickRow={(row)=>{setRowSelected({ row: row, edit: false });setViewSelected("view-2")}}
                register={true}
                ButtonsElement={() => (
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={mainPaginated.loading}
                        startIcon={<ListAltIcon color="secondary" />}
                        onClick={handleTemplate}
                        style={{ backgroundColor: "#55BD84", marginLeft: "auto" }}
                    >
                        <Trans i18nKey={langKeys.template} />
                    </Button>
                )}
                importCSV={handleUpload}
                handleRegister={() => {
                    setRowSelected({ row: null, edit: false })
                    setViewSelected("view-2");
                }}
            />
        </div>
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailLocation
                data={rowSelected}
                setViewSelected={redirectFunc}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
                arrayBread={arrayBread}
            />
        )
    } else
        return null;

}

export default Location;