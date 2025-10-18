// 002_projects_schema_strict_validator.js
// Applies the strict, final schema 

(function () {
    const rcpt = db.getSiblingDB('rcpt');
  
    print('[002] Applying strict validator to rcpt.projects');
  
    rcpt.runCommand({
      collMod: 'projects',
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['title','ownerUserId','currency','status','staffCosts','nonStaffCosts','createdAt','updatedAt'],
          additionalProperties: false,
          properties: {
            _id: { bsonType: 'objectId' },
            // Project Details 
            title: { bsonType: 'string', minLength: 1 },
            leadInvestigator: { bsonType: ['string','null'] },
            department: { bsonType: ['string','null'] },
            faculty: { bsonType: ['string','null'] },
            description: { bsonType: ['string','null'] },
  
            // ISO dates
            projectStartDate: { bsonType: ['date','null'] },
            projectEndDate:   { bsonType: ['date','null'] },
  
            currency: { bsonType: 'string', minLength: 3, maxLength: 3 },
  
            // 4-state status
            status: { enum: ['draft','submitted','approved','archived'] },
  
            // Staff Costs
            staffCosts: {
              bsonType: 'array',
              items: {
                bsonType: 'object',
                required: ['role','employmentType','category','timeBasis'],
                additionalProperties: false,
                properties: {
                  _id: { bsonType: ['objectId','null'] },
                  role: { bsonType: 'string' },
  
                  employmentType: { enum: ['Continuing','Fixed term','Casual'] },
                  category:       { enum: ['Academic','Professional'] }, 
                  timeBasis:      { enum: ['FTE','Daily','Hourly'] },
  
                  classification: { bsonType: ['string','null'] },
  
                  // per-year allocation (keys=years as strings; values = numbers)
                  timeAllocationByYear: {
                    bsonType: ['object','null'],
                    additionalProperties: {
                      bsonType: ['double','int','long','decimal']
                    }
                  },
  
                  // snapshot of rates used at last calculation
                  currentRateSnapshot: {
                    bsonType: ['object','null'],
                    additionalProperties: true
                  },
  
                  inKind: { bsonType: ['bool','null'] }
                }
              }
            },
  
            // Non-Staff Costs 
            nonStaffCosts: {
              bsonType: 'array',
              items: {
                bsonType: 'object',
                required: ['costGroup','expenseType','addGST'],
                additionalProperties: false,
                properties: {
                  _id: { bsonType: ['objectId','null'] },
                  costGroup: { bsonType: 'string' },
                  expenseType: { bsonType: 'string' },
                  description: { bsonType: ['string','null'] },
                  isInKind: { bsonType: ['bool','null'] },
                  addGST: { bsonType: 'bool' },
                  additionalIndirectRateMultiplier: {
                    bsonType: ['double','int','long','decimal','null'],
                    minimum: 0
                  },
                  // per-year monetary amounts
                  costPerYear: {
                    bsonType: ['object','null'],
                    additionalProperties: {
                      bsonType: ['double','int','long','decimal']
                    }
                  }
                }
              }
            },
  
            // Pricing Summary
            priceSummary: {
              bsonType: ['object','null'],
              additionalProperties: true,
              properties: {
                currency: { bsonType: 'string' },
                totalCost: { bsonType: ['double','int','long','decimal'] },
                priceToCharge: { bsonType: ['double','int','long','decimal'] },
                indirectCostMultiplier: { bsonType: ['double','int','long','decimal'] },
                GSTIncluded: { bsonType: ['bool','null'] }, // required by export layer
                computedAt: { bsonType: ['date','null'] }
              }
            },
  
            // Approvals (Approval Form export section) 
            approvals: {
              bsonType: ['array','null'],
              items: {
                bsonType: 'object',
                additionalProperties: false,
                properties: {
                  _id: { bsonType: ['objectId','null'] },
                  authorityScope: { bsonType: ['string','null'] }, //on figma its a selection, just enter the faculty
                  position: { bsonType: ['string','null'] },
                  name: { bsonType: 'string' },
                  email: { bsonType: 'string' },
                  date: { bsonType: ['date','null'] },
                  comments: { bsonType: ['string','null'] }
                }
              }
            },
  
            // housekeeping
            code: { bsonType: ['string','null'] },
            ownerUserId: { bsonType: 'string' },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' }
          }
        }
      }
    });
  
    // Re-ensure important indexes
    rcpt.projects.createIndex({ ownerUserId: 1, status: 1, createdAt: -1 }, { name: 'owner_status_created_idx' });
    rcpt.projects.createIndex({ 'approvals.email': 1, status: 1, updatedAt: -1 }, { name: 'approver_status_updated_idx' });
    rcpt.projects.createIndex(
      { code: 1 },
      { name: 'project_code_uq', unique: true, partialFilterExpression: { code: { $type: 'string' } } }
    );
  
    print('[002] Strict validator + indexes applied');
  })();
  