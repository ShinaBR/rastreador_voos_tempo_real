# OpenSky Network API - Informações

## URL Base
https://opensky-network.org/api

## Endpoint Principal
GET /states/all

## Parâmetros para busca por área geográfica:
- lamin: latitude mínima (decimal degrees)
- lomin: longitude mínima (decimal degrees) 
- lamax: latitude máxima (decimal degrees)
- lomax: longitude máxima (decimal degrees)

## Exemplo de URL para buscar voos em uma área:
https://opensky-network.org/api/states/all?lamin=45.8389&lomin=5.9962&lamax=47.8229&lomax=10.5226

## Limitações para usuários anônimos:
- 400 créditos de API por dia
- Apenas dados mais recentes (parâmetro time ignorado)
- Resolução de tempo de 10 segundos

## Estrutura da resposta:
- time: timestamp Unix
- states: array bidimensional com vetores de estado

## Campos do vetor de estado (índices):
0. icao24: endereço único do transponder
1. callsign: indicativo de chamada (8 chars)
2. origin_country: país de origem
3. time_position: timestamp da última atualização de posição
4. last_contact: timestamp do último contato
5. longitude: longitude WGS-84
6. latitude: latitude WGS-84
7. baro_altitude: altitude barométrica em metros
8. on_ground: boolean se está no solo
9. velocity: velocidade sobre o solo em m/s
10. true_track: direção verdadeira em graus
11. vertical_rate: taxa vertical em m/s
12. sensors: IDs dos receptores
13. geo_altitude: altitude geométrica em metros
14. squawk: código do transponder
15. spi: indicador de propósito especial
16. position_source: origem da posição (0=ADS-B, 1=ASTERIX, 2=MLAT, 3=FLARM)
17. category: categoria da aeronave

