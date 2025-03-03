import { Request, Response, NextFunction } from "express";

interface RateLimitOptions {
  windowMs: number; // Time frame for rate limit in milliseconds
  maxRequests: number; // Maximum number of allowed requests within the time frame
}

// In-memory storage to keep track of requests per IP
const requestMap: Record<string, { count: number; timestamp: number }> = {};

// Middleware to limit requests based on IP address
const rateLimiter = (options: RateLimitOptions) => {
  const { windowMs, maxRequests } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const clientIp =
      req.ip ||
      req.socket.remoteAddress ||
      req.headers["x-forwarded-for"]?.[0] ||
      ""; // Get the client's IP address

    const currentTime = Date.now();

    if (!requestMap[clientIp]) {
      // If the IP is not found in the request map, initialize it
      requestMap[clientIp] = { count: 1, timestamp: currentTime };
    } else {
      const { count, timestamp } = requestMap[clientIp];

      if (currentTime - timestamp < windowMs) {
        // If the time since the first request is within the window
        if (count >= maxRequests) {
          // If the request count exceeds maxRequests, block the request
          return res
            .status(429)
            .json({ message: "Too many requests, please try again later." });
        } else {
          // Otherwise, increment the request count
          requestMap[clientIp].count += 1;
        }
      } else {
        // Reset the count and timestamp after the time window passes
        requestMap[clientIp] = { count: 1, timestamp: currentTime };
      }
    }

    next();
  };
};

export default rateLimiter;
