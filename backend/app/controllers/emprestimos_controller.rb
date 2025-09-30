class EmprestimosController < ApplicationController
  before_action :set_emprestimo, only: [:show, :update, :destroy, :renovar, :devolver, :marcar_perdido_danificado]
  before_action :authorize_admin!, only: [:destroy]

  def index
    emprestimos = Emprestimo.includes(:livro, :leitor).all

    render json: emprestimos.as_json(
      include: {
        livro: { only: [:titulo] },
        leitor: { only: [:nome_completo] }
      },
      methods: [:valor_multa]
    )
  end

  def show
    render json: @emprestimo
  end

  def create
    emprestimo = Emprestimo.new(emprestimo_params)
    emprestimo.usuario = current_usuario
    emprestimo.data_emprestimo ||= Date.current
    emprestimo.data_devolucao_prevista ||= adicionar_dias_uteis(emprestimo.data_emprestimo, 15)

    if emprestimo.save
      emprestimo.livro.update(status: "emprestado")
      render json: emprestimo, status: :created
    else
      render json: { errors: emprestimo.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @emprestimo.update(emprestimo_params)
      render json: @emprestimo
    else
      render json: { errors: @emprestimo.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @emprestimo.livro.update(status: "disponível")
    @emprestimo.destroy
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

    if params[:senha_emprestimo].blank? || @emprestimo.leitor.senha_emprestimo != params[:senha_emprestimo]
      render json: { error: "Senha de empréstimo inválida" }, status: :unprocessable_entity
      return
    end

    @emprestimo.data_devolucao_prevista = adicionar_dias_uteis(@emprestimo.data_devolucao_prevista, 15)
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

    if params[:senha_emprestimo].blank? || @emprestimo.leitor.senha_emprestimo != params[:senha_emprestimo]
      render json: { error: "Senha de empréstimo inválida" }, status: :unprocessable_entity
      return
    end

    @emprestimo.data_devolucao_real = Date.current

    dias_atraso = contar_dias_uteis(@emprestimo.data_devolucao_prevista, @emprestimo.data_devolucao_real)
    if dias_atraso > 0
      @emprestimo.valor_multa = dias_atraso * 5
      @emprestimo.status = "devolvido com atraso"
    else
      @emprestimo.valor_multa = 0
      @emprestimo.status = "devolvido dentro do prazo"
    end

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

    if params[:senha_emprestimo].blank? || @emprestimo.leitor.senha_emprestimo != params[:senha_emprestimo]
      render json: { error: "Senha de empréstimo inválida" }, status: :unprocessable_entity
      return
    end

    @emprestimo.data_devolucao_real = Date.current
    @emprestimo.status = "perdido/danificado"
    @emprestimo.valor_multa = 50
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

  # Adiciona dias úteis a uma data
  def adicionar_dias_uteis(data_inicial, dias_uteis)
    data = data_inicial.to_date
    while dias_uteis > 0
      data += 1 
      dias_uteis -= 1 if (1..5).include?(data.wday)
    end
    data
  end


  # Conta dias úteis entre duas datas
  def contar_dias_uteis(data_inicio, data_fim)
    return 0 if data_fim <= data_inicio

    dias_uteis = 0
    (data_inicio + 1..data_fim).each do |data|
      dias_uteis += 1 if (1..5).include?(data.wday)
    end
    dias_uteis
  end
end
