db = db.getSiblingDB("rcpt");
db.projects.createIndex({ ownerUserId: 1, status: 1, createdAt: -1 }); // Speeds up “My Projects” list views and sorts by most recent
db.projects.createIndex({ "approvals.approverUserId": 1, status: 1 });   // Fast “Approver inbox”: show items awaiting for approver. increase queue process
db.projects.createIndex({ title: "text", scheme: "text", funder: "text" }); // simple search bar for keywords of title/scheme/fund 

// Ensures indexes exist for common FE queries (createIndex is idempotent).

(function () {
    var rcpt = db.getSiblingDB("rcpt");
  
    //Projects list (owner + status + createdAt + desc) and sorts by most recent
    rcpt.projects.createIndex(
      { ownerUserId: 1, status: 1, createdAt: -1 },
      { name: "owner_status_created_idx" }
    );
  
    // Approver inbox show items awaiting for approver.
    rcpt.projects.createIndex(
      { "approvals.approverUserId": 1, status: 1, updatedAt: -1 },
      { name: "approver_status_updated_idx" }
    );
  
    // Unique project codes
    rcpt.projects.createIndex(
      { code: 1 },
      { name: "project_code_uq", unique: true, partialFilterExpression: { code: { $type: "string" } } }
    );
  
    // Text search across main fields 
    rcpt.projects.createIndex(
      { title: "text", scheme: "text", funder: "text" },
      { name: "projects_text_idx" }
    );
  
    // Case-insensitive helpers
    rcpt.projects.createIndex({ title_lc: 1 }, { name: "title_lc_idx" });
    rcpt.projects.createIndex({ scheme_lc: 1 }, { name: "scheme_lc_idx" });
    rcpt.projects.createIndex({ funder_lc: 1 }, { name: "funder_lc_idx" });
  
    // Recency sorts
    rcpt.projects.createIndex({ createdAt: -1 }, { name: "created_desc_idx" });
    rcpt.projects.createIndex({ updatedAt: -1 }, { name: "updated_desc_idx" });
  })();
  