from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Article
from rest_framework.permissions import IsAuthenticated
# Create your views here.
class ArticleAPIView(APIView):
    pass



class LikeyArticleAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, article_pk):
        article = get_object_or_404(Article,pk=article_pk)
        user = request.user.id
        article.likey.add(user)
        return Response({'message': '좋아요'},status=200)
        

    def delete(self, request, article_pk):
        article = get_object_or_404(Article,pk=article_pk)
        user = request.user.id
        article.likey.remove(user)
        return Response({'message': '좋아요 취소'},status=200)
