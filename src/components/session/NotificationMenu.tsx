import { Badge, BadgeProps, Box, BoxProps, createStyles, IconButton, makeStyles, Popover, styled, Theme } from "@material-ui/core";
import { BellNotificationIcon } from "icons";
import { FC, useState } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
        rootIcon: {
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
        },
        containerPopover: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(2),
            flexDirection: 'column',
            gap: theme.spacing(1.5),
            width: 270,
            maxHeight: 500,
        },
    }),
);

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    '& .MuiBadge-badge': {
        color: 'white',
        right: 4,
        top: 4,
        backgroundColor: '#FF7301',
        border: `2px solid white`,
        padding: '0 4px',
    },
}));

const Notificaion: FC = () => {
    return (
        <span>
            zzz
        </span>
    );
}

const NotificationMenu: FC<BoxProps> = (boxProps) => {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'notification-list-menu-popover' : undefined;

    return (
        <Box {...boxProps}>
            <IconButton aria-label="bell-notification" onClick={handleClick}>
                <div className={classes.rootIcon}>
                    <StyledBadge badgeContent={4} color="secondary">
                        <BellNotificationIcon />
                    </StyledBadge>
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
                    <Notificaion />
                </div>
            </Popover>
        </Box>
    );
};

export default NotificationMenu;
