import React from "react";
import { makeStyles } from "@material-ui/core";
import { DialogZyx } from "components";
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import { getCollectionAux2 } from "store/main/actions";
import { subReasonNonDeliverySel } from "common/helpers";
import { useSelector } from "hooks";

const useStyles = makeStyles(() => ({
}));

const MotiveDialog = ({
    openModal,
    setOpenModal,
}: {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const subreasons = useSelector(state => state.main.mainAux2);

    const fetchSubReasons = (id: number) => dispatch(getCollectionAux2(subReasonNonDeliverySel(id)));

    return (
        <DialogZyx
            open={openModal}
            title={`${t(langKeys.ticket_reason)} ${t(langKeys.undelivered)}`}
            maxWidth="md"
            buttonText0={t(langKeys.close)}
            buttonText1={t(langKeys.save)}
            handleClickButton0={() => setOpenModal(false)}
        >
            <div>
            </div>
        </DialogZyx>
    );
};

export default MotiveDialog;
function dispatch(arg0: any) {
    throw new Error("Function not implemented.");
}

