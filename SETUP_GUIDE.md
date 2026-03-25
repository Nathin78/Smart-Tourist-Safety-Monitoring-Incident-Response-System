# Setup & Installation Guide

## Complete Step-by-Step Setup Instructions

### System Requirements

- **Java Development Kit (JDK)**: Version 11 or higher
- **Node.js**: Version 14.0 or higher
- **npm**: Version 6.0 or higher (comes with Node.js)
- **MySQL Server**: Version 8.0
- **Git**: For version control
- **IDE**: (Optional) IntelliJ IDEA or VS Code

### Installation Steps

## Step 1: MySQL Database Setup

### Windows

1. **Download MySQL Community Server**
   - Visit: https://dev.mysql.com/downloads/mysql/
   - Download MySQL 8.0 Community Server (Windows)

2. **Install MySQL**
   - Run the installer
   - Choose Setup Type: Developer Default
   - Click "Install Now"
   - Wait for installation to complete
   - Click "Finish" to launch MySQL Server

3. **Verify Installation**
   ```bash
   mysql --version
   ```

4. **Create Database**
   ```bash
   mysql -u root -p
   ```
   Enter your MySQL password when prompted.

   Then execute:
   ```sql
   CREATE DATABASE tourist_safety;
   USE tourist_safety;
   ```

5. **Import Schema**
   From the database folder, run:
   ```bash
   mysql -u root -p tourist_safety < schema.sql
   ```

### Linux/Mac

```bash
# Using Homebrew (Mac)
brew install mysql
brew services start mysql

# Or Docker
docker run --name mysql -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 -d mysql:8

# Then create database
mysql -u root -p
```

## Step 2: Backend Setup (Spring Boot)

### 1. Configure Database Connection

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/tourist_safety?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_mysql_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

spring.application.name=tourist-safety-system
server.port=8081
server.servlet.context-path=/

jwt.secret=this_is_a_very_long_secret_key_for_jwt_token_generation_that_is_at_least_32_characters
jwt.expiration=86400000
```

### 2. Install Java Dependencies

Navigate to backend folder:
```bash
cd backend
```

On Windows:
```bash
mvn clean install
```

On Mac/Linux:
```bash
./mvn clean install
```

### 3. Run Backend Server

```bash
mvn spring-boot:run
```

Or if using an IDE (IntelliJ):
- Right-click `TouristSafetyApplication.java`
- Click "Run 'TouristSafetyApplication.main()'"

**Success**: You should see:
```
Started TouristSafetyApplication in X.XXX seconds
```

The backend API is now running on: `http://localhost:8081`

## Step 3: Frontend Setup (React)

### 1. Install Node Dependencies

Navigate to frontend folder:
```bash
cd frontend
npm install
```

This will install all required packages from package.json.

### 2. Verify API Configuration

Check `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8081/api';
```

Ensure this matches your backend port.

Also check `frontend/.env.example` for the Google Maps key used by the live map:

```bash
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 3. Start Frontend Development Server

```bash
npm start
```

The application will open in your browser at: `http://localhost:3000`

If not, manually open: http://localhost:3000

**Success**: You should see the TouristSafe login page.

## Step 4: Test the Application

### 1. Login with Demo Account

```
Email: admin@touristsafety.com
Password: admin123
```

### 2. Create New Account

1. Click "Register here" on login page
2. Fill in all fields:
   - Full Name: Your Name
   - Email: your@email.com
   - Password: Strong password
   - Phone: +1234567890
   - Country: Your Country
   - Passport: Your Passport Number
3. Click "Register"
4. You'll be logged in automatically

### 3. Test Features

#### Tourist Dashboard
- View your profile information
- Check safety status
- View recent incidents

#### Map Tracking
- See your current location
- View safety zones
- Zones color-coded (Green/Red/Yellow)

#### Report Incident
- Select incident type
- Enter description
- Optionally use "Get Current Location"
- Click "Report Incident"

#### SOS Emergency
- Click the large red SOS button
- Location will be captured automatically
- Emergency services will be notified
- Countdown timer shows alert duration

#### Admin Dashboard
- View all tourists
- Monitor incidents
- Track active SOS alerts
- Manage geofences

## Troubleshooting

### Backend Issues

**Issue: Port 8081 already in use**
```bash
# Windows: Find and kill process using port 8081
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:8081 | xargs kill -9

# Alternative: Change port in application.properties
server.port=8081
```

**Issue: Database connection error**

1. Check MySQL is running
2. Verify credentials in application.properties
3. Test connection:
```bash
mysql -h localhost -u root -p tourist_safety
```

**Issue: Maven build fails**

```bash
# Clear Maven cache
mvn clean

# Update dependencies
mvn update-maven

# Full rebuild
mvn clean install -U
```

### Frontend Issues

**Issue: npm install fails**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

**Issue: Can't connect to backend**

1. Ensure backend is running on port 8081
2. Check `src/services/api.js` for correct API_BASE_URL
3. Check browser console for CORS errors
4. If CORS error: Verify SecurityConfig.java has CORS enabled

**Issue: Location permission error**

- Allow browser location access when prompted
- Check browser settings: Privacy â†’ Site Settings â†’ Location
- Ensure HTTPS is used (required for geolocation in production)

## Building for Production

### Backend

```bash
cd backend
mvn clean package
java -jar target/tourist-safety-system-1.0.0.jar
```

### Frontend

```bash
cd frontend
npm run build
```

The `build` folder will contain optimized production files.

## Docker Deployment (Optional)

### Create Docker Compose file

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: tourist_safety
    volumes:
      - ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql

  backend:
    build: ./backend
    ports:
      - "8081:8081"
    depends_on:
      - mysql
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/tourist_safety
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: password

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

Run:
```bash
docker-compose up
```

## Performance Tips

1. **Enable Browser DevTools**: F12 to check console for errors
2. **MongoDB Indexing**: Already configured in schema.sql
3. **API Caching**: Axios automatically caches responses
4. **Lazy Loading**: Pages load on demand

## Security Considerations

1. **Change JWT Secret**: Update in application.properties
2. **Database Password**: Change from default
3. **HTTPS**: Required for production
4. **Environment Variables**: Don't commit secrets
5. **CORS**: Limit to specific origins in production

## Next Steps

1. Configure Google Maps API key for production
2. Set up email notifications
3. Configure SMS alerts
4. Deploy to cloud platform (AWS, Azure, GCP)
5. Set up CI/CD pipeline

### Email Notifications

For SOS emails to actually send, set real SMTP values in `backend/src/main/resources/application.properties` or environment variables:

```bash
SPRING_MAIL_HOST=smtp.your-provider.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=your_smtp_username
SPRING_MAIL_PASSWORD=your_smtp_password
ALERT_MAIL_TO=backup-alerts@example.com
```

The user’s saved `sosEmail` will be used first, and `ALERT_MAIL_TO` gets a copy as a fallback.

---

**For detailed API documentation, see API_DOCUMENTATION.md**

