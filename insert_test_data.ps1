# PowerShell script to populate database via REST API
# Make sure your Spring Boot application is running on localhost:8080

$baseUrl = "http://localhost:8081"

Write-Host "🚀 Inserting test data into Route Optimizer Database..." -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

# Function to make POST requests
function Post-Data {
    param(
        [string]$Url,
        [string]$Body,
        [string]$Description
    )
    
    try {
        Write-Host "📍 Creating: $Description" -ForegroundColor Yellow
        
        $response = Invoke-RestMethod -Uri $Url -Method POST -Body $Body -ContentType "application/json"
        Write-Host "✅ Success: $Description - ID: $($response.id)" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "❌ Error creating $Description : $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

Write-Host "`n🏢 Creating Stations..." -ForegroundColor Cyan

# Create Stations
$station1 = Post-Data "$baseUrl/stations" '{"name": "Central Station"}' "Central Station"
$station2 = Post-Data "$baseUrl/stations" '{"name": "Airport Terminal"}' "Airport Terminal"  
$station3 = Post-Data "$baseUrl/stations" '{"name": "Business District"}' "Business District"
$station4 = Post-Data "$baseUrl/stations" '{"name": "University Campus"}' "University Campus"
$station5 = Post-Data "$baseUrl/stations" '{"name": "Shopping Mall"}' "Shopping Mall"
$station6 = Post-Data "$baseUrl/stations" '{"name": "Remote Area"}' "Remote Area"

Write-Host "`n🛣️  Creating Routes..." -ForegroundColor Cyan

# Create Routes
Post-Data "$baseUrl/routes" @"
{
    "fromStation": {"id": 1},
    "toStation": {"id": 2},
    "distanceKm": 25.5,
    "travelTimeMin": 45,
    "fare": 15.50
}
"@ "Central → Airport"

Post-Data "$baseUrl/routes" @"
{
    "fromStation": {"id": 1},
    "toStation": {"id": 3}, 
    "distanceKm": 8.2,
    "travelTimeMin": 20,
    "fare": 5.75
}
"@ "Central → Business"

Post-Data "$baseUrl/routes" @"
{
    "fromStation": {"id": 3},
    "toStation": {"id": 4},
    "distanceKm": 12.0,
    "travelTimeMin": 25,
    "fare": 8.25
}
"@ "Business → University"

Post-Data "$baseUrl/routes" @"
{
    "fromStation": {"id": 4},
    "toStation": {"id": 5},
    "distanceKm": 6.8,
    "travelTimeMin": 15,
    "fare": 4.50
}
"@ "University → Shopping"

Post-Data "$baseUrl/routes" @"
{
    "fromStation": {"id": 3},
    "toStation": {"id": 5},
    "distanceKm": 15.3,
    "travelTimeMin": 35,
    "fare": 9.75
}
"@ "Business → Shopping (Direct)"

Post-Data "$baseUrl/routes" @"
{
    "fromStation": {"id": 2},
    "toStation": {"id": 4},
    "distanceKm": 30.0,
    "travelTimeMin": 50,
    "fare": 18.00
}
"@ "Airport → University"

Write-Host "`n📊 Verifying data..." -ForegroundColor Cyan

try {
    $stations = Invoke-RestMethod -Uri "$baseUrl/stations" -Method GET
    $routes = Invoke-RestMethod -Uri "$baseUrl/routes" -Method GET
    
    Write-Host "✅ Total Stations Created: $($stations.Count)" -ForegroundColor Green
    Write-Host "✅ Total Routes Created: $($routes.Count)" -ForegroundColor Green
    
    Write-Host "`n📋 Stations:" -ForegroundColor White
    foreach ($station in $stations) {
        Write-Host "   ID: $($station.id) - $($station.name)" -ForegroundColor Gray
    }
    
    Write-Host "`n🛣️  Routes:" -ForegroundColor White
    foreach ($route in $routes) {
        Write-Host "   ID: $($route.id) - $($route.fromStation.name) → $($route.toStation.name) (Distance: $($route.distanceKm)km, Time: $($route.travelTimeMin)min, Fare: $$$($route.fare))" -ForegroundColor Gray
    }
}
catch {
    Write-Host "❌ Error verifying data: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎯 Test the optimization endpoints:" -ForegroundColor Magenta
Write-Host "Distance: $baseUrl/routes/optimize?from=1&to=5&type=distance" -ForegroundColor Yellow
Write-Host "Time:     $baseUrl/routes/optimize?from=1&to=5&type=time" -ForegroundColor Yellow
Write-Host "Fare:     $baseUrl/routes/optimize?from=1&to=5&type=fare" -ForegroundColor Yellow
Write-Host "Multi:    $baseUrl/routes/optimize?from=1&to=5&type=multi" -ForegroundColor Yellow

Write-Host "`n✨ Database setup complete! Ready for testing." -ForegroundColor Green