class Emprestimo < ApplicationRecord
  belongs_to :usuario
  belongs_to :leitor
  belongs_to :livro

  validates :data_emprestimo, presence: true

  def devolvido?
    data_devolucao_real.present?
  end
end
