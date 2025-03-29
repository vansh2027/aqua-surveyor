# Aqua Surveyor Backend

Backend service for the Aqua Surveyor water body monitoring system.

## Features

- User authentication with JWT
- CRUD operations for water body surveys
- Real-time notifications via email and SMS
- Geospatial queries for survey locations
- Water quality threshold monitoring

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Twilio account (for SMS notifications)
- Gmail account (for email notifications)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email
   EMAIL_PASSWORD=your_email_password
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   TWILIO_PHONE_NUMBER=your_twilio_number
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### Surveys
- GET `/api/surveys` - Get all surveys
- GET `/api/surveys/:id` - Get survey by ID
- POST `/api/surveys` - Create new survey
- PUT `/api/surveys/:id` - Update survey
- DELETE `/api/surveys/:id` - Delete survey
- GET `/api/surveys/location/:lat/:lng/:radius` - Get surveys by location

### Notifications
- POST `/api/notifications/email` - Send email notification
- POST `/api/notifications/sms` - Send SMS notification
- POST `/api/notifications/check-levels` - Check water levels and send alerts

## Deployment

### AWS EC2 Setup

1. Launch an EC2 instance with Ubuntu Server
2. Install Node.js and MongoDB:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo apt-get install -y mongodb
   ```

3. Clone the repository and install dependencies
4. Set up environment variables
5. Build the TypeScript code:
   ```bash
   npm run build
   ```
6. Install PM2:
   ```bash
   npm install -g pm2
   ```
7. Start the application:
   ```bash
   pm2 start dist/server.js
   ```

### Environment Variables

Make sure to set up the following environment variables in your production environment:

- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure secret key for JWT
- `EMAIL_USER`: Gmail address for notifications
- `EMAIL_PASSWORD`: Gmail app password
- `TWILIO_ACCOUNT_SID`: Your Twilio account SID
- `TWILIO_AUTH_TOKEN`: Your Twilio auth token
- `TWILIO_PHONE_NUMBER`: Your Twilio phone number

## Security Considerations

- Use HTTPS in production
- Set up proper CORS configuration
- Use environment variables for sensitive data
- Implement rate limiting
- Set up proper MongoDB authentication
- Use secure JWT secrets
- Implement input validation

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 