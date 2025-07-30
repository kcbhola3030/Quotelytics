# Quotelytics Backend API

This backend provides endpoints to interact with the Ideon API for creating and managing groups and members, including ICHRA affordability calculations.

## Base URL

```
http://localhost:5000/api
```

---

## Routes

### Group Management

#### 1. Create Group
- **Endpoint:** `POST /groups`
- **Description:** Creates a new group (company: Krishna LLC) and returns the group and its location.
- **Request Body:** _None_
- **Response Example:**
```json
{
  "group": { /* group object */ },
  "location": { /* location object */ },
  "mongoId": "507f1f77bcf86cd799439011"
}
```

#### 2. Get Group
- **Endpoint:** `GET /groups/:id`
- **Description:** Retrieves a specific group by ID from Ideon API.
- **Response Example:**
```json
{
  "group": { /* group object */ },
  "locations": [ /* location objects */ ]
}
```

#### 3. Get All Groups (MongoDB)
- **Endpoint:** `GET /groups`
- **Description:** Retrieves all groups stored in MongoDB.
- **Response Example:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "group_id": "d1b26257c2",
    "company_name": "Krishna LLC",
    "locations": [...],
    "ichra_affordability_results": {...}
  }
]
```

#### 4. Get Group by MongoDB ID
- **Endpoint:** `GET /groups/mongo/:id`
- **Description:** Retrieves a specific group by MongoDB ID.
- **Response Example:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "group_id": "d1b26257c2",
  "company_name": "Krishna LLC",
  "locations": [...],
  "ichra_affordability_results": {...}
}
```

#### 5. Update Group
- **Endpoint:** `PUT /groups/:id`
- **Description:** Updates a group in MongoDB.
- **Request Body:** Group object fields to update
- **Response:** Updated group object

#### 6. Delete Group
- **Endpoint:** `DELETE /groups/:id`
- **Description:** Deletes a group from MongoDB.
- **Response:** `{ "message": "Group deleted" }`

### Member Management

#### 7. Add Member to Group
- **Endpoint:** `POST /groups/:groupId/members`
- **Description:** Adds a new member (name: anuja) to the specified group and location.
- **Request Body:**
```json
{
  "location": { /* location object as returned from group creation */ }
}
```
- **Response Example:**
```json
{
  "member": { /* member object */ },
  "mongoId": "507f1f77bcf86cd799439012"
}
```

#### 8. Get Members in Group
- **Endpoint:** `GET /groups/:groupId/members`
- **Description:** Retrieves all members in a specific group from Ideon API.
- **Response Example:**
```json
{
  "members": [ /* member objects */ ]
}
```

#### 9. Delete Members from Group
- **Endpoint:** `DELETE /groups/:groupId/members`
- **Description:** Removes all members from a specific group (both Ideon API and MongoDB).
- **Response:** `{ "message": "Members deleted successfully" }`

#### 10. Get All Members (MongoDB)
- **Endpoint:** `GET /members`
- **Description:** Retrieves all members stored in MongoDB.
- **Response:** Array of member objects

#### 11. Get Member by MongoDB ID
- **Endpoint:** `GET /members/:id`
- **Description:** Retrieves a specific member by MongoDB ID.
- **Response:** Member object

#### 12. Update Member
- **Endpoint:** `PUT /members/:id`
- **Description:** Updates a member in MongoDB.
- **Request Body:** Member object fields to update
- **Response:** Updated member object

#### 13. Delete Member
- **Endpoint:** `DELETE /members/:id`
- **Description:** Deletes a member from MongoDB.
- **Response:** `{ "message": "Member deleted" }`

---

## ICHRA Affordability Calculations

### 14. Calculate ICHRA Affordability
- **Endpoint:** `POST /ichra/calculate`
- **Description:** Calculates ICHRA affordability for a group and location using Ideon API and stores results in MongoDB.
- **Request Body:**
```json
{
  "groupId": "d1b26257c2",
  "locationId": "c512743b3d",
  "householdIncome": 60000,
  "householdSize": 3
}
```
- **Response Example:**
```json
{
  "affordability": {
    "affordable_contribution": 450.00,
    "maximum_contribution": 500.00,
    "affordability_percentage": 0.75
  },
  "stored": true,
  "group_id": "d1b26257c2",
  "location_id": "c512743b3d"
}
```

### 15. Get ICHRA Results for Group
- **Endpoint:** `GET /ichra/results/:groupId`
- **Description:** Retrieves ICHRA affordability results for a specific group from MongoDB.
- **Response Example:**
```json
{
  "group_id": "d1b26257c2",
  "affordability_results": {
    "affordable_contribution": 450.00,
    "maximum_contribution": 500.00,
    "affordability_percentage": 0.75,
    "calculated_at": "2024-01-15T10:30:00.000Z",
    "household_income": 60000,
    "household_size": 3,
    "location_id": "c512743b3d"
  }
}
```

### 16. Get All ICHRA Results
- **Endpoint:** `GET /ichra/results`
- **Description:** Retrieves all groups with ICHRA affordability results from MongoDB.
- **Response Example:**
```json
{
  "groups": [
    {
      "group_id": "d1b26257c2",
      "company_name": "Krishna LLC",
      "affordability_results": {
        "affordable_contribution": 450.00,
        "maximum_contribution": 500.00,
        "affordability_percentage": 0.75,
        "calculated_at": "2024-01-15T10:30:00.000Z"
      }
    }
  ]
}
```

---

## Example Usage

### ICHRA Affordability Workflow:

1. **Create a group:**
   ```bash
   POST /api/groups
   ```

2. **Add a member to the group:**
   ```bash
   POST /api/groups/{groupId}/members
   Body: { "location": { /* location object */ } }
   ```

3. **Calculate ICHRA affordability:**
   ```bash
   POST /api/ichra/calculate
   Body: {
     "groupId": "d1b26257c2",
     "locationId": "c512743b3d",
     "householdIncome": 60000,
     "householdSize": 3
   }
   ```

4. **Get ICHRA results:**
   ```bash
   GET /api/ichra/results/d1b26257c2
   ```

5. **View all ICHRA calculations:**
   ```bash
   GET /api/ichra/results
   ```

---

## Notes
- All endpoints return JSON.
- Error responses will be in the form `{ "error": "..." }`.
- ICHRA calculations are automatically stored in MongoDB for future reference.
- The backend integrates with both Ideon API and MongoDB for comprehensive data management.
- All timestamps are in ISO format. 