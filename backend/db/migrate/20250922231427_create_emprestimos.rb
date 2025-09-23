class CreateEmprestimos < ActiveRecord::Migration[8.0]
  def change
    create_table :emprestimos do |t|
      t.references :usuario, null: false, foreign_key: true
      t.references :livro, null: false, foreign_key: true
      t.references :leitor, null: false, foreign_key: true
      # Poderemos ter 3 status, emprestado, devolvido, perdido para cálculo de multas
      t.string :status, null: false, default: "emprestado"
      t.date :data_emprestimo, null: false
      t.date :data_devolucao
      t.timestamps
    end
  end
end
