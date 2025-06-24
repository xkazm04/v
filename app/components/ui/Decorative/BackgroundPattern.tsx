import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { memo } from "react";

const NewsBackgroundLight = memo(() => (
    <div
        className="fixed inset-0 opacity-20 bg-cover bg-center bg-no-repeat"
        style={{
            backgroundImage: `url('/background/news_bg_1.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}
    />
));

NewsBackgroundLight.displayName = 'NewsBackgroundLight';

const NewsBackgroundDark = memo(() => (
    <div
        className="fixed inset-0 opacity-20 bg-cover bg-center bg-no-repeat"
        style={{
            backgroundImage: `url('/background/news_bg_2.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}
    />
));

NewsBackgroundDark.displayName = 'NewsBackgroundDark';

const BackgroundPattern = () => {
    const { theme } = useLayoutTheme();
    return <>
        {theme !== 'dark' && <NewsBackgroundLight />}
        {theme === 'dark' && <NewsBackgroundDark />}
    </>
}

export default BackgroundPattern