# Solar System Simulation

3D 태양계 시뮬레이션 웹 애플리케이션으로, Three.js를 사용하여 구현된 인터랙티브한 태양계 탐험 도구입니다. NASA의 실제 물리 데이터를 기반으로 각 천체의 상세한 물리 지표를 실시간으로 표시하며, 타원 궤도 역학을 정확하게 시뮬레이션합니다. [현재 로직 꼬여서 갑자기 멈췄는데 멈춘 위치 조사 중.]

## 주요 기능

### 🪐 3D 태양계 시각화
- Three.js 기반의 실시간 3D 렌더링
- 태양, 행성(8개), 왜소행성(5개), 혜성 포함
- **타원 궤도 공전 시스템**: 케플러 방정식을 사용한 정확한 타원 궤도 시뮬레이션
- **행성별 실제 자전 속도**: 각 행성의 고유 자전 주기에 맞춘 자전 애니메이션
- 배경 별 필드 및 태양 글로우 효과

### 📊 상세 물리 지표 대시보드 (실시간 변동)
각 천체를 선택하면 다음 물리 지표를 **실시간으로 변동하며** 표시합니다:
- **현재 태양 거리 (AU)**: 타원 궤도에 따라 실시간 변동
- **현재 공전 속도 (m/s)**: vis-viva 방정식 기반, 거리에 따라 실시간 변동
- 질량 (kg)
- 평균 반지름 (km)
- 표면 중력가속도 (m/s²)
- **현재 태양 중력가속도 (m/s²)**: 거리에 따라 실시간 변동
- **현재 원심가속도 (m/s²)**: 공전 속도와 거리에 따라 실시간 변동
- 공전 주기 (년/일/시간)
- 자전 주기 (시간/분)
- 지전 각속도 (rad/s)
- **실시간 지전 속도 (rad/s)**: mesh 회전을 추적하여 실시간 계산
- **실시간 자전 가속도 (rad/s²)**: 각속도 변화를 추적하여 실시간 계산

### 🌍 다국어 지원
- 한국어/영어 전환 지원
- 모든 UI 텍스트 및 지표 레이블 번역
- 언어 전환 버튼으로 즉시 전환 가능

### 🎨 Retro CAD 스타일 UI
- 레트로 터미널/CAD 인터페이스 디자인
- Monospace 폰트 및 네온 색상 테마
- 반투명 패널 및 글로우 효과
- 실시간 데이터 표시를 위한 최적화된 레이아웃

## 기술 스택

- **Three.js** (v0.160.0) - 3D 그래픽 렌더링
- **Vanilla JavaScript (ES6 Modules)** - 모듈식 코드 구조
- **HTML5 / CSS3** - 사용자 인터페이스

## 설치 및 실행

### 요구사항
- 최신 버전의 웹 브라우저 (Chrome, Firefox, Edge, Safari)
- 로컬 웹 서버 (파일 시스템 직접 접근 시 CORS 제한으로 인해 필요)

### 실행 방법

1. **브라우저에서 접속**
   - [Sol-System-Sim](https://jtech-co.github.io/SolarSystemSim/index.html)

2. **로컬 실행 (선택사항)**
   ```bash
   # Python 사용 시
   python -m http.server 8000
   
   # Node.js 사용 시
   npx http-server
   ```
   그 후 `http://localhost:8000` 접속

## 사용 방법

### 기본 조작
- **왼쪽 클릭 + 드래그**: 시점 회전
- **오른쪽 클릭 + 드래그**: 시점 이동 (Pan)
- **스크롤 휠**: 확대/축소

### UI 요소
- **좌측 상단 패널**: 제어 버튼 (Reset, Top View, Language Toggle)
- **우측 상단 패널**: 천체 목록 (행성, 왜소행성, 혜성)
  - 목록 항목 클릭 시 해당 천체로 이동
- **하단 대시보드**: 선택한 천체의 상세 물리 지표
  - 천체 클릭 시 자동 표시
  - × 버튼으로 닫기
  - **실시간 업데이트**: 선택한 천체의 지표가 공전/자전에 따라 실시간으로 변동

### 천체 선택
1. 우측 목록에서 천체 클릭
2. 또는 3D 화면에서 천체 직접 클릭
3. 대시보드에 상세 정보 표시 (실시간 변동)

## 프로젝트 구조

```
Solar System Simulation/
├── index.html                  # 메인 HTML (진입점)
├── css/
│   ├── main.css                # 전역 스타일 및 리셋
│   ├── ui.css                  # 패널, 목록, 대시보드 등 UI 스타일
│   └── loader.css              # 로딩 화면 및 애니메이션 스타일
├── js/
│   ├── main.js                 # 앱 초기화 및 메인 루프 (Entry Point)
│   ├── config.js               # 전역 설정값 (CONFIG 객체)
│   ├── core/
│   │   ├── scene.js            # Three.js Scene, Camera, Renderer 설정
│   │   ├── controls.js         # OrbitControls 및 입력 이벤트 처리
│   │   └── loop.js             # animate 루프, 타원 궤도 업데이트, 자전 처리
│   ├── data/
│   │   ├── planets.js          # 행성 및 위성 데이터셋 (NASA 물리 데이터 + 이심률)
│   │   ├── dwarfs.js           # 왜소행성 데이터셋 (이심률 포함)
│   │   └── comets.js           # 혜성 데이터셋
│   ├── objects/
│   │   ├── sun.js              # 태양 생성 및 글로우 효과 로직
│   │   ├── planetFactory.js    # 행성/위성 생성 팩토리 (타원 궤도 초기화)
│   │   ├── cometSystem.js      # 혜성 이동 로직 및 관리 클래스
│   │   └── starField.js        # 배경 별 생성 로직
│   ├── ui/
│   │   ├── panel.js            # 좌측 정보 패널 및 버튼 이벤트
│   │   ├── planetList.js       # 우측 행성 목록 동적 생성 로직
│   │   └── dashboard.js        # 하단 대시보드 업데이트 및 제어 (실시간 계산)
│   └── utils/
│       ├── textureGenerator.js # 캔버스로 텍스처 생성하는 함수
│       ├── physics.js          # 물리 계산 함수 (타원 궤도, 케플러 방정식 등)
│       ├── i18n.js             # 다국어 지원 시스템
│       └── helpers.js          # 기타 유틸리티 함수
└── assets/                     # 정적 이미지나 모델 파일 (추가 예정)
    └── textures/
```

## 주요 모듈 설명

### 물리 계산 (`js/utils/physics.js`)
- **원형 궤도 계산**:
  - `calculateOrbitalVelocity()`: 공전 속도 계산 (v = √(GM/r))
  - `calculateGravitationalAcceleration()`: 태양 중력가속도 계산
  - `calculateCentrifugalAcceleration()`: 원심가속도 계산
  
- **타원 궤도 계산**:
  - `calculateEllipticalDistance()`: 타원 궤도에서 현재 거리 계산 (r = a(1-e²)/(1+e·cos(ν)))
  - `calculateOrbitalVelocityElliptical()`: vis-viva 방정식 기반 공전 속도 (v = √(GM(2/r - 1/a)))
  - `solveKeplerEquation()`: 케플러 방정식 해법 (Newton 방법)
  - `calculateTrueAnomaly()`: 평균 근점이각에서 진근점이각 계산
  - `calculateMeanAnomaly()`: 시간으로부터 평균 근점이각 계산
  
- **자전 계산**:
  - `calculateRotationAngularVelocity()`: 자전 각속도 계산 (ω = 2π/T)
  
- NASA 표준 물리 상수 사용 (G = 6.67430×10⁻¹¹ m³/kg/s²)

### 타원 궤도 시스템 (`js/objects/planetFactory.js`, `js/core/loop.js`)
- 각 행성/위성에 이심률(eccentricity) 기반 타원 궤도 파라미터 저장
- 케플러 방정식을 사용한 정확한 궤도 위치 계산
- 실시간 평균 근점이각 업데이트 및 진근점이각 변환
- 타원 궤도에 따른 거리 및 공전 속도 실시간 계산

### 자전 시스템 (`js/core/loop.js`)
- 각 행성의 실제 자전 주기(`rotationPeriod`) 기반 자전 속도 적용
- 역행 자전 지원 (금성, 천왕성, 명왕성 등)
- 위성에도 동일한 자전 시스템 적용

### 대시보드 (`js/ui/dashboard.js`)
- `focusObject()`: 천체 선택 및 대시보드 표시
- `calculateAllMetrics()`: 모든 물리 지표 계산 (타원 궤도 거리/속도 포함)
- `updateDashboardRealTime()`: 실시간 지표 업데이트 (매 프레임 호출)
- **실시간 자전 속도/가속도**: mesh의 `rotation.y` 값을 추적하여 계산
- `refreshDashboard()`: 언어 변경 시 대시보드 새로고침

### 다국어 시스템 (`js/utils/i18n.js`)
- 한국어/영어 번역 데이터 관리
- `t()`: 번역 키로 텍스트 가져오기
- `setLanguage()`: 언어 전환
- `onLanguageChange()`: 언어 변경 이벤트 리스너

## 물리 시뮬레이션 상세

### 타원 궤도 역학
- **케플러 방정식**: E - e·sin(E) = M (평균 근점이각 → 이심 근점이각)
- **타원 궤도 거리**: r = a(1-e²)/(1+e·cos(ν))
- **Vis-viva 방정식**: v = √(GM(2/r - 1/a))
- 모든 행성과 위성에 NASA 실제 이심률 적용

### 자전 역학
- 각 행성의 실제 자전 주기 기반 각속도 계산
- 역행 자전 지원 (음수 rotationPeriod)
- 실시간 mesh 회전 추적을 통한 각속도/각가속도 계산

## 데이터 소스

모든 천체의 물리 데이터는 NASA의 공식 데이터를 기반으로 합니다:
- **질량, 반지름**: NASA Solar System Exploration
- **공전 주기, 자전 주기**: NASA Planetary Fact Sheets
- **이심률**: NASA 궤도 요소 데이터
- **표면 중력가속도**: 계산된 값

## 브라우저 호환성

- Chrome (권장)
- Firefox
- Edge
- Safari
- ES6 모듈을 지원하는 모든 최신 브라우저

## 제한사항

- 혜성의 궤도는 타원형이지만 시각화를 위해 단순화된 궤도로 표시됩니다.
- 행성 간 상호작용은 고려하지 않으며, 모든 행성이 태양 중심으로만 공전합니다.
- 위성은 행성 중심 좌표계에서만 공전하며, 태양의 직접적인 영향은 고려하지 않습니다.
- 궤도면 경사각은 현재 0도로 고정되어 있습니다 (모든 궤도가 동일 평면).

## 향후 개선 계획

- [ ] 더 많은 위성 추가
- [ ] 행성 간 상호작용 역학(라그랑주 등) 계산
- [ ] 궤도 궤적 표시 옵션
- [ ] 시간 가속도 조절 기능
- [ ] 궤도면 경사각 구현
- [ ] 현실적인 행성 텍스처
- [ ] 더 많은 언어 지원

## 라이선스

이 프로젝트는 MIT 라이선스를 기반하며, 교육 목적으로 제작되었습니다.

## 기여

버그 리포트 및 기능 제안은 언제든지 환영합니다!

---

**즐거운 태양계 탐험 되세요! 🚀**
