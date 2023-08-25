import { Button, makeStyles } from "@material-ui/core";
import {
  DialogZyx,
  FieldCheckbox,
  FieldEdit,
  FieldSelect,
  FieldView,
} from "components";
import { langKeys } from "lang/keys";
import { useState } from "react";
import { UseFormGetValues } from "react-hook-form";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import SaveIcon from "@material-ui/icons/Save";

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(2),
  },
}));

const ChangeStatusDialog: React.FC<{
  openModal: any;
  setOpenModal: (dat: any) => void;
  getValues?: UseFormGetValues<any>;
  massive?: boolean;
}> = ({ openModal, setOpenModal, getValues, massive = false }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [newState, setNewState] = useState("");
  const [comment, setComment] = useState("");
  const [moveToInventory, setMoveToInventory] = useState(false);
  return (
    <DialogZyx open={openModal} title={t(langKeys.change_status)}>
      {!massive && (
        <>
          <div className="row-zyx">
            <FieldView
              label={t(langKeys.code)}
              className={"col-6"}
              value={getValues?getValues("code"):""}
            />
            <FieldView
              label={t(langKeys.description)}
              className={"col-6"}
              value={getValues?getValues("description"):""}
            />
          </div>
        </>
      )}
      <div className="row-zyx">
        {!massive && (
          <FieldView
            label={`${t(langKeys.status)} ${t(langKeys.current)}`}
            className={"col-6"}
            value={getValues?getValues("status"):""}
          />
        )}
        <FieldSelect
          label={`${t(langKeys.new)} ${t(langKeys.status)} `}
          className="col-6"
          valueDefault={newState}
          onChange={(value) => setNewState(value?.domainvalue || "")}
          error={""}
          data={[]}
          optionValue="domainvalue"
          optionDesc="domainvalue"
        />
      </div>
      <div className="row-zyx">
        <FieldCheckbox
          label={t(langKeys.move_new_status)}
          className={`col-6`}
          valueDefault={moveToInventory}
          onChange={(value) => {
            setMoveToInventory(value);
          }}
        />
      </div>
      <div className="row-zyx">
        <FieldEdit
          label={t(langKeys.ticket_comment)}
          valueDefault={comment}
          onChange={(value) => setComment(value)}
          inputProps={{ maxLength: 256 }}
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

export default ChangeStatusDialog;