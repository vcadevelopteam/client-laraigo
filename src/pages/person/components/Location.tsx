import { makeStyles } from "@material-ui/core";
import { Dictionary, IFetchData, MultiData } from "@types";
import { FieldEdit } from "components";
import { useSelector } from "hooks";
import { langKeys } from "lang/keys";
import MapLocation from "pages/MapLocation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}

interface DetailLocationProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
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

export const Location: React.FC<DetailLocationProps> = ({ data: { row }, setViewSelected }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const [directionData, setDirectionData] = useState({
        country: row?.country||"",
        province: row?.province||"",
        region: row?.region||"",
        district: row?.district||"",
        addressreference: row?.addressreference||"",
        address: row?.address||"",
        postalcode: row?.postalcode||0,
        addressnumber: row?.addressnumber||0,
        ubigeocode: row?.ubigeocode||0,
        floor_number: row?.floor_number||0,
        latitude: row?.latitude||0,
        longitude: row?.longitude||0,
        movedmarker: false,
        searchLocation: "",
    });

    useEffect(() => {
        setValue("latitude",directionData.lat)
        setValue("longitude",directionData.lng)
        setValue("country",directionData.country)
        setValue("city",directionData.city)
        setValue("district",directionData.district)
        setValue("address",directionData.address)
        setValue("googleurl",`https://www.google.com/maps?q=${directionData.lat},${directionData.lng}`)
    }, [directionData])
    
    return (
        <div style={{width: '100%'}}>
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
                            label={t(langKeys.country)} 
                            className="col-6"
                            onChange={(e) => setDirectionData((prev)=>({...prev, country: e}))}
                            valueDefault={directionData.country}
                        />
                        <FieldEdit
                            label={t(langKeys.province)} 
                            className="col-6"
                            onChange={(e) => setDirectionData((prev)=>({...prev, province: e}))}
                            valueDefault={directionData.province}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.region)} 
                            className="col-6"
                            onChange={(e) => setDirectionData((prev)=>({...prev, region: e}))}
                            valueDefault={directionData.region}
                        />
                        <FieldEdit
                            label={t(langKeys.district)} 
                            className="col-6"
                            onChange={(e) => setDirectionData((prev)=>({...prev, district: e}))}
                            valueDefault={directionData.district}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.address)} 
                            className="col-6"
                            onChange={(e) => setDirectionData((prev)=>({...prev, address: e}))}
                            valueDefault={directionData.address}
                        />
                        <FieldEdit
                            label={t(langKeys.addressreference)} 
                            className="col-6"
                            onChange={(e) => setDirectionData((prev)=>({...prev, addressreference: e}))}
                            valueDefault={directionData.addressreference}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.latitude)} 
                            className="col-6"
                            type="number"
                            onChange={(e) => setDirectionData((prev)=>({...prev, lat: e}))}
                            valueDefault={directionData.latitude}
                        />
                        <FieldEdit
                            label={t(langKeys.longitude)} 
                            className="col-6"
                            type="number"
                            onChange={(e) => setDirectionData((prev)=>({...prev, lng: e}))}
                            valueDefault={directionData.longitude}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.postalcode)} 
                            className="col-6"
                            type="number"
                            onChange={(value) => setValue('postalcode', value)}
                            valueDefault={row ? (row.postalcode || "") : ""}
                        />
                        <FieldEdit
                            label={t(langKeys.addressnumber)} 
                            className="col-6"
                            type="number"
                            onChange={(value) => setValue('addressnumber', value)}
                            valueDefault={row ? (row.addressnumber || "") : ""}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.floor_number)} 
                            className="col-6"
                            type="number"
                            onChange={(value) => setValue('floor_number', value)}
                            valueDefault={row ? (row.floor_number || "") : ""}
                        />
                        <FieldEdit
                            label={t(langKeys.ubigeocode)} 
                            className="col-6"
                            type="number"
                            onChange={(value) => setValue('ubigeocode', value)}
                            valueDefault={row ? (row.ubigeocode || "") : ""}
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
        </div>
    );
}