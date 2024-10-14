const express = require("express");
const {
  searchContact,
  getContractsForDMList,
  getAllContacts,
} = require("../controllers/ContactController");
const verifyToken = require("../middlewares/AuthMiddleware");
const contactRouter = express.Router();

contactRouter.post("/search", verifyToken, searchContact);
contactRouter.get(
  "/get_contacts_for_dm_list",
  verifyToken,
  getContractsForDMList
);
contactRouter.get("/get_all_contacts", verifyToken, getAllContacts);

module.exports = contactRouter;
