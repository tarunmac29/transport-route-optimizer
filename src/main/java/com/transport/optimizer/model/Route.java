package com.transport.optimizer.model;

import jakarta.persistence.*;

@Entity
@Table(name = "routes")
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "from_station_id", nullable = false)
    private Station fromStation;

    @ManyToOne
    @JoinColumn(name = "to_station_id", nullable = false)
    private Station toStation;

    private double distanceKm;
    private int travelTimeMin;
    private double fare;

    public Route() {}

    public Route(Long id, Station fromStation, Station toStation,
                 double distanceKm, int travelTimeMin, double fare) {
        this.id = id;
        this.fromStation = fromStation;
        this.toStation = toStation;
        this.distanceKm = distanceKm;
        this.travelTimeMin = travelTimeMin;
        this.fare = fare;
    }

    public Long getId() { return id; }
    public Station getFromStation() { return fromStation; }
    public Station getToStation() { return toStation; }
    public double getDistanceKm() { return distanceKm; }
    public int getTravelTimeMin() { return travelTimeMin; }
    public double getFare() { return fare; }

    public void setId(Long id) { this.id = id; }
    public void setFromStation(Station fromStation) { this.fromStation = fromStation; }
    public void setToStation(Station toStation) { this.toStation = toStation; }
    public void setDistanceKm(double distanceKm) { this.distanceKm = distanceKm; }
    public void setTravelTimeMin(int travelTimeMin) { this.travelTimeMin = travelTimeMin; }
    public void setFare(double fare) { this.fare = fare; }
}