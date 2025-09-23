class Usuarios::SessionsController < Devise::SessionsController
  respond_to :json
  skip_before_action :authenticate_usuario!

  private

  def respond_with(resource, _opts = {})
    token = request.env['warden-jwt_auth.token'] # pega o JWT gerado

    if resource.senha_provisoria?
      render json: { 
        message: 'Troque sua senha provisória', 
        senha_provisoria: true, 
        usuario: resource,
        token: token
      }, status: :ok
    else
      render json: { 
        message: 'Login realizado com sucesso', 
        usuario: resource,
        token: token
      }, status: :ok
    end
  end

  def respond_to_on_destroy
    render json: { message: 'Logout realizado com sucesso' }, status: :ok
  end
end
