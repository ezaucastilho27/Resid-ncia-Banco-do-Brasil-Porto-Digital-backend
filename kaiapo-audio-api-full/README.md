#Residência "Kaiapo"

Projeto exemplo de uma API RESTful em Node.js + Express no padrão MVC para gerenciar uploads de áudios explicativos.
Inclui suporte a armazenamento local e integração opcional com AWS S3.

## Estrutura
- src/
  - config/db.js         # Conexão com MongoDB
  - server.js            # Inicialização do servidor
  - app.js               # Configurações do Express
  - models/Audio.js
  - controllers/audioController.js
  - routes/audioRoutes.js
  - services/storageService.js
  - middleware/upload.js

## Atributos esperados no upload (form-data)
- name: string            (nome da pessoa)
- email: string
- agreePrivacy: boolean   (true/false)
- community: string       ("kaiapo", "kurinin", ...)
- service: string         (serviço explicado)
- audio: file             (arquivo de áudio, field name: "audio")

## Como usar (local)
1. Copie `.env.example` para `.env` e ajuste `MONGODB_URI` (e AWS se for usar S3).
2. Instale dependências:
   ```
   npm install
   ```
3. Rode o servidor:
   ```
   npm run dev
   ```
4. Endpoints úteis:
   - `POST /api/audios` - upload (multipart/form-data)
   - `GET /api/audios` - listar
   - `GET /api/audios/:id` - detalhes
   - `GET /api/audios/url/:filename` - streaming (se local) or redirect (if S3)

## Exemplo de CURL para upload
```
curl -X POST http://localhost:3000/api/audios \
  -F "name=Fulano" \
  -F "email=fulano@example.com" \
  -F "agreePrivacy=true" \
  -F "community=kaiapo" \
  -F "service=Explica tal coisa" \
  -F "audio=@/caminho/para/audio.mp3"
```

## Observações
- O projeto vem com implementação de armazenamento local por padrão (`uploads/`).
- Para usar S3, preencha as variáveis AWS no .env e a service usará S3 automaticamente.
- Código escrito com foco em facilidade de testes e entendimento. Ajuste validações conforme necessário.

## Docker (local testing)
Subir com Docker Compose (vai iniciar MongoDB + API):
```
docker-compose up --build
```
A API ficará disponível em http://localhost:3000

## Testes automatizados (Jest + Supertest)
1. Garanta que um MongoDB de teste esteja rodando localmente (padrão: mongodb://127.0.0.1:27017).
2. Rode:
```
npm install
npm test
```
Os testes utilizam um banco `kaiapo_audio_test` e um arquivo de áudio de exemplo em `tests/dummy.mp3`.

## Notas finais
- Para fins de desenvolvimento inicial usamos armazenamento local (`uploads/`). Quando quiser migrar para S3 basta preencher variáveis no `.env` e o serviço fará upload ao S3 automaticamente.
