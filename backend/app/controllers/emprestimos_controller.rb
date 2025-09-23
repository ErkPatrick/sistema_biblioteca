class EmprestimosController < ApplicationController
  def index
    emprestimos = Emprestimo.all
    render json: emprestimos
  end

  def show
    emprestimo = Emprestimo.find(params[:id])
    render json: emprestimo
  end

  def create
    emprestimo = Emprestimo.new(emprestimo_params)
    if emprestimo.save
      render json: emprestimo, status: :created
    else
      render json: emprestimo.errors, status: :unprocessable_entity
    end
  end

  def update
    emprestimo = Emprestimo.find(params[:id])
    if emprestimo.update(emprestimo_params)
      render json: emprestimo
    else
      render json: emprestimo.errors, status: :unprocessable_entity
    end
  end

  def destroy
    emprestimo = Emprestimo.find(params[:id])
    emprestimo.destroy
    head :no_content
  end

  private

  def emprestimo_params
    params.require(:emprestimo).permit(:usuario_id, :livro_id, :bibliotecario_id, :data_emprestimo, :data_devolucao_prevista, :data_devolucao_real, :status)
  end
end
