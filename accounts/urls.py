from django.urls import path
from . import views

urlpatterns = [
    path("", views.AccountAPIView.as_view()),
    path('<str:username>/', views.profile)
]