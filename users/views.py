from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes
from users.serializers import (
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    RegisterSerializer,
    UserSerializer,
)
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


class PasswordResetRequestAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        user = get_user_model().objects.filter(email=email).first()

        if user:
          uid = urlsafe_base64_encode(force_bytes(user.pk))
          token = default_token_generator.make_token(user)
          reset_link = f"{settings.FRONTEND_BASE_URL}/reset-password?uid={uid}&token={token}"
          send_mail(
              subject="Reset your GOLDORA password",
              message=(
                  f"Hello {user.first_name or user.email},\n\n"
                  f"Use the link below to reset your password:\n{reset_link}\n\n"
                  "If you did not request this, you can ignore this email."
              ),
              from_email=settings.DEFAULT_FROM_EMAIL,
              recipient_list=[user.email],
              fail_silently=True,
          )

        return Response(
            {"message": "If an account with that email exists, a reset link has been sent."},
            status=status.HTTP_200_OK,
        )


class PasswordResetConfirmAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        uid = serializer.validated_data["uid"]
        token = serializer.validated_data["token"]
        new_password = serializer.validated_data["new_password"]

        try:
            user_id = urlsafe_base64_decode(uid).decode()
            user = get_user_model().objects.get(pk=user_id)
        except Exception:
            return Response({"error": "Invalid reset link."}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "Reset link is invalid or expired."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save(update_fields=["password"])

        return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)
