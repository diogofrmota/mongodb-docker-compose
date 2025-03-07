rs.initiate({
  _id: 'rs0',
  members: [
    { _id: 0, host: 'mongo-1-container:27017' },
    { _id: 1, host: 'mongo-2-container:27017' },
    { _id: 2, host: 'mongo-3-container:27017' }
  ]
});