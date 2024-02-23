import React from "react";
import { makeStyles } from "@material-ui/core";
import { DialogZyx } from "components";
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import TableZyx from "components/fields/table-simple";

const useStyles = makeStyles(() => ({
}));

const SubmotiveDialog = ({
    openModal,
    setOpenModal,
}: {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const columns = React.useMemo(
        () => [
          {
            accessor: 'motiveid',
            NoFilter: true,
            disableGlobalFilter: true,
            isComponent: true,
            minWidth: 60,
            width: '1%',
          },
          {
            Header: t(langKeys.submotive),
            accessor: "motive",
            width: "auto",
          },
          {
            Header: t(langKeys.type),
            accessor: "type",
            width: "auto",
          },
        ],
        []
    );

    return (
        <DialogZyx
            open={openModal}
            title={`${t(langKeys.submotive)} ${t(langKeys.undelivered)}`}
            maxWidth="sm"
            buttonText0={t(langKeys.close)}
            buttonText1={t(langKeys.save)}
            handleClickButton0={() => setOpenModal(false)}
        >
            <div>
                <TableZyx
                    columns={columns}
                    data={[]}
                    download={false}
                    toolsFooter={false}
                    filterGeneral={false}
                    register={true}
                />
            </div>
        </DialogZyx>
    );
};

export default SubmotiveDialog;
