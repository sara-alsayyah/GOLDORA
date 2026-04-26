from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

from products.models import Category, Product
from orders.models import Coupon


class Command(BaseCommand):
    help = "Seed sample categories, products, and a demo customer."

    def handle(self, *args, **options):
        categories = [
            ("Women", "women"),
            ("Beauty", "beauty"),
            ("Bags", "bags"),
            ("Shoes", "shoes"),
            ("Home", "home"),
            ("Jewelry", "jewelry"),
        ]

        for name, slug in categories:
            Category.objects.get_or_create(name=name, slug=slug)

        sample_products = [
            ("Satin Evening Dress", "women", "A fluid silhouette with a polished luxury finish.", 89.99, 16),
            ("Golden Veil Serum", "beauty", "A luminous daily serum designed for a soft glow.", 24.99, 32),
            ("Structured Mini Bag", "bags", "Compact profile with elevated hardware details.", 54.99, 14),
            ("Leather Court Heel", "shoes", "A sleek neutral heel for formal and daily styling.", 64.99, 11),
            ("Marble Scent Candle", "home", "A warm home accent with boutique-inspired fragrance.", 18.99, 25),
            ("Layered Chain Set", "jewelry", "Soft gold plating with modern everyday styling.", 19.99, 40),
        ]

        for name, category_slug, description, price, stock in sample_products:
            category = Category.objects.get(slug=category_slug)
            Product.objects.get_or_create(
                name=name,
                defaults={
                    "description": description,
                    "price": price,
                    "stock": stock,
                    "category": category,
                },
            )

        Coupon.objects.get_or_create(code="WELCOME10", defaults={"discount_percent": 10, "active": True})

        User = get_user_model()
        if not User.objects.filter(email="demo@example.com").exists():
            User.objects.create_user(
                email="demo@example.com",
                password="DemoPass123!",
                first_name="Demo",
                last_name="Customer",
            )

        self.stdout.write(self.style.SUCCESS("Store seed data created successfully."))
