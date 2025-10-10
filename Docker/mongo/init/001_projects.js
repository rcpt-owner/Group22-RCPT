// 001_projects.js
// creates rcpt.projects if missing and ensures baseline indexes

(function () {
  const dbName = 'rcpt';
  const coll = 'projects';
  const rcpt = db.getSiblingDB(dbName);

  // Create collection if missing 
  const exists = rcpt.getCollectionInfos({ name: coll }).length > 0;
  if (!exists) {
    print(`[001] Creating collection ${dbName}.${coll}`);
    rcpt.createCollection(coll, {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['title','ownerUserId','currency','status','staffCosts','nonStaffCosts','createdAt','updatedAt'],
          additionalProperties: true, 
          properties: {
            title: { bsonType: 'string' },
            ownerUserId: { bsonType: 'string' },
            currency: { bsonType: 'string' },
            status: { bsonType: 'string' },
            staffCosts: { bsonType: 'array' },
            nonStaffCosts: { bsonType: 'array' },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' }
          }
        }
      }
    });
  } else {
    print(`[001] Collection ${dbName}.${coll} already exists — skipping create`);
  }

  // Base indexes for UI queries
  print('[001] Ensuring base indexes');
  rcpt.projects.createIndex({ ownerUserId: 1, status: 1, createdAt: -1 }, { name: 'owner_status_created_idx' });
  // Project List with recency sort 
  rcpt.projects.createIndex({ 'approvals.email': 1, status: 1, updatedAt: -1 }, { name: 'approver_status_updated_idx' });
  // Approver inbox with recency sort 
  rcpt.projects.createIndex(
    { code: 1 },
    { name: 'project_code_uq', unique: true, partialFilterExpression: { code: { $type: 'string' } } }
  );

  // Optional search helpers (uncomment if we want text searches, using key words)
  // rcpt.projects.createIndex({ title: "text", scheme: "text", funder: "text" }, { name: "projects_text_idx" });
})();
