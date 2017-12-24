# LuppoloDB
In-memory Key-Value store.

## HTTP API

### PUT
`PUT http://localhost:3003/db1/1`

Body:
```json
{
    "boolean": true,
    "number": 123,
    "string": "text",
    "array": [
        "123",
        "456"
    ]
}
```
**Result:**
```json
{
    "result": "created",
    "db": "db1",
    "key": "1"
}
```
**or**
```json
{
    "result": "updated",
    "db": "db1",
    "key": "1"
}
```

### GET
`GET http://localhost:3003/db1/1`

**Result:**
```json
{
    "result": "found",
    "db": "db1",
    "key": "1",
    "value": {
        "boolean": true,
        "number": 123,
        "string": "text",
        "array": [
            "123",
            "456"
        ]
    },
    "lastUpdate": "2017-12-23T23:52:11.445Z"
}
```
**or**
```json
{
    "result": "unknown",
    "db": "db1",
    "key": "1"
}
```

### DELETE
`DELETE http://localhost:3003/db1/1`

**Result:**
```json
{
    "result": "deleted",
    "db": "db1",
    "key": "1",
    "value": {
        "boolean": true,
        "number": 123,
        "string": "text",
        "array": [
            "123",
            "456"
        ]
    },
    "lastUpdate": "2017-12-23T23:56:38.310Z"
}
```
**or**
```json
{
    "result": "unknown",
    "db": "db1",
    "key": "1"
}
```

### GET DB KEYS
`GET http://localhost:3003/db1`

**Result:**
```json
{
    "result": "found",
    "db": "db1",
    "keys": [
        "1"
    ],
    "total": 1
}
```
**or**
```json
{
    "result": "unknown",
    "db": "db1",
    "total": 0,
    "keys": []
}
```

### COUNT DB KEYS
`GET http://localhost:3003/db1?_count`

**Result:**
```json
{
    "result": "found",
    "db": "db1",
    "total": 1
}
```
**or**
```json
{
    "result": "unknown",
    "db": "db1",
    "total": 0
}
```