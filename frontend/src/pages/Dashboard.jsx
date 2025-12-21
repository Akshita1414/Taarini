import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Clock, Phone, Activity, Bone as Drone, Users, Zap, Radio, CheckCircle, XCircle } from 'lucide-react';
import { sensorDatabase, detectionDatabase, SENSOR_DATA_PATH, DETECTION_STATE_PATH } from '../config/firebase';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [sensorData, setSensorData] = useState({
    latitude: null,
    longitude: null,
    sensor1: null,
    sensor2: null,
    sensor3: null,
    sensor4: null,
    lastUpdate: null
  });
  const [humanDetected, setHumanDetected] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch sensor data from Firebase
  useEffect(() => {
    try {
      const sensorDataRef = sensorDatabase.ref(SENSOR_DATA_PATH);
      
      const unsubscribe = sensorDataRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setSensorData({
            latitude: data.Latitude || null,
            longitude: data.Longitude || null,
            sensor1: data.Sensor1_cm || null,
            sensor2: data.Sensor2_cm || null,
            sensor3: data.Sensor3_cm || null,
            sensor4: data.Sensor4_cm || null,
            lastUpdate: new Date().toLocaleTimeString()
          });
          setIsLoading(false);
        }
      }, (error) => {
        console.error('Error fetching sensor data:', error);
        setError('Failed to fetch sensor data');
        setIsLoading(false);
      });

      return () => {
        sensorDataRef.off('value');
      };
    } catch (err) {
      console.error('Error setting up sensor listener:', err);
      setError('Failed to connect to sensor database');
      setIsLoading(false);
    }
  }, []);

  // Fetch human detection state from Firebase
  useEffect(() => {
    try {
      const detectionStateRef = detectionDatabase.ref(DETECTION_STATE_PATH);
      
      const unsubscribe = detectionStateRef.on('value', (snapshot) => {
        const state = snapshot.val();
        setHumanDetected(state === 1);
      }, (error) => {
        console.error('Error fetching detection state:', error);
      });

      return () => {
        detectionStateRef.off('value');
      };
    } catch (err) {
      console.error('Error setting up detection listener:', err);
    }
  }, []);

  const handleSendAlert = () => {
    if (sensorData.latitude && sensorData.longitude) {
      const message = `🚨 EMERGENCY ALERT\n\nHuman Detected!\nLocation: ${sensorData.latitude}, ${sensorData.longitude}\nTime: ${currentTime}`;
      alert(message);
      // Here you can add code to send alert to rescue systems
    } else {
      alert('Location data not available');
    }
  };

  const formatSensorValue = (value) => {
    if (value === null || value === undefined) return 'N/A';
    if (value === -1) return 'No Reading';
    return `${value.toFixed(2)} cm`;
  };

  const getSensorStatus = (value) => {
    if (value === null || value === undefined || value === -1) return 'text-gray-500';
    if (value < 50) return 'text-red-600 font-bold'; // Close detection
    if (value < 100) return 'text-yellow-600 font-semibold'; // Medium range
    return 'text-green-600'; // Far range
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Rescue Dashboard</h1>
              <p className="text-gray-600 mt-2">Live monitoring and emergency response center</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono font-bold text-gray-800">{currentTime}</div>
              <div className="text-sm text-gray-600">Live Update</div>
            </div>
          </div>
        </div>

        {/* Human Detection Status Card */}
        <div className="mb-8">
          <div className={`bg-white rounded-2xl shadow-xl p-6 border-4 ${
            humanDetected === true 
              ? 'border-red-500 bg-red-50' 
              : humanDetected === false 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-300 bg-gray-50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {humanDetected === true ? (
                  <>
                    <div className="bg-red-500 rounded-full p-4">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-red-800">Human Detected!</h2>
                      <p className="text-red-600">Sensor system has detected a human body</p>
                    </div>
                  </>
                ) : humanDetected === false ? (
                  <>
                    <div className="bg-green-500 rounded-full p-4">
                      <XCircle className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-green-800">No Human Detected</h2>
                      <p className="text-green-600">Sensor system shows no human body detected</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-gray-400 rounded-full p-4">
                      <Radio className="h-8 w-8 text-white animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Connecting...</h2>
                      <p className="text-gray-600">Waiting for sensor data</p>
                    </div>
                  </>
                )}
              </div>
              {sensorData.lastUpdate && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">Last Update</p>
                  <p className="font-semibold text-gray-800">{sensorData.lastUpdate}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Rescues</p>
                <p className="text-2xl font-bold text-green-600">127</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-blue-600">3.2 min</p>
              </div>
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accuracy Rate</p>
                <p className="text-2xl font-bold text-purple-600">96.8%</p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Drones</p>
                <p className="text-2xl font-bold text-sky-600">8</p>
              </div>
              <Drone className="h-8 w-8 text-sky-500" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Alert Box */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className={`bg-gradient-to-r p-6 text-white ${
              humanDetected === true 
                ? 'from-red-500 to-red-600' 
                : 'from-gray-500 to-gray-600'
            }`}>
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-8 w-8" />
                <div>
                  <h2 className="text-xl font-bold">
                    {humanDetected === true ? 'Emergency Alert' : 'System Status'}
                  </h2>
                  <p className="opacity-90">
                    {humanDetected === true ? 'Critical situation detected' : 'Monitoring in progress'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {humanDetected === true ? (
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="font-semibold text-red-800">🚨 Human Detected!</span>
                    </div>
                    <span className="text-red-600 font-medium">CRITICAL</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-semibold text-green-800">✓ No Human Detected</span>
                    </div>
                    <span className="text-green-600 font-medium">SAFE</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-semibold">
                        {sensorData.latitude && sensorData.longitude 
                          ? `(${sensorData.latitude.toFixed(5)}, ${sensorData.longitude.toFixed(5)})`
                          : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="font-semibold">{currentTime}</p>
                    </div>
                  </div>
                </div>

                {sensorData.latitude && sensorData.longitude && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-blue-800 font-medium">
                      📍 GPS Coordinates: {sensorData.latitude.toFixed(5)}, {sensorData.longitude.toFixed(5)}
                    </p>
                    <p className="text-blue-600 text-sm mt-1">Nearest rescue station: 2.3km away</p>
                  </div>
                )}

                <button
                  onClick={handleSendAlert}
                  disabled={!humanDetected || !sensorData.latitude}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                    humanDetected === true
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-400 text-white cursor-not-allowed'
                  }`}
                >
                  <Phone className="h-5 w-5" />
                  <span>Send Rescue Alert</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sensor Data & Map Component */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-6 text-white">
              <div className="flex items-center space-x-3">
                <MapPin className="h-8 w-8" />
                <div>
                  <h2 className="text-xl font-bold">Sensor Data & Location</h2>
                  <p className="opacity-90">Ultrasonic sensors & GPS tracking</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Ultrasonic Sensors */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Ultrasonic Sensors</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Sensor 1</p>
                    <p className={`text-xl font-bold ${getSensorStatus(sensorData.sensor1)}`}>
                      {formatSensorValue(sensorData.sensor1)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Sensor 2</p>
                    <p className={`text-xl font-bold ${getSensorStatus(sensorData.sensor2)}`}>
                      {formatSensorValue(sensorData.sensor2)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Sensor 3</p>
                    <p className={`text-xl font-bold ${getSensorStatus(sensorData.sensor3)}`}>
                      {formatSensorValue(sensorData.sensor3)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Sensor 4</p>
                    <p className={`text-xl font-bold ${getSensorStatus(sensorData.sensor4)}`}>
                      {formatSensorValue(sensorData.sensor4)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Visualization */}
              <div className="bg-gradient-to-br from-blue-100 to-sky-100 rounded-lg h-64 relative overflow-hidden mb-4">
                {/* Simulated Map Background */}
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-8 grid-rows-4 h-full">
                    {Array.from({ length: 32 }, (_, i) => (
                      <div
                        key={i}
                        className={`border border-blue-200 ${
                          Math.random() > 0.7 ? 'bg-green-100' : 'bg-blue-50'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Location Marker */}
                {sensorData.latitude && sensorData.longitude && (
                  <>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="relative">
                        <div className={`w-6 h-6 rounded-full border-4 border-white shadow-lg animate-pulse ${
                          humanDetected === true ? 'bg-red-500' : 'bg-green-500'
                        }`}></div>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-white px-2 py-1 rounded shadow-lg text-xs font-medium">
                          {humanDetected === true ? 'Human Detected' : 'Current Location'}
                        </div>
                      </div>
                    </div>

                    {/* Ripple Effect */}
                    {humanDetected === true && (
                      <>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-20 h-20 border-2 border-red-400 rounded-full animate-ping opacity-20"></div>
                        </div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-32 h-32 border-2 border-red-300 rounded-full animate-ping opacity-10 animation-delay-1000"></div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">Latitude</p>
                  <p className="font-mono font-bold text-gray-800">
                    {sensorData.latitude ? sensorData.latitude.toFixed(5) : 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">Longitude</p>
                  <p className="font-mono font-bold text-gray-800">
                    {sensorData.longitude ? sensorData.longitude.toFixed(5) : 'N/A'}
                  </p>
                </div>
              </div>

              {isLoading && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <p className="text-yellow-800 font-medium text-sm">
                      Connecting to sensors...
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-red-800 font-medium text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
