# Postman API Guide

## Base Configuration

**Base URL:** `http://localhost:3000/api`

All endpoints are prefixed with `/api` as configured in `main.ts`.

---

## Authentication Flow

Most endpoints require JWT authentication. Follow these steps:

### Step 1: Register a User (Optional - if you don't have one)

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/register`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "email": "test@example.com",
    "username": "testuser",
    "password": "Password123",
    "firstName": "Test",
    "lastName": "User",
    "age": 25
  }
  ```

**Response:** You'll receive `accessToken` and `refreshToken`

### Step 2: Login

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/login`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "email": "test@example.com",
    "password": "Password123"
  }
  ```

**Response:**
```json
{
  "user": { ... },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "abc123...",
  "accessTokenExpiresIn": "15m",
  "refreshTokenExpiresAt": "2024-01-15T10:30:00.000Z"
}
```

### Step 3: Use Access Token for Authenticated Requests

Copy the `accessToken` from the login response and add it to all subsequent requests:

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

---

## Endpoints

### 1. Sessions (`/api/sessions`)

All endpoints require `Authorization: Bearer <token>` header.

#### Create Session
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/sessions`
- **Headers:**
  ```
  Authorization: Bearer <your-access-token>
  Content-Type: application/json
  ```
- **Body:**
  ```json
  {
    "sessionType": "baseline",
    "createdAt": "2024-01-15T10:30:00Z",
    "endedAt": "2024-01-15T10:50:00Z",
    "durationSeconds": 1200.0
  }
  ```
  Or for focus_aid:
  ```json
  {
    "sessionType": "focus_aid",
    "createdAt": "2024-01-15T14:00:00Z",
    "endedAt": "2024-01-15T14:25:00Z",
    "durationSeconds": 1500.0
  }
  ```

#### Get All Sessions
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/sessions`
- **Query Parameters (optional):**
  - `type=baseline` or `type=focus_aid` to filter by session type
- **Example:** `http://localhost:3000/api/sessions?type=baseline`

#### Get Session by ID
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/sessions/{sessionId}`
- **Example:** `http://localhost:3000/api/sessions/a1b2c3d4-e5f6-7890-abcd-ef1234567890`

#### Update Session
- **Method:** `PATCH`
- **URL:** `http://localhost:3000/api/sessions/{sessionId}`
- **Body:**
  ```json
  {
    "endedAt": "2024-01-15T11:00:00Z",
    "durationSeconds": 1800.0
  }
  ```

#### Delete Session
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/api/sessions/{sessionId}`

---

### 2. Signal Data (`/api/signal-data`)

#### Create Single Signal Data Point
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/signal-data`
- **Body:**
  ```json
  {
    "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "channel": 1,
    "timestamp": 1705315800000,
    "signalValue": 0.234567
  }
  ```

#### Create Batch Signal Data
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/signal-data/batch`
- **Body:**
  ```json
  {
    "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "channel": 1,
    "data": [
      {
        "timestamp": 1705315800000,
        "signalValue": 0.234567
      },
      {
        "timestamp": 1705315800040,
        "signalValue": 0.245123
      }
    ]
  }
  ```

#### Get Signal Data for Session
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/signal-data/session/{sessionId}`
- **Query Parameters (all optional):**
  - `channel=1` or `channel=2` - Filter by channel
  - `startTime=1705315800000` - Unix timestamp in milliseconds
  - `endTime=1705317000000` - Unix timestamp in milliseconds
  - `limit=1000` - Limit number of results
- **Example:** `http://localhost:3000/api/signal-data/session/a1b2c3d4-e5f6-7890-abcd-ef1234567890?channel=1&limit=100`

#### Delete Signal Data for Session
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/api/signal-data/session/{sessionId}`

---

### 3. Focus Aid (`/api/focus-aid`)

#### Create Focus Aid Session
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/focus-aid/sessions`
- **Body:**
  ```json
  {
    "sessionId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "difficultyLevel": 3,
    "preSessionInfo": {
      "user_mood": "calm",
      "sleep_hours": 7.5,
      "caffeine_intake": 1,
      "task_type": "studying"
    },
    "postSessionFeedback": {
      "satisfaction": 4,
      "difficulty_perceived": 3,
      "focus_improvement": true,
      "notes": "Felt more focused after 10 minutes"
    }
  }
  ```

#### Get Focus Aid Session
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/focus-aid/sessions/{sessionId}`

#### Update Focus Aid Session
- **Method:** `PATCH`
- **URL:** `http://localhost:3000/api/focus-aid/sessions/{sessionId}`
- **Body:**
  ```json
  {
    "difficultyLevel": 4,
    "postSessionFeedback": {
      "satisfaction": 5,
      "notes": "Updated feedback"
    }
  }
  ```

#### Create Attention Score
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/focus-aid/attention-scores`
- **Body:**
  ```json
  {
    "sessionId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "timestamp": 1705327200000,
    "attentionScore": 0.85,
    "isFocused": true
  }
  ```

#### Create Batch Attention Scores
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/focus-aid/attention-scores/batch`
- **Body:**
  ```json
  {
    "sessionId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "scores": [
      {
        "timestamp": 1705327200000,
        "attentionScore": 0.85,
        "isFocused": true
      },
      {
        "timestamp": 1705327201000,
        "attentionScore": 0.82,
        "isFocused": true
      }
    ]
  }
  ```

#### Get Attention Scores
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/focus-aid/attention-scores/{sessionId}`
- **Query Parameters (optional):**
  - `startTime=1705327200000` - Unix timestamp in milliseconds
  - `endTime=1705328700000` - Unix timestamp in milliseconds
- **Example:** `http://localhost:3000/api/focus-aid/attention-scores/b2c3d4e5-f6a7-8901-bcde-f12345678901?startTime=1705327200000`

#### Create Vibration Event
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/focus-aid/vibrations`
- **Body:**
  ```json
  {
    "sessionId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "timestamp": 1705327203000
  }
  ```

#### Create Batch Vibrations
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/focus-aid/vibrations/batch`
- **Body:**
  ```json
  {
    "sessionId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "timestamps": [
      1705327203000,
      1705327250000,
      1705327300000
    ]
  }
  ```

#### Get Vibrations
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/focus-aid/vibrations/{sessionId}`

---

### 4. Baseline (`/api/baseline`)

**Note:** Baseline endpoints currently have authentication commented out, but you should still include the token for consistency.

#### Create Baseline Session
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/baseline/sessions`
- **Body:**
  ```json
  {
    "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "focusedStartTime": 1705315800000,
    "focusedEndTime": 1705316400000,
    "relaxedStartTime": 1705316400000,
    "relaxedEndTime": 1705317000000
  }
  ```

#### Get Baseline Session
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/baseline/sessions/{sessionId}`

#### Update Baseline Session
- **Method:** `PATCH`
- **URL:** `http://localhost:3000/api/baseline/sessions/{sessionId}`
- **Body:**
  ```json
  {
    "focusedEndTime": 1705316500000
  }
  ```

#### Create Frequency Band
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/baseline/frequency-bands`
- **Body:**
  ```json
  {
    "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "bandName": "phi",
    "freqStart": 8.5,
    "freqEnd": 12.5,
    "powerAvg": 0.045623,
    "powerSign": 1
  }
  ```
  Valid `bandName` values: `"phi"`, `"chi"`, `"psi"`  
  Valid `powerSign` values: `-1`, `0`, `1`

#### Create Batch Frequency Bands
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/baseline/frequency-bands/batch`
- **Body:**
  ```json
  {
    "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "bands": [
      {
        "bandName": "phi",
        "freqStart": 8.5,
        "freqEnd": 12.5,
        "powerAvg": 0.045623,
        "powerSign": 1
      },
      {
        "bandName": "chi",
        "freqStart": 12.5,
        "freqEnd": 18.0,
        "powerAvg": 0.032145,
        "powerSign": 1
      },
      {
        "bandName": "psi",
        "freqStart": 4.0,
        "freqEnd": 8.0,
        "powerAvg": 0.028901,
        "powerSign": -1
      }
    ]
  }
  ```

#### Get Frequency Bands
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/baseline/frequency-bands/{sessionId}`

---

## Postman Setup Tips

### 1. Create Environment Variables

Create a Postman Environment with:
- `base_url`: `http://localhost:3000/api`
- `access_token`: (will be set after login)
- `refresh_token`: (will be set after login)

### 2. Set Up Pre-request Script for Auth

For authenticated endpoints, add this to the **Pre-request Script** tab:
```javascript
pm.request.headers.add({
    key: 'Authorization',
    value: 'Bearer ' + pm.environment.get('access_token')
});
```

### 3. Auto-save Tokens After Login

Add this to the **Tests** tab of your login request:
```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("access_token", jsonData.accessToken);
    pm.environment.set("refresh_token", jsonData.refreshToken);
}
```

### 4. Use Variables in URLs

Instead of hardcoding URLs, use:
- `{{base_url}}/sessions`
- `{{base_url}}/sessions/{{sessionId}}`

---

## Common Issues

1. **401 Unauthorized**: Make sure you've logged in and the access token is included in the Authorization header
2. **400 Bad Request**: Check that your JSON body matches the DTO requirements (required fields, data types)
3. **404 Not Found**: Verify the session ID exists before creating related records
4. **Validation Errors**: Check the response body for specific field validation errors

---

## Example Workflow

1. **Register/Login** → Get `accessToken`
2. **Create Session** → Get `sessionId`
3. **Create Session Details** (baseline or focus_aid) → Use `sessionId`
4. **Add Signal Data** → Use `sessionId`
5. **Add Related Data** (attention scores, vibrations, frequency bands) → Use `sessionId`





