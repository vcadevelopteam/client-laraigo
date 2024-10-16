import React, { useEffect, useState } from "react";
import { Button, Checkbox, IconButton, makeStyles } from "@material-ui/core";
import { DialogZyx, FieldEdit, FieldSelect } from "components";
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import { Dictionary } from "@types";
import { useSelector } from "hooks";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { useDispatch } from "react-redux";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { execute, getCollectionAux2 } from "store/main/actions";
import { subReasonNonDeliveryIns, subReasonNonDeliverySel } from "common/helpers";
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import ClearIcon from "@material-ui/icons/Clear";

const useStyles = makeStyles(() => ({
    submotiveForm: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 0
    },
    cancelButton: {
        marginLeft: 10,
        backgroundColor: 'red',
        color: 'white',
        '&:hover': {
            backgroundColor: '#850000',
        }
    },
    submotiveRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    submotiveText: {
        width: 250,
        border: '1px solid black',
        padding: 5,
        borderRadius: 5,
        fontSize: 17
    },
    statusText: {
        width: 120,
        border: '1px solid black',
        padding: 5,
        borderRadius: 5,
        fontSize: 17
    },
    button: {
        display: "flex", 
        gap: "10px", 
        alignItems: "center", 
        justifyContent: "end",
        marginTop: 20,
    },
}));

const SubmotiveDialog = ({
    openModal,
    setOpenModal,
    row,
}: {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    row: Dictionary | null;
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const executeRes = useSelector((state) => state.main.execute);
    const subreasons = useSelector(state => state.main.mainAux2);
    const [isEditing, setIsEditing] = useState(false)
    const [waitSave, setWaitSave] = useState(false);
    const [submotiveError, setSubmotiveError] = useState(false)
    const [newSubmotive, setNewSubmotive] = useState({
        description: '',
        status: '',
    })
    const [subrow, setSubrow] = useState<Dictionary | null>(null)
    const [flag, setFlag] = useState(false)

    const fetchSubReasons = (id: number) => dispatch(getCollectionAux2(subReasonNonDeliverySel(id)));

    const statusOptions = [
        {
            description: t(langKeys.reschedule),
            value: 'reschedule'
        },
        {
            description: t(langKeys.cancel),
            value: 'cancel'
        },
    ]

    const handleCreateSubmotive = (() => {
        const callback = () => {
            dispatch(showBackdrop(true));
            if (isEditing) {
                dispatch(execute(subReasonNonDeliveryIns({
                    id: subrow?.subreasonnondeliveryid,
                    reasonnondeliveryid: subrow?.reasonnondeliveryid,
                    status: subrow?.status,
                    type: subrow?.type,
                    description: newSubmotive.description,
                    statustypified: newSubmotive.status,
                    viewappmovil: flag,
                    operation: 'UPDATE'
                })));
            }
            else {
                dispatch(execute(subReasonNonDeliveryIns({
                    id: 0,
                    reasonnondeliveryid: row?.reasonnondeliveryid,
                    status: 'ACTIVO',
                    type: 'NINGUNO',
                    description: newSubmotive.description,
                    statustypified: newSubmotive.status,
                    viewappmovil: flag,
                    operation: 'INSERT'
                })));         
            }
            setWaitSave(true);
        }
        if(newSubmotive.description !== '' && newSubmotive.status !== '') {
            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback
            }))
            cancelEdit()
        } else {
            setSubmotiveError(true)
        }
    });

    const handleDelete = (row2: Dictionary) => {   
        const callback = () => {
            dispatch(
                execute(subReasonNonDeliveryIns({ ...row2, id: row2.subreasonnondeliveryid, operation: "DELETE", status: "ELIMINADO"}))
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
                fetchSubReasons(row?.reasonnondeliveryid);
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
        setSubmotiveError(false)
        setIsEditing(true)
        setSubrow(row2)
        setNewSubmotive({
            description: row2.description,
            status: row2.statustypified,
        })
        setFlag(row2.viewappmovil)
    }

    const cancelEdit = () => {
        setIsEditing(false)
        setSubrow(null)
        setNewSubmotive({
            description: '',
            status: '',
        })
        setFlag(false)
        setSubmotiveError(false)
    }

    const handleCloseModal = () => {
        setOpenModal(false)
        cancelEdit()
    }

    return (
        <DialogZyx
            open={openModal}
            title={`${t(langKeys.submotive)} ${t(langKeys.undelivered)}: ${row?.description}`}
            maxWidth="md"
        >
            <div>
                <div className={`${classes.submotiveForm} row-zyx`}>
                    <FieldEdit
                        className='col-3'
                        label={t(langKeys.submotive)}
                        error={submotiveError}
                        valueDefault={newSubmotive.description}
                        onChange={(value) => {
                            setNewSubmotive({...newSubmotive, description: value})
                            setSubmotiveError(false)
                        }}
                    />
                    <FieldSelect
                        className='col-2'
                        label={t(langKeys.status)}
                        data={statusOptions}
                        error={submotiveError}
                        optionDesc="description"
                        optionValue="value"
                        valueDefault={newSubmotive.status}
                        onChange={(value) => {
                            if(value) {
                                setNewSubmotive({...newSubmotive, status: value.value})
                                setSubmotiveError(false)
                            } else {
                                setNewSubmotive({...newSubmotive, status: ''})
                            }
                        }}
                    />
                    <div className="col-2">
                        <Checkbox
                            color="primary"
                            checked={flag}
                            onChange={(e) => setFlag(e.target.checked)}
                        />
                        <span>Visible en App</span>
                    </div>        
                    <Button
                        className={isEditing ? 'col-2' : 'col-3'}
                        variant="contained"
                        style={{paddingRight: 10}}
                        color="primary"
                        onClick={handleCreateSubmotive}
                    >
                        {`${isEditing ? t(langKeys.edit) : `${t(langKeys.add)} ${t(langKeys.new)}`} ${t(langKeys.submotive)}`}
                    </Button>
                    {isEditing && (
                        <Button
                            className={`${classes.cancelButton} col-2`}
                            variant="contained"
                            style={{paddingRight: 10}}
                            onClick={cancelEdit}
                        >
                            {t(langKeys.cancel)}
                        </Button>
                    )}
                </div>
                <div>
                    {subreasons.data.length > 0 && (
                        <div style={{marginTop: 20}}>
                            {subreasons.data.map((submotive) => (
                                <div key={submotive.subreasonnondeliveryid} className={classes.submotiveRow}>
                                    {submotive.viewappmovil ? (
                                        <VisibilityIcon style={{marginRight: 20}}/>
                                    ) : (
                                        <VisibilityOffIcon style={{marginRight: 20}}/>
                                    )}
                                    <span className={classes.submotiveText}>{submotive.description}</span>
                                    <div style={{width: 20}}/>
                                    <span className={classes.statusText}>{t(langKeys[submotive.statustypified])}</span>
                                    <div style={{width: 10}}/>
                                    <div>
                                        <IconButton onClick={() => handleEdit(submotive)}>
                                            <EditIcon/>
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(submotive)}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </div>
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

export default SubmotiveDialog;
