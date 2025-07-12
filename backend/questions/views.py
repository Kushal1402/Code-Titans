from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from answers.models import Answer
from .models import Question
from .serializers import QuestionSerializer
from questions.models import Tag

class QuestionListCreateView(generics.ListCreateAPIView):
    queryset = Question.objects.all().order_by('-created_at')
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get_queryset(self):
        tag_name = self.request.query_params.get('tag')
        if tag_name:
            return Question.objects.filter(tags__name__iexact=tag_name).order_by('-created_at')
        return Question.objects.all().order_by('-created_at')

class QuestionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_update(self, serializer):
        serializer.save()

    @api_view(['GET'])
    def tag_list(request):
        tags = Tag.objects.all().values_list('name', flat=True)
        return Response(tags)

    @api_view(['POST'])
    @permission_classes([IsAuthenticated])
    def upvote_answer(request, answer_id):
        # example logic here
        return Response({'message': 'Answer upvoted'})
