import FloatingIconsConstellation from "@/app/components/ui/Decorative/FloatingIconsConstellation";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { useElevenLabsAudio } from "@/app/hooks/useElevenLabsAudio";
import { useEffect } from "react";

type Props = {
    children: React.ReactNode;
    userLanguage: string;
    voiceId: string;
    scrollToMilestone?: (milestoneId: string) => void;
    scrollToEvent?: (milestoneId: string, eventId: string) => void;
}
  // Initialize audio functionality with scroll utilities and language preference
const TimelineVerticalWrapper = ({ children, userLanguage, voiceId, scrollToMilestone, scrollToEvent }: Props) => {
    const { isDark } = useLayoutTheme();
    const { audioRef, generateAndPlay, pause } = useElevenLabsAudio({
        autoPlay: true,
        languageCode: userLanguage,
        voiceId: voiceId,
        scrollToMilestone,
        scrollToEvent,
        onError: (error) => {
            console.error('Timeline audio error:', error);
        }
    });

    useEffect(() => {
        const handleAudioPlay = async (event: Event) => {
            const customEvent = event as CustomEvent;
            const { track } = customEvent.detail;
            try {
                console.log('Handling audio play for track:', track.title);
                console.log('Using language:', userLanguage, 'voiceId:', voiceId);
                console.log('Track text:', track.text);

                await generateAndPlay(track.text, voiceId, userLanguage);
            } catch (error) {
                console.error('Failed to play audio:', error);
            }
        };

        const handleAudioPause = () => {
            console.log('Handling audio pause');
            pause();
        };
        
        window.addEventListener('timeline-audio-play', handleAudioPlay);
        window.addEventListener('timeline-audio-pause', handleAudioPause);

        return () => {
            window.removeEventListener('timeline-audio-play', handleAudioPlay);
            window.removeEventListener('timeline-audio-pause', handleAudioPause);
        };
    }, [generateAndPlay, pause, userLanguage, voiceId]);
    return <div className={`relative`}>
        <audio
            ref={audioRef}
            preload="metadata"
            style={{ display: 'none' }}
        />


        {children}
        <div className='opacity-20'>
            <FloatingIconsConstellation />
        </div>
    </div>
}

export default TimelineVerticalWrapper;