class RemoveDataDevolucaoFromEmprestimos < ActiveRecord::Migration[8.0]
  def change
    remove_column :emprestimos, :data_devolucao, :date
  end
end
