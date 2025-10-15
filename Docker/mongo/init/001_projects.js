// 001_projects.js
// Ensures "projects" collection exists with strict JSON schema validation.

(function () {
    var rcpt = db.getSiblingDB("rcpt");
  
    var schema = {
      bsonType: "object",
      required: ["title","ownerUserId","currency","status","staffCosts","nonStaffCosts","createdAt","updatedAt"],
      additionalProperties: false,
      properties: {
        _id: {},
        title: { bsonType: "string", minLength: 1 },
        code: { bsonType: ["string","null"] },
        ownerUserId: { bsonType: "string" },
        scheme: { bsonType: ["string","null"] },
        funder: { bsonType: ["string","null"] },
        currency: { bsonType: "string", minLength: 3, maxLength: 3 },
        status: { enum: ["draft","submitted","under_review","approved","rejected"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
  
        staffCosts: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["name","employmentType","category","classification","timeBasis","timeValue"],
            additionalProperties: false,
            properties: {
              name: { bsonType: "string" },
              employmentType: { enum: ["continuing","fixed_term","casual"] },
              category: { enum: ["academic","professional","casual"] },
              classification: { bsonType: "string" },
              step: { bsonType: ["int","null"] },
              timeBasis: { enum: ["FTE","daily","hourly"] },
              timeValue: { bsonType: "double", minimum: 0 },
              startDate: { bsonType: ["date","null"] },
              endDate: { bsonType: ["date","null"] },
              inKind: { bsonType: ["bool","null"] },
              addGST: { bsonType: ["bool","null"] },
              overrides: {
                bsonType: ["object","null"],
                additionalProperties: true,
                properties: {
                  onCostPercent: { bsonType: ["double","int","null"] },
                  indirectMultiplier: { bsonType: ["double","int","null"] },
                  baseRate: { bsonType: ["double","int","null"] }
                }
              },
              notes: { bsonType: ["string","null"] }
            }
          }
        },
  
        nonStaffCosts: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["costCategory","description","costPerItem"],
            additionalProperties: false,
            properties: {
              costCategory: { bsonType: "string" },
              description: { bsonType: "string" },
              units: { bsonType: ["double","int","null"], minimum: 0 },
              costPerItem: { bsonType: ["double","int"], minimum: 0 },
              inKind: { bsonType: ["bool","null"] },
              addGST: { bsonType: ["bool","null"] },
              indirectMultiplier: { bsonType: ["double","int","null"] },
              notes: { bsonType: ["string","null"] }
            }
          }
        },
  
        approvals: {
          bsonType: ["array","null"],
          items: {
            bsonType: "object",
            additionalProperties: false,
            properties: {
              stage: { bsonType: "string" },
              approverUserId: { bsonType: "string" },
              status: { enum: ["pending","approved","declined"] },
              comment: { bsonType: ["string","null"] },
              timestamp: { bsonType: ["date","null"] }
            }
          }
        },
  
        priceSummary: {
          bsonType: ["object","null"],
          additionalProperties: false,
          properties: {
            staffSubtotal: { bsonType: ["double","int","null"] },
            nonStaffSubtotal: { bsonType: ["double","int","null"] },
            indirects: { bsonType: ["double","int","null"] },
            gst: { bsonType: ["double","int","null"] },
            totalCost: { bsonType: ["double","int","null"] },
            totalPrice: { bsonType: ["double","int","null"] },
            inKindTotals: {
              bsonType: ["object","null"],
              additionalProperties: false,
              properties: {
                staff: { bsonType: ["double","int","null"] },
                nonStaff: { bsonType: ["double","int","null"] }
              }
            },
            computedAt: { bsonType: ["date","null"] },
            calcVersion: { bsonType: ["string","null"] },
            rulesetId: { bsonType: ["string","null"] },
            lookupSnapshotId: { bsonType: ["string","null"] }
          }
        },
  
        title_lc: { bsonType: ["string","null"] },
        scheme_lc: { bsonType: ["string","null"] },
        funder_lc: { bsonType: ["string","null"] },
  
        notes: {
          bsonType: ["array","null"],
          items: {
            bsonType: "object",
            additionalProperties: false,
            properties: {
              userId: { bsonType: "string" },
              message: { bsonType: "string" },
              timestamp: { bsonType: "date" }
            }
          }
        },
  
        docVersion: { bsonType: ["int","long","null"] }
      }
    };
  
    var exists = rcpt.getCollectionInfos({ name: "projects" }).length > 0;
  
    if (!exists) {
      rcpt.createCollection("projects", {
        validator: { $jsonSchema: schema },
        validationLevel: "strict",
        validationAction: "error"
      });
    } else {
      rcpt.runCommand({
        collMod: "projects",
        validator: { $jsonSchema: schema },
        validationLevel: "strict",
        validationAction: "error"
      });
    }
  })();
  