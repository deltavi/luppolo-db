# ![luppoloDB](docs/luppolo.png) LuppoloDB
In-memory Key-Value store.

## Table of Contents

<!-- toc -->

- [HTTP API](#http-api)
  * [PUT](#put)
  * [GET](#get)
  * [DELETE](#delete)
  * [GET DB KEYS](#get-db-keys)
  * [COUNT DB KEYS](#count-db-keys)
  * [GET ALL DB NAMES](#get-all-db-names)
  * [GET ALL DBS DATA](#get-all-dbs-data)
  * [SEARCH BY JSONPATH](#search-by-jsonpath)
  * [SEARCH BY JSONPATH (NODES)](#search-by-jsonpath-nodes)
  * [NUMERIC INCREMENT](#numeric-increment)

<!-- tocstop -->

## HTTP API

### PUT
Store or update a value in storage.

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
Retrieve a value from storage.

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
Removes a value from storage.

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
Retrieve a DB keys from storage.

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

### GET ALL DB NAMES
`GET http://localhost:3003/_dbs?_names`

**Result:**
```json
{
    "result": "found",
    "db": "_all",
    "names": [
        "db1"
    ],
    "total": 1
}
```

### GET ALL DBS DATA
`GET http://localhost:3003/_dbs`

**Result:**
```json
{
    "result": "found",
    "db": "_all",
    "value": {
        "db1": {
            "1": {
                "value": {
                    "boolean": true,
                    "number": 123,
                    "string": "text",
                    "array": [
                        "123",
                        "456"
                    ]
                },
                "lastUpdate": "2018-07-14T09:01:01.748Z"
            }
        }
    }
}
```

### SEARCH BY JSONPATH
It allows to search in the selected DB using [jsonpath](https://github.com/dchester/jsonpath).

`POST http://localhost:3003/db1/_search`

Body:
```json
{
    "jpath" : "$..array"
}
```

**Result:**
```json
{
    "result": "found",
    "db": "db1",
    "hits": [
        [
            "123",
            "456"
        ]
    ],
    "total": 1
}
```

### SEARCH BY JSONPATH (NODES)
It allows to search in the selected DB using [jsonpath](https://github.com/dchester/jsonpath), returning path and value of the nodes found.

`POST http://localhost:3003/db1/_search`

Body:
```json
{
    "jpath-nodes" : "$..array[?(@>200)]"
}
```

**Result:**
```json
{
    "result": "found",
    "db": "db1",
    "hits": [
        {
            "path": ["$", "1", "value", "array", 1],
            "value": "456"
        }
    ],
    "total": 1
}
```

### NUMERIC INCREMENT
Increments the number stored at key by one.
    
`PUT http://localhost:3003/db1/1/_increment`

**Result:**
```json
{
    "result": "created",
    "db": "db1",
    "key": "1",
    "value": 1
}
```

**or**
```json
{
    "result": "updated",
    "db": "db1",
    "key": "1",
    "value": 2
}
```

**or**
```json
{
    "result": "error",
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
    "message": "Value is NaN."
}
```