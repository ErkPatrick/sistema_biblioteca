Rails.application.routes.draw do
  # Rotas Devise (override)
  devise_for :usuarios,
            controllers: {
              registrations: "usuarios/registrations",
              passwords: "usuarios/passwords",
              sessions: "usuarios/sessions"
            },
            path_names: {
              sign_in: "login",
              sign_out: "logout",
              sign_up: "cadastro",
              password: "recuperar_senha"
            }

  resources :usuarios, only: [ :index, :show, :update, :destroy ] do
    member do
      put :update_password
    end
  end

  resources :leitores do
    collection do
      get "cpf/:cpf", to: "leitores#buscar_por_cpf", constraints: { cpf: /[^\/]+/ }
    end
  end

  resources :emprestimos do
    member do
      post :renovar
      post :devolver
      post :marcar_perdido_danificado
    end
  end

  # Outros controllers da aplicação
  resources :livros
  resources :categorias
  delete "/usuarios/:id", to: "usuarios#destroy_user"
end
