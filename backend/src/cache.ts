import Redis from "ioredis";
import { REDIS_CONNECTION_CONFIG } from "./config";

export const redis = new Redis(REDIS_CONNECTION_CONFIG);
