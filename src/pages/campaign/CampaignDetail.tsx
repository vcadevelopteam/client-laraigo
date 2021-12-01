/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { getCampaignSel } from 'common/helpers';
import { Dictionary, ICampaign, MultiData } from "@types";
import { getCollectionAux, resetMainAux } from 'store/main/actions';
import { CampaignGeneral, CampaignPerson, CampaignMessage } from 'pages';
import { showBackdrop } from 'store/popus/actions';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}

interface DetailProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: () => void
}

export const CampaignDetail: React.FC<DetailProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData }) => {
    const dispatch = useDispatch();
    const auxResult = useSelector(state => state.main.mainAux);
    const [step, setStep] = useState("step-0");
    const [auxData, setAuxData] = useState<Dictionary[]>([]);
    const [detailData, setDetailData] = useState<ICampaign>({});
    const [waitView, setWaitView] = useState(false);
    
    const fetchDetailData = (id: number) => dispatch(getCollectionAux(getCampaignSel(id)));

    useEffect(() => {
        if (row !== null) {
            fetchDetailData(row?.id);
            dispatch(showBackdrop(true));
            setWaitView(true);
            return () => {
                dispatch(resetMainAux());
            };
        }
        else {
            setStep("step-1");
        }
    }, []);

    useEffect(() => {
        if (waitView) {
            if (!auxResult.loading && !auxResult.error && row !== null) {
                setAuxData(auxResult.data);
                dispatch(showBackdrop(false));
                setWaitView(false);
                setStep("step-1");
            }
        }
    }, [auxResult, waitView]);

    return (
        <div style={{ width: '100%' }}>
            {step === "step-1" ?
            <CampaignGeneral 
                row={row}
                edit={edit}
                auxdata={auxData}
                detaildata={detailData}
                setDetailData={setDetailData}
                setViewSelected={setViewSelected}
                step={step}
                setStep={setStep}
                multiData={multiData}
                fetchData={fetchData}
            />
            : null}
            {step === "step-2" ?
            <CampaignPerson 
                row={row}
                edit={edit}
                auxdata={auxData}
                detaildata={detailData}
                setDetailData={setDetailData}
                setViewSelected={setViewSelected}
                step={step}
                setStep={setStep}
                multiData={multiData}
                fetchData={fetchData}
            />
            : null}
            {step === "step-3" ?
            <CampaignMessage
                row={row}
                edit={edit}
                auxdata={auxData}
                detaildata={detailData}
                setDetailData={setDetailData}
                setViewSelected={setViewSelected}
                step={step}
                setStep={setStep}
                multiData={multiData}
                fetchData={fetchData}
            />
            : null}
        </div>
    )
}