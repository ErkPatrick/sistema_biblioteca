class AddColumnsToEmprestimos < ActiveRecord::Migration[8.0]
  def change
    add_column :emprestimos, :data_devolucao_prevista, :date, null: false
    add_column :emprestimos, :data_devolucao_real, :date
  end
end
