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
                <p><b>1. Application Privacy Policy</b></p>
                <p>VCA Perú operates the Conversation Management Platform Laraigo <a href="https://laraigo.com/">https://laraigo.com/</a>. In this page, we inform you of our policies regarding the collection, use and disclosure of personal information we receive from users of the site.</p>
                <p>We use your personal information only for providing and improving the platform. By using Laraigo, you agree to the collection and use of information in accordance with this policy.</p>
                <p><b>2. Information Collection and Use</b></p>
                <ol style={{listStyleType: 'none'}}>
                    <li>
                        <p><b>2.1. Personal Information:</b> While using Laraigo, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personal identifiable information includes e-mail, name, last name, country, phone number and your current role in your company, all of which are asked as part of our sign-up process.</p>
                        <p>We use this information as part of our user creation process. The user created in sign-up can be identified by the data provided and can be used to contact the person that registered it.</p>
                    </li>
                    <li>
                        <p><b>2.2. Business Information:</b> While signing-up to Laraigo, we ask you to provide the following information about your business: Business or company name, industry field and business or company size.</p>
                        <p>We use this information as part of our user creation process. Each user created in our sign-up process is linked to a corporation that contains the data provided. We use the information in order to identify the user and contact him if needed.</p>
                    </li>
                    <li>
                        <p><b>2.3. Facebook Information:</b> In Laraigo, we offer the possibility to link your Facebook account to one of our apps in multiple occasions. In the following paragraphs we detail the information that is shared on each possible link and the way we use it.</p>
                        <ul style={{listStyleType: 'none'}}>
                            <li>
                                <p><b>2.3.1. Sign-up:</b> We offer the possibility to use your Facebook account in our sign-up process. If you agree to link your Facebook account as a mean to sign-up we receive the name of your account, e-mail and avatar picture.</p>
                                <p>We use the information provided as part of our user creation process. The user created by sign-up with a Facebook account can be identified by the data provided and can be used to contact the person that registered it if needed.</p>
                            </li>
                            <li>
                                <p><b>2.3.2. Channel Management:</b> We offer the possibility to link Facebook pages to our apps in our channel management module. In the linking process, we receive the following information of the page: The external id page and the name. In addition, by linking a Facebook page to our platform, you agree to share with us the following event-based information:</p>
                                <ul>
                                    <li>Posts created by the page</li>
                                    <li>Comments created by the page or other users in posts of the page</li>
                                    <li>Messages sent or received by the Messenger of the page</li>
                                    <li>Basic profile information of the users that interacted with the page (Name and avatar picture)</li>
                                </ul>
                                <p>We use the information provided as part of our channel management module. The information of the page is used to create a channel where the incoming events (Posts, comments and messages) are registered in our platform and processed as tickets. Some select users of the platform can then send replies to these tickets which are then shown as replies in Facebook.</p>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <p><b>2.4. Instagram Information:</b> In Laraigo, we offer the possibility to link your Instagram account to one of our apps.</p>
                        <ul style={{listStyleType: 'none'}}>
                            <li>
                                <p><b>2.4.1. Channel Management:</b> We offer the possibility to link Instagram pages to our apps in our channel management module. In the linking process, we receive the following information of the page: The external id page and the name. We also receive information about the linked Instagram Business account, including the id. In addition, by linking an Instagram page to our platform, you agree to share with us the following event-based information:</p>
                                <ul>
                                    <li>Comments created by the page or other users in posts of the page</li>
                                    <li>Messages sent or received by the Messenger of the page</li>
                                    <li>Basic profile information of the users that interacted with the page (Only username)</li>
                                </ul>
                                <p>We use the information provided as part of our channel management module. The information of the page is used to create a channel where the incoming events (Comments and messages) are registered in our platform and processed as tickets.  Some select users of the platform can then send replies to these tickets which are then shown as replies in Facebook.</p>
                            </li>
                        </ul>
                    </li>
                </ol>
                <p><b>3. Information Processing</b></p>
                <p>Laraigo is a conversation management platform. It aims to centralize multiple social channels into one website from which you and your partners will be able to reply to most of the incoming social events. The information collected and mentioned on the point 2 of this document is processed and used to feed the message inbox of your user or or your company's users. The comments, messages and posts made on your linked social channels will be shown as tickets, which you will be able to interact along with other things like bot automatization and real agent transferring.</p>
                <p><b>4. Security</b></p>
                <p>The security of your personal and business information is important to us. We don’t share or rent your information with third parties. The information submitted will only be available in our platform for you and the users you choose.</p>
                <p><b>5. Deletion Request</b></p>
                <p>We are open to any data deletion request if needed. To start the process, please contact us to the following e-mail: laraigo@vcaperu.com. Please, be clear in your request and provide the credentials that you have used in our sign-up process in order to identify the data that will be deleted. This process should take from 1 to 2 days.</p>
                <p><b>6. Changes to This Privacy Policy</b></p>
                <p>This Privacy Policy is effective as of 2021-11-17 and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.</p>
                <p>We reserve the right to update or change our Privacy Policy as any time and you should check this Privacy Policy periodically.</p>
                <p>If we make any changes to this Privacy Policy, we will notify either through the e-mail address you have provided us, or by placing a prominent notice in our website.</p>
                <p><b>7. Contact Us</b></p>
                <p>If you have any questions about this Privacy Policy, please contact us by using this e-mail: laraigo@vcaperu.com</p>
            </Box>
        </div>
    );
};


export default Privacy;
