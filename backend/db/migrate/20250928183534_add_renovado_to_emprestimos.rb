class AddRenovadoToEmprestimos < ActiveRecord::Migration[8.0]
  def change
    add_column :emprestimos, :renovado, :boolean, default: false, null: false
  end
end
