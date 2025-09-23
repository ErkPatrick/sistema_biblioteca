class CreateLeitores < ActiveRecord::Migration[8.0]
  def change
    create_table :leitores do |t|
      t.string :nome_completo, null: false
      t.string :cpf, null: false
      t.string :telefone, null: false
      t.string :email, null: false
      t.string :senha_emprestimo, null: false
      t.timestamps
    end
      add_index :leitores, :cpf, unique: true
      add_index :leitores, :email
    end
end
