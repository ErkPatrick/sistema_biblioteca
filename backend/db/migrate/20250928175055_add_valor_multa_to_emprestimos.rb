class AddValorMultaToEmprestimos < ActiveRecord::Migration[8.0]
  def change
    add_column :emprestimos, :valor_multa, :decimal
  end
end
