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
    # permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request: HttpRequest, article_pk, comment_pk):
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

    def put(self, request: HttpRequest, article_pk, comment_pk):
        comment = get_object_or_404(Comment, id=comment_pk)
        # if article.author != request.user:
        #     return Response(
        #         {"error": "작성자만 수정할 수 있습니다."},
        #         status=status.HTTP_403_FORBIDDEN
        #     )
        # data = request.data.copy()
        # data["title"] = data.get("title", article.title)
        # data["article_type"] = data.get("article_type", article.article_type)
        # data["article_link"] = data.get("article_link", article.article_link)
        # data["content"] = data.get("content", article.content)
        # message = validate_article_data(data)
        # if message:
        #     return Response(message, status=status.HTTP_400_BAD_REQUEST)
        # article.__dict__.update(**data)
        # article.save()
        return Response(
            {"message": "댓글이 수정되었습니다."},
            status=status.HTTP_200_OK
        )

    def delete(self, request: HttpRequest, article_pk, comment_pk):
        return Response({'message': 'message'}, status=status.HTTP_200_OK)

# class ArticleDetailAPIView(APIView):
#     permission_classes = [IsAuthenticatedOrReadOnly]
#
#     def get(self, request, article_pk):
#         article = get_object_or_404(Article, id=article_pk)
#         return Response({
#             "id": article.id,
#             "title": article.title,
#             "article_type": article.article_type,
#             "article_link": article.article_link,
#             "content": article.content,
#             "author": article.author.username,
#             "created_at": article.created_at,
#             "comments": [{
#                 "id": comment.id,
#                 "author": comment.author.username,
#                 "content": comment.content,
#                 "created_at": comment.created_at,
#                 "recommend_count": comment.recommend.count(),
#             } for comment in article.comments.all()],
#             "comment_count": article.comments.count(),
#             "likey_count": article.likey.count(),
#         })
#
#     def put(self, request, article_pk):
#         article = get_object_or_404(Article, id=article_pk)
#         if article.author != request.user:
#             return Response(
#                 {"error": "작성자만 수정할 수 있습니다."},
#                 status=status.HTTP_403_FORBIDDEN
#             )
#         data = request.data.copy()
#         data["title"] = data.get("title", article.title)
#         data["article_type"] = data.get("article_type", article.article_type)
#         data["article_link"] = data.get("article_link", article.article_link)
#         data["content"] = data.get("content", article.content)
#         message = validate_article_data(data)
#         if message:
#             return Response(message, status=status.HTTP_400_BAD_REQUEST)
#         article.__dict__.update(**data)
#         article.save()
#         return Response(
#             {"message": "게시글이 수정되었습니다."},
#             status=status.HTTP_200_OK
#         )
#
#     def delete(self, request, article_pk):
#         article = get_object_or_404(Article, id=article_pk)
#         if article.author != request.user:
#             return Response(
#                 {"error": "작성자만 삭제할 수 있습니다."},
#                 status=status.HTTP_403_FORBIDDEN
#             )
#         article.delete()
#         return Response(
#             {"message": "게시글이 삭제되었습니다."},
#             status=status.HTTP_204_NO_CONTENT
#         )
