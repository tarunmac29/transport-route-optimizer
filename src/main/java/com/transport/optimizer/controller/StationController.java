package com.transport.optimizer.controller;

import com.transport.optimizer.model.Station;
import com.transport.optimizer.service.StationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stations")
@Tag(name = "Stations", description = "Station management APIs")
public class StationController {

    private final StationService stationService;

    public StationController(StationService stationService) {
        this.stationService = stationService;
    }

    @PostMapping
    @Operation(summary = "Create a station", description = "Creates a new station")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Station created successfully")
    })
    public Station createStation(@RequestBody Station station) {
        return stationService.createStation(station);
    }

    @GetMapping
    @Operation(summary = "Get all stations", description = "Returns all stations")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Stations retrieved successfully")
    })
    public List<Station> getAllStations() {
        return stationService.getAllStations();
    }
}
