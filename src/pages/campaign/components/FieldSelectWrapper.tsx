import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

interface FieldSelectWrapperProps {
    variant: 'standard' | 'filled' | 'outlined';
    className: string;
    data: { key: string; value: string }[];
    valueDefault: { key: string; value: string } | undefined;
    onChange: (selectedOption: { key: string; value: string }) => void;
}

export const FieldSelectWrapper: React.FC<FieldSelectWrapperProps> = ({
    variant,
    className,
    data,
    valueDefault,
    onChange,
}) => {
    return (
        <Autocomplete
            options={data}
            getOptionSelected={(option, value) => option.key === value.key}
            getOptionLabel={(option) => option.value}
            value={valueDefault || null}
            onChange={(event, newValue) => {
                if (newValue) {
                    onChange(newValue);
                }
            }}
            renderInput={(params) => (
                <TextField 
                    {...params} 
                    variant={variant} 
                    className={className} 
                />
            )}
        />
    );
};