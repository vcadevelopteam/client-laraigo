import React, { useEffect, useState } from "react";
import { Button, IconButton, makeStyles } from "@material-ui/core";
import { DialogZyx, FieldEdit } from "components";
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import { execute, getCollectionAux2 } from "store/main/actions";
import { reasonNonDeliveryIns, subReasonNonDeliverySel } from "common/helpers";
import { useSelector } from "hooks";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { useDispatch } from "react-redux";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { Dictionary } from "@types";

const useStyles = makeStyles(() => ({
    submotiveButton: {
        cursor: 'pointer',
        color: 'blue',
        textDecoration: 'underline',
        transition: 'color 0.3s',
        '&:hover': {
          color: '#002394',
          textDecoration: 'underline',
          backgroundColor: 'white'
        }
    },
}));

const MotiveDialog = ({
    openModal,
    setOpenModal,
    fetchData
}: {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    fetchData: () => void;
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const executeRes = useSelector((state) => state.main.execute);
    const subreasons = useSelector(state => state.main.mainAux2);
    const multiData = useSelector(state => state.main.multiData);
    const [newMotive, setNewMotive] = useState('')
    const [row, setRow] = useState<Dictionary|null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [waitSave, setWaitSave] = useState(false);

    const fetchSubReasons = (id: number) => dispatch(getCollectionAux2(subReasonNonDeliverySel(id)));

    const handleCreateMotive = (() => {
        const callback = () => {
            dispatch(showBackdrop(true));
            if (isEditing) {
                dispatch(execute(reasonNonDeliveryIns({
                    id: row?.reasonnondeliveryid,
                    status: row?.status,
                    type: row?.type,
                    description: newMotive,
                    operation: 'UPDATE'
                })));
            }
            else {
                dispatch(execute(reasonNonDeliveryIns({
                    id: 0,
                    status: 'ACTIVO',
                    type: 'NINGUNO',
                    description: newMotive,
                    operation: 'INSERT'
                })));         
            }
            setWaitSave(true);
        }
        if(newMotive !== '') {
            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback
            }))
            cancelEdit()
        }
    });

    const handleDelete = (row2: Dictionary) => {   
        const callback = () => {
            dispatch(
                execute(reasonNonDeliveryIns({ ...row2, id: row2.reasonnondeliveryid, operation: "DELETE", status: "ELIMINADO"}))
            );
            dispatch(showBackdrop(true));
            setWaitSave(true);
        };
        dispatch(
            manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_delete),
                callback,
            })
        );
    }

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {     
                fetchData();
                dispatch(showBackdrop(false));
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

    const handleEdit = (row2: Dictionary) => {
        setIsEditing(true)
        setRow(row2)
        setNewMotive(row2.description)
    }

    const cancelEdit = () => {
        setIsEditing(false)
        setRow(null)
        setNewMotive('')
    }

    return (
        <DialogZyx
            open={openModal}
            title={`${t(langKeys.ticket_reason)} ${t(langKeys.undelivered)}`}
            maxWidth="md"
            buttonText0={t(langKeys.back)}
            handleClickButton0={() => setOpenModal(false)}
        >
            <div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <FieldEdit
                        variant="outlined"
                        label={t(langKeys.ticket_reason)}
                        width={280}
                        valueDefault={newMotive}
                        onChange={(value) => setNewMotive(value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        style={{marginLeft: 20}}
                        onClick={handleCreateMotive}
                    >
                        {`${isEditing ? t(langKeys.edit) : `${t(langKeys.add)} ${t(langKeys.new)}`} ${t(langKeys.ticket_reason)}`}
                    </Button>
                    {isEditing && (
                        <Button
                            variant="contained"
                            style={{marginLeft: 10, backgroundColor: 'red', color: 'white'}}
                            onClick={cancelEdit}
                        >
                            {t(langKeys.cancel)}
                        </Button>
                    )}
                </div>
                <div>
                    {multiData?.data?.[0]?.data.length > 0 && (
                        <div style={{marginTop: 20}}>
                            {multiData?.data?.[0]?.data.map((motive) => (
                                <div key={motive.reasonnondeliveryid} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <span style={{width: 200, border: '1px solid black', padding: 5, borderRadius: 5}}>{motive.description}</span>
                                    <div style={{marginRight: 20, marginLeft: 20}}>
                                        <IconButton onClick={() => handleEdit(motive)}>
                                            <EditIcon/>
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(motive)}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </div>
                                    <Button
                                        className={classes.submotiveButton}
                                    >
                                        Gestionar submotivos
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DialogZyx>
    );
};

export default MotiveDialog;
