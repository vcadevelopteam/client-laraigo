/* eslint-disable react-hooks/exhaustive-deps */
import { FC } from "react";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Typography from "@material-ui/core/Typography/Typography";

interface Indicator {
    title: string;
    value: string;
    value2?: string
}

const IndicatorPanel: FC<Indicator> = ({ title, value,value2 }) => {
    return (
        <Card>
            <CardContent style={{paddingBottom: 10}}>
                <Typography variant="body2">
                    {title}
                </Typography>
                <Typography variant="h5" component="div" align="center">
                    {value}
                </Typography>
                <Typography variant="subtitle2" style={{display: "flex",width: "100%", paddingTop: 5, justifyContent: "space-between"}}>
                    {value2}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default IndicatorPanel;