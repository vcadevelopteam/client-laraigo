import { Button, makeStyles } from "@material-ui/core";
import { DialogZyx, FieldSelect } from "components";
import { langKeys } from "lang/keys";
import React, { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import SaveIcon from "@material-ui/icons/Save";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { execute, getCollectionAux, getCollectionAux2 } from "store/main/actions";
import { reasonNonDeliverySel, subReasonNonDeliverySel, updateOrderNonDelivery } from "common/helpers";
import { Dictionary } from "@types";

const useStyles = makeStyles(() => ({
    button: {
        display: "flex",
        gap: "10px",
        alignItems: "center",
        justifyContent: "end",
    },
}));

const UndeliveredDialog: React.FC<{
    openModal: boolean;
    setOpenModal: (dat: boolean) => void;
	fetchData: () => void;
	rows: Dictionary[];
}> = ({ openModal, setOpenModal, fetchData, rows }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const executeResult = useSelector((state) => state.main.execute);
    const mainAux = useSelector(state => state.main.mainAux);
	const reasons = useSelector(state => state.main.mainAux2);
    const [reasonid, setReasonid] = useState(0)
    const [subreasonid, setSubreasonid] = useState(0)

	const fetchSubReasons = (id: number) => dispatch(getCollectionAux(subReasonNonDeliverySel(id)));
	const fetchReasons = () => dispatch(getCollectionAux2(reasonNonDeliverySel(0)));

    useEffect(() => {
        fetchSubReasons(reasonid)
    }, [reasonid])

	useEffect(() => {
		fetchReasons()
	}, [])

	const handleClose = () => {
        setOpenModal(false)
        setReasonid(0)
        setSubreasonid(0)
    }

    const changeStatus = () => {
        if(reasonid !== 0 && subreasonid !== 0) {
            dispatch(showBackdrop(true));
            dispatch(execute(updateOrderNonDelivery({
                listorderid: rows.map(row => row.orderid).join(','),
                subreasonnondeliveryid: subreasonid,
                orderstatus: 'undelivered',
                latitudecarrier: 0,
                longitudecarrier: 0,
            })))
            setWaitSave(true);
        } else {
            dispatch(
                showSnackbar({
                    show: true,
                    severity: "error",
                    message: t(langKeys.selectField),
                })
            );
        }
    }

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                setWaitSave(false);
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "success",
                        message: t(langKeys.successful_update),
                    })
                );
                handleClose()
                fetchData()
                dispatch(showBackdrop(false));
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);

    return (
        <DialogZyx open={openModal} title={t(langKeys.undelivered)} maxWidth="sm">
            <div className="row-zyx" style={{ justifyContent: "center" }}>
                <FieldSelect
                    label={t(langKeys.nondeliveryreason)}
                    className="col-12"
                    data={reasons?.data.filter((motive) => { return motive.type === 'UNDELIVER' }) || []}
					valueDefault={reasonid}
                    onChange={(value) => {
                        if(value) {
                            setReasonid(value.reasonnondeliveryid)
                        } else {
                            setReasonid(0)
                            setSubreasonid(0)
                        }
                    }}
                    optionValue="reasonnondeliveryid"
                    optionDesc="description"
                />
                <div style={{ paddingTop: "1.5rem" }}></div>
                <FieldSelect
                    label={t(langKeys.nondeliverysubreason)}
                    className="col-12"
                    data={mainAux?.data || []}
                    disabled={mainAux.loading}
                    valueDefault={subreasonid}
                    onChange={(value) => {
                        if(value) {
                            setSubreasonid(value.subreasonnondeliveryid)
                        } else {
                            setSubreasonid(0)
                        }
                    }}
                    optionValue="subreasonnondeliveryid"
                    optionDesc="description"
                />
            </div>
            <div className={classes.button}>
                <Button
                    variant="contained"
                    type="button"
                    color="primary"
                    startIcon={<ClearIcon color="secondary" />}
                    style={{ backgroundColor: "#FB5F5F" }}
                    onClick={handleClose}
                >
                    {t(langKeys.back)}
                </Button>
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    type="button"
                    startIcon={<SaveIcon color="secondary" />}
                    style={{ backgroundColor: "#55BD84" }}
					onClick={changeStatus}
                >
                    {t(langKeys.save)}
                </Button>
            </div>
        </DialogZyx>
    );
};

export default UndeliveredDialog;
