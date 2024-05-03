from django.urls import path
from . import views
from .views import ArticleCommentsAPIView

urlpatterns = [
    path("", views.ArticleAPIView.as_view()),
    path('articles/<int:article_pk>/comments/', ArticleCommentsAPIView.as_view(), name='article-comments'),
    path('articles/<int:article_pk>/comments/', views.create_comment),
]
