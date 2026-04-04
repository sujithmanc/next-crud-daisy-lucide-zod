import { getAllTopics } from "../topics/service";
import ImageQAForm from "./ImageQAForm";


export default async function CreatePage() {
    const rows = await getAllTopics()

    return (
        <>
            <ImageQAForm topics={rows} />
        </>
    );

}