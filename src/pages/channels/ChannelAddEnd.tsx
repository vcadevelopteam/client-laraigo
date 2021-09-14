import { Breadcrumbs, Button, Link } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { FieldEdit, TemplateSwitch } from "components";
import React, { FC, useState } from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(theme => ({
    title: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "2em",
        color: "#7721ad",
        padding: "20px",
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: "800px",
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial',
        width: "180px"
    },
}));

export const ChannelAddEnd: FC = () => {
    const classes = useStyles();
    const history = useHistory();
    const [name, setName] = useState("");
    const [auto, setAuto] = useState(false);

    console.log(history.location.state);

    const handleGoBack = (e: React.MouseEvent) => {
        e.preventDefault();
        history.goBack();
    }

    return (
        <div style={{ width: '100%' }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="textSecondary" key="mainview" href="/" onClick={handleGoBack}>
                    {"<< Previous"}
                </Link>
            </Breadcrumbs>
            <div>
                <div className={classes.title}>You are one click away from connecting your communication channel</div>
                <div className="row-zyx">
                    <div className="col-3"></div>
                    <FieldEdit
                        onChange={(value) => setName(value)}
                        label="Give your channel a name"
                        className="col-6"
                    />
                </div>
                <div className="row-zyx">
                    <div className="col-3"></div>
                    <TemplateSwitch
                        onChange={(value) => setAuto(value)}
                        label="Enable Automated Conversational Flow"
                        className="col-6"
                    />
                </div>
                <div style={{ paddingLeft: "80%" }}>
                    <Button
                        onClick={() => {}}
                        className={classes.button}
                        variant="contained"
                        color="primary"
                    >
                        FINISH REGISTRATION
                    </Button>
                </div>
            </div>
        </div>
    );
}
