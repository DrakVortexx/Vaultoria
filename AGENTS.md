# Vaultoria - Setup and Security Documentation

## Project Overview
Vaultoria is a multiplayer web-based incremental trading and PvP game with a cyberpunk theme, built with Node.js, Express, PostgreSQL, and Socket.IO. The game features resource gathering, trading, PvP combat, and multiple progression systems designed for engaging gameplay.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository and install dependencies:**
```bash
npm install
```

2. **Set up the database:**
```bash
# Create a PostgreSQL database
createdb vaultoria

# Run the schema
psql vaultoria < schema.sql
```

3. **Configure environment variables:**
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
# Important: Change JWT_SECRET to a secure random string in production!
```

4. **Start the server:**
```bash
npm start
# or for development
npm run dev
```

The server will start on port 3000 (or the port specified in your .env file).

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (default: 3000)
- `JWT_SECRET`: Secret key for JWT token signing (CHANGE IN PRODUCTION!)
- `NODE_ENV`: Environment setting (development/production)

## Security Features Implemented

### 1. Password Security
- **Strong Password Requirements**: 
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- **Password Hashing**: Using bcrypt with salt rounds of 10
- **Client-side Validation**: Password strength checked before API calls

### 2. Authentication & Authorization
- **JWT Token-based Authentication**: Secure token-based auth with 24-hour expiration
- **Token Storage**: Tokens stored in localStorage with automatic session restoration
- **User Authorization**: All protected endpoints verify user identity and prevent cross-user access
- **Automatic Logout**: Handles expired tokens and forces re-authentication

### 3. Rate Limiting
- **General API Limiting**: 100 requests per 15 minutes per IP
- **Auth Endpoints**: Stricter limit of 5 requests per 15 minutes for login/register
- **Prevents Brute Force**: Protects against credential stuffing attacks

### 4. Input Validation & Sanitization
- **Server-side Validation**: Using express-validator for all input fields
- **Input Sanitization**: Username sanitization to prevent XSS attacks
- **Type Validation**: Strict type checking for numeric inputs
- **Range Validation**: Ensures quantities, prices, and IDs are within valid ranges

### 5. Database Security
- **Transaction Management**: All critical operations use database transactions
- **SQL Injection Prevention**: Using parameterized queries throughout
- **Connection Security**: SSL support for PostgreSQL connections (especially for Neon.tech)

### 6. HTTP Security
- **Helmet.js**: Security headers for Express.js
- **CORS Protection**: Configured for same-origin policy
- **Secure Headers**: Various security headers to prevent common attacks

### 7. Session Management
- **Token Expiration**: JWT tokens expire after 24 hours
- **Session Persistence**: Secure localStorage implementation
- **Automatic Session Restoration**: Checks for existing valid sessions on page load
- **Clean Logout**: Proper token cleanup on logout

## API Security Notes

### Protected Endpoints
All endpoints that modify user data or access personal information require JWT authentication:
- `/api/player/:id` - User profile access
- `/api/click` - Resource generation
- `/api/inventory/:player_id` - Inventory access
- `/api/sell` - Item selling
- `/api/bazaar/list` - Listing items
- `/api/bazaar/buy` - Buying items
- `/api/upgrade` - Purchasing upgrades
- `/api/breach` - PvP attacks

### Authorization Checks
- Users can only access their own data
- Users can only perform actions on their own behalf
- Cross-user operations are explicitly blocked

## Development Guidelines

### Adding New Features
1. **Always use authentication middleware** for protected endpoints
2. **Implement client-side validation** before making API calls
3. **Use database transactions** for multi-step operations
4. **Sanitize all user inputs** before processing
5. **Test error handling** for security scenarios

### Security Best Practices
- Never commit `.env` files or sensitive data
- Use strong, unique JWT secrets in production
- Regularly update dependencies for security patches
- Implement proper error logging (without sensitive data)
- Use HTTPS in production
- Consider implementing CSRF protection for additional security

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check database credentials

### Authentication Issues
- Verify JWT_SECRET is set
- Check token expiration (24 hours)
- Ensure localStorage is enabled in browser

### Rate Limiting Issues
- If hitting limits during development, adjust rate limiter settings
- Consider different limits for production vs development

## Testing Security

### Manual Testing Checklist
- [ ] Try to access another user's data (should fail)
- [ ] Attempt SQL injection in input fields (should be prevented)
- [ ] Test weak passwords (should be rejected)
- [ ] Try to perform actions without authentication (should fail)
- [ ] Test expired token handling (should force logout)
- [ ] Attempt XSS attacks in username fields (should be sanitized)

### Load Testing
- Test rate limiting with multiple rapid requests
- Verify database transaction rollback on errors
- Check connection pooling under load

## Production Deployment

### Before Deploying
1. Change `JWT_SECRET` to a cryptographically secure random string
2. Set `NODE_ENV=production`
3. Use HTTPS with valid SSL certificates
4. Configure proper CORS settings for your domain
5. Set up proper database backups
6. Configure logging and monitoring
7. Review and adjust rate limiting for expected traffic
8. Ensure database connection uses SSL

### Recommended Additional Security
- Implement request logging and monitoring
- Set up intrusion detection
- Use a web application firewall (WAF)
- Implement regular security audits
- Consider adding 2FA for additional security
- Set up database connection encryption
- Implement API key rotation strategy

## Game Features

### Core Gameplay Mechanics
- **Manual Clicking**: Click to generate items based on clicker level
- **Auto-Clicker**: Automatic clicking at intervals (10s, 5s, 3s, 1s based on level)
- **Generator**: Passive item generation every 5 seconds
- **Bazaar Trading**: Player-to-player marketplace for buying/selling items
- **PvP Breaching**: Attack other players to steal cash (expensive but rewarding)

### Progression Systems
- **XP & Leveling**: Gain XP from clicks, unlock achievements, earn rewards
- **Daily Rewards**: Claim daily rewards with streak bonuses (up to 3x multiplier)
- **Achievements**: 20+ achievements with XP and cash rewards
- **Upgrade Paths**: Clicker, Auto-Clicker, Generator, and Protection upgrades

### Item System
- **Rarity Tiers**: Junk → Common → Rare → Epic → Legendary
- **Base Values**: $0.10, $0.50, $5.00, $25.00, $100.00
- **Player-Driven Economy**: Bazaar allows market-based pricing

### Security & Economy Balance
- **No Direct Selling**: Players must use bazaar to sell items (prevents market manipulation)
- **Expensive Breaches**: Breach tools cost 10x more to prevent abuse
- **Rate Limiting**: Prevents bot abuse and grinding

### Addictive Elements
- **Progress Bars**: Visual XP progression with animated effects
- **Achievement Notifications**: Real-time feedback for accomplishments
- **Streak Bonuses**: Daily login incentives with escalating rewards
- **Level Up Celebrations**: Visual feedback when reaching new levels
- **Real-time Updates**: Socket.IO for live game state changes

## Database Schema Updates
Recent additions include:
- Autoclicker fields in players table
- XP and level tracking
- Daily streak system
- Achievement tracking
- Player statistics (clicks, items, bazaar activity, breaches)

## Contact & Support
For security issues or questions about implementation, refer to the project documentation or contact the development team.
