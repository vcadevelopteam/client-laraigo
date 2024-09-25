import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { convertLocalDate } from 'common/helpers';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';

const useStyles = makeStyles((theme) => ({
    timelineItem: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    descriptionContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    description: {
        fontSize: '1.3rem',
        color: '#7721AD',
        marginRight: theme.spacing(2),
    },
    createdAt: {
        fontSize: '1rem',
    },
    actionBy: {
        fontSize: '0.9rem',
    },
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    item: {
        backgroundColor: '#E2E2E2',
        border: '1px solid #E2E2E2',
        borderRadius: 15,
        padding: 8,
        width: '100%',
    },
    icon: {
        height: 50,
        width: 50,
        padding: 10,
        borderRadius: 30,
        color: 'white',
        backgroundColor: '#7721AD',
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginRight: 15,
    },
    line: {
        width: '2px',
        height: '30px',
        backgroundColor: '#7721AD',
    },
}));

interface MultiData {
    data: HistoryItem[];
    success: boolean; 
}

interface HistoryProps {
  multiData: any;
}

interface HistoryItem {
    orderhistoryid: number,
    description: string,
    type: string,
    createdate: string,
    createby: string,
    column_uuid: string,
    col_description: string
}

const History: React.FC<HistoryProps> = ({ multiData }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const datahistory = multiData?.data?.[1] && multiData?.data?.[1].success ? multiData?.data?.[1].data : [];

  return (
    <div className={classes.containerDetail}>
        {datahistory
            .filter((historyItem: HistoryItem) => historyItem.description.toLowerCase() !== 'new items')
            .map((historyItem: HistoryItem, index: number, filteredHistory: HistoryItem[]) => (
                <div key={historyItem.orderhistoryid} className={classes.timelineItem}>
                    <div className={classes.container}>
                        <InsertDriveFileIcon className={classes.icon} />
                        {index < filteredHistory.length - 1 && <div className={classes.line} />}
                    </div>
                    <div className={classes.item} style={{ marginBottom: index < filteredHistory.length - 1 ? 10 : 0 }}>
                        <div className={classes.descriptionContainer}>
                            <div className={classes.description}>
                                {t(historyItem.description.toLowerCase())}
                            </div>
                            <div className={classes.createdAt}>
                                {convertLocalDate(historyItem.createdate).toLocaleString()}
                            </div>
                        </div>
                        <div className={classes.actionBy}>
                            {historyItem.description.toLowerCase() === 'new'
                                ? t(langKeys.newordertxt)
                                : historyItem.description.toLowerCase() === 'prepared'
                                ? t(langKeys.preparedordertxt)
                                : historyItem.description.toLowerCase() === 'dispatched'
                                ? t(langKeys.dispatchedordertxt)
                                : t(langKeys.deliveredordertxt)}.&nbsp;&nbsp;&nbsp;({historyItem.createby})
                        </div>
                    </div>
                </div>
            ))}
    </div>
  );
};

export default History;