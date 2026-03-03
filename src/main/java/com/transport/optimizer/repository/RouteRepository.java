package com.transport.optimizer.repository;

import com.transport.optimizer.model.Route;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RouteRepository extends JpaRepository<Route, Long> {

    List<Route> findByFromStationId(Long stationId);
}

