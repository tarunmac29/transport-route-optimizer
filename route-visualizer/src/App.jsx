import { useState, useEffect } from 'react'
import GraphVisualization from './components/GraphVisualization'
import RouteOptimizer from './components/RouteOptimizer'
import axios from 'axios'
import './App.css'

function App() {
  const [stations, setStations] = useState([])
  const [routes, setRoutes] = useState([])
  const [optimizedPath, setOptimizedPath] = useState(null)
  const [optimizationType, setOptimizationType] = useState('time')
  const [loading, setLoading] = useState(false)
  const [connectionError, setConnectionError] = useState(null)

  // Fetch stations and routes on component mount
  useEffect(() => {
    fetchStationsAndRoutes()
    // Log startup info for debugging
    console.log('🚀 Route Optimizer Frontend Started')
    console.log('📡 Attempting to connect to backend at http://localhost:8082')
    console.log('📋 Expected endpoints: /stations, /routes, /routes/optimize')
  }, [])

  const fetchStationsAndRoutes = async () => {
    try {
      setLoading(true)
      setConnectionError(null)
      const [stationsResponse, routesResponse] = await Promise.all([
        axios.get('http://localhost:8082/stations'),
        axios.get('http://localhost:8082/routes')
      ])
      
      setStations(stationsResponse.data)
      setRoutes(routesResponse.data)
      console.log(`✅ Successfully loaded ${stationsResponse.data.length} stations and ${routesResponse.data.length} routes`)
    } catch (error) {
      console.error('Error fetching data:', error)
      setConnectionError('Unable to connect to the backend server. Please ensure the Java application is running on localhost:8082')
      // Show user-friendly error message
      setStations([])
      setRoutes([])
    } finally {
      setLoading(false)
    }
  }

  const optimizeRoute = async (fromId, toId, type) => {
    try {
      setLoading(true)
      setOptimizationType(type)
      setConnectionError(null)
      
      console.log('🚀 Optimizing route:', { fromId, toId, type })
      
      const response = await axios.get(`http://localhost:8082/routes/optimize`, {
        params: { from: fromId, to: toId, type: type }
      })
      
      console.log('📊 Backend response:', response.data)
      console.log('📊 Response status:', response.status)
      
      if (response.data) {
        setOptimizedPath(response.data)
        console.log('✅ Optimization completed successfully')
      } else {
        console.warn('⚠️ Empty response from backend')
        setOptimizedPath(null)
      }
    } catch (error) {
      console.error('❌ Error optimizing route:', error)
      console.error('❌ Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      })
      setConnectionError('Unable to optimize route. Please check if the backend server is running and the selected stations are valid.')
      setOptimizedPath(null)
    } finally {
      setLoading(false)
    }
  }

  const clearPath = () => {
    setOptimizedPath(null)
  }

  const testBackendAPIs = async () => {
    console.log('🧪 Testing Backend APIs...')
    try {
      // Test stations endpoint
      const stationsResponse = await axios.get('http://localhost:8082/stations')
      console.log('✅ Stations API:', stationsResponse.data)
      
      // Test routes endpoint  
      const routesResponse = await axios.get('http://localhost:8082/routes')
      console.log('✅ Routes API:', routesResponse.data)
      
      // Test optimization endpoint with sample data
      if (stationsResponse.data.length >= 2) {
        const fromId = stationsResponse.data[0].id
        const toId = stationsResponse.data[1].id
        console.log(`🧪 Testing optimization: ${fromId} to ${toId}`)
        
        const optimizeResponse = await axios.get('http://localhost:8082/routes/optimize', {
          params: { from: fromId, to: toId, type: 'time' }
        })
        console.log('✅ Optimize API:', optimizeResponse.data)
        
        // Set the response for display
        setOptimizedPath(optimizeResponse.data)
      }
      
      alert('✅ Backend test completed! Check console for details.')
    } catch (error) {
      console.error('❌ Backend test failed:', error)
      alert('❌ Backend test failed! Check console for details.')
    }
  }

  return (
    <div className="app">
      <h1>🚀 Transport Route Optimizer</h1>
      
      {connectionError && (
        <div className="error-message">
          <div style={{ marginBottom: '10px' }}>❌ {connectionError}</div>
          <button 
            className="btn btn-primary" 
            onClick={fetchStationsAndRoutes}
            disabled={loading}
          >
            🔄 Retry Connection
          </button>
        </div>
      )}
      
      <div className="app-layout">
        <div className="controls-panel">
          <div style={{ marginBottom: '15px', textAlign: 'center' }}>
            <button 
              className="btn btn-secondary" 
              onClick={testBackendAPIs}
              style={{ fontSize: '12px', padding: '8px 16px' }}
            >
              🧪 Test Backend APIs
            </button>
          </div>
          
          <RouteOptimizer
            stations={stations}
            onOptimize={optimizeRoute}
            onClear={clearPath}
            loading={loading}
            optimizedPath={optimizedPath}
          />
        </div>
        
        <div className="visualization-panel">
          <GraphVisualization
            stations={stations}
            routes={routes}
            optimizedPath={optimizedPath}
            optimizationType={optimizationType}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}

export default App
