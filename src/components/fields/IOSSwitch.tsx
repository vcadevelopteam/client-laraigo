import { createStyles, Switch, SwitchProps, Theme, withStyles } from "@material-ui/core";

interface Props extends SwitchProps {
    classes: any;
}

const width = 20;
const height = 13;


const IOSSwitch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: width,
      height: height,
      padding: 0,
      margin: theme.spacing(1),
    },
    switchBase: {
      padding: 2.5,
      '&$checked': {
        transform: 'translateX(8px)',
        color: theme.palette.common.white,
        '& + $track': {
          backgroundColor: '#52d869',
          opacity: 1,
          border: 'none',
        },
      },
      '&$focusVisible $thumb': {
        color: '#52d869',
        border: '6px solid #fff',
      },
    },
    thumb: {
      width: 6.97,
      height: 7,
    },
    track: {
      borderRadius: 13 / 2,
      border: `1px solid ${theme.palette.grey[400]}`,
      backgroundColor: theme.palette.grey[50],
      opacity: 1,
      transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
  }),
)(({ classes, ...props }: Props) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

export default IOSSwitch;
