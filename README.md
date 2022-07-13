# HotTakes - projet6 
## Prerequisites
You will need to have Node and npm installed locally on your machine.

# Installation 
Clone this repo.

## Frontend 

Open a terminal in frontend folder

```
npm i


npm run start
```

## Backend

Open a terminal in backend folder

```
npm i

mkdir images

echo  > ".env"
```

now open the .env file and  paste the following 
```
# MONGODB
MONGODB_USER = ""
MONGODB_PASSWORD = ""
MONGODB_CLUSTER_NAME = ""
MONGODB_DATABASE_NAME = ""



#JSONWEBTOKEN
TOKEN="abcd"
```
Add your own MongoDB user id, password, cluster and database.
You can also modify the Token.

Finaly run

```
node server
```
