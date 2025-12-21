// Using Firebase compat SDK for better compatibility
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

// Firebase configuration for sensor data database (ultrasonic-bot project)
const sensorDbConfig = {
  databaseURL: 'https://ultrasonic-bot-default-rtdb.asia-southeast1.firebasedatabase.app'
};

// Firebase configuration for human detection state database (taarini-testing project)
const detectionDbConfig = {
  databaseURL: 'https://taarini-testing-default-rtdb.firebaseio.com'
};

// Initialize Firebase apps with unique names to allow multiple database connections
let sensorApp, detectionApp;

try {
  sensorApp = firebase.initializeApp(sensorDbConfig, 'sensorApp');
} catch (error) {
  // If app already exists, get it
  sensorApp = firebase.app('sensorApp');
}

try {
  detectionApp = firebase.initializeApp(detectionDbConfig, 'detectionApp');
} catch (error) {
  // If app already exists, get it
  detectionApp = firebase.app('detectionApp');
}

// Get database instances using compat API
export const sensorDatabase = firebase.database(sensorApp);
export const detectionDatabase = firebase.database(detectionApp);

// Database paths
export const SENSOR_DATA_PATH = 'UltrasonicBot/Data';
export const DETECTION_STATE_PATH = 'remote/state';

