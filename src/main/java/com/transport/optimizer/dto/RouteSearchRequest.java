package com.transport.optimizer.dto;

import lombok.Data;

@Data
public class RouteSearchRequest {

    private Long fromStationId;
    private Long toStationId;
    private String type; // time, distance, multi
}