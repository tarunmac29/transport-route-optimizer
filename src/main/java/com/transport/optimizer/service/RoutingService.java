package com.transport.optimizer.service;

import com.transport.optimizer.routing.*;
import org.springframework.stereotype.Service;
import com.transport.optimizer.dto.RouteResultDTO;
import com.transport.optimizer.enums.OptimizationType;

@Service
public class RoutingService {

    private final GraphBuilderService graphBuilderService;

    public RoutingService(GraphBuilderService graphBuilderService) {
        this.graphBuilderService = graphBuilderService;
    }

    /**
     * Finds optimal route using clean strategy pattern
     * No database calls in algorithm loops - graph built once
     */
    public RouteResultDTO findRoute(Long from, Long to, String type) {
        // Build graph once - all DB calls happen here
        Graph graph = graphBuilderService.buildGraph();
        
        // Select strategy based on optimization type
        RoutingStrategy strategy = getStrategy(type);
        
        // Clean algorithm execution - no DB calls
        return strategy.shortestPath(graph, from, to);
    }

    private RoutingStrategy getStrategy(String type) {
        OptimizationType optimizationType = OptimizationType.fromString(type);
        
        switch (optimizationType) {
            case DISTANCE:
                return new TravelDistanceStrategy();
            case MULTI:
                return new MultiCriteriaStrategy();
            case TIME:
            default:
                return new TravelTimeStrategy();
        }
    }
}