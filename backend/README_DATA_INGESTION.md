# Healthcare Data Ingestion API Documentation

This API provides endpoints for ingesting healthcare plan data, premiums, counties, and mappings from CSV files via Postman.

## Base URL
```
http://localhost:5000/api/data
```

## 📊 Data Models

### 1. Premium Collection
Stores age-based premiums for each plan with fast querying capabilities.

### 2. Zip County Map Collection
Maps zip codes to counties for geographic data.

### 3. County Collection
Stores county information with county_id as the primary key.

### 4. Plan County Map Collection
Maps plans to counties for availability data.

### 5. Plan Collection
Stores comprehensive plan metadata and information.

---

## 🚀 CSV Ingestion Endpoints

### Premium Data Ingestion

#### POST `/api/data/premiums/bulk`
Bulk ingest premium data from CSV.

**Request Body:**
```json
{
  "premiums": [
    {
      "plan_id": "56707OR1350004",
      "rating_area_id": "RA123",
      "effective_date": "2025-01-01",
      "expiration_date": "2025-12-31",
      "source": "HealthGov",
      "fixed_price": false,
      "child_only": 100.0,
      "family": 1200.0,
      "single": 400.0,
      "single_tobacco": 480.0,
      "single_and_spouse": 700.0,
      "single_and_children": 900.0,
      "age_0": 150.0,
      "age_0_tobacco": 180.0,
      "age_1": 151.0,
      "age_1_tobacco": 182.0,
      "age_65": 600.0,
      "age_65_tobacco": 720.0
    }
  ]
}
```

**Response:**
```json
{
  "message": "Successfully created 1 premium records",
  "insertedCount": 1,
  "totalCount": 1
}
```

### Zip County Map Ingestion

#### POST `/api/data/zip-county-maps/bulk`
Bulk ingest zip code to county mappings.

**Request Body:**
```json
{
  "mappings": [
    {
      "zip_code_id": "97219",
      "county_id": "41005"
    },
    {
      "zip_code_id": "10001",
      "county_id": "36061"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Successfully created 2 zip county mappings",
  "insertedCount": 2,
  "totalCount": 2
}
```

### County Data Ingestion

#### POST `/api/data/counties/bulk`
Bulk ingest county information.

**Request Body:**
```json
{
  "counties": [
    {
      "county_id": "41005",
      "name": "Baker County",
      "state_id": "OR"
    },
    {
      "county_id": "36061",
      "name": "New York County",
      "state_id": "NY"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Successfully created 2 county records",
  "insertedCount": 2,
  "totalCount": 2
}
```

### Plan County Map Ingestion

#### POST `/api/data/plan-county-maps/bulk`
Bulk ingest plan to county availability mappings.

**Request Body:**
```json
{
  "mappings": [
    {
      "plan_id": "56707OR1350004",
      "county_id": "41035"
    },
    {
      "plan_id": "56707OR1350005",
      "county_id": "36061"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Successfully created 2 plan county mappings",
  "insertedCount": 2,
  "totalCount": 2
}
```

### Plan Data Ingestion

#### POST `/api/data/plans/bulk`
Bulk ingest plan metadata and information.

**Request Body:**
```json
{
  "plans": [
    {
      "plan_id": "56707OR1350004",
      "name": "Silver PPO 5000",
      "carrier_name": "BlueCross BlueShield",
      "plan_type": "PPO",
      "plan_market": "on_market",
      "level": "Silver",
      "actuarial_value": 0.7,
      "effective_date": "2025-01-01",
      "expiration_date": "2025-12-31",
      "hsa_eligible": false,
      "embedded_deductible": true,
      "network_name": "Blue Network",
      "network_size": 12000,
      "out_of_network_coverage": true,
      "provider_directory_url": "https://example.com/network",
      "summary_url": "https://example.com/sob",
      "key_benefits": "Includes preventive care, maternity, ER",
      "overall_rating": 4,
      "medical_care_rating": 3,
      "member_experience_rating": 4,
      "plan_administration_rating": 3,
      "logo_url": "https://example.com/logo.png",
      "carrier_brand_id": "BCBS123",
      "source": "cms"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Successfully created 1 plan records",
  "insertedCount": 1,
  "totalCount": 1
}
```

---

## 🔍 Query Endpoints

### Premium Queries
- `GET /api/data/premiums` - Get all premiums
- `GET /api/data/premiums/plan/:planId` - Get premium by plan ID
- `PUT /api/data/premiums/:id` - Update premium
- `DELETE /api/data/premiums/:id` - Delete premium

### Zip County Map Queries
- `GET /api/data/zip-county-maps` - Get all mappings
- `GET /api/data/zip-county-maps/zip/:zipCode` - Get county by zip code
- `GET /api/data/zip-county-maps/county/:countyId` - Get zip codes by county
- `PUT /api/data/zip-county-maps/:id` - Update mapping
- `DELETE /api/data/zip-county-maps/:id` - Delete mapping

### County Queries
- `GET /api/data/counties` - Get all counties
- `GET /api/data/counties/:id` - Get county by ID
- `GET /api/data/counties/state/:stateId` - Get counties by state
- `PUT /api/data/counties/:id` - Update county
- `DELETE /api/data/counties/:id` - Delete county

### Plan County Map Queries
- `GET /api/data/plan-county-maps` - Get all mappings
- `GET /api/data/plan-county-maps/county/:countyId` - Get plans by county
- `GET /api/data/plan-county-maps/plan/:planId` - Get counties by plan
- `PUT /api/data/plan-county-maps/:id` - Update mapping
- `DELETE /api/data/plan-county-maps/:id` - Delete mapping

### Plan Queries
- `GET /api/data/plans` - Get all plans
- `GET /api/data/plans/:id` - Get plan by ID
- `GET /api/data/plans/carrier/:carrierName` - Get plans by carrier
- `GET /api/data/plans/level/:level` - Get plans by level
- `PUT /api/data/plans/:id` - Update plan
- `DELETE /api/data/plans/:id` - Delete plan

---

## 📋 CSV Column Mapping

### Premium CSV Columns
| CSV Column | Database Field | Type | Required |
|------------|----------------|------|----------|
| plan_id | plan_id | String | ✅ |
| rating_area_id | rating_area_id | String | ✅ |
| effective_date | effective_date | String | ✅ |
| expiration_date | expiration_date | String | ✅ |
| source | source | String | ❌ |
| fixed_price | fixed_price | Boolean | ❌ |
| child_only | child_only | Number | ❌ |
| family | family | Number | ❌ |
| single | single | Number | ❌ |
| single_tobacco | single_tobacco | Number | ❌ |
| single_and_spouse | single_and_spouse | Number | ❌ |
| single_and_children | single_and_children | Number | ❌ |
| age_* | premiums.age_* | Number | ❌ |

### Zip County Map CSV Columns
| CSV Column | Database Field | Type | Required |
|------------|----------------|------|----------|
| zip_code_id / zip_code | zip_code_id | String | ✅ |
| county_id / county | county_id | String | ✅ |

### County CSV Columns
| CSV Column | Database Field | Type | Required |
|------------|----------------|------|----------|
| county_id / id | _id | String | ✅ |
| name | name | String | ✅ |
| state_id / state | state_id | String | ✅ |

### Plan County Map CSV Columns
| CSV Column | Database Field | Type | Required |
|------------|----------------|------|----------|
| plan_id / plan | plan_id | String | ✅ |
| county_id / county | county_id | String | ✅ |

### Plan CSV Columns
| CSV Column | Database Field | Type | Required |
|------------|----------------|------|----------|
| plan_id / id | _id | String | ✅ |
| name | name | String | ✅ |
| carrier_name / carrier | carrier_name | String | ❌ |
| plan_type | plan_type | String | ❌ |
| plan_market | plan_market | String | ❌ |
| level | level | String | ❌ |
| actuarial_value | actuarial_value | Number | ❌ |
| effective_date | effective_date | String | ❌ |
| expiration_date | expiration_date | String | ❌ |
| hsa_eligible | hsa_eligible | Boolean | ❌ |
| embedded_deductible | embedded_deductible | Boolean | ❌ |
| network_name | network.name | String | ❌ |
| network_size | network.size | Number | ❌ |
| out_of_network_coverage | network.out_of_network_coverage | Boolean | ❌ |
| provider_directory_url | network.provider_directory_url | String | ❌ |
| summary_url | benefits.summary_url | String | ❌ |
| key_benefits | benefits.key_benefits | String | ❌ |
| overall_rating | cms_quality_ratings.overall | Number | ❌ |
| medical_care_rating | cms_quality_ratings.medical_care | Number | ❌ |
| member_experience_rating | cms_quality_ratings.member_experience | Number | ❌ |
| plan_administration_rating | cms_quality_ratings.plan_administration | Number | ❌ |
| logo_url | branding.logo_url | String | ❌ |
| carrier_brand_id | branding.carrier_brand_id | String | ❌ |
| source | source | String | ❌ |

---

## 🚀 Usage Examples

### Postman Setup for CSV Ingestion

1. **Set Method to POST**
2. **Set URL:** `http://localhost:5000/api/data/premiums/bulk`
3. **Set Headers:** `Content-Type: application/json`
4. **Set Body (raw JSON):**
```json
{
  "premiums": [
    // Your CSV data converted to JSON array
  ]
}
```

### Converting CSV to JSON for Postman

If you have a CSV file, you can:
1. Use online CSV to JSON converters
2. Use Excel/Google Sheets to export as JSON
3. Use programming tools to convert CSV to the required JSON format

### Error Handling

The API will:
- Continue processing even if some records fail (ordered: false)
- Return the count of successfully inserted records
- Log detailed errors for debugging
- Handle missing or malformed data gracefully

---

## 🔧 Technical Details

### Database Indexes
- Premium: `{ plan_id: 1, rating_area_id: 1, effective_date: 1 }`
- Zip County Map: `{ zip_code_id: 1, county_id: 1 }`
- Plan County Map: `{ plan_id: 1, county_id: 1 }`

### Data Processing
- Automatic type conversion (string to number/boolean)
- Flexible column name mapping
- Nested object creation for complex data
- Default value handling

### Performance
- Bulk insert operations for efficiency
- Indexed queries for fast retrieval
- Unordered inserts to handle large datasets
- Memory-efficient processing 