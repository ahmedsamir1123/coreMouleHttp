const fs = require("node:fs");

module.exports = async (req, res) => {
  const { url, method } = req;
  res.setHeader("Content-Type", "application/json");

  if (method === "POST" && url === "/api/user") {
    let body = "";
    for await (const chunk of req) body += chunk;
    let data = JSON.parse(fs.readFileSync("./data.json"));
    let newUser = JSON.parse(body);
    data.push(newUser);
    fs.writeFileSync("./data.json", JSON.stringify(data));
    res.statusCode = 200;
    res.end(JSON.stringify({ message: "User added successfully" }));

  } else if (method === "PATCH" && url.startsWith("/api/user/")) {
    const id = parseInt(url.split("/")[3]);
    let body = "";
    for await (const chunk of req) body += chunk;
    let data = JSON.parse(fs.readFileSync("./data.json"));
    let updateData = JSON.parse(body);
    const foundItem = data.find(item => item.id === id);
    if (foundItem) {
      Object.assign(foundItem, updateData);
      fs.writeFileSync("./data.json", JSON.stringify(data));
      res.statusCode = 200;
      res.end(JSON.stringify({ message: "User updated successfully" }));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: "User ID not found" }));
    }

  } else if (method === "DELETE" && url.startsWith("/api/user/")) {
    const id = parseInt(url.split("/")[3]);
    let data = JSON.parse(fs.readFileSync("./data.json"));
    const newData = data.filter(item => item.id !== id);
    if (newData.length !== data.length) {
      fs.writeFileSync("./data.json", JSON.stringify(newData));
      res.statusCode = 200;
      res.end(JSON.stringify({ message: "User deleted successfully" }));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: "User ID not found" }));
    }

  } else if (method === "GET" && url === "/api/user") {
    let data = JSON.parse(fs.readFileSync("./data.json"));
    res.statusCode = 200;
    res.end(JSON.stringify({ data }));

  } else if (method === "GET" && url.startsWith("/api/user/")) {
    const id = parseInt(url.split("/")[3]);
    let data = JSON.parse(fs.readFileSync("./data.json"));
    const foundItem = data.find(item => item.id === id);
    if (foundItem) {
      res.statusCode = 200;
      res.end(JSON.stringify({ data: foundItem }));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: "User ID not found" }));
    }

  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: "Route not found" }));
  }
};
