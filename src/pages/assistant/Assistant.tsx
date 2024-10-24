/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { AntTab } from 'components';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Tabs } from '@material-ui/core';
import { Intentions } from './Intentions';
import { Entities } from './Entities';
import { Dialog } from './Dialog';
import { TestWitai } from './TestWitai';


export const Assistant: FC = () => {

    const { t } = useTranslation();
    const user = useSelector(state => state.login.validateToken.user);

    const [pageSelected, setPageSelected] = useState(user?.roledesc?.includes("SUPERADMIN") ? 0 : 6);


    return (
        <div style={{ width: '100%' }}>
            <Tabs
                value={pageSelected}
                indicatorColor="primary"
                variant="fullWidth"
                style={{ borderBottom: '1px solid #EBEAED', backgroundColor: '#FFF', marginTop: 8 }}
                textColor="primary"
                onChange={(_, value) => setPageSelected(value)}
            >
                {user?.roledesc?.includes("SUPERADMIN") && <AntTab label={t(langKeys.intentions)} />
                }
                {user?.roledesc?.includes("SUPERADMIN") &&
                    <AntTab label={t(langKeys.entities)} />
                }
                {user?.roledesc?.includes("SUPERADMIN") &&
                    <AntTab label={"Test"} />
                }
                {user?.roledesc?.includes("SUPERADMIN") &&
                    <AntTab label={t(langKeys.dialog)} />
                }
            </Tabs>
            {pageSelected === 0 &&
                <div style={{ marginTop: 16 }}>
                    <Intentions />
                </div>
            }
            {pageSelected === 1 &&
                <div style={{ marginTop: 16 }}>
                    <Entities />
                </div>
            }
            {pageSelected === 2 &&
                <div style={{ marginTop: 16, height:"100%" }}>
                    <TestWitai />
                </div>
            }
            {pageSelected === 3 &&
                <div style={{ marginTop: 16, height:"100%" }}>
                    <Dialog />
                </div>
            }
        </div>
    );
}

export default Assistant;