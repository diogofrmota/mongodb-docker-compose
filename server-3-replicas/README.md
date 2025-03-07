# MongoDB Replica Set Deployment Guide

## Server IPs
- **Mongo 1:** HOST_IP_1
- **Mongo 2:** HOST_IP_2
- **Mongo 3:** HOST_IP_3

## 1. Prerequisites

Ensure the following prerequisites are met on all three servers:

### 1.1 Install Docker and Docker Compose
```sh
sudo apt update && sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### 1.2 Create the `/data/shared/` Directory
On Mongo 2 and Mongo 3:
```sh
sudo mkdir -p /data/shared/
```

## 2. Set Up MongoDB on Mongo 1

### 2.1 Generate the Keyfile
```sh
openssl rand -base64 756 > /data/shared/keyfile.key
sudo chmod 400 /data/shared/keyfile.key
sudo chown 999:999 /data/shared/keyfile.key
```

### 2.2 Create the Docker Compose File
Create `docker-compose-mongo1.yml` on Mongo 1.

### 2.3 Start MongoDB on Mongo 1
```sh
docker compose -f docker-compose-mongo1.yml up -d
```
Check logs:
```sh
docker logs mongo-1-container
```

## 3. Copy the Keyfile to Mongo 2 and Mongo 3

### 3.1 Copy the Keyfile
On Mongo 1:
```sh
scp /data/shared/keyfile.key user@HOST_IP_2:/data/shared/keyfile.key
scp /data/shared/keyfile.key user@HOST_IP_3:/data/shared/keyfile.key
```

### 3.2 Set Permissions on Mongo 2 and Mongo 3
On Mongo 2 and Mongo 3:
```sh
sudo chmod 400 /data/shared/keyfile.key
sudo chown 999:999 /data/shared/keyfile.key
```

## 4. Set Up MongoDB on Mongo 2 and Mongo 3

### 4.1 Create Docker Compose Files
- Create `docker-compose-mongo2.yml` on Mongo 2.
- Create `docker-compose-mongo3.yml` on Mongo 3.

### 4.2 Start MongoDB on Mongo 2 and Mongo 3
On Mongo 2:
```sh
docker compose -f docker-compose-mongo2.yml up -d
```
On Mongo 3:
```sh
docker compose -f docker-compose-mongo3.yml up -d
```

## 5. Initialize the Replica Set

### 5.1 Connect to Mongo 1 and Initialize
Create `initReplicaSet.js` and execute:
```sh
docker exec -it mongo-1-container mongosh -u admin -p admin123 --eval "$(cat initReplicaSet.js)"
```

## 6. Verify the Replica Set

### 6.1 Check Replica Set Status
On Mongo 1:
```sh
docker exec -it mongo-1-container mongosh -u admin -p admin123
```
Inside MongoDB shell:
```sh
rs.status()
```
All three members should be listed.

## 7. Additional Notes

### Firewall Configuration
Ensure port `27017` is open on all servers. Test connectivity:
```sh
telnet HOST_IP_3 27017  # From Mongo 2 and Mongo 3
telnet HOST_IP_2 27017  # From Mongo 1 and Mongo 2
```

### MongoDB Networking
With `network_mode: host` enabled, MongoDB is accessible at:
- **Mongo 1:** HOST_IP_1:27017
- **Mongo 2:** HOST_IP_2:27017
- **Mongo 3:** HOST_IP_3:27017
No need to define ports in `docker-compose`.