from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import viewsets
from .models import Comment
from .serializers import CommentSerializer
from rest_framework.response import Response
from rest_framework import status


# Create your views here.
class ArticleAPIView(APIView):
    pass

# 댓글 전체 조회
class ArticleCommentsAPIView(APIView):
    def get(self, request, article_pk, format=None):
        comments = Comment.objects.filter(article=article_pk)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request, article_pk, format=None):
        request.data['article'] = article_pk  # 요청 데이터에 article_pk를 추가하여 article 필드에 대입
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 댓글 생성    
@api_view(['POST'])
def create_comment(request, article_pk):
    # 게시물(article_pk)에 댓글을 생성하기 위해 요청 데이터에 article_pk를 추가합니다.
    request.data['article'] = article_pk
    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()  # 댓글을 저장합니다.
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)