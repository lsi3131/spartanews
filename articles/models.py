from django.db import models
from config.settings import AUTH_USER_MODEL


# Create your models here.
class Article(models.Model):
    ARTICLE_TYPE_CHOICES = (
        ('news', 'News'),
        ('ask', 'Ask'),
        ('show', 'Show'),
    )
    title = models.CharField(max_length=100)
    article_type = models.CharField(max_length=10, choices=ARTICLE_TYPE_CHOICES, default='news')
    article_link = models.URLField()
    content = models.TextField()
    author = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE)
    likey = models.ManyToManyField(AUTH_USER_MODEL, related_name='article_likey', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    # point 보류 ~


class Comment(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE)
    parent_comment = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    content = models.TextField()
    recommend = models.ManyToManyField(AUTH_USER_MODEL, related_name='comment_recommend', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
