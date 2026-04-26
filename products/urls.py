from django.urls import path
from .views import ProductListAPIView, ProductDetailAPIView, AddToWishlistAPIView, WishlistAPIView, RemoveFromWishlistAPIView, ProductReviewsAPIView, AddReviewAPIView


urlpatterns = [
    path('', ProductListAPIView.as_view(), name='product-list'),
    path('wishlist/', WishlistAPIView.as_view()),
    path('wishlist/add/', AddToWishlistAPIView.as_view()),
    path('wishlist/remove/<int:product_id>/', RemoveFromWishlistAPIView.as_view()),
    path('<int:product_id>/reviews/', ProductReviewsAPIView.as_view()),
    path('<int:product_id>/reviews/add/', AddReviewAPIView.as_view()),
    path('<slug:slug>/', ProductDetailAPIView.as_view(), name='product-detail'),
]
