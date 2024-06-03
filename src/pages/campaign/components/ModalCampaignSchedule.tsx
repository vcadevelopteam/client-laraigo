import React, { useEffect } from 'react';
import { DialogZyx, FieldEditArray } from 'components';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useFieldArray, useForm } from 'react-hook-form';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

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
            batchjson: data
        }
    });

    useEffect(() => {
        setValue('batchjson', data);
    }, [data]);

    const { fields: schedule, append: scheduleAppend, remove: scheduleRemove } = useFieldArray({
        control,
        name: "batchjson",
    });

    const onClickAddSchedule = async () => {
        scheduleAppend({ date: '', time: '', quantity: 0 });
    }

    const onClickDeleteSchedule = async (index: number) => {
        scheduleRemove(index);
    }

    const handleCancelModal = () => {
        setOpenModal(false);
        setValue('batchjson', data);
        clearErrors();
    }

    const onSubmit = handleSubmit((data) => {
        parentSetValue('batchjson', data.batchjson.map((d: any, i: number) => ({ ...d, batchindex: i + 1 })));
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
                        <TableCell>
                            <IconButton
                                size="small"
                                onClick={() => onClickAddSchedule()}
                            >
                                <AddIcon style={{ color: '#7721AD' }} />
                            </IconButton>
                        </TableCell>
                        <TableCell>{t(langKeys.date)}</TableCell>
                        <TableCell>{t(langKeys.hour)}</TableCell>
                        <TableCell>{t(langKeys.quantity)}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {schedule.map((item: any, i) =>
                        <TableRow key={item.id}>
                            <TableCell>
                                <IconButton
                                    size="small"
                                    onClick={() => onClickDeleteSchedule(i)}
                                >
                                    <DeleteIcon style={{ color: '#777777' }} />
                                </IconButton>
                            </TableCell>
                            <TableCell>
                                <FieldEditArray
                                    fregister={{
                                        ...register(`batchjson.${i}.date`, {
                                            validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                        })
                                    }}
                                    type="date"
                                    valueDefault={item.date}
                                    error={errors?.batchjson?.[i]?.date?.message}
                                    onChange={(value) => setValue(`batchjson[${i}].date`, value)}
                                />
                            </TableCell>
                            <TableCell>
                                <FieldEditArray
                                    fregister={{
                                        ...register(`batchjson.${i}.time`, {
                                            validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                        })
                                    }}
                                    type="time"
                                    valueDefault={item.time}
                                    error={errors?.batchjson?.[i]?.time?.message}
                                    onChange={(value) => setValue(`batchjson[${i}].time`, value)}
                                />
                            </TableCell>
                            <TableCell>
                                <FieldEditArray
                                    fregister={{
                                        ...register(`batchjson.${i}.quantity`, {
                                            validate: (value: any) => (value && value > 0) || t(langKeys.field_required)
                                        })
                                    }}
                                    type="number"
                                    valueDefault={item.quantity}
                                    error={errors?.batchjson?.[i]?.quantity?.message}
                                    onChange={(value) => setValue(`batchjson[${i}].quantity`, parseInt(value))}
                                    inputProps={{ min: 0, step: 1 }}
                                />
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    </DialogZyx>
    )
}
