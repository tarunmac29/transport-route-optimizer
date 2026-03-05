# 🚀 Route Optimizer - Startup Guide

## Quick Start Instructions

### 1. Start the Backend Server (Port 8082)

**Option A: Using Maven (Recommended)**
```bash
# Navigate to the Java project root
cd "c:\Users\R.pc\Desktop\Java Project\optimizer"

# Run the Spring Boot application
./mvnw spring-boot:run
```

**Option B: Using your IDE**
- Open the project in IntelliJ IDEA or Eclipse
- Run `TransportRouteOptimizerApplication.java`

### 2. Start the React Frontend

```bash
# Navigate to the React app
cd "c:\Users\R.pc\Desktop\Java Project\optimizer\route-visualizer"

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

## ✅ Verify Everything is Working

1. **Backend Health Check**: Visit http://localhost:8082/stations in your browser
   - Should return JSON data with stations

2. **Frontend**: Visit http://localhost:5173 (or the port shown in terminal)
   - Should show the Route Optimizer interface
   - Connection status should show "✅ Connected • X stations available"

## 🔧 Troubleshooting

### Backend Issues:
- **Port 8082 already in use**: Change `server.port` in `application.properties`
- **Database connection error**: Check MySQL is running and database exists
- **No stations loaded**: Run the SQL scripts in `database_setup.sql` first

### Frontend Issues:
- **"No Data Available"**: Backend is not running or wrong port
- **CORS errors**: Check `CorsConfig.java` allows localhost:5173
- **Module not found**: Run `npm install` in the route-visualizer directory

## 📊 Testing the Application

1. Select "From Station" (departure)
2. Select "To Station" (destination) 
3. Choose optimization type (Distance/Time/Fare)
4. Click "🚀 Find Route"
5. View the optimized path in the graph visualization

## 🎯 Key Features Fixed:

- ✅ API endpoint consistency (all using port 8082)
- ✅ Better error handling and user feedback
- ✅ Connection status indicators
- ✅ Improved loading states and animations
- ✅ Enhanced UI styling and responsiveness
- ✅ Clearer error messages for debugging

Enjoy your route optimization! 🗺️