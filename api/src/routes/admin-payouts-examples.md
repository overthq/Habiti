# Admin Payouts API Examples

## Endpoints

### GET /admin/payouts
Get all payouts with filtering and sorting options.

#### Filter Examples

**Filter by status:**
```
GET /admin/payouts?status[equals]=Pending
GET /admin/payouts?status[equals]=Success
GET /admin/payouts?status[equals]=Failure
```

**Filter by store:**
```
GET /admin/payouts?storeId[equals]=store-uuid-here
```

**Filter by amount range:**
```
GET /admin/payouts?amount[gte]=10000&amount[lte]=100000
GET /admin/payouts?amount[gt]=50000
```

**Filter by date range:**
```
GET /admin/payouts?createdAt[gte]=2024-01-01&createdAt[lte]=2024-12-31
```

**Combined filters:**
```
GET /admin/payouts?status[equals]=Pending&amount[gte]=10000&orderBy[createdAt]=desc
```

#### Sort Examples

**Sort by creation date (newest first):**
```
GET /admin/payouts?orderBy[createdAt]=desc
```

**Sort by amount (highest first):**
```
GET /admin/payouts?orderBy[amount]=desc
```

**Multiple sort criteria:**
```
GET /admin/payouts?orderBy[status]=asc&orderBy[createdAt]=desc
```

### GET /admin/payouts/:id
Get a specific payout by ID with detailed store information.

### PATCH /admin/payouts/:id
Update a payout's status.

**Request body:**
```json
{
  "status": "Success" | "Pending" | "Failure"
}
```

## Response Format

### List Response
```json
{
  "payouts": [
    {
      "id": "payout-uuid",
      "storeId": "store-uuid",
      "amount": 50000,
      "status": "Pending",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "store": {
        "id": "store-uuid",
        "name": "Store Name",
        "description": "Store description",
        "unlisted": false
      }
    }
  ]
}
```

### Single Payout Response
```json
{
  "payout": {
    "id": "payout-uuid",
    "storeId": "store-uuid", 
    "amount": 50000,
    "status": "Pending",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "store": {
      "id": "store-uuid",
      "name": "Store Name",
      "description": "Store description",
      "unlisted": false,
      "bankAccountNumber": "1234567890",
      "bankCode": "058"
    }
  }
}
```