import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import { langKeys } from 'lang/keys';
import { FieldErrors } from 'react-hook-form';
import { FieldEdit } from 'components';
import { Button, IconButton } from '@material-ui/core';
import GoogleMaps from 'components/fields/GoogleMaps';

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
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

interface InventoryTabDetailProps {
  errors: FieldErrors;
}

const DeliveryAddressTabDetail: React.FC<InventoryTabDetailProps> = ({ errors }) => {
    const { t } = useTranslation();
    const classes = useStyles();
  
    const [coordinates, setCoordinates] = useState<Array<{ latitude: number; longitude: number }>>([
      { latitude: -12.00000000000001, longitude: -77.00000000000001 },
    ]);
  
    const handleAddCoordinate = () => {
      setCoordinates((prevCoordinates) => [...prevCoordinates, { latitude: 0, longitude: 0 }]);
    };
  
    const handleDeleteCoordinate = (index: number) => {
      setCoordinates((prevCoordinates) => prevCoordinates.filter((_, i) => i !== index));
    };
  
    const handleCoordinatesChange = (newCoordinates: Array<{ latitude: number; longitude: number }>) => {
      setCoordinates(newCoordinates);
    };
  
    return (
      <div className={classes.containerDetail}>
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
  
        <div className="row-zyx" style={{ justifyContent: 'center' }}>
          <GoogleMaps coordinates={coordinates} onCoordinatesChange={handleCoordinatesChange} />
        </div>
      </div>
    );
  };
  
  export default DeliveryAddressTabDetail;