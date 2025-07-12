from django.urls import path
from .views import (AnswerListCreateView, AnswerDetailView, upvote_answer, downvote_answer, accept_answer)

urlpatterns = [    
    path('', AnswerListCreateView.as_view(), name='answer-list'),
    path('<int:pk>/', AnswerDetailView.as_view(), name='answer-detail'),
    path('<int:answer_id>/upvote/', upvote_answer, name='upvote-answer'),
    path('<int:answer_id>/downvote/', downvote_answer, name='downvote-answer'),
    path('<int:answer_id>/accept/', accept_answer, name='accept-answer'),
]