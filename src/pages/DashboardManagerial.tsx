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
        quarterbox: {
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
            margin: "0!important",
            display: "flex",
            width: "100%",
            padding: "0 20px 10px 20px"
        },
        containerFieldsTitle:{
            margin: "0!important",
            display: "flex",
            width: "100%",
            padding: "0 20px 30px 20px"
        },
        containerFieldsQuarter:{
            margin: "0!important",
            display: "flex",
            width: "100%",
            color: "white"
        },
        label:{
            width: "60%",
            fontSize: "1.2em",
        },
        datafield:{
            fontSize: "1.2em",
            width: "40%",
            textAlign: "end"
        },
        datafieldquarter:{
            fontSize: "1.2em",
            padding: "5px"
        },
        widthhalf:{
            width: "50%"
        },
        widthsecondhalf:{
            width: "50%",
            paddingTop: "5%"
        }
    }),
);

const DashboardManagerial: FC = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    return (
        <Fragment>
            <div className={classes.maintitle}> {t(langKeys.managerial)}</div>
            <div className="row-zyx ">
                <Box
                    className={classes.halfbox}
                >
                    <div className={"row-zyx  " + classes.rowstyles}>
                        <div className={classes.widthhalf}>
                            <div className={classes.containerFieldsTitle}>
                                <div className={classes.boxtitle}>TMO</div>
                                <div className={classes.boxtitledata}>00:00:00</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.objective)}</div>
                                <div className={classes.datafield}>&lt; 0min</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.variation)}</div>
                                <div className={classes.datafield}>00:00:00</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.highestTMO)}</div>
                                <div className={classes.datafield}>00:00:00</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.lowestTMO)}</div>
                                <div className={classes.datafield}>00:00:00</div>
                            </div>
                        </div>
                        <div className={classes.widthsecondhalf}>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.sla)}</div>
                                <div className={classes.datafield}>0%</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.variation)}</div>
                                <div className={classes.datafield}>0%</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.quantitymeets)}</div>
                                <div className={classes.datafield}>0</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.quantitymeetsnot)}</div>
                                <div className={classes.datafield}>0</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.totalconversation)}</div>
                                <div className={classes.datafield}>0</div>
                            </div>
                        </div>
                    </div>
                </Box>
                <Box
                    className={classes.halfbox}
                >
                    <div className={"row-zyx  " + classes.rowstyles}>
                        <div className={classes.widthhalf}>
                            <div className={classes.containerFieldsTitle}>
                                <div className={classes.boxtitle}>TMO</div>
                                <div className={classes.boxtitledata}>00:00:00</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.objective)}</div>
                                <div className={classes.datafield}>&lt; 0min</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.variation)}</div>
                                <div className={classes.datafield}>00:00:00</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.highestTME)}</div>
                                <div className={classes.datafield}>00:00:00</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.lowestTME)}</div>
                                <div className={classes.datafield}>00:00:00</div>
                            </div>
                        </div>
                        <div className={classes.widthsecondhalf}>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.sla)}</div>
                                <div className={classes.datafield}>0%</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.variation)}</div>
                                <div className={classes.datafield}>0%</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.quantitymeets)}</div>
                                <div className={classes.datafield}>0</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.quantitymeetsnot)}</div>
                                <div className={classes.datafield}>0</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.totalconversation)}</div>
                                <div className={classes.datafield}>0</div>
                            </div>
                        </div>
                    </div>
                </Box>
            </div>
            <div className="row-zyx ">
                <Box
                    className={classes.quarterbox}
                    style={{backgroundColor:"#53a6fa"}}
                >
                    <div className={classes.containerFieldsQuarter}>
                        <div className={classes.boxtitle}>TMR</div>
                        <div className={classes.boxtitledata}>00:00:00</div>    
                    </div>            
                </Box>
                <Box
                    className={classes.quarterbox}
                    style={{backgroundColor:"#22b66e"}}
                >
                    <div className={classes.containerFieldsQuarter}>
                        <div className={classes.boxtitle}>TMR Asesor</div>
                        <div className={classes.boxtitledata}>00:00:00</div>    
                    </div>                  
                </Box>
                <Box
                    className={classes.quarterbox}
                    style={{backgroundColor:"#fdab29"}}
                >
                    <div className={classes.containerFieldsQuarter}>
                        <div className={classes.boxtitle}>TMR Bot</div>
                        <div className={classes.boxtitledata}>00:00:00</div>    
                    </div>                  
                </Box>
                <Box
                    className={classes.quarterbox}
                    style={{backgroundColor:"#907eec"}}
                >
                    <div className={classes.containerFieldsQuarter}>
                        <div className={classes.boxtitle}>TMR Client</div>
                        <div className={classes.boxtitledata}>00:00:00</div>    
                    </div>                  
                </Box>
            </div>
            <div className="row-zyx ">
                <Box
                    className={classes.halfbox}
                >
                    <div className={"row-zyx  " + classes.rowstyles}>
                        <div className={classes.widthhalf}>
                            <div className={classes.containerFieldsTitle}>
                                <div className={classes.boxtitle}>NPS</div>
                                <div className={classes.boxtitledata}>00:00:00</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.objective)}</div>
                                <div className={classes.datafield}>&lt; 0min</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.variation)}</div>
                                <div className={classes.datafield}>00:00:00</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.highestTMO)}</div>
                                <div className={classes.datafield}>00:00:00</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.lowestTMO)}</div>
                                <div className={classes.datafield}>00:00:00</div>
                            </div>
                        </div>
                        <div className={classes.widthsecondhalf}>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.sla)}</div>
                                <div className={classes.datafield}>0%</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.variation)}</div>
                                <div className={classes.datafield}>0%</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.quantitymeets)}</div>
                                <div className={classes.datafield}>0</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.quantitymeetsnot)}</div>
                                <div className={classes.datafield}>0</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.totalconversation)}</div>
                                <div className={classes.datafield}>0</div>
                            </div>
                        </div>
                    </div>
                </Box>
                <Box
                    className={classes.halfbox}
                >
                    <div className={"row-zyx  " + classes.rowstyles}>
                        <div className={classes.widthhalf}>
                            <div className={classes.containerFieldsTitle}>
                                <div className={classes.boxtitle}>CSAT</div>
                                <div className={classes.boxtitledata}>00:00:00</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.objective)}</div>
                                <div className={classes.datafield}>&lt; 0min</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.variation)}</div>
                                <div className={classes.datafield}>00:00:00</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.highestTME)}</div>
                                <div className={classes.datafield}>00:00:00</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.lowestTME)}</div>
                                <div className={classes.datafield}>00:00:00</div>
                            </div>
                        </div>
                        <div className={classes.widthsecondhalf}>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.sla)}</div>
                                <div className={classes.datafield}>0%</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.variation)}</div>
                                <div className={classes.datafield}>0%</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.quantitymeets)}</div>
                                <div className={classes.datafield}>0</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.quantitymeetsnot)}</div>
                                <div className={classes.datafield}>0</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.totalconversation)}</div>
                                <div className={classes.datafield}>0</div>
                            </div>
                        </div>
                    </div>
                </Box>
            </div>
            <div className="row-zyx ">
                <Box
                    className={classes.halfbox}
                >
                    <div className={"row-zyx  " + classes.rowstyles}>
                        <div className={classes.widthhalf}>
                            <div className={classes.containerFieldsTitle}>
                                <div className={classes.boxtitle}>FCR</div>
                                <div className={classes.boxtitledata}>00:00:00</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.objective)}</div>
                                <div className={classes.datafield}>&lt; 0min</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.variation)}</div>
                                <div className={classes.datafield}>00:00:00</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.highestTMO)}</div>
                                <div className={classes.datafield}>00:00:00</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.lowestTMO)}</div>
                                <div className={classes.datafield}>00:00:00</div>
                            </div>
                        </div>
                        <div className={classes.widthsecondhalf}>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.sla)}</div>
                                <div className={classes.datafield}>0%</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.variation)}</div>
                                <div className={classes.datafield}>0%</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.quantitymeets)}</div>
                                <div className={classes.datafield}>0</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.quantitymeetsnot)}</div>
                                <div className={classes.datafield}>0</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.totalconversation)}</div>
                                <div className={classes.datafield}>0</div>
                            </div>
                        </div>
                    </div>
                </Box>
                <Box
                    className={classes.halfbox}
                >
                    <div className={"row-zyx  " + classes.rowstyles}>
                        <div className={classes.widthhalf}>
                            <div className={classes.containerFieldsTitle}>
                                <div className={classes.boxtitle}>FIX</div>
                                <div className={classes.boxtitledata}>00:00:00</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.objective)}</div>
                                <div className={classes.datafield}>&lt; 0min</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.variation)}</div>
                                <div className={classes.datafield}>00:00:00</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.highestTME)}</div>
                                <div className={classes.datafield}>00:00:00</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.lowestTME)}</div>
                                <div className={classes.datafield}>00:00:00</div>
                            </div>
                        </div>
                        <div className={classes.widthsecondhalf}>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.sla)}</div>
                                <div className={classes.datafield}>0%</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.variation)}</div>
                                <div className={classes.datafield}>0%</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.quantitymeets)}</div>
                                <div className={classes.datafield}>0</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.quantitymeetsnot)}</div>
                                <div className={classes.datafield}>0</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.totalconversation)}</div>
                                <div className={classes.datafield}>0</div>
                            </div>
                        </div>
                    </div>
                </Box>
            </div>
            <div className="row-zyx ">
                <Box
                    className={classes.quarterbox}
                >
                    <div className={classes.boxtitlequarter}>Average conversations attended by the advisor by hour</div>
                    <div className={classes.datafieldquarter}> &lt;0min </div>                    
                </Box>
                <Box
                    className={classes.quarterbox}
                >
                    <div className={classes.boxtitlequarter}>Average conversations attended by the advisor by hour</div>
                    <div className={classes.datafieldquarter}> &lt;0min </div>                    
                </Box>
                <Box
                    className={classes.halfbox}
                >
                    <div className={classes.boxtitlequarter}>Average number of advisers connected by hour</div>
                    <div className={classes.datafieldquarter}> &lt;0min </div>    
                </Box>
            </div>
            <div className="row-zyx ">
                <Box
                    className={classes.quarterbox}
                >
                    <div className={classes.boxtitlequarter}>Conversations attended </div>
                    <div className={classes.datafieldquarter}> &lt;0min </div>                    
                </Box>
                <Box
                    className={classes.quarterbox}
                >
                    <div className={classes.boxtitlequarter}>Average Interaction by conversation</div>
                    <div className={classes.datafieldquarter}> &lt;0min </div>                    
                </Box>
                <Box
                    className={classes.halfbox}
                >
                    <div className={classes.boxtitlequarter}>Ranking 5 top labels</div>
                    <div className={classes.datafieldquarter}> &lt;0min </div>    
                </Box>
            </div>
            
        </Fragment>
    )
}

export default DashboardManagerial;