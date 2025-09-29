class Usuarios::PasswordsController < Devise::PasswordsController
  respond_to :json
  skip_before_action :authenticate_usuario!

  def create
    usuario = Usuario.find_by(email: params[:usuario][:email])
    if usuario
      token = usuario.send(:set_reset_password_token) # cria token sem enviar email
      UsuarioMailer.reset_password_instructions_frontend(usuario, token).deliver_now
      render json: { message: "Instruções enviadas" }, status: :ok
    else
      render json: { errors: ["Email não encontrado"] }, status: :unprocessable_entity
    end
  end

  def update
    self.resource = resource_class.reset_password_by_token(resource_params)
    
    if resource.errors.empty?
      render json: { message: "Senha alterada com sucesso!" }, status: :ok
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def resource_params
    params.require(:usuario).permit(:reset_password_token, :password, :password_confirmation)
  end
end

