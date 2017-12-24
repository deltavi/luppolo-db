# LuppoloDB
In-memory Key-Value store.

## PUT
`PUT http://localhost:3003/db1/1`

Value:
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

## GET
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

## DELETE
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