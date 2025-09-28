class LeitoresController < ApplicationController
  before_action :set_leitor, only: [:show, :update, :destroy]

  def index
    leitores = Leitor.includes(:endereco).all
    render json: leitores.as_json(include: :endereco)
  end

  def show
    render json: @leitor.as_json(include: :endereco)
  end

  def create
    leitor = Leitor.new(leitor_params)

    if leitor.save
      LeitorMailer.senha_emprestimo_email(leitor).deliver_now
      render json: leitor.as_json(include: :endereco), status: :created
    else
      render json: { errors: leitor.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @leitor.update(leitor_params)
      render json: @leitor.as_json(include: :endereco)
    else
      render json: { errors: @leitor.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @leitor.destroy
    head :no_content
  end

  def buscar_por_cpf
    leitor = Leitor.find_by(cpf: params[:cpf])

    if leitor
      render json: leitor
    else
      render json: { error: "Leitor não encontrado" }, status: :not_found
    end
  end

  private

  def set_leitor
    @leitor = Leitor.find(params[:id])
  end

  def leitor_params
    params.require(:leitor).permit(
      :nome_completo,
      :cpf,
      :email,
      :telefone,
      endereco_attributes: [:rua, :numero, :cidade, :estado, :cep]
    )
  end
end
