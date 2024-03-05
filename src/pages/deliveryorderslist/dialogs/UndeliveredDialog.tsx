import { Button, makeStyles } from "@material-ui/core";
import { DialogZyx, FieldSelect } from "components";
import { langKeys } from "lang/keys";
import React, { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import SaveIcon from "@material-ui/icons/Save";
import { useSelector } from "hooks";
import { getCollectionAux } from "store/main/actions";
import { useDispatch } from "react-redux";
import { subReasonNonDeliverySel } from "common/helpers";

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
}> = ({ openModal, setOpenModal }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const mainAux = useSelector(state => state.main.mainAux);
    const multiData = useSelector(state => state.main.multiData);
    const [reasonid, setReasonid] = useState(0)
    const [subreasonid, setSubreasonid] = useState(0)

    const fetchSubReasons = (id: number) => dispatch(getCollectionAux(subReasonNonDeliverySel(id)));

    useEffect(() => {
        fetchSubReasons(reasonid)
    }, [reasonid])

    const handleClose = () => {
        setOpenModal(false)
        setReasonid(0)
        setSubreasonid(0)
    }

    return (
        <DialogZyx open={openModal} title={t(langKeys.undelivered)} maxWidth="sm">
            <div className="row-zyx" style={{ justifyContent: "center" }}>
                <FieldSelect
                    label={t(langKeys.nondeliveryreason)}
                    className="col-12"
                    data={multiData?.data?.[0]?.data || []}
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
                >
                    {t(langKeys.save)}
                </Button>
            </div>
        </DialogZyx>
    );
};

export default UndeliveredDialog;
