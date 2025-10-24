// 000_create_app_user.js
// creates the non-root app user with read/write to rcpt

(function () {
  const APP_DB = 'rcpt';
  const APP_USER = 'rcptapp';
  const APP_PW = 'rcptapppw'; // dev only

  const admin = db.getSiblingDB('admin');

  // Create user only if it doesn't exist
  const existing = admin.system.users.findOne({ user: APP_USER });
  if (!existing) {
    print(`[000] Creating app user "${APP_USER}" for DB "${APP_DB}"`);
    admin.createUser({
      user: APP_USER,
      pwd: APP_PW,
      roles: [{ role: 'readWrite', db: APP_DB }]
    });
  } else {
    print(`[000] App user "${APP_USER}" already exists — skipping`);
  }
})();
