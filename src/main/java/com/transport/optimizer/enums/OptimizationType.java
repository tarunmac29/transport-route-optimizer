package com.transport.optimizer.enums;

public enum OptimizationType {
    DISTANCE("distance"),
    TIME("time"),
    MULTI("multi");
    
    private final String value;
    
    OptimizationType(String value) {
        this.value = value;
    }
    
    public String getValue() {
        return value;
    }
    
    public static OptimizationType fromString(String text) {
        if (text == null) return TIME; // default fallback
        
        for (OptimizationType type : OptimizationType.values()) {
            if (type.value.equalsIgnoreCase(text.trim())) {
                return type;
            }
        }
        return TIME; // default fallback
    }
}