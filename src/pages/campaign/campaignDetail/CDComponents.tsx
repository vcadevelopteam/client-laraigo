
import { makeStyles } from "@material-ui/core";
import { Dictionary } from "@types";

export interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
export interface DetailProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    fetchData: () => void;
    handleStart: (id: number) => void;
}
export interface FrameProps {
    page: number,
    checkPage: boolean,
    valid: Dictionary;
    executeSave: boolean,
}

export interface LocalTableVariableMap {
    [key: string]: string;
}

export interface TableColumn {
    label: string;
    description: string;
    persistent: boolean;
}  

export const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    flexgrow1: {
        flexGrow: 1
    }
}));

export const validateField = (origin: string | undefined, data: Dictionary, field: string) => {
    try {
        switch (origin) {
            case 'PERSON':
                switch (field) {
                    case 'lastcontact':
                        return data[field] ? new Date(data[field]).toLocaleString() : '';
                }
                break;
            case 'LEAD':
                switch (field) {
                    case 'changedate':
                    case 'date_deadline':
                        return data[field] ? new Date(data[field]).toLocaleString() : '';
                }
                break;
        }
        return data[field] || '';
    }
    catch (e) {
        return data[field] || ''
    }
}