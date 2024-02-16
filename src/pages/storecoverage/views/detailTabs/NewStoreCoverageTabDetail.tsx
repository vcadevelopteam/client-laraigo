import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { FieldEdit, FieldSelect, IOSSwitch } from 'components';
import { FieldErrors } from "react-hook-form";
import { Button, FormControlLabel, IconButton, Typography } from "@material-ui/core";
import { useSelector } from 'hooks';
import { Dictionary } from "@types";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import GoogleMaps from 'components/fields/GoogleMaps';

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: "#fff",
    }, 
    subtitle: {
        fontSize: '1.2rem',   
        margin: '2rem 0'   
    },
    mapFooter: {
        fontSize: '1rem',   
        color: 'grey',
        textAlign: 'center', 
    },
    button: {
        display: "flex",
        gap: "10px",
        alignItems: "center",        
    },   
    addbutton: {
    backgroundColor: "#55BD84",
        margin: "0 0 1rem 0",      
        '&:hover': {
            backgroundColor: '#55BD84',
            borderRadius: 4
        }
    },
}));

interface NewOrderTabDetailProps {
  errors: FieldErrors
  row: Dictionary
  getValues: any,
  setValue: any
  setStoreAreaCoordinates: (value: any) => void
}

const NewStoreCoverageTabDetail: React.FC<NewOrderTabDetailProps> = ({ errors, row, setValue, getValues, setStoreAreaCoordinates}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [inStore, setInStore] = useState(row?.warehouseinstore || false);
    const multiData = useSelector(state => state.main.multiData);

    function handleSwitchChange (event: React.ChangeEvent<HTMLInputElement>) {
        setValue('warehouseinstore', event.target.checked)
        setInStore(event.target.checked)
    }


    const [coordinates, setCoordinates] = useState<Array<{ latitude: number; longitude: number }>>(row?.coveragearea?.slice(0,-1) || [{ latitude: 0, longitude: 0 }]);  

    useEffect(() => {
        setDuplicatedCoord(coordinates[0]);
        setStoreAreaCoordinates([...coordinates, duplicatedCoord]);
    }, [coordinates]);

    const handleAddCoordinate = () => {
        setCoordinates((prevCoordinates) => [...prevCoordinates, { latitude: 0, longitude: 0 }]);
    };
    const handleDeleteCoordinate = (index: number) => {
        setCoordinates((prevCoordinates) => prevCoordinates.filter((_, i) => i !== index));
    };
    const handleCoordinatesChange = (newCoordinates: Array<{ latitude: number; longitude: number }>) => {
        setCoordinates(newCoordinates);
    }; 

    const [duplicatedCoord, setDuplicatedCoord] = useState<{ latitude: number; longitude: number } | null>(row?.coveragearea?.[row?.coveragearea?.length-1] || null);
    console.log(duplicatedCoord)
 
    useEffect(() => {
        setStoreAreaCoordinates([...coordinates, duplicatedCoord]);
    }, [duplicatedCoord]);

    return (
        <div className={classes.containerDetail}>
            <div className='row-zyx'>
                <FieldEdit
                    label={t(langKeys.storezonename)}
                    valueDefault={getValues('description')}
                    onChange={(value) => setValue('description', value)}
                    className="col-6"
                    maxLength={100}
                    error={typeof errors?.description?.message === 'string' ? errors?.description?.message : ''}
                />
                <FieldEdit
                    label={t(langKeys.telephonenumber)}
                    type="number"
                    maxLength={15}
                    valueDefault={getValues('phone')}
                    onChange={(value) => setValue('phone', value)}
                    className="col-6"
                    error={typeof errors?.phone?.message === 'string' ? errors?.phone?.message : ''}
                />
                <FieldEdit
                    label={t(langKeys.address)}
                    valueDefault={getValues('address')}
                    maxLength={200}
                    onChange={(value) => setValue('address', value)}
                    className="col-6"
                    error={typeof errors?.address?.message === 'string' ? errors?.address?.message : ''}
                />      
                <FieldSelect
                    label={t(langKeys.status)}
                    className="col-6"
                    data={[
                        { domainvalue: "ACTIVO", domaindesc: "ACTIVO" },
                        { domainvalue: "INACTIVO", domaindesc: "INACTIVO" },
                    ]}
                    valueDefault={getValues('status')}
                    onChange={(value) => setValue('status', value?.domainvalue)}
                    error={typeof errors?.status?.message === 'string' ? errors?.status?.message : ''}
                    optionValue="domainvalue"
                    optionDesc="domaindesc"
                />
                <FieldSelect
                    label={t(langKeys.warehouse)}
                    className="col-6"
                    valueDefault={getValues('warehouseid')}
                    data={multiData?.data?.[0]?.data || []}
                    onChange={(value) => setValue('warehouseid', value?.warehouseid)}
                    error={typeof errors?.warehouseid?.message === 'string' ? errors?.warehouseid?.message : ''}
                    optionValue="warehouseid"
                    optionDesc="name"
                />
                <FormControlLabel 
                    style={{paddingLeft:"10px"}}
                    control={
                        <IOSSwitch
                            checked={inStore}
                            onChange={(event) => handleSwitchChange(event)}
                            color='primary'
                        />}
                    label={t(langKeys.instorewarehouse)}
                    className="col-5"
                />        

                <div /*agregacion mapa*/>
                    <Typography className={classes.subtitle}>{t(langKeys.coveragearea)}</Typography>
                    <div className="row-zyx" style={{ justifyContent: 'center' }}>
                    <GoogleMaps 
                        coordinates={coordinates} 
                        onCoordinatesChange={handleCoordinatesChange} 
                    />
                    </div>
                    <Typography className={classes.mapFooter}>{t(langKeys.address_found_in_geolocator)}</Typography>
                    <div style={{ textAlign: "right" }}>    
                    <Button
                        className={classes.addbutton}
                        variant="contained"
                        type="button"
                        color="primary"
                        startIcon={<AddIcon color="secondary" />}
                        onClick={handleAddCoordinate}
                    >
                        {t(langKeys.add) + " " + t(langKeys.coordinate)}
                    </Button>
                    </div>

                    {coordinates.map((coord, index) => (
                        <div key={index} className="row-zyx">
                            <div className="col-1">
                                <IconButton onClick={() => handleDeleteCoordinate(index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                            <div className="col-5">
                                <FieldEdit
                                    label={`${t(langKeys.latitude)} ${index + 1}`}
                                    type="number"
                                    valueDefault={coord.latitude}
                                    onChange={(newValue) => {
                                        setCoordinates((prevCoordinates) =>
                                            prevCoordinates.map((prevCoord, i) =>
                                                i === index ? { ...prevCoord, latitude: Number(newValue) } : prevCoord
                                            )
                                        );
                                    }}
                                />
                            </div>
                            <div className="col-5">
                                <FieldEdit
                                    label={`${t(langKeys.longitude)} ${index + 1}`}
                                    type="number"
                                    valueDefault={coord.longitude}
                                    onChange={(newValue) => {
                                        setCoordinates((prevCoordinates) =>
                                            prevCoordinates.map((prevCoord, i) =>
                                                i === index ? { ...prevCoord, longitude: Number(newValue) } : prevCoord
                                            )
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    ))}
    
                    {coordinates.length > 0 && (
                        <div className="row-zyx">
                            <div className="col-1">
                                <IconButton onClick={handleAddCoordinate}>
                                    <AddIcon />
                                </IconButton>
                            </div>
                            <div className="col-5">
                                <FieldEdit
                                    label={`${t(langKeys.latitude)} ${coordinates.length + 1}`}
                                    type="number"
                                    disabled={true}
                                    valueDefault={duplicatedCoord?.latitude}
                                    onChange={(newValue) => {
                                        setCoordinates((prevCoordinates) => [
                                            ...prevCoordinates,
                                            { ...prevCoordinates[0], latitude: Number(newValue) }
                                        ]);
                                    }}
                                />
                            </div>
                            <div className="col-5">
                                <FieldEdit
                                    label={`${t(langKeys.longitude)} ${coordinates.length + 1}`}
                                    type="number"
                                    disabled={true}
                                    valueDefault={duplicatedCoord?.longitude}
                                    onChange={(newValue) => {
                                        setCoordinates((prevCoordinates) => [
                                            ...prevCoordinates,
                                            { ...prevCoordinates[0], longitude: Number(newValue) }
                                        ]);
                                    }}
                                />
                            </div>
                        </div>
                    )}


                </div>          
            </div>
        </div>
    );
};

export default NewStoreCoverageTabDetail;