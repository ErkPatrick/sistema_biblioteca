class Usuario < ApplicationRecord
  devise :database_authenticatable, :registerable,
        :recoverable, :rememberable, :validatable,
        :jwt_authenticatable,
        jwt_revocation_strategy: Devise::JWT::RevocationStrategies::Null

  ROLES = %w[bibliotecario admin].freeze

  validates :role, presence: true, inclusion: { in: ROLES }
  validates :nome, presence: true

  # Método para verificar senha provisória
  def senha_provisoria?
    self.senha_provisoria
  end
end
