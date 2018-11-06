const express = require("express");
const path = require("path");

module.exports = server => {
  server.use(express.static(path.resolve("./client", "build")));
  server.get("*", (req, res) => {
    res.sendFile(path.resolve("./client", "build", "index.html"));
  });
};
