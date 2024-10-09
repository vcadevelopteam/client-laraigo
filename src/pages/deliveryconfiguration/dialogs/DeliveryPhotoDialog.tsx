import React, { useState } from "react";
import { Button, makeStyles, IconButton } from "@material-ui/core";
import { DialogZyx, FieldEdit } from "components";
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import ClearIcon from "@material-ui/icons/Clear";

const useStyles = makeStyles(() => ({
    addbutton: {
        marginTop: 20,
    },
    col4: {
        height: 324,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 0,
        border: "4px outset #7721AD",
    },
    selectedPhotosContainer: {
        maxHeight: "260px",
        overflowY: "auto",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    photoItem: {
        marginBottom: 6,
        display: "flex",
        alignItems: "center",
    },
    photoSpan: {
        border: "1px solid black",
        width: 100,
        display: "flex",
        justifyContent: "center",
        padding: "8px 0",
    },
    noPhotosTextContainer: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        display: "flex", 
        gap: "10px", 
        alignItems: "center", 
        justifyContent: "end",
        marginTop: 20,
    },
    photonumber: {
        marginRight: 10,
        width: 60,
        textAlign: "center",
    }
}));

const DeliveryPhotoDialog = ({
    openModal,
    setOpenModal,
    onMainSubmit,
    deliveryPhotos,
    setDeliveryPhotos,
    fetchOriginalConfig,
}: {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    onMainSubmit: () => void;
    deliveryPhotos: string[];
    setDeliveryPhotos: (photos: string[]) => void;
    fetchOriginalConfig: () => void;
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [isAding, setIsAding] = useState(false);
    const [newPhoto, setNewPhoto] = useState('');
    const [photoNameError, setPhotoNameError] = useState(false);

    const handleCancelNewPhoto = () => {
        setNewPhoto('')
        setIsAding(false)
        setPhotoNameError(false)
    }

    const handleSaveNewPhoto = () => {
        if(!deliveryPhotos.some(photo => photo === newPhoto) && newPhoto !== '') {
            setDeliveryPhotos([...deliveryPhotos, newPhoto])
            setNewPhoto('')
            setIsAding(false)
            setPhotoNameError(false)
        } else {
            setPhotoNameError(true)
        }
    }

    const handleDeletePhoto = (photo: string) => {
        const updatedPhotos = deliveryPhotos.filter((p) => p !== photo);
        setDeliveryPhotos(updatedPhotos);
    };

    const handleSave = () => {
        onMainSubmit()
        setOpenModal(false)
    }

    const closeModal = () => {
        fetchOriginalConfig();
        handleCancelNewPhoto()
        setOpenModal(false);
    };

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.deliveryphotoorder)}
            maxWidth="sm"
        >
            <div className="row-zyx" style={{marginBottom: 0}}>
                <div className={classes.col4}>
                    {deliveryPhotos.length > 0 ? (
                        <>
                            <h3>Fotos registradas</h3>
                            <div className={classes.selectedPhotosContainer}>
                                {deliveryPhotos.map((photo, index) => (
                                    <>
                                        <div className={classes.photoItem}>
                                            <span className={classes.photonumber}>{t(langKeys.photo).toUpperCase() + ' ' + (index + 1)}</span>
                                            <span className={classes.photoSpan}>{photo}</span>
                                            <IconButton onClick={() => handleDeletePhoto(photo)}>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </div>
                                    </>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className={classes.noPhotosTextContainer}>
                            <p>No hay fotos registradas</p>
                        </div>
                    )}
                </div>
                {isAding ? (
                    <div style={{display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent: 'center', marginTop: 20,}}>
                        <FieldEdit
                            label={t(langKeys.name)}
                            variant="outlined"
                            valueDefault={newPhoto}
                            onChange={(value) => {
                                setNewPhoto(value)
                                setPhotoNameError(false)
                            }}
                            error={photoNameError}
                        />
                        {photoNameError && (<span style={{color: 'red'}}>{newPhoto === '' ? t(langKeys.field_required) : t(langKeys.photonamealreadyexist)}</span>)}
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <Button
                                className={classes.addbutton}
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon color="secondary"/>}
                                onClick={handleSaveNewPhoto}
                            >
                                {t(langKeys.add)}
                            </Button>
                            <div style={{width: 20}}/>
                            <Button
                                className={classes.addbutton}
                                variant="contained"
                                color="secondary"
                                onClick={handleCancelNewPhoto}
                            >
                                {t(langKeys.cancel)}
                            </Button>
                        </div>
                    </div>
                ): (
                    <Button
                        className={classes.addbutton}
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon color="secondary"/>}
                        onClick={() => setIsAding(true)}
                    >
                        {t(langKeys.add) + " " + t(langKeys.deliveryphotoorder)}
                    </Button>
                )}
                <div className={classes.button}>
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        startIcon={<ClearIcon color="secondary" />}
                        style={{ backgroundColor: "#FB5F5F" }}
                        onClick={closeModal}
                    >
                        {t(langKeys.back)}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        type="button"                    
                        onClick={handleSave}
                        startIcon={<SaveIcon color="secondary" />}
                        style={{ backgroundColor: "#55BD84" }}
                    >
                        {t(langKeys.save)}
                    </Button>
                </div>
            </div>
        </DialogZyx>
    );
};

export default DeliveryPhotoDialog;
