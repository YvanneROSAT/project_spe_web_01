import "@/env";

import { DB_CONNECTION_CONFIG } from "@/config";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const connection = mysql.createPool(DB_CONNECTION_CONFIG);

export const db = drizzle(connection, { schema, mode: "default" });
