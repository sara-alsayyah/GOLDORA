from rest_framework.views import APIView
from rest_framework.response import Response
from .models import ContactMessage
from .serializers import ContactSerializer

class ContactAPIView(APIView):
    def post(self, request):
        serializer = ContactSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Message sent successfully"})

        return Response(serializer.errors, status=400)