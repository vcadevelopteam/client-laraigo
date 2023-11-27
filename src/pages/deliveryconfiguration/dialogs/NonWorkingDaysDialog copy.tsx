import { Button, IconButton } from "@material-ui/core";
import { DialogZyx, FieldEdit } from "components";
import { langKeys } from "lang/keys";
import React, { useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
import { useTranslation } from "react-i18next";
import CalendarZyx, { DayProp } from "components/fields/Calendar";

const NonWorkingDaysCopyDialog: React.FC<{
  openModal: boolean;
  setOpenModal: (dat: boolean) => void;
}> = ({ openModal, setOpenModal }) => {
  const { t } = useTranslation();

  const [tempSelectedDates, setTempSelectedDates] = useState<DayProp[]>([]);
  const [selectedDates, setSelectedDates] = useState<DayProp[]>([]);

  const handleDateChange = (dates: DayProp[]) => {
    setTempSelectedDates(dates);
  };

  const handleClearDate = (date: string) => {
    setTempSelectedDates((prevDates) => prevDates.filter((d) => d.dateString !== date));
  };

  const handleApplyDates = () => {
    setSelectedDates((prevDates) => [...prevDates, ...tempSelectedDates]);
    setTempSelectedDates([]);
  };

  return (
    <DialogZyx open={openModal} title={t(langKeys.nonworkingdaysregister)} maxWidth="md">
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

      <div className="row-zyx">
        <div className="col-6">
          <CalendarZyx onChange={handleDateChange} selectedDays={selectedDates.map((date) => date.dateString)} />
        </div>
        <div className="col-6">
          {selectedDates.map((date) => (
            <div key={date.dateString} style={{ marginBottom: 10 }}>
              <FieldEdit
                label={t(langKeys.selected_plural)}
                type="date"
                disabled={true}
                valueDefault={date.dateString}
                className="col-3"
              />
              <IconButton onClick={() => handleClearDate(date.dateString)}>
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
          {tempSelectedDates.length > 0 && (
            <Button variant="contained" color="primary" onClick={handleApplyDates}>
              {t(langKeys.apply)}
            </Button>
          )}
        </div>
      </div>
    </DialogZyx>
  );
};

export default NonWorkingDaysCopyDialog;
