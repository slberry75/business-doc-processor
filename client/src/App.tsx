import logger from './config/logger';
import { authService } from './services/authService';
import { FloatingLabelInput } from './components/common/FloatingLabelInput';

function App() {
  logger.info('Auth service imported');
  // Test environment variables and logger
  logger.info('React app started', {
    environment: process.env.REACT_APP_ENVIRONMENT,
    apiBaseUrl: process.env.REACT_APP_API_BASE_URL,
    logLevel: process.env.REACT_APP_LOG_LEVEL
  });

console.log('Auth service:', authService);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Tailwind CSS Test
        </h1>
        <p className="text-gray-600">
          If you see styled text and colors, Tailwind is working!
          <FloatingLabelInput label='Name' />
        </p>
      </div>
    </div>
  );
}

export default App;