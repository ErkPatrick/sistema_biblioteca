class LeitoresController < ApplicationController
  def index
    leitores = Leitor.all
    render json: leitores
  end

  def show
    leitor = Leitor.find(params[:id])
    render json: leitor
  end

  def create
    leitor = Leitor.new(leitor_params)
    if leitor.save
      render json: leitor, status: :created
    else
      render json: leitor.errors, status: :unprocessable_entity
    end
  end

  def update
    leitor = Leitor.find(params[:id])
    if leitor.update(leitor_params)
      render json: leitor
    else
      render json: leitor.errors, status: :unprocessable_entity
    end
  end

  def destroy
    leitor = Leitor.find(params[:id])
    leitor.destroy
    head :no_content
  end

  private

  def leitor_params
    params.require(:leitor).permit(:nome_completo, :cpf, :email, :telefone, :senha_emprestimo)
  end
end
