/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateBreadcrumbs, TitleDetail, FieldEdit, FieldSelect, Title } from 'components';
import { array_trimmer, exportExcel, getLocationExport, getPaginatedLocation, insInappropriateWords, locationIns, templateMaker, uploadExcel } from 'common/helpers';
import { Dictionary, IFetchData, IPersonImport } from "@types";
import ListAltIcon from '@material-ui/icons/ListAlt';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import {
    resetAllMain,
    execute,
    getCollectionPaginated,
    exportData
} from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';
import { useHistory } from 'react-router-dom';
import paths from 'common/constants/paths';
import TablePaginated from 'components/fields/table-paginated';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { apiUrls } from "common/constants";

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
}));

const DetailLocation: React.FC<DetailLocationProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData,arrayBread }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyAqrFCH95Tbqwo6opvVPcdtrVd-1fnBLr4" /*"AIzaSyCBij6DbsB8SQC_RRKm3-X07RLmvQEnP9w"*/,
    });
    const [marker, setMarker] = React.useState({
        lat: 0,
        lng: 0,
        time: new Date(),
    });
    const [center, setcenter] = React.useState({
      lat: 0,
      lng: 0,
      time: new Date(),
    });
    const [directionData, setDirectionData] = React.useState({
      department: "",
      province: "",
      district: "",
      zone: "",
      zipcode: "",
      reference: "",
      street: "",
      streetNumber: "",
      movedmarker: false,
      searchLocation: "",
    });

    const dataStatus = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataClassification = multiData[2] && multiData[2].success ? multiData[2].data : [];
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            id: row?.locationid|| 0,
            name: row?.name||"",
            country: row?.country||"",
            city: row?.city||"",
            district: row?.district||"",
            address: row?.address||"",
            phone: row?.phone||"",
            alternativePhone: row?.alternativePhone||"",
            email: row?.email||"",
            alternativeEmail: row?.alternativeEmail||"",
            type: row?.type||"",
            schedule: row?.schedule||"",
            latitude: row?.latitude||0,
            longitude: row?.longitude||0,
        }
    });

    
    const PickerInteraction: React.FC<{ userType: string, fill?: string }> = ({ userType, fill = '#FFF' }) => {
        if (userType === 'client')
            return (
                <svg viewBox="0 0 11 20" width="11" height="20" style={{ position: 'absolute', bottom: -1, left: -9, fill }}>
                    <svg id="message-tail-filled" viewBox="0 0 11 20"><g transform="translate(9 -14)" fill="inherit" fillRule="evenodd"><path d="M-6 16h6v17c-.193-2.84-.876-5.767-2.05-8.782-.904-2.325-2.446-4.485-4.625-6.48A1 1 0 01-6 16z" transform="matrix(1 0 0 -1 0 49)" id="corner-fill" fill="inherit"></path></g></svg>

                </svg>
            )
        else
            return (
                <svg viewBox="0 0 11 20" width="11" height="20" style={{ position: 'absolute', bottom: 0, right: -9, transform: 'translateY(1px) scaleX(-1)', fill }}>
                    <svg id="message-tail-filled" viewBox="0 0 11 20"><g transform="translate(9 -14)" fill="inherit" fillRule="evenodd"><path d="M-6 16h6v17c-.193-2.84-.876-5.767-2.05-8.782-.904-2.325-2.446-4.485-4.625-6.48A1 1 0 01-6 16z" transform="matrix(1 0 0 -1 0 49)" id="corner-fill" fill="inherit"></path></g></svg>
                </svg>
            )
    }

    React.useEffect(() => {
        register('type');
        register('id');
        register('phone');
        register('alternativePhone');
        register('email');
        register('alternativeEmail');
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
                fetchData && fetchData({ pageSize: 0, pageIndex: 0, filters: {}, sorts: {}, daterange: null });
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
    
    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(insInappropriateWords(data)));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });
    async function onMapClick(e:any){
        debugger
        const urltosearch = `${apiUrls.GETGEOCODE}?lat=${e.latLng.lat()}&lng=${e.latLng.lng()}`;
        const response = await fetch(urltosearch, {
            method: 'GET',
        });
        if (response.ok) {
            try {
                const r = await response.json();
                if (r.status === "OK" && r.results && r.results instanceof Array && r.results.length > 0) {
                    cleanDataAddres(r.results[0].address_components);
                    setDirectionData((prev)=>({...prev, 
                      movedmarker: true,
                      searchLocation: r.results[0].formatted_address
                    }))
                }
            } catch (e) { }
        }
        setMarker({
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
            time: new Date(),
          });
      }
    function cleanDataAddres(r:any) {
        const street_number = r.find((x:any) => x.types.includes("street_number"));
        const postal_code = r.find((x:any) => x.types.includes("postal_code"));
        const route = r.find((x:any) => x.types.includes("route"));
        const administrative_area_level_1 = r.find((x:any) => x.types.includes("administrative_area_level_1"));
        const administrative_area_level_2 = r.find((x:any) => x.types.includes("administrative_area_level_2"));
        const locality = r.find((x:any) => x.types.includes("locality"));
        const sublocality_level_1 = r.find((x:any) => x.types.includes("sublocality_level_1"));

        setDirectionData((prev)=>({...prev, 
            department: administrative_area_level_1 ? administrative_area_level_1.long_name : "", 
            province: administrative_area_level_2 ? administrative_area_level_2.long_name : "", 
            district: locality ? locality.long_name : "", 
            zone: sublocality_level_1 ? sublocality_level_1.long_name : "", 
            zipcode: postal_code ? postal_code.long_name : "",
            street: route ? route.long_name : "", 
            streetNumber: street_number ? street_number.long_name : "",
        }))
    }
    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
    }, []);
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
                            title={row ? `${row.description}` : `${t(langKeys.new)} ${t(langKeys.location)}`}
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
                            onChange={(value) => setValue('country', value)}
                            valueDefault={row ? (row.country || "") : ""}
                            error={errors?.country?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.city)} 
                            className="col-6"
                            onChange={(value) => setValue('city', value)}
                            valueDefault={row ? (row.city || "") : ""}
                            error={errors?.city?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.district)} 
                            className="col-6"
                            onChange={(value) => setValue('district', value)}
                            valueDefault={row ? (row.district || "") : ""}
                            error={errors?.district?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.address)} 
                            className="col-6"
                            onChange={(value) => setValue('address', value)}
                            valueDefault={row ? (row.address || "") : ""}
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
                            label={t(langKeys.alternativePhone)} 
                            className="col-6"
                            type="number"
                            onChange={(value) => setValue('alternativePhone', value)}
                            valueDefault={row ? (row.alternativePhone || "") : ""}
                            error={errors?.alternativePhone?.message}
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
                            onChange={(value) => setValue('alternativeEmail', value)}
                            valueDefault={row ? (row.alternativeEmail || "") : ""}
                            error={errors?.alternativeEmail?.message}
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
                            onChange={(value) => setValue('latitude', value)}
                            valueDefault={row ? (row.latitude || "") : ""}
                            error={errors?.latitude?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.longitude)} 
                            className="col-6"
                            type="number"
                            onChange={(value) => setValue('longitude', value)}
                            valueDefault={row ? (row.longitude || "") : ""}
                            error={errors?.longitude?.message}
                        />
                    </div>
                    {
                        isLoaded && 

                        <div className="row-zyx">
                            <div>
                                <div style={{ width: "300px" }}>
                                    <GoogleMap
                                        mapContainerStyle={{
                                            width: '100%',
                                            height: "200px"
                                        }}                            
                                        center={center}
                                        zoom={10}
                                        onLoad={onMapLoad}
                                        onClick={onMapClick}
                                    >
                                        <Marker
                                            key={`${marker.lat}-${marker.lng}`}
                                            position={{ lat: marker.lat, lng: marker.lng }}
                                        />
                                    </GoogleMap>
                                </div>
                                <PickerInteraction userType={"client"} fill={"#eeffde"} />
                            </div>
                        </div>
                    }
                </div>
            </form>
        </div>
    );
}

const Location: FC = () => {
    // const history = useHistory();
    const history = useHistory();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);

    const [viewSelected, setViewSelected] = useState("view-1");
    const mainPaginated = useSelector(state => state.main.mainPaginated);
    const [pageCount, setPageCount] = useState(0);
    const [waitSave, setWaitSave] = useState(false);
    const [totalrow, settotalrow] = useState(0);
    const domains = useSelector(state => state.person.editableDomains);
    const resExportData = useSelector(state => state.main.exportData);
    const [waitImport, setWaitImport] = useState(false);
    const executeResult = useSelector(state => state.main.execute);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({ pageSize: 0, pageIndex: 0, filters: {}, sorts: {}, daterange: null })
    

    const arrayBread = [
        { id: "view-0", name: t(langKeys.configuration_plural) },
        { id: "view-1", name: t(langKeys.locations) },
    ];
    function redirectFunc(view:string){
        if(view ==="view-0"){
            history.push(paths.CONFIGURATION)
            return;
        }
        setViewSelected(view)
    }
    const columns = React.useMemo(
        () => [
            {
                accessor: 'locationid',
                isComponent: true,
                minWidth: 60,
                width: '1%',
            },
            {
                Header: t(langKeys.name),
                accessor: 'name',
                NoFilter: true,
            },
            {
                Header: t(langKeys.phone),
                accessor: 'phone',
                NoFilter: true
            },
            {
                Header: t(langKeys.alternativephone),
                accessor: 'alternativephone',
                NoFilter: true
            },
            {
                Header: t(langKeys.address),
                accessor: 'address',
                NoFilter: true
            },
            {
                Header: t(langKeys.city),
                accessor: 'city',
                NoFilter: true
            },
            {
                Header: t(langKeys.country),
                accessor: 'country',
                NoFilter: true
            },
            {
                Header: t(langKeys.latitude),
                accessor: 'latitude',
                NoFilter: true
            },
            {
                Header: t(langKeys.longitude),
                accessor: 'longitude',
                NoFilter: true
            },
            {
                Header: t(langKeys.type),
                accessor: 'type',
                NoFilter: true
            },
            {
                Header: t(langKeys.schedule),
                accessor: 'schedule',
                NoFilter: true
            },
            {
                Header: "",
                accessor: 'googleurl',
                NoFilter: true
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                NoFilter: true,
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
            if (!resExportData.loading && !resExportData.error) {
                dispatch(showBackdrop(false));
                setWaitSave(false);
                resExportData.url?.split(",").forEach(x => window.open(x, '_blank'))
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [resExportData, waitSave])

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
            alias: x.Header
        }))
        dispatch(exportData(getLocationExport({
            filters: {
                ...filters,
            },
            sorts,
            startdate: daterange.startDate!,
            enddate: daterange.endDate!,
        }), "", "excel", false, columnsExport));
        dispatch(showBackdrop(true));
        setWaitSave(true);
    };

    const handleTemplate = () => {
        const data = [
            {},
            {},
            domains.value?.docTypes.reduce((a, d) => ({ ...a, [d.domainvalue]: t(`type_documenttype_${d.domainvalue?.toLowerCase()}`) }), {}),
            {},
            domains.value?.personGenTypes.reduce((a, d) => ({ ...a, [d.domainvalue]: t(`type_persontype_${d.domaindesc?.toLowerCase()}`) }), {}),
            domains.value?.personTypes.reduce((a, d) => ({ ...a, [d.domainvalue]: t(`type_personlevel_${d.domainvalue?.toLowerCase()}`) }), {}),
            {},
            {},
            {},
            {},
            {},
            domains.value?.genders.reduce((a, d) => ({ ...a, [d.domainvalue]: t(`type_gender_${d.domainvalue?.toLowerCase()}`) }), {}),
            domains.value?.educationLevels.reduce((a, d) => ({ ...a, [d.domainvalue]: t(`type_educationlevel_${d.domainvalue?.toLowerCase()}`) }), {}),
            domains.value?.civilStatuses.reduce((a, d) => ({ ...a, [d.domainvalue]: t(`type_civilstatus_${d.domainvalue?.toLowerCase()}`) }), {}),
            domains.value?.occupations.reduce((a, d) => ({ ...a, [d.domainvalue]: t(`type_ocupation_${d.domainvalue?.toLowerCase()}`) }), {}),
            domains.value?.groups.reduce((a, d) => ({ ...a, [d.domainvalue]: d.domaindesc }), {}),
            domains.value?.channelTypes.reduce((a, d) => ({ ...a, [d.domainvalue]: d.domaindesc }), {}),
            {},
            {},
            {}
        ];
        const header = [
            'firstname',
            'lastname',
            'documenttype',
            'documentnumber',
            'persontype',
            'type',
            'phone',
            'alternativephone',
            'email',
            'alternativeemail',
            'birthday',
            'gender',
            'educationlevel',
            'civilstatus',
            'occupation',
            'groups',
            'channeltype',
            'personcommunicationchannel',
            'personcommunicationchannelowner',
            'displayname'
        ];
        exportExcel(t(langKeys.template), templateMaker(data, header));
    }
    
    const handleUpload = async (files: any) => {
        const file = files?.item(0);
        if (file) {
            let excel: any = await uploadExcel(file, undefined);
            let data: IPersonImport[] = array_trimmer(excel);
            data = data.filter((f: IPersonImport) =>
                (f.documenttype === undefined || Object.keys(domains.value?.docTypes.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domainvalue }), {})).includes('' + f.documenttype))
                && (f.persontype === undefined || Object.keys(domains.value?.personGenTypes.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domaindesc }), {})).includes('' + f.persontype))
                && (f.type === undefined || Object.keys(domains.value?.personTypes.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domainvalue }), {})).includes('' + f.type))
                && (f.gender === undefined || Object.keys(domains.value?.genders.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domainvalue }), {})).includes('' + f.gender))
                && (f.educationlevel === undefined || Object.keys(domains.value?.educationLevels.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domainvalue }), {})).includes('' + f.educationlevel))
                && (f.civilstatus === undefined || Object.keys(domains.value?.civilStatuses.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domainvalue }), {})).includes('' + f.civilstatus))
                && (f.occupation === undefined || Object.keys(domains.value?.occupations.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domainvalue }), {})).includes('' + f.occupation))
                && (f.groups === undefined || Object.keys(domains.value?.groups.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domaindesc }), {})).includes('' + f.groups))
                && (f.channeltype === undefined || Object.keys(domains.value?.channelTypes.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domaindesc }), {})).includes('' + f.channeltype))
            );
            if (data.length > 0) {
                dispatch(showBackdrop(true));
                let table: Dictionary = data.reduce((a: any, d: IPersonImport) => ({
                    ...a,
                    [`${d.documenttype}_${d.documentnumber}`]: {
                        id: 0,
                        firstname: d.firstname || null,
                        lastname: d.lastname || null,
                        documenttype: d.documenttype,
                        documentnumber: d.documentnumber,
                        persontype: d.persontype || null,
                        type: d.type || '',
                        phone: d.phone || null,
                        alternativephone: d.alternativephone || null,
                        email: d.email || null,
                        alternativeemail: d.alternativeemail || null,
                        birthday: d.birthday || null,
                        gender: d.gender || null,
                        educationlevel: d.educationlevel || null,
                        civilstatus: d.civilstatus || null,
                        occupation: d.occupation || null,
                        groups: d.groups || null,
                        status: 'ACTIVO',
                        personstatus: 'ACTIVO',
                        referringpersonid: 0,
                        geographicalarea: null,
                        age: null,
                        sex: null,
                        operation: 'INSERT',
                        pcc: data
                            .filter((c: IPersonImport) => `${c.documenttype}_${c.documentnumber}` === `${d.documenttype}_${d.documentnumber}`
                                && !['', null, undefined].includes(c.channeltype)
                                && !['', null, undefined].includes(c.personcommunicationchannel)
                            )
                            .map((c: IPersonImport) => ({
                                type: c.channeltype,
                                personcommunicationchannel: c.personcommunicationchannel || null,
                                personcommunicationchannelowner: c.personcommunicationchannelowner || null,
                                displayname: c.displayname || null,
                                status: 'ACTIVO',
                                operation: 'INSERT'
                            }))
                    }
                }), {});
                Object.values(table).forEach((p: IPersonImport) => {
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
    }

    if (viewSelected === "view-1") {

        return (
            
            
            <div style={{ height: '100%', width: 'inherit' }}>

            <div style={{ display: 'flex',  justifyContent: 'space-between',  alignItems: 'center'}}>
                <TemplateBreadcrumbs
                    breadcrumbs={arrayBread}
                    handleClick={redirectFunc}
                />
            </div>
            <div style={{ display: 'flex', gap: 8, flexDirection: 'row', marginBottom: 12, marginTop: 4 }}>
                <div style={{ flexGrow: 1 }} >
                    <Title><Trans i18nKey={langKeys.location} count={2} /></Title>
                </div>
            </div>
            <TablePaginated
                columns={columns}
                data={mainPaginated.data}
                pageCount={pageCount}
                totalrow={totalrow}
                loading={mainPaginated.loading}
                download={true}
                exportPersonalized={triggerExportData}
                fetchData={fetchData}
                useSelection={true}
                onClickRow={()=>setViewSelected("view-2")}
                register={true}
                ButtonsElement={() => (
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={mainPaginated.loading}
                        startIcon={<ListAltIcon color="secondary" />}
                        onClick={handleTemplate}
                        style={{ backgroundColor: "#55BD84" }}
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