import React, { useEffect, useState } from 'react'; 
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { convertLocalDate, getCampaignReportExport } from 'common/helpers';
import { getCollectionAux, resetMainAux } from 'store/main/actions';
import { DialogZyx } from 'components';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import TableZyx from 'components/fields/table-simple';
import { ModalPropsReportCampaign } from 'pages/campaign';

export const ModalReportCampaign: React.FC<ModalPropsReportCampaign> = ({ openModal, setOpenModal, row }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainAux = useSelector(state => state.main.mainAux);
    const [waitView, setWaitView] = useState(false);

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.contact),
                accessor: 'contact',
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
            },
            {
                Header: t(langKeys.log),
                accessor: 'log',
            }
        ],
        []
    );

    const handleCancelModal = () => {
        setOpenModal(false);
    }

    useEffect(() => {
        if (row !== null) {
            dispatch(getCollectionAux(getCampaignReportExport(
                [{
                    campaignid: row.id.split('_')[0],
                    rundate: row.id.split('_')[1],
                }]
            )))
            setWaitView(true);
            return () => {
                dispatch(resetMainAux());
            };
        }
    }, []);

    useEffect(() => {
        if (waitView) {
            if (!mainAux.loading && !mainAux.error) {
                setWaitView(false);
            }
        }
    }, [mainAux, waitView]);

    return (
        <DialogZyx
            maxWidth="md"
            open={openModal}
            title={row ? `${row.title} ${convertLocalDate(row.rundate).toLocaleString()}` : ''}
            button1Type="button"
            buttonText1={t(langKeys.close)}
            handleClickButton1={handleCancelModal}
        >
            <div className="row-zyx">
                <TableZyx
                    columns={columns}
                    data={mainAux.data}
                    loading={mainAux.loading}
                    filterGeneral={false}
                    download={false}
                />
            </div>
        </DialogZyx>
    )
}   