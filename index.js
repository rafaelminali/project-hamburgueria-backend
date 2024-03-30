const express = require("express");
const uuid = require("uuid");
const cors = require("cors");

const port = 3001;
const app = express();
app.use(express.json());
app.use(cors());

const orders = [];

const checkOderId = (request, response, next) => {
  const { id } = request.params;
  const index = orders.findIndex((order) => order.id === id);
  if (index < 0) {
    return response.status(404).json({ message: "User not found" });
  }
  request.orderIndex = index;
  request.orderId = id;

  next();
};

app.get("/pedidos", (request, response) => {
  return response.json(orders);
});

app.post("/pedidos", (request, response) => {
  const { order, name } = request.body;

  const orderRequest = { id: uuid.v4(), order, name };

  orders.push(orderRequest);

  return response.status(201).json(orderRequest);
});

app.put("/pedidos/:id", checkOderId, (request, response) => {
  const { order, name } = request.body;
  const id = request.orderId;
  const updatesOrder = { id, order, name };
  const index = request.orderIndex;
  orders[index] = updatesOrder;

  return response.json(updatesOrder);
});

app.delete("/pedidos/:id", checkOderId, (request, response) => {
  const index = request.orderIndex;

  orders.splice(index, 1);

  return response.status(204).json();
});

app.listen(port, () => {
  console.log(`🚀 Server started on port ${port}`);
});
