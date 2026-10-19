"""
EXPLAINCODE.PY - GUIA DIDÁTICO DO CÓDIGO PYTHON
Projeto: Sistema de Cadastro de Biblioteca Valdiva Colaço
EMEF Desembargador Pedro de Queiroz
Autora: Xenia Cardoso | Ano: 2026 | Bibliotecária: Ada Melo

Este arquivo documenta detalhadamente todos os conceitos aprendidos durante o
curso e aplicados no desenvolvimento do projeto de software.
"""

# 1. O CONCEITO DE 'pass' NA ETAPA 1
# Em Python, blocos de código (como funções, loops e condicionais) não podem ficar
# vazios. A palavra reservada 'pass' serve como uma instrução nula (no-op).
def cadastrar_livro_placeholder():
    pass  # Permite que o programa seja executado sem erro de sintaxe antes de implementarmos a lógica.


# 2. DICIONÁRIOS COMO ESTRUTURA DE DADOS (ETAPA 2)
# Cada livro é modelado como um dicionário (chave-valor). Dicionários em Python oferecem
# tempo de busca médio O(1) e representam entidades reais com facilidade semântica.
exemplo_livro = {
    "tombo": "0001",
    "titulo": "Caixa de Desejos",
    "autor": "Ana Cristina Melo",
    "estante": "A-1",
    "genero": "Infantojuvenil",
    "ano": 2014,
    "disponivel": "Sim"
}


# 3. LISTAS GLOBAIS E ACERVO EM MEMÓRIA
# Durante a execução, os dicionários de cada livro ficam armazenados em uma lista:
# acervo = [livro_1, livro_2, ...]
# Isso permite iterações sequenciais, ordenações e filtragens rápidas.


# 4. TRATAMENTO DE STRINGS E FILTRAGEM (ETAPA 3)
# Para buscas insensíveis a maiúsculas e minúsculas, usamos o método .lower():
# if termo.lower() in livro['titulo'].lower():
#     encontrados.append(livro)


# 5. ALTERAÇÃO DE ESTADOS (ETAPA 4)
# A chave "disponivel" atua como uma flag de disponibilidade.
# Empréstimo: livro["disponivel"] = "Não"
# Devolução:   livro["disponivel"] = "Sim"


# 6. PERSISTÊNCIA EM ARQUIVOS JSON (ETAPA 5)
# O módulo 'json' serializa as estruturas de dados nativas de Python (listas e dicionários)
# em texto formatado legível entre execuções:
# - json.dump(dados, arquivo, ensure_ascii=False, indent=2): salva em disco em UTF-8.
# - json.load(arquivo): reconstrói a lista em memória ao abrir a aplicação.


# 7. MELHORIAS SUGERIDAS (ETAPA 6)
# - Contador de Acervo: Usando funções geradoras e sum() / len() para métricas instantâneas.
# - Ordenação: Usando acervo.sort(key=lambda x: x['titulo'].lower()) para ordenação alfabética estável.
# - Remoção: Filtragem por exclusão baseada na chave única 'tombo'.
