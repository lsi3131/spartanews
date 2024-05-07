from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    introduce = models.TextField()
    point = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username
    
    
