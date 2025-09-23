class UsuariosController < ApplicationController
  before_action :authorize_admin!, only: [:index, :show]

  # GET /usuarios
  def index
    usuarios = Usuario.all
    render json: usuarios, status: :ok
  end

  # GET /usuarios/:id
  def show
    usuario = Usuario.find(params[:id])
    render json: usuario, status: :ok
  end

  # PUT /usuarios/:id/update_password
  def update_password
    usuario = Usuario.find(params[:id])

    # Garante que só o próprio usuário pode alterar a senha
    unless usuario.id == current_usuario.id
      return render json: { error: "Acesso não autorizado" }, status: :forbidden
    end

    if usuario.update(password_params.merge(senha_provisoria: false))
      render json: { message: "Senha alterada com sucesso", usuario: usuario }, status: :ok
    else
      render json: { errors: usuario.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy_user
    usuario = Usuario.find(params[:id])
    if usuario.destroy
      render json: { message: "Conta deletada com sucesso" }, status: :ok
    else
      render json: { errors: usuario.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def password_params
    params.require(:usuario).permit(:password, :password_confirmation)
  end
end
