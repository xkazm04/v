
export const getSecondaryOpinionPositions = (allSecondaryOpinions, isDesktop: boolean, isTablet: boolean) => {
    const positions = [];
    const maxOpinions = Math.min(6, allSecondaryOpinions.length);

    for (let i = 0; i < maxOpinions; i++) {
        const opinion = allSecondaryOpinions[i];
        let position;

        if (isDesktop) {
            // Desktop: Organized in rows - 2 top, 2 side, 2 bottom
            switch (i) {
                case 0:
                    position = {
                        className: "w-80",
                        side: "top-left" as const,
                        row: "top",
                        column: "left"
                    };
                    break;
                case 1:
                    position = {
                        className: "w-80",
                        side: "top-right" as const,
                        row: "top",
                        column: "right"
                    };
                    break;
                case 2:
                    position = {
                        className: "w-80",
                        side: "left" as const,
                        row: "middle",
                        column: "left"
                    };
                    break;
                case 3:
                    position = {
                        className: "w-80",
                        side: "right" as const,
                        row: "middle",
                        column: "right"
                    };
                    break;
                case 4:
                    position = {
                        className: "w-80",
                        side: "bottom-left" as const,
                        row: "bottom",
                        column: "left"
                    };
                    break;
                case 5:
                    position = {
                        className: "w-80",
                        side: "bottom-right" as const,
                        row: "bottom",
                        column: "right"
                    };
                    break;
                default:
                    continue;
            }
        } else if (isTablet) {
            // Tablet: 2 per row
            position = {
                className: `${i % 2 === 0 ? 'col-span-1' : 'col-span-1'}`,
                side: (i % 2 === 0 ? "left" : "right") as const,
                row: "grid",
                column: i % 2 === 0 ? "left" : "right"
            };
        } else {
            // Mobile: single column
            position = {
                className: "w-full",
                side: "center" as const,
                row: "stack",
                column: "center"
            };
        }

        positions.push({
            opinion,
            position,
            index: i
        });
    }

    return positions;
};