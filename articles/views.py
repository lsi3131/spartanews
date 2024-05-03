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
    
class ArticleDetailAPIView(APIView):
    # permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, article_pk):
        article = get_object_or_404(Article, id=article_pk)
        serializer = ArticleDetailSerializer(article)
        return Response(serializer.data, status=status.HTTP_200_OK)
    