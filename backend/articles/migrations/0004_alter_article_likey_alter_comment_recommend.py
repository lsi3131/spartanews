# Generated by Django 5.0.4 on 2024-05-03 08:47

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("articles", "0003_comment_author"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name="article",
            name="likey",
            field=models.ManyToManyField(
                blank=True, related_name="article_likey", to=settings.AUTH_USER_MODEL
            ),
        ),
        migrations.AlterField(
            model_name="comment",
            name="recommend",
            field=models.ManyToManyField(
                blank=True,
                related_name="comment_recommend",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
