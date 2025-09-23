# app/lib/api_failure_app.rb
class ApiFailureApp < Devise::FailureApp
  def respond
    json_api
  end

  def json_api
    self.status = 401
    self.content_type = 'application/json'
    self.response_body = { error: i18n_message }.to_json
  end

  # Evita qualquer tentativa de armazenar localização na sessão
  def store_location!
    # nada
  end
end
