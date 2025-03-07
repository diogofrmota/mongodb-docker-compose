# MongoDB Replica Set Deployment Guide

This repository provides configurations for deploying a MongoDB Replica Set both **locally** using Docker Compose and on a **server** setup with multiple hosts.

## 1. Prerequisites

- **Local Setup:** Requires Docker, Docker Compose, and OpenSSL (for keyfile generation).
- **Server Setup:** Requires Docker, Docker Compose, SSH access to all nodes, and firewall configurations.

## 2. Local Deployment

To deploy the MongoDB replica set locally:

### 2.1 Clone the Repository
```sh
git clone <repository-url>
cd <repository-folder>/local
```

### 2.2 Generate the Keyfile
```sh
mkdir -p ./data/shared
openssl rand -base64 756 > ./data/shared/keyfile.key
chmod 400 ./data/shared/keyfile.key
```

### 2.3 Start the Containers
```sh
docker compose -f docker-compose-mongo1.yml up -d
docker compose -f docker-compose-mongo2.yml up -d
docker compose -f docker-compose-mongo3.yml up -d
```

### 2.4 Initialize the Replica Set
```sh
docker exec -it mongo-1-container mongosh -u admin -p admin123 --eval "$(cat initReplicaSet.js)"
```

### 2.5 Verify the Replica Set
```sh
docker exec -it mongo-1-container mongosh -u admin -p admin123 --eval "rs.status()"
```

For more details, see the **local/README.md** file.

---

## 3. Server Deployment

To deploy on multiple remote servers:

### 3.1 Set Up Environment
Ensure Docker and Docker Compose are installed on all servers.

### 3.2 Generate and Copy the Keyfile
On **Mongo 1**:
```sh
openssl rand -base64 756 > /data/shared/keyfile.key
chmod 400 /data/shared/keyfile.key
chown 999:999 /data/shared/keyfile.key
scp /data/shared/keyfile.key user@HOST_IP_2:/data/shared/keyfile.key
scp /data/shared/keyfile.key user@HOST_IP_3:/data/shared/keyfile.key
```
On **Mongo 2 and 3**:
```sh
chmod 400 /data/shared/keyfile.key
chown 999:999 /data/shared/keyfile.key
```

### 3.3 Start MongoDB Containers
On each server:
```sh
docker compose -f docker-compose-mongoX.yml up -d  # X = 1, 2, 3
```

### 3.4 Initialize the Replica Set
On **Mongo 1**:
```sh
docker exec -it mongo-1-container mongosh -u admin -p admin123 --eval "$(cat initReplicaSet.js)"
```

### 3.5 Verify the Replica Set
```sh
docker exec -it mongo-1-container mongosh -u admin -p admin123 --eval "rs.status()"
```

For more details, see the **server/README.md** file.

---

## 4. Additional Notes

### Firewall Configuration
Ensure port `27017` is open for communication between the servers.

### MongoDB Networking
- **Local:** Containers communicate via `localhost:27017`, `localhost:27018`, and `localhost:27019`.
- **Server:** Containers communicate via `HOST_IP_1:27017`, `HOST_IP_2:27017`, and `HOST_IP_3:27017` using `network_mode: host`.

### Debugging
Check container logs with:
```sh
docker logs <container-name>
```

