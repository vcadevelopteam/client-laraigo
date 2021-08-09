import React from "react";

export interface RouteConfig {
    key: string;
    description: React.ReactNode;
    path?: string;
    translationValues?: { [x: string]: any };
    icon?: (className: string) => React.ReactNode;
    show?: () => boolean;
}
