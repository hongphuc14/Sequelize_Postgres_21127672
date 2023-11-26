const express = require('express');
const router = express.Router();
const controller = require('../controllers/blogController');

router.get("/", controller.showList);
router.get("/:id", controller.showDetails);
router.get("/category/:categoryId", controller.showByCategory);
router.get("/tag/:tagId", controller.showByTag);
router.get("/search", controller.search);

module.exports = router;