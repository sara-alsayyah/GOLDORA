from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem
from products.models import Product
from .serializers import CartItemSerializer


class AddToCartAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity')

        if not quantity or int(quantity) <= 0:
            return Response({"error": "Invalid quantity"}, status=400)

        quantity = int(quantity)

        product = get_object_or_404(Product, id=product_id)
        if quantity > product.stock:
            return Response({"error": "Requested quantity exceeds available stock"}, status=400)

        cart, created = Cart.objects.get_or_create(user=user)

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product
        )

        if not created:
            new_quantity = cart_item.quantity + quantity
            if new_quantity > product.stock:
                return Response({"error": "Requested quantity exceeds available stock"}, status=400)
            cart_item.quantity = new_quantity
        else:
            cart_item.quantity = quantity

        cart_item.save()

        return Response({"message": "Item added to cart"})
    
    
class CartAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        items = cart.items.all()

        serializer = CartItemSerializer(items, many=True)
        return Response(serializer.data)
    

class UpdateCartItemAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, item_id):
        cart = Cart.objects.get(user=request.user)
        item = get_object_or_404(CartItem, id=item_id, cart=cart)

        quantity = int(request.data.get('quantity'))
        if quantity <= 0:
            return Response({"error": "Quantity must be at least 1"}, status=400)
        if quantity > item.product.stock:
            return Response({"error": "Requested quantity exceeds available stock"}, status=400)

        item.quantity = quantity
        item.save()

        return Response({"message": "Cart updated"})
    


class RemoveCartItemAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, item_id):
        cart = Cart.objects.get(user=request.user)
        item = get_object_or_404(CartItem, id=item_id, cart=cart)

        item.delete()

        return Response({"message": "Item removed"})
