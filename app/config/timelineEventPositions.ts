export const getSecondaryOpinionPositions = (allSecondaryOpinions: any[], isDesktop: boolean, isTablet: boolean) => {
    const positions = [];
    const maxOpinions = Math.min(6, allSecondaryOpinions.length);

    for (let i = 0; i < maxOpinions; i++) {
        const opinion = allSecondaryOpinions[i];
        let position;

        // Simplified positioning - just assign row/column for grid placement
        switch (i) {
            case 0:
                position = {
                    side: "top-left" as const,
                    row: "top",
                    column: "left"
                };
                break;
            case 1:
                position = {
                    side: "top-right" as const,
                    row: "top", 
                    column: "right"
                };
                break;
            case 2:
                position = {
                    side: "left" as const,
                    row: "middle",
                    column: "left"
                };
                break;
            case 3:
                position = {
                    side: "right" as const,
                    row: "middle",
                    column: "right"
                };
                break;
            case 4:
                position = {
                    side: "bottom-left" as const,
                    row: "bottom",
                    column: "left"
                };
                break;
            case 5:
                position = {
                    side: "bottom-right" as const,
                    row: "bottom",
                    column: "right"
                };
                break;
            default:
                continue;
        }

        positions.push({
            opinion,
            position,
            index: i
        });
    }

    return positions;
};