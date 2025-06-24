import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { memo } from "react";

const PlayerBackgroundLight = memo(() => (
    <div
        className="fixed inset-0 opacity-10 bg-cover bg-center bg-no-repeat"
        style={{
            backgroundImage: `url('/background/bg_player_vintage.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}
    />
));

PlayerBackgroundLight.displayName = 'PlayerBackgroundLight';

const PlayerBackgroundDark = memo(() => (
    <div
        className="fixed inset-0 opacity-10 bg-cover bg-center bg-no-repeat"
        style={{
            backgroundImage: `url('/background/bg_player_dark.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}
    />
));

PlayerBackgroundDark.displayName = 'PlayerBackgroundDark';

const BackgroundPlayerPattern = () => {
    const { theme } = useLayoutTheme();
    return <>
        {theme !== 'dark' && <PlayerBackgroundLight />}
        {theme === 'dark' && <PlayerBackgroundDark />}
    </>
}

export default BackgroundPlayerPattern