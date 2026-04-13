import { getSubtopicMetrics, getTopicMetrics } from "./noteService";

export default async function Metrics({date, topic}) {

    const topicMetrics = await getTopicMetrics(date);
    const subtopicMetrics = await getSubtopicMetrics(date, topic);

    return (
        <>
        <pre>
            {JSON.stringify({ subtopicMetrics }, null, 2)}
        </pre>
            {/* <div key={1} className="mb-4">
                {topicMetrics.map((item) => (
                    <span key={item.topic} className="badge badge-secondary mr-2">
                        {item.topic}: {item.count}
                    </span>
                ))}
            </div>
            <div key={2} className="mb-4">
                {subtopicMetrics.map((item) => (
                    <span key={item.subtopic} className="badge badge-primary mr-2">
                        {item.topic} {item.subtopic}: {item.count}
                    </span>
                ))}
            </div> */}

        </>
    )
}