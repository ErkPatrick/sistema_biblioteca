class UsuariosController < ApplicationController
  before_action :authorize_admin!, only: [:index, :show, :update, :destroy]
  before_action :set_usuario, only: [:show, :update, :destroy, :update_password]

  def index
    usuarios = Usuario.all
    render json: usuarios, status: :ok
  end

  def show
    render json: @usuario, status: :ok
  end

  # Atualiza nome, email e role
  def update
    if @usuario.update(usuario_params)
      render json: @usuario, status: :ok
    else
      render json: { errors: @usuario.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # Só o próprio usuário pode alterar a senha
  def update_password
    unless @usuario.id == current_usuario.id
      return render json: { error: "Acesso não autorizado" }, status: :forbidden
    end

    if @usuario.update(password_params.merge(senha_provisoria: false))
      render json: { message: "Senha alterada com sucesso", usuario: @usuario }, status: :ok
    else
      render json: { errors: @usuario.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    if @usuario.destroy
      render json: { message: "Usuário deletado com sucesso" }, status: :ok
    else
      render json: { errors: @usuario.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_usuario
    @usuario = Usuario.find(params[:id])
  end

  def usuario_params
    params.require(:usuario).permit(:nome, :email, :role)
  end

  def password_params
    params.require(:usuario).permit(:password, :password_confirmation)
  end
end
