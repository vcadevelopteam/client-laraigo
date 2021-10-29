/* eslint-disable react-hooks/exhaustive-deps */
import { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';

const useStyles = makeStyles(theme => ({
    titlecards:{
        fontWeight: "bold",
        fontSize: "1.5em",
        color: "#883db7",
        width: "100%",
        textAlign: "center",
    },
    containerHead: {
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    containerLogo: {
        flex: 1,
        backgroundColor: 'white',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        [theme.breakpoints.down("sm")]: {
            display: "none"
        },
    },
    boxstyles: {
        textAlign: "justify",
        margin: "25px 10%",
        border: "grey 1px solid",
        padding: 25
    },
    separator: {
        borderBottom: "1px solid #D1CBCB",
        width: "15%",
        height: 0,
        marginLeft: 4,
        marginRight: 4
    },
    cookieAlert: {
        "& svg": {
            color: 'white'
        }
    },
    emptyspacenumber:{
        flex: 1,
        [theme.breakpoints.down("sm")]: {
            display: "none"
        },
    }
}));

export const Privacy: FC = () => {
    
    const classes = useStyles();
    const { t } = useTranslation();
    return (
        <div style={{ width: "100%",marginTop:25}}>
            <div className={classes.containerHead}>
                <img src="./Laraigo-vertical-logo-name.svg" style={{ height: 200}} alt="logo" />
            </div>
            <div className={classes.titlecards}>{t(langKeys.privacypoliciestitle)}</div>
            <Box className={classes.boxstyles}>
                <p>Política de Privacidad de la Aplicación</p>
                <p>Esta política de privacidad aplica al procesamiento de información identificable obtenida de su página o páginas de Facebook mediante la conexión con la aplicación asociada para el uso de la plataforma de mensajería centralizada Laraigo. La aplicación es provista por la empresa VCA Perú en coordinación con Facebook. Al enlazar o acceder de otra manera a esta aplicación, usted acepta las prácticas y políticas definidas en este documento.</p>
                <ol>
                    <li>
                        <p>¿Qué información personal es obtenida por la empresa VCA Perú?</p>
                        <ul>
                            <li>Información provista de ustedes a nosotros: Recibiremos y almacenaremos información de su página de Facebook como nombre de página, rubro de la página, código de identificación externo.</li>
                            <li>Información obtenida automáticamente: Recibiremos y almacenaremos información de los usuarios que interactúen con la página o páginas de Facebook enlazadas mediante el canal de Messenger y/o muro. Esta información incluye, pero no está limitada a nombres, apellidos, nombre de usuario, foto de perfil y la interacción misma que realizo. Asimismo, se obtendrá información de las publicaciones de la misma página o páginas de Facebook enlazadas.</li>
                        </ul>
                    </li>
                    <li>
                        <p>¿Cómo utiliza VCA Perú la información que recolecta?</p>
                        <p>VCA Perú utiliza la información descrita en esta política de privacidad para alimentar la plataforma de mensajería centralizada Laraigo, facilitando la entrada de mensajes de usuarios de una página o páginas de Facebook y la salida de mensajes de asesor o robot de chat al canal de Facebook correspondiente. Asimismo, se utiliza esta información internamente para analizar, desarrollar y mejorar los productos de VCA Perú.</p>
                    </li>
                    <li>
                        <p>¿VCA Perú compartirá la información personal que reciba?</p>
                        <p>Información personal de los usuarios es una parte integral de nuestro negocio. Nosotros no vendemos o rentamos su información personal con alguna tercera parte. La información personal obtenida estará disponible en nuestra plataforma de Laraigo para el uso de usted y sus trabajadores.</p>
                    </li>
                    <li>
                        <p>¿Qué información personal puedo yo acceder?</p>
                        <p>VCA Perú te permita acceder a la siguiente información para el propósito de observar y gestionar los canales de comunicación deseados de una página o páginas de Facebook mediante la plataforma de mensajería centralizada Laraigo.</p>
                        <ul>
                            <li>Información de las publicaciones de una página</li>
                            <li>Mensajes entrantes de usuarios a una página</li>
                            <li>Mensajes salientes de la plataforma de Laraigo a un canal de Facebook</li>
                            <li>Interacción de los usuarios con la pagina o páginas de Facebook</li>
                            <li>Data especifica de la aplicación</li>
                        </ul>                         
                    </li>
                    <li>
                        <p>Condiciones de uso</p>
                        <p>Si decide acceder o utilizar la aplicación, su acceso o cualquier disputa sobre la privacidad está ligada a esta política de privacidad y a nuestros términos de uso, incluyendo limitaciones en daños y arbitraje de disputas.</p>
                    </li>
                    <li>
                        <p>Cambios a esta política de privacidad</p>
                        <p>VCA Perú puede realizar cambios a esta política de privacidad. El uso de la información que recolectamos ahora está sujeta a la política de privacidad en efecto en la fecha donde la información fue usada. Si hacemos cambios en la forma en la que usamos la información personal, te notificaremos mediante un correo o una notificación en nuestro sitio web. </p>
                    </li>
                    <li>
                        <p>Preguntas o preocupaciones</p>
                        <p>Si tienes alguna pregunta o preocupación sobre nuestra política de privacidad, favor de enviarnos un mensaje detallado a laraigo@vcaperu.com para poder resolverla en nuestra mayor capacidad.</p>
                    </li>
                </ol> 
                <p>Fecha efectiva: 01 de octubre, 2021</p>
            </Box>
        </div>
    );
};


export default Privacy;
