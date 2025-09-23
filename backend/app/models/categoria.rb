class Categoria < ApplicationRecord
  has_many :livros, dependent: :nullify
  validates :nome, presence: true, uniqueness: true
end
