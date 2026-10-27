import session from "express-session";
import SQLiteStoreFactory from "better-sqlite3-session-store";
const SQLiteStore = SQLiteStoreFactory(session);
// The adapter does not expose its interval handle; own it so shutdown releases resources.
class ManagedSQLiteStore extends SQLiteStore {
  startInterval() {
    this.cleanupTimer = setInterval(() => this.clearExpiredSessions(), 900000);
    this.cleanupTimer.unref();
  }
  close() {
    clearInterval(this.cleanupTimer);
  }
}
export function sessions(db, config) {
  const store = new ManagedSQLiteStore({ client: db });
  const middleware = session({
    name: "tienda.sid",
    secret: config.secret,
    store,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: config.production,
      maxAge: 1800000,
      path: "/",
    },
  });
  return { store, middleware };
}
