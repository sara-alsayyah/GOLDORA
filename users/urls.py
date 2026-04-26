from .views import ProfileAPIView, AddressAPIView, RegisterAPIView
from django.urls import path

urlpatterns = [
    path('register/', RegisterAPIView.as_view()),
    path('profile/', ProfileAPIView.as_view()),
    path('addresses/', AddressAPIView.as_view()),
]
