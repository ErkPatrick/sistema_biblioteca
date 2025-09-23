class CreateLivros < ActiveRecord::Migration[8.0]
  def change
    create_table :livros do |t|
      t.string :autor, null: false
      t.string :titulo, null: false
      t.string :status, null: false, default: "disponível"
      t.text :observacoes
      t.references :categoria, null: false, foreign_key: true

      t.timestamps
    end

      add_index :livros, :titulo
    end
end
