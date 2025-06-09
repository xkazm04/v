import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import UploadLayout from "../sections/upload/UploadLayout";
import UploadVideo from "../sections/uploadyt/UploadVideo";

const Page = () => {
    
    return <div className="flex flex-row gap-2">
        <Tabs defaultValue="video" className="w-full">
            <TabsList className="w-full">
                <TabsTrigger value="video">Upload Video</TabsTrigger>
                <TabsTrigger value="layout">Upload Statement</TabsTrigger>
            </TabsList>
            <TabsContent value="video">
                <UploadVideo />
            </TabsContent>
            <TabsContent value="layout">
                <UploadLayout />
            </TabsContent>
        </Tabs>
    </div>
}

export default Page;