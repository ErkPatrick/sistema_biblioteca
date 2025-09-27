class Endereco < ApplicationRecord
  belongs_to :leitor

  validates :rua, :numero, :cidade, :estado, :cep, presence: true
end
