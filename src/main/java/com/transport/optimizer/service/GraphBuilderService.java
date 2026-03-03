package com.transport.optimizer.service;

import com.transport.optimizer.model.Route;
import com.transport.optimizer.repository.RouteRepository;
import com.transport.optimizer.routing.Edge;
import com.transport.optimizer.routing.Graph;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GraphBuilderService {

    private final RouteRepository routeRepository;

    public GraphBuilderService(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    public Graph buildGraph() {

        Graph graph = new Graph();

        List<Route> routes = routeRepository.findAll();

        for (Route route : routes) {

            Long fromId = route.getFromStation().getId();
            Long toId = route.getToStation().getId();

            Edge edge = new Edge(
                    toId,
                    route.getDistanceKm(),
                    route.getTravelTimeMin(),
                    route.getFare()
            );

            graph.addEdge(fromId, edge);

            // If bidirectional
            Edge reverseEdge = new Edge(
                    fromId,
                    route.getDistanceKm(),
                    route.getTravelTimeMin(),
                    route.getFare()
            );

            graph.addEdge(toId, reverseEdge);
        }

        return graph;
    }
}