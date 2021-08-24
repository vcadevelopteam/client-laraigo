import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { useState } from "react";
import { FC } from "react";
import { DateRangePicker as $DateRangePicker, Range, RangeWithKey } from 'react-date-range';

interface DateRangePickerProps {
    open: boolean;
    range?: Range;
    setOpen: (open: boolean) => void;
    onSelect?: (props: Range) => void;
}

const now = new Date();
const defaultRange: Range = { 
    startDate: new Date(now.setDate(0)),
    endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0),
    key: 'selection',
};

const DateRangePicker: FC<DateRangePickerProps> = ({ children, open, setOpen, range = defaultRange, onSelect }) => {
    const [currentRange, setCurrentRange] = useState<Range[]>([range]);

    return (
        <>
            {children}
            <Dialog
                open={open}
                maxWidth="md"
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Filtrar por Rango de Fechas</DialogTitle>
                <DialogContent>
                    <div>
                        <$DateRangePicker
                            onChange={(range) => {
                                const selection = (range as { selection: RangeWithKey }).selection;
                                setCurrentRange([selection]);
                            }}
                            showSelectionPreview={true}
                            moveRangeOnFirstSelection={false}
                            ranges={currentRange}
                            direction="horizontal"
                            months={2}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={() => {
                            onSelect?.(currentRange[0]);
                            setOpen(false);
                        }}
                    >
                        Aplicar
                    </Button>
                    <Button
                        type="button"
                        color="secondary"
                        style={{ marginLeft: '1rem' }}
                        onClick={() => setOpen(false)}
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DateRangePicker;
