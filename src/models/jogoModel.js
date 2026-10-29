import conexao from "../../db.js";

export function listar(callback){
    const sql = "SELECT * FROM jogos ORDER BY id";
    conexao.query(sql, callback);
};

export function buscarId(id, callback){
    const sql = "SELECT * FROM jogos WHERE id = ?";
    conexao.query(sql, [id], callback);
};

export function criar(dados, callback){
    const sql = "INSERT INTO jogos (titulo, ano_lancamento, estudio_id) VALUES (?, ?, ?)"
    conexao.query(sql, [dados.nome, dados.pais], callback);
};

export function atualizar(id, dados, callback){
    const sql = "UPDATE jogos SET titulo = ?, ano_lancamento = ?, estudio_id = ? WHERE id = ?"
    conexao.query(sql, [dados.nome, dados.pais, id], callback);
};

export function deletar(id, callback){
    const sql = "DELETE FROM jogos WHERE id = ?"
    conexao.query(sql, [id], callback);

};
