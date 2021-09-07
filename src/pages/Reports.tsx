import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';

const Reports: FC = () => {
    const { t } = useTranslation();

    return  (
        <h1>{t(langKeys.report_plural)}</h1>
    );
}

export default Reports;