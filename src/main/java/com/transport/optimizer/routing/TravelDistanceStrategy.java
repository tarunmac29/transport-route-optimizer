package com.transport.optimizer.routing;

import com.transport.optimizer.dto.RouteResultDTO;

import java.util.*;

public class TravelDistanceStrategy implements RoutingStrategy {

    @Override
    public RouteResultDTO shortestPath(Graph graph, Long source, Long destination) {

        Map<Long, Double> distances = new HashMap<>();
        Map<Long, Long> previous = new HashMap<>();

        PriorityQueue<long[]> pq =
                new PriorityQueue<>(Comparator.comparingDouble(a -> a[1]));

        pq.add(new long[]{source, 0});
        distances.put(source, 0.0);

        while (!pq.isEmpty()) {
            long[] current = pq.poll();
            Long station = current[0];
            double currentDist = current[1];

            for (Edge edge : graph.getNeighbors(station)) {

                double newDist = currentDist + edge.getDistanceKm();

                if (!distances.containsKey(edge.getToStationId())
                        || newDist < distances.get(edge.getToStationId())) {

                    distances.put(edge.getToStationId(), newDist);
                    previous.put(edge.getToStationId(), station);

                    pq.add(new long[]{edge.getToStationId(), (long) newDist});
                }
            }
        }

        List<Long> path = buildPath(previous, source, destination);

        return new RouteResultDTO(
                path,
                distances.getOrDefault(destination, Double.MAX_VALUE)
        );
    }

    private List<Long> buildPath(Map<Long, Long> previous,
                                 Long source,
                                 Long destination) {

        List<Long> path = new ArrayList<>();

        for (Long at = destination; at != null; at = previous.get(at)) {
            path.add(at);
        }

        Collections.reverse(path);

        if (path.isEmpty() || !path.get(0).equals(source)) {
            return Collections.emptyList();
        }

        return path;
    }
}