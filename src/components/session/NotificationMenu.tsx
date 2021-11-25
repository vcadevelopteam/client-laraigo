import { Badge, BadgeProps, Box, BoxProps, createStyles, IconButton, makeStyles, Menu, MenuItem, styled, Theme } from "@material-ui/core";
import { LeadActivityNotification } from "@types";
import paths from "common/constants/paths";
import { useSelector } from "hooks";
import { BellNotificationIcon } from "icons";
import { FC, MouseEventHandler, useState } from "react";
import { useHistory } from "react-router";
import clsx from 'clsx';

const StyledBadge = styled(Badge)<BadgeProps>(() => ({
    '& .MuiBadge-badge': {
        color: 'white',
        right: 4,
        top: 4,
        backgroundColor: '#FF7301',
        border: `2px solid white`,
        padding: '0 4px',
    },
}));

const useNotificaionStyles = makeStyles((theme: Theme) =>
  createStyles({
        root: {
            padding: theme.spacing(1),
            backgroundColor: 'inherit',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            textAlign: 'start',
            width: 270,
            maxWidth: 270,
        },
        row: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
        },
        title: {
            fontWeight: 'bold',
        },
        date: {
            fontSize: 11,
            color: 'grey',
        },
        textOneLine: {
            flexGrow: 1,
            overflow: 'hidden',
        },
        description: {
            width: '100%',
        },
    }),
);

interface NotificaionMenuItemProps {
    title: React.ReactNode;
    description: React.ReactNode;
    date: React.ReactNode;
    onClick?: MouseEventHandler<HTMLLIElement>;
}

const NotificaionMenuItem: FC<NotificaionMenuItemProps> = ({ title, description, date, onClick }) => {
    const classes = useNotificaionStyles();

    return (
        <MenuItem button className={classes.root} onClick={onClick}>
            <div className={classes.row}>
                <div className={classes.textOneLine}>
                    <span className={classes.title}>{title}</span>
                </div>
                <div style={{ width: 12 }} />
                <span className={classes.date}>{date}</span>
            </div>
            <div className={clsx(classes.description, classes.textOneLine)}>
                <span>{description}</span>
            </div>
        </MenuItem>
    );
}

const useNotificationMenuStyles = makeStyles((theme: Theme) =>
  createStyles({
        rootIcon: {
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
        },
        menu: {
            padding: theme.spacing(1),
            maxHeight: 410,
            fontSize: 12,
        },
        noNotificationContainer: {
            height: 90,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
    }),
);

const NotificationMenu: FC<BoxProps> = (boxProps) => {
    const classes = useNotificationMenuStyles();
    const history = useHistory();

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const resValidateToken = useSelector(state => state.login.validateToken);

    const open = Boolean(anchorEl);
    const notifications = resValidateToken.loading ? [] : resValidateToken.user?.notifications || [];
    const notificationCount = notifications.length;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (notificationCount === 0) return;
        setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box {...boxProps}>
            <IconButton
                aria-label="bell-notification"
                aria-controls="notification-list-menu-popover"
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <div className={classes.rootIcon}>
                    {notificationCount > 0 ?
                    (
                        <StyledBadge badgeContent={notificationCount} color="secondary">
                            <BellNotificationIcon />
                        </StyledBadge>
                    ) :
                    <BellNotificationIcon />}
                </div>
            </IconButton>
            <Menu
                id="notification-list-menu-popover"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                className={classes.menu}
                MenuListProps={{
                    'aria-labelledby': 'lock-button',
                    role: 'listbox',
                }}
            >         
                {notifications.map((e, i) => {
                    if (e.notificationtype === "LEADACTIVITY") {
                        const not = e as LeadActivityNotification;
                        return (
                            <NotificaionMenuItem
                                key={i}
                                title={not.description}
                                description={not.leadname}
                                date={formatDate(not.duedate)}
                                onClick={() => {
                                    handleClose();
                                    history.push(paths.CRM_EDIT_LEAD.resolve(not.leadid));
                                }}
                            />
                        );
                    }
                
                    return <div style={{ display: 'none' }} />;
                })}
            </Menu>
        </Box>
    );
};

export default NotificationMenu;

const formatDate = (strDate: string) => {
    if (!strDate || strDate === '') return '';

    const date = new Date(strDate);
    const day = date.toLocaleDateString("en-US", { day: '2-digit' });
    const month = date.toLocaleDateString("en-US", { month: '2-digit' });
    const year = date.toLocaleDateString("en-US", { year: 'numeric' });

    return `${day}/${month}/${year}`;
}
