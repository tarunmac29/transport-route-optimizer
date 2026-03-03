package com.transport.optimizer.routing;

import java.util.*;

public class Graph {

    private final Map<Long, List<Edge>> adjacencyList = new HashMap<>();

    public void addEdge(Long from, Edge edge) {
        adjacencyList
                .computeIfAbsent(from, k -> new ArrayList<>())
                .add(edge);
    }

    public List<Edge> getNeighbors(Long stationId) {
        return adjacencyList.getOrDefault(stationId, new ArrayList<>());
    }
}
