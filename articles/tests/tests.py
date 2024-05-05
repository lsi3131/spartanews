from django.test import TestCase
from ..models import *
from django.contrib.auth import get_user_model
from django.urls import reverse
import json

User = get_user_model()


# Create your tests here.
class CommentAPIViewTestCase(TestCase):
    def login_as_user(self):
        self.user = User.objects.create_user(username='user', password='password')
        self.article_link = 'https://github.com/leftmove/cria'

    def test_create_child_comments_and_get_children(self):
        self.login_as_user()
        article = Article.objects.create(title='title', article_type='news', article_link=self.article_link,
                                         content='content', author=self.user)

        comment_root = Comment.objects.create(article=article, content='comment root')
        comment_child1 = Comment.objects.create(article=article, content='comment child1', parent_comment=comment_root)
        comment_child2 = Comment.objects.create(article=article, content='comment child2', parent_comment=comment_root)

        Comment.objects.create(article=article, content='comment grand child1',
                               parent_comment=comment_child1)
        Comment.objects.create(article=article, content='comment grand child2',
                               parent_comment=comment_child1)

        children = comment_root.get_children()
        self.assertEqual(2, len(children))
        self.assertEqual(2, len(comment_child1.get_children()))
        self.assertEqual(0, len(comment_child2.get_children()))

    def test_get_view(self):
        self.login_as_user()
        article = Article.objects.create(title='title', article_type='news', article_link=self.article_link,
                                         content='content', author=self.user)

        comment = Comment.objects.create(article=article, content='comment')
        url = reverse('articles:comment_detail', args=[article.id, comment.id])

        response = self.client.get(url, content_type='application/json')
        self.assertEqual('comment', response.data['content'])
