from django.shortcuts import get_list_or_404, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .serializers import ArticleSerializer, ArticleDetailSerializer
from .models import Article

# Create your views here.
class ArticleAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        articles = get_list_or_404(Article)
        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        data = request.data.copy()

        title = data.get('title')
        if not title:
            return Response({"error": "제목을 입력해주세요."}, status=status.HTTP_400_BAD_REQUEST)
        
        article_type = data.get('article_type')
        if article_type not in ['news', 'ask', 'show']:
            return Response({"error": "올바르지 않은 게시글 타입입니다."}, status=status.HTTP_400_BAD_REQUEST)
        if article_type != 'ask':
            article_link = data.get('article_link')
            if not article_link:
                return Response({"error": "Url을 입력해주세요."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            data["article_link"] = ''

        content = data.get('content')
        if not content:
            return Response({"error": "내용을 입력해주세요."}, status=status.HTTP_400_BAD_REQUEST)

        data["author"] = request.user.id
        serializer = ArticleSerializer(data=data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ArticleDetailAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, article_pk):
        article = get_object_or_404(Article, id=article_pk)
        serializer = ArticleDetailSerializer(article)
        return Response(serializer.data, status=status.HTTP_200_OK)
    