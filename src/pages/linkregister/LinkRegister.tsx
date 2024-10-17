import React from 'react';
import { FC, useEffect, useState } from "react";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { Dictionary } from "@types";
import { getCollection } from "store/main/actions";
import LinkRegisterMainView from './views/LinkRegisterMainView';
import LinkRegisterDetail from './views/LinkRegisterDetail';
import { registeredLinksSel } from 'common/helpers';

interface RowSelected {
	row: Dictionary | null;
	edit: boolean;
}

const LinkRegister: FC = () => {
	const dispatch = useDispatch();
	const mainResult = useSelector((state) => state.main);
	const [viewSelected, setViewSelected] = useState("main-view");
	const [rowSelected, setRowSelected] = useState<RowSelected>({
		row: null,
		edit: false,
	});

	function redirectFunc(view: string) {
		setViewSelected(view);
	}

	const fetchData = () => dispatch(getCollection(registeredLinksSel()));

	useEffect(() => {
		fetchData()
	}, []);

	if (viewSelected === "main-view") {
		if (mainResult.mainData.error) {
			return <h1>ERROR</h1>;
		}
		return (
			<LinkRegisterMainView
				setViewSelected={setViewSelected}
				setRowSelected={setRowSelected}
				fetchData={fetchData}
			/>
		);
	} else
		return (
			<LinkRegisterDetail
				data={rowSelected}
				setViewSelected={redirectFunc}
				fetchData={fetchData}
			/>
		);
};

export default LinkRegister;