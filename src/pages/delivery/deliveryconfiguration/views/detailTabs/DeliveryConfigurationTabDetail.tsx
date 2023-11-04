/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'; // we need this to make JSX compile
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { FieldErrors, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { FieldEdit, FieldCheckbox, TitleDetail, TemplateIcons } from 'components';
import TableZyx from "components/fields/table-simple";

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    containerDescription: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: '10px',
    },
    containerDescriptionTitle: {
        fontSize: 24
    },
    containerDescriptionSubtitle: {
        fontSize: 14,
        fontWeight: 500
    },
    iconResponse: {
        cursor: 'pointer',
        poisition: 'relative',
        color: '#2E2C34',
        '&:hover': {
            // color: theme.palette.primary.main,
            backgroundColor: '#EBEAED',
            borderRadius: 4
        }
    },
    iconSendDisabled: {
        backgroundColor: "#EBEAED",
        cursor: 'not-allowed',
    },
    button: {
        marginRight: theme.spacing(2),
    },
}));

interface InventoryTabDetailProps {
    row: Dictionary | null;
    setValue: UseFormSetValue<any>;
    getValues: UseFormGetValues<any>;
    errors: FieldErrors<any>;
}

const DeliveryConfigurationTabDetail: React.FC<InventoryTabDetailProps> = ({
    row,
    setValue,
    getValues,
    errors,
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const columns = React.useMemo(
        () => [
          {
            accessor: 'productalternativeid',
            NoFilter: true,
            isComponent: true,
            minWidth: 60,
            width: '1%',
            Cell: (props: any) => {
                const row = props.cell.row.original;
                return (
                    <TemplateIcons
                        //deleteFunction={() => handleDelete(row)}
                        //editFunction={() => handleEdit(row)}
                    />
                )
            }
          },
          {
            Header: t(langKeys.organization),
            accessor: "productdescription",
            width: "auto",
          },
          {
            Header: t(langKeys.vehicletype),
            accessor: "productdescriptionlarge",
            width: "auto",
          },
          {
            Header: t(langKeys.brand),
            accessor: "familydescription",
            width: "auto",
          },
          {
            Header: t(langKeys.model),
            accessor: "subfamilydescription",
            width: "auto",
          },
          {
            Header: t(langKeys.platenum),
            accessor: "dateofphysicalcount",
            width: "auto",
          },
          {
            Header: t(langKeys.capacity),
            accessor: "isconciliated",
            width: "auto",
          },
          {
            Header: t(langKeys.averagespeed),
            accessor: "shelflifeindays",
            width: "auto",
          },
          {
            Header: t(langKeys.insuredamount),
            accessor: "dueDate",
            width: "auto",
          },
          {
            Header: t(langKeys.carriername),
            accessor: "carriername",
            width: "auto",
          },
          {
            Header: t(langKeys.licensenum),
            accessor: "licensenum",
            width: "auto",
          },
        ],
        []
    );

    return (
        <div className={classes.containerDetail}>
            <div className="row-zyx">
                <div className='col-6'>
                    <div className='row-zyx'>
                        <FieldEdit
                            label={t(langKeys.product)}
                            valueDefault={getValues('name')}
                            className="col-6"
                            error={errors?.name?.message}
                            onChange={(value) => setValue('name', value)}
                        />
                        <FieldEdit
                            label={t(langKeys.description)}
                            valueDefault={getValues('description')}
                            className="col-6"
                            error={errors?.description?.message}
                            onChange={(value) => setValue('description', value)}
                        />
                    </div>
                    <div className='row-zyx'>
                        <FieldEdit
                            label={t(langKeys.product)}
                            valueDefault={getValues('name')}
                            className="col-6"
                            error={errors?.name?.message}
                            onChange={(value) => setValue('name', value)}
                        />
                        <FieldEdit
                            label={t(langKeys.description)}
                            valueDefault={getValues('description')}
                            className="col-6"
                            error={errors?.description?.message}
                            onChange={(value) => setValue('description', value)}
                        />
                    </div>
                    <div className='row-zyx'>
                        <FieldCheckbox
                            label={`${t(langKeys.product)} ${t(langKeys.default)}`}
                            className="col-6"
                            valueDefault={getValues("ispredeterminate")}
                            onChange={(value) => setValue("ispredeterminate", value)}
                        />
                    </div>
                    <div className='row-zyx'>
                        <FieldEdit
                            label={t(langKeys.product)}
                            valueDefault={getValues('address')}
                            className="col-6"
                            error={errors?.address?.message}
                            onChange={(value) => setValue('address', value)}
                        />
                    </div>
                </div>
                <div className='row-zyx col-6'>
                    <div className='col-6'>
                        <div className='row-zyx'>
                            <FieldEdit
                                label={t(langKeys.product)}
                                valueDefault={getValues('address')}
                                className="col-6"
                                error={errors?.address?.message}
                                onChange={(value) => setValue('address', value)}
                            />  
                        </div>
                        <div className='row-zyx'>
                            <FieldEdit
                                label={t(langKeys.product)}
                                valueDefault={getValues('latitude')}
                                className="col-6"
                                error={errors?.latitude?.message}
                                onChange={(value) => setValue('latitude', value)}
                            />
                        </div>
                        <div className='row-zyx'>
                            <FieldEdit
                                label={t(langKeys.product)}
                                valueDefault={getValues('longitude')}
                                className="col-6"
                                error={errors?.longitude?.message}
                                onChange={(value) => setValue('longitude', value)}
                            /> 
                        </div>
                        <div className='row-zyx'>
                            <FieldEdit
                                label={t(langKeys.status)}
                                valueDefault={getValues('longitude')}
                                className="col-6"
                                error={errors?.longitude?.message}
                                onChange={(value) => setValue('longitude', value)}
                            /> 
                        </div>  
                    </div>
                    <div className='row-zyx col-6'>
                        <div className="col-12">
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{t(langKeys.files)}</Box>
                        </div>
                        <div className='col-12'>
                            <FieldEdit
                                label={t(langKeys.product)}
                                valueDefault={getValues('longitude')}
                                className="col-6"
                                error={errors?.longitude?.message}
                                onChange={(value) => setValue('longitude', value)}
                            /> 
                        </div>
                    </div>
                </div>
            </div>
            <div className='row-zyx'>
                <div className='row-zyx'>
                    <TitleDetail
                        title={t(langKeys.associatedvehicles)}
                    />
                </div>
                <div className='row-zyx'>
                    <TableZyx
                        columns={columns}
                        data={[]}
                        download={false}
                        filterGeneral={false}
                        register={true}
                    />
                </div>
            </div>
        </div>
    )
}

export default DeliveryConfigurationTabDetail;