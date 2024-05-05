from django.shortcuts import get_list_or_404, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Article
from .article_validate import validate_article_data

# Create your views here.
class ArticleAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        articles = get_list_or_404(Article)
        return Response([{
            "id": article.id,
            "title": article.title,
            "article_type": article.article_type,
            "article_link": article.article_link,
            "author": article.author.username,
            "created_at": article.created_at,
            "comment_count": article.comments.count(),
            "likey_count": article.likey.count(),
        } for article in articles])
        
    
    def post(self, request):
        data = request.data.copy()
        message = validate_article_data(data)
        if message:
            return Response(message, status=status.HTTP_400_BAD_REQUEST)
        Article.objects.create(**data, author=request.user)
        return Response(
            {"message": "게시글이 작성되었습니다."},
            status=status.HTTP_201_CREATED
        )
        
    

class ArticleDetailAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, article_pk):
        article = get_object_or_404(Article, id=article_pk)
        return Response({
            "id": article.id,
            "title": article.title,
            "article_type": article.article_type,
            "article_link": article.article_link,
            "content": article.content,
            "author": article.author.username,
            "created_at": article.created_at,
            "comments": [{
                "id": comment.id,
                "author": comment.author.username,
                "content": comment.content,
                "created_at": comment.created_at,
                "recommend_count": comment.recommend.count(),
            } for comment in article.comments.all()],
            "comment_count": article.comments.count(),
            "likey_count": article.likey.count(),
        })
    
    def put(self, request, article_pk):
        article = get_object_or_404(Article, id=article_pk)
        if article.author != request.user:
            return Response(
                {"error": "작성자만 수정할 수 있습니다."},
                status=status.HTTP_403_FORBIDDEN
            )
        data = request.data.copy()
        data["title"] = data.get("title", article.title)
        data["article_type"] = data.get("article_type", article.article_type)
        data["article_link"] = data.get("article_link", article.article_link)
        data["content"] = data.get("content", article.content)
        message = validate_article_data(data)
        if message:
            return Response(message, status=status.HTTP_400_BAD_REQUEST)
        article.__dict__.update(**data)
        article.save()
        return Response(
            {"message": "게시글이 수정되었습니다."},
            status=status.HTTP_200_OK
        )
  