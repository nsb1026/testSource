# Project: Jira-Like Issue Tracker (Vue 3) - High Fidelity Prototype

이 문서는 프로젝트의 설계 원칙, 최신 디자인 테마 및 구현된 고도화 기능을 기록합니다.

## 1. 개요 (Overview)
- **목적**: Jira의 사용자 경험을 완벽하게 재현한 엔터프라이즈급 이슈 관리 시스템 프로토타입.
- **기술 스택**: Vue 3 (Composition API), Axios (보안 강화 버전), @vueup/vue-quill (웹 에디터).
- **디자인 테마**: **Professional Blue Theme** (Atlassian Pacific Blue 기반). 모든 회색 톤을 제거하고 신뢰감 있는 푸른색 계열의 변수(`--primary-blue`, `--soft-blue` 등)로 통일.

## 2. 주요 아키텍처 및 고도화 기능
### A. 레이아웃 및 테마 (Layout & Theme)
- **전역 블루 테마**: `main.css`에 정의된 블루 변수를 사용하여 사이드바, 헤더, 테이블, 입력 필드까지 일관된 톤앤매너 적용.
- **TopBar**: 작업장 아이콘(🏢), 사용자 세션(홍길동님), KO/EN 언어 토글, 로그아웃 포함.
- **Sidebar**: Issue, Models, 작업장 상세 정보 메뉴 구성. 활성 메뉴에 선명한 파란색 강조선 적용.

### B. 이슈 및 모델 관리 (Issue & Model)
- **유형 분기**: `DEFECT`(문제점) 및 `TEST_ITEM`(시험의뢰) 유형에 따라 상세 UI 및 입력 폼 자동 전환.
- **모달 기반 CRUD**: 모든 생성 및 수정은 `IssueFormModal.vue` 레이어를 통해 처리. 수정 모드 시 '유형' 및 '의뢰일자' 변경 불가 로직 적용.
- **커스텀 상태 선택기**: To Do, In Progress, Done 각각 고유 색상(블루/그린/그레이)과 아이콘이 적용된 커스텀 드롭다운.
- **페이징 (Pagination)**: Spring Boot `Page<T>` 객체 구조 준수. 페이지당 30개 항목 표시, 하단 네비게이션을 통한 동적 로딩.

### C. 작업장 상세 정보 (Workspace Details)
- **아코디언 구조**: 모든 섹션(기본정보, 결재, 멤버, 모델)에 접기/펼치기 기능 적용. 파란색 톤의 헤더와 회전 아이콘 적용.
- **정밀 그리드**: 결재 정보 및 멤버 정보를 정돈된 테이블 형태로 표시.
- **모델 상세 레이어**: 등록 모델 그리드에서 모델 코드를 클릭하면 별도의 상세 정보 팝업(Modal) 표시.

## 3. 핵심 비즈니스 로직 및 제약 사항
- **데이터 무결성**: 수정 모드(`edit`) 진입 시 유형 변경을 차단하여 데이터 일관성 유지.
- **웹 에디터**: Quill을 사용하여 Rich Text 및 Base64 이미지 지원.
- **파일 첨부**: Innorix 모듈 연동을 위한 전용 컨테이너 공간(`innorix-box`) 확보.

## 4. 파일 역할 (File Manifest)
- `src/App.vue`: 메뉴 전환, 페이징 상태, 모달 상태 및 전역 데이터 로드 제어.
- `src/api/issueService.js`: Axios 기반 Spring Boot 연동 규격(Pageable) 처리 및 Mock 데이터 관리.
- `src/components/issue/`: 이슈 리스트, 상세, 폼 모달, 사용자 검색 모달.
- `src/components/workspace/`: 작업장 상세 정보 (아코디언 및 그리드).
- `src/assets/main.css`: 전역 블루 테마 변수 및 공통 스타일 정의.

## 5. 데이터베이스 스키마 (Database Schema)
본 프로토타입 시스템 연동을 위해 필요한 최소한의 테이블 구조입니다.

```sql
-- 사용자 테이블
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50),
    dept VARCHAR(100),
    email VARCHAR(255)
);

-- 워크스페이스 테이블
CREATE TABLE workspaces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- 모델 테이블
CREATE TABLE models (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workspace_id INT,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    owner VARCHAR(100),
    description TEXT,
    created_date DATE,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
);

-- 이슈 테이블
CREATE TABLE issues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workspace_id INT,
    type ENUM('DEFECT', 'TEST_ITEM') NOT NULL,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'To Do',
    importance CHAR(1),
    frequency VARCHAR(50),
    model_info VARCHAR(255),
    assignee_id VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id),
    FOREIGN KEY (assignee_id) REFERENCES users(id)
);
```

---
*Last Updated: 2024-04-28 (Added DB Schema & External Initializer)*
