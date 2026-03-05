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

  // Fetch stations and routes on component mount
  useEffect(() => {
    fetchStationsAndRoutes()
  }, [])

  const fetchStationsAndRoutes = async () => {
    try {
      setLoading(true)
      const [stationsResponse, routesResponse] = await Promise.all([
        axios.get('http://localhost:8081/stations'),
        axios.get('http://localhost:8081/routes')
      ])
      
      setStations(stationsResponse.data)
      setRoutes(routesResponse.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const optimizeRoute = async (fromId, toId, type) => {
    try {
      setLoading(true)
      setOptimizationType(type)
      
      const response = await axios.get(`http://localhost:8081/routes/optimize`, {
        params: { from: fromId, to: toId, type: type }
      })
      
      setOptimizedPath(response.data)
    } catch (error) {
      console.error('Error optimizing route:', error)
      setOptimizedPath(null)
    } finally {
      setLoading(false)
    }
  }

  const clearPath = () => {
    setOptimizedPath(null)
  }

  return (
    <div className="app">
      <h1>Transport Route Optimizer</h1>
      
      <div className="app-layout">
        <div className="controls-panel">
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
