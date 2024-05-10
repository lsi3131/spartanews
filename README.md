# 📰spartanews📰

<br>

## 목차
- [프론트엔드](#프론트엔드)
- [주요기능](#주요기능)
- [개발 기간](#개발-기간)
- [API](#API)
- [기능 설명](#기능-설명)
- [기술스택](#기술-스택)

<br>

## 프론트엔드
### 설치 및 실행
* cd frontend
* npm install
* npm start

<br>

## 주요기능
### 타입에 맞는 글작성
![image](https://github.com/lsi3131/spartanews/assets/75594057/4c445cc4-c69a-45da-9e34-23bf479250dd)


### 페이지네이션, 기사마다 point부여 및 정렬
![image](https://github.com/lsi3131/spartanews/assets/75594057/1a78c2cb-1545-4e25-8c67-6cc1fc2bfd15)


### 글 타입에 따른 섹션 분류
![image](https://github.com/lsi3131/spartanews/assets/75594057/0d3301eb-604f-4467-b323-33d33be42b7f)




<br>

## API


![스크린샷 2024-05-09 150900](https://github.com/lsi3131/spartanews/assets/75594057/8ecb35b0-9f7e-4882-9b5d-c3041334aa34)
![스크린샷 2024-05-09 151027](https://github.com/lsi3131/spartanews/assets/75594057/f94412fb-f294-4883-ac91-548550655770)
### Frontend
![스크린샷 2024-05-09 150935](https://github.com/lsi3131/spartanews/assets/75594057/54dea6a3-7bd2-45aa-897c-69d88ba4f518)

### 회원가입
 - **조건**: username, 비밀번호, 이메일, 이름, 닉네임, 생일 필수 입력하며 성별, 자기소개 생략 가능
 - **검증**: username과 이메일은 유일해야 하며 아이디는 5자 이상 15이하, 비밀번호는 5자 이상 15이하 특수문자, 대소문자, 숫자 포함
 - **설명**: 유효성 검사를 통해 회원가입을 진행
    <details>
             <summary> 이미지 </summary>
             <div markdown="1">
             <img width="1687" alt="스크린샷 2024-05-10 12 39 53" src="https://github.com/lsi3131/spartanews/assets/160498370/819a59ef-8da1-4a5c-8416-3a0f557de22e">
             </div>
    </details>
    
    <details>
             <summary> 유효성 검사 </summary>
             <div markdown="1">
             <img width="596" alt="스크린샷 2024-05-10 12 41 37" src="https://github.com/lsi3131/spartanews/assets/160498370/049527f6-7188-4449-a3c3-2618e8f04672">
               <img width="576" alt="스크린샷 2024-05-10 12 42 37" src="https://github.com/lsi3131/spartanews/assets/160498370/97005122-fd40-4607-a034-67b03781f4e7">
             </div>
    </details>



### 로그인
 - **설명**: 회원가입을 통애 저장된 User정보와 비교하여 로그인, 로그인시 refresh Token과 access Token을 발급
      <details>
               <summary> 이미지 </summary>
               <div markdown="1">
               <img width="1751" alt="스크린샷 2024-05-10 12 39 36" src="https://github.com/lsi3131/spartanews/assets/160498370/89f04d2f-2ab9-4968-bde2-12354a6a5b41">
                 <img width="989" alt="스크린샷 2024-05-10 13 23 17" src="https://github.com/lsi3131/spartanews/assets/160498370/ee29dfc0-7242-4833-ab33-02ae8ed14dc5">
               </div>
      </details>


### 로아웃 / 프로필
 - **설명**: 우측 상단에 위치한 Username을 클릭시 프로필 페이지로 이동하며 로그아웃을 진행가능 로그아웃시                     refresh Tken과 access Token을제거
      <details>
               <summary> 이미지 </summary>
               <div markdown="1">
               <img width="1729" alt="스크린샷 2024-05-10 12 50 09" src="https://github.com/lsi3131/spartanews/assets/160498370/7e7337a5-795a-4107-bd5a-62f60e961812">
                 <img width="986" alt="스크린샷 2024-05-10 13 23 28" src="https://github.com/lsi3131/spartanews/assets/160498370/2afa44bb-b282-458e-be4e-73f8cfde8198">
               </div>
      </details>



### 리스트 보여주기 
 - **설명**: 최근에 작성한 Article순으로 정렬 됩니다. 각 페이지 마다 5개씩 보여 줍니다. 글쓴이, 작성일, 포인트, 댓글수, 좋아요수, 좋아요 버튼이 있습니다.

      <details>
               <summary> 이미지 </summary>
               <div markdown="1">
               <img width="1708" alt="스크린샷 2024-05-10 13 00 54" src="https://github.com/lsi3131/spartanews/assets/160498370/e754124c-4a98-4178-82f7-eccdddaf0a0a">
               </div>
      </details>
  
- **설명**: 왼쪽 상단에 Ask, Show, News Article의 Type 별로 보리스트를 정렬합니다
      <details>
               <summary> Type별 정렬(Ask / Show)</summary>
               <div markdown="1">
               <img width="1662" alt="스크린샷 2024-05-10 13 00 29" src="https://github.com/lsi3131/spartanews/assets/160498370/cbad1bee-60a7-4109-abe3-3d353e78e090">
                 <img width="1688" alt="스크린샷 2024-05-10 13 00 41" src="https://github.com/lsi3131/spartanews/assets/160498370/77d6ac12-ba28-44ea-91d7-6a06948c4ac0">
               </div>
      </details>


### Article Detail
 - **설명**: 작성한 Article의 작성자, 작성일, 댓글수, 좋아요수, 내용을 보여주며 로그인한 User는 댓글과 대댓글작성이 가능합니다. 자신이 작성한 댓글은 삭제와 수정이 가능하며 버튼이 나타납니다.
        <details>
                 <summary> 이미지 </summary>
                 <div markdown="1">
                 <img width="1656" alt="스크린샷 2024-05-10 13 07 40" src="https://github.com/lsi3131/spartanews/assets/160498370/8e4c7da1-37f1-44f6-b10f-e6f2c09cc7da">
                 </div>
        </details>


### Article Write 
 - **설명**: 로그인 한 User만 Article 작성이 가능합니다. 타입, 제목, 링크, 내용을 입력하여 작성합니다.
        <details>
                 <summary> 이미지 </summary>
                 <div markdown="1">
                 <img width="1690" alt="스크린샷 2024-05-10 13 46 56" src="https://github.com/lsi3131/spartanews/assets/160498370/cf6375ae-85cc-466f-940a-4277d141ee6a">
                   <img width="625" alt="스크린샷 2024-05-10 13 47 09" src="https://github.com/lsi3131/spartanews/assets/160498370/7e05525a-467e-4010-aa66-72ee3f446d42">
                 </div>
        </details>




<br>

## 개발 기간
🕓 2024. 05. 04 (금) ~ 2024. 05. 10 (금)

<br>

## 기술 스택
<div align="center">
<img src="https://img.shields.io/badge/python-3776AB?style=for-the-badge&logo=python&logoColor=white">
<img src="https://img.shields.io/badge/diagrams-F08705?style=for-the-badge&logo=diagrams.net&logoColor=white">
<img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
<br>
<img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white">
<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
<img src="https://img.shields.io/badge/bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white">
<br>
<img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white">
<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">
<img src="https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=Slack&logoColor=white">
<br>
<img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white">
<img src="https://img.shields.io/badge/figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white">
<img src="https://img.shields.io/badge/django-092E20?style=for-the-badge&logo=figma&logoColor=white">
<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=figma&logoColor=white">
<img src="https://img.shields.io/badge/node.js-5FA04E?style=for-the-badge&logo=figma&logoColor=white">
</div>
