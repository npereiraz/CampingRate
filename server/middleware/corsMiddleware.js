const cors = require('cors');

const corsMiddleware = cors({
    credentials: true,
    origin: 'http://localhost:5173',
});

module.exports = corsMiddleware;