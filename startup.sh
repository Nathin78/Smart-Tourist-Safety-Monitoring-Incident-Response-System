#!/bin/bash

# Smart Tourist Safety Monitoring System - Startup Script (Linux/Mac)
# This script automates the startup process for developers

clear

echo "===================================================="
echo " Smart Tourist Safety Monitoring System - Startup"
echo "===================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Java
echo "Checking Java installation..."
if ! command -v java &> /dev/null; then
    echo -e "${RED}ERROR: Java not found${NC}"
    echo "Please install Java JDK 11 or higher"
    exit 1
fi

# Check Maven
echo "Checking Maven installation..."
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}ERROR: Maven not found${NC}"
    echo "Please install Maven"
    exit 1
fi

# Check Node.js
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}ERROR: Node.js not found${NC}"
    echo "Please install Node.js"
    exit 1
fi

echo -e "${GREEN}Prerequisites check passed!${NC}"
echo ""

# Menu
echo "Select operation:"
echo "1. Start both frontend and backend"
echo "2. Start backend only"
echo "3. Start frontend only"
echo "4. Setup database only"
echo "5. Build project only"
echo "6. Clean and rebuild"
echo ""

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        start_all
        ;;
    2)
        start_backend
        ;;
    3)
        start_frontend
        ;;
    4)
        setup_db
        ;;
    5)
        build_project
        ;;
    6)
        clean_build
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

# Functions

start_all() {
    echo ""
    echo "Starting database (ensure MySQL is running on localhost:3306)"
    sleep 2
    
    echo ""
    echo -e "${YELLOW}Starting backend on port 8081...${NC}"
    echo "Navigate to: http://localhost:8081"
    echo ""
    
    cd backend
    mvn spring-boot:run &
    BACKEND_PID=$!
    sleep 5
    
    echo ""
    echo -e "${YELLOW}Starting frontend on port 3000...${NC}"
    echo "Navigate to: http://localhost:3000"
    echo ""
    
    cd ../frontend
    npm start &
    FRONTEND_PID=$!
    
    echo ""
    echo -e "${GREEN}Both servers started!${NC}"
    echo "Backend (PID: $BACKEND_PID): http://localhost:8081"
    echo "Frontend (PID: $FRONTEND_PID): http://localhost:3000"
    echo ""
    echo "Demo credentials:"
    echo "  Email: admin@touristsafety.com"
    echo "  Password: admin123"
    echo ""
    echo "Press Ctrl+C to stop servers"
    
    wait
}

start_backend() {
    echo ""
    echo -e "${YELLOW}Starting backend server on port 8081...${NC}"
    echo "Navigate to: http://localhost:8081"
    echo ""
    
    cd backend
    
    if [ ! -d "target" ]; then
        echo "Building backend..."
        mvn clean install
    fi
    
    mvn spring-boot:run
}

start_frontend() {
    echo ""
    cd frontend
    
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies..."
        npm install
    fi
    
    echo ""
    echo -e "${YELLOW}Starting frontend server on port 3000...${NC}"
    echo "Navigate to: http://localhost:3000"
    echo ""
    
    npm start
}

setup_db() {
    echo ""
    echo -e "${YELLOW}Setting up MySQL database...${NC}"
    echo ""
    
    read -p "MySQL username (default: root): " mysql_user
    mysql_user=${mysql_user:-root}
    
    read -sp "MySQL password: " mysql_pass
    echo ""
    
    if [ -z "$mysql_pass" ]; then
        mysql -u "$mysql_user" -e "CREATE DATABASE IF NOT EXISTS tourist_safety;"
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}Creating tables...${NC}"
            mysql -u "$mysql_user" tourist_safety < database/schema.sql
            if [ $? -eq 0 ]; then
                echo -e "${GREEN}Database setup successful!${NC}"
            else
                echo -e "${RED}Database import failed${NC}"
            fi
        fi
    else
        mysql -u "$mysql_user" -p"$mysql_pass" -e "CREATE DATABASE IF NOT EXISTS tourist_safety;"
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}Creating tables...${NC}"
            mysql -u "$mysql_user" -p"$mysql_pass" tourist_safety < database/schema.sql
            if [ $? -eq 0 ]; then
                echo -e "${GREEN}Database setup successful!${NC}"
            else
                echo -e "${RED}Database import failed${NC}"
            fi
        fi
    fi
}

build_project() {
    echo ""
    echo -e "${YELLOW}Building project...${NC}"
    echo ""
    
    cd backend
    echo "Building backend..."
    mvn clean install
    if [ $? -ne 0 ]; then
        echo -e "${RED}Backend build failed${NC}"
        exit 1
    fi
    
    cd ../frontend
    echo "Building frontend..."
    npm install
    npm run build
    if [ $? -ne 0 ]; then
        echo -e "${RED}Frontend build failed${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}Build completed successfully!${NC}"
}

clean_build() {
    echo ""
    echo -e "${YELLOW}Cleaning project...${NC}"
    echo ""
    
    cd backend
    echo "Cleaning backend..."
    mvn clean
    
    cd ../frontend
    echo "Cleaning frontend..."
    rm -rf node_modules
    rm -rf build
    
    echo -e "${GREEN}Clean completed!${NC}"
    echo ""
    echo -e "${YELLOW}Rebuilding...${NC}"
    echo ""
    
    cd ../backend
    mvn clean install
    
    cd ../frontend
    npm install
    npm run build
    
    echo ""
    echo -e "${GREEN}Rebuild completed successfully!${NC}"
}

# Main execution
if [ -z "$choice" ]; then
    echo "No choice provided"
    exit 1
fi

echo ""

