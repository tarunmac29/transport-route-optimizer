package com.transport.optimizer.routing;

import com.transport.optimizer.dto.RouteResultDTO;

import java.util.*;

public class MultiCriteriaStrategy implements RoutingStrategy {

    @Override
    public RouteResultDTO shortestPath(Graph graph, Long source, Long destination) {

        double wDistance = 0.4;
        double wTime = 0.4;
        double wFare = 0.2;

        Map<Long, Double> distances = new HashMap<>();
        Map<Long, Long> previous = new HashMap<>();

        PriorityQueue<Node> pq =
                new PriorityQueue<>(Comparator.comparingDouble(n -> n.cost));

        pq.add(new Node(source, 0.0));
        distances.put(source, 0.0);

        while (!pq.isEmpty()) {

            Node current = pq.poll();

            if (current.cost > distances.getOrDefault(current.stationId, Double.MAX_VALUE)) {
                continue;
            }

            if (current.stationId.equals(destination)) {
                break;
            }

            for (Edge edge : graph.getNeighbors(current.stationId)) {

                double weightedCost =
                        (edge.getDistanceKm() * wDistance) +
                        (edge.getTravelTimeMin() * wTime) +
                        (edge.getFare() * wFare);

                double newDist = current.cost + weightedCost;

                if (newDist < distances.getOrDefault(edge.getToStationId(), Double.MAX_VALUE)) {

                    distances.put(edge.getToStationId(), newDist);
                    previous.put(edge.getToStationId(), current.stationId);

                    pq.add(new Node(edge.getToStationId(), newDist));
                }
            }
        }

        // Check if destination is reachable
        if (!distances.containsKey(destination) || distances.get(destination) == Double.MAX_VALUE) {
            return new RouteResultDTO(Collections.emptyList(), Double.MAX_VALUE);
        }

        List<Long> path = new ArrayList<>();
        Long step = destination;

        while (step != null) {
            path.add(step);
            step = previous.get(step);
        }

        Collections.reverse(path);

        // Validate path - check if destination is reachable from source
        if (path.isEmpty() || !path.get(0).equals(source)) {
            return new RouteResultDTO(Collections.emptyList(), Double.MAX_VALUE);
        }

        return new RouteResultDTO(path, distances.get(destination));
    }

    static class Node {
        Long stationId;
        double cost;

        Node(Long stationId, double cost) {
            this.stationId = stationId;
            this.cost = cost;
        }
    }
}