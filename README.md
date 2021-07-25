# Data Lake API

Data Lake API App

# Initial Setup

modify config.json file on ./config/config.js
```
{
    "sql": {
        "host": "localhost",
        "user": "root",
        "password": "123456",
        "database": "data_lake"
    },
    "app": {
        "port: 4000
    }
}
```

# Commands for Data Lake

### Install the dependencies
```bash
npm install
```
### To Run Unit Test
```bash
npm test
```
### To Run Data lake server
```bash
npm start
```
### To Run Data Lake Server in Debug mode
```bash
set DEBUG=data-lake:* & npm start
```

