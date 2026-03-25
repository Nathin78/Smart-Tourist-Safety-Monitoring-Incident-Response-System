# Testing Guide & Feature Walkthrough

## Complete Testing Checklist

### Pre-Testing Setup

1. **Ensure Both Servers Running:**
   - Backend: `http://localhost:8081`
   - Frontend: `http://localhost:3000`

2. **Database Populated:**
   ```bash
   mysql -u root -p tourist_safety < database/schema.sql
   ```

3. **Clear Browser Cache:**
   - Press Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
   - Select "All time" and clear

---

## Test Case 1: User Authentication

### Test 1.1: Login with Demo Account
- **Steps:**
  1. Navigate to `http://localhost:3000/login`
  2. Enter Email: `admin@touristsafety.com`
  3. Enter Password: `admin123`
  4. Click "Login"
  
- **Expected Result:**
  - Successfully logged in
  - Redirected to dashboard
  - Welcome message displays name

### Test 1.2: Register New Account
- **Steps:**
  1. Click "Register here" link
  2. Enter details:
     - Name: Test Tourist
     - Email: test@example.com
     - Password: Test@123456
     - Phone: +91-9876543210
     - Country: India
     - Passport: ABC123XYZ
  3. Click "Register"

- **Expected Result:**
  - Registration successful
  - Auto-login after registration
  - Redirected to dashboard

### Test 1.3: Invalid Login Attempt
- **Steps:**
  1. Navigate to login
  2. Enter wrong email or password
  3. Click "Login"

- **Expected Result:**
  - Error notification appears
  - User stays on login page
  - Console shows error details

### Test 1.4: Logout
- **Steps:**
  1. Click logout button in navbar
  
- **Expected Result:**
  - User logged out
  - Token cleared from localStorage
  - Redirected to login page

---

## Test Case 2: Tourist Dashboard

### Test 2.1: Profile Information Display
- **Steps:**
  1. Login successfully
  2. View dashboard

- **Expected Result:**
  - Profile card shows:
    - Full name
    - Email
    - Phone
    - Country
    - Passport number
  - All information is accurate

### Test 2.2: Safety Status
- **Steps:**
  1. Check "Safety Status" card on dashboard

- **Expected Result:**
  - Current Location: Active
  - Open Incidents: Shows count
  - Status: Safe/Alert

### Test 2.3: Recent Incidents Table
- **Steps:**
  1. View "Recent Incidents" section

- **Expected Result:**
  - Table displays up to 5 incidents
  - Shows: Type, Description, Status, Date
  - Status badges color-coded (Red=OPEN, Green=RESOLVED)

---

## Test Case 3: Location Tracking

### Test 3.1: Enable Location Access
- **Steps:**
  1. Navigate to "Map Tracking" page
  2. Allow browser location access when prompted
  3. Note location coordinates display

- **Expected Result:**
  - Browser requests location permission
  - Current coordinates show (latitude, longitude)
  - Location updates every 5-10 seconds

### Test 3.2: View Safety Zones
- **Steps:**
  1. On Map Tracking page
  2. View right sidebar "Safety Zones"

- **Expected Result:**
  - All geofences display
  - Zones color-coded:
    - Green = SAFE_ZONE
    - Red = DANGER_ZONE
    - Yellow = RESTRICTED_ZONE
  - Shows zone name and radius

### Test 3.3: Location History
- **Browser Console:**
  1. Open DevTools (F12)
  2. Network tab
  3. Make multiple location updates
  4. Verify API calls to `/location/update`

- **Expected Result:**
  - Successful 201 responses
  - Location coordinates included in payload

---

## Test Case 4: Incident Reporting

### Test 4.1: Report Incident
- **Steps:**
  1. Navigate to "Incident Reporting"
  2. Select Type: "theft"
  3. Enter Description: "Wallet stolen at market"
  4. Enter Latitude: 28.6139
  5. Enter Longitude: 77.2090
  6. Click "Report Incident"

- **Expected Result:**
  - Success notification appears
  - Form clears
  - Backend receives POST to `/incidents/report`

### Test 4.2: Auto-Fill Location
- **Steps:**
  1. On Incident Reporting page
  2. Click "Get Current Location" button

- **Expected Result:**
  - Latitude/Longitude fields auto-populate
  - No manual entry needed
  - Uses tourist's last known location

### Test 4.3: Validate Required Fields
- **Steps:**
  1. Leave Description empty
  2. Try to submit

- **Expected Result:**
  - Form validation error
  - "Description is required" message
  - Form not submitted

### Test 4.4: Different Incident Types
- **Steps:**
  1. Test each incident type:
     - theft
     - harassment
     - lost_documents
     - medical_emergency

- **Expected Result:**
  - All types submit successfully
  - Correct type saved to database

---

## Test Case 5: SOS Emergency System

### Test 5.1: Activate SOS
- **Steps:**
  1. Navigate to "SOS Emergency"
  2. Allow location access
  3. Click large red "SOS" button

- **Expected Result:**
  - Button changes to red with countdown
  - Location captured automatically
  - Notification: "ðŸš¨ SOS Alert Activated!"
  - Countdown starts from 5 seconds

### Test 5.2: SOS Alert Details
- **Steps:**
  1. Activate SOS (as above)
  2. Observe alert panel

- **Expected Result:**
  - Shows "âš  SOS ACTIVATED"
  - Displays location coordinates
  - Shows cancel button

### Test 5.3: Cancel SOS
- **Steps:**
  1. Activate SOS
  2. Click "Cancel SOS" button within 5 seconds

- **Expected Result:**
  - Alert stops
  - Button returns to normal
  - Notification: "âœ“ SOS Alert Cancelled"

### Test 5.4: Auto-Deactivation
- **Steps:**
  1. Activate SOS
  2. Wait 5 seconds without clicking cancel

- **Expected Result:**
  - Countdown reaches 0
  - SOS automatically deactivates
  - Button returns to normal

---

## Test Case 6: Admin Dashboard

### Test 6.1: Admin Tab Navigation
- **Steps:**
  1. Navigate to "Admin" (requires admin account)
  2. Click each tab: Overview, Tourists, Incidents, SOS, Geofences

- **Expected Result:**
  - Each tab content loads
  - Stats cards update
  - Tables/cards display relevant data

### Test 6.2: Statistics Cards
- **Steps:**
  1. View admin dashboard
  2. Note the 4 stat cards

- **Expected Result:**
  - Total Tourists: Shows correct count
  - Open Incidents: Shows unresolved incidents
  - Active SOS Alerts: Shows active alerts
  - Safety Zones: Shows total geofences

### Test 6.3: Tourism Management
- **Steps:**
  1. Click "Tourists" tab
  2. View table of all registered tourists

- **Expected Result:**
  - Table shows all tourist data
  - Columns: Name, Email, Country, Passport, Status
  - Active status shows correctly

### Test 6.4: Incident Resolution
- **Steps:**
  1. Click "Incidents" tab
  2. Find incident with OPEN status
  3. Click "Resolve" button

- **Expected Result:**
  - Status changes to RESOLVED
  - Button disappears
  - Incident appears in resolved list

### Test 6.5: SOS Management
- **Steps:**
  1. Click "SOS" tab
  2. View active SOS alerts

- **Expected Result:**
  - Shows all active SOS alerts
  - Displays coordinates
  - "Resolve" button available

### Test 6.6: Geofence Viewing
- **Steps:**
  1. Click "Geofences" tab
  2. View all zones

- **Expected Result:**
  - Zones display in grid
  - Color-coded by type
  - Shows: Zone name, type, coordinates, radius

---

## Test Case 7: API Integration

### Test 7.1: API Calls Verification
- **Steps:**
  1. Open DevTools â†’ Network tab
  2. Perform any action (e.g., login, update location)
  3. Observe API calls

- **Expected Result:**
  - Correct endpoints called
  - Proper HTTP methods (GET, POST, PUT)
  - Bearer token in Authorization header
  - Response status 200/201 for success

### Test 7.2: Error Handling
- **Steps:**
  1. Try accessing protected route without token
  2. Try invalid request data

- **Expected Result:**
  - 401 Unauthorized for missing token
  - 400 Bad Request for invalid data
  - Error messages display to user

### Test 7.3: Token Expiration
- **Steps:**
  1. Login and get token
  2. Wait 24 hours (or test with modified expiration)
  3. Try making API call

- **Expected Result:**
  - 401 response after expiration
  - Automatic redirect to login
  - User needs to re-login

---

## Test Case 8: Responsive Design

### Test 8.1: Desktop View
- **Steps:**
  1. View app on desktop browser (1920x1080)

- **Expected Result:**
  - Layout displays properly
  - All buttons clickable
  - No scroll issues

### Test 8.2: Tablet View
- **Steps:**
  1. Resize browser to 768x1024
  2. Or use DevTools device emulation

- **Expected Result:**
  - Responsive layout adapts
  - Touch-friendly button sizes
  - Sidebar accessible

### Test 8.3: Mobile View
- **Steps:**
  1. Resize to mobile size (375x667)
  2. Or test on actual mobile device

- **Expected Result:**
  - Proper mobile layout
  - Hamburger menu works
  - Text readable without zoom
  - Forms optimized for touch

---

## Performance Testing

### Test 9.1: Load Time
- **Steps:**
  1. Measure page load time with DevTools
  2. Check Network tab waterfall

- **Expected Result:**
  - Initial load < 3 seconds
  - API responses < 1 second

### Test 9.2: Location Updates
- **Steps:**
  1. Enable location tracking
  2. Observe update frequency
  3. Check battery impact

- **Expected Result:**
  - Updates every 5-10 seconds
  - Smooth without lag
  - Minimal battery drain

---

## Security Testing

### Test 10.1: Token Security
- **Steps:**
  1. Login and copy token from DevTools
  2. Try using expired token
  3. Try modifying token

- **Expected Result:**
  - Invalid token rejected
  - 401 Unauthorized response
  - Forced logout

### Test 10.2: Password Security
- **Steps:**
  1. Check registration form
  2. Ensure password not visible in plain text
  3. Register with weak password

- **Expected Result:**
  - Password field masked (â€¢â€¢â€¢â€¢â€¢)
  - Backend validates password strength
  - Weak passwords rejected

### Test 10.3: CORS Security
- **Steps:**
  1. Try API call from different origin
  2. Check console for CORS error

- **Expected Result:**
  - CORS properly configured
  - Only allowed origins work
  - Cross-origin requests handled safely

---

## Bug Reporting Template

If you find a bug during testing, use this template:

```
**Title:** Clear description of issue

**Severity:** Critical/High/Medium/Low

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happens]

**Environment:**
- Browser: Chrome/Firefox/Safari
- OS: Windows/Mac/Linux
- Backend URL: http://localhost:8081
- Frontend URL: http://localhost:3000

**Screenshots/Logs:**
[If applicable]
```

---

## Passed Test Checklist

- [ ] User Registration works
- [ ] User Login works
- [ ] Demo account login works
- [ ] Logout works
- [ ] Dashboard displays correctly
- [ ] Location tracking updates
- [ ] Map shows zones correctly
- [ ] Incident reporting works
- [ ] All incident types work
- [ ] SOS button functions
- [ ] Admin can resolve incidents
- [ ] Admin can resolve SOS alerts
- [ ] Mobile view responsive
- [ ] All forms validate
- [ ] Error handling works
- [ ] API calls successful
- [ ] No console errors
- [ ] Performance acceptable

---

**Testing Completed By:** _______________  
**Date:** _______________  
**Notes:** _______________


