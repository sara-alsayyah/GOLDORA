from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import generics
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.db.models import Sum, F
from django.db.models.functions import TruncDay
from django.db import transaction

from cart.models import Cart
from .models import Order, OrderItem, Coupon
from .serializers import OrderSerializer
from users.models import Address


class CheckoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        try:
            cart = Cart.objects.get(user=user)
        except Cart.DoesNotExist:
            return Response({"error": "Cart is empty"}, status=400)

        cart_items = cart.items.all()

        if not cart_items.exists():
            return Response({"error": "Cart is empty"}, status=400)

        with transaction.atomic(): 

            total_price = 0

    
            for item in cart_items:
                if item.quantity > item.product.stock:
                    return Response(
                        {"error": f"Not enough stock for {item.product.name}"},
                        status=400
                    )

                total_price += item.product.price * item.quantity

      
            coupon_code = request.data.get('coupon')
            if coupon_code:
                try:
                    coupon = Coupon.objects.get(code=coupon_code, active=True)
                    discount = (coupon.discount_percent / 100) * total_price
                    total_price -= discount
                except Coupon.DoesNotExist:
                    return Response({"error": "Invalid coupon"}, status=400)

    
            address_id = request.data.get('address_id')
            address = get_object_or_404(Address, id=address_id, user=user)

           
            order = Order.objects.create(
                user=user,
                total_price=total_price,
                address=address,
                payment_method=request.data.get('payment_method', 'cod')
            )


            for item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    quantity=item.quantity,
                    price=item.product.price
                )

                item.product.stock -= item.quantity
                item.product.save()

            cart_items.delete()


        send_mail(
            subject='Order Confirmation',
            message=f'Hi {user.email}, your order has been placed successfully!',
            from_email='noreply@glowygirls.com',
            recipient_list=[user.email],
            fail_silently=True,
        )

        return Response({"message": "Order placed successfully"})
    


class UserOrdersAPIView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')


class OrderDetailAPIView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer
    lookup_field = 'id'

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    


class AnalyticsAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        total_sales = Order.objects.aggregate(total=Sum('total_price'))['total'] or 0
        total_orders = Order.objects.count()

        top_products = (
            OrderItem.objects
            .values(name=F('product__name'))
            .annotate(total_sold=Sum('quantity'))
            .order_by('-total_sold')[:5]
        )

        sales_over_time = (
            Order.objects
            .annotate(day=TruncDay('created_at'))
            .values('day')
            .annotate(total=Sum('total_price'))
            .order_by('day')
        )

        return Response({
            "total_sales": total_sales,
            "total_orders": total_orders,
            "top_products": list(top_products),
            "sales_over_time": list(sales_over_time)
        })
