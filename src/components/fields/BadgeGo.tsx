import { withStyles } from '@material-ui/core/styles';
import Badge, { BadgeProps } from '@material-ui/core/Badge';

interface BadgePropsTmp extends BadgeProps {
    colortmp: any;
}
const StyledBadge = withStyles((theme) => ({
    badge: (props: any) => ({
        backgroundColor: props.colortmp,
        color: props.colortmp,
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    }),
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}))(({ ...props }: BadgePropsTmp) => <Badge {...props} />);

export default StyledBadge