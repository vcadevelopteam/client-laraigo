import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from "react-i18next";
import { langKeys } from "../../lang/keys";

interface FunnelData {
    name: string;
    value: number;
    fill: string;
    count: number;
}

interface Funnel3DProps {
    data: FunnelData[];
    spacing?: number;
}

const useStyles = makeStyles({
    funnelContainer: {
        width: '100%',
        maxWidth: '450px',
        margin: 'auto',
        display: 'flex',
        position: 'relative',
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
    },
    tooltip: {
        position: 'absolute',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        padding: '5px',
        borderRadius: '5px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        zIndex: 1000,
        color: '#000',
    },
});

const Funnel3D: React.FC<Funnel3DProps> = ({ data, spacing = 2.3 }) => {
    const classes = useStyles();
    const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: '' });
    const { t } = useTranslation();

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

    const renderFunnelSection = (section: FunnelData, index: number, totalHeight: number) => {
        const isSingleSection = data.length === 1;
        const sectionHeight = isSingleSection ? totalHeight : (totalHeight - spacing * (data.length - 1)) / data.length;

        const topWidth = isSingleSection ? 50 : section.value / (data[0].value / 100);
        const bottomWidth = isSingleSection ? 80 : (data[index + 1]?.value ?? 0) / (data[0].value / 100);

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

        const handleMouseEnter = (event: React.MouseEvent<SVGGElement, MouseEvent>) => {
            const percentage = ((section.count / data.reduce((acc, item) => acc + item.count, 0)) * 100).toFixed(2);
            const boundingRect = event.currentTarget.getBoundingClientRect();
            const svgRect = event.currentTarget.ownerSVGElement!.getBoundingClientRect();
            setTooltip({
                visible: true,
                x: boundingRect.left - svgRect.left + boundingRect.width / 2,
                y: boundingRect.top - svgRect.top + window.scrollY,
                content: `Cantidad: ${section.count} - ${percentage}%`,
            });
        };

        const handleMouseLeave = () => {
            setTooltip({ visible: false, x: 0, y: 0, content: '' });
        };

        const fontSize = Math.max(1.5, Math.min(sectionHeight / 4, 5));

        if (isSingleSection) {
            return (
                <g key={index} transform={`translate(0, ${yOffset})`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <path
                        d={`
                        M ${50 - bottomWidth / 2} 0
                        L ${50 + bottomWidth / 2} 0
                        L ${50 + topWidth / 2} ${sectionHeight}
                        L ${50 - topWidth / 2} ${sectionHeight}
                        Z
                    `}
                        fill={darkenColor(section.fill, -20)}
                    />
                    <text
                        x="50"
                        y={sectionHeight / 2}
                        textAnchor="middle"
                        style={{ fontSize: `${fontSize}px`, fontFamily: 'Times New Roman' }}
                        alignmentBaseline="middle"
                        className={classes.funnelTextBase}
                    >
                        {t(section.name)}
                    </text>
                </g>
            );
        } else if (index === data.length - 1) {
            return (
                <g key={index} transform={`translate(0, ${yOffset})`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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
                        style={{ fontSize: `${fontSize}px`, fontFamily: 'Times New Roman' }}
                        alignmentBaseline="middle"
                        className={classes.funnelTextBase}
                    >
                        {section.name}
                    </text>
                </g>
            );
        } else {
            return (
                <g key={index} transform={`translate(0, ${yOffset})`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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
                        style={{ fontSize: `${fontSize}px`, fontFamily: 'Times New Roman' }}
                        alignmentBaseline="middle"
                        className={classes.funnelText}
                    >
                        {t(section.name)}
                    </text>
                </g>
            );
        }
    };

    const isSingleSection = data.length === 1;

    return (
        <div className={classes.funnelContainer} >
            <svg
                className={classes.funnel}
                viewBox={`0 0 100 ${isSingleSection ? 50 : 100}`}
                preserveAspectRatio="none"
            >
                {data.map((section, index) => renderFunnelSection(section, index, isSingleSection ? 50 : 100))}
            </svg>
            {tooltip.visible && (
                <div
                    className={classes.tooltip}
                    style={{ left: tooltip.x + 70, top: tooltip.y + 12 }}
                >
                    {tooltip.content}
                </div>
            )}
        </div>
    );
};

export { Funnel3D };
