import re
from rest_framework import generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

from .models import Answer
from .serializers import AnswerSerializer
from questions.models import Question
from notifications.models import Notification  # Assuming you have a Notification model

User = get_user_model()

class AnswerListCreateView(generics.ListCreateAPIView):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        question = get_object_or_404(Question, id=self.kwargs['question_id'])
        answer = serializer.save(author=self.request.user, question=question)

        # Notify question author (if not self)
        if question.author != self.request.user:
            Notification.objects.create(
                recipient=question.author,
                message=f"{self.request.user.username} answered your question: '{question.title}'"
            )

        # Detect @mentions
        mentions = re.findall(r'@(\w+)', answer.description)
        mentioned_users = User.objects.filter(username__in=mentions)
        for user in mentioned_users:
            if user != self.request.user:
                Notification.objects.create(
                    recipient=user,
                    message=f"{self.request.user.username} mentioned you in an answer."
                )

class AnswerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upvote_answer(request, answer_id):
    answer = get_object_or_404(Answer, id=answer_id)
    answer.downvotes.remove(request.user)  # Remove downvote if exists
    answer.upvotes.add(request.user)
    return Response({'message': 'Answer upvoted', 'vote_score': answer.vote_score()})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def downvote_answer(request, answer_id):
    answer = get_object_or_404(Answer, id=answer_id)
    answer.upvotes.remove(request.user)  # Remove upvote if exists
    answer.downvotes.add(request.user)
    return Response({'message': 'Answer downvoted', 'vote_score': answer.vote_score()})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_answer(request, answer_id):
    answer = get_object_or_404(Answer, id=answer_id)
    question = answer.question

    if request.user != question.author:
        return Response({'error': 'Only the question author can accept an answer'}, status=403)

    # Unmark any previously accepted answers
    Answer.objects.filter(question=question, is_accepted=True).update(is_accepted=False)
    answer.is_accepted = True
    answer.save()

    question.is_solved = True
    question.save()

    return Response({'message': 'Answer accepted ✅'})
