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
            textAlign: "center",
            width: "24%",
            margin: "0 1% 2% 0",
            backgroundColor: 'white',
            border: "solid black 1px",
            padding: "15px"
        },
        boxtitle:{
            fontWeight: "bold",
            fontSize: "1.5em",
            padding: "15px"
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
                    <div className={classes.boxtitle}> {t(langKeys.informationTMO)}</div>
                    <div className={"row-zyx  " + classes.rowstyles}>
                        <div className={"col-6 " + classes.containerFields}>
                            <div className={classes.label}>Objective: </div>
                            <div className={classes.datafield}> &lt;0min </div>
                        </div>
                        <div className={"col-6 " + classes.containerFields}>
                            <div className={classes.label}>Service Level Agrement: </div>
                            <div className={classes.datafield}> NaN% </div>
                        </div>
                    </div>
                    <div className={"row-zyx  " + classes.rowstyles}>
                        <div className={"col-6 " + classes.containerFields}>
                            <div className={classes.label}>Variation: </div>
                            <div className={classes.datafield}> HH:MM:SS </div>
                        </div>
                        <div className={"col-6 " + classes.containerFields}>
                            <div className={classes.label}>Variation: </div>
                            <div className={classes.datafield}> NaN% </div>
                        </div>
                    </div>
                    <div className={"row-zyx  " + classes.rowstyles}>
                        <div className={"col-6 " + classes.containerFields}>
                            <div className={classes.label}>TMO higher: </div>
                            <div className={classes.datafield}> HH:MM:SS </div>
                        </div>
                        <div className={"col-6 " + classes.containerFields}>
                            <div className={classes.label}>Quantity meets:</div>
                            <div className={classes.datafield}> 0 </div>
                        </div>
                    </div>
                    <div className={"row-zyx  " + classes.rowstyles}>
                        <div className={"col-6 " + classes.containerFields}>
                            <div className={classes.label}>TMO lower: </div>
                            <div className={classes.datafield}> HH:MM:SS </div>
                        </div>
                        <div className={"col-6 " + classes.containerFields}>
                            <div className={classes.label}>Quantity does not meets:</div>
                            <div className={classes.datafield}> 0 </div>
                        </div>
                    </div>
                    <div className={"row-zyx  " + classes.rowstyles}>
                        <div className={"col-6 " + classes.containerFields}>
                        </div>
                        <div className={"col-6 " + classes.containerFields}>
                            <div className={classes.label}>Total conversation:</div>
                            <div className={classes.datafield}> 0 </div>
                        </div>
                    </div>

                    
                </Box>
                <Box
                    className={classes.halfbox}
                >
                    <div className={classes.boxtitle}> {t(langKeys.informationTME)}</div>
                    <div className={"row-zyx  " + classes.rowstyles}>
                        <div className={"col-6 " + classes.containerFields}>
                            <div className={classes.label}>Objective: </div>
                            <div className={classes.datafield}> &lt;0min </div>
                        </div>
                        <div className={"col-6 " + classes.containerFields}>
                            <div className={classes.label}>Service Level Agrement: </div>
                            <div className={classes.datafield}> NaN% </div>
                        </div>
                    </div>
                    <div className={"row-zyx  " + classes.rowstyles}>
                        <div className={"col-6 " + classes.containerFields}>
                            <div className={classes.label}>Variation: </div>
                            <div className={classes.datafield}> HH:MM:SS </div>
                        </div>
                        <div className={"col-6 " + classes.containerFields}>
                            <div className={classes.label}>Variation: </div>
                            <div className={classes.datafield}> NaN% </div>
                        </div>
                    </div>
                    <div className={"row-zyx  " + classes.rowstyles}>
                        <div className={"col-6 " + classes.containerFields}>
                            <div className={classes.label}>TMO higher: </div>
                            <div className={classes.datafield}> HH:MM:SS </div>
                        </div>
                        <div className={"col-6 " + classes.containerFields}>
                            <div className={classes.label}>Quantity meets:</div>
                            <div className={classes.datafield}> 0 </div>
                        </div>
                    </div>
                    <div className={"row-zyx  " + classes.rowstyles}>
                        <div className={"col-6 " + classes.containerFields}>
                            <div className={classes.label}>TMO lower: </div>
                            <div className={classes.datafield}> HH:MM:SS </div>
                        </div>
                        <div className={"col-6 " + classes.containerFields}>
                            <div className={classes.label}>Quantity does not meets:</div>
                            <div className={classes.datafield}> 0 </div>
                        </div>
                    </div>
                    <div className={"row-zyx  " + classes.rowstyles}>
                        <div className={"col-6 " + classes.containerFields}>
                        </div>
                        <div className={"col-6 " + classes.containerFields}>
                            <div className={classes.label}>Total conversation:</div>
                            <div className={classes.datafield}> 0 </div>
                        </div>
                    </div>

                    
                </Box>
            </div>
            <div className="row-zyx ">
                <Box
                    className={classes.quarterbox}
                >
                    <div className={classes.boxtitlequarter}>TMR</div>
                    <div className={classes.datafieldquarter}> &lt;0min </div>                    
                </Box>
                <Box
                    className={classes.quarterbox}
                >
                    <div className={classes.boxtitlequarter}>TMR Asesor</div>
                    <div className={classes.datafieldquarter}> &lt;0min </div>                    
                </Box>
                <Box
                    className={classes.quarterbox}
                >
                    <div className={classes.boxtitlequarter}>TMR Bot</div>
                    <div className={classes.datafieldquarter}> &lt;0min </div>                    
                </Box>
                <Box
                    className={classes.quarterbox}
                >
                    <div className={classes.boxtitlequarter}>TMR Client</div>
                    <div className={classes.datafieldquarter}> &lt;0min </div>                    
                </Box>
            </div>
            <div className="row-zyx ">
                <Box
                    className={classes.halfbox}
                >
                    <div className={classes.boxtitle}> {t(langKeys.informationNPS)}</div>
                    <div className={"row-zyx  " + classes.rowstyles}>
                        <div className={"col-6 " + classes.containerFields}>
                            <div className={classes.label}>NPS: </div>
                            <div className={classes.datafield}> 0 </div>
                        </div>
                        <div className={"col-6 " + classes.containerFields}>
                            <div className={classes.label}>download</div>
                            <div className={classes.datafield}> filter </div>
                        </div>
                    </div>
                </Box>
                <Box
                    className={classes.halfbox}
                >
                    <div className={classes.boxtitle}> {t(langKeys.informationCSAT)}</div>
                    <div className={"row-zyx  " + classes.rowstyles}>
                        <div className={"col-6 " + classes.containerFields}>
                            <div className={classes.label}>CSAT: </div>
                            <div className={classes.datafield}> 0 </div>
                        </div>
                        <div className={"col-6 " + classes.containerFields}>
                            <div className={classes.label}>download</div>
                            <div className={classes.datafield}> filter </div>
                        </div>
                    </div>
                </Box>
            </div>
            <div className="row-zyx ">
                <Box
                    className={classes.halfbox}
                >
                    <div className={classes.boxtitle}> {t(langKeys.informationFIX)}</div>
                    <div className={"row-zyx  " + classes.rowstyles}>
                        <div className={"col-6 " + classes.containerFields}>
                            <div className={classes.label}>FIX: </div>
                            <div className={classes.datafield}> 0 </div>
                        </div>
                        <div className={"col-6 " + classes.containerFields}>
                            <div className={classes.label}>download</div>
                            <div className={classes.datafield}> filter </div>
                        </div>
                    </div>
                </Box>
                <Box
                    className={classes.halfbox}
                >
                    <div className={classes.boxtitle}> {t(langKeys.informationFCR)}</div>
                    <div className={"row-zyx  " + classes.rowstyles}>
                        <div className={"col-6 " + classes.containerFields}>
                            <div className={classes.label}>FCR: </div>
                            <div className={classes.datafield}> 0 </div>
                        </div>
                        <div className={"col-6 " + classes.containerFields}>
                            <div className={classes.label}>download</div>
                            <div className={classes.datafield}> filter </div>
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