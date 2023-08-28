import { Button, makeStyles } from "@material-ui/core";
import {
  DialogZyx,
  FieldEdit,
  FieldSelect,
} from "components";
import { langKeys } from "lang/keys";
import { useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import SaveIcon from "@material-ui/icons/Save";

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(2),
  },
}));

const RegisterSpecificationDialog: React.FC<{
  openModal: any;
  setOpenModal: (dat: any) => void;
}> = ({ openModal, setOpenModal }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [values, setValues] = useState({
    dealer:""
  });
  return (
    <DialogZyx open={openModal} title={t(langKeys.change_status)} maxWidth="sm">
      <div className="row-zyx">
          <FieldEdit
            label={t(langKeys.attribute)}
            valueDefault={""}
            className="col-12"
            onChange={(value) => {}}
            inputProps={{ maxLength: 256 }}
          />
          <FieldEdit
            label={t(langKeys.value)}
            valueDefault={""}
            className="col-12"
            onChange={(value) => {}}
            inputProps={{ maxLength: 256 }}
          />
          <FieldSelect
            label={t(langKeys.measureunit)}
            className="col-12"
            valueDefault={values.dealer}
            onChange={(value) => setValues({...values, dealer: value.dealer})}
            error={""}
            data={[]}
            optionValue="domainvalue"
            optionDesc="domainvalue"
          />  
      </div>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
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
          type="submit"
          startIcon={<SaveIcon color="secondary" />}
          style={{ backgroundColor: "#55BD84" }}
        >
          {t(langKeys.save)}
        </Button>
      </div>
    </DialogZyx>
  );
};

export default RegisterSpecificationDialog;