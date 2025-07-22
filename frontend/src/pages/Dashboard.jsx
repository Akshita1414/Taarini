import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Clock, Phone, Activity, Bone as Drone, Users, Zap } from 'lucide-react';
import { locationData, rescueStats } from '../data/dummyData';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSendAlert = () => {
    alert('Rescue alert sent to emergency response team!');
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Rescues</p>
                <p className="text-2xl font-bold text-green-600">{rescueStats.totalRescues}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-blue-600">{rescueStats.responseTime}</p>
              </div>
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accuracy Rate</p>
                <p className="text-2xl font-bold text-purple-600">{rescueStats.accuracyRate}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Drones</p>
                <p className="text-2xl font-bold text-sky-600">{rescueStats.activeDrones}</p>
              </div>
              <Drone className="h-8 w-8 text-sky-500" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Alert Box */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-8 w-8" />
                <div>
                  <h2 className="text-xl font-bold">Emergency Alert</h2>
                  <p className="opacity-90">Critical situation detected</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold text-red-800">🚨 Drowning Detected!</span>
                  </div>
                  <span className="text-red-600 font-medium">CRITICAL</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-semibold">({locationData.lat}, {locationData.lng})</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="font-semibold">{locationData.time}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-blue-800 font-medium">📍 {locationData.location || 'Chandigarh Lake'}</p>
                  <p className="text-blue-600 text-sm mt-1">Nearest rescue station: 2.3km away</p>
                </div>

                <button
                  onClick={handleSendAlert}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Phone className="h-5 w-5" />
                  <span>Send Rescue Alert</span>
                </button>
              </div>
            </div>
          </div>

          {/* Map Component */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-6 text-white">
              <div className="flex items-center space-x-3">
                <MapPin className="h-8 w-8" />
                <div>
                  <h2 className="text-xl font-bold">Live Location Map</h2>
                  <p className="opacity-90">GPS coordinates tracking</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-gradient-to-br from-blue-100 to-sky-100 rounded-lg h-80 relative overflow-hidden">
                {/* Simulated Map Background */}
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-8 grid-rows-6 h-full">
                    {Array.from({ length: 48 }, (_, i) => (
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
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="w-6 h-6 bg-red-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-white px-2 py-1 rounded shadow-lg text-xs font-medium">
                      Emergency Location
                    </div>
                  </div>
                </div>

                {/* Ripple Effect */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-20 h-20 border-2 border-red-400 rounded-full animate-ping opacity-20"></div>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-32 h-32 border-2 border-red-300 rounded-full animate-ping opacity-10 animation-delay-1000"></div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">Latitude</p>
                  <p className="font-mono font-bold text-gray-800">{locationData.lat}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">Longitude</p>
                  <p className="font-mono font-bold text-gray-800">{locationData.lng}</p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <p className="text-yellow-800 font-medium text-sm">
                    Rescue drone ETA: 3 minutes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
