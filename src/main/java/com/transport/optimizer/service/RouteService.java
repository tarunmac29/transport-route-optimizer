package com.transport.optimizer.service;

import com.transport.optimizer.dto.RouteRequest;
import com.transport.optimizer.model.Route;
import com.transport.optimizer.model.Station;
import com.transport.optimizer.repository.RouteRepository;
import com.transport.optimizer.repository.StationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteService {

    private final RouteRepository routeRepository;
private final StationRepository stationRepository;

    public RouteService(RouteRepository routeRepository,
                    StationRepository stationRepository) {
    this.routeRepository = routeRepository;
    this.stationRepository = stationRepository;
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
