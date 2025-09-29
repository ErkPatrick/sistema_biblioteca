class EmprestimosController < ApplicationController
  before_action :set_emprestimo, only: [ :show, :update, :destroy, :renovar, :devolver, :marcar_perdido_danificado ]
  before_action :authorize_admin!, only: [:destroy] 

def index
  emprestimos = Emprestimo.includes(:livro, :leitor).all

  render json: emprestimos.as_json(
    include: {
      livro: { only: [ :titulo ] },
      leitor: { only: [ :nome_completo ] }
    },
    methods: [ :valor_multa ]
  )
end


  def show
    emprestimo = Emprestimo.find(params[:id])
    render json: emprestimo
  end

def create
  emprestimo = Emprestimo.new(emprestimo_params)
  emprestimo.usuario = current_usuario
  emprestimo.data_emprestimo ||= Date.today
  emprestimo.data_devolucao_prevista ||= Date.today + 15.days

  if emprestimo.save

    # altera status do livro ao realizar emprestimo
    livro = emprestimo.livro
    livro.update(status: "emprestado")

    render json: emprestimo, status: :created
  else
    render json: { errors: emprestimo.errors.full_messages }, status: :unprocessable_entity
  end
end

  def update
    emprestimo = Emprestimo.find(params[:id])
    if emprestimo.update(emprestimo_params)
      render json: emprestimo
    else
      render json: { errors: emprestimo.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    emprestimo = Emprestimo.find(params[:id])
    emprestimo.destroy
    head :no_content
  end

  def renovar
    if @emprestimo.data_devolucao_real.present?
      render json: { error: "Não é possível renovar um empréstimo já devolvido" }, status: :unprocessable_entity
      return
    end

    if @emprestimo.renovado
      render json: { error: "Este empréstimo já foi renovado uma vez" }, status: :unprocessable_entity
      return
    end

    # validação da senha de empréstimo do leitor
    if params[:senha_emprestimo].blank? || @emprestimo.leitor.senha_emprestimo != params[:senha_emprestimo]
      render json: { error: "Senha de empréstimo inválida" }, status: :unprocessable_entity
      return
    end

    @emprestimo.data_devolucao_prevista += 15.days
    @emprestimo.renovado = true

    if @emprestimo.save
      render json: @emprestimo
    else
      render json: { errors: @emprestimo.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def devolver
    if @emprestimo.data_devolucao_real.present?
      render json: { error: "Este empréstimo já foi devolvido" }, status: :unprocessable_entity
      return
    end

    # validação da senha de empréstimo do leitor
    if params[:senha_emprestimo].blank? || @emprestimo.leitor.senha_emprestimo != params[:senha_emprestimo]
      render json: { error: "Senha de empréstimo inválida" }, status: :unprocessable_entity
      return
    end

    @emprestimo.data_devolucao_real = Date.today

    # Calcula multa se atrasado
    if @emprestimo.data_devolucao_real > @emprestimo.data_devolucao_prevista
      dias_atraso = (@emprestimo.data_devolucao_real - @emprestimo.data_devolucao_prevista).to_i
      @emprestimo.valor_multa = dias_atraso * 5 # R$5 por dia de atraso
      @emprestimo.status = "devolvido com atraso"
    else
      @emprestimo.valor_multa = 0
      @emprestimo.status = "devolvido dentro do prazo"
    end

    # Atualiza status do livro
    @emprestimo.livro.update(status: "disponível")

    if @emprestimo.save
      render json: @emprestimo
    else
      render json: { errors: @emprestimo.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def marcar_perdido_danificado
    if @emprestimo.data_devolucao_real.present?
      render json: { error: "Não é possível marcar um empréstimo já devolvido como perdido" }, status: :unprocessable_entity
      return
    end

    # validação da senha de empréstimo do leitor
    if params[:senha_emprestimo].blank? || @emprestimo.leitor.senha_emprestimo != params[:senha_emprestimo]
      render json: { error: "Senha de empréstimo inválida" }, status: :unprocessable_entity
      return
    end

    @emprestimo.data_devolucao_real = Date.today
    @emprestimo.status = "perdido/danificado"
    @emprestimo.valor_multa = 50

    # Atualiza status do livro
    @emprestimo.livro.update(status: "perdido/danificado")

    if @emprestimo.save
      render json: @emprestimo
    else
      render json: { errors: @emprestimo.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_emprestimo
    @emprestimo = Emprestimo.find(params[:id])
  end

  def emprestimo_params
    params.require(:emprestimo).permit(:livro_id, :leitor_id, :status, :data_devolucao_real)
  end
end
