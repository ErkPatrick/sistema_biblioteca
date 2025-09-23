class Emprestimo < ApplicationRecord
  belongs_to :usuario       
  belongs_to :livro
  belongs_to :bibliotecario 

  validates :data_emprestimo, presence: true
  
  def devolvido?
    data_devolucao_real.present?
  end
end
