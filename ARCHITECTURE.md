# Project Architecture & Design

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE LAYER                         │
│                      (React.js + Tailwind CSS)                      │
├──────────┬──────────┬──────────┬──────────┬──────────┬──────────────┤
│  Login   │Register  │Dashboard │ Map      │ Incident │ SOS/Admin    │
│  Page    │  Page    │  Page    │ Tracking │ Reporting│  Pages       │
└────────────────────────────────────────────────────────────────────┬┘
                                 │
                    ┌────────────┴────────────┐
                    │    HTTP/REST API       │
                    │    (JWT Protected)     │
                    └────────────┬────────────┘
                                 │
┌────────────────────────────────┴────────────────────────────────────┐
│                   APPLICATION LOGIC LAYER                           │
│                      (Spring Boot 2.7)                              │
├───────────────┬─────────────┬─────────────┬──────────────┬─────────┤
│   Controller  │   Service   │  Repository │   Entity     │ Utility │
│   Layer       │   Layer     │   Layer     │   Layer      │ Layer   │
├───────────────┼─────────────┼─────────────┼──────────────┼─────────┤
│ - AuthCtrl    │ TouristSvc  │ TouristRepo │  Tourist     │ JwtUtil │
│ - TouristCtrl │ LocationSvc │ LocationRepo│  Location    │ GeoUtil │
│ - LocationCtrl│ IncidentSvc │ IncidentRepo│  Incident    │         │
│ - IncidentCtrl│ GeoFenceSvc │ GeoFenceRepo│  GeoFence    │         │
│ - SOS / GEO   │ SOSSvc      │ SOSAlertRepo│  SOSAlert    │         │
└───────────────┴─────────────┴─────────────┴──────────────┴─────────┘
                                 │
                    ┌────────────┴────────────┐
                    │    JPA/ORM/Persistence │
                    │      (Hibernate)       │
                    └────────────┬────────────┘
                                 │
┌────────────────────────────────┴────────────────────────────────────┐
│                     DATABASE LAYER (MySQL)                          │
├────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │ TOURISTS │ │LOCATIONS │ │ INCIDENTS│ │GEOFENCES │ │SOS_ALERTS│ │
│  │          │ │          │ │          │ │          │ │          │ │
│  │- id      │ │- id      │ │- id      │ │- id      │ │- id      │ │
│  │- name    │ │- tourist │ │- tourist │ │- zone    │ │- tourist │ │
│  │- email   │ │  _id     │ │  _id     │ │  _name   │ │  _id     │ │
│  │- password│ │- lat     │ │- type    │ │- lat/lon │ │- lat/lon │ │
│  │- phone   │ │- lon     │ │- desc    │ │- radius  │ │- status  │ │
│  │- country │ │- time    │ │- status  │ │- zone    │ │- time    │ │
│  │- passport│ │          │ │- created │ │  _type   │ │- notes   │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
└────────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Components Structure

```
App.js
├── AuthContext (Provider)
├── PrivateRoute (HOC)
├── Navbar
│   ├── Brand Logo
│   ├── Navigation Links
│   ├── User Info
│   └── Logout Button
├── Sidebar
│   ├── Menu Items
│   └── Navigation Links
├── Pages
│   ├── LoginPage
│   │   ├── Email Input
│   │   ├── Password Input
│   │   └── Submit Button
│   ├── RegisterPage
│   │   ├── Registration Form
│   │   └── Validation
│   ├── TouristDashboard
│   │   ├── Profile Card
│   │   ├── Safety Status
│   │   └── Incidents Table
│   ├── MapTrackingPage
│   │   ├── Map Display
│   │   └── Zone Sidebar
│   ├── IncidentReporting
│   │   ├── Incident Form
│   │   ├── Location Fields
│   │   └── Submit Button
│   ├── SOSEmergency
│   │   ├── Large SOS Button
│   │   ├── Location Display
│   │   └── Emergency Info
│   └── AdminDashboard
│       ├── Stats Cards
│       ├── Tourist Table
│       ├── Incident Manager
│       ├── SOS Manager
│       └── Geofence Manager
└── Services
    └── API Integration
```

### Backend Microservices Structure

```
TouristSafetyApplication
├── Controllers (Request Handlers)
│   ├── AuthController
│   │   ├── POST /register
│   │   └── POST /login
│   ├── TouristController
│   │   ├── GET /tourists
│   │   └── GET /tourists/{id}
│   ├── LocationController
│   │   ├── POST /location/update
│   │   ├── GET /location/history/{id}
│   │   └── GET /location/latest/{id}
│   ├── IncidentController
│   │   ├── POST /incidents/report
│   │   ├── GET /incidents
│   │   ├── GET /incidents/{id}
│   │   └── PUT /incidents/{id}/resolve
│   ├── GeoFenceController
│   │   ├── POST /geofences
│   │   ├── GET /geofences
│   │   ├── PUT /geofences/{id}
│   │   └── DELETE /geofences/{id}
│   └── SOSAlertController
│       ├── POST /sos
│       ├── GET /sos
│       └── PUT /sos/{id}/resolve
│
├── Services (Business Logic)
│   ├── TouristService
│   ├── LocationService
│   ├── IncidentService
│   ├── GeoFenceService
│   └── SOSAlertService
│
├── Repositories (Data Access)
│   ├── TouristRepository
│   ├── LocationRepository
│   ├── IncidentRepository
│   ├── GeoFenceRepository
│   └── SOSAlertRepository
│
├── Entities (Data Models)
│   ├── Tourist
│   ├── Location
│   ├── Incident
│   ├── GeoFence
│   └── SOSAlert
│
├── DTOs (Data Transfer Objects)
│   ├── TouristRegistrationDTO
│   ├── TouristLoginDTO
│   ├── AuthResponseDTO
│   ├── LocationUpdateDTO
│   ├── IncidentReportDTO
│   └── SOSAlertDTO
│
├── Config (Configuration)
│   └── SecurityConfig
│
├── Exception (Error Handling)
│   ├── GlobalExceptionHandler
│   ├── ResourceNotFoundException
│   ├── DuplicateResourceException
│   └── UnauthorizedException
│
└── Util (Utilities)
    ├── JwtTokenProvider
    └── GeoFencingUtil
```

## Data Flow Diagrams

### Authentication Flow

```
User Input (Email/Password)
         ↓
    Form Submission
         ↓
    Axios POST Request
         ↓
    Backend Controller
         ↓
    BCryptPasswordEncoder
         ↓
    TouristRepo.findByEmail()
         ↓
    Password Verification
         ↓
    JwtTokenProvider.generateToken()
         ↓
    AuthResponse (Token + User)
         ↓
    Store Token in localStorage
         ↓
    Context Update
         ↓
    Redirect to Dashboard
```

### Location Tracking Flow

```
Tourist On App
         ↓
    Browser Geolocation API
         ↓
    getCurrentPosition/watchPosition
         ↓
    Get Lat/Lon Coordinates
         ↓
    LocationUpdateDTO
         ↓
    POST /location/update
         ↓
    LocationService.updateLocation()
         ↓
    LocationRepository.save()
         ↓
    MySQL locations Table
         ↓
    Response to Frontend
         ↓
    Update UI with New Location
```

### Incident Reporting Flow

```
User Clicks Report Incident
         ↓
    Fill Incident Form
         ↓
    Select Type (theft/harassment/etc)
         ↓
    Add Description
         ↓
    Get/Enter Location
         ↓
    Submit Incident
         ↓
    IncidentReportDTO Created
         ↓
    POST /incidents/report
         ↓
    IncidentService.reportIncident()
         ↓
    IncidentRepository.save()
         ↓
    MySQL incidents Table
         ↓
    Admin Notified
         ↓
    Response: Success/Failure
```

### SOS Emergency Flow

```
Tourist Presses SOS Button
         ↓
    Request Location Permission
         ↓
    Capture Current GPS Coordinates
         ↓
    Create SOSAlertDTO
         ↓
    POST /sos
         ↓
    SOSAlertService.createSOSAlert()
         ↓
    SOSAlertRepository.save()
         ↓
    MySQL sos_alerts Table
         ↓
    Notification to Admin/Police
         ↓
    5 Second Countdown
         ↓
    Auto-Deactivate/User Cancel
         ↓
    Update Status in DB
         ↓
    Response to Tourist
```

## Security Architecture

```
┌─────────────────────────────────────────────────────┐
│                    JWT Authentication              │
├─────────────────────────────────────────────────────┤
│ 1. User registers with email + password            │
│ 2. Password hashed with BCrypt (salt rounds: 10)   │
│ 3. JWT token generated with expiry: 24 hours       │
│ 4. Token stored in localStorage (frontend)         │
│ 5. Token sent in Authorization header              │
│ 6. Backend validates token with secret key         │
│ 7. Unauthorized requests rejected (401)            │
│ 8. Exception handler processes security errors     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│               Data Protection Layers                │
├─────────────────────────────────────────────────────┤
│ ✓ HTTPS Ready (configurable)                       │
│ ✓ Password Hashing (BCrypt)                        │
│ ✓ CORS Configured                                  │
│ ✓ Input Validation (Backend + Frontend)            │
│ ✓ SQL Injection Protected (JPA Parameterized)      │
│ ✓ XSS Prevention (React auto-escapes)              │
│ ✓ Exception Handling (No stack traces exposed)      │
└─────────────────────────────────────────────────────┘
```

## Database Schema Relationships

```
TOURISTS (1)
    │
    ├─── (1) ─── LOCATIONS (Many)
    │
    ├─── (1) ─── INCIDENTS (Many)
    │
    └─── (1) ─── SOS_ALERTS (Many)

GEOFENCES (Independent Lookup Table)
    │
    └─── Used for proximity calculations
         (No direct foreign key)
```

## API Request/Response Cycle

```
Frontend (React)
    │
    ├─ Axios Instance Created
    ├─ Request Interceptor:
    │   └─ Add JWT Token to Headers
    │
    ├─ HTTP Request
    │   ├─ Method (GET/POST/PUT/DELETE)
    │   ├─ Endpoint (/api/...)
    │   ├─ Headers (Authorization, Content-Type)
    │   └─ Body (JSON Data)
    │
    ▼
Backend (Spring Boot)
    │
    ├─ DispatcherServlet Routes Request
    ├─ Controller Receives & Validates
    ├─ Service Layer Processes Business Logic
    ├─ Repository Layer Accesses Database
    ├─ Entity Retrieved/Saved
    │
    ├─ Response Prepared
    │   ├─ Status Code (200/201/400/401/500)
    │   ├─ Headers (Content-Type)
    │   └─ JSON Body
    │
    ▼
Frontend (React)
    │
    ├─ Response Interceptor Checks Status
    ├─ If 401: Redirect to Login
    ├─ Parse JSON Response
    ├─ Update Component State
    ├─ Re-render UI
    │
    ▼
User Sees Updated Interface
```

## Scalability Considerations

### Current Architecture Supports:
- [ ] 10,000+ Tourists
- [ ] Real-time Location Updates
- [ ] Concurrent SOS Alerts
- [ ] Multi-admin Dashboard

### Future Improvements:
- [ ] Redis Caching Layer
- [ ] Load Balancing (NGINX)
- [ ] Database Replication
- [ ] WebSocket for Real-time Updates
- [ ] Microservices Split
- [ ] Kafka for Event Streaming

## Error Handling Strategy

```
Frontend Level:
├─ Form Validation
├─ API Error Catching
├─ User-Friendly Messages
└─ Error Logging

Backend Level:
├─ Input Validation (DTO/Entity)
├─ Global Exception Handler
├─ Specific Exception Classes
├─ Error Logging (SLF4J)
└─ Proper HTTP Status Codes

Database Level:
├─ Constraint Violations
├─ Connection Errors
├─ Transaction Rollback
└─ Error Logging
```

---

**Last Updated:** 2024
**Version:** 1.0
