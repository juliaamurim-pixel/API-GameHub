import { Router } from "express";
import * as jogoController from "../controllers/jogoController.js";
import { validarId } from "../middlewares/validarId.js";

const router = Router();

router.get("/", jogoController.listar);
router.get("/:id", validarId, jogoController.buscarPorId);
router.post("/", jogoController.criar);
router.put("/:id", validarId, jogoController.atualizar);
router.delete("/:id", validarId, jogoController.excluir);

export default router;