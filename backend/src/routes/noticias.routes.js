const { Router } = require("express");
const { listarNoticias } = require("../controllers/noticias.controller");

const router = Router();

router.get("/", listarNoticias);

module.exports = router;
