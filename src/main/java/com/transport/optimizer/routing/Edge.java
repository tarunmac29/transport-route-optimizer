package com.transport.optimizer.routing;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Edge {

    private Long toStationId;
    private double distanceKm;
    private int travelTimeMin;
    private double fare;
}