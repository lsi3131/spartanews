from django.test import TestCase
from ..models import *
from django.contrib.auth import get_user_model

User = get_user_model()


# Create your tests here.
class CommentAPIViewTestCase(TestCase):
    def login_as_user(self):
        self.user = User.objects.create_user(username='user', password='password')

    def test_create_comment(self):
        self.login_as_user()
        article_link = 'https://github.com/leftmove/cria'
        article = Article.objects.create(title='title', article_type='news', article_link=article_link,
                                         content='content', author=self.user)

        comment1 = Comment.objects.create(article=article, content='comment1')
        comment2 = Comment.objects.create(article=article, content='comment1')

        # Comment.objects.create()
        # self.user = User.objects.create_user(username='testuser', password='password')
        # self.client.force_authenticate(user=self.user)
