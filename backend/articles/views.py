from django.shortcuts import get_list_or_404, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
<<<<<<< HEAD:articles/views.py
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.pagination import PageNumberPagination
# Create your views here.

=======
from rest_framework.permissions import IsAuthenticatedOrReadOnly,IsAuthenticated
>>>>>>> main:backend/articles/views.py
from .models import Article, Comment
from .article_validate import validate_article_data, validate_comment_data
from django.db.models import Count



class ArticleAPIView(APIView):
    # permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        articles = get_list_or_404(Article)
        pageination = PageNumberPagination()
        data =[{
            "id": article.id,
            "title": article.title,
            "article_type": article.article_type,
            "article_link": article.article_link,
            "author": article.author.username,
            "created_at": article.created_at,
            "comment_count": article.comments.count(),
            "likey_count": article.likey.count(),
<<<<<<< HEAD:articles/views.py
        } for article in articles]
        pageination.paginate_queryset(data,request)
        return pageination.get_paginated_response(data)

=======
        } for article in articles])
        
    
>>>>>>> main:backend/articles/views.py
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

    def delete(self, request, article_pk):
        article = get_object_or_404(Article, id=article_pk)
        if article.author != request.user:
            return Response(
                {"error": "작성자만 삭제할 수 있습니다."},
                status=status.HTTP_403_FORBIDDEN
            )
        article.delete()
        return Response(
            {"message": "게시글이 삭제되었습니다."},
            status=status.HTTP_204_NO_CONTENT
        )



class LikeyArticleAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, article_pk):
        article = get_object_or_404(Article,pk=article_pk)
        user = request.user.id
        
        if article.likey.filter(pk=user).exists():
            return Response({'message': ''' '좋아요 취소'를 눌러주세요 '''}, status=400)
        
        article.likey.add(user)
        return Response({'message': '좋아요'},status=200)
        

    def delete(self, request, article_pk):
        article = get_object_or_404(Article,pk=article_pk)
        user = request.user.id

        if not article.likey.filter(pk=user):
            return Response({'message': ''' '좋아요'를 눌러주세요. '''})
        
        article.likey.remove(user)
        return Response({'message': '좋아요 취소'},status=200)



class RecommendAPIView(APIView):
    def post(self, request, article_pk,comment_pk ):
        comment = get_object_or_404(Comment, pk=comment_pk)
        user = request.user.id

        if comment.recommend.filter(pk=user).exists():
            return Response({'message':''' '추천 취소'를 눌러주세요 '''})
        
        comment.recommend.add(user)
        return Response({'message': '추천'})


    def delete(self, request, article_pk,comment_pk ):
        comment = get_object_or_404(Comment, pk=comment_pk)
        user = request.user.id
        
        if not comment.recommend.filter(pk=user):
            return Response({'message':''' '추천'을 눌러주세요 '''})

        comment.recommend.remove(user)
        return Response({'message': '추천 취소'})


class ArticleLineUpAPIView(APIView):
    def post(self, request):
        # 좋아요를 기준으로 정렬하도록
        # `line-up`이라는 key에 'likey'가 들어오도록 합니다.
        line_up = request.data.get("line-up")

        if line_up == "likey":
            # Article에 likey속성을 추가하고, 정렬합니다.
            articles = Article.objects.annotate(likey_count=Count('likey')).order_by('-likey_count')
        # 'likey'가 기준으로 입력되지 않은 경우, 오류를 반환합니다.
        else:
            return Response({"error": "Invalid line-up value"}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response([
            {
            "id": article.id,
            "title": article.title,
            "article_type": article.article_type,
            "article_link": article.article_link,
            "author": article.author.username,
            "created_at": article.created_at,
            "comment_count": article.comments.count(),
            "likey_count": article.likey.count(),
            }
            for article in articles
        ])
    

class ArticleCommentsAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, article_pk):
        article = get_object_or_404(Article, id=article_pk)
        comments = article.comments.all()

        response_data = []
        for comment in comments:
            recommend = [r.id for r in comment.recommend.all()]
            response_data.append(
                {
                    "id": comment.id,
                    "article": comment.article.id,
                    "author": comment.author.username,
                    "parent_comment_id": comment.parent_comment_id,
                    "content": comment.content,
                    "recommend": recommend,
                    "created_at": comment.created_at,
                    "updated_at": comment.updated_at,
                }
            )

        return Response(response_data, status=status.HTTP_200_OK)

    def post(self, request, article_pk):
        data = request.data.copy()
        message = validate_comment_data(data)
        if message:
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

        content = data['content']
        parent_comment_id = data.get('parent_comment_id', None)
        parent_comment = None
        if parent_comment_id:
            parent_comment = get_object_or_404(Comment, id=parent_comment_id)
        article = get_object_or_404(Article, id=article_pk)

        Comment.objects.create(content=content, article=article, author=request.user, parent_comment=parent_comment)
        return Response(
            {"message": "댓글이 작성되었습니다."},
            status=status.HTTP_201_CREATED
        )


class CommentDetailAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, article_pk, comment_pk):
        comment = get_object_or_404(Comment, id=comment_pk)

        parent_comment_id = comment.parent_comment.id if comment.parent_comment else None
        recommend = [r.id for r in comment.recommend.all()]
        return Response({
            "id": comment.id,
            "article": comment.article.id,
            "parent_comment": parent_comment_id,
            "content": comment.content,
            "recommend": recommend,
            "created_at": comment.created_at,
            "updated_at": comment.updated_at,
        }, status=status.HTTP_200_OK)

    def put(self, request, article_pk, comment_pk):
        comment = get_object_or_404(Comment, id=comment_pk)
        if comment.author != request.user:
            return Response(
                {"error": "작성자만 수정할 수 있습니다."},
                status=status.HTTP_403_FORBIDDEN
            )
        data = request.data.copy()
        data["content"] = data.get("content", comment.content)
        message = validate_comment_data(data)
        if message:
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

        comment.__dict__.update(**data)
        comment.save()
        return Response(
            {"message": "댓글이 수정되었습니다."},
            status=status.HTTP_200_OK
        )

    def delete(self, request, article_pk, comment_pk):
        comment = get_object_or_404(Comment, id=comment_pk)
        if comment.author != request.user:
            return Response(
                {"error": "작성자만 삭제할 수 있습니다."},
                status=status.HTTP_403_FORBIDDEN
            )
        comment.delete()
        return Response(
        {"message": "댓글이 삭제되었습니다."},
        status=status.HTTP_204_NO_CONTENT
    )