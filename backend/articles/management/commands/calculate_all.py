from django.core.management.base import BaseCommand, CommandError
from articles.models import Article


class Command(BaseCommand):
    help = "Closes the specified poll for voting"

    def handle(self, *args, **options):
        articles = Article.objects.all()
        for a in articles:
            a.calculate_points()