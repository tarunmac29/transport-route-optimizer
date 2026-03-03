package com.transport.optimizer.controller;

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

    @PostMapping
public Route createRoute(@RequestBody Route route) {
    return routeService.createRoute(route);
}

@GetMapping("/optimize")
public OptimizeResponse optimize(
        @RequestParam Long from,
        @RequestParam Long to) {

    return routeService.optimize(from, to);
}


    @GetMapping
    public List<Route> getAllRoutes() {
        return routeService.getAllRoutes();
    }
}
