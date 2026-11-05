import { Router } from "express";
import * as jogadoresController from "../controllers/jogadoresController.js";
import { validarId } from "../middlewares/validarId.js";


const router = Router();

router.get("/", jogadoresController.listar);
router.get("/:id", validarId, jogadoresController.buscarPorId);
router.post("/", jogadoresController.criar);
router.put("/:id", validarId, jogadoresController.atualizar);
router.delete("/:id", validarId, jogadoresController.excluir);

export default router;
export function textoValido(valor, limite) {
    return typeof valor === "string"
        && valor.trim().length > 0
        && valor.trim().length <= limite;
}

export function inteiroPositivo(valor) {
    return typeof valor === "number"
        && Number.isSafeInteger(valor)
        && valor > 0;
}