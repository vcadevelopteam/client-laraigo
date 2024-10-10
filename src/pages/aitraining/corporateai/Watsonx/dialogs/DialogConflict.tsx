
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { DialogZyx } from 'components';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Dictionary } from '@types';
import { Button, Checkbox, makeStyles } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { conflictResolution } from 'store/watsonx/actions';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';

interface DetailProps {
    openModal: any;
    setOpenModal: (view: any) => void;
    fetchData?: () => void;
    setExternalViewSelected?: (view: string) => void;
    arrayBread?: any;
}

const useStyles = makeStyles((theme) => ({
    subtitle: {
        color: "grey"
    },
    exampleTypography: {
        fontWeight: "bold",
        width: "100%"
    },
    equalspace: {
        display: 'grid',
        width: '100%',
        padding: "10px 0 0 0",
    },
    checkbox: {
        display: "flex",
        alignItems: "center",
        padding: "20px 0"
    }
}))

export const DialogConflict: React.FC<DetailProps> = ({ openModal, setOpenModal, fetchData }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [listofconflicts, setListofconflicts] = useState<any>([]);
    const conflictList = useSelector(state => state.watson.conflicts);
    const [checkedState, setCheckedState] = useState<boolean[]>([]);
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const executeResult = useSelector(state => state.watson.resolveconflict);
    
    const handleCheckboxChange = (index: number) => {
        const updatedCheckedState = checkedState.map((item, idx) =>
            idx === index ? !item : item
        );
        setCheckedState(updatedCheckedState);
    };

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                const delayFetch = setTimeout(() => {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }));
                    fetchData && fetchData();
                    dispatch(showBackdrop(false));
                    setOpenModal(false);
                }, 1000);
                return () => clearTimeout(delayFetch);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.whitelist).toLocaleLowerCase() });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeResult, waitSave]);

    useEffect(() => {
        if (!conflictList.loading && !conflictList.error) {
            setListofconflicts(conflictList.data)
            setCheckedState(new Array(conflictList.data.length).fill(false))
        }
    }, [conflictList])

    function handleResolve() {
        const callback = () => {
            const filteredConflicts = listofconflicts.filter((item:any, index:number) => checkedState[index]);
            const watsonItemDetailIds = filteredConflicts.map((item:any) => item.watsonitemdetailid).join(',');
            setWaitSave(true)
            dispatch(showBackdrop(true));
            dispatch(conflictResolution({
                watsonid: listofconflicts[0].watsonid,
                watsonitemdetailids: watsonItemDetailIds
            }))
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    return (
        <DialogZyx
            open={!!openModal}
            maxWidth={"md"}
            title={t(langKeys.conflictresolution)}
        >
            <div className="row-zyx" style={{ paddingTop: 0 }}>
                <div className={classes.subtitle}>{t(langKeys.conflictresolutionhelper)}</div>
                <div className={classes.equalspace} style={{ gridTemplateColumns: `repeat(${listofconflicts.length}, 1fr)`, borderTop: '1px solid lightgrey', marginTop: 16 }}>
                    {listofconflicts.map(((x: any) => {
                        return <div style={{ paddingLeft: 10, }}>#{x.item_name}</div>
                    }))}
                </div>
                <div className={classes.equalspace} style={{ gridTemplateColumns: `repeat(${listofconflicts.length}, 1fr)` }}>
                    {listofconflicts.map((x: any, i: number) => {
                        return (
                            <div
                                style={{
                                    borderLeft: i !== 0 ? '1px solid lightgrey' : 'none',
                                    paddingLeft: 10,
                                    borderTop: '1px solid lightgrey',
                                    paddingTop: 15,
                                    paddingBottom: 50
                                }}
                                key={i}
                            >
                                <div className={classes.exampleTypography}>
                                    {t(langKeys.examplesinconflict)}
                                </div>
                                <div className={classes.checkbox}>
                                    <Checkbox
                                        color="primary"
                                        style={{ padding: 0 }}
                                        checked={checkedState[i]}
                                        onChange={() => handleCheckboxChange(i)}
                                        disabled={checkedState.reduce((count, value) => count + (value ? 1 : 0), 0) === (listofconflicts.length-1) && !checkedState[i]}
                                    />
                                    <div>{x?.value}</div>
                                </div>
                            </div>
                        );
                    })}

                </div>
                <div style={{ justifyContent: "end", display: "flex" }}>
                    <Button onClick={() => { setOpenModal(null) }}
                    >
                        {t(langKeys.cancel)}
                    </Button>
                    <Button
                        color="primary"
                        onClick={handleResolve}
                        startIcon={<DeleteIcon color="secondary" />}
                        style={{ backgroundColor: "#FB5F5F" }}
                        type="button"
                        variant="contained"
                    >
                        {t(langKeys.delete)}
                    </Button>
                </div>
            </div>
        </DialogZyx>
    );
}
