import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

const GraphVisualization = ({ stations, routes, optimizedPath, optimizationType, loading }) => {
  const svgRef = useRef()
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [selectedStation, setSelectedStation] = useState(null)
  const [hoveredElement, setHoveredElement] = useState(null)
  const [showControls, setShowControls] = useState(true)

  // Color schemes for different optimization types
  const colorSchemes = {
    distance: {
      primary: '#48bb78',
      secondary: '#68d391', 
      highlight: '#2f855a'
    },
    time: {
      primary: '#4299e1',
      secondary: '#63b3ed',
      highlight: '#2b6cb0'
    },
    fare: {
      primary: '#ed8936',
      secondary: '#f6ad55',
      highlight: '#c05621'
    }
  }

  // Generate mock coordinates for stations if they don't exist
  const generateStationPositions = (stationList) => {
    if (!stationList || stationList.length === 0) return {}
    
    const positions = {}
    const centerX = dimensions.width / 2
    const centerY = dimensions.height / 2
    const radius = Math.min(dimensions.width, dimensions.height) / 3

    stationList.forEach((station, index) => {
      if (station && station.id) {
        const angle = (2 * Math.PI * index) / stationList.length
        positions[station.id] = {
          x: centerX + (radius * Math.cos(angle)) + (Math.random() - 0.5) * 100,
          y: centerY + (radius * Math.sin(angle)) + (Math.random() - 0.5) * 100
        }
      }
    })

    return positions
  }

  // Update dimensions on window resize
  useEffect(() => {
    const handleResize = () => {
      const container = svgRef.current?.parentElement
      if (container) {
        setDimensions({
          width: container.offsetWidth,
          height: container.offsetHeight
        })
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Helper functions
  const processOptimalPath = (optimizedPath, stations) => {
    const pathEdges = new Set()
    const pathNodes = new Set()
    
    if (optimizedPath && optimizedPath.path && Array.isArray(optimizedPath.path)) {
      try {
        // Process edges
        for (let i = 0; i < optimizedPath.path.length - 1; i++) {
          const fromName = optimizedPath.path[i]
          const toName = optimizedPath.path[i + 1]
          
          if (fromName && toName) {
            const fromStation = stations.find(s => s && s.name === fromName)
            const toStation = stations.find(s => s && s.name === toName)
            
            if (fromStation && toStation) {
              pathEdges.add(`${fromStation.id}-${toStation.id}`)
              pathEdges.add(`${toStation.id}-${fromStation.id}`)
            }
          }
        }
        
        // Process nodes
        optimizedPath.path.forEach(stationName => {
          if (stationName) {
            const station = stations.find(s => s && s.name === stationName)
            if (station && station.id) {
              pathNodes.add(station.id)
            }
          }
        })
      } catch (error) {
        console.warn('Error processing optimal path:', error)
      }
    }
    
    return { pathEdges, pathNodes }
  }

  const addEdgeLabels = (mainGroup, links, pathEdges, colors, optimizationType) => {
    try {
      const labelGroup = mainGroup.append('g').attr('class', 'edge-labels')
      
      links.filter(link => link && pathEdges.has(link.id)).forEach((link, index) => {
        if (link.source && link.target && link.route) {
          const midX = (link.source.x + link.target.x) / 2
          const midY = (link.source.y + link.target.y) / 2
          
          // Animated background
          const bg = labelGroup.append('rect')
            .attr('x', midX - 30)
            .attr('y', midY - 12)
            .attr('width', 60)
            .attr('height', 24)
            .attr('fill', 'white')
            .attr('stroke', colors.highlight)
            .attr('stroke-width', 2)
            .attr('rx', 6)
            .style('opacity', 0)
            .transition()
            .delay(index * 200)
            .duration(500)
            .style('opacity', 1)
          
          let labelText = ''
          let icon = ''
          switch (optimizationType) {
            case 'distance':
              labelText = `${(link.route.distanceKm || 0).toFixed(1)}km`
              icon = '📏'
              break
            case 'time':
              labelText = `${link.route.travelTimeMin || 0}min`
              icon = '⏱️'
              break
            case 'fare':
              labelText = `$${(link.route.fare || 0).toFixed(2)}`
              icon = '💰'
              break
          }
          
          labelGroup.append('text')
            .attr('x', midX)
            .attr('y', midY + 2)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px')
            .attr('font-weight', 'bold')
            .attr('fill', colors.highlight)
            .style('opacity', 0)
            .text(`${icon} ${labelText}`)
            .transition()
            .delay(index * 200 + 300)
            .duration(500)
            .style('opacity', 1)
        }
      })
    } catch (error) {
      console.warn('Error adding edge labels:', error)
    }
  }

  const getNodeColor = (node, pathNodes, optimizedPath, colors) => {
    if (pathNodes.has(node.id)) {
      try {
        const isStart = optimizedPath && optimizedPath.path && optimizedPath.path[0] === node.name
        const isEnd = optimizedPath && optimizedPath.path && 
                     optimizedPath.path[optimizedPath.path.length - 1] === node.name
        return isStart ? '#dc3545' : isEnd ? '#28a745' : colors.primary
      } catch (error) {
        console.warn('Error determining node color:', error)
        return colors.primary
      }
    }
    return '#6c757d'
  }

  const centerGraph = (svg, mainGroup, zoom, width, height) => {
    try {
      const mainGroupNode = mainGroup.node()
      if (mainGroupNode) {
        const bounds = mainGroupNode.getBBox()
        const fullWidth = bounds.width
        const fullHeight = bounds.height
        
        if (fullWidth > 0 && fullHeight > 0) {
          const scale = Math.min(1, 0.8 / Math.max(fullWidth / width, fullHeight / height))
          const translate = [
            width / 2 - scale * (bounds.x + fullWidth / 2), 
            height / 2 - scale * (bounds.y + fullHeight / 2)
          ]

          svg.transition().duration(1000)
            .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale))
        }
      }
    } catch (error) {
      console.warn('Could not center graph:', error)
    }
  }

  // Main visualization effect
  useEffect(() => {
    if (!stations.length || !routes.length || !svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    // Set up SVG
    const { width, height } = dimensions
    svg.attr('width', width).attr('height', height)

    // Generate positions for stations
    const stationPositions = generateStationPositions(stations)

    // Create station lookup map
    const stationMap = {}
    stations.forEach(station => {
      if (station && station.id) {
        stationMap[station.id] = station
      }
    })

    // Process routes data for D3 - with better error handling
    const links = routes
      .filter(route => route && route.fromStation && route.toStation) // Filter invalid routes
      .map(route => ({
        source: stationPositions[route.fromStation.id],
        target: stationPositions[route.toStation.id],
        route: route,
        id: `${route.fromStation.id}-${route.toStation.id}`
      }))
      .filter(link => link.source && link.target) // Filter links with missing positions

    const nodes = stations
      .filter(station => station && station.id && stationPositions[station.id]) // Filter invalid stations
      .map(station => ({
        ...station,
        x: stationPositions[station.id].x,
        y: stationPositions[station.id].y
      }))

    // Determine which edges are part of the optimal path - with error handling
    const pathEdges = new Set()
    if (optimizedPath && optimizedPath.path && Array.isArray(optimizedPath.path)) {
      try {
        for (let i = 0; i < optimizedPath.path.length - 1; i++) {
          const fromName = optimizedPath.path[i]
          const toName = optimizedPath.path[i + 1]
          
          if (fromName && toName) {
            // Find stations by name
            const fromStation = stations.find(s => s && s.name === fromName)
            const toStation = stations.find(s => s && s.name === toName)
            
            if (fromStation && toStation) {
              pathEdges.add(`${fromStation.id}-${toStation.id}`)
              pathEdges.add(`${toStation.id}-${fromStation.id}`) // bidirectional
            }
          }
        }
      } catch (error) {
        console.warn('Error processing optimal path:', error)
      }
    }

    // Get current color scheme
    const colors = colorSchemes[optimizationType] || colorSchemes.time

    // Create main group
    const mainGroup = svg.append('g')

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        mainGroup.attr('transform', event.transform)
      })

    svg.call(zoom)

    // Draw edges/routes
    const linkGroup = mainGroup.append('g').attr('class', 'links')
    
    const linkElements = linkGroup.selectAll('.link')
      .data(links)
      .enter().append('line')
      .attr('class', 'link')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
      .attr('stroke', d => pathEdges.has(d.id) ? colors.highlight : '#999')
      .attr('stroke-width', d => pathEdges.has(d.id) ? 4 : 2)
      .attr('opacity', d => pathEdges.has(d.id) ? 1 : 0.6)

    // Add edge labels for routes in optimal path - with error handling
    if (optimizedPath && optimizedPath.path && pathEdges.size > 0) {
      try {
        const labelGroup = mainGroup.append('g').attr('class', 'edge-labels')
        
        links.filter(link => link && pathEdges.has(link.id)).forEach(link => {
          if (link.source && link.target && link.route) {
            const midX = (link.source.x + link.target.x) / 2
            const midY = (link.source.y + link.target.y) / 2
            
            labelGroup.append('rect')
              .attr('x', midX - 25)
              .attr('y', midY - 10)
              .attr('width', 50)
              .attr('height', 20)
              .attr('fill', 'white')
              .attr('stroke', colors.highlight)
              .attr('rx', 3)
            
            let labelText = ''
            switch (optimizationType) {
              case 'distance':
                labelText = `${(link.route.distanceKm || 0).toFixed(1)}km`
                break
              case 'time':
                labelText = `${link.route.travelTimeMin || 0}min`
                break
              case 'fare':
                labelText = `$${(link.route.fare || 0).toFixed(2)}`
                break
            }
            
            labelGroup.append('text')
              .attr('x', midX)
              .attr('y', midY + 4)
              .attr('text-anchor', 'middle')
              .attr('font-size', '10px')
              .attr('fill', colors.highlight)
              .text(labelText)
          }
        })
      } catch (error) {
        console.warn('Error adding edge labels:', error)
      }
    }

    // Draw nodes/stations
    const nodeGroup = mainGroup.append('g').attr('class', 'nodes')
    
    // Determine which nodes are part of the optimal path - with error handling
    const pathNodes = new Set()
    if (optimizedPath && optimizedPath.path && Array.isArray(optimizedPath.path)) {
      try {
        optimizedPath.path.forEach(stationName => {
          if (stationName) {
            const station = stations.find(s => s && s.name === stationName)
            if (station && station.id) {
              pathNodes.add(station.id)
            }
          }
        })
      } catch (error) {
        console.warn('Error processing path nodes:', error)
      }
    }

    const nodeElements = nodeGroup.selectAll('.node')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x}, ${d.y})`)

    // Add node circles
    nodeElements.append('circle')
      .attr('r', d => pathNodes.has(d.id) ? 12 : 8)
      .attr('fill', d => {
        if (pathNodes.has(d.id)) {
          try {
            const isStart = optimizedPath && optimizedPath.path && optimizedPath.path[0] === d.name
            const isEnd = optimizedPath && optimizedPath.path && 
                         optimizedPath.path[optimizedPath.path.length - 1] === d.name
            return isStart ? '#dc3545' : isEnd ? '#28a745' : colors.primary
          } catch (error) {
            console.warn('Error determining node color:', error)
            return colors.primary
          }
        }
        return '#6c757d'
      })
      .attr('stroke', d => pathNodes.has(d.id) ? colors.highlight : '#fff')
      .attr('stroke-width', 2)

    // Add node labels
    nodeElements.append('text')
      .attr('dy', -15)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', d => pathNodes.has(d.id) ? 'bold' : 'normal')
      .attr('fill', d => pathNodes.has(d.id) ? colors.highlight : '#333')
      .text(d => d.name || 'Unknown')

    // Add hover effects
    nodeElements
      .on('mouseenter', function(event, d) {
        d3.select(this).select('circle')
          .transition().duration(200)
          .attr('r', pathNodes.has(d.id) ? 15 : 12)
      })
      .on('mouseleave', function(event, d) {
        d3.select(this).select('circle')
          .transition().duration(200)
          .attr('r', pathNodes.has(d.id) ? 12 : 8)
      })

    // Center the view - with null check to prevent getBBox errors
    const mainGroupNode = mainGroup.node()
    if (mainGroupNode) {
      try {
        const bounds = mainGroupNode.getBBox()
        const fullWidth = bounds.width
        const fullHeight = bounds.height
        
        // Only apply transformation if bounds are valid
        if (fullWidth > 0 && fullHeight > 0) {
          const scale = 0.8 / Math.max(fullWidth / width, fullHeight / height)
          const translate = [
            width / 2 - scale * (bounds.x + fullWidth / 2), 
            height / 2 - scale * (bounds.y + fullHeight / 2)
          ]

          svg.transition().duration(750)
            .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale))
        }
      } catch (error) {
        console.warn('Could not get bounding box for graph centering:', error)
      }
    }

  }, [stations, routes, optimizedPath, optimizationType, dimensions])

  if (loading) {
    return (
      <div className="loading">
        <div>🔄 Loading graph visualization...</div>
        <div style={{ fontSize: '14px', marginTop: '10px', opacity: '0.7' }}>
          Connecting to backend server...
        </div>
      </div>
    )
  }

  if (!stations.length) {
    return (
      <div className="loading">
        <div style={{ fontSize: '18px', marginBottom: '10px' }}>📡 No Data Available</div>
        <div style={{ fontSize: '14px', textAlign: 'center', lineHeight: '1.5', maxWidth: '400px' }}>
          Please ensure the backend server is running on <strong>localhost:8082</strong>
          <br />
          Check that the database is connected and contains station data.
        </div>
        <div style={{ marginTop: '15px', fontSize: '12px', opacity: '0.6' }}>
          Expected endpoints: /stations, /routes, /routes/optimize
        </div>
      </div>
    )
  }

  return (
    <div className="graph-container">
      <svg ref={svgRef}></svg>
      
      {/* Legend */}
      <div className="legend">
        <h4>Legend</h4>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#dc3545' }}></div>
          Start Station
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#28a745' }}></div>
          End Station
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: colorSchemes[optimizationType]?.primary || '#007bff' }}></div>
          Optimal Path ({optimizationType})
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#999' }}></div>
          Other Routes
        </div>
        <div style={{ marginTop: '10px', fontSize: '11px', color: '#666' }}>
          Scroll to zoom • Drag to pan
        </div>
      </div>
    </div>
  )
}

export default GraphVisualization