package com.transport.optimizer.repository;

import com.transport.optimizer.model.Station;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StationRepository extends JpaRepository<Station, Long> {
}
