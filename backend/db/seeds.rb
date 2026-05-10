Usuario.find_or_create_by!(email: 'admin@biblioteca.com') do |u|
  u.nome = 'Administrador'
  u.password = 'password123'
  u.password_confirmation = 'password123'
  u.role = 'admin'
  u.senha_provisoria = false
end

puts "Seed concluída! Login: admin@biblioteca.com | Senha: password123"