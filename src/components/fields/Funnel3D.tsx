import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

interface funnelData {
    name: string;
    value: number;
    fill: string;
}

interface Funnel3DProps {
    data: funnelData[];
    spacing?: number;
}

const useStyles = makeStyles({
    funnelContainer: {
        width: '100%',
        maxWidth: '450px',
        margin: 'auto',
        display: 'flex',
    },
    funnel: {
        width: '100%',
    },
    funnelText: {
        fontSize: '2.1px',
        fill: '#fff',
        whiteSpace: 'nowrap',
    },
    funnelTextBase: {
        fontSize: '1.45px',
        fill: '#fff',
        whiteSpace: 'nowrap',
    }
});

const Funnel3D: React.FC<Funnel3DProps> = ({ data, spacing = 2.3 }) => {
    const classes = useStyles();

    const darkenColor = (color: string, amount: number) => {
        let usePound = false;
        if (color[0] === "#") {
            color = color.slice(1);
            usePound = true;
        }
        const num = parseInt(color, 16);
        let r = (num >> 16) + amount;
        let g = ((num >> 8) & 0x00FF) + amount;
        let b = (num & 0x0000FF) + amount;
        if (r > 255) r = 255;
        else if (r < 0) r = 0;
        if (g > 255) g = 255;
        else if (g < 0) g = 0;
        if (b > 255) b = 255;
        else if (b < 0) b = 0;
        return (usePound ? "#" : "") + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
    };

    const renderFunnelSection = (section: funnelData, index: number, totalHeight: number) => {
        const nextSectionWidth = (data[index + 1]?.value ?? 0) / (data[0].value / 100);
        const currentSectionWidth = section.value / (data[0].value / 100);
        const sectionHeight = (totalHeight - spacing * (data.length - 1)) / data.length;

        const isoscelesFactor = 1;
        const topWidth = currentSectionWidth * isoscelesFactor;
        const bottomWidth = nextSectionWidth * isoscelesFactor;

        const createCurvedBasePath = (topWidth: number, bottomWidth: number, sectionHeight: number, curveOffset: number) => {
            const halfTopWidth = topWidth / 2;
            const halfBottomWidth = bottomWidth / 2;

            const middleX = 50;
            const middleY = sectionHeight + curveOffset;

            return `
                M ${middleX - halfTopWidth} 0
                L ${middleX + halfTopWidth} 0
                L ${middleX + halfBottomWidth} ${sectionHeight}
                Q ${middleX + halfBottomWidth} ${middleY} ${middleX} ${middleY}
                Q ${middleX - halfBottomWidth} ${middleY} ${middleX - halfBottomWidth} ${sectionHeight}
                Z
            `;
        };

        const yOffset = index * sectionHeight + (index * spacing);

        if (index === data.length - 1) {
            return (
                <g key={index} transform={`translate(0, ${yOffset})`}>
                    <path
                        d={`
                            M ${50 - topWidth / 2} 0
                            L ${50 + topWidth / 2} 0
                            L ${50 + topWidth / 2} ${sectionHeight / 2}
                            Q ${50 + topWidth / 2} ${(sectionHeight / 2) + 1} 50 ${(sectionHeight / 2) + 1}
                            Q ${50 - topWidth / 2} ${(sectionHeight / 2) + 1} ${50 - topWidth / 2} ${sectionHeight / 2}
                            Z
                        `}
                        fill={darkenColor(section.fill, -20)}
                    />
                    <path
                        d={`
                            M ${50 - topWidth / 2} 0
                            L ${50 + topWidth / 2} 0
                            L ${50 + topWidth / 2} ${sectionHeight / 2}
                            L ${50 - topWidth / 2} ${sectionHeight / 2}
                            Z
                        `}
                        fill={darkenColor(section.fill, -20)}
                    />
                    <path
                        d={`
                            M ${50 - topWidth / 2} 0
                            Q ${50 - topWidth / 2 - 1} 0.7 ${50} 0.7
                            Q ${50 + topWidth / 2 + 1} 0.7 ${50 + topWidth / 2} 0
                            L ${50 + topWidth / 2} 0
                            Q ${50 + topWidth / 2 + 1} -0.7 ${50} -0.7
                            Q ${50 - topWidth / 2 - 1} -0.7 ${50 - topWidth / 2} 0
                            Z
                        `}
                        fill={darkenColor(section.fill, 20)}
                    />

                    <text
                        x="50"
                        y={sectionHeight / 4}
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        className={classes.funnelTextBase}
                    >
                        {section.name}
                    </text>
                </g>
            );
        } else {
            return (
                <g key={index} transform={`translate(0, ${yOffset})`}>
                    <path
                        d={createCurvedBasePath(topWidth, bottomWidth, sectionHeight, 1.2)}
                        fill={darkenColor(section.fill, -20)}
                    />
                    <path
                        d={`
                            M ${50 - topWidth / 2} 0
                            L ${50 + topWidth / 2} 0
                            L ${50 + bottomWidth / 2} ${sectionHeight}
                            L ${50 - bottomWidth / 2} ${sectionHeight}
                            Z
                        `}
                        fill={darkenColor(section.fill, -20)}
                    />
                    <path
                        d={`
                            M ${50 - topWidth / 2} 0
                            Q ${50 - topWidth / 2 - 1} 0.7 ${50} 0.7
                            Q ${50 + topWidth / 2 + 1} 0.7 ${50 + topWidth / 2} 0
                            L ${50 + topWidth / 2} 0
                            Q ${50 + topWidth / 2 + 1} -0.7 ${50} -0.7
                            Q ${50 - topWidth / 2 - 1} -0.7 ${50 - topWidth / 2} 0
                            Z
                        `}
                        fill={darkenColor(section.fill, 20)}
                    />

                    <text
                        x="50"
                        y={sectionHeight / 2}
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        className={classes.funnelText}
                    >
                        {section.name}
                    </text>
                </g>
            );
        }
    };

    return (
        <div className={classes.funnelContainer}>
            <svg
                className={classes.funnel}
                viewBox={`0 0 100 100`}
                preserveAspectRatio="none"
            >
                {data.map((section, index) => renderFunnelSection(section, index, 100))}
            </svg>
        </div>
    );
};

export {Funnel3D};
