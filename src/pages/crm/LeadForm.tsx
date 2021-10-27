import React, { FC } from 'react';
import { Link, makeStyles, Breadcrumbs, Grid } from '@material-ui/core';
import { FieldEdit, Title } from 'components';
import { langKeys } from 'lang/keys';
import paths from 'common/constants/paths';
import { Trans } from 'react-i18next';
import { useHistory } from 'react-router';

const useLeadFormStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        color: theme.palette.text.primary,
    },
    subtitle: {
        fontSize: 22,
        fontWeight: 500,
    },
    currency: {
        '&::before': {
            content: '"S/ "',
        },
    },
    percent: {
        '&::after': {
            content: '" %"',
        },
    },
    at: {
        color: 'grey',
        margin: '0 0.38em',
    },
    field: {
        margin: theme.spacing(1),
    },
}));

export const LeadForm: FC = () => {
    const classes = useLeadFormStyles();
    const history = useHistory();

    return (
        <div className={classes.root}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link
                    underline="hover"
                    color="inherit"
                    href="/"
                    onClick={(e) => {
                        e.preventDefault();
                        history.push(paths.CRM);
                    }}
                >
                    CRM
                </Link>
                <Link
                    underline="hover"
                    color="textPrimary"
                    href={history.location.pathname}
                    onClick={(e) => e.preventDefault()}
                >
                    <Trans i18nKey={langKeys.opportunity} />
                </Link>
            </Breadcrumbs>
            <Title>
                Modern Open Space
            </Title>
            <div className={classes.subtitle}>
                <span className={classes.currency}>4,500.00</span>
                <span className={classes.at}>at</span>
                <span className={classes.percent}>78.72</span>
            </div>
            <div style={{ height: '1em' }} />
            <Grid container direction="row">
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <Grid container direction="column">
                        <FieldEdit label="Customer" className={classes.field} />
                        <FieldEdit label="Email" className={classes.field} />
                        <FieldEdit label="Phone" className={classes.field} />
                        <FieldEdit label="Salesperson" className={classes.field} />
                        <FieldEdit label="Sales team" className={classes.field} />
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <Grid container direction="column">
                        <FieldEdit label="Expected closing" className={classes.field} />
                        <FieldEdit label="Priority" className={classes.field} />
                        <FieldEdit label="Tags" className={classes.field} />
                        <FieldEdit label="Company" className={classes.field} />
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

export default LeadForm;
