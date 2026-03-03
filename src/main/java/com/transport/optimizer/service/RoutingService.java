package com.transport.optimizer.service;

import com.transport.optimizer.routing.*;
import org.springframework.stereotype.Service;
import com.transport.optimizer.dto.RouteResultDTO;

import java.util.Map;

@Service
public class RoutingService {

    private final GraphBuilderService graphBuilderService;

    public RoutingService(GraphBuilderService graphBuilderService) {
        this.graphBuilderService = graphBuilderService;
    }

    public RouteResultDTO findRoute(Long from, Long to, String type) {

        Graph graph = graphBuilderService.buildGraph();

        RoutingStrategy strategy;

        switch (type.toLowerCase()) {
            case "distance":
                strategy = new TravelDistanceStrategy();
                break;
            case "fare":
                strategy = new TravelFareStrategy();
                break;
            case "multi":
                strategy = new MultiCriteriaStrategy();
                break;
            default:
                strategy = new TravelTimeStrategy();
        }

        //Map<Long, Double> distances = strategy.shortestPath(graph, from);

        return strategy.shortestPath(graph, from, to);    }
}