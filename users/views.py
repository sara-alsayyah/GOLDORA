from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from users.serializers import RegisterSerializer, UserSerializer
from .models import Address

class RegisterAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Account created successfully"}, status=status.HTTP_201_CREATED)

class AddressAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        addresses = request.user.addresses.all()
        data = [{
            "id": a.id,
            "full_name": a.full_name,
            "city": a.city,
            "street": a.street
        } for a in addresses]

        return Response(data)

    def post(self, request):
        required_fields = ['full_name', 'phone', 'city', 'street']
        missing_fields = [field for field in required_fields if not request.data.get(field)]
        if missing_fields:
            return Response({"error": f"Missing fields: {', '.join(missing_fields)}"}, status=400)

        address = Address.objects.create(
            user=request.user,
            full_name=request.data.get('full_name'),
            phone=request.data.get('phone'),
            city=request.data.get('city'),
            street=request.data.get('street')
        )

        return Response({"message": "Address created"})
    
class ProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
