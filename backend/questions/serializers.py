from rest_framework import serializers
from .models import Question, Tag

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class QuestionSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True)
    author = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'title', 'description', 'author', 'tags', 'is_solved', 'created_at', 'updated_at']

    def create(self, validated_data):
        tags_data = validated_data.pop('tags')
        question = Question.objects.create(**validated_data)
        for tag in tags_data:
            tag_obj, created = Tag.objects.get_or_create(name=tag['name'])
            question.tags.add(tag_obj)
        return question