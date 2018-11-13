const { server } = require("./server");

// TODO
// import connectMongo here
// restructure server.listen

// with a proper mongo connection, the rest of the schemas will work

require("dotenv").config();

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`API running on Port ${PORT}`));
