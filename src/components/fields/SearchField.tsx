import React, { FC, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import { SearchIcon } from 'icons';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';

type Props = { 
    colorPlaceHolder: string,
    handleChangeOther?: (params: any) => void,
    handleSubmitOther?: (params: any) => void
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            height: 42,
            border: '1px solid #EBEAED',
            backgroundColor: (props: any) => props.colorPlaceHolder || '#F9F9FA',
        },
        input: {
            marginLeft: theme.spacing(1),
            flex: 1,
        },
        inputPlaceholder: {
            '&::placeholder': {
                fontSize: 14,
                fontWeight: 500,
                color: '#84818A',
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

const SearchField: FC<Props> = ({ colorPlaceHolder, handleChangeOther, handleSubmitOther }: Props) => {
    const { t } = useTranslation();
    const classes = useStyles({ colorPlaceHolder });
    const [value, setvalue] = useState('');

    // const handleChange = React.useCallback((event: any) => {
    //     setvalue(event.target.value);
    //     handleChangeOther && handleChangeOther(event.target.value)
    // }, [value, handleChangeOther]);

    const handleChange = (event: any) => {
        setvalue(event.target.value);
        handleChangeOther && handleChangeOther(event.target.value)
    }
    
    const handleSubmit = (event: any) => {
        setvalue(event.target.value);
        handleSubmitOther && handleSubmitOther(event.target.value)
    };

    return (
        <Paper component="div" className={classes.root} elevation={0} onSubmit={handleSubmit}>
            <IconButton type="button" className={classes.iconButton} aria-label="search">
                <SearchIcon />
            </IconButton>
            <InputBase
                className={classes.input}
                value={value}
                onChange={handleChange}
                placeholder={t(langKeys.search)}
                inputProps={{ className: classes.inputPlaceholder }}
            />
        </Paper>
    );
};

export default SearchField;
