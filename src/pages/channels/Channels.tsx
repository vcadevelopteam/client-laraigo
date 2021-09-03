import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import TableZyx from "components/fields/table-paginated";
import { useHistory } from "react-router";
import paths from "common/constants/paths";

export const Channels: FC = () => {
    const { t } = useTranslation();
    const history = useHistory();

    return (
        <div>
            <button onClick={() => history.push(paths.CHANNELS_ADD.resolve(1))}>Agregar</button>
            <TableZyx
                columns={[]}
                titlemodule={t(langKeys.user, { count: 2 })}
                data={[]}
                download={true}
                loading={false}
                register={true}
                hoverShadow={true}
                handleRegister={() => history.push(paths.CHANNELS_ADD.path)}
            />
        </div>
    );
};
