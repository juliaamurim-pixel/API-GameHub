import * as jogoModel from "../models/jogoModel.js";
import { textoValido } from "../utils/validacoes.js";

export function listar(req, res, next) {
    jogoModel.listar((erro, resultado) => {
        if (erro) return next(erro);
        return res.status(200).json(resultado);
    });
}

export function buscarPorId(req, res, next) {
    jogoModel.buscarPorId(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.length === 0) {
            return res.status(404).json({ erro: "Jogo não encontrado" });
        }
        return res.status(200).json(resultado[0]);
    });
}

export function criar(req, res, next) {
    const { nome, pais } = req.body ?? {};
    if (!textoValido(nome, 100) || !textoValido(pais, 60)) {
        return res.status(400).json({ erro: "Informe titulo (até 150 caracteres), ano_lancamento de 1 a 9999 e estudio_id inteiro positivo" });
    }
    const dados = { nome: nome.trim(), pais: pais.trim() };

    jogoModel.criar(dados, (erro, resultado) => {
        if (erro) return next(erro);
        return res.status(201).json({
            mensagem: "Jogo cadastrado com sucesso",
            id: resultado.insertId
        });
    });
}

export function atualizar(req, res, next) {
    const { nome, pais } = req.body ?? {};
    if (!textoValido(nome, 100) || !textoValido(pais, 60)) {
        return res.status(400).json({ erro: "Informe titulo (até 150 caracteres), ano_lancamento de 1 a 9999 e estudio_id inteiro positivo" });
    }
    const dados = { titulo: titulo.trim(), ano_lancamento, estudio_id };

    // Consulta didática para confirmar que o registro existe antes de editar.
    jogoModel.buscarPorId(req.id, (erro, registros) => {
        if (erro) return next(erro);
        if (registros.length === 0) {
            return res.status(404).json({ erro: "Jogo não encontrado" });
        }
        jogoModel.atualizar(req.id, dados, (erro, resultado) => {
            if (erro) return next(erro);
            return res.status(200).json({ mensagem: "Jogo atualizado com sucesso" });
        });
    });
}

export function excluir(req, res, next) {
    jogoModel.excluir(req.id, (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Jogo não encontrado" });
        }
        return res.status(200).json({ mensagem: "Jogo excluído com sucesso" });
    });
}

app.get("/jogadores", (req, res, next) => {
    conexao.query("SELECT * FROM jogadores ORDER BY id", (erro, resultado) => {
        if (erro) return next(erro);
        return res.status(200).json(resultado);
    });
});

app.get("/jogadores/:id", validarId, (req, res, next) => {
    conexao.query("SELECT * FROM jogadores WHERE id = ?", [req.id], (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.length === 0) {
            return res.status(404).json({ erro: "Jogador não encontrado" });
        }
        return res.status(200).json(resultado[0]);
    });
});

app.post("/jogadores", (req, res, next) => {
    const { nome, email, nickname } = req.body ?? {};
    if (!textoValido(nome, 100) || !textoValido(email, 150)
        || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        || !textoValido(nickname, 20)
        || !/^[A-Za-z0-9_]{3,20}$/.test(nickname.trim())) {
        return res.status(400).json({
            erro: "Informe nome (até 100 caracteres), email válido (até 150) e nickname com 3 a 20 letras, números ou sublinhado"
        });
    }
    const dados = { nome: nome.trim(), email: email.trim(), nickname: nickname.trim() };

    conexao.query("INSERT INTO jogadores (nome, email, nickname) VALUES (?, ?, ?)", [dados.nome, dados.email, dados.nickname], (erro, resultado) => {
        if (erro) return next(erro);
        return res.status(201).json({
            mensagem: "Jogador cadastrado com sucesso",
            id: resultado.insertId
        });
    });
});

app.put("/jogadores/:id", validarId, (req, res, next) => {
    const { nome, email, nickname } = req.body ?? {};
    if (!textoValido(nome, 100) || !textoValido(email, 150)
        || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        || !textoValido(nickname, 20)
        || !/^[A-Za-z0-9_]{3,20}$/.test(nickname.trim())) {
        return res.status(400).json({
            erro: "Informe nome (até 100 caracteres), email válido (até 150) e nickname com 3 a 20 letras, números ou sublinhado"
        });
    }
    const dados = { nome: nome.trim(), email: email.trim(), nickname: nickname.trim() };

    conexao.query("SELECT * FROM jogadores WHERE id = ?", [req.id], (erro, registros) => {
        if (erro) return next(erro);
        if (registros.length === 0) {
            return res.status(404).json({ erro: "Jogador não encontrado" });
        }
        conexao.query("UPDATE jogadores SET nome = ?, email = ?, nickname = ? WHERE id = ?", [dados.nome, dados.email, dados.nickname, req.id], (erro, resultado) => {
            if (erro) return next(erro);
            return res.status(200).json({ mensagem: "Jogador atualizado com sucesso" });
        });
    });
});

app.delete("/jogadores/:id", validarId, (req, res, next) => {
    conexao.query("DELETE FROM jogadores WHERE id = ?", [req.id], (erro, resultado) => {
        if (erro) return next(erro);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Jogador não encontrado" });
        }
        return res.status(200).json({ mensagem: "Jogador excluído com sucesso" });
    });
});


app.use((req, res) => {
    res.status(404).json({ erro: "Rota não encontrada" });
});
app.use(tratarErro);

conexao.connect((erro) => {
    if (erro) {
        console.error("Erro ao conectar ao banco:", erro.code || erro.message);
        process.exit(1);
    }
    console.log("Conectado ao banco gamehub_db");
    const servidor = app.listen(PORTA, () => {
        console.log(`Servidor iniciado em http://localhost:${PORTA}`);
    });
    servidor.on("error", (erro) => {
        console.error("Erro ao iniciar servidor:", erro.code || erro.message);
        conexao.end(() => process.exit(1));
    });
});