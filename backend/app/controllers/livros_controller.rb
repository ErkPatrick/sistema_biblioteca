class LivrosController < ApplicationController
  def index
    livros = Livro.all
    render json: livros
  end

  def show
    livro = Livro.find(params[:id])
    render json: livro
  end

  def create
    livro = Livro.new(livro_params)
    if livro.save
      render json: livro, status: :created
    else
      render json: livro.errors, status: :unprocessable_entity
    end
  end

  def update
    livro = Livro.find(params[:id])
    if livro.update(livro_params)
      render json: livro
    else
      render json: usuario.errors, status: :unprocessable_entity
    end
  end

  def destroy
    livro = Livro.find(params[:id])
    livro.destroy
    head :no_content
  end

  private

  def livro_params
    params.require(:livro).permit(:titulo, :autor, :categoria_id, :observacoes, :status)
  end
end
