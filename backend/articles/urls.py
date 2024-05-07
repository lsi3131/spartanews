from django.urls import path
from . import views

urlpatterns = [
    path("", views.ArticleAPIView.as_view()),
    path("<int:article_pk>/likey/", views.LikeyArticleAPIView.as_view()),
    path("<int:article_pk>/", views.ArticleDetailAPIView.as_view()),
    path("<int:article_pk>/comments/<int:comment_pk>/recommand/",views.RecommendAPIView.as_view()),
    path("line_up/", views.ArticleLineUpAPIView.as_view()),
]