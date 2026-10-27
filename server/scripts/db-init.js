import { loadConfig } from "../src/config.js";
import { openDatabase } from "../src/db/connection.js";
import { migrate } from "../src/db/migrate.js";
const db = openDatabase(loadConfig().database);
try {
  migrate(db);
  console.log("SQLite preparada; los datos existentes se conservaron.");
} finally {
  db.close();
}
