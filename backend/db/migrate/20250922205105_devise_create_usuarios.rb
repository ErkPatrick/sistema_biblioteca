class DeviseCreateUsuarios < ActiveRecord::Migration[8.0]
  def change
    create_table :usuarios do |t|
      t.string :nome, null: false
      t.string :email, null: false
      t.string :encrypted_password, null: false
      t.boolean :senha_provisoria, default: true
      t.string :role, default: "bibliotecario"

      ## Recoverable
      t.string   :reset_password_token
      t.datetime :reset_password_sent_at

      ## Rememberable
      t.datetime :remember_created_at

      t.timestamps null: false
    end

    add_index :usuarios, :email, unique: true
    add_index :usuarios, :reset_password_token, unique: true
  end
end
