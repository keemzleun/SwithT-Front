<p align="center">
  <img src="https://github.com/user-attachments/assets/e01ebcc1-a8ae-42c4-9644-c52c9fb4ef5d">
</p>

## 🙋🏻팀원

| **김민성** | **박우진** | **황정하** | **신승현** | **김지은** |
| :------: |  :------: | :------: | :------: | :------: |
| [<img src="https://avatars.githubusercontent.com/Windowmincastle" height=150 width=150> <br/> @Windowmincastle](https://github.com/Windowmincastle) | [<img src="https://avatars.githubusercontent.com/getsetgo1" height=150 width=150> <br/> @getsetgo1](https://github.com/getsetgo1) | [<img src="https://avatars.githubusercontent.com/NaturalHwang" height=150 width=150> <br/> @NaturalHwang](https://github.com/NaturalHwang) | [<img src="https://avatars.githubusercontent.com/hyun331" height=150 width=150> <br/> @hyun331](https://github.com/hyun331) | [<img src="https://avatars.githubusercontent.com/keemzleun" height=150 width=150> <br/> @keemzleun](https://github.com/keemzleun) |

<br/>

## 📢 프로젝트 소개
  
<div align="left">

  -	프로젝트 개요


현 교육 시장에서는 대형 플랫폼들이 시장을 독점하면서 프리랜서 강사들이 교육 서비스 제공 기회를 얻기 어려워졌고, 소비자 입장에서는 다양한 교육 기회를 접하기 힘든 상황이 발생하고 있습니다. 대형 플랫폼들은 특정 강사와 컨텐츠에 대한 과도한 집중을 야기하고, 그로 인해 소비자의 선택의 폭이 제한되어 교육의 다양성이 정체되는 문제를 초래하고 있습니다.

-	프로젝트 목표


SwithT Project의 목표는 일정 관리, 다양한 학습 컨텐츠, 강사의 수강생 및 학습 관리,중개 서비스 이 모든것을 한 곳에서 만족시킬 수 있는 올인원 서비스를 지향합니다. 강의를 소비자가 개인 일정과 교육 일정을 비교해 손 쉽게 이용할 수 있는 교육 중개 서비스 플랫폼을 구축하고 사용자(강사,수강생) 경험을 개선하고 교육의 접근성을 높이며 1:1 강의와 1:N 강의 중개를 통해 교육 기회를 확대 합니다. 또한 다양한 기능을 통해 강의 운영을 효율적으로 운영하고, 일정 공유 기능으로 강사와 수강생간의 상호작용을 극대화하여 교육의 질을 높입니다. 


<br/>

## 📌 주요 기능


| 기능              | 설명                                                                                                                                                    |
|-------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| **일정 공유 및 관리** | 강사와 수강생은 캘린더를 통해 서로의 일정을 공유할 수 있으며, 개인 일정도 체계적으로 관리할 수 있습니다. 이를 통해 수업 일정을 명확히 조율하고 효율적인 시간 관리를 지원합니다. |
| **SMS 일정 리마인드** | Twilio API를 활용하여 일정 리마인드 알림을 제공함으로써 중요한 일정을 놓치지 않도록 도와줍니다. 웹 기반 애플리케이션의 한계를 보완하며 사용자 편의성을 극대화합니다. |
| **채팅 기능**       | - **1:1 채팅**: 강사와 수강생 간의 채팅을 통해 수업 전후로 일정을 조율하거나 수강 신청 관련 소통을 진행할 수 있습니다. <br/> - **그룹 채팅**: 분반별로 그룹 채팅을 지원하여 학습 커뮤니티를 형성하고, 수강생 간의 원활한 소통을 촉진합니다. |
| **알림 기능**       | Server-Sent Events(SSE)와 Redis Stream을 활용하여 실시간 알림 기능을 구현했습니다. <br/> - **Redis Stream**: 알림 데이터의 유실을 방지하고 안정적인 데이터 전송을 보장합니다. <br/> - **안정성**: 높은 트래픽 상황에서도 안정적으로 알림을 제공할 수 있도록 설계되었습니다. |
| **결제 기능**       | 포트원(Payments) API를 통합하여, 수강 신청 시 안전하고 간편하게 결제할 수 있는 기능을 제공합니다. 다양한 결제 옵션을 지원하여 사용자 경험을 향상시켰습니다. |
| **대기열 기능**     | 인기 강사의 강의에 대한 높은 트래픽 상황을 대비하여 대기열 기능을 제공했습니다. 이를 통해 사용자들은 불편 없이 차례를 기다릴 수 있으며, 전체적인 사용자 경험을 개선했습니다. |

<br/>

## 📍 기대효과

| **주제**                 | **효과**                                                                                     |
|--------------------------|--------------------------------------------------------------------------------------------|
| **통합 일정 관리**        | 강사와 수강생이 일정 공유 및 관리를 통해 수업을 효율적으로 조율하고, 개인 및 학습 일정을 체계적으로 관리할 수 있습니다.       |
| **다양한 콘텐츠**         | 다양한 강사와 학습 콘텐츠를 한 곳에서 탐색하고 비교할 수 있어 교육 선택의 폭을 넓히고, 소비자의 개별 학습 요구를 충족시킵니다.   |
| **편리한 학습 관리**             | 강사와 수강생 간 실시간 소통 및 알림 기능을 통해 학습 과정을 원활히 진행하며, 강사와 학생 모두 효율적으로 수업을 운영하고 참여할 수 있습니다. |
| **안정적이고 확장 가능한 시스템 제공** | OpenSearch를 활용한 빠른 데이터 검색, 대기열 시스템으로 높은 트래픽 상황에서도 안정적 서비스 제공, Redis Stream으로 데이터 유실을 방지하며, MSA 환경을 기반으로 확장성과 신뢰성을 확보합니다. 또한, 카프카를 사용하여 대용량 채팅 환경에서도 안정적인 메시지 전송을 보장합니다. |

**SwithT 프로젝트**는 통합적인 기능 제공을 통해 교육의 접근성과 효율성을 극대화하며, 사용자 경험을 개선하고 교육 시장의 다양성을 확장합니다.

<br/>

## 🛠 기술 스택

###  DB
![mariadb](https://img.shields.io/badge/Mariadb-003545?style=for-the-badge&logo=mariadb&logoColor=white)
![redis](https://img.shields.io/badge/Redis-FF4438?style=for-the-badge)
![amazons3](https://img.shields.io/badge/Amazons3-569A31?style=for-the-badge&logo=amazons3&logoColor=white)

### BACKEND
![Java](https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white)
![Spring](https://img.shields.io/badge/Spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
<img src="https://img.shields.io/badge/SpringBoot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white">
![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=WebSocket&logoColor=white)
<img src="https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white">
<img src="https://img.shields.io/badge/KAFKA-02303A?style=for-the-badge&logo=&logoColor=white">


### FRONTEND
![Vue.js](https://img.shields.io/badge/vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![vuetify](https://img.shields.io/badge/vuetify-1867C0?style=for-the-badge&logo=vuetify&logoColor=white)
<img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white">
<img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
<img src="https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white">
<img src="https://img.shields.io/badge/Javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">

### TOOLS
![Notion](https://img.shields.io/badge/Notion-181717?style=for-the-badge&logo=notion&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/Github-181717?style=for-the-badge&logo=Github&logoColor=white)
![figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)
<img src="https://img.shields.io/badge/Google Docs-4285F4?style=for-the-badge&logo=GoogleDocs&logoColor=white">
<img src="https://img.shields.io/badge/IntelliJ IDEA-000000?style=for-the-badge&logo=IntelliJIDEA&logoColor=white">
<img src="https://img.shields.io/badge/Visual Studio Code-4285F4?style=for-the-badge&logo=&logoColor=blue">
### DEVOPS
<img src="https://img.shields.io/badge/Amazon aws-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white">
<img src="https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=Kubernetes&logoColor=white">
<img src="https://img.shields.io/badge/Amazon EKS-FF9900?style=for-the-badge&logo=AmazonEKS&logoColor=white">
<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=white">

<br/>
<br/>

## 🗓️ Work Breakdown Structure
- [WBS 상세보기](https://docs.google.com/spreadsheets/d/1GH_rCJKcHojk6-SSolw8yv9uBQK2eujsTFvQqh4fSvo/edit?gid=811390028#gid=811390028)
<br/>

## 📝 요구사항정의서 
- [요구사항 정의서 상세보기](https://docs.google.com/spreadsheets/d/1GH_rCJKcHojk6-SSolw8yv9uBQK2eujsTFvQqh4fSvo/edit?gid=348186960#gid=348186960)
<br/>

## 📋 ERD

- [ERD 상세보기](https://www.erdcloud.com/d/Ci6kBDHm5HRx5T5pX)
![](https://github.com/user-attachments/assets/edd73cf8-02bd-46bd-bfb4-70f5e6f8d03d)
 
|MSA 아키텍처|
|----------|
|Member-Service|
|Lecture-Service|
|Payment-Service|

<br/>

## 시스템아키텍처 및 CI/CD
- <b>시스템 아키텍처</b>
![AWS 환경](https://github.com/user-attachments/assets/f8108583-ba58-46f4-9540-76f54e605f50)
<br/>

- <b>백엔드</b>
![백엔드](https://github.com/user-attachments/assets/9d4a1e6c-e741-48c3-a3a4-71b720651bbc)

<br/>

- <b>프론트엔드</b>
![프론트엔드2](https://github.com/user-attachments/assets/37125592-4ae4-4e2c-8d50-0832967e244b)
<br/>




## 📝 프로그램 사양서 
- [프로그램 사양서 상세보기](https://docs.google.com/spreadsheets/d/1GH_rCJKcHojk6-SSolw8yv9uBQK2eujsTFvQqh4fSvo/edit?gid=1934764833#gid=1934764833)
<br/>

## 📝 API 단위 테스트 결과서 
- [API 단위 테스트 결과서 상세보기](https://documenter.getpostman.com/view/38251958/2sAXxLDFDP)
<br/>


## 📝 화면 설계서 
- [화면 설계서 상세보기](https://www.figma.com/design/823D0xOfvggZJW6FOEDC5B/SwithT-Project?node-id=564-7656&t=D2ENMnjlRpluYxjO-1)
<br/>


## 📝UI/UX 단위 테스트 결과서
![스크린샷 2025-01-10 오후 5 54 20](https://github.com/user-attachments/assets/0fd9f368-2f6b-4830-8228-e768fa04c4f6)
### 회원 가입 및 로그인
<details>
<summary><b>튜터 & 튜티 회원가입</b></summary>
  
  ![TUTOR 회원가입](https://github.com/user-attachments/assets/521ac644-a6a1-48cb-9091-db7b12d516e5)
  
  ![TUTEE 회원가입 및 로그인](https://github.com/user-attachments/assets/edc95f62-d68e-41ed-9042-773ad4c527f2)
</details>

<details>
<summary><b>카카오 로그인</b></summary>
  
  ![카카오 소셜 로그인](https://github.com/user-attachments/assets/d28f539a-b67d-4fbb-bfcf-bc830d771514)
</details>

<details>
<summary><b>관리자 로그인</b></summary>

  ![어드민로그인](https://github.com/user-attachments/assets/5350f4e1-1925-4ba4-b0e9-b95d8980c068)
</details>

<details>
<summary><b>프로필 이미지 수정, 회원정보 수정</b></summary>

  ![프로필이미지수정 회원정보수정](https://github.com/user-attachments/assets/a36feeb5-cfa4-4147-9a36-889a29e8e750)
</details>
<br/>

### 강의 개설
- 일대다 강의와 일대일 강의(과외)의 차이
  
|일대다 강의|일대일 강의|
|--------|--------|
|많은 인원 신청시 대기열 발생 |튜터가 신청한 인원 중 튜티를 선택|
|        |개설 시 인원이 1명으로 제한됨|
|신청시 결제|튜터가 승인시 결제|
|강의 기간과 위치를 튜터가 선정|강의 시작일과 위치를 튜티가 선정 후 신청|
<br/>

<details>
<summary><b>강의 개설</b></summary>
  
![강의 개설 gif](https://github.com/user-attachments/assets/d289694e-f2f8-4d66-9d83-bc174312fbc0)
</details>
<details>
<summary><b>일대일 강의(과외) 개설</b></summary>
  
![과외 개설 gif](https://github.com/user-attachments/assets/d4d7e869-09cc-47fb-952b-8129d45b6dbb)
</details>
<br/>

### 개설 승인 및 강의 등록 확인
<details>
<summary><b>개설 승인(관리자)</b></summary>
  
![강의 승인 gif](https://github.com/user-attachments/assets/9f1ebc60-b263-4b3e-817f-9fa119330d5f)
</details>
<details>
<summary><b>개설 승인 알림(튜터)</b></summary>

![강의 승인 알림 gif](https://github.com/user-attachments/assets/bfad92a8-a78c-4694-8381-e0f82e8f1076)

</details>
<br/>

### 강의 검색
<details>
<summary><b>강의 검색</b></summary>

  ![search](https://github.com/user-attachments/assets/a1e32aaf-90c2-4966-a393-cedc61afd9a2)

</details>
<br/>

---

![스크린샷 2025-01-10 오후 5 55 14](https://github.com/user-attachments/assets/1d38bbf4-32aa-4b35-a8a1-6c77e2eaf3d5)
### 일대다 강의 신청
<details>
<summary><b>강의 신청 및 대기열</b></summary>

  ![대기열](https://github.com/user-attachments/assets/2a80b1ae-aace-4e4a-b8d6-ac67f9f960a3)
</details>

<details>
<summary><b>강의 결제</b></summary>
  
  ![강의결제GIF](https://github.com/user-attachments/assets/16f6cf98-86dc-4ee9-8649-83b37431f031)
</details>
<br/>

### 일대일 강의 신청
<details>
<summary><b>강의 신청(튜티)</b></summary>

  ![11강의신청](https://github.com/user-attachments/assets/585fce05-1003-46f1-ab71-3c12f4742949)
</details>
<details>
<summary><b>채팅 상담 후 결제 요청(튜터)</b></summary>

  ![일대일강의신청튜터의채팅상담](https://github.com/user-attachments/assets/bd1851a1-fe10-4e0c-94d9-56df494ac77b)
</details>
<details>
<summary><b>결제 요청 확인 후 강의 결제</b></summary>

  ![일대일강의튜티가결제하는gif](https://github.com/user-attachments/assets/6b315f01-89ed-4b73-88fa-6fe377d8ffa6)
</details>
<br/>

---

![스크린샷 2025-01-10 오후 5 55 34](https://github.com/user-attachments/assets/5d271e7f-63dd-4d39-89e5-14d2ec8cc81a)
### 강의 관리 종합 페이지(튜터)

![강의관리종합페이지스크린샷](https://github.com/user-attachments/assets/e6763ae6-bbd3-4369-9c35-843d579eab36)

![강의관리종합페이지GIF](https://github.com/user-attachments/assets/a7d4e477-6ced-4327-82b0-629c08ab028a)

- 강의 정보 수정
- 분반별 정보 및 신청자 리스트 확인
- 강의를 듣는 튜티가 게시한 최신 게시글 및 곧 마감되는 과제 확인
<br/>

### 강의홈(튜터&튜티)

![lectureHome](https://github.com/user-attachments/assets/13a36a18-fed2-403a-b0c3-8bb9f220164b)

- 분반별 강의홈 기능
- 강의 정보 확인
- 대시보드, 과제 공지, 게시판 기능
- 일대다 강의의 경우 튜티 리스트 확인 가능
<br/>
<details>
<summary><b>공지사항 작성</b></summary>
  
![공지사항 등록 gif](https://github.com/user-attachments/assets/8b074408-559d-4b47-b2a9-b068c666ac2e)
</details>
<details>
<summary><b>게시글 작성</b></summary>

![boardCreate](https://github.com/user-attachments/assets/fad2b29e-7bc6-4cb0-88ea-8332fbcfc070)
</details>
<details>
<summary><b>게시글 댓글 등록</b></summary>

![commentCreate](https://github.com/user-attachments/assets/849e35ab-c77d-4e21-b0a1-19c4dcd091c1)
</details>
<details>
<summary><b>과제 등록</b></summary>

![assignCreate](https://github.com/user-attachments/assets/596de9d1-51e8-4f4d-85a2-a37d4fb7c571)
</details>
<details>
<summary><b>강의 분반별로 채팅 활성화</b></summary>
  
![다대다채팅](https://github.com/user-attachments/assets/dc4c7d0c-9a42-4354-a06a-537d7c661709)
</details>
<br/>

### 스케줄러
<details>
<summary><b>강의 일정 추가</b></summary>

![lessonSchedule](https://github.com/user-attachments/assets/58b682d8-0de0-40d0-8bac-6f78a4954738)
</details>
<details>
<summary><b>개인 일정 생성</b></summary>

![scheduleCreate](https://github.com/user-attachments/assets/f7cef33e-4bc4-490c-b7dd-aa00e3438765)
</details>
<details>
<summary><b>과제 일정 생성</b></summary>

![assignSchedule](https://github.com/user-attachments/assets/a7a7eade-5929-4963-a738-2e25375b7670)
</details>
<br/>

### 일정 리마인더
<details>
<summary><b>알림 설정</b></summary>

  ![scheduleAlert](https://github.com/user-attachments/assets/a27ac517-3d3e-4bf9-aa23-a79644be3df9)
</details>
<details>
<summary><b>일정 알림 문자 수신</b></summary>

  ![알림설정이미지](https://github.com/user-attachments/assets/96c365a5-b088-45ea-8f06-84e35e5fb369)
![문자수신이미지](https://github.com/user-attachments/assets/babee45d-7461-4b39-b480-ffa994401fb3)
</details>
<br/>

---
<img width="919" alt="스크린샷 2025-01-10 오후 7 28 28" src="https://github.com/user-attachments/assets/583bf7ae-ca44-48b4-ac0e-a2822abe31a5" />

### 정산
<details>
<summary><b>정산</b></summary>
  
  ![정산1](https://github.com/user-attachments/assets/e2810d3d-80af-4a4d-9bb6-ddac2a1a825e)
![정산2](https://github.com/user-attachments/assets/fafd60a1-7625-433d-aa88-c5f757be9aed)
![정산3](https://github.com/user-attachments/assets/b798a4f8-a409-4a69-bbfc-9f28a9caa4e8)
![정산4](https://github.com/user-attachments/assets/915b4d37-451b-4cf7-99a5-18e36180cdaa)
</details>
<br/>

### 환불
<details>
<summary><b>환불</b></summary>
  
![환불1](https://github.com/user-attachments/assets/6d40f169-f695-47cb-9455-e44f3982b34f)
![환불2](https://github.com/user-attachments/assets/f66f7f5f-9bd9-4253-a939-89fe48072977)
![환불3](https://github.com/user-attachments/assets/fc87adcc-ef01-4b43-a42b-f46cfb6d46b4)
</details>
<details>
<summary><b>결제 7일 이후 환불</b></summary>
  
![환불4](https://github.com/user-attachments/assets/99bb4910-f49f-42f5-9195-3d62ca4d91fa)
![환불5](https://github.com/user-attachments/assets/8fc1f857-69bd-4646-924a-1c3273836d15)
</details>
<br/>

### 리뷰
<details>
<summary><b>리뷰 작성</b></summary>
  
![리뷰 작성 gif](https://github.com/user-attachments/assets/5717ef8b-3188-4a97-93fb-a87b6e208f82)

</details>
