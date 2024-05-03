# Generated by Django 5.0.4 on 2024-05-03 09:03

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("articles", "0004_alter_article_likey_alter_comment_recommend"),
    ]

    operations = [
        migrations.AlterField(
            model_name="comment",
            name="article",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="comments",
                to="articles.article",
            ),
        ),
    ]