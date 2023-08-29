import { Button, makeStyles } from "@material-ui/core";
import {
  DialogZyx,
  FieldCheckbox,
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

const RegisterDealerDialog: React.FC<{
  openModal: any;
  setOpenModal: (dat: any) => void;
}> = ({ openModal, setOpenModal }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [values, setValues] = useState({
    dealer:""
  });
  return (
    <DialogZyx open={openModal} title={t(langKeys.change_status)} maxWidth="xl">
      <div className="row-zyx">
        <div className='col-8'>
          <div className="row-zyx">
              <FieldSelect
                label={t(langKeys.dealer)}
                className="col-6"
                valueDefault={values.dealer}
                onChange={(value) => setValues({...values, dealer: value.dealer})}
                error={""}
                data={[]}
                optionValue="domainvalue"
                optionDesc="domainvalue"
              />
              <FieldEdit
                label={t(langKeys.description)}
                valueDefault={""}
                className="col-6"
                onChange={(value) => {}}
                inputProps={{ maxLength: 256 }}
              />
              <FieldSelect
                label={t(langKeys.manufacturer)}
                className="col-6"
                valueDefault={values.dealer}
                onChange={(value) => setValues({...values, dealer: value.dealer})}
                error={""}
                data={[]}
                optionValue="domainvalue"
                optionDesc="domainvalue"
              />
              <FieldEdit
                label={t(langKeys.description)}
                valueDefault={""}
                className="col-6"
                onChange={(value) => {}}
                inputProps={{ maxLength: 256 }}
              />
              <FieldEdit
                label={t(langKeys.model)}
                valueDefault={""}
                className="col-12"
                onChange={(value) => {}}
                inputProps={{ maxLength: 256 }}
              />
              <FieldEdit
                label={t(langKeys.catalog_nro)}
                valueDefault={""}
                className="col-12"
                onChange={(value) => {}}
                inputProps={{ maxLength: 256 }}
              />
              <FieldEdit
                label={`${t(langKeys.website)} ${t(langKeys.manufacturer)}`}
                valueDefault={""}
                className="col-12"
                onChange={(value) => {}}
                inputProps={{ maxLength: 256 }}
              />
              <FieldSelect
                label={t(langKeys.taxcodes)}
                className="col-12"
                valueDefault={values.dealer}
                onChange={(value) => setValues({...values, dealer: value.dealer})}
                error={""}
                data={[]}
                optionValue="domainvalue"
                optionDesc="domainvalue"
              />
          </div>
        </div>
        <div className='col-4'>
          
          <div className="row-zyx">

            <FieldCheckbox
              label={`${t(langKeys.dealer)} ${t(langKeys.default)}`}
              className={`col-12`}
              valueDefault={false}
              onChange={(value) => {
              }}
            />
            <FieldEdit
              label={`${t(langKeys.averagedeliverytime)} (${t(langKeys.day)})`}
              valueDefault={""}
              className="col-12"
              type="number"
              onChange={(value) => {}}
              inputProps={{ maxLength: 256 }}
            />
            <FieldEdit
              label={t(langKeys.last_price)}
              valueDefault={""}
              className="col-12"
              type="number"
              onChange={(value) => {}}
              inputProps={{ maxLength: 256 }}
            />
            <FieldEdit
              label={t(langKeys.last_order_date)}
              valueDefault={""}
              className="col-12"
              type="date"
              onChange={(value) => {}}
              inputProps={{ maxLength: 256 }}
            />
            <FieldSelect
              label={t(langKeys.purchase_unit)}
              className="col-12"
              valueDefault={values.dealer}
              onChange={(value) => setValues({...values, dealer: value.dealer})}
              error={""}
              data={[]}
              optionValue="domainvalue"
              optionDesc="domainvalue"
            />
          </div>
        </div>
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

export default RegisterDealerDialog;