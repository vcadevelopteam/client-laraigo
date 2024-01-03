import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { convertLocalDate } from 'common/helpers';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';

const useStyles = makeStyles((theme) => ({
  timelineItem: {
    position: 'relative', 
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(5),
    paddingLeft: theme.spacing(8),
  },
  timelineCircle: {
    position: 'absolute',
    left: '0', 
    top: '50%',
    transform: 'translateY(-50%)',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#7721AD', 
  },
  descriptionContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  description: {
    fontSize: '1.4rem',
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
  
}));

interface HistoryProps {
  multiData: any;
}

const History: React.FC<HistoryProps> = ({ multiData }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const datahistory = multiData[1] && multiData[1].success ? multiData[1].data : [];

  return (
    <div className={classes.containerDetail}>
        {datahistory.map((historyItem: any) => (
            <div key={historyItem.orderhistoryid} className={classes.timelineItem}>

                <div className={classes.timelineCircle} />
                <div style={{display:'block'}}>
                    <div className={classes.descriptionContainer}>
                        <div className={classes.description}>
                            {t(historyItem.description.toLowerCase())}
                        </div>
                        <div className={classes.createdAt}>
                            {convertLocalDate(historyItem.createdate).toLocaleString()}
                        </div>
                    </div>

                    <div className={classes.actionBy}>
                        {t(langKeys.createdBy)}: {historyItem.createby}
                    </div>
                </div>
               

            </div>
        ))}
    </div>
  );
};

export default History;