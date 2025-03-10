const rateLimit = require('express-rate-limit');

// Limiter for authentication routes (when implemented)
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 login requests per hour
  message: {
    error: 'Too many login attempts from this IP, please try again after an hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter for create/update operations
const mutationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per minute
  message: {
    error: 'Too many create/update requests from this IP, please try again after a minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter for share operations
const shareLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 share requests per minute
  message: {
    error: 'Too many share requests from this IP, please try again after a minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  authLimiter,
  mutationLimiter,
  shareLimiter,
}; 