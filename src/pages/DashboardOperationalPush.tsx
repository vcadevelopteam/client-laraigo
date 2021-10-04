import { Box, createStyles, makeStyles, Theme } from "@material-ui/core";
import { langKeys } from "lang/keys";
import { FC, Fragment } from "react";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        halfbox: {
            width: "49%",
            margin: "0 1% 2% 0",
            backgroundColor: 'white',
        },
        fullbox: {
            width: "100%",
            margin: "0 0 2% 0",
            backgroundColor: 'white',
        },
        quarterbox: {            
            textAlign: "center",
            width: "24%",
            margin: "0 1% 2% 0",
            backgroundColor: 'white',
            padding: "15px"
        },
        quarterbox2: {
            width: "24%",
            margin: "0 1% 2% 0",
            backgroundColor: 'white',
            padding: "15px"
        },
        boxtitle:{
            fontWeight: "bold",
            fontSize: "1.6em",
            paddingTop: "15px",
            width: "50%"
        },
        boxtitledata:{
            fontSize: "1.6em",
            width: "50%",
            paddingTop: "15px",
            textAlign: "end"
        },
        boxtitlequarter:{
            fontWeight: "bold",
            fontSize: "1.5em",
        },
        maintitle:{
            fontWeight: "bold",
            fontSize: "2em",
            padding: "0 0 20px;"
        },
        rowstyles:{
            margin:"0!important"
        },
        containerFields:{
            border: "black 1px solid",
            margin: "0!important",
            display: "flex",
            padding: "0 15px"
        },
        label:{
            width: "60%",
            fontSize: "1.2em",
            padding: "5px"
        },
        datafield:{
            fontSize: "1.2em",
            padding: "5px"
        },
        datafieldquarter:{
            fontSize: "1.2em",
            padding: "5px"
        },
        containerFieldsQuarter:{
            margin: "0!important",
            display: "flex",
            width: "100%",
            color: "white"
        },
    }),
);

const DashboardOperationalPush: FC = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    return (
        <Fragment>
            <div className={classes.maintitle}> {t(langKeys.operationalpush)}</div>
            <div className="row-zyx ">
                <Box
                    className={classes.quarterbox}
                >
                    <div className={classes.boxtitlequarter}>Sent Messages</div>
                    <div className={classes.datafieldquarter}> 0 </div>                    
                </Box>
                <Box
                    className={classes.quarterbox}
                >
                    <div className={classes.boxtitlequarter}>Messages successfully delivered </div>
                    <div className={classes.datafieldquarter}>0</div>                    
                </Box>
                <Box
                    className={classes.quarterbox}
                >
                    <div className={classes.boxtitlequarter}>Failed messages </div>
                    <div className={classes.datafieldquarter}>0</div>                    
                </Box>
                <Box
                    className={classes.quarterbox}
                >
                    <div className={classes.boxtitlequarter}>Answered messages </div>
                    <div className={classes.datafieldquarter}>0</div>                    
                </Box>
                <Box
                    className={classes.quarterbox2}
                    style={{backgroundColor:"#53a6fa"}}
                >
                    <div className={classes.containerFieldsQuarter}>
                        <div className={classes.boxtitle}>{t(langKeys.closedbyadviser)}</div>
                        <div className={classes.boxtitledata}>0</div>    
                    </div>            
                </Box>
                <Box
                    className={classes.quarterbox2}
                    style={{backgroundColor:"#fdab29"}}
                >
                    <div className={classes.containerFieldsQuarter}>
                        <div className={classes.boxtitle}>{t(langKeys.closedbybot)}</div>
                        <div className={classes.boxtitledata}>0</div>    
                    </div>            
                </Box>
            </div>
            <div className="row-zyx ">
                <Box
                    className={classes.halfbox}
                >
                    <div className={classes.boxtitle}> Distribution by category HSM</div>
                </Box>
                <Box
                    className={classes.halfbox}
                >
                    <div className={classes.boxtitle}> Ranking HSM </div>
                </Box>
            </div>
            <div className="row-zyx ">
                <Box
                    className={classes.fullbox}
                >
                    <div className={classes.boxtitle}>Messages by day </div>
                </Box>
            </div>
        </Fragment>
    )
}

export default DashboardOperationalPush;