package com.transport.optimizer.controller;

import com.transport.optimizer.enums.OptimizationType;
import com.transport.optimizer.model.Route;
import com.transport.optimizer.service.RouteService;
import org.springframework.web.bind.annotation.*;
import com.transport.optimizer.dto.RouteRequest;
import com.transport.optimizer.dto.OptimizeResponse;


import java.util.List;

@RestController
@RequestMapping("/routes")
public class RouteController {

    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @GetMapping
    public List<Route> getAllRoutes() {
        return routeService.getAllRoutes();
    }

    @PostMapping
    public Route createRoute(@RequestBody Route route) {
        return routeService.createRoute(route);
    }

    @GetMapping("/optimize")
    public OptimizeResponse optimize(
            @RequestParam Long from,
            @RequestParam Long to,
            @RequestParam(defaultValue = "time") String type) {

            OptimizationType optimizationType = OptimizationType.fromString(type);
        return routeService.optimize(from, to, optimizationType);
    }
}
