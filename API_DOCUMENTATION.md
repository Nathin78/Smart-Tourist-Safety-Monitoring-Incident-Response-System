# API Integration Examples & Usage Guide

## Complete REST API Documentation with Examples

### Base URL
```
http://localhost:8081/api
```

### Authentication
All endpoints (except auth) require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication APIs

### 1. User Registration

**Endpoint**: `POST /api/auth/register`

**Request**:
```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "phone": "+91-9876543210",
    "country": "India",
    "passportNumber": "G1234567"
  }'
```

**Response** (201 Created):
```json
{
  "id": 1,
  "email": "john@example.com",
  "name": "John Doe",
  "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
  "message": "Registration successful"
}
```

**JavaScript/Axios Example**:
```javascript
import axios from 'axios';

const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      'http://localhost:8081/api/auth/register',
      {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        country: userData.country,
        passportNumber: userData.passportNumber
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    // Store token
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response.data);
    throw error;
  }
};
```

### 2. User Login

**Endpoint**: `POST /api/auth/login`

**Request**:
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

**Response** (200 OK):
```json
{
  "id": 1,
  "email": "john@example.com",
  "name": "John Doe",
  "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```

**JavaScript/Axios Example**:
```javascript
const loginUser = async (email, password) => {
  try {
    const response = await axios.post(
      'http://localhost:8081/api/auth/login',
      { email, password }
    );
    
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response.data);
  }
};
```

---

## Tourist APIs

### 3. Get All Tourists

**Endpoint**: `GET /api/tourists`

**Request**:
```bash
curl -X GET http://localhost:8081/api/tourists \
  -H "Authorization: Bearer <token>"
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91-9876543210",
    "country": "India",
    "passportNumber": "G1234567",
    "isActive": true
  }
]
```

**JavaScript/Axios Example**:
```javascript
const fetchAllTourists = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      'http://localhost:8081/api/tourists',
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch tourists:', error);
  }
};
```

### 4. Get Tourist by ID

**Endpoint**: `GET /api/tourists/{id}`

**Request**:
```bash
curl -X GET http://localhost:8081/api/tourists/1 \
  -H "Authorization: Bearer <token>"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91-9876543210",
  "country": "India",
  "passportNumber": "G1234567",
  "isActive": true
}
```

---

## Location APIs

### 5. Update Location

**Endpoint**: `POST /api/location/update`

**Request**:
```bash
curl -X POST http://localhost:8081/api/location/update \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "touristId": 1,
    "latitude": 28.6139,
    "longitude": 77.2090
  }'
```

**Response** (201 Created):
```json
{
  "id": 1,
  "tourist": {
    "id": 1,
    "name": "John Doe"
  },
  "latitude": 28.6139,
  "longitude": 77.2090,
  "timestamp": "2024-03-07T10:30:00Z"
}
```

**JavaScript/Axios Example**:
```javascript
const updateTouristLocation = async (touristId, latitude, longitude) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      'http://localhost:8081/api/location/update',
      {
        touristId,
        latitude,
        longitude
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to update location:', error);
  }
};

// Usage with Geolocation API
navigator.geolocation.watchPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    updateTouristLocation(1, latitude, longitude);
  },
  (error) => console.error('Geolocation error:', error),
  { enableHighAccuracy: true }
);
```

### 6. Get Location History

**Endpoint**: `GET /api/location/history/{touristId}`

**Request**:
```bash
curl -X GET http://localhost:8081/api/location/history/1 \
  -H "Authorization: Bearer <token>"
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "tourist": { "id": 1 },
    "latitude": 28.6139,
    "longitude": 77.2090,
    "timestamp": "2024-03-07T09:00:00Z"
  },
  {
    "id": 2,
    "tourist": { "id": 1 },
    "latitude": 28.6140,
    "longitude": 77.2091,
    "timestamp": "2024-03-07T09:05:00Z"
  }
]
```

### 7. Get Latest Location

**Endpoint**: `GET /api/location/latest/{touristId}`

**Request**:
```bash
curl -X GET http://localhost:8081/api/location/latest/1 \
  -H "Authorization: Bearer <token>"
```

**Response** (200 OK):
```json
{
  "id": 2,
  "tourist": { "id": 1 },
  "latitude": 28.6140,
  "longitude": 77.2091,
  "timestamp": "2024-03-07T09:05:00Z"
}
```

---

## Incident APIs

### 8. Report Incident

**Endpoint**: `POST /api/incidents/report`

**Request**:
```bash
curl -X POST http://localhost:8081/api/incidents/report \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "touristId": 1,
    "type": "theft",
    "description": "Wallet stolen at New Delhi Railway Station",
    "latitude": 28.5355,
    "longitude": 77.2707
  }'
```

**Response** (201 Created):
```json
{
  "id": 1,
  "tourist": { "id": 1 },
  "type": "theft",
  "description": "Wallet stolen at New Delhi Railway Station",
  "latitude": 28.5355,
  "longitude": 77.2707,
  "status": "OPEN",
  "createdAt": "2024-03-07T10:30:00Z"
}
```

**Incident Types**:
- `theft` - Robbery or theft
- `harassment` - Physical or verbal harassment
- `lost_documents` - Lost passport or travel documents
- `medical_emergency` - Medical or health emergency

### 9. Get All Incidents

**Endpoint**: `GET /api/incidents`

**Request**:
```bash
curl -X GET http://localhost:8081/api/incidents \
  -H "Authorization: Bearer <token>"
```

### 10. Get Tourist's Incidents

**Endpoint**: `GET /api/incidents/tourist/{touristId}`

**Request**:
```bash
curl -X GET http://localhost:8081/api/incidents/tourist/1 \
  -H "Authorization: Bearer <token>"
```

### 11. Get Open Incidents

**Endpoint**: `GET /api/incidents/open`

**Request**:
```bash
curl -X GET http://localhost:8081/api/incidents/open \
  -H "Authorization: Bearer <token>"
```

### 12. Resolve Incident

**Endpoint**: `PUT /api/incidents/{id}/resolve`

**Request**:
```bash
curl -X PUT http://localhost:8081/api/incidents/1/resolve \
  -H "Authorization: Bearer <token>"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "tourist": { "id": 1 },
  "type": "theft",
  "description": "Wallet stolen at New Delhi Railway Station",
  "status": "RESOLVED",
  "resolvedAt": "2024-03-07T11:00:00Z"
}
```

---

## GeoFence APIs

### 13. Create GeoFence

**Endpoint**: `POST /api/geofences`

**Request**:
```bash
curl -X POST http://localhost:8081/api/geofences \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "zoneName": "Taj Mahal-Agra",
    "latitude": 27.1751,
    "longitude": 78.0421,
    "radius": 500,
    "zoneType": "SAFE_ZONE"
  }'
```

**Zone Types**:
- `SAFE_ZONE` - Green zone for tourist attractions
- `DANGER_ZONE` - Red zone with safety concerns
- `RESTRICTED_ZONE` - Yellow zone requiring permits

**Response** (201 Created):
```json
{
  "id": 1,
  "zoneName": "Taj Mahal-Agra",
  "latitude": 27.1751,
  "longitude": 78.0421,
  "radius": 500,
  "zoneType": "SAFE_ZONE",
  "isActive": true
}
```

### 14. Get All GeoFences

**Endpoint**: `GET /api/geofences`

**Request**:
```bash
curl -X GET http://localhost:8081/api/geofences \
  -H "Authorization: Bearer <token>"
```

### 15. Get Active GeoFences

**Endpoint**: `GET /api/geofences/active`

**Request**:
```bash
curl -X GET http://localhost:8081/api/geofences/active \
  -H "Authorization: Bearer <token>"
```

### 16. Get GeoFences by Type

**Endpoint**: `GET /api/geofences/type/{zoneType}`

**Request**:
```bash
curl -X GET http://localhost:8081/api/geofences/type/DANGER_ZONE \
  -H "Authorization: Bearer <token>"
```

### 17. Update GeoFence

**Endpoint**: `PUT /api/geofences/{id}`

**Request**:
```bash
curl -X PUT http://localhost:8081/api/geofences/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "radius": 750
  }'
```

### 18. Delete GeoFence

**Endpoint**: `DELETE /api/geofences/{id}`

**Request**:
```bash
curl -X DELETE http://localhost:8081/api/geofences/1 \
  -H "Authorization: Bearer <token>"
```

---

## SOS Alert APIs

### 19. Create SOS Alert

**Endpoint**: `POST /api/sos`

**Request**:
```bash
curl -X POST http://localhost:8081/api/sos \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "touristId": 1,
    "latitude": 28.6139,
    "longitude": 77.2090
  }'
```

**Response** (201 Created):
```json
{
  "id": 1,
  "tourist": { "id": 1 },
  "latitude": 28.6139,
  "longitude": 77.2090,
  "status": "ACTIVE",
  "createdAt": "2024-03-07T10:30:00Z"
}
```

**JavaScript Alert Implementation**:
```javascript
const activateSOS = async () => {
  try {
    // Get current location
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const { latitude, longitude } = position.coords;
    
    const token = localStorage.getItem('token');
    const response = await axios.post(
      'http://localhost:8081/api/sos',
      {
        touristId: 1,
        latitude,
        longitude
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    console.log('SOS Alert Created:', response.data);
    // Show success notification
    showNotification('ðŸš¨ SOS Alert Activated! Emergency services notified.');
    
    return response.data;
  } catch (error) {
    console.error('SOS activation failed:', error);
    showNotification('âŒ Failed to activate SOS');
  }
};
```

### 20. Get All SOS Alerts

**Endpoint**: `GET /api/sos`

**Request**:
```bash
curl -X GET http://localhost:8081/api/sos \
  -H "Authorization: Bearer <token>"
```

### 21. Get Active SOS Alerts

**Endpoint**: `GET /api/sos/active`

**Request**:
```bash
curl -X GET http://localhost:8081/api/sos/active \
  -H "Authorization: Bearer <token>"
```

### 22. Get Tourist's SOS Alerts

**Endpoint**: `GET /api/sos/tourist/{touristId}`

**Request**:
```bash
curl -X GET http://localhost:8081/api/sos/tourist/1 \
  -H "Authorization: Bearer <token>"
```

### 23. Resolve SOS Alert

**Endpoint**: `PUT /api/sos/{id}/resolve?notes={notes}`

**Request**:
```bash
curl -X PUT "http://localhost:8081/api/sos/1/resolve?notes=Located%20tourist%20safely" \
  -H "Authorization: Bearer <token>"
```

**Response** (200 OK):
```json
{
  "id": 1,
  "tourist": { "id": 1 },
  "latitude": 28.6139,
  "longitude": 77.2090,
  "status": "RESOLVED",
  "resolvedNotes": "Located tourist safely"
}
```

---

## Error Handling Examples

### 401 Unauthorized
```json
{
  "status": 401,
  "message": "Invalid email or password",
  "path": "/api/auth/login"
}
```

### 404 Not Found
```json
{
  "status": 404,
  "message": "Tourist not found",
  "path": "/api/tourists/999"
}
```

### 409 Conflict (Duplicate)
```json
{
  "status": 409,
  "message": "Email already registered",
  "path": "/api/auth/register"
}
```

### 500 Internal Server Error
```json
{
  "status": 500,
  "message": "An internal error occurred: Database connection failed",
  "path": "/api/incidents"
}
```

---

## Complete Axios Instance Setup

```javascript
// api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

**For more details, refer to README.md and SETUP_GUIDE.md**

