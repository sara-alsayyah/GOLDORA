from django.contrib import admin
from .models import Category, Product, Wishlist, WishlistItem, Review

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'stock', 'low_stock_flag', 'created_at')
    list_filter = ('category',)
    search_fields = ('name', 'description', 'slug')
    prepopulated_fields = {'slug': ('name',)}

    def low_stock_flag(self, obj):
        return "Low stock" if obj.stock <= 5 else "Healthy"

    low_stock_flag.short_description = "Inventory"


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user',)


@admin.register(WishlistItem)
class WishlistItemAdmin(admin.ModelAdmin):
    list_display = ('wishlist', 'product')
    search_fields = ('product__name', 'wishlist__user__email')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'user', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
