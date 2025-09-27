class CreateEnderecos < ActiveRecord::Migration[8.0]
  def change
    create_table :enderecos do |t|
      t.references :leitor, null: false, foreign_key: true
      t.string :rua
      t.string :numero
      t.string :cidade
      t.string :estado
      t.string :cep

      t.timestamps
    end
  end
end
