from django.urls import path
from . import views

urlpatterns = [
    path("", views.AccountAPIView.as_view()),
    path('<str:username>/', views.profile),
    path('validate/password/', views.validate_password),
    path('validate/username/', views.validate_username),
    path('validate/email/', views.validate_email),
]