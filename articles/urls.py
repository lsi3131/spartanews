from django.urls import path
from . import views

app_name = 'articles'

urlpatterns = [
    path("/api/articles/<int:article_pk>/comments/<int:comment_pk>/", views.CommentDetailAPIView.as_view(),
         name='comment_detail'),
]
