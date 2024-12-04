const express = require("express");
const assistanceController = require("../controllers/assistanceRequest");
const router = express.Router();

router.post("/", assistanceController.createRequest);

router.get("/", assistanceController.getAllRequests);

router.get("/:userId", assistanceController.getUserRequests);

router.put("/:requestId", assistanceController.updateRequestStatus);

router.delete("/:requestId", assistanceController.deleteRequest);

module.exports = router;
