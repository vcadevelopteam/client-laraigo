import { FC, useState } from "react";
import { Property } from "./index";
import { Trans } from "react-i18next";
import { SideDataProps } from "../model";

const InfoOverview: FC<SideDataProps> = ({ person, items }) => {

    return <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {items.map((x: any, index: number) => {
            return (
                <div
                    key={`dataindex-${index}`}
                    style={{
                        width: x.size === 2 ? "100%" : "calc(50% - 8px)",
                        flexBasis: x.size === 2 ? "100%" : "calc(50% - 8px)",
                        flexGrow: 1,
                    }}
                >
                    <Property
                        icon={x.icon}
                        title={<Trans i18nKey={x.field} />}
                        subtitle={person[x.field]}
                        mt={1}
                        mb={1}
                    />
                </div>
            );
        })}
    </div>
}

export default InfoOverview;