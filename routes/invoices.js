// —the code below was originally used for testing and has now been deprecated—

// var express = require("express");
// var secured = require("../lib/middleware/secured");
// var router = express.Router();

// const invoices = [
//   {
//     id: 0,
//     user: 0,
//     title: "Dummy Invoice 0",
//     description: "Change this to using mongo when applicable.",
//     items: []
//   },
//   {
//     id: 1,
//     user: 1,
//     title: "Dummy Invoice 1",
//     description: "Change this to using mongo when applicable.",
//     items: []
//   },
//   {
//     id: 2,
//     user: 2,
//     title: "Dummy Invoice 2",
//     description: "Change this to using mongo when applicable.",
//     items: []
//   },
// ];

// //retrieve all invoices
// router.get("/invoices", (req, res) => {
//   const invs = invoices.map(i => ({
//     id: i.id,
//     title: i.title,
//     user: i.user,
//     description: i.description,
//     items: i.items
//   }));
//   res.send(invs);
// });

// // get a specific invoice
// router.get("/invoices/:id", (req, res) => {
//   const invoice = invoices.filter(i => i.id === parseInt(req.params.id));
//   if (invoice.length > 1) return res.status(500).send();
//   if (invoice.length === 0) return res.status(404).send();
//   res.send(invoice[0]);
// });

// // insert a new invoice
// router.post("/invoices", (req, res) => {
//   const { title, description } = req.body;
//   const newInvoice = {
//     id: invoices.length + 1,
//     user: 0,
//     // TODO change user to being dynamically referenced via Auth0  
//     title,
//     description,
//     items: []
//   };
//   invoices.push(newInvoice);
//   console.log(res);
//   res.status(200).send();
// });

// // insert a new item to an invoice
// router.post("/item/:id", (req, res) => {
//   const { items } = req.body;

//   const invoice = invoices.filter(i => i.id === parseInt(req.params.id));
//   if (invoice.length > 1) return res.status(500).send();
//   if (invoice.length === 0) return res.status(404).send();

//   invoice[0].items.push({
//     items
//   });

//   res.status(200).send();
// });

// module.exports = router;
