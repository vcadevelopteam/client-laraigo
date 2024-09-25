import React, { FC, useEffect, useRef, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase, { InputBaseProps } from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import { SearchIcon } from 'icons';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';

interface Props extends InputBaseProps { 
    colorPlaceHolder: string,
    handleChangeOther?: (params: string) => void,
    handleSubmitOther?: (params: string) => void,
    cleanState?:boolean;
    setCleanState?:(params: string) => void,
    lazy?: boolean;
    timelapse?: number; // available when lazy prop is true
    defaultGlobalFilter?: string;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            height: 40,
            border: '1px solid #EBEAED',
            backgroundColor: (props: any) => props.colorPlaceHolder || '#F9F9FA',
        },
        input: {
            marginLeft: theme.spacing(.5),
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
            padding: 4,
        },
        divider: {
            height: 28,
            margin: 4,
        },
    }),
);

const SearchField: FC<Props> = ({ colorPlaceHolder, handleChangeOther, handleSubmitOther, timelapse = 1000, lazy = false,cleanState,setCleanState, defaultGlobalFilter, ...props }: Props) => {
    const { t } = useTranslation();
    const classes = useStyles({ colorPlaceHolder });
    const [value, setvalue] = useState('');

    const timeOut = useRef<NodeJS.Timeout | null>(null);

    const handleChange = (event: any) => {
        // setvalue(event.target.value);
        handleChangeOther && handleChangeOther(event.target.value)
    }
    
    const handleSubmit = (event: any) => {
        setvalue(event.target.value);
        handleSubmitOther && handleSubmitOther(event.target.value)
    };

    const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setvalue(event.target.value);
        if (!lazy) {
            handleChange(event);
            return;
        }
        if (timeOut.current) clearTimeout(timeOut.current);

        timeOut.current = setTimeout(() => {
            handleChange(event);
            if (timeOut.current) {
                clearTimeout(timeOut.current);
                timeOut.current = null;
            }
        }, timelapse);
    };
    useEffect(() => {
        if(cleanState){
            setvalue('')
            setCleanState && setCleanState(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cleanState]);

    useEffect(() => {
        setvalue(defaultGlobalFilter||"")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultGlobalFilter]);

    return (
        <Paper component="div" className={classes.root} elevation={0} onSubmit={handleSubmit}>
            <IconButton type="button" className={classes.iconButton} aria-label="search" disabled>
                <SearchIcon />
            </IconButton>
            <InputBase
                className={classes.input}
                value={value}
                onChange={onChange}
                placeholder={t(langKeys.search)}
                inputProps={{ className: classes.inputPlaceholder }}
                {...props}
            />
        </Paper>
    );
};

export default SearchField;
