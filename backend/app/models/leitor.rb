class Leitor < ApplicationRecord
    has_many :emprestimos, dependent: :nullify

    validates :nome_completo, presence: true
    validates :email, uniqueness: true, allow_nil: true
end