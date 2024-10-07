import { makeStyles } from "@material-ui/core";

export const useChannelItemStyles = makeStyles(theme => ({
    root: {
        border: '#EBEAED solid 1px',
        borderRadius: 5,
        padding: theme.spacing(2),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        paddingLeft: theme.spacing(3),
        display: "flex",
        alignItems: "center"
    },
    contentContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexGrow: 1,
    },
    propTitle: {
        fontWeight: 400,
        fontSize: 14,
        color: '#8F92A1',
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
    },
    itemLabel: {
        color: '#8F92A1',
        fontSize: 14,
        fontWeight: 400,
        margin: 0,
    },
    itemText: {
        color: theme.palette.text.primary,
        fontSize: 15,
        fontWeight: 400,
        margin: '6px 0',
    },
    subtitle: {
        display: 'flex',
        flexDirection: 'row',
        gap: '0.5em',
        alignItems: 'center',
    },
    propSubtitle: {
        color: theme.palette.text.primary,
        fontWeight: 400,
        fontSize: 15,
        margin: 0,
        width: '100%',
    },
    buttonphone: {
        padding: 0,
        '&:hover': {
            color: "#7721ad",
        },
    }, propertyRoot: {
        display: 'flex',
        flexDirection: 'row',
        stroke: '#8F92A1',
        alignItems: 'center',
        overflowWrap: 'anywhere',
    },
    leadingContainer: {
        height: 24,
        width: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        stroke: '#8F92A1',
        fill: '#8F92A1',
    },
    propSubtitleTicket: {
        fontWeight: 400,
        fontSize: 15,
        margin: 0,
        width: '100%',
        color: '#7721ad',
        textDecoration: 'underline',
        cursor: 'pointer'
    },
}));

export const useConversationsItemStyles = makeStyles(theme => ({
    root: {
        border: '#EBEAED solid 1px',
        borderRadius: 5,
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    collapseContainer: {
        marginTop: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        fontSize: 14,
        fontWeight: 400,
    },
    infoLabel: {
        fontWeight: 500,
        fontSize: 14,
    },
    totalTime: {
        fontWeight: 700,
        fontSize: 16,
    },
    icon: {
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerstyle: {
        padding: "10px 0"
    }
}));

export const useConversationsTabStyles = makeStyles(theme => ({
    root: {
        height: '100%',
    },
    root2: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        height: 35,
        border: '1px solid #EBEAED',
        backgroundColor: '#F9F9FA',
    },
    containerFilterGeneral: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#f9f9fa',
        padding: `${theme.spacing(2)}px`,
    },
    containerSearch: {
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '50%',
        },
    },
    iconButton: {
        padding: 4,
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    inputPlaceholder: {
        '&::placeholder': {
            fontSize: 14,
            fontWeight: 500,
            color: '#84818A',
        },
    },
}));

export const useExtraDataTabStyles = makeStyles(theme => ({
    fieldStyle: {
        margin: 12
    },
}));

export const useGeneralInformationTabStyles = makeStyles(theme => ({
    tabs: {
        backgroundColor: '#EBEAED',
        color: '#989898',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 'inherit',
    },
    tab: {
        color: theme.palette.text.primary,
        backgroundColor: '#EBEAED',
        flexGrow: 1,
        maxWidth: 'unset',
    },
    activetab: {
        backgroundColor: 'white',
    },
    label: {
        fontSize: 14,
        fontWeight: 500,
    },
}));


export const useLocationStyles = makeStyles((theme) => ({
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
    labellink: {
        color: '#7721ad',
        textDecoration: 'underline',
        cursor: 'pointer'
    },
}));

export const usePersonDetailStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: "100%",
        width: 'inherit',
    },
    rootContent: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        flexGrow: 1,
        overflowY: 'hidden',
    },
    tabs: {
        backgroundColor: '#EBEAED',
        color: '#989898',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 'inherit',
    },
    tab: {
        color: theme.palette.text.primary,
        backgroundColor: '#EBEAED',
        flexGrow: 1,
        maxWidth: 'unset',
    },
    activetab: {
        backgroundColor: 'white',
    },
    label: {
        fontSize: 14,
        fontWeight: 500,
    },
    profile: {
        color: theme.palette.text.primary,
        maxWidth: 343,
        width: 343,
        minWidth: 343,
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
    },
    iconHelpText: {
        width: 15,
        height: 15,
        cursor: 'pointer',
    },
}));

export 

const usePropertyStyles = makeStyles(theme => ({
    propertyRoot: {
        display: 'flex',
        flexDirection: 'row',
        stroke: '#8F92A1',
        alignItems: 'center',
        overflowWrap: 'anywhere',
    },
    propTitle: {
        fontWeight: 400,
        fontSize: 16,
        color: 'black',
    },
    propSubtitle: {
        color: theme.palette.text.primary,
        fontWeight: 400,
        fontSize: 15,
        margin: 0,
        width: '100%',
    },
    leadingContainer: {
        height: 24,
        width: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        stroke: '#8F92A1',
        fill: '#8F92A1',
    },
    contentContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexGrow: 1,
    },
    propSubtitleTicket: {
        fontWeight: 400,
        fontSize: 15,
        margin: 0,
        width: '100%',
        color: '#7721ad',
        textDecoration: 'underline',
        cursor: 'pointer'
    },
}));