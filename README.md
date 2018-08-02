# ![luppoloDB](docs/luppolo.png) LuppoloDB [![Build Status](https://travis-ci.org/deltavi/luppolo-db.svg?branch=master)](https://travis-ci.org/deltavi/luppolo-db)

In-memory Key-Value store.

## Table of Contents

<!-- toc -->

- [HTTP API](#http-api)
  * [PUT](#put)
  * [GET](#get)
  * [DELETE DB](#delete-db)
  * [DELETE](#delete)
  * [GET DB KEYS](#get-db-keys)
  * [COUNT DB KEYS](#count-db-keys)
  * [GET ALL DB NAMES](#get-all-db-names)
  * [GET ALL DBS DATA](#get-all-dbs-data)
  * [PERSIST ALL DBS DATA](#persist-all-dbs-data)
  * [RESTORE ALL DBS DATA](#restore-all-dbs-data)
  * [SEARCH BY JSONPATH](#search-by-jsonpath)
  * [SEARCH BY JSONPATH (NODES)](#search-by-jsonpath-nodes)
  * [NUMERIC INCREMENT](#numeric-increment)
- [API](#api)

<!-- tocstop -->

## HTTP API

### PUT

Store or update a value in storage.

`PUT http://localhost:3003/luppolo/db/db1/1`

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

`GET http://localhost:3003/luppolo/db/db1/1`

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

### DELETE DB

Removes a DB from storage.

`DELETE http://localhost:3003/luppolo/db/db1`

**Result:**

```json
{
    "result": "deleted",
    "db": "db1"
}
```

**or**

```json
{
    "result": "unknown",
    "db": "db1"
}
```

### DELETE

Removes a value from storage.

`DELETE http://localhost:3003/luppolo/db/db1/1`

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

`GET http://localhost:3003/luppolo/db/db1`

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

`GET http://localhost:3003/luppolo/db/db1?_count`

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

`GET http://localhost:3003/luppolo/dbs`

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

`GET http://localhost:3003/luppolo/dbs?_export`

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

### PERSIST ALL DBS DATA

`GET http://localhost:3003/luppolo/dbs?_persist`

**Result:**

```json
{
  "result": "saved",
  "db": "_all"
}
```

**or**

```json
{
  "result": "error",
  "db": "_all",
  "error": {
    "errno": -4048,
    "code": "EPERM",
    "syscall": "open",
    "path": "/luppolo-db/dump/dbs.json"
  }
}
```

### RESTORE ALL DBS DATA

`GET http://localhost:3003/luppolo/dbs?_restore`

**Result:**

```json
{
  "result": "restored",
  "db": "_all"
}
```

**or**

```json
{
  "result": "error",
  "db": "_all",
  "error": {
    "errno": -4058,
    "code": "ENOENT",
    "syscall": "open",
    "path": "/luppolo-db/dump/dbs.json"
  }
}
```

### SEARCH BY JSONPATH

It allows to search in the selected DB using [jsonpath](https://github.com/dchester/jsonpath).

`POST http://localhost:3003/luppolo/db/db1/_search`

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

`POST http://localhost:3003/luppolo/db/db1/_search`

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

Increments or decrement the number stored at key by incNumber.

`PUT http://localhost:3003/luppolo/db/db1/1/_increment`

`PUT http://localhost:3003/luppolo/db/db1/1/_increment/100`

`PUT http://localhost:3003/luppolo/db/db1/1/_increment/-10`

**/{db}/{key}/\_increment/{incNumber?}**

| Param     | Description      | Default |
| --------- | ---------------- | ------- |
| db        | DB name          |         |
| key       | Key              |         |
| incNumber | Increment number | +1      |

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
    "message": "value is NaN."
}
```

**or**

```json
{
    "result": "error",
    "db": "db1",
    "key": "1",
    "value": 8,
    "message": "incNumber is NaN."
}
```

### <b style="background-color: deepskyblue; color:white; padding:0 5px; border-radius: 5px;">GET</b> test
