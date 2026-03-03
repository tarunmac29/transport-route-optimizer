package com.transport.optimizer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class RouteResultDTO {

    private List<Long> path;
    private double totalCost;
}