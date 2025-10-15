// Creates least-privileged app user; touches the "rcpt" DB.
// Runs automatically only on a fresh volume, but is idempotent.

(function () {
    var admin = db.getSiblingDB("admin");
  
    // Create user only if missing
    if (!admin.getUser("rcptapp")) {
      admin.createUser({
        user: "rcptapp",
        pwd: "rcptapppw",
        roles: [{ role: "readWrite", db: "rcpt" }]
      });
    }
  
    // Touch the application DB explicitly
    var rcpt = db.getSiblingDB("rcpt");
    rcpt.runCommand({ ping: 1 });
  })();