/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useState, useEffect } from 'react'; // we need this to make JSX compile
import { makeStyles, withStyles } from '@material-ui/core/styles';
import ChatPanel from 'components/inbox/ChatPanel'
import Avatar from '@material-ui/core/Avatar';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import LanguageIcon from '@material-ui/icons/Language';
import { AntTab } from 'components';
import { SearchIcon } from 'icons';
import Badge, { BadgeProps } from '@material-ui/core/Badge';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        gap: theme.spacing(2),
        // paddingTop: theme.spacing(2),
        width: '100%'
    },
    containerAgents: {
        flex: '0 0 300px',
        display: 'flex',
        flexDirection: 'column',
    },
    containerPanel: {
        flex: '1'
    },
    agentName: {
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '22px',
        wordBreak: 'break-word'
    },
    agentUp: {
        display: 'flex',
        gap: theme.spacing(1),
        alignItems: 'center',
        marginBottom: theme.spacing(1)
    },
    counterCount: {
        display: 'flex',
        gap: '4px',
        flexWrap: 'wrap'
    },
    containerItemAgent: {
        padding: `14px ${theme.spacing(3)}px`,
        borderBottom: '1px solid #EBEAED',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'rgb(235, 234, 237, 0.18)'
        }
    },
    title: {
        fontSize: '22px',
        lineHeight: '48px',
        fontWeight: 'bold',
        height: '48px',
        color: theme.palette.text.primary,
    }
}));

const agentstt = [
    {
        "userid": 42,
        "name": "Bot Zyxme",
        "groups": "",
        "countAnwsered": 10,
        "coundPending": 9,
        "countActive": 10,
        "countPaused": 0,
        "countClosed": 4,
        "status": "ACTIVO",
        "channels": "fab fa-whatsapp#55c846#UNABLE - Whatsapp Personas,fab fa-whatsapp#66e3cc#Banco Azteca Demo WA,fab fa-facebook#627384#VCA Public Muro Bot11DeV,fab fa-android#73193a#DEMO APP ANDROID (Bitel),fa fa-globe#072565#Demo Chatflow VV - WEB,fa fa-globe#627384#Chat Web DEV,fab fa-facebook-messenger#000000#NanoBot05Dev 09:07,fab fa-twitter#092f54#TWITTERVCAPERUDEV,fab fa-whatsapp#e8e7ba#Demo Chatflow VV - WA Sandbox,fa fa-globe#627384#Test Canal Chatflow,fab fa-facebook-messenger#c53268#Bot05TsTs,fab fa-instagram#a922b0#VCA Instagram,fab fa-facebook#627384#Bot05 Dev - Wall,fab fa-whatsapp#627384#WHAC TEST CAMPAIGN,fab fa-facebook-messenger#ea0f0f#Facebook Direct Message,fab fa-whatsapp#36f536#WhatsApp Prueba,fab fa-apple#73193a#IOS,fab fa-whatsapp#0aa223#CAPIWHA,fab fa-whatsapp-square#5ead63#Picky Assist - India,fab fa-whatsapp-square#88b152#Picky Assist - Production,fab fa-whatsapp#0d0d0d#ACME ,fab fa-facebook#4b992e#BOT05TST MURO,fab fa-facebook-messenger#f3dd4f#ZyxMe Analytics - Messenger,fab fa-whatsapp#cc1295#WHATSAPP SMOOCH GLOBALHITS,fab fa-line#cc0f3e#LINE,fab fa-youtube#ffc20b#YouTube (https://www.youtube.com/channel/UCHZz9yZSDQE5yahsWwx6MNw),fab fa-google-play#3298c7#Play Store (https://play.google.com/store/apps/developer?id=VCA+Per%C3%BA),fab fa-twitter-square#218ce3#Twitter Messenger (https://twitter.com/vcaperudev),fa fa-globe#e6571e#Voximplant,fab fa-whatsapp-square#1985f1#360DIALOG Development,fab fa-whatsapp-square#cf2626#360DIALOG Production,fas fa-comments#0f76dd#GERALDINE I,fas fa-comments#9b16e9#GERALDINE II,fas fa-comments#627384#CANAL CARLOSFARRO,fas fa-comments#154b81#VCAPERU.com,fab fa-facebook#4b90d5#FACEBOOK MURO,#627384#prueba UPDATE,#627384#pruebaaa,fas fa-comments#627384#prueba21,fab fa-whatsapp-square#627384#prueba 22,fab fa-whatsapp#627384#prueba2206,fas fa-comments#627384#testing1+channel,fas fa-comments#627384#rqweqwe,fab fa-android#627384#fml,fas fa-comments#627384#wreqeq,fa fa-globe#627384#ptrew,fas fa-comments#627384#f,fas fa-comments#274767#fwfw,fas fa-comments#627384#sss,fas fa-comments#1985f1#PRUEBA GERALDINE,fas fa-comments#627384#test111,fas fa-comments#627384#dsadsa,fas fa-comments#627384#dsadsadaaa,fas fa-comments#627384#lastprueba,fas fa-comments#627384#dadsa,fas fa-comments#627384#messenger zyxme con  chat creado,fas fa-comments#627384#zyxme web sin chat con site,fas fa-comments#627384#w,fab fa-facebook-messenger#18e08a#VCA AI DEV,fas fa-comments#e21919#CLARO CANALES,fas fa-phone-square-alt#d616a3#14800149,fab fa-whatsapp-square#627384#wssp ,fab fa-whatsapp-square#0670da#VCA Perú,fas fa-sms#137ee8#SMS DEV,fas fa-comments#627384#Nano Web,fas fa-comments#df4d13#ZyxMe Chat Mejoras",
        "userstatusdate": null,
        "userstatus": null,
        "userstatustype": null,
        "motivetype": null
    },
    {
        "userid": 51,
        "name": "HOLDING Zyxme",
        "groups": "",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 1,
        "countPaused": 3,
        "countClosed": 0,
        "status": "ACTIVO",
        "channels": "fab fa-whatsapp#55c846#UNABLE - Whatsapp Personas,fab fa-whatsapp#66e3cc#Banco Azteca Demo WA,fab fa-facebook#627384#VCA Public Muro Bot11DeV,fab fa-android#73193a#DEMO APP ANDROID (Bitel),fa fa-globe#072565#Demo Chatflow VV - WEB,fa fa-globe#627384#Chat Web DEV,fab fa-facebook-messenger#000000#NanoBot05Dev 09:07,fab fa-twitter#092f54#TWITTERVCAPERUDEV,fab fa-whatsapp#e8e7ba#Demo Chatflow VV - WA Sandbox,fa fa-globe#627384#Test Canal Chatflow,fab fa-facebook-messenger#c53268#Bot05TsTs,fab fa-instagram#a922b0#VCA Instagram,fab fa-facebook#627384#Bot05 Dev - Wall,fab fa-whatsapp#627384#WHAC TEST CAMPAIGN,fab fa-facebook-messenger#ea0f0f#Facebook Direct Message,fab fa-whatsapp#36f536#WhatsApp Prueba,fab fa-apple#73193a#IOS,fab fa-whatsapp#0aa223#CAPIWHA,fab fa-whatsapp-square#5ead63#Picky Assist - India,fab fa-whatsapp-square#88b152#Picky Assist - Production,fab fa-whatsapp#0d0d0d#ACME ,fab fa-facebook#4b992e#BOT05TST MURO,fab fa-facebook-messenger#f3dd4f#ZyxMe Analytics - Messenger,fab fa-whatsapp#cc1295#WHATSAPP SMOOCH GLOBALHITS,fab fa-line#cc0f3e#LINE,fab fa-youtube#ffc20b#YouTube (https://www.youtube.com/channel/UCHZz9yZSDQE5yahsWwx6MNw),fab fa-google-play#3298c7#Play Store (https://play.google.com/store/apps/developer?id=VCA+Per%C3%BA),fab fa-twitter-square#218ce3#Twitter Messenger (https://twitter.com/vcaperudev),fa fa-globe#e6571e#Voximplant,fab fa-whatsapp-square#1985f1#360DIALOG Development,fab fa-whatsapp-square#cf2626#360DIALOG Production,fas fa-comments#0f76dd#GERALDINE I,fas fa-comments#9b16e9#GERALDINE II,fas fa-comments#627384#CANAL CARLOSFARRO,fas fa-comments#154b81#VCAPERU.com,fab fa-facebook#4b90d5#FACEBOOK MURO,#627384#prueba UPDATE,#627384#pruebaaa,fas fa-comments#627384#prueba21,fab fa-whatsapp-square#627384#prueba 22,fab fa-whatsapp#627384#prueba2206,fas fa-comments#627384#testing1+channel,fas fa-comments#627384#rqweqwe,fab fa-android#627384#fml,fas fa-comments#627384#wreqeq,fa fa-globe#627384#ptrew,fas fa-comments#627384#f,fas fa-comments#274767#fwfw,fas fa-comments#627384#sss,fas fa-comments#1985f1#PRUEBA GERALDINE,fas fa-comments#627384#test111,fas fa-comments#627384#dsadsa,fas fa-comments#627384#dsadsadaaa,fas fa-comments#627384#lastprueba,fas fa-comments#627384#dadsa,fas fa-comments#627384#messenger zyxme con  chat creado,fas fa-comments#627384#zyxme web sin chat con site,fas fa-comments#627384#w,fab fa-facebook-messenger#18e08a#VCA AI DEV,fas fa-comments#e21919#CLARO CANALES,fas fa-phone-square-alt#d616a3#14800149,fab fa-whatsapp-square#627384#wssp ,fab fa-whatsapp-square#0670da#VCA Perú,fas fa-sms#137ee8#SMS DEV,fas fa-comments#627384#Nano Web,fas fa-comments#df4d13#ZyxMe Chat Mejoras",
        "userstatusdate": null,
        "userstatus": null,
        "userstatustype": null,
        "motivetype": null
    },
    {
        "userid": 209,
        "name": "Carlos Farro",
        "groups": "GR00,GR01,GR02",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "ACTIVO",
        "channels": "fa fa-globe#072565#Demo Chatflow VV - WEB,fa fa-globe#627384#Chat Web DEV,fab fa-facebook-messenger#c53268#Bot05TsTs,fab fa-whatsapp#0d0d0d#ACME ,fab fa-facebook#4b992e#BOT05TST MURO",
        "userstatusdate": "2021-09-01T18:32:43.494291",
        "userstatus": "ACTIVO",
        "userstatustype": "INBOX",
        "motivetype": ""
    },
    {
        "userid": 222,
        "name": "Asesor  grupo0",
        "groups": "GR00",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fa fa-globe#627384#Chat Web DEV,fab fa-facebook-messenger#c53268#Bot05TsTs,fab fa-whatsapp#36f536#WhatsApp Prueba",
        "userstatusdate": "2021-07-24T19:32:01.84836",
        "userstatus": "DESCONECTADO",
        "userstatustype": "EXPIRACION",
        "motivetype": null
    },
    {
        "userid": 90,
        "name": "Asesor 1 n1",
        "groups": "",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-facebook-messenger#fbb02f#Demo VV - Facebook Smooch,fa fa-globe#072565#Demo Chatflow VV - WEB,fab fa-whatsapp#e8e7ba#Demo Chatflow VV - WA Sandbox,fab fa-facebook-messenger#c53268#Bot05TsTs,fab fa-facebook#627384#Bot05 Dev - Wall,fab fa-facebook-messenger#f3dd4f#ZyxMe Analytics - Messenger",
        "userstatusdate": "2021-05-28T23:55:41.566372",
        "userstatus": "DESCONECTADO",
        "userstatustype": "LOGOUT",
        "motivetype": ""
    },
    {
        "userid": 70,
        "name": "Asesor 2 n1",
        "groups": "",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-android#73193a#DEMO APP ANDROID (Bitel),fa fa-globe#072565#Demo Chatflow VV - WEB,fa fa-globe#627384#Chat Web DEV,fab fa-whatsapp#e8e7ba#Demo Chatflow VV - WA Sandbox,fab fa-facebook-messenger#c53268#Bot05TsTs,fab fa-facebook#627384#Bot05 Dev - Wall",
        "userstatusdate": "2020-07-03T18:28:53.412274",
        "userstatus": "DESCONECTADO",
        "userstatustype": "EXPIRACION",
        "motivetype": null
    },
    {
        "userid": 120,
        "name": "Asesor 3 Dev",
        "groups": "",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fa fa-globe#072565#Demo Chatflow VV - WEB,fa fa-globe#627384#Chat Web DEV,fab fa-whatsapp#e8e7ba#Demo Chatflow VV - WA Sandbox",
        "userstatusdate": "2020-06-22T19:56:35.075288",
        "userstatus": "DESCONECTADO",
        "userstatustype": "EXPIRACION",
        "motivetype": null
    },
    {
        "userid": 72,
        "name": "Asesor Grupo 1",
        "groups": "GR03",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fa fa-globe#4726da#UNABLE - WEB MSG DEV - https://vcaperu.com:444/chatweb/zyxmetest/,fab fa-facebook#1bcae5#UNABLE - Facebook Personas - Test Bot02,fab fa-twitter#1a82ea#Twitter Muro (https://twitter.com/vcaperudev),fa fa-globe#072565#Demo Chatflow VV - WEB,fa fa-globe#627384#Chat Web DEV,fab fa-whatsapp#e8e7ba#Demo Chatflow VV - WA Sandbox,fab fa-facebook-messenger#c53268#Bot05TsTs,fab fa-facebook#627384#Bot05 Dev - Wall",
        "userstatusdate": "2020-07-17T17:34:53.186542",
        "userstatus": "DESCONECTADO",
        "userstatustype": "EXPIRACION",
        "motivetype": null
    },
    {
        "userid": 78,
        "name": "Asesor Grupo 2",
        "groups": "GR02",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fa fa-globe#072565#Demo Chatflow VV - WEB,fab fa-facebook-messenger#c53268#Bot05TsTs,fab fa-facebook#627384#Bot05 Dev - Wall",
        "userstatusdate": "2020-07-17T16:58:52.821858",
        "userstatus": "DESCONECTADO",
        "userstatustype": "EXPIRACION",
        "motivetype": null
    },
    {
        "userid": 221,
        "name": "Balanceo Balanceo",
        "groups": "GR01,GR00,GR02,GR03",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-whatsapp#0aa223#CAPIWHA",
        "userstatusdate": "2020-10-23T15:16:04.177797",
        "userstatus": "DESCONECTADO",
        "userstatustype": "EXPIRACION",
        "motivetype": null
    },
    {
        "userid": 254,
        "name": "Carlos Farro",
        "groups": "GR01,GR02",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-facebook-messenger#c53268#Bot05TsTs",
        "userstatusdate": null,
        "userstatus": null,
        "userstatustype": null,
        "motivetype": null
    },
    {
        "userid": 210,
        "name": "Carlos Farro",
        "groups": "GR00,GR01,GR02",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fa fa-globe#627384#Chat Web DEV,fab fa-facebook-messenger#c53268#Bot05TsTs",
        "userstatusdate": "2021-08-13T17:52:37.972165",
        "userstatus": "DESCONECTADO",
        "userstatustype": "LOGOUT",
        "motivetype": ""
    },
    {
        "userid": 89,
        "name": "Diego del Castillo",
        "groups": "",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-whatsapp#55c846#UNABLE - Whatsapp Personas,fa fa-globe#4726da#UNABLE - WEB MSG DEV - https://vcaperu.com:444/chatweb/zyxmetest/,fab fa-facebook#0f25a2#UNABLE - Facebook Personas VCA Peru,fab fa-facebook#1bcae5#UNABLE - Facebook Personas - Test Bot02,fab fa-facebook-messenger#1cccf3#UNABLE - Messenger Personas Demo (Sin Bot),fab fa-twitter#1a82ea#Twitter Muro (https://twitter.com/vcaperudev),fab fa-facebook-messenger#fbb02f#Demo VV - Facebook Smooch,fab fa-whatsapp#dab317#UNABLE - WSP VCA Testing con Capiwha,fab fa-whatsapp#66e3cc#Banco Azteca Demo WA,fab fa-facebook#627384#VCA Public Muro Bot11DeV,fab fa-android#73193a#DEMO APP ANDROID (Bitel),fa fa-globe#072565#Demo Chatflow VV - WEB,fa fa-globe#627384#Chat Web DEV,fab fa-facebook-messenger#000000#NanoBot05Dev 09:07,fab fa-twitter#092f54#TWITTERVCAPERUDEV,fab fa-whatsapp#e8e7ba#Demo Chatflow VV - WA Sandbox,fa fa-globe#627384#Test Canal Chatflow,fab fa-facebook-messenger#c53268#Bot05TsTs,fab fa-instagram#a922b0#VCA Instagram,fab fa-facebook#627384#Bot05 Dev - Wall,fab fa-whatsapp#627384#WHAC TEST CAMPAIGN,fab fa-facebook-messenger#ea0f0f#Facebook Direct Message,fab fa-whatsapp#36f536#WhatsApp Prueba,fab fa-apple#73193a#IOS,fab fa-whatsapp#0aa223#CAPIWHA,fab fa-whatsapp-square#5ead63#Picky Assist - India,fab fa-whatsapp-square#88b152#Picky Assist - Production,fab fa-whatsapp#0d0d0d#ACME ,fab fa-facebook#4b992e#BOT05TST MURO,fab fa-facebook-messenger#f3dd4f#ZyxMe Analytics - Messenger,fab fa-whatsapp#cc1295#WHATSAPP SMOOCH GLOBALHITS,fab fa-line#cc0f3e#LINE,fab fa-youtube#ffc20b#YouTube (https://www.youtube.com/channel/UCHZz9yZSDQE5yahsWwx6MNw),fab fa-google-play#3298c7#Play Store (https://play.google.com/store/apps/developer?id=VCA+Per%C3%BA)",
        "userstatusdate": "2021-09-01T17:41:15.596143",
        "userstatus": "ACTIVO",
        "userstatustype": "LOGIN",
        "motivetype": ""
    },
    {
        "userid": 267,
        "name": "Gera2 Puntillo",
        "groups": "GR00,GR01",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-facebook-messenger#c53268#Bot05TsTs",
        "userstatusdate": null,
        "userstatus": null,
        "userstatustype": null,
        "motivetype": null
    },
    {
        "userid": 225,
        "name": "Geraldine Puntillo Puntillo",
        "groups": "",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-facebook-messenger#c53268#Bot05TsTs",
        "userstatusdate": "2020-11-12T18:54:04.449718",
        "userstatus": "DESCONECTADO",
        "userstatustype": "EXPIRACION",
        "motivetype": null
    },
    {
        "userid": 226,
        "name": "Geraldine Puntillo Puntillo",
        "groups": "",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-facebook-messenger#c53268#Bot05TsTs",
        "userstatusdate": "2020-11-06T17:51:12.83312",
        "userstatus": "DESCONECTADO",
        "userstatustype": "LOGOUT",
        "motivetype": ""
    },
    {
        "userid": 152,
        "name": "Geraldine Puntillo Puntillo",
        "groups": "GR01,GR02,GR00,GR03",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 1,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-whatsapp#55c846#UNABLE - Whatsapp Personas,fab fa-twitter#1a82ea#Twitter Muro (https://twitter.com/vcaperudev),fa fa-globe#627384#Chat Web DEV,fab fa-facebook-messenger#c53268#Bot05TsTs,fab fa-instagram#a922b0#VCA Instagram,fab fa-whatsapp#36f536#WhatsApp Prueba,fab fa-facebook#4b992e#BOT05TST MURO,fab fa-youtube#ffc20b#YouTube (https://www.youtube.com/channel/UCHZz9yZSDQE5yahsWwx6MNw),fab fa-google-play#3298c7#Play Store (https://play.google.com/store/apps/developer?id=VCA+Per%C3%BA),fab fa-twitter-square#218ce3#Twitter Messenger (https://twitter.com/vcaperudev)",
        "userstatusdate": "2021-08-28T02:34:03.886849",
        "userstatus": "DESCONECTADO",
        "userstatustype": "EXPIRACION",
        "motivetype": null
    },
    {
        "userid": 681,
        "name": "Graci Briggite",
        "groups": "",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fa fa-globe#627384#Chat Web DEV,fab fa-facebook-messenger#c53268#Bot05TsTs,fab fa-facebook-messenger#ea0f0f#Facebook Direct Message,fab fa-whatsapp#36f536#WhatsApp Prueba",
        "userstatusdate": "2021-09-01T17:06:00.260759",
        "userstatus": "DESCONECTADO",
        "userstatustype": "EXPIRACION",
        "motivetype": null
    },
    {
        "userid": 29,
        "name": "JOSE LUIS PEDRO JOHN CORDOVA GORDILLO",
        "groups": "GR01,GR00,GR02",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-whatsapp#55c846#UNABLE - Whatsapp Personas,fa fa-globe#4726da#UNABLE - WEB MSG DEV - https://vcaperu.com:444/chatweb/zyxmetest/,fab fa-whatsapp#66e3cc#Banco Azteca Demo WA,fab fa-android#73193a#DEMO APP ANDROID (Bitel),fa fa-globe#072565#Demo Chatflow VV - WEB,fab fa-facebook-messenger#000000#NanoBot05Dev 09:07,fab fa-twitter#092f54#TWITTERVCAPERUDEV,fab fa-whatsapp#e8e7ba#Demo Chatflow VV - WA Sandbox,fa fa-globe#627384#Test Canal Chatflow,fab fa-facebook-messenger#c53268#Bot05TsTs,fab fa-facebook#627384#Bot05 Dev - Wall,fab fa-facebook-messenger#ea0f0f#Facebook Direct Message,fab fa-whatsapp#36f536#WhatsApp Prueba,fab fa-whatsapp#0d0d0d#ACME ",
        "userstatusdate": "2021-08-06T16:09:54.129579",
        "userstatus": "DESCONECTADO",
        "userstatustype": "LOGOUT",
        "motivetype": ""
    },
    {
        "userid": 153,
        "name": "Javier Arce",
        "groups": "GR00,GR01,GR02",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fa fa-globe#627384#Chat Web DEV,fab fa-facebook-messenger#c53268#Bot05TsTs,fab fa-facebook-messenger#ea0f0f#Facebook Direct Message",
        "userstatusdate": "2021-08-26T18:10:04.67502",
        "userstatus": "DESCONECTADO",
        "userstatustype": "EXPIRACION",
        "motivetype": null
    },
    {
        "userid": 306,
        "name": "José Carlos Quispe",
        "groups": "",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-whatsapp#0d0d0d#ACME ",
        "userstatusdate": null,
        "userstatus": null,
        "userstatustype": null,
        "motivetype": null
    },
    {
        "userid": 283,
        "name": "José Carlos Quispe",
        "groups": "GR01",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-whatsapp#66e3cc#Banco Azteca Demo WA",
        "userstatusdate": null,
        "userstatus": null,
        "userstatustype": null,
        "motivetype": null
    },
    {
        "userid": 685,
        "name": "José Quispe",
        "groups": "GR02",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-whatsapp#0d0d0d#ACME ",
        "userstatusdate": "2021-07-07T16:56:56.735382",
        "userstatus": "DESCONECTADO",
        "userstatustype": "EXPIRACION",
        "motivetype": null
    },
    {
        "userid": 113,
        "name": "José Quispe",
        "groups": "GR00,48,GR01,GR02,GR03,GRSA",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fa fa-globe#627384#Chat Web DEV",
        "userstatusdate": "2021-08-06T22:56:44.394011",
        "userstatus": "DESCONECTADO",
        "userstatustype": "EXPIRACION",
        "motivetype": null
    },
    {
        "userid": 67,
        "name": "Michi Arteaga",
        "groups": "",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-whatsapp#55c846#UNABLE - Whatsapp Personas,fa fa-globe#4726da#UNABLE - WEB MSG DEV - https://vcaperu.com:444/chatweb/zyxmetest/,fab fa-facebook#0f25a2#UNABLE - Facebook Personas VCA Peru,fab fa-facebook#1bcae5#UNABLE - Facebook Personas - Test Bot02,fab fa-facebook-messenger#1cccf3#UNABLE - Messenger Personas Demo (Sin Bot)",
        "userstatusdate": null,
        "userstatus": null,
        "userstatustype": null,
        "motivetype": null
    },
    {
        "userid": 220,
        "name": "Prueba Balanceo",
        "groups": "GR00,GR01,GR02,GR03",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-whatsapp#0aa223#CAPIWHA",
        "userstatusdate": "2020-10-23T14:33:51.580541",
        "userstatus": "DESCONECTADO",
        "userstatustype": "LOGOUT",
        "motivetype": ""
    },
    {
        "userid": 63,
        "name": "Tulio Ortiz",
        "groups": "",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-whatsapp#55c846#UNABLE - Whatsapp Personas,fa fa-globe#4726da#UNABLE - WEB MSG DEV - https://vcaperu.com:444/chatweb/zyxmetest/,fab fa-facebook#0f25a2#UNABLE - Facebook Personas VCA Peru,fab fa-facebook#1bcae5#UNABLE - Facebook Personas - Test Bot02,fab fa-facebook-messenger#1cccf3#UNABLE - Messenger Personas Demo (Sin Bot),fab fa-facebook-messenger#fbb02f#Demo VV - Facebook Smooch",
        "userstatusdate": null,
        "userstatus": null,
        "userstatustype": null,
        "motivetype": null
    },
    {
        "userid": 288,
        "name": "adm Puntillo",
        "groups": "",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-whatsapp#0d0d0d#ACME ",
        "userstatusdate": "2021-05-07T03:30:26.939722",
        "userstatus": "DESCONECTADO",
        "userstatustype": "LOGOUT",
        "motivetype": ""
    },
    {
        "userid": 237,
        "name": "andrea lau",
        "groups": "GR00,GR01,GR02,GR03,GRSA",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-facebook-messenger#c53268#Bot05TsTs",
        "userstatusdate": "2021-02-05T16:42:03.650016",
        "userstatus": "DESCONECTADO",
        "userstatustype": "EXPIRACION",
        "motivetype": null
    },
    {
        "userid": 123,
        "name": "asdweq sddwqe",
        "groups": "GR01",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-whatsapp#55c846#UNABLE - Whatsapp Personas,fa fa-globe#4726da#UNABLE - WEB MSG DEV - https://vcaperu.com:444/chatweb/zyxmetest/,fab fa-facebook#0f25a2#UNABLE - Facebook Personas VCA Peru,fab fa-facebook#1bcae5#UNABLE - Facebook Personas - Test Bot02,fab fa-facebook-messenger#1cccf3#UNABLE - Messenger Personas Demo (Sin Bot),fab fa-twitter#1a82ea#Twitter Muro (https://twitter.com/vcaperudev),fab fa-facebook-messenger#fbb02f#Demo VV - Facebook Smooch,fab fa-whatsapp#dab317#UNABLE - WSP VCA Testing con Capiwha,fab fa-whatsapp#66e3cc#Banco Azteca Demo WA,fab fa-facebook#627384#VCA Public Muro Bot11DeV,fab fa-android#73193a#DEMO APP ANDROID (Bitel),fa fa-globe#072565#Demo Chatflow VV - WEB,fa fa-globe#627384#Chat Web DEV,fab fa-facebook-messenger#000000#NanoBot05Dev 09:07,fab fa-twitter#092f54#TWITTERVCAPERUDEV,fab fa-whatsapp#e8e7ba#Demo Chatflow VV - WA Sandbox,fa fa-globe#627384#Test Canal Chatflow,fab fa-facebook-messenger#c53268#Bot05TsTs,fab fa-instagram#a922b0#VCA Instagram,fab fa-facebook#627384#Bot05 Dev - Wall,fab fa-whatsapp#627384#WHAC TEST CAMPAIGN",
        "userstatusdate": null,
        "userstatus": null,
        "userstatustype": null,
        "motivetype": null
    },
    {
        "userid": 228,
        "name": "asesor  grupo1",
        "groups": "GR01",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-facebook-messenger#c53268#Bot05TsTs",
        "userstatusdate": "2021-07-26T15:32:59.323478",
        "userstatus": "DESCONECTADO",
        "userstatustype": "EXPIRACION",
        "motivetype": null
    },
    {
        "userid": 690,
        "name": "asesor alvin",
        "groups": "GR01",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-facebook-messenger#c53268#Bot05TsTs,fab fa-facebook-messenger#ea0f0f#Facebook Direct Message",
        "userstatusdate": "2021-08-10T00:21:44.133312",
        "userstatus": "DESCONECTADO",
        "userstatustype": "EXPIRACION",
        "motivetype": null
    },
    {
        "userid": 206,
        "name": "asesor prueba",
        "groups": "",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fa fa-globe#627384#Chat Web DEV,fab fa-facebook-messenger#c53268#Bot05TsTs",
        "userstatusdate": "2020-08-19T22:07:53.147372",
        "userstatus": "DESCONECTADO",
        "userstatustype": "EXPIRACION",
        "motivetype": null
    },
    {
        "userid": 693,
        "name": "asesor.vca asesor.vca",
        "groups": "GR00",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-whatsapp-square#cf2626#360DIALOG Production",
        "userstatusdate": "2021-08-20T15:19:23.674572",
        "userstatus": "DESCONECTADO",
        "userstatustype": "LOGOUT",
        "motivetype": ""
    },
    {
        "userid": 231,
        "name": "asesor1 grupo0",
        "groups": "GR00",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-facebook-messenger#c53268#Bot05TsTs",
        "userstatusdate": null,
        "userstatus": null,
        "userstatustype": null,
        "motivetype": null
    },
    {
        "userid": 232,
        "name": "asesor2 grupo0",
        "groups": "GR00",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-whatsapp#36f536#WhatsApp Prueba",
        "userstatusdate": null,
        "userstatus": null,
        "userstatustype": null,
        "motivetype": null
    },
    {
        "userid": 125,
        "name": "david farro",
        "groups": "",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fa fa-globe#4726da#UNABLE - WEB MSG DEV - https://vcaperu.com:444/chatweb/zyxmetest/,fab fa-facebook#1bcae5#UNABLE - Facebook Personas - Test Bot02,fab fa-twitter#1a82ea#Twitter Muro (https://twitter.com/vcaperudev),fa fa-globe#072565#Demo Chatflow VV - WEB,fa fa-globe#627384#Chat Web DEV,fab fa-whatsapp#e8e7ba#Demo Chatflow VV - WA Sandbox",
        "userstatusdate": "2020-07-07T19:23:52.574719",
        "userstatus": "DESCONECTADO",
        "userstatustype": "EXPIRACION",
        "motivetype": null
    },
    {
        "userid": 32,
        "name": "gianella admin",
        "groups": "GR01",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-whatsapp#55c846#UNABLE - Whatsapp Personas,fa fa-globe#4726da#UNABLE - WEB MSG DEV - https://vcaperu.com:444/chatweb/zyxmetest/,fab fa-facebook#0f25a2#UNABLE - Facebook Personas VCA Peru,fab fa-facebook#1bcae5#UNABLE - Facebook Personas - Test Bot02,fab fa-facebook-messenger#1cccf3#UNABLE - Messenger Personas Demo (Sin Bot),fab fa-twitter#1a82ea#Twitter Muro (https://twitter.com/vcaperudev),fab fa-facebook-messenger#fbb02f#Demo VV - Facebook Smooch",
        "userstatusdate": null,
        "userstatus": null,
        "userstatustype": null,
        "motivetype": null
    },
    {
        "userid": 217,
        "name": "grachi sanchez",
        "groups": "",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fa fa-globe#627384#Chat Web DEV,fab fa-facebook-messenger#c53268#Bot05TsTs,fab fa-facebook#627384#Bot05 Dev - Wall,fab fa-facebook-messenger#ea0f0f#Facebook Direct Message,fab fa-whatsapp#36f536#WhatsApp Prueba",
        "userstatusdate": "2021-09-01T17:10:00.427725",
        "userstatus": "DESCONECTADO",
        "userstatustype": "EXPIRACION",
        "motivetype": null
    },
    {
        "userid": 111,
        "name": "jose vara",
        "groups": "GR01,GR02",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-facebook#1bcae5#UNABLE - Facebook Personas - Test Bot02,fa fa-globe#627384#Chat Web DEV,fab fa-facebook-messenger#c53268#Bot05TsTs",
        "userstatusdate": "2020-09-30T21:24:04.355877",
        "userstatus": "DESCONECTADO",
        "userstatustype": "EXPIRACION",
        "motivetype": null
    },
    {
        "userid": 286,
        "name": "probando Puntillo",
        "groups": "",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-facebook-messenger#c53268#Bot05TsTs",
        "userstatusdate": "2021-05-17T17:22:02.564744",
        "userstatus": "DESCONECTADO",
        "userstatustype": "EXPIRACION",
        "motivetype": null
    },
    {
        "userid": 285,
        "name": "prueba Puntillo",
        "groups": "",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fa fa-globe#627384#Chat Web DEV,fab fa-facebook-messenger#c53268#Bot05TsTs",
        "userstatusdate": "2021-05-17T22:25:01.883451",
        "userstatus": "DESCONECTADO",
        "userstatustype": "EXPIRACION",
        "motivetype": null
    },
    {
        "userid": 691,
        "name": "prueba Puntillo",
        "groups": "GR01",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-facebook-messenger#c53268#Bot05TsTs",
        "userstatusdate": "2021-07-13T17:10:45.633274",
        "userstatus": "DESCONECTADO",
        "userstatustype": "LOGOUT",
        "motivetype": ""
    },
    {
        "userid": 702,
        "name": "prueba admin3.3",
        "groups": "",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-facebook-messenger#ea0f0f#Facebook Direct Message",
        "userstatusdate": "2021-08-18T05:33:28.36122",
        "userstatus": "DESCONECTADO",
        "userstatustype": "EXPIRACION",
        "motivetype": null
    },
    {
        "userid": 700,
        "name": "prueba bcA",
        "groups": "",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-facebook-messenger#c53268#Bot05TsTs",
        "userstatusdate": "2021-08-11T19:28:37.912258",
        "userstatus": "DESCONECTADO",
        "userstatustype": "EXPIRACION",
        "motivetype": null
    },
    {
        "userid": 207,
        "name": "prueba de borrado",
        "groups": "",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-facebook-messenger#c53268#Bot05TsTs",
        "userstatusdate": null,
        "userstatus": null,
        "userstatustype": null,
        "motivetype": null
    },
    {
        "userid": 662,
        "name": "prueba sanchez",
        "groups": "",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-facebook-messenger#c53268#Bot05TsTs",
        "userstatusdate": null,
        "userstatus": null,
        "userstatustype": null,
        "motivetype": null
    },
    {
        "userid": 115,
        "name": "qeqewee qweqweqwe",
        "groups": "",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-whatsapp#66e3cc#Banco Azteca Demo WA",
        "userstatusdate": null,
        "userstatus": null,
        "userstatustype": null,
        "motivetype": null
    },
    {
        "userid": 602,
        "name": "rol prueba",
        "groups": "GR00,GR01",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-facebook-messenger#c53268#Bot05TsTs",
        "userstatusdate": "2021-06-07T17:13:10.360382",
        "userstatus": "DESCONECTADO",
        "userstatustype": "LOGOUT",
        "motivetype": ""
    },
    {
        "userid": 229,
        "name": "supervisor Ramirez",
        "groups": "",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-facebook-messenger#c53268#Bot05TsTs",
        "userstatusdate": "2020-11-06T19:52:04.746597",
        "userstatus": "DESCONECTADO",
        "userstatustype": "LOGOUT",
        "motivetype": ""
    },
    {
        "userid": 223,
        "name": "supervisor grupo0",
        "groups": "GR00,GR01,GR02,GR03",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-facebook-messenger#c53268#Bot05TsTs",
        "userstatusdate": "2021-08-18T16:48:27.226899",
        "userstatus": "DESCONECTADO",
        "userstatustype": "EXPIRACION",
        "motivetype": null
    },
    {
        "userid": 227,
        "name": "supervisor1  grupo1",
        "groups": "GR01",
        "countAnwsered": 0,
        "coundPending": 0,
        "countActive": 0,
        "countPaused": 0,
        "countClosed": 0,
        "status": "DESCONECTADO",
        "channels": "fab fa-facebook-messenger#c53268#Bot05TsTs",
        "userstatusdate": "2021-07-26T23:15:38.682339",
        "userstatus": "DESCONECTADO",
        "userstatustype": "LOGOUT",
        "motivetype": ""
    }
]

interface AgentProps {
    userid: number;
    name: string;
    countActive: number;
    countPaused: number;
    countClosed: number;
    coundPending: number;
    status: string | null;
    channels: string
}

interface BadgePropsTmp extends BadgeProps {
    colortmp: any;
}

const StyledBadge = withStyles((theme) => ({
    badge: (props: any) => ({
        backgroundColor: props.colortmp,
        color: props.colortmp,
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    }),
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}))(({ ...props }: BadgePropsTmp) => <Badge {...props} />);

const CountTicket: FC<{ label: string, count: number, color: string }> = ({ label, count, color }) => (
    <div style={{ position: 'relative' }}>
        <div style={{ color: color, padding: '4px 6px', whiteSpace: 'nowrap', fontSize: '14px' }}>{label}: {count}</div>
        <div style={{ backgroundColor: color, width: '100%', height: '28px', opacity: '0.1', position: 'absolute', top: 0, left: 0 }}></div>
    </div>
)

const ChannelTicket: FC<{ channelName: string, channelType: string, color: string }> = ({ channelName, channelType, color }) => (
    <div>
        <Tooltip title={channelName}>
            <LanguageIcon style={{ width: '20px', height: '20px', color }} />
        </Tooltip>
    </div>
)

const ItemAgent: FC<AgentProps> = ({ name, status, countActive, countPaused, countClosed, coundPending, channels }) => {
    const classes = useStyles();
    return (
        <div className={classes.containerItemAgent}>
            <div className={classes.agentUp}>

                <StyledBadge
                    overlap="circular"
                    colortmp={status === "ACTIVO" ? "#44b700" : "#b41a1a"}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    variant="dot"
                >
                    <Avatar>{name.split(" ").reduce((acc, item) => acc + (acc.length < 2 ? item.substring(0, 1).toUpperCase() : ""), "")}</Avatar>
                </StyledBadge>
                <div>
                    <div className={classes.agentName}>{name}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {channels.split(',').map((channel, index) => {
                            const [channelType, color, channelName] = channel.split('#');
                            return <ChannelTicket key={index} channelName={channelName} channelType={channelType} color={color} />
                        })}
                    </div>
                </div>
            </div>
            <div className={classes.counterCount}>
                <CountTicket
                    label="Active"
                    count={countActive}
                    color="#55BD84"
                />
                <CountTicket
                    label="Paused"
                    count={countPaused}
                    color="#FF7700"
                />
                <CountTicket
                    label="Closed"
                    count={countClosed}
                    color="#FB5F5F"
                />
                <CountTicket
                    label="Pending"
                    count={coundPending}
                    color="#FB5F5F"
                />
            </div>
        </div>
    )
}

const filterAboutStatusName = (data: AgentProps[], page: number, searchName: string): AgentProps[] => {
    if (page === 0 && searchName === "") {
        return data;
    }
    if (page === 0 && searchName !== "") {
        return data.filter(item => item.name.toLowerCase().includes(searchName.toLowerCase()));
    }
    if (page === 1 && searchName === "") {
        return data.filter(item => item.status === "ACTIVO");
    }
    if (page === 1 && searchName !== "") {
        return data.filter(item => item.status === "ACTIVO" && item.name.toLowerCase().includes(searchName.toLowerCase()));
    }
    if (page === 2 && searchName === "") {
        return data.filter(item => item.status !== "ACTIVO");
    }
    if (page === 2 && searchName !== "") {
        return data.filter(item => item.status !== "ACTIVO" && item.name.toLowerCase().includes(searchName.toLowerCase()));
    }
    return data;
}

const AgentPanel: FC<{ classes: any }> = ({ classes }) => {
    const [showSearch, setShowSearch] = useState(false);
    const [search, setSearch] = useState("");
    const [pageSelected, setPageSelected] = useState(0);
    const [agentsToShow, setAgentsToShow] = useState<AgentProps[]>(agentstt);

    const onChangeSearchAgent = (e: any) => {
        setSearch(e.target.value)
        setAgentsToShow(filterAboutStatusName(agentstt, pageSelected, e.target.value));
    }

    useEffect(() => {
        setAgentsToShow(filterAboutStatusName(agentstt, pageSelected, search));
    }, [pageSelected])

    return (
        <div className={classes.containerAgents} style={{ backgroundColor: 'white' }}>
            <div style={{ paddingRight: '16px', paddingLeft: '16px' }}>
                {!showSearch ?
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div className={classes.title}>
                            Supervisor
                        </div>
                        <IconButton onClick={() => setShowSearch(true)} edge="end">
                            <SearchIcon />
                        </IconButton>
                    </div> :
                    <TextField
                        color="primary"
                        fullWidth
                        autoFocus
                        style={{ marginTop: '8px', marginBottom: '8px' }}
                        onBlur={() => !search && setShowSearch(false)}
                        onChange={onChangeSearchAgent}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton edge="end">
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>)
                        }}
                    />
                }
            </div>
            <Tabs
                value={pageSelected}
                indicatorColor="primary"
                variant="fullWidth"
                style={{ borderBottom: '1px solid #EBEAED' }}
                textColor="primary"
                onChange={(_, value) => setPageSelected(value)}
            >
                <AntTab label="All advisor" />
                <AntTab label="Active" />
                <AntTab label="Inactive" />
            </Tabs>
            <div style={{ overflowY: 'auto' }}>
                {agentsToShow.map((agent) => (<ItemAgent key={agent.userid} {...agent} />))}
            </div>
        </div>
    )
}

const Supervisor: FC = () => {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <AgentPanel classes={classes} />
            <ChatPanel />
        </div>
    )
}

export default Supervisor;