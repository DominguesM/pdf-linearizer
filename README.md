# PDF Linearization Demo

Este projeto foi desenvolvido para a Tech Talk #10 da Softplan, apresentando conceitos e implementação prática de linearização de PDFs.

## 📋 Sobre o Projeto

O projeto demonstra a implementação de linearização de PDFs usando FastAPI e React, permitindo:
- Upload de PDFs
- Linearização automática
- Visualização otimizada
- Demonstração em tempo real do carregamento progressivo

## 🚀 Apresentadores

- **Jerson Seling** - Conceitos teóricos e fundamentos da linearização de PDFs
- **Maicon Domingues** - Implementação prática e demonstração de código

## 🛠️ Tecnologias Utilizadas

### Backend
- Python 3.9
- FastAPI
- pikepdf
- uvicorn

### Frontend
- React 18
- react-pdf
- Tailwind CSS
- Node.js 18

### Infraestrutura
- Docker
- Docker Compose

## 📦 Estrutura do Projeto

```
pdf-linearizer/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yaml
└── pdf_storage/
```

## 🚀 Como Executar

1. **Pré-requisitos**
   - Docker
   - Docker Compose

2. **Clone o repositório**
   ```bash
   git clone [URL_DO_REPOSITORIO]
   cd pdf-linearizer
   ```

3. **Crie o diretório para armazenamento dos PDFs**
   ```bash
   mkdir -p pdf_storage
   chmod 777 pdf_storage
   ```

4. **Inicie os containers**
   ```bash
   docker-compose up --build
   ```

5. **Acesse a aplicação**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Documentação API: http://localhost:8000/docs

## 💡 Demonstração

Para demonstrar efetivamente a linearização de PDFs:

1. Use o DevTools do navegador (F12)
2. Vá para a aba "Network"
3. Ative "Disable cache"
4. Compare o carregamento de PDFs linearizados e não linearizados
5. Observe o download progressivo e os status 206 (Partial Content)

## 📊 Resultados

O processo de linearização oferece vários benefícios:
- Carregamento progressivo do PDF
- Melhor experiência do usuário
- Redução no tempo de carregamento inicial
- Otimização para visualização web

## 📄 Licença

Este projeto é para uso interno da Softplan. Todos os direitos reservados.

## 👥 Contribuidores

- Jerson Seling
- Maicon Domingues

## ❗ Notas Importantes

- Este é um projeto demonstrativo desenvolvido para fins educacionais internos
- A implementação atual é otimizada para demonstração e pode precisar de ajustes para uso em produção
- Para PDFs muito grandes, considere implementar um sistema de filas

## 🤝 Suporte

Para suporte ou dúvidas, entre em contato com a equipe de desenvolvimento.

---

Desenvolvido com ❤️ na Softplan