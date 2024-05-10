from django.db import models
from config.settings import AUTH_USER_MODEL
from django.utils import timezone


class Article(models.Model):
    ARTICLE_TYPE_CHOICES = (
        ('news', 'News'),
        ('ask', 'Ask'),
        ('show', 'Show'),
    )
    title = models.CharField(max_length=100)
    article_type = models.CharField(max_length=10, choices=ARTICLE_TYPE_CHOICES, default='news')
    article_link = models.URLField(blank=True)
    content = models.TextField()
    author = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE)
    likey = models.ManyToManyField(AUTH_USER_MODEL, related_name='article_likey', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    points = models.IntegerField(default=0)
    views = models.IntegerField(default=0)
    
    def __str__(self):
        return self.title

    def calculate_points(self):
        views_weight = 1
        comments_weight = 5
        likes_weight = 3

        points = (self.comments.count() * comments_weight) + \
                 (self.likey.count() * likes_weight) + \
                 (self.views * views_weight)
        elapsed_hours = (timezone.now() - self.created_at).seconds // 3600
        points -= elapsed_hours
        
        self.points = points if points >= 0 else 0  # 포인트가 음수가 되지 않도록 처리
        self.save()

    def increase_views_point(self):
        self.views += 1
        self.calculate_points()

    def increase_likes_point(self):
        self.calculate_points()

    def increase_comments_point(self):
        self.calculate_points()

        
class Comment(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE)
    parent_comment = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    content = models.TextField()
    recommend = models.ManyToManyField(AUTH_USER_MODEL, related_name='comment_recommend', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_children(self):
        descendants = []
        for child in self.children.all():
            descendants.append(child)
        return descendants
