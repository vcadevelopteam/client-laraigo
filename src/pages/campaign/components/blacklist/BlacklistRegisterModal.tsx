import React, { useEffect, useState } from 'react'; 
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { insBlacklist } from 'common/helpers';
import { execute } from 'store/main/actions';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import { DialogZyx, FieldEdit } from 'components';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { ModalProps } from 'pages/campaign/model';

export const BlacklistRegisterModal: React.FC<ModalProps> = ({ openModal, setOpenModal, row, fetchData }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const executeResult = useSelector(state => state.main.execute);
    const [waitSave, setWaitSave] = useState(false);

    const { register, handleSubmit, setValue, getValues, trigger, clearErrors, formState: { errors } } = useForm({
        defaultValues: {
            isnew: row ? false : true,
            id: row ? row.id : 0,
            description: row ? row.description : '',
            type: 'NINGUNO',
            status: 'ACTIVO',
            phone: row ? row.phone : '',
            operation: row ? "UPDATE" : "INSERT"
        }
    });

    const handleCancelModal = () => {
        clearErrors();
        setOpenModal(false);
    }

    const handleSaveModal = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(insBlacklist(data)));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
        
    });

    useEffect(() => {
        register('phone', { validate: (value: string) => (value && value.length > 0) || t(langKeys.field_required) });
        register('description', { validate: (value: string) => (value && value.length > 0) || t(langKeys.field_required) });
    }, [register]);

    useEffect(() => {
        if (row) {
            setValue('id', row.id);
            setValue('phone', row.phone);
            setValue('description', row.description);
            trigger();
        }
    }, [row]);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
                setOpenModal(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.blacklist).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.detail)}
            button1Type="button"
            buttonText1={t(langKeys.cancel)}
            handleClickButton1={handleCancelModal}
            button2Type="button"
            buttonText2={t(langKeys.save)}
            handleClickButton2={handleSaveModal}
        >
            <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.phone)}
                    className="col-6"
                    valueDefault={getValues('phone')}
                    onChange={(value) => setValue('phone', value)}
                    error={errors?.phone?.message}
                />
                <FieldEdit
                    label={t(langKeys.description)}
                    className="col-6"
                    valueDefault={getValues('description')}
                    onChange={(value) => setValue('description', value)}
                    error={errors?.description?.message}
                />
            </div>
        </DialogZyx>
    )
}