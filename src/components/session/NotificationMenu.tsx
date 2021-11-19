import { Badge, BadgeProps, Box, BoxProps, createStyles, IconButton, List, ListItem, makeStyles, Popover, styled, Theme } from "@material-ui/core";
import { LeadActivityNotification } from "@types";
import paths from "common/constants/paths";
import { useSelector } from "hooks";
import { BellNotificationIcon } from "icons";
import { langKeys } from "lang/keys";
import { FC, MouseEventHandler, useState } from "react";
import { Trans } from "react-i18next";
import { useHistory } from "react-router";

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
            width: '100%',
            padding: theme.spacing(1),
            backgroundColor: 'inherit',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            textAlign: 'start',
        },
        row: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
        },
        title: {
            fontWeight: 'bold',
        },
        date: {
            fontSize: 11,
            color: 'grey',
        },
    }),
);

interface NotificaionListItemProps {
    title: React.ReactNode;
    description: React.ReactNode;
    date: React.ReactNode;
    onClick?: MouseEventHandler<HTMLDivElement>;
}

const NotificaionListItem: FC<NotificaionListItemProps> = ({ title, description, date, onClick }) => {
    const classes = useNotificaionStyles();

    return (
        <ListItem button className={classes.root} onClick={onClick}>
            <div className={classes.row}>
                <span className={classes.title}>{title}</span>
                <span className={classes.date}>{date}</span>
            </div>
            <div style={{ height: 2 }} />
            <span>{description}</span>
        </ListItem>
    );
}

const useNotificationMenuStyles = makeStyles((theme: Theme) =>
  createStyles({
        rootIcon: {
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
        },
        containerPopover: {
            display: 'flex',
            alignItems: 'center',
            padding: 0,
            flexDirection: 'column',
            gap: theme.spacing(1.5),
            width: 270,
            maxHeight: 410,
        },
        list: {
            padding: theme.spacing(1),
            width: '100%',
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

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'notification-list-menu-popover' : undefined;
    const notifications = resValidateToken.loading ? [] : resValidateToken.user?.notifications || [];
    const notificationCount = notifications.length;

    return (
        <Box {...boxProps}>
            <IconButton aria-label="bell-notification" onClick={handleClick}>
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
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            >
                <div className={classes.containerPopover}>
                    {notificationCount > 0 ?
                    (
                        <List component="nav" className={classes.list}>
                            {notifications.map((e, i) => {
                                if (e.notificationtype === "LEADACTIVITY") {
                                    const not = e as LeadActivityNotification;
                                    return (
                                        <NotificaionListItem
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
                        </List>
                    ) :
                    (
                        <div className={classes.noNotificationContainer}>
                            <span><Trans i18nKey={langKeys.noNotification} count={2} /></span>
                        </div>
                    )}
                </div>
            </Popover>
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
