// src/controllers/UsuarioController.js
const UsuarioService = require('../services/UsuarioService');
const UsuarioDTO = require('../security/UsuarioDTO');
const Role = require('../domain/Role');
const Usuario = require('../domain/Usuario');

class UsuarioController {
  constructor() {
    this.usuarioService = new UsuarioService();
  }

  criar = async (req, res) => {
    try {
      const dto = UsuarioDTO.fromRequest(req.body);
      const usuario = await this.usuarioService.criarUsuario(dto);
      return res.status(201).json(usuario);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  };

  listar = async (_req, res) => {
    const usuarios = await this.usuarioService.listarUsuarios();
    return res.json(usuarios);
  };

  buscarPorId = async (req, res) => {
    try {
      const usuario = await this.usuarioService.buscarPorId(req.params.id);
      return res.json(usuario);
    } catch (err) {
      return res.status(404).json({ message: err.message });
    }
  };

  atualizar = async (req, res) => {
    try {
      const dto = UsuarioDTO.fromRequest(req.body);
      const usuario = await this.usuarioService.atualizarUsuario(req.params.id, dto);
      return res.json(usuario);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  };

  alterarSenha = async (req, res) => {
    try {
      const { senhaAtual, novaSenha } = req.body;
      await this.usuarioService.alterarSenha(req.params.id, senhaAtual, novaSenha);
      return res.json({ message: "Senha alterada com sucesso" });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  };

  deletar = async (req, res) => {
    try {
      await this.usuarioService.deletar(req.params.id);
      return res.status(204).send();
    } catch (err) {
      return res.status(404).json({ message: err.message });
    }
  };

  atribuirRole = async (idUser, Role) => {
    try {
      if(!idUser) {
        if(Role === "ADMIN" || Role === "ALUNO" || Role === "PROFESSOR"){
          await this.usuarioRepository.atribuirRole(idUser, role);
        }
      }
    } catch (err) {
        return res.status(404).json({message: err.message});
    }
  }

}

module.exports = new UsuarioController();