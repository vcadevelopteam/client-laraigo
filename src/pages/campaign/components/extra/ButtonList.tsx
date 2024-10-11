import React, { useState } from 'react';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import PhoneIcon from '@material-ui/icons/Phone';
import ReplyIcon from '@material-ui/icons/Reply';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { Dictionary } from '@types';
import { buttonListStyles } from 'pages/campaign/styles';

const ButtonList: React.FC<{ buttons: Dictionary }> = ({ buttons }) => {
    const classes = buttonListStyles();
    const [showAll, setShowAll] = useState(false);

    const getButtonIcon = (type: string) => {
        switch (type) {
            case 'URL':
                return <OpenInNewIcon style={{ height: '24px' }} />;
            case 'PHONE':
            case 'PHONE_NUMBER':
                return <PhoneIcon style={{ height: '24px' }} />;
            case 'QUICK_REPLY':
                return <ReplyIcon style={{ height: '24px' }} />;
            case 'AUTHENTICATION':
                return <FileCopyIcon style={{ height: '24px' }} />;
            default:
                return <ReplyIcon style={{ height: '24px' }} />;
        }
    };

    const handleShowAll = () => {
        setShowAll(!showAll);
    };

    return (
        <div>
            {Array.isArray(buttons) && buttons.slice(0, 2).map((button: Dictionary, index: number) => (
                <a className={classes.buttonPreview} key={index}>
                    <div style={{ fontSize: '1.2rem', display: 'flex', alignContent: 'center', gap: '4px' }}>{getButtonIcon(button.type)} {button.btn.text}</div>
                </a>
            ))}

            {Array.isArray(buttons) && buttons.length > 2 && (
                <a className={classes.showAllButton} onClick={handleShowAll}>
                    See all options
                </a>
            )}

            {showAll && (
                <div className={classes.modalOverlay} onClick={handleShowAll}>
                    <div className={classes.modalContent} onClick={(e) => e.stopPropagation()}>
                        {buttons.slice(2).map((button: Dictionary, index: number) => (
                            <a className={classes.buttonPreview} key={index}>
                                <div style={{ fontSize: '1.2rem', display: 'flex', alignContent: 'center', gap: '4px' }}>{getButtonIcon(button.type)} {button.btn.text}</div>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ButtonList;