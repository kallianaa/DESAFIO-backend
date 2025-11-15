const UsuarioRepository = require('../repositories/UsuarioRepository');
const PasswordHasher = require('../security/PasswordHasher');

class UsuarioService {
  constructor() {
    this.usuarioRepository = new UsuarioRepository();
  }

  async criarUsuario(dto) {
    const existente = await this.usuarioRepository.findByEmail(dto.email);
    if (existente) throw new Error('Email já cadastrado');

    const senhaHash = await PasswordHasher.hash(dto.senha);

    return await this.usuarioRepository.create({
      nome: dto.nome,
      email: dto.email,
      senhaHash
    });
  }

  listarUsuarios() {
    return this.usuarioRepository.findAll();
  }

  async buscarPorId(id) {
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) throw new Error('Usuário não encontrado');
    return usuario;
  }

  async atualizarUsuario(id, dto) {
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) throw new Error('Usuário não encontrado');

    return this.usuarioRepository.update(id, {
      nome: dto.nome || usuario.nome,
      email: dto.email || usuario.email,
    });
  }

  async alterarSenha(id, senhaAtual, novaSenha) {
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) throw new Error('Usuário não encontrado');

    const senhaValida = await PasswordHasher.compare(
      senhaAtual,
      usuario.senhaHash
    );

    if (!senhaValida) throw new Error('Senha atual incorreta');

    const novoHash = await PasswordHasher.hash(novaSenha);
    return this.usuarioRepository.updatePassword(id, novoHash);
  }

  async deletar(id) {
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) throw new Error('Usuário não encontrado');
    return this.usuarioRepository.delete(id);
  }
}

module.exports = UsuarioService;