from rest_framework import permissions

class CustomPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # POST 요청이면서 회원가입을 요청하는 경우
        if request.method == 'POST':
            # 로그인하지 않은 사용자에게만 허용
            return not request.user.is_authenticated
        # PUT 또는 DELETE 요청이면서 해당 사용자가 자신의 정보를 수정하거나 삭제하는 경우
        elif request.method in ['PUT', 'DELETE']:
            # 요청한 유저가 인증되었고, 요청한 유저가 해당 사용자와 동일한 경우에만 허용
            return request.user.is_authenticated
        # 기타 경우에는 허용하지 않음
        return False
