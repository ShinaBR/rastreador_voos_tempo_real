# 🛩️ Rastreador de Voos em Tempo Real

## 📋 Descrição
Site que mostra aviões voando em tempo real baseado na localização do usuário ou busca por nome de lugar, com informações detalhadas de origem e destino dos voos.

## 🚀 Funcionalidades
- ✅ **Geolocalização automática**: Detecta sua localização atual
- ✅ **Busca por local**: Digite qualquer cidade ou local do mundo
- ✅ **Dados em tempo real**: Informações atualizadas da OpenSky Network
- ✅ **Interface moderna**: Design responsivo e intuitivo
- ✅ **Informações detalhadas**: Altitude, velocidade, direção, coordenadas, etc.

## 📁 Arquivos Incluídos
- `index.html` - Página principal do site
- `style.css` - Estilos e design responsivo
- `script.js` - Funcionalidades JavaScript
- `api_info.md` - Documentação da API OpenSky
- `test_results.md` - Resultados dos testes realizados

## 🔧 Como Usar

### Opção 1: Servidor Local Simples
1. Extraia o arquivo ZIP
2. Abra o terminal/prompt na pasta do projeto
3. Execute: `python -m http.server 8000` (Python 3) ou `python -m SimpleHTTPServer 8000` (Python 2)
4. Acesse: http://localhost:8000

### Opção 2: Abrir Diretamente no Navegador
1. Extraia o arquivo ZIP
2. Abra o arquivo `index.html` diretamente no navegador
3. **Nota**: Algumas funcionalidades podem não funcionar devido a restrições CORS

### Opção 3: Usar Live Server (VS Code)
1. Instale a extensão "Live Server" no VS Code
2. Abra a pasta do projeto no VS Code
3. Clique com botão direito em `index.html` → "Open with Live Server"

## 🌐 APIs Utilizadas
- **OpenSky Network**: Dados de voos em tempo real (gratuita)
- **OpenStreetMap Nominatim**: Geocodificação para busca por local (gratuita)
- **Geolocation API**: Localização do navegador (nativa)

## 📱 Compatibilidade
- ✅ Chrome, Firefox, Safari, Edge
- ✅ Desktop e Mobile
- ✅ Tablets e smartphones
- ⚠️ Requer conexão com internet

## 🔒 Privacidade
- Não coleta dados pessoais
- Localização processada apenas no navegador
- Não armazena informações do usuário

## 🛠️ Tecnologias
- HTML5
- CSS3 (Grid, Flexbox, Animations)
- JavaScript ES6+ (Fetch API, Async/Await)
- APIs REST

## 📊 Dados Exibidos
Para cada voo encontrado:
- Indicativo de chamada (ex: TAM3352)
- País de origem
- Status (Em Voo/No Solo)
- Altitude em metros
- Velocidade em km/h
- Direção em graus
- Taxa vertical (subida/descida)
- Coordenadas GPS
- Tipo de aeronave
- Código ICAO
- Última atualização

## 🎯 Exemplo de Uso
1. Abra o site
2. Clique em "Usar Minha Localização" OU digite uma cidade
3. Aguarde o carregamento
4. Veja os voos em tempo real na sua região!

## 🔧 Solução de Problemas
- **Nenhum voo encontrado**: Tente uma área metropolitana maior
- **Erro de localização**: Permita acesso à localização no navegador
- **Erro de API**: Verifique sua conexão com internet

## 📞 Suporte
Este é um projeto demonstrativo usando APIs públicas gratuitas. Para uso comercial, considere APIs pagas com mais recursos e limites maiores.

---
**Desenvolvido com ❤️ usando tecnologias web modernas**

