import { FC } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import { SearchIcon } from 'icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
        root: {
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: 400,
            height: 42,
            borderColor: '#8F92A1',
            backgroundColor: '#F9F9FA',
        },
        input: {
            marginLeft: theme.spacing(1),
            flex: 1,
        },
        inputPlaceholder: {
            '&::placeholder': {
                fontSize: 14,
                fontWeight: 500,
            },
        },
        iconButton: {
            padding: 10,
        },
        divider: {
            height: 28,
            margin: 4,
        },
    }),
);

const SearchField: FC = () => {
  const classes = useStyles();

  return (
    <Paper component="div" className={classes.root} elevation={0}>
        <IconButton type="button" className={classes.iconButton} aria-label="search">
            <SearchIcon />
        </IconButton>
        <InputBase
            className={classes.input}
            placeholder="Search"
            inputProps={{ className: classes.inputPlaceholder }}
        />
    </Paper>
  );
};

export default SearchField;
