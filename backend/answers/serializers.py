from rest_framework import serializers
from .models import Answer

class AnswerSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)
    vote_score = serializers.SerializerMethodField()

    class Meta:
        model = Answer
        fields = ['id', 'question', 'author', 'description', 'is_accepted', 'vote_score', 'created_at', 'updated_at']

    def get_vote_score(self, obj):
        return obj.vote_score()