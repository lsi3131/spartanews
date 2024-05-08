import re
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework import status


class AccountValidator:
    def __init__(self):
        self.response_data = Response({"valid": True}, status=status.HTTP_200_OK)

    def validate(self, validate_type: str, request_data) -> bool:
        self.response_data = Response({"valid": True}, status=status.HTTP_200_OK)
        data = request_data.get('data', None)
        if not data:
            self.response_data = Response({"error": "올바르지 않은 데이터 포맷입니다."}, status=status.HTTP_400_BAD_REQUEST)
            return False

        if validate_type == 'password':
            return self.validate_password(data)
        elif validate_type == 'username':
            return self.validate_username(data)
        elif validate_type == 'email':
            return self.validate_email(data)
        else:
            self.response_data = Response({"error": f"type(={validate_type})이 잘못 되었습니다."},
                                          status=status.HTTP_400_BAD_REQUEST)
            return False

    def validate_password(self, password: str) -> bool:
        # 글자수 4 이상
        if not (4 <= len(password)):
            self.response_data = Response({"error": "비밀번호는 4자리 이상이 필요합니다."}, status=status.HTTP_400_BAD_REQUEST)
            return False

        return True

    def validate_username(self, username: str) -> bool:
        # 글자수 5~15 이상
        if not (5 <= len(username) <= 15):
            self.response_data = Response({"error": "유저명은 5자 이상, 15자 이하입니다."}, status=status.HTTP_400_BAD_REQUEST)
            return False

        # 이미 가입한 유저명 제한
        if get_user_model().objects.filter(username=username).exists():
            self.response_data = Response({"error": "이미 가입한 계정입니다."}, status=status.HTTP_400_BAD_REQUEST)
            return False

        return True

    def validate_email(self, email: str) -> bool:
        def is_valid_email(email):
            # 이메일 주소를 검증하는 정규 표현식
            pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
            return re.match(pattern, email) is not None

        if not is_valid_email(email):
            self.response_data = Response({"error": "올바르지 않은 이메일 주소입니다."}, status=status.HTTP_400_BAD_REQUEST)
            return False

        # 이미 가입한 이메일 제한
        if get_user_model().objects.filter(email=email).exists():
            self.response_data = Response({"error": "이미 가입한 이메일 주소입니다."}, status=status.HTTP_400_BAD_REQUEST)
            return False

        return True

    def get_response_data(self):
        return self.response_data
