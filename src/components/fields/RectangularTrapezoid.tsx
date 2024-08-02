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
    },
    funnel: {
        width: '100%',
    },
    trapezoidText: {
        fontSize: '15px',
        fill: '#fff',
        whiteSpace: 'nowrap',
        textAnchor: 'end',
    },
    trapezoidTotalText: {
        fontSize: '8px',
        fill: '#fff',
        whiteSpace: 'nowrap',
        textAnchor: 'end',
    },
});

const RectangularTrapezoid: React.FC<TrapezoidProps> = ({ data, proportionData, spacing = 5 }) => {
    const classes = useStyles();

    const initialTrapezoidWidth = 120;
    const trapezoidDiagonalCut = 30;

    const proportions = proportionData.map(item => item.proportion);
    const scaleFactor = 400;
    const totalProportion = proportions.reduce((sum, prop) => sum + prop, 0);
    const svgHeight = totalProportion * scaleFactor + (data.length - 1) * spacing;

    const totalSum = data.reduce((acc, item) => acc + item.count, 0);

    const renderTrapezoidSection = (item: TrapezoidData, index: number, scaleFactor: number) => {
        const trapezoidHeight = proportions[index] * scaleFactor;
        const currentTopWidth = initialTrapezoidWidth + trapezoidDiagonalCut * index;
        const currentBottomWidth = initialTrapezoidWidth + trapezoidDiagonalCut * (index + 1);

        const yOffset = proportions.slice(0, index).reduce((sum, prop) => sum + prop * scaleFactor + spacing, 0);

        const textX = Math.min(currentTopWidth, currentBottomWidth) - 10;

        const percentage = ((item.count / totalSum) * 100).toFixed(2);

        return (
            <g key={index} transform={`translate(0, ${yOffset})`}>
                <path
                    d={`M ${0} 0 L ${currentTopWidth} 0 L ${currentBottomWidth} ${trapezoidHeight} L ${0} ${trapezoidHeight} Z`}
                    fill={item.fill}
                />
                <text x={textX} y={trapezoidHeight / 2 - 5} className={classes.trapezoidText}>
                    {item.name}
                </text>
                <text x={textX} y={trapezoidHeight / 2 + 15} className={classes.trapezoidTotalText}>
                    Total: {item.count} - {percentage}%
                </text>
            </g>
        );
    };

    return (
        <div className={classes.trapezoidContainer}>
            <svg
                className={classes.funnel}
                viewBox={`0 0 ${initialTrapezoidWidth + trapezoidDiagonalCut * data.length} ${svgHeight + 5}`}
                preserveAspectRatio="none"
            >
                {data.map((section, index) => renderTrapezoidSection(section, index, scaleFactor))}
            </svg>
        </div>
    );
};

export { RectangularTrapezoid };
