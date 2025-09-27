class Leitor < ApplicationRecord
  has_many :emprestimos, dependent: :nullify

  # Relacionamento com endereço
  has_one :endereco, dependent: :destroy
  accepts_nested_attributes_for :endereco

  validates :nome_completo, presence: true
  validates :email, uniqueness: true, allow_nil: true

  before_create :gerar_senha_emprestimo

  private

  def gerar_senha_emprestimo
    self.senha_emprestimo = SecureRandom.alphanumeric(8)
  end
end
