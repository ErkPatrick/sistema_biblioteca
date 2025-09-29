class UsuarioMailer < ApplicationMailer
  default from: 'erick.patrickfreitas@gmail.com'
  layout 'mailer'

  def reset_password_instructions_frontend(usuario, token)
    @usuario = usuario
    @token = token
    @url = "http://localhost:3001/login/recuperar-senha?token=#{token}"

    mail(
      to: @usuario.email,
      subject: "Instruções para resetar sua senha"
    )
  end
end
