import React, { useEffect, useState } from "react";
import { Button, IconButton, makeStyles } from "@material-ui/core";
import { DialogZyx, FieldEdit, FieldSelect } from "components";
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
import ClearIcon from "@material-ui/icons/Clear";

const useStyles = makeStyles(() => ({
    submotiveButton: {
        cursor: 'pointer',
        width: 166,
        color: 'blue',
        textDecoration: 'underline',
        transition: 'color 0.3s',
        '&:hover': {
          color: '#002394',
          textDecoration: 'underline',
          backgroundColor: 'white'
        }
    },
    cancelButton: {
        marginLeft: 10,
        backgroundColor: 'red',
        color: 'white',
        '&:hover': {
            backgroundColor: '#850000',
        }
    },
    motiveForm: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    motiveRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    motiveText: {
        width: 200,
        border: '1px solid black',
        padding: 5,
        borderRadius: 5
    },
    typeText: {
        width: 120,
        border: '1px solid black',
        padding: 5,
        borderRadius: 5,
        marginLeft: 10,
    },
    actionButtons: {
        marginRight: 20, 
        marginLeft: 20
    },
    button: {
        display: "flex", 
        gap: "10px", 
        alignItems: "center", 
        justifyContent: "end",
        marginTop: 20,
    },
}));

const MotiveDialog = ({
    openModal,
    setOpenModal,
    fetchData,
    setOpenSubmotiveModal,
    row,
    setRow,
}: {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    fetchData: () => void;
    setOpenSubmotiveModal: (value: boolean) => void;
    row: Dictionary | null;
    setRow: (value: Dictionary | null) => void;
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const executeRes = useSelector((state) => state.main.execute);
    const subreasons = useSelector(state => state.main.mainAux2);
    const multiData = useSelector(state => state.main.multiData);
    const [newMotive, setNewMotive] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [waitSave, setWaitSave] = useState(false);
    const [waitSave2, setWaitSave2] = useState(false);
    const [motiveError, setMotiveError] = useState(false)
    const [type, setType] = useState('')

    const fetchSubReasons = (id: number) => dispatch(getCollectionAux2(subReasonNonDeliverySel(id)));

    const handleCreateMotive = (() => {
        const callback = () => {
            dispatch(showBackdrop(true));
            if (isEditing) {
                dispatch(execute(reasonNonDeliveryIns({
                    id: row?.reasonnondeliveryid,
                    status: row?.status,
                    type: type,
                    description: newMotive,
                    operation: 'UPDATE'
                })));
            }
            else {
                dispatch(execute(reasonNonDeliveryIns({
                    id: 0,
                    status: 'ACTIVO',
                    type: type,
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
        } else {
            setMotiveError(true)
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
        console.log(row2)
        setMotiveError(false)
        setIsEditing(true)
        setRow(row2)
        setNewMotive(row2.description)
        setType(row2.type)
    }

    const cancelEdit = () => {
        setIsEditing(false)
        setRow(null)
        setNewMotive('')
        setType('')
        setMotiveError(false)
    }

    const handleCloseModal = () => {
        setOpenModal(false)
        cancelEdit()
    }

    const handleSubmotives = (row2: Dictionary) => {
        dispatch(showBackdrop(true));
        setRow(row2)
        setIsEditing(false)
        setNewMotive('')
        setMotiveError(false)
        fetchSubReasons(row2.reasonnondeliveryid)
        setWaitSave2(true)
    }

    useEffect(() => {
        if (waitSave2) {
            if (!subreasons.loading && !subreasons.error) {
                setOpenSubmotiveModal(true)
                dispatch(showBackdrop(false));
            } else if (subreasons.error) {
                const errormessage = t(subreasons.code ?? "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                setWaitSave2(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [subreasons, waitSave2]);

    const motivesType = [
        {
            value: 'UNDELIVER',
            description: 'No entregado',
        },
        {
            value: 'CANCEL',
            description: 'Cancelación',
        },
    ]

    return (
        <DialogZyx
            open={openModal}
            title={`${t(langKeys.ticket_reason)}s ${t(langKeys.undelivered)} / ${t(langKeys.CANCELED)}`}
            maxWidth="md"
        >
            <div>
                <div className={classes.motiveForm}>
                    <FieldEdit
                        label={t(langKeys.ticket_reason)}
                        width={280}
                        error={motiveError}
                        valueDefault={newMotive}
                        onChange={(value) => {
                            setNewMotive(value)
                            setMotiveError(false)
                        }}
                    />
                    <div style={{width: 200, marginLeft: 20}}>
                        <FieldSelect
                            label={t(langKeys.type)}
                            data={motivesType}
                            valueDefault={type}
                            onChange={(value) => {
                                if (value) {
                                    setType(value.value)
                                } else {
                                    setType('')
                                }
                            }}
                            optionDesc="description"
                            optionValue="value"
                        />
                    </div>
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
                            className={classes.cancelButton}
                            onClick={cancelEdit}
                        >
                            {t(langKeys.cancel)}
                        </Button>
                    )}
                </div>
                <div>
                    {multiData?.data?.[0]?.data.length > 0 && (
                        <div style={{marginTop: 20}}>
                            {multiData?.data?.[0]?.data.sort((a,b) => b?.type?.localeCompare(a.type)).map((motive) => (
                                <div key={motive.reasonnondeliveryid} className={classes.motiveRow}>
                                    <span className={classes.motiveText}>{motive.description}</span>
                                    <span className={classes.typeText}>{t(langKeys[motive.type])}</span>
                                    <div className={classes.actionButtons}>
                                        <IconButton onClick={() => handleEdit(motive)}>
                                            <EditIcon/>
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(motive)}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </div>
                                    {motive.type === 'UNDELIVER' ? (
                                        <Button
                                            className={classes.submotiveButton}
                                            onClick={() => handleSubmotives(motive)}
                                        >
                                            {t(langKeys.managesubmotives)}
                                        </Button>
                                    ) : (
                                        <div style={{width: 166}}/>
                                    )}
                                </div>
                            ))}
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
                        onClick={handleCloseModal}
                    >
                        {t(langKeys.back)}
                    </Button>
                </div>
            </div>
        </DialogZyx>
    );
};

export default MotiveDialog;
