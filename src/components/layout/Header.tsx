import React from 'react';
import clsx from 'clsx';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
// import { useSelector } from 'hooks';
import { useSelector } from 'hooks';
import { AccountMenu, ManageOrganization } from 'components';

type IProps = {
    classes: any;
    title?: React.ReactNode;
    drawerWidth: number;
}

const Header = ({ classes, drawerWidth }: IProps) => {
    const openDrawer = useSelector(state => state.popus.openDrawer);

    return (
        <AppBar
            elevation={0}
            position="fixed"
            className={clsx(classes.appBar, {
                [classes.appBarShift]: openDrawer,
            })}
        >
            <Toolbar style={{ borderBottom: '1px solid #EBEAED', }}>
                <div style={{ width: 73, display: openDrawer ? 'none' : 'block' }} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        {/* <StatusConnection /> */}
                        <ManageOrganization />
                        <AccountMenu />
                    </div>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default Header;