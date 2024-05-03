from django.shortcuts import render
from rest_framework.views import APIView
from django.http.request import HttpRequest
from rest_framework.response import Response
from rest_framework import status


# Create your views here.
class ArticleAPIView(APIView):
    pass


class CommentDetailAPIView(APIView):
    def get(self, request: HttpRequest, article_pk, comment_pk):
        return Response({'message': 'message'}, status=status.HTTP_200_OK)

    def put(self, request: HttpRequest, article_pk, comment_pk):
        return Response({'message': 'message'}, status=status.HTTP_200_OK)

    def delete(self, request: HttpRequest, article_pk, comment_pk):
        return Response({'message': 'message'}, status=status.HTTP_200_OK)
