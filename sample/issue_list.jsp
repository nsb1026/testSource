<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Jira-Like Issue Tracker (JSP Sample)</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- TopBar Area -->
    <header class="top-bar">
        <div class="logo">
            <span class="workspace-icon">🏢</span>
            <span class="workspace-name">차세대 웹 고도화 프로젝트</span>
        </div>
        <div class="user-session">
            <span class="user-name">홍길동님</span>
            <div class="avatar">홍</div>
        </div>
    </header>

    <div class="main-container">
        <!-- Sidebar Area -->
        <aside class="sidebar">
            <nav>
                <ul>
                    <li>
                        <a href="#" class="menu-item">
                            <span class="menu-icon">📊</span>
                            <span class="menu-label">대시보드</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="menu-item active">
                            <span class="menu-icon">🎫</span>
                            <span class="menu-label">이슈</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="menu-item">
                            <span class="menu-icon">📱</span>
                            <span class="menu-label">모델 관리</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="menu-item">
                            <span class="menu-icon">ℹ️</span>
                            <span class="menu-label">작업장 정보</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>

        <!-- Main Content Area -->
        <div class="content-area">
            
            <!-- Issue List (Left Panel) -->
            <div class="issue-list-container">
                <div class="list-header">
                    <div class="title-area">
                        <h2 style="font-size: 16px; font-weight: 700;">이슈 (5)</h2>
                    </div>
                    <button class="create-btn">+ 만들기</button>
                </div>

                <div class="list-content">
                    <!-- Sample Issue 1 -->
                    <div class="issue-card selected">
                        <div class="issue-title">로그인 화면 버튼 클릭 안됨</div>
                        <div style="font-size: 11px; color: var(--primary-blue); font-weight: 700;">Web-v1.0</div>
                        <div class="issue-meta">
                            <span class="status-tag progress">In Progress</span>
                            <span style="font-size: 11px; color: #8993a4;">ISSUE-1</span>
                        </div>
                    </div>

                    <!-- Sample Issue 2 -->
                    <div class="issue-card">
                        <div class="issue-title">API 성능 테스트 의뢰</div>
                        <div style="font-size: 11px; color: var(--primary-blue); font-weight: 700;">Backend-Node</div>
                        <div class="issue-meta">
                            <span class="status-tag todo">To Do</span>
                            <span style="font-size: 11px; color: #8993a4;">ISSUE-2</span>
                        </div>
                    </div>

                    <!-- Sample Issue 3 -->
                    <div class="issue-card">
                        <div class="issue-title">모바일 레이아웃 깨짐 현상</div>
                        <div style="font-size: 11px; color: var(--primary-blue); font-weight: 700;">Web-v1.0</div>
                        <div class="issue-meta">
                            <span class="status-tag todo">To Do</span>
                            <span style="font-size: 11px; color: #8993a4;">ISSUE-3</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Issue Detail (Right Panel) -->
            <div class="issue-detail-container">
                <div class="detail-header">
                    <h1>로그인 화면 버튼 클릭 안됨</h1>
                </div>

                <div class="detail-body">
                    <div class="section-title">기본 정보</div>
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                        <tr>
                            <td style="padding: 8px; color: #5e6c84; width: 120px;">유형</td>
                            <td style="padding: 8px; font-weight: 600;">DEFECT (문제점)</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; color: #5e6c84;">상태</td>
                            <td style="padding: 8px;">
                                <span class="status-tag progress">In Progress</span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; color: #5e6c84;">담당자</td>
                            <td style="padding: 8px; font-weight: 600;">김철수</td>
                        </tr>
                    </table>

                    <div class="section-title">상세 설명</div>
                    <div class="description-box">
                        <p>로그인 버튼이 특정 브라우저(Safari)에서 작동하지 않는 현상이 발견되었습니다.</p>
                        <p>재현 경로:</p>
                        <ol style="margin-left: 20px; margin-top: 8px;">
                            <li>Safari 브라우저 실행</li>
                            <li>로그인 페이지 접속</li>
                            <li>계정 정보 입력 후 '로그인' 버튼 클릭</li>
                            <li>아무런 반응 없음</li>
                        </ol>
                    </div>

                    <div class="section-title">댓글</div>
                    <div style="margin-top: 16px;">
                        <textarea style="width: 100%; height: 80px; padding: 12px; border: 1px solid var(--border-blue); border-radius: 4px; font-family: inherit;" placeholder="댓글을 입력하세요..."></textarea>
                        <button class="create-btn" style="margin-top: 8px; float: right;">댓글 추가</button>
                    </div>
                </div>
            </div>

        </div>
    </div>

</body>
</html>
