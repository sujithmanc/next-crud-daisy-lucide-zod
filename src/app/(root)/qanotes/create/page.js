import CreateNotesForm from "./CreateNotesForm";
import { getAllTopics } from "../topics/service";


export default async function CreatePage() {
    const rows = await getAllTopics()
        <>
            <CreateNotesForm topics={rows} />
        </>
    );

}