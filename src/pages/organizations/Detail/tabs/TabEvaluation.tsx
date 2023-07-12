/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'; // we need this to make JSX compile
import { FieldEdit, TemplateSwitch, FieldSelect } from 'components';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Box, Grid } from '@material-ui/core';

interface TabEvaluationProps {
    getValues: any;
    setValue: any;
    errors: any;
    apiconsumption: any;
    setApiConsumption: any;
}

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    containerDetailMainEvaluation:{
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
        display: 'flex'
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    text: {
        fontWeight: 500,
        fontSize: 16,
        color: '#381052',
    },
    icon: {
        '&:hover': {
            cursor: 'pointer',
            color: theme.palette.primary.main,
        }
    },
}));
const TabEvaluation: React.FC<TabEvaluationProps> = ({getValues, errors, setValue, apiconsumption, setApiConsumption}) => {
    const classes = useStyles();
    const { t } = useTranslation();
    return (
        <div >
        <div className={classes.containerDetailMainEvaluation}>
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3} style={{ minWidth: '300px' }}>
                <Box m={1}>
                    <Grid container direction="column">
                        <Grid item  xs={12} sm={12} md={12} lg={12} xl={12}>
                            <label className={classes.text}>
                                {t(langKeys.apiconsumptionevaluation)} (Infocorp)
                            </label>
                        </Grid>
                        <Grid item  xs={12} sm={12} md={12} lg={12} xl={12}>
                            <TemplateSwitch
                                label={""}
                                className="col-6"
                                valueDefault={apiconsumption.infocorp}
                                onChange={(value) => {setApiConsumption({...apiconsumption,infocorp: value})}}
                            />
                        </Grid>
                        {apiconsumption.infocorp && <Grid container direction="row">
                            <Grid item  xs={12} sm={12} md={9} lg={9} xl={9}>
                                <FieldSelect
                                    label={t(langKeys.lapsetimetoevaluate)}
                                    valueDefault={getValues('evaluationData.infocorp.evaluationtime')}
                                    onChange={(value) => {debugger}}
                                    triggerOnChangeOnFirst={true}
                                    error={errors?.evaluationData?.infocorp?.evaluationtime?.message}
                                    data={[{description: 'DÍA'}]}
                                    disabled={true}
                                    optionDesc="description"
                                    optionValue="description"
                                />
                            </Grid>
                            <Grid item  xs={12} sm={12} md={3} lg={3} xl={3}>
                                <FieldEdit
                                    label={`${t(langKeys.value)}`}
                                    valueDefault={getValues('evaluationData.infocorp.timevalue')}
                                    onChange={(value) => { setValue('evaluationData.infocorp.timevalue',value)}}
                                    error={errors?.evaluationData?.infocorp?.timevalue?.message}
                                    type="number"
                                    inputProps={{ step: "any" }}
                                />
                            </Grid>
                        </Grid>}
                    </Grid>
                </Box>
            </Grid>
            <Grid item  xs={12} sm={12} md={3} lg={3} xl={3} style={{ minWidth: '300px' }}>
                <Box m={1}>
                    <Grid container direction="column">
                        <Grid item  xs={12} sm={12} md={12} lg={12} xl={12}>
                            <label className={classes.text}>
                                {t(langKeys.apiconsumptionevaluation)} (Sentinel)
                            </label>
                        </Grid>
                        <Grid item  xs={12} sm={12} md={12} lg={12} xl={12}>
                            <TemplateSwitch
                                label={""}
                                className="col-6"
                                valueDefault={apiconsumption.sentinel}
                                onChange={(value) => {setApiConsumption({...apiconsumption,sentinel: value})}}
                            />
                        </Grid>
                        {apiconsumption.sentinel && <Grid container direction="row">
                            <Grid item  xs={12} sm={12} md={9} lg={9} xl={9}>
                                <FieldSelect
                                    label={t(langKeys.lapsetimetoevaluate)}
                                    valueDefault={getValues('evaluationData.sentinel.evaluationtime')}
                                    onChange={(value) => {debugger}}
                                    triggerOnChangeOnFirst={true}
                                    error={errors?.evaluationData?.sentinel?.evaluationtime?.message}
                                    data={[{description: 'DÍA'}]}
                                    disabled={true}
                                    optionDesc="description"
                                    optionValue="description"
                                />
                            </Grid>
                            <Grid item  xs={12} sm={12} md={3} lg={3} xl={3}>
                                <FieldEdit
                                    label={`${t(langKeys.value)}`}
                                    valueDefault={getValues('evaluationData.sentinel.timevalue')}
                                    onChange={(value) => { setValue('evaluationData.sentinel.timevalue',value)}}
                                    error={errors?.evaluationData?.sentinel?.timevalue?.message}
                                    type="number"
                                    inputProps={{ step: "any" }}
                                />
                            </Grid>
                        </Grid>}
                    </Grid>
                </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3} style={{ minWidth: '300px' }}>
                <Box m={1}>
                    <Grid container direction="column">
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <label className={classes.text}>
                                {t(langKeys.apiconsumptionevaluation)} (RENIEC)
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <TemplateSwitch
                                label={""}
                                className="col-6"
                                valueDefault={apiconsumption.reniec}
                                onChange={(value) => {setApiConsumption({...apiconsumption,reniec: value})}}
                            />
                        </Grid>
                        {apiconsumption.reniec && <Grid container direction="row">
                            <Grid item  xs={12} sm={12} md={9} lg={9} xl={9}>
                                <FieldSelect
                                    label={t(langKeys.lapsetimetoevaluate)}
                                    valueDefault={getValues('evaluationData.reniec.evaluationtime')}
                                    onChange={(value) => {debugger}}
                                    triggerOnChangeOnFirst={true}
                                    error={errors?.evaluationData?.reniec?.evaluationtime?.message}
                                    data={[{description: 'DÍA'}]}
                                    disabled={true}
                                    optionDesc="description"
                                    optionValue="description"
                                />
                            </Grid>
                            <Grid item  xs={12} sm={12} md={3} lg={3} xl={3}>
                                <FieldEdit
                                    label={`${t(langKeys.value)}`}
                                    valueDefault={getValues('evaluationData.reniec.timevalue')}
                                    onChange={(value) => { setValue('evaluationData.reniec.timevalue',value)}}
                                    error={errors?.evaluationData?.reniec?.timevalue?.message}
                                    type="number"
                                    inputProps={{ step: "any" }}
                                />
                            </Grid>
                        </Grid>}
                    </Grid>
                </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3} style={{ minWidth: '300px' }}>
                <Box m={1}>
                    <Grid container direction="column">
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <label className={classes.text}>
                                {t(langKeys.apiconsumptionevaluation)} (SUNARP)
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <TemplateSwitch
                                label={""}
                                className="col-6"
                                valueDefault={apiconsumption.sunarp}
                                onChange={(value) => {setApiConsumption({...apiconsumption,sunarp: value})}}
                            />
                        </Grid>
                        {apiconsumption.sunarp && <Grid container direction="row">
                            <Grid item  xs={12} sm={12} md={9} lg={9} xl={9}>
                                <FieldSelect
                                    label={t(langKeys.lapsetimetoevaluate)}
                                    valueDefault={getValues('evaluationData.sunarp.evaluationtime')}
                                    onChange={(value) => {debugger}}
                                    triggerOnChangeOnFirst={true}
                                    error={errors?.evaluationData?.sunarp?.evaluationtime?.message}
                                    data={[{description: 'DÍA'}]}
                                    disabled={true}
                                    optionDesc="description"
                                    optionValue="description"
                                />
                            </Grid>
                            <Grid item  xs={12} sm={12} md={3} lg={3} xl={3}>
                                <FieldEdit
                                    label={`${t(langKeys.value)}`}
                                    valueDefault={getValues('evaluationData.sunarp.timevalue')}
                                    onChange={(value) => { setValue('evaluationData.sunarp.timevalue',value)}}
                                    error={errors?.evaluationData?.sunarp?.timevalue?.message}
                                    type="number"
                                    inputProps={{ step: "any" }}
                                />
                            </Grid>
                        </Grid>}
                    </Grid>
                </Box>
            </Grid>
        </div>
    </div>)
}


export default TabEvaluation;