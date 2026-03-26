package com.transport.optimizer.service;

import com.transport.optimizer.dto.OptimizeResponse;
import com.transport.optimizer.dto.RouteResultDTO;
import com.transport.optimizer.enums.OptimizationType;
import com.transport.optimizer.model.Route;
import com.transport.optimizer.model.Station;
import com.transport.optimizer.repository.RouteRepository;
import com.transport.optimizer.repository.StationRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RouteService {

    private final RouteRepository routeRepository;
    private final StationRepository stationRepository;
    private final RoutingService routingService;

    public RouteService(RouteRepository routeRepository,
                       StationRepository stationRepository,
                       RoutingService routingService) {
        this.routeRepository = routeRepository;
        this.stationRepository = stationRepository;
        this.routingService = routingService;
    }

    /**
     * Optimizes route based on specified criteria
     * @param fromId source station ID
     * @param toId destination station ID 
      * @param type optimization type (DISTANCE, TIME, MULTI)
     * @return OptimizeResponse with path and metrics
     */
    public OptimizeResponse optimize(Long fromId, Long toId, OptimizationType type) {
        // Use clean routing service - no DB calls in loops
        RouteResultDTO result = routingService.findRoute(fromId, toId, type.getValue());
        
        // Check if path is reachable
        boolean reachable = !result.getPath().isEmpty() && result.getTotalCost() != Double.MAX_VALUE;
        
        if (!reachable) {
            return new OptimizeResponse(
                new ArrayList<>(), 0.0, 0, 0.0, false, type.getValue()
            );
        }

        // Build response with station names and calculate all metrics
        return buildOptimizeResponse(result.getPath(), type.getValue());
    }

    /**
     * Legacy method for backward compatibility
     */
    public OptimizeResponse optimize(Long fromId, Long toId) {
        return optimize(fromId, toId, OptimizationType.TIME);
    }

    private OptimizeResponse buildOptimizeResponse(List<Long> stationIds, String optimizationType) {
        // Pre-load all stations to avoid N+1 queries
        Map<Long, Station> stationMap = new HashMap<>();
        for (Station station : stationRepository.findAll()) {
            stationMap.put(station.getId(), station);
        }

        // Pre-load all routes to avoid repeated DB queries  
        Map<String, Route> routeMap = new HashMap<>();
        for (Route route : routeRepository.findAll()) {
            String key = route.getFromStation().getId() + "->" + route.getToStation().getId();
            routeMap.put(key, route);
        }

        // Build path with station names
        List<String> path = new ArrayList<>();
        for (Long stationId : stationIds) {
            Station station = stationMap.get(stationId);
            if (station != null) {
                path.add(station.getName());
            }
        }

        // Calculate total metrics
        double totalDistance = 0;
        int totalTime = 0;
        double totalFare = 0;

        for (int i = 0; i < stationIds.size() - 1; i++) {
            Long fromStationId = stationIds.get(i);
            Long toStationId = stationIds.get(i + 1);
            
            String routeKey = fromStationId + "->" + toStationId;
            Route route = routeMap.get(routeKey);
            
            if (route != null) {
                totalDistance += route.getDistanceKm();
                totalTime += route.getTravelTimeMin();
                totalFare += route.getFare();
            }
        }

        return new OptimizeResponse(path, totalDistance, totalTime, totalFare, true, optimizationType);
    }

    public Route createRoute(Route routeRequest) {

    // Fetch actual stations from DB using IDs
    Station fromStation = stationRepository
            .findById(routeRequest.getFromStation().getId())
            .orElseThrow(() -> new RuntimeException("From station not found"));

    Station toStation = stationRepository
            .findById(routeRequest.getToStation().getId())
            .orElseThrow(() -> new RuntimeException("To station not found"));

    // Create new route object
    Route route = new Route();
    route.setFromStation(fromStation);
    route.setToStation(toStation);
    route.setDistanceKm(routeRequest.getDistanceKm());
    route.setTravelTimeMin(routeRequest.getTravelTimeMin());
    route.setFare(routeRequest.getFare());

    return routeRepository.save(route);
}

    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }
}
