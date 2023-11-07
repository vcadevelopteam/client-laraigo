/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { TemplateBreadcrumbs, TitleDetail } from 'components';
import { Dictionary } from "@types";
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import DeliveryConfigurationTabDetail from './detailTabs/DeliveryConfigurationTabDetail';
import { resetMainAux } from 'store/main/actions';
import CoincidenceMetersDialog from '../dialogs/CoincidenceMetersDialog';
import VehicleTypeDialog from '../dialogs/VehicleTypeDialog';
import NonWorkingDaysDialog from '../dialogs/NonWorkingDaysDialog';
import DeliverySchedulesDialog from '../dialogs/DeliverySchedulesDialog';
import DeliveryPhotoDialog from '../dialogs/DeliveryPhotoDialog';


interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
}

interface DetailProps {
    data: RowSelected;
    fetchData?: any;
    fetchDataAux?: any;
}


const useStyles = makeStyles((theme) => ({
    containerDetail: {
        // marginTop: theme.spacing(2),
        // marginRight: theme.spacing(2),
        // padding: theme.spacing(2),
        // background: '#fff',
        width: '100%'
    },
    button: {
        marginRight: theme.spacing(2),
    },
    containerHeader: {
        padding: theme.spacing(1),
    },
    itemDate: {
        minHeight: 40,
        height: 40,
        border: '1px solid #bfbfc0',
        borderRadius: 4,
        color: 'rgb(143, 146, 161)'
    },
    tabs: {
        color: '#989898',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 'inherit',
    },
}));

const DeliveryConfigurationDetail: React.FC<DetailProps> = ({ data: { row, edit }, fetchData, fetchDataAux }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const classes = useStyles();
    const [openModalCoincidenceMeters, setOpenModalCoincidenceMeters] = useState(false)
    const [openModalNonWorkingDays, setOpenModalNonWorkingDays] = useState(false)
    const [openModalVehicleType, setOpenModalVehicleType] = useState(false)
    const [openModalDeliverySchedules, setOpenModalDeliverySchedules] = useState(false)
    const [openModalDeliverPhoto, setOpenModalDeliverPhoto] = useState(false)

    const arrayBread = [
        { id: "main-view", name: t(langKeys.delivery) },
        { id: "detail-view", name: t(langKeys.configuration) },
    ];
    
    const { register, handleSubmit:handleMainSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            warehouseid: row?.warehouseid || 0,
            operation: edit ? "EDIT" : "INSERT",
            type: row?.type || '',
            name: row?.name || '',
            description: row?.description || '',
            address: row?.address || '',
            phone: row?.phone || '',
            latitude: row?.latitude || '',
            longitude: row?.longitude || '',
            status: row?.status || 'ACTIVO'
        }
    });

    const fetchWarehouseProducts = () => {
        /*dispatch(
          getCollectionAux(getWarehouseProducts(row?.warehouseid))
        );*/
    }

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData(fetchDataAux);
                dispatch(showBackdrop(false));
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.product).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    React.useEffect(() => {
        register('warehouseid');
        register('name', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('address', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('phone', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('latitude', { validate: (value) => (value && !isNaN(value)) || t(langKeys.field_required) });
        register('longitude', { validate: (value) => (value && !isNaN(value)) || t(langKeys.field_required) });

        dispatch(resetMainAux());
    }, [register]);

    const onMainSubmit = handleMainSubmit((data) => {
        const callback = () => {
            dispatch(showBackdrop(true));
            //dispatch(execute(insWarehouse(data)));

            setWaitSave(true);
        }
        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    return (
        <>
            <form onSubmit={onMainSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBread}
                        />
                        <TitleDetail
                            title={row?.name || `${t(langKeys.delivery)} ${t(langKeys.configuration)}`}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => {setOpenModalVehicleType(true)}}
                        >{t(langKeys.back)}</Button>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type="submit"
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}>
                            {t(langKeys.save)}
                        </Button>
                    </div>

                </div>
                
                <DeliveryConfigurationTabDetail
                    row={row}
                    setValue={setValue}
                    getValues={getValues}
                    errors={errors}
                />

                <CoincidenceMetersDialog
                    openModal={openModalCoincidenceMeters}
                    setOpenModal={setOpenModalCoincidenceMeters}
                />
                <VehicleTypeDialog
                    openModal={openModalVehicleType}
                    setOpenModal={setOpenModalVehicleType}
                />
                <NonWorkingDaysDialog
                    openModal={openModalNonWorkingDays}
                    setOpenModal={setOpenModalNonWorkingDays}
                />
                <DeliverySchedulesDialog
                    openModal={openModalDeliverySchedules}
                    setOpenModal={setOpenModalDeliverySchedules}
                />
                <DeliveryPhotoDialog
                    openModal={openModalDeliverPhoto}
                    setOpenModal={setOpenModalDeliverPhoto}
                />
            </form>
        </>
    );
}


export default DeliveryConfigurationDetail;