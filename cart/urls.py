from django.urls import path
from .views import AddToCartAPIView, CartAPIView, UpdateCartItemAPIView, RemoveCartItemAPIView

urlpatterns = [
    path('add/', AddToCartAPIView.as_view()),
     path('', CartAPIView.as_view()), 
     path('update/<int:item_id>/', UpdateCartItemAPIView.as_view()),
     path('remove/<int:item_id>/', RemoveCartItemAPIView.as_view()),
]