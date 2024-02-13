import { Button, IconButton } from "@material-ui/core";
import { DialogZyx } from "components";
import { langKeys } from "lang/keys";
import React, { useState } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import { useTranslation } from "react-i18next";
import CalendarZyx, { DayProp } from "components/fields/Calendar";

const NonWorkingDaysDialog: React.FC<{
    openModal: boolean;
    setOpenModal: (dat: boolean) => void;
    nonWorkingDates: string[];
    setNonWorkingDates: (dates: string[]) => void;
    onMainSubmit: () => void;
    fetchOriginalConfig: () => void;
}> = ({ openModal, setOpenModal, nonWorkingDates, setNonWorkingDates, onMainSubmit, fetchOriginalConfig }) => {
    const { t } = useTranslation();
    const [tempSelectedDates, setTempSelectedDates] = useState<DayProp|null>(null);

    const handleDateChange = (date: DayProp) => {
        setTempSelectedDates(date[0]);
    };

    const handleApplyDates = () => {
        setNonWorkingDates([...nonWorkingDates, tempSelectedDates.dateString]);
        setTempSelectedDates([]);
    };

    const handleDeleteDate = (date: string) => {
        const updatedDates = nonWorkingDates.filter((d) => d !== date);
        setNonWorkingDates(updatedDates);
    }

    const closeModal = () => {
        fetchOriginalConfig()
        setOpenModal(false);
    }

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.nonworkingdaysregister)}
            maxWidth="md"
            buttonText0={t(langKeys.back)}
            handleClickButton0={closeModal}
            buttonText1={t(langKeys.save)}
            handleClickButton1={onMainSubmit}
        >
            <div className="row-zyx" style={{marginBottom: 0, display: 'flex', justifyContent: 'center'}}>
                <div className="col-6" style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: 0, justifyContent: 'center'}}>
                    <CalendarZyx
                        onChange={handleDateChange}
                        selectedDays={nonWorkingDates}
                    />
					<Button
						variant="contained"
						color="primary"
						onClick={handleApplyDates}
						disabled={!tempSelectedDates || nonWorkingDates.some(date => date === tempSelectedDates.dateString)}
						style={{ marginLeft: 20 }}
					>
						{t(langKeys.select)}
					</Button>
                </div>
                <div className="col-4" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 0, border: '4px outset #7721AD'}}>
                    {nonWorkingDates.length > 0 ? (
                        <>
                            <h3>Fechas seleccionadas</h3>
							<div style={{maxHeight: '260px', overflowY: 'auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
								{nonWorkingDates.map((date) => (
									<>
										<div style={{ marginBottom: 6, display: "flex", alignItems: "center" }}>
											<span style={{ border: "1px solid black", width: 100, display: 'flex', justifyContent: 'center', padding: '8px 0'}}>{date}</span>
											<IconButton onClick={() => handleDeleteDate(date)}>
												<DeleteIcon />
											</IconButton>
										</div>
									</>
								))}
							</div>
                        </>
                    ) : (
						<div style={{height:'100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
							<p>No hay fechas seleccionadas</p>
						</div>
					)}
                </div>
            </div>
        </DialogZyx>
    );
};

export default NonWorkingDaysDialog;
