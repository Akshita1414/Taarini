import React, { useState, useRef, useEffect } from 'react';
import { Upload, Play, Image, Brain, Layers, AlertTriangle, CheckCircle, Clock, Users, Waves } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const AIDetection = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoResults, setVideoResults] = useState(() => {
    // Initialize from localStorage
    const saved = localStorage.getItem('videoResults');
    return saved ? JSON.parse(saved) : null;
  });
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Clean up previous video URL if exists
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
      setSelectedFile(file);
      setError(null);
      setVideoResults(null);
      // Create preview URL for the video
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
    }
  };

  // Cleanup video URL on unmount
  useEffect(() => {
    return () => {
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl]);

  // Save videoResults to localStorage whenever it changes
  useEffect(() => {
    if (videoResults) {
      localStorage.setItem('videoResults', JSON.stringify(videoResults));
    }
  }, [videoResults]);

  // Clear localStorage on component unmount if user wants to reset
  const handleClearResults = () => {
    setVideoResults(null);
    localStorage.removeItem('videoResults');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('video', selectedFile);

      const response = await fetch(`${API_BASE_URL}/api/detect-video`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process video');
      }

      const data = await response.json();
      setVideoResults(data);
      // Results will be auto-saved to localStorage by useEffect
    } catch (err) {
      setError(err.message || 'An error occurred while processing the video');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical':
        return 'from-red-500 to-red-600';
      case 'warning':
        return 'from-yellow-500 to-yellow-600';
      case 'safe':
        return 'from-green-500 to-green-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5" />;
      case 'warning':
        return <Clock className="h-5 w-5" />;
      case 'safe':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Image className="h-5 w-5" />;
    }
  };

  const getAlertLevelColor = (level) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'warning':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'none':
        return 'bg-green-100 border-green-300 text-green-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Detection System</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload video files to analyze using our advanced YOLOv8 object detection 
            and U-Net segmentation models for drowning detection. Frames are extracted at 10-second intervals.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="text-center">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-sky-400 transition-colors">
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-600 border-t-transparent mb-4"></div>
                  <p className="text-lg text-gray-600 mb-2">Processing video with AI models...</p>
                  <p className="text-sm text-gray-500">Extracting frames and running detection...</p>
                  {uploadProgress > 0 && (
                    <div className="w-full max-w-xs mt-4">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-sky-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ) : videoPreviewUrl && selectedFile ? (
                <div className="flex flex-col items-center w-full">
                  <div className="w-full max-w-4xl mb-6">
                    <video
                      src={videoPreviewUrl}
                      controls
                      className="w-full rounded-lg shadow-lg"
                      style={{ maxHeight: '500px' }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="flex flex-col items-center space-y-4">
                    <p className="text-sm text-gray-600 font-medium">
                      {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                    <div className="flex space-x-4">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="video-upload"
                      />
                      <label
                        htmlFor="video-upload"
                        className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Change Video
                      </label>
                      <button
                        onClick={handleUpload}
                        disabled={!selectedFile || isUploading}
                        className="inline-flex items-center px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Start Analysis
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Upload Video File
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Support for MP4, AVI, MOV files
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors cursor-pointer mb-4"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Select Video
                  </label>
                </div>
              )}
            </div>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-lg text-red-800">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Overall Results Summary */}
        {videoResults && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Analysis Results (Saved Locally)</h2>
              <button
                onClick={handleClearResults}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Clear Results
              </button>
            </div>
            <div className={`p-6 rounded-xl border-2 ${getAlertLevelColor(videoResults.overall_status)}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(videoResults.overall_status)}
                  <h2 className="text-2xl font-bold">Overall Analysis Results</h2>
                </div>
                <div className={`px-4 py-2 rounded-full text-white font-semibold bg-gradient-to-r ${getStatusColor(videoResults.overall_status)}`}>
                  {videoResults.overall_status.toUpperCase()}
                </div>
              </div>
              <p className="text-lg mb-4 font-medium">{videoResults.overall_message}</p>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-white/70 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{videoResults.total_frames_processed}</div>
                  <div className="text-sm mt-1">Frames Processed</div>
                </div>
                <div className="bg-white/70 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{formatTime(videoResults.video_duration)}</div>
                  <div className="text-sm mt-1">Video Duration</div>
                </div>
              </div>
              {videoResults.total_humans_detected > 0 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-lg font-semibold text-blue-800">Human detected</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Frame-by-Frame Results */}
        {videoResults && videoResults.frames && videoResults.frames.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Frame-by-Frame Analysis
            </h2>

            <div className="space-y-8">
              {videoResults.frames.map((frame, index) => (
                <div
                  key={index}
                  className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  {/* Frame Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`px-4 py-2 rounded-full text-white font-semibold bg-gradient-to-r ${getStatusColor(frame.status)}`}>
                        {getStatusIcon(frame.status)}
                        <span className="ml-2">{frame.status.toUpperCase()}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span className="font-mono">Time: {formatTime(frame.timestamp)}</span>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-lg border-2 ${getAlertLevelColor(frame.alert_level)}`}>
                      <p className="font-semibold">{frame.message}</p>
                    </div>
                  </div>

                  {/* Detection Stats */}
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    {frame.human_count > 0 && (
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-blue-800">Human detected</div>
                      </div>
                    )}
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <Brain className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-purple-800">
                        {frame.detections.length > 0 
                          ? `${Math.round(frame.detections[0].confidence * 100)}%`
                          : 'N/A'}
                      </div>
                      <div className="text-xs text-purple-600">Confidence</div>
                    </div>
                  </div>

                  {/* Images Grid */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Original Frame */}
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-md overflow-hidden">
                      <div className="aspect-video bg-gray-200 relative overflow-hidden">
                        <img
                          src={`${API_BASE_URL}${frame.original_frame}`}
                          alt={`Frame at ${formatTime(frame.timestamp)}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="20" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImage not found%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r from-gray-500 to-gray-600">
                          <Image className="h-4 w-4 mr-2" />
                          Original Frame
                        </div>
                      </div>
                    </div>

                    {/* YOLO Output */}
                    <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-md overflow-hidden">
                      <div className="aspect-video bg-gray-200 relative overflow-hidden">
                        <img
                          src={`${API_BASE_URL}${frame.yolo_output}`}
                          alt={`YOLO detection at ${formatTime(frame.timestamp)}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="20" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImage not found%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600">
                          <Brain className="h-4 w-4 mr-2" />
                          YOLOv8 Detection
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                          Human detection with bounding boxes
                        </p>
                      </div>
                    </div>

                    {/* U-Net Output */}
                    <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-md overflow-hidden">
                      <div className="aspect-video bg-gray-200 relative overflow-hidden">
                        <img
                          src={`${API_BASE_URL}${frame.unet_output}`}
                          alt={`U-Net segmentation at ${formatTime(frame.timestamp)}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="20" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImage not found%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r from-purple-500 to-purple-600">
                          <Layers className="h-4 w-4 mr-2" />
                          U-Net Segmentation
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                          Water/land segmentation mask
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Detection Details */}
                  {frame.detections && frame.detections.length > 0 && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">Detection Details:</h4>
                      <div className="space-y-2">
                        {frame.detections.map((det, idx) => (
                          <div key={idx} className="text-sm text-gray-700">
                            <span className="font-medium">Detection {idx + 1}:</span>
                            {' '}Confidence: {Math.round(det.confidence * 100)}% |
                            {' '}Water Ratio: {Math.round(det.water_ratio * 100)}% |
                            {' '}Submerged: {det.is_submerged ? (
                              <span className="text-red-600 font-bold">YES ⚠️</span>
                            ) : (
                              <span className="text-green-600">No</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIDetection;
