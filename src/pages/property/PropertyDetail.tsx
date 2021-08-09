import { Button, makeStyles } from "@material-ui/core";
import { getPropertySel, insProperty } from "common/helpers";
import { FieldEdit, FieldSelect, FieldView, TemplateBreadcrumbs, TitleDetail } from "components";
import { useSelector } from "hooks";
import { langKeys } from "lang/keys";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import SaveIcon from '@material-ui/icons/Save';
import { useForm } from "react-hook-form";
import { execute, getCollection } from "store/main/actions";
import { useParams } from "react-router-dom";

interface ParamProps {
    id: string;
}

const arrayBread = [
    { id: "view-1", name: "Properties" },
    { id: "view-2", name: "Property detail" }
];

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        maxWidth: '80%',
        padding: theme.spacing(2),
        background: '#fff',
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
}));

const PropertyDetail: FC<any> = () => {
    const classes = useStyles();
    const { id } = useParams<ParamProps>();
    const property = useSelector(state => state.main.mainData);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    useEffect(() => {
        dispatch(getCollection(getPropertySel(Number(id))));
    }, []);

    useEffect(() => {
        if (property.loading) return;
        if (property.error) {
            dispatch(showSnackbar({ show: true, success: false, message: property.message }));
        } else {
            console.log(property);
        }
    }, [property]);

    if (property.loading) {
        return <h1>LOADING</h1>;
    }
    else if (property.error) {
        return <h1>ERROR</h1>;
    }

    const value = property.data[0];
    return (
        <div>
            {/* <TemplateBreadcrumbs
                breadcrumbs={arrayBread}
                handleClick={setViewSelected}
            /> */}
            <TitleDetail title="Detalle" />
            <div className={classes.containerDetail}>
                <div className="row-zyx">
                    <FieldView
                        label={t(langKeys.corporation)}
                        value={value?.corpdesc}
                        className="col-6"
                    />
                    <FieldView
                        label={t(langKeys.organization)}
                        value={value?.orgdesc}
                        className="col-6"
                    />
                </div>
                <div className="row-zyx">
                    <FieldView
                        label={t(langKeys.channel)}
                        value={value?.communicationchanneldesc}
                        className="col-6"
                    />
                    <FieldView
                        label={t(langKeys.name)}
                        value={value?.propertyname}
                        className="col-6"
                    />
                </div>
                <div className="row-zyx">
                    <FieldView
                        label={t(langKeys.value)}
                        value={value?.propertyvalue}
                        className="col-6"
                    />
                    <FieldView
                        label={t(langKeys.status)}
                        value={value?.status}
                        className="col-6"
                    />
                </div>
                <div className="row-zyx">
                    <FieldView
                        label={t(langKeys.description)}
                        value={value?.description}
                        className="col-6"
                    />
                </div>
            </div>
        </div>
    );
};

export default PropertyDetail;