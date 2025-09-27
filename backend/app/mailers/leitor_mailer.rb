class LeitorMailer < ApplicationMailer
  default from: 'erick-patrickfreitas@outlook.com'

  def senha_emprestimo_email(leitor)
    @leitor = leitor
    mail(to: @leitor.email, subject: 'Sua senha de empréstimo')
  end
end
