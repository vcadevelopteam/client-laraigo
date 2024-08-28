import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

interface TrapezoidData {
    name: string;
    value: number;
    fill: string;
    count: number;
}

interface ProportionData {
    proportion: number;
}

interface TrapezoidProps {
    data: TrapezoidData[];
    proportionData: ProportionData[];
    spacing?: number;
}

const useStyles = makeStyles({
    trapezoidContainer: {
        width: '100%',
        maxWidth: '267px',
        margin: 'auto',
        display: 'flex',
        overflow: 'visible',
    },
    funnel: {
        width: '100%',
        overflow: 'visible',
    },
    trapezoidText: {
        fontSize: '22px',
        fill: '#fff',
        whiteSpace: 'nowrap',
        textAnchor: 'start',
        fontFamily: 'Times New Roman',

    },
    trapezoidTotalText: {
        fontSize: '8px',
        fill: '#fff',
        whiteSpace: 'nowrap',
        textAnchor: 'end',
        fontFamily: 'Times New Roman',

    },
});

const RectangularTrapezoid: React.FC<TrapezoidProps> = ({ data, proportionData, spacing = 5 }) => {
    const classes = useStyles();

    const initialTrapezoidWidth = 120;
    const trapezoidDiagonalCut = 30;

    const predefinidos = {
        1: [150],
        2: [150, 150],
        3: [100, 100, 100],
    };

    const predefinedSizes = predefinidos[data.length] || proportionData.map(item => item.proportion * 400);

    const totalSum = data.reduce((acc, item) => acc + item.count, 0);

    const renderTrapezoidSection = (item: TrapezoidData, index: number) => {
        const trapezoidHeight = predefinedSizes[index];
        const currentTopWidth = initialTrapezoidWidth + trapezoidDiagonalCut * index;
        const currentBottomWidth = initialTrapezoidWidth + trapezoidDiagonalCut * (index + 1);

        const yOffset = predefinedSizes.slice(0, index).reduce((sum, size) => sum + size + spacing, 0);

        const textXLeft  =  12;
        const textXRight = Math.min(currentTopWidth, currentBottomWidth) + 15;

        const percentage = ((item.count / totalSum) * 100).toFixed(2);

        const xOffset = data.length <= 3 ? -50 : 0;

        return (
            <g key={index} transform={`translate(${xOffset}, ${yOffset})`}>
                <path
                    d={`M ${0} 0 L ${currentTopWidth} 0 L ${currentBottomWidth} ${trapezoidHeight} L ${0} ${trapezoidHeight} Z`}
                    fill={item.fill}
                />
                <text x={textXLeft} y={trapezoidHeight / 2 - 5} className={classes.trapezoidText}>
                    {item.name}
                </text>
                <text x={textXRight} y={trapezoidHeight - 5} className={classes.trapezoidTotalText}>
                    Total: {item.count} - {percentage}%
                </text>
            </g>
        );
    };

    const svgHeight = predefinedSizes.reduce((sum, size) => sum + size + spacing, 0);

    return (
        <div className={classes.trapezoidContainer}>
            <svg
                className={classes.funnel}
                viewBox={`0 0 ${initialTrapezoidWidth + trapezoidDiagonalCut * data.length + 10} ${svgHeight + 5}`}
                preserveAspectRatio="none"
            >
                {data.map((section, index) => renderTrapezoidSection(section, index))}
            </svg>
        </div>
    );
};

export { RectangularTrapezoid };
