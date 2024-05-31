import React, { useEffect } from 'react';
import { DialogZyx, FieldEditArray } from 'components';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';

interface ModalProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => any;
    data: any[];
    parentSetValue: (...param: any) => any;
}

export const ModalCampaignSchedule: React.FC<ModalProps> = ({ openModal, setOpenModal, data = [], parentSetValue }) => {
    const { t } = useTranslation();

    const { control, register, handleSubmit, setValue, formState: { errors }, clearErrors } = useForm<any>({
        defaultValues: {
            batchjson: data.length > 0 ? data : [{ date: '', time: '', quantity: 1 }]
        }
    });

    useEffect(() => {
        setValue('batchjson', data.length > 0 ? data : [{ date: '', time: '', quantity: 1 }]);
    }, [data]);

    const handleCancelModal = () => {
        setOpenModal(false);
        setValue('batchjson', data.length > 0 ? data : [{ date: '', time: '', quantity: 1 }]);
        clearErrors();
    }

    const onSubmit = handleSubmit((data) => {
        parentSetValue('batchjson', data.batchjson.map((d: any, i: number) => ({ ...d, quantity: 1, batchindex: i + 1 })));
        setOpenModal(false);
    });

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.scheduled)}
            button1Type="button"
            buttonText1={t(langKeys.cancel)}
            handleClickButton1={handleCancelModal}
            button2Type="button"
            buttonText2={t(langKeys.save)}
            handleClickButton2={onSubmit}
        >
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t(langKeys.date)}</TableCell>
                            <TableCell>{t(langKeys.hour)}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <FieldEditArray
                                    fregister={{
                                        ...register(`batchjson[0].date`, {
                                            validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                        })
                                    }}
                                    type="date"
                                    valueDefault={data.length > 0 ? data[0].date : ''}
                                    error={errors?.batchjson?.[0]?.date?.message}
                                    onChange={(value) => setValue(`batchjson[0].date`, value)}
                                />
                            </TableCell>
                            <TableCell>
                                <FieldEditArray
                                    fregister={{
                                        ...register(`batchjson[0].time`, {
                                            validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                        })
                                    }}
                                    type="time"
                                    valueDefault={data.length > 0 ? data[0].time : ''}
                                    error={errors?.batchjson?.[0]?.time?.message}
                                    onChange={(value) => setValue(`batchjson[0].time`, value)}
                                />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </DialogZyx>
    )
}
