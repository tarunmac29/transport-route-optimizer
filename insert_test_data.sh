#!/bin/bash
# Bash script to populate database via REST API using curl
# Make sure your Spring Boot application is running on localhost:8080

BASE_URL="http://localhost:8081"

echo "🚀 Inserting test data into Route Optimizer Database..."
echo "==============================================="

echo "🏢 Creating Stations..."

# Create Stations
echo "📍 Creating Central Station..."
curl -X POST "$BASE_URL/stations" \
  -H "Content-Type: application/json" \
  -d '{"name": "Central Station"}'
echo

echo "📍 Creating Airport Terminal..."
curl -X POST "$BASE_URL/stations" \
  -H "Content-Type: application/json" \
  -d '{"name": "Airport Terminal"}'
echo

echo "📍 Creating Business District..."
curl -X POST "$BASE_URL/stations" \
  -H "Content-Type: application/json" \
  -d '{"name": "Business District"}'
echo

echo "📍 Creating University Campus..."
curl -X POST "$BASE_URL/stations" \
  -H "Content-Type: application/json" \
  -d '{"name": "University Campus"}'
echo

echo "📍 Creating Shopping Mall..."
curl -X POST "$BASE_URL/stations" \
  -H "Content-Type: application/json" \
  -d '{"name": "Shopping Mall"}'
echo

echo "📍 Creating Remote Area..."
curl -X POST "$BASE_URL/stations" \
  -H "Content-Type: application/json" \
  -d '{"name": "Remote Area"}'
echo

echo "🛣️ Creating Routes..."

echo "📍 Creating Central → Airport route..."
curl -X POST "$BASE_URL/routes" \
  -H "Content-Type: application/json" \
  -d '{
    "fromStation": {"id": 1},
    "toStation": {"id": 2},
    "distanceKm": 25.5,
    "travelTimeMin": 45,
    "fare": 15.50
  }'
echo

echo "📍 Creating Central → Business route..."
curl -X POST "$BASE_URL/routes" \
  -H "Content-Type: application/json" \
  -d '{
    "fromStation": {"id": 1},
    "toStation": {"id": 3},
    "distanceKm": 8.2,
    "travelTimeMin": 20,
    "fare": 5.75
  }'
echo

echo "📍 Creating Business → University route..."
curl -X POST "$BASE_URL/routes" \
  -H "Content-Type: application/json" \
  -d '{
    "fromStation": {"id": 3},
    "toStation": {"id": 4},
    "distanceKm": 12.0,
    "travelTimeMin": 25,
    "fare": 8.25
  }'
echo

echo "📍 Creating University → Shopping route..."
curl -X POST "$BASE_URL/routes" \
  -H "Content-Type: application/json" \
  -d '{
    "fromStation": {"id": 4},
    "toStation": {"id": 5},
    "distanceKm": 6.8,
    "travelTimeMin": 15,
    "fare": 4.50
  }'
echo

echo "📍 Creating Business → Shopping (Direct) route..."
curl -X POST "$BASE_URL/routes" \
  -H "Content-Type: application/json" \
  -d '{
    "fromStation": {"id": 3},
    "toStation": {"id": 5},
    "distanceKm": 15.3,
    "travelTimeMin": 35,
    "fare": 9.75
  }'
echo

echo "📍 Creating Airport → University route..."
curl -X POST "$BASE_URL/routes" \
  -H "Content-Type: application/json" \
  -d '{
    "fromStation": {"id": 2},
    "toStation": {"id": 4},
    "distanceKm": 30.0,
    "travelTimeMin": 50,
    "fare": 18.00
  }'
echo

echo "📊 Verifying data..."
echo "Stations:"
curl -s "$BASE_URL/stations" | jq '.'

echo "Routes:"
curl -s "$BASE_URL/routes" | jq '.'

echo "🎯 Test optimization endpoints:"
echo "Distance: $BASE_URL/routes/optimize?from=1&to=5&type=distance"
echo "Time:     $BASE_URL/routes/optimize?from=1&to=5&type=time"
echo "Fare:     $BASE_URL/routes/optimize?from=1&to=5&type=fare"
echo "Multi:    $BASE_URL/routes/optimize?from=1&to=5&type=multi"

echo "✨ Database setup complete!"