from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from ..models import *
import json

User = get_user_model()


# Create your tests here.
class CommentAPIViewTestCase(TestCase):
    def get_token(self, username, password):
        url = reverse('login')
        put_data = {
            "username": f"{username}",
            "password": f"{password}"
        }
        response = self.client.post(url, data=json.dumps(put_data), content_type='application/json')
        access = response.data['access']
        return access

    def login_as_user(self):
        self.password = 'password'
        self.user = User.objects.create_user(username='user', password=self.password)
        self.article_link = 'https://github.com/leftmove/cria'

    def test_create_child_comments_and_get_children(self):
        self.login_as_user()
        article = Article.objects.create(title='title', article_type='news', article_link=self.article_link,
                                         content='content', author=self.user)

        comment_root = Comment.objects.create(article=article, content='comment root', author=self.user)
        comment_child1 = Comment.objects.create(article=article, content='comment child1', parent_comment=comment_root,
                                                author=self.user)
        comment_child2 = Comment.objects.create(article=article, content='comment child2', parent_comment=comment_root,
                                                author=self.user)

        Comment.objects.create(article=article, content='comment grand child1',
                               parent_comment=comment_child1, author=self.user)
        Comment.objects.create(article=article, content='comment grand child2',
                               parent_comment=comment_child1, author=self.user)

        children = comment_root.get_children()
        self.assertEqual(2, len(children))
        self.assertEqual(2, len(comment_child1.get_children()))
        self.assertEqual(0, len(comment_child2.get_children()))

    def test_get_view(self):
        self.login_as_user()
        article = Article.objects.create(title='title', article_type='news', article_link=self.article_link,
                                         content='content', author=self.user)

        comment = Comment.objects.create(article=article, content='comment', author=self.user)

        comment.recommend.add(self.user)
        url = reverse('articles:comment_detail', args=[article.id, comment.id])

        response = self.client.get(url, content_type='application/json')
        data = response.data
        # {'id': 1, 'content': 'comment', 'created_at': '2024-05-05T07:53:50.267831Z', 'updated_at': '2024-05-05T07:53:50.267839Z', 'article': 1, 'parent_comment': None, 'recommend': [1]}
        print(data)
        self.assertEqual(comment.id, data['id'])
        self.assertEqual(comment.content, data['content'])
        self.assertEqual(comment.article_id, data['article'])
        self.assertEqual(comment.parent_comment, data['parent_comment'])

    def test_put_view(self):
        self.login_as_user()
        token = self.get_token(self.user.username, self.password)
        article = Article.objects.create(title='title', article_type='news', article_link=self.article_link,
                                         content='content', author=self.user)

        comment = Comment.objects.create(article=article, content='comment', author=self.user)

        url = reverse('articles:comment_detail', args=[article.id, comment.id])
        headers = {
            "Authorization": f"Token {token}",
            "Content-Type": "application/json",
        }
        put_data = {
            "content": "",
        }

        # 데이터가 비어있을 경우 403 반환
        response = self.client.put(url, data=json.dumps(put_data), headers=headers)
        self.assertEqual(status.HTTP_403_FORBIDDEN, response.status_code)

        # 데이터가 비어있을 경우
        put_data['content'] = 'new_content'
        response = self.client.put(url, data=json.dumps(put_data), headers=headers)
        print(response.data)
        self.assertEqual(status.HTTP_200_OK, response.status_code)

    def test_login(self):
        username = 'user1'
        password = 'password'
        User.objects.create_user(username='user1', password=password)
        token = self.get_token(username, password)
        print(token)
