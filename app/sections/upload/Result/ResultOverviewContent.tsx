import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { useProfileById } from "@/app/hooks/useProfileById";
import { LLMResearchResponse } from "@/app/types/research";
import Image from "next/image";

type Props = {
    isLoading: boolean;
    displayResult: LLMResearchResponse
}

const ResultOverviewContent = ({ isLoading, displayResult }: Props) => {
    const { colors } = useLayoutTheme();
    const profileId = displayResult?.profile_id ?? undefined;
    const { data: profile } = useProfileById(profileId);

    return (
        <div
            className="p-6 sm:p-8 space-y-5 sm:space-y-6 relative"
            style={{ background: colors.card.background }}
        >
            <div
                className="relative rounded-xl border px-5 py-4 bg-gradient-to-br from-amber-50/80 to-white/90 dark:from-slate-800/80 dark:to-slate-900/90 shadow-sm"
                style={{
                    borderColor: colors.border,
                }}
            >
                <div className="absolute -top-3 left-4 bg-amber-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs font-semibold text-amber-800 dark:text-amber-200 shadow">
                    {displayResult.request_source}
                </div>
                <blockquote className={`pl-3 border-l-4 text-base sm:text-lg font-medium leading-snug ${isLoading ? 'animate-pulse' : ''}`}
                    style={{
                        borderColor: colors.accent,
                        color: colors.foreground,
                        marginTop: "0.5rem"
                    }}
                >
                    “{displayResult.request_statement}”
                </blockquote>
            </div>

            <div className="absolute right-0 top-0 w-[80px] h-[100px]">
                {profile?.avatar_url && (
                    <Image
                        src={profile.avatar_url}
                        alt="Profile avatar"
                        fill
                        className="object-contain rounded-xl"
                    />
                )}
            </div>


            <div className="flex items-center gap-3">
                <span
                    className={`text-base sm:text-lg${isLoading ? 'animate-pulse' : ''}`}
                    style={{ color: colors.foreground }}
                >
                    {displayResult.verdict}
                </span>
            </div>
        </div>
    );
};

export default ResultOverviewContent;