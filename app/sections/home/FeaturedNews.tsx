import { mockedArticles } from "@/app/types/article";
import { NewsGrid } from "../feed/NewsGrid";

const FeaturedNews = () => {
    return <>
        <NewsGrid articles={mockedArticles} />
    </>
}

export default FeaturedNews;