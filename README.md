# docker-compose setting

- 실행

```bash
docker compose -f /path/to/docker-compose.yaml up -d
```

- 설치된 플러그인 (`services.grafana.environment`)

  - marcusolsson-dynamictext-panel
  - volkovlabs-variable-panel
  - yesoreyeram-infinity-datasource
  - marcusolsson-json-datasource
  - grafana-clock-panel

### 빌드 파일 설정 (`services.grafana.volumes`)

#### `./datasources` 디렉토리 (Data API)

> Data Source 프로비저닝 파일

- 사용할 API 또는 불러와서 사용할 데이터로, 프로비저닝 파일 형식은 `.yaml`

  - 아래와 같이 해당 Data Source가 프로비저닝 스크립트를 지원해야 사용 가능 (추측)

  ![infinity][infinity]
  _Infinity Data Source Main 페이지_

  - 위의 이미지에서 `Privisioning Script` 클릭 시, 아래와 같은 코드 생성

    ```yaml
    apiVersion: 1
    datasources:
      - id: 1
        uid: "bb1b1082-6dee-4d90-9ec8-1cf29417935f"
        orgId: 1
        name: "Weather"
        type: "yesoreyeram-infinity-datasource"
        url: "__IGNORE_URL__"
        basicAuth: false
        basicAuthUser: ""
        isDefault: true
        jsonData:
          allowedHosts:
            - "https://api.openweathermap.org/data/2.5/weather"
          apiKeyKey: "appid"
          apiKeyType: "query"
          auth_method: "apiKey"
          customHealthCheckEnabled: true
          customHealthCheckUrl: "https://api.openweathermap.org/data/2.5/weather?lat=35.4500961303711&lon=126.42821502685547"
          global_queries: []
          oauthPassThru: false
        readOnly: true
        apiVersion: ""
        secureJsonData:
          apiKeyValue: "xxxxxxx" # 해당 API Key (Secret 처리)
    ```

- 도커 이미지 내 디렉토리 경로

  ```
  /etc/grafana/provisioning/datasources/
  ```

#### `./dashboards` 디렉토리 (Visualization)

> Dashboards 프로비저닝 파일

![export][export]
_해당 대시보드에서 `Share` -> `Export` (`Export for sharing externally` : 체크 필요)_

- 실제 출력되는 대시보드로, 해당 디렉토리에 저장해야 하는 대시보드 프로비저닝 파일 형식은 `.json`

  > `dashboards.yaml`의 경우, 추가적인 대시보드 설정

- 도커 이미지 내 디렉토리 경로

  ```
  /etc/grafana/provisioning/dashboards/
  ```

#### `./grafana.ini`

- 기존의 설정 백업 파일 (커스텀해서 적용 必)

#### `./img/grafana_icon.svg`

- 기존 그라파나 아이콘 덮어쓰기 위한 이미지 (파일명 동일하게 적용 必)

#### `./img/fav32.png`

- 기존 파비콘 덮어쓰기 위한 이미지 (파일명 동일하게 적용 必)

[export]: ./img/readme/export.png
[infinity]: ./img/readme/infinity.png
