package com.transport.optimizer.dto;

import java.util.List;

public class OptimizeResponse {

    private List<String> path;
    private double totalDistance;
    private int totalTime;
    private double totalFare;
    private boolean reachable;
    private String optimizationType;

    public OptimizeResponse(List<String> path,
                            double totalDistance,
                            int totalTime,
                            double totalFare,
                            boolean reachable,
                            String optimizationType) {
        this.path = path;
        this.totalDistance = totalDistance;
        this.totalTime = totalTime;
        this.totalFare = totalFare;
        this.reachable = reachable;
        this.optimizationType = optimizationType;
    }

    public List<String> getPath() { return path; }
    public double getTotalDistance() { return totalDistance; }
    public int getTotalTime() { return totalTime; }
    public double getTotalFare() { return totalFare; }
    public boolean isReachable() { return reachable; }
    public String getOptimizationType() { return optimizationType; }

    public void setPath(List<String> path) { this.path = path; }
    public void setTotalDistance(double totalDistance) { this.totalDistance = totalDistance; }
    public void setTotalTime(int totalTime) { this.totalTime = totalTime; }
    public void setTotalFare(double totalFare) { this.totalFare = totalFare; }
    public void setReachable(boolean reachable) { this.reachable = reachable; }
    public void setOptimizationType(String optimizationType) { this.optimizationType = optimizationType; }
}