import { Button, makeStyles } from "@material-ui/core";
import { DialogZyx, FieldEdit } from "components";
import { langKeys } from "lang/keys";
import React, { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import SaveIcon from "@material-ui/icons/Save";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { Dictionary } from "@types";
import { useForm } from "react-hook-form";
import { execute } from "store/main/actions";
import { deliveryVehicleIns } from "common/helpers";

const useStyles = makeStyles(() => ({
    button: {
        display: "flex", 
        gap: "10px", 
        alignItems: "center", 
        justifyContent: "end" 
    },
}));


interface RowSelected {
    row2: Dictionary | null;
    edit: boolean;
}


const AssociatedVehicleDialog: React.FC<{
    openModal: boolean;
    setOpenModal: (dat: boolean) => void;
    data: RowSelected;
    fetchVehicles: ()=> void;
}> = ({ openModal, setOpenModal, data:{row2, edit}, fetchVehicles }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector((state) => state.main.execute);

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            id: row2?.deliveryvehicleid || 0,
            status: row2?.status || 'ACTIVO',
            type: row2?.type || '',
            brand: row2?.brand || '',
            model: row2?.model || '',
            vehicleplate: row2?.vehicleplate || '',
            ability: row2?.ability || 0,           
            averagespeed: row2?.averagespeed || 0,
            insuredamount: row2?.insuredamount || 0,
            userid: row2?.userid || 0,
            license: row2?.license || '',
        }
    });

    const onMainSubmit = handleSubmit((data) => {     
        console.log('te')    
        const callback = () => {
            dispatch(showBackdrop(true));
            if (edit) {
                dispatch(execute(deliveryVehicleIns({...data, operation: 'UPDATE'})));           
            }
            else {
                dispatch(execute(deliveryVehicleIns({...data, operation: 'INSERT'})));           
            }
            setWaitSave(true);
        }
        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    React.useEffect(() => {
        register('id');
        register('status');
        register('type', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('brand', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('model', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('vehicleplate', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('ability', { validate: (value) => (value && parseFloat(value) > 0) || t(langKeys.field_required) });
        register('insuredamount', { validate: (value) => (value && parseFloat(value) > 0) || t(langKeys.field_required) });
        register('averagespeed', { validate: (value) => (value && parseFloat(value) > 0) || t(langKeys.field_required) });
        register('userid',  { validate: (value) => (value && parseFloat(value) > 0) || t(langKeys.field_required) });
        register('license',  { validate: (value) => (value && value.length) || t(langKeys.field_required) });
    }, [register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {     
                fetchVehicles();     
                dispatch(showBackdrop(false));
                setOpenModal(false);
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code ?? "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave]);

    useEffect(() => {
        if(row2) {
          setValue('id', row2.deliveryvehicleid)
          setValue('status', row2.status)
          setValue('type', row2.type)
          setValue('brand', row2.brand)
          setValue('model', row2.model)
          setValue('vehicleplate', row2.vehicleplate)
          setValue('ability', row2.ability)
          setValue('insuredamount', row2.averagespeed)
          setValue('averagespeed', row2.insuredamount)
          setValue('userid', row2.userid)
          setValue('license', row2.license)          
        }
      }, [row2])

    return (
        <DialogZyx open={openModal} title={t(langKeys.associatedvehicles)} maxWidth="lg">
            <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.organization)}
                    type="text" className="col-6"                    
                />
                <FieldEdit
                    label={t(langKeys.vehicletype)}
                    type="text" className="col-6"
                    valueDefault={row2?.type}
                    onChange={(value)=> setValue('type', value)}
                    error={typeof errors?.type?.message === 'string' ? errors?.type?.message : ''}
                />
                <FieldEdit
                    label={t(langKeys.brand)}
                    type="text"
                    className="col-6"
                    valueDefault={row2?.brand}
                    onChange={(value)=> setValue('brand', value)}
                    error={typeof errors?.brand?.message === 'string' ? errors?.brand?.message : ''}

                />
                <FieldEdit
                    label={t(langKeys.model)}
                    type="text"
                    className="col-6"
                    valueDefault={row2?.model}
                    onChange={(value)=> setValue('model', value)}
                    error={typeof errors?.model?.message === 'string' ? errors?.model?.message : ''}

                />
                <FieldEdit
                    label={t(langKeys.platenum)}                 
                    className="col-6"
                    valueDefault={row2?.vehicleplate}
                    onChange={(value)=> setValue('vehicleplate', value)}
                    error={typeof errors?.vehicleplate?.message === 'string' ? errors?.vehicleplate?.message : ''}

                />
                <FieldEdit
                    label={t(langKeys.capacity)}
                    type="number"
                    className="col-6"
                    valueDefault={row2?.ability}
                    onChange={(value)=> setValue('ability', value)}
                    error={typeof errors?.ability?.message === 'string' ? errors?.ability?.message : ''}

                />
                <FieldEdit
                    label={t(langKeys.averagespeed)}
                    type="number"
                    className="col-6"
                    valueDefault={row2?.averagespeed}                  
                    onChange={(value)=> setValue('averagespeed', value)}
                    error={typeof errors?.averagespeed?.message === 'string' ? errors?.averagespeed?.message : ''}

                />
                <FieldEdit
                    label={t(langKeys.insuredamount)}
                    type="number"
                    className="col-6"
                    valueDefault={row2?.insuredamount}
                    onChange={(value)=> setValue('insuredamount', value)}
                    error={typeof errors?.insuredamount?.message === 'string' ? errors?.insuredamount?.message : ''}

                />
                <FieldEdit
                    label={t(langKeys.carriername)}
                    type="text"
                    className="col-6"
                    valueDefault={row2?.userid}
                    onChange={(value)=> setValue('userid', value)}
                    error={typeof errors?.userid?.message === 'string' ? errors?.userid?.message : ''}

                />
                <FieldEdit
                    label={t(langKeys.licensenum)}
                    type="text"
                    className="col-6"
                    valueDefault={row2?.license}
                    onChange={(value)=> setValue('license', value)}
                    error={typeof errors?.license?.message === 'string' ? errors?.license?.message : ''}
                />
            </div>
            <div className={classes.button} >
                <Button
                    variant="contained"
                    type="button"
                    color="primary"
                    startIcon={<ClearIcon color="secondary" />}
                    style={{ backgroundColor: "#FB5F5F" }}
                    onClick={() => {
                        setOpenModal(false);
                    }}
                >
                    {t(langKeys.back)}
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    type="button"                    
                    onClick={()=>{                                            
                        onMainSubmit()                        
                    }}
                    startIcon={<SaveIcon color="secondary" />}
                    style={{ backgroundColor: "#55BD84" }}
                >
                    {t(langKeys.save)}
                </Button>
            </div>
        </DialogZyx>
    );
};

export default AssociatedVehicleDialog;