class CategoriasController < ApplicationController
  def index
    categorias = Categoria.all
    render json: categorias
  end

  def show
    categoria = Categoria.find(params[:id])
    render json: categoria
  end

  def create
    categoria = Categoria.new(categoria_params)
    if categoria.save
      render json: categoria, status: :created
    else
      render json: categoria.errors, status: :unprocessable_entity
    end
  end

  def update
    categoria = Categoria.find(params[:id])
    if categoria.update(categoria_params)
      render json: categoria
    else
      render json: categoria.errors, status: :unprocessable_entity
    end
  end

  def destroy
    categoria = Categoria.find(params[:id])
    categoria.destroy
    head :no_content
  end

  private

  def categoria_params
    params.require(:categoria).permit(:nome)
  end
end
