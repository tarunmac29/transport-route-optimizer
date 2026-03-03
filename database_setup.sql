-- Transport Route Optimizer - Test Data Insertion
-- Run these SQL commands in your MySQL database: transport_db

-- Clear existing data (optional - only if you want to start fresh)
-- DELETE FROM routes;
-- DELETE FROM stations;
-- ALTER TABLE stations AUTO_INCREMENT = 1;
-- ALTER TABLE routes AUTO_INCREMENT = 1;

-- Insert Stations
INSERT INTO stations (name) VALUES 
('Central Station'),
('Airport Terminal'),
('Business District'),
('University Campus'),
('Shopping Mall'),
('Remote Area');

-- Insert Routes (bidirectional relationships will be created by the application)
INSERT INTO routes (from_station_id, to_station_id, distance_km, travel_time_min, fare) VALUES
-- Central Station (ID: 1) connections
(1, 2, 25.5, 45, 15.50),  -- Central → Airport
(1, 3, 8.2, 20, 5.75),    -- Central → Business

-- Business District (ID: 3) connections  
(3, 4, 12.0, 25, 8.25),   -- Business → University
(3, 5, 15.3, 35, 9.75),   -- Business → Shopping (Direct)

-- University Campus (ID: 4) connections
(4, 5, 6.8, 15, 4.50),    -- University → Shopping

-- Airport Terminal (ID: 2) connections
(2, 4, 30.0, 50, 18.00);  -- Airport → University

-- Verify data insertion
SELECT 'Stations Created:' AS info;
SELECT id, name FROM stations ORDER BY id;

SELECT 'Routes Created:' AS info;
SELECT 
    r.id,
    s1.name AS from_station,
    s2.name AS to_station,
    r.distance_km,
    r.travel_time_min,
    r.fare
FROM routes r
JOIN stations s1 ON r.from_station_id = s1.id
JOIN stations s2 ON r.to_station_id = s2.id
ORDER BY r.id;