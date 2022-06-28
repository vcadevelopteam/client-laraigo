import { createStyles, Switch, SwitchProps, Theme, withStyles } from "@material-ui/core";

interface IOSSwitchProps extends SwitchProps {
    classes: any;
}

const defaultWidth = 30;
const defaultHeight = 20;


const IOSSwitchPurple = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: defaultWidth,
      height: defaultHeight,
      padding: 1,
      // margin: theme.spacing(1),
    },
    switchBase: {
      padding: 4,
      '&$checked': {
        transform: 'translateX(10px)',
        color: theme.palette.common.white,
        '& + $track': {
          backgroundColor: '#762AA9',
          opacity: 1,
          border: 'none',
        },
      },
      '&$focusVisible $thumb': {
        color: '#762AA9',
        border: '6px solid #fff',
      },
    },
    thumb: {
      width: 12,
      height: 12,
    },
    track: {
      borderRadius: defaultHeight / 2,
      border: `1px solid ${theme.palette.grey[400]}`,
      backgroundColor: theme.palette.grey[50],
      opacity: 1,
      transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
  }),
)(({ classes, ...props }: IOSSwitchProps) => {
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

export default IOSSwitchPurple;
