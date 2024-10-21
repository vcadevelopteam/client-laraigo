import { Button, IconButton, makeStyles } from "@material-ui/core";
import { DialogZyx, FieldEdit } from "components";
import { langKeys } from "lang/keys";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";

const useStyles = makeStyles(() => ({
    vehicleTypeContainer: {
        maxHeight: "175px",
        overflowY: "auto",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    vehicleTypeItem: {
        marginBottom: 6,
        display: "flex",
        alignItems: "center",
    },
    vehicleText: {
        border: "1px solid black",
        width: 100,
        display: "flex",
        justifyContent: "center",
        padding: "8px 0",
		cursor: 'pointer',
    },
    noVehicleTextContainer: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
	addingVehicleTitleContainer: {
		marginBottom: 15,
		textAlign: 'center'
	},
	addingVehicleTitle: {
		fontSize: 15,
		fontWeight: 'bold'
	},
	vehicleListContainer: {
		display: 'flex', flexDirection: 'column', alignItems: 'center', border: "4px outset #7721AD"
	},
	vehicleListTitle: {
		fontSize: 15, margin: '10px 0', fontWeight: 'bold'
	},
    button: {
        display: "flex", 
        gap: "10px", 
        alignItems: "center", 
        justifyContent: "end",
        marginTop: 20,
    },
}));
interface VehicleType {
    vehicle: string;
    insuredamount: number;
    speed: number;
    capacity: number;
}

const VehicleTypeDialog: React.FC<{
    openModal: boolean;
    setOpenModal: (dat: boolean) => void;
    vehicleTypes: VehicleType[];
    setVehicleTypes: (vehicleTypes: VehicleType[]) => void;
    onMainSubmit: () => void;
	fetchOriginalConfig: () => void;
}> = ({ openModal, setOpenModal, vehicleTypes, setVehicleTypes, onMainSubmit, fetchOriginalConfig }) => {
    const { t } = useTranslation();
	const classes = useStyles();
    const [newVehicleType, setNewVehicleType] = useState<VehicleType>({
        vehicle: "",
        insuredamount: 0,
        speed: 0,
        capacity: 0,
    });
	const [vehicleAux, setVehicleAux] = useState<VehicleType|null>(null);
	const [isEditing, setIsEditing] = useState(false)
    const [vehicleCreationError, setVehicleCreationError] = useState(false)

    const handleRegister = () => {
        if(newVehicleType.vehicle !== "" &&
        newVehicleType.insuredamount > 0 &&
        newVehicleType.speed > 0 &&
        newVehicleType.capacity > 0 &&
        !vehicleTypes.some(vehicle => vehicle.vehicle === newVehicleType.vehicle)) {
            setVehicleTypes([...vehicleTypes, newVehicleType]);
            setNewVehicleType({
                vehicle: "",
                insuredamount: 0,
                speed: 0,
                capacity: 0,
            });
            setVehicleCreationError(false)
        } else {
            setVehicleCreationError(true)
        }
    };

    const handleClean = () => {
        setNewVehicleType({
            vehicle: "",
            insuredamount: 0,
            speed: 0,
            capacity: 0,
        });
        setVehicleCreationError(false)
    };

	const handleDelete = (vehicleToDelete: VehicleType) => {
		const updatedVehicleTypes = vehicleTypes.filter(vehicle => vehicle.vehicle !== vehicleToDelete.vehicle);
		setVehicleTypes(updatedVehicleTypes)
	}

	const handleEdit = (vehicleToEdit: VehicleType) => {
		setIsEditing(true)
        setVehicleCreationError(false)
		setNewVehicleType(vehicleToEdit)
		setVehicleAux(vehicleToEdit)
	}

	const handleSaveEdit = () => {
		if(newVehicleType.insuredamount > 0 && newVehicleType.speed > 0 && newVehicleType.capacity > 0) {
            const index = vehicleTypes.findIndex(vehicle => vehicle.vehicle === vehicleAux?.vehicle);
            const updatedVehicleTypes = [...vehicleTypes];
            updatedVehicleTypes[index] = {
                vehicle: newVehicleType.vehicle,
                insuredamount: newVehicleType.insuredamount,
                speed: newVehicleType.speed,
                capacity: newVehicleType.capacity
            };
            setVehicleTypes(updatedVehicleTypes);

            setVehicleAux(null)
            setIsEditing(false)
            setNewVehicleType({
                vehicle: '',
                insuredamount: 0,
                speed: 0,
                capacity: 0,
            })
            setVehicleCreationError(false)
        } else {
            setVehicleCreationError(true)
        }
	}

	const handleCancel = () => {
		setIsEditing(false)
		setVehicleAux(null)
        setVehicleCreationError(false)
		setNewVehicleType({
			vehicle: '',
			insuredamount: 0,
			speed: 0,
			capacity: 0,
		})
	}

	const handleSave = () => {
		onMainSubmit()
		setOpenModal(false)
	}

	const closeModal = () => {
        fetchOriginalConfig();
        handleCancel()
        setOpenModal(false);
    };

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.vehicletype)}
            maxWidth="md"
        >
            <div className="row-zyx" style={{ marginBottom: 0 }}>
                <div className="col-6" style={{ marginBottom: 0 }}>
                    <div className={classes.addingVehicleTitleContainer}>
						{isEditing ? (
							<span className={classes.addingVehicleTitle}>Editar tipo de vehículo</span>
						) : (
							<span className={classes.addingVehicleTitle}>Agregar nuevo tipo</span>
						)}
					</div>
                    <div className="row-zyx" style={{ marginBottom: 0 }}>
                        <FieldEdit
                            label={t(langKeys.vehicle)}
							disabled={isEditing}
                            valueDefault={newVehicleType.vehicle}
                            onChange={(value) => {
                                setNewVehicleType({ ...newVehicleType, vehicle: value })
                                setVehicleCreationError(false)
                            }}
                            className="col-6"
                        />
                        <FieldEdit
                            type="number"
                            label={t(langKeys.insuredamount)}
                            valueDefault={newVehicleType.insuredamount}
                            onChange={(value) => {
                                setNewVehicleType({ ...newVehicleType, insuredamount: value })
                                setVehicleCreationError(false)
                            }}
                            className="col-6"
                        />
                    </div>
                    <div className="row-zyx" style={{ marginBottom: 0 }}>
                        <FieldEdit
                            type="number"
                            label={t(langKeys.averagespeed)}
                            valueDefault={newVehicleType.speed}
                            onChange={(value) => {
                                setNewVehicleType({ ...newVehicleType, speed: value })
                                setVehicleCreationError(false)
                            }}
                            className="col-6"
                        />
                        <FieldEdit
                            type="number"
                            label={t(langKeys.capacity)}
                            valueDefault={newVehicleType.capacity}
                            onChange={(value) => {
                                setNewVehicleType({ ...newVehicleType, capacity: value })
                                setVehicleCreationError(false)
                            }}
                            className="col-6"
                        />
                        {vehicleCreationError && (
                            <span style={{color: 'red'}}>
                                {(newVehicleType.vehicle === '' || newVehicleType.insuredamount <= 0 || newVehicleType.speed <= 0 || newVehicleType.capacity <= 0) ? t(langKeys.completeallfields) : t(langKeys.vehiclealreadyexist)}
                            </span>
                        )}
                    </div>
                    <div style={{marginTop: 10}}>
						{isEditing ? (
							<>
								<Button
									variant="contained"
									style={{marginRight: 10}}
									onClick={handleSaveEdit}
								>
									{t(langKeys.save)}
								</Button>
								<Button
									variant="contained"
									onClick={handleCancel}
								>
									{t(langKeys.cancel)}
								</Button>
							</>
						): (
							<>
								<Button
									variant="contained"
									style={{marginRight: 10}}
									onClick={handleRegister}
								>
									{t(langKeys.register)}
								</Button>
								<Button
									variant="contained"
									disabled={
										!newVehicleType.vehicle &&
										!newVehicleType.insuredamount &&
										!newVehicleType.speed &&
										!newVehicleType.capacity
									}
									onClick={handleClean}
								>
									{t(langKeys.clean)}
								</Button>
							</>
						)}
					</div>
                </div>
                <div className={`${classes.vehicleListContainer} col-6`} style={{marginBottom: 0}}>
                    {vehicleTypes.length > 0 ? (
                        <>
                            <span className={classes.vehicleListTitle}>Tipos de vehículos registrados</span>
                            <div className={classes.vehicleTypeContainer}>
                                {vehicleTypes.map((vehicle) => (
                                    <>
                                        <div className={classes.vehicleTypeItem}>
                                            <div className={classes.vehicleText} onClick={() => handleEdit(vehicle)}>{vehicle.vehicle}</div>
                                            <IconButton>
                                                <DeleteIcon onClick={() => handleDelete(vehicle)}/>
                                            </IconButton>
                                        </div>
                                    </>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className={classes.noVehicleTextContainer}>
                            <p>No hay tipos de vehículos registrados</p>
                        </div>
                    )}
                </div>
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

export default VehicleTypeDialog;
