/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Typography, makeStyles } from "@material-ui/core";
import { DialogZyx, FieldEdit, FieldSelect } from "components";
import { langKeys } from "lang/keys";
import React, { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import SaveIcon from "@material-ui/icons/Save";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { format } from "date-fns";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import TableZyx from "components/fields/table-simple";

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(2),
  },
}));

const ReschedulingUndeliveredDialog: React.FC<{
  openModal: boolean;
  setOpenModal: (dat: boolean) => void;
}> = ({ openModal, setOpenModal }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [waitSave, setWaitSave] = useState(false);
  const executeRes = useSelector(state => state.main.execute);

  const signatureDateDefault = format(new Date(), 'yyyy-MM-dd');


  useEffect(() => {
    if (waitSave) {
        if (!executeRes.loading && !executeRes.error) {
            dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
            dispatch(showBackdrop(false));
            setOpenModal(false);
        } else if (executeRes.error) {
            const errormessage = t(executeRes.code ?? "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() })
            dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
            setWaitSave(false);
            dispatch(showBackdrop(false));
        }
    }
}, [executeRes, waitSave])


const columns = React.useMemo(
    () => [   
      {
        Header: t(langKeys.date),
        accessor: "date",
        width: "auto",
      },
      {
        Header: t(langKeys.shift),
        accessor: "shift",
        width: "auto",
      },      
    ],
    []
  );
  
  return (
    <DialogZyx open={openModal} title={t(langKeys.rescheduling) + " - " + t(langKeys.undelivered)} maxWidth="sm">
      <div className="row-zyx">       
        <FieldEdit
            label={t(langKeys.selectdate)}
            type="date"
            valueDefault={signatureDateDefault}
            className="col-3"
        />      
        <FieldSelect
          label={t(langKeys.selectshift)}
          className="col-4"
          data={[]}
          type="date"
          optionValue="warehouseid"
          optionDesc="name"
        />     
        <div className="row-zyx">
          <TableZyx
            columns={columns}            
            data={[]}           
            filterGeneral={false}
            toolsFooter={false}            
          />
        </div>


      </div>
      <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "end" }}>
        <Button
          variant="contained"
          type="button"
          color="primary"
          startIcon={<ClearIcon color="secondary" />}
          style={{ backgroundColor: "#FB5F5F" }}
          onClick={() => {
            setOpenModal(false);
          }}
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

export default ReschedulingUndeliveredDialog;