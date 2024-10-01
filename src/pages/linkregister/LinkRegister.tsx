import React from 'react';
import { FC, useEffect, useState } from "react";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { Dictionary, IFetchData } from "@types";
import { getCollectionPaginated, getMultiCollectionAux } from "store/main/actions";
import { useTranslation } from "react-i18next";
import LinkRegisterMainView from './views/LinkRegisterMainView';
import LinkRegisterDetail from './views/LinkRegisterDetail';

interface RowSelected {
	row: Dictionary | null;
	edit: boolean;
}

const LinkRegister: FC = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const mainResult = useSelector((state) => state.main);
	const [viewSelected, setViewSelected] = useState("main-view");
	const [rowSelected, setRowSelected] = useState<RowSelected>({
		row: null,
		edit: false,
	});
	const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({
        daterange: null,
        filters: {},
        pageIndex: 0,
        pageSize: 20,
        sorts: {},
        distinct: null,
    });

	function redirectFunc(view: string) {
		setViewSelected(view);
	}

	/*const fetchData = ({ pageSize, pageIndex, filters, sorts, daterange }: IFetchData) => {
        setfetchDataAux({ ...fetchDataAux, ...{ pageSize, pageIndex, filters, sorts } });
        dispatch(
            getCollectionPaginated(
                getPaginatedMessageTemplate1({
                    enddate: daterange?.endDate!,
                    filters: filters,
                    skip: pageIndex * pageSize,
                    sorts: sorts,
                    startdate: daterange?.startDate!,
                    take: pageSize,
                    communicationchannelids: channelIds,
                })
            )
        );
    };*/

	useEffect(() => {
		//fetchData(fetchDataAux)
		dispatch(
			getMultiCollectionAux([

			])
		);
	}, []);

	if (viewSelected === "main-view") {
		if (mainResult.mainData.error) {
			return <h1>ERROR</h1>;
		}
		return (
			<LinkRegisterMainView
				setViewSelected={setViewSelected}
				setRowSelected={setRowSelected}
			/>
		);
	} else
		return (
			<LinkRegisterDetail
				data={rowSelected}
				setViewSelected={redirectFunc}
			/>
		);
};

export default LinkRegister;