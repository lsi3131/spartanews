from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from django.http.request import HttpRequest
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *


# Create your views here.
class ArticleAPIView(APIView):
    pass


class CommentDetailAPIView(APIView):
    def get(self, request: HttpRequest, article_pk, comment_pk):
        article = get_object_or_404(Article, id=article_pk)
        comment = get_object_or_404(Comment, id=comment_pk)

        serializer = CommentSerializer(comment)
        # serializer.is_valid(raise_exception=True)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request: HttpRequest, article_pk, comment_pk):
        return Response({'message': 'message'}, status=status.HTTP_200_OK)

    def delete(self, request: HttpRequest, article_pk, comment_pk):
        return Response({'message': 'message'}, status=status.HTTP_200_OK)
