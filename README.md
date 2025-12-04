
# Projeto Tukumã - Guia Banco do Brasil para comunidades indígenas

API RESTful em Node.js + Express, seguindo padrão MVC, usada para registrar áudios explicativos associados a serviços.
Suporta upload local ou armazenamento em Backblaze B2 (S3 Compatible).
## Estrutura do Projeto
```
src/
  config/db.js              # Conexão com MongoDB Atlas ou local
  server.js                 # Inicialização da API
  app.js                    # Configuração do Express

  models/
    Audio.js
    Service.js

  controllers/
    audioController.js
    serviceController.js

  routes/
    audioRoutes.js
    serviceRoutes.js

  services/
    storageService.js       # Upload local ou Backblaze B2
  middleware/
    upload.js               # Configuração do Multer
uploads/                    # Somente quando storage = local
```
## Variáveis de Ambiente

A API detecta **automaticamente** se deve usar upload local ou Backblaze B2, baseado nas variáveis abaixo.

Variáveis obrigatórias para rodar o backend
```
PORT=3000
MONGODB_URI=sua_string_do_mongo
```

Para usar armazenamento local (padrão):

- Nada adicional é necessário.

Para usar Backblaze B2 (S3 Compatible):
```
B2_KEY_ID=...
B2_APP_KEY=...
B2_BUCKET=nome-do-bucket
B2_ENDPOINT=https://s3.us-east-005.backblazeb2.com
```


Se TODAS as variáveis acima existirem, o sistema ativa automaticamente o upload no B2.


## Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/ezaucastilho27/Resid-ncia-Banco-do-Brasil-Porto-Digital-backend.git
```

Entre no diretório do projeto

```bash
  cd Resid-ncia-Banco-do-Brasil-Porto-Digital-backend
  cd kaiapo-audio-api-full
```

Criar .env
```
touch .env
```

Instalar dependências
```
npm install
```

Rodar servidor
```
npm run dev
```

## Documentação da API


### Áudios
#### Upload de áudio
```
POST /api/audios
```
| Parâmetro |	Tipo | 	Descrição |
| :--------- | :--------- | :---------------------------------- |
| name |	string |	Nome da pessoa |
| email	| string | 	E-mail
| agreePrivacy|	boolean|	Se aceitou a política
|community| 	string| 	Ex: "kaiapo", "kurinin"
| serviceId| 	string| 	ID do serviço relacionado
| audio	| file| 	Arquivo de áudio (fieldname: audio)|

#### Listagem de áudios
```
GET /api/audios
```
#### Listagem de áudios por serviço
```
GET /api/audios/:serviceId
```
#### Detalhes de áudio
```
GET /api/audio/:id
```
#### Streaming de áudio
```
GET /api/url/:filename
```

### Serviços
#### Adicionar serviço
```
POST /api/services
```
| Parâmetro | Tipo | Descrição |
| :------- | :-------- | :-------------------- |
| name | string | Nome do tutorial
| icon | string | Ícone de tutorial
| videoURL | string | Url do vídeo tutorial |

#### Listar todos os tutoriais
```
GET /api/services
```
#### Atualizar informações de Serviço
```
PATCH /api/services/:serviceId
```
#### Remover tutorial específico
```
DELETE /api/services/:serviceId
```
## Docker (local testing)
Subir com Docker Compose (vai iniciar MongoDB + API):
```
docker-compose up --build
```
A API ficará disponível em http://localhost:3000

## Testes automatizados (Jest + Supertest)
Garanta que um MongoDB de teste esteja rodando localmente (padrão: mongodb://127.0.0.1:27017).
Rode:
```
npm install
```
```
npm test
```
Os testes utilizam um banco kayapo_audio_test e um arquivo de áudio de exemplo em tests/dummy.mp3.

## Notas finais
Para fins de desenvolvimento inicial usamos armazenamento local (uploads/). Quando quiser migrar para S3 basta preencher variáveis no .env e o serviço fará upload ao S3 automaticamente.