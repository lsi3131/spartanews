from django.shortcuts import get_list_or_404, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from .util import CustomPagination
# Create your views here.

from .models import Article, Comment
from .article_validate import validate_article_data, validate_comment_data
from django.db.models import Count


class ArticleAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        article_type = request.GET.get('type', default=None)
        line_up = request.GET.get("line_up")

        if article_type:
            articles = Article.objects.filter(article_type=article_type)
        else:
            articles = Article.objects.all()

        if line_up == "likey":
            articles = articles.annotate(likey_count=Count('likey')).order_by('-likey_count')
        elif line_up == "comments":
            articles = articles.annotate(comment_count=Count('comments')).order_by('-comment_count')
        elif line_up == "views":
            articles = articles.order_by('-views')
        elif line_up == "points":
            articles = articles.order_by('-points')
        else:
            return Response({"error": "Invalid line-up value"}, status=status.HTTP_400_BAD_REQUEST)

        pagination = CustomPagination()
        page_articles = pagination.paginate_queryset(articles, request)
        data = [
            {
                "id": article.id,
                "title": article.title,
                "content": article.content,
                "article_type": article.article_type,
                "article_link": article.article_link,
                "author": article.author.username,
                "created_at": article.created_at,
                "comment_count": article.comments.count(),
                "likey_count": article.likey.count(),
                "likey_user_id": [likey.id for likey in article.likey.all()],
                "points": article.points,
                "views": article.views,
            } for article in page_articles
        ]
        return pagination.get_paginated_response(data)

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
        article.increase_views_point()  # 포인트 재계산
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
        article = get_object_or_404(Article, pk=article_pk)
        user = request.user.id

        if article.likey.filter(pk=user).exists():
            return Response({'message': ''' '좋아요 취소'를 눌러주세요 '''}, status=status.HTTP_400_BAD_REQUEST)

        article.likey.add(user)
        article.increase_likes_point()  # 포인트 재계산
        return Response({'message': '좋아요'}, status=status.HTTP_200_OK)

    def delete(self, request, article_pk):
        article = get_object_or_404(Article, pk=article_pk)
        user = request.user.id

        if not article.likey.filter(pk=user):
            return Response({'message': ''' '좋아요'를 눌러주세요. '''}, status=status.HTTP_400_BAD_REQUEST)

        article.likey.remove(user)
        return Response({'message': '좋아요 취소'}, status=status.HTTP_200_OK)


class RecommendAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, article_pk, comment_pk):
        comment = get_object_or_404(Comment, pk=comment_pk)
        user = request.user.id

        if comment.recommend.filter(pk=user).exists():
            return Response({'message': ''' '추천 취소'를 눌러주세요 '''}, status=status.HTTP_400_BAD_REQUEST)

        comment.recommend.add(user)
        return Response({'message': '추천'}, status=status.HTTP_200_OK)

    def delete(self, request, article_pk, comment_pk):
        comment = get_object_or_404(Comment, pk=comment_pk)
        user = request.user.id

        if not comment.recommend.filter(pk=user):
            return Response({'message': ''' '추천'을 눌러주세요 '''}, status=status.HTTP_400_BAD_REQUEST)
        comment.recommend.remove(user)
        return Response({'message': '추천 취소'}, status=status.HTTP_200_OK)


class ArticleCommentsAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_children_data(self, comment):
        children_data = []
        children = comment.get_children()
        for child in children:
            recommend = [r.id for r in child.recommend.all()]
            children_data.append({
                "id": child.id,
                "article": child.article.id,
                "author": child.author.username,
                "parent_comment_id": child.parent_comment_id,
                "content": child.content,
                "recommend": recommend,
                "created_at": child.created_at,
                "updated_at": child.updated_at,
                "children": self.get_children_data(child),  # 재귀적으로 자식 댓글의 자식 댓글들의 데이터도 포함합니다.
            })
        return children_data

    def get(self, request, article_pk):
        article = get_object_or_404(Article, id=article_pk)
        comments = article.comments.all()

        response_data = []
        for comment in comments:
            recommend = [r.id for r in comment.recommend.all()]
            children_data = self.get_children_data(comment)

            response_data.append(
                {
                    "id": comment.id,
                    "article": comment.article.id,
                    "author": comment.author.username,
                    "parent_comment_id": comment.parent_comment_id,
                    "children": children_data,
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
        article.increase_comments_point()
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
