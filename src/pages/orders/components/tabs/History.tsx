import React from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { convertLocalDate, formatNumber } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from 'components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { CellProps } from 'react-table';

const useStyles = makeStyles((theme) => ({
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
    buttonscontainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '1rem',
        marginBottom: 10
    },
    tab: {
        display: 'flex',
        gap: 8,
        alignItems: 'center'
    },
    tabs: {
        color: '#989898',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 'inherit',
    },
    titleandcrumbs: {
        marginBottom: 12,
        marginTop: 4,
    },
    formcontainer: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },
    container: {
        width: '100%',
        color: "#2E2C34",
    },
}));

interface MultiData {
    data: Dictionary[];
    success: boolean;
}


interface HistoryProps {  
    multiData: MultiData[];
}

const History: React.FC<HistoryProps> = ({ multiData }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const datahistory = multiData[1] && multiData[1].success ? multiData[1].data : [];

    const columnsHistory = React.useMemo(
        () => [
            {
                Header: t(langKeys.description),
                accessor: 'col_description',
                width: 'auto',
                Cell: (props: CellProps<Dictionary>) => {
                    const { description } = props.cell.row.original;
                    return <div style={{ padding: 16 }}>{t(description.toLowerCase())}</div>
                },            
            },
            {
                Header: t(langKeys.createdBy),
                accessor: 'createby',
                width: 'auto',
                Cell: (props: CellProps<Dictionary>) => {
                    const { createby } = props.cell.row.original;
                    return <div style={{ padding: 16 }}>{createby}</div>
                }
            },
            {
                Header: t(langKeys.date),
                accessor: 'changedate',
                width: 'auto',
                type: 'date',
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;
                    return convertLocalDate(row.createdate).toLocaleString()
                }
            },
        ],
        []
    );

    return (     
        <>
            <div className={classes.containerDetail}>
                <div className="row-zyx">
                    <TableZyx
                        columns={columnsHistory}
                        titlemodule={t(langKeys.history)}
                        data={datahistory}
                        loading={mainResult.multiData.loading}
                        toolsFooter={false}
                        filterGeneral={false}
                    />
                </div>
            </div>
          
        </>
    );
}

export default History;