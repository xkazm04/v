import UploadLayout from "../sections/upload/UploadLayout";
import UploadVideo from "../sections/uploadyt/UploadVideo";

const Page = () => {
    
    return <div className="flex flex-row gap-2">
        <UploadVideo />
        <UploadLayout />
    </div>
}

export default Page;