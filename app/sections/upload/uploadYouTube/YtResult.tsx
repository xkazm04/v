import { ProcessingStatus, ProcessingUpdate, StatementResult } from "@/app/types/processing"

type Props = {
    finalResult: ProcessingUpdate;
    statementResults: StatementResult[];
}

const YtResult = ({finalResult, statementResults}: Props) => {
    return <div className={`rounded-lg shadow-sm border p-6 ${finalResult.status === ProcessingStatus.COMPLETED
            ? 'bg-green-50 border-green-200'
            : 'bg-red-50 border-red-200'
        }`}>
        <h2 className="text-xl font-semibold mb-2">
            {finalResult.status === ProcessingStatus.COMPLETED ? 'Processing Complete!' : 'Processing Failed'}
        </h2>
        <p className="text-gray-700 mb-4">
            {finalResult.message}
        </p>

        {finalResult.data && (
            <div className="bg-white bg-opacity-50 rounded p-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {finalResult.data.total_statements && (
                        <div>
                            <div className="font-medium text-gray-700">Statements Found</div>
                            <div className="text-lg font-bold text-blue-600">
                                {finalResult.data.total_statements}
                            </div>
                        </div>
                    )}
                    {finalResult.data.detected_language && (
                        <div>
                            <div className="font-medium text-gray-700">Language</div>
                            <div className="text-lg font-bold text-green-600">
                                {finalResult.data.detected_language.toUpperCase()}
                            </div>
                        </div>
                    )}
                    {finalResult.data.video_id && (
                        <div>
                            <div className="font-medium text-gray-700">Video ID</div>
                            <div className="text-sm font-mono text-gray-600">
                                {finalResult.data.video_id.slice(0, 8)}...
                            </div>
                        </div>
                    )}
                    {statementResults.length > 0 && (
                        <div>
                            <div className="font-medium text-gray-700">Researched</div>
                            <div className="text-lg font-bold text-purple-600">
                                {statementResults.filter(r => r.research_result).length}/{statementResults.length}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
}

export default YtResult;