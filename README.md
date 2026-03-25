# Smart Tourist Safety Monitoring & Incident Response System

A complete full-stack application for monitoring tourist safety, detecting risky areas, and handling emergency responses.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Frontend Features](#frontend-features)
- [Sample Data](#sample-data)

## Features

### 1. Tourist Management
- User registration with Passport, country, and contact details
- Secure JWT-based authentication
- User profile management

### 2. Location Tracking
- Real-time GPS tracking of tourist locations
- Location history storage
- Geofencing capabilities

### 3. Safety Monitoring
- Predefined safety zones (Safe, Danger, Restricted)
- Automatic alerts when entering danger zones
- Real-time location updates

### 4. Incident Reporting
- Report incidents (theft, harassment, lost documents, medical emergency)
- Location-based incident logging
- Incident status tracking (Open/Resolved)

### 5. Emergency Response
- SOS button for immediate alerts
- Emergency location sharing
- Admin dashboard for monitoring

### 6. Admin Panel
- Monitor all registered tourists
- View incident reports
- Track SOS alerts
- Manage safety zones

## Tech Stack

### Frontend
- **React.js** - UI Framework
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP Client
- **React Hot Toast** - Notifications
- **Google Maps API** - Map visualization

### Backend
- **Spring Boot 2.7.14** - Java Framework
- **Spring Data JPA** - ORM
- **Spring Security** - Authentication
- **JWT** - Token Management
- **MySQL 8** - Database

### Database
- **MySQL 8** - Relational Database

## Project Structure

```
Smart Tourist Safety Monitoring/
â”œâ”€â”€ backend/
â”‚   â”œâ”€â”€ src/main/java/com/touristsafety/
â”‚   â”‚   â”œâ”€â”€ config/
â”‚   â”‚   â”‚   â””â”€â”€ SecurityConfig.java
â”‚   â”‚   â”œâ”€â”€ controller/
â”‚   â”‚   â”‚   â”œâ”€â”€ AuthController.java
â”‚   â”‚   â”‚   â”œâ”€â”€ TouristController.java
â”‚   â”‚   â”‚   â”œâ”€â”€ LocationController.java
â”‚   â”‚   â”‚   â”œâ”€â”€ IncidentController.java
â”‚   â”‚   â”‚   â”œâ”€â”€ GeoFenceController.java
â”‚   â”‚   â”‚   â””â”€â”€ SOSAlertController.java
â”‚   â”‚   â”œâ”€â”€ dto/
â”‚   â”‚   â”‚   â”œâ”€â”€ TouristRegistrationDTO.java
â”‚   â”‚   â”‚   â”œâ”€â”€ TouristLoginDTO.java
â”‚   â”‚   â”‚   â”œâ”€â”€ AuthResponseDTO.java
â”‚   â”‚   â”‚   â”œâ”€â”€ LocationUpdateDTO.java
â”‚   â”‚   â”‚   â”œâ”€â”€ IncidentReportDTO.java
â”‚   â”‚   â”‚   â””â”€â”€ SOSAlertDTO.java
â”‚   â”‚   â”œâ”€â”€ entity/
â”‚   â”‚   â”‚   â”œâ”€â”€ Tourist.java
â”‚   â”‚   â”‚   â”œâ”€â”€ Location.java
â”‚   â”‚   â”‚   â”œâ”€â”€ Incident.java
â”‚   â”‚   â”‚   â”œâ”€â”€ GeoFence.java
â”‚   â”‚   â”‚   â””â”€â”€ SOSAlert.java
â”‚   â”‚   â”œâ”€â”€ exception/
â”‚   â”‚   â”‚   â”œâ”€â”€ GlobalExceptionHandler.java
â”‚   â”‚   â”‚   â”œâ”€â”€ ResourceNotFoundException.java
â”‚   â”‚   â”‚   â”œâ”€â”€ DuplicateResourceException.java
â”‚   â”‚   â”‚   â””â”€â”€ UnauthorizedException.java
â”‚   â”‚   â”œâ”€â”€ repository/
â”‚   â”‚   â”‚   â”œâ”€â”€ TouristRepository.java
â”‚   â”‚   â”‚   â”œâ”€â”€ LocationRepository.java
â”‚   â”‚   â”‚   â”œâ”€â”€ IncidentRepository.java
â”‚   â”‚   â”‚   â”œâ”€â”€ GeoFenceRepository.java
â”‚   â”‚   â”‚   â””â”€â”€ SOSAlertRepository.java
â”‚   â”‚   â”œâ”€â”€ service/
â”‚   â”‚   â”‚   â”œâ”€â”€ TouristService.java
â”‚   â”‚   â”‚   â”œâ”€â”€ LocationService.java
â”‚   â”‚   â”‚   â”œâ”€â”€ IncidentService.java
â”‚   â”‚   â”‚   â”œâ”€â”€ GeoFenceService.java
â”‚   â”‚   â”‚   â””â”€â”€ SOSAlertService.java
â”‚   â”‚   â”œâ”€â”€ util/
â”‚   â”‚   â”‚   â”œâ”€â”€ JwtTokenProvider.java
â”‚   â”‚   â”‚   â””â”€â”€ GeoFencingUtil.java
â”‚   â”‚   â””â”€â”€ TouristSafetyApplication.java
â”‚   â”œâ”€â”€ src/main/resources/
â”‚   â”‚   â””â”€â”€ application.properties
â”‚   â””â”€â”€ pom.xml
â”œâ”€â”€ frontend/
â”‚   â”œâ”€â”€ public/
â”‚   â”‚   â””â”€â”€ index.html
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”‚   â”œâ”€â”€ Navbar.js
â”‚   â”‚   â”‚   â”œâ”€â”€ Sidebar.js
â”‚   â”‚   â”‚   â”œâ”€â”€ PrivateRoute.js
â”‚   â”‚   â”‚   â””â”€â”€ AlertNotification.js
â”‚   â”‚   â”œâ”€â”€ context/
â”‚   â”‚   â”‚   â””â”€â”€ AuthContext.js
â”‚   â”‚   â”œâ”€â”€ pages/
â”‚   â”‚   â”‚   â”œâ”€â”€ LoginPage.js
â”‚   â”‚   â”‚   â”œâ”€â”€ RegisterPage.js
â”‚   â”‚   â”‚   â”œâ”€â”€ TouristDashboard.js
â”‚   â”‚   â”‚   â”œâ”€â”€ MapTrackingPage.js
â”‚   â”‚   â”‚   â”œâ”€â”€ IncidentReporting.js
â”‚   â”‚   â”‚   â”œâ”€â”€ SOSEmergency.js
â”‚   â”‚   â”‚   â””â”€â”€ AdminDashboard.js
â”‚   â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â”‚   â””â”€â”€ api.js
â”‚   â”‚   â”œâ”€â”€ App.js
â”‚   â”‚   â”œâ”€â”€ index.js
â”‚   â”‚   â””â”€â”€ index.css
â”‚   â”œâ”€â”€ package.json
â”‚   â”œâ”€â”€ tailwind.config.js
â”‚   â””â”€â”€ postcss.config.js
â”œâ”€â”€ database/
â”‚   â””â”€â”€ schema.sql
â””â”€â”€ README.md
```

## Installation & Setup

### Prerequisites
- Java 11 or higher
- Node.js 14+ and npm
- MySQL 8
- Git

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Update database configuration** in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/tourist_safety?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password
```

3. **Build the project:**
```bash
mvn clean install
```

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Update API base URL** in `src/services/api.js` if needed:
```javascript
const API_BASE_URL = 'http://localhost:8081/api';
```

## Database Setup

The backend reads DB settings from environment variables (recommended) or falls back to local defaults in `backend/src/main/resources/application.properties`.

Example (PowerShell):
```powershell
$env:SPRING_DATASOURCE_PASSWORD="your_mysql_password"
```

### Option A: Docker (recommended)

```bash
docker compose up -d
```

This uses `docker-compose.yml` and initializes tables + sample data from `database/schema.sql`.

### Option B: Local MySQL

1. **Create database:**
```bash
mysql -u root -p
```

2. **Run schema.sql:**
```sql
source database/schema.sql
```

Or import the file using MySQL Workbench.

## Running the Application

### Start Backend Server

```bash
cd backend
mvn spring-boot:run
```

The backend will start on `http://localhost:8081`

### Start Frontend Development Server

```bash
cd frontend
npm start
```

The frontend will start on `http://localhost:3000`

## API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "country": "USA",
  "passportNumber": "ABC123456"
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "id": 1,
  "email": "john@example.com",
  "name": "John Doe",
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "message": "Login successful"
}
```

### Tourist Endpoints

#### Get All Tourists
```
GET /api/tourists
Authorization: Bearer <token>
```

#### Get Tourist by ID
```
GET /api/tourists/{id}
Authorization: Bearer <token>
```

### Location Endpoints

#### Update Location
```
POST /api/location/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "touristId": 1,
  "latitude": 28.6139,
  "longitude": 77.2090
}
```

#### Get Location History
```
GET /api/location/history/{touristId}
Authorization: Bearer <token>
```

#### Get Latest Location
```
GET /api/location/latest/{touristId}
Authorization: Bearer <token>
```

### Incident Endpoints

#### Report Incident
```
POST /api/incidents/report
Authorization: Bearer <token>
Content-Type: application/json

{
  "touristId": 1,
  "type": "theft",
  "description": "Wallet stolen at market",
  "latitude": 28.6139,
  "longitude": 77.2090
}
```

#### Get All Incidents
```
GET /api/incidents
Authorization: Bearer <token>
```

#### Get Tourist's Incidents
```
GET /api/incidents/tourist/{touristId}
Authorization: Bearer <token>
```

#### Get Open Incidents
```
GET /api/incidents/open
Authorization: Bearer <token>
```

#### Resolve Incident
```
PUT /api/incidents/{id}/resolve
Authorization: Bearer <token>
```

### GeoFence Endpoints

#### Get All GeoFences
```
GET /api/geofences
Authorization: Bearer <token>
```

#### Get Active GeoFences
```
GET /api/geofences/active
Authorization: Bearer <token>
```

#### Get GeoFences by Type
```
GET /api/geofences/type/{zoneType}
Authorization: Bearer <token>
```

#### Create GeoFence
```
POST /api/geofences
Authorization: Bearer <token>
Content-Type: application/json

{
  "zoneName": "Market Area",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "radius": 500,
  "zoneType": "DANGER_ZONE"
}
```

### SOS Alert Endpoints

#### Create SOS Alert
```
POST /api/sos
Authorization: Bearer <token>
Content-Type: application/json

{
  "touristId": 1,
  "latitude": 28.6139,
  "longitude": 77.2090
}
```

#### Get All SOS Alerts
```
GET /api/sos
Authorization: Bearer <token>
```

#### Get Active SOS Alerts
```
GET /api/sos/active
Authorization: Bearer <token>
```

#### Resolve SOS Alert
```
PUT /api/sos/{id}/resolve?notes=Resolved
Authorization: Bearer <token>
```

## Frontend Features

### Pages

#### Login Page
- Email and password authentication
- Link to registration page
- Demo credentials display

#### Registration Page
- Full tourist registration form
- Validation of input fields
- Automatic login after registration

#### Tourist Dashboard
- Profile information display
- Safety status overview
- Recent incidents list
- Real-time status updates

#### Map Tracking Page
- Live GPS position tracking
- Display of safety zones
- Color-coded zones (Green=Safe, Red=Danger, Yellow=Restricted)
- Location update frequency

#### Incident Reporting
- Incident type selection
- Detailed description input
- Location input (with auto-fill option)
- Real-time location retrieval

#### SOS Emergency
- Large SOS button
- Automatic location capture
- Countdown timer after activation
- Emergency contact information

#### Admin Dashboard
- Tourist management view
- Incident monitoring
- SOS alert tracking
- Safety zone management
- Statistics overview

## Sample Data

### Demo Credentials
```
Email: admin@touristsafety.com
Password: admin123
```

### Sample Locations
```
Taj Mahal - 27.1751, 78.0421 (SAFE_ZONE)
Jama Masjid - 28.6505, 77.2308 (DANGER_ZONE)
Central Park - 40.7829, -73.9654 (SAFE_ZONE)
Times Square - 40.7580, -73.9855 (DANGER_ZONE)
```

### Sample Incident Types
- theft
- harassment
- lost_documents
- medical_emergency

## Features Implemented

âœ… User Authentication (JWT)
âœ… Tourist Registration & Login
âœ… Real-time Location Tracking
âœ… Geofencing & Safety Zones
âœ… Incident Reporting
âœ… SOS Emergency System
âœ… Admin Dashboard
âœ… Responsive UI with Tailwind CSS
âœ… Error Handling
âœ… Database Integration
âœ… API Security

## Troubleshooting

### Database Connection Error
- Ensure MySQL is running
- Check database credentials in application.properties
- Verify database exists: `tourist_safety`

### CORS Error
- Backend CORS is configured for all origins
- If issues persist, update SecurityConfig.java

### Location Permission
- Browser may request location access
- Allow location services for best experience

### Port Already in Use
- Backend: Check `application.properties` for port
- Frontend: Use `PORT=3001 npm start` for different port

## Future Enhancements

1. **Real-time Notifications** - WebSocket integration
2. **Government Portal** - For police and rescue teams
3. **Language Support** - Multi-language support
4. **Mobile App** - React Native version
5. **AI Integration** - Predictive danger zone identification
6. **Video Call** - Emergency video communication
7. **Offline Mode** - Offline incident logging
8. **SMS Alerts** - SMS notifications for emergencies

## License

This project is created for educational purposes as part of Smart India Hackathon.

## Support

For issues and questions, please create an issue in the repository or contact the development team.

---

**Created with â¤ï¸ for Tourist Safety**

