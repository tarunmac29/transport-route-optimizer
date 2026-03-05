import { useState, useEffect } from 'react'

const RouteOptimizer = ({ stations, onOptimize, onClear, loading, optimizedPath }) => {
  const [fromStation, setFromStation] = useState('')
  const [toStation, setToStation] = useState('')
  const [optimizationType, setOptimizationType] = useState('time')
  const [showAnimation, setShowAnimation] = useState(false)

  const handleOptimize = () => {
    if (fromStation && toStation && fromStation !== toStation) {
      setShowAnimation(true)
      onOptimize(fromStation, toStation, optimizationType)
      setTimeout(() => setShowAnimation(false), 2000)
    }
  }



  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && !loading && fromStation && toStation && fromStation !== toStation) {
        handleOptimize()
      }
      if (e.key === 'Escape' && optimizedPath) {
        onClear()
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [fromStation, toStation, optimizationType, loading, optimizedPath])

  // Auto-suggestion for quick selection
  const getStationRecommendations = () => {
    if (!fromStation) return []
    const fromStationObj = stations.find(s => s.id == fromStation)
    if (!fromStationObj) return []
    
    // Simple recommendation: exclude already selected station
    return stations.filter(s => s.id != fromStation).slice(0, 3)
  }

  const optimizationTypes = [
    {
      type: 'distance',
      label: 'Distance - Shortest path by distance',
      color: '#48bb78'
    },
    {
      type: 'time', 
      label: 'Time - Fastest route by travel time',
      color: '#4299e1'
    },
    {
      type: 'fare',
      label: 'Fare - Cheapest route by cost',
      color: '#ed8936'
    }
  ]

  return (
    <div className="route-optimizer">
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h3 style={{ 
          color: '#2d3748', 
          fontWeight: '700',
          fontSize: '20px',
          margin: '0 0 8px 0',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>🚀 Route Optimization Control Panel</h3>
        <div style={{
          width: '60px',
          height: '4px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          margin: '0 auto',
          borderRadius: '2px'
        }}></div>
      </div>
      
      {/* Single row form */}
      <div className="form-row">
        <div className="form-group">
          <label>🚉 From Station:</label>
          <select 
            value={fromStation} 
            onChange={(e) => setFromStation(e.target.value)}
            disabled={loading}
          >
            <option value="">Select departure</option>
            {stations.map(station => (
              <option key={station.id} value={station.id}>
                {station.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>🎯 To Station:</label>
          <select 
            value={toStation} 
            onChange={(e) => setToStation(e.target.value)}
            disabled={loading}
          >
            <option value="">Select destination</option>
            {stations.map(station => (
              <option key={station.id} value={station.id}>
                {station.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>⚙️ Optimize By:</label>
          <select 
            value={optimizationType} 
            onChange={(e) => setOptimizationType(e.target.value)}
            disabled={loading}
          >
            {optimizationTypes.map(type => (
              <option key={type.type} value={type.type}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn btn-primary"
            onClick={handleOptimize}
            disabled={loading || !fromStation || !toStation || fromStation === toStation}
          >
            {loading ? '🔍 Finding...' : '🚀 Find Route'}
          </button>
          
          {optimizedPath && (
            <button 
              className="btn btn-secondary"
              onClick={onClear}
              disabled={loading}
            >
              🧹 Clear
            </button>
          )}
        </div>
      </div>

      {/* Results Display */}
      {optimizedPath && (
        <div className="route-results" style={{ marginTop: '20px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(102, 126, 234, 0.1)'
          }}>
            <h4 style={{ 
              margin: '0 0 15px 0', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              fontSize: '18px',
              color: '#2d3748'
            }}>
              {optimizedPath.reachable ? '✅ Route Found!' : '❌ No Route Available'}
            </h4>
            
            {optimizedPath.reachable && optimizedPath.path && (
              <div>
                {/* Metrics */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                  gap: '15px',
                  marginBottom: '15px'
                }}>
                  <div style={{ textAlign: 'center', background: 'white', padding: '12px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <span style={{ display: 'block', fontSize: '20px', fontWeight: 'bold', color: '#48bb78' }}>
                      {optimizedPath.totalDistance ? optimizedPath.totalDistance.toFixed(1) : '0.0'} km
                    </span>
                    <small style={{ color: '#718096' }}>Distance</small>
                  </div>
                  <div style={{ textAlign: 'center', background: 'white', padding: '12px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <span style={{ display: 'block', fontSize: '20px', fontWeight: 'bold', color: '#4299e1' }}>
                      {optimizedPath.totalTime || 0} min
                    </span>
                    <small style={{ color: '#718096' }}>Time</small>
                  </div>
                  <div style={{ textAlign: 'center', background: 'white', padding: '12px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <span style={{ display: 'block', fontSize: '20px', fontWeight: 'bold', color: '#ed8936' }}>
                      ${optimizedPath.totalFare ? optimizedPath.totalFare.toFixed(2) : '0.00'}
                    </span>
                    <small style={{ color: '#718096' }}>Fare</small>
                  </div>
                  <div style={{ textAlign: 'center', background: 'white', padding: '12px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <span style={{ display: 'block', fontSize: '20px', fontWeight: 'bold', color: '#667eea' }}>
                      {optimizedPath.path ? optimizedPath.path.length : 0}
                    </span>
                    <small style={{ color: '#718096' }}>Stations</small>
                  </div>
                </div>
                
                {/* Path Display */}
                <div style={{ 
                  background: 'white',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#4a5568' }}>
                    🗺️ Route Path:
                  </div>
                  <div style={{ 
                    fontSize: '14px',
                    color: '#2d3748',
                    lineHeight: '1.5'
                  }}>
                    {optimizedPath.path.join(' → ')}
                  </div>
                </div>
              </div>
            )}

            {!optimizedPath.reachable && (
              <div style={{ 
                color: '#e53e3e', 
                padding: '16px',
                background: 'rgba(229, 62, 62, 0.1)',
                borderRadius: '8px',
                fontSize: '14px',
                textAlign: 'center',
                border: '1px solid rgba(229, 62, 62, 0.2)'
              }}>
                🚫 No route available between the selected stations
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Station Recommendations */}
      {fromStation && !toStation && getStationRecommendations().length > 0 && (
        <div className="recommendations-panel" style={{
          marginTop: '15px',
          padding: '12px',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          borderRadius: '12px',
          border: '1px solid rgba(102, 126, 234, 0.2)'
        }}>
          <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#4a5568' }}>
            💡 Quick Destinations from {stations.find(s => s.id == fromStation)?.name}:
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {getStationRecommendations().map(station => (
              <button
                key={station.id}
                onClick={() => setToStation(station.id)}
                style={{
                  padding: '6px 12px',
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '20px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  color: '#4a5568'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#667eea'
                  e.target.style.color = 'white'
                  e.target.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'white'
                  e.target.style.color = '#4a5568'
                  e.target.style.transform = 'translateY(0)'
                }}
              >
                {station.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Panel */}
      <div className="shortcuts-panel" style={{
        marginTop: '20px',
        padding: '12px',
        background: 'rgba(45, 55, 72, 0.03)',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#718096'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center' }}>
          <div>⌨️ <strong>Enter</strong> - Find Route</div>
          <div>⌨️ <strong>Esc</strong> - Clear Path</div>
          <div>🖱️ <strong>Drag</strong> nodes in graph</div>
          <div>🔍 <strong>Mouse wheel</strong> - Zoom graph</div>
        </div>
      </div>

      {/* Loading Animation */}
      {showAnimation && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '20px 40px',
          borderRadius: '12px',
          fontSize: '18px',
          zIndex: 1000,
          animation: 'pulse 1s infinite'
        }}>
          🚀 Finding optimal route...
        </div>
      )}
    </div>
  )
}

export default RouteOptimizer