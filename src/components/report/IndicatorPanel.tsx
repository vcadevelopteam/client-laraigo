/* eslint-disable react-hooks/exhaustive-deps */
import { FC } from "react";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Typography from "@material-ui/core/Typography/Typography";

interface Indicator {
    title: string;
    value: string;
}

const IndicatorPanel: FC<Indicator> = ({ title, value }) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="body2">
                    {title}
                </Typography>
                <Typography variant="h5" component="div" align="center">
                    {value}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default IndicatorPanel;