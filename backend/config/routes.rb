Rails.application.routes.draw do
  # Rotas Devise (override)
  devise_for :usuarios, 
            controllers: {
              registrations: 'usuarios/registrations',
              passwords: 'usuarios/passwords',
              sessions: 'usuarios/sessions'
            },
            path_names: { 
              sign_in: 'login', 
              sign_out: 'logout', 
              sign_up: 'cadastro', 
              password: 'recuperar_senha' 
            }

  # Rotas para usuários (admin ou JWT)
  resources :usuarios, only: [:index, :show] do
    member do
      put 'update_password'
    end
  end

  # Outros controllers da aplicação
  resources :livros
  resources :emprestimos
  resources :categorias
  resources :leitores
  delete '/usuarios/:id', to: 'usuarios#destroy_user'
end
