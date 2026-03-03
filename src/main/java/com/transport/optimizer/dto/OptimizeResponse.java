package com.transport.optimizer.dto;

import java.util.List;

public class OptimizeResponse {

    private List<String> path;
    private double totalDistance;
    private int totalTime;
    private double totalFare;

    public OptimizeResponse(List<String> path,
                            double totalDistance,
                            int totalTime,
                            double totalFare) {
        this.path = path;
        this.totalDistance = totalDistance;
        this.totalTime = totalTime;
        this.totalFare = totalFare;
    }

    public List<String> getPath() { return path; }
    public double getTotalDistance() { return totalDistance; }
    public int getTotalTime() { return totalTime; }
    public double getTotalFare() { return totalFare; }

    public void setPath(List<String> path) { this.path = path; }
    public void setTotalDistance(double totalDistance) { this.totalDistance = totalDistance; }
    public void setTotalTime(int totalTime) { this.totalTime = totalTime; }
    public void setTotalFare(double totalFare) { this.totalFare = totalFare; }
}