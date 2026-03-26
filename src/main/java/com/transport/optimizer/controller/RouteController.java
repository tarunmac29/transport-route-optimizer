package com.transport.optimizer.controller;

import com.transport.optimizer.enums.OptimizationType;
import com.transport.optimizer.model.Route;
import com.transport.optimizer.service.RouteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import com.transport.optimizer.dto.OptimizeResponse;

import java.util.List;

@RestController
@RequestMapping("/routes")
@Tag(name = "Routes", description = "Route management and optimization APIs")
public class RouteController {

    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @GetMapping
        @Operation(summary = "Get all routes", description = "Returns all available transport routes")
        @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Routes retrieved successfully")
        })
    public List<Route> getAllRoutes() {
        return routeService.getAllRoutes();
    }

    @PostMapping
        @Operation(summary = "Create a route", description = "Creates a new transport route between two stations")
        @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Route created successfully")
        })
    public Route createRoute(@RequestBody Route route) {
        return routeService.createRoute(route);
    }

    @GetMapping("/optimize")
        @Operation(summary = "Optimize route between stations", description = "Finds the best route by distance, time, fare, or multi-criteria strategy")
        @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Route optimization completed successfully")
        })
    public OptimizeResponse optimize(
            @Parameter(description = "Source station ID") @RequestParam Long from,
            @Parameter(description = "Destination station ID") @RequestParam Long to,
            @Parameter(description = "Optimization type", schema = @Schema(allowableValues = {"distance", "time", "fare", "multi"}))
            @RequestParam(required = false, defaultValue = "distance") String type) {

            OptimizationType optimizationType = OptimizationType.fromString(type);
        return routeService.optimize(from, to, optimizationType);
    }
}
