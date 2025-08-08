# n8n-nodes-arivo

[![en](https://img.shields.io/badge/lang-en-blue.svg)](https://github.com/arivo-crm/n8n-nodes-arivo/blob/main/README.md)
[![pt-br](https://img.shields.io/badge/lang-pt--br-green.svg)](https://github.com/arivo-crm/n8n-nodes-arivo/blob/main/README.pt-BR.md)

Este é um nó da comunidade n8n para o Arivo CRM.

_Arivo CRM_ é um CRM online desenvolvido para pequenas e médias empresas organizarem contatos e oportunidades.

[n8n](https://n8n.io/) é uma plataforma de automação de workflows com [licença fair-code](https://docs.n8n.io/reference/license/).

[Instalação](#instalação)  
[Operações](#operações)  
[Credenciais](#credenciais)  
[Compatibilidade](#compatibilidade)  
[Uso](#uso)  
[Recursos](#recursos)  
[Licença](#licença)

## Instalação

Para instalar o nó do Arivo CRM em uma instância n8n self-hosted:
1. Abra "Settings" (no menu ao lado do seu nome de usuário)
2. Navegue até "Community nodes"
3. Clique em "Install"
4. Preencha "npm Package Name" com "n8n-nodes-arivo"
5. Marque "I understand the risks of installing unverified code from a public source."
6. Clique em "Install"

Ou siga o [guia de instalação](https://docs.n8n.io/integrations/community-nodes/installation/) na documentação dos nós da comunidade do n8n.

## Operações

### Nó de Ação

- Contato (Pessoa)
  - Criar
  - Obter
  - Obter Todos
  - Atualizar
  - Excluir
- Contato (Empresa)
  - Criar
  - Obter
  - Obter Todos
  - Atualizar
  - Excluir
- Oportunidade
  - Criar
  - Obter
  - Obter Todas
  - Atualizar
  - Excluir
- Anotação
  - Criar
  - Obter
  - Obter Todas
  - Atualizar
  - Excluir
- Atividade
  - Criar
  - Obter
  - Obter Todas
  - Atualizar
  - Excluir
- Produto
  - Criar
  - Obter
  - Obter Todos
  - Atualizar
  - Excluir
- Categoria de Produto
  - Criar
  - Obter
  - Obter Todas
  - Atualizar
  - Excluir
- Arquivo
  - Obter
  - Obter Todos
  - Excluir
- Registro Personalizado
  - Criar
  - Obter
  - Obter Todos
  - Atualizar
  - Excluir

### Nó de Gatilho

- Pessoa Criada
- Pessoa Atualizada
- Pessoa Excluída
- Empresa Criada
- Empresa Atualizada
- Empresa Excluída
- Oportunidade Criada
- Oportunidade Atualizada
- Oportunidade Excluída
- Anotação Criada
- Anotação Atualizada
- Anotação Excluída
- Atividade Criada
- Atividade Atualizada
- Atividade Finalizada
- Atividade Marcada como Não Finalizada
- Atividade Excluída

## Credenciais

Para usar este nó, você precisa configurar as credenciais da API do Arivo:

### Pré-requisitos
1. Cadastre-se no Arivo CRM em [arivo.com.br](https://arivo.com.br)
2. Faça login na sua conta do Arivo CRM
3. Navegue até o gerenciamento de chaves de API em [arivo.com.br/api_keys](https://arivo.com.br/api_keys)
4. Gere uma nova chave de API para a integração com n8n

### Configuração
1. No n8n, crie uma nova credencial do tipo "Arivo API"
2. Insira sua chave de API no campo "Chave da API"
3. Teste a conexão para verificar se as credenciais funcionam corretamente

A chave da API será usada para autenticação usando o método Token conforme descrito na [documentação da API do Arivo](https://arivo.docs.apiary.io).

## Compatibilidade

Este pacote foi testado com n8n versões recentes e requer Node.js >= 20.15.

## Uso

### Gerenciamento de Contatos
- Crie e gerencie contatos do tipo pessoa e empresa
- Adicione telefones, e-mails e endereços
- Configure campos personalizados
- Associe contatos a oportunidades e atividades

### Oportunidades de Vendas
- Crie e acompanhe oportunidades de vendas
- Adicione produtos e serviços às oportunidades
- Configure funis de vendas personalizados
- Monitore o progresso através das etapas do funil

### Atividades e Tarefas
- Agende e gerencie atividades
- Configure tarefas recorrentes
- Associe atividades a contatos e oportunidades
- Marque atividades como concluídas

### Automação com Webhooks
- Configure gatilhos para eventos do CRM
- Automatize workflows baseados em mudanças de dados
- Receba notificações em tempo real
- Integre com outros sistemas

## Recursos

* [Documentação dos nós da comunidade n8n](https://docs.n8n.io/integrations/community-nodes/)
* [Documentação da API do Arivo](https://arivo.docs.apiary.io)
* [Site oficial do Arivo CRM](https://arivo.com.br)

## Suporte

Para obter suporte, você pode:

- Abrir uma issue no [repositório GitHub](https://github.com/arivo-crm/n8n-nodes-arivo)
- Entrar em contato através do e-mail: contato@arivo.com.br
- Consultar a [documentação da API do Arivo](https://arivo.docs.apiary.io)

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
