# Generated by Django 5.0.4 on 2024-05-03 09:31

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("articles", "0005_alter_comment_article"),
    ]

    operations = [
        migrations.AlterField(
            model_name="article",
            name="article_link",
            field=models.URLField(blank=True),
        ),
    ]
