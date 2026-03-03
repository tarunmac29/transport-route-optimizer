package com.transport.optimizer.service;

import com.transport.optimizer.dto.OptimizeResponse;
import com.transport.optimizer.dto.RouteRequest;
import com.transport.optimizer.model.Route;
import com.transport.optimizer.model.Station;
import com.transport.optimizer.repository.RouteRepository;
import com.transport.optimizer.repository.StationRepository;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.HashMap;
import java.util.PriorityQueue;
import java.util.Comparator;
import java.util.ArrayList;
import java.util.List;

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
    public OptimizeResponse optimize(Long fromId, Long toId) {

    Map<Long, Double> distances = new HashMap<>();
    Map<Long, Long> previous = new HashMap<>();
    PriorityQueue<Long> pq = new PriorityQueue<>(Comparator.comparing(distances::get));

    // Initialize
    for (Station station : stationRepository.findAll()) {
        distances.put(station.getId(), Double.MAX_VALUE);
    }

    distances.put(fromId, 0.0);
    pq.add(fromId);

    while (!pq.isEmpty()) {
        Long current = pq.poll();

        if (current.equals(toId)) break;

        List<Route> routes = routeRepository.findByFromStationId(current);

        for (Route route : routes) {
            Long neighbor = route.getToStation().getId();
            double newDist = distances.get(current) + route.getDistanceKm();

            if (newDist < distances.get(neighbor)) {
                distances.put(neighbor, newDist);
                previous.put(neighbor, current);
                pq.add(neighbor);
            }
        }
    }

    // Build path
    List<String> path = new ArrayList<>();
    Long step = toId;

    double totalDistance = 0;
    int totalTime = 0;
    double totalFare = 0;

    while (step != null) {
        Station station = stationRepository.findById(step).orElseThrow();
        path.add(0, station.getName());

        Long prev = previous.get(step);
        if (prev != null) {
            Long currentStep = step;  // create effectively final copy

Route route = routeRepository.findByFromStationId(prev)
        .stream()
        .filter(r -> r.getToStation().getId().equals(currentStep))
        .findFirst()
        .orElseThrow();

            totalDistance += route.getDistanceKm();
            totalTime += route.getTravelTimeMin();
            totalFare += route.getFare();
        }

        step = prev;
    }

    return new OptimizeResponse(path, totalDistance, totalTime, totalFare);
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
