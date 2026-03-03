package com.transport.optimizer.dto;

import lombok.Data;

@Data
public class RouteRequest {

    private Long fromStationId;
    private Long toStationId;
    private double distanceKm;
    private int travelTimeMin;
    private double fare;
}
