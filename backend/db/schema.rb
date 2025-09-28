# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_09_28_183534) do
  create_table "categorias", force: :cascade do |t|
    t.string "nome", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["nome"], name: "index_categorias_on_nome", unique: true
  end

  create_table "emprestimos", force: :cascade do |t|
    t.integer "usuario_id", null: false
    t.integer "livro_id", null: false
    t.integer "leitor_id", null: false
    t.string "status", default: "emprestado", null: false
    t.date "data_emprestimo", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.date "data_devolucao_prevista", null: false
    t.date "data_devolucao_real"
    t.decimal "valor_multa"
    t.boolean "renovado", default: false, null: false
    t.index ["leitor_id"], name: "index_emprestimos_on_leitor_id"
    t.index ["livro_id"], name: "index_emprestimos_on_livro_id"
    t.index ["usuario_id"], name: "index_emprestimos_on_usuario_id"
  end

  create_table "enderecos", force: :cascade do |t|
    t.integer "leitor_id", null: false
    t.string "rua"
    t.string "numero"
    t.string "cidade"
    t.string "estado"
    t.string "cep"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["leitor_id"], name: "index_enderecos_on_leitor_id"
  end

  create_table "leitores", force: :cascade do |t|
    t.string "nome_completo", null: false
    t.string "cpf", null: false
    t.string "telefone", null: false
    t.string "email", null: false
    t.string "senha_emprestimo", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["cpf"], name: "index_leitores_on_cpf", unique: true
    t.index ["email"], name: "index_leitores_on_email"
  end

  create_table "livros", force: :cascade do |t|
    t.string "autor", null: false
    t.string "titulo", null: false
    t.string "status", default: "disponível", null: false
    t.text "observacoes"
    t.integer "categoria_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["categoria_id"], name: "index_livros_on_categoria_id"
    t.index ["titulo"], name: "index_livros_on_titulo"
  end

  create_table "usuarios", force: :cascade do |t|
    t.string "nome", null: false
    t.string "email", null: false
    t.string "encrypted_password", null: false
    t.boolean "senha_provisoria", default: true
    t.string "role", default: "bibliotecario"
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_usuarios_on_email", unique: true
    t.index ["reset_password_token"], name: "index_usuarios_on_reset_password_token", unique: true
  end

  add_foreign_key "emprestimos", "leitores"
  add_foreign_key "emprestimos", "livros"
  add_foreign_key "emprestimos", "usuarios"
  add_foreign_key "enderecos", "leitores"
  add_foreign_key "livros", "categorias"
end
