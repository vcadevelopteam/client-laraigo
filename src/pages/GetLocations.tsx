/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, Component } from 'react'; // we need this to make JSX compile
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import Map from './Map.js'
import { FieldEdit } from 'components/fields/templates';
import { Button, TextField } from '@material-ui/core';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
interface DetailInputValidationProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    fetchData: () => void
}

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    searchLocationContainer: {
        height: '50vh', width: '100%'
    },
    searchLocationTitle:{
        color: "white",
        fontSize: "12px",
        textAlign: "center",
        paddingLeft: "10px",
        paddingRight: "10px",
        backgroundColor: "rgb(235, 0, 43)",
        paddingTop: "5px",
        paddingBottom: "5px",
        ['@media (min-width:600px)']: { // eslint-disable-line no-useless-computed-key
            fontSize: "18px",
            paddingTop: "8px",
            paddingBottom: "8px",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
        }
    },
    containersearch:{
        marginTop: "10px",
        maxWidth: "80%",
        marginLeft: "auto",
        marginRight: "auto",
    },
    textlabel:{
        marginBottom: "10px",
        fontWeight: "bold",
        color: "rgb(235, 0, 43)",
    },
    formControl:{
        display: "block",
        width: "100%",
        height: "calc(1.5em + 0.75rem + 2px)",
        padding: "0.375rem 0.75rem",
        fontSize: "1rem",
        lineHeight: "1.5",
        color: "#495057",
        backgroundColor: "#fff",
        backgroundClip: "padding-box",
        border: "1px solid #ced4da",
        borderRadius: "0.25rem",
    },
    formControl1:{
        display: "block",
        width: "100%",
        height: "calc(1.5em + 0.75rem + 2px)",
        padding: "0.375rem 0.75rem",
        fontSize: "1rem",
        lineHeight: "1.5",
        color: "#495057",
        backgroundColor: "#fff",
        backgroundClip: "padding-box",
        border: "1px solid #ced4da",
        borderRadius: "0.25rem",
        marginBottom: "0.5rem!important",
        ['@media (min-width:760px)']: { // eslint-disable-line no-useless-computed-key
            marginBottom: "0!important"
        }
    },
    colxs12colmd6:{
        position: "relative",
        width: "100%",
        paddingRight: "15px",
        paddingLeft: "15px",
        ['@media (min-width:760px)']: { // eslint-disable-line no-useless-computed-key
            flex: "0 0 50%",
            maxWidth: "50%",
        }
    }
}));

const AnyReactComponent = ({ text }:any) => <div>{text}</div>;

export const GetLocations: FC = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const propsMap = {
        center: {
            lat: -12.164043457451433,
            lng: -76.98795506382666
        },
        zoom: 11
    };  
    return (
        <>
            <Map></Map>
        </>
    )
}

export default GetLocations;