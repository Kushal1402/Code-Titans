from django.db import models
from accounts.models import User
from questions.models import Question

class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='answers')
    description = models.TextField()
    is_accepted = models.BooleanField(default=False)
    upvotes = models.ManyToManyField(User, related_name='answer_upvotes', blank=True)
    downvotes = models.ManyToManyField(User, related_name='answer_downvotes', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def vote_score(self):
        return self.upvotes.count() - self.downvotes.count()

    def __str__(self):
        return print("Answer to" ,self.question.title," by" ,self.author.username)