/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC } from 'react';

import { useParams } from 'react-router';

export const GetLocations: FC = () => {

    const { orgid, eventcode }: any = useParams();

    console.log(orgid, eventcode)
    
    return (
        <>
            <div>hola</div>
        </>
    )
}

export default GetLocations;