Sistema de Limpeza de Hotel
Uma aplicação web para gerenciar atribuições de limpeza de quartos em um hotel.
Configuração

Crie a estrutura de pastas como mostrado acima.
Coloque todos os arquivos em seus diretórios respectivos.
Abra index.html em um navegador ou use a extensão Live Server do VS Code para desenvolvimento.

Recursos

Aba Registrar: Insira o número de camareiras, nomes e quartos que não precisam de limpeza. Atribui quartos de forma equilibrada e salva com data/hora.
Aba Registros: Visualize, edite, exclua ou imprima registros. Baixe todos como CSV. Imprima todos de uma vez.
Design Responsivo: Interface limpa e profissional com Tailwind CSS.
Armazenamento de Dados: Usa localStorage para persistência de dados.

Configuração de Quartos
Quartos pré-definidos:

1º Andar: 101-122
2º Andar: 201-219
3º Andar: 301-314
4º Andar: 401-416
5º Andar: 501-512, 514-516

Lógica de Distribuição

Para andares 1-3: Combinados em uma lista, filtrados e distribuídos em blocos consecutivos o mais equilibrado possível entre as camareiras.
Para andares 4-5: Quartos distribuídos usando round-robin (alternando atribuição para camareiras).

Uso

Na aba Registrar, insira o número de camareiras e seus nomes.
Especifique quartos que não precisam de limpeza (separados por vírgula).
Envie para atribuir quartos e salvar o registro.
Na aba Registros, visualize todos, edite, exclua ou imprima registros individuais, baixe todos como CSV ou imprima todos.

Notas

Substitua assets/images/logo.png pelo logo do seu hotel.
Usa localStorage, então os dados persistem apenas no navegador usado.
Certifique-se de que os quartos inseridos sejam válidos (correspondam aos pré-definidos).
Listas de quartos são exibidas em faixas compactas e ordenadas numericamente.
Edição substitui o registro existente sem duplicar.
Impressão de todos formata cada registro em página separada, se necessário.
