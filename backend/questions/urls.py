from django.urls import path
from .views import QuestionListCreateView, QuestionDetailView, tag_list

urlpatterns = [
    path('', QuestionListCreateView.as_view(), name='question-list-create'),
    path('<int:pk>/', QuestionDetailView.as_view(), name='question-detail'),
    path('tags/', tag_list, name='tag-list'),
]
