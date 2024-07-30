import React, { useEffect } from 'react'
import { SkeletonInteraction } from 'components'
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import {  Dictionary, IGroupInteraction } from '@types';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import Button from '@material-ui/core/Button';
import { Trans } from 'react-i18next';
import { DownloadIcon } from 'icons';
import DomToImage from 'dom-to-image';
import IOSSwitch from "components/fields/IOSSwitch";
import Tooltip from '@material-ui/core/Tooltip';
import { useParams } from 'react-router-dom';
import ItemGroupInteraction from 'components/inbox/Interaction';
import { getConversationData, getInteractionData } from 'store/conversation/actions';

const useStyles = makeStyles((theme) => ({
    containerPanel: {
        flex: '1',
        display: 'flex'
    },
    titleTicketChat: {
        fontWeight: 'bold',
        fontSize: 15,
        // '&:hover': {
        //     cursor: 'pointer',
        //     borderBottom: '1px solid #2E2C34'
        // }
    },
    interactionAgent: {
        marginLeft: 'auto'
    },
    groupInteractionAgent: {
        marginLeft: 'auto',
        display: 'flex'
    },
    containerTickets: {
        flex: '0 0 300px',
        maxWidth: 300,
        backgroundColor: '#FFF',
        flexDirection: 'column',
        display: 'flex',
        borderRight: '1px solid #84818a1a'
    },
    headChat: {
        backgroundColor: '#FFF',
        padding: theme.spacing(1),
        borderBottom: '1px solid #84818a1a',
        display: 'flex',
        justifyContent: 'space-between',
        cursor: 'pointer'
    },
    containerInteractions: {
        padding: theme.spacing(2),
        flex: 1,
        // overflowY: 'auto',
        // backgroundColor: '#e0e0e0',
        background: 'linear-gradient(90deg, rgba(119,33,173,0.7203256302521008) 35%, rgba(189,240,249,1) 100%)'
    },
    containerQuickreply: {
        whiteSpace: 'break-spaces',
        flexWrap: 'wrap',
        fontStyle: 'normal',
        fontWeight: 'normal',
        display: 'flex',
        gap: theme.spacing(1),
    },
    containerPostback: {
        width: 200,
        padding: 0,
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: 2,
        borderRadius: 25
    },
    headerPostback: {
        textAlign: 'center',
        backgroundColor: 'rgb(132 129 138 / 0.4);',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    itemSelected: {
        backgroundColor: 'rgb(235, 234, 237, 0.50)'
    },
    buttonPostback: {
        color: theme.palette.primary.main,
        cursor: 'pointer',
        textAlign: 'center',
        borderTop: '1px solid #EBEAED',
        '&:hover': {
            color: theme.palette.primary.dark,
        }
    },
    buttonQuickreply: {
        padding: `0 ${theme.spacing(1)}px`,
        backgroundColor: theme.palette.primary.main,
        borderRadius: '6px',
        color: '#FFF',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        }
    },
    interactionText: {
        whiteSpace: 'break-spaces',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: 2,
        color: '#2E2C34',
        wordBreak: 'break-word',
        width: 'fit-content',
        borderRadius: 12,
        borderBottomLeftRadius: 0,
        padding: `${theme.spacing(.5)}px ${theme.spacing(1)}px ${theme.spacing(.7)}px ${theme.spacing(1)}px`,
        position: 'relative',
        maxWidth: 480,
        backgroundColor: '#FFF',
        border: '1px solid #EBEAED',
        // boxShadow: '0 1px 2px 0 rgb(16 35 47 / 15%)'
    },
    interactionTextAgent: {
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 0,
        backgroundColor: "#eeffde",
    },
    interactionImage: {
        borderRadius: theme.spacing(1.5),
        backgroundColor: '#FFF',
        position: 'relative',
        width: '328px',
        height: '340px',
    },
    imageCard: {
        width: '100%',
        maxWidth: '100%',
        cursor: 'pointer',
        objectFit: 'cover',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        borderRadius: 'inherit'
    },
    timeInteraction: {
        color: '#84818A',
        fontSize: 13,
        fontStyle: 'normal',
        fontWeight: 'normal',
        lineHeight: 2,
    },
    containerResponse: {
        padding: theme.spacing(2),
        background: '#FFF',
        position: 'relative',
        borderTop: '1px solid #84818a1a'
    },
    containerChat: {
        flex: '1',
        flexDirection: 'column',
        display: 'flex',

    },
    collapseInfo: {
        position: 'absolute',
        top: 'calc(50% - 20px)'
    },
    infoOpen: {
        right: -20,
    },
    infoClose: {
        right: 0,
    },
    containerProfile: {
        flex: '0 0 300px',
        display: 'none'
    },
    iconResponse: {
        cursor: 'pointer',
        poisition: 'relative',
        color: '#2E2C34',
        '&:hover': {
            // color: theme.palette.primary.main,
            backgroundColor: '#EBEAED',
            borderRadius: 4
        }
    },
    iconSend: {
        background: "#5542F6",
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        cursor: 'pointer',
    },
    iconSendDisabled: {
        backgroundColor: "#EBEAED",
        cursor: 'not-allowed',
    },
    containerButtonsChat: {
        display: 'flex',
    },
    iconHelpText: {
        width: 15,
        height: 15,
        cursor: 'pointer',
    },
    buttonCloseticket: {
        background: '#F9F9FA',
        border: '1px solid #EBEAED',
        boxSizing: 'border-box',
        borderRadius: '4px',
        width: '150px',
        height: '42px',
        fontFamily: 'Manrope',
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#ececec'
        }
    },
    interactionFromPost: {
        display: 'flex',
        gap: 8
    },
    buttonIcon: {
        width: 48,
        height: 42,
        border: '1px solid #EBEAED',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#ececec'
        }
    },
    container: {
        display: 'flex',
        gap: theme.spacing(2),
        width: '100%'
    },
    containerItemTicket: {
        display: 'flex',
        gap: theme.spacing(1),
        alignItems: 'center',
        padding: theme.spacing(1),
        borderBottom: '1px solid #EBEAED',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'rgb(235, 234, 237, 0.18)'
        }
    },
    containerNewMessages: {
        minWidth: '22px',
        padding: '0px 4px',
        borderRadius: 12,
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        textAlign: 'center'
    },
    name: {
        flex: 1,
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '22px',
        wordBreak: 'break-word',

        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        maxWidth: 200
    },
    containerQuickReply: {
        boxShadow: '0px 3px 6px rgb(0 0 0 / 10%)',
        backgroundColor: '#FFF',
        width: 250,
    },
    headerQuickReply: {
        fontSize: 13,
        fontWeight: 500,
        padding: theme.spacing(1.5),
        borderBottom: '1px solid #EBEAED'
    },
    itemQuickReply: {
        fontSize: 13,
        paddingTop: theme.spacing(.7),
        paddingBottom: theme.spacing(.7),
        paddingLeft: theme.spacing(1.5),
        paddingRight: theme.spacing(1.5),
        '&:hover': {
            backgroundColor: '#EBEAED',
            cursor: 'pointer'
        }
    }
}));


const Conversation= () => {
    
    const { token }: any = useParams();
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const [showAllInteraction, setShowAllInteraction] = React.useState(false)
    const conversationData = useSelector(state => state.conversation.conversationData);
    const [interactionsToShow, setinteractionsToShow] = React.useState<IGroupInteraction[]>([])
    const el = React.useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        dispatch(getConversationData(token))
    }, [])

    const GenericPdfDownloader: React.FC<{ downloadFileName: string }> = ({ downloadFileName }) => {
        const downloadPdfDocument = () => {
            import('jspdf').then(jsPDF => {
                if (el.current) {
                    const gg = document.createElement('div');
                    gg.style.display = 'flex';
                    gg.style.flexDirection = 'column';
                    gg.style.gap = '8px';
                    gg.style.width = '190mm';
                    gg.id = "newexportcontainer"

                    gg.innerHTML = el.current.innerHTML;

                    gg.querySelectorAll(".interaction-gmap").forEach(x => x.remove())
                    gg.querySelectorAll(".interaction-gmap-text").forEach(x => (x as HTMLDivElement).style.display = "")

                    document.body.appendChild(gg);
                    const pdf = new jsPDF.jsPDF('p', 'mm');
                    if (pdf) {
                        DomToImage.toPng(gg, { cacheBust: true })
                            .then(imgData => {
                                const imgWidth = 200;
                                const pageHeight = 297;
                                const imgHeight = Math.ceil(gg.scrollHeight * 0.2645833333);
                                let heightLeft = imgHeight;
                                const doc = new jsPDF.jsPDF('p', 'mm');
                                const topPadding = 10;
                                let position = topPadding; // give some top padding to first page

                                doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                                heightLeft -= pageHeight;

                                while (heightLeft >= 0) {
                                    position = heightLeft - imgHeight + topPadding; // top padding for other pages
                                    doc.addPage();
                                    doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                                    heightLeft -= pageHeight;
                                }
                                doc.save(`ticket${conversationData?.ticket?.[0]?.ticketnum}.pdf`);
                                document.getElementById('newexportcontainer')?.remove();
                            });
                    }
                }
            });

        }
        return (
            <Button
                variant="contained"
                color="primary"
                onClick={downloadPdfDocument}
                startIcon={<DownloadIcon />}
            ><Trans i18nKey={langKeys.download} />
            </Button>
        )
    }

    useEffect(() => {
        if (showAllInteraction) {
            setinteractionsToShow(conversationData?.interactions||[])
        } else {
            setinteractionsToShow((conversationData?.interactions||[])?.map(x => ({
                ...x,
                interactions: x.interactions.filter(y => !y.isHide)
            })))
        }
    }, [showAllInteraction, conversationData.loading])

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: 600,
            margin: '0 auto', 
        }}>
            <div style={{display: "flex", padding: 10, width: "100%", justifyContent: "space-between"}}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', overflow: 'hidden', wordBreak: 'break-word', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: 120 }}>
                        {conversationData?.ticket?.[0]?.firstname + " " + conversationData?.ticket?.[0]?.lastname + " - " + conversationData?.ticket?.[0]?.ticketnum}
                    </div>
                </div>
                <GenericPdfDownloader
                    downloadFileName={`ticket-` + conversationData?.ticket?.[0]?.ticketnum}
                />
            </div>
            <div style={{ position: 'absolute', left: 16, bottom: 16 }}>
                <Tooltip title={t(langKeys.show_all) || ""} arrow >
                    <div>
                        <IOSSwitch checked={showAllInteraction} onChange={(e) => setShowAllInteraction(e.target.checked)} name="checkedB" />
                    </div>
                </Tooltip>
            </div>
            <div style={{width: 600}}>
                {conversationData.loading ? <SkeletonInteraction /> :
                    <div ref={el} className="scroll-style-go" style={{ display: 'flex', flexDirection: 'column', gap: 8, height: "93vh" }}>
                        {interactionsToShow.map((groupInteraction) => (
                            <ItemGroupInteraction
                                imageClient={conversationData?.ticket?.[0]?.imageurldef}
                                clientName={conversationData?.ticket?.[0]?.firstname + " " + conversationData?.ticket?.[0]?.lastname}
                                classes={classes}
                                groupInteraction={groupInteraction}
                                key={groupInteraction.interactionid} />
                        ))}
                    </div>
                }
            </div>
        </div>
    )
}

export default Conversation;