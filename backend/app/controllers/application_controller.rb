class ApplicationController < ActionController::API
    before_action :authenticate_usuario!

    include ActionController::MimeResponds
    respond_to :json

    def store_location_for(resource_or_scope, location)
    end
    
    def authorize_admin!
        render json: { error: "Acesso negado" }, status: :forbidden unless current_usuario.role == "admin"
    end

    def authorize_bibliotecario!
        render json: { error: "Acesso negado" }, status: :forbidden unless current_usuario.role == "bibliotecario"
    end
end
