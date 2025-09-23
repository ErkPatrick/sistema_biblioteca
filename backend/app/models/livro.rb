class Livro < ApplicationRecord
  belongs_to :categoria, optional: true
  has_many :emprestimos, dependent: :nullify

  validates :titulo, presence: true
end