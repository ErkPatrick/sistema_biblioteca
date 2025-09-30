class Usuarios::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  # Somente admins podem criar novos usuários
  before_action :authenticate_usuario!
  before_action :configure_permitted_parameters, only: [:create]

  private

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(
      :sign_up,
      keys: [:nome, :email, :password, :password_confirmation, :role] # role pode ser setada pelo admin
    )
  end

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json: { message: 'Usuário criado com sucesso', usuario: resource }, status: :created
    else
      render json: { message: 'Erro ao criar usuário', errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # sobrescrevendo pra não tentar salvar sessão
  def sign_up(resource_name, resource)
    # não chama sign_in
  end
end
