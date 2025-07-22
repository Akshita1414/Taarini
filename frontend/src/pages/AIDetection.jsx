import React, { useState } from 'react';
import { Upload, Play, Image, Brain, Layers } from 'lucide-react';
import { detectionResults } from '../data/dummyData';

const AIDetection = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setShowResults(true);
    }, 2000);
  };

  const getIcon = (label) => {
    if (label.includes('Original')) return <Image className="h-5 w-5" />;
    if (label.includes('YOLOv8')) return <Brain className="h-5 w-5" />;
    if (label.includes('U-Net')) return <Layers className="h-5 w-5" />;
    return <Image className="h-5 w-5" />;
  };

  const getColor = (label) => {
    if (label.includes('Original')) return 'from-gray-500 to-gray-600';
    if (label.includes('YOLOv8')) return 'from-blue-500 to-blue-600';
    if (label.includes('U-Net')) return 'from-purple-500 to-purple-600';
    return 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Detection System</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload video or image files to analyze using our advanced YOLOv8 object detection 
            and U-Net segmentation models for drowning detection.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="text-center">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-sky-400 transition-colors">
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-600 border-t-transparent mb-4"></div>
                  <p className="text-lg text-gray-600">Processing with AI models...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Upload Video or Image
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Support for MP4, AVI, JPG, PNG files up to 10MB
                  </p>
                  <button
                    onClick={handleUpload}
                    className="inline-flex items-center px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition-colors"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Analysis
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        {showResults && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Detection Results
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {detectionResults.map((result, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    <img
                      src={result.image}
                      alt={result.label}
                      className="w-full h-full object-cover"
                    />
                    {result.label.includes('YOLOv8') && (
                      <div className="absolute inset-0 border-4 border-red-500 m-8 rounded-lg opacity-75"></div>
                    )}
                    {result.label.includes('U-Net') && (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30"></div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium mb-3 bg-gradient-to-r ${getColor(result.label)}`}>
                      {getIcon(result.label)}
                      <span className="ml-2">AI Model</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {result.label}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {result.label.includes('Original') && 'Original input frame from drone camera feed'}
                      {result.label.includes('YOLOv8') && 'Object detection with bounding boxes around detected individuals'}
                      {result.label.includes('U-Net') && 'Semantic segmentation highlighting water and human regions'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex items-start space-x-4">
                <div className="bg-green-500 rounded-full p-2">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Analysis Complete</h3>
                  <p className="text-green-700 mb-4">
                    The AI models have successfully processed the input. YOLOv8 detected 1 individual with 94.3% confidence.
                    U-Net segmentation shows clear water boundaries for enhanced accuracy.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-white/70 rounded-lg p-3 text-center">
                      <div className="font-bold text-green-800">94.3%</div>
                      <div className="text-green-600">Confidence</div>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3 text-center">
                      <div className="font-bold text-green-800">1.2s</div>
                      <div className="text-green-600">Process Time</div>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3 text-center">
                      <div className="font-bold text-green-800">1</div>
                      <div className="text-green-600">Detected</div>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3 text-center">
                      <div className="font-bold text-green-800">High</div>
                      <div className="text-green-600">Risk Level</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIDetection;
