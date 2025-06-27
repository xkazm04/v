import TimelineVertical from "../sections/edu/TimelineVertical";

const Page = () => {
  return (
    <div key="timeline-page" className="relative min-h-screen">      
      <div className="relative z-10">
        <TimelineVertical />
      </div>
    </div>
  );
};

export default Page;