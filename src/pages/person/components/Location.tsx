import { makeStyles } from "@material-ui/core";
import { FieldEdit } from "components";
import { langKeys } from "lang/keys";
import MapLocation from "pages/MapLocation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DetailLocationProps } from "../model";
import { useLocationStyles } from "../styles";

const Location: React.FC<DetailLocationProps> = ({ row, setValue }) => {
    const classes = useLocationStyles();
    const { t } = useTranslation();
    const [directionData, setDirectionData] = useState({
        movedmarker: false,
        searchLocation: "",
    });

    return (
        <div style={{ width: '100%' }}>
            <div className={classes.containerDetail}>
                <div className="row-zyx">
                    <FieldEdit
                        helperText2="enable"
                        variant="outlined"
                        size="small"
                        label={t(langKeys.country)}
                        className="col-6"
                        onChange={(e) => setValue("country", e)}
                        valueDefault={row.country}
                    />
                    <FieldEdit
                        helperText2="enable"
                        variant="outlined"
                        size="small"
                        label={t(langKeys.province)}
                        className="col-6"
                        onChange={(e) => setValue("province", e)}
                        valueDefault={row.province}
                    />
                </div>
                <div className="row-zyx">
                    <FieldEdit
                        helperText2="enable"
                        variant="outlined"
                        size="small"
                        label={t(langKeys.region)}
                        className="col-6"
                        onChange={(e) => setValue("region", e)}
                        valueDefault={row.region}
                    />
                    <FieldEdit
                        helperText2="enable"
                        variant="outlined"
                        size="small"
                        label={t(langKeys.district)}
                        className="col-6"
                        onChange={(e) => setValue("district", e)}
                        valueDefault={row.district}
                    />
                </div>
                <div className="row-zyx">
                    <FieldEdit
                        helperText2="enable"
                        variant="outlined"
                        size="small"
                        label={t(langKeys.address)}
                        className="col-6"
                        onChange={(e) => setValue("address", e)}
                        valueDefault={row.address}
                    />
                    <FieldEdit
                        helperText2="enable"
                        variant="outlined"
                        size="small"
                        label={t(langKeys.addressreference)}
                        className="col-6"
                        onChange={(e) => setValue("addressreference", e)}
                        valueDefault={row.addressreference}
                    />
                </div>
                <div className="row-zyx">
                    <FieldEdit
                        helperText2="enable"
                        variant="outlined"
                        size="small"
                        label={t(langKeys.latitude)}
                        className="col-6"
                        type="number"
                        onChange={(e) => setValue("latitude", e)}
                        valueDefault={row.latitude}
                    />
                    <FieldEdit
                        helperText2="enable"
                        variant="outlined"
                        size="small"
                        label={t(langKeys.longitude)}
                        className="col-6"
                        type="number"
                        onChange={(e) => setValue("longitude", e)}
                        valueDefault={row.longitude}
                    />
                </div>
                <div className="row-zyx">
                    <FieldEdit
                        helperText2="enable"
                        variant="outlined"
                        size="small"
                        label={t(langKeys.postalcode)}
                        className="col-6"
                        type="number"
                        onChange={(e) => setValue("postalcode", e)}
                        valueDefault={row.postalcode}
                    />
                    <FieldEdit
                        helperText2="enable"
                        variant="outlined"
                        size="small"
                        label={t(langKeys.addressnumber)}
                        className="col-6"
                        type="number"
                        onChange={(e) => setValue("addressnumber", e)}
                        valueDefault={row.addressnumber}
                    />
                </div>
                <div className="row-zyx">
                    <FieldEdit
                        helperText2="enable"
                        variant="outlined"
                        size="small"
                        label={t(langKeys.floor_number)}
                        className="col-6"
                        type="number"
                        onChange={(e) => setValue("floor_number", e)}
                        valueDefault={row.floor_number}
                    />
                    <FieldEdit
                        helperText2="enable"
                        variant="outlined"
                        size="small"
                        label={t(langKeys.ubigeocode)}
                        className="col-6"
                        type="number"
                        onChange={(e) => setValue("ubigeocode", e)}
                        valueDefault={row.ubigeocode}
                    />
                </div>
                <div className="row-zyx">
                    <div>
                        <div style={{ width: "100%" }}>
                            <MapLocation directionData={{
                                ...row,
                                ...directionData,
                                lat: row?.latitude || 0,
                                lng: row?.longitude || 0,
                            }} setDirectionData={setDirectionData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Location;