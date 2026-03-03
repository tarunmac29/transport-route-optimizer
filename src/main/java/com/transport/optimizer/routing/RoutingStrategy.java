package com.transport.optimizer.routing;

import com.transport.optimizer.dto.RouteResultDTO;

public interface RoutingStrategy {

    RouteResultDTO shortestPath(Graph graph, Long source, Long destination);
}