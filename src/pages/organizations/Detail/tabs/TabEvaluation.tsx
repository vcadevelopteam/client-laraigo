/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'; // we need this to make JSX compile
import { FieldEdit, TemplateSwitch, FieldSelect } from 'components';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Box, Grid, IconButton, InputAdornment } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

interface TabEvaluationProps {
    getValues: any;
    setValue: any;
    errors: any;
    ownCredentials: any;
    setOwnCredentials: any;
    apiconsumption: any;
    setApiConsumption: any;
    row: any;
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
    containerDetailMainBox:{
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
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
const TabEvaluation: React.FC<TabEvaluationProps> = ({getValues, errors, setValue, apiconsumption, setApiConsumption, row, ownCredentials, setOwnCredentials}) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState({
        infocorp: false,
        sentinel: false,
        reniec: false,
        sunarp: false,
    });
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
                                    onChange={(value) => {}}
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
                                    onChange={(value) => {}}
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
                                    onChange={(value) => {}}
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
                                    onChange={(value) => {}}
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
        <Grid container direction="row" style={{ width: '100%' }}>
            
            {apiconsumption.infocorp && <Grid item xs={12} sm={12} md={4} lg={4} xl={4} style={{padding: '4px'}}>
                    <Grid container direction="column" className={classes.containerDetailMainBox}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                            <label className={classes.text}>
                                {t(langKeys.entity)}
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                            <div style={{width: "100%", textAlign: "center", borderBottom: "black 1px solid"}}>INFOCORP</div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{paddingTop: "15px"}}>
                            <label className={classes.text}>
                                {t(langKeys.use_own_credentials)}
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{paddingBottom: "15px"}}>
                            <TemplateSwitch
                                label={""}
                                className="col-6"
                                valueDefault={ownCredentials.infocorp}
                                onChange={(value) => {setOwnCredentials({...ownCredentials,infocorp: value})}}
                            />
                        </Grid>
                        {ownCredentials.infocorp && <>
                            <Grid item  xs={12} sm={12} md={12} lg={12} xl={12} style={{paddingBottom: "15px"}}>
                                <FieldEdit
                                    label={`${t(langKeys.username)}`}
                                    valueDefault={getValues('evaluationData.infocorp.username')}
                                    onChange={(value) => { setValue('evaluationData.infocorp.username',value)}}
                                    error={errors?.evaluationData?.infocorp?.username?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{paddingBottom: "15px"}}>
                                <FieldEdit
                                    label={t(langKeys.password)}
                                    className="col-6"
                                    valueDefault={getValues('evaluationData.infocorp.password')}
                                    type={showPassword.infocorp ? 'text' : 'password'}
                                    onChange={(value) => { setValue('evaluationData.infocorp.password',value)}}
                                    error={errors?.evaluationData?.infocorp?.password?.message}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword({...showPassword, infocorp: !showPassword.infocorp})}
                                                    edge="end"
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item  xs={12} sm={12} md={12} lg={12} xl={12} style={{paddingBottom: "15px"}}>
                                <FieldEdit
                                    label="URL API"
                                    valueDefault={getValues('evaluationData.infocorp.urlapi')}
                                    onChange={(value) => { setValue('evaluationData.infocorp.urlapi',value)}}
                                    error={errors?.evaluationData?.infocorp?.urlapi?.message}
                                />
                            </Grid>
                        </>}
                    </Grid>
                </Grid>}
            {apiconsumption.sentinel && <Grid item xs={12} sm={12} md={4} lg={4} xl={4} style={{padding: '4px'}}>
                    <Grid container direction="column"  className={classes.containerDetailMainBox}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                            <label className={classes.text}>
                                {t(langKeys.entity)}
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                            <div style={{width: "100%", textAlign: "center", borderBottom: "black 1px solid"}}>SENTINEL</div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{paddingTop: "15px"}}>
                            <label className={classes.text}>
                                {t(langKeys.use_own_credentials)}
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{paddingBottom: "15px"}}>
                            <TemplateSwitch
                                label={""}
                                className="col-6"
                                valueDefault={ownCredentials.sentinel}
                                onChange={(value) => {setOwnCredentials({...ownCredentials,sentinel: value})}}
                            />
                        </Grid>
                        {ownCredentials.sentinel && <>
                            <Grid item  xs={12} sm={12} md={12} lg={12} xl={12} style={{paddingBottom: "15px"}}>
                                <FieldEdit
                                    label={`${t(langKeys.username)}`}
                                    valueDefault={getValues('evaluationData.sentinel.username')}
                                    onChange={(value) => { setValue('evaluationData.sentinel.username',value)}}
                                    error={errors?.evaluationData?.sentinel?.username?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{paddingBottom: "15px"}}>
                                <FieldEdit
                                    label={t(langKeys.password)}
                                    className="col-6"
                                    valueDefault={getValues('evaluationData.sentinel.password')}
                                    type={showPassword.sentinel ? 'text' : 'password'}
                                    onChange={(value) => { setValue('evaluationData.sentinel.password',value)}}
                                    error={errors?.evaluationData?.sentinel?.password?.message}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword({...showPassword, sentinel: !showPassword.sentinel})}
                                                    edge="end"
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item  xs={12} sm={12} md={12} lg={12} xl={12} style={{paddingBottom: "15px"}}>
                                <FieldEdit
                                    label="URL API 1"
                                    valueDefault={getValues('evaluationData.sentinel.urlapi1')}
                                    onChange={(value) => { setValue('evaluationData.sentinel.urlapi1',value)}}
                                    error={errors?.evaluationData?.sentinel?.urlapi1?.message}
                                />
                            </Grid>
                            <Grid item  xs={12} sm={12} md={12} lg={12} xl={12} style={{paddingBottom: "15px"}}>
                                <FieldEdit
                                    label="URL API 2"
                                    valueDefault={getValues('evaluationData.sentinel.urlapi2')}
                                    onChange={(value) => { setValue('evaluationData.sentinel.urlapi2',value)}}
                                    error={errors?.evaluationData?.sentinel?.urlapi2?.message}
                                />
                            </Grid>
                            <Grid item  xs={12} sm={12} md={12} lg={12} xl={12} style={{paddingBottom: "15px"}}>
                                <FieldEdit
                                    label={t(langKeys.publickey)}
                                    valueDefault={getValues('evaluationData.sentinel.publickey')}
                                    onChange={(value) => { setValue('evaluationData.sentinel.publickey',value)}}
                                    error={errors?.evaluationData?.sentinel?.publickey?.message}
                                />
                            </Grid>
                        </>}
                    </Grid>
                </Grid>}
            {apiconsumption.reniec && <Grid item xs={12} sm={12} md={4} lg={4} xl={4} style={{padding: '4px'}}>
                    <Grid container direction="column" className={classes.containerDetailMainBox}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                            <label className={classes.text}>
                                {t(langKeys.entity)}
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                            <div style={{width: "100%", textAlign: "center", borderBottom: "black 1px solid"}}>RENIEC</div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{paddingTop: "15px"}}>
                            <label className={classes.text}>
                                {t(langKeys.use_own_credentials)}
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{paddingBottom: "15px"}}>
                            <TemplateSwitch
                                label={""}
                                className="col-6"
                                valueDefault={ownCredentials.reniec}
                                onChange={(value) => {setOwnCredentials({...ownCredentials,reniec: value})}}
                            />
                        </Grid>                    
                        {ownCredentials.reniec && <>
                            <Grid item  xs={12} sm={12} md={12} lg={12} xl={12} style={{paddingBottom: "15px"}}>
                                <FieldEdit
                                    label={`${t(langKeys.username)}`}
                                    valueDefault={getValues('evaluationData.reniec.username')}
                                    onChange={(value) => { setValue('evaluationData.reniec.username',value)}}
                                    error={errors?.evaluationData?.reniec?.username?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{paddingBottom: "15px"}}>
                                <FieldEdit
                                    label={t(langKeys.password)}
                                    className="col-6"
                                    valueDefault={getValues('evaluationData.reniec.password')}
                                    type={showPassword.reniec ? 'text' : 'password'}
                                    onChange={(value) => { setValue('evaluationData.reniec.password',value)}}
                                    error={errors?.evaluationData?.reniec?.password?.message}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword({...showPassword, reniec: !showPassword.reniec})}
                                                    edge="end"
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item  xs={12} sm={12} md={12} lg={12} xl={12} style={{paddingBottom: "15px"}}>
                                <FieldEdit
                                    label="URL API"
                                    valueDefault={getValues('evaluationData.reniec.urlapi')}
                                    onChange={(value) => { setValue('evaluationData.reniec.urlapi',value)}}
                                    error={errors?.evaluationData?.reniec?.urlapi?.message}
                                />
                            </Grid>
                        </>}
                    </Grid>
                </Grid>}
            {apiconsumption.sunarp && <Grid item xs={12} sm={12} md={4} lg={4} xl={4} style={{padding: '4px'}}>
                    <Grid container direction="column"  className={classes.containerDetailMainBox}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                            <label className={classes.text}>
                                {t(langKeys.entity)}
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                            <div style={{width: "100%", textAlign: "center", borderBottom: "black 1px solid"}}>SUNARP</div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{paddingTop: "15px"}}>
                            <label className={classes.text}>
                                {t(langKeys.use_own_credentials)}
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{paddingBottom: "15px"}}>
                            <TemplateSwitch
                                label={""}
                                className="col-6"
                                valueDefault={ownCredentials.sunarp}
                                onChange={(value) => {setOwnCredentials({...ownCredentials,sunarp: value})}}
                            />
                        </Grid>
                        {ownCredentials.sunarp && <>
                            <Grid item  xs={12} sm={12} md={12} lg={12} xl={12} style={{paddingBottom: "15px"}}>
                                <FieldEdit
                                    label={`${t(langKeys.username)}`}
                                    valueDefault={getValues('evaluationData.sunarp.username')}
                                    onChange={(value) => { setValue('evaluationData.sunarp.username',value)}}
                                    error={errors?.evaluationData?.sunarp?.username?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{paddingBottom: "15px"}}>
                                <FieldEdit
                                    label={t(langKeys.password)}
                                    className="col-6"
                                    valueDefault={getValues('evaluationData.sunarp.password')}
                                    type={showPassword.sunarp ? 'text' : 'password'}
                                    onChange={(value) => { setValue('evaluationData.sunarp.password',value)}}
                                    error={errors?.evaluationData?.sunarp?.password?.message}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword({...showPassword, sunarp: !showPassword.sunarp})}
                                                    edge="end"
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item  xs={12} sm={12} md={12} lg={12} xl={12} style={{paddingBottom: "15px"}}>
                                <FieldEdit
                                    label="URL API"
                                    valueDefault={getValues('evaluationData.sunarp.urlapi')}
                                    onChange={(value) => { setValue('evaluationData.sunarp.urlapi',value)}}
                                    error={errors?.evaluationData?.sunarp?.urlapi?.message}
                                />
                            </Grid>
                        </>}
                    </Grid>
                </Grid>}
        </Grid>
    </div>)
}


export default TabEvaluation;