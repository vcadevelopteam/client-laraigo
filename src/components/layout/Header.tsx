import React from 'react';

import clsx from 'clsx';

import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import { useSelector } from 'hooks';
import { SearchField, StatusConnection, AccountMenu, NotificationMenu } from 'components';

type IProps = {
    classes: any;
    title?: React.ReactNode;
    drawerWidth: number;
}

const Header = ({ classes, drawerWidth }: IProps) => {
    const dataRes = useSelector(state => state.login);
    const openDrawer = useSelector(state =>  state.popus.openDrawer);

    return (
        <AppBar
            elevation={0}
            position="fixed"
            className={clsx(classes.appBar, {
                [classes.appBarShift]: openDrawer,
            })}
        >
            <Toolbar>
                <div style={{ width: 73, display: openDrawer ? 'none' : 'block' }} />
                <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
                    <div className={classes.title} style={{ width: '400px' }}>
                        <SearchField
                            colorPlaceHolder='#F9F9FA'
                        />
                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <StatusConnection />
                        <div style={{ width: 22 }} />
                        <NotificationMenu />
                        <div style={{ width: 24 }} />
                        <AccountMenu />
                    </div>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default Header;