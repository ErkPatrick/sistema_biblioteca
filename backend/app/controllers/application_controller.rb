class ApplicationController < ActionController::API
    before_action :authenticate_usuario! # Devise JWT

    include ActionController::MimeResponds
    respond_to :json

    # Desabilita armazenamento de localização para APIs
    def store_location_for(resource_or_scope, location)
        # nada
    end
    def authorize_admin!
        render json: { error: "Acesso negado" }, status: :forbidden unless current_usuario.role == "admin"
    end

    def authorize_bibliotecario!
        render json: { error: "Acesso negado" }, status: :forbidden unless current_usuario.role == "bibliotecario"
    end
end
