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
        fontSize: '1.4rem',
        color: 'blue',
        marginRight: theme.spacing(2),
    },
    createdAt: {
        fontSize: '1rem',
    },
    actionBy: {
        fontSize: '1rem',
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
        height: 60,
        width: 60,
        padding: 10,
        borderRadius: 30,
        color: 'white',
        backgroundColor: 'blue',
        marginRight: 20,
    },
}));

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
  const datahistory = multiData[1] && multiData[1].success ? multiData[1].data : [];

  return (
    <div className={classes.containerDetail}>
        {datahistory.map((historyItem: HistoryItem, index: number) => (
            <div key={historyItem.orderhistoryid} className={classes.timelineItem} style={{ marginBottom: index < datahistory.length - 1 ? 20 : 0 }}>
                <InsertDriveFileIcon className={classes.icon} />
                <div className={classes.item}>
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