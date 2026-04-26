from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Product
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import ProductSerializer, WishlistItemSerializer, ReviewSerializer, ReviewCreateSerializer
from .models import Wishlist, WishlistItem, Product, Review

class ProductListAPIView(generics.ListAPIView):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    filterset_fields = ['category__slug']

    search_fields = ['name', 'description']

    ordering_fields = ['price', 'created_at']

    def get_queryset(self):
        queryset = super().get_queryset()

        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')

        if min_price:
            queryset = queryset.filter(price__gte=min_price)

        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        in_stock = self.request.query_params.get('in_stock')
        if in_stock in ['true', '1', 'True']:
            queryset = queryset.filter(stock__gt=0)
        elif in_stock in ['false', '0', 'False']:
            queryset = queryset.filter(stock__lte=0)

        return queryset

class ProductDetailAPIView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'



class AddToWishlistAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id')
        product = get_object_or_404(Product, id=product_id)

        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)

        WishlistItem.objects.get_or_create(
            wishlist=wishlist,
            product=product
        )

        return Response({"message": "Added to wishlist"})
    

class WishlistAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        items = wishlist.items.all()

        serializer = WishlistItemSerializer(items, many=True)
        return Response(serializer.data)


class RemoveFromWishlistAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, product_id):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        item = get_object_or_404(WishlistItem, wishlist=wishlist, product_id=product_id)
        item.delete()
        return Response({"message": "Removed from wishlist"})

class AddReviewAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, product_id):
        product = get_object_or_404(Product, id=product_id)
        serializer = ReviewCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        existing_review = Review.objects.filter(
            user=request.user,
            product=product
        ).first()

        if existing_review:
           return Response({"error": "You already reviewed this product"}, status=400)

        Review.objects.create(
            user=request.user,
            product=product,
            rating=serializer.validated_data['rating'],
            comment=serializer.validated_data.get('comment', '')
        )

        return Response({"message": "Review added"})
    
class ProductReviewsAPIView(APIView):
    def get(self, request, product_id):
        product = get_object_or_404(Product, id=product_id)

        reviews = product.reviews.all().order_by('-created_at')

        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)
