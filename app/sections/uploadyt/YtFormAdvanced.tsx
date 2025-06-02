import { VideoProcessingRequest } from "@/app/types/processing";

type Props = {
    handleInputChange: (field: string, value: any) => void;
    formData: VideoProcessingRequest;
    isProcessing: boolean;
}

const YtFormAdvanced = ({handleInputChange, formData, isProcessing}: Props) => {
    return <>
        <details className="border border-gray-200 rounded-lg">
            <summary className="cursor-pointer p-3 font-medium text-gray-700 hover:bg-gray-50">
              Advanced Options
            </summary>
            <div className="p-4 border-t border-gray-200 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Speaker Name
                  </label>
                  <input
                    type="text"
                    value={formData.speaker_name}
                    onChange={(e) => handleInputChange('speaker_name', e.target.value)}
                    placeholder="e.g., John Politician"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isProcessing}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={formData.language_code}
                    onChange={(e) => handleInputChange('language_code', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isProcessing}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Context
                </label>
                <input
                  type="text"
                  value={formData.context}
                  onChange={(e) => handleInputChange('context', e.target.value)}
                  placeholder="e.g., Campaign rally, TV interview"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isProcessing}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.research_statements}
                    onChange={(e) => handleInputChange('research_statements', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={isProcessing}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Research statements for fact-checking
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.cleanup_audio}
                    onChange={(e) => handleInputChange('cleanup_audio', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={isProcessing}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Clean up temporary audio files
                  </span>
                </label>
              </div>
            </div>
          </details>
    </>
}

export default YtFormAdvanced;