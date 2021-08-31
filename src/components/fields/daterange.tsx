import React, { useState, useEffect } from 'react';
import { DateRangePicker, Range, RangeWithKey } from 'react-date-range';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { FC } from 'react';

interface DateRangeProps {
    label: string;
    dateRangeinit: Range[];
    setDateRangeExt?: (date: Range[]) => void;
    fullWidthInput?: boolean;
}

const DateRange: FC<DateRangeProps> = ({ label, dateRangeinit, setDateRangeExt, fullWidthInput = false }) => {
    const [rangePickerString, setrangePickerString] = useState('');
    const [openModal, setOpenModal] = useState(false);

    const [dateRange, setdateRange] = useState(dateRangeinit);

    useEffect(() => {
        if (openModal) {
            setdateRange(dateRangeinit);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openModal])
    const handleClick = () => {
        setOpenModal(false);
        setDateRangeExt?.(dateRange);
    }

    const handleclose = () => {
        setOpenModal(false);

        const stringstart = dateRangeinit[0].startDate ? dateRangeinit[0].startDate.toISOString().substring(0, 10) : "";
        const stringend = dateRangeinit[0].endDate ? dateRangeinit[0].endDate.toISOString().substring(0, 10) : "";

        if (dateRangeinit[0].startDate)
            setrangePickerString(`${stringstart} - ${stringend}`);
        else
            setrangePickerString('');

    }

    useEffect(() => {
        const stringstart = dateRange[0].startDate ? dateRange[0].startDate.toISOString().substring(0, 10) : "";
        const stringend = dateRange[0].endDate ? dateRange[0].endDate.toISOString().substring(0, 10) : "";

        if (dateRange[0].startDate)
            setrangePickerString(`${stringstart} - ${stringend}`);
        else
            setrangePickerString('');
    }, [dateRange])

    return (
        <>
            <TextField
                label={label}
                variant="outlined"
                fullWidth={fullWidthInput}
                disabled
                size="small"
                value={rangePickerString}
                onClick={() => setOpenModal(true)}
            />
            <Dialog
                open={openModal}
                maxWidth="md"
                onClose={handleClick}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Filtrar por Rango de Fechas</DialogTitle>
                <DialogContent>
                    <div>
                        <DateRangePicker
                            onChange={(item) => setdateRange([(item as { selection: RangeWithKey }).selection])}
                            showSelectionPreview={true}
                            moveRangeOnFirstSelection={false}
                            ranges={dateRange}
                            direction="horizontal"
                            months={2}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={handleClick}
                    >Aplicar
                    </Button>
                    <Button
                        type="button"
                        color="secondary"
                        style={{ marginLeft: '1rem' }}
                        onClick={handleclose}
                    >Cerrar
                </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default DateRange;