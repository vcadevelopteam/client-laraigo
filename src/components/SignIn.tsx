import React, { useState } from 'react'; // we need this to make JSX compile
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Alert from '@material-ui/lab/Alert';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    containerLogin: {
        height: '100vh',
        display: 'flex',
        alignItems: 'center'
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    progress: {
        margin: theme.spacing(0, 'auto', 3),
        display: 'block'
    },
    alert: {
        display: 'inline-flex',
        width: '100%'
    },
    alertheader: {
        display: 'inline-flex',
        width: '100%',
        marginTop: theme.spacing(1),
    },
}));


type ParamsProps = {
    title: string,
    paragraph: string
}

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <a>Zyxme {new Date().getFullYear()}</a>
        </Typography>
    );
}

type ResponseProps = {
    success?: boolean,
    msg?: string,
    show: boolean,
}

const SignIn = ({ title, paragraph }: ParamsProps) => {
    const classes = useStyles();
    const [isloading, setisloading] = useState(false);
    const [resultrequest, setresultrequest] = useState<ResponseProps>({ show: false});
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Container component="main" maxWidth="xs" className={classes.containerLogin}>
            <div>
                <div className={classes.paper}>
                    {resultrequest.show && (
                        <Alert className={classes.alertheader} variant="filled" severity={resultrequest.success ? "success" : "error"}>
                            {resultrequest.msg}
                        </Alert>
                    )}
                    <form
                        className={classes.form}
                    >
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Usuario"
                            name="usr"
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Contraseña"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            // value={formik.values.password}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            // onClick={handleClickShowPassword}
                                            // onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {!isloading ?
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Ingresar
                            </Button>
                            :
                            <CircularProgress className={classes.progress} />
                        }
                        <Grid container>
                            <Grid item>
                                <p>¿No tienes una cuenta? Registrate</p>
                            </Grid>
                        </Grid>
                    </form>
                </div>
                <Box mt={8}>
                    <Copyright />
                </Box>
            </div>
        </Container>)
}

export default SignIn;