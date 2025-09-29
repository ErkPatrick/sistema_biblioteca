class LivrosController < ApplicationController
  before_action :authorize_admin!, only: [:create, :update, :destroy]
  before_action :set_livro, only: [:show, :update, :destroy]

  def index
    livros = Livro.all
    render json: livros
  end

  def show
    render json: @livro
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
    if @livro.update(livro_params)
      render json: @livro
    else
      render json: @livro.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @livro.destroy
    head :no_content
  end

  private

  def set_livro
    @livro = Livro.find(params[:id])
  end

  def livro_params
    params.require(:livro).permit(:titulo, :autor, :categoria_id, :observacoes, :status)
  end
end
