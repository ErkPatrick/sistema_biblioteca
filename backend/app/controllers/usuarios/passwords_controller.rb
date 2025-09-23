class Usuarios::PasswordsController < Devise::PasswordsController
  respond_to :json
  skip_before_action :authenticate_usuario!

  def create
    self.resource = resource_class.send_reset_password_instructions(resource_params)
    if successfully_sent?(resource)
      render json: { message: 'Instruções de recuperação enviadas' }, status: :ok
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end
end
