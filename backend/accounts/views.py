from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import HttpRequest
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from accounts.permissions import CustomPermission
from .util import AccountValidator
import re

validator = AccountValidator()


class AccountAPIView(APIView):
    permission_classes = [CustomPermission]

    def post(self, request):
        """
        회원가입(권한 : 모든 유저)
        """
        data = request.data
        username = data.get('username', None)
        password = data.get('password', None)
        email = data.get('email', None)
        introduce = data.get('introduce', '')

        # username, password, email 권한 설정
        validate_type_values = {
            'username': username,
            'password': password,
            'email': email,
        }
        for v_type, value in validate_type_values.items():
            request_data = {'data': value}
            if not validator.validate(v_type, request_data):
                return validator.get_response_data()

        # 유저 등록
        get_user_model().objects.create_user(
            username=username, password=password, email=email, introduce=introduce)

        return Response({
            "username": username,
            "password": password,
            "email": email,
            "introduce": introduce,
        }, status=status.HTTP_201_CREATED)

    def put(self, request):
        """
        회원정보(자기소개, 이메일 수정)
        """
        # token으로부터 user정보 가져오기
        pk = request.user.pk
        # 로그인한 user의 db가져오기
        user = get_object_or_404(get_user_model(), pk=pk)

        # 변경요청 데이터 가져오기
        introduce = request.data.get("introduce")
        email = request.data.get("email")

        try:
            validate_email(email)
        except ValidationError:
            print("유효하지 않은 이메일 주소입니다.")

        user.introduce = introduce
        user.email = email
        user.save()
        return Response({"introduce": introduce, "email": email})

    def delete(self, request):
        """
        회원탈퇴
        """
        login_user_pk = request.user.pk
        user = get_object_or_404(get_user_model(), pk=login_user_pk)
        user.delete()
        return Response({"message": "회원탈퇴가 정상적으로 처리되었습니다."})


@api_view(['GET'])
def profile(request, username):
    """
    프로필 조회(권한 : 없음)
    """
    user = get_object_or_404(get_user_model(), username=username)
    return Response({
        "username": user.username,
        "date_joined": user.date_joined,
        "point": user.point,
        "introduce": user.introduce,
        "email": user.email
    })


@api_view(['POST'])
def validate_password(request):
    validator.validate('password', request.data)
    return validator.get_response_data()


@api_view(['POST'])
def validate_username(request):
    validator.validate('username', request.data)
    return validator.get_response_data()


@api_view(['POST'])
def validate_email(request):
    validator.validate('email', request.data)
    return validator.get_response_data()
