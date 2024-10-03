import { makeStyles } from "@material-ui/core";
import { Dictionary } from "@types";

export type BreadCrumb = {
    id: string,
    name: string
}

export interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}

export interface ColumnTmp {
    Header: string;
    accessor: string;
    prefixTranslation?: string;
    type?: string;
}

export interface CampaignProps {
    arrayBread: BreadCrumb[];
    setAuxViewSelected: (view: string) => void;  
}

export const campaignStyles = makeStyles((theme) => ({
    
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
    buttonProgrammed: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        backgroundColor: '#efe4b0'
    },
    containerHeader: {
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
        [theme.breakpoints.up("sm")]: {
            display: "flex",
        },
    },
    titleandcrumbs: {
        marginBottom: 4,
        marginTop: 4,
    },
}));