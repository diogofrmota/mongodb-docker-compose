# MongoDB Replica Set Local

This repository contains the configuration files to deploy a MongoDB replica set locally using Docker Compose. The necessary Docker Compose files and the replica set initialization script are included in the repository. Follow the steps below to set up and test the replica set on your local machine.

## Prerequisites

- Docker and Docker Compose must be installed.
- OpenSSL is required for generating the keyfile.
- Git is recommended to clone this repository.

## Setup Steps

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd <repository-folder>

2. **CCreate the Shared Directory and Generate the Keyfile**

    ```bash
    mkdir -p ./data/shared
    openssl rand -base64 756 > ./data/shared/keyfile.key
    chmod 400 ./data/shared/keyfile.key

3. **Review the Docker Compose Files**

   The repository includes three Docker Compose files:

   - `docker-compose-mongo1.yml` for the first MongoDB instance (mapped to host port 27017)
   - `docker-compose-mongo2.yml` for the second MongoDB instance (mapped to host port 27018)
   - `docker-compose-mongo3.yml` for the third MongoDB instance (mapped to host port 27019)

   Note: Each file maps the container's port 27017 to a unique host port to avoid conflicts when running locally.

4. **Verify the Replica Set Initialization Script**

   The `initReplicaSet.js` script is configured to initialize the replica set using the local endpoints:

   ```javascript
   rs.initiate({
     _id: 'rs0',
     members: [
       { _id: 0, host: 'localhost:27017' },
       { _id: 1, host: 'localhost:27018' },
       { _id: 2, host: 'localhost:27019' }
     ]
   });

5. **Start the MongoDB Containers**

   Open separate terminal sessions or run these commands sequentially to start each container:

   ```bash
   docker compose -f docker-compose-mongo1.yml up -d
   docker compose -f docker-compose-mongo2.yml up -d
   docker compose -f docker-compose-mongo3.yml up -d

6. **Initialize the Replica Set**

   Once all containers are up and running, initialize the replica set by executing the initialization script on the first container:

   ```bash
   docker exec -it mongo-1-container mongosh -u admin -p admin123 --eval "$(cat initReplicaSet.js)"

7. **Verify the Replica Set Configuration**

   Connect to the first MongoDB container to verify the status of the replica set:

   ```bash
   docker exec -it mongo-1-container mongosh -u admin -p admin123
   ```

   Inside the MongoDB shell, run:

   ```bash
   rs.status()
   ```
   You should see all three members (localhost:27017, localhost:27018, and localhost:27019) listed as part of the replica set.

8. **Additional Notes**

   - This setup is intended for local testing and development.
   - Ensure that no host port conflicts occur when mapping the container ports.
   - If you encounter any connectivity issues, verify Docker's port mappings and the shared volume configuration.
   - Regularly check container logs to troubleshoot potential issues using the command:

     ```bash
     docker logs <container-name>
     ```