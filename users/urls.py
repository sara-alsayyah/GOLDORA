from .views import (
    AddressAPIView,
    PasswordResetConfirmAPIView,
    PasswordResetRequestAPIView,
    ProfileAPIView,
    RegisterAPIView,
)
from django.urls import path

urlpatterns = [
    path('register/', RegisterAPIView.as_view()),
    path('profile/', ProfileAPIView.as_view()),
    path('addresses/', AddressAPIView.as_view()),
    path('password-reset/', PasswordResetRequestAPIView.as_view()),
    path('password-reset/confirm/', PasswordResetConfirmAPIView.as_view()),
]
