<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Workspace Detail (JSP Sample)</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .accordion-item { border: 1px solid var(--border-blue); border-radius: 4px; margin-bottom: 12px; background: #fff; overflow: hidden; }
        .accordion-header { 
            background: var(--soft-blue); padding: 12px 20px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;
            font-weight: 700; color: var(--dark-blue);
        }
        .accordion-content { padding: 20px; border-top: 1px solid var(--border-blue); }
        .grid-table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
        .grid-table th { background: var(--pale-blue); text-align: left; padding: 10px; border-bottom: 2px solid var(--border-blue); color: var(--dark-blue); }
        .grid-table td { padding: 10px; border-bottom: 1px solid var(--soft-blue); }
        .chevron { transition: transform 0.3s; }
        .active .chevron { transform: rotate(180deg); }
    </style>
</head>
<body>

    <header class="top-bar">
        <div class="logo">
            <span class="workspace-icon">🏢</span>
            <span class="workspace-name">차세대 웹 고도화 프로젝트</span>
        </div>
    </header>

    <div class="main-container">
        <aside class="sidebar">
            <nav>
                <ul>
                    <li><a href="issue_list.jsp" class="menu-item"><span class="menu-icon">🎫</span> 이슈</a></li>
                    <li><a href="#" class="menu-item active"><span class="menu-icon">ℹ️</span> 작업장 정보</a></li>
                </ul>
            </nav>
        </aside>

        <div class="content-area" style="padding: 40px; display: block; overflow-y: auto;">
            <h2 style="margin-bottom: 24px; color: var(--dark-blue);">작업장 상세 정보</h2>

            <!-- Accordion 1: Basic Info -->
            <div class="accordion-item">
                <div class="accordion-header">
                    <span>기본 정보</span>
                    <span class="chevron">▼</span>
                </div>
                <div class="accordion-content">
                    <p><strong>작업장 명칭:</strong> 차세대 웹 고도화 프로젝트</p>
                    <p style="margin-top: 10px;"><strong>설명:</strong> Vue 3와 Express를 이용한 시스템 통합 관리 작업장입니다.</p>
                </div>
            </div>

            <!-- Accordion 2: Members -->
            <div class="accordion-item">
                <div class="accordion-header">
                    <span>멤버 정보</span>
                    <span class="chevron">▼</span>
                </div>
                <div class="accordion-content">
                    <table class="grid-table">
                        <thead>
                            <tr>
                                <th>이름</th>
                                <th>부서</th>
                                <th>역할</th>
                                <th>이메일</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>홍길동</td>
                                <td>Management</td>
                                <td>Admin</td>
                                <td>admin@example.com</td>
                            </tr>
                            <tr>
                                <td>김철수</td>
                                <td>S/W</td>
                                <td>Developer</td>
                                <td>chul@example.com</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Accordion 3: Approval Info -->
            <div class="accordion-item">
                <div class="accordion-header">
                    <span>결재 정보</span>
                    <span class="chevron">▼</span>
                </div>
                <div class="accordion-content">
                    <table class="grid-table">
                        <thead>
                            <tr>
                                <th>단계</th>
                                <th>구분</th>
                                <th>결재자</th>
                                <th>상태</th>
                                <th>일시</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>기안</td>
                                <td>홍길동</td>
                                <td><span style="color: #006644; font-weight: 700;">Completed</span></td>
                                <td>2024-04-20 09:00</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>합의</td>
                                <td>김철수</td>
                                <td><span style="color: #ff8b00; font-weight: 700;">Pending</span></td>
                                <td>-</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </div>

</body>
</html>
