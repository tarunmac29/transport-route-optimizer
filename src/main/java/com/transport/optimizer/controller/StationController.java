package com.transport.optimizer.controller;

import com.transport.optimizer.model.Station;
import com.transport.optimizer.service.StationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stations")
public class StationController {

    private final StationService stationService;

    public StationController(StationService stationService) {
        this.stationService = stationService;
    }

    // Add new station
    @PostMapping
    public Station createStation(@RequestBody Station station) {
        return stationService.createStation(station);
    }

    // Get all stations
    @GetMapping
    public List<Station> getAllStations() {
        return stationService.getAllStations();
    }
}
