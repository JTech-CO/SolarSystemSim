# Solar System Simulation

3D 태양계 시뮬레이션 웹 애플리케이션으로, Three.js를 사용하여 구현된 인터랙티브한 태양계 탐험 도구입니다. NASA의 실제 물리 데이터를 기반으로 각 천체의 상세한 물리 지표를 실시간으로 표시합니다.

## 주요 기능

### 🪐 3D 태양계 시각화
- Three.js 기반의 실시간 3D 렌더링
- 태양, 행성(8개), 왜소행성(5개), 혜성 포함
- 행성의 공전 및 자전 애니메이션
- 배경 별 필드 및 태양 글로우 효과

### 📊 상세 물리 지표 대시보드
각 천체를 선택하면 다음 물리 지표를 실시간으로 표시합니다:
- 현재 태양 거리 (AU)
- 현재 공전 속도 (m/s)
- 질량 (kg)
- 평균 반지름 (km)
- 표면 중력가속도 (m/s²)
- 현재 태양 중력가속도 (m/s²)
- 현재 원심가속도 (m/s²)
- 공전 주기 (년/일/시간)
- 자전 주기 (시간/분)
- 지전 각속도 (rad/s)
- 실시간 지전 속도 (rad/s)
- 실시간 자전 가속도 (rad/s²)

### 🌍 다국어 지원
- 한국어/영어 전환 지원
- 모든 UI 텍스트 및 지표 레이블 번역

### 🎨 Retro CAD 스타일 UI
- 레트로 터미널/CAD 인터페이스 디자인
- Monospace 폰트 및 네온 색상 테마
- 반투명 패널 및 글로우 효과

## 기술 스택

- **Three.js** (v0.160.0) - 3D 그래픽 렌더링
- **Vanilla JavaScript (ES6 Modules)** - 모듈식 코드 구조
- **HTML5 / CSS3** - 사용자 인터페이스

## 설치 및 실행

### 요구사항
- 최신 버전의 웹 브라우저 (Chrome, Firefox, Edge, Safari 등)
- 로컬 웹 서버 (파일 시스템 직접 접근 시 CORS 제한으로 인해 필요)

### 실행 방법

1. **브라우저에서 접속**
   - [Sol-System-Sim](<https://jtech-co.github.io/SolarSystemSim/index.html>)

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

### 천체 선택
1. 우측 목록에서 천체 클릭
2. 또는 3D 화면에서 천체 직접 클릭
3. 대시보드에 상세 정보 표시

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
│   │   └── loop.js             # animate 루프 및 Clock 관리
│   ├── data/
│   │   ├── planets.js          # 행성 및 위성 데이터셋 (NASA 물리 데이터)
│   │   ├── dwarfs.js           # 왜소행성 데이터셋
│   │   └── comets.js           # 혜성 데이터셋
│   ├── objects/
│   │   ├── sun.js              # 태양 생성 및 글로우 효과 로직
│   │   ├── planetFactory.js    # 행성/위성 생성 팩토리 함수
│   │   ├── cometSystem.js      # 혜성 이동 로직 및 관리 클래스
│   │   └── starField.js        # 배경 별 생성 로직
│   ├── ui/
│   │   ├── panel.js            # 좌측 정보 패널 및 버튼 이벤트
│   │   ├── planetList.js       # 우측 행성 목록 동적 생성 로직
│   │   └── dashboard.js        # 하단 대시보드 업데이트 및 제어
│   └── utils/
│       ├── textureGenerator.js # 캔버스로 텍스처 생성하는 함수
│       ├── physics.js          # 물리 계산 함수 (공전 속도, 중력 등)
│       ├── i18n.js             # 다국어 지원 시스템
│       └── helpers.js          # 기타 유틸리티 함수
└── assets/                     # 정적 이미지나 모델 파일 (추가 예정)
    └── textures/
```

## 주요 모듈 설명

### 물리 계산 (`js/utils/physics.js`)
- `calculateOrbitalVelocity()`: 공전 속도 계산 (v = √(GM/r))
- `calculateGravitationalAcceleration()`: 태양 중력가속도 계산
- `calculateCentrifugalAcceleration()`: 원심가속도 계산
- `calculateRotationAngularVelocity()`: 자전 각속도 계산
- NASA 표준 물리 상수 사용 (G = 6.67430×10⁻¹¹ m³/kg/s²)

### 다국어 시스템 (`js/utils/i18n.js`)
- 한국어/영어 번역 데이터 관리
- `t()`: 번역 키로 텍스트 가져오기
- `setLanguage()`: 언어 전환
- `onLanguageChange()`: 언어 변경 이벤트 리스너

### 대시보드 (`js/ui/dashboard.js`)
- `focusObject()`: 천체 선택 및 대시보드 표시
- `calculateAllMetrics()`: 모든 물리 지표 계산
- `updateDashboardRealTime()`: 실시간 지표 업데이트
- `refreshDashboard()`: 언어 변경 시 대시보드 새로고침

## 데이터 소스

모든 천체의 물리 데이터는 NASA의 공식 데이터를 기반으로 합니다:
- 질량, 반지름: NASA Solar System Exploration
- 공전 주기, 자전 주기: NASA Planetary Fact Sheets
- 표면 중력가속도: 계산된 값

## 브라우저 호환성

- Chrome (권장)
- Firefox
- Edge
- Safari
- ES6 모듈을 지원하는 모든 최신 브라우저

## 제한사항

- 혜성의 궤도는 타원형이지만 시각화를 위해 원형에 가깝게 표시됩니다.
- 행성 간 상호작용은 고려하지 않으며, 모든 행성이 태양 중심으로만 공전합니다.
- 실시간 자전 가속도는 현재 일정한 회전을 가정하여 0으로 표시됩니다.

## 향후 개선 계획

- [ ] 더 많은 위성 추가
- [ ] 행성 간 상호작용 역학(라그랑주 등) 계산
- [ ] 궤도 궤적 표시 옵션
- [ ] 시간 가속도 조절 기능
- [ ] 현실적인 행성 텍스처
- [ ] 더 많은 언어 지원

## 라이선스

이 프로젝트는 MIT license를 사용하며, 교육 목적으로 제작되었습니다.

## 기여

버그 리포트 및 기능 제안은 언제든지 환영합니다!

---
