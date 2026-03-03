# 🚀 POSTMAN TEST CASES - Route Optimization API

## Base URL: `http://localhost:8080`

---

## 🏗️ SETUP DATA (Run these first to populate the database)

### 1. Create Stations
**Method:** POST  
**URL:** `{{baseUrl}}/stations`  
**Headers:** Content-Type: application/json

**Test Data - Station 1:**
```json
{
    "name": "Central Station"
}
```

**Test Data - Station 2:**
```json
{
    "name": "Airport Terminal"
}
```

**Test Data - Station 3:**
```json
{
    "name": "Business District"
}
```

**Test Data - Station 4:**
```json
{
    "name": "University Campus"
}
```

**Test Data - Station 5:**
```json
{
    "name": "Shopping Mall"
}
```

**Test Data - Station 6 (Isolated):**
```json
{
    "name": "Remote Area"
}
```

---

### 2. Create Routes Between Stations
**Method:** POST  
**URL:** `{{baseUrl}}/routes`  
**Headers:** Content-Type: application/json

**Route 1: Central → Airport**
```json
{
    "fromStation": {"id": 1},
    "toStation": {"id": 2},
    "distanceKm": 25.5,
    "travelTimeMin": 45,
    "fare": 15.50
}
```

**Route 2: Central → Business**
```json
{
    "fromStation": {"id": 1},
    "toStation": {"id": 3},
    "distanceKm": 8.2,
    "travelTimeMin": 20,
    "fare": 5.75
}
```

**Route 3: Business → University**
```json
{
    "fromStation": {"id": 3},
    "toStation": {"id": 4},
    "distanceKm": 12.0,
    "travelTimeMin": 25,
    "fare": 8.25
}
```

**Route 4: University → Shopping**
```json
{
    "fromStation": {"id": 4},
    "toStation": {"id": 5},
    "distanceKm": 6.8,
    "travelTimeMin": 15,
    "fare": 4.50
}
```

**Route 5: Business → Shopping (Direct)**
```json
{
    "fromStation": {"id": 3},
    "toStation": {"id": 5},
    "distanceKm": 15.3,
    "travelTimeMin": 35,
    "fare": 9.75
}
```

**Route 6: Airport → University**
```json
{
    "fromStation": {"id": 2},
    "toStation": {"id": 4},
    "distanceKm": 30.0,
    "travelTimeMin": 50,
    "fare": 18.00
}
```

---

## 🧪 OPTIMIZATION TEST CASES

### Test 1: Distance Optimization
**Method:** GET  
**URL:** `{{baseUrl}}/routes/optimize?from=1&to=5&type=distance`

**Expected:** Should find shortest distance path  
**Validation:** Check `optimizationType` = "distance", path shows route, `reachable` = true

### Test 2: Time Optimization  
**Method:** GET  
**URL:** `{{baseUrl}}/routes/optimize?from=1&to=5&type=time`

**Expected:** Should find fastest time path  
**Validation:** Check `optimizationType` = "time", minimum `totalTime`

### Test 3: Fare Optimization
**Method:** GET  
**URL:** `{{baseUrl}}/routes/optimize?from=1&to=5&type=fare`

**Expected:** Should find cheapest fare path  
**Validation:** Check `optimizationType` = "fare", minimum `totalFare`

### Test 4: Multi-Criteria Optimization
**Method:** GET  
**URL:** `{{baseUrl}}/routes/optimize?from=1&to=5&type=multi`

**Expected:** Balanced optimization considering all factors  
**Validation:** Check `optimizationType` = "multi"

### Test 5: Default Optimization (No Type Specified)
**Method:** GET  
**URL:** `{{baseUrl}}/routes/optimize?from=1&to=5`

**Expected:** Should default to time optimization  
**Validation:** Check `optimizationType` = "time"

### Test 6: Long Distance Route
**Method:** GET  
**URL:** `{{baseUrl}}/routes/optimize?from=1&to=2&type=distance`

**Expected:** Direct route Central → Airport  
**Validation:** Single hop route

### Test 7: Multi-Hop Route
**Method:** GET  
**URL:** `{{baseUrl}}/routes/optimize?from=1&to=4&type=time`

**Expected:** Multiple stations in path  
**Validation:** Path length > 2

---

## 🚫 ERROR & EDGE CASE TESTS

### Test 8: Unreachable Destination
**Method:** GET  
**URL:** `{{baseUrl}}/routes/optimize?from=1&to=6&type=distance`

**Expected:** No path available  
**Validation:** `reachable` = false, empty `path` array

### Test 9: Same Source & Destination
**Method:** GET  
**URL:** `{{baseUrl}}/routes/optimize?from=1&to=1&type=time`

**Expected:** Should handle gracefully  

### Test 10: Invalid Station ID
**Method:** GET  
**URL:** `{{baseUrl}}/routes/optimize?from=999&to=1&type=distance`

**Expected:** Error handling for non-existent station

### Test 11: Invalid Optimization Type
**Method:** GET  
**URL:** `{{baseUrl}}/routes/optimize?from=1&to=5&type=invalid`

**Expected:** Should default to time optimization  
**Validation:** `optimizationType` = "time"

### Test 12: Missing Parameters
**Method:** GET  
**URL:** `{{baseUrl}}/routes/optimize?from=1`

**Expected:** 400 Bad Request - missing required parameter

---

## 📋 UTILITY ENDPOINTS

### Get All Stations
**Method:** GET  
**URL:** `{{baseUrl}}/stations`

**Expected:** List of all created stations with IDs

### Get All Routes
**Method:** GET  
**URL:** `{{baseUrl}}/routes`

**Expected:** List of all created routes

---

## 🎯 POSTMAN ENVIRONMENT VARIABLES

Create these variables in Postman:
- `baseUrl` = `http://localhost:8080`

---

## 📊 EXPECTED PERFORMANCE COMPARISONS

After running the setup, compare optimization results:

| From | To | Distance Route | Time Route | Fare Route | Multi Route |
|------|----|--------------|-----------|-----------| ------------|
| 1 | 5 | Shortest km | Fastest min | Cheapest $ | Balanced |
| 1 | 4 | Direct/Multi | Direct/Multi | Direct/Multi | Balanced |

---

## 🔥 ADVANCED TEST SCENARIOS

### Performance Test
Run the same optimization request multiple times to test:
- Response consistency  
- Performance (should be fast after first call due to no DB loops)

### Stress Test  
**Method:** GET  
**URL:** `{{baseUrl}}/routes/optimize?from=1&to=5&type=distance`  
**Repeat:** 50-100 times quickly  
**Expected:** Consistent fast responses

---

## ✅ SUCCESS CRITERIA

**For each optimization test, verify:**
1. ✅ `reachable`: true (when path exists)
2. ✅ `path`: Non-empty array with station names
3. ✅ `optimizationType`: Matches requested type
4. ✅ `totalDistance`, `totalTime`, `totalFare`: > 0
5. ✅ Response time: < 500ms
6. ✅ No database calls inside algorithm loops

**Sample Expected Response:**
```json
{
    "path": ["Central Station", "Business District", "Shopping Mall"],
    "totalDistance": 23.5,
    "totalTime": 55,
    "totalFare": 15.5,
    "reachable": true,
    "optimizationType": "distance"
}
```