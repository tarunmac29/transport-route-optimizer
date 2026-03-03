package com.transport.optimizer.routing;

import com.transport.optimizer.dto.RouteResultDTO;

import java.util.*;

public class TravelTimeStrategy implements RoutingStrategy {

    @Override
    public RouteResultDTO shortestPath(Graph graph, Long source, Long destination) {

        Map<Long, Double> distances = new HashMap<>();
        Map<Long, Long> previous = new HashMap<>();

        PriorityQueue<Node> pq =
                new PriorityQueue<>(Comparator.comparingDouble(n -> n.cost));

        pq.add(new Node(source, 0.0));
        distances.put(source, 0.0);

        while (!pq.isEmpty()) {

            Node current = pq.poll();

            if (current.stationId.equals(destination)) {
                break;
            }

            for (Edge edge : graph.getNeighbors(current.stationId)) {

                double newDist = current.cost + edge.getTravelTimeMin();

                if (!distances.containsKey(edge.getToStationId())
                        || newDist < distances.get(edge.getToStationId())) {

                    distances.put(edge.getToStationId(), newDist);
                    previous.put(edge.getToStationId(), current.stationId);

                    pq.add(new Node(edge.getToStationId(), newDist));
                }
            }
        }

        // Reconstruct path
        List<Long> path = new ArrayList<>();
        Long step = destination;

        while (step != null) {
            path.add(step);
            step = previous.get(step);
        }

        Collections.reverse(path);

        // Validate path - check if destination is reachable from source
        if (path.isEmpty() || !path.get(0).equals(source)) {
            return new RouteResultDTO(
                    Collections.emptyList(),
                    Double.MAX_VALUE
            );
        }

        return new RouteResultDTO(
                path,
                distances.getOrDefault(destination, Double.MAX_VALUE)
        );
    }

    // Internal helper class (cleaner than long[])
    static class Node {
        Long stationId;
        double cost;

        Node(Long stationId, double cost) {
            this.stationId = stationId;
            this.cost = cost;
        }
    }
}