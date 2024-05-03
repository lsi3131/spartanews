from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404

class AccountAPIView(APIView):
    def post(self, request):
        """
        회원가입(권한 : 모든 유저)
        """
        data = request.data
        username = data.get('username')

        # 유저명 글자 수 제한 (5자 ~ 15자 가능)
        if (len(username) < 5) or (len(username) > 15):
            return Response({"error": "유저명은 5자 이상, 15자 이하입니다."}, status=status.HTTP_400_BAD_REQUEST)

        # 이미 가입한 유저명 제한
        if get_user_model().objects.filter(username=username).exists():
            return Response({"error": "이미 가입한 계정입니다."}, status=status.HTTP_400_BAD_REQUEST)

        # 유저 등록
        get_user_model().objects.create_user(
            username=username, password=data.get("password"))
        return Response({"username": username}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def profile(request, username):
    """
    프로필 조회(권한 : 모든 유저)
    """
    user = get_object_or_404(get_user_model(), username=username)
    return Response({
        "username": user.username,
        "date_joined": user.date_joined,
        "point": user.point,
        "introduce": user.introduce,
        "email": user.email
    })
