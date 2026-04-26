from django.urls import path
from .views import CheckoutAPIView, UserOrdersAPIView, OrderDetailAPIView, AnalyticsAPIView

urlpatterns = [
    path('checkout/', CheckoutAPIView.as_view()),
    path('', UserOrdersAPIView.as_view()),  
    path('<int:id>/', OrderDetailAPIView.as_view()),
    path('analytics/', AnalyticsAPIView.as_view()),
]



