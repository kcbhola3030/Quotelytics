# Quotelytics Backend API

This backend provides endpoints to interact with the Ideon API for creating and managing groups and members.

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
  "location": { /* location object */ }
}
```

#### 2. Get Group
- **Endpoint:** `GET /groups/:id`
- **Description:** Retrieves a specific group by ID.
- **Response Example:**
```json
{
  "group": { /* group object */ },
  "locations": [ /* location objects */ ]
}
```

### Member Management

#### 3. Add Member to Group
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
  "member": { /* member object */ }
}
```

#### 4. Get Members in Group
- **Endpoint:** `GET /groups/:groupId/members`
- **Description:** Retrieves all members in a specific group.
- **Response Example:**
```json
{
  "members": [ /* member objects */ ]
}
```

#### 5. Delete Members from Group
- **Endpoint:** `DELETE /groups/:groupId/members`
- **Description:** Removes all members from a specific group.
- **Response Example:**
```json
{
  "message": "Members deleted successfully"
}
```

---

## Example Usage

1. **Create a group:**
   - `POST /api/groups`
   - No body required.
   - Response will include `group` and `location`.

2. **Get a group:**
   - `GET /api/groups/{groupId}`
   - Returns group details and locations.

3. **Add a member to a group:**
   - `POST /api/groups/{groupId}/members`
   - Body must include `location` from the previous response.
   - Response will include `member`.

4. **Get all members in a group:**
   - `GET /api/groups/{groupId}/members`
   - Returns all members in the group.

5. **Delete all members from a group:**
   - `DELETE /api/groups/{groupId}/members`
   - Removes all members from the group.

---

## Notes
- All endpoints return JSON.
- Error responses will be in the form `{ "error": "..." }`.
- The backend is designed to be modular and easy to extend. 