# Quotelytics Backend API

This backend provides endpoints to interact with the Ideon API for creating and managing groups and 
members, including ICHRA affordability calculations.

## 🚀 Getting Started

### 1. Clone the repository and navigate to the backend folder:
```bash
cd backend
```
### 2. Install dependencies:
bash
```bash
npm install
```
### 3. Inside src/ .env
Inside src/, create a .env file and add the following variables
```bash
PORT=4000
MONGO_URI=mongodb+srv://kcbhola123:<password>@cluster0.mongodb.net/your-db-name
IDEON_API_KEY=your_ideon_api_key
password:kc123
```

###  4.  Start the server:
```bash
npm start
```
The server will run on http://localhost:4000.



## Base URL

```
http://localhost:5000/api
```

## 📂 `routes/`

### 1. **`county.js`**
Handles county-level data ingestion from a CSV file.

- **POST** `/upload/counties`  
  Uploads a `counties.csv` file using `multer`.  
  **Controller**: `countyCtrl.uploadCounties`

---

### 2. **`dataIngestionRoute.js`**
Handles bulk data uploads for multiple data sources used in the application.

- **POST** `/upload/zip-counties`  
  Uploads `zip_counties.csv`  
  **Controller**: `zipCountyCtrl.uploadZipCountyMap`

- **GET** `/zip`  
  Retrieves zip-related data.  
  **Controller**: `zipCountyCtrl.zip`

- **POST** `/upload/counties`  
  Uploads `counties.csv`  
  **Controller**: `countyCtrl.uploadCounties`

- **POST** `/upload/plan-counties`  
  Uploads `plan_counties.csv`  
  **Controller**: `planCountyCtrl.uploadPlanCounties`

- **POST** `/upload/plans`  
  Uploads `plans.csv`  
  **Controller**: `planCtrl.uploadPlans`

- **POST** `/upload/premiums`  
  Uploads `premiums.csv`  
  **Controller**: `premiumCtrl.uploadPremiums`

---

### 3. **`offMarket.js`**
Handles off-market premium calculation for a specific member.

- **POST** `/calculate/:memberId`  
  Triggers off-market premium calculations for the specified member by MongoDB `_id`.  
  **Controller**: `offMarketCtrl.calculateOffMarketPremiums`

---

### 4. **`groupAndMemberManagementRoute.js`**
Contains routes for managing groups and members via both Ideon API and MongoDB CRUD operations.

#### Group Routes

- **POST** `/groups`  
  Create a new group (Ideon API).  
  **Controller**: `createGroup`

- **GET** `/groups/:id`  
  Get group details (Ideon API).  
  **Controller**: `getGroup`

- **GET** `/groups`  
  List all groups from MongoDB.  
  **Controller**: `getGroups`

- **GET** `/groups/mongo/:id`  
  Get MongoDB-stored group by ID.  
  **Controller**: `getGroupById`

- **PUT** `/groups/:id`  
  Update a group.  
  **Controller**: `updateGroup`

- **DELETE** `/groups/:id`  
  Delete a group.  
  **Controller**: `deleteGroup`

#### Member Routes

- **POST** `/groups/:groupId/members`  
  Add a member to a group (Ideon API).  
  **Controller**: `createMember`

- **GET** `/groups/:groupId/members`  
  List members of a group (Ideon API).  
  **Controller**: `getMembers`

- **DELETE** `/groups/:groupId/members`  
  Delete all members from a group (Ideon API).  
  **Controller**: `deleteMembers`

- **GET** `/members`  
  Get all members from MongoDB.  
  **Controller**: `getAllMembers`

- **GET** `/members/:id`  
  Get member by MongoDB `_id`.  
  **Controller**: `getMemberById`

- **PUT** `/members/:id`  
  Update a member.  
  **Controller**: `updateMember`

- **DELETE** `/members/:id`  
  Delete a member.  
  **Controller**: `deleteMember`

---

### 5. **`ichraRoutes.js`**
Manages ICHRA affordability calculations and retrievals.

- **POST** `/groups/:groupId/calculations`  
  Create a new ICHRA affordability calculation for a group.  
  **Controller**: `createICHRAffordabilityCalculation`

- **GET** `/members/:ichra_id`  
  Get affordability data for members in a specific ICHRA calculation.  
  **Controller**: `getICHRAffordabilityMembersById`


---