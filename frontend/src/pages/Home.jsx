import React from 'react';
import { Link } from 'react-router-dom';
import { Bone as Drone, Shield, Zap, Eye, Heart, Award } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-sky-600">Taarini:</span> AI-Powered System for
              <span className="block">Drowning Detection</span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Using computer vision and cutting-edge AI models to detect and rescue 
              drowning individuals in real-time, saving lives through technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/ai-detection"
                className="inline-flex items-center px-8 py-4 bg-sky-600 text-white text-lg font-semibold rounded-lg hover:bg-sky-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Eye className="mr-2 h-5 w-5" />
                Go to AI Detection
              </Link>

              <Link
                to="/dashboard"
                className="inline-flex items-center px-8 py-4 bg-white text-sky-600 text-lg font-semibold rounded-lg border-2 border-sky-600 hover:bg-sky-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Shield className="mr-2 h-5 w-5" />
                Open Rescue Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              About Taarini Project
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI system combines computer vision, machine learning, and autonomous drone technology 
              to create the fastest and most reliable drowning detection and rescue system.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-sky-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-Time Detection</h3>
              <p className="text-gray-600">
                Our YOLOv8 and U-Net models process drone footage in real-time, identifying potential drowning situations within seconds.
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-teal-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Computer Vision</h3>
              <p className="text-gray-600">
                Advanced computer vision algorithms analyze body postures, movement patterns, and water conditions to ensure accurate detection.
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-pink-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-red-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Life Saving</h3>
              <p className="text-gray-600">
                Immediate GPS coordinates transmission to rescue teams ensures the fastest possible response time for emergency situations.
              </p>
            </div>

          

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">24/7 Monitoring</h3>
              <p className="text-gray-600">
                Continuous surveillance of high-risk areas including beaches, pools, and water recreation facilities for maximum safety.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-orange-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Ultrasonic Sensing</h3>
              <p className="text-gray-600">
                Accurate depth and proximity measurement using ultrasonic sensors to reliably detect human presence underwater, minimizing false detections and ensuring dependable rescue signal activation.
              </p>
            </div>
          </div>
          

          {/* CTA Section */}
          <div className="mt-16 bg-gradient-to-r from-sky-600 to-blue-700 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Save Lives?</h3>
            <p className="text-lg mb-6 opacity-90">
              Experience the future of water safety with our AI-powered drowning detection system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/ai-detection"
                className="bg-white text-sky-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Test AI Detection
              </Link>
              <Link
                to="/dashboard"
                className="bg-sky-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-sky-900 transition-colors"
              >
                View Live Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
